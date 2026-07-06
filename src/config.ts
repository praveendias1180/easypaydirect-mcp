/**
 * Runtime configuration, loaded from environment variables.
 *
 * The gateway security key is read from the environment ONLY — it is never
 * accepted as a tool argument, so a model driving this server can never see it
 * or pass it around.
 */
export interface Config {
  /** Gateway API "security key" (read-only key recommended). */
  securityKey: string;
  /** Gateway API base URL, no trailing slash. */
  apiUrl: string;
}

const DEFAULT_API_URL = "https://secure.nmi.com";

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const securityKey = env.NMI_SECURITY_KEY?.trim();
  if (!securityKey) {
    throw new Error(
      "NMI_SECURITY_KEY is required. Set it to your gateway API security key " +
        "(EPD / NMI merchant portal -> Settings -> Security Keys). A read-only key is recommended.",
    );
  }

  const apiUrl = (env.NMI_API_URL?.trim() || DEFAULT_API_URL).replace(/\/+$/, "");

  return { securityKey, apiUrl };
}
