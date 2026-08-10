# UI Report - SkillBoost LMS Coding Platform

Tài liệu này tổng hợp cấu trúc giao diện từ Figma file `LMS-Coding-Platform`, tập trung vào các thông tin cần thiết để dựng frontend trước:
- Cấu trúc page và layer chính
- Theme màu sắc
- Typography
- Pattern layout / component dùng chung
- Những màn hình quan trọng cần ưu tiên implement

## 1. Phạm vi Figma

### Top-level pages
- `Screens`
- `Design System`

### Nhận định tổng quan
- `Screens` chứa toàn bộ màn hình sản phẩm theo role và theo flow.
- `Design System` chứa component nền tảng, palette màu, icon set, badge, button, progress bar, search input, pagination, sidebar và các building blocks dùng lại.
- Phong cách tổng thể là `modern LMS / SaaS`, layout sạch, nhiều card bo góc, đổ bóng nhẹ, dùng dải màu tím - xanh - hồng làm brand.

## 2. Bản đồ màn hình chính

### AUTH
- `AUTH-01` Teacher Registration
- `AUTH-02` Student Registration
- `AUTH-03` OTP Verification
- Login
- Forgot Password
- Set Password
- Lock Screen

### COURSE
- `COURSE-01` Course Catalog
- `COURSE-02` Course Detail
- Các biến thể course page / description / curriculum / ratings

### INSTRUCTORS
- Instructor Grid
- Instructor List
- Instructor Detail

### STD
- `STD-01` Student Dashboard
- `STD-02` Student Dashboard Enrolled Course
- `STD-03` Student Dashboard Profile
- `STD-04` Student Problem History

### TC
- `TC-01` Teacher Dashboard
- `TC-02` Teacher Profile
- `TC-03` View Student
- `TC-04` Earnings
- `TC-05` Teacher Course Enrollment
- `TC-06` Teacher Lesson Content Builder
- `TC-07` Teacher Curriculum Reorder
- `TC-08` Teacher Submission Review
- `TC-09` Teacher Student Progress
- `TC-10` Teacher Course Students
- `TC-11` Teacher Course Builder
- `TC-13` Teacher Lesson Content Preview
- `TC-14` Teacher Coding Problem Management

### OJ
- `OJ-01` Problem List
- `OJ-02` Online Judge Workspace
- `OJ-03` Submission History

### INT
- `INT-01` AI Interview
- `INT-02` Interview Report

#### `INT-01` AI Interview layout notes
- Camera preview của người dùng đặt rõ ở phần main panel hoặc sidebar nổi bật.
- Khu vực interview cần có:
  - video preview local
  - trạng thái camera on/off
  - trạng thái microphone on/mute
  - transcript hoặc live caption
  - panel câu hỏi hiện tại
  - panel lịch sử hội thoại
  - CTA start / next / end session
- Nếu thiết bị hoặc quyền truy cập bị từ chối, UI phải tự chuyển sang text-only mode nhưng vẫn giữ nguyên cấu trúc interview.
- Nếu người dùng đang nói bằng voice input, UI nên hiển thị trạng thái `listening` hoặc `transcribing`.

### CLASS
- `CLASS-01` Classroom Workspace

### PAY
- `PAY-01` Shopping Cart
- `PAY-02` Checkout

### QUIZ
- `QUIZ-01` Quiz Attempt
- `QUIZ-02` Quiz Preview

### PROG
- `PROG-01` Problem Preview
- `PROG-01.2` Problem Preview - Reading
- `PROG-01.3` Problem Preview - Video

### AD
- `AD-01` Identity Verification

## 3. Layer / Component chính

Các layer / cụm component lặp lại nhiều lần trong file:
- `Header`
- `Page Title`
- `Footer`
- `Instructor Sidebar`
- `Student Sidebar`
- `Profile Component`
- `Dashboard Card`
- `Instructor Card`
- `Instructor List`
- `Pagination Controls`
- `Navigation`
- `Search input`
- `Button`
- `Scroll bar`
- `Color System`
- `Progress bar`
- `Badge`
- `Icons`
- `Payment Icons`

