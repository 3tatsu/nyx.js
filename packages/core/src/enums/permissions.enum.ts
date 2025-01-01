/**
 * @see {@link https://discord.com/developers/docs/topics/permissions}
 */
export const BitwisePermissionFlags = {
  createInstantInvite: 0x0000000000000001,
  kickMembers: 0x0000000000000002,
  banMembers: 0x0000000000000004,
  administrator: 0x0000000000000008,
  manageChannels: 0x0000000000000010,
  manageGuild: 0x0000000000000020,
  addReactions: 0x0000000000000040,
  viewAuditLog: 0x0000000000000080,
  prioritySpeaker: 0x0000000000000100,
  stream: 0x0000000000000200,
  viewChannel: 0x0000000000000400,
  sendMessages: 0x0000000000000800,
  sendTtsMessages: 0x0000000000001000,
  manageMessages: 0x0000000000002000,
  embedLinks: 0x0000000000004000,
  attachFiles: 0x0000000000008000,
  readMessageHistory: 0x0000000000010000,
  mentionEveryone: 0x0000000000020000,
  useExternalEmojis: 0x0000000000040000,
  viewGuildInsights: 0x0000000000080000,
  connect: 0x0000000000100000,
  speak: 0x0000000000200000,
  muteMembers: 0x0000000000400000,
  deafenMembers: 0x0000000000800000,
  moveMembers: 0x0000000001000000,
  useVad: 0x0000000002000000,
  changeNickname: 0x0000000004000000,
  manageNicknames: 0x0000000008000000,
  manageRoles: 0x0000000010000000,
  manageWebhooks: 0x0000000020000000,
  manageGuildExpressions: 0x0000000040000000,
  useApplicationCommands: 0x0000000080000000,
  requestToSpeak: 0x0000000100000000,
  manageEvents: 0x0000000200000000,
  manageThreads: 0x0000000400000000,
  createPublicThreads: 0x0000000800000000,
  createPrivateThreads: 0x0000001000000000,
  useExternalStickers: 0x0000002000000000,
  sendMessagesInThreads: 0x0000004000000000,
  useEmbeddedActivities: 0x0000008000000000,
  moderateMembers: 0x0000010000000000,
  viewCreatorMonetizationAnalytics: 0x0000020000000000,
  useSoundboard: 0x0000040000000000,
  createGuildExpressions: 0x0000080000000000,
  createEvents: 0x0000100000000000,
  useExternalSounds: 0x0000200000000000,
  sendVoiceMessages: 0x0000400000000000,
  sendPolls: 0x0002000000000000,
  useExternalApps: 0x0004000000000000,
} as const;

export type BitwisePermissionFlags =
  (typeof BitwisePermissionFlags)[keyof typeof BitwisePermissionFlags];