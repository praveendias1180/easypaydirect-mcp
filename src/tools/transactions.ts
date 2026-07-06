import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { NmiClient } from "../client.js";
import { jsonResult, toErrorResult } from "./helpers.js";

const NMI_DATE_HINT = "NMI datetime format YYYYMMDDhhmmss (e.g. 20260101000000 for 2026-01-01 00:00:00).";

export function registerTransactionTools(server: McpServer, client: NmiClient): void {
  server.tool(
    "get_transaction",
    "Fetch a single transaction by its gateway transaction ID. Read-only.",
    {
      transaction_id: z.string().min(1).describe("The gateway transaction ID to look up."),
    },
    async ({ transaction_id }) => {
      try {
        return jsonResult(await client.query({ transaction_id }));
      } catch (err) {
        return toErrorResult(err);
      }
    },
  );

  server.tool(
    "search_transactions",
    "Search transactions by date range and optional filters (condition, action type, payment type, source, email, order id). Read-only.",
    {
      start_date: z.string().optional().describe(`Start of range. ${NMI_DATE_HINT}`),
      end_date: z.string().optional().describe(`End of range. ${NMI_DATE_HINT}`),
      condition: z
        .string()
        .optional()
        .describe("Comma-separated transaction conditions: pending, pendingsettlement, in_progress, abandoned, failed, canceled, complete, unknown."),
      action_type: z
        .string()
        .optional()
        .describe("Comma-separated action types: sale, refund, credit, auth, capture, void, return."),
      transaction_type: z.string().optional().describe("Payment type filter: 'cc' (card) or 'ck' (ACH/check)."),
      source: z.string().optional().describe("Filter by transaction source."),
      email: z.string().optional().describe("Filter by customer email address."),
      order_id: z.string().optional().describe("Filter by merchant-supplied order id."),
    },
    async (args) => {
      try {
        return jsonResult(await client.query(args));
      } catch (err) {
        return toErrorResult(err);
      }
    },
  );
}
