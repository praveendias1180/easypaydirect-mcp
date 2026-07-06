import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { NmiClient } from "../client.js";
import { jsonResult, toErrorResult } from "./helpers.js";

export function registerPlanTools(server: McpServer, client: NmiClient): void {
  server.tool(
    "list_recurring_plans",
    "List recurring billing plans, optionally filtered to a single plan (report_type=recurring_plans). Read-only.",
    {
      plan_id: z.string().optional().describe("Optional plan ID to return a single plan instead of all plans."),
    },
    async ({ plan_id }) => {
      try {
        return jsonResult(await client.query({ report_type: "recurring_plans", plan_id }));
      } catch (err) {
        return toErrorResult(err);
      }
    },
  );
}
