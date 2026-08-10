# TDD - LMS Coding Platform

## 1. Mục đích

Tài liệu này chuyển nghiệp vụ trong prd.md thành các chức năng kỹ thuật có thể triển khai và kiểm thử.

Nguồn đối chiếu:

- Nghiệp vụ: prd.md
- Schema: DATABASE.txt
- Gap: gap-analysis.md
- UI: thư mục docs/ui

## 2. Kiến trúc tổng quan

~~~mermaid
flowchart LR
    FE[React Frontend] --> AUTH[Auth Provider]
    FE --> API[Business Application API]
    FE --> OJ[Judge Gateway]
    API --> DB[(PostgreSQL)]
    API --> REDIS[(Redis)]
    API --> STORAGE[(S3 or MinIO)]
    API --> PAY[PayOS]
    API --> AI[Gemini API]
    API --> JUDGE[Judge Service]
    JUDGE --> BOX[Docker Sandbox]
    API --> WORKER[Background Workers]
    WORKER --> FE
~~~

## 3. Công nghệ và chức năng

| Công nghệ | Chức năng |
| --- | --- |
| React + TypeScript | SPA và UI state |
| TailwindCSS | Theme và responsive layout |
| TanStack Query | API cache/invalidation |
| Monaco Editor | Online Judge code editor |
| FastAPI | Business API |
| Pydantic | Request/response validation |
| SQLAlchemy 2 + Alembic | ORM và migration |
| PostgreSQL | Transactional data |
| Redis | Lock, cache, rate limit, queue state |
| Celery/RQ | Background jobs |
| JWT + JWK | Auth giữa services |
| Argon2id/bcrypt | Password hashing |
| S3/MinIO | Avatar, CCCD, CV, media, testcase |
| PayOS | QR, payment link, webhook |
| Gemini API | AI question/report |
| Judge Service/Judge0 | Compile và chấm code |
| Docker | Sandbox cô lập |
| WebSocket/SSE | Realtime judge/notification |
| Pytest + HTTPX | Unit/API/integration tests |
| Playwright | E2E tests |
| Sentry/OpenTelemetry | Error, trace, metrics |

## 4. Quy ước chung

- API dùng REST JSON dưới prefix /api/v1.
- Frontend dùng camelCase; database dùng snake_case và mapper ở API layer.
- Mọi mutation kiểm tra JWT, account status, role, ownership và business status.
- PayOS webhook, Enrollment, payout debit, notification và judge result phải idempotent.
- Tiền lưu bằng BIGINT VND, không dùng Float cho ledger.
- Lỗi API có code, message và details.
- PII/CCCD/CV dùng signed URL, không public.

## 5. F01 - Authentication và RBAC

### Mục tiêu

Đăng ký, đăng nhập local/Google, nhiều role trên một user và kiểm soát Teacher approval.

### Luồng

~~~mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE as React Frontend
    participant Auth as Auth Provider
    participant DB as Auth DB
    participant App as Business API

    User->>FE: Nhập credentials hoặc chọn Google
    FE->>Auth: Login/OAuth request
    Auth->>DB: Tìm user identity và roles
    DB-->>Auth: User/account status
    alt Account hợp lệ
        Auth-->>FE: Access token + refresh token
        FE->>App: API request with JWT
        App->>Auth: Verify JWT/JWK
        Auth-->>App: User claims
        App-->>FE: Profile + permissions
    else Banned/inactive/invalid
        Auth-->>FE: Auth error
    end
~~~

### Quy tắc và test

- Một user có thể có Student và Teacher role.
- Teacher role chưa đồng nghĩa Teacher đã approved.
- Banned user không gọi protected API.
- Password phải được hash.
- Test: đăng ký email trùng, token hết hạn, role thiếu quyền, Teacher chưa approved.

### Công nghệ cốt lõi

| Công nghệ | Sử dụng cụ thể |
| --- | --- |
| Auth Provider FastAPI | Đăng ký, login, refresh token và phát hành JWT/JWK |
| JWT + JWK | Business API verify token mà không giữ private key Auth Provider |
| Argon2id/bcrypt | Hash password trước khi lưu |
| PostgreSQL | User, identity, role và account status |
| Redis | Login rate limit, session revoke và brute-force protection |

## 6. F02 - Teacher Registration và Admin Approval

### Mục tiêu

