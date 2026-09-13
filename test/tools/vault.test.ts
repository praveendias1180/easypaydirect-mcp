import { describe, expect, it } from "vitest";
import { registerVaultTools } from "../../src/tools/vault.js";
import { TEST_KEY, connectTools, loadFixture, mockFetchOnce, resultText, sentRequest } from "../helpers.js";

describe("customer vault tools", () => {
  it("get_customer_vault_record queries report_type=customer_vault", async () => {
    const fetch = mockFetchOnce(loadFixture("customer-vault.xml"));
    const client = await connectTools(registerVaultTools);

    const result = await client.callTool({
      name: "get_customer_vault_record",
      arguments: { customer_vault_id: "3000000001" },
    });

    expect(Object.fromEntries(sentRequest(fetch).params)).toEqual({
      security_key: TEST_KEY,
      report_type: "customer_vault",
      customer_vault_id: "3000000001",
    });
    const customer = JSON.parse(resultText(result)).nm_response.customer_vault.customer;
    expect(customer.cc_number).toBe("4xxxxxxxxxxx1111");
  });

  it("list_customer_vault forwards date filters and drops unknown arguments", async () => {
    const fetch = mockFetchOnce(loadFixture("customer-vault.xml"));
    const client = await connectTools(registerVaultTools);

    await client.callTool({
      name: "list_customer_vault",
      arguments: { date_search: "updated", end_date: "20260131235959", transaction_id: "999" },
    });

    expect(Object.fromEntries(sentRequest(fetch).params)).toEqual({
      security_key: TEST_KEY,
      report_type: "customer_vault",
      date_search: "updated",
      end_date: "20260131235959",
    });
  });

  it("rejects a call missing the required customer_vault_id without calling the gateway", async () => {
    const fetch = mockFetchOnce(loadFixture("customer-vault.xml"));
    const client = await connectTools(registerVaultTools);

    const result = await client
      .callTool({ name: "get_customer_vault_record", arguments: {} })
      .catch((e: unknown) => e);

    expect(fetch).not.toHaveBeenCalled();
    // Depending on the SDK version this is an isError result or a thrown McpError.
    expect(result instanceof Error || (result as { isError?: boolean }).isError === true).toBe(true);
  });
});
