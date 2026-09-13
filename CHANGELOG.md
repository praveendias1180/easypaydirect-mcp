# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Claude Code plugin** bundling the MCP server with an **Agent Skill** (`plugins/easypaydirect/skills/easypaydirect/SKILL.md`) that teaches Claude which tool to use and how to read gateway data correctly — ACH settlement, UTC dates, deleted subscriptions, multiple vault records, manual collections. Install with `/plugin marketplace add praveendias1180/easypaydirect-mcp`.

## [0.1.2] — 2026-09-12

### Added
- Docker support: a multi-stage, non-root `Dockerfile` and container usage docs — thanks [@junaid6468](https://github.com/junaid6468) for their first contribution! ([#15](https://github.com/praveendias1180/easypaydirect-mcp/pull/15), [#16](https://github.com/praveendias1180/easypaydirect-mcp/pull/16))
- Unit-test suite (Vitest) with synthetic Query API fixtures, run in CI on Node 18/20/22 ([#22](https://github.com/praveendias1180/easypaydirect-mcp/pull/22))
- Issue forms, a pull-request template, a code of conduct, and `.editorconfig` ([#21](https://github.com/praveendias1180/easypaydirect-mcp/pull/21))

### Security
- The client now ignores a `security_key` query parameter, so nothing passed to a query can ever replace the configured key. Not reachable through the current tools; this closes the door for future ones ([#22](https://github.com/praveendias1180/easypaydirect-mcp/pull/22))

## [0.1.1] — 2026-07-06

### Added
- MCP client setup examples for Cursor, Windsurf, and VS Code ([#6](https://github.com/praveendias1180/easypaydirect-mcp/pull/6))
- Listed on the official [MCP Registry](https://registry.modelcontextprotocol.io) (`server.json` + `mcpName`)

## [0.1.0] — 2026-07-06

### Added
- Initial release: read-only MCP server for the Easy Pay Direct (EPD) / NMI-family gateway **Query API**.
- Seven read-only tools: `get_transaction`, `search_transactions`, `get_subscription`, `list_subscriptions`, `list_recurring_plans`, `get_customer_vault_record`, `list_customer_vault`.
- Configurable gateway host via `NMI_API_URL` — works with any NMI white-label gateway.
- Documentation site, security policy, and CI.

[Unreleased]: https://github.com/praveendias1180/easypaydirect-mcp/compare/v0.1.2...HEAD
[0.1.2]: https://github.com/praveendias1180/easypaydirect-mcp/releases/tag/v0.1.2
[0.1.1]: https://github.com/praveendias1180/easypaydirect-mcp/releases/tag/v0.1.1
[0.1.0]: https://github.com/praveendias1180/easypaydirect-mcp/releases/tag/v0.1.0
