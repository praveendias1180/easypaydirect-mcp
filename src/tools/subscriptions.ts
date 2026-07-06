import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { NmiClient } from "../client.js";
import { jsonResult, toErrorResult } from "./helpers.js";

export function registerSubscriptionTools(server: McpServer, client: NmiClient): void {
  server.tool(
    "get_subscription",
    "Fetch a single recurring subscription by its subscription ID (report_type=recurring). Read-only.",
    {
      subscription_id: z.string().min(1).describe("The recurring subscription ID to look up."),
    },
    async ({ subscription_id }) => {
      try {
        return jsonResult(await client.query({ report_type: "recurring", subscription_id }));
      } catch (err) {
        return toErrorResult(err);
      }
    },
  );

  server.tool(
    "list_subscriptions",
    "List recurring subscriptions, optionally filtered by created/updated date range (report_type=recurring). Read-only.",
    {
      date_search: z
        .string()
        .optional()
        .describe("Which date(s) to filter on, e.g. 'created' or 'updated' or 'created,updated'."),
      start_date: z.string().optional().describe("Start of range, NMI format YYYYMMDDhhmmss."),
      end_date: z.string().optional().describe("End of range, NMI format YYYYMMDDhhmmss."),
    },
    async (args) => {
      try {
        return jsonResult(await client.query({ report_type: "recurring", ...args }));
      } catch (err) {
        return toErrorResult(err);
      }
    },
  );
}
