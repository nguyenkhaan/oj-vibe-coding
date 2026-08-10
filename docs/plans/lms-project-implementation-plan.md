# Project Implementation Plan - LMS Coding Platform

## 1. Mục tiêu

Triển khai LMS Coding Platform theo hướng **FE-first**, lấy wireframe và nghiệp vụ đã chốt làm nguồn thiết kế:

1. Chuẩn hóa tài liệu và API contract.
2. Xây dựng UI hoàn chỉnh bằng mock data trước.
3. Chốt database schema và migration.
4. Xây dựng Business Application/Authentication/Judge integrations.
5. Kết nối từng vertical slice từ UI tới API/database.
6. Kiểm thử, hardening và release.

## 2. Nguồn sự thật

- Product requirements: [prd.md](../prd-documents/prd.md).
- Technical design: [tdd.md](../prd-documents/tdd.md).
- Database target: [DATABASE.txt](../DATABASE.txt).
- Gap analysis: [gap-analysis.md](../prd-documents/gap-analysis.md).
- API contract hiện tại: [api_spec.md](../specs/api_spec.md).
- Wireframe: [docs/ui](../ui).
- Legacy implementation plan: [overall-plan.md](overall-plan.md), chỉ tham khảo các hạ tầng đã tồn tại.

## 3. Nguyên tắc triển khai

- FE-first: mọi flow có UI state và mock API trước khi xây service thật.
- Contract-first: API spec được chốt trước khi BE implement endpoint.
- Vertical slice: sau khi FE mock ổn định, kết nối từng chức năng hoàn chỉnh.
- Database hiện tại không được mở rộng tùy tiện; thay đổi phải đối chiếu DATABASE.txt và gap analysis.
- Business mutation phải có authorization, transaction, idempotency và audit/notification nếu cần.
- Không coi mock state là business behavior cuối cùng.
- Mọi phase có acceptance criteria và evidence kiểm thử.

## 4. Dependency map

~~~mermaid
flowchart TD
    P0[Phase 0 Docs and decisions] --> P1[Phase 1 FE foundation]
    P0 --> P2[Phase 2 API contract]
    P1 --> P3[Phase 3 FE public and auth]
    P1 --> P4[Phase 4 FE learning]
    P1 --> P5[Phase 5 FE teacher/admin]
    P1 --> P6[Phase 6 FE commerce and finance]
    P1 --> P7[Phase 7 FE OJ/Quiz/AI]
    P2 --> P8[Phase 8 DB migration]
    P2 --> P9[Phase 9 BE foundation]
    P8 --> P9
    P3 --> P10[Phase 10 Auth integration]
    P4 --> P11[Phase 11 Learning integration]
    P5 --> P12[Phase 12 Teacher/Admin integration]
    P6 --> P13[Phase 13 Payment/Wallet integration]
    P7 --> P14[Phase 14 OJ/AI integration]
    P9 --> P10
    P9 --> P11
    P10 --> P15[Phase 15 E2E and hardening]
    P11 --> P15
    P12 --> P15
    P13 --> P15
    P14 --> P15
~~~

## 5. Phase 0 - Product, UX và specification baseline

**Mục tiêu:** khóa nghiệp vụ, route, terminology, schema target và API convention trước khi viết feature.

### Tasks

- P0-T01: Review lại prd.md, tdd.md, DATABASE.txt, gap-analysis.md cùng Product Owner.
- P0-T02: Chốt course approval flow, Teacher approval flow và role permission matrix.
- P0-T03: Chốt route map giữa 47 wireframe logic và 6 màn hình nghiệp vụ bổ sung.
- P0-T04: Chốt status transition: Teacher application, Course, Order/Payment, Progress, Interview, Payout.
- P0-T05: Cập nhật api_spec.md theo database target và các flow mới.
- P0-T06: Định nghĩa error codes, pagination, filtering, datetime, money và naming convention.
- P0-T07: Tạo mock payload catalogue cho từng page.
- P0-T08: Tạo decision log cho các điểm còn VERIFY: route, permissions, PayOS, Judge, Gemini, OCR.

