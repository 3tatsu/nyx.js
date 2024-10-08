import type { MimeTypes } from "../enums";
import type { BitfieldResolvable } from "../managers";
import type { Float, Integer, Iso8601Timestamp, Snowflake } from "../markdown";
import type { ApplicationIntegrationTypes, ApplicationStructure } from "./applications";
import type { ChannelStructure, ChannelTypes } from "./channels";
import type { ActionRowStructure } from "./components";
import type { EmojiStructure } from "./emojis";
import type { InteractionTypes, MessageInteractionStructure, ResolvedDataStructure } from "./interactions";
import type { PollStructure } from "./polls";
import type { StickerItemStructure, StickerStructure } from "./stickers";
import type { UserStructure } from "./users";

/**
 * @see {@link https://discord.com/developers/docs/resources/message#role-subscription-data-object-role-subscription-data-object-structure|Role Subscription Data Object}
 */
export type RoleSubscriptionDataStructure = {
    /**
     * Whether this notification is for a renewal rather than a new purchase.
     */
    is_renewal: boolean;
    /**
     * The ID of the SKU and listing that the user is subscribed to.
     */
    role_subscription_listing_id: Snowflake;
    /**
     * The name of the tier that the user is subscribed to.
     */
    tier_name: string;
    /**
     * The cumulative number of months that the user has been subscribed for.
     */
    total_months_subscribed: Integer;
};

/**
 * @see {@link https://discord.com/developers/docs/resources/message#allowed-mentions-object-allowed-mention-types|Allowed Mention Types}
 */
export enum AllowedMentionTypes {
    /**
     * Controls @everyone and @here mentions
     */
    Everyone = "everyone",
    /**
     * Controls role mentions
     */
    Roles = "roles",
    /**
     * Controls user mentions
     */
    Users = "users",
}

/**
 * @see {@link https://discord.com/developers/docs/resources/message#allowed-mentions-object-allowed-mentions-structure|Allowed Mentions Object}
 */
export type AllowedMentionStructure = {
    /**
     * An array of allowed mention types to parse from the content.
     */
    parse?: AllowedMentionTypes[];
    /**
     * For replies, whether to mention the author of the message being replied to (default false).
     */
    replied_user?: boolean;
    /**
     * Array of role_ids to mention (Max size of 100).
     */
    roles?: Snowflake[];
    /**
     * Array of user_ids to mention (Max size of 100).
     */
    users?: Snowflake[];
};

/**
 * @see {@link https://discord.com/developers/docs/resources/message#channel-mention-object-channel-mention-structure|Channel Mention Structure}
 */
export type ChannelMentionStructure = {
    /**
     * ID of the guild containing the channel
     */
    guild_id: Snowflake;
    /**
     * ID of the channel
     */
    id: Snowflake;
    /**
     * The name of the channel
     */
    name: string;
    /**
     * The type of channel
     */
    type: ChannelTypes;
};

/**
 * @see {@link https://discord.com/developers/docs/resources/message#attachment-object-attachment-flags|Attachment Flags}
 */
export enum AttachmentFlags {
    /**
     * This attachment is an image
     */
    IsRemix = 4,
}

/**
 * @see {@link https://discord.com/developers/docs/resources/message#attachment-object-attachment-structure|Attachment Structure}
 */
export type AttachmentStructure = {
    /**
     * The attachment's media type
     */
    content_type?: MimeTypes;
    /**
     * Description for the file (max 1024 characters)
     */
    description?: string;
    /**
     * The duration of the audio file (currently for voice messages)
     */
    duration_secs?: Float;
    /**
     * Whether this attachment is ephemeral
     */
    ephemeral?: boolean;
    /**
     * Name of the file attached
     */
    filename: string;
    /**
     * Attachment flags combined as a bitfield
     */
    flags?: BitfieldResolvable<AttachmentFlags>;
    /**
     * Height of file (if image)
     */
    height?: Integer | null;
    /**
     * Attachment ID
     */
    id: Snowflake;
    /**
     * A proxied URL of file
     */
    proxy_url: string;
    /**
     * Size of file in bytes
     */
    size: Integer;
    /**
     * The title of the file
     */
    title?: string;
    /**
     * Source URL of file
     */
    url: string;
    /**
     * Base64 encoded bytearray representing a sampled waveform (currently for voice messages)
     */
    waveform?: string;
    /**
     * Width of file (if image)
     */
    width?: Integer | null;
};

