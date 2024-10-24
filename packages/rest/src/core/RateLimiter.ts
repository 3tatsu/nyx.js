import type { RestHttpDiscordHeaders } from "../types";

/**
 * Represents a rate limiter bucket.
 */
type RateLimiterBucket = {
    /**
     * The maximum number of requests that can be made in a given time period.
     */
    limit: number;
    /**
     * The number of remaining requests that can be made in the current time period.
     */
    remaining: number;
    /**
     * The time at which the rate limit resets, in milliseconds since the Unix epoch.
     */
    reset: number;
};

export class RateLimiter {
    #buckets: Map<string, RateLimiterBucket> = new Map();

    async wait(bucket: string): Promise<void> {
        const rateLimitInfo = this.#buckets.get(bucket);
        if (rateLimitInfo && rateLimitInfo.remaining <= 0) {
            const now = Date.now();
            const timeToWait = rateLimitInfo.reset - now;
            if (timeToWait > 0) {
                await new Promise((resolve) => {
                    setTimeout(resolve, timeToWait);
                });
            }
        }
    }

    update(bucket: string, headers: RestHttpDiscordHeaders): void {
        this.#buckets.set(bucket, {
            limit: Number(headers["x-ratelimit-limit"]),
            remaining: Number(headers["x-ratelimit-remaining"]),
            reset: Number(headers["x-ratelimit-reset"]) * 1_000,
        });
    }
}
