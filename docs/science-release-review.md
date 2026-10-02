# Science Term 3 — release review

Prepared on MacBook Air; production is **not updated**. Publish only after Pedro's specific approval is forwarded by the coordinator. Do not bypass the previously reported publication approval rejection.

## Delivered scope

- 8 bilingual canonical lessons with unchanged `s3-*` IDs and 74 vocabulary entries, Science only in term 3.
- 20 canonical quiz questions, 4 association questions, 2 graduated hints per question and explanation per option. Topic IDs map to readable lesson titles throughout quiz/results/missions/parent analytics.
- 4 extra bilingual matching activities, attached to their lessons: hearing, rock formation, weathering/erosion/deposition, soil protection. Choice, feedback, hint and repeat work; these practice activities do not add a new persistence schema.
- 4 original PNG infographics, 1024×1536, with page navigation, enlargement and download.
- Student practice test (20 questions, 6 A4 pages) and explanatory answer key (4 A4 pages), both downloadable.
- No changes to DB schema, profile permissions, audience settings, production config, volume, reset behavior or existing lesson IDs.

Canonical JSON Library `libfile_740204166aec81919d12ada5ef6ecd5c` v1 SHA-256 `8dc9ee89481a2496248432f908af9b616244aae669aedf468251ce333ddc9a53`. All 8 provided source file hashes verified against editorial manifest. All 457 pre-existing public asset hashes preserved; 6 new assets added (463 total). Portable deterministic standard-library packing added because macOS tar lacks the previous GNU options.

## Evidence

Node 24.21.0 optimized build passed after final label adjustments. Five automated tests passed, including existing profile isolation, restart persistence, PIN lockout, one-use pairing and 180-question OBMEP merge; content release gate, stable bilingual IDs, hints and matching contracts passed. `git diff --check` and 463-asset checksum verification passed.

Browser QA used only localhost and `/tmp/bela-science-final-qa.sqlite`; one disposable profile. All 20 questions exercised with 2 wrong selections, both clues, then correct answer; all 4 option explanations shown. Second complete run gave 20/20. SQLite read-back: 80 attempts, 40 correct, all in `science-general`; original production untouched. Eight lesson completion toggles persisted after reload, 8/8 and best 20/20 preserved. Four matching activities tested with all-wrong selections, hint, all-right selections and repeat/reset. Two PDFs and four PNG downloads completed through real browser events. Four infographic pages loaded as 1024px images, page limits and enlargement checked.

All four PNGs inspected as pixels; all ten PDF pages rendered and inspected with no cut-off/overlap detected. No original student worksheet photos, school identity or new personal data published in assets. PDFs use blank name/date lines only.

Desktop + 390×844 mobile module/quiz/matching inspected; document width remained 390, no horizontal page overflow. Native iPhone/Safari/PWA-install behavior was not exercised; existing PWA mechanics unchanged. Local preview uses existing fallback Next start (standalone warning); deployment Docker copies standalone `server.js` as before.

Evidence outside repository: `../qa-evidence/` holds final screenshots, PDF spreads and hint log. Preview saved in Library: `libfile_c2f408c3695c8191be30ee37c1366845`, `science-module-desktop.png`, v0. The 8/8 and 20/20 shown are disposable QA results, not Bela's real account.

## Exact publication plan awaiting approval

1. Approve publishing the final reviewed Science commit from branch `science-term3` to existing `pedrocarvalhokubo/apps-bela` main. Obtain exact final SHA from `git rev-parse HEAD`; no additional content changes bundled.
2. Fetch origin and verify main remains based on `22b3251a0f0ed7ccd95da0a4d23026e48281a2f0`; if main moved, compare/reconcile and retest before updating. Push the reviewed commit to main without force.
3. Let existing GitHub/Railway automatic deployment run for project `0b142f11-0577-4271-a513-fffca6fba59c`, service `a53881d4-52c1-4c6d-b329-775a9d88cbd9`, production `dff8ccf7-8716-4308-ad34-a70ce29e7f35`. No new project/service/domain, no variables/config/volume changes. Preserve volume `abe692d4-2ac8-4426-89ac-ba18931f96b3` at `/data`, single replica.
4. Observe terminal SUCCESS and read back the exact deployed SHA. Check `/api/health` returns 200/ok and six public resource hashes match this commit. Read-only production QA of term 3, lessons, infographic views and downloads; do not answer or toggle completion as Bela.
5. If failure occurs, investigate logs and revert only the reviewed code commit through a new commit if authorized; never restore/reset/delete the data volume. Report real deployment state and any blocker.
