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

Every tool returns the gateway's XML response parsed into JSON and pretty-printed.
The exact fields depend on the report type and your gateway; the tables below list
the ones you'll see most. All examples use **synthetic data only**. For the complete
schema, see the [NMI Query API documentation](https://docs.nmi.com/reference/query).

### Reading the JSON

- **Records are nested under `nm_response`.** Transactions are at
  `nm_response.transaction`, subscriptions at `nm_response.subscription`, plans at
  `nm_response.plan`, and vault records at `nm_response.customer_vault.customer`.
  Every response also carries an `"?xml"` key from the XML declaration — ignore it.
- **One match is an object; several matches are an array.** The same applies inside a
  record — a transaction with one `action` has an object, one with several has an array.
  Handle both.
- **No matches:** `nm_response` is an empty string (`"nm_response": ""`).
- **Every value is a string**, including amounts and IDs, so precision is never lost.
- **XML attributes** appear with an `@_` prefix (e.g. `"@_id"` on a vault `customer`).
- **Dates** use `YYYYMMDDhhmmss` (Easy Pay Direct returns these in UTC).

### Transactions

Returned by `get_transaction` and `search_transactions`.

| Field | Description |
|---|---|
| `transaction_id` | Gateway transaction ID |
| `transaction_type` | `cc` (card) or `ck` (ACH / e-check) |
| `condition` | Current status, e.g. `complete`, `pendingsettlement`, `failed` |
| `order_id` | Merchant-supplied order ID |
| `first_name`, `last_name`, `email` | Customer details on the transaction |
| `cc_number` | Masked card number |
| `action` | The transaction's history — one entry per event (sale, settle, refund, …) |
| `action.action_type` | What happened, e.g. `sale`, `refund`, `void` |
| `action.amount` | Amount for that event |
| `action.date` | When it happened (`YYYYMMDDhhmmss`) |
| `action.success` | `1` if the event succeeded |
| `action.response_text`, `action.response_code` | Gateway response (`100` = approved) |

> For `ck` transactions, a successful `sale` only means the debit was **submitted** —
> `condition` stays `pendingsettlement` until it settles or is returned.

One match:

```json
{
  "nm_response": {
    "transaction": {
      "transaction_id": "1000000001",
      "transaction_type": "cc",
      "condition": "complete",
      "order_id": "ORDER-1001",
      "first_name": "Alex",
      "last_name": "Example",
      "email": "alex@example.com",
      "cc_number": "4xxxxxxxxxxx1111",
      "action": {
        "amount": "49.00",
        "action_type": "sale",
        "date": "20260101120000",
        "success": "1",
        "response_text": "SUCCESS",
        "response_code": "100"
      }
    }
  }
}
```

Several matches — `transaction` is an array, and the second one has two actions:

```json
{
  "nm_response": {
    "transaction": [
      {
        "transaction_id": "1000000001",
        "transaction_type": "cc",
        "condition": "complete",
        "action": { "amount": "49.00", "action_type": "sale", "response_code": "100" }
      },
      {
        "transaction_id": "1000000002",
        "transaction_type": "ck",
        "condition": "pendingsettlement",
        "action": [
          { "amount": "19.99", "action_type": "sale", "response_code": "100" },
          { "amount": "19.99", "action_type": "refund", "response_code": "100" }
        ]
      }
    ]
  }
}
```

### Subscriptions

Returned by `get_subscription` and `list_subscriptions`.

| Field | Description |
|---|---|
| `subscription_id` | Subscription ID |
| `plan` | The plan the subscription bills on (see **Recurring plans**) |
| `first_name`, `last_name`, `email` | Subscriber details |
| `next_charge_date` | Next scheduled billing date |
| `completed_payments` | Number of payments collected so far |

```json
{
  "nm_response": {
    "subscription": {
      "subscription_id": "2000000001",
      "plan": {
        "plan_id": "PLAN-10",
        "plan_name": "Example Monthly",
        "plan_amount": "29.00",
        "plan_payments": "0",
        "day_frequency": "30"
      },
      "first_name": "Alex",
      "last_name": "Example",
      "email": "alex@example.com",
      "next_charge_date": "20260201",
      "completed_payments": "3"
    }
  }
}
```

### Recurring plans

Returned by `list_recurring_plans`.

| Field | Description |
|---|---|
| `plan_id` | Plan ID |
| `plan_name` | Plan name |
| `plan_amount` | Amount billed each cycle |
| `plan_payments` | Number of payments in the plan (`0` = until canceled) |
| `day_frequency` / `month_frequency` | How often it bills — every N days, or every N months |
| `day_of_month` | Billing day, for month-based plans |

```json
{
  "nm_response": {
    "plan": {
      "plan_id": "PLAN-10",
      "plan_name": "Example Monthly",
      "plan_amount": "29.00",
      "plan_payments": "0",
      "month_frequency": "1",
      "day_of_month": "1"
    }
  }
}
```

### Customer Vault

Returned by `get_customer_vault_record` and `list_customer_vault`. Stored profile data only — never full card numbers.

| Field | Description |
|---|---|
| `customer_vault_id` | Customer Vault ID (also present as the `@_id` attribute) |
| `first_name`, `last_name`, `email` | Stored customer details |
| `cc_number` | Masked card number |
| `cc_exp` | Card expiry (`MMYY`) |

```json
{
  "nm_response": {
    "customer_vault": {
      "customer": {
        "customer_vault_id": "3000000001",
        "first_name": "Alex",
        "last_name": "Example",
        "email": "alex@example.com",
        "cc_number": "4xxxxxxxxxxx1111",
        "cc_exp": "1230",
        "@_id": "3000000001"
      }
    }
  }
}
```

> One email can have **several** vault records (e.g. one per card), so `customer` may be an array.
