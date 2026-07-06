# Security Policy

## Design posture

This is a **read-only** MCP server. It talks only to the gateway's Query API
(`/api/query.php`) and has **no code path** to the transaction endpoint
(`transact.php`) — so it cannot charge, refund, void, or modify subscriptions or
the Customer Vault, even if a connected model is prompted to. The gateway
security key is read from the environment only, never accepted as a tool
argument, and never logged or returned.

Full details: [`docs/security.md`](docs/security.md).

## Supported versions

Fixes are released against the latest published version on npm. Please upgrade
to the latest `0.x` before reporting.

## Reporting a vulnerability

Please report privately — **do not open a public issue or PR for security
matters**:

- Preferred: open a [GitHub private security advisory](https://github.com/praveendias1180/easypaydirect-mcp/security/advisories/new).
- If advisories are unavailable, contact the maintainer via their GitHub profile.

When reporting, include reproduction steps and impact. **Never include real
security keys, tokens, or customer data** in a report.

We aim to acknowledge reports within a few days and will coordinate a fix and
disclosure timeline with you.
