# LMS Coding Platform - Implementation Task Tracker

## Quy ước

- Status ban đầu: TODO.
- Owner: FE, BE, QA, DEVOPS, PRODUCT hoặc CROSS.
- Dependency dùng task ID; task chỉ bắt đầu khi dependency đã DONE hoặc được explicitly waived.
- Mỗi task phải cập nhật status và evidence khi hoàn thành.

## Phase 0 - Specification

| Done | ID | Task | Owner | Dependency | Status |
| --- | --- | --- | --- | --- | --- |
| [x] | P0-T01 | Review PRD/TDD/DATABASE/gap cùng Product Owner | PRODUCT | - | DONE |
| [x] | P0-T02 | Chốt permission matrix Student/Teacher/Admin | PRODUCT/BE | P0-T01 | DONE |
| [x] | P0-T03 | Chốt route map 47 wireframe logic và màn hình bổ sung | PRODUCT/FE | P0-T01 | DONE |
| [x] | P0-T04 | Chốt toàn bộ status transition | PRODUCT/BE | P0-T01 | DONE |
| [x] | P0-T05 | Cập nhật docs/specs/api_spec.md | BE/FE | P0-T02,P0-T04 | DONE |
| [x] | P0-T06 | Chốt error/pagination/money/datetime convention | BE/FE | P0-T05 | DONE |
| [x] | P0-T07 | Tạo mock payload catalogue | FE | P0-T03,P0-T05 | DONE |
| [x] | P0-T08 | Tạo decision log cho các điểm VERIFY | PRODUCT | P0-T01 | DONE |

**Phase gate:** PRD, TDD, DATABASE, gap và API contract không mâu thuẫn.

## Phase 1 - FE Foundation

| Done | ID | Task | Owner | Dependency | Status |
| --- | --- | --- | --- | --- | --- |
| [ ] | P1-T01 | Chuẩn hóa React/TypeScript/Vite build | FE | P0-T01 | TODO |
| [ ] | P1-T02 | Tạo design tokens từ theme.md | FE | P1-T01 | TODO |
| [ ] | P1-T03 | Tạo Public/Auth/Student/Teacher/Admin/Coding shells | FE | P1-T02 | TODO |
| [ ] | P1-T04 | Tạo shared UI components | FE | P1-T02 | TODO |
| [ ] | P1-T05 | Tạo responsive navigation/breakpoints | FE | P1-T03 | TODO |
| [ ] | P1-T06 | Tạo route guard và error boundaries | FE | P1-T03 | TODO |
| [ ] | P1-T07 | Cấu hình MSW/local mock adapter | FE | P0-T07,P1-T01 | TODO |
| [ ] | P1-T08 | Tạo Storybook/component preview | FE | P1-T04 | TODO |
| [ ] | P1-T09 | Cấu hình Vitest/RTL/Playwright smoke | FE/QA | P1-T01 | TODO |
| [ ] | P1-T10 | Cấu hình FE lint/format/typecheck/CI | FE/DEVOPS | P1-T01 | TODO |
| [ ] | P1-T11 | Chốt FE folder structure theo feature/layer | FE | P1-T03 | TODO |
| [ ] | P1-T12 | Tách App/router thành route modules | FE | P1-T03 | TODO |
| [ ] | P1-T13 | Tách shared UI và feature component boundaries | FE | P1-T04 | TODO |
| [ ] | P1-T14 | Tạo FE feature module template và test location | FE | P1-T11 | TODO |
| [ ] | P1-T15 | Thiết lập cảnh báo FE god files | FE/QA | P1-T14 | TODO |
| [ ] | P1-T16 | Viết ARCHITECTURE.md và import direction rules | FE/BE | P1-T11,P9-T11 | TODO |

**Phase gate:** FE build pass; shell/shared components/mobile states pass.

## Phase 2 - FE Public/Auth/Identity

| Done | ID | Task | Owner | Dependency | Status |
| --- | --- | --- | --- | --- | --- |
| [ ] | P2-T01 | Implement AUTH01-AUTH07 | FE | P1-T03,P1-T04,P1-T07 | TODO |
| [ ] | P2-T02 | Implement public home/catalog/course detail | FE | P1-T03 | TODO |
| [ ] | P2-T03 | Implement instructor grid/list/detail | FE | P1-T03 | TODO |
| [ ] | P2-T04 | Implement course empty state | FE | P2-T02 | TODO |
| [ ] | P2-T05 | Implement STD04 Teacher Application | FE | P1-T04 | TODO |
| [ ] | P2-T06 | Add form validation/file preview/upload states | FE | P2-T05 | TODO |
| [ ] | P2-T07 | Add mock auth session/role/forbidden states | FE | P2-T01 | TODO |
| [ ] | P2-T08 | Add accessibility for public/auth forms | FE/QA | P2-T01 | TODO |
| [ ] | P2-T09 | Add auth/Teacher application FE tests | FE/QA | P2-T05,P2-T07 | TODO |

