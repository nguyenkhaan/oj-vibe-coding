# 

| Database cũ | UI/nghiệp vụ mới | Vấn đề |
| --- | --- | --- |
| quiz_submission.answers JSON | QUIZ01 cần attempt number và navigation state | Không có lifecycle attempt rõ ràng |
| quiz.attempts Gap Analysis - Database, Business Logic và UI

## Phạm vi đối chiếu

- Database cũ: các model/migration trong src/backend/business-application/src/models và alembic/versions.
- Database mới đề xuất: DATABASE.txt.
- Nghiệp vụ chuẩn: prd.md.
- UI hiện tại: docs/ui, bao gồm wireframe từ asset và wireframe nghiệp vụ bổ sung.
- Đây là tài liệu phân tích và đồng bộ specification; chưa chạy migration hoặc sửa trực tiếp model backend.

## 1. Database cũ chưa khớp với UI và nghiệp vụ mới

### 1.1. User, Teacher và Admin

| Database cũ | UI/nghiệp vụ mới | Vấn đề |
| --- | --- | --- |
| teacher_profile.verified: bool | Student tạo profile trước, Admin duyệt sau | Không biểu diễn được Pending/Approved/Rejected |
| teacher_register.status = AGREE/REJECT/PENDING | Teacher có thể bị reject, sửa và resubmit | Enum cũ không thể hiện rõ application lifecycle |
| Không có quyền riêng gắn với trạng thái approval | Teacher chưa approved không được tạo course | Role Teacher đơn thuần là chưa đủ để authorize |
| user.active và account_status cùng tồn tại | UI cần phân biệt account bị ban và account chưa active | Chưa có quy tắc trạng thái rõ ràng |

### 1.2. Course và moderation

| Database cũ | UI/nghiệp vụ mới | Vấn đề |
| --- | --- | --- |
| courses.status có Draft/Pending/Published/Archived | Teacher gửi Admin, Admin approve/reject, Teacher resubmit | Thiếu Rejected và dữ liệu reviewer |
| Không có submitted_at, reviewed_by, reviewed_note, reviewed_at | AD02 cần queue, preview, decision note | Không lưu được lịch sử quyết định |
| course.rating là một số đơn | Course detail/review/favorites | Không có bảng review làm nguồn tính rating |
| Không có favorites | Student Favorites UI | Không thể lưu trạng thái favorite |
| tags là chuỗi | Filter/tag UI | Không có cấu trúc tag/query ổn định |

### 1.3. Commerce và enrollment

| Database cũ | UI/nghiệp vụ mới | Vấn đề |
| --- | --- | --- |
| transaction gắn trực tiếp user_id/course_id | Cart, Order, OrderItem, Payment Result | Không có lifecycle Cart/Order |
| Không có Cart/CartItem | PAY01 Shopping Cart | Không lưu được cart hiện tại |
| Không có Order/OrderItem | Mỗi order một course, lưu giá tại thời điểm mua | Không có order idempotency và price snapshot |
| amount dùng Float | Thanh toán và chia doanh thu | Có rủi ro sai số tiền |
| enrollment chưa có unique constraint trong model | Không mua lại course đã enrollment | Có thể tạo duplicate enrollment nếu service không chặn |
| Không có trạng thái payment result đầy đủ | Pending/Failed/Expired/Completed UI | Không có lifecycle rõ ràng cho checkout |

### 1.4. Wallet, revenue và payout

| Database cũ | UI/nghiệp vụ mới | Vấn đề |
| --- | --- | --- |
| Không có wallet | Teacher Wallet KPI | Không có available/pending balance |
| Không có ledger | Chia 80% Teacher/20% Platform | Không audit được từng khoản doanh thu |
| Không có payout request | Teacher gửi rút tiền, Admin duyệt | Không có workflow payout |
| Không có minimum payout rule | Tối thiểu 1.000 VND | Không có constraint nghiệp vụ |

### 1.5. Lesson content và progress

| Database cũ | UI/nghiệp vụ mới | Vấn đề |
| --- | --- | --- |
| Có Reading/Quiz/Problem, chưa có Video model | Lesson có Reading, Video, Quiz, Problem | Không có thực thể video |
| lesson_content.content_id polymorphic, không có FK | Builder phải bảo đảm content type/id hợp lệ | DB không bảo vệ được liên kết |
| Progress chỉ có completed: bool | Video 100%, Quiz/Problem theo score | Không lưu watched percent/best score |
| Không có pass_score, max_attempts ở content | Teacher cấu hình ngưỡng và retry | Không lưu được policy theo lesson content |
| Không có attempt history content-level | UI cần retry và progress | Không phân biệt lần thử và trạng thái hiện tại |

