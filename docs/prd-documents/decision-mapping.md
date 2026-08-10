# Phase 0 Decision Log

## 1. Thông tin

| Mục | Giá trị |
| --- | --- |
| Dự án | LMS Coding Platform |
| Baseline date | 2026-08-10 |
| Phạm vi | Phase 0 - Product, UX và specification baseline |
| Product source | `prd.md` và các quyết định đã xác nhận với Product Owner |
| Technical source | `tdd.md`, `DATABASE.txt`, `api_spec.md` |
| UI source | 53 Markdown wireframe và asset SVG/PNG trong `docs/screen` |

Trạng thái:

- `ACCEPTED`: quyết định đã khóa, implementation phải tuân theo.
- `DEFERRED`: chưa cần khóa để hoàn thành Phase 0; có owner và phase xác minh.
- `SUPERSEDED`: đã được quyết định mới thay thế.

## 2. Quyết định đã chốt

### D-001 - Route source of truth

| Field | Decision |
| --- | --- |
| Status | ACCEPTED |
| Decision | Route FE dùng route map trong `phase0-specification-baseline.md`; các nhãn `VERIFY`/`suy luận` trong wireframe là provenance từ asset, không ghi đè route baseline |
| Rule | Public course dùng `:slug`; resource nội bộ Teacher/Admin/Order/Session dùng ID string |
| Key resolutions | `/auth/verify-otp`, `/student/courses`, `/learn/:courseSlug/:lessonContentId`, `/checkout/:orderId`, `/checkout/:orderId/result`, `/interview/sessions/:sessionId`, `/interview/sessions/:sessionId/report` |
| Consequence | FE router ở Phase 1/2 phải import một route constant map; không hard-code route khác trong page component |

Course detail comments/progress/instructor dùng cùng route `/courses/:slug` với query tab. `AUTH07` là legacy guest entry; sau login chuyển tới `/student/teacher-application`.

### D-002 - Permission và ownership

| Field | Decision |
| --- | --- |
| Status | ACCEPTED |
| Decision | Permission matrix trong `phase0-specification-baseline.md` là baseline authorization |
| Rule | Role check luôn đi cùng ownership/enrollment policy tại backend |
| Teacher activation | Chỉ `teacher_profile.application_status = APPROVED` kích hoạt quyền Teacher |
| Admin boundary | Admin review/moderate nhưng không trở thành owner của Teacher resource |
| Consequence | FE guard dùng permission để UX; backend policy là security boundary cuối |

### D-003 - PayOS, Order và Enrollment

| Field | Decision |
| --- | --- |
| Status | ACCEPTED |
| Provider | PayOS cho checkout QR/link và signed webhook |
| Order scope | Một order chứa đúng một course trong MVP |
| Enrollment | Chỉ webhook PayOS hợp lệ tạo Enrollment, đúng một lần |
| Idempotency | Create order/checkout dùng `Idempotency-Key`; webhook dedupe theo PayOS order code + provider reference |
| Revenue | Payment complete ghi 80% Teacher và 20% Platform bằng immutable ledger trong cùng transaction boundary/outbox flow |
| Security | Webhook không dùng user JWT; verify signature trên raw payload trước mutation |

Redirect success từ browser không phải bằng chứng thanh toán. PAY03 poll/read payment result từ backend cho đến terminal state.

### D-004 - Online Judge architecture

| Field | Decision |
| --- | --- |
| Status | ACCEPTED |
| Boundary | Business Application quản lý problem/submission; Judge Service adapter quản lý compile/run |
| Execution | RabbitMQ queue tới isolated Docker sandbox, không network, có CPU/RAM/time/filesystem limits |
| Realtime | SSE stream submission status; polling endpoint vẫn tồn tại để resume/fallback |
| Result | Chuẩn hóa `ACCEPTED`, `WRONG_ANSWER`, `TIME_LIMIT_EXCEEDED`, `MEMORY_LIMIT_EXCEEDED`, `RUNTIME_ERROR`, `COMPILE_ERROR` |
| Privacy | Student không nhận hidden testcase input/expected/raw output |
| Idempotency | Retry worker cập nhật submission cũ; submit API cùng key không tạo submission mới |

Việc dùng self-hosted runner hay Judge0 adapter phía sau Judge Service được benchmark ở Phase 11; API/domain contract không phụ thuộc lựa chọn provider đó.

### D-005 - Gemini AI Interview

| Field | Decision |
| --- | --- |
| Status | ACCEPTED |
| Provider | Gemini API qua server-side AI adapter; key không xuất hiện ở browser |
| Conversation | Text turn-based; tối đa 12 câu và AI có thể kết thúc sớm khi đủ dữ liệu |
| Media | Browser xin microphone/camera permission nhưng hệ thống không lưu audio/video recording |
| Persistence | Lưu normalized text messages và đúng một final report/session |
| Lifecycle | `ACTIVE -> REPORT_GENERATING -> COMPLETED hoặc FAILED`; user có thể `ABORTED` khi đang Active |
| Resilience | Timeout/retry có budget; prompt version được audit; report generation chạy worker |

