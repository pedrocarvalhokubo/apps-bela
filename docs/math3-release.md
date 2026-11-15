# Math — III trimestre, Year 4 (2026)

Source: two batches of school study pages supplied in the Bela conversation on 2026-11-15. No printed exam date. Source scope and page-section IDs are in `app/math3-sources.json`. Student photos are not shipped.

## Included

Eight lessons: equal parts; fraction of a set; equivalent/proper/improper fractions and mixed numbers; tenths/hundredths and conversion/ordering; decimal column arithmetic; applied money/distance/temperature problems; perimeter/regular polygons; area and grid house design.

Nine saved laboratory activities across the eight lessons: fraction circles and comparison; grouped collections; mixed/equivalent visual models; three paintable tenths/hundredths boards; per-place column arithmetic with regrouping notes; activity budget and city/temperature/distance challenges; animated rectangle and perimeter drawing; area painting; six-room house on a grid. Keyboard controls accompany pointer controls; reduced motion disables animation. Labs use the existing account-scoped draft queue; guests keep session-only work.

72 questions in three pools of 24 (review, mock A, mock B), eight written tasks with example answers, three exact vector review maps, printable question/answer pages. English math vocabulary follows the school material, with Portuguese instructions for manipulatives and supporting explanations. The tutor corpus includes the new module.

Existing Math term 2 IDs, account history, parental controls and OBMEP remain in place. No database migration, permission change or new service is needed.

## Corrections to source inconsistencies

- A step in the school handout incorrectly calls the total collection size the denominator. Finding 1/5 of 20 uses denominator 5 and total 20.
- A diagram has five squares but is labeled six; app area is calculated from actual occupied cells.
- A triangle missing a side length has no equality marks. Its unknown side is not inferred from appearance.
- Fractions equal to one are included in the mathematical definition of improper fractions.

## Validation

TypeScript and production build; existing test suite extended with exact decimal arithmetic, outside-boundary counting, connected-room validation, source scope, budget targets, cross-device draft synchronization and server-side Math quiz grading. Source routing includes both terms. Final deployment and browser checks are recorded separately by the release operator.