/**
 * @see {@link https://discord.com/developers/docs/resources/message#embed-fields-by-embed-type-poll-result-embed-fields|Poll Result Embed Fields}
 */
export type PollResultEmbedFieldStructure = {
    /**
     * Question text from the original poll
     */
    poll_question_text: string;
    /**
     * Total number of votes in the poll
     */
    total_votes: Integer;
    /**
     * If an emoji associated with the winning answer is animated
     */
    victor_answer_emoji_animated?: boolean;
    /**
     * ID for an emoji associated with the winning answer
     */
    victor_answer_emoji_id?: Snowflake;
    /**
     * Name of an emoji associated with the winning answer
     */
    victor_answer_emoji_name?: string;
    /**
     * ID for the winning answer
     */
    victor_answer_id?: Snowflake;
    /**
     * Text for the winning answer
     */
    victor_answer_text?: string;
    /**
     * Number of votes for the answer(s) with the most votes
     */
    victor_answer_votes: Integer;
};

/**
 * Represents the structure of an embed object.
 */
export type BaseEmbedImageStructure = {
    /**
     * Height of image
     */
    height?: Integer;
    /**
     * The embed type of the image
     */
    icon_url?: string;
    /**
     * A proxied URL of the image
     */
    proxy_icon_url?: string;
    /**
     * A proxied URL of the image
     */
    proxy_url?: string;
    /**
     * Source URL of image
     */
    url: string;
    /**
     * Width of image
     */
    width?: Integer;
};

/**
 * @see {@link https://discord.com/developers/docs/resources/message#embed-object-embed-field-structure|Embed Field Structure}
 */
export type EmbedFieldStructure = {
    /**
     * Whether or not this field should display inline
     */
    inline?: boolean;
    /**
     * The name of the field
     */
    name: string;
    /**
     * The value of the field
     */
    value: string;
};

/**
 * @see {@link https://discord.com/developers/docs/resources/message#embed-object-embed-footer-structure|Embed Footer Structure}
 */
export type EmbedFooterStructure = Pick<BaseEmbedImageStructure, "icon_url" | "proxy_icon_url"> & {
    /**
     * Footer text
     */
    text: string;
};

/**
 * @see {@link https://discord.com/developers/docs/resources/message#embed-object-embed-author-structure|Embed Author Structure}
 */
export type EmbedAuthorStructure = Pick<BaseEmbedImageStructure, "icon_url" | "proxy_icon_url" | "url"> & {
    /**
     * Name of the author
     */
    name: string;
};

/**
 * @see {@link https://discord.com/developers/docs/resources/message#embed-object-embed-provider-structure|Embed Provider Structure}
 */
export type EmbedProviderStructure = Pick<BaseEmbedImageStructure, "url"> & {
    /**
     * Name of provider
     */
    name?: string;
};

/**
 * @see {@link https://discord.com/developers/docs/resources/message#embed-object-embed-image-structure|Embed Image Structure}
 */
export type EmbedImageStructure = Pick<BaseEmbedImageStructure, "height" | "proxy_url" | "url" | "width">;

/**
 * @see {@link https://discord.com/developers/docs/resources/message#embed-object-embed-video-structure|Embed Video Structure}
 */
export type EmbedVideoStructure = Pick<BaseEmbedImageStructure, "height" | "proxy_url" | "url" | "width">;

/**
 * @see {@link https://discord.com/developers/docs/resources/message#embed-object-embed-thumbnail-structure|Embed Thumbnail Structure}
 */
export type EmbedThumbnailStructure = Pick<BaseEmbedImageStructure, "height" | "proxy_url" | "url" | "width">;

/**
 * @see {@link https://discord.com/developers/docs/resources/message#embed-object-embed-types|Embed Types}
 */
export enum EmbedTypes {
    /**
     * Article embed
     */
    Article = "article",
    /**
     * Animated gif image embed rendered as a video embed
     */
    Gifv = "gifv",
    /**
     * Image embed
     */
    Image = "image",
    /**
     * Link embed
     */
    Link = "link",
    /**
     * Poll result embed
     */
    PollResult = "poll_result",
    /**
     * Generic embed rendered from embed attributes
     */
    Rich = "rich",
    /**
     * Video embed
     */
    Video = "video",
}

