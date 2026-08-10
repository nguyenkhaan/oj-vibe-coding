# LMS Coding Platform API Contract

## 1. Phạm vi và trạng thái

Tài liệu này là contract mục tiêu giữa Frontend, Auth Provider và Business Application. Nó phục vụ FE mock-first và là đầu vào để sinh Pydantic schema/OpenAPI trong các phase backend; không mô tả rằng toàn bộ endpoint đã được implement.

Nguồn ưu tiên:

1. `docs/prd-documents/prd.md`.
2. `docs/prd-documents/phase0-specification-baseline.md`.
3. `docs/DATABASE.txt`.
4. Wireframe trong `docs/ui`.

Base URL:

- Auth Provider: `http://localhost:4001/auth`.
- Business Application: `http://localhost:4000/api/v1`.
- JSON dùng `snake_case`; route API dùng danh từ số nhiều và `kebab-case`.

## 2. Quy ước chung

### 2.1. Authentication và authorization

- Browser nhận access/refresh token qua cookie `HttpOnly`, `Secure`, `SameSite=Lax`.
- Business Application verify access token bằng JWK từ Auth Provider.
- Endpoint Business Application yêu cầu đăng nhập trừ khi ghi `Public` hoặc `Webhook`.
- Backend luôn kiểm tra role và resource ownership; FE route guard không phải security boundary.
- Webhook PayOS không dùng user JWT, bắt buộc verify signature trên raw payload.

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

### 2.5. Kiểu dữ liệu

- BIGINT id được serialize thành string để an toàn với JavaScript, ví dụ `"course_id": "12001"`.
- Datetime là ISO 8601 UTC có hậu tố `Z`, ví dụ `2026-08-10T09:30:00Z`.
- Date là `YYYY-MM-DD`.
- Tiền là integer VND, field kết thúc bằng `_vnd`; không truyền float hoặc chuỗi đã format.
- Tỷ lệ phần trăm là số `0..100`; score dùng decimal `0..100`.
- Enum trả đúng uppercase value trong `DATABASE.txt`.
- Field không có giá trị trả `null`; không dùng chuỗi rỗng thay `null`.

### 2.6. Idempotency và concurrency

- Client gửi `Idempotency-Key` cho create order, create checkout, submit Judge, finish interview và request payout.
- Cùng key + cùng payload trả lại kết quả cũ; cùng key + payload khác trả `409 IDEMPOTENCY_CONFLICT`.
- PayOS webhook idempotent theo `payos_order_code` và provider transaction reference.
- Update reorder/status dùng `version`; version cũ trả `409 STALE_RESOURCE_VERSION`.

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

## 4. Identity và Teacher approval

| Method | Path | Access | Request/Query | Response schema |
| --- | --- | --- | --- | --- |
| `GET` | `/users/me` | Authenticated | - | `CurrentUser` |
| `PATCH` | `/users/me/student-profile` | Student | Profile fields | `StudentProfile` |
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

Teacher profile được tạo cùng lần save application đầu tiên. Chỉ status `APPROVED` kích hoạt Teacher role/quyền; reject bắt buộc note.

## 5. Catalog, instructor và social commerce

| Method | Path | Access | Request/Query | Response schema |
| --- | --- | --- | --- | --- |
| `GET` | `/courses` | Public | Pagination, `q`, `price_type`, `field`, `sort` | `CourseCard[]` |
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

## 6. Teacher course authoring và Admin moderation

| Method | Path | Access | Request/Query | Response schema |
| --- | --- | --- | --- | --- |
| `GET` | `/teacher/courses` | Approved Teacher | Pagination, `status` | `TeacherCourse[]` |
| `POST` | `/teacher/courses` | Approved Teacher | `title`, `description`, `price_vnd`, metadata | Draft course |
| `GET` | `/teacher/courses/{course_id}` | Owner | - | `TeacherCourseDetail` |
| `PATCH` | `/teacher/courses/{course_id}` | Owner, editable status | Fields + `version` | Updated course |
| `POST` | `/teacher/courses/{course_id}/submit-review` | Owner, Draft/Rejected | `version` | Pending review |
| `POST` | `/teacher/courses/{course_id}/archive` | Owner/Admin | `version` | Archived course |
| `POST` | `/teacher/courses/{course_id}/restore-draft` | Owner/Admin | `version` | Draft course |
| `POST` | `/teacher/courses/{course_id}/sections` | Owner | `title`, `position` | `Section` |
| `PATCH` | `/teacher/sections/{section_id}` | Owner | Fields + `version` | `Section` |
| `DELETE` | `/teacher/sections/{section_id}` | Owner | `version` | `204` |
| `POST` | `/teacher/sections/{section_id}/lessons` | Owner | `title`, `summary`, `position` | `Lesson` |
| `PATCH` | `/teacher/lessons/{lesson_id}` | Owner | Fields + `version` | `Lesson` |
| `POST` | `/teacher/lessons/{lesson_id}/contents` | Owner | Type, content payload, completion policy | `LessonContent` |
| `PATCH` | `/teacher/lesson-contents/{lesson_content_id}` | Owner | Payload/policy + `version` | `LessonContent` |
| `PUT` | `/teacher/courses/{course_id}/curriculum-order` | Owner | Ordered tree + `version` | Curriculum tree |
| `GET` | `/admin/course-reviews` | Admin | Pagination, `status=PENDING_REVIEW` | Review queue |
| `GET` | `/admin/course-reviews/{course_id}` | Admin | - | Course snapshot + checklist/history |
| `POST` | `/admin/course-reviews/{course_id}/approve` | Admin | `reviewed_note?`, `version` | Published course |
| `POST` | `/admin/course-reviews/{course_id}/reject` | Admin | `reviewed_note`, `version` | Rejected course |

