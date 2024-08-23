import type { Integer } from "@nyxjs/core";
import type { RestRequestOptions } from "../globals/rest";

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway#session-start-limit-object-session-start-limit-structure}
 */
export type SessionStartLimitStructure = {
	/**
	 * Number of identify requests allowed per 5 seconds
	 */
	max_concurrency: Integer;
	/**
	 * Remaining number of session starts the current user is allowed
	 */
	remaining: Integer;
	/**
	 * Number of milliseconds after which the limit resets
	 */
	reset_after: Integer;
	/**
	 * Total number of session starts the current user is allowed
	 */
	total: Integer;
};

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway#get-gateway-bot-json-response}
 */
export type GetGatewayBotResponse = {
	/**
	 * Information on the current session start limit
	 */
	session_start_limit: SessionStartLimitStructure;
	/**
	 * Recommended number of shards to use when connecting
	 */
	shards: Integer;
	/**
	 * WSS URL that can be used for connecting to the Gateway
	 */
	url: string;
};

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway#get-gateway-bot}
 */
function getGatewayBot(): RestRequestOptions<GetGatewayBotResponse> {
	return {
		method: "GET",
		path: "/gateway/bot",
	};
}

/**
 * @see {@link https://discord.com/developers/docs/topics/gateway#get-gateway}
 */
function getGateway(): RestRequestOptions<{ url: string; }> {
	return {
		method: "GET",
		path: "/gateway",
	};
}

export const GatewayRoutes = {
	getGatewayBot,
	getGateway,
};
