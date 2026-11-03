---
title: MandiBhai — B2B Ordering Platform
slug: mandibhai
kicker: Freelance · B2B ordering
github: https://github.com/jaskiringg/mandibhai
live: null
download: /docs/mandibhai.md
---

# MandiBhai — B2B Wholesale Ordering

**Freelance work — not my startup, not my company.** I built the early version. The client's own team carries the product forward now, and it's still in development under them.

---

## The problem

Indian kirana retailers restock by phone call, WhatsApp thread and a physical trip to the mandi. Wholesalers track stock in spreadsheets. The gap isn't "they need an e-commerce app" — it's coordination:

1. **Sourcing is local, not national.** A retailer cares who can deliver atta today within a few kilometres. A national catalogue is noise.
2. **The same sack has five prices.** One SKU, several wholesalers, different rates — and the only way to compare was five phone calls.
3. **One cart, many suppliers.** A retailer's single purchase intent spans multiple wholesalers, but minimums and fulfilment are per supplier, not per cart.
4. **Overselling breaks trust fast.** Promising a case of dal that isn't there costs you the retailer permanently.
5. **Catalogue quality drifts.** Without a shared product layer, every wholesaler invents their own names and pack sizes, and search stops working.

---

## What I built

The early version of the marketplace — the retailer-facing mobile experience and the inventory, pricing and ordering APIs underneath it.

- **Geo-local sourcing,** so a retailer sees who can actually deliver to them rather than a national list.
- **Price comparison on a shared product layer,** so the same SKU from different wholesalers resolves to one item with the best live offer surfaced.
- **A multi-supplier cart that splits per wholesaler** before confirmation, with each supplier's minimum shown honestly instead of failing at checkout.
- **Stock integrity on order placement,** so accepted orders deduct real inventory and the platform doesn't promise what isn't there.
- **Wholesaler and admin surfaces** for inventory, incoming orders and keeping the shared catalogue clean.

---

## What it resolved

| Before | After |
|--------|-------|
| Restocking ran on phone calls and WhatsApp threads | One ordering flow a retailer can complete on a phone |
| Comparing prices meant calling five wholesalers | Same product resolved across suppliers, best live offer surfaced |
| A mixed basket had to be split by hand | Cart splits per wholesaler automatically, minimums visible before confirming |
| Overselling was a live risk | Stock deducted as part of placing the order |
| Every wholesaler named products their own way | A shared catalogue layer with moderation |

Moving wholesaler-to-retailer orders off manual coordination was the point. Whether that scales commercially is the client's team's story now, not mine.

---

## Where it got to

| | |
|---|---|
| **Built and demoed** | Retailer, wholesaler and admin flows end to end; multi-supplier cart with per-order stock integrity |
| **Partially built** | Shared catalogue moderation surfaces |
| **Not built** | Production phone auth, payments, Play Store release |

---

## The retailer experience

![Retailer home — location, search, same-day banner, categories, buy again, cart bar](/shots/mandibhai-ui-home.jpg)

*Home: location first, same-day promise up top, reorder path close to hand.*

![Categories rail with product cards and floating cart summary](/shots/mandibhai-ui-categories.jpg)

*Browsing by category with a persistent cart summary.*

![Cart split across two wholesalers with per-seller MOQ progress](/shots/mandibhai-ui-cart-split.jpg)

*The cart split across two wholesalers, each with its own minimum — shown before confirmation, not after a failure.*

![Buy in bulk product grid with case packs and View cart](/shots/mandibhai-ui-bulk.jpg)

*Bulk ordering by case pack, which is how retailers actually buy.*

---

## Stack

Next.js · NestJS · PostgreSQL · Capacitor (Android)

---

## Status

Freelance. I built the early version — the mobile marketplace and its inventory, pricing and ordering APIs. **The client's team continues development.** It was never my company.
