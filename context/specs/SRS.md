# Software Requirements Specification — Coralume

> **Phiên bản:** 1.0
> **Ngày tạo:** 03/06/2026
> **Trạng thái:** Final Draft
> **Nguồn:** Coralume-SRS.md (gốc), Coralume-Design-Spec.md

---

## 1. Giới thiệu

### 1.1 Mục đích

Tài liệu này xác lập toàn bộ yêu cầu chức năng và phi chức năng cho website **Coralume — Adopt a Coral**, một nền tảng "nhận nuôi san hô" kết hợp mô hình behavioral economics + ESG.

### 1.2 Phạm vi

- **12 trang public + protected:** Home, About, Products, Dashboard, Blog, Leaderboard, Community, Auth (Login/Register), Checkout, Success, Admin Panel, Coral Portal
- **5 roles:** Visitor, Adopter, Ambassador, Admin, Coral Staff
- **3 gói sản phẩm:** Seed Coral (200-300K), Reef Guardian (500-700K), Diving Experience (1-2M VND)
- **Thanh toán:** VNPay, MoMo, chuyển khoản ngân hàng
- **8 email templates** transactional
- **Certificate PDF** generation
- **Referral/Ambassador** program (5 referrals = upgrade)
- **Go-live deadline:** 15/06/2026

### 1.3 Thuật ngữ

| Thuật ngữ | Định nghĩa |
|-----------|------------|
| Adopter | Người đã nhận nuôi san hô (đã đăng ký + đã thanh toán) |
| Ambassador | Adopter đã giới thiệu ≥ 5 người qua mã AFF |
| Coral Staff | Nhân viên trung tâm san hô tại Nha Trang, cập nhật ảnh/video qua Coral Portal |
| Coral Pool | Tập hợp san hô chưa được gán cho adopter |
| Adoption | Liên kết giữa user và san hô (có tên自定义, ID, status) |
| Certificate | Giấy chứng nhận nhận nuôi san hô (PDF) |
| AFF Code | Mã giới thiệu (CRL-[USERNAME]) |
| Growth Update | Cập nhật định kỳ từ Coral Staff: ảnh, video, kích thước, sức khỏe |
| VNPay / MoMo | Cổng thanh toán Việt Nam |
| S3 / R2 | Cloud storage cho ảnh/video/certificate |
| Dashboard | Khu vực adopter theo dõi san hô của mình |
| Coral Portal | Backend cho nhân viên trung tâm san hô cập nhật data |

### 1.4 Tone of Voice

- **Phong cách:** Ấm, cá nhân, có dữ liệu — KHÔNG kêu gọi từ thiện
- **Tuyệt đối tránh:** "hãy quyên góp", "cứu lấy đại dương"
- **Thay vào đó:** "san hô của bạn", "theo dõi sự phát triển", "impact của bạn"
- **Cảm xúc mục tiêu:** Sở hữu + Tự hào + Kết nối thiên nhiên

---

## 2. Tổng quan hệ thống

### 2.1 Kiến trúc

```
App Client (Next.js Web — SSR/SSG)
  ↓ REST API (Next.js Route Handlers)
App Server (Next.js API Routes)
  ↓
Database (PostgreSQL) + Storage (S3/R2)
  ↓
Third-party: VNPay/MoMo, Email (Resend/SES), Maps, GA4
```

**Luồng chính — Khách mới → Adopter:**
1. Khách mới vào website (Home) → Đọc hero, stats, 3 gói preview
2. Click "Nhận nuôi ngay" → Products page → So sánh 3 gói → Chọn gói
3. Chưa đăng nhập → Modal auth → Đăng ký → Gửi email verify
4. Click link verify → Tài khoản kích hoạt → Quay lại Products (gói giữ trong session)
5. Bấm "Tiến hành thanh toán" → Form + chọn VNPay/MoMo → Redirect cổng thanh toán
6. Thanh toán thành công → Callback → Trang cảm ơn + Certificate + Email xác nhận
7. Backend: Tạo coral record (pending) → Assign trong 7 ngày → Active
8. Adopter vào dashboard → Theo dõi san hô, nhận email update hàng tháng

### 2.2 User Roles

| Role | Mô tả | Quyền truy cập |
|------|--------|----------------|
| Visitor | Chưa đăng ký | Trang public: Home, About, Products, Blog, Leaderboard, Community |
| Adopter | Đã đăng ký + đã nhận nuôi | Dashboard, checkout, profile, referral |
| Ambassador | Adopter giới thiệu ≥ 5 người | Adopter + badge, quà tặng, voucher, event |
| Admin | Quản trị viên Coralume | Toàn quyền qua /admin (Super Admin, Editor, Coral Center) |
| Coral Staff | Nhân viên trung tâm SH | Chỉ /coral-portal (upload ảnh, nhập chỉ số) |

### 2.3 Pre-Conditions

- PostgreSQL database đã setup và reachable
- Environment variables đã configured (.env)
- Next.js project đã scaffold với TypeScript, Tailwind, Prisma

### 2.4 Post-Conditions