### Kiểu bố cục phổ biến
- Hero header có nền gradient pastel.
- Nội dung chính dùng card nền trắng, radius lớn, shadow nhẹ.
- Dashboard và builder pages thường chia 3 cột:
  - sidebar trái
  - content trung tâm
  - panel phải cho summary / actions / status
- Các màn workspace dark mode như OJ, Quiz, Interview, Lesson Preview dùng nền navy đậm để nhấn mạnh môi trường thao tác.

## 4. Theme màu sắc

### Brand palette chính
Từ `Design System`, bộ màu chính nghiêng về tím / indigo:

| Token | Hex | Ghi chú |
|---|---|---|
| `primary-100` | `#c4aaff` | tím nhạt |
| `primary-200` | `#8855ff` | tím sáng |
| `primary-300` | `#4d00ff` | tím brand chính |
| `primary-400` | `#3c00c6` | tím đậm |
| `primary-500` | `#2a008c` | tím rất đậm |

### Màu accent
| Token | Hex | Ghi chú |
|---|---|---|
| `accent-pink` | `#fb3748` | CTA / badge / trạng thái nổi bật |
| `accent-pink-strong` | `#d00416` | hover / active sâu hơn |
| `accent-yellow` | `#ffdb43` | warning / highlight |
| `accent-yellow-strong` | `#dfb400` | trạng thái đậm hơn |
| `success-100` | `#84ebb4` | xanh nhạt |
| `success-200` | `#1fc16b` | success / pass / active |

### Neutral palette
| Token | Hex | Ghi chú |
|---|---|---|
| `neutral-100` | `#ffffff` | nền card / page |
| `neutral-500` | `#a4a4a4` | text phụ |
| `neutral-600` | `#8e8e8e` | helper text |
| `neutral-700` | `#777777` | label / metadata |
| `neutral-800` | `#606060` | text trung tính đậm |
| `neutral-900` | `#4a4a4a` | text chính phụ |
| `neutral-1000` | `#333333` | text đậm |

### Cách dùng màu trên UI
- Hero / page banner: gradient pastel từ hồng nhạt sang xanh nhạt.
- CTA chính: pink/coral hoặc purple tùy context.
- Button / action secondary: indigo / purple.
- Status badges:
  - xanh cho thành công / publish / pass
  - vàng cho warning / pending
  - đỏ cho error / reject / hard
- Workspace tối: nền navy gần đen, text sáng, line separator nhẹ.

## 5. Typography

### Nhận định chính
- Hệ chữ là một sans-serif hiện đại, thiên về UI product.
- Heading dùng weight đậm, thường ở mức `600-700`.
- Body text và helper text nhỏ, spacing gọn, dễ đọc.
- Nhiều màn dùng tiêu đề lớn ở hero, sau đó giảm dần xuống heading card và label form.

### Suy luận font family
- Từ ảnh chụp và cách trình bày, font chính nhìn gần với nhóm:
  - `Inter`
  - `Manrope`
  - hoặc một sans-serif hiện đại tương đương
- Metadata mình đọc được không expose tên font family trực tiếp, nên phần này nên được coi là `visual inference` cho đến khi đối chiếu text styles trực tiếp trong Figma.

### Khuyến nghị sử dụng khi dựng FE
- Dùng một font sans hiện đại, độ trung tính cao.
- Ưu tiên:
  - heading rõ, gọn
  - body không quá condensed
  - số liệu / badge cần đậm và dễ scan

## 6. Pattern giao diện nên tái sử dụngmd

### Header / Navigation
- Logo trái
- Menu trung tâm
- Action buttons phải
- Một số page có top utility bar chứa ngôn ngữ, currency, icon social

### Page banner
- Dải gradient pastel trên cùng
- Tiêu đề lớn căn giữa
- Breadcrumb nhỏ bên dưới

### Footer
- 3 đến 4 cột nội dung
- Logo + mô tả ngắn
- Link group
- Newsletter signup
- App store badges
- Dải legal bar cuối trang

