# LMS Coding Platform API Contract

## 1. Phạm vi, phiên bản và trạng thái

Tài liệu này là contract mục tiêu giữa Frontend, Auth Provider, Business Application và các worker adapter. Nó thay baseline Phase 0 bằng contract candidate của Phase 7, là nguồn đầu vào để tạo OpenAPI/Pydantic schema và generated TypeScript client; tài liệu không khẳng định các endpoint đã được implement.

| Thuộc tính | Giá trị |
| --- | --- |
| Contract version | `1.0.0-candidate.1` |
| Updated | `2026-08-10` |
| Stability | `CANDIDATE` |
| Freeze condition | OpenAPI lint, generated client và FE/BE review tại `P7-T11` |
| Breaking change | Tăng major version và có decision-log entry |

Nguồn ưu tiên:

1. `docs/prd-documents/prd.md`.
2. `docs/prd-documents/phase0-specification-baseline.md`.
3. `docs/DATABASE.txt`.
4. Wireframe trong `docs/ui`.

Nguồn ưu tiên thấp hơn không được ghi đè nguồn cao hơn. Các tài liệu `docs/specs/verify/*` là lịch sử review, không phải contract đang có hiệu lực.

Base URL và media type:

- Auth Provider local: `http://localhost:4001/auth`.
- Business Application local: `http://localhost:4000/api/v1`.
- Production URL lấy từ environment, không hard-code trong client.
- JSON request/response dùng `application/json; charset=utf-8`.
- SSE dùng `text/event-stream`; upload binary đi thẳng object storage qua presigned URL.
- JSON dùng `snake_case`; route API dùng danh từ số nhiều và `kebab-case`.

### 1.1. Phạm vi Phase 7

- File này hoàn thành contract văn bản cho `P7-T01`, `P7-T03` đến `P7-T09`.
- OpenAPI JSON (`P7-T02`), generated client (`P7-T10`) và freeze (`P7-T11`) là artifact riêng, chưa được tuyên bố hoàn tất bởi file này.
- Endpoint chưa implement vẫn phải giữ path, operation, enum và error code đã mô tả khi backend được xây dựng.

## 2. Quy ước chung

### 2.1. Authentication và authorization

- Browser nhận access/refresh token qua cookie `HttpOnly`, `Secure`, `SameSite=Lax`.
- Business Application verify access token bằng JWK từ Auth Provider.
- Endpoint Business Application yêu cầu đăng nhập trừ khi ghi `Public` hoặc `Webhook`.
- Backend luôn kiểm tra role và resource ownership; FE route guard không phải security boundary.
- Webhook PayOS không dùng user JWT, bắt buộc verify signature trên raw payload.

Request header chuẩn:

| Header | Bắt buộc | Áp dụng |
| --- | --- | --- |
| `Cookie` | Theo access | Browser session với access/refresh cookie |
| `X-Request-Id` | Không | Client correlation ID; server tạo nếu thiếu và luôn trả trong `meta`/error |
| `Idempotency-Key` | Theo bảng 2.6 | Mutation tạo side effect không được lặp |
| `Last-Event-ID` | Không | Resume SSE Judge/notification sau reconnect |
| `Content-Type` | Có body | `application/json` trừ PayOS raw webhook |

Cookie có scope hẹp, refresh token chỉ gửi tới Auth Provider. Business Application không đọc refresh token.

### 2.2. Success response

Resource đơn:

```json
{
  "data": {},
  "meta": { "request_id": "req_01JXYZ" }
}
```

Collection:

```json
{
  "data": [],
  "meta": {
    "request_id": "req_01JXYZ",
    "page": 1,
    "page_size": 20,
    "total_items": 42,
    "total_pages": 3
  }
}
```

Mutation không cần body trả `204 No Content`. Create trả `201 Created`; mutation đồng bộ trả `200 OK`; job bất đồng bộ trả `202 Accepted`.

### 2.3. Error response

Mọi non-2xx từ Business Application và JSON endpoint của Auth Provider dùng:

```json
{
  "error": {
    "code": "COURSE_ALREADY_ENROLLED",
    "message": "Bạn đã sở hữu khóa học này.",
    "details": [
      { "field": "course_id", "reason": "already_enrolled" }
    ],
    "request_id": "req_01JXYZ"
  }
}
```

Mã HTTP chuẩn:

| HTTP | Khi sử dụng |
| --- | --- |
| `400` | Payload hợp lệ về cú pháp nhưng vi phạm request rule |
| `401` | Chưa đăng nhập/token hết hạn |
| `403` | Sai role, ownership hoặc resource policy |
| `404` | Resource không tồn tại hoặc không được phép tiết lộ |
| `409` | Trùng dữ liệu, stale state hoặc idempotency conflict |
| `422` | Validation field |
| `429` | Rate limit/quota |
| `500` | Lỗi nội bộ không lộ stack trace |
| `502/503` | Provider/worker tạm thời không khả dụng |

### 2.4. Pagination, filter và sort

- Collection dùng `page` mặc định `1`, `page_size` mặc định `20`, tối đa `100`.
- Search dùng `q`; filter dùng tên field, ví dụ `status=PUBLISHED`.
- Sort dùng `sort=created_at` và `order=asc|desc`; mặc định `created_at desc`.
- Filter lặp dùng CSV, ví dụ `difficulty=EASY,MEDIUM`.
- Query không hợp lệ trả `422 VALIDATION_ERROR`; page vượt trang cuối trả collection rỗng, không trả `404`.
- Search được trim, tối đa 200 ký tự và không phân biệt hoa thường nếu domain không ghi khác.
- Sort field không có trong allowlist của endpoint trả `422`, không chuyển thẳng input vào câu SQL.

### 2.5. Kiểu dữ liệu

- BIGINT id được serialize thành string để an toàn với JavaScript, ví dụ `"course_id": "12001"`.
- Datetime là ISO 8601 UTC có hậu tố `Z`, ví dụ `2026-08-10T09:30:00Z`.
- Date là `YYYY-MM-DD`.
- Tiền là integer VND, field kết thúc bằng `_vnd`; không truyền float hoặc chuỗi đã format.
- Tỷ lệ phần trăm là số `0..100`; score dùng decimal `0..100`.
- Enum trả đúng uppercase value trong `DATABASE.txt`.
- Field không có giá trị trả `null`; không dùng chuỗi rỗng thay `null`.

### 2.6. Idempotency và concurrency

- `Idempotency-Key` là chuỗi opaque 16..128 ký tự, scope theo current principal + operation, lưu tối thiểu 24 giờ.
- Cùng key + cùng canonical payload trả lại status/body ban đầu và header `Idempotency-Replayed: true`; cùng key + payload khác trả `409 IDEMPOTENCY_CONFLICT`.
- PayOS webhook idempotent theo `payos_order_code` và provider transaction reference.
- Update reorder/status dùng `version`; version cũ trả `409 STALE_RESOURCE_VERSION`.

| Operation | Idempotency key | Concurrency |
| --- | --- | --- |
| Create order, PayOS checkout | Bắt buộc | Unique active order theo user/course |
| Submit Judge | Bắt buộc | Replay trả cùng submission |
| Finish interview | Bắt buộc | Một report job/session |
| Request payout | Bắt buộc | Reserve balance trong transaction |
| Submit application/course review | Khuyến nghị | `version` bắt buộc |
| PayOS webhook | Provider dedupe key | Row lock + unique transaction reference |

### 2.7. Caching, rate limit và timeouts

- Public catalog/detail có thể trả `ETag`; request `If-None-Match` hợp lệ trả `304` không có body.
- Response `429` trả `Retry-After` theo giây. Auth, AI, Judge và upload có quota riêng.
- API đồng bộ không chờ Judge/AI/OCR/scan; job dài trả `202` và resource trạng thái để poll hoặc SSE.
- Client timeout không đồng nghĩa mutation thất bại; với operation idempotent, client retry bằng cùng key.

## 3. Auth Provider