- User có thể đăng ký, verify email, thanh toán, và vào dashboard
- Coral Staff có thể cập nhật san hô qua mobile
- Admin có thể quản lý hệ thống
- Email transactional được gửi đúng trigger

---

## 3. Yêu cầu chức năng

### 3.1 Trang chủ (Home)

#### FR-001: Hero Section
- **Mô tả:** Hero full-width với video/ảnh underwater (1920×1080), overlay Navy 20%, headline Lora Bold 64px, sub 22px, CTA Coral Orange solid + CTA phụ ghost button
- **Acceptance Criteria:**
  - [ ] Video autoplay, loop, mute. Fallback ảnh tĩnh nếu không load được
  - [ ] Mobile (< 768px): Ưu tiên ảnh tĩnh, chỉ play video nếu WiFi
  - [ ] Overlay gradient: Navy rgba(15, 76, 92, 0.3) → 0.15 → 0.05
  - [ ] Headline: "Nhận nuôi san hô — Gieo mầm cho đại dương"
  - [ ] CTA chính: "Nhận nuôi ngay →" → Link /san-pham
  - [ ] CTA phụ: "Tìm hiểu thêm ↓" → Scroll mượt xuống section 2
  - [ ] Animation: Video fade-in 1.5s → Headline fade+slide-up 0.8s delay 0.2s → Sub 0.6s delay 0.5s → CTA 0.5s delay 0.8s

#### FR-002: Stats Section
- **Mô tả:** 3 số liệu impact — count-up animation khi scroll tới
- **Acceptance Criteria:**
  - [ ] Stat 1: "< 1%" — Tỉ lệ diện tích đáy biển san hô chiếm
  - [ ] Stat 2: "25%" — Lượng sinh vật biển phụ thuộc vào san hô
  - [ ] Stat 3: "50%" — Diện tích rạn san hô đã mất từ 1950
  - [ ] Count-up từ 0→giá trị, 2s ease-out, play once
  - [ ] Intersection Observer threshold 0.15, root-margin -50px

#### FR-003: How It Works Section
- **Mô tả:** 3 steps — "Chọn gói → Đặt tên → Theo dõi & cùng lớn lên"
- **Acceptance Criteria:**
  - [ ] 3 cột desktop, 1 cột mobile
  - [ ] Hover: scale 1.05 từng card
  - [ ] Mỗi step: icon + tiêu đề + mô tả ngắn

#### FR-004: Products Preview Section
- **Mô tả:** 3 gói cards preview với hover animation
- **Acceptance Criteria:**
  - [ ] 3 cards: Seed Coral, Reef Guardian, Diving Experience
  - [ ] Hover: translateY(-8px) + shadow-card-hover + border teal
  - [ ] Badge "Phổ biến nhất" trên card mong muốn
  - [ ] Click "Adopt" → /san-pham?goi={slug}

#### FR-005: Partner Section
- **Mô tả:** Logo + ảnh team trung tâm san hô Nha Trang
- **Acceptance Criteria:**
  - [ ] Placeholder: "Đang chờ ảnh từ CLB" khi chưa có ảnh
  - [ ] Link "Tìm hiểu thêm" → website đối tác

#### FR-006: CTA Banner Cuối Trang
- **Mô tả:** Full-width gradient Navy → Teal, parallax nhẹ, CTA pulse 2s/lần
- **Acceptance Criteria:**
  - [ ] Background: Gradient Navy Deep → Teal Mid
  - [ ] Headline: "Sẵn sàng nhận nuôi san hô đầu tiên của bạn?"
  - [ ] CTA: "Bắt đầu ngay →" với pulse animation
  - [ ] Padding: 120px top/bottom desktop, 80px mobile

#### FR-007: Footer
- **Mô tả:** 3 cột — Logo+slogan, Navigation, Contact
- **Acceptance Criteria:**
  - [ ] Background: Navy Deep
  - [ ] Text: Beige Sand, Links: Ocean Blue
  - [ ] Icon hover: Coral Orange
  - [ ] Copyright: "© 2026 Coralume. Đối tác: Trung tâm san hô Nha Trang"
  - [ ] Mobile: Stack dọc
  - [ ] Sticky header khi scroll > 100px

---

### 3.2 Trang Về Chúng Tôi (About)

#### FR-010: About Hero
- **Mô tả:** Headline "Chúng tôi không phải tổ chức từ thiện..." với line-by-line reveal
- **Acceptance Criteria:**
  - [ ] Dòng 1: fade-in + slide-up
  - [ ] 0.4s delay → Dòng 2 Lora Italic
  - [ ] Ảnh underwater cinematic

#### FR-011: Mission & Vision
- **Mô tả:** 2 cột — text trái, ảnh phải
- **Acceptance Criteria:**
  - [ ] Sứ mệnh: "Khuyến khích người trẻ có trách nhiệm với môi trường..."
  - [ ] Ảnh team Coralume (CLB cung cấp)

#### FR-012: Founder Story
- **Mô tả:** Storytelling dạng article
- **Acceptance Criteria:**
  - [ ] Font Lora Italic cho dẫn dắt, body Inter
  - [ ] Ảnh founder cận cảnh