Student tạo TeacherProfile, gửi CCCD/CV/motivation; Admin approve/reject; hồ sơ reject được resubmit.

### Luồng

~~~mermaid
stateDiagram-v2
    [*] --> DRAFT
    DRAFT --> PENDING: Submit application
    PENDING --> APPROVED: Admin approve
    PENDING --> REJECTED: Admin reject with note
    REJECTED --> DRAFT: Student edit
    APPROVED --> APPROVED: Teacher dashboard access
~~~

~~~mermaid
sequenceDiagram
    actor Student
    participant FE as Student UI
    participant API as Business API
    participant Storage as S3/MinIO
    participant DB as PostgreSQL
    actor Admin
    participant Notify as Notification Worker

    Student->>FE: Điền hồ sơ và upload files
    FE->>Storage: Upload CV/CCCD
    Storage-->>FE: Signed file URLs
    FE->>API: Save draft and submit
    API->>DB: Create profile/application
    API->>Notify: Notify Admin
    Admin->>API: Review application
    alt Approve
        API->>DB: application_status = APPROVED
        API->>Notify: Teacher approved
    else Reject
        API->>DB: status = REJECTED + note
        API->>Notify: Teacher rejected
    end
~~~

### Công nghệ cốt lõi

| Công nghệ | Sử dụng cụ thể |
| --- | --- |
| React Hook Form + Zod | Validate CCCD, motivation, CV và profile form |
| S3/MinIO + Presigned URL | Upload private CV/CCCD mà không truyền file lớn qua API |
| OCR/Document Detection | Đọc số CCCD và kiểm tra chất lượng document để hỗ trợ Admin; không tự thay quyết định Admin |
| ClamAV/file scanner | Quét file độc hại trước khi lưu URL chính thức |
| PostgreSQL transaction | Lưu profile/application/review status nhất quán |
| Celery/RQ | Chạy OCR, scan và notification bất đồng bộ |

### Test

- Profile được tạo trước approval.
- Thiếu CCCD không submit được.
- Reject bắt buộc note.
- Teacher chưa approved không tạo được course.
- CCCD không truy cập public.

## 7. F03 - Course Authoring và Course Approval

### Mục tiêu

Teacher approved tạo course và content, submit Admin, nhận approve/reject/resubmit.

### Luồng

~~~mermaid
stateDiagram-v2
    [*] --> DRAFT
    DRAFT --> PENDING_REVIEW: Teacher submit
    PENDING_REVIEW --> PUBLISHED: Admin approve
    PENDING_REVIEW --> REJECTED: Admin reject
    REJECTED --> DRAFT: Teacher edit
    PUBLISHED --> ARCHIVED: Authorized archive
    ARCHIVED --> DRAFT: Authorized restore
~~~

~~~mermaid
sequenceDiagram
    actor Teacher
    participant UI as Course Builder
    participant API as Course API
    participant DB as PostgreSQL
    actor Admin
    participant Notify as Notification Worker

    Teacher->>UI: Tạo course/section/lesson/content
    UI->>API: Save draft and positions
    API->>DB: Persist course tree
    Teacher->>UI: Submit for review
    UI->>API: Submit course
    API->>DB: Set PENDING_REVIEW
    API->>Notify: Notify Admin
    Admin->>API: Preview course
    alt Approved
        API->>DB: Set PUBLISHED + reviewer data
        API->>Notify: Notify Teacher
    else Rejected
        API->>DB: Set REJECTED + reviewed_note
        API->>Notify: Notify Teacher
    end
~~~

### Quy tắc

- Course chưa Published không hiển thị public.
- Teacher reject được sửa và resubmit.
- Course archive không xóa enrollment cũ.
- Lesson content gồm Reading, Video, Quiz, Problem theo position.

### Công nghệ cốt lõi

| Công nghệ | Sử dụng cụ thể |
| --- | --- |
| React + DnD Kit | Kéo thả section, lesson và lesson content |
| FastAPI state service | Kiểm soát Draft/Pending/Published/Rejected/Archived |
| SQLAlchemy + Alembic | Persistence và migration course tree |
| S3/MinIO | Thumbnail, video và media course |
| Markdown sanitizer | Làm sạch Reading content trước khi render |
| PostgreSQL transaction | Atomic reorder và Admin review decision |

### Test