/**
 * @see {@link https://discord.com/developers/docs/resources/message#embed-object-embed-structure|Embed Structure}
 */
export type EmbedStructure = {
    /**
     * Author information
     */
    author?: EmbedAuthorStructure;
    /**
     * Color code of the embed
     */
    color?: Integer;
    /**
     * Description of the embed
     */
    description?: string;
    /**
     * Fields information, max of 25
     */
    fields?: EmbedFieldStructure[];
    /**
     * Footer information
     */
    footer?: EmbedFooterStructure;
    /**
     * Image information
     */
    image?: EmbedImageStructure;
    /**
     * Provider information
     */
    provider?: EmbedProviderStructure;
    /**
     * Thumbnail information
     */
    thumbnail?: EmbedThumbnailStructure;
    /**
     * Timestamp of the embed content
     */
    timestamp?: Iso8601Timestamp;
    /**
     * Title of the embed
     */
    title?: string;
    /**
     * Type of embed (always "rich" for webhook embeds)
     */
    type?: EmbedTypes;
    /**
     * URL of the embed
     */
    url?: string;
    /**
     * Video information
     */
    video?: EmbedVideoStructure;
};

/**
 * @see {@link https://discord.com/developers/docs/resources/message#reaction-count-details-object-reaction-count-details-structure|Reaction Count Details Structure}
 */
export type ReactionCountDetailStructure = {
    /**
     * Count of super reactions
     */
    burst: Integer;
    /**
     * Count of normal reactions
     */
    normal: Integer;
};

/**
 * @see {@link https://discord.com/developers/docs/resources/message#reaction-object-reaction-structure|Reaction Structure}
 */
export type ReactionStructure = {
    /**
     * HEX colors used for super reaction
     */
    burst_colors: string[];
    /**
     * Total number of times this emoji has been used to react (including super reacts)
     */
    count: Integer;
    /**
     * Reaction count details object
     */
    count_details: ReactionCountDetailStructure;
    /**
     * emoji information
     */
    emoji: Partial<EmojiStructure>;
    /**
     * Whether the current user reacted using this emoji
     */
    me: boolean;
    /**
     * Whether the current user super-reacted using this emoji
     */
    me_burst: boolean;
};

/**
 * @see {@link https://discord.com/developers/docs/resources/message#message-reference-types}
 */
export enum MessageReferenceTypes {
    /**
     * A standard reference used by replies.
     */
    Default = 0,
    /**
     * Reference used to point to a message at a point in time.
     */
    Forward = 1,
}

/**
 * @see {@link https://discord.com/developers/docs/resources/message#message-reference-structure|Message Reference Structure}
 */
export type MessageReferenceStructure = {
    /**
     * id of the originating message's channel
     */
    channel_id?: Snowflake;
    /**
     * when sending, whether to error if the referenced message doesn't exist instead of sending as a normal (non-reply) message, default true
     */
    fail_if_not_exists?: boolean;
    /**
     * id of the originating message's guild
     */
    guild_id?: Snowflake;
    /**
     * id of the originating message
     */
    message_id?: Snowflake;
    /**
     * type of reference.
     */
    type?: MessageReferenceTypes;
};

/**
 * @see {@link https://discord.com/developers/docs/resources/message#message-call-object-message-call-object-structure|Message Call Object}
 */
export type MessageCallStructure = {
    /**
     * time when call ended
     */
    ended_timestamp?: Iso8601Timestamp;
    /**
     * array of user object ids that participated in the call
     */
    participants: Snowflake[];
};

/**
 * @see {@link https://discord.com/developers/docs/resources/message#message-interaction-metadata-object-message-interaction-metadata-structure|Message Interaction Metadata Object}
 */
export type MessageInteractionMetadataStructure = {
    /**
     * IDs for installation context(s) related to an interaction. Details in Authorizing Integration Owners Object
     *
     * @todo Verify the type of this property
     */
    authorizing_integration_owners: Record<ApplicationIntegrationTypes, Snowflake>;
    /**
     * ID of the interaction
     */
    id: Snowflake;
    /**
     * ID of the message that contained interactive component, present only on messages created from component interactions
     */
    interacted_message_id?: Snowflake;
    /**
     * ID of the original response message, present only on follow-up messages
     */
    original_response_message_id?: Snowflake;
    /**
     * Metadata for the interaction that was used to open the modal, present only on modal submit interactions
     */
    triggering_interaction_metadata?: MessageInteractionMetadataStructure;
    /**
     * Type of interaction
     */
    type: InteractionTypes;
    /**
     * User who triggered the interaction
     */
    user: UserStructure;
};

