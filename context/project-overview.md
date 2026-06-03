# Project Overview — Coralume

> Nguồn: Coralume-SRS.md · Phiên bản 1.0 · 03/06/2026
>
> Deadline go-live: **15/06/2026**

---

## 1. GIỚI THIỆU DỰ ÁN

### 1.1 Mục đích

**Coralume = Coral + Illuminate** (Thắp sáng san hô) — Nền tảng "nhận nuôi san hô" kết hợp behavioral economics + ESG. Khác với mô hình từ thiện truyền thống, Coralume biến việc bảo tồn san hô thành trải nghiệm cá nhân: mỗi adopter có 1 hoặc nhiều san hô riêng (có tên, có ID, có vị trí GPS), được trung tâm san hô đối tác tại Nha Trang chăm sóc và cập nhật ảnh/video growth định kỳ. Adopter theo dõi san hô của mình qua dashboard trên website.

### 1.2 Slogan & Tagline

| Vai trò | Nội dung |
|---------|----------|
| Slogan chính (VN) | Nhận nuôi san hô — Gieo mầm cho đại dương |
| Slogan chính (EN) | Adopt a Coral — Plant a Future for the Ocean |
| Tagline phụ | Your coral. Your story. Your impact. |

### 1.3 Tone of Voice

- **Phong cách:** Ấm, cá nhân, có dữ liệu — KHÔNG kêu gọi từ thiện
- **Tuyệt đối tránh:** "hãy quyên góp", "cứu lấy đại dương"
- **Thay vào đó:** "san hô của bạn", "theo dõi sự phát triển", "impact của bạn"
- **Cảm xúc mục tiêu:** Sở hữu + Tự hào + Kết nối thiên nhiên
- **Tham khảo:** Patagonia, Coral Gardeners, Allbirds

### 1.4 Đối tượng chính

- **Target:** Người trẻ 18–35, quan tâm môi trường, ESG, có thu nhập
- **Mở rộng:** Doanh nghiệp muốn CSR
- **Phân khúc:** Sinh viên, nhân viên văn phòng, người đi du lịch, expat ở Việt Nam

### 1.5 Nguyên tắc ĐƯỢC LÀM / KHÔNG ĐƯỢC LÀM

| ✓ ĐƯỢC LÀM | ✗ KHÔNG ĐƯỢC LÀM | Lý do |
|-------------|------------------|-------|
| "san hô của bạn", "adopter", "impact của bạn" | "hãy quyên góp", "cứu đại dương", "từ thiện" | Coralume KHÔNG phải từ thiện |
| Hero rộng, ảnh full-width | Hero nhỏ, chữ chèn lên ảnh gắt | Tạo cảm giác đại dương rộng lớn |
| Số liệu chính xác có nguồn | Số liệu chung chung kiểu "giúp môi trường" | Adopter quan tâm impact thật |
| Animation nhẹ: fade, slide-up, parallax dịu | Animation gắt: bounce, flash | Tone of voice dịu, chậm rãi |
| Tích hợp dữ liệu thật (số adopter, san hô) | Số đếm fake hoặc placeholder không update | Minh bạch là USP |

---

## 2. MỤC TIÊU DỰ ÁN

1. Cho phép người dùng nhận nuôi san hô trực tuyến với 3 gói:
   - **Seed Coral** (Standard): 200.000 – 300.000 VND
   - **Reef Guardian** (Premium): 500.000 – 700.000 VND
   - **Diving Experience** (Premium+): 1.000.000 – 2.000.000 VND
2. Cung cấp dashboard cá nhân để adopter theo dõi growth, ảnh/video update, impact của san hô
3. Tích hợp thanh toán VNPay/MoMo cho thị trường Việt Nam
4. Cung cấp Coral Portal cho nhân viên trung tâm san hô cập nhật ảnh/video/chỉ số từ điện thoại
5. Xây dựng referral program (Ambassador — 5 referrals) để tăng trưởng organic
6. Đạt Lighthouse score > 85 cho Performance, Accessibility, SEO
7. Responsive mobile-first (60%+ traffic từ mobile dự kiến)

