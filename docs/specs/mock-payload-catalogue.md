# Phase 0 Mock Payload Catalogue

## 1. Mục đích

Catalogue này là nguồn fixture cho FE mock-first. Mỗi wireframe được gắn với API contract, fixture key và các state tối thiểu. Field/enum tuân theo `api_spec.md` và `DATABASE.txt`; nội dung text có thể đổi nhưng shape và business state không được tự ý đổi.

Quy ước fixture:

- ID luôn là string.
- Datetime là UTC ISO 8601.
- Tiền là integer VND.
- `*.loading` do mock adapter delay response; không cần payload riêng.
- `*.error` dùng error envelope tại mục 4.
- Collection luôn có `data` và pagination `meta`.
- Fixture chứa private CCCD/CV chỉ được dùng trong Admin review mock.

## 2. Page-to-fixture map

### 2.1. Auth

| UI file | Route | API chính | Fixture keys và state bắt buộc |
| --- | --- | --- | --- |
| AUTH01Login | `/auth/login` | `POST /auth/login` | `auth.login.idle`, `.invalid`, `.success`, `.banned` |
| AUTH02Register | `/auth/register` | `POST /auth/register` | `auth.register.idle`, `.validation`, `.email_exists`, `.success` |
| AUTH03ForgotPassword | `/auth/forgot-password` | `POST /auth/forgot-password` | `auth.forgot.idle`, `.success`, `.rate_limited` |
| AUTH04SetPassword | `/auth/set-password` | `POST /auth/reset-password` | `auth.reset.valid`, `.expired`, `.success` |
| AUTH05LockScreen | `/auth/lock` | `POST /auth/login` | `auth.lock.session`, `.invalid`, `.unlocked` |
| AUTH06OTP | `/auth/verify-otp` | `POST /auth/verify-otp`, `/auth/resend-otp` | `auth.otp.pending`, `.invalid`, `.expired`, `.verified` |
| AUTH07TeacherRegistration | `/auth/teacher-registration` | Redirect to Student application | `auth.teacher_entry.guest`, `.authenticated` |

### 2.2. Course và instructor

| UI file | Route | API chính | Fixture keys và state bắt buộc |
| --- | --- | --- | --- |
| COURSE01CourseCatalog | `/courses` | `GET /courses` | `catalog.populated`, `.empty`, `.filtered_empty`, `.error` |
| COURSE02CourseDetail | `/courses/:slug` | `GET /courses/{slug}` | `course.available`, `.in_cart`, `.payment_pending`, `.enrolled` |
| Course03EmptyState | `/courses/:slug` | `GET /courses/{slug}` | `course.not_found`, `.unpublished` |
| Course04_1CourseDetailCommentTab | `/courses/:slug?tab=comments` | `GET/PUT /courses/{slug}/reviews` | `reviews.populated`, `.empty`, `.enrolled_writer`, `.read_only` |
| Course04_2CourseDetailProgressLessonTab | `/courses/:slug?tab=progress` | `GET /learning/courses/{course_slug}/curriculum` | `course.curriculum_preview`, `.enrolled_progress` |
| Couser04_3CourseDetailInstructorPreviewTab | `/courses/:slug?tab=instructor` | `GET /courses/{slug}` | `course.instructor_summary` |
| INS01InstructorGrid | `/instructors` | `GET /instructors` | `instructors.grid`, `.empty` |
| INS02InstructorList | `/instructors?view=list` | `GET /instructors` | `instructors.list`, `.empty` |
| INS03InstructorDetail | `/instructors/:instructorId` | `GET /instructors/{instructor_id}` | `instructor.detail`, `.not_found` |

### 2.3. Student và learning