Teacher không gửi `status` tùy ý trong course update. Mọi transition dùng endpoint action riêng và service kiểm tra state hiện tại.

## 7. Learning, progress, Quiz và comments

| Method | Path | Access | Request/Query | Response schema |
| --- | --- | --- | --- | --- |
| `GET` | `/student/enrollments` | Authenticated | Pagination, `q` | `EnrollmentSummary[]` |
| `GET` | `/student/enrollments/{enrollment_id}` | Owner | - | Enrollment + progress summary |
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
| `POST` | `/payments/payos/webhook` | Webhook | Raw signed PayOS payload | Acknowledgement |

Một order có đúng một order item/course trong MVP. Create order chặn course đã enrolled; webhook hợp lệ cập nhật transaction/order, tạo Enrollment và ledger đúng một lần.

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

## 10. Online Judge

| Method | Path | Access | Request/Query | Response schema |
| --- | --- | --- | --- | --- |
| `GET` | `/problems` | Public | Pagination, `q`, `difficulty`, `tag` | `ProblemCard[]` |
| `GET` | `/problems/{slug}` | Public | - | Public problem detail + samples |
| `POST` | `/problems/{slug}/runs` | Authenticated | Source, language, custom stdin | `RunResult` |
| `POST` | `/problems/{slug}/submissions` | Authenticated | Source, language, `lesson_content_id?` | Pending `Submission` |
| `GET` | `/submissions` | Authenticated | Pagination, own filters | Own submissions |
| `GET` | `/submissions/{submission_id}` | Owner/Teacher owner/Admin | - | Submission result projection |
| `GET` | `/submissions/{submission_id}/events` | Owner/Teacher owner/Admin | - | SSE status stream |
| `GET` | `/languages` | Public | - | Enabled languages/config |
| `GET` | `/teacher/problems` | Approved Teacher | Pagination, filters | Owned problems |
| `POST` | `/teacher/problems` | Approved Teacher | Problem metadata | Draft problem |
| `PATCH` | `/teacher/problems/{problem_id}` | Owner | Fields + `version` | Updated problem |
| `PUT` | `/teacher/problems/{problem_id}/testcases` | Owner | Testcase metadata/references | Testcase summary |

Student không nhận hidden input/output/expected output. Submission status dùng enum trong `DATABASE.txt`; worker retry không tạo submission mới.

## 11. AI Interview

| Method | Path | Access | Request/Query | Response schema |
| --- | --- | --- | --- | --- |
| `GET` | `/interview-sessions` | Authenticated | Pagination, own sessions | `InterviewSession[]` |
| `POST` | `/interview-sessions` | Authenticated | `topic`, `level` | Active session + first question |
| `GET` | `/interview-sessions/{session_id}` | Session owner/Admin audit | - | Session + transcript |
| `POST` | `/interview-sessions/{session_id}/answers` | Session owner, Active | `message`, `question_index` | Next question or finish result |
| `POST` | `/interview-sessions/{session_id}/finish` | Session owner, Active | `reason` | Report-generating session |
| `POST` | `/interview-sessions/{session_id}/abort` | Session owner, Active | - | Aborted session |
| `GET` | `/interview-sessions/{session_id}/report` | Session owner/Admin audit | - | `202` generating or final report |

Session tối đa 12 câu và có thể kết thúc sớm. API chỉ nhận/lưu text đã chuẩn hóa; camera/microphone là browser permission, không upload recording. Một session có tối đa một report.

## 12. Notification, audit và upload

| Method | Path | Access | Request/Query | Response schema |
| --- | --- | --- | --- | --- |
| `GET` | `/notifications` | Authenticated | Pagination, `is_read`, `type` | Own notifications |
| `PUT` | `/notifications/{notification_id}/read` | Notification owner | - | `204` |
| `PUT` | `/notifications/read-all` | Authenticated | - | `204` |
| `GET` | `/notification-events` | Authenticated | - | SSE own notification stream |
| `GET` | `/admin/audit-logs` | Admin | Pagination, actor/target/action filters | Audit rows |
| `POST` | `/uploads/presign` | Authenticated | Purpose, MIME, size, filename | Presigned upload |
| `POST` | `/uploads/{upload_id}/complete` | Upload owner | Object metadata | Scan-pending file reference |
| `GET` | `/uploads/{upload_id}` | Owner/authorized reviewer | - | Scan/OCR status + signed URL when allowed |