#### FR-013: Team Grid
- **Mô tả:** Grid ảnh chân dung 600×600px + tên + chức danh
- **Acceptance Criteria:**
  - [ ] 3-4 cột desktop, 2 tablet, 1 mobile
  - [ ] Hover: zoom 1.03 + hiện role

#### FR-014: Process Timeline
- **Mô tả:** Timeline horizontal (desktop) / vertical (mobile)
- **Acceptance Criteria:**
  - [ ] SVG line vẽ kết nối các bước, 1.5s khi scroll tới
  - [ ] 4 bước: Thanh toán → Gán san hô → Chăm sóc → Theo dõi

#### FR-015: Transparency Commitment
- **Mô tả:** "100% doanh thu sau chi phí vận hành..."
- **Acceptance Criteria:**
  - [ ] Hiển thị nổi bật với border/icon

---

### 3.3 Trang Sản Phẩm (Products)

#### FR-020: Products Hero
- **Mô tả:** "Nuôi 1 bé san hô ngay tại đây!"
- **Acceptance Criteria:**
  - [ ] Title + sub-headline
  - [ ] "Mỗi gói là một mức cam kết và một mức trải nghiệm khác nhau"

#### FR-021: 3 Gói Chi Tiết
- **Mô tả:** Seed Coral, Reef Guardian, Diving Experience — giá, quyền lợi, CTA
- **Acceptance Criteria:**
  - [ ] Seed Coral: 200-300K, 5 quyền lợi
  - [ ] Reef Guardian: 500-700K, border Coral nổi bật, 6 quyền lợi
  - [ ] Diving Experience: 1-2M, badge "Trải nghiệm thật", 5 quyền lợi
  - [ ] Mỗi gói: tên, giá, danh sách quyền lợi, CTA "Nhận nuôi ngay"

#### FR-022: Bảng So Sánh
- **Mô tả:** Bảng so sánh 3 gói theo tính năng
- **Acceptance Criteria:**
  - [ ] Sticky header khi scroll
  - [ ] Zebra striping
  - [ ] Mobile: Scroll ngang, sticky column "Tính năng"

#### FR-023: Referral / Ambassador Program
- **Mô tả:** "Mời bạn bè — Trở thành Ambassador"
- **Acceptance Criteria:**
  - [ ] 5 referrals = Badge + Quà + Voucher lặn + Event invite
  - [ ] Hiển thị cơ chế nâng cấp

#### FR-024: FAQ Accordion
- **Mô tả:** 5 câu hỏi — expand/collapse
- **Acceptance Criteria:**
  - [ ] FAQ-1: "San hô của tôi có thật không?" → Có, ID riêng
  - [ ] FAQ-2: "Tôi có được đến thăm san hô không?" → Diving Experience
  - [ ] FAQ-3: "Nếu san hô chết?" → Trồng mới (> 85% sống)
  - [ ] FAQ-4: "Nhận nuôi nhiều san hô?" → Có
  - [ ] FAQ-5: "Coralume có phải từ thiện?" → Không, social impact
  - [ ] Animation: grid-template-rows 0fr→1fr, 0.3s ease-out-expo

---

### 3.4 Auth — Đăng Nhập / Đăng Ký

#### FR-030: Register
- **Mô tả:** Form đăng ký — họ tên, email, mật khẩu, xác nhận mật khẩu, SĐT, đồng ý điều khoản
- **Acceptance Criteria:**
  - [x] Họ tên: tối thiểu 2 ký tự
  - [x] Email: format hợp lệ, uniqueness check
  - [x] Mật khẩu: tối thiểu 8 ký tự, strength meter (4 levels: Yếu → Mạnh)
  - [x] Xác nhận mật khẩu: Zod refinement check khớp với password
  - [x] SĐT: tuỳ chọn, format Việt Nam
  - [x] Checkbox đồng ý điều khoản (bắt buộc)
  - [x] Submit → Gửi email verify
  - [x] Success state: "Kiểm tra email của bạn"

#### FR-031: Login
- **Mô tả:** Form đăng nhập — email, mật khẩu, Google OAuth
- **Acceptance Criteria:**
  - [x] Email + mật khẩu
  - [x] Link "Quên mật khẩu?"
  - [x] Link "Đăng ký mới"
  - [x] Google OAuth button với "hoặc" divider
  - [x] Remember-me 30 ngày (cookie maxAge mặc định)
  - [x] OAuth error handling: 7 error codes → Vietnamese messages
  - [x] Validation realtime (react-hook-form + zod)

#### FR-032: Forgot Password
- **Mô tả:** Nhập email → Nhận link reset
- **Acceptance Criteria:**
  - [x] Không reveal email tồn tại (anti-enumeration)
  - [x] Link reset expiry: 15 phút

#### FR-033: Email Verification
- **Mô tả:** BẮT BUỘC verify email trước khi thanh toán
- **Acceptance Criteria:**
  - [x] Click link verify → Auto verify
  - [x] Token expiry: 24h
  - [x] Success → Text "Tài khoản của bạn đã được kích hoạt. [Đăng nhập]"
  - [x] Error → Hướng dẫn đăng ký lại

