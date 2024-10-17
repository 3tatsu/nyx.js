import type { GatewayIntents, Integer } from "@nyxjs/core";
import { ApiVersions, BitfieldManager } from "@nyxjs/core";
import type { GatewayOptions } from "@nyxjs/gateway";
import { CompressTypes, EncodingTypes, Gateway } from "@nyxjs/gateway";
import type { RestOptions } from "@nyxjs/rest";
import { Rest } from "@nyxjs/rest";
import { EventEmitter } from "eventemitter3";
import type { ClientEvents } from "../managers";
import { ClientEventManager, UserManager } from "../managers";

export type ClientOptions = {
    gateway?: Partial<Omit<GatewayOptions, "intents" | "v">>;
    intents: GatewayIntents[] | Integer;
    rest?: Partial<Omit<RestOptions, "version">>;
    version?: ApiVersions;
};

export class Client extends EventEmitter<ClientEvents> {
    public rest: Rest;

    public gateway: Gateway;

    public users: UserManager;

    readonly #options: Required<ClientOptions>;

    readonly #events: ClientEventManager;

    public constructor(
        public token: string,
        options: ClientOptions
    ) {
        super();
        this.#options = this.#initializeConfig(options);
        this.rest = this.#initializeRest();
        this.gateway = this.#initializeGateway();
        this.users = new UserManager(this);
        this.#events = new ClientEventManager(this);
    }

    public async connect(): Promise<void> {
        try {
            this.#events.setupListeners();
            await this.gateway.connect();
        } catch (error) {
            this.emit("error", new Error(`Failed to connect to gateway: ${error}`));
        }
    }

    #initializeConfig(options: ClientOptions): Required<ClientOptions> {
        return {
            version: options.version ?? ApiVersions.V10,
            intents: options.intents,
            gateway: {
                encoding: options.gateway?.encoding ?? EncodingTypes.Json,
                compress: options.gateway?.compress ?? CompressTypes.ZlibStream,
                shard: options.gateway?.shard,
                presence: options.gateway?.presence,
                large_threshold: options.gateway?.large_threshold,
            },
            rest: {
                timeout: options.rest?.timeout,
                user_agent: options.rest?.user_agent,
                rate_limit_retries: options.rest?.rate_limit_retries,
                max_retries: options.rest?.max_retries,
            },
        };
    }

    #initializeRest(): Rest {
        const options: RestOptions = {
            version: this.#options.version,
            max_retries: this.#options.rest.max_retries,
            rate_limit_retries: this.#options.rest.rate_limit_retries,
            user_agent: this.#options.rest.user_agent,
            timeout: this.#options.rest.timeout,
        };

        return new Rest(this.token, options);
    }

    #initializeGateway(): Gateway {
        if (!this.rest) {
            throw new Error("Rest client is not initialized.");
        }

        const options: GatewayOptions = {
            shard: this.#options.gateway.shard,
            compress: this.#options.gateway.compress,
            encoding: this.#options.gateway.encoding!,
            v: this.#options.version,
            large_threshold: this.#options.gateway.large_threshold,
            intents: this.#resolveIntents(this.#options.intents),
            presence: this.#options.gateway.presence,
        };

        return new Gateway(this.token, this.rest, options);
    }

    #resolveIntents(intents: GatewayIntents[] | Integer): Integer {
        if (Array.isArray(intents)) {
            return Number(BitfieldManager.from(intents).valueOf());
        }

        return intents;
    }
}