| Method | Path | Access | Request | Response |
| --- | --- | --- | --- | --- |
| `GET` | `/authorize?redirect_uri=` | Public | Query | Redirect hoặc authorization state |
| `POST` | `/login` | Public | Form `email`, `password`, `redirect_uri` | Authorization code |
| `POST` | `/code` | Service | `code` | Token cookies/session |
| `POST` | `/refresh` | Cookie | Refresh cookie | Refreshed access cookie |
| `POST` | `/google` | Public | `credential_code` | Session |
| `POST` | `/logout` | Authenticated | - | `204` |
| `POST` | `/register` | Public | `full_name`, `email`, `password`, `address?` | Verification challenge |
| `POST` | `/verify-otp` | Public | `email`, `otp` | Account activation result |
| `POST` | `/resend-otp` | Public | `email` | Generic accepted response |
| `POST` | `/forgot-password` | Public | `email` | Generic accepted response |
| `POST` | `/reset-password` | Public/reset token | `token`, `new_password` | `204` |
| `POST` | `/change-email` | Authenticated | `new_email`, `password` | Verification challenge |
| `GET` | `/public-key` | Service/Public | - | JWK set |

Auth response không được trả OTP, reset token, access token hoặc refresh token trong JSON production log/body.

Auth rules:

- Login/register/OTP/forgot password luôn trả message trung tính khi việc tiết lộ email tồn tại tạo rủi ro enumeration.
- Password dài `8..128`, phải có chữ và số; server hash bằng cấu hình hiện hành, không log raw password.
- OTP có TTL 5 phút, tối đa 5 lần thử/challenge; resend áp dụng cooldown 60 giây.
- `POST /code` chỉ nhận authorization code dùng một lần, TTL ngắn và ràng buộc `redirect_uri` đã đăng ký.
- `POST /logout` revoke refresh session hiện tại và clear cookie kể cả khi access token đã hết hạn.

Lỗi riêng: `INVALID_CREDENTIALS` (`401`), `ACCOUNT_NOT_ACTIVE`/`ACCOUNT_BANNED` (`403`), `OTP_INVALID` (`422`), `OTP_EXPIRED`/`TOKEN_EXPIRED` (`410`), `EMAIL_ALREADY_EXISTS` (`409`), `RATE_LIMITED` (`429`).

## 4. Identity và Teacher approval

| Method | Path | Access | Request/Query | Response schema |
| --- | --- | --- | --- | --- |
| `GET` | `/users/me` | Authenticated | - | `CurrentUser` |
| `PATCH` | `/users/me/student-profile` | Student | Profile fields | `StudentProfile` |
| `GET` | `/users/me/teacher-profile` | Approved Teacher | - | `TeacherProfile` |
| `PATCH` | `/users/me/teacher-profile` | Approved Teacher | Profile fields | `TeacherProfile` |
| `GET` | `/teacher-applications/me` | Student | - | `TeacherApplication` hoặc `null` |
| `POST` | `/teacher-applications` | Student | Profile + CCCD/CV references | `TeacherApplication` |
| `PATCH` | `/teacher-applications/{application_id}` | Owner, Draft/Rejected | Editable fields + `version` | `TeacherApplication` |
| `POST` | `/teacher-applications/{application_id}/submit` | Owner | `version` | Pending application |
| `GET` | `/admin/teacher-applications` | Admin | Pagination, `status` | Collection |
| `GET` | `/admin/teacher-applications/{application_id}` | Admin | - | Application + private file URLs + OCR result |
| `POST` | `/admin/teacher-applications/{application_id}/approve` | Admin | `reviewed_note?`, `version` | Approved application |
| `POST` | `/admin/teacher-applications/{application_id}/reject` | Admin | `reviewed_note`, `version` | Rejected application |
| `GET` | `/admin/teacher-applications/{application_id}/document-analysis` | Admin | - | `DocumentAnalysis` |
| `PUT` | `/admin/users/{user_id}/account-status` | Admin | `account_status`, `reason`, `version` | `UserAdminProjection` |

Teacher profile được tạo cùng lần save application đầu tiên. Chỉ status `APPROVED` kích hoạt Teacher role/quyền; reject bắt buộc note.

Teacher application write contract:

- Create nhận `motivation`, profile fields và ba upload reference `cccd_front_upload_id`, `cccd_back_upload_id`, `cv_upload_id`; CCCD number raw không xuất hiện lại sau khi lưu.
- Draft cho phép sửa; Pending chỉ đọc; Rejected phải edit để chuyển về Draft trước khi submit lại.
- Approve/reject chỉ hợp lệ từ Pending. Approve atomically thêm Teacher role, cập nhật `verified_at`, tạo notification và audit log.
- Admin detail trả signed URL TTL tối đa 5 phút; response/list/log chỉ trả `cccd_masked` và `cccd_last_four`.
- Account ban không xóa role, enrollment hoặc audit history; request mới của user bị ban trả `403 ACCOUNT_BANNED`.

Lỗi riêng: `APPLICATION_ALREADY_EXISTS` (`409`), `APPLICATION_STATE_INVALID` (`409`), `REJECTION_NOTE_REQUIRED` (`422`), `DOCUMENTS_INCOMPLETE` (`422`), `FILE_SCAN_PENDING` (`409`), `STALE_RESOURCE_VERSION` (`409`).

## 5. Catalog, instructor và social commerce

| Method | Path | Access | Request/Query | Response schema |
| --- | --- | --- | --- | --- |
| `GET` | `/courses` | Public | Pagination, `q`, `price_type`, `field`, `sort`, `order` | `CourseCard[]` |
| `GET` | `/courses/{slug}` | Public | - | `CourseDetail` |
| `GET` | `/instructors` | Public | Pagination, `q`, `sort` | `InstructorCard[]` |
| `GET` | `/instructors/{instructor_id}` | Public | - | `InstructorDetail` |
| `GET` | `/users/me/favorite-courses` | Authenticated | Pagination | `CourseCard[]` |
| `PUT` | `/users/me/favorite-courses/{course_id}` | Authenticated | - | `204` |
| `DELETE` | `/users/me/favorite-courses/{course_id}` | Authenticated | - | `204` |
| `GET` | `/courses/{slug}/reviews` | Public | Pagination, `rating` | `CourseReview[]` |
| `PUT` | `/courses/{course_id}/reviews/me` | Enrolled owner | `rating`, `content` | `CourseReview` |
| `DELETE` | `/courses/{course_id}/reviews/me` | Review owner | - | `204` |

Catalog chỉ trả course `PUBLISHED`. Course detail trả `viewer_state`: `GUEST`, `AVAILABLE`, `IN_CART`, `PAYMENT_PENDING`, `ENROLLED` hoặc `OWNER` để UI chọn CTA chính xác.

Catalog query contract:

| Endpoint | Filter allowlist | Sort allowlist |
| --- | --- | --- |
| `/courses` | `q`, `price_type=FREE|PAID`, `field`, `teacher_id` | `created_at`, `title`, `price_vnd`, `rating_average`, `popularity` |
| `/instructors` | `q`, `field` | `full_name`, `rating_average`, `student_count` |
| `/courses/{slug}/reviews` | `rating=1..5` | `created_at`, `rating` |

- Course detail ẩn curriculum private; preview chỉ trả content được đánh dấu preview.
- `is_favorite` là `false` cho guest và được tính theo current user khi có session.
- Review chỉ dành cho enrollment owner, một review/course; `PUT` tạo mới trả `201`, cập nhật trả `200`.
- Xóa review là soft delete; public list chỉ trả `VISIBLE`.

Lỗi riêng: `COURSE_NOT_PUBLISHED` (`404`), `COURSE_REVIEW_NOT_ALLOWED` (`403`), `REVIEW_ALREADY_DELETED` (`409`), `VALIDATION_ERROR` (`422`).

## 6. Teacher course authoring và Admin moderation

