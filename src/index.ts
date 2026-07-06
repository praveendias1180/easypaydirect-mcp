#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./config.js";
import { NmiClient } from "./client.js";
import { registerTransactionTools } from "./tools/transactions.js";
import { registerSubscriptionTools } from "./tools/subscriptions.js";
import { registerPlanTools } from "./tools/plans.js";
import { registerVaultTools } from "./tools/vault.js";

async function main(): Promise<void> {
  const config = loadConfig();
  const client = new NmiClient(config);

  const server = new McpServer({
    name: "easypaydirect-mcp",
    version: "0.1.0",
  });

  registerTransactionTools(server, client);
  registerSubscriptionTools(server, client);
  registerPlanTools(server, client);
  registerVaultTools(server, client);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  // stdout is reserved for the MCP protocol; log to stderr only.
  console.error(`easypaydirect-mcp running on stdio (endpoint: ${config.apiUrl})`);
}

main().catch((err) => {
  console.error("Fatal:", err instanceof Error ? err.message : err);
  process.exit(1);
});
