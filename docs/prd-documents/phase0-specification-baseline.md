# Phase 0 Specification Baseline

## Phạm vi

Tài liệu này là output của P0-T01 đến P0-T04. Nó khóa các quyết định nghiệp vụ cần thiết để FE làm mock flow, BE viết API contract và database migration không mâu thuẫn.

Nguồn ưu tiên, theo thứ tự:

1. `prd.md` - nghiệp vụ đã chốt với Product Owner.
2. `tdd.md` - luồng kỹ thuật và công nghệ cốt lõi.
3. `DATABASE.txt` - schema database mục tiêu.
4. Wireframe trong `docs/ui` - bố cục, state và hành vi UI.
5. `api_spec.md` và `application-flow.mmd` - tài liệu legacy, phải cập nhật ở P0-T05.

## P0-T01: Kết quả review tài liệu

| Chủ đề | Quyết định baseline | Tài liệu legacy cần cập nhật |
| --- | --- | --- |
| Teacher profile | Tạo khi Student gửi application; quyền Teacher chỉ active khi Admin approve | `application-flow.mmd` đang tạo/activate profile sau approve |
| Course moderation | Teacher tạo Draft, chủ động Submit for review; Admin Approve/Reject; Teacher có thể resubmit | `api_spec.md` đang cho Admin đổi status trực tiếp, thiếu submit/reject note |
| Commerce | Cart tồn tại theo User; mỗi Order mua một Course; Order/Transaction/Enrollment là các thực thể riêng | `application-flow.mmd` và `api_spec.md` còn tạo transaction trực tiếp từ course |
| Payment | PayOS webhook hợp lệ, idempotent tạo Enrollment đúng một lần | API cũ thiếu order state, replay/idempotency và payment result state |
| Finance | Payment hoàn thành ghi 80% Teacher, 20% Platform vào ledger; payout tối thiểu 1.000 VND do Admin duyệt | Model/API cũ chưa có wallet, ledger, payout |
| Learning | Lesson content có Reading, Video, Quiz, Problem theo position | API/model cũ thiếu `VIDEO` content type |
| Completion | Video hoàn thành ở 100%; Quiz/Problem theo pass score + max attempts do Teacher cấu hình; Reading hiển thị progress nhưng không là completion gate mặc định | API cũ cho complete reading/video trực tiếp, không có score/attempt/watched-percent policy |
| Quiz | Attempt có số thứ tự; backend tính score; retry theo max attempts | Model/API cũ chỉ có quiz submission JSON đơn giản |
| Judge | Chấm theo testcase, không lộ hidden input/output; Accepted phù hợp cập nhật progress | Giữ core schema, bổ sung authorization/result projection |
| AI Interview | Tối đa 12 câu, AI có thể kết thúc sớm; chỉ lưu text chat và một final report/session | Session bool status, sender string và report 1-n trong model cũ |
| Notification/audit | Payment, Teacher review, Course review, Judge, AI report, Payout phải phát notification và audit | Model cũ thiếu notification type/target audit |

### Mâu thuẫn đã được giải quyết

- `TeacherRegisterStatus.AGREE/REJECT` được thay thế về mặt nghiệp vụ bởi `APPROVED/REJECTED`.
- `CourseStatus` có thêm `REJECTED`; chỉ course `PUBLISHED` được public.
- `Transaction.amount` không còn là nguồn sự thật duy nhất; Order giữ trạng thái mua, Transaction giữ payment, Enrollment giữ access.
- Không dùng Float cho wallet/ledger mới; dùng BIGINT VND.
- Microphone/camera trong AI Interview là permission/session UI, không phải media recording persistence.

## P0-T02: Permission matrix

`Approved Teacher` nghĩa là User có Teacher role và `teacher_profile.application_status = APPROVED`.

| Capability | Guest | Student | Teacher pending/rejected | Approved Teacher | Admin |
| --- | --- | --- | --- | --- | --- |
| Browse catalog, course detail, instructor | Yes | Yes | Yes | Yes | Yes |
| Add/remove own favorite | No | Yes | Yes | Yes | Yes |
| Create/update own Student profile | No | Yes | Yes | Yes | Yes |
| Submit Teacher application | No | Yes | Edit/resubmit own application | No | No |
| Create/modify own course | No | No | No | Yes | Yes, moderation only |
| Submit own course for review | No | No | No | Yes | No |
| Approve/reject Teacher application | No | No | No | No | Yes |
| Approve/reject course | No | No | No | No | Yes |
| View enrolled course content | No | Own enrollment | Own enrollment | Own enrollment | Yes |
| Review course | No | Own enrollment only | Own enrollment only | Own enrollment only | Moderate only |
| Add cart/create order | No | Yes, if not enrolled | Yes, if not enrolled | Yes, if not enrolled | No |
| Run/submit public problem | No | Yes | Yes | Yes | Yes |
| Create/manage own problem/quiz/testcase | No | No | No | Yes | Yes |
| View own Teacher wallet/request payout | No | No | No | Yes | No |
| Approve/reject payout | No | No | No | No | Yes |
| Create AI interview/view own report | No | Yes | Yes | Yes | Yes, audit only |
| Read own notifications | No | Yes | Yes | Yes | Yes |
| Ban user/view audit log | No | No | No | No | Yes |

