import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { NmiClient } from "../client.js";
import { jsonResult, toErrorResult } from "./helpers.js";

export function registerVaultTools(server: McpServer, client: NmiClient): void {
  server.tool(
    "get_customer_vault_record",
    "Fetch a single stored Customer Vault record by its customer_vault_id (report_type=customer_vault). Returns stored profile data only — never full card numbers. Read-only.",
    {
      customer_vault_id: z.string().min(1).describe("The Customer Vault ID to look up."),
    },
    async ({ customer_vault_id }) => {
      try {
        return jsonResult(await client.query({ report_type: "customer_vault", customer_vault_id }));
      } catch (err) {
        return toErrorResult(err);
      }
    },
  );

  server.tool(
    "list_customer_vault",
    "List stored Customer Vault records, optionally filtered by created/updated date range (report_type=customer_vault). Read-only.",
    {
      date_search: z
        .string()
        .optional()
        .describe("Which date(s) to filter on, e.g. 'created', 'updated', or 'created,updated'."),
      start_date: z.string().optional().describe("Start of range, NMI format YYYYMMDDhhmmss."),
      end_date: z.string().optional().describe("End of range, NMI format YYYYMMDDhhmmss."),
    },
    async (args) => {
      try {
        return jsonResult(await client.query({ report_type: "customer_vault", ...args }));
      } catch (err) {
        return toErrorResult(err);
      }
    },
  );
}
