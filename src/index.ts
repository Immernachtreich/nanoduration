/* ===========================
 * PositiveNumber (unforgeable)
 * =========================== */

/**
 * Nominal type representing a non-negative finite number.
 *
 * This type is intentionally unforgeable outside this module.
 * All values of this type are guaranteed to be:
 * - finite
 * - >= 0
 *
 * Used internally to enforce non-negative duration semantics.
 */
declare const PositiveBrand: unique symbol;
type PositiveNumber = number & { readonly [PositiveBrand]: true };

/**
 * Converts a number into a {@link PositiveNumber} using saturating semantics.
 *
 * - Non-finite values (`NaN`, `Infinity`, `-Infinity`) throw.
 * - Negative values are clamped to `0`.
 *
 * @param num - Input number
 * @returns A non-negative finite number
 * @throws {RangeError} If the value is not finite
 */
function toPositive(num: number): PositiveNumber {
  if (!Number.isFinite(num)) {
    throw new RangeError("Value must be finite");
  }

  // Saturating semantics: never negative
  return (num <= 0 ? 0 : num) as PositiveNumber;
}

/* ===========================
 * Duration
 * =========================== */

/**
 * Represents an immutable, non-negative span of time.
 *
 * ## Design characteristics
 * - Internally stored as nanoseconds
 * - Saturating arithmetic (never becomes negative)
 * - No calendar, timezone, or locale semantics
 * - Explicit unit construction and observation
 *
 * This type is intended for:
 * - Timeouts
 * - Intervals
 * - Backoff calculations
 * - System and infrastructure code
 */
export class Duration {
  /** Nanoseconds per microsecond */
  private static readonly NS_PER_MICRO = 1e3;

  /** Nanoseconds per millisecond */
  private static readonly NS_PER_MILLI = 1e6;

  /** Nanoseconds per second */
  private static readonly NS_PER_SECOND = 1e9;

  /** Nanoseconds per minute */
  private static readonly NS_PER_MINUTE = 60 * Duration.NS_PER_SECOND;

  /** Nanoseconds per hour */
  private static readonly NS_PER_HOUR = 60 * Duration.NS_PER_MINUTE;

  /**
   * A duration of zero length.
   */
  public static readonly ZERO = new Duration(toPositive(0));

  private readonly nanoseconds: PositiveNumber;

  /**
   * Internal constructor.
   *
   * All instances are guaranteed to contain a non-negative,
   * finite number of nanoseconds.
   */
  private constructor(nanoseconds: PositiveNumber) {
    this.nanoseconds = nanoseconds;
  }

  /* ============
   * Constructors
   * ============ */

  /**
   * Creates a duration from nanoseconds.
   *
   * @param nanos - Number of nanoseconds
   */
  public static fromNanos(nanos: number): Duration {
    return new Duration(toPositive(nanos));
  }

  /**
   * Creates a duration from microseconds.
   *
   * @param micros - Number of microseconds
   */
  public static fromMicros(micros: number): Duration {
    return new Duration(toPositive(micros * Duration.NS_PER_MICRO));
  }

  /**
   * Creates a duration from milliseconds.
   *
   * @param millis - Number of milliseconds
   */
  public static fromMillis(millis: number): Duration {
    return new Duration(toPositive(millis * Duration.NS_PER_MILLI));
  }

  /**
   * Creates a duration from seconds.
   *
   * @param secs - Number of seconds
   */
  public static fromSecs(secs: number): Duration {
    return new Duration(toPositive(secs * Duration.NS_PER_SECOND));
  }

  /**
   * Creates a duration from minutes.
   *
   * @param minutes - Number of minutes
   */
  public static fromMinutes(minutes: number): Duration {
    return new Duration(toPositive(minutes * Duration.NS_PER_MINUTE));
  }

  /**
   * Creates a duration from hours.
   *
   * @param hours - Number of hours
   */
  public static fromHours(hours: number): Duration {
    return new Duration(toPositive(hours * Duration.NS_PER_HOUR));
  }

  /* =========
   * Observers
   * ========= */

  /**
   * Returns the total duration in nanoseconds.
   */
  public asNanos(): number {
    return this.nanoseconds;
  }

  /**
   * Returns the total duration in microseconds.
   */
  public asMicros(): number {
    return this.nanoseconds / Duration.NS_PER_MICRO;
  }

