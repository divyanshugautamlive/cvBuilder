# CVDesignHub (cvBuilder) — Master Implementation Plan

**Purpose:** One ordered, prioritized plan combining everything covered so far — the repo cleanup (mostly done) and the ATS scorer / resume parser overhaul (not started). Plan only — nothing new implemented in this document.

---

## Where things stand today

### ✅ Already done (verified against the live repo)
- Dead code purge: `HomePage`/`BuilderPage`, `forms/FormBuilder` + steps, duplicate `TemplateRenderer.jsx`, six duplicate `features/*` components, unused legacy utils (`atsScoring`, `export`, `exportHelpers`, `pdfExport`, `gtmDataLayer`, `resumeParser`, `uploadScorer`), orphaned prototype templates (Bold/Creative/Gradient/Infographic/Sidebar), dead `VersionManager`/`QuickActions`/`AIPresets` + CSS, dead `*Form.jsx` files, `react-router-dom`. Zero dangling references confirmed.
- Git hygiene: `.gitattributes` added, line endings normalized in a dedicated commit.
- Repo structure: `backups/` untracked, test fixtures moved to `src/__tests__/fixtures/`, README rewritten with real content.
- Testing: Vitest wired in, `smoke.test.jsx` covers form wizard navigation, all 9 template renders, PDF/DOCX upload+parse, print export.
- Linting: ESLint config fixed, all warnings/errors eliminated, `useEffect` dependency bug fixed in `App.jsx`.

### 🟡 Small items still open from the cleanup pass
1. **Template prop-shape audit** — confirm all 9 resume templates + 2 cover-letter templates share one consistent prop contract, so adding a future template doesn't require reverse-engineering each existing one.
2. **`useResumeStore.js` boilerplate** — 10 near-identical action blocks manually spreading state + calling `storage.set`. Worth collapsing with Zustand's `persist()` middleware. Not urgent, just noted so it doesn't get missed.
3. **Final Phase 7 sign-off** — run `npm run build && npm run lint && npm test` locally and do one manual click-through pass (resume wizard, all templates, cover letter, ATS score, upload/parse, export, dark mode, mobile view) to formally close out the cleanup effort. I couldn't get a clean run from the sandbox side due to a git/npm mount-sync issue unrelated to your files — this needs to happen on your machine.

### 🔴 Not started — the real functional gap
The ATS scorer is a hardcoded completeness formula, not a real score. The resume parser is a narrow regex parser that breaks on most real-world resume layouts. This is the meaningful next body of work, detailed below.

---

## Priority order for everything remaining

| # | Item | Source | Effort | Depends on |
|---|---|---|---|---|
| 1 | Close out Phase 7 (build/lint/test/manual QA) | Cleanup | 1–2 hrs | Nothing — do this first, it's just verification |
| 2 | Template prop-shape audit | Cleanup | 2–3 hrs | Nothing |
| 3 | **Plan A: harden regex parser + reconnect ATS scorer** | ATS/Parser | ~1.5–2 days | Nothing — safe to build immediately |
| 4 | `useResumeStore` → `persist()` middleware refactor | Cleanup | 2–3 hrs | Do after Plan A, since Plan A touches store-writing code paths (`updatePersonalInfo`/`updateSection`) and you don't want two refactors colliding |
| 5 | **Plan B1: Chrome Prompt API integration** | ATS/Parser | 4–6 hrs | Plan A (needs the regex parser as its fallback) |
| 6 | **Plan B2/B3: transformers.js fallback + final regex fallback wiring** | ATS/Parser | 1–1.5 days | Plan B1 |
| 7 | **Plan B4: validation/guardrails/timeout on AI path** | ATS/Parser | 3–4 hrs | Plan B2/B3 |
| 8 | Plan C: cloud LLM backend (only if B proves insufficient) | ATS/Parser | 1–2 days | Real usage data showing B isn't enough |

Items 1–2 are quick verification/audit work that closes the loop on the cleanup you already mostly did — do them first so you're not carrying open threads into new feature work. Item 3 (Plan A) is the single highest-leverage item on this whole list: it's free, has no new dependencies, fixes both broken features at once, and everything in the AI path (items 5–7) depends on it existing as the fallback layer. Item 4 is small and best slotted right after Plan A rather than before, since Plan A already touches the same store-update call sites. Items 5–7 are the AI upgrade, buildable incrementally — you get real value from item 5 alone before doing 6–7. Item 8 stays parked unless you specifically decide the on-device path isn't accurate enough after real usage.