- Teacher chưa approved bị từ chối.
- Checklist thiếu không submit.
- Approve hiển thị trong catalog.
- Reject cần note.
- Reorder không trùng position.

## 8. F04 - Catalog, Favorite và Review

### Mục tiêu

Student tìm, lọc, favorite course; enrolled Student được review.

### Luồng

~~~mermaid
flowchart TD
    A[Open catalog] --> B{Course Published?}
    B -- No --> C[Hide from public]
    B -- Yes --> D[Render course card]
    D --> E{Already enrolled?}
    E -- Yes --> F[Continue learning]
    E -- No --> G[View detail or add cart]
    D --> H[Toggle favorite]
    F --> I{Eligible review?}
    I -- Yes --> J[Create or edit one review]
    I -- No --> K[View existing state]
~~~

### Quy tắc và test

- Favorite unique theo user/course.
- Review chỉ cho enrolled Student.
- Một Student một review/course.
- Rating average là aggregate từ course_review.
- Test: course draft không public, duplicate favorite/review bị chặn, archive vẫn truy cập enrolled.

### Công nghệ cốt lõi

| Công nghệ | Sử dụng cụ thể |
| --- | --- |
| PostgreSQL index/search | Tìm và lọc Published course theo title, field, tag, price, rating |
| TanStack Query | Cache catalog, favorite/review và invalidate sau mutation |
| Redis cache | Cache catalog public và rating aggregate có TTL |
| FastAPI authorization | Chặn review nếu chưa enrollment và giới hạn một review/course |
| Background aggregate worker | Cập nhật rating_average sau review thay đổi |

## 9. F05 - Cart, Order, PayOS và Enrollment

### Mục tiêu

Mỗi order mua một course; payment thành công enroll ngay.

### Luồng

~~~mermaid
sequenceDiagram
    actor Student
    participant FE as Checkout UI
    participant API as Business API
    participant DB as PostgreSQL
    participant PayOS
    participant Notify as Worker

    Student->>FE: Add course to cart
    FE->>API: Add cart item
    API->>DB: Upsert cart_item
    Student->>FE: Checkout one course
    FE->>API: Create order
    API->>DB: Check Published and no enrollment
    API->>DB: Order PENDING + transaction PENDING
    API->>PayOS: Create payment link
    PayOS-->>API: QR/link/code
    API-->>FE: Show payment
    PayOS->>API: Signed webhook
    API->>API: Verify signature/idempotency
    alt Paid and valid
        API->>DB: Order PAID, transaction COMPLETED
        API->>DB: Create Enrollment once
        API->>DB: Write 80/20 wallet ledger
        API->>Notify: Payment/enrollment event
        Notify-->>FE: Success notification
    else Failed/expired/invalid
        API->>DB: Update failed state
        API->>Notify: Failure notification
    end
~~~

### Công nghệ cốt lõi

| Công nghệ | Sử dụng cụ thể |
| --- | --- |
| PayOS API | Tạo QR/payment link và nhận webhook |
| PayOS signature verification | Xác minh callback trước khi mở Enrollment |
| PostgreSQL transaction | Atomic order, payment, enrollment và wallet ledger |
| Redis distributed lock | Chặn checkout/webhook race cho cùng user/course |
| Idempotency key | Webhook gửi lại không tạo duplicate enrollment/revenue |
| Celery/RQ | Retry notification và side effect sau payment |
| TanStack Query | Đồng bộ cart/order/payment state trong UI |

### Test

- Course đã enrollment không checkout lại.
- Course chưa Published không checkout.
- Webhook gửi hai lần chỉ tạo một enrollment.
- Sai signature/amount không mở khóa.
- Payment failure không tạo enrollment.
- Ledger chia chính xác 80% Teacher/20% Platform.

## 10. F06 - Learning Content và Progress

### Mục tiêu

Video hoàn thành khi xem 100%; Quiz/Problem theo pass score và max attempts do Teacher đặt.

### Luồng

~~~mermaid
flowchart TD
    A[Open lesson content] --> B{Content type}
    B -- Reading --> C[Read content]
    B -- Video --> D[Track watched percent]
    B -- Quiz --> E[Create quiz attempt]
    B -- Problem --> F[Open judge problem]
    C --> G[Progress in progress]
    D --> H{100 percent watched?}
    H -- No --> G
    H -- Yes --> I[Completed]
    E --> J{Score >= pass score?}
    J -- Yes --> I
    J -- No --> K{Attempts left?}
    K -- Yes --> E
    K -- No --> L[Failed and locked]
    F --> M{Accepted and score >= pass score?}
    M -- Yes --> I
    M -- No --> K
