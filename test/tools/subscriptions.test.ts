import { describe, expect, it } from "vitest";
import { registerSubscriptionTools } from "../../src/tools/subscriptions.js";
import { TEST_KEY, connectTools, loadFixture, mockFetchOnce, resultText, sentRequest } from "../helpers.js";

describe("subscription tools", () => {
  it("get_subscription queries report_type=recurring", async () => {
    const fetch = mockFetchOnce(loadFixture("subscription.xml"));
    const client = await connectTools(registerSubscriptionTools);

    const result = await client.callTool({
      name: "get_subscription",
      arguments: { subscription_id: "2000000001" },
    });

    expect(Object.fromEntries(sentRequest(fetch).params)).toEqual({
      security_key: TEST_KEY,
      report_type: "recurring",
      subscription_id: "2000000001",
    });
    expect(JSON.parse(resultText(result)).nm_response.subscription.plan.plan_id).toBe("PLAN-10");
  });

  it("list_subscriptions keeps report_type=recurring even if the caller sends another", async () => {
    const fetch = mockFetchOnce(loadFixture("subscription.xml"));
    const client = await connectTools(registerSubscriptionTools);

    await client.callTool({
      name: "list_subscriptions",
      arguments: { date_search: "created", start_date: "20260101000000", report_type: "customer_vault" },
    });

    expect(Object.fromEntries(sentRequest(fetch).params)).toEqual({
      security_key: TEST_KEY,
      report_type: "recurring",
      date_search: "created",
      start_date: "20260101000000",
    });
  });
});