---

## 3. CORE USER FLOW

### Flow 1: Khách mới → Adopter (Mua gói lần đầu)

1. Khách mới vào website (Home) → Đọc hero, scroll xem "Tại sao san hô quan trọng" → Stats count-up
2. Xem 3 gói giới thiệu nhanh → Click "Nhận nuôi ngay" hoặc "Tìm hiểu thêm" → Products page
3. So sánh chi tiết 3 gói, đọc FAQ, bảng so sánh → Chọn gói (vd: Reef Guardian) → Bấm "Nhận nuôi ngay"
4. Hệ thống kiểm tra: chưa đăng nhập → hiện modal "Đăng nhập / Đăng ký"
5. Chọn "Đăng ký" → Form: họ tên, email, mật khẩu, SĐT → Submit → Gửi email xác nhận
6. Click link verify → Tài khoản kích hoạt → Quay lại Products (gói đã chọn giữ trong session)
7. Bấm "Tiến hành thanh toán" → Form: thông tin adopter (pre-fill), đặt tên san hô (tuỳ chọn), chọn VNPay/MoMo
8. Redirect tới cổng thanh toán → Thanh toán thành công → Callback về /thanh-cong
9. Backend: Tạo bản ghi san hô (status=pending), gán cho user, gửi email xác nhận + certificate PDF
10. Trang "Cảm ơn" + preview certificate + CTA "Vào Dashboard"
11. Adopter vào dashboard → Thấy san hô mới + status "Chờ gán san hô thật"
12. Trong vòng 7 ngày, admin gán san hô thật → status "Đang phát triển" → Email notification

### Flow 2: Adopter quay lại xem update

1. Adopter nhận email "San hô của bạn vừa được cập nhật"
2. Click link → Đăng nhập → Redirect về dashboard
3. Dashboard hiện badge "New update" trên san hô có update
4. Click san hô → Modal chi tiết → Ảnh/video mới nhất, timeline growth, ghi chú từ nhân viên
5. Tải certificate hoặc chia sẻ social → Xem impact dashboard tổng hợp
6. (Tuỳ chọn) Sao chép mã AFF, share với bạn

### Flow 3: Nhân viên trung tâm san hô cập nhật

1. Nhân viên vào field tại Nha Trang, chụp ảnh/quay video san hô
2. Đăng nhập /coral-portal trên điện thoại → Xem danh sách san hô cần update
3. Chọn san hô → Form: upload ảnh (1-5) + video → preview → nhập chỉ số (kích thước, sức khỏe, ghi chú)
4. Save → Hệ thống lưu + đồng bộ dashboard adopter → Email tự động gửi adopter
5. San hô biến mất khỏi filter "cần update" → Lặp lại cho san hô khác

### Flow 4: Admin quản lý hàng ngày

1. Đăng nhập /admin → Dashboard tổng quan
2. Tab "Users": xem danh sách adopter mới → Mở chi tiết → "Assign coral" → Hệ thống đề xuất từ pool → Admin chọn → Confirm → Email adopter
3. (Hàng tuần) Cập nhật giá, mở/đóng gói
4. (Hàng tháng) Xuất CSV danh sách adopter + doanh thu

---

## 4. DANH SÁCH 12 TRANG

