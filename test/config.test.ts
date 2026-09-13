import { describe, expect, it } from "vitest";
import { loadConfig } from "../src/config.js";

describe("loadConfig", () => {
  it("throws a helpful error when NMI_SECURITY_KEY is missing", () => {
    expect(() => loadConfig({})).toThrow(/NMI_SECURITY_KEY is required/);
  });

  it("treats a whitespace-only key as missing", () => {
    expect(() => loadConfig({ NMI_SECURITY_KEY: "   " })).toThrow(/NMI_SECURITY_KEY is required/);
  });

  it("trims the key", () => {
    expect(loadConfig({ NMI_SECURITY_KEY: "  abc123\n" }).securityKey).toBe("abc123");
  });

  it("defaults the API URL to secure.nmi.com", () => {
    expect(loadConfig({ NMI_SECURITY_KEY: "k" }).apiUrl).toBe("https://secure.nmi.com");
  });

  it("uses NMI_API_URL and strips trailing slashes", () => {
    const config = loadConfig({ NMI_SECURITY_KEY: "k", NMI_API_URL: " https://gw.example.test/// " });
    expect(config.apiUrl).toBe("https://gw.example.test");
  });

  it("falls back to the default when NMI_API_URL is blank", () => {
    expect(loadConfig({ NMI_SECURITY_KEY: "k", NMI_API_URL: " " }).apiUrl).toBe("https://secure.nmi.com");
  });
});
