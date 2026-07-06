---
title: Security
nav_order: 5
---

# Security

This server handles a payment-gateway credential and exposes financial data to
an AI model. It is designed conservatively.

## Read-only by construction

The server talks **only** to the Query API (`/api/query.php`), the gateway's
reporting endpoint. There is **no code path** to the transaction endpoint
(`transact.php`). Concretely, the server **cannot**:

- charge or authorize a card,
- refund, credit, void, or capture a transaction,
- create, update, pause, or cancel a subscription,
- add to or modify the Customer Vault.

Even if a model is prompted to "issue a refund," no such tool exists to call.

## Credential handling

- The security key is read from `NMI_SECURITY_KEY` (environment) **only** — it is
  never a tool argument, so the model never sees it and cannot pass it around.
- It is sent to the gateway over HTTPS as the `security_key` POST field.
- It is **never** logged and **never** included in any tool response or error.
- **Use a read-only security key.** If the value ever leaks, a read-only key
  cannot move money.

## Data sensitivity

Query API responses can include personal and payment-adjacent data (names,
emails, addresses, masked card metadata, amounts). The gateway does **not**
return full PANs. Even so, treat all responses as sensitive: they flow to your
MCP client and, depending on your setup, to a model provider. Only connect this
server in environments where that data flow is acceptable, and prefer scoping
the key to the minimum data you need.

## Reporting a vulnerability

Please open a private security advisory on the GitHub repository (or a regular
issue if the repo has advisories disabled) rather than a public PR. Do not
include real security keys or customer data in reports.

## Future write support

If write tools are ever added, they will be a **major version**, **off by
default**, enabled only by an explicit environment flag, and documented with
prominent warnings. Read-only will always remain the default posture.