**Phase gate:** Guest browse, Auth và Teacher application chạy hoàn chỉnh bằng mock.

## Phase 3 - FE Learning

| Done | ID | Task | Owner | Dependency | Status |
| --- | --- | --- | --- | --- | --- |
| [ ] | P3-T01 | Student dashboard/enrolled/profile/favorites | FE | P1-T03 | TODO |
| [ ] | P3-T02 | CLASS01/STD01 classroom workspace | FE | P3-T01 | TODO |
| [ ] | P3-T03 | Course tree/content navigation | FE | P3-T02 | TODO |
| [ ] | P3-T04 | Reading Markdown viewer/code highlighting | FE | P3-T03 | TODO |
| [ ] | P3-T05 | Video player/watched percent/resume | FE | P3-T03 | TODO |
| [ ] | P3-T06 | Quiz preview/attempt/pass/retry | FE | P3-T03 | TODO |
| [ ] | P3-T07 | Programming reading/preview/video | FE | P3-T03 | TODO |
| [ ] | P3-T08 | Comment/reply states | FE | P3-T02 | TODO |
| [ ] | P3-T09 | Progress store/optimistic update | FE | P3-T04,P3-T05,P3-T06 | TODO |
| [ ] | P3-T10 | Learning/progress FE tests | FE/QA | P3-T09 | TODO |

**Phase gate:** Student hoàn thành mock Reading/Video/Quiz/Problem progress flow.

## Phase 4 - FE Teacher/Admin

| Done | ID | Task | Owner | Dependency | Status |
| --- | --- | --- | --- | --- | --- |
| [ ] | P4-T01 | Teacher dashboard/profile/students/earnings | FE | P1-T03 | TODO |
| [ ] | P4-T02 | Course builder/curriculum reorder | FE | P4-T01 | TODO |
| [ ] | P4-T03 | Lesson content builder | FE | P4-T02 | TODO |
| [ ] | P4-T04 | Quiz/Problem pass score/max attempts controls | FE | P4-T03 | TODO |
| [ ] | P4-T05 | TC14 course approval timeline/checklist | FE | P4-T02 | TODO |
| [ ] | P4-T06 | Enrollment/progress/submission teacher views | FE | P4-T01 | TODO |
| [ ] | P4-T07 | Coding problem/language/testcase management | FE | P4-T01 | TODO |
| [ ] | P4-T08 | AD01 Teacher review + AD02 Course review | FE | P1-T03 | TODO |
| [ ] | P4-T09 | Admin decision/notification/audit UI | FE | P4-T08 | TODO |
| [ ] | P4-T10 | Teacher/Admin FE tests | FE/QA | P4-T05,P4-T09 | TODO |

**Phase gate:** Teacher studio và Admin moderation chạy bằng mock.

## Phase 5 - FE Commerce/Finance

| Done | ID | Task | Owner | Dependency | Status |
| --- | --- | --- | --- | --- | --- |
| [ ] | P5-T01 | PAY01 cart add/remove/duplicate/empty | FE | P2-T02,P1-T07 | TODO |
| [ ] | P5-T02 | PAY02 one-course checkout | FE | P5-T01 | TODO |
| [ ] | P5-T03 | PAY03 pending/completed/failed/expired | FE | P5-T02 | TODO |
| [ ] | P5-T04 | Order summary/enrollment success states | FE | P5-T03 | TODO |
| [ ] | P5-T05 | TC15 wallet/ledger/payout UI | FE | P4-T01 | TODO |
| [ ] | P5-T06 | 80/20 and 1000 VND validation UI | FE | P5-T05 | TODO |
| [ ] | P5-T07 | Mock webhook/SSE simulation | FE | P5-T03 | TODO |
| [ ] | P5-T08 | Commerce/payout FE tests | FE/QA | P5-T04,P5-T07 | TODO |

**Phase gate:** Mock purchase-to-enrollment và payout flow pass.

## Phase 6 - FE OJ/Quiz/AI