~~~

### Công nghệ cốt lõi

| Công nghệ | Sử dụng cụ thể |
| --- | --- |
| HTML5 Video API | Theo dõi currentTime/duration và ghi watched_percent |
| React Query mutation | Gửi progress có debounce và cập nhật UI |
| PostgreSQL unique constraint | Một progress record cho enrollment/content |
| Redis debounce/cache | Giảm số lần ghi progress khi video đang phát |
| FastAPI content resolver | Resolve Reading/Video/Quiz/Problem và kiểm tra quyền |
| S3/MinIO | Delivery video/media qua signed URL hoặc CDN |

### Test

- 99.99% video chưa completed.
- 100% video completed.
- Quiz fail còn lượt thì retry.
- Hết lượt không submit được.
- Problem chỉ complete sau Accepted đủ score.
- User không cập nhật progress enrollment khác.

## 11. F07 - Quiz và Attempt

### Mục tiêu

Teacher đặt passing score/max attempts; Student submit attempt, nhận score/pass/fail.

### Luồng

~~~mermaid
sequenceDiagram
    actor Student
    participant FE as Quiz UI
    participant API as Quiz API
    participant DB as PostgreSQL

    Student->>FE: Open quiz
    FE->>API: Get questions and remaining attempts
    API->>DB: Check enrollment/content access
    DB-->>API: Quiz policy
    Student->>FE: Answer and submit
    FE->>API: Submit attempt
    API->>DB: Lock attempt number
    alt Attempts available
        API->>API: Calculate score
        API->>DB: Save quiz_attempt
        API->>DB: Update content progress
        API-->>FE: Score/pass/fail/remaining
    else Exhausted
        API-->>FE: Attempts exhausted
    end
~~~

### Test

- Không lộ is_correct trước submit.
- Attempt number không trùng khi submit đồng thời.
- Score/pass cập nhật progress.
- Hết retry khóa submit.
- Resume attempt theo policy.

### Công nghệ cốt lõi

| Công nghệ | Sử dụng cụ thể |
| --- | --- |
| React Hook Form | Quản lý radio/checkbox answers và question state |
| FastAPI scoring service | Tính điểm server-side, không tin score từ client |
| PostgreSQL row lock | Cấp attempt number duy nhất khi submit đồng thời |
| Redis | Timer/attempt session ngắn hạn và rate limit submit |
| Pytest property tests | Kiểm thử scoring và pass threshold |

## 12. F08 - Online Judge

### Mục tiêu

Run/submit code trong sandbox, lưu submission và trả kết quả từng testcase.

### Luồng

~~~mermaid
sequenceDiagram
    actor Student
    participant FE as Monaco UI
    participant API as Business API
    participant DB as PostgreSQL
    participant Queue as Redis Queue
    participant Judge as Judge Service
    participant Box as Docker Sandbox
    participant RT as SSE/WebSocket

    Student->>FE: Submit source code
    FE->>API: problem, language, source
    API->>DB: Save submission PENDING
    API->>Queue: Enqueue submission
    Queue->>Judge: Dispatch
    Judge->>Box: Run isolated container
    Box-->>Judge: Status/output/runtime/memory
    Judge->>DB: Save testcase details
    Judge->>DB: Update submission status
    Judge-->>RT: Publish result
    RT-->>FE: Update result
    alt Accepted course problem
        API->>DB: Mark progress completed
    end
~~~

### Quy tắc và test

- Sandbox không network và giới hạn CPU/RAM/time.
- Hidden testcase không trả raw input/output.
- Status gồm Pending, Running, Accepted, Wrong Answer, TLE, MLE, RE, CE.
- Judge retry không duplicate submission.
- Accepted cập nhật progress một lần.

### Công nghệ cốt lõi

