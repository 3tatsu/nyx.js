import type { ApiVersions, ApplicationStructure, Integer, UnavailableGuildStructure, UserStructure } from "@nyxjs/core";

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#ready-ready-event-fields}
 */
export type ReadyEventFields = {
    /**
     * Contains id and flags
     */
    application: Pick<ApplicationStructure, "flags" | "id">;
    /**
     * Guilds the user is in
     */
    guilds: UnavailableGuildStructure[];
    /**
     * Gateway URL for resuming connections
     */
    resume_gateway_url: string;
    /**
     * Used for resuming connections
     */
    session_id: string;
    /**
     * Shard information associated with this session, if sent when identifying
     */
    shard?: [shard_id: Integer, num_shards: Integer];
    /**
     * Information about the user including email
     */
    user: UserStructure;
    /**
     * API version
     */
    v: ApiVersions;
};