| Done | ID | Task | Owner | Dependency | Status |
| --- | --- | --- | --- | --- | --- |
| [ ] | P6-T01 | OJ problem list/detail/history | FE | P1-T03 | TODO |
| [ ] | P6-T02 | Monaco editor/language/run/submit | FE | P6-T01 | TODO |
| [ ] | P6-T03 | Console/testcase/diff/runtime states | FE | P6-T02 | TODO |
| [ ] | P6-T04 | Quiz timer/question navigator/submit confirmation | FE | P3-T06 | TODO |
| [ ] | P6-T05 | INTERVIEW03 setup/topic/level/permission | FE | P1-T03 | TODO |
| [ ] | P6-T06 | INTERVIEW02 chat/pause/early finish/max 12 | FE | P6-T05 | TODO |
| [ ] | P6-T07 | Mic/camera fallback without recording | FE | P6-T06 | TODO |
| [ ] | P6-T08 | INTERVIEW01 report/skill scores/notification | FE | P6-T06 | TODO |
| [ ] | P6-T09 | Mock SSE/WebSocket adapter | FE | P6-T03,P6-T06 | TODO |
| [ ] | P6-T10 | OJ/Quiz/AI FE tests | FE/QA | P6-T09 | TODO |

**Phase gate:** Interaction-heavy UI chạy bằng mock stream/queue.

## Phase 7 - API Contract Freeze

| Done | ID | Task | Owner | Dependency | Status |
| --- | --- | --- | --- | --- | --- |
| [ ] | P7-T01 | Rewrite API spec theo UI mới | BE/FE | P2-T09,P3-T10,P5-T08,P6-T10 | TODO |
| [ ] | P7-T02 | Tạo OpenAPI 3 JSON source | BE | P7-T01 | TODO |
| [ ] | P7-T03 | Định nghĩa auth/role/ownership/status rules | BE | P0-T02,P0-T04 | TODO |
| [ ] | P7-T04 | Định nghĩa pagination/filter/sort | BE/FE | P7-T01 | TODO |
| [ ] | P7-T05 | Định nghĩa upload/presigned contract | BE/FE | P7-T01 | TODO |
| [ ] | P7-T06 | Định nghĩa PayOS order/webhook/result contract | BE | P7-T01 | TODO |
| [ ] | P7-T07 | Định nghĩa Judge submit/result stream contract | BE | P7-T01 | TODO |
| [ ] | P7-T08 | Định nghĩa AI setup/chat/report contract | BE | P7-T01 | TODO |
| [ ] | P7-T09 | Định nghĩa error/idempotency contract | BE/FE | P0-T06 | TODO |
| [ ] | P7-T10 | Generate TypeScript API client/types | FE | P7-T02 | TODO |
| [ ] | P7-T11 | FE/BE contract review and freeze v1 | CROSS | P7-T03-P7-T10 | TODO |

**Phase gate:** Mock adapter có thể thay bằng generated API client.

## Phase 8 - Database/Migration

| Done | ID | Task | Owner | Dependency | Status |
| --- | --- | --- | --- | --- | --- |
| [ ] | P8-T01 | Inventory current models/migration/data | BE/DBA | P0-T01 | TODO |
| [ ] | P8-T02 | Define rename/backfill compatibility plan | BE/DBA | P8-T01 | TODO |
| [ ] | P8-T03 | Add new enums/status mappings | BE/DBA | P7-T11 | TODO |
| [ ] | P8-T04 | Add Teacher/course approval fields | BE/DBA | P8-T03 | TODO |
| [ ] | P8-T05 | Add cart/order/order_item/payment linkage | BE/DBA | P8-T03 | TODO |
| [ ] | P8-T06 | Add wallet/ledger/payout | BE/DBA | P8-T05 | TODO |
| [ ] | P8-T07 | Add favorite/review/video content | BE/DBA | P8-T03 | TODO |
| [ ] | P8-T08 | Migrate progress and quiz attempts | BE/DBA | P8-T07 | TODO |
| [ ] | P8-T09 | Migrate interview lifecycle/report unique | BE/DBA | P8-T03 | TODO |
| [ ] | P8-T10 | Add indexes/unique/check constraints | BE/DBA | P8-T04-P8-T09 | TODO |
| [ ] | P8-T11 | Seed roles/languages/sample data | BE/DBA | P8-T10 | TODO |
| [ ] | P8-T12 | Backup/restore and rollback rehearsal | DBA/DEVOPS | P8-T11 | TODO |
| [ ] | P8-T13 | Generate schema/ERD verification report | BE/DBA | P8-T12 | TODO |

**Phase gate:** Fresh DB và staging copy migration pass.

## Phase 9 - BE Foundation