### Exit criteria

- PRD/TDD/DATABASE/gap/API spec không mâu thuẫn.
- Có permission matrix và route map.
- Có mock contract cho toàn bộ FE page.

## 6. Phase 1 - FE foundation và design system

**Mục tiêu:** tạo shell FE, component system và test harness để tất cả page dùng chung ngôn ngữ UI.

### Tasks

- P1-T01: Chuẩn hóa Vite/React/TypeScript build và environment config.
- P1-T02: Tạo design tokens từ docs/ui/theme.md: color, typography, spacing, radius, shadow.
- P1-T03: Xây AppShell public, AuthShell, StudentShell, TeacherShell, AdminShell và CodingShell.
- P1-T04: Xây Button, Input, Select, Textarea, Modal, Drawer, Tabs, Badge, Progress, Table, EmptyState, Toast, Skeleton.
- P1-T05: Xây responsive breakpoint và mobile navigation.
- P1-T06: Tạo route guard UI và page-level loading/error boundary.
- P1-T07: Tạo mock API layer bằng MSW hoặc local service adapter.
- P1-T08: Thiết lập Storybook hoặc component preview và visual regression baseline.
- P1-T09: Thiết lập Vitest/React Testing Library/Playwright smoke setup.
- P1-T10: Cấu hình lint, format, typecheck và CI FE.

### Exit criteria

- Shell và shared components render được desktop/mobile.
- FE build/typecheck/lint pass.
- Mock API có loading/empty/error/success states.
- Không page nào dùng component ad-hoc khi đã có shared component tương ứng.

## 7. Phase 2 - FE public, auth và identity

**Mục tiêu:** hoàn thiện các luồng người dùng chưa đăng nhập và identity bằng mock data.

### Tasks

- P2-T01: Implement AUTH01-AUTH07: login, register, forgot password, set password, OTP, lock screen, teacher registration.
- P2-T02: Implement public home/catalog/course detail.
- P2-T03: Implement instructor grid/list/detail.
- P2-T04: Implement Course empty state.
- P2-T05: Implement STD04 Teacher Application: draft, pending, rejected, resubmit, approved.
- P2-T06: Implement client form validation and file upload preview.
- P2-T07: Implement mock auth session, role switch and unauthorized/forbidden states.
- P2-T08: Add accessibility keyboard/focus/error handling.
- P2-T09: Add FE tests for auth and teacher application state transitions.

### Exit criteria

- Guest có thể browse catalog/detail/instructor.
- Auth flow và Teacher application chạy hoàn chỉnh bằng mock API.
- Các state pending/rejected/approved có UI riêng.
- Route guard không cho truy cập sai role.

## 8. Phase 3 - FE learning workspace

**Mục tiêu:** xây toàn bộ trải nghiệm học bằng mock content/progress trước khi nối BE.

### Tasks

- P3-T01: Implement Student dashboard/enrolled courses/profile/favorites.
- P3-T02: Implement CLASS01/STD01 classroom workspace.
- P3-T03: Implement course tree, section/lesson/content navigation.
- P3-T04: Implement Reading viewer, sanitized Markdown and code highlighting.
- P3-T05: Implement Video player, watched percent, resume position and 100% completion state.
- P3-T06: Implement Quiz preview/attempt, score, pass/fail and remaining attempts.
- P3-T07: Implement Programming reading/preview/video lesson pages.
- P3-T08: Implement comment/reply UI and empty/loading/error states.
- P3-T09: Implement progress store and optimistic UI updates.
- P3-T10: Add FE tests for content completion/retry/locked lesson behavior.

### Exit criteria