| UI file | Route | API chính | Fixture keys và state bắt buộc |
| --- | --- | --- | --- |
| STD01StudentDashboard | `/learn/:courseSlug/:lessonContentId` | Curriculum + content APIs | `learning.workspace.reading`, `.video`, `.quiz`, `.problem` |
| STD02StudentDashboardEnrolledCourse | `/student/courses` | `GET /student/enrollments` | `enrollments.populated`, `.empty` |
| STD03MyProfile | `/student/profile` | `GET /users/me`, profile patch | `profile.student`, `.validation_error`, `.saved` |
| STD03StudentFavorites | `/student/favorites` | `GET /users/me/favorite-courses` | `favorites.populated`, `.empty`, `.remove_undo` |
| STD04TeacherApplication | `/student/teacher-application` | Teacher application APIs | `teacher_application.none`, `.draft`, `.pending`, `.rejected`, `.approved` |
| CLASS01Workspace | `/learn/:courseSlug/:lessonContentId` | Curriculum + content APIs | `learning.workspace.*`, `.content_locked`, `.access_denied` |
| PROG01ProblemReading | `/learn/:courseSlug/:lessonContentId` | `GET /learning/contents/{id}` | `learning.problem_reading`, `.completed` |
| PROG02ProblemPreview | `/learn/:courseSlug/:lessonContentId` | Content + problem detail | `learning.problem_preview`, `.locked`, `.available` |
| PROG03ProblemVideo | `/learn/:courseSlug/:lessonContentId` | Video content/progress APIs | `learning.video.resume`, `.completed`, `.playback_error` |
| QUIZ02QuizPreview | `/learn/:courseSlug/quizzes/:quizId` | Content + create attempt | `quiz.preview.available`, `.attempt_limit`, `.passed` |
| QUIZ01QuizAttempt | `/learn/:courseSlug/quizzes/:quizId/attempts/:attemptId` | Attempt get/submit | `quiz.attempt.active`, `.failed`, `.passed`, `.locked` |

### 2.4. Online Judge

| UI file | Route | API chính | Fixture keys và state bắt buộc |
| --- | --- | --- | --- |
| OJ01ProblemList | `/online-judge/problems` | `GET /problems` | `judge.problems`, `.empty`, `.filtered_empty` |
| OJ02OnlineJudgeWorkspace | `/online-judge/problems/:slug` | Problem/run/submit/events APIs | `judge.workspace`, `.running`, `.accepted`, `.wrong_answer`, `.compile_error` |
| OJ03SubmissionHistory | `/online-judge/submissions` | `GET /submissions` | `judge.submissions`, `.empty`, `.pending` |

### 2.5. Commerce và AI Interview

| UI file | Route | API chính | Fixture keys và state bắt buộc |
| --- | --- | --- | --- |
| PAY01ShoppingCart | `/cart` | Cart APIs | `cart.one_course`, `.empty`, `.already_enrolled` |
| PAY02Checkout | `/checkout/:orderId` | Order + checkout APIs | `checkout.pending`, `.creating_link`, `.expired`, `.provider_error` |
| PAY03PaymentResult | `/checkout/:orderId/result` | `GET /orders/{order_id}/payment-result` | `payment.completed`, `.pending`, `.failed`, `.expired` |
| INTERVIEW03InterviewSetup | `/interview/setup` | `POST /interview-sessions` | `interview.setup`, `.permission_denied`, `.rate_limited` |
| INTERVIEW02AIInterview | `/interview/sessions/:sessionId` | Session/answer/finish APIs | `interview.active`, `.early_finish`, `.question_12`, `.provider_error` |
| INTERVIEW01InterviewReport | `/interview/sessions/:sessionId/report` | Report API | `interview.report_generating`, `.report_ready`, `.failed` |

### 2.6. Teacher và Admin

| UI file | Route | API chính | Fixture keys và state bắt buộc |
| --- | --- | --- | --- |
| TC01TeacherDashboard | `/teacher/dashboard` | Teacher courses/wallet/enrollments | `teacher.dashboard`, `.empty` |
| TC02TeacherProfile | `/teacher/profile` | Teacher profile APIs | `profile.teacher`, `.saved`, `.validation_error` |
| TC03ViewStudent | `/teacher/students` | Course enrollment APIs | `teacher.students`, `.empty` |
| TC04TeacherEarning | `/teacher/earnings` | Wallet/ledger APIs | `wallet.summary`, `.ledger_empty` |
| TC05TeacherCourseEnrollment | `/teacher/courses/:courseId/enrollments` | Course enrollments | `teacher.enrollments`, `.empty`, `.filtered` |
| TC06TeacherLessonContentBuilder | `/teacher/courses/:courseId/lessons/:lessonId/builder` | Lesson content APIs | `builder.reading`, `.video`, `.quiz`, `.problem`, `.validation_error` |
| TC07TeacherCurriculumReorder | `/teacher/courses/:courseId/curriculum` | Curriculum order API | `builder.curriculum`, `.saving`, `.stale_version` |
| TC08TeacherSubmissionReview | `/teacher/submissions` | Submission APIs | `teacher.submissions`, `.empty`, `.hidden_projection` |
| TC09TeacherStudentProgress | `/teacher/students` | Student progress API | `teacher.student_progress`, `.not_started`, `.completed` |
| TC10TeacherCourseStudent | `/teacher/students` | Course enrollment APIs | `teacher.course_students`, `.empty` |
| TC11TeacherCourseBuilder | `/teacher/courses/:courseId/builder` | Teacher course APIs | `builder.course_draft`, `.rejected`, `.pending`, `.published` |
| TC12TeacherLessonContentPreview | `/teacher/courses/:courseId/lessons/:lessonId/preview` | Teacher course/content APIs | `builder.lesson_preview`, `.empty` |
| TC13TeacherCodingProblemManagement | `/teacher/problems` | Teacher problem APIs | `teacher.problems`, `.empty`, `.testcase_upload`, `.validation_error` |
| TC14CourseApprovalStatus | `/teacher/courses/:courseId/review-status` | Teacher course get/submit review | `course_review.draft`, `.pending`, `.rejected`, `.published` |
| TC15TeacherWalletPayout | `/teacher/wallet` | Wallet/payout APIs | `wallet.summary`, `payout.pending`, `.processing`, `.completed`, `.rejected`, `.failed` |
| AD01TeacherRegistrationReview | `/admin/teacher-applications/:applicationId` | Admin Teacher review/OCR APIs | `admin.teacher_review.pending`, `.ocr_pending`, `.approved`, `.rejected` |
| AD02CourseApprovalReview | `/admin/course-reviews/:courseId` | Admin course review APIs | `admin.course_review.pending`, `.incomplete`, `.approved`, `.rejected` |