| Method | Path | Access | Request/Query | Response schema |
| --- | --- | --- | --- | --- |
| `GET` | `/teacher/dashboard` | Approved Teacher | `range` (`7d`, `30d`, `90d`, `12m`) | `TeacherDashboard` |
| `GET` | `/teacher/students` | Approved Teacher | Pagination, `q`, `course_id`, `progress_state`, sort | `TeacherStudentRow[]` |
| `GET` | `/teacher/submissions` | Approved Teacher | Pagination, `q`, `course_id`, `problem_id`, `status`, sort | `Submission[]` teacher projection |
| `GET` | `/teacher/courses` | Approved Teacher | Pagination, `status` | `TeacherCourse[]` |
| `POST` | `/teacher/courses` | Approved Teacher | `title`, `description`, `price_vnd`, metadata | Draft course |
| `GET` | `/teacher/courses/{course_id}` | Owner | - | `TeacherCourseDetail` |
| `PATCH` | `/teacher/courses/{course_id}` | Owner, editable status | Fields + `version` | Updated course |
| `POST` | `/teacher/courses/{course_id}/submit-review` | Owner, Draft/Rejected | `version` | Pending review |
| `POST` | `/teacher/courses/{course_id}/withdraw-review` | Owner, Pending | `version` | Draft course |
| `POST` | `/teacher/courses/{course_id}/archive` | Owner/Admin | `version` | Archived course |
| `POST` | `/teacher/courses/{course_id}/restore-draft` | Owner/Admin | `version` | Draft course |
| `POST` | `/teacher/courses/{course_id}/sections` | Owner | `title`, `position` | `Section` |
| `PATCH` | `/teacher/sections/{section_id}` | Owner | Fields + `version` | `Section` |
| `DELETE` | `/teacher/sections/{section_id}` | Owner | `version` | `204` |
| `POST` | `/teacher/sections/{section_id}/lessons` | Owner | `title`, `summary`, `position` | `Lesson` |
| `PATCH` | `/teacher/lessons/{lesson_id}` | Owner | Fields + `version` | `Lesson` |
| `POST` | `/teacher/lessons/{lesson_id}/contents` | Owner | Type, content payload, completion policy | `LessonContent` |
| `PATCH` | `/teacher/lesson-contents/{lesson_content_id}` | Owner | Payload/policy + `version` | `LessonContent` |
| `DELETE` | `/teacher/lesson-contents/{lesson_content_id}` | Owner, editable course | `version` | `204` |
| `PUT` | `/teacher/courses/{course_id}/curriculum-order` | Owner | Ordered tree + `version` | Curriculum tree |
| `GET` | `/admin/course-reviews` | Admin | Pagination, `status=PENDING_REVIEW` | Review queue |
| `GET` | `/admin/course-reviews/{course_id}` | Admin | - | Course snapshot + checklist/history |
| `POST` | `/admin/course-reviews/{course_id}/approve` | Admin | `reviewed_note?`, `version` | Published course |
| `POST` | `/admin/course-reviews/{course_id}/reject` | Admin | `reviewed_note`, `version` | Rejected course |
| `POST` | `/admin/course-reviews/{course_id}/request-changes` | Admin | `reviewed_note`, `version` | Rejected course + change request |

Teacher không gửi `status` tùy ý trong course update. Mọi transition dùng endpoint action riêng và service kiểm tra state hiện tại.

Authoring rules:

- Course chỉ editable khi `DRAFT` hoặc `REJECTED`; edit lần đầu ở Rejected chuyển course về Draft và giữ nguyên review history.
- Submit review cần metadata, thumbnail scan thành công, ít nhất một section/lesson/content và content policy hợp lệ.
- Curriculum reorder gửi toàn bộ cây ID/position và `version`; ID thiếu, lặp hoặc không thuộc course trả `422 CURRICULUM_INVALID`.
- Content payload là tagged union theo `content_type`: Reading dùng Markdown sanitized khi render; Video dùng upload reference; Quiz dùng quiz reference; Problem dùng problem reference.
- `pass_score` bắt buộc cho Quiz/Problem trong `0..100`; `max_attempts` là integer `1..100`. Reading/Video phải gửi hai field này là `null`.
- Xóa section/lesson/content chỉ là soft delete nếu đã có progress/submission; service giữ projection lịch sử cho learner đã enrollment.

Moderation rules:

- Queue chỉ chứa snapshot đã submit; Admin review đúng snapshot version, không đọc bản Draft đang chỉnh sửa.
- Approve yêu cầu checklist `metadata_complete`, `curriculum_complete`, `media_ready`, `assessment_valid`, `policy_passed` đều true.
- Reject và request changes đều chuyển domain status sang `REJECTED`; `decision_type` trong history phân biệt `REJECTED` và `CHANGES_REQUESTED`.
- Mỗi decision ghi notification cho Teacher và immutable audit event. Admin không trở thành owner của course.

Lỗi riêng: `COURSE_STATE_INVALID` (`409`), `COURSE_REVIEW_INCOMPLETE` (`422`), `CURRICULUM_INVALID` (`422`), `CONTENT_POLICY_INVALID` (`422`), `REJECTION_NOTE_REQUIRED` (`422`), `STALE_RESOURCE_VERSION` (`409`).

## 7. Learning, progress, Quiz và comments

| Method | Path | Access | Request/Query | Response schema |
| --- | --- | --- | --- | --- |
| `GET` | `/student/enrollments` | Authenticated | Pagination, `q` | `EnrollmentSummary[]` |
| `GET` | `/student/enrollments/{enrollment_id}` | Owner | - | Enrollment + progress summary |
| `GET` | `/student/enrollment-requests` | Authenticated | Pagination, `status` | `EnrollmentRequest[]` |
| `POST` | `/courses/{course_id}/enrollments` | Authenticated, Open course | - | Active `Enrollment` |
| `POST` | `/courses/{course_id}/enrollment-requests` | Authenticated | `message?` | Pending `EnrollmentRequest` |
| `GET` | `/teacher/courses/{course_id}/enrollment-requests` | Course owner | Pagination, `q`, `status`, sort | `EnrollmentRequest[]` |
| `POST` | `/teacher/enrollment-requests/{request_id}/approve` | Course owner | `reviewed_note?`, `version` | Approved request + enrollment |
| `POST` | `/teacher/enrollment-requests/{request_id}/reject` | Course owner | `reviewed_note?`, `version` | Rejected request |
| `GET` | `/learning/courses/{course_slug}/curriculum` | Enrolled/preview | - | Ordered curriculum + lock states |
| `GET` | `/learning/contents/{lesson_content_id}` | Enrolled/preview | - | Typed Reading/Video/Quiz/Problem payload |
| `PUT` | `/learning/contents/{lesson_content_id}/reading-progress` | Enrolled | `opened_at` | `ContentProgress` |
| `PUT` | `/learning/contents/{lesson_content_id}/video-progress` | Enrolled | `position_seconds`, `duration_seconds` | `ContentProgress` |
| `POST` | `/learning/quizzes/{quiz_id}/attempts` | Enrolled | `lesson_content_id` | `QuizAttempt` without answers |
| `GET` | `/learning/quiz-attempts/{attempt_id}` | Attempt owner | - | Attempt + questions without correct answer |
| `POST` | `/learning/quiz-attempts/{attempt_id}/submit` | Attempt owner | `answers[]` | Scored attempt + remaining attempts |
| `GET` | `/lesson-contents/{lesson_content_id}/comments` | Enrolled/Teacher owner | Pagination | `Comment[]` |
| `POST` | `/lesson-contents/{lesson_content_id}/comments` | Enrolled/Teacher owner | `content`, `parent_id?` | `Comment` |
| `DELETE` | `/comments/{comment_id}` | Comment owner/Admin | - | `204` |
| `GET` | `/teacher/courses/{course_id}/enrollments` | Course owner | Pagination, `q`, `progress_state` | Student progress rows |
| `GET` | `/teacher/courses/{course_id}/students/{student_id}/progress` | Course owner | - | Detailed progress tree |

Backend tính `watched_percent`, score, passed, attempt count và lock state. Client không được tự đánh dấu Video/Quiz/Problem completed.

Enrollment modes:

- `PURCHASE`: course trả phí; chỉ verified PayOS webhook tạo enrollment.
- `OPEN`: course miễn phí; explicit enroll mutation tạo enrollment ngay, không cần Teacher approve.
- `APPROVAL`: Student tạo `EnrollmentRequest`; Teacher approve mới tạo enrollment.
- TC05 chỉ hiển thị request của course `APPROVAL`. Teacher không thể approve payment đang Pending hoặc tự cấp quyền cho course `PURCHASE`.
- Một user có tối đa một Pending request và một active enrollment/course; approve/replay không tạo bản ghi trùng.