  /**
   * Returns the total duration in milliseconds.
   */
  public asMillis(): number {
    return this.nanoseconds / Duration.NS_PER_MILLI;
  }

  /**
   * Returns the total duration in seconds.
   */
  public asSecs(): number {
    return this.nanoseconds / Duration.NS_PER_SECOND;
  }

  /**
   * Returns the total duration in minutes.
   */
  public asMinutes(): number {
    return this.nanoseconds / Duration.NS_PER_MINUTE;
  }

  /**
   * Returns the total duration in hours.
   */
  public asHours(): number {
    return this.nanoseconds / Duration.NS_PER_HOUR;
  }

  /* ==========
   * Arithmetic
   * ==========
   * Saturating semantics
   */

  /**
   * Returns the sum of this duration and another.
   *
   * If the result would be negative or overflow, it saturates at zero
   * or throws respectively.
   */
  public add(other: Duration): Duration {
    return new Duration(toPositive(this.nanoseconds + other.nanoseconds));
  }

  /**
   * Returns the difference between this duration and another.
   *
   * If the result would be negative, it saturates at zero.
   */
  public sub(other: Duration): Duration {
    return new Duration(toPositive(this.nanoseconds - other.nanoseconds));
  }

  /**
   * Multiplies this duration by a factor.
   *
   * Negative or non-finite results saturate at zero or throw.
   */
  public mul(factor: number): Duration {
    return new Duration(toPositive(this.nanoseconds * factor));
  }

  /**
   * Divides this duration by a divisor.
   *
   * @throws {RangeError} If divisor is zero
   */
  public div(divisor: number): Duration {
    if (divisor === 0) {
      throw new RangeError("Division by zero");
    }

    return new Duration(toPositive(this.nanoseconds / divisor));
  }

  /* ===========
   * Comparisons
   * =========== */

  /**
   * Returns true if both durations are equal.
   */
  public eq(other: Duration): boolean {
    return this.nanoseconds === other.nanoseconds;
  }

  /**
   * Returns true if this duration is less than the other.
   */
  public lt(other: Duration): boolean {
    return this.nanoseconds < other.nanoseconds;
  }

  /**
   * Returns true if this duration is less than or equal to the other.
   */
  public le(other: Duration): boolean {
    return this.nanoseconds <= other.nanoseconds;
  }

  /**
   * Returns true if this duration is greater than the other.
   */
  public gt(other: Duration): boolean {
    return this.nanoseconds > other.nanoseconds;
  }

  /**
   * Returns true if this duration is greater than or equal to the other.
   */
  public ge(other: Duration): boolean {
    return this.nanoseconds >= other.nanoseconds;
  }

  /* =========
   * Utilities
   * ========= */

  /**
   * Returns true if this duration is zero.
   */
  public isZero(): boolean {
    return this.nanoseconds === 0;
  }

  /**
   * Clamps this duration between a minimum and maximum.
   *
   * @throws {RangeError} If min is greater than max
   */
  public clamp(min: Duration, max: Duration): Duration {
    if (min.gt(max)) {
      throw new RangeError("min must be <= max");
    }

    return new Duration(
      toPositive(
        Math.min(Math.max(this.nanoseconds, min.nanoseconds), max.nanoseconds),
      ),
    );
  }

  /**
   * Returns a human-readable string representation.
   *
   * Chooses the largest unit that divides evenly.
   * Values are rounded to 6 decimal places when needed.
   */
  public toString(): string {
    const round = (n: number) =>
      Number.isInteger(n) ? n : Number(n.toFixed(6));

    if (this.nanoseconds % Duration.NS_PER_HOUR === 0)
      return `${round(this.asHours())}h`;

    if (this.nanoseconds % Duration.NS_PER_MINUTE === 0)
      return `${round(this.asMinutes())}m`;

    if (this.nanoseconds % Duration.NS_PER_SECOND === 0)
      return `${round(this.asSecs())}s`;

    if (this.nanoseconds % Duration.NS_PER_MILLI === 0)
      return `${round(this.asMillis())}ms`;

    if (this.nanoseconds % Duration.NS_PER_MICRO === 0)
      return `${round(this.asMicros())}µs`;

    return `${this.nanoseconds}ns`;
  }
}