#### FR-034: Session Management
- **Mô tả:** JWT httpOnly cookie, remember-me 30 ngày
- **Acceptance Criteria:**
  - [x] Token lưu trong httpOnly cookie (KHÔNG localStorage)
  - [x] Secure flag trong production
  - [x] SameSite: lax
  - [x] Expiry: 30d

---

### 3.5 Dashboard Cá Nhân

#### FR-040: Dashboard Access
- **Mô tả:** Yêu cầu đăng nhập mới truy cập
- **Acceptance Criteria:**
  - [ ] Chưa đăng nhập → Redirect /dang-nhap
  - [ ] Chưa có san hô → Empty state + CTA "Nhận nuôi san hô đầu tiên"

#### FR-041: Welcome Banner
- **Mô tả:** "Chào mừng, [Tên]! Bạn đang chăm sóc [N] san hô." + Avatar
- **Acceptance Criteria:**
  - [ ] Hiển thị tên adopter
  - [ ] Số lượng san hô đang chăm sóc

#### FR-042: Quick Stats
- **Mô tả:** 3 chỉ số — Tổng san hô, Diện tích reef (m²), Tháng đồng hành
- **Acceptance Criteria:**
  - [ ] 3 cột layout
  - [ ] Count-up animation khi load
  - [ ] Font JetBrains Mono cho số liệu

#### FR-043: Coral Grid
- **Mô tả:** Danh sách san hô — 3 cột desktop → 2 tablet → 1 mobile
- **Acceptance Criteria:**
  - [ ] Mỗi card: Ảnh mới nhất + Tên + ID (CRL-2026-XXXX) + Ngày nhận nuôi + Gói + Trạng thái sức khỏe
  - [ ] Hover: shadow + translateY(-6px)
  - [ ] Click → Modal chi tiết
  - [ ] Stagger fade-in (100ms mỗi card)
  - [ ] Badge "New update" cho san hô có update mới

#### FR-044: Coral Detail Modal
- **Mô tả:** Chi tiết từng san hô
- **Acceptance Criteria:**
  - [ ] Header: Tên san hô + ID + Ảnh lớn
  - [ ] Growth timeline: Timeline vertical các update theo tháng (lazy load)
  - [ ] GPS map: Bản đồ vùng reef tương đối (KHÔNG tọa độ chính xác)
  - [ ] Stats: Kích thước (cm), Sức khỏe (Tốt/TB/Cần chú ý), Tốc độ growth, Loài
  - [ ] Certificate: Xem/Tải PDF/Chia sẻ
  - [ ] Modal animation: overlay fade 0.2s + content slide-up 60px 0.35s

#### FR-045: Impact Dashboard
- **Mô tả:** Biểu đồ impact tổng hợp
- **Acceptance Criteria:**
  - [ ] Tổng san hô
  - [ ] Diện tích reef hỗ trợ (m²)
  - [ ] Lượng CO₂ ước tính hấp thụ
  - [ ] Số sinh vật biển ước tính hỗ trợ

#### FR-046: Referral Code (AFF)
- **Mô tả:** Mã giới thiệu + progress bar
- **Acceptance Criteria:**
  - [ ] Mã: CRL-[USERNAME]
  - [ ] [Sao chép] [Chia sẻ link]
  - [ ] Đã giới thiệu [N] người
  - [ ] Progress bar tới Ambassador (5-N)
  - [ ] Đạt 5 → Confetti animation + popup chúc mừng

#### FR-047: Profile Settings
- **Mô tả:** Chỉnh thông tin cá nhân
- **Acceptance Criteria:**
  - [ ] Tên hiển thị, Avatar, Email, Mật khẩu
  - [ ] Notification email (toggle)
  - [ ] Public profile (toggle)
  - [ ] Auto-save on blur (debounce 500ms)

---

### 3.6 Thanh Toán

#### FR-050: Checkout Page
- **Mô tả:** Form thanh toán sau khi chọn gói
- **Acceptance Criteria:**
  - [ ] BẮT BUỘC đăng nhập + email verified
  - [ ] Giữ gói đã chọn trong session
  - [ ] SSL toàn trang
  - [ ] Form: Thông tin adopter (pre-fill), Tên san hô (tuỳ chọn), Phương thức thanh toán, Đồng ý điều khoản

#### FR-051: Payment Methods
- **Mô tả:** VNPay (ưu tiên 1), MoMo (ưu tiên 2), chuyển khoản (manual verify)
- **Acceptance Criteria:**
  - [ ] VNPay: Redirect sang cổng VNPay
  - [ ] MoMo: Redirect / QR
  - [ ] Chuyển khoản: Manual verify bởi admin, upload ảnh chứng từ
  - [ ] KHÔNG lưu thông tin thẻ (PCI compliance)