### Authorization rules

1. Role check không thay thế ownership check.
2. Approved Teacher chỉ thao tác Course/Quiz/Problem mà `teacher_id` thuộc về current user.
3. Admin review không tự động trở thành owner của Teacher resource.
4. Student chỉ truy cập course content khi có Enrollment, trừ preview content được public rõ ràng.
5. Payment webhook không dùng user JWT; chỉ chấp nhận chữ ký PayOS hợp lệ.

## P0-T03: Route map

### Public và auth

| UI file/group | Route baseline | Guard |
| --- | --- | --- |
| AUTH01 Login | `/auth/login` | Guest only |
| AUTH02 Register | `/auth/register` | Guest only |
| AUTH03 Forgot password | `/auth/forgot-password` | Guest only |
| AUTH04 Set password | `/auth/set-password` | Guest/reset token |
| AUTH05 Lock screen | `/auth/lock` | Authenticated session |
| AUTH06 OTP | `/auth/verify-otp` | Pending activation |
| AUTH07 Teacher registration | `/auth/teacher-registration` | Guest/legacy entry; redirect to Student application after login |
| COURSE01 Catalog | `/courses` | Public |
| COURSE02/Course04 Detail tabs | `/courses/:slug` | Public |
| Course03 Empty | `/courses/:slug` not-found state | Public |
| INS01/INS02 Instructors | `/instructors` | Public |
| INS03 Instructor detail | `/instructors/:instructorId` | Public |

### Student và learning

| UI file/group | Route baseline | Guard |
| --- | --- | --- |
| STD01/CLASS01 Workspace | `/learn/:courseSlug/:lessonContentId` | Enrollment or preview access |
| STD02 Enrolled courses | `/student/courses` | Authenticated |
| STD03 My Profile | `/student/profile` | Authenticated |
| STD03 Favorites | `/student/favorites` | Authenticated |
| STD04 Teacher application | `/student/teacher-application` | Authenticated; not approved Teacher |
| PROG01/02/03 Learning content | `/learn/:courseSlug/:lessonContentId` | Enrollment |
| QUIZ02 Preview | `/learn/:courseSlug/quizzes/:quizId` | Enrollment |
| QUIZ01 Attempt | `/learn/:courseSlug/quizzes/:quizId/attempts/:attemptId` | Enrollment + attempts available |

### Commerce

| UI file/group | Route baseline | Guard |
| --- | --- | --- |
| PAY01 Cart | `/cart` | Authenticated |
| PAY02 Checkout | `/checkout/:orderId` | Order owner |
| PAY03 Payment result | `/checkout/:orderId/result` | Order owner |

### Online Judge

| UI file/group | Route baseline | Guard |
| --- | --- | --- |
| OJ01 Problem list | `/online-judge/problems` | Public/Auth for submit |
| OJ02 Workspace | `/online-judge/problems/:slug` | Authenticated to run/submit |
| OJ03 Submission history | `/online-judge/submissions` | Authenticated, own submissions |
| TC13 Problem management | `/teacher/problems` | Approved Teacher |

### Teacher và Admin

| UI file/group | Route baseline | Guard |
| --- | --- | --- |
| TC01 Dashboard | `/teacher/dashboard` | Approved Teacher |
| TC02 Profile | `/teacher/profile` | Approved Teacher |
| TC03/TC09/TC10 Students/progress | `/teacher/students` | Approved Teacher + ownership |
| TC04 Earnings | `/teacher/earnings` | Approved Teacher |
| TC05 Enrollment | `/teacher/courses/:courseId/enrollments` | Approved Teacher + ownership |
| TC06 Lesson builder | `/teacher/courses/:courseId/lessons/:lessonId/builder` | Approved Teacher + ownership |
| TC07 Curriculum reorder | `/teacher/courses/:courseId/curriculum` | Approved Teacher + ownership |
| TC08 Submission review | `/teacher/submissions` | Approved Teacher + assigned problem/course |
| TC11 Course builder | `/teacher/courses/:courseId/builder` | Approved Teacher + ownership |
| TC12 Lesson preview | `/teacher/courses/:courseId/lessons/:lessonId/preview` | Approved Teacher + ownership |
| TC14 Course approval status | `/teacher/courses/:courseId/review-status` | Approved Teacher + ownership |
| TC15 Wallet/payout | `/teacher/wallet` | Approved Teacher |
| AD01 Teacher review | `/admin/teacher-applications/:applicationId` | Admin |
| AD02 Course review | `/admin/course-reviews/:courseId` | Admin |

