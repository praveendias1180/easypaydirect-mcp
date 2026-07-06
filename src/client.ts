import { XMLParser } from "fast-xml-parser";
import type { Config } from "./config.js";

/**
 * Values are kept as strings (parseTagValue: false) so that monetary amounts
 * and long numeric IDs are never coerced to floats and lose precision.
 */
const parser = new XMLParser({
  ignoreAttributes: false,
  parseTagValue: false,
  trimValues: true,
});

export type QueryParams = Record<string, string | number | undefined>;

export class NmiQueryError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly body?: string,
  ) {
    super(message);
    this.name = "NmiQueryError";
  }
}

/**
 * Thin client over the EPD / NMI **Query API** (`POST /api/query.php`).
 *
 * The Query API is strictly READ-ONLY: it returns transaction, subscription,
 * recurring-plan and customer-vault data. This client intentionally exposes no
 * way to reach the transaction (`transact.php`) endpoint, so no charge, refund,
 * void or vault-write can be issued through it.
 */
export class NmiClient {
  constructor(private readonly config: Config) {}

  async query(params: QueryParams): Promise<unknown> {
    const body = new URLSearchParams();
    body.set("security_key", this.config.securityKey);
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        body.set(key, String(value));
      }
    }

    const url = `${this.config.apiUrl}/api/query.php`;

    let res: Response;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
    } catch (err) {
      throw new NmiQueryError(`Network error calling ${url}: ${(err as Error).message}`);
    }

    const text = await res.text();

    if (!res.ok) {
      throw new NmiQueryError(`Query API returned HTTP ${res.status}`, res.status, text.slice(0, 500));
    }

    // A well-formed response is XML. A plaintext body almost always means an
    // authentication failure (bad/missing security key) or a wrong base URL.
    if (!text.trim().startsWith("<")) {
      throw new NmiQueryError(
        `Unexpected non-XML response (check NMI_SECURITY_KEY and NMI_API_URL): ${text.slice(0, 300)}`,
        res.status,
        text.slice(0, 500),
      );
    }

    return parser.parse(text);
  }
}