### Card system
- Card trắng, radius lớn
- Border rất nhẹ hoặc shadow mềm
- Có header, body, footer tách rõ

### Form system
- Input bo góc, viền mảnh
- Label trên input
- Placeholder nhẹ
- Một số form có chip, checkbox, upload card, file dropzone

### Data display
- Table cho dashboard / admin / history
- Badge màu cho trạng thái
- Progress bar cho học tập / hoàn thành / thanh toán
- Pagination controls ở cuối list

### Workspace pattern
- Sidebar trái chứa curriculum / problem list / filter
- Main content ở giữa
- Sidebar phải cho submit status / summary / chat / actions
- Riêng `INT-01` nên ưu tiên bố cục phỏng vấn thật:
  - khung camera preview nổi bật
  - transcript hiển thị theo thời gian thực
  - panel câu hỏi / câu trả lời dạng hội thoại
  - nút điều khiển camera/micro riêng biệt

## 7. Gợi ý ưu tiên dựng frontend

Nếu dựng FE trước, thứ tự hợp lý là:
1. Design tokens và shared layout primitives
2. Auth screens
3. Course / instructor public pages
4. Teacher dashboard shell
5. Student dashboard shell
6. Classroom / OJ / Quiz / Interview / Payment
7. Admin / verification screens
8. Responsive polish và empty/error states

## 8. Ghi chú quan trọng

- Báo cáo này dùng cho FE-first implementation.
- Những phần có ghi `visual inference` cần confirm lại nếu mục tiêu là pixel-perfect 100%.
- Khi bắt đầu code, nên giữ file này làm nguồn tham chiếu cho:
  - palette
  - typography
  - spacing/radius
  - layout patterns
  - screen inventory

## 9. Bản đồ điều hướng FE

Mục này mô tả cách người dùng di chuyển giữa các nhóm màn hình trên frontend. Đây là bản đồ điều hướng ở cấp sản phẩm, dùng để dựng router, sidebar, breadcrumb và CTA liên màn.

### 9.1. Nhóm route chung

#### Public
- `/` -> trang landing / home
- `/courses` -> `COURSE-01` Course Catalog
- `/courses/:slug` -> `COURSE-02` Course Detail
- `/instructors` -> Instructor Grid
- `/instructors/list` -> Instructor List
- `/instructors/:id` -> Instructor Detail

#### Auth
- `/auth/login` -> Login
- `/auth/register` -> Student Registration
- `/auth/forgot-password` -> Forgot Password
- `/auth/set-password` -> Set Password
- `/auth/otp` -> OTP Verification
- `/auth/lock` -> Lock Screen
- `/auth/teacher-registration` -> `AUTH-01` Teacher Registration

#### Student
- `/student/dashboard` -> `STD-01` Student Dashboard
- `/student/courses` -> `STD-02` Enrolled Courses
- `/student/profile` -> `STD-03` Student Profile
- `/student/history` -> `STD-04` Problem History
- `/student/classroom/:courseId/:lessonId` -> `CLASS-01` Classroom Workspace
- `/student/quiz/:quizId` -> `QUIZ-01` Quiz Attempt
- `/student/problem/:problemId` -> `OJ-02` Online Judge Workspace
- `/student/cart` -> `PAY-01` Shopping Cart
- `/student/checkout` -> `PAY-02` Checkout

#### Shared AI Interview
- `/interview` -> `INT-01` AI Interview
- `/interview/:sessionId` -> `INT-01` AI Interview
- `/interview/:sessionId/report` -> `INT-02` Interview Report

Lưu ý:
- `AI Interview` là chức năng dùng chung, có thể truy cập từ điều hướng global hoặc dashboard theo role.
- Không điều hướng trực tiếp từ `CLASS-01` sang `INT-01`.
- Màn hình Interview cần hiển thị trạng thái giới hạn lượt dùng, quota còn lại, hoặc CTA nâng cấp/đổi gói nếu vượt hạn mức.
- Khi vào `INT-01`, người dùng phải thấy ngay quyền camera/micro và trạng thái preview trước khi bắt đầu session.