### AI Interview

| UI file/group | Route baseline | Guard |
| --- | --- | --- |
| INTERVIEW03 Setup | `/interview/setup` | Authenticated |
| INTERVIEW02 Active session | `/interview/sessions/:sessionId` | Session owner |
| INTERVIEW01 Report | `/interview/sessions/:sessionId/report` | Session owner or Admin audit |

## P0-T04: Status transition baseline

### Teacher application

~~~mermaid
stateDiagram-v2
    [*] --> DRAFT
    DRAFT --> PENDING: submit
    PENDING --> APPROVED: admin approve
    PENDING --> REJECTED: admin reject with note
    REJECTED --> DRAFT: candidate edit
    APPROVED --> APPROVED: access teacher features
~~~

### Course

~~~mermaid
stateDiagram-v2
    [*] --> DRAFT
    DRAFT --> PENDING_REVIEW: teacher submit
    PENDING_REVIEW --> PUBLISHED: admin approve
    PENDING_REVIEW --> REJECTED: admin reject with note
    REJECTED --> DRAFT: teacher edit
    PUBLISHED --> ARCHIVED: teacher or admin archive
    ARCHIVED --> DRAFT: authorized restore
~~~

### Order and payment transaction

~~~mermaid
stateDiagram-v2
    [*] --> PENDING
    PENDING --> PAID: verified PayOS webhook
    PENDING --> FAILED: verified failure callback
    PENDING --> EXPIRED: payment link expired
    PENDING --> CANCELLED: owner cancels before payment
    PAID --> COMPLETED: transaction recorded and enrollment created
    COMPLETED --> REFUNDED: authorized refund flow
~~~

### Lesson content progress

~~~mermaid
stateDiagram-v2
    [*] --> NOT_STARTED
    NOT_STARTED --> IN_PROGRESS: open content or record watch/attempt
    IN_PROGRESS --> COMPLETED: video watched 100%
    IN_PROGRESS --> COMPLETED: quiz score meets pass score
    IN_PROGRESS --> COMPLETED: problem Accepted and score meets pass score
    IN_PROGRESS --> IN_PROGRESS: retry available
    IN_PROGRESS --> LOCKED: attempts exhausted without pass
~~~

`LOCKED` is a UI/computed state from max attempts; it does not need to be persisted as a separate `ProgressStatus` enum value unless implementation requires it.

### Interview session

~~~mermaid
stateDiagram-v2
    [*] --> ACTIVE
    ACTIVE --> ACTIVE: send answer and next question
    ACTIVE --> REPORT_GENERATING: AI early finish or question count reaches 12
    ACTIVE --> ABORTED: student ends before completion
    ACTIVE --> FAILED: unrecoverable provider error
    REPORT_GENERATING --> COMPLETED: one final report saved
    REPORT_GENERATING --> FAILED: report generation exhausts retries
~~~

`REPORT_GENERATING` là state session đã kết thúc phần hỏi đáp nhưng report chưa sẵn sàng. UI hiển thị trạng thái đang tạo report, thay vì coi việc chưa có `interview_report` là lỗi.

### Payout request

~~~mermaid
stateDiagram-v2
    [*] --> PENDING
    PENDING --> APPROVED: admin approve
    PENDING --> REJECTED: admin reject with note
    APPROVED --> PROCESSING: reserve balance and send settlement
    PROCESSING --> COMPLETED: bank settlement succeeds
    PROCESSING --> FAILED: settlement fails, release reserve
~~~

`REJECTED` chỉ thể hiện quyết định từ chối của Admin trước khi chi trả. `FAILED` là lỗi kỹ thuật sau approve và phải được bù trừ bằng wallet ledger mới.

## Phase 0 acceptance evidence

- Permission matrix is complete for all role-sensitive UI groups.
- Route map covers 47 asset-backed wireframes and 6 business-flow wireframes by feature group.
- All workflow statuses have a transition owner and forbidden transition is denied at service layer.
- Legacy API/flow differences are recorded for P0-T05 instead of being silently carried forward.
