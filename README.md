# Duration

An immutable, non-negative, Rust-inspired `Duration` type for JavaScript and TypeScript.

This library provides a small, predictable abstraction for representing spans of time with explicit units, saturating arithmetic, and strong invariants—without calendars, time zones, or parsing logic.

---

## Summary

`Duration` is a value-type abstraction for time intervals, modeled after Rust’s `std::time::Duration`.

It is designed for:

- timeouts
- delays
- retry/backoff logic
- infrastructure and systems-oriented code

The library prioritizes correctness, explicitness, and simplicity over feature breadth.

---

## What this library does

- Represents time as an immutable value (internally stored in nanoseconds)
- Enforces **non-negative durations**
- Provides **explicit unit constructors** (`seconds`, `milliseconds`, etc.)
- Supports **saturating arithmetic** (durations never go negative)
- Avoids all calendar, timezone, and locale concerns
- Ships with **full TypeScript type definitions**

### What it intentionally does not do

- Date/time manipulation
- Parsing human-readable strings
- Time zones or calendars
- Implicit unit coercion

---

## Installation

```sh
npm install duration-ts
```

---

## Usage

### Creating durations

```ts
import { Duration } from "duration-ts";

const a = Duration.fromSecs(2);
const b = Duration.fromMillis(500);
```

### Arithmetic

```ts
const total = a.add(b); // 2.5 seconds
const remaining = total.sub(Duration.fromSecs(5)); // saturates to 0
```

### Conversions

```ts
total.asMillis(); // 2500
total.asSecs(); // 2.5
```

### Comparisons

```ts
total.gt(Duration.fromSecs(2)); // true
total.eq(Duration.fromMillis(2500)); // true
```

### Utilities

```ts
Duration.ZERO.isZero(); // true

const clamped = total.clamp(Duration.fromSecs(1), Duration.fromSecs(3));
```

### Interop with Node.js APIs

```ts
setTimeout(() => {
  // ...
}, total.asMillis());
```

---

## Benefits of using this library

### Predictable semantics

- Durations never become negative
- No silent unit conversions
- No hidden calendar logic

### Safer than raw numbers

- Units are explicit at construction
- Arithmetic behavior is well-defined
- Fewer “milliseconds vs seconds” bugs

### Lightweight

- No dependencies
- Small API surface
- Tree-shakable
- Minimal runtime overhead

### TypeScript-first

- Strict typings included
- Works out of the box with modern ESM setups

---

## Design notes

- Internal unit: **nanoseconds**
- Arithmetic: **saturating**
- Mutability: **immutable**
- Module format: **ESM**
- Inspired by: Rust’s `std::time::Duration`

---

## Contributing

Contributions are welcome.

### Guidelines

1. Keep the API minimal and explicit
2. Maintain non-negative duration invariants
3. Preserve backward compatibility where possible
4. Run `npm run build` before submitting changes

## License

MIT License.

See the `LICENSE` file for details.