| Done | ID | Task | Owner | Dependency | Status |
| --- | --- | --- | --- | --- | --- |
| [ ] | P9-T01 | Config/env/secrets | BE/DEVOPS | P8-T13 | TODO |
| [ ] | P9-T02 | CORS/error/response envelope | BE | P9-T01 | TODO |
| [ ] | P9-T03 | JWT/JWK/role/ownership guards | BE | P9-T01 | TODO |
| [ ] | P9-T04 | Repository/service/router layering | BE | P9-T01 | TODO |
| [ ] | P9-T05 | DB transaction/unit-of-work conventions | BE | P9-T04 | TODO |
| [ ] | P9-T06 | Redis lock/cache/rate limit | BE | P9-T01 | TODO |
| [ ] | P9-T07 | Queue retry/backoff/dead-letter | BE | P9-T01 | TODO |
| [ ] | P9-T08 | Storage/presigned/file scan service | BE | P9-T01 | TODO |
| [ ] | P9-T09 | Notification event/audit service | BE | P9-T05 | TODO |
| [ ] | P9-T10 | OpenAPI/logging/tracing/health | BE/DEVOPS | P9-T02 | TODO |
| [ ] | P9-T11 | Chuẩn hóa BE folder structure theo module/domain | BE | P8-T13 | TODO |
| [ ] | P9-T12 | Tách app bootstrap/router wiring khỏi business logic | BE | P9-T11 | TODO |
| [ ] | P9-T13 | Tách model imports theo bounded context | BE | P9-T11 | TODO |
| [ ] | P9-T14 | Tạo BE module template với test cùng feature | BE/QA | P9-T11 | TODO |
| [ ] | P9-T15 | Thiết lập cảnh báo BE god files | BE/QA | P9-T14 | TODO |
| [ ] | P9-T16 | Thiết lập dependency rule và chống circular import | BE | P9-T12,P9-T13 | TODO |

**Phase gate:** Shared backend infrastructure integration tests pass.

## Phase 10 - BE Vertical Slices

| Done | ID | Task | Owner | Dependency | Status |
| --- | --- | --- | --- | --- | --- |
| [ ] | P10-T01 | Auth/profile/role/Teacher application API | BE | P9-T03,P9-T08 | TODO |
| [ ] | P10-T02 | Admin Teacher approval/notification API | BE | P10-T01,P9-T09 | TODO |
| [ ] | P10-T03 | Catalog/detail/favorite/review API | BE | P9-T05 | TODO |
| [ ] | P10-T04 | Course builder/content/reorder API | BE | P10-T03 | TODO |
| [ ] | P10-T05 | Admin course approval API | BE | P10-T04,P9-T09 | TODO |
| [ ] | P10-T06 | Enrollment/progress/reading/video API | BE | P10-T04 | TODO |
| [ ] | P10-T07 | Quiz/attempt/scoring API | BE | P10-T06 | TODO |
| [ ] | P10-T08 | Cart/order/PayOS/webhook API | BE | P9-T05,P9-T06 | TODO |
| [ ] | P10-T09 | Wallet/ledger/payout API | BE | P10-T08 | TODO |
| [ ] | P10-T10 | OJ problem/submission/result API | BE | P9-T07 | TODO |
| [ ] | P10-T11 | Judge worker/sandbox/result stream | BE/DEVOPS | P10-T10 | TODO |
| [ ] | P10-T12 | AI session/message/report API | BE | P9-T07 | TODO |
| [ ] | P10-T13 | Notification read/realtime API | BE | P9-T09 | TODO |
| [ ] | P10-T14 | Replace MSW handlers by generated client | FE | P7-T10,P10-T01-P10-T13 | TODO |
| [ ] | P10-T15 | Remove critical mock paths | FE/BE | P10-T14 | TODO |

**Phase gate:** Critical vertical slices run on real DB/API.

## Phase 11 - Integrations/Ops

| Done | ID | Task | Owner | Dependency | Status |
| --- | --- | --- | --- | --- | --- |
| [ ] | P11-T01 | PayOS sandbox/webhook replay | BE/DEVOPS | P10-T08 | TODO |
| [ ] | P11-T02 | Gemini key/prompt/timeout/cost limit | BE/DEVOPS | P10-T12 | TODO |
| [ ] | P11-T03 | OCR/document detection worker | BE/DEVOPS | P10-T01 | TODO |
| [ ] | P11-T04 | Judge language images/resource limits | BE/DEVOPS | P10-T11 | TODO |
| [ ] | P11-T05 | Storage lifecycle/private buckets | DEVOPS | P9-T08 | TODO |
| [ ] | P11-T06 | Queue/Redis monitoring | DEVOPS | P9-T07 | TODO |
| [ ] | P11-T07 | Realtime reconnect/notification delivery | FE/BE | P10-T13 | TODO |
| [ ] | P11-T08 | Secret/environment separation | DEVOPS | P9-T01 | TODO |
| [ ] | P11-T09 | Backup/restore/PII retention | DEVOPS/DBA | P8-T12 | TODO |
| [ ] | P11-T10 | Metrics/alerts/incident runbook | DEVOPS | P11-T06 | TODO |