/**
 * @see {@link https://discord.com/developers/docs/resources/message#message-object-message-flags}
 */
export enum MessageFlags {
    /**
     * This message has been published to subscribed channels (via Channel Following)
     */
    Crossposted = 1,
    /**
     * This message originated from a message in another channel (via Channel Following)
     */
    IsCrosspost = 2,
    /**
     * Do not include any embeds when serializing this message
     */
    SuppressEmbeds = 4,
    /**
     * The source message for this crosspost has been deleted (via Channel Following)
     */
    SourceMessageDeleted = 8,
    /**
     * This message came from the urgent message system
     */
    Urgent = 16,
    /**
     * This message has an associated thread, with the same id as the message
     */
    HasThread = 32,
    /**
     * This message is only visible to the user who invoked the Interaction
     */
    Ephemeral = 64,
    /**
     * This message is an Interaction Response and the bot is "thinking"
     */
    Loading = 128,
    /**
     * This message failed to mention some roles and add their members to the thread
     */
    FailedToMentionSomeRolesInThread = 256,
    /**
     * This message will not trigger push and desktop notifications
     */
    SuppressNotifications = 4_096,
    /**
     * This message is a voice message
     */
    IsVoiceMessage = 8_192,
}

/**
 * @see {@link https://discord.com/developers/docs/resources/message#message-object-message-activity-types|Message Activity Types}
 */
export enum MessageActivityTypes {
    Join = 1,
    Spectate = 2,
    Listen = 3,
    JoinRequest = 5,
}

/**
 * @see {@link https://discord.com/developers/docs/resources/message#message-object-message-activity-structure|Message Activity Structure}
 */
export type MessageActivityStructure = {
    /**
     * party_id from a Rich Presence event
     */
    party_id?: string;
    /**
     * Type of message activity
     */
    type: MessageActivityTypes;
};

/**
 * @see {@link https://discord.com/developers/docs/resources/message#message-object-message-types|Message Types}
 */
export enum MessageTypes {
    Default = 0,
    RecipientAdd = 1,
    RecipientRemove = 2,
    Call = 3,
    ChannelNameChange = 4,
    ChannelIconChange = 5,
    ChannelPinnedMessage = 6,
    UserJoin = 7,
    GuildBoost = 8,
    GuildBoostTier1 = 9,
    GuildBoostTier2 = 10,
    GuildBoostTier3 = 11,
    ChannelFollowAdd = 12,
    GuildDiscoveryDisqualified = 14,
    GuildDiscoveryRequalified = 15,
    GuildDiscoveryGracePeriodInitialWarning = 16,
    GuildDiscoveryGracePeriodFinalWarning = 17,
    ThreadCreated = 18,
    Reply = 19,
    ChatInputCommand = 20,
    ThreadStarterMessage = 21,
    GuildInviteReminder = 22,
    ContextMenuCommand = 23,
    AutoModerationAction = 24,
    RoleSubscriptionPurchase = 25,
    InteractionPremiumUpsell = 26,
    StageStart = 27,
    StageEnd = 28,
    StageSpeaker = 29,
    StageTopic = 31,
    GuildApplicationPremiumSubscription = 32,
    GuildIncidentAlertModeEnabled = 36,
    GuildIncidentAlertModeDisabled = 37,
    GuildIncidentReportRaid = 38,
    GuildIncidentReportFalseAlarm = 39,
    PurchaseNotification = 44,
    PollResult = 46,
}

/**
 * @see {@link https://discord.com/developers/docs/resources/message#message-object-message-structure|Message Structure}
 */
