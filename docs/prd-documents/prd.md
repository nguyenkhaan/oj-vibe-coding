# PRD - LMS Coding Platform

## 1. Mục tiêu và phạm vi

LMS Coding Platform là nền tảng học lập trình kết hợp:

- Bán và học khóa học online.
- Nội dung Reading, Video, Quiz và Coding Problem trong cùng một lesson.
- Online Judge chạy và chấm code theo testcase trong môi trường an toàn.
- AI Interview có text chat, microphone và camera trong phiên; chỉ lưu chat và report.
- Dashboard cho Student, Teacher và Admin.

Tất cả các nhóm trên thuộc phạm vi MVP. Database hiện tại trong `src/backend/business-application/src/models` là nguồn tham chiếu kỹ thuật hiện tại; phần database cũ trong PRD này đã được thay thế bằng [DATABASE.txt](../DATABASE.txt).

## 2. Vai trò và quyền

### Student

- Đăng ký/đăng nhập bằng local account hoặc Google.
- Có thể gửi yêu cầu trở thành Teacher.
- Duyệt catalog, favorite course, xem detail và review course đã học.
- Thêm course vào cart, mỗi order chỉ chứa một course, thanh toán qua PayOS.
- Thanh toán thành công tạo Enrollment ngay; không thể mua lại course đã enrollment.
- Học các content Reading, Video, Quiz và Problem theo thứ tự lesson.
- Hoàn thành Video khi xem đủ 100%; hoàn thành Quiz/Problem khi đạt ngưỡng do Teacher cấu hình và còn lượt làm.
- Submit code, xem kết quả từng testcase và lịch sử submission.
- Thực hiện AI Interview tối đa 12 câu; session có thể kết thúc sớm khi AI đủ dữ liệu.
- Xem notification, progress, order và report interview.

### Teacher

- Một User có thể vừa là Student vừa là Teacher.
- Student gửi hồ sơ Teacher; hệ thống tạo `teacher_profile` nhưng Teacher chưa được dùng quyền tạo course cho tới khi Admin duyệt.
- Sau khi được duyệt, Teacher tạo course, section, lesson và content.
- Teacher gửi course cho Admin duyệt; Admin có thể approve/reject. Khi bị reject, Teacher được sửa và gửi lại.
- Teacher có thể chỉnh trạng thái nội bộ course theo quyền được cấp, nhưng course bán công khai phải qua review Admin.
- Teacher đặt giá course, ngưỡng pass Quiz/Problem và số lần retry.
- Teacher xem học viên, progress, submission, comment và doanh thu.
- Teacher quản lý coding problem, quiz, testcase, language config.
- Teacher nhận 80% doanh thu; Platform giữ 20%.
- Teacher gửi yêu cầu rút tiền khi balance khả dụng tối thiểu là `1000 VND`; Admin duyệt payout.

### Admin

- Quản lý User, Role, account status và audit log.
- Duyệt/reject Teacher registration.
- Duyệt/reject course được Teacher gửi, kèm note review.
- Duyệt payout request.
- Theo dõi transaction/order, xử lý sự cố PayOS và notification.
- Có thể quản lý nội dung vi phạm và review theo policy vận hành.

## 3. Trạng thái nghiệp vụ

### Teacher registration

`PENDING -> APPROVED | REJECTED`

Teacher bị reject có thể chỉnh hồ sơ và gửi lại. `teacher_profile` được tạo ngay khi gửi lần đầu, nhưng quyền Teacher chỉ active khi application approved.

### Course

`DRAFT -> PENDING_REVIEW -> PUBLISHED | REJECTED -> PENDING_REVIEW`

Course đã mua vẫn được Student truy cập sau khi course bị `ARCHIVED`. Course chưa được Admin approve không được hiển thị bán công khai.

### Order/payment

Mỗi order gắn với một Student và một Course. Flow chính:

1. Student tạo order từ course chưa enrollment.
2. Hệ thống tạo payment transaction trạng thái `PENDING` và PayOS link/QR.
3. PayOS webhook hợp lệ chuyển order/transaction sang `PAID/COMPLETED`.
4. Hệ thống tạo Enrollment idempotent.
5. Hệ thống ghi nhận 80% vào Teacher wallet ledger và 20% vào Platform ledger.
6. Student nhận notification và được chuyển tới course workspace.

