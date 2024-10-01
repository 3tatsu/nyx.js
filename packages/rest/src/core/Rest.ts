import { Buffer } from "node:buffer";
import { setTimeout } from "node:timers/promises";
import type { ApiVersions, Float, Integer } from "@nyxjs/core";
import { MimeTypes, RestHttpResponseCodes, RestJsonErrorCodes } from "@nyxjs/core";
import { Store } from "@nyxjs/store";
import { Gunzip } from "minizlib";
import type { Dispatcher, RetryHandler } from "undici";
import { Pool, RetryAgent } from "undici";
import type { AuthTypes, RestRequestOptions } from "../types";

/**
 * @see {@link https://discord.com/developers/docs/topics/rate-limits#exceeding-a-rate-limit-rate-limit-response-structure|Rate Limit Response Structure}
 */
type RateLimitResponseStructure = {
    /**
     * An error code for some limits
     */
    code?: RestHttpResponseCodes;
    /**
     * A value indicating if you are being globally rate limited or not
     */
    global: boolean;
    /**
     * A message saying you are being rate limited.
     */
    message: string;
    /**
     * The number of seconds to wait before submitting another request.
     */
    retry_after: Float;
};

type RateLimitInfo = {
    /**
     * The maximum number of requests that can be made in a given time frame.
     */
    bucket: string;
    /**
     * The number of requests remaining in the current time frame.
     */
    limit: Integer;
    /**
     * The time at which the current time frame resets.
     */
    remaining: Integer;
    /**
     * The time at which the current time frame resets.
     */
    reset: Integer;
    /**
     * The time in milliseconds after which the current time frame resets.
     */
    resetAfter: Integer;
};

export type RestOptions = {
    /**
     * The type of authentication to use.
     */
    auth_type: AuthTypes;
    /**
     * The time-to-live (in milliseconds) of the cache.
     */
    cache_life_time?: Integer;
    /**
     * The user agent to use.
     */
    user_agent?: string;
    /**
     * The version of the API to use.
     */
    version: ApiVersions;
};

export class Rest {
    #globalRateLimit: number | null = null;

    readonly #token: string;

    readonly #store: Store<string, { data: any; expiry: number }>;

    readonly #routeRateLimits: Store<string, RateLimitInfo>;

    readonly #pool: Pool;

    readonly #retryAgent: RetryAgent;

    readonly #options: RestOptions;

    public constructor(token: string, options: RestOptions) {
        this.#token = token;
        this.#store = new Store();
        this.#routeRateLimits = new Store();
        this.#pool = this.initializePool();
        this.#retryAgent = this.initializeRetryAgent();
        this.#options = Object.freeze({ ...options });
    }

