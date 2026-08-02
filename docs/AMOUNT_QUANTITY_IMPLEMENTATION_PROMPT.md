# Implementation prompt — AMOUNT sheet quantity equations

Copy everything below the line into an LLM together with two attachments:
1. `AMOUNT_N5_N40_schema_fields.md` (the 36 expanded equations, schema-field form)
2. Your Prisma models in `prisma/models/*.prisma`

---

## Role

You are implementing the quantity-calculation engine for a Pre-Engineered Building
(PEB) cost estimator. The math was reverse-engineered from an Excel workbook and is
authoritative — do not invent or "improve" formulas. Your job is a faithful, verifiable
translation of 36 given equations into code, one function per line item.

## What you are given

For each line item `N5`..`N40` you get a block like:

```
## AMOUNT - N12
**Line item:** CANOPY SHEET
**Unit:** SQM
**Original Excel formula:** =QUANTITY!T92
**Computed value:** 30
    AMOUNT!N12 =
    canopy.canopies[0].length × canopy.canopies[0].width
    = 30
```

- **Line item / Unit** — the output row's description and unit (KG / RM / SQM / NOS).
- **Original Excel formula** — the native cell formula (reference only; already expanded for you).
- **Computed value** — the number this must equal for the sample job (your test oracle).
- The fenced block is the **fully-expanded equation**: the only thing you implement.

## How to read a token in the equation

Every token is one of five things:

1. **Scalar field on a 1-to-1 relation** — e.g. `roof.buildingOverallWidth`,
   `accessories.turboVentilatorNos`. Read as `job.roof.buildingOverallWidth`.
2. **Field on a 1-to-many record, keyed** — e.g. `roof.sidewalls[LEFT].height`,
   `joint.jointBoltRoof[I].numberOfBolts`, `accessories.openings[ROLLING_SHUTTER].nos`.
   The bracket holds a **enum value / code**, NOT an array index. Look the record up by
   that key: `job.roof.sidewalls.find(w => w.side === 'LEFT').height`. Hyphenated sheet
   codes use the Prisma enum member name: sheet "B_1" → `B_1` (schema `B_1 @map("B_1")`).
3. **Field on a 1-to-many record, indexed** — e.g. `mezzanine.floors[0].lengthM`,
   `canopy.canopies[0].length`, `stair.stairs[0].height`. The bracket is a **0-based
   position** in the ordered collection. `[0]` = first row entered, `[1]` = second, etc.
   Prefer ordering the collection deterministically (by a `code`/`createdAt`) before indexing.
4. **Literal** — a number (`10.76`, `0.14`, `7850`) or `PI()`. Use as-is.
5. **`QUANTITY!XXX` cell** — a constant baked into the calc sheet (NOT a job input).
   Substitute the literal from the QUANTITY-CONSTANTS table below.
6. **`«SHEET!CELL»` (angle-quoted)** — an input with **no schema field yet**
   (six flashing running-lengths, `ACCESSORIES!Z5..Z10`). These are server-derived from
   roof geometry. Treat as a TODO input parameter; for the sample job use the fallback
   values in the FLAGGED-CELLS table below so your test still matches.

## Operator and function semantics

The equations use mathematical symbols; translate them to code as follows:

| Equation token | Code equivalent | Notes |
|---|---|---|
| `×` | `*` | multiplication |
| `−` | `-` | subtraction (different glyph from hyphen) |
| `/` | `/` | division — guard denominator: `d === 0 ? 0 : x / d` |
| `^` | `**` | exponentiation — higher precedence than `* /` |
| `+` | `+` | |
| `SQRT(x)` | `Math.sqrt(x)` | |
| `COS(x)` | `Math.cos(x)` | angles are **already in radians** in the equation |
| `SIN(x)` | `Math.sin(x)` | (the `× PI() / 180` factor is already written in) |
| `TAN(x)` | `Math.tan(x)` | |
| `PI()` | `Math.PI` | |
| `ABS(x)` | `Math.abs(x)` | |
| `INT(x)` | `Math.floor(x)` | |
| `MAX(a,b,…)` | `Math.max(a,b,…)` | |
| `MIN(a,b,…)` | `Math.min(a,b,…)` | |
| `ROUND(x, n)` | half-up rounding to n decimals | JS `Math.round` is NOT half-up — implement explicitly |
| `CEILING(x, s)` | `Math.ceil(x / s) * s` | round up to nearest multiple of s |
| `FLOOR(x, s)` | `Math.floor(x / s) * s` | round down to nearest multiple of s |

**Precedence:** parentheses > `^` > `× /` > `+ −`. The equations include explicit
parentheses; honour them exactly.

Half-up ROUND helper:
```ts
function roundHalfUp(x: number, decimals: number): number {
  const f = 10 ** decimals;
  return Math.round((x + Number.EPSILON) * f) / f;
}
```

## Data-handling rules

These rules let every function stay free of null-checks in the formula body:

```ts
const n = (v: unknown): number => (v == null ? 0 : Number(v));

// keyed lookup — returns a zero-valued proxy when the record is absent
function byKey<T extends object>(arr: T[] | null | undefined,
  pred: (r: T) => boolean): T {
  return arr?.find(pred) ?? ({} as T);
}
```