Thanh toán lỗi/hết hạn không tạo Enrollment. Student không thể tạo order mới cho course đã enrollment.

### Course content

Một lesson có nhiều `lesson_content`, mỗi item có `content_type` và `position`. Content có thể là Reading, Video, Quiz hoặc Problem. Admin/Teacher sử dụng builder để sắp xếp thứ tự theo quyền được cấp; Teacher là người biên soạn nội dung.

Progress lưu theo từng content và enrollment:

- Video: completed khi `watched_percent = 100`.
- Quiz: completed khi score >= `pass_score` của content/quiz và còn attempt hợp lệ.
- Problem: completed khi submission Accepted và score đạt `pass_score` cấu hình.

## 4. Online Judge

Student gửi source code, language và problem. Business Application lưu Submission `PENDING`, gọi Judge Service, rồi cập nhật kết quả. Judge trả về status `ACCEPTED`, `WRONG_ANSWER`, `TIME_LIMIT_EXCEEDED`, `MEMORY_LIMIT_EXCEEDED`, `RUNTIME_ERROR` hoặc `COMPILE_ERROR`; mỗi testcase có detail riêng. Hidden testcase không được trả input/output cho Student.

Problem có difficulty, tag, public/private, language config, time/memory limit và testcase có score/hidden flag.

## 5. AI Interview

Student chọn topic và level rồi tạo session. Session hỗ trợ text, microphone và camera ở giao diện nhưng database chỉ lưu:

- `interview_session`: topic, level, status, question count và timestamps.
- `interview_message`: sender và nội dung text đã chuẩn hóa.
- `interview_report`: overall score, skill scores, strengths, weaknesses, suggestions.

Session tối đa 12 câu, AI có thể kết thúc sớm khi đủ dữ liệu. Khi kết thúc, hệ thống sinh một report cuối cùng và gửi notification.

## 6. Notifications và audit

Notification bắt buộc cho:

- Payment success/failure.
- Teacher approval/rejection.
- Course approval/rejection.
- Judge result.
- AI report ready.
- Payout approval/rejection.

Audit log ghi actor, action, target type/id, note và thời gian cho các thao tác nhạy cảm.

## 7. Yêu cầu chức năng

- **FR-001 Auth/RBAC:** xác thực, role, teacher approval, account status.
- **FR-002 Catalog:** search/filter/detail/favorite/review.
- **FR-003 Course authoring:** course, section, lesson, content reorder, submit review.
- **FR-004 Course moderation:** Admin review course và Teacher registration.
- **FR-005 Commerce:** cart, order một course, PayOS, enrollment idempotency.
- **FR-006 Learning:** reading/video/quiz/problem progress và retry policy.
- **FR-007 Online Judge:** editor, run, submit, testcase result, history.
- **FR-008 AI Interview:** setup, chat/multimedia session, max 12 turns, report.
- **FR-009 Teacher finance:** revenue ledger, 80/20 split, payout min 1000 VND, Admin approval.
- **FR-010 Communication:** comments/replies, notifications, audit.

## 8. Phi chức năng

- Password phải được hash; JWT/JWK do Auth Provider quản lý.
- Payment webhook phải verify signature và idempotent.
- Judge sandbox không có network, giới hạn CPU/RAM/time.
- File upload (avatar, CCCD, thumbnail, testcase, media) lưu qua object storage; URL lưu database.
- Các API mutation nhạy cảm phải có authorization theo role và resource ownership.
- Các dữ liệu tiền dùng đơn vị VND và phải tránh sai số Float ở tầng persistence/service.
- PII và CCCD phải được bảo vệ; log không ghi raw secret/payment token.

## 9. Ngoài phạm vi hiện tại

- Lưu video/audio recording của AI Interview.
- Marketplace nhiều course trong một order.
- Subscription hoặc coupon engine phức tạp.
- Live classroom/video conference.
- Payout tự động không qua Admin.

## 10. Nguồn sự thật

- Nghiệp vụ: tài liệu này và các quyết định đã xác nhận với Product Owner.
- Schema đề xuất: [DATABASE.txt](../DATABASE.txt).
- Khoảng cách schema hiện tại: [gap-analysis.md](../gap-analysis.md).
- UI: các wireframe Markdown trong `docs/ui`.
