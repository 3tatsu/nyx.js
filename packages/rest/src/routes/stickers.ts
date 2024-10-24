import type { Snowflake, StickerPackStructure, StickerStructure } from "@nyxjs/core";
import { FileUpload } from "../core";
import { RestMethods, type RouteStructure } from "../types";

/**
 * @see {@link https://discord.com/developers/docs/resources/sticker#modify-guild-sticker-json-params|Modify Guild Sticker JSON Params}
 */
export type ModifyGuildStickerJsonParams = Partial<Pick<StickerStructure, "description" | "name" | "tags">>;

/**
 * @see {@link https://discord.com/developers/docs/resources/sticker#create-guild-sticker-form-params|Create Guild Sticker Form Params}
 */
export type CreateGuildStickerFormParams = Pick<StickerStructure, "description" | "name" | "tags"> & {
    /**
     * The sticker file to upload, must be a PNG, APNG, GIF, or Lottie JSON file, max 512 KiB
     */
    file: string;
};

export class StickerRoutes {
    /**
     * @see {@link https://discord.com/developers/docs/resources/sticker#delete-guild-sticker|Delete Guild Sticker}
     */
    static deleteGuildSticker(guildId: Snowflake, stickerId: Snowflake, reason?: string): RouteStructure<void> {
        const headers: Record<string, string> = {};

        if (reason) {
            headers["X-Audit-Log-Reason"] = reason;
        }

        return {
            method: RestMethods.Delete,
            path: `/guilds/${guildId}/stickers/${stickerId}`,
            headers,
        };
    }

    /**
     * @see {@link https://discord.com/developers/docs/resources/sticker#modify-guild-sticker|Modify Guild Sticker}
     */
    static modifyGuildSticker(
        guildId: Snowflake,
        stickerId: Snowflake,
        params: ModifyGuildStickerJsonParams,
        reason?: string
    ): RouteStructure<StickerStructure> {
        const headers: Record<string, string> = {};

        if (reason) {
            headers["X-Audit-Log-Reason"] = reason;
        }

        return {
            method: RestMethods.Patch,
            path: `/guilds/${guildId}/stickers/${stickerId}`,
            body: Buffer.from(JSON.stringify(params)),
            headers,
        };
    }

    /**
     * @see {@link https://discord.com/developers/docs/resources/sticker#create-guild-sticker|Create Guild Sticker}
     */
    static createGuildSticker(
        guildId: Snowflake,
        params: CreateGuildStickerFormParams,
        reason?: string
    ): RouteStructure<StickerStructure> {
        const form = new FileUpload();
        form.addField("name", params.name);
        form.addField("tags", params.tags);
        void form.addFiles(params.file);

        if (params.description) {
            form.addField("description", params.description);
        }

        const headers: Record<string, string> = {};
        if (reason) {
            headers["X-Audit-Log-Reason"] = reason;
        }

        return {
            method: RestMethods.Post,
            path: `/guilds/${guildId}/stickers`,
            body: form.toBuffer(),
            headers: form.getHeaders(headers),
        };
    }

    /**
     * @see {@link https://discord.com/developers/docs/resources/sticker#get-guild-sticker|Get Guild Sticker}
     */
    static getGuildSticker(guildId: Snowflake, stickerId: Snowflake): RouteStructure<StickerStructure> {
        return {
            method: RestMethods.Get,
            path: `/guilds/${guildId}/stickers/${stickerId}`,
        };
    }

    /**
     * @see {@link https://discord.com/developers/docs/resources/sticker#list-guild-stickers|List Guild Stickers}
     */
    static listGuildStickers(guildId: Snowflake): RouteStructure<StickerStructure[]> {
        return {
            method: RestMethods.Get,
            path: `/guilds/${guildId}/stickers`,
        };
    }

    /**
     * @see {@link https://discord.com/developers/docs/resources/sticker#get-sticker-pack|Get Sticker Pack}
     */
    static getStickerPack(stickerPackId: Snowflake): RouteStructure<StickerPackStructure[]> {
        return {
            method: RestMethods.Get,
            path: `/sticker-packs/${stickerPackId}`,
        };
    }
}
