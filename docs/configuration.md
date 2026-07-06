---
title: Configuration
nav_order: 3
---

# Configuration

All configuration is via environment variables. Nothing is read from disk, and
the security key is **never** accepted as a tool argument.

## `NMI_SECURITY_KEY` (required)

Your gateway API **security key**.

- Found in the merchant portal under **Settings → Security Keys**.
- **Use a read-only key.** This server only ever calls the Query API, so a
  read-only key is sufficient and dramatically limits blast radius if the value
  leaks. If your gateway supports scoped keys, scope it to reporting only.
- The key is sent to the gateway as the `security_key` POST field over HTTPS and
  is never logged or returned in any tool response.

## `NMI_API_URL` (optional)

The gateway API base URL. **Default:** `https://secure.nmi.com`.

Easy Pay Direct and other NMI white-labels expose the identical Query API on
their own host. Set `NMI_API_URL` to that host (no trailing slash — the server
appends `/api/query.php`). Confirm the exact host in your merchant portal or
integration documentation.

Examples:

```bash
# NMI (default)
NMI_API_URL=https://secure.nmi.com

# A white-label gateway
NMI_API_URL=https://secure.yourgateway.com
```

## Where to put these

- **Claude Desktop / Claude Code:** in the `env` block of the MCP server entry
  (see [getting-started.md](getting-started.html)).
- **Local development:** copy `.env.example` to `.env` and export them, or pass
  them inline on the command line. `.env` is git-ignored.

> The `.env` file is only a developer convenience — the server itself reads from
> `process.env`, so in production your MCP client supplies the values.