- Student có thể đi từ enrolled course tới Reading/Video/Quiz/Problem mock flow.
- Progress sidebar/header cập nhật không reload.
- Video 100%, Quiz pass score và retry limit phản ánh đúng mock rules.

## 9. Phase 4 - FE Teacher studio và Admin console

**Mục tiêu:** hoàn thiện công cụ tạo nội dung, review và vận hành bằng mock data.

### Tasks

- P4-T01: Implement Teacher dashboard/profile/students/earnings.
- P4-T02: Implement course builder and curriculum reorder.
- P4-T03: Implement lesson content builder: Reading/Video/Quiz/Problem.
- P4-T04: Add pass score/max attempts controls for Quiz/Problem.
- P4-T05: Implement TC14 course approval timeline, checklist, rejected note, resubmit.
- P4-T06: Implement TC05 enrollment and TC08/TC09/TC10 progress/submission views.
- P4-T07: Implement TC13 problem management and language/config/testcase forms.
- P4-T08: Implement Admin Teacher registration review and AD02 course approval.
- P4-T09: Implement Admin notification/audit and decision confirmation dialogs.
- P4-T10: Add FE tests for ownership, status transitions and destructive actions.

### Exit criteria

- Teacher studio chạy hoàn chỉnh với mock course tree.
- Admin có thể review Teacher/course và thấy note/status timeline.
- Teacher wallet/payout UI có trong scope FE và mock states.

## 10. Phase 5 - FE commerce, wallet và payment states

**Mục tiêu:** hoàn thiện UI commerce trước khi tích hợp PayOS thật.

### Tasks

- P5-T01: Implement PAY01 cart: add/remove, duplicate enrolled course, empty state.
- P5-T02: Implement PAY02 checkout one-course order.
- P5-T03: Implement PAY03 payment result: pending/completed/failed/expired.
- P5-T04: Implement order summary and notification handoff.
- P5-T05: Implement TC15 wallet KPI, ledger, payout request and Admin decision state.
- P5-T06: Implement teacher revenue 80/20 display and minimum 1,000 VND validation.
- P5-T07: Add mock webhook status polling/SSE simulation.
- P5-T08: Add FE tests for duplicate purchase, payment states and payout validation.

### Exit criteria

- Checkout UI không cho mua course đã enrollment.
- Payment states và enrollment success được mô phỏng end-to-end.
- Payout dưới 1,000 VND bị chặn ở UI nhưng vẫn sẽ validate lại ở BE.

## 11. Phase 6 - FE Online Judge, Quiz và AI Interview

**Mục tiêu:** xây interaction-heavy UI và mock realtime trước service thật.

### Tasks

- P6-T01: Implement OJ problem list/detail/history.
- P6-T02: Integrate Monaco editor, language select, run/submit states.
- P6-T03: Implement console, testcase result, diff, runtime/memory states.
- P6-T04: Implement Quiz attempt timer/question navigator/submit confirmation.
- P6-T05: Implement INTERVIEW03 setup topic/level/permission notice.
- P6-T06: Implement INTERVIEW02 chat, early finish, pause/resume, 12-question cap.
- P6-T07: Implement microphone/camera permission fallback without recording.
- P6-T08: Implement INTERVIEW01 report, skill scores and report-ready notification.
- P6-T09: Add mock SSE/WebSocket event adapter.
- P6-T10: Add FE tests for OJ statuses, quiz retry and interview cap.

### Exit criteria

- OJ, Quiz, AI Interview chạy được bằng mock queue/stream.
- UI có đầy đủ loading/running/success/failure/timeout/empty states.
- Không lưu media trong FE state hoặc mock persistence.

## 12. Phase 7 - API spec và contract freeze

**Mục tiêu:** dùng các mock flow đã hoàn thiện để chốt API contract trước khi viết BE feature.

### Tasks

