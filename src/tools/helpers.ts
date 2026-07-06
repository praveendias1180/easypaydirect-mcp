import { NmiQueryError } from "../client.js";

/** Wrap parsed Query API data as an MCP text result (pretty-printed JSON). */
export function jsonResult(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}

/** Convert a thrown error into an MCP error result without leaking internals. */
export function toErrorResult(err: unknown) {
  let message: string;
  if (err instanceof NmiQueryError) {
    message = err.status ? `${err.message} (HTTP ${err.status})` : err.message;
  } else if (err instanceof Error) {
    message = err.message;
  } else {
    message = String(err);
  }
  return {
    content: [{ type: "text" as const, text: `Error: ${message}` }],
    isError: true as const,
  };
}
