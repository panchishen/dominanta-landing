# design-sync NOTES — Crystalis

## Shape: OFF-SCRIPT (tokens + static-HTML previews, no React)

This repo is **not** a React component library: no `package.json`, no `dist/`, no Storybook.
It is a Figma-generated **token + reference-card** design system:
- `tokens.css` / `design-tokens.json` / `tailwind.config.js` — design tokens
- `components/<slug>/index.html` — 29 self-contained preview cards (each with a `@dsCard` first line + inlined tokens)
- `components/foundations/*.html` — 5 foundations cards
- `_source/` — the Figma→tokens/cards build pipeline; `_source/components.json` holds the variant/prop matrix

The standard `/design-sync` converter (`package-build.mjs`, esbuild over a React `dist/`) **does not apply** and must not be run here. The bundle is assembled by hand by `.design-sync/build-bundle.mjs`.

## How the bundle is produced

`node .design-sync/build-bundle.mjs` → writes `./ds-bundle`:
- `styles.css` → `@import` closure: `fonts/onest.css` + `tokens/tokens.css`
- `tokens/` ← copied from repo `tokens.css` + `design-tokens.json`
- `fonts/` ← **Onest downloaded from Google Fonts at build time** (variable woff2, 4 subset files: cyrillic-ext/cyrillic/latin-ext/latin, weights 400–700), `@font-face` rewritten to local paths
- `components/<Group>/<Name>/` ← `<Name>.html` (the repo card, remote font `@import` rewritten to `../../../fonts/onest.css`), `<Name>.d.ts` (props interface from `components.json`), `<Name>.prompt.md` (usage doc). Foundations get `.html` + `.prompt.md` only (no `.d.ts`).
- `_ds_bundle.js` → **empty-bodied** (`window.Crystalis = {}`) — there are no importable React components, by design.
- `README.md` ← `.design-sync/conventions.md` (readmeHeader) + generated component index.

Render verification: `node .design-sync/render-verify.mjs` screenshots every card with headless Chrome (`C:\Program Files\Google\Chrome\Application\chrome.exe`) into `ds-bundle/_screenshots/` and tiles contact sheets. All 34 cards rendered non-blank and styled on the first sync (2026-06-16).

## Re-sync procedure (do NOT use resync.mjs / package-build.mjs)

1. `node .design-sync/build-bundle.mjs`
2. `node .design-sync/render-verify.mjs` — Read the contact sheets; confirm no blanks/regressions.
3. Re-validate `.design-sync/conventions.md` names against `ds-bundle/tokens/tokens.css` (the conventions step) — report drift, don't rewrite the human-owned file.
4. Re-upload to project `e6ca57d6-ea5a-4e59-9438-b33bbc27d6d6` (pinned in config.json):
   `finalize_plan` (localDir `./ds-bundle`) → sentinel `_ds_needs_recompile` → all content (≤256/call) → **reconciliation deletes** (list_files vs ds-bundle: this project is now non-empty, so a re-sync MUST delete remote paths the new build dropped) → sentinel re-arm. The project is now in active use → treat re-syncs as the **atomic path** (upload once, after verification).

## Re-sync risks / watch-list

- **Fonts are fetched from Google at build time** — needs network. If `fonts/` ends up with <4 woff2 or `onest.css` still points at `fonts.gstatic.com`, the download failed; re-run with network. Google may switch Onest between the variable-font CSS (4 files) and per-weight static CSS (16 files) depending on the request UA — both are valid; the script copies whatever it gets.
- **No `_ds_sync.json` anchor** is uploaded (off-script). Every re-sync re-verifies + re-uploads everything. That's correct and cheap here; don't try to wire `resync.mjs`.
- **No real components** — `window.Crystalis` is empty on purpose. The design agent builds from tokens + the per-component `.html`/`.prompt.md`/`.d.ts`. If a future requirement is "drop-in React components", that's a different project (would mean authoring real components — out of scope for this repo as built).
- `.d.ts`/`.prompt.md` are derived from `_source/components.json`. If the Figma library changes variants, regenerate `components.json` via `_source/` first, then rebuild.
- Card viewports come from each card's `@dsCard` line; render-verify caps window size at 1400×1500 for screenshots only (does not affect uploaded cards).
- **The project is in ACTIVE USE — preserve non-repo files.** As of the 2026-06-17 re-sync the project also contains app/user-authored paths that this repo does NOT produce: `templates/hero-dental/*`, `screenshots/hero*.png`, `uploads/*.png`, `image-slot.js`, `_adherence.oxlintrc.json`, `.thumbnail`, and the app-generated `_ds_manifest.json`. These live OUTSIDE the repo-owned namespaces (`components/`, `fonts/`, `tokens/`, + `styles.css`/`README.md`/`_ds_bundle.js`). Reconciliation deletes must be scoped to the repo-owned namespaces ONLY (the finalize_plan `deletes` globs were `components/** tokens/** fonts/**`) — never delete the above. Practically: a re-sync only deletes a remote `components|fonts|tokens` path if the fresh build dropped it. The 2026-06-17 re-sync found zero such orphans (build reproduces every owned-namespace remote file), so it deleted nothing.

## Durable files (commit these if/when the repo is under git)

`.design-sync/config.json`, `conventions.md`, `build-bundle.mjs`, `render-verify.mjs`, `NOTES.md`.
Generated/local (gitignore): `ds-bundle/`, `ds-bundle/_screenshots/`.
