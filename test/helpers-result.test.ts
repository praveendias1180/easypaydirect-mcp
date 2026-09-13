import { describe, expect, it } from "vitest";
import { NmiQueryError } from "../src/client.js";
import { jsonResult, toErrorResult } from "../src/tools/helpers.js";

describe("jsonResult", () => {
  it("wraps data as pretty-printed JSON text", () => {
    expect(jsonResult({ a: 1 })).toEqual({
      content: [{ type: "text", text: '{\n  "a": 1\n}' }],
    });
  });
});

describe("toErrorResult", () => {
  it("includes the HTTP status for NmiQueryError", () => {
    const result = toErrorResult(new NmiQueryError("Query API returned HTTP 500", 500, "raw body"));
    expect(result).toEqual({
      content: [{ type: "text", text: "Error: Query API returned HTTP 500 (HTTP 500)" }],
      isError: true,
    });
  });

  it("never includes the raw response body", () => {
    const result = toErrorResult(new NmiQueryError("boom", 500, "SECRET-BODY"));
    expect(result.content[0].text).not.toContain("SECRET-BODY");
  });

  it("uses the message of a plain Error", () => {
    expect(toErrorResult(new Error("oops")).content[0].text).toBe("Error: oops");
  });

  it("stringifies non-Error values", () => {
    expect(toErrorResult("nope").content[0].text).toBe("Error: nope");
  });
});
