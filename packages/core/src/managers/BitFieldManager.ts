export type BitFieldResolvable<T> =
  | (T | bigint | `${bigint}`)[]
  | BitFieldManager<T>
  | T
  | bigint
  | `${bigint}`;

export class BitFieldManager<T> {
  static readonly BIGINT_REGEX = /^-?\d+$/;
  static readonly MAX_SAFE_INTEGER = BigInt(Number.MAX_SAFE_INTEGER);
  static readonly DEFAULT_RADIX = 16;

  readonly #bitfield: bigint;
  readonly #frozen: boolean;

  constructor(value: BitFieldResolvable<T> = 0n, frozen = false) {
    this.#bitfield = this.#resolve(value);
    this.#frozen = frozen;
  }

  static from<F>(value: BitFieldResolvable<F>): BitFieldManager<F> {
    return new BitFieldManager(value);
  }

  static fromBinary(binary: string): BitFieldManager<unknown> {
    if (!/^[01]+$/.test(binary)) {
      throw new Error("Invalid binary string");
    }
    return new BitFieldManager(BigInt(`0b${binary}`));
  }

  static isValid(value: unknown): value is bigint {
    try {
      new BitFieldManager(value);
      return true;
    } catch {
      return false;
    }
  }

  static combine<F>(...bitfields: BitFieldResolvable<F>[]): BitFieldManager<F> {
    return new BitFieldManager<F>(
      bitfields.reduce<bigint>(
        (acc, bf) => acc | new BitFieldManager(bf).valueOf(),
        0n,
      ),
    );
  }

  static intersection<F>(
    ...bitfields: BitFieldResolvable<F>[]
  ): BitFieldManager<F> {
    return new BitFieldManager<F>(
      bitfields.reduce<bigint>(
        (acc, bf) => acc & new BitFieldManager(bf).valueOf(),
        ~0n,
      ),
    );
  }

  has(val: T): boolean {
    const bit = this.#resolve(val);
    return (this.#bitfield & bit) === bit;
  }

  hasAll(flags: T[]): boolean {
    const bits = this.#resolve(flags);
    return (this.#bitfield & bits) === bits;
  }

  hasAny(flags: T[]): boolean {
    const bits = this.#resolve(flags);
    return (this.#bitfield & bits) !== 0n;
  }

  hasExactly(...flags: T[]): boolean {
    const bits = this.#resolve(flags);
    return this.#bitfield === bits;
  }

  missing(flags: T[]): bigint[] {
    const bits = this.#resolve(flags);
    return BitFieldManager.from(bits & ~this.#bitfield).toArray();
  }

  isEmpty(): boolean {
    return this.#bitfield === 0n;
  }

  equals(other: BitFieldResolvable<T>): boolean {
    return this.#bitfield === this.#resolve(other);
  }

  add(...flags: T[]): this {
    this.#ensureUnfrozen();
    this.#setBitfield(this.#bitfield | this.#resolve(flags));
    return this;
  }

  remove(...flags: T[]): this {
    this.#ensureUnfrozen();
    this.#setBitfield(this.#bitfield & ~this.#resolve(flags));
    return this;
  }

  toggle(...flags: T[]): this {
    this.#ensureUnfrozen();
    this.#setBitfield(this.#bitfield ^ this.#resolve(flags));
    return this;
  }

  set(flags: T[]): this {
    this.#ensureUnfrozen();
    this.#setBitfield(this.#resolve(flags));
    return this;
  }

  clear(): this {
    this.#ensureUnfrozen();
    this.#setBitfield(0n);
    return this;
  }

  freeze(): BitFieldManager<T> {
    return new BitFieldManager<T>(this.#bitfield, true);
  }

  clone(): BitFieldManager<T> {
    return new BitFieldManager<T>(this.#bitfield, this.#frozen);
  }

  toArray(): bigint[] {
    const result: bigint[] = [];
    let currentBit = 1n;
    let value = this.#bitfield;

    while (value > 0n) {
      if ((value & currentBit) === currentBit) {
        result.push(currentBit);
      }
      currentBit <<= 1n;
      value &= ~currentBit;
    }

    return result;
  }

  toJson(): { bitfield: string; flags: string[] } {
    return {
      bitfield: this.#bitfield.toString(),
      flags: this.toArray().map((bit) => bit.toString()),
    };
  }

  count(): number {
    let count = 0;
    let value = this.#bitfield;

    while (value > 0n) {
      count += Number(value & 1n);
      value >>= 1n;
    }

    return count;
  }

  toString(radix = BitFieldManager.DEFAULT_RADIX): string {
    return this.#bitfield.toString(radix);
  }

  toBinaryString(): string {
    return this.#bitfield.toString(2);
  }

  valueOf(): bigint {
    return this.#bitfield;
  }

  rotateLeft(n: number): BitFieldManager<T> {
    if (n < 0) {
      return this.rotateRight(-n);
    }
    const bits = BigInt(n);
    const newValue =
      (this.#bitfield << bits) | (this.#bitfield >> (64n - bits));

    return new BitFieldManager<T>(newValue);
  }

  rotateRight(n: number): BitFieldManager<T> {
    if (n < 0) {
      return this.rotateLeft(-n);
    }
    const bits = BigInt(n);
    const newValue =
      (this.#bitfield >> bits) | (this.#bitfield << (64n - bits));

    return new BitFieldManager<T>(newValue);
  }

  leadingZeros(): number {
    let count = 0;
    let value = this.#bitfield;

    while (value > 0n) {
      value >>= 1n;
      count++;
    }

    return 64 - count;
  }

  trailingZeros(): number {
    if (this.#bitfield === 0n) {
      return 64;
    }
    let count = 0;
    let value = this.#bitfield;

    while ((value & 1n) === 0n) {
      value >>= 1n;
      count++;
    }

    return count;
  }

  #resolve(value: BitFieldResolvable<T> | BitFieldResolvable<T>[]): bigint {
    if (value instanceof BitFieldManager) {
      return value.valueOf();
    }

    if (Array.isArray(value)) {
      return value.reduce<bigint>((acc, val) => acc | this.#resolve(val), 0n);
    }

    if (typeof value === "bigint") {
      return this.#validateBigInt(value);
    }

    if (typeof value === "number") {
      if (!Number.isInteger(value) || value < 0) {
        throw new TypeError("Number must be a non-negative integer");
      }
      return this.#validateBigInt(BigInt(value));
    }

    if (typeof value === "string") {
      return this.#assertValidBigInt(value);
    }

    throw new TypeError(`Invalid type for bitfield value: ${typeof value}`);
  }

  #validateBigInt(value: bigint): bigint {
    if (value < 0n) {
      throw new TypeError("Bitfield value cannot be negative");
    }
    if (value > BitFieldManager.MAX_SAFE_INTEGER) {
      throw new TypeError("Bitfield value exceeds maximum safe integer");
    }
    return value;
  }

  #assertValidBigInt(value: string): bigint {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      throw new Error("Empty string is not a valid BigInt");
    }

    if (!BitFieldManager.BIGINT_REGEX.test(trimmedValue)) {
      throw new Error("Invalid BigInt format");
    }

    try {
      const result = BigInt(trimmedValue);
      return this.#validateBigInt(result);
    } catch (error) {
      throw new Error(
        `Failed to create BigInt: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  #setBitfield(value: bigint): void {
    Object.defineProperty(this, "#bitfield", {
      value: this.#validateBigInt(value),
      writable: true,
      configurable: false,
    });
  }

  #ensureUnfrozen(): void {
    if (this.#frozen) {
      throw new Error("Cannot modify a frozen BitFieldManager");
    }
  }
}
