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

---

## Response fields

Every tool returns a parsed Query API response as pretty-printed JSON.

The exact fields depend on the report type. The exact response fields vary by report type. The tables below highlight common fields that users can expect to see. All examples use **synthetic data only**.

For the complete response schema, see the official NMI Query API documentation:

For the complete response schema, see the official
[NMI Query API documentation](https://docs.nmi.com/reference/query).

---

### Transactions

| Field | Description |
| --- | --- |
| `transaction_id` | Gateway transaction identifier |
| `transaction_type` | Transaction type (for example `cc` or `ck`) |
| `condition` | Current transaction status |
| `order_id` | Merchant order identifier |
| `email` | Customer email address |
| `action` | Transaction actions containing response details |

Synthetic example

```json
{
  "transaction_id": "2612675976",
  "transaction_type": "cc",
  "condition": "complete",
  "order_id": "ORDER-1001",
  "email": "customer@example.com",
  "action": [
    {
      "action_type": "sale",
      "response_text": "SUCCESS",
      "response_code": "100"
    }
  ]
}
```

---

### Subscriptions

| Field | Description |
| --- | --- |
| `subscription_id` | Subscription identifier |
| `status` | Subscription status |
| `plan_id` | Associated recurring plan |
| `next_charge_date` | Next scheduled billing date |

Synthetic example

```json
{
  "subscription_id": "SUB-1001",
  "status": "active",
  "plan_id": "PLAN-10",
  "next_charge_date": "20260115120000"
}
```

---

### Recurring plans

| Field | Description |
| --- | --- |
| `plan_id` | Recurring plan identifier |
| `plan_name` | Plan name |
| `plan_amount` | Billing amount |
| `plan_payments` | Number of scheduled payments |

Synthetic example

```json
{
  "plan_id": "PLAN-10",
  "plan_name": "Premium Plan",
  "plan_amount": "19.99",
  "plan_payments": "12"
}
```

---

### Customer Vault

| Field | Description |
| --- | --- |
| `customer_vault_id` | Customer Vault identifier |
| `first_name` | Customer first name |
| `last_name` | Customer last name |
| `email` | Customer email |

Synthetic example

```json
{
  "customer_vault_id": "CV-1001",
  "first_name": "Alex",
  "last_name": "Taylor",
  "email": "alex@example.com"
}
```