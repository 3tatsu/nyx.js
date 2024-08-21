import type { Snowflake } from "@nyxjs/core";
import type { RestRequestOptions } from "../globals/rest";
import type { SkuStructure } from "../structures/skus";

/**
 * @see {@link https://discord.com/developers/docs/monetization/skus#list-skus}
 */
export function listSkus(applicationId: Snowflake): RestRequestOptions<SkuStructure[]> {
	return {
		method: "GET",
		path: `/applications/${applicationId}/skus`,
	};
}