## 3. Canonical success fixtures

### 3.1. Current user

```json
{
  "data": {
    "id": "1001",
    "email": "student@example.com",
    "full_name": "Nguyen Minh Anh",
    "account_status": "ACTIVE",
    "roles": ["STUDENT"],
    "permissions": ["course:purchase", "learning:access", "interview:create"],
    "student_profile": {
      "avatar_url": "/mock/avatar/student-1001.webp",
      "bio": "Backend learner",
      "school": "HCMUTE",
      "major": "Software Engineering"
    },
    "teacher_application_status": "REJECTED"
  },
  "meta": { "request_id": "req_mock_user_01" }
}
```

### 3.2. Course catalog

```json
{
  "data": [
    {
      "id": "2001",
      "slug": "python-backend-foundations",
      "title": "Python Backend Foundations",
      "thumbnail_url": "/mock/courses/python-backend.webp",
      "instructor": { "id": "1101", "full_name": "Tran Gia Bao" },
      "price_vnd": 499000,
      "average_rating": 4.8,
      "review_count": 128,
      "is_favorite": true,
      "viewer_state": "AVAILABLE"
    }
  ],
  "meta": {
    "request_id": "req_mock_catalog_01",
    "page": 1,
    "page_size": 20,
    "total_items": 1,
    "total_pages": 1
  }
}
```

### 3.3. Course detail và curriculum

```json
{
  "data": {
    "id": "2001",
    "slug": "python-backend-foundations",
    "title": "Python Backend Foundations",
    "description": "Xay dung API Python tu nen tang den production.",
    "status": "PUBLISHED",
    "price_vnd": 499000,
    "viewer_state": "ENROLLED",
    "progress_percent": 42,
    "instructor": {
      "id": "1101",
      "full_name": "Tran Gia Bao",
      "headline": "Senior Backend Engineer",
      "average_rating": 4.9
    },
    "sections": [
      {
        "id": "3001",
        "title": "Khoi dong",
        "position": 1,
        "lessons": [
          {
            "id": "3101",
            "title": "HTTP va REST",
            "position": 1,
            "contents": [
              { "id": "3201", "content_type": "READING", "position": 1, "status": "COMPLETED", "is_locked": false },
              { "id": "3202", "content_type": "VIDEO", "position": 2, "status": "IN_PROGRESS", "watched_percent": 64, "is_locked": false },
              { "id": "3203", "content_type": "QUIZ", "position": 3, "status": "NOT_STARTED", "is_locked": true }
            ]
          }
        ]
      }
    ]
  },
  "meta": { "request_id": "req_mock_course_01" }
}
```

### 3.4. Teacher application states

```json
{
  "data": {
    "id": "4001",
    "user_id": "1001",
    "status": "REJECTED",
    "motivation": "Toi muon chia se kinh nghiem backend.",
    "cccd_masked": "********1234",
    "cccd_front_upload_id": "up_401",
    "cccd_back_upload_id": "up_402",
    "cv_upload_id": "up_403",
    "reviewed_by": "9001",
    "reviewed_note": "Anh mat truoc bi loe, vui long tai lai.",
    "submitted_at": "2026-08-08T04:00:00Z",
    "reviewed_at": "2026-08-09T02:15:00Z",
    "version": 2
  },
  "meta": { "request_id": "req_mock_teacher_application_01" }
}
```

Admin OCR variant bổ sung:

```json
{
  "data": {
    "status": "COMPLETED",
    "ocr_text_masked": "NGUYEN M*** A*** - ********1234",
    "cccd_last_four": "1234",
    "front_quality_score": 61,
    "back_quality_score": 94,
    "warnings": ["FRONT_GLARE_DETECTED"],
    "provider": "CLOUDFLARE_WORKERS_AI",
    "completed_at": "2026-08-08T04:02:10Z"
  },
  "meta": { "request_id": "req_mock_ocr_01" }
}
```

### 3.5. Quiz attempt

```json
{
  "data": {
    "id": "5001",
    "quiz_id": "5101",
    "lesson_content_id": "3203",
    "attempt_number": 2,
    "max_attempts": 3,
    "status": "IN_PROGRESS",
    "pass_score": 70,
    "questions": [
      {
        "id": "5201",
        "question_type": "SINGLE_CHOICE",
        "prompt": "HTTP status nao phu hop khi tao resource?",
        "options": [
          { "id": "5301", "content": "200" },
          { "id": "5302", "content": "201" },
          { "id": "5303", "content": "204" }
        ]
      }
    ],
    "started_at": "2026-08-10T08:00:00Z"
  },
  "meta": { "request_id": "req_mock_quiz_01" }
}
```

Submitted variant đổi `status` thành `COMPLETED` và bổ sung `score`, `passed`, `remaining_attempts`, `submitted_at`; correct answer chỉ xuất hiện sau submit theo policy.

### 3.6. Judge workspace và result

```json
{
  "data": {
    "id": "6001",
    "slug": "two-sum",
    "title": "Two Sum",
    "difficulty": "EASY",
    "statement": "Tim hai chi so co tong bang target.",
    "samples": [
      { "input": "4\n2 7 11 15\n9", "output": "0 1" }
    ],
    "languages": [
      { "id": "61", "name": "Python", "version": "3.12", "editor_language": "python" }
    ],
    "submission": {
      "id": "6101",
      "status": "WRONG_ANSWER",
      "score": 60,
      "runtime_ms": 42,
      "memory_kb": 18432,
      "visible_testcase_results": [
        { "index": 1, "status": "ACCEPTED", "runtime_ms": 11, "is_hidden": false },
        { "index": 2, "status": "WRONG_ANSWER", "runtime_ms": 9, "is_hidden": true }
      ]
    }
  },
  "meta": { "request_id": "req_mock_judge_01" }
}
```

Hidden testcase không có `input`, `expected_output` hoặc raw `actual_output`.

### 3.7. Cart, checkout và payment result

```json
{
  "data": {
    "id": "7001",
    "status": "PENDING",
    "student_id": "1001",
    "item": {
      "course_id": "2001",
      "title": "Python Backend Foundations",
      "thumbnail_url": "/mock/courses/python-backend.webp",
      "price_vnd": 499000
    },
    "total_amount_vnd": 499000,
    "payment": {
      "status": "PENDING",
      "method": "PAYOS",
      "checkout_url": "https://pay.example.test/order/mock-7001",
      "qr_code_url": "/mock/payments/qr-7001.png",
      "expires_at": "2026-08-10T09:30:00Z"
    },
    "enrollment_id": null,
    "created_at": "2026-08-10T09:00:00Z",
    "completed_at": null
  },
  "meta": { "request_id": "req_mock_order_01" }
}
```

Completed variant dùng order `COMPLETED`, payment `COMPLETED`, có `enrollment_id`; failed/expired variant luôn có `enrollment_id: null`.

### 3.8. Teacher course moderation

```json
{
  "data": {
    "id": "2001",
    "title": "Python Backend Foundations",
    "status": "REJECTED",
    "version": 7,
    "review_checklist": {
      "metadata_complete": true,
      "has_curriculum": true,
      "has_preview": true,
      "content_policy_passed": false
    },
    "latest_review": {
      "reviewed_by": "9001",
      "reviewed_note": "Video bai 3 khong phat duoc.",
      "reviewed_at": "2026-08-09T11:20:00Z"
    },
    "history": [
      { "from": "DRAFT", "to": "PENDING_REVIEW", "at": "2026-08-09T09:00:00Z" },
      { "from": "PENDING_REVIEW", "to": "REJECTED", "at": "2026-08-09T11:20:00Z" }
    ]
  },
  "meta": { "request_id": "req_mock_course_review_01" }
}
```

### 3.9. Wallet và payout

