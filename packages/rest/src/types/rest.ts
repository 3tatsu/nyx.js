import type { ApiVersion } from "@nyxjs/core";
import type { Dispatcher, Pool, ProxyAgent, RetryHandler } from "undici";
import type {
  ApplicationCommandRouter,
  ApplicationConnectionRouter,
  ApplicationRouter,
  AuditLogRouter,
  AutoModerationRouter,
  ChannelRouter,
  EmojiRouter,
  EntitlementRouter,
  GatewayRouter,
  GuildRouter,
  GuildTemplateRouter,
  InteractionRouter,
  InviteRouter,
  MessageRouter,
  OAuth2Router,
  PollRouter,
  ScheduledEventRouter,
  SkuRouter,
  SoundboardRouter,
  StageInstanceRouter,
  StickerRouter,
  SubscriptionRouter,
  UserRouter,
  VoiceRouter,
  WebhookRouter,
} from "../routes/index.js";

/**
 * @see {@link https://discord.com/developers/docs/reference#image-data}
 */
export type ImageData =
  `data:image/${"jpeg" | "png" | "webp"};base64,${string}`;
export type PathLike = `/${string}`;
export type FileEntity = File | string;
export type DiscordUserAgent = `DiscordBot (${string}, ${string})`;
export type RateLimitScope = "user" | "global" | "shared";

/**
 * @see {@link https://discord.com/developers/docs/topics/rate-limits#exceeding-a-rate-limit-rate-limit-response-structure}
 */
export interface RateLimitResponseEntity {
  message: string;
  retry_after: number;
  global: boolean;
  code?: JsonErrorCode;
}

export interface JsonErrorEntity {
  code: number;
  message: string;
  errors?: Record<string, unknown>;
}

/**
 * @see {@link https://discord.com/developers/docs/topics/opcodes-and-status-codes#json-example-json-error-response}
 */
export interface JsonErrorResponseEntity {
  code: JsonErrorCode;
  message: string;
}

/**
 * @see {@link https://discord.com/developers/docs/topics/rate-limits#header-format-rate-limit-header-examples}
 */
export interface RateLimitEntity {
  limit: number;
  remaining: number;
  reset: number;
  resetAfter: number;
  bucket: string;
  global: boolean;
  scope: RateLimitScope;
}

export interface RouteEntity
  extends Omit<
    Dispatcher.RequestOptions,
    "origin" | "path" | "method" | "headers"
  > {
  method: HttpMethodFlag;
  path: PathLike;
  headers?: Record<string, string>;
  files?: FileEntity | FileEntity[];
  reason?: string;
}

export interface RestOptionsEntity {
  token: string;
  /**
   * @default {@link ApiVersion.V10}
   */
  version?: ApiVersion.V10;
  /**
   * @default {@link AuthTypeFlag.Bot}
   */
  authType?: AuthTypeFlag;
  userAgent?: DiscordUserAgent;
  compress?: boolean;
  maxRetries?: number;
  baseRetryDelay?: number;
  timeout?: number;
  rateLimitRetryLimit?: number;
  maxConcurrentRequests?: number;
  proxy?: ProxyAgent.Options;
  pool?: Pool.Options;
  retry?: RetryHandler.RetryOptions;
}

export interface RestEventMap {
  debug: [message: string];
  warn: [message: string];
  error: [error: Error];
  apiRequest: [data: ApiRequest];
  rateLimitHit: [data: RateLimitHit];
  requestRetry: [data: RequestRetry];
  responseReceived: [data: ResponseReceived];
  proxyUpdate: [data: NonNullable<RestOptionsEntity["proxy"]> | null];
}

export interface ApiRequest {
  method: HttpMethodFlag;
  path: string;
  status: number;
  responseTime: number;
  attempt: number;
}

export interface RateLimitHit {
  bucket: string;
  resetAfter: number;
  limit: number;
  scope: RateLimitScope;
}

export interface RequestRetry {
  error: Error;
  attempt: number;
  maxAttempts: number;
}