| STT | Trang | Mục đích | Nội dung chính |
|-----|-------|----------|----------------|
| 1 | **Trang chủ (Home)** | Giới thiệu dự án, thu hút khách | Hero video, stats count-up, "Coralume làm gì" (3 steps), 3 gói preview, đối tác, CTA banner, footer |
| 2 | **Về chúng tôi (About)** | Tạo niềm tin, kể câu chuyện | Founder story, sứ mệnh & tầm nhìn, đội ngũ (grid), process timeline, cam kết minh bạch, CTA cuối |
| 3 | **Sản phẩm (Products)** | Trang bán hàng chính — convert | 3 gói chi tiết + bảng so sánh + Referral/Ambassador + FAQ accordion |
| 4 | **Dashboard cá nhân** | Khu vực adopter theo dõi san hô | Welcome banner, quick stats, coral grid, modal chi tiết (growth, GPS, certificate), impact dashboard, mã AFF, profile settings |
| 5 | **Blog / Kiến thức** | Education + SEO + credibility | Categories filter, article grid, detail post (TOC sticky, scroll progress), CMS qua admin |
| 6 | **Bảng xếp hạng** | Gamification | Top 10 tháng, top all-time, my ranking (nếu logged in). Ẩn danh option. |
| 7 | **Cộng đồng** | Social proof, tăng cảm xúc | Adopter stories (masonry), video gallery, submit form (admin duyệt) |
| 8 | **Đăng nhập / Đăng ký** | Xác thực người dùng | Login, Register, Forgot Password, Email Verification, Google OAuth (tuỳ chọn) |
| 9 | **Thanh toán** | Bước thanh toán sau chọn gói | Gói đã chọn, form adopter, đặt tên san hô, phương thức (VNPay/MoMo/chuyển khoản) |
| 10 | **Xác nhận / Cảm ơn** | Sau thanh toán thành công | Certificate preview, tải PDF, CTA dashboard, email xác nhận + PDF đính kèm |
| 11 | **Admin Panel** | Quản trị hệ thống | Dashboard, quản lý user/sản phẩm/nội dung/san hô, analytics, báo cáo, staff, activity log |
| 12 | **Coral Portal** | Backend cho trung tâm SH | Dashboard san hô cần update, form upload ảnh/video + nhập chỉ số, bulk upload, lịch sử |

---

## 5. 5 ROLES NGƯỜI DÙNG

| Role | Đối tượng | Mô tả |
|------|----------|-------|
| **Visitor** | Người chưa đăng ký | Xem tất cả trang public. Không thấy chi tiết cá nhân. Newsletter signup. Liên hệ form. |
| **Adopter** | Đã đăng ký + đã nhận nuôi | Dashboard cá nhân, xem san hô, certificate, impact, mã AFF, adopt thêm, profile settings. |
| **Ambassador** | Adopter đã giới thiệu ≥ 5 người | Badge trên profile public. Trang Ambassador riêng. Voucher lặn miễn phí. Quà tặng vật phẩm. Lời mời sự kiện offline. |
| **Admin** | Quản trị viên Coralume | Toàn quyền quản lý hệ thống qua /admin. Super Admin, Editor, Coral Center sub-roles. |
| **Coral Staff** | Nhân viên tại Nha Trang | Chỉ truy cập /coral-portal để cập nhật san hô. Mobile-first bắt buộc. |

---

## 6. FEATURES CHI TIẾT

### 6.1 Public Pages

**Home:**
- Hero: Video/ảnh underwater (1920×1080), overlay Navy 20%, headline Lora Bold 64px, sub 22px, CTA Coral Orange solid + CTA phụ ghost button. Animation: video fade-in 1.5s, headline fade+slide-up 0.8s, sub 0.6s delay 0.5s, CTA delay 0.8s
- Stats section: 3 số liệu ("< 1%", "25%", "50%") — count-up khi scroll tới
- How it works: 3 steps (Chọn gói → Đặt tên → Theo dõi) — 3 cột desktop, 1 cột mobile, hover scale 1.05
- Products preview: 3 gói cards — hover translateY(-8px) + shadow, badge "Phổ biến nhất"
- Partner section: Logo + ảnh team trung tâm (placeholder: "Đang chờ ảnh từ CLB")
- CTA banner cuối trang: Gradient Navy → Teal, parallax nhẹ, CTA pulse 2s/lần
- Footer: 3 cột (Logo+slogan, Navigation, Contact), Navy background, sticky khi scroll > 100px