| Công nghệ | Sử dụng cụ thể |
| --- | --- |
| Monaco Editor | Syntax highlight, language selection và line number |
| Redis Queue/Celery | Đưa submission vào worker, không block HTTP request |
| Judge0/Judge Service | Compile/run và chuẩn hóa AC/WA/TLE/MLE/RE/CE |
| Docker Sandbox | Không network, giới hạn CPU/RAM/time/filesystem |
| PostgreSQL | Source, submission aggregate và testcase details |
| SSE/WebSocket | Stream Running/Accepted/Failed result về UI |
| Prometheus/OpenTelemetry | Queue latency, runtime, sandbox failure, throughput |

## 13. F09 - AI Interview

### Mục tiêu

Session tối đa 12 câu, có thể kết thúc sớm; hỗ trợ microphone/camera nhưng không lưu media.

### Luồng

~~~mermaid
sequenceDiagram
    actor Student
    participant FE as Interview UI
    participant API as Interview API
    participant DB as PostgreSQL
    participant AI as Gemini API
    participant Worker as Report Worker
    participant Notify as Notification Worker

    Student->>FE: Select topic and level
    FE->>API: Create session max 12
    API->>DB: Save ACTIVE session
    FE->>Student: Request optional media permission
    API->>AI: Generate first question
    AI-->>API: Question
    API->>DB: Save AI message
    loop Until 12 or AI finishes
        Student->>FE: Send text answer or media stream
        FE->>API: Send normalized text
        API->>DB: Save STUDENT message
        API->>AI: Send conversation
        AI-->>API: Next question or finish
        API->>DB: Save AI message and count
    end
    API->>DB: Mark COMPLETED
    API->>Worker: Generate report
    Worker->>AI: Evaluate saved text
    AI-->>Worker: Score and feedback
    Worker->>DB: Save one report
    Worker->>Notify: AI_REPORT event
    Notify-->>FE: Report ready
~~~

### Quy tắc và test

- Không vượt quá 12 câu.
- Media permission denied vẫn chat text được.
- Không lưu audio/video.
- Một session chỉ có một report.
- Gemini retry không duplicate message/report.
- Active session có thể Resume.

### Công nghệ cốt lõi

| Công nghệ | Sử dụng cụ thể |
| --- | --- |
| Gemini API | Sinh câu hỏi tiếp theo và đánh giá conversation |
| Prompt template/versioning | Giữ system prompt theo topic/level và audit prompt version |
| WebSocket | Streaming question và chat realtime |
| WebRTC getUserMedia | Microphone/camera stream trong phiên, không persistence media |
| Redis session lock | Chặn gửi đồng thời và giới hạn gọi AI |
| Celery/RQ | Sinh report sau session và retry khi AI timeout |
| PostgreSQL | Session, text messages và một final report |

## 14. F10 - Teacher Wallet và Payout

### Mục tiêu

Ghi nhận 80% Teacher, 20% Platform; payout tối thiểu 1.000 VND do Admin duyệt.

### Luồng

~~~mermaid
sequenceDiagram
    participant Payment as Payment Service
    participant DB as PostgreSQL
    actor Teacher
    actor Admin
    participant Notify as Worker

    Payment->>DB: Payment completed
    DB->>DB: Write 80% teacher ledger
    DB->>DB: Write 20% platform ledger
    Teacher->>DB: Request payout
    DB->>DB: Validate balance >= 1000 VND
    Admin->>DB: Review payout
    alt Approve
        Admin->>DB: Create payout debit
        DB->>Notify: Payout completed
    else Reject
        Admin->>DB: Save rejection note
        DB->>Notify: Payout rejected
    end
~~~

### Công nghệ và test

PostgreSQL transaction - atomic ledger/debit.
BIGINT VND - exact money.
Redis lock - prevent double payout.
FastAPI - wallet commands.
Admin UI/audit - review.

Test: balance dưới 1000 bị chặn; payout không vượt balance; reject không debit; approve chỉ debit một lần; webhook retry không cộng doanh thu hai lần.

### Công nghệ cốt lõi

| Công nghệ | Sử dụng cụ thể |
| --- | --- |
| BIGINT VND | Lưu tiền chính xác, tránh sai số Float |
| PostgreSQL ledger | Immutable revenue, platform fee, payout debit, adjustment |
| PostgreSQL transaction + row lock | Không để balance âm khi payout đồng thời |
| Redis distributed lock | Chặn duplicate payout request/double approval |
| FastAPI Admin workflow | Approve/reject payout và bắt buộc note khi reject |
| Celery/RQ | Bank payout integration/retry và notification |

## 15. F11 - Notification và Audit

### Luồng

