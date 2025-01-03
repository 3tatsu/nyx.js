import type {
  Snowflake,
  VoiceRegionEntity,
  VoiceStateEntity,
} from "@nyxjs/core";
import { BaseRouter } from "../base/index.js";
import {
  type ModifyCurrentUserVoiceStateEntity,
  ModifyCurrentUserVoiceStateSchema,
  type ModifyUserVoiceStateEntity,
  ModifyUserVoiceStateSchema,
} from "../schemas/index.js";

export class VoiceRouter extends BaseRouter {
  static readonly ROUTES = {
    voiceRegions: "/voice/regions" as const,
    currentUserVoiceState: (guildId: Snowflake) =>
      `/guilds/${guildId}/voice-states/@me` as const,
    userVoiceState: (guildId: Snowflake, userId: Snowflake) =>
      `/guilds/${guildId}/voice-states/${userId}` as const,
  } as const;

  /**
   * @see {@link https://discord.com/developers/docs/resources/voice#list-voice-regions}
   */
  listVoiceRegions(): Promise<VoiceRegionEntity[]> {
    return this.get(VoiceRouter.ROUTES.voiceRegions);
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/voice#get-current-user-voice-state}
   */
  getCurrentUserVoiceState(guildId: Snowflake): Promise<VoiceStateEntity> {
    return this.get(VoiceRouter.ROUTES.currentUserVoiceState(guildId));
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/voice#get-user-voice-state}
   */
  getUserVoiceState(
    guildId: Snowflake,
    userId: Snowflake,
  ): Promise<VoiceStateEntity> {
    return this.get(VoiceRouter.ROUTES.userVoiceState(guildId, userId));
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/voice#modify-current-user-voice-state}
   */
  modifyCurrentUserVoiceState(
    guildId: Snowflake,
    options: ModifyCurrentUserVoiceStateEntity,
  ): Promise<void> {
    const result = ModifyCurrentUserVoiceStateSchema.safeParse(options);
    if (!result.success) {
      throw new Error(
        result.error.errors
          .map((e) => `[${e.path.join(".")}] ${e.message}`)
          .join(", "),
      );
    }

    return this.patch(VoiceRouter.ROUTES.currentUserVoiceState(guildId), {
      body: JSON.stringify(result.data),
    });
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/voice#modify-user-voice-state}
   */
  modifyUserVoiceState(
    guildId: Snowflake,
    userId: Snowflake,
    options: ModifyUserVoiceStateEntity,
  ): Promise<void> {
    const result = ModifyUserVoiceStateSchema.safeParse(options);
    if (!result.success) {
      throw new Error(
        result.error.errors
          .map((e) => `[${e.path.join(".")}] ${e.message}`)
          .join(", "),
      );
    }

    return this.patch(VoiceRouter.ROUTES.userVoiceState(guildId, userId), {
      body: JSON.stringify(result.data),
    });
  }
}