**About:**
- Hero: Headline "Chúng tôi không phải tổ chức từ thiện..." — line-by-line reveal (0.4s gap), dòng 2 Lora Italic
- Sứ mệnh & Tầm nhìn: 2 cột (text trái, ảnh phải)
- Founder story: Storytelling dạng article, Lora Italic cho dẫn dắt
- Team grid: 3-4 cột desktop, 2 tablet, 1 mobile. Hover: zoom 1.03 + hiện role
- Process timeline: Horizontal (desktop) / vertical (mobile), SVG line vẽ kết nối
- Cam kết minh bạch: "100% doanh thu sau chi phí vận hành..."

**Products:**
- 3 gói chi tiết: Seed Coral, Reef Guardian, Diving Experience — giá, quyền lợi, CTA "Nhận nuôi ngay"
- Reef Guardian card có border Coral nổi bật
- Bảng so sánh: Sticky header, zebra striping, horizontal scroll mobile
- Referral/Ambassador: "Mời bạn bè — Trở thành Ambassador" — 5 referrals = badge + quà + voucher
- FAQ accordion: 5 câu hỏi — expand/collapse

**Blog:**
- Categories filter: Sinh thái san hô, Bảo tồn, Kinh tế xanh, Chuyến lặn của adopter
- Article grid: thumbnail, tiêu đề, tóm tắt 2 dòng, ngày, tag, thời gian đọc. Pagination 12 bài/trang
- Detail post: max-width 720px, font 18px, line-height 1.7, TOC sticky, scroll progress bar

**Leaderboard:**
- Top 10 tháng + Top 20 all-time
- Top 3 highlight đặc biệt
- My ranking (nếu logged in): vị trí + cần bao nhiêu để lên hạng
- Ẩn danh option

**Community:**
- Adopter stories: masonry layout, click → modal full, có moderation
- Video gallery: Embed YouTube/Vimeo, lightbox player
- Submit form: Ảnh + text, admin duyệt rồi đăng

### 6.2 Auth

- Đăng ký: họ tên, email, mật khẩu, SĐT, đồng ý điều khoản. Strength meter cho password.
- Đăng nhập: email, mật khẩu, Google OAuth (tuỳ chọn)
- Forgot password: nhập email → nhận link reset
- Email verification: BẮT BUỘC trước khi thanh toán
- Session: JWT httpOnly cookie, remember-me 30 ngày

### 6.3 Adopter Dashboard (yêu cầu đăng nhập)

- Welcome banner: "Chào mừng, [Tên]! Bạn đang chăm sóc [N] san hô." + Avatar
- Quick stats: 3 chỉ số (Tổng san hô, Diện tích reef hỗ trợ m², Tháng đồng hành) — count-up animate
- Coral grid: 3 cột desktop → 2 tablet → 1 mobile. Card: ảnh mới nhất + tên + ID + ngày + gói + trạng thái + [Xem chi tiết →]
- Empty state: "Bạn chưa nhận nuôi san hô nào. [Bắt đầu nhận nuôi →]"
- Modal chi tiết: Tên san hô + ID (CRL-2026-XXXX), growth timeline (lazy load), GPS map (vùng tương đối), stats (kích thước, sức khỏe, tốc độ growth, loài), certificate (xem/tải PDF/chia sẻ)
- Impact dashboard: Biểu đồ tổng san hô, diện tích reef, CO₂ hấp thụ, sinh vật biển hỗ trợ
- Referral code: CRL-[USERNAME], sao chép, progress bar tới Ambassador (5-N), confetti khi đạt
- Profile settings: Tên, avatar, email, mật khẩu, notification toggle, public profile toggle. Auto-save on blur.

### 6.4 Payment

- VNPay (ưu tiên 1), MoMo (ưu tiên 2), chuyển khoản (manual verify bởi admin)
- SSL bắt buộc, redirect qua cổng thanh toán
- Form: thông tin adopter (pre-fill), tên san hô (tuỳ chọn), phương thức thanh toán, đồng ý điều khoản
- Trang xác nhận: Certificate preview, tải PDF, CTA dashboard, email xác nhận + PDF đính kèm
- Backend: Tạo coral record (status=pending), gán cho user

