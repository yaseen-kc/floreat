/**
 * Wire-format TypeScript primitives shared across the HTTP boundary.
 *
 * Prisma `Decimal` columns serialise to JSON **strings** (`Decimal.prototype.toJSON`),
 * so response/wire types model numeric-precision fields as {@link DecimalString}
 * even where the create/update payload accepts `number`. Optional columns arrive
 * as `null` over the wire — model those with {@link Nullable}.
 */

/** A Prisma `Decimal` value serialised over HTTP as a JSON string. */
export type DecimalString = string

/** A wire value that may be absent — serialised as `null` over HTTP. */
export type Nullable<T> = T | null
