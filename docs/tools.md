---
title: Tools reference
nav_order: 4
---

# Tools reference

Every tool is **read-only** and returns the parsed Query API response as
pretty-printed JSON. Dates use the NMI datetime format **`YYYYMMDDhhmmss`**
(e.g. `20260101000000` = 2026-01-01 00:00:00).

---

## Transactions

### `get_transaction`
Fetch a single transaction by its gateway transaction ID.

| Param | Type | Required | Description |
|---|---|---|---|
| `transaction_id` | string | ✅ | Gateway transaction ID. |

### `search_transactions`
Search transactions by date range and optional filters.

| Param | Type | Description |
|---|---|---|
| `start_date` | string | Range start, `YYYYMMDDhhmmss`. |
| `end_date` | string | Range end, `YYYYMMDDhhmmss`. |
| `condition` | string | Comma-separated: `pending`, `pendingsettlement`, `in_progress`, `abandoned`, `failed`, `canceled`, `complete`, `unknown`. |
| `action_type` | string | Comma-separated: `sale`, `refund`, `credit`, `auth`, `capture`, `void`, `return`. |
| `transaction_type` | string | `cc` (card) or `ck` (ACH/check). |
| `source` | string | Transaction source. |
| `email` | string | Customer email. |
| `order_id` | string | Merchant order id. |

All filters are optional; combine them to narrow results.

---

## Subscriptions

### `get_subscription`
Fetch one recurring subscription (`report_type=recurring`).

| Param | Type | Required | Description |
|---|---|---|---|
| `subscription_id` | string | ✅ | Recurring subscription ID. |

### `list_subscriptions`
List recurring subscriptions, optionally by date.

| Param | Type | Description |
|---|---|---|
| `date_search` | string | `created`, `updated`, or `created,updated`. |
| `start_date` | string | Range start, `YYYYMMDDhhmmss`. |
| `end_date` | string | Range end, `YYYYMMDDhhmmss`. |

---

## Recurring plans

### `list_recurring_plans`
List recurring billing plans (`report_type=recurring_plans`).

| Param | Type | Description |
|---|---|---|
| `plan_id` | string | Optional — return a single plan instead of all. |

---

## Customer Vault

### `get_customer_vault_record`
Fetch one stored Customer Vault record (`report_type=customer_vault`). Returns
stored profile metadata only — the gateway never returns full card numbers.

| Param | Type | Required | Description |
|---|---|---|---|
| `customer_vault_id` | string | ✅ | Customer Vault ID. |

### `list_customer_vault`
List stored Customer Vault records, optionally by date.

| Param | Type | Description |
|---|---|---|
| `date_search` | string | `created`, `updated`, or `created,updated`. |
| `start_date` | string | Range start, `YYYYMMDDhhmmss`. |
| `end_date` | string | Range end, `YYYYMMDDhhmmss`. |
