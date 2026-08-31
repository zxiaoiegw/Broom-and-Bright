# Job Duration Estimates

**Live** — this is now the actual duration model, not just a reference doc.
`getEstimatedDurationMinutes()` in `pricing.ts` implements the table below and
replaced the old flat per-service-type duration (`standard` 120 min / `deep`
180 min / `moveInOut` 240 min regardless of home size). `FreeQuote.tsx` calls
it wherever a duration is needed — the Schedule step's slot search, and the
`durationMinutes` sent with the booking.

This mirrors the same tiered structure already used for pricing in
`pricing.ts`/`PRICING.md`, reusing the same bedroom/bathroom/sqft/add-on
inputs the customer already enters — no new form fields needed.

Last updated: 2026-08-30

---

## How a duration would be calculated

```
base duration (by bedroom tier, same tiers as pricing)
  + bathroom time   (for baths above the tier's included amount)
  + square-foot time (for sq ft above the tier's included amount)
  + add-on time      (flat, per add-on selected)
  = estimated job length
```

Same tier boundaries as pricing (`PRICING_TIERS` in `pricing.ts`) so no new
inputs are needed — bedrooms/bathrooms/sqft are already collected.

---

## 1. Base duration by bedroom tier

| Tier | Bedrooms | Baths included | Sq ft included | Standard | Deep | Move-In/Out |
|---|---|---|---|---:|---:|---:|
| Studio / 1BR | ≤ 1 | up to 1.5 | up to 1,500 | **2h** | **3h** | **4h** |
| 2BR | 2 | up to 2.0 | up to 2,000 | 2.5h | 3.5h | 4.5h |
| 3BR | 3 | up to 2.5 | up to 2,500 | 3h | 4h | 5h |
| 4BR | 4 | up to 3.0 | up to 3,000 | 3.5h | 4.5h | 6h |
| 5BR+ | ≥ 5 | — | — | custom estimate | custom estimate | custom estimate |

Sq ft included mirrors `PRICING_TIERS`, so it moves in lockstep with
`PRICING.md` §1 — no separate baseline to maintain here.

The Studio/1BR row matches the example given: a 1BR / 1 bath / 700 sqft home
is within that tier's baseline (≤1.5 bath, ≤1,500 sqft), so it gets exactly
2h / 3h / 4h with no add-ons.

---

## 2. Extra time for bathrooms above the tier baseline

Same "half-bath step" measurement as pricing — e.g. 3BR baseline is 2.5 baths,
so 3.0 baths = one half-bath over, 3.5 baths = one full bath over.

| Each additional… | Standard | Deep | Move-In/Out |
|---|---:|---:|---:|
| Full bath (+1.0) | +15 min | +20 min | +25 min |
| Half bath (+0.5) | +10 min | +10 min | +10 min |

---

## 3. Extra time for square footage above the tier baseline

Charged per 100 sq ft over the baseline, rounded up. (Duration keeps the
rounded-up block count; pricing's sq ft surcharge now floors instead — see
`PRICING.md` §3. The two are independent, they just happen to share the same
`baseSquareFeet` baseline.)

| Each additional 100 sq ft | Standard | Deep | Move-In/Out |
|---|---:|---:|---:|
| | +10 min | +15 min | +20 min |

---

## 4. Extra time per add-on (flat, same for every tier/service)

| Add-on | Extra time |
|---|---:|
| Basement | +30 min |
| Inside Fridge | +20 min |
| Inside Oven | +20 min |
| Interior Windows | +20 min |
| Dishes | +15 min |
| Laundry | +20 min |
| Wall Spots | +15 min |

---

## 5. Hourly service

No estimate needed — the customer picks the hours directly (1–8), and that
number *is* the duration. This table only applies to the Standard/Deep/
Move-In-Out package flow.

---

## Worked examples

| Home | Service | Math | Estimated duration |
|---|---|---|---:|
| 1BR / 1 bath / 700 sqft | Standard | base 2h, no overage | **2h** |
| 1BR / 1 bath / 700 sqft | Deep | base 3h, no overage | **3h** |
| 1BR / 1 bath / 700 sqft | Move-In/Out | base 4h, no overage | **4h** |
| 3BR / 3.0 bath / 2,750 sqft | Standard | 3h + 10min (½ bath) + 30min (3 sqft blocks) | **3h 40min** |
| 2BR / 3.0 bath / 2,050 sqft, + Basement | Deep | 3.5h + 20min (full bath) + 15min (1 block) + 30min (basement) | **4h 35min** |
| 4BR / 4.0 bath / 3,320 sqft | Move-In/Out | 6h + 25min (full bath) + 80min (4 blocks) | **7h 45min** |

That last example is worth flagging: a 4BR move-out easily runs 7+ hours —
longer than a lot of staff's full working day. Once this is wired in, very
large jobs may need to be flagged for a custom/multi-day quote rather than
auto-booked into a single slot, similar to how 5BR+ already falls outside
pricing.

---

## Why this mattered for the calendar

Before this was wired in, every Deep Clean used the same flat 3-hour
estimate regardless of home size — so a small studio and a large 4BR booked
identical-length slots, even though a small home realistically finishes
faster (freeing up more of the day) and a big one realistically runs longer
(which could make a day look available when the real job wouldn't actually
fit). Now the duration reflects the actual home size + add-ons the customer
entered, so the calendar's "available" dates track reality more closely.

---

## Where this lives in the code

- `artifacts/broom-and-bright/src/pages/free-quote/pricing.ts` —
  `getEstimatedDurationMinutes(bedrooms, bathrooms, squareFeet, serviceKey, addons)`,
  mirroring `getServicePrice()`'s tier + surcharge math (`PRICING_TIERS`'
  `*Minutes` fields + `DURATION_SURCHARGES` + each add-on's `durationMinutes`).
- `artifacts/broom-and-bright/src/pages/FreeQuote.tsx` calls it for the
  Schedule step's slot search and for the `durationMinutes` sent with the
  booking — the client always computes and sends an explicit value now.
- `artifacts/api-server/src/routes/bookings.ts` — `DEFAULT_DURATION_MINUTES`
  is still there as a **last-resort fallback** for a request that omits
  `durationMinutes` entirely (the normal flow always sends one, so this
  rarely triggers). It still holds the old flat 120/180/240 numbers, which
  happen to equal the Studio/1BR row above — a reasonable conservative
  default, not a bug. The hourly flow is unaffected either way; it was never
  part of this table (see §5).
