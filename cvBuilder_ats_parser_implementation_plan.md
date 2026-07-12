# ATS Scorer & Resume Parser — Implementation Plan

**Scope:** Fix the fake ATS scoring formula and the fragile regex resume parser. Plan only — nothing implemented yet.

---

## Direct answers to your questions first

**Do you need an LLM API key?**
No — not necessarily. There are three tiers, and the first two need **zero API key and zero backend**:

| Approach | API key needed? | Backend needed? | Cost | Data leaves device? |
|---|---|---|---|---|
| **A. Hardened regex** (no AI at all) | No | No | Free | No |
| **B. On-device AI** (Chrome Prompt API / transformers.js in-browser) | No | No | Free | No — runs entirely on the user's machine |
| **C. Cloud LLM API** (Gemini, Groq, etc.) | **Yes** | **Yes, required** | Free tier available, then usage-based | Yes — text is sent to the provider's servers |

**Why Option C needs a backend even on a free tier:** an API key embedded in client-side JavaScript is visible to anyone who opens devtools and reads the bundle. On a public app, that key gets scraped and abused within hours, burning your free quota or triggering billing on your account. There is no safe way to call Gemini/Groq/OpenAI directly from the browser with a key baked into the frontend — you'd need a thin backend (a single serverless function is enough) that holds the key server-side and proxies the request. That's real infrastructure to stand up and maintain, however small.

**The good news:** Option B gets you real AI-quality extraction (understands arbitrary resume layouts, section wording, ordering — not just the exact regex your patterns anticipate) with **no key, no backend, no per-request cost, and no data ever leaving the browser** — which also happens to match the "everything stays local" privacy claim already in your README. Researched below.

---

## Research: what's actually available for a free/local AI-assisted parser (2026)

### Option B1 — Chrome's built-in Prompt API (Gemini Nano), recommended starting point
Chrome ships a 2.7–4GB on-device model (Gemini Nano) that JavaScript can call directly via `LanguageModel.create()` / `session.prompt()` — no API key, no network call once the model is downloaded (Chrome manages the download itself, once per device, not per app). It's specifically well-suited to lexical tasks: classification, short summarization, and — directly relevant here — structured extraction/parsing. As of Chrome 148 (Q2 2026) the API is stabilizing for general web pages (previously extension-only); full graduation out of origin trial is expected around Chrome 150 (late 2026), so you may need to register for Chrome's Origin Trial program in the meantime, or feature-detect and treat it as progressive enhancement.

Limitations: Chrome-only (no Firefox/Safari support), ~8K token context window, and it's not a reasoning powerhouse — but resume field extraction is exactly the kind of lexical/structured task it's built for, not complex reasoning.

### Option B2 — transformers.js + WebGPU, for broader browser coverage
Hugging Face's transformers.js runs quantized models (converted to ONNX) directly in-browser via WebGPU, with no server and no API key. WebGPU now has ~85–90% global browser support (Chrome, Edge, Safari, increasingly Firefox). Quantized models under ~2GB run at interactive speed on consumer hardware; models up to ~3B parameters are viable. This becomes the fallback for browsers where the Chrome Prompt API isn't available.

Trade-off: the model has to be downloaded client-side on first use (hundreds of MB to ~1–2GB depending on model choice), so it needs to be lazy-loaded only when someone actually uploads a resume, with a visible progress indicator — not bundled into the initial app load.

### Option C — Cloud LLM free tiers, for reference (not the recommended path here)
If on-device quality ever proves insufficient, free tiers do exist: Google Gemini's free tier (~1,500 requests/day on Flash models) and Groq's free tier (no credit card required, 30 req/min, up to ~14,400 req/day, OpenAI-compatible request format, notably fast inference). Both are genuinely free at this app's likely volume — but both still require the backend-proxy pattern described above to use safely, which is the real cost, not the API pricing itself.

