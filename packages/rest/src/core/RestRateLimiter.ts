import { setTimeout } from "node:timers/promises";
import type { DiscordHeaders, Float, HttpResponseCodes, Integer } from "@nyxjs/core";

/**
 * @see {@link https://discord.com/developers/docs/topics/rate-limits#exceeding-a-rate-limit-rate-limit-response-structure|Rate Limit Response Structure}
 */
type RateLimitResponseStructure = {
    /**
     * An error code for some limits
     */
    code?: HttpResponseCodes;
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

export class RestRateLimiter {
    private globalRateLimit: number | null;

    private readonly routeRateLimits: Map<string, RateLimitInfo>;

    public constructor() {
        this.globalRateLimit = null;
        this.routeRateLimits = new Map();
    }

    public async wait(path: string): Promise<void> {
        const now = Date.now();
        if (this.globalRateLimit && this.globalRateLimit > now) {
            await setTimeout(this.globalRateLimit - now);
        }

        const routeLimit = this.routeRateLimits.get(path);
        if (routeLimit && routeLimit.remaining <= 0 && routeLimit.reset > now) {
            await setTimeout(routeLimit.reset - now);
        }
    }

    public handleRateLimit(path: string, headers: DiscordHeaders): void {
        const { limit, remaining, reset, resetAfter, bucket } = this.parseHeaders(headers);

        this.routeRateLimits.set(path, { limit, remaining, reset, resetAfter, bucket });

        if (headers["X-RateLimit-Global"]) {
            this.globalRateLimit = Date.now() + resetAfter;
        }
    }

    public async handleRateLimitResponse(response: RateLimitResponseStructure): Promise<void> {
        if (response.global) {
            this.globalRateLimit = Date.now() + response.retry_after * 1_000;
        }

        await setTimeout(response.retry_after * 1_000);
    }

    private parseHeaders(headers: DiscordHeaders): RateLimitInfo {
        return {
            limit: Number.parseInt(headers["X-RateLimit-Limit"] ?? "0", 10),
            remaining: Number.parseInt(headers["X-RateLimit-Remaining"] ?? "0", 10),
            reset: Number.parseInt(headers["X-RateLimit-Reset"] ?? "0", 10) * 1_000,
            resetAfter: Number.parseFloat(headers["X-RateLimit-Reset-After"] ?? "0") * 1_000,
            bucket: headers["X-RateLimit-Bucket"] ?? "",
        };
    }
}