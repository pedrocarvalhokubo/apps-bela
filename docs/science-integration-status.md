# Science integration checkpoint

Execution confirmed on `Air-de-Pedro.kubo.local` (MacBook Air de Pedro). Checkout: `app/`, branch `science-term3`, base `22b3251a0f0ed7ccd95da0a4d23026e48281a2f0`. Production configuration read back unchanged: existing repository/main, Dockerfile, `node scripts/start.mjs`, health `/api/health`, single replica, volume `/data`.

Implemented: canonical content validator, existing schema contract, optional two graduated quiz hints with legacy support fallback and regression test. Preserve editorial IDs `s3-sound`, `s3-hearing`, `s3-rocks-minerals`, `s3-rock-types`, `s3-fossils`, `s3-landscapes`, `s3-weathering-erosion`, `s3-soil`.

Validation: `npm run build` passed; 457 existing public assets verified. `npm test` passed: profile isolation, restart persistence, PIN lockout, single-use pairing, OBMEP merge/180 questions, graduated hints. Tests used disposable DB, no real progress. Local runtime was Node 22.22.3 (host availability), whereas package and existing Docker deployment require Node 24. Repeat final validation with Node 24 before release.

Reference image `libfile_7863fc7a27588191b38069e68e4af078` materialized with official Library transfer helper and inspected as pixels: bilingual educational clay style, teal/orange titles, cream panels, illustrated concepts. Original/reference materials remain outside repository public assets.

Pending canonical editorial JSON + 4 PNGs + exam/answer-key PDFs from coordinator. No Science content invented or published. No database, localStorage, permissions, audience, production settings, or volume changes.

Integration checklist after material arrival:

1. Materialize Library IDs with official helper; validate JSON; inspect image pixels and rendered PDF pages; exclude personal data.
2. Add `science` to SubjectKey and `science-general` to QuizId/catalog/default stats/available subjects; import canonical subject and deep study map. Never change existing IDs.
3. Render Science card only in term 3. Preserve term 2's five cards and neutral empty term 1.
4. Connect four infographic pages with correct alt/dimensions/downloads and written exam/answer-key download cards. Add Science lesson visuals from approved infographics, preserve English quiz mode with Portuguese support text.
5. Include Science in learning missions and set term 3 on direct Science navigation. Reset infographic index when switching subjects to prevent out-of-range page access.
6. Pack new public assets losslessly, validate all preserved files against previous manifest, build/test, QA desktop/mobile on isolated temporary local profile. Exercise 8 lessons, 20 questions, two hint stages, association, all infographic pages/zoom/downloads and both PDFs.
7. Checkpoint remotely before publishing. Only after complete checks update main, observe Railway terminal SUCCESS and confirm live health and release commit, then read-only production QA without answering as Bela.