**Recommendation:** build Option A (hardened regex) as the fast, zero-risk baseline improvement, then layer Option B (on-device AI, Chrome Prompt API primary + transformers.js fallback) as the real accuracy upgrade — both stay entirely within your current "no backend, fully local" architecture. Treat Option C as a future escalation only if B proves insufficient and you're willing to take on backend infrastructure.

---

## Plan A — Harden the existing regex parser & scorer (no AI, ship first)

Fast, zero cost, zero new dependencies, meaningfully raises the floor before any AI work starts. Do this regardless of whether you pursue Plan B afterward — it's also what the AI path falls back to when on-device AI isn't available in a given browser.

### A1. Fix PDF text extraction order
`extractTextFromPDF` in `src/utils/fileHelpers.js` currently joins `textContent.items` in raw stream order. Change this to reconstruct actual reading order using each item's position data (`item.transform`, giving x/y coordinates): group items into lines by y-position (within a small tolerance band), sort lines top-to-bottom, sort items within each line left-to-right. This alone fixes most of the garbling on two-column or sidebar-style source resumes.
**Effort:** 2–3 hrs. **Risk:** low — isolated to one function, testable directly against the existing PDF fixture.

### A2. Broaden every regex pattern in `parseResumeText`
- Phone: extend beyond the current US-only `\d{3}[\s.-]?\d{3}[\s.-]?\d{4}` pattern to also match international formats, notably Indian numbers (`+91`, 10-digit, optional spacing) given your NCR context, plus generic `+<country code>` prefixes.
- Section headers: replace the literal 3–4 word matches (`summary|profile|objective|about`, etc.) with a synonym dictionary per section (e.g. Experience: "work history," "employment," "professional experience," "career history"; Skills: "core competencies," "technical skills," "expertise"; Education: "academic background," "qualifications").
- Degrees: extend the hardcoded degree list to include non-US formats relevant to your users — B.Tech, B.E., BCA, MCA, Diploma, etc.
- Experience entries: replace the single rigid one-line `Company | Title | Date` regex with a block-based approach — split the experience section into blank-line-separated chunks, then apply looser per-line field detection (a line with a 4-digit year = probable date line, a line in Title Case near it = probable title/company) instead of requiring one exact inline shape.
**Effort:** 4–6 hrs. **Risk:** low — purely additive pattern coverage, easy to unit test against varied sample resumes.

### A3. Add per-field confidence indicators in the UI
Since the parsed data already flows into the same editable form fields (confirmed — `FileUploader.jsx` calls `updatePersonalInfo`/`updateSection`, and `FormWizard` renders those same store fields), add a lightweight "low confidence, please verify" highlight on fields the parser filled with a fallback/best-guess value versus a high-confidence regex match. This won't make extraction more accurate, but it correctly sets user expectations and directs attention to what needs manual correction — which is the honest ceiling for a non-AI parser.
**Effort:** 2–3 hrs.

### A4. Reconnect the ATS Scorer to real signals
- Pull `JobMatcher`'s keyword-match percentage into `ATSScorer` as the dominant weighted component (replace the flat, always-applied `score += 25` "formatting assumed" line) — only relevant when a job description has actually been pasted; fall back to a completeness-only score when it hasn't.
- Replace `JobMatcher`'s current 12-word hardcoded tech whitelist + ">5 characters" heuristic with a proper stop-word-filtered keyword extractor, so it stops treating any long English word as a "keyword."
- Add real structural checks: flag if the selected template has any known ATS-risk layout element (verify this against the current 9 templates — the multi-column/graphic prototypes were already removed in the last cleanup, but worth an explicit audit pass to confirm all 9 remaining ones are single-column-safe).
**Effort:** 3–4 hrs.

**Plan A total:** ~1.5–2 days. Ship this as its own PR before touching AI — it's the safety net the AI path relies on anyway.

---

## Plan B — On-device AI extraction (no key, no backend, recommended upgrade)

Layer this on top of Plan A, not instead of it — Plan A becomes the automatic fallback for browsers/devices where on-device AI isn't available.