### 1.6. Quiznullable | Teacher đặt số lần làm lại | Chưa có ràng buộc và counter theo Student |
| Không có unique theo quiz/student/attempt | Giới hạn retry | Có thể submit trùng hoặc vượt giới hạn |
| Chưa lưu snapshot đáp án/score policy | Review kết quả ổn định | Thay đổi quiz có thể ảnh hưởng lịch sử |

### 1.7. Online Judge

| Database cũ | UI/nghiệp vụ mới | Vấn đề |
| --- | --- | --- |
| Đã có Problem, Language, Config, Testcase, Submission, Result Detail | OJ UI cần các thành phần này | Core schema tương đối khớp |
| problem.public: bool | UI cần Public/Private | Nên dùng enum visibility |
| Result detail có status/runtime/memory | UI hiển thị testcase result | Cần output preview an toàn |
| Testcase có input/output file | Hidden testcase không lộ dữ liệu | Cần rule projection/service, không trả raw hidden data |
| user_history.problem_count | Progress theo course content | Không thay thế được lesson content progress |

### 1.8. AI Interview

| Database cũ | UI/nghiệp vụ mới | Vấn đề |
| --- | --- | --- |
| interview_session.status: bool | Active/Completed/Aborted/Failed | Bool không đủ trạng thái |
| Không có question count/max question | Tối đa 12 câu, có thể kết thúc sớm | Không lưu được giới hạn và tiến độ |
| sender: string tự do | AI/Student/System | Dễ phát sinh giá trị không chuẩn |
| Một session có thể có nhiều report | Nghiệp vụ chỉ có một report cuối | Cần unique session/report |
| UI có microphone/camera | Chỉ lưu chat/report, không lưu media | Cần thông báo permission và data policy ở UI |

### 1.9. Notification và audit

| Database cũ | UI/nghiệp vụ mới | Vấn đề |
| --- | --- | --- |
| Notification chỉ có content/is_read | Payment, Teacher, Course, Judge, AI, Payout events | Không phân loại event |
| Audit action có SOMETHING | Admin review, payout, payment webhook | Không có target actor rõ ràng |
| Audit chỉ có user/action/note | Cần truy vết course/order/payout | Thiếu target type/id |

## 2. Database đã bổ sung và thay đổi

Nguồn schema chi tiết: DATABASE.txt.

### 2.1. Enum mới hoặc chuẩn hóa

- Thêm TeacherApplicationStatus: PENDING, APPROVED, REJECTED.
- Mở rộng CourseStatus: thêm REJECTED.
- Thêm LessonContentType.VIDEO.
- Thêm ProgressStatus.
- Đổi Problem public boolean thành ProblemVisibility.
- Thêm QuizQuestionType.
- Thêm OrderStatus, PaymentStatus đầy đủ.
- Thêm WalletEntryType, PayoutStatus.
- Thêm InterviewStatus, InterviewMessageSender.
- Thêm NotificationType, ReviewStatus.
- Các enum cũ cần migration dữ liệu và compatibility mapping, không đổi trực tiếp khi chưa có migration plan.

### 2.2. Bảng mới

- Commerce: cart, cart_item, order, order_item.
- Finance: wallet, wallet_ledger, payout_request.
- Social commerce: course_favorite, course_review.
- Learning: video_content, quiz_attempt.
- Moderation support: các cột review/approval mới trong teacher_profile, teacher_register, courses.
- Interview support: report unique/session metadata mới.

### 2.3. Bảng hiện tại được thay đổi

| Bảng hiện tại | Thay đổi trong database mới |
| --- | --- |
| user | password thành password_hash, thêm soft delete rõ ràng |
| teacher_profile | Thêm application status và verified timestamp |
| teacher_register | Dùng application status chuẩn, giữ reviewer/note/history |
| courses | Thêm rejected/review metadata, đổi price sang VND integer, rating aggregate |
| enrollment | Unique student/course để chặn mua lại |
| lesson_content | Thêm Video, pass score, max attempts |
| lesson_content_progress | Thêm status, watched percent, best score, attempt count |
| quiz/quizzes | Chuẩn hóa tên và policy pass/max attempts |
| quiz_submission | Chuyển thành quiz_attempt có attempt number |
| problem | Visibility enum và metadata updated_at |
| transaction | Gắn với order, lưu amount VND integer và PayOS lifecycle |
| interview_session | Status enum, question count, max 12 |
| interview_message | Sender enum và question index |
| interview_reports | Một report/session, thêm skill scores |
| notification | Thêm notification type |
| audit_log | Đổi thành actor/target/action/note/time |

### 2.4. Quy tắc dữ liệu quan trọng