---

## Detail: Plan A — Harden the regex parser & reconnect the ATS scorer

*(No AI, no new dependencies, ship this first)*

**A1 — Fix PDF text extraction order.** `extractTextFromPDF` in `src/utils/fileHelpers.js` currently concatenates `textContent.items` in raw PDF stream order, not visual reading order. Use each item's position (`item.transform` → x/y), group into lines by y-position, sort lines top-to-bottom and items within a line left-to-right. Fixes most garbling on two-column/sidebar-style resumes. *2–3 hrs.*

**A2 — Broaden the regex patterns in `parseResumeText`.**
- Phone: add international formats, especially Indian numbers (`+91`, 10-digit) alongside the current US-only pattern.
- Section headers: replace literal word matches with a synonym dictionary per section (Experience: "work history," "employment," "career history"; Skills: "core competencies," "technical skills"; Education: "academic background," "qualifications").
- Degrees: add non-US formats — B.Tech, B.E., BCA, MCA, Diploma.
- Experience entries: replace the single rigid `Company | Title | Date` one-line regex with a block-based parser — split on blank lines, apply looser per-line field detection (year-pattern line = date, Title Case line nearby = title/company) instead of requiring one exact shape.
*4–6 hrs.*

**A3 — Per-field confidence indicators in the UI.** Since parsed data already flows into the same editable form fields the wizard renders, flag low-confidence/best-guess fields so users know what to double-check. Sets honest expectations rather than chasing unattainable 100% regex accuracy. *2–3 hrs.*

**A4 — Reconnect the ATS Scorer to real signals.**
- Fold `JobMatcher`'s keyword-match percentage into `ATSScorer` as the dominant weighted component, replacing the flat always-applied `score += 25` line.
- Replace `JobMatcher`'s 12-word hardcoded tech whitelist + ">5 characters" heuristic with a proper stop-word-filtered keyword extractor.
- Add real structural/template-safety checks; audit the current 9 templates to confirm all are single-column/ATS-safe (multi-column prototypes were already removed in cleanup).
*3–4 hrs.*

---

## Detail: Plan B — On-device AI extraction

*(No API key, no backend — layers on top of Plan A, which becomes the automatic fallback)*

**B1 — Chrome Prompt API (Gemini Nano).** Feature-detect `window.LanguageModel` (verify exact API surface against `developer.chrome.com/docs/ai/prompt-api` at build time, since it's actively stabilizing through 2026). Send extracted resume text with a structured prompt requesting the exact JSON shape the store already expects; parse and feed into the existing `updatePersonalInfo`/`updateSection` calls — no store changes needed, only how the data going into them gets produced. *4–6 hrs.*

**B2 — transformers.js + WebGPU fallback.** For non-Chrome browsers, feature-detect WebGPU and lazy-load a small quantized model (sub-2GB) only at upload time, with a "preparing AI parser (first time only)" progress indicator — cached after first download. *1–1.5 days.*

**B3 — Final fallback to Plan A's regex parser** for browsers/devices with neither the Prompt API nor WebGPU. User experience should be identical regardless of which path ran. *2–3 hrs wiring.*

**B4 — Validation & guardrails.** Validate AI JSON output against expected schema before writing to store (malformed/partial output falls back to regex results for that upload). Add a timeout that falls back to Plan A if on-device inference doesn't respond within a few seconds. *3–4 hrs.*

---

## Detail: Plan C — Cloud LLM path (parked, reference only)

Only pursue if B proves insufficient after real usage:
1. Pick a free tier — Gemini Flash (~1,500 req/day free) or Groq (no card, generous limits, OpenAI-compatible).
2. Stand up a minimal backend (single serverless function on Vercel/Cloudflare Workers/Netlify) to hold the key server-side and proxy requests — the key can never ship in the frontend bundle.
3. Add rate limiting to prevent quota drain by non-users.
4. Update README/privacy messaging — this path sends resume text to a third party, a real change from "nothing leaves your device," and should likely be opt-in.
*1–2 days plus ongoing backend maintenance — new infrastructure for this project.*

---

## What to do next

Start with item 1 (close the loop on cleanup verification) and item 3 (Plan A) — both are low-risk, high-value, and don't require any new decisions from you. Once Plan A ships, item 5 (Chrome Prompt API) is the next clear win: zero cost, zero backend, and the single biggest accuracy jump for your largest browser segment. Everything past that (B2/B3/B4, and especially Plan C) can wait until you've seen how much A + B1 alone move the needle.