export type MessageStructure = {
    /**
     * Sent with Rich Presence-related chat embeds
     */
    activity?: MessageActivityStructure;
    /**
     * Sent with Rich Presence-related chat embeds
     *
     * @todo No information available in the Discord API documentation
     */
    application?: Partial<ApplicationStructure>;
    /**
     * If the message is an Interaction or application-owned webhook, this is the ID of the application
     */
    application_id?: Snowflake;
    /**
     * Any attached files
     */
    attachments: AttachmentStructure[] | null;
    /**
     * Author of this message
     */
    author: UserStructure;
    /**
     * The call associated with the message
     */
    call?: MessageCallStructure;
    /**
     * ID of the channel the message was sent in
     */
    channel_id: Snowflake;
    /**
     * Sent if the message contains components like buttons, action rows, or other interactive components
     */
    components?: ActionRowStructure[];
    /**
     * Contents of the message
     */
    content: string | null;
    /**
     * When this message was edited (or null if never)
     */
    edited_timestamp: Iso8601Timestamp | null;
    /**
     * Any embedded content
     */
    embeds: EmbedStructure[] | null;
    /**
     * Message flags combined as a bitfield
     */
    flags?: BitfieldResolvable<MessageFlags>;
    /**
     * ID of the message
     */
    id: Snowflake;
    /**
     * Deprecated in favor of interaction_metadata; sent if the message is a response to an interaction
     *
     * @deprecated Use `interaction_metadata` instead.
     */
    interaction?: MessageInteractionStructure;
    /**
     * In preview. Sent if the message is sent as a result of an interaction
     */
    interaction_metadata?: MessageInteractionMetadataStructure;
    /**
     * Channels specifically mentioned in this message
     */
    mention_channels?: ChannelMentionStructure[];
    /**
     * Whether this message mentions everyone
     */
    mention_everyone: boolean;
    /**
     * Roles specifically mentioned in this message
     */
    mention_roles: Snowflake[];
    /**
     * Users specifically mentioned in the message
     */
    mentions: UserStructure[];
    /**
     * Data showing the source of a crosspost, channel follow add, pin, or reply message
     */
    message_reference?: MessageReferenceStructure;
    /**
     * The message associated with the message_reference. This is a minimal subset of fields in a message (e.g. author is excluded.)
     */
    message_snapshots?: MessageSnapshotStructure[];
    /**
     * Used for validating a message was sent
     */
    nonce?: Integer | string;
    /**
     * Whether this message is pinned
     */
    pinned: boolean;
    /**
     * A poll!
     */
    poll?: PollStructure;
    /**
     * A generally increasing integer (there may be gaps or duplicates) that represents the approximate position of the message in a thread, it can be used to estimate the relative position of the message in a thread in company with total_message_sent on parent thread
     */
    position?: Integer;
    /**
     * Reactions to the message
     */
    reactions?: ReactionStructure[];
    /**
     * The message associated with the message_reference
     */
    referenced_message?: MessageStructure;
    /**
     * Data for users, members, channels, and roles in the message's auto-populated select menus
     */
    resolved?: Pick<ResolvedDataStructure, "channels" | "members" | "roles" | "users">;
    /**
     * Data of the role subscription purchase or renewal that prompted this ROLE_SUBSCRIPTION_PURCHASE message
     */
    role_subscription_data?: RoleSubscriptionDataStructure;
    /**
     * Sent if the message contains stickers
     */
    sticker_items?: StickerItemStructure[];
    /**
     * The stickers sent with the message
     *
     * @deprecated Use `sticker_items` instead.
     */
    stickers?: StickerStructure[];
    /**
     * The thread that was started from this message, includes thread member object
     */
    thread?: ChannelStructure;
    /**
     * When this message was sent
     */
    timestamp: Iso8601Timestamp;
    /**
     * Whether this was a TTS message
     */
    tts: boolean;
    /**
     * Type of message
     */
    type: MessageTypes;
    /**
     * If the message is generated by a webhook, this is the webhook's ID
     */
    webhook_id?: Snowflake;
};

/**
 * @see {@link https://discord.com/developers/docs/resources/message#message-snapshot-structure|Message Snapshot Structure}
 */
export type MessageSnapshotStructure = {
    /**
     * The message that was forwarded
     */
    message: Pick<
        MessageStructure,
        | "attachments"
        | "components"
        | "content"
        | "edited_timestamp"
        | "embeds"
        | "flags"
        | "mention_roles"
        | "mentions"
        | "sticker_items"
        | "stickers"
        | "timestamp"
        | "type"
    >;
};