SSE/WebSocket chỉ truyền text/event state. Nếu media-to-text được bổ sung, transcript đã chuẩn hóa mới được gửi Business API.

### D-006 - OCR và document review

| Field | Decision |
| --- | --- |
| Status | ACCEPTED |
| Provider baseline | Cloudflare Workers AI/Document Detection qua OCR adapter |
| Purpose | Trích xuất CCCD masked metadata, quality/confidence và warning để hỗ trợ Admin review |
| Authority | OCR không tự approve/reject Teacher application |
| Files | CCCD/CV ở private object storage, dùng signed URL; ClamAV/MIME scan trước OCR/review |
| Privacy | Không đưa raw CCCD/CV vào public fixture, log hoặc notification |
| Failure | OCR pending/failed không làm mất application; Admin có thể review thủ công với audit note |

OCR adapter phải cho phép đổi provider mà không đổi API response `DocumentAnalysis`.

### D-007 - API conventions

| Field | Decision |
| --- | --- |
| Status | ACCEPTED |
| Contract | `docs/specs/api_spec.md` |
| JSON | `snake_case`, success `data/meta`, error `error.code/message/details/request_id` |
| IDs | BIGINT serialize thành string |
| Money | Integer VND với suffix `_vnd` |
| Time | ISO 8601 UTC `Z` |
| Pagination | `page`, `page_size`, `total_items`, `total_pages`; page size tối đa 100 |
| Concurrency | Mutation state/reorder dùng resource `version`; stale version trả 409 |

### D-008 - FE mock contract

| Field | Decision |
| --- | --- |
| Status | ACCEPTED |
| Catalogue | `docs/specs/mock-payload-catalogue.md` |
| Coverage | 53/53 Markdown wireframe có fixture key và state tối thiểu |
| Behavior | Mock mutation phải cập nhật store; async flow đi qua state machine thật |
| Determinism | Freeze clock/inject ID; không random trong automated test |
| Contract drift | API path/enum/shape thay đổi phải cập nhật catalogue trước implementation |

## 3. Các xác minh được hoãn có kiểm soát

| ID | Điểm cần xác minh | Hiện trạng không đổi | Owner/Phase | Exit evidence |
| --- | --- | --- | --- | --- |
| V-001 | Figma font weight, spacing, breakpoint và token name | `docs/ui/theme.md` + SVG/PNG là baseline visual | FE / P1-T02 | Token table đối chiếu Figma khi MCP quota khả dụng |
| V-002 | PayOS sandbox credential, signature library/version và retry timing | Contract/idempotency D-003 giữ nguyên | BE/DEVOPS / P11-T01 | Signed webhook replay test pass |
| V-003 | Judge0 hay self-hosted runner | Judge Service adapter + status contract D-004 giữ nguyên | BE/DEVOPS / P11-T04 | Benchmark language coverage, isolation, latency, cost |
| V-004 | Gemini model/version, token budget và timeout | Gemini adapter + max 12/data policy D-005 giữ nguyên | BE/DEVOPS / P11-T02 | Prompt eval + timeout/retry/cost test |
| V-005 | Cloudflare OCR model/version và confidence threshold | OCR advisory-only D-006 giữ nguyên | BE/DEVOPS / P11-T03 | Vietnamese CCCD quality set evaluated; manual fallback verified |

Các mục `DEFERRED` trên là provider/configuration verification, không mở lại business flow hoặc API shape của Phase 0.

## 4. Legacy mapping đã supersede

| Legacy | Baseline thay thế | Status |
| --- | --- | --- |
| `AGREE/REJECT` | `APPROVED/REJECTED` | SUPERSEDED |
| `POST /courses/{slug}/enroll` cho paid course | Order -> PayOS webhook -> Enrollment | SUPERSEDED |
| Teacher update `course.status` trực tiếp | Submit/approve/reject/archive action endpoints | SUPERSEDED |
| Reading/Video complete thủ công cùng endpoint | Backend-derived typed progress; Video 100% | SUPERSEDED |
| `Transaction` trực tiếp từ Course | Cart -> Order -> Transaction -> Enrollment | SUPERSEDED |
| AI session boolean status/report 1-n | InterviewStatus lifecycle + one report/session | SUPERSEDED |
| Payout approve rồi coi như completed ngay | Approved -> Processing -> Completed/Failed | SUPERSEDED |

## 5. Phase 0 conclusion

| Mục | Kết luận |
| --- | --- |
| Route | Đã chốt theo 53 wireframe và business-flow screens |
| Permission | Đã chốt Student/Teacher pending/Approved Teacher/Admin + ownership |
| API | Đã chốt endpoint target và cross-cutting conventions |
| Mock | Đã map 53/53 màn hình với deterministic fixture states |
| Provider | PayOS, Gemini, Judge Service boundary và Cloudflare OCR đã chốt; model/version/config xác minh ở Phase 11 |
| Open business decision | Không còn điểm mở chặn Phase 1 |
| Next gate | Product/Tech review Phase 0 commit trước khi bắt đầu Phase 1 |
