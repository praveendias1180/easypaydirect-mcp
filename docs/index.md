---
title: Home
nav_order: 1
---

# easypaydirect-mcp

Read-only [Model Context Protocol](https://modelcontextprotocol.io) server for the
**Easy Pay Direct (EPD) / NMI-family payment gateway**. Give an AI assistant
(Claude Desktop, Claude Code, or any MCP client) safe, **read-only** access to your
gateway's transactions, subscriptions, recurring plans, and Customer Vault records —
in plain language.

- **npm:** [`easypaydirect-mcp`](https://www.npmjs.com/package/easypaydirect-mcp) — `npx easypaydirect-mcp`
- **Source:** [github.com/praveendias1180/easypaydirect-mcp](https://github.com/praveendias1180/easypaydirect-mcp)
- **License:** MIT · Unofficial — not affiliated with Easy Pay Direct or NMI.

## Read-only by design

The server talks **only** to the gateway's Query API (`/api/query.php`) and has
**no code path** to the transaction endpoint (`transact.php`) — so it cannot charge,
refund, void, or modify subscriptions or the vault, even if a model is prompted to.
See [Security](security.md).

## Quick start

```bash
npx easypaydirect-mcp
```

with two environment variables:

| Variable | Required | Description |
|---|---|---|
| `NMI_SECURITY_KEY` | ✅ | Gateway API **security key** (a read-only key is recommended). |
| `NMI_API_URL` | — | Gateway base URL. Defaults to `https://secure.nmi.com`; set to your EPD/white-label host. |

Full walkthrough in [Getting started](getting-started.md).

## Documentation

- [Getting started](getting-started.md) — install and connect to Claude
- [Configuration](configuration.md) — environment variables and where to find your key
- [Tools reference](tools.md) — all seven read-only tools
- [Security](security.md) — posture, credential handling, reporting
- [Architecture & API mapping](nmi-api-mapping.md) — how tools map to the Query API