Private upload purposes gồm `CCCD_FRONT`, `CCCD_BACK`, `TEACHER_CV`, `TESTCASE`; public-after-scan purposes gồm `AVATAR`, `COURSE_THUMBNAIL`, `LESSON_VIDEO`. OCR chỉ cung cấp confidence/quality flags cho Admin, không tự approve hồ sơ.

## 13. Schema tối thiểu dùng chung

### CourseCard

`id`, `slug`, `title`, `thumbnail_url`, `instructor`, `price_vnd`, `average_rating`, `review_count`, `is_favorite`, `viewer_state`.

### TeacherApplication

`id`, `user_id`, `status`, `motivation`, `cccd_masked`, `cccd_front_upload_id`, `cccd_back_upload_id`, `cv_upload_id`, `reviewed_by`, `reviewed_note`, `submitted_at`, `reviewed_at`, `version`.

### LessonContent

`id`, `lesson_id`, `content_type`, `position`, typed `content`, `pass_score`, `max_attempts`, `progress`, `is_locked`, `version`.

### OrderDetail

`id`, `status`, `student_id`, `item`, `total_amount_vnd`, `payment`, `enrollment_id`, `created_at`, `completed_at`.

### ContentProgress

`lesson_content_id`, `status`, `watched_percent`, `best_score`, `attempt_count`, `completed_at`, `updated_at`.

### Submission

`id`, `problem_id`, `language`, `status`, `score`, `runtime_ms`, `memory_kb`, `visible_testcase_results`, `submitted_at`.

### DocumentAnalysis

`status`, `ocr_text_masked`, `cccd_last_four`, `front_quality_score`, `back_quality_score`, `warnings`, `provider`, `completed_at`.

## 14. Error code catalogue

| Domain | Codes |
| --- | --- |
| Auth | `AUTH_REQUIRED`, `INVALID_CREDENTIALS`, `ACCOUNT_NOT_ACTIVE`, `ACCOUNT_BANNED`, `OTP_INVALID`, `TOKEN_EXPIRED` |
| Permission | `ROLE_REQUIRED`, `RESOURCE_FORBIDDEN`, `RESOURCE_NOT_FOUND` |
| Teacher/Course review | `APPLICATION_STATE_INVALID`, `REJECTION_NOTE_REQUIRED`, `COURSE_STATE_INVALID`, `COURSE_REVIEW_INCOMPLETE` |
| Commerce | `COURSE_ALREADY_ENROLLED`, `COURSE_NOT_PURCHASABLE`, `ORDER_STATE_INVALID`, `PAYMENT_SIGNATURE_INVALID`, `PAYMENT_EXPIRED` |
| Learning | `CONTENT_LOCKED`, `ATTEMPT_LIMIT_REACHED`, `ATTEMPT_ALREADY_SUBMITTED` |
| Judge | `LANGUAGE_NOT_ENABLED`, `SUBMISSION_STATE_INVALID`, `JUDGE_UNAVAILABLE` |
| Interview | `INTERVIEW_NOT_ACTIVE`, `QUESTION_LIMIT_REACHED`, `REPORT_NOT_READY`, `AI_PROVIDER_UNAVAILABLE` |
| Wallet | `PAYOUT_MINIMUM_NOT_MET`, `INSUFFICIENT_AVAILABLE_BALANCE`, `PAYOUT_STATE_INVALID` |
| Upload | `UPLOAD_PURPOSE_INVALID`, `FILE_TYPE_NOT_ALLOWED`, `FILE_SCAN_PENDING`, `FILE_REJECTED` |
| Cross-cutting | `VALIDATION_ERROR`, `RATE_LIMITED`, `IDEMPOTENCY_CONFLICT`, `STALE_RESOURCE_VERSION`, `INTERNAL_ERROR` |

## 15. Contract verification

Khi backend được implement:

1. Pydantic request/response model phải sinh OpenAPI tương ứng tài liệu này.
2. Export Business Application OpenAPI thành `docs/specs/api.json` và Auth Provider thành `docs/specs/auth-provider.json`.
3. Contract tests kiểm tra status code, response envelope, error code và authorization cho từng endpoint.
4. Payment webhook, enrollment, quiz attempt, Judge submission, interview finish và payout phải có test idempotency/state transition.
5. FE mock payload phải validate được với cùng generated TypeScript schema/OpenAPI type.

Các endpoint trong tài liệu là baseline Phase 0. Thay đổi path, enum hoặc response shape sau baseline phải có decision-log entry và cập nhật mock catalogue trước khi implement.
