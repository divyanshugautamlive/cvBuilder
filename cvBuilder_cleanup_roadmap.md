# CVDesignHub (cvBuilder) — Cleanup & Hardening Roadmap

**Prepared for:** Rahul (Crowcent)
**Scope:** Address dead code, repo hygiene, and structural debt found in the codebase audit. Plan only — no changes have been made yet.
**Approach:** Ordered in phases so each phase is independently shippable, low-risk, and verifiable before moving to the next. Every phase ends with an explicit verification step, matching standard practice for refactoring a live app (small PRs, one concern at a time, tests/manual QA before merging).

---

## Phase 0 — Safety Net (do this before touching anything)

Nothing below should happen on `main` directly, given how much of the tree gets touched.

1. Resolve the stuck `.git/index.lock` (currently blocking git operations) — kill any hung git process, then remove the lock file.
2. Create a dedicated branch: `cleanup/dead-code-and-hygiene`.
3. Tag or note the current commit (`0bf9b0b`) as a rollback point.
4. Take a working build snapshot: run `npm run build` on current `main` and confirm `dist/` output loads correctly, so there's a known-good baseline to diff against after cleanup.

**Effort:** 15 min. **Risk:** none — read-only prep.

---

## Phase 1 — Git Hygiene (line endings)

The 83-file, 8,694/8,694 line diff is a pure CRLF/LF flip, not real change. Fix the root cause once so it never recurs.

1. Add a `.gitattributes` file pinning line endings, e.g.:
   - `* text=auto eol=lf`
   - Explicit overrides for binary types already handled by `.gitignore`/build (images, fonts, `.docx`/`.pdf` test fixtures).