## Phase 12 - QA, Security và Release

| Done | ID | Task | Owner | Dependency | Status |
| --- | --- | --- | --- | --- | --- |
| [ ] | P12-T01 | Unit tests scoring/status/money | QA/BE | P10-T01-P10-T13 | TODO |
| [ ] | P12-T02 | API integration/auth/ownership/webhook | QA/BE | P10-T15 | TODO |
| [ ] | P12-T03 | FE component/accessibility tests | QA/FE | P2-T09,P3-T10 | TODO |
| [ ] | P12-T04 | E2E auth/Teacher/course approval | QA | P10-T15 | TODO |
| [ ] | P12-T05 | E2E cart/payment/enrollment | QA | P11-T01 | TODO |
| [ ] | P12-T06 | E2E learning/quiz/problem | QA | P10-T07,P10-T11 | TODO |
| [ ] | P12-T07 | E2E AI/payout approval | QA | P10-T09,P10-T12 | TODO |
| [ ] | P12-T08 | Security IDOR/XSS/upload/SSRF/rate limit | QA/SEC | P10-T15 | TODO |
| [ ] | P12-T09 | Judge sandbox escape/resource test | QA/SEC | P11-T04 | TODO |
| [ ] | P12-T10 | Load test catalog/webhook/judge/notify | QA/DEVOPS | P11-T06 | TODO |
| [ ] | P12-T11 | Responsive/browser regression | QA/FE | P10-T15 | TODO |
| [ ] | P12-T12 | UAT theo PRD acceptance criteria | PRODUCT/QA | P12-T04-P12-T11 | TODO |
| [ ] | P12-T13 | Staging deploy/smoke/rollback drill | DEVOPS | P12-T12 | TODO |
| [ ] | P12-T14 | Production checklist/monitoring/support runbook | CROSS | P12-T13 | TODO |

## Definition of Done

- Task có output/code/document đúng scope.
- Có test phù hợp và evidence trong PR/CI.
- UI có loading, empty, error, forbidden và success state.
- API có contract, validation và error code.
- Database change có migration/backfill/rollback strategy.
- Mutation nhạy cảm có authorization, transaction, idempotency, audit/notification.
- Không còn mock data trong production path của task.
- Documentation được cập nhật nếu thay đổi behavior.

## Risk register

| Risk | Ảnh hưởng | Mitigation |
| --- | --- | --- |
| API spec thay đổi sau khi FE hoàn thiện | Rework FE/BE | Freeze contract tại P7-T11 |
| PayOS webhook duplicate/invalid | Mất tiền hoặc enroll sai | Signature verification + idempotency + replay test |
| Judge sandbox escape | Critical security | Docker isolation, no network, resource limits, security test |
| Gemini timeout/cost | UX/report không ổn định | Queue, timeout, retry, cost limit, fallback |
| OCR sai CCCD | Duyệt nhầm Teacher | OCR chỉ hỗ trợ; Admin là decision maker |
| Float money legacy | Sai balance | Migrate BIGINT VND trước wallet |
| Polymorphic content_id | Content hỏng liên kết | Service resolver + data validation |
| Scope quá lớn | Trễ release | Milestone gate và ưu tiên vertical slice |

## Milestone checklist

| Milestone | Task gate | Status |
| --- | --- | --- |
| M0 Specification freeze | P0-T01 đến P0-T08 | TODO |
| M1 FE foundation | P1-T01 đến P1-T10 | TODO |
| M2 FE prototype | P2-T01 đến P6-T10 | TODO |
| M3 API contract freeze | P7-T01 đến P7-T11 | TODO |
| M4 Database ready | P8-T01 đến P8-T13 | TODO |
| M5 Backend connected | P9-T01 đến P10-T15 | TODO |
| M6 Integrated beta | P11-T01 đến P11-T10 | TODO |
| M7 Release candidate | P12-T01 đến P12-T13 | TODO |
| M8 Production release | P12-T14 | TODO |
