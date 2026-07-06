---
title: Getting started
nav_order: 2
---

# Getting started

This guide takes you from zero to asking Claude questions about your gateway data.

## 1. Prerequisites

- **Node.js 18 or newer** (`node --version`).
- A **security key** for your EPD / NMI gateway. A **read-only** key is strongly recommended — see [configuration.md](configuration.md).

## 2. Get your credentials

1. Log in to your merchant portal (EPD, NMI, or your white-label gateway).
2. Go to **Settings → Security Keys**.
3. Create or copy a **read-only** API security key.
4. Note your gateway's API host. NMI's shared host is `https://secure.nmi.com`. White-label gateways use their own host — confirm yours in the portal or your integration docs.

## 3. Try it locally (optional but recommended)

Verify the server starts and can talk to your gateway before wiring it into Claude:

```bash
NMI_SECURITY_KEY=your_read_only_key \
NMI_API_URL=https://secure.nmi.com \
npx @modelcontextprotocol/inspector npx -y easypaydirect-mcp
```

The [MCP Inspector](https://github.com/modelcontextprotocol/inspector) opens a UI where you can list the tools and run, say, `search_transactions` for a recent date range.

## 4. Connect to Claude Desktop

Edit your `claude_desktop_config.json`:

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

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

Restart Claude Desktop. You should see the `easypaydirect` tools appear.

## 5. Connect to Claude Code

```bash
claude mcp add easypaydirect \
  -e NMI_SECURITY_KEY=your_read_only_security_key \
  -e NMI_API_URL=https://secure.nmi.com \
  -- npx -y easypaydirect-mcp
```

## 6. Ask questions

- "Look up transaction 1234567890."
- "Find failed card transactions between Jan 1 and Jan 7, 2026."
- "Is subscription ABC123 still active, and when does it next bill?"
- "List the recurring plans on this gateway."

The model will pick the right read-only tool and format the answer.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| `NMI_SECURITY_KEY is required` | The env var isn't set in the MCP client config. |
| `Unexpected non-XML response` | Wrong `NMI_API_URL`, or the key is invalid / not authorized for the Query API. |
| `Query API returned HTTP 4xx/5xx` | Gateway-side error; check the key permissions and host. |
| Tools don't appear in Claude | Restart the client after editing config; check the client's MCP logs. |
