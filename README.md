# easypaydirect-mcp

📖 **Documentation:** https://praveendias1180.github.io/easypaydirect-mcp/

> **Unofficial, read-only** **[Model Context Protocol](https://modelcontextprotocol.io)** **server for the** **[Easy Pay Direct](https://easypaydirect.com)** **(EPD) / NMI-family payment gateway.**

Give an AI assistant (Claude Desktop, Claude Code, or any MCP client) safe, **read-only** access to your gateway's transactions, subscriptions, recurring plans, and Customer Vault records — so you can ask questions like *"find the failed transactions for this customer last week"* or *"is this subscription still active?"* in plain language.

Easy Pay Direct is built on the **NMI / Network Merchants** gateway platform, so this server works with **any NMI white-label gateway** — just point it at your gateway's host. EPD is the headline example, not the limit.

> ⚠️ **Not affiliated with, endorsed by, or sponsored by Easy Pay Direct or NMI.** "Easy Pay Direct", "EPD", and "NMI" are trademarks of their respective owners. This is an independent open-source client for their public [Query API](https://docs.nmi.com/reference/query).

---

## Why read-only?

This server talks **only** to the gateway's [Query API](https://docs.nmi.com/reference/query) (`/api/query.php`) — the reporting endpoint. It has **no code path** to the transaction endpoint (`transact.php`), so it **cannot** charge a card, issue a refund, void a transaction, or modify the vault. An LLM connected to this server can look, but it cannot touch money. See `docs/security.md`.

Write operations may arrive in a future major version — always **opt-in, off by default, and loudly gated**.

---

## Install & run

Requires **Node.js 18+**.

```bash
# no install needed — run straight from npm
npx easypaydirect-mcp
```

The server speaks MCP over **stdio** and expects two environment variables:

| Variable           | Required | Description                                                                                                         |
| ------------------ | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `NMI_SECURITY_KEY` | ✅        | Your gateway API **security key** (a **read-only** key is recommended). Merchant portal → Settings → Security Keys. |
| `NMI_API_URL`      | —        | Gateway API base URL. Defaults to `https://secure.nmi.com`. For EPD/white-labels, set this to your gateway's host.  |

See `docs/configuration.md` for how to find your key and host.

## Run with Docker

You can run the MCP server in a Docker container without installing Node.js locally.

Build the Docker image from the repository root:

```bash
docker build -t easypaydirect-mcp .
```

For Docker, you can provide the required environment variables using a `.env` file.

Create a `.env` file in the project directory:

```env
NMI_SECURITY_KEY=your_read_only_security_key
NMI_API_URL=https://secure.nmi.com
```

Then start the server:

```bash
docker run --rm -i \
  --env-file .env \
  easypaydirect-mcp
```

The server communicates using MCP over **stdio**. The `-i` flag is required so Docker keeps stdin open and the MCP client can communicate with the container.

The `.env` file should contain your actual security key but **must not be committed to source control**. Add `.env` to `.gitignore`.

For example, a safe `.env.example` can contain:

```env
NMI_SECURITY_KEY=
NMI_API_URL=https://secure.nmi.com
```

### Connect Docker to Claude Code

Claude Code can use the Dockerized server directly as an MCP stdio server.

If your `.env` file is in the project directory, use its absolute path:

```bash
claude mcp add easypaydirect \
  -- docker run --rm -i \
  --env-file /absolute/path/to/easypaydirect-mcp/.env \
  easypaydirect-mcp
```

The `-i` flag is required because the MCP server communicates with Claude Code over **stdio**.

After adding the server, verify the configuration:

```bash
claude mcp list
```

You should see `easypaydirect` listed as an MCP server.

> **Note:** Keep your `.env` file private and never commit real gateway security keys to the repository.

## Connect it to Claude

**Claude Desktop** — add to `claude_desktop_config.json` (see `examples/claude-desktop-config.json`):

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

**Claude Code with Docker:**

```bash
claude mcp add easypaydirect \
  -- docker run --rm -i \
  --env-file /absolute/path/to/.env \
  easypaydirect-mcp
```

Full walkthrough: `docs/getting-started.md`.

## Tools

All tools are **read-only**. Full reference in `docs/tools.md`.

| Tool                        | What it does                                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `get_transaction`           | Fetch one transaction by gateway transaction ID.                                                             |
| `search_transactions`       | Search transactions by date range + filters (condition, action type, payment type, source, email, order id). |
| `get_subscription`          | Fetch one recurring subscription by ID.                                                                      |
| `list_subscriptions`        | List recurring subscriptions, optionally by created/updated date range.                                      |
| `list_recurring_plans`      | List recurring billing plans (or one by `plan_id`).                                                          |
| `get_customer_vault_record` | Fetch one stored Customer Vault record by ID.                                                                |
| `list_customer_vault`       | List stored Customer Vault records, optionally by date range.                                                |

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

Architecture and how tools map to the Query API: `docs/nmi-api-mapping.md`.

## Roadmap

Planned / under consideration — contributions welcome (see [open issues](https://github.com/praveendias1180/easypaydirect-mcp/issues)):

* **Tests** — unit suite with recorded Query API fixtures ([#1](https://github.com/praveendias1180/easypaydirect-mcp/issues/1))
* **Friendlier dates** — accept ISO-8601 in date filters ([#2](https://github.com/praveendias1180/easypaydirect-mcp/issues/2))
* **More filters** — merchant-defined fields on `search_transactions` ([#3](https://github.com/praveendias1180/easypaydirect-mcp/issues/3))
* **Better errors** — map NMI response codes to actionable messages ([#4](https://github.com/praveendias1180/easypaydirect-mcp/issues/4))
* **Distribution** — a Docker image ([#7](https://github.com/praveendias1180/easypaydirect-mcp/issues/7)) and publish-on-release automation ([#8](https://github.com/praveendias1180/easypaydirect-mcp/issues/8))
* **Docs** — response-field reference ([#9](https://github.com/praveendias1180/easypaydirect-mcp/issues/9))

Read-only stays the default posture — any write support would be a separate, opt-in, gated **major** version.

See the [changelog](CHANGELOG.md) for released changes.

## Contributing

Contributions are welcome — this aims to be a small, dependable, **read-only** MCP server. See `CONTRIBUTING.md` for the ground rules and dev setup.

**New here?** Start with a [**good first issue**](https://github.com/praveendias1180/easypaydirect-mcp/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) — each one has context, a task checklist, file pointers, and acceptance criteria. Have a question? Open a [Discussion](https://github.com/praveendias1180/easypaydirect-mcp/discussions).

## License

[MIT](LICENSE) © the easypaydirect-mcp contributors.