`enrollment_mode` và persistence cho `EnrollmentRequest` là target contract mới từ UI Phase 4; Phase 8 phải bổ sung enum/table hoặc mapping tương đương trước khi implement.

Learning completion rules:

- Reading: lần mở đầu tiên tạo progress `IN_PROGRESS`; chỉ `COMPLETED` nếu content policy `complete_on_open=true`, mặc định false.
- Video: client gửi checkpoint mỗi 10..30 giây và khi pause/end; server clamp position, tính percent và hoàn thành ở `100`.
- Quiz: create attempt atomically tăng `attempt_number`; response không chứa đáp án đúng. Submit chấm một lần và cập nhật best score.
- Problem: chỉ terminal Judge submission có score đạt `pass_score` mới cập nhật progress; client không gọi progress mutation riêng.
- `is_locked` và `remaining_attempts` là computed projection. Attempt hết nhưng chưa pass trả `ATTEMPT_LIMIT_REACHED`; ProgressStatus persisted vẫn là `IN_PROGRESS`.
- Comment reply chỉ sâu một cấp trong MVP; reply truyền `parent_id` của root comment. Delete root ẩn cả thread khỏi public projection.

Lỗi riêng: `ENROLLMENT_MODE_INVALID` (`409`), `ENROLLMENT_REQUEST_STATE_INVALID` (`409`), `COURSE_ALREADY_ENROLLED` (`409`), `CONTENT_LOCKED` (`403`), `ATTEMPT_LIMIT_REACHED` (`409`), `ATTEMPT_ALREADY_SUBMITTED` (`409`), `PROGRESS_CHECKPOINT_INVALID` (`422`).

## 8. Cart, Order và PayOS

| Method | Path | Access | Request/Query | Response schema |
| --- | --- | --- | --- | --- |
| `GET` | `/cart` | Authenticated | - | `Cart` |
| `PUT` | `/cart/items/{course_id}` | Authenticated | - | `Cart` |
| `DELETE` | `/cart/items/{course_id}` | Cart owner | - | `204` |
| `POST` | `/orders` | Authenticated | `course_id` | Pending `Order` |
| `GET` | `/orders/{order_id}` | Order owner/Admin | - | `OrderDetail` |
| `GET` | `/orders` | Authenticated | Pagination, `status` | Own orders |
| `POST` | `/orders/{order_id}/cancel` | Order owner, Pending | - | Cancelled order |
| `POST` | `/orders/{order_id}/checkout/payos` | Order owner | `return_url`, `cancel_url` | `PaymentCheckout` |
| `GET` | `/orders/{order_id}/payment-result` | Order owner | - | `PaymentResult` |
| `GET` | `/orders/{order_id}/events` | Order owner | `Last-Event-ID?` | SSE payment state stream |
| `POST` | `/payments/payos/webhook` | Webhook | Raw signed PayOS payload | Acknowledgement |

Một order có đúng một order item/course trong MVP. Create order chặn course đã enrolled; webhook hợp lệ cập nhật transaction/order, tạo Enrollment và ledger đúng một lần.

Canonical order lifecycle là `PENDING -> PAID -> COMPLETED`, hoặc từ Pending sang `FAILED|EXPIRED|CANCELLED`; refund hợp lệ chuyển `COMPLETED -> REFUNDED`. `PAID` là payment đã xác minh nhưng fulfillment transaction chưa commit; UI thường chỉ thấy Pending hoặc terminal state.

`OrderStatus` target phải có `PENDING`, `PAID`, `COMPLETED`, `FAILED`, `EXPIRED`, `CANCELLED`, `REFUNDED`. `DATABASE.txt` hiện thiếu `COMPLETED` và `REFUNDED`; Phase 8 phải migration trước khi backend dùng contract này.

PayOS adapter rules:

- API tạo checkout khóa `amount`, description và provider `orderCode` từ Order; không tin amount do browser gửi.
- `return_url`/`cancel_url` phải thuộc origin allowlist. Backend gửi PayOS `orderCode`, `amount`, `description`, `returnUrl`, `cancelUrl`, `expiredAt` và signature theo SDK/tài liệu provider.
- `PaymentCheckout` trả `order_id`, `payment_status`, `checkout_url`, chuỗi VietQR `qr_code`, `expires_at`; không trả API key, checksum key, account number hoặc provider signature.
- Webhook nhận body provider gồm `code`, `desc`, `success`, `data`, `signature`. Verify HMAC-SHA256 trên `data` bằng checksum key trước mọi lookup/mutation.
- Sau verify, đối chiếu `orderCode`, `amount`, `currency=VND`, payment link và reference. Sai chữ ký trả `401`; dữ liệu đúng chữ ký nhưng mismatch trả `409` và audit security event.
- Success webhook chạy một database transaction: lock Order/Transaction, dedupe `(orderCode, reference)`, mark paid, tạo Enrollment, ghi Teacher 80% và Platform 20% ledger, mark Completed, tạo notification/audit.
- Webhook replay hợp lệ luôn trả `200 {"success": true}` mà không lặp side effect. Webhook endpoint không dùng success/error envelope nội bộ.
- Payment result polling là nguồn fallback. SSE event types: `payment.pending`, `payment.completed`, `payment.failed`, `payment.expired`; event chỉ chứa Order projection, không chứa raw webhook.

Nguồn provider được xác minh ngày `2026-08-10`: `https://payos.vn/docs/api/` và `https://payos.vn/docs/tich-hop-webhook/kiem-tra-du-lieu-voi-signature/`.

Lỗi riêng: `COURSE_ALREADY_ENROLLED` (`409`), `COURSE_NOT_PURCHASABLE` (`409`), `ORDER_STATE_INVALID` (`409`), `PAYMENT_PROVIDER_UNAVAILABLE` (`503`), `PAYMENT_SIGNATURE_INVALID` (`401`), `PAYMENT_AMOUNT_MISMATCH` (`409`), `PAYMENT_EXPIRED` (`410`).

## 9. Teacher wallet và payout

| Method | Path | Access | Request/Query | Response schema |
| --- | --- | --- | --- | --- |
| `GET` | `/teacher/wallet` | Approved Teacher | - | Balance summary |
| `GET` | `/teacher/wallet/ledger` | Approved Teacher | Pagination, `entry_type` | Immutable ledger rows |
| `GET` | `/teacher/payout-requests` | Approved Teacher | Pagination, `status` | Own payout requests |
| `POST` | `/teacher/payout-requests` | Approved Teacher | Amount + bank snapshot | Pending payout |
| `GET` | `/admin/payout-requests` | Admin | Pagination, `status` | Payout review queue |
| `GET` | `/admin/payout-requests/{payout_id}` | Admin | - | Request + wallet evidence |
| `POST` | `/admin/payout-requests/{payout_id}/approve` | Admin | `reviewed_note?`, `version` | Approved payout |
| `POST` | `/admin/payout-requests/{payout_id}/reject` | Admin | `reviewed_note`, `version` | Rejected payout |

Amount tối thiểu `1000` VND và không vượt available balance. Worker chuyển `APPROVED -> PROCESSING -> COMPLETED|FAILED`; `FAILED` release reserve bằng ledger bù trừ mới.

Wallet/payout rules:

- Ledger immutable; API không update/delete ledger row. `amount_vnd` dương cho credit, âm cho debit/refund theo `entry_type`.
- Create payout snapshot `bank_account_name`, `bank_account_number`, `bank_name`; response và log chỉ trả số tài khoản masked.
- Request và reserve balance nằm cùng transaction. Admin approve/reject chỉ từ Pending và dùng `version`; reject bắt buộc note.
- Settlement worker dùng provider idempotency key bằng payout ID. Failed settlement tạo compensating ledger, không sửa row debit cũ.
- Teacher chỉ xem wallet của mình; Admin detail cần permission tài chính và mọi access được audit.

