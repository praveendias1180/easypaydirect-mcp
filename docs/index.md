# easypaydirect-mcp

Give Claude — or any MCP client — safe, **read-only** access to your Easy Pay Direct / NMI-family
gateway: transactions, subscriptions, recurring plans, and the Customer Vault, in plain language.

```bash
npx easypaydirect-mcp
```

[Get started](getting-started.md){ .md-button .md-button--primary }
[Tools reference](tools.md){ .md-button }
[View on npm](https://www.npmjs.com/package/easypaydirect-mcp){ .md-button }

!!! success "Read-only by design"

    The server talks *only* to the gateway's Query API (`/api/query.php`) and has **no code path**
    to the transaction endpoint (`transact.php`) — so it cannot charge, refund, void, or modify
    subscriptions or the vault, even if a model is prompted to. See [Security](security.md).

## Why it exists

Easy Pay Direct is built on the **NMI / Network Merchants** platform, and no vendor in that
ecosystem ships an MCP server. This one works for EPD *and* every NMI white-label gateway — just
point it at your host. EPD is the headline example, not the limit.

## What it reads

- **Transactions** — look up one by ID, or search by date range, condition, action type, source, and more.
- **Subscriptions & plans** — inspect recurring subscriptions and billing plans straight from the gateway.
- **Customer Vault** — read stored customer profiles: metadata only, never full card numbers.
- **Safe by construction** — the key stays in the environment and the toolset is lookups only. No writes exist to misuse.

## Quick start

Run it over stdio with two environment variables:

| Variable | Required | Description |
|---|:---:|---|
| `NMI_SECURITY_KEY` | ✅ | Gateway API **security key** (a read-only key is recommended). |
| `NMI_API_URL` | — | Gateway base URL. Defaults to `https://secure.nmi.com`; set to your EPD / white-label host. |

Then wire it into Claude Desktop or Claude Code — full walkthrough in
[Getting started](getting-started.md).

## Documentation

- [**Getting started**](getting-started.md) — install and connect to Claude
- [**Configuration**](configuration.md) — environment variables and finding your key
- [**Tools reference**](tools.md) — all seven read-only tools
- [**Security**](security.md) — posture, credential handling, reporting
- [**Architecture & API mapping**](nmi-api-mapping.md) — how tools map to the Query API