#### FR-052: Success / Thank You Page
- **Mô tả:** Sau thanh toán thành công
- **Acceptance Criteria:**
  - [ ] Certificate preview
  - [ ] Link tải PDF certificate
  - [ ] CTA "Vào Dashboard"
  - [ ] Email xác nhận + certificate PDF đính kèm
  - [ ] Backend: Tạo coral record (status=pending), gán cho user

---

### 3.7 Blog / Kiến Thức San Hô

#### FR-060: Blog Listing
- **Mô tả:** Danh sách bài viết với categories filter
- **Acceptance Criteria:**
  - [ ] Categories: Sinh thái san hô, Bảo tồn, Kinh tế xanh, Chuyến lặn của adopter
  - [ ] Click filter → ajax reload
  - [ ] Article grid: thumbnail, tiêu đề, tóm tắt 2 dòng, ngày, tag, thời gian đọc
  - [ ] Pagination 12 bài/trang

#### FR-061: Blog Detail
- **Mô tả:** Trang chi tiết bài viết
- **Acceptance Criteria:**
  - [ ] Max-width 720px, font 18px, line-height 1.7
  - [ ] TOC sticky cho bài dài
  - [ ] Scroll progress bar
  - [ ] Comment section (Disqus hoặc tự build sau)

#### FR-062: Blog CMS
- **Mô tả:** Admin có thể đăng/bài qua admin panel
- **Acceptance Criteria:**
  - [ ] CRUD bài viết
  - [ ] Draft/Published status
  - [ ] Upload featured image

---

### 3.8 Leaderboard

#### FR-070: Top Rankings
- **Mô tả:** Bảng xếp hạng adopter
- **Acceptance Criteria:**
  - [ ] Top 10 tháng
  - [ ] Top 20 all-time
  - [ ] Top 3 highlight đặc biệt
  - [ ] Số xếp hạng count-up animation

#### FR-071: My Ranking
- **Mô tả:** Vị trí của adopter (nếu đăng nhập)
- **Acceptance Criteria:**
  - [ ] Chỉ hiện khi logged in
  - [ ] Vị trí hiện tại + cần bao nhiêu để lên hạng tiếp
  - [ ] Adopter có thể chọn ẩn danh

---

### 3.9 Community

#### FR-080: Adopter Stories
- **Mô tả:** Showcase ảnh + tên adopter + tên san hô + câu chuyện
- **Acceptance Criteria:**
  - [ ] Masonry layout
  - [ ] Click → modal full
  - [ ] Có moderation trước khi public

#### FR-081: Video Gallery
- **Mô tả:** Video từ trung tâm và adopter
- **Acceptance Criteria:**
  - [ ] Embed YouTube/Vimeo
  - [ ] Click → lightbox player

#### FR-082: Submit Form
- **Mô tả:** Adopter submit câu chuyện
- **Acceptance Criteria:**
  - [ ] Ảnh + text
  - [ ] Admin duyệt rồi đăng
  - [ ] Limit dung lượng ảnh
  - [ ] multipart/form-data

---

### 3.10 Admin Panel

#### FR-090: Admin Dashboard
- **Mô tả:** Tổng quan hệ thống
- **Acceptance Criteria:**
  - [ ] Số user, doanh thu, san hô đã adopt, conversion rate
  - [ ] Biểu đồ/chart theo thời gian

#### FR-091: User Management
- **Mô tả:** CRUD user
- **Acceptance Criteria:**
  - [ ] Danh sách, tìm kiếm, khoá/mở tài khoản
  - [ ] Xem lịch sử thanh toán
  - [ ] Filter theo ngày, gói
  - [ ] Export CSV

#### FR-092: Product Management
- **Mô tả:** CRUD sản phẩm
- **Acceptance Criteria:**
  - [ ] Thêm/sửa/xoá gói
  - [ ] Cập nhật giá
  - [ ] Mở/đóng gói

#### FR-093: Content Management (CMS)
- **Mô tả:** Chỉnh text, ảnh, blog
- **Acceptance Criteria:**
  - [ ] Chỉnh text trên các trang
  - [ ] Cập nhật ảnh
  - [ ] Đăng/xoá/sửa bài blog

#### FR-094: Coral Management
- **Mô tả:** Pool san hô, gán cho adopter
- **Acceptance Criteria:**
  - [ ] Pool san hô có sẵn
  - [ ] Flow: mở user detail → "Assign Coral" → đề xuất từ pool → chọn → confirm
  - [ ] Status user: pending → active → email notification

#### FR-095: Analytics & Reports
- **Mô tả:** Analytics + báo cáo
- **Acceptance Criteria:**
  - [ ] Traffic, conversion, doanh thu theo tháng/quý
  - [ ] GA4 integration
  - [ ] Export CSV/PDF
  - [ ] Bulk email, bulk export

#### FR-096: Staff Management
- **Mô tả:** Tạo/xoá tài khoản nhân viên trung tâm
- **Acceptance Criteria:**
  - [ ] CRUD staff accounts
  - [ ] Role: coral_staff

#### FR-097: Activity Log
- **Mô tả:** Log mọi hành động admin
- **Acceptance Criteria:**
  - [ ] Ai, làm gì, lúc nào
  - [ ] Không thể xoá log

