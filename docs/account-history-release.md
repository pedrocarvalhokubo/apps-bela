# Bela account and parental history

Approved behavior: fixed Bela login remembered for 30 days; guest practice stays in sessionStorage and makes no progress API calls; parents use an independent PIN. Term 3 remains the initial selection. The existing persistent SQLite volume is retained.

The login password is PBKDF2-SHA256 hashed with a random salt, configured only through Railway environment variables. The one-time parent setup code is SHA256 hashed there; neither raw credentials nor their production hashes belong in the public repository. Login sessions use random tokens stored hashed in SQLite and an HttpOnly, Secure, SameSite=Strict cookie. Legacy device bearer tokens cannot authenticate account APIs. PIN sessions expire after 15 minutes and password/PIN failures are throttled.

The server stores lessons, quiz/resume state, attempts, OBMEP progress and written Science/ELA drafts. Attempts are graded against the question bank on the server and have stable IDs for retry deduplication. Concurrent study saves merge achievements; OBMEP preserves solved questions and best attempts. Offline attempts and drafts queue locally until connection returns. The app waits for pending saves before logout and retains unsent data if the connection fails.

Parents see aggregate results by subject/topic, recent errors, daily attempts/accuracy, last activity and written drafts. Writing is not automatically graded. Import requires both the account session and the parent PIN session, previews the old device/file source, copies transactionally, and records an import marker. Legacy profiles, attempts and local keys remain intact. Existing history is not attributed to Bela automatically because old profiles may include test/guest activity.

Owner steps after release: enter as Bela, open Pais, use the privately delivered setup code and choose a separate PIN. On the actual study device, preview and import the old history. No production parent PIN or study answers are entered during deployment QA.

Validation: production build, content regressions, guest/account storage isolation, anonymous/legacy access denial, cookie login on two devices, concurrent writes, private parent setup, server grading, duplicate retries, drafts, OBMEP merging, transactional repeat-safe import, persistence across process restart, session expiry/logout and rate limits. Integration tests use a disposable SQLite database and synthetic credentials.