- P7-T01: Rewrite docs/specs/api_spec.md theo route/response hiện tại.
- P7-T02: Tạo OpenAPI source hoặc docs/specs/api.json.
- P7-T03: Định nghĩa auth, role, ownership và status transition ở từng endpoint.
- P7-T04: Định nghĩa pagination/filter/sort cho catalog, students, submissions, notifications.
- P7-T05: Định nghĩa multipart/presigned upload contract.
- P7-T06: Định nghĩa PayOS create order/webhook/result contract.
- P7-T07: Định nghĩa Judge submit/run/result stream contract.
- P7-T08: Định nghĩa AI setup/chat/finish/report contract.
- P7-T09: Định nghĩa error code catalogue và idempotency header.
- P7-T10: Generate FE TypeScript client/types từ OpenAPI.
- P7-T11: Contract review giữa FE/BE và freeze version v1.

### Exit criteria

- FE mock adapter có thể thay bằng generated API client.
- OpenAPI lint pass.
- Mọi endpoint chính có request/response/error/example.
- Không bắt đầu BE feature nếu contract chưa freeze.

## 13. Phase 8 - Database target và migration

**Mục tiêu:** chuyển model hiện tại sang schema DATABASE.txt an toàn, không mất dữ liệu.

### Tasks

- P8-T01: Tạo migration inventory từ model/migration hiện tại.
- P8-T02: Quyết định rename compatibility: password_hash, thumbnail_url, quiz/quiz_attempt.
- P8-T03: Thêm enum mới và status mapping.
- P8-T04: Thêm approval metadata cho Teacher/course.
- P8-T05: Tạo cart/order/order_item và transaction linkage.
- P8-T06: Tạo wallet/wallet_ledger/payout_request.
- P8-T07: Tạo favorites/reviews/video_content.
- P8-T08: Migrate progress fields và quiz attempts.
- P8-T09: Migrate interview status/message sender/report unique.
- P8-T10: Add indexes, unique constraints, check constraints.
- P8-T11: Seed roles, languages, sample course/content.
- P8-T12: Backup/restore rehearsal và migration rollback plan.
- P8-T13: Generate ERD/schema verification report.

### Exit criteria

- Fresh database tạo được từ zero.
- Existing fixture/data migrate được trên staging copy.
- Constraints phản ánh business rules.
- Migration có forward/rollback strategy.
- Không có Float money trong target finance tables.

## 14. Phase 9 - Backend foundation và shared services

**Mục tiêu:** tạo nền BE để thay mock adapter bằng API thật.

### Tasks

- P9-T01: Chuẩn hóa app config, environment và secrets.
- P9-T02: CORS, exception handler, response/error envelope.
- P9-T03: Auth/JWK guard, role guard, ownership guard.
- P9-T04: Repository/service/router layering.
- P9-T05: DB session/transaction/unit-of-work conventions.
- P9-T06: Redis client, distributed lock, cache và rate limit.
- P9-T07: Queue worker conventions, retry/backoff/dead letter.
- P9-T08: Storage service, presigned URL, file scan hook.
- P9-T09: Notification domain event and audit service.
- P9-T10: OpenAPI generation, logging, tracing and health checks.

### Exit criteria

- Shared infrastructure test pass.
- API error/auth/transaction conventions được dùng thống nhất.
- Worker retry và lock có integration test.

## 15. Phase 10 - Backend vertical slice integration

**Mục tiêu:** kết nối từng nhóm UI với BE theo thứ tự rủi ro tăng dần.

### Tasks

- P10-T01: Auth/profile/role/Teacher application API.
- P10-T02: Admin Teacher approval API và notification.
- P10-T03: Catalog/course detail/favorite/review API.
- P10-T04: Teacher course builder/content/reorder API.
- P10-T05: Admin course approval API.
- P10-T06: Enrollment/progress/reading/video API.
- P10-T07: Quiz/attempt/scoring API.
- P10-T08: Cart/order/PayOS/enrollment webhook API.
- P10-T09: Wallet/ledger/payout/Admin approval API.
- P10-T10: OJ problem/submission/result API.
- P10-T11: Judge worker/sandbox/result stream.
- P10-T12: AI interview/session/message/report API.
- P10-T13: Notification read/realtime API.
- P10-T14: Replace each MSW handler with generated client endpoint by endpoint.
- P10-T15: Remove mock-only paths after real endpoint acceptance.

