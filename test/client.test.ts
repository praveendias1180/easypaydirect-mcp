import { describe, expect, it } from "vitest";
import { NmiClient, NmiQueryError } from "../src/client.js";
import {
  TEST_CONFIG,
  TEST_KEY,
  loadFixture,
  mockFetchOnce,
  mockFetchReject,
  queryErrorOf,
  sentRequest,
} from "./helpers.js";

const client = () => new NmiClient(TEST_CONFIG);

describe("NmiClient.query — request", () => {
  it("POSTs form-encoded params to <apiUrl>/api/query.php with the security key", async () => {
    const fetch = mockFetchOnce(loadFixture("empty.xml"));

    await client().query({ report_type: "recurring", subscription_id: "2000000001" });

    const { url, init, params } = sentRequest(fetch);
    expect(url).toBe("https://gateway.example.test/api/query.php");
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({ "Content-Type": "application/x-www-form-urlencoded" });
    expect(params.get("security_key")).toBe(TEST_KEY);
    expect(params.get("report_type")).toBe("recurring");
    expect(params.get("subscription_id")).toBe("2000000001");
  });

  it("omits undefined and empty-string params", async () => {
    const fetch = mockFetchOnce(loadFixture("empty.xml"));

    await client().query({ start_date: undefined, email: "", order_id: "ORDER-1001" });

    const keys = [...sentRequest(fetch).params.keys()];
    expect(keys).toEqual(["security_key", "order_id"]);
  });

  it("never lets a param replace the configured security key", async () => {
    const fetch = mockFetchOnce(loadFixture("empty.xml"));

    await client().query({ security_key: "attacker-key", report_type: "recurring" });

    expect(sentRequest(fetch).params.getAll("security_key")).toEqual([TEST_KEY]);
  });

  it("keeps a value containing & and = as a single field", async () => {
    const fetch = mockFetchOnce(loadFixture("empty.xml"));

    await client().query({ email: "a@example.com&report_type=customer_vault&x=1" });

    const { params } = sentRequest(fetch);
    expect(params.get("email")).toBe("a@example.com&report_type=customer_vault&x=1");
    expect(params.has("report_type")).toBe(false);
    expect(params.has("x")).toBe(false);
  });
});

describe("NmiClient.query — responses", () => {
  it("parses a single transaction into a nested object with string values", async () => {
    mockFetchOnce(loadFixture("transaction-single.xml"));

    const result = (await client().query({ transaction_id: "1000000001" })) as any;

    const tx = result.nm_response.transaction;
    expect(tx.transaction_id).toBe("1000000001");
    expect(tx.action.amount).toBe("49.00"); // kept as a string, not 49
    expect(tx.action.response_code).toBe("100");
  });

  it("returns an array when several records match", async () => {
    mockFetchOnce(loadFixture("transaction-multiple.xml"));

    const result = (await client().query({})) as any;

    const txs = result.nm_response.transaction;
    expect(Array.isArray(txs)).toBe(true);
    expect(txs).toHaveLength(2);
    expect(Array.isArray(txs[1].action)).toBe(true);
  });

  it("parses an empty result", async () => {
    mockFetchOnce(loadFixture("empty.xml"));

    const result = (await client().query({})) as any;

    expect(result.nm_response).toBe("");
  });

  it("keeps XML attributes", async () => {
    mockFetchOnce(loadFixture("customer-vault.xml"));

    const result = (await client().query({ report_type: "customer_vault" })) as any;

    expect(result.nm_response.customer_vault.customer["@_id"]).toBe("3000000001");
  });
});

describe("NmiClient.query — errors", () => {
  it("throws NmiQueryError with the status on a non-2xx response", async () => {
    mockFetchOnce("Service Unavailable", 503);

    const err = await queryErrorOf(client().query({}));

    expect(err).toBeInstanceOf(NmiQueryError);
    expect(err.status).toBe(503);
    expect(err.message).toBe("Query API returned HTTP 503");
  });

  it("throws a helpful error on a plaintext (auth failure) body", async () => {
    mockFetchOnce(loadFixture("auth-failure.txt"));

    const err = await queryErrorOf(client().query({}));

    expect(err).toBeInstanceOf(NmiQueryError);
    expect(err.message).toMatch(/check NMI_SECURITY_KEY and NMI_API_URL/);
    expect(err.message).toMatch(/Authentication Failed/);
  });

  it("wraps network errors without leaking the security key", async () => {
    mockFetchReject(new TypeError("fetch failed"));

    const err = await queryErrorOf(client().query({ transaction_id: "1" }));

    expect(err).toBeInstanceOf(NmiQueryError);
    expect(err.message).toBe("Network error calling https://gateway.example.test/api/query.php: fetch failed");
    expect(err.message).not.toContain(TEST_KEY);
  });
});