### B1. Feature-detect Chrome's Prompt API
On file upload, check for `window.LanguageModel` (or equivalent per current Chrome API surface at implementation time — this is actively stabilizing through 2026, so re-check the exact API shape against `developer.chrome.com/docs/ai/prompt-api` when you build this). If available, send the extracted resume text with a structured prompt asking for the same JSON shape your store already expects (`personalInfo`, `summary`, `experience[]`, `education[]`, `skills[]`, `certifications[]`), parse the model's JSON response, and feed it into the existing `updatePersonalInfo`/`updateSection` calls — no changes needed to how the store consumes parsed data, only to how that data gets produced.
**Effort:** 4–6 hrs, plus buffer for API surface changes given it's still stabilizing.

### B2. transformers.js + WebGPU fallback
For browsers without the Prompt API (Firefox, Safari, non-Chrome), feature-detect WebGPU support and, if present, lazy-load a small quantized instruction model (sub-2GB) via transformers.js only at the moment a resume is uploaded — with a visible "preparing AI parser (first time only)" progress indicator, since the model download happens once per device and gets cached. Use the same structured-JSON prompting approach as B1.
**Effort:** 1–1.5 days, including model selection/testing for size vs. accuracy trade-off and the lazy-load/caching UX.

### B3. Final fallback: Plan A's regex parser
If neither the Prompt API nor WebGPU is available (older browsers, low-end devices), silently fall back to the hardened regex parser from Plan A. The user experience should be seamless — they shouldn't need to know which path ran, only see the same "review your auto-filled resume" screen either way.
**Effort:** wiring/testing only, ~2–3 hrs, since both parsers already exist by this point.

### B4. Validation & guardrails
- Validate the AI's JSON response against an expected schema before writing to the store (malformed/partial AI output should fall back to regex results for that upload rather than corrupting form state).
- Add a timeout (on-device inference can be slow on weaker hardware) that falls back to Plan A's parser if the AI path doesn't respond within a few seconds.
**Effort:** 3–4 hrs.

**Plan B total:** ~3–4 days, buildable incrementally (B1 alone is shippable and already covers the majority Chrome user base before B2/B3 land).

---

## Plan C — Cloud LLM path (deferred, only if B proves insufficient)

Not recommended to start here, but documented for completeness since you asked directly about API keys:

1. Pick a free-tier provider — Google Gemini (Flash tier, ~1,500 req/day free) or Groq (no card required, generous rate limits, OpenAI-compatible request shape) are the strongest free options as of 2026.
2. Stand up a minimal backend: a single serverless function (Vercel/Cloudflare Workers/Netlify Functions all have workable free tiers) that receives the extracted resume text from the client, holds the API key as a server-side secret, calls the LLM provider, and returns structured JSON to the client. The key never ships in the frontend bundle.
3. Add basic abuse protection (rate limiting per session/IP) since a public free-tier proxy without limits will get drained by non-users.
4. Explicitly update the README/privacy messaging — this path does send resume text to a third-party API, which is a real change from the current "nothing leaves your device" claim and should be disclosed, likely as an opt-in rather than default behavior.

**Effort:** 1–2 days for the backend + integration, plus ongoing maintenance of a live backend service (new to this project's current architecture).

---

## Suggested sequencing

1. **Ship Plan A first** — pure win, no new dependencies, improves both the parser and the scorer immediately, and becomes the fallback layer for everything after it.
2. **Then Plan B1** (Chrome Prompt API) — zero cost, zero backend, biggest single accuracy jump, covers your largest browser segment.
3. **Then Plan B2/B3** (transformers.js fallback + regex final fallback) — closes the gap for non-Chrome users.
4. **Only consider Plan C** if real usage data shows on-device AI accuracy still isn't sufficient and you're willing to take on backend infrastructure and revise the privacy messaging.

Nothing above has been implemented — this is the roadmap to execute when ready.