Lỗi riêng: `PAYOUT_MINIMUM_NOT_MET` (`422`), `INSUFFICIENT_AVAILABLE_BALANCE` (`409`), `PAYOUT_STATE_INVALID` (`409`), `BANK_ACCOUNT_INVALID` (`422`), `SETTLEMENT_PROVIDER_UNAVAILABLE` (`503`).

## 10. Online Judge

| Method | Path | Access | Request/Query | Response schema |
| --- | --- | --- | --- | --- |
| `GET` | `/problems` | Public | Pagination, `q`, `difficulty`, `tag` | `ProblemCard[]` |
| `GET` | `/problems/{slug}` | Public | - | Public problem detail + samples |
| `POST` | `/problems/{slug}/runs` | Authenticated | Source, language, custom stdin | `202 RunJob` |
| `GET` | `/runs/{run_id}` | Run owner | - | `RunResult` |
| `GET` | `/runs/{run_id}/events` | Run owner | `Last-Event-ID?` | SSE run status stream |
| `POST` | `/problems/{slug}/submissions` | Authenticated | Source, language, `lesson_content_id?` | Pending `Submission` |
| `GET` | `/submissions` | Authenticated | Pagination, own filters | Own submissions |
| `GET` | `/submissions/{submission_id}` | Owner/Teacher owner/Admin | - | Submission result projection |
| `GET` | `/submissions/{submission_id}/events` | Owner/Teacher owner/Admin | - | SSE status stream |
| `GET` | `/languages` | Public | - | Enabled languages/config |
| `GET` | `/teacher/problems` | Approved Teacher | Pagination, filters | Owned problems |
| `POST` | `/teacher/problems` | Approved Teacher | Problem metadata | Draft problem |
| `PATCH` | `/teacher/problems/{problem_id}` | Owner | Fields + `version` | Updated problem |
| `POST` | `/teacher/problems/{problem_id}/publish` | Owner | `version` | Public problem |
| `POST` | `/teacher/problems/{problem_id}/unpublish` | Owner | `version` | Private problem |
| `PUT` | `/teacher/problems/{problem_id}/testcases` | Owner | Testcase metadata/references | Testcase summary |

Student không nhận hidden input/output/expected output. Submission status dùng enum trong `DATABASE.txt`; worker retry không tạo submission mới.

Judge request rules:

- `source_code` UTF-8 tối đa 128 KiB; `language_id` phải enabled cho problem. Custom stdin tối đa 64 KiB và không được persist quá TTL của Run.
- Run dùng sample/custom input, không cập nhật progress hoặc leaderboard. Submit chạy toàn bộ testcase và có `Idempotency-Key` bắt buộc.
- `lesson_content_id` nếu có phải reference đúng Problem và enrollment owner; Accepted/score đạt policy mới cập nhật Learning progress.
- Teacher testcase contract chỉ nhận upload reference đã scan, `score`, `is_hidden`, position và per-language limits; tổng score phải bằng 100.
- Publish yêu cầu statement, ít nhất một language config, sample và testcase hợp lệ. UI `Active` ánh xạ `visibility=PUBLIC`; `Draft` ánh xạ `PRIVATE`.

Judge SSE contract:

```text
id: 4
event: submission.testcase
data: {"submission_id":"6101","status":"RUNNING","completed_testcases":4,"total_testcases":12}

```

- Event types: `submission.queued`, `submission.running`, `submission.testcase`, `submission.completed`, `submission.failed`; Run dùng prefix `run.*`.
- Event `id` tăng đơn điệu theo resource. Reconnect gửi `Last-Event-ID`; server replay từ event store hoặc trả current snapshot nếu history hết TTL.
- Heartbeat comment `: keep-alive` mỗi 15 giây. Terminal event chứa projection như `GET /submissions/{id}` rồi server đóng stream.
- Testcase visible trả index/status/runtime/memory/output preview đã truncate. Hidden testcase chỉ trả index/status/runtime/memory và `is_hidden=true`.
- Worker callback là service-to-service signed request, không public trong browser contract; retry chỉ cập nhật submission hiện tại.

Lỗi riêng: `LANGUAGE_NOT_ENABLED` (`422`), `SOURCE_TOO_LARGE` (`413`), `TESTCASE_CONFIG_INVALID` (`422`), `SUBMISSION_STATE_INVALID` (`409`), `JUDGE_QUEUE_FULL` (`429`), `JUDGE_UNAVAILABLE` (`503`).

## 11. AI Interview

| Method | Path | Access | Request/Query | Response schema |
| --- | --- | --- | --- | --- |
| `GET` | `/interview-sessions` | Authenticated | Pagination, own sessions | `InterviewSession[]` |
| `POST` | `/interview-sessions` | Authenticated | `topic`, `level` | Active session + first question |
| `GET` | `/interview-sessions/{session_id}` | Session owner/Admin audit | - | Session + transcript |
| `POST` | `/interview-sessions/{session_id}/answers` | Session owner, Active | `message`, `question_index` | `202` answer turn job |
| `GET` | `/interview-sessions/{session_id}/events` | Session owner | `Last-Event-ID?` | SSE question/report stream |
| `POST` | `/interview-sessions/{session_id}/finish` | Session owner, Active | `reason` | Report-generating session |
| `POST` | `/interview-sessions/{session_id}/abort` | Session owner, Active | - | Aborted session |
| `GET` | `/interview-sessions/{session_id}/report` | Session owner/Admin audit | - | `202` generating or final report |

Session tối đa 12 câu và có thể kết thúc sớm. API chỉ nhận/lưu text đã chuẩn hóa; camera/microphone là browser permission, không upload recording. Một session có tối đa một report.

Interview rules:

- Create nhận `topic` dài `3..200`, `level=INTERN|FRESHER|JUNIOR|SENIOR`, optional `focus_skills[]` tối đa 8. Mỗi user chỉ có một Active session.
- First question được lưu trước khi trả `201`. Nếu provider timeout, session chuyển Failed và trả `502 AI_PROVIDER_UNAVAILABLE`, không tạo session Active mồ côi.
- Answer dài `1..5000`; `question_index` phải bằng câu AI đang chờ. Endpoint lưu Student message rồi enqueue AI turn, không giữ HTTP connection chờ model.
- AI turn có thể phát câu tiếp theo hoặc `early_finish`; service không vượt `max_questions=12`. Mọi prompt/tool output được xử lý server-side, không gửi provider key hoặc system prompt cho client.
- Finish dùng `Idempotency-Key`, chuyển Active sang ReportGenerating và enqueue đúng một report. Abort chỉ dùng khi bỏ session và không tạo report.
- Pause/resume microphone/camera là local UI state; không có media upload và không thay đổi InterviewStatus.
- Report trả `202` với `retry_after_seconds` khi ReportGenerating, `200 InterviewReport` khi Completed, và domain error khi Failed.

Interview SSE event types: `interview.answer.accepted`, `interview.question.ready`, `interview.early-finish`, `interview.report.generating`, `interview.report.ready`, `interview.failed`. Event có `id`, `session_id`, `status`, `question_count`; chỉ question-ready chứa text câu hỏi. Resume/heartbeat theo quy ước Judge SSE.

Lỗi riêng: `INTERVIEW_ALREADY_ACTIVE` (`409`), `INTERVIEW_NOT_ACTIVE` (`409`), `QUESTION_INDEX_MISMATCH` (`409`), `QUESTION_LIMIT_REACHED` (`409`), `REPORT_NOT_READY` (`425`), `AI_PROVIDER_UNAVAILABLE` (`503`), `AI_RESPONSE_INVALID` (`502`).

## 12. Notification, audit và upload

| Method | Path | Access | Request/Query | Response schema |
| --- | --- | --- | --- | --- |
| `GET` | `/notifications` | Authenticated | Pagination, `is_read`, `type` | Own notifications |
| `PUT` | `/notifications/{notification_id}/read` | Notification owner | - | `204` |
| `PUT` | `/notifications/read-all` | Authenticated | - | `204` |
| `GET` | `/notification-events` | Authenticated | - | SSE own notification stream |
| `GET` | `/admin/audit-logs` | Admin | Pagination, actor/target/action filters | Audit rows |
| `POST` | `/uploads/presign` | Authenticated | Purpose, MIME, size, filename | Presigned upload |
| `POST` | `/uploads/{upload_id}/parts/presign` | Upload owner | `part_numbers[]` | Multipart part URLs |
| `POST` | `/uploads/{upload_id}/complete` | Upload owner | Object metadata | Scan-pending file reference |
| `GET` | `/uploads/{upload_id}` | Owner/authorized reviewer | - | Scan/OCR status + signed URL when allowed |
| `DELETE` | `/uploads/{upload_id}` | Upload owner, incomplete | - | `204` abort |

