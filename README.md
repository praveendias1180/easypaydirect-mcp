# easypaydirect-mcp

[![npm](https://img.shields.io/npm/v/easypaydirect-mcp.svg)](https://www.npmjs.com/package/easypaydirect-mcp)
[![CI](https://github.com/praveendias1180/easypaydirect-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/praveendias1180/easypaydirect-mcp/actions/workflows/ci.yml)
[![license: MIT](https://img.shields.io/npm/l/easypaydirect-mcp.svg)](LICENSE)

> **Unofficial, read-only [Model Context Protocol](https://modelcontextprotocol.io) server for the [Easy Pay Direct](https://easypaydirect.com) (EPD) / NMI-family payment gateway.**

Give an AI assistant (Claude Desktop, Claude Code, or any MCP client) safe, **read-only** access to your gateway's transactions, subscriptions, recurring plans, and Customer Vault records — so you can ask questions like *"find the failed transactions for this customer last week"* or *"is this subscription still active?"* in plain language.

Easy Pay Direct is built on the **NMI / Network Merchants** gateway platform, so this server works with **any NMI white-label gateway** — just point it at your gateway's host. EPD is the headline example, not the limit.

> ⚠️ **Not affiliated with, endorsed by, or sponsored by Easy Pay Direct or NMI.** "Easy Pay Direct", "EPD", and "NMI" are trademarks of their respective owners. This is an independent open-source client for their public [Query API](https://docs.nmi.com/reference/query).

---

## Why read-only?

This server talks **only** to the gateway's [Query API](https://docs.nmi.com/reference/query) (`/api/query.php`) — the reporting endpoint. It has **no code path** to the transaction endpoint (`transact.php`), so it **cannot** charge a card, issue a refund, void a transaction, or modify the vault. An LLM connected to this server can look, but it cannot touch money. See [`docs/security.md`](docs/security.md).

Write operations may arrive in a future major version — always **opt-in, off by default, and loudly gated**.

---

## Install & run

Requires **Node.js 18+**.

```bash
# no install needed — run straight from npm
npx easypaydirect-mcp
```

The server speaks MCP over **stdio** and expects two environment variables:

| Variable | Required | Description |
|---|---|---|
| `NMI_SECURITY_KEY` | ✅ | Your gateway API **security key** (a **read-only** key is recommended). Merchant portal → Settings → Security Keys. |
| `NMI_API_URL` | — | Gateway API base URL. Defaults to `https://secure.nmi.com`. For EPD/white-labels, set this to your gateway's host. |

See [`docs/configuration.md`](docs/configuration.md) for how to find your key and host.

## Connect it to Claude

**Claude Desktop** — add to `claude_desktop_config.json` (see [`examples/claude-desktop-config.json`](examples/claude-desktop-config.json)):

```json
{
  "mcpServers": {
    "easypaydirect": {
      "command": "npx",
      "args": ["-y", "easypaydirect-mcp"],
      "env": {
        "NMI_SECURITY_KEY": "your_read_only_security_key",
        "NMI_API_URL": "https://secure.nmi.com"
      }
    }
  }
}
```

**Claude Code:**

```bash
claude mcp add easypaydirect \
  -e NMI_SECURITY_KEY=your_read_only_security_key \
  -e NMI_API_URL=https://secure.nmi.com \
  -- npx -y easypaydirect-mcp
```

Full walkthrough: [`docs/getting-started.md`](docs/getting-started.md).

## Tools

All tools are **read-only**. Full reference in [`docs/tools.md`](docs/tools.md).

| Tool | What it does |
|---|---|
| `get_transaction` | Fetch one transaction by gateway transaction ID. |
| `search_transactions` | Search transactions by date range + filters (condition, action type, payment type, source, email, order id). |
| `get_subscription` | Fetch one recurring subscription by ID. |
| `list_subscriptions` | List recurring subscriptions, optionally by created/updated date range. |
| `list_recurring_plans` | List recurring billing plans (or one by `plan_id`). |
| `get_customer_vault_record` | Fetch one stored Customer Vault record by ID. |
| `list_customer_vault` | List stored Customer Vault records, optionally by date range. |

## Develop

```bash
git clone https://github.com/praveendias1180/easypaydirect-mcp.git
cd easypaydirect-mcp
npm install
npm run build      # compile TypeScript to dist/
npm run typecheck  # type-check only
```

Local run against the MCP Inspector:

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

Architecture and how tools map to the Query API: [`docs/nmi-api-mapping.md`](docs/nmi-api-mapping.md).

## License

[MIT](LICENSE) © the easypaydirect-mcp contributors.