    public async destroy(): Promise<void> {
        try {
            await this.#pool.destroy();
            this.#store.clear();
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }

            throw new Error(String(error));
        }
    }

    public async request<T>(request: RestRequestOptions<T>): Promise<T> {
        try {
            const cacheKey = `${request.method}:${request.path}`;

            if (!request.disable_cache) {
                const cachedResponse = this.#store.get(cacheKey);
                if (cachedResponse && cachedResponse.expiry > Date.now()) {
                    return cachedResponse.data as T;
                }
            }

            await this.wait(request.path);

            const path = `/api/v${this.#options.version}${request.path}`;
            const response = await this.#retryAgent.request({
                ...request,
                path,
                headers: this.initializeHeaders(request.headers as Record<string, string>),
            });

            this.handleRateLimit(request.path, response.headers as Record<string, string>);

            const responseText = await this.decompressResponse(response.headers, response.body);
            const data = JSON.parse(responseText);

            if (response.statusCode === RestHttpResponseCodes.TooManyRequests) {
                await this.handleRateLimitResponse(data);
                return await this.request(request);
            }

            if (response.statusCode >= 200 && response.statusCode < 300 && !request.disable_cache) {
                this.#store.set(cacheKey, {
                    data,
                    expiry: Date.now() + (this.#options.cache_life_time ?? 60_000),
                });
            }

            if (response.statusCode >= 400) {
                throw new Error(JSON.stringify(data));
            }

            return data as T;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }

            throw new Error(String(error));
        }
    }

    private async decompressResponse(
        headers: Record<string, any>,
        body: Dispatcher.ResponseData["body"]
    ): Promise<string> {
        const responseBuffer = await body.arrayBuffer();

        if (headers["content-encoding"] === "gzip") {
            return new Promise((resolve, reject) => {
                const gunzip = new Gunzip({ level: 9 });
                const chunks: Buffer[] = [];

                gunzip.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
                gunzip.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
                gunzip.on("error", reject);
                gunzip.end(Buffer.from(responseBuffer));
            });
        }

        return Buffer.from(responseBuffer).toString("utf8");
    }

    private initializePool(): Pool {
        const poolOptions: Pool.Options = {
            connections: 10,
            pipelining: 6,
            keepAliveTimeout: 20_000,
            keepAliveMaxTimeout: 30_000,
            connect: { timeout: 30_000 },
            allowH2: true,
        };

        return new Pool("https://discord.com", poolOptions);
    }

    private initializeRetryAgent(): RetryAgent {
        if (!this.#pool) {
            throw new Error("[REST] Pool not initialized");
        }

        const retryAgentOptions: RetryHandler.RetryOptions = {
            retryAfter: true,
            minTimeout: 500,
            maxTimeout: 10_000,
            timeoutFactor: 2,
            methods: ["GET", "DELETE", "PUT", "PATCH", "POST"],
            statusCodes: Object.values(RestHttpResponseCodes).map(Number),
            errorCodes: Object.values(RestJsonErrorCodes).map(String),
        };

        return new RetryAgent(this.#pool, retryAgentOptions);
    }

    private initializeHeaders(additionalHeaders?: Record<string, string>): Readonly<Record<string, string>> {
        const headers: Record<string, string> = {
            Authorization: `${this.#options.auth_type} ${this.#token}`,
            "Content-Type": MimeTypes.Json,
            "Accept-Encoding": "gzip, deflate",
        };

        if (this.#options.user_agent) {
            headers["User-Agent"] = this.#options.user_agent;
        }

        if (additionalHeaders) {
            Object.assign(headers, additionalHeaders);
        }

        return Object.freeze(headers);
    }

    private async wait(path: string): Promise<void> {
        const now = Date.now();
        if (this.#globalRateLimit && this.#globalRateLimit > now) {
            await setTimeout(this.#globalRateLimit - now);
        }

        const routeLimit = this.#routeRateLimits.get(path);
        if (routeLimit && routeLimit.remaining <= 0 && routeLimit.reset > now) {
            await setTimeout(routeLimit.reset - now);
        }
    }

    private handleRateLimit(path: string, headers: Record<string, string>): void {
        const rateLimitInfo = this.parseHeaders(headers);
        this.#routeRateLimits.set(path, rateLimitInfo);

        if (headers["X-RateLimit-Global"]) {
            this.#globalRateLimit = Date.now() + rateLimitInfo.resetAfter;
        }
    }

    private async handleRateLimitResponse(response: RateLimitResponseStructure): Promise<void> {
        if (response.global) {
            this.#globalRateLimit = Date.now() + response.retry_after * 1_000;
        }

        await setTimeout(response.retry_after * 1_000);

        throw new Error(`[REST] Rate limited: ${response.message}`);
    }

    private parseHeaders(headers: Record<string, string>): RateLimitInfo {
        return Object.freeze({
            limit: Number.parseInt(headers["X-RateLimit-Limit"] ?? "0", 10),
            remaining: Number.parseInt(headers["X-RateLimit-Remaining"] ?? "0", 10),
            reset: Number.parseInt(headers["X-RateLimit-Reset"] ?? "0", 10) * 1_000,
            resetAfter: Number.parseFloat(headers["X-RateLimit-Reset-After"] ?? "0") * 1_000,
            bucket: headers["X-RateLimit-Bucket"] ?? "",
        });
    }
}
