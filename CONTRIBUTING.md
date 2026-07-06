# Contributing

Thanks for your interest! This project aims to be a small, dependable,
**read-only** MCP server for the EPD / NMI Query API.

## Ground rules

- **Read-only.** Pull requests that add charge/refund/void/subscription-write or
  any `transact.php` capability will not be merged into the read-only line. Write
  support, if it ever lands, is a separate, opt-in, gated major version — open an
  issue to discuss before building it.
- **Every tool input needs a `zod` `.describe()`** so models can use it correctly.
- **Never log or return the security key**, and never accept it as a tool argument.

## Dev setup

```bash
npm install
npm run typecheck
npm run build
```

Test against a real gateway with a **read-only** key using the MCP Inspector:

```bash
NMI_SECURITY_KEY=... npx @modelcontextprotocol/inspector node dist/index.js
```

## Pull requests

- Keep changes focused; one concern per PR.
- Update `docs/tools.md` and `docs/nmi-api-mapping.md` when you add or change a tool.
- Do not include real security keys or customer data in code, tests, issues, or PRs.