Private upload purposes gồm `CCCD_FRONT`, `CCCD_BACK`, `TEACHER_CV`, `TESTCASE`; public-after-scan purposes gồm `AVATAR`, `COURSE_THUMBNAIL`, `LESSON_VIDEO`. OCR chỉ cung cấp confidence/quality flags cho Admin, không tự approve hồ sơ.

Upload contract:

- Presign request: `purpose`, sanitized `filename`, declared `content_type`, `size_bytes`, `sha256`. Server tạo object key; client không chọn bucket/key.
- Response chọn `strategy=SINGLE|MULTIPART`, trả `upload_id`, HTTP method/URL/headers hoặc multipart `provider_upload_id`, `part_size_bytes`, `expires_at`.
- Multipart dùng part 5 MiB..100 MiB, tối đa 10,000 parts. Complete gửi ordered `parts[{part_number,etag}]`, final `size_bytes`, `sha256`.
- Upload URL TTL tối đa 15 phút; download URL private TTL tối đa 5 phút. URL không được persist trong profile/course, chỉ persist `upload_id`/object key.
- Complete kiểm tra object existence/size/checksum rồi chuyển `SCAN_PENDING`; worker kiểm MIME magic bytes, malware và OCR nếu cần. Chỉ `READY` mới được gắn vào resource public hoặc submit review.

| Purpose | MIME allowlist | Max size | Visibility after Ready |
| --- | --- | --- | --- |
| `AVATAR` | JPEG, PNG, WebP | 5 MiB | Public |
| `COURSE_THUMBNAIL` | JPEG, PNG, WebP | 10 MiB | Public |
| `LESSON_VIDEO` | MP4, WebM | 2 GiB | Enrollment/signed delivery |
| `CCCD_FRONT`, `CCCD_BACK` | JPEG, PNG | 10 MiB/file | Private reviewer only |
| `TEACHER_CV` | PDF | 20 MiB | Private reviewer only |
| `TESTCASE` | ZIP | 100 MiB | Private Teacher/Judge worker |

Upload status: `INITIATED -> UPLOADING -> SCAN_PENDING -> READY|REJECTED`; incomplete upload có thể sang `ABORTED`. Đây là target persistence cần bổ sung ở Phase 8.

Notification/audit rules:

- Notification list filter `is_read`, `type`; sort allowlist `created_at`; read/read-all idempotent.
- Notification SSE event `notification.created` chứa cùng projection như list. Không gửi raw CCCD, bank account, source code hoặc moderation private note ngoài audience được phép.
- Audit filter allowlist: `actor_user_id`, `action`, `target_type`, `target_id`, `created_from`, `created_to`; sort chỉ `created_at`.
- Audit append-only. Note được redact secret/token/CCCD/bank/source; export hoặc delete audit không thuộc MVP API.

Lỗi riêng: `UPLOAD_PURPOSE_INVALID` (`422`), `FILE_TYPE_NOT_ALLOWED` (`415`), `FILE_TOO_LARGE` (`413`), `UPLOAD_EXPIRED` (`410`), `UPLOAD_PART_INVALID` (`422`), `FILE_SCAN_PENDING` (`409`), `FILE_REJECTED` (`422`).

## 13. Canonical schema registry

### 13.1. Enum public

| Enum | Values |
| --- | --- |
| `AccountStatus` | `ACTIVE`, `BANNED` |
| `TeacherApplicationStatus` | `DRAFT`, `PENDING`, `APPROVED`, `REJECTED` |
| `CourseStatus` | `DRAFT`, `PENDING_REVIEW`, `PUBLISHED`, `REJECTED`, `ARCHIVED` |
| `EnrollmentMode` | `PURCHASE`, `OPEN`, `APPROVAL` |
| `EnrollmentRequestStatus` | `PENDING`, `APPROVED`, `REJECTED` |
| `LessonContentType` | `READING`, `VIDEO`, `QUIZ`, `PROBLEM` |
| `ProgressStatus` | `NOT_STARTED`, `IN_PROGRESS`, `COMPLETED` |
| `ProblemSubmissionStatus` | `PENDING`, `RUNNING`, `ACCEPTED`, `WRONG_ANSWER`, `TIME_LIMIT_EXCEEDED`, `MEMORY_LIMIT_EXCEEDED`, `RUNTIME_ERROR`, `COMPILE_ERROR` |
| `OrderStatus` | `PENDING`, `PAID`, `COMPLETED`, `FAILED`, `EXPIRED`, `CANCELLED`, `REFUNDED` |
| `PaymentStatus` | `PENDING`, `COMPLETED`, `FAILED`, `EXPIRED`, `REFUNDED` |
| `PayoutStatus` | `PENDING`, `APPROVED`, `PROCESSING`, `REJECTED`, `COMPLETED`, `FAILED` |
| `InterviewStatus` | `ACTIVE`, `REPORT_GENERATING`, `COMPLETED`, `ABORTED`, `FAILED` |
| `UploadStatus` | `INITIATED`, `UPLOADING`, `SCAN_PENDING`, `READY`, `REJECTED`, `ABORTED` |

### 13.2. Resource fields

Field không ghi `optional` là required trong response. Create/update request chỉ nhận field đã liệt kê ở endpoint; server-managed field bị gửi lên trả `422`.

| Schema | Required fields và constraints chính |
| --- | --- |
| `CurrentUser` | `id`, `email`, `full_name`, `account_status`, `roles[]`, `permissions[]`, `student_profile?`, `teacher_profile?`, `teacher_application_status?` |
| `CourseCard` | `id`, `slug`, `title`, `thumbnail_url?`, `instructor`, `price_vnd>=0`, `average_rating`, `review_count`, `is_favorite`, `viewer_state`, `enrollment_mode` |
| `CourseDetail` | CourseCard + `description`, `field?`, `status`, `sections[]`, `progress_percent?`, `version` |
| `TeacherDashboard` | `summary`, `revenue_series[]`, `course_performance[]`, `recent_students[]`, `range` |
| `TeacherApplication` | `id`, `user_id`, `status`, `motivation`, upload IDs, `cccd_masked`, reviewer fields nullable, timestamps, `version` |
| `TeacherCourseDetail` | CourseDetail + authoring metadata, full curriculum, `review_checklist`, `latest_review?`, `history[]` |
| `Enrollment` | `id`, `student_id`, `course`, `status`, `source`, `enrolled_at`, `completed_at?`, `progress_percent` |
| `EnrollmentRequest` | `id`, `student`, `course`, `message?`, `status`, reviewer fields nullable, timestamps, `version` |
| `LessonContent` | `id`, `lesson_id`, `content_type`, `position`, typed `content`, `pass_score?`, `max_attempts?`, `progress?`, `is_locked`, `version` |
| `ContentProgress` | `lesson_content_id`, `status`, `watched_percent`, `best_score?`, `attempt_count`, `remaining_attempts?`, `completed_at?`, `updated_at` |
| `QuizAttempt` | `id`, `quiz_id`, `attempt_number`, `max_attempts`, `status`, `pass_score`, `questions[]`, score/result fields nullable, timestamps |
| `OrderDetail` | `id`, `status`, `student_id`, `item`, `total_amount_vnd`, `payment?`, `enrollment_id?`, timestamps, `version` |
| `PaymentCheckout` | `order_id`, `payment_status`, `checkout_url`, `qr_code`, `expires_at` |
| `PaymentResult` | `order_id`, `order_status`, `payment_status`, `amount_vnd`, `enrollment_id?`, `failure_reason?`, timestamps |
| `WalletSummary` | `currency=VND`, balances VND, `lifetime_revenue_vnd`, share percents |
| `PayoutRequest` | `id`, `amount_vnd`, masked bank snapshot, `status`, reviewer fields nullable, timestamps, `version` |
| `RunJob` | `id`, `problem_id`, `status`, `language`, `created_at`, `expires_at` |
| `Submission` | `id`, `problem_id`, `language`, `status`, `score`, `runtime_ms`, `memory_kb`, `visible_testcase_results[]`, `submitted_at` |
| `InterviewSession` | `id`, `topic`, `level`, `status`, `question_count`, `max_questions`, `messages[]`, timestamps |
| `InterviewReport` | `session_id`, `status`, `overall_score`, `skill_scores`, `strengths`, `weaknesses`, `suggestions`, `generated_at` |
| `Upload` | `id`, `purpose`, `status`, `filename`, `content_type`, `size_bytes`, `sha256`, `download_url?`, scan/OCR fields, timestamps |
| `DocumentAnalysis` | `status`, `ocr_text_masked`, `cccd_last_four`, quality scores, `warnings[]`, `provider`, `completed_at?` |

