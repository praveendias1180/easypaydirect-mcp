import { describe, expect, it } from "vitest";
import { registerTransactionTools } from "../../src/tools/transactions.js";
import { TEST_KEY, connectTools, loadFixture, mockFetchOnce, resultText, sentRequest } from "../helpers.js";

describe("transaction tools", () => {
  it("registers get_transaction and search_transactions", async () => {
    const client = await connectTools(registerTransactionTools);

    const { tools } = await client.listTools();

    expect(tools.map((t) => t.name).sort()).toEqual(["get_transaction", "search_transactions"]);
  });

  it("get_transaction sends only the transaction_id (no report_type)", async () => {
    const fetch = mockFetchOnce(loadFixture("transaction-single.xml"));
    const client = await connectTools(registerTransactionTools);

    const result = await client.callTool({
      name: "get_transaction",
      arguments: { transaction_id: "1000000001" },
    });

    expect(Object.fromEntries(sentRequest(fetch).params)).toEqual({
      security_key: TEST_KEY,
      transaction_id: "1000000001",
    });
    expect(result.isError).toBeFalsy();
    expect(JSON.parse(resultText(result)).nm_response.transaction.transaction_id).toBe("1000000001");
  });

  it("search_transactions forwards its filters and drops unknown arguments", async () => {
    const fetch = mockFetchOnce(loadFixture("transaction-multiple.xml"));
    const client = await connectTools(registerTransactionTools);

    await client.callTool({
      name: "search_transactions",
      arguments: {
        start_date: "20260101000000",
        condition: "complete",
        email: "alex@example.com",
        report_type: "customer_vault", // not in the schema — must not reach the gateway
        security_key: "attacker",
      },
    });

    expect(Object.fromEntries(sentRequest(fetch).params)).toEqual({
      security_key: TEST_KEY,
      start_date: "20260101000000",
      condition: "complete",
      email: "alex@example.com",
    });
  });

  it("returns an MCP error result (not a throw) when the gateway fails", async () => {
    mockFetchOnce(loadFixture("auth-failure.txt"));
    const client = await connectTools(registerTransactionTools);

    const result = await client.callTool({ name: "get_transaction", arguments: { transaction_id: "1" } });

    expect(result.isError).toBe(true);
    expect(resultText(result)).toMatch(/^Error: Unexpected non-XML response/);
    expect(resultText(result)).not.toContain(TEST_KEY);
  });
});
