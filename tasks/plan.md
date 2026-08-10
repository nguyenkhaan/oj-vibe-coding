# Implementation Plan: SkillBoost LMS Coding Platform

## Overview
This plan changes the project sequencing to a frontend-first flow.
We will first build the UI from Figma and the new `docs/prd-documents/ui-report.md`, then let you verify the interface, and only after that start the backend implementation.

## Progress
- Completed: UI reference freeze in `docs/prd-documents/ui-report.md`
- Completed: frontend design tokens and shared shell
- Completed: auth and registration screens
- Completed: auth route cleanup and LMS-aligned copy polish
- Next: public marketing and discovery screens
- Reminder: update this progress section and `tasks/todo.md` after each completed task

## Architecture Decisions
- Treat `docs/prd-documents/ui-report.md` as the primary UI reference for palette, typography, layout patterns, and screen inventory.
- Build shared frontend primitives before feature pages so the screen work stays consistent.
- Keep backend implementation blocked until the frontend UI is reviewed and approved by you.
- When backend work starts, align API contracts to the already implemented UI instead of designing the UI around unfinished endpoints.
- Preserve the existing domain split between `auth-provider` and `business-application` for the later backend phase.
```
src/frontend/src/
├── app/
│   ├── providers/
│   │   ├── AppProviders.tsx
│   │   ├── QueryProvider.tsx
│   │   └── ThemeProvider.tsx
│   ├── router/
│   │   ├── routes.tsx
│   │   ├── route-guards.tsx
│   │   └── route-paths.ts
│   ├── layouts/
│   │   ├── PublicLayout.tsx
│   │   ├── AuthLayout.tsx
│   │   ├── DashboardLayout.tsx
│   │   ├── WorkspaceLayout.tsx
│   │   └── InterviewLayout.tsx
│   ├── config/
│   │   ├── env.ts
│   │   ├── constants.ts
│   │   └── navigation.ts
│   └── App.tsx
│
├── pages/
│   ├── public/
│   │   ├── HomePage.tsx
│   │   ├── CourseCatalogPage.tsx
│   │   ├── CourseDetailPage.tsx
│   │   ├── InstructorGridPage.tsx
│   │   └── InstructorDetailPage.tsx
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ForgotPasswordPage.tsx
│   │   ├── SetPasswordPage.tsx
│   │   ├── OtpVerificationPage.tsx
│   │   └── TeacherRegistrationPage.tsx
│   ├── student/
│   │   ├── StudentDashboardPage.tsx
│   │   ├── StudentCoursesPage.tsx
│   │   ├── StudentProfilePage.tsx
│   │   ├── StudentHistoryPage.tsx
│   │   ├── ClassroomPage.tsx
│   │   ├── QuizAttemptPage.tsx
│   │   └── CheckoutPage.tsx
│   ├── teacher/
│   │   ├── TeacherDashboardPage.tsx
│   │   ├── TeacherProfilePage.tsx
│   │   ├── TeacherStudentsPage.tsx
│   │   ├── TeacherEarningsPage.tsx
│   │   ├── TeacherCourseBuilderPage.tsx
│   │   ├── TeacherCurriculumReorderPage.tsx
│   │   ├── TeacherSubmissionReviewPage.tsx
│   │   ├── TeacherProgressPage.tsx
│   │   └── TeacherProblemsPage.tsx
│   ├── interview/
│   │   ├── InterviewEntryPage.tsx
│   │   ├── InterviewSessionPage.tsx
│   │   └── InterviewReportPage.tsx
│   └── admin/
│       └── IdentityVerificationPage.tsx
│
├── features/
│   ├── auth/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── schemas/
│   │   ├── types.ts
│   │   └── utils.ts
│   ├── courses/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types.ts
│   │   └── utils.ts
│   ├── instructors/
│   │   ├── api/
│   │   ├── components/
│   │   ├── types.ts
│   │   └── utils.ts
│   ├── student-dashboard/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types.ts
│   ├── teacher-dashboard/
│   │   ├── api/
│   │   ├── components/
│   │   ├── forms/
│   │   ├── hooks/
│   │   └── types.ts
│   ├── classroom/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types.ts
│   ├── quiz/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types.ts
│   ├── judge/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types.ts
│   ├── interview/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── voice/
│   │   └── types.ts
│   ├── payment/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types.ts
│   └── admin/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       └── types.ts
│
├── shared/
│   ├── components/
│   │   ├── button/
│   │   ├── input/
│   │   ├── select/
│   │   ├── textarea/
│   │   ├── badge/
│   │   ├── card/
│   │   ├── modal/
│   │   ├── tabs/
│   │   ├── table/
│   │   ├── pagination/
│   │   ├── sidebar/
│   │   ├── navbar/
│   │   ├── footer/
│   │   ├── breadcrumb/
│   │   ├── stepper/
│   │   └── empty-state/
│   ├── icons/
│   ├── hooks/
│   ├── lib/
│   │   ├── cn.ts
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── storage.ts
│   ├── types/
│   │   ├── common.ts
│   │   └── api.ts
│   └── styles/
│       ├── tokens.css
│       └── globals.css
│
├── assets/
│   ├── images/
│   ├── illustrations/
│   └── logos/
│
├── mocks/
│   ├── handlers/
│   ├── data/
│   └── fixtures/
│
└── main.tsx
```
## Task List