#### FR-098: Admin Role Sub-types
- **Mô tả:** Phân quyền admin
- **Acceptance Criteria:**
  - [ ] Super Admin: Toàn quyền
  - [ ] Editor: Chỉ chỉnh nội dung (blog, text, ảnh)
  - [ ] Coral Center: Chỉ portal san hô

---

### 3.11 Coral Portal

#### FR-100: Portal Dashboard
- **Mô tả:** Danh sách san hô cần cập nhật
- **Acceptance Criteria:**
  - [ ] Filter: chưa update tháng này / quá hạn
  - [ ] Mobile-friendly BẮT BUỘC (nhân viên dùng điện thoại ngoài field)
  - [ ] KHÔNG animation

#### FR-101: Coral Update Form
- **Mô tả:** Upload ảnh/video + nhập chỉ số
- **Acceptance Criteria:**
  - [ ] Upload ảnh (1-5 ảnh) — drag & drop, preview
  - [ ] Video (tuỳ chọn)
  - [ ] Compress ảnh tự động
  - [ ] Nhập: kích thước (cm), sức khỏe (dropdown: Tốt/TB/Cần chú ý), ghi chú
  - [ ] Validation đầy đủ

#### FR-102: Save & Sync
- **Mô tả:** Lưu + đồng bộ
- **Acceptance Criteria:**
  - [ ] Save → Lưu + tự động đồng bộ dashboard adopter
  - [ ] Email tự động gửi adopter: "San hô của bạn vừa được update"
  - [ ] San hô biến mất khỏi filter "cần update"

#### FR-103: Bulk Upload
- **Mô tả:** Chọn nhiều san hô cùng lúc để upload ảnh
- **Acceptance Criteria:**
  - [ ] Multi-select san hô
  - [ ] Upload ảnh chung cho nhiều san hô

#### FR-104: View-Only Dashboard
- **Mô tả:** Xem dashboard adopter (read-only)
- **Acceptance Criteria:**
  - [ ] Xác nhận đã update đúng
  - [ ] Không thể chỉnh sửa từ portal

---

### 3.12 Auth — API Endpoints

#### FR-110: POST /api/v1/auth/register
- **Mô tả:** Đăng ký tài khoản mới
- **Acceptance Criteria:**
  - [x] Validate: fullName, email, password, confirmPassword, phone, agreeTerms
  - [x] Check email uniqueness
  - [x] Hash password (bcrypt, 12 rounds)
  - [x] Create user (role=adopter, isVerified=false)
  - [x] Create email verification token (24h expiry)
  - [x] Create JWT, set httpOnly cookie (30d)
  - [x] Response: user data (không trả password hash)
  - [x] 409 nếu email đã tồn tại

#### FR-111: POST /api/v1/auth/login
- **Mô tả:** Đăng nhập
- **Acceptance Criteria:**
  - [x] Validate: email, password
  - [x] Find user + verify password
  - [x] 401 nếu sai credentials hoặc account không active
  - [x] Create JWT, set httpOnly cookie
  - [x] Response: user data + role + isVerified

#### FR-112: POST /api/v1/auth/logout
- **Mô tả:** Đăng xuất
- **Acceptance Criteria:**
  - [x] Clear token cookie (maxAge=0)

#### FR-113: POST /api/v1/auth/verify-email
- **Mô tả:** Xác thực email
- **Acceptance Criteria:**
  - [x] Validate verify token (24h expiry)
  - [x] Update user.isVerified = true
  - [x] Create new JWT with isVerified=true
  - [x] 400 nếu token hết hạn/không hợp lệ

#### FR-114: POST /api/v1/auth/forgot-password
- **Mô tả:** Gửi link reset password
- **Acceptance Criteria:**
  - [x] Validate email
  - [x] Create reset token (15m expiry)
  - [x] KHÔNG reveal email tồn tại (anti-enumeration)
  - [x] Luôn trả về: "Nếu email tồn tại, bạn sẽ nhận được link..."

#### FR-115: POST /api/v1/auth/reset-password
- **Mô tả:** Đặt lại mật khẩu
- **Acceptance Criteria:**
  - [x] Validate reset token (15m expiry)
  - [x] Validate new password (min 8 chars)
  - [x] Hash + update password
  - [x] 400 nếu token hết hạn

#### FR-116: GET / PUT /api/v1/me
- **Mô tả:** Lấy/cập nhật profile người dùng hiện tại
- **Acceptance Criteria:**
  - [x] GET: Return user data (không password hash)
  - [x] PUT: Validate input, update profile
  - [x] 401 nếu chưa đăng nhập

#### FR-117: GET /api/v1/auth/google + GET /api/v1/auth/google/callback
- **Mô tả:** Google OAuth 2.0 — redirect sang Google + callback xử lý
- **Acceptance Criteria:**
  - [x] GET /api/v1/auth/google → Redirect Google OAuth consent screen
  - [x] GET /api/v1/auth/google/callback → Exchange code, fetch user info
  - [x] Find or create user (auto-verify nếu Google email_verified=true)
  - [x] Block nếu user.isActive=false
  - [x] Set JWT cookie + redirect /dashboard
  - [x] 501 nếu GOOGLE_CLIENT_ID chưa cấu hình