- **Prisma `Decimal` → number**: always pass through `n(...)`. Prisma Decimal is not a JS
  number; arithmetic on it is undefined.
- **`null` / `undefined` field → 0**: `n(record?.field)` safely returns 0 for any absent
  optional field. This matches Excel's blank-cell behaviour.
- **Missing relation record → 0**: if `job.canopy` is null, `n(job.canopy?.canopies?.[0]?.length)`
  returns 0, collapsing the whole canopy section — correct for jobs that have no canopy.
- **Divide-by-zero → 0**: wrap any denominator: `const d = n(...); d === 0 ? 0 : x / d`.

## Where these equations came from (so you trust them)

Each equation is the Excel `AMOUNT!Nx` formula with every referenced cell recursively
inlined to raw input cells, all `IF(...)` enable-switches resolved for a fully-configured
building (dead/zero branches dropped), and each input cell renamed to its Prisma field by
matching the label printed beside it in the sheet. Every equation was re-evaluated and
equals the Excel cached value shown. **Assumption baked in:** all optional sections
(canopy, mezzanine, stair, fascia, extensions) are ENABLED. Because a missing record → 0,
an absent section collapses to zero and the same equation stays correct — with one caveat
in Gotchas.

## Your task

For each line item N5..N40 write one pure function returning the QUANTITY (column N):

```ts
function qtyN12(job: JobWithRelations): number {
  // canopy.canopies[0].length × canopy.canopies[0].width
  const c0 = job.canopy?.canopies?.[0];
  return n(c0?.length) * n(c0?.width);
}
```

- Translate each equation **verbatim** — same ops, order, and parentheses.
- One function per line item (`qtyN5`..`qtyN40`).
- Add a unit test per function: `expect(Math.abs(fn(sampleJob) - COMPUTED)).toBeLessThan(1e-6)`,
  using the block's **Computed value** as the oracle.
- The line-item **amount** (column T) = `quantity × rate` (`rateFabrication/Erection/Loading`
  on the `Amount`/`Rate` models). Separate step — this task is column N only.

## QUANTITY-CONSTANTS (substitute these literals)

`QUANTITY!` tokens are fixed calc-sheet values, not job inputs. Replace with the literal:

| token | value | token | value | token | value |
|---|---|---|---|---|---|
| AD71 | 1 | P82 | 53 | T31 | 5432 |
| AD75 | 1 | P84 | 44 | T35 | 6756 |
| AD78 | 1 | P85 | 54 | T42 | 767 |
| AD79 | 1 | P86 | 65 | T66 | 3677 |
| AD84 | 1 | P87 | 75 | T133 | 4756 |
| AD85 | 1 | P138 | 5580 | T137 | 46 |
| AD86 | 2 | P139 | 6565 | T145 | 456 |
| AD87 | 2 | T8 | 456 | T147 | 457 |
| AD89 | 1 | T13 | 565 | T150 | 10 |
| AD90 | 2 | T21 | 456 | T151 | 11 |
| AD91 | 1 | T27 | 4564 | T152 | 12 |
|  |  |  |  | T153 | 13 |
|  |  |  |  | T154 | 14 |
|  |  |  |  | T155 | 15 |

> These literals reproduce the sample workbook exactly (those cells held hardcoded numbers,
> not formulas). If your production calc should compute them, swap in the sub-formula later.

## FLAGGED-CELLS (no schema field — sample fallbacks)

`«ACCESSORIES!Z5..Z10»` are flashing running-lengths derived from roof geometry. Sample
values: Z5=246, Z6=229, Z7=456, Z8=46, Z9=23, Z10=412 (only Z8, Z9 appear — in N21).
Expose as parameters and wire to your geometry derivation later.

## Gotchas (read before finishing)

1. **N14 has a faithful bug.** The 2nd mezzanine floor's secondary-beam term uses
   `joint.canopyNumberOfBolts` where the 1st floor uses `joint.secondaryBeamsNumberOfBolts`.
   This mirrors an Excel copy-paste slip. Reproduce it as written to match the oracle, but
   flag it — production code should almost certainly use `secondaryBeamsNumberOfBolts`.
2. **Keyed vs indexed brackets.** `[LEFT]`, `[I]`, `[ROLLING_SHUTTER]` = look up by
   enum/code. `[0]`, `[1]` = ordered position. Don't confuse them.
3. **`−` is not `-`.** The minus in equations is U+2212; normalise before parsing if you
   tokenise programmatically.
4. **Trig args are already radians** — do not add another `× PI()/180`.
5. **Enable-switch caveat.** These equations assume sections are on. If a section can be
   toggled off while its records still exist (non-empty but disabled), null→0 won't cover
   it — you'd need the original `IF(sectionEnabled, …, 0)` gate. If "disabled" always means
   "no records", you're fine.

## Definition of done

All 36 functions written, each with a passing test against its Computed value (±1e-6),
the N14 quirk flagged in a comment, and flashing inputs parameterised. Report any equation
whose test fails rather than tweaking the formula to force a match.