### Phase 1: UI foundation

#### Task 1: Freeze the UI reference
Use the Figma screenshots and `ui-report.md` as the source of truth for visual direction, screen inventory, and shared design patterns.

**Acceptance criteria:**
- [ ] `ui-report.md` exists and covers screen groups, colors, typography, and layout patterns.
- [ ] The UI scope is clear enough to implement screens without revisiting the Figma file for every page.

**Verification:**
- [ ] Review `docs/prd-documents/ui-report.md` against the Figma screenshots.

**Dependencies:** None

**Files likely touched:**
- `docs/prd-documents/ui-report.md`

**Estimated scope:** S

#### Task 2: Build frontend design tokens and shared shell
Implement the base visual system in the frontend: colors, spacing, typography defaults, buttons, inputs, cards, badges, layout shell, header, footer, sidebar, and page title blocks.

**Acceptance criteria:**
- [ ] Shared tokens match the reported Figma theme as closely as practical.
- [ ] Common primitives are reusable across auth, public pages, dashboards, and workspaces.
- [ ] Responsive layout works on desktop and mobile breakpoints.

**Verification:**
- [ ] `npm run build` in `src/frontend`
- [ ] Visual check on the shared shell and component library page

**Dependencies:** Task 1

**Files likely touched:**
- `src/frontend/src/index.css`
- `src/frontend/src/App.tsx`
- `src/frontend/src/components/*`
- `src/frontend/src/pages/*`

**Estimated scope:** M

### Phase 2: Frontend screens

#### Task 3: Implement auth and registration screens
Build the login, register, forgot password, set password, OTP, lock screen, and teacher registration pages.

**Acceptance criteria:**
- [ ] Screens follow the Figma layout and preserve the same visual hierarchy.
- [ ] Forms, validation states, and CTA patterns are consistent.
- [ ] Teacher registration includes identity upload sections visible in the design.

**Verification:**
- [ ] `npm run build` in `src/frontend`
- [ ] Manual smoke test of the auth flow screens

**Dependencies:** Task 2

**Files likely touched:**
- `src/frontend/src/pages/*`
- `src/frontend/src/components/*`

**Estimated scope:** M

#### Task 4: Implement public marketing and discovery screens
Build the course catalog, course detail, instructor grid, instructor list, and instructor detail pages.

**Acceptance criteria:**
- [ ] Public pages match the Figma structure and visual tone.
- [ ] Catalog and detail pages use the shared card, filter, and page banner patterns.
- [ ] Instructor detail page reflects the same profile hierarchy as the report.

**Verification:**
- [ ] `npm run build` in `src/frontend`
- [ ] Responsive check for public pages

**Dependencies:** Task 2

**Files likely touched:**
- `src/frontend/src/pages/*`
- `src/frontend/src/components/*`

**Estimated scope:** M

#### Task 5: Implement student-facing screens
Build student dashboard, enrolled courses, profile, problem history, classroom workspace, quiz attempt, problem preview variants, AI interview, interview report, shopping cart, and checkout screens.

**Acceptance criteria:**
- [ ] Student journeys are represented with the same dark/light balance seen in Figma.
- [ ] Workspace screens use the correct split-pane and card-based structure.
- [ ] Checkout and interview states are visually clear.

**Verification:**
- [ ] `npm run build` in `src/frontend`
- [ ] Manual walkthrough across student flows

**Dependencies:** Task 2

**Files likely touched:**
- `src/frontend/src/pages/*`
- `src/frontend/src/components/*`

**Estimated scope:** L

#### Task 6: Implement teacher-facing screens
Build teacher dashboard, teacher profile, view students, earnings, enrollment, lesson content builder, curriculum reorder, submission review, student progress, course students, course builder, lesson content preview, and coding problem management screens.