### 13.3. Typed lesson content

| `content_type` | `content` shape | Completion policy |
| --- | --- | --- |
| `READING` | `title`, `markdown`, `estimated_minutes?`, `complete_on_open` | Optional complete-on-open |
| `VIDEO` | `title`, `upload_id`, `playback_url?`, `duration_seconds` | Server-computed 100% watched |
| `QUIZ` | `quiz_id`, `title`, question summary | `pass_score`, `max_attempts` required |
| `PROBLEM` | `problem_id`, `slug`, `title`, difficulty/language summary | `pass_score`, `max_attempts` required |

### 13.4. Canonical mutation examples: authoring, learning và payment

Create Quiz lesson content:

```json
{
  "content_type": "QUIZ",
  "position": 3,
  "content": { "quiz_id": "5101" },
  "pass_score": 70,
  "max_attempts": 3
}
```

Submit quiz attempt:

```json
{
  "answers": [
    { "question_id": "5201", "option_ids": ["5302"] },
    { "question_id": "5202", "option_ids": ["5311", "5313"] }
  ]
}
```

Create order and PayOS checkout:

```http
POST /api/v1/orders
Idempotency-Key: 01J5ORDERD7A4QW3M6V8N9K2T1
Content-Type: application/json

{"course_id":"2001"}
```

```http
POST /api/v1/orders/7001/checkout/payos
Idempotency-Key: 01J5PAYLINK5W6H8M2S9Q4K7C3
Content-Type: application/json

{"return_url":"https://app.example.com/checkout/7001/result","cancel_url":"https://app.example.com/checkout/7001"}
```

`PaymentCheckout` success example:

```json
{
  "data": {
    "order_id": "7001",
    "payment_status": "PENDING",
    "checkout_url": "https://pay.payos.vn/web/example",
    "qr_code": "000201010212...",
    "expires_at": "2026-08-10T09:30:00Z"
  },
  "meta": { "request_id": "req_01J5PAY" }
}
```

Admin course request changes:

```json
{
  "reviewed_note": "Video bài 3 không phát được; vui lòng tải lại trước khi resubmit.",
  "version": 7
}
```

### 13.5. Canonical mutation examples: Judge, Interview, upload và webhook

Submit Judge:

```http
POST /api/v1/problems/two-sum/submissions
Idempotency-Key: 01J5SUBMIT9S2K4M7R8T6V3N1
Content-Type: application/json

{"source_code":"print('hello')","language_id":"61","lesson_content_id":"3204"}
```

Submit Interview answer:

```json
{
  "message": "Idempotency bảo đảm retry không tạo thêm side effect.",
  "question_index": 4
}
```

Presign upload:

```json
{
  "purpose": "TEACHER_CV",
  "filename": "cv.pdf",
  "content_type": "application/pdf",
  "size_bytes": 481920,
  "sha256": "0cc175b9c0f1b6a831c399e269772661"
}
```

Complete single-part upload:

```json
{
  "etag": "8f14e45fceea167a5a36dedd4bea2543",
  "size_bytes": 481920,
  "sha256": "0cc175b9c0f1b6a831c399e269772661"
}
```

PayOS raw webhook shape (provider casing được giữ nguyên ở boundary):

```json
{
  "code": "00",
  "desc": "success",
  "success": true,
  "data": {
    "orderCode": 7001,
    "amount": 499000,
    "reference": "TF230204212323",
    "currency": "VND",
    "paymentLinkId": "payos-link-id",
    "code": "00",
    "desc": "Thành công"
  },
  "signature": "hmac-sha256-hex"
}
```

### 13.6. Response example index

Response example chi tiết dùng chung với FE mock nằm trong `docs/specs/mock-payload-catalogue.md`; bảng dưới là mapping bắt buộc để tránh hai shape cạnh tranh.

| Domain/schema | Canonical example |
| --- | --- |
| `CurrentUser` | Catalogue 3.1 |
| `CourseCard[]`, `CourseDetail`, curriculum | Catalogue 3.2, 3.3 |
| `TeacherApplication`, `DocumentAnalysis` | Catalogue 3.4 |
| `QuizAttempt` | Catalogue 3.5 |
| `ProblemDetail`, `Submission` | Catalogue 3.6 |
| `OrderDetail`, `PaymentResult` | Catalogue 3.7 |
| `TeacherCourseDetail` moderation projection | Catalogue 3.8 |
| `WalletSummary`, `PayoutRequest` | Catalogue 3.9 |
| `InterviewSession`, `InterviewReport` | Catalogue 3.10 |
| `TeacherDashboard`, student progress | Catalogue 3.11 |
| Error envelope | Catalogue 4 |

## 14. Authorization và state transition contract

### 14.1. Access vocabulary

| Label trong endpoint table | Enforcement bắt buộc |
| --- | --- |
| `Public` | Không cần session; vẫn rate limit và chỉ public projection |
| `Authenticated` | Access cookie hợp lệ, account Active |
| `Student` | Authenticated + Student role; Teacher/Admin có thể đồng thời có Student role |
| `Approved Teacher` | Teacher role + `teacher_profile.application_status=APPROVED` |
| `Admin` | Admin role; access vẫn audit và không bypass data redaction |
| `Owner` | `resource.user_id` bằng current user hoặc mapping owner tương ứng |
| `Course owner` | Course teacher ID bằng current user Approved Teacher |
| `Enrolled` | Active enrollment của current user cho course chứa resource |
| `Preview` | Resource được đánh dấu preview/public; không suy ra từ URL |
| `Webhook` | Không JWT; provider signature + replay/mismatch checks |
| `Service` | Service credential/mTLS nội bộ, không chấp nhận browser cookie |

Nếu policy không cho tiết lộ resource tồn tại, ownership/enrollment failure trả `404 RESOURCE_NOT_FOUND`; nếu resource đã lộ hợp lệ nhưng action bị cấm, trả `403 RESOURCE_FORBIDDEN`.

### 14.2. Ownership map

| Resource | Owner derivation | Reviewer/auditor access |
| --- | --- | --- |
| Teacher application | `user_id` | Admin pending/history review |
| Course/section/lesson/content | `course.teacher_id` | Admin submitted snapshot only |
| Enrollment/request/progress | `student_id`; Teacher chỉ khi owns course | Admin audit theo permission |
| Quiz attempt/comment/review | `student_id`/`user_id` | Course owner projection; Admin moderation |
| Problem/testcase | `problem.teacher_id` | Admin; public projection excludes testcases |
| Run/submission | `student_id` | Problem/course owner projection; Admin audit |
| Order/payment/cart | `user_id` | Finance Admin projection |
| Wallet/payout | `teacher_id` | Finance Admin projection |
| Interview session/report | `student_id` | Admin audit, transcript access logged |
| Upload | `created_by`; audience theo purpose/resource link | Authorized reviewer with short signed URL |
| Notification | `user_id` | Không có cross-user read |

### 14.3. Transition matrix

