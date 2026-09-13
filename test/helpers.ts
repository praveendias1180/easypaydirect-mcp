import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { vi } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { NmiClient, NmiQueryError } from "../src/client.js";
import type { Config } from "../src/config.js";

/** A fake key. Tests assert it never leaks into errors or tool output. */
export const TEST_KEY = "test-security-key-DO-NOT-LEAK";

export const TEST_CONFIG: Config = {
  securityKey: TEST_KEY,
  apiUrl: "https://gateway.example.test",
};

/** Read a file from `test/fixtures/` (synthetic data only). */
export function loadFixture(name: string): string {
  return readFileSync(fileURLToPath(new URL(`./fixtures/${name}`, import.meta.url)), "utf8");
}

/**
 * Stub `fetch` so the next call returns `body` with `status`.
 * Returns the mock so you can inspect what was sent (see `sentParams`).
 */
export function mockFetchOnce(body: string, status = 200) {
  const mock = vi.fn(async () => new Response(body, { status }));
  vi.stubGlobal("fetch", mock);
  return mock;
}

/** Stub `fetch` so it rejects, as a DNS/connection failure would. */
export function mockFetchReject(error: Error) {
  const mock = vi.fn(async () => {
    throw error;
  });
  vi.stubGlobal("fetch", mock);
  return mock;
}

/** Await a promise that should reject with NmiQueryError, and return the error. */
export async function queryErrorOf(promise: Promise<unknown>): Promise<NmiQueryError> {
  const err = await promise.then(
    () => {
      throw new Error("expected the query to fail, but it succeeded");
    },
    (e: unknown) => e,
  );
  if (!(err instanceof NmiQueryError)) throw err;
  return err;
}

/** The URL and decoded form fields of the Nth fetch call (default: first). */
export function sentRequest(mock: ReturnType<typeof vi.fn>, call = 0) {
  const [url, init] = mock.mock.calls[call] as [string, RequestInit];
  return { url, init, params: new URLSearchParams(String(init.body)) };
}

/**
 * Spin up a real MCP server with the given tool registrations, connected to an
 * MCP client over an in-memory transport. No stdio, no network.
 */
export async function connectTools(
  ...register: Array<(server: McpServer, client: NmiClient) => void>
): Promise<Client> {
  const server = new McpServer({ name: "test", version: "0.0.0" });
  const nmi = new NmiClient(TEST_CONFIG);
  for (const r of register) r(server, nmi);

  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "test-client", version: "0.0.0" });
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  return client;
}

/** The text of the first content item of a tool result. */
export function resultText(result: unknown): string {
  const content = (result as { content: Array<{ type: string; text: string }> }).content;
  return content[0].text;
}