---

## 4. Yêu cầu phi chức năng

### 4.1 Performance & SEO

#### NFR-001: Lighthouse Score
- **Mô tả:** Lighthouse > 85 cho Performance, Accessibility, SEO
- **Acceptance Criteria:**
  - [ ] Lighthouse Performance > 85 trên Home và Products
  - [ ] Lighthouse Accessibility > 85
  - [ ] Lighthouse SEO > 85

#### NFR-002: Image Optimization
- **Mô tả:** Tối ưu hình ảnh
- **Acceptance Criteria:**
  - [ ] Lazy loading (`loading="lazy"`) cho ảnh dưới fold
  - [ ] WebP format với fallback JPG
  - [ ] Responsive `srcset` (400w, 800w, 1200w, 1920w)
  - [ ] Blur-up placeholder (Ocean Blue blur)
  - [ ] Alt text BẮT BUỘC (WCAG 2.1 AA)

#### NFR-003: SEO
- **Mô tả:** SEO setup đầy đủ
- **Acceptance Criteria:**
  - [ ] Meta tags đầy đủ cho mỗi trang
  - [ ] Open Graph tags (cho share social)
  - [ ] sitemap.xml
  - [ ] robots.txt
  - [ ] Schema.org structured data
  - [ ] GA4 + Meta Pixel installed

### 4.2 Responsive & Accessibility

#### NFR-010: Responsive Breakpoints
- **Mô tả:** Mobile-first responsive
- **Acceptance Criteria:**
  - [ ] Mobile: 320px-767px (60%+ traffic)
  - [ ] Tablet: 768px-1023px (~20%)
  - [ ] Desktop: 1024px-1440px (~20%)
  - [ ] Wide: 1441px+
  - [ ] Container: fluid → 720px → 1200px
  - [ ] Padding: 16px → 24px → 32px

#### NFR-011: Accessibility (WCAG 2.1 AA)
- **Mô tả:** Đáp ứng WCAG 2.1 AA
- **Acceptance Criteria:**
  - [ ] Contrast ratios: Text Dark trên White = 12.6:1 ✅
  - [ ] Tất cả images có `alt` text
  - [ ] Form inputs có `<label>` liên kết
  - [ ] Keyboard navigation (Tab, Enter, Escape)
  - [ ] Skip-to-content link
  - [ ] ARIA labels cho icon buttons, modals, accordions
  - [ ] Focus visible: 2px solid Coral Orange
  - [ ] `prefers-reduced-motion: reduce` support

### 4.3 Bảo Mật

