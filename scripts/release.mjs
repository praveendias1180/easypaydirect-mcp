#!/usr/bin/env node
// Prepare a release: `npm run release -- 0.1.3` (or patch | minor | major).
//
// Bumps package.json + package-lock.json + both versions in server.json + the
// Claude Code plugin manifest, and
// turns the CHANGELOG's [Unreleased] section into the new version. Commit the
// result in a PR; publishing a GitHub Release for the tag does the rest
// (.github/workflows/publish.yml).
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const REPO = "https://github.com/praveendias1180/easypaydirect-mcp";
const arg = process.argv[2];
const fail = (msg) => {
  console.error(`release: ${msg}`);
  process.exit(1);
};

if (!arg) fail("usage: npm run release -- <X.Y.Z | patch | minor | major>");

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const [maj, min, pat] = pkg.version.split(".").map(Number);
const next =
  arg === "major" ? `${maj + 1}.0.0`
  : arg === "minor" ? `${maj}.${min + 1}.0`
  : arg === "patch" ? `${maj}.${min}.${pat + 1}`
  : arg;
if (!/^\d+\.\d+\.\d+$/.test(next)) fail(`"${arg}" is not a version or patch/minor/major`);
if (next === pkg.version) fail(`package.json is already ${next}`);

// CHANGELOG first, so nothing is written if there's nothing to release.
const changelog = readFileSync("CHANGELOG.md", "utf8");
const unreleased = changelog.match(/## \[Unreleased\]\n([\s\S]*?)(?=\n## \[)/);
if (!unreleased) fail("CHANGELOG.md has no [Unreleased] section");
if (!unreleased[1].trim()) fail("CHANGELOG.md [Unreleased] is empty — add the changes first");

const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
const updatedChangelog = changelog
  .replace("## [Unreleased]\n", `## [Unreleased]\n\n## [${next}] — ${today}\n`)
  .replace(
    /^\[Unreleased\]: .*$/m,
    `[Unreleased]: ${REPO}/compare/v${next}...HEAD\n[${next}]: ${REPO}/releases/tag/v${next}`,
  );

execFileSync("npm", ["version", next, "--no-git-tag-version"], { stdio: "ignore" });

const server = JSON.parse(readFileSync("server.json", "utf8"));
server.version = next;
server.packages[0].version = next;
writeFileSync("server.json", `${JSON.stringify(server, null, 2)}\n`);

const PLUGIN = "plugins/easypaydirect/.claude-plugin/plugin.json";
const plugin = JSON.parse(readFileSync(PLUGIN, "utf8"));
plugin.version = next;
writeFileSync(PLUGIN, `${JSON.stringify(plugin, null, 2)}\n`);

writeFileSync("CHANGELOG.md", updatedChangelog);

console.log(`Prepared v${next}. Next: open a PR, merge it, then publish a GitHub Release tagged v${next}.`);