#### Teacher
- `/teacher/dashboard` -> `TC-01` Teacher Dashboard
- `/teacher/profile` -> `TC-02` Teacher Profile
- `/teacher/students` -> `TC-03` View Student
- `/teacher/earnings` -> `TC-04` Earnings
- `/teacher/enrollments` -> `TC-05` Teacher Course Enrollment
- `/teacher/courses` -> `TC-11` Teacher Course Builder
- `/teacher/courses/:courseId/lessons/:lessonId/content` -> `TC-06` Lesson Content Builder
- `/teacher/courses/:courseId/reorder` -> `TC-07` Curriculum Reorder
- `/teacher/submissions` -> `TC-08` Submission Review
- `/teacher/progress` -> `TC-09` Student Progress
- `/teacher/course-students` -> `TC-10` Course Students
- `/teacher/lesson-preview/:lessonContentId` -> `TC-13` Lesson Content Preview
- `/teacher/problems` -> `TC-14` Coding Problem Management

#### Admin
- `/admin/identity-verification` -> `AD-01` Identity Verification

### 9.2. Điều hướng theo luồng

#### Auth flow
1. Người dùng vào landing.
2. Chọn đăng nhập hoặc đăng ký.
3. Sau đăng ký, đi qua OTP verification hoặc set password.
4. Sau xác thực thành công, chuyển về dashboard theo role.

#### Student learning flow
1. Vào `COURSE-01` để khám phá khóa học.
2. Mở `COURSE-02` để xem chi tiết.
3. Nếu mua khóa học, đi qua `PAY-01` -> `PAY-02`.
4. Khi đã enrolled, vào `STD-02` hoặc `CLASS-01`.
5. Từ classroom có thể chuyển sang `QUIZ-01` hoặc `OJ-02` tùy nội dung bài học.
6. `INT-01` chỉ được mở qua entry point chung của hệ thống, không phải flow nối từ classroom.
7. Kết thúc interview sẽ chuyển sang `INT-02`.

#### Teacher management flow
1. Teacher vào `TC-01` để xem dashboard tổng quan.
2. Từ sidebar đi sang profile, earnings, students, course builder, submission review, progress, hoặc coding problem management.
3. Khi chỉnh lesson content, đi từ course builder sang `TC-06` hoặc preview ở `TC-13`.
4. Nếu cần sắp xếp chương/bài, chuyển sang `TC-07`.

#### Admin verification flow
1. Admin vào `AD-01`.
2. Xem danh sách hồ sơ chờ duyệt.
3. Mở chi tiết ứng viên, so sánh CCCD và thông tin form.
4. Duyệt hoặc từ chối rồi quay về danh sách.

### 9.3. Quy ước điều hướng UI

- `Public` pages dùng header marketing và footer đầy đủ.
- `Student`, `Teacher`, `Admin` pages dùng shell nội bộ với sidebar trái.
- `AI Interview` là một module chung nên cần được expose ở một entry point rõ ràng trên shell hoặc quick action, không gắn vào riêng classroom.
- Các màn workspace như `CLASS`, `OJ`, `QUIZ`, `INT`, `PROG` cần ưu tiên:
  - breadcrumb ngắn
  - CTA chính ở góc phải
  - panel phụ cho trạng thái / tiến độ / submit / chat
- `INT` còn cần một camera block hoặc video stage riêng để tạo cảm giác phỏng vấn thật.
- Màn form dài như teacher registration, checkout, identity verification nên chia thành step hoặc section rõ ràng.
- Các màn detail nên giữ link quay lại list hoặc dashboard tương ứng để người dùng không bị “kẹt” trong ngữ cảnh.

### 9.4. Gợi ý component điều hướng dùng chung

- Top nav
- Sidebar nội bộ
- Breadcrumb
- Tab nav
- Stepper
- Pagination
- Back button
- CTA group

### 9.5. Ưu tiên dựng router khi code

1. Public routes
2. Auth routes
3. Student routes
4. Teacher routes
5. Admin routes
6. Workspace detail routes

Mục tiêu là có một router map rõ trước, sau đó mới gắn dữ liệu thật vào từng route.
