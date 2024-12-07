import type { EmojiEntity, Snowflake } from "@nyxjs/core";
import type {
  ApplicationEmojiCreateEntity,
  ApplicationEmojiModifyEntity,
  GuildEmojiCreateEntity,
  GuildEmojiModifyEntity,
} from "../types/index.js";
import { BaseRouter } from "./base.js";

export class EmojiRouter extends BaseRouter {
  static routes = {
    guildEmojis: (guildId: Snowflake): `/guilds/${Snowflake}/emojis` => {
      return `/guilds/${guildId}/emojis` as const;
    },
    guildEmoji: (
      guildId: Snowflake,
      emojiId: Snowflake,
    ): `/guilds/${Snowflake}/emojis/${Snowflake}` => {
      return `/guilds/${guildId}/emojis/${emojiId}` as const;
    },
    applicationEmojis: (
      applicationId: Snowflake,
    ): `/applications/${Snowflake}/emojis` => {
      return `/applications/${applicationId}/emojis` as const;
    },
    applicationEmoji: (
      applicationId: Snowflake,
      emojiId: Snowflake,
    ): `/applications/${Snowflake}/emojis/${Snowflake}` => {
      return `/applications/${applicationId}/emojis/${emojiId}` as const;
    },
  } as const;

  /**
   * @see {@link https://discord.com/developers/docs/resources/emoji#list-guild-emojis}
   */
  listGuildEmojis(guildId: Snowflake): Promise<EmojiEntity[]> {
    return this.get(EmojiRouter.routes.guildEmojis(guildId));
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/emoji#get-guild-emoji}
   */
  getGuildEmoji(guildId: Snowflake, emojiId: Snowflake): Promise<EmojiEntity> {
    return this.get(EmojiRouter.routes.guildEmoji(guildId, emojiId));
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/emoji#create-guild-emoji}
   */
  createGuildEmoji(
    guildId: Snowflake,
    options: GuildEmojiCreateEntity,
    reason?: string,
  ): Promise<EmojiEntity> {
    return this.post(EmojiRouter.routes.guildEmojis(guildId), {
      body: JSON.stringify(options),
      reason,
    });
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/emoji#modify-guild-emoji}
   */
  modifyGuildEmoji(
    guildId: Snowflake,
    emojiId: Snowflake,
    options: GuildEmojiModifyEntity,
    reason?: string,
  ): Promise<EmojiEntity> {
    return this.patch(EmojiRouter.routes.guildEmoji(guildId, emojiId), {
      body: JSON.stringify(options),
      reason,
    });
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/emoji#delete-guild-emoji}
   */
  deleteGuildEmoji(
    guildId: Snowflake,
    emojiId: Snowflake,
    reason?: string,
  ): Promise<void> {
    return this.delete(EmojiRouter.routes.guildEmoji(guildId, emojiId), {
      reason,
    });
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/emoji#list-application-emojis}
   */
  listApplicationEmojis(
    applicationId: Snowflake,
  ): Promise<{ items: EmojiEntity[] }> {
    return this.get(EmojiRouter.routes.applicationEmojis(applicationId));
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/emoji#get-application-emoji}
   */
  getApplicationEmoji(
    applicationId: Snowflake,
    emojiId: Snowflake,
  ): Promise<EmojiEntity> {
    return this.get(
      EmojiRouter.routes.applicationEmoji(applicationId, emojiId),
    );
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/emoji#create-application-emoji}
   */
  createApplicationEmoji(
    applicationId: Snowflake,
    options: ApplicationEmojiCreateEntity,
  ): Promise<EmojiEntity> {
    return this.post(EmojiRouter.routes.applicationEmojis(applicationId), {
      body: JSON.stringify(options),
    });
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/emoji#modify-application-emoji}
   */
  modifyApplicationEmoji(
    applicationId: Snowflake,
    emojiId: Snowflake,
    options: ApplicationEmojiModifyEntity,
  ): Promise<EmojiEntity> {
    return this.patch(
      EmojiRouter.routes.applicationEmoji(applicationId, emojiId),
      {
        body: JSON.stringify(options),
      },
    );
  }

  /**
   * @see {@link https://discord.com/developers/docs/resources/emoji#delete-application-emoji}
   */
  deleteApplicationEmoji(
    applicationId: Snowflake,
    emojiId: Snowflake,
  ): Promise<void> {
    return this.delete(
      EmojiRouter.routes.applicationEmoji(applicationId, emojiId),
    );
  }
}