### 6.5 Admin Panel (/admin)

- Dashboard tổng quan: user, doanh thu, san hô đã adopt, conversion rate. Biểu đồ/chart.
- Quản lý User: Danh sách, tìm kiếm, khoá/mở, lịch sử thanh toán. Filter, export CSV.
- Quản lý Sản phẩm: CRUD gói, cập nhật giá, mở/đóng gói.
- Quản lý Nội dung: Chỉnh text, ảnh, đăng/xoá/sửa bài blog (CMS).
- Quản lý San hô: Pool san hô, gán cho adopter (Flow: mở user → "Assign Coral" → đề xuất → chọn → confirm → email).
- Analytics: Traffic, conversion, doanh thu theo tháng/quý. GA4 integration.
- Báo cáo: Export CSV/PDF danh sách adopter, doanh thu, impact.
- Quản lý nhân viên: Tạo/xoá tài khoản nhân viên trung tâm.
- Activity log: Mọi hành động admin được log: ai, làm gì, lúc nào.
- Bulk operations: Gửi email hàng loạt, export bulk.
- Refund: Admin trigger refund qua cổng thanh toán.
- Phân quyền: Super Admin (toàn quyền), Editor (chỉ nội dung), Coral Center (chỉ portal).

### 6.6 Coral Portal (/coral-portal)

- Dashboard: Danh sách san hô cần update (filter: chưa update/quá hạn)
- Form: Upload ảnh (1-5) + video (tuỳ chọn), drag & drop, preview, compress tự động
- Nhập chỉ số: Kích thước (cm), sức khỏe (dropdown: Tốt/TB/Cần chú ý), ghi chú
- Save → lưu + đồng bộ dashboard adopter + email notification "San hô của bạn vừa được update"
- Bulk upload: Chọn nhiều san hô cùng lúc
- Lịch sử update để tra cứu
- View-only: Xem dashboard adopter (read-only) để xác nhận đã update đúng
- **Mobile-first BẮT BUỘC** — nhân viên dùng điện thoại ngoài field

---

## 7. 3 GÓI SẢN PHẨM

### Gói 1: Seed Coral (Standard) — 200.000 – 300.000 VND
- Certificate kỹ thuật số (tên san hô, vị trí, ID)
- Cập nhật ảnh/video hàng tháng
- Dashboard cá nhân theo dõi growth
- Impact dashboard cá nhân
- Tham gia cộng đồng adopter

### Gói 2: Reef Guardian (Premium) — 500.000 – 700.000 VND
- Toàn bộ Seed Coral +
- Tracking growth chi tiết hơn (kích thước, sức khỏe, môi trường xung quanh)
- Premium video updates (chất lượng cao)
- GPS reef location (vùng tương đối)
- Báo cáo hàng quý chi tiết
- Ưu tiên hỗ trợ

### Gói 3: Diving Experience (Premium+) — 1.000.000 – 2.000.000 VND
- Toàn bộ Reef Guardian +
- 01 trải nghiệm lặn thực tế tại Nha Trang
- Tự tay trồng san hô (có hướng dẫn viên)
- Video kỷ niệm chuyến lặn
- Ăn trưa cùng team

---

## 8. 8 EMAIL TEMPLATES

| STT | Loại email | Trigger | Nội dung |
|-----|-----------|---------|----------|
| 1 | Welcome + Verify | Sau khi đăng ký | Link verify email, giới thiệu Coralume |
| 2 | Reset Password | Khi quên mật khẩu | Link reset (có thời hạn) |
| 3 | Xác nhận thanh toán | Sau khi TT thành công | Chi tiết gói + certificate PDF đính kèm |
| 4 | Coral Update | Nhân viên cập nhật san hô | Ảnh/video mới + link dashboard |
| 5 | Monthly Report | Hàng tháng (Reef Guardian+) | Báo cáo growth chi tiết |
| 6 | Quarterly Report | Hàng quý (Reef Guardian+) | Báo cáo impact + growth |
| 7 | Ambassador Chúc mừng | Khi đạt 5 referrals | Hướng dẫn nhận quà, badge |
| 8 | Assign Coral | Admin gán san hô thật | Tên san hô + ID + link dashboard |

