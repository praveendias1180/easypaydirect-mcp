# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/praveendias1180/easypaydirect-mcp/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/praveendias1180/easypaydirect-mcp/releases/tag/v0.1.1
[0.1.0]: https://github.com/praveendias1180/easypaydirect-mcp/releases/tag/v0.1.0
