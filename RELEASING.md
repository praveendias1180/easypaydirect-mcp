# Releasing

How to cut a new release of `easypaydirect-mcp`. Maintainers only.

Each release goes to three places: **npm**, the **MCP Registry**, and a **GitHub Release**.
Publishing the GitHub Release triggers [`.github/workflows/publish.yml`](.github/workflows/publish.yml),
which publishes to npm and the MCP Registry. **No tokens, no OTP, nothing to run locally.**

## Steps

### 1. Prepare the release (in a PR)

Make sure `CHANGELOG.md` → `## [Unreleased]` lists the changes, then:

```bash
npm run release -- patch        # or minor | major | 0.2.0
```

This bumps `package.json`, `package-lock.json` and both versions in `server.json`,
and turns `[Unreleased]` into a dated `## [X.Y.Z]` section with compare links.
It refuses to run if `[Unreleased]` is empty.

Open a PR with the result (`chore(release): X.Y.Z`) and merge it once CI is green.

### 2. Publish the GitHub Release

```bash
gh release create vX.Y.Z --target main --title "vX.Y.Z" \
  --notes-file <(awk '/^## \[X.Y.Z\]/{f=1;next} /^## \[/{f=0} f' CHANGELOG.md)
```

(or **Releases → Draft a new release** in the GitHub UI, tag `vX.Y.Z` on `main`).

That's it. The **Publish** workflow then:

1. checks the tag matches `package.json` and both `server.json` versions — fails loudly if not,
2. runs typecheck, build and tests,
3. publishes to **npm** with provenance, via [Trusted Publishing](https://docs.npmjs.com/trusted-publishers),
4. publishes `server.json` to the **MCP Registry**, via GitHub OIDC.

Watch it under **Actions → Publish**. Each publish step skips a target that
already has the version, so if one fails part-way, fix the cause and use
**Run workflow** with the tag to retry.

### Verify

```bash
npm view easypaydirect-mcp@X.Y.Z version mcpName
curl -s "https://registry.modelcontextprotocol.io/v0/servers?search=io.github.praveendias1180/easypaydirect-mcp"
```

## One-time setup (already done — only needed if it's ever reset)

- **npm Trusted Publisher.** On npmjs.com → `easypaydirect-mcp` → **Settings** →
  **Trusted Publisher** → **GitHub Actions**: owner `praveendias1180`, repository
  `easypaydirect-mcp`, workflow filename `publish.yml`, environment blank.
  Renaming the workflow file breaks publishing until this is updated.
- **MCP Registry.** Nothing to configure: GitHub OIDC from this repo proves
  ownership of the `io.github.praveendias1180/*` namespace.
- Keep the **`mcpName`** field in `package.json` — the MCP Registry uses it to verify
  the npm package belongs to this server. Don't remove it.
- Keep `repository.url` in `package.json` pointing at this repo — Trusted Publishing
  checks it.

## Notes

- **Read-only stays the default.** Any write capability would be a separate, opt-in,
  gated **major** version — never a patch/minor.
- Versions in `package.json`, `server.json`, and the npm/registry/GitHub release must
  all match; the workflow enforces it.
