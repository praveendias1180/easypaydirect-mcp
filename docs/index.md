---
title: Home
nav_order: 1
description: >-
  Read-only MCP server for the Easy Pay Direct (EPD) / NMI-family payment gateway —
  transactions, subscriptions, recurring plans, and Customer Vault, in plain language.
---

<div class="hero" markdown="1">

<span class="hero-eyebrow">Model Context Protocol · read-only</span>

# easypaydirect-mcp
{: .hero-title }

Give Claude — or any MCP client — safe, **read-only** access to your Easy Pay Direct / NMI‑family gateway: transactions, subscriptions, recurring plans, and the Customer Vault, in plain language.
{: .hero-subtitle }

<div class="hero-cta" markdown="1">
[Get started](getting-started.html){: .btn .btn-primary }
[Tools reference](tools.html){: .btn }
[View on npm ↗](https://www.npmjs.com/package/easypaydirect-mcp){: .btn }
</div>

</div>

```bash
npx easypaydirect-mcp
```

{: .readonly }
> **Read‑only by design.** The server talks *only* to the gateway's Query API (`/api/query.php`) and has **no code path** to the transaction endpoint (`transact.php`) — so it cannot charge, refund, void, or modify subscriptions or the vault, even if a model is prompted to. See [Security](security.html).

## Why it exists

Easy Pay Direct is built on the **NMI / Network Merchants** platform, and no vendor in that ecosystem ships an MCP server. This one works for EPD *and* every NMI white‑label gateway — just point it at your host. EPD is the headline example, not the limit.

<div class="feature-grid">
  <div class="feature">
    <div class="feature-ico">🔎</div>
    <h3>Transactions</h3>
    <p>Look up one by ID, or search by date range, condition, action type, source, and more.</p>
  </div>
  <div class="feature">
    <div class="feature-ico">🔁</div>
    <h3>Subscriptions &amp; plans</h3>
    <p>Inspect recurring subscriptions and billing plans straight from the gateway.</p>
  </div>
  <div class="feature">
    <div class="feature-ico">🗄️</div>
    <h3>Customer Vault</h3>
    <p>Read stored customer profiles — metadata only, never full card numbers.</p>
  </div>
  <div class="feature">
    <div class="feature-ico">🔐</div>
    <h3>Safe by construction</h3>
    <p>Key stays in the environment; the toolset is lookups only. No writes exist to misuse.</p>
  </div>
</div>

## Quick start

Run it over stdio with two environment variables:

| Variable | Required | Description |
|---|:---:|---|
| `NMI_SECURITY_KEY` | ✅ | Gateway API **security key** (a read‑only key is recommended). |
| `NMI_API_URL` | — | Gateway base URL. Defaults to `https://secure.nmi.com`; set to your EPD / white‑label host. |

Then wire it into Claude Desktop or Claude Code — full walkthrough in [Getting started](getting-started.html).

## Documentation

- [**Getting started**](getting-started.html) — install and connect to Claude
- [**Configuration**](configuration.html) — environment variables and finding your key
- [**Tools reference**](tools.html) — all seven read‑only tools
- [**Security**](security.html) — posture, credential handling, reporting
- [**Architecture &amp; API mapping**](nmi-api-mapping.html) — how tools map to the Query API

---

MIT‑licensed · Unofficial — not affiliated with Easy Pay Direct or NMI.
{: .fs-3 .text-grey-dk-000 }
