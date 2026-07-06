---
title: Architecture & API mapping
nav_order: 6
---

# Architecture & Query API mapping

## Overview

```
MCP client (Claude)
      │  stdio (JSON-RPC)
      ▼
easypaydirect-mcp  ── src/index.ts        server bootstrap + tool registration
      │             ── src/tools/*.ts      zod-validated tool definitions
      ▼
  NmiClient (src/client.ts)                POST form-encoded -> parse XML
      │  HTTPS
      ▼
  {NMI_API_URL}/api/query.php              EPD / NMI Query API (read-only)
```

Every tool is a thin, typed wrapper over a single Query API request. The client
adds the `security_key`, POSTs `application/x-www-form-urlencoded`, and parses
the XML response into JSON (values kept as strings to preserve amount/ID
precision).

## Tool → Query API parameter mapping

| Tool | Query API parameters |
|---|---|
| `get_transaction` | `transaction_id=<id>` |
| `search_transactions` | `start_date`, `end_date`, `condition`, `action_type`, `transaction_type`, `source`, `email`, `order_id` |
| `get_subscription` | `report_type=recurring` + `subscription_id=<id>` |
| `list_subscriptions` | `report_type=recurring` + `date_search`, `start_date`, `end_date` |
| `list_recurring_plans` | `report_type=recurring_plans` (+ optional `plan_id`) |
| `get_customer_vault_record` | `report_type=customer_vault` + `customer_vault_id=<id>` |
| `list_customer_vault` | `report_type=customer_vault` + `date_search`, `start_date`, `end_date` |

## Notes on the Query API

- **Auth:** `security_key` POST field. No OAuth; the key alone authorizes.
- **Format:** requests are form-encoded; responses are XML rooted at
  `<nm_response>`. An empty result set is a valid (near-empty) XML document.
- **Dates:** `YYYYMMDDhhmmss`.
- **Merchant-defined fields:** the raw API supports `merchant_defined_field_#`
  (1–20) filters; these can be added to `search_transactions` as needed.
- **Non-XML body:** the client treats any non-XML response as an error, since
  the Query API returns plaintext only on authentication / routing failures.

## Adding a tool

1. Add a registration function under `src/tools/` (copy an existing one).
2. Define inputs with a `zod` shape — every field needs a `.describe()` so the
   model knows how to use it.
3. Map inputs to Query API params and call `client.query(...)`.
4. Register it in `src/index.ts`.
5. Document it in [`tools.md`](tools.md) and here.

Keep new tools **read-only** (Query API only). Write support is a deliberate,
separately gated future effort — see [`security.md`](security.md).

## Reference

- NMI Query API: <https://docs.nmi.com/reference/query>
- NMI Query API (Postman): <https://www.postman.com/nmi-integration-support/nmi-public-documentation/documentation/lz6wyo0/query-api>
