/**
 * Represents a value that can be resolved to a bitfield.
 * It can be an array of T, bigint, or string representations of bigint,
 * an instance of BitfieldManager, a single T, a bigint, or a string representation of a bigint.
 */
export type BitfieldResolvable<T> = (T | bigint | `${bigint}`)[] | BitfieldManager<T> | T | bigint | `${bigint}`;

/**
 * A class that manages bitfields with type-safe flag operations.
 */
export class BitfieldManager<T> {
    /**
     * The internal bitfield value.
     */
    #bitfield: bigint;
    /**
     * Creates a new BitfieldManager instance.
     *
     * @param value - The initial value of the bitfield. Can be an array of flags or a bigint.
     * @throws TypeError If the initial value is neither a bigint nor an array of flags.
     */
    constructor(value: T[] | bigint = 0n) {
        if (typeof value === "bigint") {
            this.#bitfield = value;
        } else if (Array.isArray(value)) {
            this.#bitfield = value.reduce((acc, val) => acc | this.#resolve(val), 0n);
        } else {
            throw new TypeError("Initial value must be a bigint or an array of flags");
        }
    }

    /**
     * Creates a new BitfieldManager instance from various input types.
     *
     * @param value - The value to create the BitfieldManager from.
     * @returns A new BitfieldManager instance.
     */
    static from<F>(value: BitfieldManager<F> | F[] | bigint): BitfieldManager<F> {
        if (value instanceof BitfieldManager) {
            return new BitfieldManager(value.valueOf());
        }

        return new BitfieldManager(value);
    }

    /**
     * Checks if the bitfield has a specific flag set.
     *
     * @param val - The flag to check for.
     * @returns True if the flag is set, false otherwise.
     */
    has(val: T): boolean {
        const bit = this.#resolve(val);
        return (this.#bitfield & bit) === bit;
    }

    /**
     * Adds one or more flags to the bitfield.
     *
     * @param flags - The flags to add.
     * @returns This BitfieldManager instance.
     */
    add(...flags: T[]): this {
        for (const flag of flags) {
            this.#bitfield |= this.#resolve(flag);
        }
        return this;
    }

    /**
     * Removes one or more flags from the bitfield.
     *
     * @param flags - The flags to remove.
     * @returns This BitfieldManager instance.
     */
    remove(...flags: T[]): this {
        for (const flag of flags) {
            this.#bitfield &= ~this.#resolve(flag);
        }
        return this;
    }

    /**
     * Toggles one or more flags in the bitfield.
     *
     * @param flags - The flags to toggle.
     * @returns This BitfieldManager instance.
     */
    toggle(...flags: T[]): this {
        for (const flag of flags) {
            this.#bitfield ^= this.#resolve(flag);
        }
        return this;
    }

    /**
     * Gets the raw bitfield value.
     *
     * @returns The raw bitfield value as a bigint.
     */
    valueOf(): bigint {
        return this.#bitfield;
    }

    /**
     * Resolves a value to a bitfield.
     *
     * @param value - The value to resolve. It can be a single value or an array of values.
     * @returns The resolved bigint bitfield.
     * @throws TypeError If the value is of an invalid type.
     * @throws Error If a number value is not a non-negative integer.
     */
    #resolve(value: BitfieldResolvable<T> | BitfieldResolvable<T>[]): bigint {
        if (Array.isArray(value)) {
            return value.reduce<bigint>((acc, val) => acc | this.#resolve(val), 0n);
        }

        if (typeof value === "bigint") {
            if (value < 0n) {
                throw new TypeError("Bitfield value cannot be negative");
            }
            return value;
        }

        if (typeof value === "number") {
            if (!Number.isInteger(value) || value < 0) {
                throw new TypeError("Number must be a non-negative integer");
            }

            return BigInt(value);
        }

        if (typeof value === "string") {
            return this.#assertValidBigInt(value);
        }

        throw new TypeError("Invalid type for bitfield value");
    }

    /**
     * Asserts that a string represents a valid BigInt and returns it.
     *
     * @param value The string to validate and convert.
     * @returns The validated BigInt.
     * @throws Error if the string is not a valid BigInt representation.
     */
    #assertValidBigInt(value: string): bigint {
        const trimmedValue = value.trim();

        if (trimmedValue.length === 0) {
            throw new Error("Empty string is not a valid BigInt");
        }

        if (!/^-?\d+$/.test(trimmedValue)) {
            throw new Error("Invalid BigInt format");
        }

        try {
            const result = BigInt(trimmedValue);

            if (result < 0n) {
                throw new Error("BigInt must be non-negative for bitfield operations");
            }

            return result;
        } catch (error) {
            if (error instanceof Error) {
                throw new TypeError(`Failed to create BigInt: ${error.message}`);
            } else {
                throw new TypeError("Failed to create BigInt: Unknown error");
            }
        }
    }
}