2. Set `git config core.autocrlf` consistently for the project (recommend `input` on Windows for this repo, or rely solely on `.gitattributes` so it's enforced regardless of local git config).
3. Run a one-time normalization commit: `git add --renormalize .` then commit as `chore: normalize line endings (LF)`.
4. Verify `git status` is clean immediately after, and that `git diff` on that commit shows only whitespace/mode changes (no logic changes slipped in).

**Effort:** 30 min. **Risk:** low, but do it as its own isolated commit so it never gets tangled with a real code change in review.

---

## Phase 2 — Remove Dead Code (the orphaned first version)

This is the biggest win: roughly a third of `src/` is unreachable from `main.jsx` → `App.jsx`.

### 2.1 Confirm the dead set (already identified, re-verify before deleting)
- `src/pages/HomePage.jsx`
- `src/pages/BuilderPage.jsx`
- `src/components/forms/FormBuilder.jsx` + `src/components/forms/steps/*.jsx` (Education, Experience, PersonalInfo, Skills, Summary)
- `src/components/templates/TemplateRenderer.jsx` (top-level duplicate — **not** the live one at `components/features/preview/TemplateRenderer.jsx`, which stays)
- `src/components/features/FileUploader.jsx`
- `src/components/features/TemplateSwitcher.jsx`
- `src/components/features/ATSScoreDisplay.jsx`
- `src/components/features/ExportControls.jsx`
- `src/components/features/JobMatcher.jsx`
- `src/components/features/ResumeForm.jsx`
- `src/components/features/analysis/JobMatcher.jsx` — **check separately**: confirm whether this is used by the live `FormWizard.jsx` chain or is a second duplicate of the top-level `JobMatcher.jsx` before deleting.

### 2.2 Confirm dead utils
- `src/utils/atsScoring.js`
- `src/utils/export.js`
- `src/utils/exportHelpers.js`
- `src/utils/gtmDataLayer.js` — **verify first**: `app.html` has GTM wired inline via script tag; confirm this util isn't a planned/partial integration point before deleting outright, since GTM data layer pushes may be intended to come from here eventually.
- `src/utils/pdfExport.js`
- `src/utils/resumeParser.js` — **verify first**: the live `FileUploader` (parser variant) uses `fileHelpers.js`, but check if `resumeParser.js` holds logic `fileHelpers.js` calls into internally before deleting.
- `src/utils/uploadScorer.js`

### 2.3 Process (do not bulk-delete blind)
1. Re-run an import graph check (grep for every remaining file's exact filename across `src/`) right before deleting, since files may have shifted between audit and cleanup.
2. Delete in small batches by feature area (pages → forms → templates duplicate → features duplicates → utils), committing each batch separately: `chore: remove dead HomePage/BuilderPage tree`, `chore: remove unused legacy utils`, etc. Small commits make it trivial to revert a single batch if something turns out to be a hidden dependency.
3. After each batch: run `npm run build` and `npm run lint`, and manually click through the app (resume wizard, template switch, cover letter, export, upload/parse a sample resume) to confirm nothing regressed.
4. Once deletion is complete, run a repo-wide "orphan file" pass (e.g. a quick script cross-referencing every `.jsx`/`.js` file under `src/` against all import statements) to catch anything missed.

### 2.4 Decide fate of `react-router-dom`
It's a dependency but nothing routes today (`main.jsx` renders `App` directly, no `<BrowserRouter>`). Two options, pick one:
- **Remove it** if the two-view (resume/cover-letter) tab pattern in `App.jsx` is intentionally staying tab-based rather than route-based.
- **Wire it up properly** if the long-term plan is to have real routes (e.g. `/`, `/builder`, `/cover-letter`) — in which case this is the natural moment to introduce `<BrowserRouter>` and turn `App.jsx`'s manual `activeView` state into actual routes, and `HomePage.jsx` could be revived as the `/` route instead of deleted (see Phase 2.1 — flag this file for a decision before deleting, since it may be salvageable).

**Effort:** 2–4 hours including manual QA. **Risk:** medium — mitigated by small commits + build/lint/manual-check after each.

---

## Phase 3 — Repo Structure Cleanup

1. **`backups/templates-before-jupiter-mars/`** — currently tracked in git. Since git history already preserves old versions of these files (that's what commits are for), remove this folder from the tracked tree. If Rahul wants a quick-access snapshot outside of git blame archaeology, keep it locally but add it to `.gitignore` instead of committing it.
2. **Two-entry Vite setup (`index.html` marketing page + `app.html` React app)** — this is intentional and fine, but document it explicitly in `README.md` so future-Rahul (or anyone else) doesn't mistake `app.html` for dead weight the way `pages/BuilderPage.jsx` was. One paragraph: "This project builds two independent HTML entry points — `index.html` (static marketing landing page) and `app.html` (the React app, mounted via `src/main.jsx`) — configured in `vite.config.js` `rollupOptions.input`."
3. **`gtm-container-ga4.json`** — confirm whether this is an active GTM export used for import/reference, or a stale one-time export; if stale, move to a `docs/` or `ops/` folder rather than repo root, or drop it if it's not something that needs to ship.
4. **`test_resume.docx` / `test_resume.pdf`** at repo root — these look like manual test fixtures for the upload/parse feature. Move them into a `src/__tests__/fixtures/` (or similar) folder next to `src/__tests__`, so root stays clean and their purpose is obvious.
5. Rewrite `README.md` — it's still the default Vite template text. Replace with an actual project README: what the app does, the two-entry-point build, how to run dev/build, folder structure overview, and a short "known structure" note pointing at `src/components/features/*` as the live component tree (to prevent a second generation of orphaned duplicates).

**Effort:** 1–2 hours. **Risk:** low.

---

## Phase 4 — Component Architecture Consistency

Once dead code is gone, the live tree still has some structural inconsistency worth flagging for a follow-up pass (separate from this cleanup, but worth planning):

1. **Duplicate `TemplateSwitcher.jsx` naming** — after Phase 2, only `components/features/preview/TemplateSwitcher.jsx` should remain, but double-check there isn't a second live one elsewhere with the same name causing import ambiguity.
2. **Template component contract** — 9 resume templates + 2 cover-letter templates each currently take resume/cover-letter data as props independently. Worth a short audit (not necessarily a rewrite) to confirm they all share one consistent prop shape, so adding a 10th template later doesn't require reverse-engineering each existing one.
3. **`useResumeStore.js` (106 lines, single Zustand store)** — fine at current size; flag for splitting into slices (e.g. `resumeSlice`, `templateSlice`, `coverLetterSlice`) only once it grows past a size where a single file becomes hard to navigate. Not urgent now — just note it so it doesn't get missed later.

**Effort:** 2–3 hours if pursued now, or defer to a later sprint — flagged here as a "next" item rather than part of the core cleanup.

---

## Phase 5 — Testing Safety Net

`src/__tests__/` exists but wasn't inspected for coverage during the audit — check what's actually tested before/after cleanup so Phase 2 deletions have a regression check beyond manual clicking.

1. Inventory current tests in `src/__tests__/` — what's covered today (if anything beyond scaffolding).
2. At minimum, before deleting dead code, add a couple of smoke tests for the **live** critical paths so future changes have a safety net:
   - Resume form wizard renders and accepts input across all steps.
   - Template switch renders each of the 9 templates without throwing.
   - File upload/parse handles a sample `.docx` and `.pdf` (the fixtures already sitting at repo root, once relocated per Phase 3).
   - Export button triggers print without error.
3. Wire `npm test` (or equivalent) into the workflow so it's a checkbox before each cleanup commit lands, not an afterthought.

**Effort:** 3–5 hours depending on existing test setup. **Risk:** none — pure addition.

---

## Phase 6 — Build/Config Hygiene

1. Confirm `eslint.config.js` is actually being run against the live tree post-cleanup (`npm run lint` should show zero errors/warnings introduced by leftover references to deleted files).
2. Double check `vite.config.js` build output (`dist/main.html` + `dist/app.html` equivalent) still resolves correctly with the two-entry setup after dead files are gone.
3. Review `.gitignore` — `dist` and `node_modules` are already excluded correctly; nothing else appears misconfigured here, just a confirmation step.

**Effort:** 30 min, mostly verification.

---

## Phase 7 — Final Verification & Merge

1. Full manual QA pass on the built app (`npm run build && npm run preview`): resume wizard end-to-end, all 9 templates, cover letter builder + its 2 templates, ATS scorer, upload/parse, export/print, dark mode toggle, mobile tab view.
2. Confirm `npm run lint` is clean.
3. Confirm `npm test` (once Phase 5 lands) passes.
4. Squash or keep the batched commits (recommend keeping them separate in history — easier to bisect later if something regresses).
5. Merge `cleanup/dead-code-and-hygiene` → `main`.
6. Delete the branch; keep the rollback tag from Phase 0 for a few weeks as extra insurance.

---

## Summary Table

| Phase | What | Effort | Risk |
|---|---|---|---|
| 0 | Safety net (branch, unlock git, baseline build) | 15 min | none |
| 1 | Fix line-ending churn via `.gitattributes` | 30 min | low |
| 2 | Delete dead pages/forms/templates/utils tree | 2–4 hrs | medium |
| 3 | Repo structure cleanup (backups, fixtures, README) | 1–2 hrs | low |
| 4 | Component architecture consistency (flag for later) | 2–3 hrs / deferred | low |
| 5 | Add smoke tests before/after cleanup | 3–5 hrs | none |
| 6 | Build/config verification | 30 min | none |
| 7 | Final QA + merge | 1–2 hrs | low |

**Total hands-on effort:** roughly 1–2 focused days, most of it in Phase 2 (careful, batch-by-batch deletion with verification after each step) — everything else is quick hygiene or can be deferred without blocking the cleanup itself.

No changes have been implemented — this is the plan to execute when ready, phase by phase.