#### NFR-020: HTTPS & Input Security
- **Mô tả:** Bảo mật cơ bản
- **Acceptance Criteria:**
  - [ ] HTTPS bắt buộc toàn site (Let's Encrypt)
  - [ ] Input validate cả client-side VÀ server-side (Zod)
  - [ ] Sanitize input chống XSS
  - [ ] ORM hoặc prepared statements (không concat SQL)
  - [ ] Rate limiting cho login, register, payment endpoints

#### NFR-021: Data Protection
- **Mô tả:** Bảo vệ dữ liệu nhạy cảm
- **Acceptance Criteria:**
  - [ ] KHÔNG lưu thông tin thẻ (PCI compliance)
  - [ ] Password hashing: bcrypt 12 rounds
  - [ ] JWT trong httpOnly cookie (KHÔNG localStorage)
  - [ ] GPS chính xác chỉ cho admin/staff
  - [ ] Backup database hàng ngày, lưu 30 ngày

#### NFR-022: Admin Security
- **Mô tả:** Bảo mật admin panel
- **Acceptance Criteria:**
  - [ ] URL: /admin (không liên kết public)
  - [ ] 2FA khuyến nghị cho admin
  - [ ] Activity log đầy đủ

### 4.4 Realtime & Notification

#### NFR-030: Email Notification
- **Mô tả:** Email tự động theo trigger
- **Acceptance Criteria:**
  - [ ] Welcome + Verify email → sau đăng ký
  - [ ] Reset password → sau forgot password request
  - [ ] Payment confirm + certificate PDF → sau thanh toán
  - [ ] Coral update → sau Coral Staff upload
  - [ ] Monthly/Quarterly report → Reef Guardian+
  - [ ] Ambassador chúc mừng → khi đạt 5 referrals
  - [ ] Assign coral → khi admin gán san hô thật

---

## 5. Database Schema

### 5.1 Entities (12 models)

| Entity | Primary Key | Key Relations | Notes |
|--------|------------|---------------|-------|
| User | UUID (uuid()) | → Adoption[], Payment[], Referral[], BlogPost[] | 6 roles, email verify |
| Product | UUID (uuid()) | ← Adoption[] | 3 tiers: standard/premium/premium_plus |
| Coral | UUID (uuid()) | → Adoption[], CoralUpdate[] | GPS protection (zone vs exact) |
| Adoption | UUID (uuid()) | → User, Coral?, Product | Custom name, status flow |
| CoralUpdate | UUID (uuid()) | → Coral, User (staff) | Images array (1-5), health enum |
| Payment | UUID (uuid()) | → User, Adoption? | 3 methods, 4 statuses |
| Referral | UUID (uuid()) | → User (referrer), User (referred) | Self-referential |
| BlogPost | UUID (uuid()) | → User (author) | Categories, tags, draft/published |
| CommunitySubmission | UUID (uuid()) | → User | Moderation workflow |
| Certificate | UUID (uuid()) | → Adoption (1:1) | PDF URL |
| AdminActivityLog | UUID (uuid()) | → User (admin) | Audit trail |
| EmailLog | UUID (uuid()) | → User | 9 email types, status tracking |

---

## 6. API Specifications (High-Level)

### 6.1 Public Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/v1/products | No | Danh sách gói (active) |
| GET | /api/v1/products/:slug | No | Chi tiết gói |
| GET | /api/v1/blog/posts | No | Blog listing (published) |
| GET | /api/v1/blog/posts/:slug | No | Blog detail |
| GET | /api/v1/leaderboard | No | Bảng xếp hạng |
| GET | /api/v1/community/stories | No | Câu chuyện (approved) |
| GET | /api/v1/impact/totals | No | Impact tổng hợp |
| POST | /api/v1/auth/register | No | Đăng ký |
| POST | /api/v1/auth/login | No | Đăng nhập |
| POST | /api/v1/auth/logout | No | Đăng xuất |
| POST | /api/v1/auth/forgot-password | No | Quên mật khẩu |
| POST | /api/v1/auth/reset-password | No | Reset mật khẩu |
| POST | /api/v1/auth/verify-email | No | Verify email (token trong body) |
| GET | /api/v1/auth/google | No | Google OAuth — redirect |
| GET | /api/v1/auth/google/callback | No | Google OAuth — callback |
| POST | /api/v1/contact | No | Form liên hệ |

### 6.2 Authenticated Endpoints (Adopter)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/v1/me | Yes | Profile |
| PUT | /api/v1/me | Yes | Update profile |
| GET | /api/v1/me/dashboard | Yes | Dashboard data |
| GET | /api/v1/me/adoptions | Yes | Danh sách san hô |
| GET | /api/v1/me/adoptions/:id | Yes | Chi tiết adoption |
| GET | /api/v1/me/impact | Yes | Impact dashboard |
| GET | /api/v1/me/certificate/:id | Yes | Certificate |
| POST | /api/v1/orders | Yes (verified) | Tạo đơn hàng |
| POST | /api/v1/payments/callback/:gateway | No | Payment callback |

### 6.3 Admin Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/v1/admin/dashboard | Admin | Tổng quan |
| GET | /api/v1/admin/users | Admin | Danh sách user |
| GET | /api/v1/admin/products | Admin | CRUD sản phẩm |
| POST | /api/v1/admin/corals | Admin | Pool san hô |
| POST | /api/v1/admin/adoptions/:id/assign | Admin | Gán san hô |
| GET | /api/v1/admin/blog | Admin | CRUD blog |
| GET | /api/v1/admin/analytics | Admin | Analytics |
| POST | /api/v1/admin/staff | Admin | Quản lý nhân viên |

### 6.4 Coral Portal Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/v1/portal/corals | Staff | Danh sách cần update |
| POST | /api/v1/portal/corals/:id/updates | Staff | Tạo update mới |
| POST | /api/v1/portal/corals/bulk-update | Staff | Bulk upload |

---

## 7. Integration Points

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| VNPay | Payment gateway | Redirect + callback webhook |
| MoMo | Payment gateway | Redirect/QR + callback webhook |
| Resend / AWS SES | Transactional emails | REST API |
| S3 / Cloudflare R2 | File storage | SDK (upload, presigned URL) |
| Google OAuth | Social login | OAuth 2.0 |
| Google Maps / Mapbox | GPS embed | JS SDK embed |
| Google Analytics 4 | Analytics | Script embed |
| Meta Pixel | Remarketing | Script embed |

---

## 8. Milestone & Timeline

| STT | Milestone | Deadline |
|-----|-----------|----------|
| 1 | Xác nhận spec | Trong 3 ngày |
| 2 | Wireframe | Tuần 1 |
| 3 | Mockup (Figma) | Tuần 2-3 |
| 4 | Phát triển (Frontend + Backend) | Tuần 3-5 |
| 5 | Tích hợp thanh toán + email | Tuần 5 |
| 6 | UAT | Tuần 5-6 |
| 7 | **Go-live** | **15/06/2026** |
| 8 | Hỗ trợ sau go-live | 16/06 – 15/07 |

---

*Tài liệu này được chuẩn hóa từ Coralume-SRS.md (gốc) theo cấu trúc SRS tiêu chuẩn.*
*Tham chiếu: Coralume-Design-Spec.md cho UI/UX requirements chi tiết.*