| Aggregate | From | Action/actor | To |
| --- | --- | --- | --- |
| Teacher application | Draft/Rejected | edit, owner | Draft |
| Teacher application | Draft | submit, owner | Pending |
| Teacher application | Pending | approve/reject, Admin | Approved/Rejected |
| Course | Draft/Rejected | edit, owner | Draft |
| Course | Draft | submit review, owner | PendingReview |
| Course | PendingReview | withdraw, owner | Draft |
| Course | PendingReview | approve/reject/request changes, Admin | Published/Rejected |
| Course | Published | archive, owner/Admin | Archived |
| Course | Archived | restore, owner/Admin | Draft |
| Enrollment request | Pending | approve/reject, course owner | Approved/Rejected |
| Order | Pending | verified payment webhook | Paid |
| Order | Paid | atomic enrollment + ledger fulfillment | Completed |
| Order | Pending | cancel/expiry/failure | Cancelled/Expired/Failed |
| Order | Completed | authorized refund | Refunded |
| Progress | NotStarted | open/checkpoint/attempt | InProgress |
| Progress | InProgress | completion policy satisfied | Completed |
| Submission | Pending | worker starts | Running |
| Submission | Running | Judge terminal result | Accepted/error terminal |
| Interview | Active | finish/early finish/question 12 | ReportGenerating |
| Interview | Active | abort/provider terminal failure | Aborted/Failed |
| Interview | ReportGenerating | report worker result | Completed/Failed |
| Payout | Pending | approve/reject, Admin | Approved/Rejected |
| Payout | Approved | settlement worker | Processing |
| Payout | Processing | provider result | Completed/Failed |

Transition không có trong bảng bị từ chối bằng domain `*_STATE_INVALID`; client không PATCH status trực tiếp.

## 15. Error code catalogue

| Domain | Codes |
| --- | --- |
| Auth | `AUTH_REQUIRED`, `INVALID_CREDENTIALS`, `ACCOUNT_NOT_ACTIVE`, `ACCOUNT_BANNED`, `OTP_INVALID`, `OTP_EXPIRED`, `TOKEN_EXPIRED`, `EMAIL_ALREADY_EXISTS` |
| Permission | `ROLE_REQUIRED`, `RESOURCE_FORBIDDEN`, `RESOURCE_NOT_FOUND` |
| Teacher/application | `APPLICATION_ALREADY_EXISTS`, `APPLICATION_STATE_INVALID`, `DOCUMENTS_INCOMPLETE`, `REJECTION_NOTE_REQUIRED` |
| Course authoring/review | `COURSE_STATE_INVALID`, `COURSE_REVIEW_INCOMPLETE`, `CURRICULUM_INVALID`, `CONTENT_POLICY_INVALID` |
| Enrollment/learning | `ENROLLMENT_MODE_INVALID`, `ENROLLMENT_REQUEST_STATE_INVALID`, `COURSE_ALREADY_ENROLLED`, `CONTENT_LOCKED`, `ATTEMPT_LIMIT_REACHED`, `ATTEMPT_ALREADY_SUBMITTED`, `PROGRESS_CHECKPOINT_INVALID` |
| Commerce | `COURSE_NOT_PURCHASABLE`, `ORDER_STATE_INVALID`, `PAYMENT_PROVIDER_UNAVAILABLE`, `PAYMENT_SIGNATURE_INVALID`, `PAYMENT_AMOUNT_MISMATCH`, `PAYMENT_EXPIRED` |
| Judge | `LANGUAGE_NOT_ENABLED`, `SOURCE_TOO_LARGE`, `TESTCASE_CONFIG_INVALID`, `SUBMISSION_STATE_INVALID`, `JUDGE_QUEUE_FULL`, `JUDGE_UNAVAILABLE` |
| Interview | `INTERVIEW_ALREADY_ACTIVE`, `INTERVIEW_NOT_ACTIVE`, `QUESTION_INDEX_MISMATCH`, `QUESTION_LIMIT_REACHED`, `REPORT_NOT_READY`, `AI_PROVIDER_UNAVAILABLE`, `AI_RESPONSE_INVALID` |
| Wallet | `PAYOUT_MINIMUM_NOT_MET`, `INSUFFICIENT_AVAILABLE_BALANCE`, `PAYOUT_STATE_INVALID`, `BANK_ACCOUNT_INVALID`, `SETTLEMENT_PROVIDER_UNAVAILABLE` |
| Upload | `UPLOAD_PURPOSE_INVALID`, `FILE_TYPE_NOT_ALLOWED`, `FILE_TOO_LARGE`, `UPLOAD_EXPIRED`, `UPLOAD_PART_INVALID`, `FILE_SCAN_PENDING`, `FILE_REJECTED` |
| Cross-cutting | `VALIDATION_ERROR`, `RATE_LIMITED`, `IDEMPOTENCY_CONFLICT`, `STALE_RESOURCE_VERSION`, `INTERNAL_ERROR` |

Error retry rules:

- Client có thể retry `429`, `502`, `503` theo `Retry-After`/exponential backoff nếu operation idempotent.
- Client không tự retry `401`, `403`, `404`, `409`, `410`, `413`, `415`, `422`, `425` nếu không có user/state change.
- `details[]` dùng `field`, `reason`, optional `value`; không chứa SQL, stack trace, provider secret hoặc raw private data.
- Unknown internal exception luôn map `500 INTERNAL_ERROR` với request ID; log server giữ trace tương ứng.

## 16. Operation completeness và example coverage

Tài liệu có `135` operations. Mỗi row endpoint kế thừa success status tại 2.2, access errors tại 14.1, domain errors ngay dưới section, và response example tại 13.6. Khi chuyển sang OpenAPI, không operation nào được bỏ các thành phần sau:

1. Stable `operationId` theo mẫu `{domain}_{verb}_{resource}`.
2. Tag, summary, security scheme, role và ownership description.
3. Path/query/header parameters với type, constraint và default.
4. Request body schema/example hoặc khai báo rõ không có body.
5. Success response schema/example và mọi error envelope có thể xảy ra.
6. `Idempotency-Key`, SSE hoặc concurrency metadata khi section yêu cầu.

| Domain | Operations | Success examples |
| --- | ---: | --- |
| Auth Provider | 13 | Auth UI fixtures + response/error envelope |
| Identity/Teacher approval | 14 | Catalogue 3.1, 3.4 |
| Catalog/instructor/review | 10 | Catalogue 3.2, 3.3 |
| Teacher authoring/Admin course review | 25 | Catalogue 3.8, 3.11 |
| Learning/Quiz/comment/enrollment | 20 | Catalogue 3.3, 3.5, 3.11 |
| Cart/Order/PayOS | 11 | Catalogue 3.7 |
| Wallet/payout | 8 | Catalogue 3.9 |
| Online Judge | 16 | Catalogue 3.6 |
| AI Interview | 8 | Catalogue 3.10 |
| Notification/audit/upload | 10 | Catalogue 3.4 + canonical examples 13.5 |

## 17. Contract verification và freeze gate

Khi backend được implement:

1. Pydantic request/response model phải sinh OpenAPI tương ứng tài liệu này.
2. Export Business Application OpenAPI thành `docs/specs/api.json` và Auth Provider thành `docs/specs/auth-provider.json`.
3. Contract tests kiểm tra status code, response envelope, error code và authorization cho từng endpoint.
4. Payment webhook, enrollment, quiz attempt, Judge submission, interview finish và payout phải có test idempotency/state transition.
5. FE mock payload phải validate được với cùng generated TypeScript schema/OpenAPI type.

Phase 7 acceptance commands/artifacts:

- Markdown structure check: balanced code fences, unique numbered headings và không whitespace error.
- `docs/specs/api.json` + `docs/specs/auth-provider.json` phải lint pass trước khi đánh dấu P7-T02 Done.
- Generated TypeScript client phải typecheck và thay được ít nhất một mock adapter slice trước khi đánh dấu P7-T10 Done.
- FE/BE review phải xác nhận các target migration gap: EnrollmentMode/EnrollmentRequest, OrderStatus Completed/Refunded và Upload lifecycle.
- Chỉ sau các bước trên mới đổi Stability ở mục 1 thành `FROZEN` và đánh dấu P7-T11 Done.

Các endpoint trong tài liệu là Phase 7 candidate. Thay đổi path, enum hoặc response shape phải có decision-log entry, tăng contract version và cập nhật mock catalogue trước khi implement.
