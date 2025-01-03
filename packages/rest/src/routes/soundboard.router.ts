import type { Snowflake, SoundboardSoundEntity } from "@nyxjs/core";
import { BaseRouter } from "../base/index.js";
import {
  type CreateGuildSoundboardSoundEntity,
  CreateGuildSoundboardSoundSchema,
  type ListGuildSoundboardSoundsResponse,
  type ModifyGuildSoundboardSoundEntity,
  type SendSoundboardSoundEntity,
  SendSoundboardSoundSchema,
} from "../schemas/index.js";

export class SoundboardRouter extends BaseRouter {
  static readonly ROUTES = {
    defaultSounds: "/soundboard-default-sounds" as const,
    guildSounds: (guildId: Snowflake) =>
      `/guilds/${guildId}/soundboard-sounds` as const,
    guildSound: (guildId: Snowflake, soundId: Snowflake) =>
      `/guilds/${guildId}/soundboard-sounds/${soundId}` as const,
    sendSound: (channelId: Snowflake) =>
      `/channels/${channelId}/send-soundboard-sound` as const,
  } as const;

  /**
   * @see {@link https://discord.com/developers/docs/resources/soundboard#send-soundboard-sound}
   */
  sendSoundboardSound(
    channelId: Snowflake,
    options: SendSoundboardSoundEntity,
  ): Promise<void> {
    const result = SendSoundboardSoundSchema.safeParse(options);
    if (!result.success) {
      throw new Error(
        result.error.errors
          .map((e) => `[${e.path.join(".")}] ${e.message}`)
          .join(", "),
      );
    }

    return this.post(SoundboardRouter.ROUTES.sendSound(channelId), {
      body: JSON.stringify(result.data),
    });
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/soundboard#list-default-soundboard-sounds}
   */
  listDefaultSoundboardSounds(): Promise<SoundboardSoundEntity[]> {
    return this.get(SoundboardRouter.ROUTES.defaultSounds);
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/soundboard#list-guild-soundboard-sounds}
   */
  listGuildSoundboardSounds(
    guildId: Snowflake,
  ): Promise<ListGuildSoundboardSoundsResponse> {
    return this.get(SoundboardRouter.ROUTES.guildSounds(guildId));
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/soundboard#get-guild-soundboard-sound}
   */
  getGuildSoundboardSound(
    guildId: Snowflake,
    soundId: Snowflake,
  ): Promise<SoundboardSoundEntity> {
    return this.get(SoundboardRouter.ROUTES.guildSound(guildId, soundId));
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/soundboard#create-guild-soundboard-sound}
   */
  createGuildSoundboardSound(
    guildId: Snowflake,
    options: CreateGuildSoundboardSoundEntity,
    reason?: string,
  ): Promise<SoundboardSoundEntity> {
    const result = CreateGuildSoundboardSoundSchema.safeParse(options);
    if (!result.success) {
      throw new Error(
        result.error.errors
          .map((e) => `[${e.path.join(".")}] ${e.message}`)
          .join(", "),
      );
    }

    return this.post(SoundboardRouter.ROUTES.guildSounds(guildId), {
      body: JSON.stringify(result.data),
      reason,
    });
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/soundboard#modify-guild-soundboard-sound}
   */
  modifyGuildSoundboardSound(
    guildId: Snowflake,
    soundId: Snowflake,
    options: ModifyGuildSoundboardSoundEntity,
    reason?: string,
  ): Promise<SoundboardSoundEntity> {
    const result = CreateGuildSoundboardSoundSchema.safeParse(options);
    if (!result.success) {
      throw new Error(
        result.error.errors
          .map((e) => `[${e.path.join(".")}] ${e.message}`)
          .join(", "),
      );
    }

    return this.patch(SoundboardRouter.ROUTES.guildSound(guildId, soundId), {
      body: JSON.stringify(result.data),
      reason,
    });
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/soundboard#delete-guild-soundboard-sound}
   */
  deleteGuildSoundboardSound(
    guildId: Snowflake,
    soundId: Snowflake,
    reason?: string,
  ): Promise<void> {
    return this.delete(SoundboardRouter.ROUTES.guildSound(guildId, soundId), {
      reason,
    });
  }
}
