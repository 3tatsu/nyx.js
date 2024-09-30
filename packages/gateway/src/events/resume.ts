import type { Integer } from "@nyxjs/core";

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#resume-resume-structure}
 */
export type ResumeStructure = {
    /**
     * Last sequence number received
     */
    seq: Integer;
    /**
     * Session ID
     */
    session_id: string;
    /**
     * Session token
     */
    token: string;
};
