# Todo: SkillBoost LMS Coding Platform

- [x] Task 1: Freeze the UI reference
  - Acceptance: `ui-report.md` exists and covers screen groups, colors, typography, and layout patterns.
  - Verify: review `docs/prd-documents/ui-report.md` against the Figma screenshots.

- [x] Task 2: Build frontend design tokens and shared shell
  - Acceptance: shared tokens match the reported Figma theme and common primitives are reusable.
  - Verify: `bun run build` and `bun run lint` in `src/frontend`.

- [x] Task 3: Implement auth and registration screens
  - Acceptance: login, register, forgot password, set password, OTP, lock screen, and teacher registration screens follow the Figma layout.
  - Verify: `bun run build` and `bun run lint` in `src/frontend`.
  - Progress: auth routes now land on the login page, and the copy has been aligned with the LMS product language.

- [ ] Task 4: Implement public marketing and discovery screens
  - Acceptance: public pages match the Figma structure and visual tone.
  - Verify: `bun run build` in `src/frontend` and responsive check for public pages.

- [ ] Task 5: Implement student-facing screens
  - Acceptance: student journeys are represented with the same dark/light balance seen in Figma.
  - Verify: `bun run build` in `src/frontend` and manual walkthrough across student flows.

- [ ] Task 6: Implement teacher-facing screens
  - Acceptance: teacher pages use the dashboard/card/sidebar language from the Figma screenshots.
  - Verify: `bun run build` in `src/frontend` and manual walkthrough of teacher flows.

- [ ] Task 7: Implement admin and moderation screens
  - Acceptance: admin verification view follows the table, detail panel, and action pattern from Figma.
  - Verify: `bun run build` in `src/frontend` and manual check of verification layout.

- [ ] Task 8: Polish and verify the frontend
  - Acceptance: the key screens are visually coherent under the same design system.
  - Verify: frontend build passes and manual review against Figma screenshots.

- [ ] Task 9: Align backend contracts to the approved frontend
  - Acceptance: API contracts match the approved UI flows.
  - Verify: review `docs/specs/api_spec.md` against the implemented screens.

- [ ] Task 10: Implement backend foundation for profile and course flows
  - Acceptance: data model supports the frontend screens without major redesign.
  - Verify: backend integration tests for the implemented routes.

- [ ] Task 11: Implement the remaining backend flows
  - Acceptance: each backend module is implemented against an already verified UI flow.
  - Verify: backend integration tests and smoke checks against the approved frontend.
