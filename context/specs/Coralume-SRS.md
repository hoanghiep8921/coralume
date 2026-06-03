# TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS)

## Coralume — Adopt a Coral

**Phiên bản:** 1.0
**Ngày:** 03/06/2026
**Trạng thái:** Final Draft

---

## MỤC LỤC

1. [Giới thiệu dự án](#1-giới-thiệu-dự-án)
2. [Tổng quan hệ thống](#2-tổng-quan-hệ-thống)
3. [Kiến trúc hệ thống](#3-kiến-trúc-hệ-thống)
4. [Yêu cầu chức năng — Danh sách trang](#4-yêu-cầu-chức-năng--danh-sách-trang)
5. [Yêu cầu chức năng — Theo Role người dùng](#5-yêu-cầu-chức-năng--theo-role-người-dùng)
6. [Yêu cầu phi chức năng](#6-yêu-cầu-phi-chức-năng)
7. [Brand Identity & Design System](#7-brand-identity--design-system)
8. [Database Schema (Logical)](#8-database-schema-logical)
9. [API Design (High-level)](#9-api-design-high-level)
10. [User Flows chi tiết](#10-user-flows-chi-tiết)
11. [Tích hợp bên thứ 3](#11-tích-hợp-bên-thứ-3)
12. [Milestone & Timeline](#12-milestone--timeline)

---

## 1. GIỚI THIỆU DỰ ÁN

### 1.1 Mục đích

Tài liệu này xác lập toàn bộ yêu cầu chức năng và phi chức năng cho website **Coralume — Adopt a Coral**, một nền tảng "nhận nuôi san hô" kết hợp mô hình behavioral economics + ESG.

### 1.2 Tổng quan dự án

Coralume là dự án "nhận nuôi san hô" theo mô hình behavioral economics + ESG. Khác với mô hình từ thiện truyền thống, Coralume biến việc bảo tồn san hô thành trải nghiệm cá nhân: mỗi adopter có 1 hoặc nhiều san hô riêng (có tên, có ID, có vị trí), được trung tâm san hô đối tác tại Nha Trang chăm sóc và cập nhật ảnh/video growth định kỳ. Adopter theo dõi san hô của mình qua dashboard trên website.

### 1.3 Tên dự án & Ý nghĩa

- **Tên:** Coralume = Coral + Illuminate (Thắp sáng)
- **Ý nghĩa:** Mỗi san hô được adopter "thắp sáng" và chăm sóc

### 1.4 Đối tượng chính

- **Target:** Người trẻ 18–35, quan tâm môi trường, ESG, có thu nhập
- **Mở rộng:** Doanh nghiệp muốn CSR
- **Phân khúc:** Sinh viên, nhân viên văn phòng, người đi du lịch, expat ở Việt Nam

### 1.5 Slogan & Tagline

| Vai trò | Nội dung |
|---------|----------|
| Slogan chính (VN) | Nhận nuôi san hô — Gieo mầm cho đại dương |
| Slogan chính (EN) | Adopt a Coral — Plant a Future for the Ocean |
| Tagline phụ | Your coral. Your story. Your impact. |

### 1.6 Tone of Voice

- **Phong cách:** Ấm, cá nhân, có dữ liệu — KHÔNG kêu gọi từ thiện
- **Tuyệt đối tránh:** "hãy quyên góp", "cứu lấy đại dương"
- **Thay vào đó:** "san hô của bạn", "theo dõi sự phát triển", "impact của bạn"
- **Cảm xúc mục tiêu:** Sở hữu + Tự hào + Kết nối thiên nhiên
- **Tham khảo:** Patagonia, Coral Gardeners, Allbirds

---

## 2. TỔNG QUAN HỆ THỐNG

### 2.1 Danh sách trang cần xây dựng

| STT | Trang | Mục đích | Nội dung chính | Trạng thái |
|-----|-------|----------|----------------|-----------|
| 1 | Trang chủ (Home) | Giới thiệu dự án, thu hút khách | Tại sao san hô quan trọng, số liệu, 3 gói, liên kết đối tác | Cần xây dựng |
| 2 | Về chúng tôi (About) | Tạo niềm tin, kể câu chuyện | Storytelling founder, sứ mệnh, đội ngũ, đối tác Nha Trang | Cần xây dựng |
| 3 | Sản phẩm (Products) | Trang bán hàng chính — convert | 3 gói + Referral Ambassador + FAQ + Bảng so sánh | Cần xây dựng |
| 4 | Dashboard cá nhân | Khu vực riêng cho adopter | Danh sách san hô, ảnh/video update, impact, certificate, mã AFF | Cần xây dựng |
| 5 | Blog / Kiến thức san hô | Education + SEO + credibility | Bài viết, infographic về san hô, biển, hệ sinh thái | Cần xây dựng |
| 6 | Bảng xếp hạng (Leaderboard) | Gamification | Top adopter theo số san hô, theo tháng và toàn thời gian | Cần xây dựng |
| 7 | Cộng đồng (Community) | Social proof, tăng cảm xúc | Ảnh/video adopter chia sẻ, feedback | Cần xây dựng |
| 8 | Đăng nhập / Đăng ký | Xác thực người dùng | Login, Register, Forgot Password, Email Verification | Cần xây dựng |
| 9 | Trang thanh toán | Bước thanh toán sau chọn gói | Thông tin gói, form adopter, đặt tên san hô, chọn phương thức | Cần xây dựng |
| 10 | Trang xác nhận / Cảm ơn | Sau thanh toán thành công | Certificate, link tải, CTA vào dashboard, email xác nhận | Cần xây dựng |
| 11 | Admin Panel | Quản trị hệ thống | Quản lý user, sản phẩm, nội dung, doanh thu, analytics, báo cáo | Cần xây dựng |
| 12 | Coral Portal (Backend cho trung tâm SH) | Portal cho nhân viên trung tâm | Upload ảnh/video san hô, nhập chỉ số growth, đồng bộ dashboard | Cần xây dựng |

---

## 3. KIẾN TRÚC HỆ THỐNG

### 3.1 Công nghệ đề xuất

| Hạng mục | Đề xuất | Ghi chú |
|----------|---------|---------|
| Frontend framework | Next.js (React) hoặc Nuxt (Vue) | Cần SSR/SSG cho SEO tốt |
| Backend framework | Node.js (Express/NestJS) hoặc Python (Django/FastAPI) | Dev chọn theo expertise |
| Database | PostgreSQL (ưu tiên) hoặc MySQL | Quan hệ phù hợp với user-coral mapping |
| Hosting | VPS riêng hoặc Cloud (AWS/GCP/Azure/DO) | CLB chi trả hosting |
| Storage ảnh/video | S3-compatible (AWS S3 / Cloudflare R2 / DO Spaces) | KHÔNG lưu trên server chính |
| CDN | Cloudflare hoặc tương đương | Tăng tốc tải ảnh |

### 3.2 Mô hình kiến trúc (High-level)

```text
┌──────────────────────────────────────────────────────────────────┐
│                        CDN (Cloudflare)                          │
└──────┬───────────────────────────────────────────────────────────┘
       │
┌──────▼───────────────────────────────────────────────────────────┐
│                    Load Balancer / Proxy                          │
└──────┬───────────────────────────────────────────────────────────┘
       │
┌──────▼───────────────────────────────────────────────────────────┐
│              Frontend (Next.js/Nuxt - SSR/SSG)                    │
│  Trang chủ / About / Sản phẩm / Blog / Leaderboard / Cộng đồng   │
└──────┬───────────────────────────────────────────────────────────┘
       │ API Calls (REST / GraphQL)
┌──────▼───────────────────────────────────────────────────────────┐
│                Backend API (Node.js/Python)                       │
│  Auth (JWT) · Payment · Email · CMS · Admin · Analytics           │
└──┬────────────┬──────────────┬──────────────┬────────────────────┘
   │            │              │              │
┌──▼──┐  ┌──────▼──────┐ ┌────▼────┐ ┌───────▼────────┐
│ DB  │  │ S3 Storage  │ │ Email   │ │ Payment Gateway│
│ PG  │  │ (ảnh/video) │ │ Service │ │ VNPay/MoMo     │
└─────┘  └─────────────┘ └─────────┘ └────────────────┘
```

---

## 4. YÊU CẦU CHỨC NĂNG — DANH SÁCH TRANG

### 4.1 TRANG CHỦ (HOME PAGE)

#### 4.1.1 Hero Section
| ID | Hạng mục | Tiêu đề / Label | Nội dung | Yêu cầu ảnh/media | Animation |
|----|----------|-----------------|----------|-------------------|-----------|
| H-01 | Hero - Headline | Tiêu đề chính | "Nhận nuôi san hô — Gieo mầm cho đại dương" (EN: "Adopt a Coral — Plant a Future for the Ocean") | Video/ảnh underwater 1920×1080. Coral reef với ánh sáng xuyên qua mặt nước. Keyword: "underwater coral sunlight". Fallback ảnh nếu mobile | Headline fade-in + slide-up khi load; video autoplay, loop, mute |
| H-02 | Hero - Sub-headline | Tiêu đề phụ | "Mỗi san hô bạn nhận nuôi sẽ được theo dõi, cập nhật ảnh và lớn lên cùng bạn." | Nằm trên hero, không cần ảnh riêng | Xuất hiện sau headline 0.3s |
| H-03 | Hero - CTA chính | Nút kêu gọi | "Nhận nuôi ngay →" (Link: /san-pham) | Icon mũi tên hoặc icon san hô nhỏ | Hover: nâng lên nhẹ + đổi màu Coral Light; Click → /san-pham |
| H-04 | Hero - CTA phụ | Nút phụ | "Tìm hiểu thêm ↓" | Không | Scroll mượt xuống section 2; Ghost button, viền Navy |

**Yêu cầu thiết kế:**
- Headline lớn, font Lora hoặc Lexend Bold
- Overlay tối nhẹ 20% để chữ rõ trên ảnh
- Sub-headline: font sans-serif (Inter/Be Vietnam Pro), ~20-22px
- CTA chính: Nút màu Coral (#E87750), text trắng, bo góc 8px

#### 4.1.2 Section: Tại sao san hô quan trọng
| ID | Hạng mục | Nội dung | Animation |
|----|----------|----------|-----------|
| H-05 | Section header | "San hô — Nền tảng sự sống của đại dương" | Slide-up khi scroll tới |
| H-06 | Stat 1 | "< 1% — Tỉ lệ diện tích đáy biển mà san hô chiếm" | Số đếm từ 0 tăng lên |
| H-07 | Stat 2 | "25% — Lượng sinh vật biển phụ thuộc vào san hô" | Số đếm từ 0 tăng lên |
| H-08 | Stat 3 | "50% — Diện tích rạn san hô đã mất từ 1950 đến nay" | Số đếm từ 0 tăng lên |
| H-09 | Body text | "San hô không chỉ đẹp — chúng là nền tảng sinh thái cho 25% sinh vật biển, bảo vệ bờ biển khỏi lũ và sóng lớn, và là chỉ báo sức khỏe đại dương. Nhưng thế hệ chúng ta đang chứng kiến một nửa số rạn san hô biến mất." | Fade-in từ dưới |

#### 4.1.3 Section: Coralume làm gì (How it works)
| ID | Hạng mục | Nội dung |
|----|----------|----------|
| H-10 | Section header | "Cách Coralume hoạt động" |
| H-11 | Step 1 | "Chọn gói nhận nuôi → Bạn chọn một trong 3 gói phù hợp với mong muốn của mình." |
| H-12 | Step 2 | "Đặt tên cho san hô → Mỗi san hô có tên riêng do bạn đặt." |
| H-13 | Step 3 | "Theo dõi & cùng lớn lên → Nhận ảnh/video update hàng tháng từ trung tâm tại Nha Trang." |

**Layout:** 3 cột (desktop), 1 cột (mobile). Hover: scale 1.05 trên mỗi step card.

#### 4.1.4 Section: Giới thiệu 3 gói sản phẩm
| ID | Gói | Giá | Quyền lợi chính | Ảnh |
|----|-----|-----|-----------------|------|
| H-14 | Seed Coral (Standard) | 200.000 – 300.000 VND | Certificate kỹ thuật số, Cập nhật ảnh/video hàng tháng, Dashboard cá nhân | San hô con / coral fragment |
| H-15 | Reef Guardian (Premium) | 500.000 – 700.000 VND | Toàn bộ Seed + Tracking chi tiết + Premium video + GPS reef location | San hô trưởng thành, đa dạng màu |
| H-16 | Diving Experience | 1.000.000 – 2.000.000 VND | Toàn bộ Reef Guardian + Trải nghiệm lặn thực tế + Tự tay trồng san hô | Người lặn biển trồng san hô |

**Hành vi:** Card hover nâng lên + shadow. Click "Adopt" → /san-pham?goi={slug}. Có badge "Phổ biến nhất" trên card mong muốn.

#### 4.1.5 Section: Đối tác trung tâm san hô
| ID | Hạng mục | Nội dung |
|----|----------|----------|
| H-17 | Section header | "Đối tác đồng hành" |
| H-18 | Partner card | Logo + ảnh team trung tâm san hô Nha Trang (CLB cung cấp). Placeholder: "Đang chờ ảnh từ CLB". Link "Tìm hiểu thêm" → website đối tác |

#### 4.1.6 CTA cuối trang
| ID | Hạng mục | Nội dung |
|----|----------|----------|
| H-19 | CTA Banner | "Sẵn sàng nhận nuôi san hô đầu tiên của bạn? [Bắt đầu ngay →]" |

**Yêu cầu:** Background gradient Navy → Teal, full-width, padding 120px top/bottom. Parallax nhẹ khi scroll. CTA pulse animation 2s/lần.

#### 4.1.7 Footer
| ID | Cột | Nội dung |
|----|-----|----------|
| H-20 | Logo + slogan | Coralume · "Nhận nuôi san hô — Gieo mầm cho đại dương" |
| H-21 | Navigation | Về chúng tôi, Sản phẩm, Blog, Cộng đồng, Liên hệ |
| H-22 | Liên hệ | Email: hello@coralume.vn, Facebook, Instagram (@coralume_official) |
| H-23 | Copyright | © 2026 Coralume. Đối tác: Trung tâm san hô Nha Trang |

---

### 4.2 TRANG VỀ CHÚNG TÔI (ABOUT)

#### 4.2.1 Hero
| ID | Hạng mục | Nội dung |
|----|----------|----------|
| A-01 | Headline | "Chúng tôi không phải tổ chức từ thiện. Chúng tôi là một cách khác để bảo vệ đại dương." |
| A-02 | Sub | "Coralume biến việc bảo tồn san hô thành trải nghiệm cá nhân — có dữ liệu, có cảm xúc, có ownership." |

**Yêu cầu:** Ảnh underwater cinematic. Headline reveal text-by-text (mỗi dòng cách 0.4s). Dòng 2 dùng font Lora Italic (mang tính tuyên ngôn).

#### 4.2.2 Sứ mệnh & Tầm nhìn
| ID | Hạng mục | Nội dung |
|----|----------|----------|
| A-03 | Sứ mệnh | "Khuyến khích người trẻ có trách nhiệm với môi trường từ hành động nhỏ nhất. Thúc đẩy tiêu dùng xanh..." |

**Layout:** 2 cột (text trái, ảnh phải). Ảnh team Coralume (CLB cung cấp).

#### 4.2.3 Câu chuyện Founder
| ID | Hạng mục | Nội dung |
|----|----------|----------|
| A-04 | Story | "Coralume bắt đầu từ một chuyến lặn ở Hòn Mun năm 2024. Khi nhìn thấy một rạn san hô đã chết — trắng, im lặng, không còn cá — founder của chúng tôi không thể bỏ qua. Câu hỏi đặt ra không phải 'làm thế nào để quyên góp?' mà là 'làm thế nào để người trẻ thực sự CARE về san hô?'... Câu trả lời: làm cho san hô trở nên CÁ NHÂN. Có tên. Có ID. Có ảnh update. Có người sở hữu." |

**Yêu cầu:** Ảnh founder cận cảnh (CLB cung cấp). Font Lora Italic cho dẫn dắt, body dùng Inter. Storytelling layout dạng article.

#### 4.2.4 Đội ngũ
| ID | Hạng mục | Nội dung |
|----|----------|----------|
| A-05 | Team grid | Mỗi member: ảnh chân dung 600×600px + tên + chức danh ngắn. Grid 3-4 cột (desktop), 2 (tablet), 1 (mobile). Hover: zoom nhẹ + hiện role. |

#### 4.2.5 Cách hoạt động (Process)
| ID | Bước | Nội dung |
|----|------|----------|
| A-06 | Bước 1 | Adopter chọn gói và thanh toán qua website |
| A-07 | Bước 2 | Coralume gửi thông tin san hô được gán cho adopter (có ID, GPS) |
| A-08 | Bước 3 | Nhân viên trung tâm SH Nha Trang chăm sóc và cập nhật ảnh/video hàng tháng |
| A-09 | Bước 4 | Adopter theo dõi qua dashboard và nhận báo cáo định kỳ |

**Layout:** Timeline horizontal, animation line vẽ kết nối các bước.

#### 4.2.6 Cam kết minh bạch
| ID | Hạng mục | Nội dung |
|----|----------|----------|
| A-10 | Commitment | "100% doanh thu sau chi phí vận hành được chuyển vào công tác trồng và chăm sóc san hô tại Nha Trang. Báo cáo tài chính được công khai hàng quý." |

#### 4.2.7 CTA cuối
| ID | Hạng mục | Nội dung |
|----|----------|----------|
| A-11 | CTA | "Tham gia cùng chúng tôi. [Nhận nuôi san hô đầu tiên →]" — Background gradient Navy → Teal, Pulse button. |

---

### 4.3 TRANG SẢN PHẨM (PRODUCTS)

#### 4.3.1 Hero
| ID | Hạng mục | Nội dung |
|----|----------|----------|
| P-01 | Title | "Nuôi 1 bé san hô ngay tại đây!" |
| P-02 | Sub | "Mỗi gói là một mức cam kết và một mức trải nghiệm khác nhau. Tất cả đều bắt đầu bằng một san hô có tên — của riêng bạn." |

#### 4.3.2 Chi tiết 3 gói sản phẩm

##### Gói 1: Seed Coral (Standard)
- **Giá:** 200.000 – 300.000 VND
- **Quyền lợi:**
  - Certificate kỹ thuật số (tên san hô, vị trí, ID)
  - Cập nhật ảnh/video hàng tháng
  - Dashboard cá nhân theo dõi growth
  - Impact dashboard cá nhân
  - Tham gia cộng đồng adopter
- **Label:** "Phổ biến nhất"

##### Gói 2: Reef Guardian (Premium)
- **Giá:** 500.000 – 700.000 VND
- **Quyền lợi:**
  - Toàn bộ quyền lợi Seed Coral
  - Tracking growth chi tiết hơn (kích thước, sức khỏe, môi trường xung quanh)
  - Premium video updates (chất lượng cao)
  - GPS reef location (vùng tương đối)
  - Báo cáo hàng quý chi tiết
  - Ưu tiên hỗ trợ
- **Điểm nhấn:** Border Coral để nổi bật (gói chính)

##### Gói 3: Diving Experience (Premium+)
- **Giá:** 1.000.000 – 2.000.000 VND
- **Quyền lợi:**
  - Toàn bộ quyền lợi Reef Guardian
  - 01 trải nghiệm lặn thực tế tại Nha Trang
  - Tự tay trồng san hô của mình (có hướng dẫn viên)
  - Video kỷ niệm chuyến lặn
  - Ăn trưa cùng team
- **Badge:** "Trải nghiệm thật"

#### 4.3.3 Bảng so sánh chi tiết

| Tính năng | Seed Coral | Reef Guardian | Diving Experience |
|-----------|:---:|:---:|:---:|
| Certificate kỹ thuật số | ✓ | ✓ | ✓ |
| Cập nhật hàng tháng | ✓ | ✓ | ✓ |
| Dashboard cá nhân | ✓ | ✓ | ✓ |
| GPS reef location | — | ✓ | ✓ |
| Premium video | — | ✓ | ✓ |
| Báo cáo hàng quý | — | ✓ | ✓ |
| Trải nghiệm lặn thực tế | — | — | ✓ |
| Tự tay trồng san hô | — | — | ✓ |

**Yêu cầu kỹ thuật:** Sticky header khi scroll trong bảng. Shadow nhẹ, border-collapse, zebra striping.

#### 4.3.4 Referral / Ambassador Program
| ID | Nội dung |
|----|----------|
| P-06 | **Tiêu đề:** "Mời bạn bè — Trở thành Ambassador" |
| P-07 | Mỗi adopter có mã giới thiệu (AFF code) riêng. Khi 5 bạn bè dùng mã → nâng cấp Ambassador với: Badge Ambassador, Quà tặng vật phẩm Coralume (áo, túi tote), Voucher lặn miễn phí, Lời mời sự kiện offline |

#### 4.3.5 FAQ
| ID | Câu hỏi | Câu trả lời |
|----|---------|-------------|
| P-08 | San hô của tôi có thật không? | Có, hoàn toàn thật. Mỗi san hô có ID riêng, được trồng tại trung tâm đối tác ở Nha Trang. Nhân viên trung tâm chụp ảnh và cập nhật trạng thái hàng tháng. |
| P-09 | Tôi có được đến thăm san hô không? | Với gói Diving Experience, bạn được lặn xuống tận nơi. Với gói khác, có thể đặt thêm chuyến lặn riêng với chi phí phụ trội. |
| P-10 | Nếu san hô của tôi chết thì sao? | Tỉ lệ sống của san hô tại trung tâm > 85%. Nếu không sống được, chúng tôi sẽ trồng san hô mới và thông báo cho bạn — đây là cam kết của Coralume. |
| P-11 | Tôi có thể nhận nuôi nhiều san hô không? | Có. Trong dashboard, bạn có thể thấy danh sách tất cả san hô đã nhận nuôi, mỗi cái có tên riêng. |
| P-12 | Coralume có phải tổ chức từ thiện không? | Không. Coralume là dự án social impact với mô hình tự cân đối tài chính. 100% doanh thu sau chi phí vận hành dùng cho việc trồng và chăm sóc san hô. |

**Layout:** Accordion vertical, expand/collapse khi click.

---

### 4.4 TRANG DASHBOARD CÁ NHÂN

#### 4.4.1 Điều kiện truy cập
- **Yêu cầu:** Đăng nhập mới truy cập được
- **Chưa đăng nhập:** Redirect về /dang-nhap
- **Chưa có gói nào:** Hiển thị empty state với CTA "Nhận nuôi san hô đầu tiên"

#### 4.4.2 Header Dashboard
| ID | Hạng mục | Nội dung |
|----|----------|----------|
| D-01 | Welcome banner | "Chào mừng, [Tên adopter]! Bạn đang chăm sóc [N] san hô." + Avatar |
| D-02 | Quick stats | 3 chỉ số: Tổng san hô, Diện tích reef hỗ trợ (m²), Tháng đồng hành. Layout 3 cột. Số đếm animate. |

#### 4.4.3 Danh sách san hô
| ID | Hạng mục | Nội dung |
|----|----------|----------|
| D-03 | Coral grid | Mỗi card: Ảnh mới nhất + Tên san hô + ID kỹ thuật + Ngày nhận nuôi + Gói + Trạng thái sức khỏe (icon) + [Xem chi tiết →] |
| D-04 | Empty state | Illustration san hô trống + "Bạn chưa nhận nuôi san hô nào. [Bắt đầu nhận nuôi →]" |

**Layout:** Grid responsive: 3 cột desktop, 2 tablet, 1 mobile. Card hover: shadow + nâng lên. Click → modal chi tiết.

#### 4.4.4 Chi tiết từng san hô (Modal)
| ID | Hạng mục | Nội dung |
|----|----------|----------|
| D-05 | Header | [Tên san hô] + ID: CRL-2026-[XXXX]. Ảnh lớn. |
| D-06 | Growth timeline | Timeline vertical các update theo tháng: ảnh + ghi chú từ nhân viên trung tâm + chỉ số (kích thước, sức khỏe). Lazy load khi scroll. |
| D-07 | GPS map | Bản đồ tương đối hiển thị vùng reef (không hiển thị tọa độ chính xác để bảo vệ). Google Maps/Mapbox embed. Pin có animation pulse. |
| D-08 | Stats | Kích thước hiện tại (cm), Sức khỏe (Tốt/TB/Cần chú ý), Tốc độ growth tháng này (mm), Loài san hô |
| D-09 | Certificate | [Xem Certificate] [Tải PDF] [Chia sẻ]. Watermark Coralume + ID. |

#### 4.4.5 Impact Dashboard cá nhân
| ID | Hạng mục | Nội dung |
|----|----------|----------|
| D-10 | Impact tổng hợp | Biểu đồ: Tổng san hô, Diện tích reef hỗ trợ (m²), Lượng CO₂ ước tính hấp thụ, Số sinh vật biển ước tính được hỗ trợ |

#### 4.4.6 Mã AFF & Giới thiệu
| ID | Hạng mục | Nội dung |
|----|----------|----------|
| D-11 | Referral code | Mã: CRL-[USERNAME]. [Sao chép] [Chia sẻ link]. Đã giới thiệu [N] người. Progress bar tới Ambassador (5-N). Đạt Ambassador → confetti + popup chúc mừng. |

#### 4.4.7 Adopt More & Settings
| ID | Hạng mục | Nội dung |
|----|----------|----------|
| D-12 | CTA | "Muốn nhận nuôi thêm? [Khám phá các gói →]" |
| D-13 | Profile settings | Cho phép chỉnh: Tên hiển thị, Avatar, Email, Mật khẩu, Nhận thông báo email (toggle), Public profile (toggle). Lưu tự động sau khi rời focus. |

---

### 4.5 TRANG THANH TOÁN

#### 4.5.1 Yêu cầu chung
- **SSL bắt buộc** toàn trang
- **BẮT BUỘC đăng nhập** trước khi thanh toán
- **Giữ gói đã chọn** trong session/cart

#### 4.5.2 Form thanh toán
| Trường | Loại | Bắt buộc | Ghi chú |
|--------|------|----------|---------|
| Thông tin adopter | Text | Có | Pre-fill từ tài khoản đã đăng nhập |
| Tên san hô | Text | Không | Tuỳ chọn, do adopter đặt |
| Phương thức thanh toán | Select | Có | VNPay / MoMo / Chuyển khoản |
| Đồng ý điều khoản | Checkbox | Có | Link đến điều khoản |

#### 4.5.3 Phương thức thanh toán
| STT | Cổng | Độ ưu tiên | Cơ chế |
|-----|------|-----------|--------|
| 1 | VNPay | Ưu tiên 1 | Redirect sang cổng VNPay |
| 2 | MoMo | Ưu tiên 2 | Redirect / QR |
| 3 | Chuyển khoản ngân hàng | Thứ 3 | Manual verify bởi admin |

#### 4.5.4 Trang xác nhận / Cảm ơn (Sau thanh toán)
- Hiển thị certificate preview
- Link tải PDF certificate
- CTA "Vào Dashboard"
- Gửi email xác nhận + certificate PDF đính kèm
- Tự động tạo bản ghi san hô (status=pending) và gán cho user
- Certificate có thể share social media (Open Graph tags chuẩn)

---

### 4.6 TRANG BLOG / KIẾN THỨC SAN HÔ

| ID | Hạng mục | Yêu cầu |
|----|----------|---------|
| B-01 | Hero | "Kiến thức về san hô & đại dương". Ảnh ocean wide. |
| B-02 | Categories | Tag/category filter: Sinh thái san hô, Bảo tồn, Kinh tế xanh, Chuyến lặn của adopter. Click filter → ajax reload. |
| B-03 | Article grid | Mỗi card: thumbnail, tiêu đề, tóm tắt 2 dòng, ngày đăng, tag, thời gian đọc. Pagination 12 bài/trang. |
| B-04 | Detail post | Layout đọc: max-width 720px, font 18px, line-height 1.7. TOC sticky cho bài dài. Scroll progress bar. Comment (Disqus hoặc tự build sau). |
| B-05 | CMS | Admin có thể tự đăng bài qua CMS (quản lý nội dung trong admin panel). |

---

### 4.7 TRANG BẢNG XẾP HẠNG (LEADERBOARD)

| ID | Hạng mục | Yêu cầu |
|----|----------|---------|
| L-01 | Hero | "Bảng xếp hạng — Cùng nhau làm nên sự khác biệt" |
| L-02 | Top 10 tháng | Avatar/nickname, số san hô, badge Ambassador. Highlight top 3 đặc biệt. Adopter có thể chọn ẩn danh. |
| L-03 | Top all-time | Top 20 adopter toàn thời gian. |
| L-04 | My ranking | Nếu đăng nhập: hiển thị vị trí của mình + cần bao nhiêu để lên hạng tiếp theo. Chỉ hiện khi logged in. |

---

### 4.8 TRANG CỘNG ĐỒNG (COMMUNITY)

| ID | Hạng mục | Yêu cầu |
|----|----------|---------|
| C-01 | Hero | "Cộng đồng adopter Coralume" |
| C-02 | Adopter stories | Showcase ảnh + tên adopter + tên san hô + câu chuyện. Masonry layout, click → modal full. Có moderation trước khi public. |
| C-03 | Video gallery | Video từ trung tâm và adopter. Embed YouTube/Vimeo. Click → lightbox player. |
| C-04 | Submit form | Adopter submit câu chuyện: ảnh + text. Admin duyệt rồi đăng. Form upload, multipart/form-data. Limit dung lượng ảnh. |

---

### 4.9 TRANG ĐĂNG KÝ / ĐĂNG NHẬP

| ID | Hạng mục | Yêu cầu |
|----|----------|---------|
| AU-01 | Login | Form: email, mật khẩu, [Đăng nhập], [Quên mật khẩu?], [Đăng ký mới]. Tuỳ chọn: Google OAuth. Validation realtime. |
| AU-02 | Register | Form: họ tên, email, mật khẩu, xác nhận mật khẩu, SĐT, đồng ý điều khoản. Strength meter cho password. Email uniqueness check. |
| AU-03 | Forgot password | Form: nhập email → nhận link reset. |
| AU-04 | Email verification | Trang sau khi click verify: "Tài khoản của bạn đã được kích hoạt. [Đăng nhập]" |
| AU-05 | Session | JWT hoặc session cookie. Remember-me 30 ngày. |

---

### 4.10 ADMIN PANEL

| ID | Module | Tính năng chi tiết |
|----|--------|-------------------|
| AD-01 | Dashboard Admin | Tổng quan: số user, doanh thu, san hô đã adopt, conversion rate. Biểu đồ/chart theo thời gian. |
| AD-02 | Quản lý User | Danh sách, tìm kiếm, khoá/mở tài khoản, xem lịch sử thanh toán. Filter theo ngày, gói. Export CSV. |
| AD-03 | Quản lý Sản phẩm | Thêm/sửa/xoá gói, cập nhật giá, mở/đóng gói. |
| AD-04 | Quản lý Nội dung | Chỉnh text trên các trang, cập nhật ảnh, đăng/xoá/sửa bài blog. |
| AD-05 | Quản lý San hô | Pool san hô có sẵn. Gán san hô cho adopter mới (Flow: mở user detail → "Assign Coral" → hệ thống đề xuất từ pool → admin chọn → confirm → status user chuyển "pending" → "active" → email notification). |
| AD-06 | Analytics | Lượt truy cập, conversion, doanh thu theo tháng/quý. Tích hợp GA4. |
| AD-07 | Báo cáo | Xuất CSV/PDF danh sách adopter, doanh thu, impact. |
| AD-08 | Quản lý nhân viên | Tạo/xoá tài khoản nhân viên trung tâm san hô. |
| AD-09 | Activity log | Mọi hành động admin được log: ai, làm gì, lúc nào. |
| AD-10 | Bulk operations | Gửi email hàng loạt, export bulk. |
| AD-11 | Refund | Admin trigger refund qua cổng thanh toán. |

**Phân quyền Admin:**
- **Super Admin:** Toàn quyền
- **Editor:** Chỉ chỉnh nội dung (blog, text, ảnh)
- **Coral Center:** Chỉ portal san hô

**Yêu cầu bảo mật:**
- URL: /admin (không liên kết public, có thể đặt URL phức tạp hơn)
- Khuyến nghị 2FA cho admin
- Activity log đầy đủ

---

### 4.11 CORAL PORTAL (Backend cho trung tâm san hô)

| ID | Hạng mục | Yêu cầu |
|----|----------|---------|
| CP-01 | Dashboard Portal | Xem danh sách san hô cần cập nhật (filter: chưa update tháng này / quá hạn). Mobile-friendly bắt buộc (nhân viên dùng điện thoại ngoài field). |
| CP-02 | Form input | Upload ảnh (1-5 ảnh) và video (tuỳ chọn) + preview. Drag & drop. Compress tự động. |
| CP-03 | Nhập chỉ số | Kích thước (cm), Sức khỏe (dropdown: Tốt/TB/Cần chú ý), Ghi chú. Validation đầy đủ. |
| CP-04 | Đồng bộ | Save → hệ thống lưu + tự động đồng bộ với dashboard adopter tương ứng. |
| CP-05 | Notification | Email tự động gửi adopter: "San hô của bạn vừa được update". |
| CP-06 | Bulk upload | Chọn nhiều san hô cùng lúc để upload ảnh. |
| CP-07 | Lịch sử | Lịch sử update để tra cứu. |
| CP-08 | View-only | Xem dashboard adopter (read-only) để xác nhận đã update đúng. |

---

## 5. YÊU CẦU CHỨC NĂNG — THEO ROLE NGƯỜI DÙNG

### 5.1 Tổng quan 5 Role

| Role | Đối tượng | Mô tả |
|------|----------|-------|
| Khách truy cập (Visitor) | Người chưa đăng ký | Xem tất cả trang public, không thấy chi tiết cá nhân |
| Adopter | Người đã đăng ký + đã nhận nuôi | Dashboard cá nhân, xem san hô, AFF code |
| Ambassador | Adopter đã giới thiệu ≥ 5 người | Badge + đặc quyền: quà tặng, voucher lặn, sự kiện |
| Admin | Quản trị viên Coralume | Toàn quyền quản lý hệ thống |
| Nhân viên trung tâm SH | Nhân viên tại Nha Trang | Chỉ truy cập Coral Portal để cập nhật san hô |

### 5.2 Khách truy cập (Visitor)

**Trải nghiệm chính:**
- Xem Trang chủ, About, Sản phẩm, Blog, Cộng đồng, Bảng xếp hạng (public)
- Tìm hiểu về dự án, đọc kiến thức san hô
- Xem số liệu impact tổng hợp (không thấy chi tiết cá nhân)
- Click "Adopt Now" → đẩy sang flow Tạo tài khoản

**Tính năng nổi bật:**
- Không cần đăng nhập để xem các trang public
- Newsletter signup (footer)
- Liên hệ qua form contact

**Luồng cơ bản:** Truy cập website → Home → About → Xem các gói → "Adopt Now" → Đăng ký tài khoản → Email verify → Chọn gói → Thanh toán → Dashboard

### 5.3 Adopter (Người nhận nuôi)

**Trải nghiệm chính:**
- Đăng nhập → Dashboard cá nhân
- Xem danh sách san hô (tên, ID, gói)
- Click san hô → chi tiết growth, ảnh/video update, stats
- Tải/chia sẻ Certificate kỹ thuật số
- Xem impact dashboard cá nhân
- Sao chép mã AFF và giới thiệu bạn bè
- Adopt thêm san hô mới
- Cập nhật thông tin tài khoản

**Tính năng nổi bật:**
- Dashboard phân tách theo từng san hô
- Báo cáo hàng tháng/quý (tuỳ gói)
- Certificate: xem, tải PDF, chia sẻ social media
- GPS reef location (vùng tương đối)
- Progress bar Ambassador (5 referral = Ambassador)
- Notification email khi có update san hô mới

### 5.4 Ambassador

**Trải nghiệm bổ sung (trên Adopter):**
- Badge Ambassador trên profile public
- Truy cập trang Ambassador riêng (nội dung độc quyền)
- Nhận voucher trải nghiệm lặn miễn phí (giới hạn)
- Lời mời sự kiện offline
- Quà tặng vật phẩm Coralume

**Cơ chế nâng cấp:**
- Auto-upgrade khi đạt 5 referrals (trigger backend)
- Email tự động chúc mừng + hướng dẫn nhận quà

### 5.5 Admin

**Trải nghiệm chính:**
- Đăng nhập /admin (URL riêng, phân quyền)
- Dashboard: tổng quan user, doanh thu, san hô, conversion
- Quản lý user: danh sách, tìm kiếm, khoá/mở, lịch sử thanh toán
- Quản lý sản phẩm: CRUD gói, cập nhật giá
- Quản lý nội dung: chỉnh text, ảnh, blog
- Quản lý san hô: gán cho adopter, đổi tên, trạng thái
- Analytics: traffic, conversion, doanh thu
- Xuất báo cáo CSV/PDF
- Quản lý nhân viên trung tâm

### 5.6 Nhân viên trung tâm san hô

**Trải nghiệm chính:**
- Đăng nhập /coral-portal (URL riêng, không phải admin chính)
- Xem danh sách san hô cần cập nhật
- Mở chi tiết → form input
- Upload ảnh/video + nhập chỉ số (kích thước, sức khỏe, ghi chú)
- Save → tự động đồng bộ dashboard adopter
- Xem dashboard adopter (read-only)

**Tính năng nổi bật:**
- Bulk upload ảnh
- Form gọn, mobile-friendly (quan trọng — họ dùng điện thoại ngoài field)
- Notification reminder san hô cần update
- Lịch sử update để tra cứu

---

## 6. YÊU CẦU PHI CHỨC NĂNG

### 6.1 Performance & SEO

| Hạng mục | Yêu cầu |
|----------|---------|
| Lighthouse score | > 85 cho Performance, Accessibility, SEO |
| Image optimization | Lazy loading, WebP format, responsive srcset |
| SEO | Meta tags đầy đủ, Open Graph tags, sitemap.xml, robots.txt, Schema.org structured data |
| Analytics | Google Analytics 4 + Meta Pixel (cho remarketing FB ads) |

### 6.2 Responsive & Accessibility

| Hạng mục | Yêu cầu |
|----------|---------|
| Breakpoints | Mobile (< 768px), Tablet (768-1024px), Desktop (> 1024px) |
| Mobile-first | Thiết kế mobile-first (60%+ traffic từ mobile dự kiến) |
| Accessibility | WCAG 2.1 AA: contrast đủ, alt text, keyboard navigation, ARIA labels |

### 6.3 Bảo mật

| Hạng mục | Yêu cầu |
|----------|---------|
| HTTPS | Bắt buộc toàn site (Let's Encrypt OK) |
| Input validation | Validate cả client-side và server-side. Sanitize input chống XSS |
| SQL injection | ORM hoặc prepared statements. Không concat SQL |
| Rate limiting | Giới hạn request cho endpoint nhạy cảm (login, register, payment) |
| Backup | Backup database hàng ngày, lưu ít nhất 30 ngày |
| PCI compliance | Không lưu thông tin thẻ — luôn redirect qua cổng thanh toán |

### 6.4 Xác thực người dùng

| Hạng mục | Yêu cầu |
|----------|---------|
| Phương thức | Email + mật khẩu (bắt buộc), Google OAuth (nếu được), Facebook Login (tuỳ chọn) |
| Email verification | BẮT BUỘC verify email trước khi cho phép thanh toán |
| Forgot password | Flow chuẩn: nhập email → nhận link reset → đặt mật khẩu mới |
| Session | JWT hoặc session cookie. Remember-me 30 ngày |
| 2FA | Tuỳ chọn cho admin và nhân viên trung tâm (khuyến nghị bắt buộc cho admin) |

### 6.5 Email System

| Hạng mục | Yêu cầu |
|----------|---------|
| Service | SendGrid, AWS SES, hoặc Resend |
| Transactional emails | Welcome + email verify, Đặt lại mật khẩu, Xác nhận thanh toán + certificate PDF, Notification san hô có update, Báo cáo hàng tháng/quý (theo gói), Chúc mừng đạt Ambassador |
| Marketing | Newsletter footer signup → MailChimp/Mailerlite (tuỳ chọn) |

---

## 7. BRAND IDENTITY & DESIGN SYSTEM

### 7.1 Bảng màu chính

| STT | Tên màu | Mã HEX | Mô tả sử dụng |
|-----|---------|--------|--------------|
| 1 | Ocean Blue (chính) | `#B5D8E8` | Backgrounds, hero overlays, soft sections |
| 2 | Navy Deep | `#0F4C5C` | Headers, footer, text nhấn mạnh |
| 3 | Teal Mid | `#5BA8B5` | Sub-headers, hover states, accent secondary |
| 4 | Coral Orange (accent) | `#E87750` | CTA buttons, highlights, badge, prices — CHỈ dùng cho điểm nhấn |
| 5 | Coral Light | `#F4B89A` | Hover của CTA, soft highlights |
| 6 | Beige Sand | `#F5EFE0` | Background phụ, card backgrounds |
| 7 | Sand Dark | `#E8DFC8` | Border, dividers, secondary backgrounds |
| 8 | White | `#FFFFFF` | Background chính, breathing room |
| 9 | Text Dark | `#2C3E50` | Body text, headings |
| 10 | Text Gray | `#8A9BA8` | Secondary text, labels, metadata |

### 7.2 Typography

| Vai trò | Font Family | Mô tả |
|--------|-------------|-------|
| Display / Headings | Lora hoặc Lexend | Serif hoặc rounded sans cho tiêu đề lớn. Cần hỗ trợ tiếng Việt đầy đủ |
| Body text | Inter hoặc Be Vietnam Pro | Sans-serif cho body. Be Vietnam Pro tối ưu cho tiếng Việt |
| Accent / Quote | Lora Italic | Dùng cho quote, callout, testimonial |
| Mono (số liệu) | JetBrains Mono hoặc DM Mono | Số liệu, dữ liệu dashboard, ID san hô |

### 7.3 Phong cách hình ảnh

| Loại ảnh | Phong cách | Keywords |
|----------|-----------|----------|
| Hero — đại dương | Video/ảnh underwater, ánh sáng xuyên mặt nước, rạn san hô đầy màu | underwater coral reef, sunlight through water |
| San hô close-up | Ảnh chi tiết san hô đa dạng, màu sắc tự nhiên | coral close up, coral polyps |
| Người + thiên nhiên | Người trẻ trồng san hô, lặn biển | coral restoration, coral planting |
| Lifestyle adopter | Người trẻ Á Đông, thư giãn, xem dashboard | young asian person eco lifestyle |
| Trung tâm san hô | Ảnh thật từ trung tâm Nha Trang — CLB cung cấp | Placeholder đến khi nhận ảnh |

### 7.4 Icon Style
- Line icon, stroke 1.5–2px
- Màu Navy hoặc Coral
- Sử dụng Phosphor Icons hoặc Lucide
- Tránh emoji

### 7.5 Pattern / Texture
- Họa tiết sóng nước dịu, nét vẽ tay nhẹ
- KHÔNG dùng pattern hình học cứng
- Dùng làm divider, background nhẹ

### 7.6 Nguyên tắc ĐƯỢC LÀM / KHÔNG ĐƯỢC LÀM

| ✓ ĐƯỢC LÀM | ✗ KHÔNG ĐƯỢC LÀM | Lý do |
|-------------|------------------|-------|
| "san hô của bạn", "adopter", "impact của bạn" | "hãy quyên góp", "cứu đại dương", "từ thiện" | Coralume KHÔNG phải từ thiện |
| Hero rộng, ảnh full-width | Hero nhỏ, chữ chèn lên ảnh gắt | Tạo cảm giác đại dương rộng lớn |
| Số liệu chính xác có nguồn | Số liệu chung chung kiểu "giúp môi trường" | Adopter quan tâm impact thật |
| Animation nhẹ: fade, slide-up, parallax dịu | Animation gắt: bounce, flash | Tone of voice dịu, chậm rãi |
| Tích hợp dữ liệu thật (số adopter, san hô) | Số đếm fake hoặc placeholder không update | Minh bạch là USP |

---

## 8. DATABASE SCHEMA (LOGICAL)

### 8.1 Entities chính

#### users
```sql
-- Người dùng hệ thống
users (
  id            UUID PK
  full_name     VARCHAR(255) NOT NULL
  email         VARCHAR(255) UNIQUE NOT NULL
  password_hash VARCHAR(255) NOT NULL
  phone         VARCHAR(20)
  avatar_url    TEXT
  role          ENUM('visitor','adopter','ambassador','admin','editor','coral_staff')
  is_verified   BOOLEAN DEFAULT FALSE
  is_active     BOOLEAN DEFAULT TRUE
  is_public     BOOLEAN DEFAULT TRUE
  email_notify  BOOLEAN DEFAULT TRUE
  created_at    TIMESTAMP
  updated_at    TIMESTAMP
)
```

#### products
```sql
-- Gói sản phẩm
products (
  id            UUID PK
  slug          VARCHAR(50) UNIQUE  -- 'seed-coral', 'reef-guardian', 'diving-experience'
  name          VARCHAR(255) NOT NULL
  tier          ENUM('standard','premium','premium_plus')
  price_min     INTEGER NOT NULL    -- VND
  price_max     INTEGER NOT NULL
  description   TEXT
  benefits      JSONB               -- Array of benefit strings
  is_active     BOOLEAN DEFAULT TRUE
  created_at    TIMESTAMP
  updated_at    TIMESTAMP
)
```

#### corals
```sql
-- San hô trong pool
corals (
  id              UUID PK
  code            VARCHAR(50) UNIQUE  -- CRL-2026-XXXX
  species         VARCHAR(255)
  location_zone   VARCHAR(500)       -- Vùng GPS tương đối
  location_gps    VARCHAR(100)       -- Tọa độ thật (chỉ admin/staff xem)
  status          ENUM('available','assigned','growing','dead')
  product_tier    ENUM('standard','premium','premium_plus')
  created_at      TIMESTAMP
  updated_at      TIMESTAMP
)
```

#### adoptions
```sql
-- Liên kết user-coral (nhận nuôi)
adoptions (
  id              UUID PK
  user_id         UUID FK → users
  coral_id        UUID FK → corals
  product_id      UUID FK → products
  custom_name     VARCHAR(255)      -- Tên do adopter đặt
  status          ENUM('pending','active','completed')
  adopted_at      TIMESTAMP
  assigned_at     TIMESTAMP         -- Khi admin gán san hô thật
  completed_at    TIMESTAMP
  created_at      TIMESTAMP
  updated_at      TIMESTAMP
)
```

#### coral_updates
```sql
-- Cập nhật định kỳ từ nhân viên trung tâm
coral_updates (
  id              UUID PK
  coral_id        UUID FK → corals
  staff_id        UUID FK → users
  size_cm         DECIMAL(5,2)
  health          ENUM('good','average','needs_attention')
  notes           TEXT
  images          JSONB             -- Array of S3 URLs (1-5)
  video_url       TEXT              -- S3 URL (optional)
  created_at      TIMESTAMP
)
```

#### payments
```sql
-- Lịch sử thanh toán
payments (
  id              UUID PK
  user_id         UUID FK → users
  adoption_id     UUID FK → adoptions
  amount          INTEGER NOT NULL  -- VND
  method          ENUM('vnpay','momo','bank_transfer')
  status          ENUM('pending','completed','failed','refunded')
  gateway_txn_id  VARCHAR(255)      -- ID từ cổng thanh toán
  invoice_url     TEXT              -- Link hoá đơn PDF
  paid_at         TIMESTAMP
  created_at      TIMESTAMP
)
```

#### referrals
```sql
-- Mã giới thiệu
referrals (
  id              UUID PK
  referrer_id     UUID FK → users
  referred_id     UUID FK → users
  code            VARCHAR(50)       -- CRL-[USERNAME]
  status          ENUM('pending','completed')
  created_at      TIMESTAMP
)
```

#### blog_posts
```sql
-- Bài viết blog
blog_posts (
  id              UUID PK
  author_id       UUID FK → users
  title           VARCHAR(500) NOT NULL
  slug            VARCHAR(500) UNIQUE NOT NULL
  excerpt         TEXT
  content         TEXT
  featured_image  TEXT              -- S3 URL
  category        ENUM('ecology','conservation','green_economy','adopter_stories')
  tags            JSONB
  status          ENUM('draft','published')
  reading_time    INTEGER           -- Phút
  published_at    TIMESTAMP
  created_at      TIMESTAMP
  updated_at      TIMESTAMP
)
```

#### community_submissions
```sql
-- Bài gửi từ cộng đồng
community_submissions (
  id              UUID PK
  user_id         UUID FK → users
  content         TEXT
  images          JSONB
  status          ENUM('pending','approved','rejected')
  reviewed_by     UUID FK → users   -- Admin duyệt
  created_at      TIMESTAMP
)
```

#### certificates
```sql
-- Chứng nhận san hô
certificates (
  id              UUID PK
  adoption_id     UUID FK → adoptions
  pdf_url         TEXT              -- S3 URL
  created_at      TIMESTAMP
)
```

#### admin_activity_logs
```sql
-- Log hoạt động admin
admin_activity_logs (
  id              UUID PK
  admin_id        UUID FK → users
  action          VARCHAR(255)
  target_type     VARCHAR(100)
  target_id       UUID
  details         JSONB
  created_at      TIMESTAMP
)
```

#### email_logs
```sql
-- Log email đã gửi
email_logs (
  id              UUID PK
  user_id         UUID FK → users
  type            ENUM('welcome','verify','reset_password','payment_confirm','coral_update','monthly_report','ambassador')
  subject         VARCHAR(500)
  status          ENUM('sent','failed','bounced')
  created_at      TIMESTAMP
)
```

---

## 9. API DESIGN (HIGH-LEVEL)

### 9.1 Public API Endpoints

```text
GET    /api/v1/products                          # Danh sách gói sản phẩm (active)
GET    /api/v1/products/:slug                    # Chi tiết gói
GET    /api/v1/blog/posts                        # Danh sách bài viết (published, paginated)
GET    /api/v1/blog/posts/:slug                  # Chi tiết bài viết
GET    /api/v1/blog/categories                   # Danh sách category
GET    /api/v1/leaderboard?type=monthly|alltime   # Bảng xếp hạng
GET    /api/v1/community/stories                 # Câu chuyện cộng đồng (approved)
GET    /api/v1/impact/totals                     # Số liệu impact tổng hợp
POST   /api/v1/newsletter/subscribe              # Đăng ký newsletter
POST   /api/v1/auth/register                     # Đăng ký
POST   /api/v1/auth/login                        # Đăng nhập
POST   /api/v1/auth/forgot-password              # Quên mật khẩu
POST   /api/v1/auth/reset-password               # Reset mật khẩu
GET    /api/v1/auth/verify-email/:token           # Verify email
GET    /api/v1/auth/google/callback               # Google OAuth callback
POST   /api/v1/contact                            # Form liên hệ
```

### 9.2 Authenticated API Endpoints (Adopter)

```text
GET    /api/v1/me                                # Profile người dùng
PUT    /api/v1/me                                # Cập nhật profile
GET    /api/v1/me/dashboard                      # Dashboard data tổng hợp
GET    /api/v1/me/adoptions                      # Danh sách san hô đã adopt
GET    /api/v1/me/adoptions/:id                  # Chi tiết adoption
GET    /api/v1/me/adoptions/:id/updates          # Timeline growth
GET    /api/v1/me/impact                         # Impact dashboard cá nhân
GET    /api/v1/me/certificate/:adoptionId        # Xem certificate
GET    /api/v1/me/certificate/:adoptionId/pdf    # Tải PDF certificate
GET    /api/v1/me/referral                       # Mã AFF + thống kê
POST   /api/v1/me/referral/copy                  # Log copy mã AFF
POST   /api/v1/orders                            # Tạo đơn hàng/thanh toán
GET    /api/v1/payments/:id/status               # Check trạng thái thanh toán
POST   /api/v1/payments/callback/:gateway        # Callback từ cổng thanh toán
POST   /api/v1/community/submit                  # Gửi câu chuyện cộng đồng
```

### 9.3 Admin API Endpoints

```text
GET    /api/v1/admin/dashboard                   # Tổng quan admin
GET    /api/v1/admin/users                       # Danh sách user (có filter/search/paginate)
GET    /api/v1/admin/users/:id                   # Chi tiết user
PUT    /api/v1/admin/users/:id                   # Cập nhật user (khoá/mở, role)
DELETE /api/v1/admin/users/:id                   # Xoá user (soft delete)
GET    /api/v1/admin/products                    # CRUD sản phẩm
POST   /api/v1/admin/products
PUT    /api/v1/admin/products/:id
DELETE /api/v1/admin/products/:id
GET    /api/v1/admin/corals                      # Pool san hô
POST   /api/v1/admin/corals
PUT    /api/v1/admin/corals/:id
POST   /api/v1/admin/adoptions/:id/assign        # Gán san hô cho adopter
GET    /api/v1/admin/blog                        # CRUD blog
POST   /api/v1/admin/blog
PUT    /api/v1/admin/blog/:id
DELETE /api/v1/admin/blog/:id
GET    /api/v1/admin/analytics                   # Analytics data
GET    /api/v1/admin/reports/export              # Xuất báo cáo CSV/PDF
POST   /api/v1/admin/refund/:paymentId           # Trigger refund
GET    /api/v1/admin/activity-logs               # Activity log
POST   /api/v1/admin/bulk-email                  # Gửi email hàng loạt
POST   /api/v1/admin/staff                       # Tạo/xoá tài khoản nhân viên
```

### 9.4 Coral Portal API Endpoints

```text
GET    /api/v1/portal/corals                     # Danh sách san hô cần update
GET    /api/v1/portal/corals/:id                 # Chi tiết san hô
POST   /api/v1/portal/corals/:id/updates         # Tạo update mới (ảnh/video + chỉ số)
GET    /api/v1/portal/updates/history            # Lịch sử update
POST   /api/v1/portal/corals/bulk-update         # Bulk upload
```

---

## 10. USER FLOWS CHI TIẾT

### 10.1 FLOW 1: KHÁCH MỚI → ADOPTER (Mua gói lần đầu)

| Bước | Actor | Hành động | Trang / Màn hình | Ghi chú |
|------|-------|----------|-------------------|---------|
| 1 | Khách mới | Vào website qua link, search hoặc social media | Home page | — |
| 2 | Khách mới | Đọc Hero, scroll xem section "Tại sao san hô quan trọng" | Home | Tracking: time-on-page |
| 3 | Khách mới | Đọc 3 gói giới thiệu nhanh, click "Tìm hiểu thêm" hoặc "Adopt Now" | Home → Sản phẩm | — |
| 4 | Khách mới | So sánh chi tiết 3 gói, đọc FAQ | Sản phẩm | Bảng so sánh hữu ích |
| 5 | Khách mới | Chọn gói (vd: Reef Guardian), bấm "Nhận nuôi ngay" | Sản phẩm | — |
| 6 | Hệ thống | Kiểm tra: chưa đăng nhập → hiện modal "Đăng nhập / Đăng ký" | Modal Auth | BẮT BUỘC có tài khoản |
| 7 | Khách mới | Chọn "Đăng ký" → form: họ tên, email, mật khẩu, SĐT | Trang đăng ký | Validation đầy đủ |
| 8 | Hệ thống | Submit → gửi email xác nhận (link verify) | Email | Template chuẩn |
| 9 | Khách mới | Click link verify → tài khoản kích hoạt | Email → Website | — |
| 10 | Khách mới | Quay lại trang Sản phẩm, gói đã chọn được giữ trong session/cart | Sản phẩm | Persistent cart |
| 11 | Khách mới | Bấm "Tiến hành thanh toán" | Trang thanh toán | — |
| 12 | Khách mới | Form thanh toán: thông tin adopter (pre-fill), đặt tên san hô, chọn phương thức | Trang thanh toán | Đặt tên là tuỳ chọn |
| 13 | Khách mới | Chọn VNPay/MoMo/Chuyển khoản → redirect tới cổng thanh toán | Cổng thanh toán | SSL bắt buộc |
| 14 | Hệ thống | Thanh toán thành công → callback về /thanh-cong | Trang xác nhận | — |
| 15 | Backend | Tạo bản ghi san hô (status=pending), gán cho user, gửi email xác nhận + certificate PDF | Backend | Generate certificate |
| 16 | Hệ thống | Hiển thị trang "Cảm ơn" + preview certificate + CTA "Vào dashboard" | Trang cảm ơn | — |
| 17 | Adopter | Vào dashboard, thấy san hô mới + status "Chờ gán san hô thật" | Dashboard | — |
| 18 | Backend | Trong vòng 7 ngày, admin gán san hô thật → status "Đang phát triển" | Backend → Dashboard | Notification email |

### 10.2 FLOW 2: ADOPTER QUAY LẠI XEM UPDATE

| Bước | Actor | Hành động | Trang / Màn hình | Ghi chú |
|------|-------|----------|-------------------|---------|
| 1 | Hệ thống | Nhận email "San hô của bạn vừa được cập nhật" | Email | Trigger từ portal trung tâm |
| 2 | Adopter | Click link trong email → /dang-nhap | Trang đăng nhập | — |
| 3 | Adopter | Đăng nhập → redirect về dashboard | Dashboard | Remember session 30 ngày |
| 4 | Hệ thống | Dashboard hiện badge "New update" trên san hô có update | Dashboard | — |
| 5 | Adopter | Click san hô → mở modal chi tiết → ảnh/video mới nhất | Modal | — |
| 6 | Adopter | Xem timeline growth, đọc ghi chú từ nhân viên trung tâm | Modal | — |
| 7 | Adopter | Tải certificate hoặc chia sẻ lên social | Modal | Open Graph tags chuẩn |
| 8 | Adopter | Đóng modal, xem impact dashboard tổng hợp | Dashboard | — |
| 9 | Adopter | (Tuỳ chọn) Sao chép mã AFF, share với bạn | Dashboard | 1-click copy |

### 10.3 FLOW 3: ADMIN QUẢN LÝ HÀNG NGÀY

| Bước | Actor | Hành động | Trang / Màn hình | Ghi chú |
|------|-------|----------|-------------------|---------|
| 1 | Admin | Đăng nhập /admin với tài khoản admin | Admin login | 2FA nếu được |
| 2 | Admin | Vào dashboard admin: tổng quan user, doanh thu, san hô | Admin dashboard | — |
| 3 | Admin | Tab "Users": xem danh sách adopter mới trong ngày | Admin > Users | Filter theo ngày, gói |
| 4 | Admin | Cần gán san hô thật cho adopter mới → mở chi tiết user → "Assign coral" | Admin > Users > Detail | — |
| 5 | Hệ thống | Đề xuất san hô có sẵn từ pool → admin chọn → confirm | Admin | — |
| 6 | Backend | Status user: "pending" → "active", email notification gửi adopter | Backend | — |
| 7 | Admin | (Hàng tuần) Tab "Sản phẩm": cập nhật giá, mở/đóng gói | Admin > Sản phẩm | — |
| 8 | Admin | (Hàng tháng) Tab "Báo cáo": xuất CSV danh sách adopter + doanh thu | Admin > Báo cáo | — |

### 10.4 FLOW 4: NHÂN VIÊN TRUNG TÂM SAN HÔ CẬP NHẬT

| Bước | Actor | Hành động | Trang / Màn hình | Ghi chú |
|------|-------|----------|-------------------|---------|
| 1 | NV | Vào field tại Nha Trang chụp ảnh/quay video san hô | Offline | — |
| 2 | NV | Đăng nhập /coral-portal trên điện thoại hoặc laptop | Portal login | Mobile-friendly bắt buộc |
| 3 | NV | Xem danh sách san hô cần update tháng này (filter: chưa update) | Portal | — |
| 4 | NV | Chọn 1 san hô → mở form input | Portal > Detail | — |
| 5 | NV | Upload ảnh (1-5 ảnh) và video (tuỳ chọn) → preview | Portal | Drag & drop, compress tự động |
| 6 | NV | Nhập chỉ số: kích thước (cm), sức khỏe (dropdown), ghi chú | Portal | Validation |
| 7 | Backend | Save → lưu + đồng bộ dashboard adopter tương ứng | Backend | — |
| 8 | Backend → Email | Email tự động gửi adopter: "San hô của bạn vừa được update" | Backend → Email | — |
| 9 | NV | Quay lại danh sách, san hô này biến mất khỏi filter "cần update" | Portal | — |
| 10 | NV | Lặp lại cho các san hô khác trong ngày | Portal | Bulk upload nếu được |

---

## 11. TÍCH HỢP BÊN THỨ 3

| STT | Hạng mục | Mô tả | Ghi chú |
|-----|----------|-------|---------|
| 1 | Cổng thanh toán VNPay | Redirect payment gateway | CLB cung cấp tài khoản merchant |
| 2 | Cổng thanh toán MoMo | Redirect / QR payment | CLB cung cấp tài khoản merchant |
| 3 | Chuyển khoản ngân hàng | Manual verify bởi admin | Upload ảnh chứng từ |
| 4 | Email Service | SendGrid / AWS SES / Resend | Transactional + marketing |
| 5 | S3 Storage | AWS S3 / Cloudflare R2 / DO Spaces | Lưu ảnh/video/certificate |
| 6 | CDN | Cloudflare | Tăng tốc tải ảnh |
| 7 | Google OAuth | Social login (tuỳ chọn) | Tăng UX |
| 8 | Google Analytics 4 | Tracking + analytics | — |
| 9 | Meta Pixel | Remarketing FB ads | — |
| 10 | Google Maps / Mapbox | GPS reef location embed | Vùng tương đối, bảo vệ toạ độ thật |
| 11 | Facebook/Instagram Feed | Social embed tại footer hoặc community | — |
| 12 | Website đối tác | Link tới website trung tâm san hô | Chốt link sau |

---

## 12. MILESTONE & TIMELINE

| STT | Milestone | Mô tả | Deadline |
|-----|-----------|-------|----------|
| 1 | Xác nhận spec | Đọc kỹ toàn bộ tài liệu, gửi câu hỏi cho PM | Trong 3 ngày từ khi nhận |
| 2 | Wireframe | Wireframe các trang chính (Home, Sản phẩm, Dashboard) gửi CLB duyệt | Tuần 1 |
| 3 | Mockup hoàn chỉnh | Design mockup (Figma) theo brand guideline. CLB review | Tuần 2-3 |
| 4 | Phát triển | Code frontend + backend song song. Test trên staging | Tuần 3-5 |
| 5 | Tích hợp thanh toán + email | VNPay/MoMo + email transactional. Test e2e | Tuần 5 |
| 6 | UAT (User Acceptance Test) | CLB test trên staging, gửi feedback. Dev fix | Tuần 5-6 |
| 7 | **Go-live** | Deploy production, redirect tên miền, kiểm tra cuối | **15/06/2026** |
| 8 | Hỗ trợ sau go-live | Bug fix + minor adjustment trong 30 ngày | 16/06 – 15/07/2026 |

---

## PHỤ LỤC A: WEBSITE THAM KHẢO

| STT | Tên | URL | Tham khảo gì |
|-----|-----|-----|-------------|
| 1 | Branch Coral Foundation | https://branchcoralfoundation.com/adopt-a-coral/ | Flow: chọn gói → form → thanh toán → certificate. Layout sạch. |
| 2 | Coral Gardeners | https://coralgardeners.org/products/adopt-a-coral | E-commerce flow + Track My Coral. Hero cảm xúc. |
| 3 | Patagonia | https://www.patagonia.com | Tone of voice: ấm, có chiều sâu. |
| 4 | Allbirds | https://www.allbirds.com | Cách trình bày impact + cam kết minh bạch. |
| 5 | Backmarket | https://www.backmarket.com | Cách kể chuyện sản phẩm có data + impact. |

---

## PHỤ LỤC B: DANH SÁCH EMAIL TEMPLATES CẦN DESIGN

| STT | Loại email | Trigger | Nội dung chính |
|-----|-----------|---------|----------------|
| 1 | Welcome + Verify | Sau khi đăng ký | Link verify email, giới thiệu Coralume |
| 2 | Reset Password | Khi quên mật khẩu | Link reset (có thời hạn) |
| 3 | Xác nhận thanh toán | Sau khi TT thành công | Chi tiết gói + certificate PDF đính kèm |
| 4 | Coral Update | Nhân viên cập nhật san hô | Ảnh/video mới + link dashboard |
| 5 | Monthly Report | Hàng tháng (Reef Guardian+) | Báo cáo growth chi tiết |
| 6 | Quarterly Report | Hàng quý (Reef Guardian+) | Báo cáo impact + growth |
| 7 | Ambassador Chúc mừng | Khi đạt 5 referrals | Hướng dẫn nhận quà, badge |
| 8 | Assign Coral | Admin gán san hô thật | Tên san hô + ID + link dashboard |

---

## PHỤ LỤC C: CHECKLIST TRƯỚC GO-LIVE

- [ ] HTTPS toàn site (Let's Encrypt)
- [ ] Lighthouse score > 85 (Performance, Accessibility, SEO)
- [ ] Responsive: test trên mobile, tablet, desktop (mobile-first)
- [ ] WCAG 2.1 AA: contrast, alt text, keyboard nav, ARIA
- [ ] SSL cho trang thanh toán
- [ ] Rate limiting trên endpoint login/register/payment
- [ ] Email verification flow hoạt động
- [ ] Payment flow e2e test: Adopt → Register → Verify → Pay → Certificate → Dashboard
- [ ] Coral Portal flow: Staff login → Upload ảnh → Nhập chỉ số → Adopter thấy update
- [ ] Admin Panel: CRUD user, sản phẩm, nội dung, san hô; Activity log
- [ ] Backup database schedule
- [ ] SEO: sitemap.xml, robots.txt, meta tags, OG tags, Schema.org
- [ ] GA4 + Meta Pixel installed
- [ ] Email templates tested (all 8 types)
- [ ] Bulk export CSV/Excel
- [ ] Refund flow test

---

*Tài liệu được biên soạn dựa trên file Coralume - Website.xlsx (cập nhật 03/06/2026).*
*Mọi thay đổi về yêu cầu cần được PM dự án phê duyệt.*
