import { SnowflakeSchema, type UserEntity } from "@nyxjs/core";
import { z } from "zod";

/**
 * @see {@link https://discord.com/developers/docs/resources/poll#get-answer-voters-response-body}
 */
export interface PollVotersResponseEntity {
  users: UserEntity[];
}

/**
 * @see {@link https://discord.com/developers/docs/resources/poll#get-answer-voters-query-string-params}
 */
export const GetAnswerVotersQuerySchema = z
  .object({
    after: SnowflakeSchema.optional(),
    limit: z.number().int().min(1).max(100).default(25).optional(),
  })
  .strict();

export type GetAnswerVotersQueryEntity = z.infer<
  typeof GetAnswerVotersQuerySchema
>;