export interface ResponseReceived {
  method: HttpMethodFlag;
  path: string;
  status: number;
  headers: Record<string, string | string[] | undefined>;
}

export type RouterDefinitions = {
  applications: ApplicationRouter;
  commands: ApplicationCommandRouter;
  connections: ApplicationConnectionRouter;
  auditLogs: AuditLogRouter;
  autoModeration: AutoModerationRouter;
  channels: ChannelRouter;
  emojis: EmojiRouter;
  entitlements: EntitlementRouter;
  gateway: GatewayRouter;
  guilds: GuildRouter;
  templates: GuildTemplateRouter;
  interactions: InteractionRouter;
  invites: InviteRouter;
  messages: MessageRouter;
  oauth2: OAuth2Router;
  polls: PollRouter;
  scheduledEvents: ScheduledEventRouter;
  skus: SkuRouter;
  soundboards: SoundboardRouter;
  stages: StageInstanceRouter;
  stickers: StickerRouter;
  subscriptions: SubscriptionRouter;
  users: UserRouter;
  voice: VoiceRouter;
  webhooks: WebhookRouter;
};

export type RouterKey = keyof RouterDefinitions;

export enum AuthTypeFlag {
  Bot = "Bot",
  Bearer = "Bearer",
}

export enum HttpMethodFlag {
  Get = "GET",
  Post = "POST",
  Put = "PUT",
  Patch = "PATCH",
  Delete = "DELETE",
}

/**
 * @see {@link https://discord.com/developers/docs/topics/opcodes-and-status-codes#http-http-response-codes}
 */
export enum HttpStatusCode {
  Ok = 200,
  Created = 201,
  NoContent = 204,
  NotModified = 304,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  TooManyRequests = 429,
  GatewayUnavailable = 502,
  ServerError = 500,
}

/**
 * @see {@link https://discord.com/developers/docs/topics/opcodes-and-status-codes#json-json-error-codes}
 */