---

## 9. IN SCOPE

- Toàn bộ 12 trang liệt kê ở trên
- 5 roles: Visitor, Adopter, Ambassador, Admin, Coral Staff
- 12 database entities (users, products, corals, adoptions, coral_updates, payments, referrals, blog_posts, community_submissions, certificates, admin_activity_logs, email_logs)
- ~60 API endpoints (public, authenticated, admin, coral portal)
- 8 email templates
- Certificate PDF generation
- Responsive mobile-first design
- WCAG 2.1 AA accessibility
- Payment integration (VNPay, MoMo)
- Referral/Ambassador program
- CMS cho blog và nội dung trang

---

## 10. OUT OF SCOPE

- Mobile app native (iOS/Android) — chỉ web responsive
- Multi-language (i18n) — chỉ tiếng Việt + tiếng Anh cơ bản ở slogan
- Real-time chat hoặc forum — community là submit stories + moderation
- Live video streaming — chỉ video upload/embed
- Subscription/recurring payment — chỉ one-time purchase
- International payment gateway (Stripe, PayPal) — chỉ VNPay/MoMo
- Advanced analytics dashboard cho adopter (chỉ basic impact)
- API public cho bên thứ 3

---

## 11. MILESTONE & TIMELINE

| STT | Milestone | Mô tả | Deadline |
|-----|-----------|-------|----------|
| 1 | Xác nhận spec | Đọc kỹ toàn bộ tài liệu, gửi câu hỏi cho PM | Trong 3 ngày từ khi nhận |
| 2 | Wireframe | Wireframe các trang chính (Home, Sản phẩm, Dashboard) gửi CLB duyệt | Tuần 1 |
| 3 | Mockup hoàn chỉnh | Design mockup (Figma) theo brand guideline. CLB review | Tuần 2-3 |
| 4 | Phát triển | Code frontend + backend song song. Test trên staging | Tuần 3-5 |
| 5 | Tích hợp thanh toán + email | VNPay/MoMo + email transactional. Test e2e | Tuần 5 |
| 6 | UAT | CLB test trên staging, gửi feedback. Dev fix | Tuần 5-6 |
| 7 | **Go-live** | Deploy production, redirect tên miền, kiểm tra cuối | **15/06/2026** |
| 8 | Hỗ trợ sau go-live | Bug fix + minor adjustment trong 30 ngày | 16/06 – 15/07/2026 |

---

## 12. SUCCESS CRITERIA

- [ ] Một signed-in user có thể tạo tài khoản, verify email, chọn gói, thanh toán thành công, và vào dashboard thấy san hô của mình
- [ ] Nhân viên trung tâm có thể đăng nhập Coral Portal, upload ảnh san hô, nhập chỉ số, và adopter tương ứng nhận email notification
- [ ] Admin có thể đăng nhập admin panel, gán san hô thật cho adopter mới, và xem báo cáo doanh thu
- [ ] Lighthouse score > 85 cho Performance, Accessibility, SEO trên trang Home và Products
- [ ] Responsive hoạt động đúng trên mobile (320px+), tablet (768px), desktop (1024px+)
- [ ] Payment flow e2e: Adopt → Register → Verify → Pay → Certificate → Dashboard
- [ ] Tất cả 8 email templates được test và gửi thành công
- [ ] Go-live production trước 15/06/2026
- [ ] Coral Portal flow: Staff login → Upload ảnh → Nhập chỉ số → Adopter thấy update
- [ ] HTTPS toàn site, rate limiting, email verification flow hoạt động
- [ ] Backup database schedule, SEO (sitemap, robots, meta, OG, Schema.org)
- [ ] GA4 + Meta Pixel installed