### Exit criteria

- Mỗi vertical slice có FE + API + DB + test.
- Payment, enrollment, progress, judge, report và payout có idempotency.
- Không còn dependency business-critical vào mock data.

## 16. Phase 11 - External integrations và operational readiness

### Tasks

- P11-T01: PayOS sandbox credentials/webhook endpoint/replay test.
- P11-T02: Gemini API key, prompt version, timeout/retry/cost limit.
- P11-T03: OCR/Document Detection worker and confidence review.
- P11-T04: Judge sandbox resource limits and language images.
- P11-T05: MinIO/S3 lifecycle, private bucket and signed URL policy.
- P11-T06: RabbitMQ/Redis/Celery queue monitoring.
- P11-T07: Notification delivery and SSE/WebSocket reconnect.
- P11-T08: Secrets management and environment separation.
- P11-T09: Backup, restore, retention and PII deletion policy.
- P11-T10: Metrics dashboard, alerting and incident runbook.

## 17. Phase 12 - QA, security và release

### Tasks

- P12-T01: Unit tests cho services, scoring, status transition và money calculation.
- P12-T02: API integration tests cho auth, ownership, transaction, webhook.
- P12-T03: FE component/page tests và accessibility checks.
- P12-T04: E2E: register/login/Teacher approval/course approval.
- P12-T05: E2E: catalog/cart/payment/enrollment.
- P12-T06: E2E: learning/progress/quiz/problem.
- P12-T07: E2E: AI setup/chat/report và payout approval.
- P12-T08: Security test: auth bypass, IDOR, upload, SSRF, XSS, rate limit.
- P12-T09: Judge sandbox escape/resource exhaustion test.
- P12-T10: Load test catalog, checkout webhook, judge queue, notification.
- P12-T11: Responsive/browser/device regression theo wireframe.
- P12-T12: UAT theo PRD acceptance criteria.
- P12-T13: Staging deployment, smoke test và rollback drill.
- P12-T14: Production release checklist và post-release monitoring.

### Exit criteria

- CI xanh: lint, typecheck, unit, integration, E2E smoke.
- Không còn Critical/High security defect.
- UAT sign-off cho toàn bộ MVP.
- Backup/rollback/monitoring đã được diễn tập.

## 18. Definition of Done cho mọi task

- Có implementation hoặc document output đúng scope.
- Có unit/integration/UI test phù hợp.
- Có loading, empty, error, permission và success state nếu là UI.
- Có API contract trước khi FE gọi endpoint thật.
- Có migration nếu thay đổi persistence.
- Có audit/notification/idempotency khi nghiệp vụ yêu cầu.
- Có evidence trong PR/CI hoặc test report.
- Không để mock data đi vào production path.

## 19. Milestone

| Milestone | Hoàn thành khi |
| --- | --- |
| M0 Specification freeze | PRD/TDD/DATABASE/gap/API route map thống nhất |
| M1 FE foundation | Shell, tokens, shared components, mock adapter pass |
| M2 FE product prototype | Auth, catalog, learning, teacher/admin, payment, OJ, AI chạy mock |
| M3 Contract freeze | OpenAPI và generated FE types pass review |
| M4 Database ready | Fresh migration + staging data migration pass |
| M5 Backend slices | Auth/course/commerce/learning/OJ/AI/finance connected |
| M6 Integrated beta | E2E critical flows pass |
| M7 Release candidate | Security/load/UAT/staging rollback pass |
| M8 Production | Release, monitoring và support runbook active |

