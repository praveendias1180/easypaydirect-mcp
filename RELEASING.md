# Releasing

How to cut a new release of `easypaydirect-mcp`. Maintainers only.

Each release goes to three places: **npm**, the **MCP Registry**, and a **GitHub Release**.

## Prerequisites (one-time)

- **npm access** to the `easypaydirect-mcp` package.
- **`mcp-publisher`** CLI — download the binary for your OS from the
  [registry releases](https://github.com/modelcontextprotocol/registry/releases)
  (e.g. `mcp-publisher_linux_amd64.tar.gz`), or `brew install mcp-publisher`.
- **`gh`** CLI logged in as a GitHub account that owns the `io.github.<user>` namespace.
- Keep the **`mcpName`** field in `package.json` — the MCP Registry uses it to verify
  the npm package belongs to this server. Don't remove it.

## Steps

Replace `X.Y.Z` with the new version (semver).

### 1. Bump the version

Update the version in **both** files (keep them in sync):

- `package.json` → `version`
- `server.json` → top-level `version` **and** `packages[0].version`

Add a `## [X.Y.Z]` section to `CHANGELOG.md` and update the compare links at the bottom.

### 2. Commit + push

```bash
git add package.json server.json CHANGELOG.md
git commit -m "chore(release): X.Y.Z"
git push origin main
```

### 3. Publish to npm

```bash
npm publish --access public
```

- Requires 2FA. Pass `--otp=<code>` if it doesn't prompt.
- If you get `401 Unauthorized`, your token lapsed — re-login first:
  `npm login --auth-type=legacy` (username / password / OTP), then publish.
- The published package **must** contain `mcpName` (verify: `npm view easypaydirect-mcp@X.Y.Z mcpName`).

### 4. Publish to the MCP Registry

```bash
# Authenticate (a gh CLI token works — no interactive device flow needed):
mcp-publisher login github -token "$(gh auth token)"

# Publish the manifest (reads ./server.json):
mcp-publisher publish
```

Verify it's live:

```bash
curl -s "https://registry.modelcontextprotocol.io/v0/servers?search=easypaydirect-mcp"
```

### 5. Cut the GitHub Release

```bash
gh release create vX.Y.Z --title "vX.Y.Z" --notes "…release notes…"
```

Draw the notes from the new `CHANGELOG.md` section.

## TL;DR (after the version bump + commit)

```bash
npm publish --access public
mcp-publisher login github -token "$(gh auth token)"
mcp-publisher publish
gh release create vX.Y.Z --title "vX.Y.Z" --notes-file <(sed -n '/## \[X.Y.Z\]/,/## \[/p' CHANGELOG.md)
```

## Notes

- **Read-only stays the default.** Any write capability would be a separate, opt-in,
  gated **major** version — never a patch/minor.
- Versions in `package.json`, `server.json`, and the npm/registry/GitHub release should
  all match.