~~~mermaid
flowchart LR
    A[Payment] --> E[Domain event]
    B[Teacher/course review] --> E
    C[Judge result] --> E
    D[AI report] --> E
    E --> W[Notification worker]
    W --> DB[(notification)]
    W --> RT[SSE/WebSocket]
    RT --> UI[Notification panel]
    E --> AUDIT[(audit_log)]
~~~

### Event bắt buộc

PAYMENT, TEACHER_REVIEW, COURSE_REVIEW, JUDGE_RESULT, AI_REPORT, PAYOUT, SYSTEM.

### Công nghệ và test

Domain events/Celery - event processing.
Redis queue - retry.
SSE/WebSocket - realtime.
PostgreSQL - notification/audit.

Test: notification không duplicate; user chỉ đọc notification của mình; Admin action có actor/target/time; read/unread không xóa audit.

### Công nghệ cốt lõi

| Công nghệ | Sử dụng cụ thể |
| --- | --- |
| Domain events | Tách payment/review/judge/AI/payout khỏi notification UI |
| Celery/RQ + Redis | Persist và retry notification bất đồng bộ |
| SSE/WebSocket | Đẩy notification realtime tới header/panel |
| PostgreSQL | Notification read state và audit immutable |
| OpenTelemetry trace id | Liên kết event từ API tới worker/payment/judge |

## 16. F12 - File và Media Management

### Luồng

~~~mermaid
sequenceDiagram
    actor User
    participant FE as Frontend
    participant API as Business API
    participant Storage as S3/MinIO
    participant Scan as File Scanner
    participant DB as PostgreSQL

    User->>FE: Chọn file
    FE->>API: Request presigned URL
    API-->>FE: Short-lived upload URL
    FE->>Storage: Upload
    Storage->>Scan: Scan MIME/virus
    Scan-->>API: Safe or unsafe
    alt Safe
        API->>DB: Save file metadata and URL
    else Unsafe
        API->>Storage: Delete object
        API-->>FE: Reject file
    end
~~~

### Công nghệ và test

S3/MinIO - object storage.
Presigned URL - direct upload.
ClamAV - file scan.
Signed URL - private CCCD/CV.
CDN - public media.

Test: sai MIME bị chặn; CCCD không public; user không đọc file người khác; upload lỗi không tạo orphan metadata.

### Công nghệ cốt lõi

| Công nghệ | Sử dụng cụ thể |
| --- | --- |
| S3/MinIO | Avatar, CV, CCCD, thumbnail, video và testcase |
| Presigned URL | Direct upload có thời hạn, giảm tải Business API |
| ClamAV/file scanner | Virus/MIME detection trước khi publish |
| OCR/Document Detection | Trích xuất số CCCD và kiểm tra chất lượng document hỗ trợ Admin |
| Signed URL/CDN | Private CCCD/CV và public/cacheable media |
| Metadata transaction | Chỉ lưu file reference sau upload/scan thành công |

## 17. Ma trận chức năng và UI

| Function | UI chính |
| --- | --- |
| F01 Auth/RBAC | AUTH01-AUTH07 |
| F02 Teacher approval | STD04, AD01 |
| F03 Course approval | TC11, TC14, AD02 |
| F04 Catalog/review | COURSE01, COURSE02, STD03 Favorites |
| F05 Commerce | PAY01, PAY02, PAY03, STD02 |
| F06 Learning | STD01/CLASS01, PROG01-PROG03, QUIZ01-QUIZ02, TC06 |
| F07 Quiz | QUIZ01, QUIZ02, TC06 |
| F08 Online Judge | OJ01-OJ03, TC08, TC13 |
| F09 AI Interview | INTERVIEW01-INTERVIEW03 |
| F10 Wallet/payout | TC04, TC15 |
| F11 Notification/audit | Teacher/Admin headers and dashboard |
| F12 File/media | STD04, AD01, AD02, TC06, TC11 |

## 18. Definition of Done

Một chức năng hoàn thành khi:

1. Có API contract và permission rule.
2. Có migration/schema tương ứng.
3. Có unit test cho business rule.
4. Có integration test cho transaction/event.
5. Có wireframe success/loading/empty/error state.
6. Có audit/notification nếu là thao tác nhạy cảm.
7. Có E2E test cho flow chính.
8. Có logging/metrics đủ để vận hành.
