---
title: Mandi Bhai
slug: mandibhai
kicker: Freelance · wholesale commerce · transferred
github: https://github.com/jaskiringg/mandibhai
live: null
download: /docs/mandibhai.md
---

# Mandi Bhai

**Transferred to their team.** Freelance — not my startup. I built the early version. I do not operate the current marketplace. No live URL on this page.

B2B wholesale marketplace: retailers compare SKUs across mandi wholesalers, split carts by supplier minimums, and place orders on same-day promise.

---

## Context

Wholesalers at the local mandi sold to neighborhood shops through phone calls and informal lists. Inventory, price and order lived in different conversations — hard to compare the same SKU across suppliers or respect each wholesaler's minimum order.

## Problem

- Retailers could not see comparable pricing for the same product across wholesalers.
- Carts mixed SKUs from multiple suppliers without per-supplier minimum visibility.
- Stock and order state was manual — easy to oversell or confirm twice.

## Role

Sole builder of the early mobile marketplace and the inventory, pricing and ordering APIs underneath it, then handover to the client's team.

## Architecture

```
Wholesaler catalog · stock · price
        ↓
Marketplace APIs (inventory · pricing · ordering)
        ↓
Retailer browse · compare · split cart · confirm
        ↓
Stock deduction on placement (early version)
```

## Implementation

- **Shared product layer** so the same SKU can be compared across wholesalers.
- **Split cart** per wholesaler before confirmation, with each supplier minimum visible.
- **Order placement** with stock deducted in the early version I shipped.
- **Mobile-first retailer UI** with wholesaler back-office flows behind the APIs.

## Screens

![Retailer home](/shots/mandibhai-ui-home.jpg)

*Home — discovery and entry.*

![Categories](/shots/mandibhai-ui-categories.jpg)

*Category browse.*

![Split cart](/shots/mandibhai-ui-cart-split.jpg)

*Cart split across wholesalers, each with its own minimum.*

![Buy in bulk](/shots/mandibhai-ui-bulk.jpg)

*Bulk ordering by case pack.*

## Stack

Next.js · NestJS · PostgreSQL · Capacitor (Android)

## Outcomes

Transferred to their team. No adoption, GMV or revenue claims — not my company, and I do not operate the product today.