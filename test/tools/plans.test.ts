import { describe, expect, it } from "vitest";
import { registerPlanTools } from "../../src/tools/plans.js";
import { TEST_KEY, connectTools, loadFixture, mockFetchOnce, resultText, sentRequest } from "../helpers.js";

describe("plan tools", () => {
  it("list_recurring_plans queries report_type=recurring_plans with no plan_id by default", async () => {
    const fetch = mockFetchOnce(loadFixture("plans.xml"));
    const client = await connectTools(registerPlanTools);

    const result = await client.callTool({ name: "list_recurring_plans", arguments: {} });

    expect(Object.fromEntries(sentRequest(fetch).params)).toEqual({
      security_key: TEST_KEY,
      report_type: "recurring_plans",
    });
    expect(JSON.parse(resultText(result)).nm_response.plan.plan_amount).toBe("29.00");
  });

  it("list_recurring_plans forwards plan_id when given", async () => {
    const fetch = mockFetchOnce(loadFixture("plans.xml"));
    const client = await connectTools(registerPlanTools);

    await client.callTool({ name: "list_recurring_plans", arguments: { plan_id: "PLAN-10" } });

    expect(sentRequest(fetch).params.get("plan_id")).toBe("PLAN-10");
  });
});