```json
{
  "data": {
    "wallet": {
      "currency": "VND",
      "available_balance_vnd": 842000,
      "reserved_balance_vnd": 200000,
      "lifetime_revenue_vnd": 4200000,
      "teacher_share_percent": 80,
      "platform_share_percent": 20
    },
    "payout_requests": [
      {
        "id": "8001",
        "amount_vnd": 200000,
        "status": "PROCESSING",
        "bank_name": "Vietcombank",
        "bank_account_number_masked": "******6789",
        "requested_at": "2026-08-09T03:00:00Z",
        "reviewed_at": "2026-08-09T06:00:00Z"
      }
    ]
  },
  "meta": { "request_id": "req_mock_wallet_01" }
}
```

### 3.10. AI Interview session và report

```json
{
  "data": {
    "id": "9001",
    "topic": "Python Backend",
    "level": "JUNIOR",
    "status": "ACTIVE",
    "question_count": 4,
    "max_questions": 12,
    "messages": [
      { "id": "9101", "sender": "AI", "question_index": 4, "content": "Hay giai thich idempotency trong REST API.", "created_at": "2026-08-10T10:00:00Z" },
      { "id": "9102", "sender": "STUDENT", "question_index": 4, "content": "Idempotency dam bao lap lai request khong tao them side effect.", "created_at": "2026-08-10T10:01:00Z" }
    ],
    "started_at": "2026-08-10T09:50:00Z",
    "ended_at": null
  },
  "meta": { "request_id": "req_mock_interview_01" }
}
```

Report-ready variant:

```json
{
  "data": {
    "session_id": "9001",
    "status": "COMPLETED",
    "overall_score": 78.5,
    "skill_scores": { "technical": 82, "communication": 74, "problem_solving": 79 },
    "strengths": "Nam chac HTTP va API design.",
    "weaknesses": "Can noi ro hon ve transaction boundary.",
    "suggestions": "Luyen system design va failure handling.",
    "generated_at": "2026-08-10T10:20:00Z"
  },
  "meta": { "request_id": "req_mock_report_01" }
}
```

### 3.11. Teacher dashboard và Student progress

```json
{
  "data": {
    "summary": {
      "published_courses": 3,
      "pending_courses": 1,
      "active_students": 248,
      "available_balance_vnd": 842000
    },
    "students": [
      {
        "student_id": "1001",
        "full_name": "Nguyen Minh Anh",
        "course_id": "2001",
        "course_title": "Python Backend Foundations",
        "progress_percent": 42,
        "completed_contents": 8,
        "total_contents": 19,
        "last_activity_at": "2026-08-10T08:12:00Z"
      }
    ]
  },
  "meta": { "request_id": "req_mock_teacher_dashboard_01" }
}
```

## 4. Canonical error fixtures

```json
{
  "error": {
    "code": "ATTEMPT_LIMIT_REACHED",
    "message": "Bạn đã sử dụng hết số lần làm bài.",
    "details": [
      { "field": "quiz_id", "reason": "max_attempts_reached", "value": "5101" }
    ],
    "request_id": "req_mock_error_01"
  }
}
```

Các error fixture tối thiểu FE phải có: `AUTH_REQUIRED`, `RESOURCE_FORBIDDEN`, `RESOURCE_NOT_FOUND`, `VALIDATION_ERROR`, `STALE_RESOURCE_VERSION`, `COURSE_ALREADY_ENROLLED`, `PAYMENT_EXPIRED`, `CONTENT_LOCKED`, `ATTEMPT_LIMIT_REACHED`, `JUDGE_UNAVAILABLE`, `REPORT_NOT_READY`, `INSUFFICIENT_AVAILABLE_BALANCE`, `FILE_SCAN_PENDING`.

## 5. Mock adapter rules

1. Mock mutation phải cập nhật store để lần GET tiếp theo phản ánh state mới.
2. Transition ngoài state machine trả đúng `409` và error code domain.
3. Dùng delay xác định được: list/detail `150 ms`, mutation `300 ms`, AI/Judge job do test chủ động advance.
4. Không dùng random data trong test; clock và ID generator phải inject/freeze.
5. PayOS mock không tự complete khi tạo checkout; test phải phát signed webhook fixture.
6. Judge mock đi qua `PENDING -> RUNNING -> terminal status`.
7. Interview mock đi qua `ACTIVE -> REPORT_GENERATING -> COMPLETED|FAILED`.
8. Payout mock đi qua `PENDING -> APPROVED -> PROCESSING -> COMPLETED|FAILED`, hoặc `PENDING -> REJECTED`.
9. Private upload mock trả signed URL hết hạn và không bao giờ đặt raw CCCD/CV vào public fixture bundle.
10. Mọi page phải có loading, success, empty nếu phù hợp, permission/error và action feedback state trước khi nối backend thật.