**Acceptance criteria:**
- [ ] Teacher pages use the dashboard/card/sidebar language from the Figma screenshots.
- [ ] Builder and management pages reflect the same hierarchy of tables, forms, side panels, and actions.
- [ ] Profile and analytics screens are visually aligned with the design reference.

**Verification:**
- [ ] `npm run build` in `src/frontend`
- [ ] Manual walkthrough of teacher flows

**Dependencies:** Task 2

**Files likely touched:**
- `src/frontend/src/pages/*`
- `src/frontend/src/components/*`

**Estimated scope:** L

#### Task 7: Implement admin and moderation screens
Build admin identity verification and any supporting moderation pages needed for the first UI pass.

**Acceptance criteria:**
- [ ] Admin verification view follows the table, detail panel, and action pattern from Figma.
- [ ] Approve/reject flows are clearly separated in the UI.

**Verification:**
- [ ] `npm run build` in `src/frontend`
- [ ] Manual check of verification layout

**Dependencies:** Task 2

**Files likely touched:**
- `src/frontend/src/pages/*`
- `src/frontend/src/components/*`

**Estimated scope:** M

### Phase 3: UI review gate

#### Task 8: Polish and verify the frontend
Resolve spacing, responsive behavior, empty states, loading states, and component consistency across the implemented screens.

**Acceptance criteria:**
- [ ] The key screens are visually coherent under the same design system.
- [ ] Mobile and desktop layouts do not break.
- [ ] The UI is ready for your review without backend dependency.

**Verification:**
- [ ] Frontend build passes
- [ ] Manual review against Figma screenshots

**Dependencies:** Tasks 3-7

**Files likely touched:**
- `src/frontend/src/pages/*`
- `src/frontend/src/components/*`
- `src/frontend/src/index.css`

**Estimated scope:** M

#### Checkpoint: UI Signoff
- [ ] Frontend screens are implemented first.
- [ ] You verify the UI.
- [ ] Backend work does not start until this checkpoint is approved.

### Phase 4: Backend after UI approval

#### Task 9: Align backend contracts to the approved frontend
Translate the implemented frontend screens into stable API contracts and DTO shapes.

**Acceptance criteria:**
- [ ] API contracts match the approved UI flows.
- [ ] Shared response shapes are consistent across services.

**Verification:**
- [ ] Review `docs/specs/api_spec.md` against the implemented screens.

**Dependencies:** Checkpoint: UI Signoff

**Files likely touched:**
- `docs/specs/api_spec.md`
- `src/backend/business-application/src/bases/responses.py`
- `src/backend/business-application/src/modules/*/*.py`

**Estimated scope:** M

#### Task 10: Implement backend foundation for profile and course flows
Add the backend model, route, and service work needed to support the UI that has already been approved.

**Acceptance criteria:**
- [ ] Data model supports the frontend screens without major redesign.
- [ ] Public and teacher dashboard flows can read the same canonical data.

**Verification:**
- [ ] Backend integration tests for the implemented routes.

**Dependencies:** Task 9

**Files likely touched:**
- `src/backend/business-application/src/models/*.py`
- `src/backend/business-application/src/modules/*/*.py`
- `src/backend/business-application/alembic/versions/*.py`

**Estimated scope:** L

#### Task 11: Implement the remaining backend flows
Continue with classroom, judge, interview, payment, moderation, and hardening work after the frontend-approved foundation is in place.

**Acceptance criteria:**
- [ ] Each backend module is implemented against an already verified UI flow.
- [ ] No backend feature is started before the corresponding UI is approved.

**Verification:**
- [ ] Backend integration tests
- [ ] Smoke checks against the approved frontend

**Dependencies:** Task 10

**Files likely touched:**
- `src/backend/business-application/src/modules/*/*.py`
- `src/backend/auth-provider/src/app.py`
- `src/backend/business-application/src/app.py`

**Estimated scope:** L

#### Checkpoint: Backend completion
- [ ] Frontend was built first and verified.
- [ ] Backend followed the approved UI.
- [ ] The project is ready for the incremental implementation phase.

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| UI drifts from Figma while building screens first | High | Keep `ui-report.md` and Figma screenshots as the visual source of truth. |
| Frontend scope grows too large before backend starts | Medium | Lock the UI checkpoint before starting backend work. |
| Shared design primitives are inconsistent | Medium | Build shell, tokens, and reusable components before feature screens. |
| Backend contract assumptions become stale | Medium | Defer backend API decisions until UI signoff is complete. |

## Open Questions
- Do we want the frontend pass to cover every screen in Figma or only the core user journeys first?
- Should the visual review gate require pixel parity or only layout/interaction parity?
- After UI signoff, do we want to start with the teacher profile backend or the auth/backend foundation first?
