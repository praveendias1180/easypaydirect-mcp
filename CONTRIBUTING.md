# Contributing

Thanks for your interest! This project aims to be a small, dependable,
**read-only** MCP server for the EPD / NMI Query API.

## Your first contribution

New to open source? You're very welcome here.

1. Pick an issue labelled [`good first issue`](https://github.com/praveendias1180/easypaydirect-mcp/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) and leave a comment saying you're taking it, so two people don't build the same thing.
2. Fork the repo, create a branch, and follow **Dev setup** below.
3. Open a pull request — the template has a short checklist. Small, focused PRs get reviewed fastest.
4. Stuck or unsure about an approach? Ask on the issue or in [Discussions](https://github.com/praveendias1180/easypaydirect-mcp/discussions). Questions are never a bother.

The repo ships an [`.editorconfig`](.editorconfig); please make sure your editor
respects it and **doesn't reformat lines you didn't change** — unrelated
formatting changes make a PR much harder to review.

Please follow the [Code of Conduct](CODE_OF_CONDUCT.md).

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
npm test
```

## Running tests / adding a test

Tests use [Vitest](https://vitest.dev) and live in `test/`. They never touch a
real gateway: each test stubs `fetch` and replies with a **synthetic** fixture
from `test/fixtures/`.

```bash
npm test             # run once
npm run test:watch   # re-run on save
```

Most new tests are a few lines, using the helpers in `test/helpers.ts`:

```ts
it("forwards order_id", async () => {
  const fetch = mockFetchOnce(loadFixture("transaction-single.xml")); // fake gateway reply
  const client = await connectTools(registerTransactionTools);         // real MCP server, in memory

  await client.callTool({ name: "search_transactions", arguments: { order_id: "ORDER-1001" } });

  expect(sentRequest(fetch).params.get("order_id")).toBe("ORDER-1001"); // what we sent the gateway
});
```

- `test/config.test.ts` / `test/client.test.ts` — config loading and the Query API client
- `test/tools/<file>.test.ts` — one file per `src/tools/<file>.ts`; add your tool's test there
- New fixtures must be **synthetic** — made-up IDs, `@example.com` emails, masked card numbers like `4xxxxxxxxxxx1111`

Test against a real gateway with a **read-only** key using the MCP Inspector:

```bash
NMI_SECURITY_KEY=... npx @modelcontextprotocol/inspector node dist/index.js
```

## Pull requests

- Keep changes focused; one concern per PR.
- Update `docs/tools.md` and `docs/nmi-api-mapping.md` when you add or change a tool.
- Do not include real security keys or customer data in code, tests, issues, or PRs.