- Một User có thể có nhiều role.
- TeacherProfile được tạo trước khi Admin approve, nhưng authorization phải chặn chức năng Teacher khi chưa approved.
- Một Order hiện chỉ chứa một course; order_item vẫn lưu price snapshot và giữ khả năng mở rộng.
- Payment webhook phải verify signature và idempotent theo transaction/PayOS code.
- Payment success tạo Enrollment đúng một lần.
- Course đã enrollment không được mua lại nhưng vẫn truy cập sau archive.
- Wallet ledger là immutable; payout tối thiểu 1.000 VND và do Admin duyệt.
- Content polymorphic phải được validate tại service theo content_type/content_id.
- AI session tối đa 12 câu và chỉ có một report cuối.

## 3. UI cần bổ sung/chỉnh sửa để đồng bộ

### 3.1. Màn hình mới cần thêm

| File | Nhóm | Lý do |
| --- | --- | --- |
| STD04TeacherApplication.md | Student | Form TeacherProfile, CCCD, CV, application status, resubmit |
| TC14CourseApprovalStatus.md | Teacher | Draft/Pending/Rejected/Published và submit/resubmit |
| TC15TeacherWalletPayout.md | Teacher | Balance, 80/20, minimum 1.000 VND, payout request |
| AD02CourseApprovalReview.md | Admin | Queue, content preview, approve/reject/request changes |
| PAY03PaymentResult.md | Payment | Completed/Pending/Failed/Expired, enrollment result |
| INTERVIEW03InterviewSetup.md | Interview | Topic, level, max 12, media permission and storage notice |

### 3.2. File UI hiện tại cần chỉnh sửa

| File | Nội dung cần bổ sung/chỉnh sửa |
| --- | --- |
| COURSE01CourseCatalog.md | Chỉ hiển thị course Published; trạng thái đã enrollment dùng Continue; favorite persistent |
| COURSE02CourseDetail.md | Chặn mua lại; enroll sau payment; archive vẫn truy cập; review chỉ cho enrolled student |
| TC11TeacherCourseBuilder.md | Thêm Submit for review, checklist, rejected note và resubmit |
| TC06TeacherLessonContentBuilder.md | Thêm Video, pass score, max attempts và reorder content |
| QUIZ01QuizAttempt.md | Hiển thị attempts còn lại, pass score, khóa submit khi hết lượt |
| QUIZ02QuizPreview.md | Hiển thị passing score, max attempts và Resume quiz nếu có attempt active |
| PROG02ProblemPreview.md | Hiển thị pass score, Accepted requirement và hidden testcase policy |
| PROG03ProblemVideo.md | Progress watched percent; chỉ completed ở 100% |
| PAY01ShoppingCart.md | Gắn cart với user; chặn course đã enrollment; xử lý empty/expired cart |
| PAY02Checkout.md | Một order một course; PayOS pending/webhook/idempotency; 80/20 ledger |
| INTERVIEW02AIInterview.md | Hiển thị max 12, early finish, microphone/camera permission, không lưu media |
| INTERVIEW01InterviewReport.md | Một report/session, report ready notification, skill scores |
| AD01TeacherRegistrationReview.md | Application status và resubmit history rõ ràng |
| TC04TeacherEarning.md | Liên kết số liệu wallet/ledger; thêm payout entry point |
| STD02StudentDashboardEnrolledCourse.md | Hiển thị payment/enrollment result và progress theo content |
| STD03StudentFavorites.md | Dữ liệu favorite từ course_favorite, empty/remove/undo state |
| Course04_1CourseDetailCommentTab.md | Review/rating course từ course_review, enrolled-only write rule |

### 3.3. Những UI không cần đổi schema lớn

- OJ01/OJ02/OJ03: core model đã đáp ứng; chỉ cần bổ sung authorization và hidden testcase projection ở service.
- TC03/TC09/TC10: dùng enrollment/progress hiện có sau khi bổ sung progress fields.
- TC08: dùng submission/result detail hiện có.
- Reading UI: dùng reading_content, chỉ cần content progress.
- Footer/header/auth: không có gap database nghiệp vụ mới ngoài role/notification.

## Migration và thứ tự triển khai đề xuất

1. Tạo enum/table mới và các cột nullable tương thích.
2. Backfill teacher/course approval status.
3. Backfill price từ Float sang VND integer/Decimal.
4. Tạo Cart/Order/Transaction idempotency và migrate payment service.
5. Tạo wallet ledger từ transaction đã completed.
6. Migrate quiz submission sang quiz attempt.
7. Migrate interview status/report constraint.
8. Bật unique/validation constraints sau khi dữ liệu sạch.
9. Cập nhật API contract rồi mới bật các UI mới.
10. Thêm integration test cho payment webhook, enrollment duplicate, approval flow, progress completion và payout minimum.