export enum JsonErrorCode {
  GeneralError = 0,
  UnknownAccount = 10001,
  UnknownApplication = 10002,
  UnknownChannel = 10003,
  UnknownGuild = 10004,
  UnknownIntegration = 10005,
  UnknownInvite = 10006,
  UnknownMember = 10007,
  UnknownMessage = 10008,
  UnknownPermissionOverwrite = 10009,
  UnknownProvider = 10010,
  UnknownRole = 10011,
  UnknownToken = 10012,
  UnknownUser = 10013,
  UnknownEmoji = 10014,
  UnknownWebhook = 10015,
  UnknownWebhookService = 10016,
  UnknownSession = 10020,
  UnknownAsset = 10021,
  UnknownBan = 10026,
  UnknownSku = 10027,
  UnknownStoreListing = 10028,
  UnknownEntitlement = 10029,
  UnknownBuild = 10030,
  UnknownLobby = 10031,
  UnknownBranch = 10032,
  UnknownStoreDirectoryLayout = 10033,
  UnknownRedistributable = 10036,
  UnknownGiftCode = 10038,
  UnknownStream = 10049,
  UnknownPremiumServerSubscribeCooldown = 10050,
  UnknownGuildTemplate = 10057,
  UnknownDiscoverableServerCategory = 10059,
  UnknownSticker = 10060,
  UnknownStickerPack = 10061,
  UnknownInteraction = 10062,
  UnknownApplicationCommand = 10063,
  UnknownVoiceState = 10065,
  UnknownApplicationCommandPermissions = 10066,
  UnknownStageInstance = 10067,
  UnknownGuildMemberVerificationForm = 10068,
  UnknownGuildWelcomeScreen = 10069,
  UnknownGuildScheduledEvent = 10070,
  UnknownGuildScheduledEventUser = 10071,
  UnknownTag = 10087,
  UnknownSound = 10097,
  BotsCannotUseEndpoint = 20001,
  OnlyBotsCanUseEndpoint = 20002,
  ExplicitContentCannotBeSent = 20009,
  NotAuthorizedForApplication = 20012,
  SlowmodeRateLimit = 20016,
  OnlyOwnerCanPerformAction = 20018,
  AnnouncementRateLimit = 20022,
  UnderMinimumAge = 20024,
  ChannelWriteRateLimit = 20028,
  ServerWriteRateLimit = 20029,
  DisallowedServerContent = 20031,
  GuildPremiumSubscriptionTooLow = 20035,
  MaxGuildsReached = 30001,
  MaxFriendsReached = 30002,
  MaxPinsReached = 30003,
  MaxRecipientsReached = 30004,
  MaxGuildRolesReached = 30005,
  MaxWebhooksReached = 30007,
  MaxEmojisReached = 30008,
  MaxReactionsReached = 30010,
  MaxGroupDmsReached = 30011,
  MaxGuildChannelsReached = 30013,
  MaxAttachmentsReached = 30015,
  MaxInvitesReached = 30016,
  MaxAnimatedEmojisReached = 30018,
  MaxServerMembersReached = 30019,
  MaxServerCategoriesReached = 30030,
  GuildTemplateExists = 30031,
  MaxApplicationCommandsReached = 30032,
  MaxThreadParticipantsReached = 30033,
  MaxDailyApplicationCommandsReached = 30034,
  MaxNonMemberBansReached = 30035,
  MaxBanFetchesReached = 30037,
  MaxUncompletedGuildScheduledEventsReached = 30038,
  MaxStickersReached = 30039,
  MaxPruneRequestsReached = 30040,
  MaxGuildWidgetSettingsUpdatesReached = 30042,
  MaxSoundboardSoundsReached = 30045,
  MaxOldMessageEditsReached = 30046,
  MaxPinnedThreadsInForumReached = 30047,
  MaxForumTagsReached = 30048,
  BitrateTooHigh = 30052,
  MaxPremiumEmojisReached = 30056,
  MaxWebhooksPerGuildReached = 30058,
  MaxChannelPermissionOverwritesReached = 30060,
  GuildChannelsTooLarge = 30061,
  Unauthorized = 40001,
  VerificationRequired = 40002,
  OpeningDmsTooFast = 40003,
  SendMessagesTemporarilyDisabled = 40004,
  RequestEntityTooLarge = 40005,
  FeatureTemporarilyDisabled = 40006,
  UserBannedFromGuild = 40007,
  ConnectionRevoked = 40012,
  OnlyConsumableSkusCanBeConsumed = 40018,
  OnlySandboxEntitlementsCanBeDeleted = 40019,
  TargetUserNotConnectedToVoice = 40032,
  MessageAlreadyCrossposted = 40033,
  ApplicationCommandNameExists = 40041,
  InteractionFailedToSend = 40043,
  CannotSendForumMessage = 40058,
  InteractionAlreadyAcknowledged = 40060,
  TagNamesMustBeUnique = 40061,
  ServiceResourceRateLimited = 40062,
  NoAvailableTagsForNonModerators = 40066,
  TagRequiredForForumPost = 40067,
  ResourceAlreadyHasEntitlement = 40074,
  MaxFollowUpMessagesReached = 40094,
  CloudflareError = 40333,
  MissingAccess = 50001,
  InvalidAccountType = 50002,
  CannotExecuteDmAction = 50003,
  GuildWidgetDisabled = 50004,
  CannotEditOtherUsersMessages = 50005,
  CannotSendEmptyMessage = 50006,
  CannotSendMessagesToUser = 50007,
  CannotSendMessagesInNonTextChannel = 50008,
  ChannelVerificationTooHigh = 50009,
  OAuth2ApplicationNoBot = 50010,
  OAuth2ApplicationLimitReached = 50011,
  InvalidOAuth2State = 50012,
  MissingPermissions = 50013,
  InvalidAuthenticationToken = 50014,
  NoteTooLong = 50015,
  InvalidMessageDeleteCount = 50016,
  InvalidMfaLevel = 50017,
  InvalidPinChannel = 50019,
  InviteCodeInvalidOrTaken = 50020,
  CannotExecuteOnSystemMessage = 50021,
  InvalidChannelType = 50024,
  InvalidOAuth2AccessToken = 50025,
  MissingOAuth2Scope = 50026,
  InvalidWebhookToken = 50027,
  InvalidRole = 50028,
  InvalidRecipients = 50033,
  MessageTooOldForBulkDelete = 50034,
  InvalidFormBody = 50035,
  InviteAcceptedToNonBotGuild = 50036,
  InvalidActivityAction = 50039,
  InvalidApiVersion = 50041,
  FileUploadTooBig = 50045,
  InvalidFileUploaded = 50046,
  CannotSelfRedeemGift = 50054,
  InvalidGuild = 50055,
  InvalidSku = 50057,
  InvalidRequestOrigin = 50067,
  InvalidMessageType = 50068,
  PaymentSourceRequired = 50070,
  CannotModifySystemWebhook = 50073,
  CannotDeleteRequiredChannel = 50074,
  CannotEditMessageStickers = 50080,
  InvalidStickerSent = 50081,
  CannotPerformActionOnArchivedThread = 50083,
  InvalidThreadNotificationSettings = 50084,
  BeforeValueTooOld = 50085,
  CommunityChannelsMustBeTextChannels = 50086,
  EventEntityTypeMismatch = 50091,
  ServerNotAvailableInLocation = 50095,
  ServerNeedsMonetization = 50097,
  ServerNeedsMoreBoosts = 50101,
  InvalidRequestBodyJson = 50109,
  InvalidFile = 50110,
  InvalidFileType = 50123,
  FileDurationTooLong = 50124,
  OwnerCannotBePending = 50131,
  OwnershipCannotBeTransferredToBot = 50132,
  FailedToResizeAsset = 50138,
  CannotMixSubscriptionEmojis = 50144,
  CannotConvertEmojis = 50145,
  UploadedFileNotFound = 50146,
  InvalidEmoji = 50151,
  VoiceMessagesNoAdditionalContent = 50159,
  VoiceMessagesMustHaveAudio = 50160,
  VoiceMessagesMustHaveMetadata = 50161,
  VoiceMessagesCannotBeEdited = 50162,
  CannotDeleteGuildSubscription = 50163,
  CannotSendVoiceMessages = 50173,
  AccountMustBeVerified = 50178,
  InvalidFileDuration = 50192,
  NoStickerPermission = 50600,
  TwoFactorRequired = 60003,
  NoUsersWithDiscordTag = 80004,
  ReactionBlocked = 90001,
  UserCannotUseBurstReactions = 90002,
  ApplicationNotAvailable = 110001,
  ApiResourceOverloaded = 130000,
  StageAlreadyOpen = 150006,
  CannotReplyWithoutReadHistory = 160002,
  ThreadAlreadyCreated = 160004,
  ThreadLocked = 160005,
  MaxActiveThreadsReached = 160006,
  MaxActiveAnnouncementThreadsReached = 160007,
  InvalidLottieJson = 170001,
  LottieCannotContainRasterImages = 170002,
  StickerMaxFramerateExceeded = 170003,
  StickerMaxFramesExceeded = 170004,
  LottieDimensionsExceeded = 170005,
  StickerFrameRateInvalid = 170006,
  StickerAnimationDurationExceeded = 170007,
  CannotUpdateFinishedEvent = 180000,
  FailedToCreateStageEvent = 180002,
  MessageBlockedByAutomod = 200000,
  TitleBlockedByAutomod = 200001,
  WebhookForumThreadNameRequired = 220001,
  WebhookForumThreadConflict = 220002,
  WebhooksCanOnlyCreateForumThreads = 220003,
  WebhookServicesNotAllowedInForums = 220004,
  MessageBlockedByHarmfulLinks = 240000,
  CannotEnableOnboarding = 350000,
  CannotUpdateOnboarding = 350001,
  FailedToBanUsers = 500000,
  PollVotingBlocked = 520000,
  PollExpired = 520001,
  InvalidPollChannel = 520002,
  CannotEditPoll = 520003,
  CannotUsePollEmoji = 520004,
  CannotExpireNonPoll = 520006,
}
