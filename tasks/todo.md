# Todo: SkillBoost LMS Coding Platform

- [ ] Task 1: Update ORM models and migrations for teacher profile tables
  - Acceptance: schema supports teacher profile sections as real data.
  - Verify: migrate up/down and inspect PostgreSQL tables.

- [ ] Task 2: Align API contracts and shared DTOs for the teacher profile domain
  - Acceptance: API spec and DTOs cover public profile and dashboard writes.
  - Verify: regenerate OpenAPI and review shapes against PRD/Figma.

- [ ] Task 3: Implement teacher public profile read API
  - Acceptance: public profile returns published-only data.
  - Verify: integration test + manual profile payload check.

- [ ] Task 4: Implement teacher dashboard profile write API
  - Acceptance: dashboard CRUD persists About Me, Contact Details, Education, Experience, Certifications.
  - Verify: integration tests for create/update/delete flows.

- [ ] Task 5: Build the Teacher Dashboard profile UI
  - Acceptance: tabs/sections match PRD and allow editing.
  - Verify: frontend build + manual API smoke test.

- [ ] Task 6: Build the public Teacher Profile page from Figma
  - Acceptance: page matches Figma and is read-only.
  - Verify: visual check and responsive check.

- [ ] Task 7: Tighten public course catalog and course detail rules
  - Acceptance: public catalog shows only `PUBLISHED` courses.
  - Verify: API tests for public vs teacher-owned visibility.

- [ ] Task 8: Implement classroom curriculum and progress APIs
  - Acceptance: classroom payload includes curriculum and progress state.
  - Verify: integration tests for progress completion.

- [ ] Task 9: Deliver the classroom UI and lesson interaction surfaces
  - Acceptance: split-pane classroom works with comments and progress.
  - Verify: frontend build + manual walkthrough.

- [ ] Task 10: Implement quiz and coding problem management APIs
  - Acceptance: teacher authoring and student consumption APIs are available.
  - Verify: API tests for quiz/problem CRUD and reads.

- [ ] Task 11: Implement judge service and submission pipeline
  - Acceptance: submit jobs produce verdicts and persist results.
  - Verify: submission tests + sample AC run.

- [ ] Task 12: Build the online judge UI
  - Acceptance: editor, stdin/stdout, verdict panel, and run/submit are visible.
  - Verify: frontend build + manual judge API check.

- [ ] Task 13: Implement AI interview session APIs and SSE flow
  - Acceptance: interview session, chat stream, and report endpoints work.
  - Verify: session create/chat/report tests.

- [ ] Task 14: Implement PayOS checkout and payment reconciliation
  - Acceptance: checkout, webhook, and enrollment unlock are idempotent.
  - Verify: webhook success and duplicate webhook tests.

- [ ] Task 15: Build the interview and checkout UI surfaces
  - Acceptance: interview and checkout pages match the UX states.
  - Verify: frontend build + manual flow test.

- [ ] Task 16: Implement teacher registration and admin verification flows
  - Acceptance: teacher onboarding and role promotion work end to end.
  - Verify: duplicate application and admin approval tests.

- [ ] Task 17: Implement admin moderation and analytics APIs
  - Acceptance: admin can moderate users, courses, and reports.
  - Verify: moderation and analytics API tests.

- [ ] Task 18: Build admin dashboard UI surfaces
  - Acceptance: review and moderation screens are usable.
  - Verify: frontend build + manual admin flow.

- [ ] Task 19: Finalize auth, CORS, error-envelope, and shared security behavior
  - Acceptance: backend responses and auth behavior are consistent.
  - Verify: integration tests for errors and CORS.

- [ ] Task 20: Add integration and E2E coverage for the core journeys
  - Acceptance: main product journeys have automated coverage.
  - Verify: backend integration tests + frontend smoke checks.

- [ ] Task 21: Production readiness pass
  - Acceptance: docs, seed data, and env guidance are ready.
  - Verify: clean setup run-through.
