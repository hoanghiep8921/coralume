# Software Requirements Specification — Con Sóc (Trang chủ)

> **Phiên bản:** 1.0
> **Ngày tạo:** 2026-03-03
> **Nguồn:** Tài liệu nghiệp vụ Trang chủ v1.2 (06 Jan 2026), Checklist v1.0 (19 Dec 2025)

---

## 1. Giới thiệu

### 1.1 Mục đích

Tài liệu này mô tả đầy đủ yêu cầu phần mềm cho module **Trang chủ (Home)** của ứng dụng chat **Con Sóc**. Trang chủ là màn hình chính sau đăng nhập, hiển thị danh sách hội thoại, hỗ trợ tìm kiếm, và điều hướng đến các chức năng khác.

### 1.2 Phạm vi

- Màn hình Trang chủ với 5 tab: Tất cả, Lượt đề cập, Chuỗi tin, Nhóm chat, Cá nhân
- Chức năng tìm kiếm (người dùng, nhóm, nội dung tin nhắn)
- Quản lý badge/trạng thái chưa đọc
- Đồng bộ realtime
- Quản lý phiên đăng nhập đa thiết bị

### 1.3 Thuật ngữ

| Thuật ngữ | Định nghĩa |
|-----------|------------|
| DM | Direct Message — Tin nhắn trực tiếp 1-1 giữa 2 người dùng |
| Group | Nhóm chat có nhiều thành viên |
| Thread / Chuỗi tin | Chuỗi thảo luận phụ (reply chain) gắn vào 1 tin nhắn gốc |
| Badge | Huy hiệu hiển thị số lượng chưa đọc trên tab |
| Mention | Nhắc đến (@mention) — tag trực tiếp 1 người dùng trong tin nhắn |
| Mention All | Nhắc đến tất cả thành viên (@all) |
| lastActivityTime | Thời điểm hoạt động cuối cùng của hội thoại |
| lastMessageAt | Thời điểm tin nhắn cuối cùng được gửi |
| lastReadAt | Thời điểm người dùng đọc tin nhắn cuối cùng |
| hasUnread | Trạng thái boolean cho biết hội thoại có tin chưa đọc |
| hasMentions | Trạng thái boolean cho biết hội thoại có mention chưa đọc |
| Skeleton UI | Giao diện placeholder hiển thị khi đang tải dữ liệu |
| Inbox | Danh sách hội thoại của người dùng |

---

## 2. Tổng quan hệ thống

### 2.1 Kiến trúc

```
App Client (Next.js Web)
  ↓ REST API + WebSocket
App Server (Backend)
  ↓
Database + Search Service
```

**Luồng chính:**
1. Người dùng mở ứng dụng hoặc chọn tab Trang chủ
2. App Client kiểm tra trạng thái đăng nhập và token
3. App Client gọi đồng thời các API: `/api/v1/me`, `/api/v1/chat/inbox`, `/api/v1/users/unread`
4. App Server xác thực token, truy vấn dữ liệu, sắp xếp và trả về
5. App Client render giao diện, cho phép thao tác tiếp

### 2.2 User Roles

| Role | Mô tả |
|------|--------|
| Người dùng (KH) | Nhân viên đã đăng nhập, có quyền truy cập hệ thống chat |
| App Client | Ứng dụng web chạy trên trình duyệt |
| App Server | Backend xử lý logic nghiệp vụ, xác thực, truy vấn dữ liệu |

### 2.3 Pre-Conditions

- Người dùng đã đăng nhập thành công
- Có quyền truy cập hệ thống chat
- Thiết bị có kết nối mạng hoặc có dữ liệu cache

### 2.4 Post-Conditions

- Danh sách hội thoại được hiển thị đúng rule sắp xếp
- Trạng thái unread/mention được đồng bộ
- Hệ thống sẵn sàng cho: mở hội thoại, tìm kiếm, tạo hội thoại mới, lọc theo tab

---

## 3. Yêu cầu chức năng

### 3.1 Khởi tạo màn hình Home

#### FR-001: Điều kiện truy cập Home

- **Mô tả:** Người dùng phải đăng nhập thành công và có access token hợp lệ mới được truy cập Home
- **Acceptance Criteria:**
  - [ ] Nếu chưa đăng nhập → Điều hướng về màn hình Login
  - [ ] Nếu token hết hạn → Tự động refresh token
  - [ ] Nếu refresh token không hợp lệ → Logout và điều hướng về Login

#### FR-002: Load dữ liệu ban đầu

- **Mô tả:** Client gọi đồng thời 3 API khi mở Home
- **API Calls:**
  1. `GET /api/v1/me` — Lấy thông tin user
  2. `GET /api/v1/chat/inbox` — Lấy danh sách hội thoại kèm last message
  3. `GET /api/v1/users/unread` — Lấy số lượng badge tại các tab
- **Acceptance Criteria:**
  - [ ] 3 API được gọi đồng thời (parallel), không phụ thuộc nhau
  - [ ] API nào trả về được → Render dữ liệu ngay, không chờ tất cả
  - [ ] API nào lỗi → Hiển thị fallback, không block toàn màn hình
  - [ ] Cả 3 API cùng lỗi → Hiển thị màn hình lỗi Home + nút retry

#### FR-003: Thứ tự hiển thị mặc định

- **Mô tả:** Inbox items được sắp xếp theo `lastActivityTime` giảm dần
- **Acceptance Criteria:**
  - [ ] Hội thoại có tin nhắn mới nhất hiển thị đầu tiên
  - [ ] Không phân loại DM/Group/Thread trong tab Tất cả

#### FR-004: Trạng thái Loading

- **Mô tả:** Hiển thị skeleton UI trong khi chờ dữ liệu
- **Acceptance Criteria:**
  - [ ] Hiển thị skeleton cho từng section độc lập
  - [ ] Skeleton hiển thị trước, gọi API song song
  - [ ] Ưu tiên render dữ liệu quan trọng nhất (inbox hội thoại)

#### FR-005: Xử lý lỗi load Home

- **Mô tả:** Xử lý các trường hợp lỗi khi load dữ liệu Home
- **Error Handling:**

| Trường hợp | Xử lý |
|------------|--------|
| API inbox lỗi | Hiển thị empty state: "Không thể tải danh sách hội thoại" + nút retry. Badge và avatar user không bị ảnh hưởng |
| API user info lỗi | Hiển thị thông tin mặc định cho avatar, header |
| API badge lỗi | Ẩn badge, không block UI |
| Mạng yếu | Hiển thị dữ liệu cache cục bộ (nếu có) |
| Mất kết nối mạng | Thông báo "Không có kết nối mạng", load dữ liệu từ cache |

- **Acceptance Criteria:**
  - [ ] Bottom tab vẫn hiển thị bình thường khi inbox lỗi
  - [ ] Có nút retry cho mỗi section lỗi
  - [ ] Không hiển thị lỗi blocking cho toàn màn hình trừ khi cả 3 API fail

---

### 3.2 Danh sách hội thoại & Box hội thoại

#### FR-010: Đơn vị hiển thị

- **Mô tả:** Mỗi item server trả về = 1 box hội thoại độc lập
- **Acceptance Criteria:**
  - [ ] Nếu `isThread=true` → Hiển thị như 1 box riêng với icon chuỗi
  - [ ] Mỗi box là 1 card có thể click

#### FR-011: Điều kiện hiển thị Thread

- **Mô tả:** Thread được hiển thị như 1 box riêng trên Home khi user thỏa ít nhất 1 điều kiện:
  - User đã reply vào thread
  - User được @mention trong thread (chỉ tính mention trực tiếp, không tính mention all)
  - User explicit follow/subscribe thread (giai đoạn sau)
- **Acceptance Criteria:**
  - [ ] Thread chỉ hiển thị nếu user có liên quan
  - [ ] Hiển thị topic + last message trong thread

#### FR-012: Điều kiện hiển thị Group chat

- **Mô tả:** Group chat hiển thị khi:
  - User là thành viên của group
  - Group có ít nhất 1 tin nhắn
- **Acceptance Criteria:**
  - [ ] Group rỗng (0 tin nhắn) không hiển thị
  - [ ] User bị xóa khỏi group → Hội thoại tự ẩn

#### FR-013: Điều kiện hiển thị DM

- **Mô tả:** DM hiển thị khi có ít nhất 1 tin nhắn
- **Business Rule:** Một cặp user chỉ tồn tại 01 hội thoại trực tiếp duy nhất
- **Acceptance Criteria:**
  - [ ] DM xuất hiện trên Home của cả 2 user khi có tin nhắn
  - [ ] Không cho phép tạo DM trùng lặp

#### FR-014: Hội thoại bị ẩn

- **Mô tả:** Hội thoại không hiển thị khi:
  - User bị xóa khỏi nhóm
  - User tự rời nhóm
  - Nhóm bị giải tán
- **Acceptance Criteria:**
  - [ ] Hội thoại tự ẩn khỏi Trang chủ và Danh sách nhóm
  - [ ] Realtime cập nhật khi bị kick/rời nhóm

#### FR-015: Cập nhật realtime danh sách

- **Mô tả:** Khi có tin nhắn mới, hội thoại tự động nhảy lên đầu danh sách
- **Acceptance Criteria:**
  - [ ] Hội thoại có tin mới tự nhảy lên đầu
  - [ ] Nếu đang mở hội thoại → Không tăng badge unread
  - [ ] Nếu đang mở hội thoại → Không cập nhật preview cho đến khi thoát ra

#### FR-016: Trạng thái chưa đọc visual

- **Mô tả:** Hội thoại chưa đọc được hiển thị in đậm kèm icon chưa đọc
- **Acceptance Criteria:**
  - [ ] In đậm tên hội thoại khi `hasUnread=true`
  - [ ] Hiển thị icon chưa đọc bên cạnh
  - [ ] Đoạn hội thoại chuỗi hiển thị thêm icon chuỗi

---

### 3.3 Avatar & Title

#### FR-020: Avatar DM (Cá nhân)

- **Mô tả:** Hiển thị avatar của user đối tác
- **Avatar mặc định (nếu chưa có ảnh):**
  - **Quy tắc tạo text:**
    - Hiển thị chữ cái đầu tiên của từ thứ nhất + chữ cái đầu tiên của từ cuối
    - Sử dụng chữ in hoa
    - Nếu tên chỉ có 1 từ → Lấy 1 chữ cái đầu tiên
  - **Quy tắc tạo màu:**
    - Cùng 1 user → Luôn cùng 1 màu
    - Các user khác nhau → Phân bổ màu ngẫu nhiên nhưng đồng đều
    - Không đổi màu theo thời gian
- **Acceptance Criteria:**
  - [ ] Avatar text đúng format (VD: "Nguyễn Văn A" → "NA")
  - [ ] Màu avatar nhất quán cho cùng 1 user
  - [ ] Màu phân bổ đồng đều giữa các user

#### FR-021: Avatar Group (Nhóm)

- **Mô tả:** Hiển thị avatar nhóm hoặc icon mặc định
- **Avatar mặc định:** Hiển thị chung 1 icon nhóm, màu sắc phân bổ ngẫu nhiên
- **Acceptance Criteria:**
  - [ ] Group có avatar tùy chỉnh → Hiển thị ảnh tùy chỉnh
  - [ ] Group không có avatar → Hiển thị icon mặc định với màu ngẫu nhiên

#### FR-022: Avatar Thread

- **Mô tả:** Dùng avatar của group/DM chứa thread
- **Acceptance Criteria:**
  - [ ] Thread trong group → Avatar group
  - [ ] Thread trong DM → Avatar user đối tác

#### FR-023: Title hiển thị

- **Mô tả:** Luôn hiển thị `channelName` (tên group hoặc tên user)
- **Acceptance Criteria:**
  - [ ] DM: Hiển thị tên người dùng đối tác
  - [ ] Group: Hiển thị tên nhóm
  - [ ] Thread: Hiển thị tên group/user chứa thread

---

### 3.4 Preview nội dung

#### FR-030: Preview DM/Group

- **Mô tả:** Lấy từ `lastMessage.content`, hiển thị 1 dòng duy nhất
- **Acceptance Criteria:**
  - [ ] Chỉ hiển thị 1 dòng, không xuống dòng
  - [ ] Nội dung dài → Cắt theo rule UI

#### FR-031: Preview Thread

- **Mô tả:** Hiển thị 2 dòng:
  - Dòng 1: Topic (tin nhắn gốc mở thread)
  - Dòng 2: Tin nhắn mới nhất trong chuỗi (từ `threadPreview.lastMessage.content`)
- **Điều kiện:** Chỉ hiển thị nếu user có tham gia chuỗi (chat/reply/được mention)
- **Acceptance Criteria:**
  - [ ] Hiển thị topic + reply mới nhất
  - [ ] Nếu last message đã bị xóa → Hiển thị "Tin nhắn đã bị xóa"

#### FR-032: Format preview theo loại nội dung

| # | Loại nội dung | Preview hiển thị |
|---|---------------|-----------------|
| 1 | Text | Cắt tối đa 50 ký tự, hiển thị dấu `....` |
| 2 | Sticker | Text "Sticker" |
| 3 | Hình ảnh | "N hình ảnh" (N = số lượng) |
| 4 | Video | "N video" |
| 5 | File | "N tệp đính kèm" |
| 6 | Text + file/ảnh/video | Hiển thị text |
| 7 | Reaction | Không đổi preview |
| 8 | Edit last message | Update preview |
| 9 | Delete last message | "Tin nhắn đã bị xóa" |

- **Acceptance Criteria:**
  - [ ] Mỗi loại nội dung hiển thị đúng format
  - [ ] Tin nhắn hệ thống (join/leave/rename) → Không hiển thị preview

#### FR-033: Định dạng thời gian

- **Mô tả:** Hiển thị thời gian gửi của tin nhắn mới nhất
- **Rule convert:**

| Điều kiện | Format hiển thị |
|-----------|----------------|
| Trong ngày T | `hh:mm` |
| Ngày T-1 | `Hôm qua` |
| T-2 đến T-6 | Tên thứ: `Thứ Hai`, `Thứ Ba`, `Thứ Tư`, `Thứ Năm`, `Thứ Sáu`, `Thứ Bảy`, `Chủ nhật` |
| T-7 trở đi, trong năm | `dd/mm` |
| T-7 trở đi, khác năm | `dd/mm/yyyy` |

- **Acceptance Criteria:**
  - [ ] Thời gian chuyển đổi đúng theo từng rule
  - [ ] Với Thread: lấy từ `threadPreview.lastMessage.timestamp`
  - [ ] Với DM/Group: lấy từ `lastMessage.timestamp`

---

### 3.5 Badge & Trạng thái chưa đọc

#### FR-040: Badge unread tổng (Tab Tất cả)

- **Mô tả:** Hiển thị số lượng tin nhắn chưa đọc trên tab Tất cả
- **Acceptance Criteria:**
  - [ ] Hiển thị badge khi count > 0
  - [ ] Ẩn badge khi count = 0
  - [ ] Nếu count > 99 → Hiển thị `99+`

#### FR-041: Badge mention (Tab Lượt đề cập)

- **Mô tả:** Hiển thị số lượng tin nhắn mention chưa đọc
- **Tăng badge:** +1 khi thỏa mãn đồng thời:
  - Có tin nhắn mới
  - Tin nhắn chứa @user (mention trực tiếp)
  - Tin nhắn chưa được user đọc
  - User không đang mở đúng hội thoại đó
- **Reset badge:**

| # | Trường hợp | Cách xử lý |
|---|-----------|------------|
| 1 | User mở đúng conversation chứa mention | Giảm đúng số mention unread trong conversation đó |
| 2 | User scroll tới message chứa mention | Đánh dấu message đó là read |
| 3 | User mở từ push notification mention | Reset badge tương ứng |

- **Acceptance Criteria:**
  - [ ] Badge tăng realtime khi có mention mới
  - [ ] Badge KHÔNG reset khi chỉ mở tab Lượt nhắc
  - [ ] Badge chỉ reset khi mở đúng hội thoại chứa mention
  - [ ] Ẩn badge khi count = 0, hiển thị `99+` khi > 99

#### FR-042: Badge thread (Tab Chuỗi tin)

- **Mô tả:** Badge thread là boolean unread, không cộng dồn cho cùng 1 thread
- **Tăng badge:** +1 khi thỏa mãn đồng thời:
  - Có reply mới trong thread
  - User là người tham gia thread hoặc thuộc nhóm chứa thread
  - User chưa mở thread
- **Reset badge:**

| # | Trường hợp | Cách xử lý |
|---|-----------|------------|
| 1 | User mở đúng thread đó | Giảm đúng số badge trong thread |
| 2 | User đọc toàn bộ reply trong thread | badge = 0 |
| 3 | User mở từ push notification thread | Badge giảm ngay |
| 4 | User chỉ mở tab "Chuỗi" | **KHÔNG reset** |

- **Acceptance Criteria:**
  - [ ] Nhiều reply khi chưa đọc → Badge giữ nguyên (boolean per thread)
  - [ ] Badge KHÔNG reset khi chỉ mở tab
  - [ ] Chỉ đọc thread mới reset
  - [ ] Ẩn badge khi count = 0, hiển thị `99+` khi > 99

#### FR-043: Badge nhóm (Tab Nhóm)

- **Mô tả:** Hiển thị số lượng nhóm chat có tin nhắn chưa đọc
- **Tăng badge:**
  - Server lưu message, cập nhật `lastMessageAt`
  - Nếu `lastMessageAt > lastReadAt` → group = unread
  - Lưu ý: Khi `lastMessageAt` thay đổi mà `lastReadAt` không thay đổi, không tăng thêm badge (đã tính rồi)
- **Reset badge:**

| # | Trường hợp | Cách xử lý |
|---|-----------|------------|
| 1 | User mở đúng group đó | Server reset `lastReadAt = now` → Recompute unread |
| 2 | User cuộn đến message cuối cùng | Client gửi API cập nhật trạng thái đọc |
| 3 | Nhận push notification | **KHÔNG** reset |
| 4 | Xem preview trên Home | **KHÔNG** reset |

- **Acceptance Criteria:**
  - [ ] Badge = số lượng group có unread, không phải tổng tin nhắn
  - [ ] Ẩn badge khi count = 0, hiển thị `99+` khi > 99

#### FR-044: Badge cá nhân (Tab Cá nhân)

- **Mô tả:** Hiển thị số lượng box chat cá nhân có tin nhắn chưa đọc
- **Tăng badge:**
  - Server lưu message, cập nhật `lastMessageAt`
  - Nếu `lastMessageAt > lastReadAt` → DM = unread
  - Lưu ý: Với 1 DM thỏa điều kiện, khi `lastMessageAt` thay đổi mà `lastReadAt` không thay đổi sẽ không tăng badge
- **Reset badge:**

| # | Trường hợp | Cách xử lý |
|---|-----------|------------|
| 1 | User mở đúng DM đó | Server reset `lastReadAt = now` → Recompute unread |
| 2 | User cuộn đến message cuối cùng | Client gửi API cập nhật trạng thái đọc |
| 3 | Nhận push notification | **KHÔNG** reset |
| 4 | Xem preview trên Home | **KHÔNG** reset |

- **Acceptance Criteria:**
  - [ ] Badge = số lượng DM có unread
  - [ ] Ẩn badge khi count = 0, hiển thị `99+` khi > 99

#### FR-045: Quy tắc chung reset badge

- **Mô tả:** Badge unread chỉ reset khi user mở hội thoại tương ứng
- **Business Rule:** Trạng thái hội thoại, last message, unread, mention được quyết định bởi server. Client chỉ cache để tối ưu UX, không được coi là dữ liệu chính xác tuyệt đối
- **Acceptance Criteria:**
  - [ ] Reset badge qua API mark read, không tính client-side
  - [ ] Sau mark read → Server push realtime event để đồng bộ badge trên tất cả tab

---

### 3.6 Tab Tất cả

#### FR-060: Hiển thị Tab Tất cả

- **Mô tả:** Hiển thị toàn bộ inbox items (DM, Group, Thread)
- **API:** `GET /api/v1/chat/inbox`
- **Acceptance Criteria:**
  - [ ] Tab Tất cả là tab mặc định khi vào Home
  - [ ] Hiển thị tất cả loại hội thoại không phân loại
  - [ ] Sắp xếp theo `lastActivityTime` giảm dần
  - [ ] Hội thoại mới nhất lên đầu

#### FR-061: Cấu trúc mỗi item trong Tab Tất cả

- **Mô tả:** Mỗi item gồm:
  1. Avatar người gửi/nhóm
  2. Tên hội thoại (tên user hoặc tên group)
  3. Preview nội dung tin nhắn mới nhất (theo FR-030 → FR-032)
  4. Thời gian gửi (theo FR-033)
  5. Icon chưa đọc (nếu `hasUnread=true`)
  6. Icon chuỗi (nếu là thread)
- **Acceptance Criteria:**
  - [ ] Tất cả thành phần hiển thị đúng vị trí
  - [ ] Click vào bất kỳ phần tử nào → Mở chi tiết hội thoại

---

### 3.7 Tab Lượt đề cập

#### FR-070: Hiển thị Tab Lượt đề cập

- **Mô tả:** Hiển thị tất cả tin nhắn mà người dùng được đề cập trực tiếp (@mention), trong cả hội thoại và thread
- **API:** `GET /api/v1/me/mentions`
- **Acceptance Criteria:**
  - [ ] Chỉ hiển thị mention trực tiếp đến user, **KHÔNG** hiển thị mention tag all
  - [ ] Sắp xếp hội thoại có mention mới nhất (`created_at`) lên đầu
  - [ ] In đậm + icon chưa đọc cho item chưa đọc
  - [ ] Badge KHÔNG reset khi mở tab
  - [ ] Hiển thị skeleton loading hoặc danh sách cache khi đang tải

#### FR-071: Preview nội dung Tab Lượt đề cập

- **Mô tả:** Preview hiển thị tin nhắn người dùng được mention
- **Acceptance Criteria:**
  - [ ] Chỉ hiển thị tin nhắn người dùng được mention (không phải last message)
  - [ ] Hiển thị tối đa 1 dòng
  - [ ] Mention trong thread: chỉ hiển thị tin nhắn được mention, **KHÔNG** hiển thị topic của thread
  - [ ] Thời gian hiển thị là thời gian của tin nhắn mention (theo FR-033)

#### FR-072: Dữ liệu response Tab Lượt đề cập

- **Mô tả:** Mỗi item mention gồm:
  - `groupID` — ID nhóm/hội thoại
  - `groupType` — Loại hội thoại
  - `messageId` — Định danh message để điều hướng
  - `groupName` — Tên hội thoại (tên group / tên DM)
  - `sender.displayName` — Tên hiển thị của sender
  - `previewText` — Nội dung tin nhắn mention
  - `createdAt` — Thời điểm message tạo
  - `isRead` — Trạng thái đã đọc
- **Acceptance Criteria:**
  - [ ] Nếu `isRead=false` → Item chưa đọc → In đậm

---

### 3.8 Tab Chuỗi tin

#### FR-080: Hiển thị Tab Chuỗi tin

- **Mô tả:** Hiển thị danh sách chuỗi thảo luận (thread) mà người dùng tham gia
- **API:** `GET /api/v1/messages/threads/preview`
- **Điều kiện hiển thị thread:**
  - User đã từng tham gia chuỗi (reply), HOẶC
  - Chuỗi có mention trực tiếp đến user
- **Acceptance Criteria:**
  - [ ] Sắp xếp theo `last_reply_at` mới nhất lên đầu
  - [ ] In đậm + icon chưa đọc cho item chưa đọc
  - [ ] Badge KHÔNG reset khi mở tab
  - [ ] Hiển thị skeleton loading hoặc danh sách cache khi đang tải

#### FR-081: Preview nội dung Tab Chuỗi tin

- **Mô tả:** Mỗi item gồm:
  - `content` — Nội dung tin nhắn gốc (root message / topic)
  - `threadInfo.content` — Nội dung reply cuối cùng trong thread
- **Acceptance Criteria:**
  - [ ] Hiển thị topic (tin nhắn gốc) + reply mới nhất
  - [ ] Thời gian hiển thị là `last_reply_at` (theo FR-033)

---

### 3.9 Tab Nhóm chat

#### FR-090: Hiển thị Tab Nhóm chat

- **Mô tả:** Hiển thị toàn bộ danh sách nhóm mà người dùng tham gia
- **API:** `GET /api/v1/channels?type=group&sort=lastActivityAt,desc`
- **Acceptance Criteria:**
  - [ ] Sắp xếp nhóm có `lastActivityAt` mới nhất lên đầu
  - [ ] In đậm nhóm có `hasUnread=true`
  - [ ] Kiểm tra local cache trước → Hiển thị dữ liệu cũ → Đồng thời gọi API sync

#### FR-091: Cấu trúc item Tab Nhóm

- **Mô tả:** Mỗi item gồm:
  - Avatar nhóm
  - Tên nhóm
- **Acceptance Criteria:**
  - [ ] Click → Mở màn hình chat group
  - [ ] Chỉ hiển thị avatar + tên (không preview tin nhắn)

#### FR-092: lastActivityAt cập nhật khi (Group)

| # | Event | Cập nhật lastActivityAt |
|---|-------|------------------------|
| 1 | Gửi tin nhắn mới (text, image, video, file, emoji) | **Có** |
| 2 | Có reply mới trong thread | **Có** |
| 3 | Tạo nhóm mới | **Có** |
| 4 | Thêm thành viên vào group | Không |
| 5 | Xóa thành viên khỏi group | Không |
| 6 | Thành viên tự rời group | Không |
| 7 | Đổi tên/avatar group | Không |
| 8 | Thay đổi quyền thành viên | Không |
| 9 | Chỉnh sửa tin nhắn | Không |
| 10 | Xóa tin nhắn | Không |
| 11 | User đọc tin nhắn | Không |
| 12 | Reaction tin nhắn | Không |

---

### 3.10 Tab Cá nhân

#### FR-100: Hiển thị Tab Cá nhân

- **Mô tả:** Hiển thị toàn bộ danh sách cá nhân mà người dùng đã chat trực tiếp
- **API:** `GET /api/v1/channels?type=DM&sort=lastActivityAt,desc`
- **Điều kiện:** DM tồn tại ít nhất 1 message (không tính message đã bị xóa)
- **Acceptance Criteria:**
  - [ ] Sắp xếp theo `lastActivityAt` mới nhất lên đầu
  - [ ] In đậm user có `hasUnread=true`
  - [ ] Kiểm tra local cache trước → Hiển thị dữ liệu cũ → Đồng thời gọi API sync

#### FR-101: Cấu trúc item Tab Cá nhân

- **Mô tả:** Mỗi item gồm:
  - Avatar cá nhân
  - Tên cá nhân
  - Icon trạng thái online/offline
- **Acceptance Criteria:**
  - [ ] Click → Mở màn hình chat với cá nhân
  - [ ] Hiển thị trạng thái online/offline chính xác

#### FR-102: lastActivityAt cập nhật khi (DM)

| # | Event | Cập nhật lastActivityAt |
|---|-------|------------------------|
| 1 | Gửi tin nhắn mới (text, image, video, file, emoji) | **Có** |
| 2 | Có reply mới trong thread | **Có** |
| 3 | Tạo DM mới | **Có** |
| 4 | Chỉnh sửa tin nhắn | Không |
| 5 | Xóa tin nhắn | Không |
| 6 | User đọc tin nhắn | Không |
| 7 | Reaction tin nhắn | Không |

#### FR-103: Tạo hội thoại DM mới

- **Mô tả:** Khi chọn 1 user chưa có DM
- **Luồng:**
  1. Client gửi request lấy hội thoại giữa 2 user
  2. Server kiểm tra: nếu chưa tồn tại → Tạo conversation mới (conversation_id, members, tin nhắn rỗng)
  3. Server trả về conversation_id + metadata
  4. Client hiển thị màn hình chat, cuộn về cuối, reset badge
- **Acceptance Criteria:**
  - [ ] Nếu đã tồn tại DM → Mở DM cũ, trả danh sách 20-30 tin nhắn mới nhất
  - [ ] Nếu chưa tồn tại → Tạo mới, trả tin nhắn = rỗng

---

### 3.11 Tìm kiếm

#### FR-110: Khởi tạo tìm kiếm

- **Mô tả:** Khi nhấn icon kính lúp, mở màn hình tìm kiếm
- **API:** `POST /searchService/api/v1/search` (type=CHAT, keyword rỗng)
- **Acceptance Criteria:**
  - [ ] Auto focus vào ô nhập tìm kiếm, hiển thị bàn phím
  - [ ] Hiển thị danh sách "Gần đây" (tối đa 5 kết quả) — ẩn nếu không có
  - [ ] Hiển thị danh bạ người dùng (sắp xếp alphabet) — ẩn nếu không có
  - [ ] Nếu API lỗi → Hiển thị màn hình khởi tạo trống, không hiển thị lỗi blocking

#### FR-111: Ô nhập tìm kiếm

- **Mô tả:** Textbox cho phép nhập tìm kiếm
- **Acceptance Criteria:**
  - [ ] Placeholder: "Tìm kiếm tin nhắn, người dùng, nhóm chat"
  - [ ] Cho phép nhập mọi ký tự
  - [ ] Độ dài tối đa: 225 ký tự
  - [ ] Hiển thị icon "x" để xóa toàn bộ ký tự đã nhập
  - [ ] Icon Back để quay lại Trang chủ

#### FR-112: Tìm kiếm realtime (autocomplete)

- **Mô tả:** Khi user bắt đầu nhập, tự động tìm kiếm realtime
- **API:** `POST /searchService/api/v1/search` (gọi song song 2 lần với type=USER và type=CHANNEL)
- **Trigger:** Sau khi nhập 2 ký tự, debounce 300ms
- **Phạm vi tìm kiếm:**
  - Danh sách user trong công ty (active, có quyền chat): theo tên, SĐT, email
  - Group đã tham gia: theo tên group
  - **KHÔNG** tìm trong nội dung tin nhắn ở bước này
- **Sắp xếp:**
  - Ưu tiên 1: Kết quả server trả về (theo `lastActivityAt`)
  - Ưu tiên 2: Danh bạ người dùng
  - User chưa từng tương tác → Sắp xếp theo alphabet
- **Giới hạn:** Tối đa 5 kết quả mỗi loại
- **Acceptance Criteria:**
  - [ ] Chỉ trigger khi nhập >= 2 ký tự
  - [ ] Debounce 300ms (chỉ gửi request khi 300ms không có ký tự mới)
  - [ ] Gọi song song 2 API (USER + CHANNEL)
  - [ ] Mặc định focus vào tab "Trò chuyện"
  - [ ] Không có kết quả → "Không tìm thấy kết quả phù hợp"
  - [ ] Hiển thị textlink "Xem thêm" nếu `hasMore=true`

#### FR-113: Tab Trò chuyện (kết quả tìm kiếm)

- **Mô tả:** Hiển thị danh sách user và group phù hợp
- **Cấu trúc mỗi item:**
  - Avatar
  - Fullname (không phải username)
  - Lưu ý: Tìm kiếm bằng SĐT cũng hiển thị Fullname
- **Acceptance Criteria:**
  - [ ] Cho phép scroll dọc xem thêm kết quả
  - [ ] Hiển thị theo thứ tự server trả về
  - [ ] Click vào kết quả → Mở/tạo DM hoặc mở group chat

#### FR-114: Nhấn Enter — Tìm kiếm nội dung tin nhắn

- **Mô tả:** Thực hiện tìm kiếm trong nội dung hội thoại
- **API:** `POST /searchService/api/v1/search` (type=MESSAGE)
- **Phạm vi:**
  - Danh sách group mà user là member
  - Danh sách DM
  - Loại trừ: group rỗng và DM rỗng
- **Thuật toán match:**
  - Không phân biệt hoa/thường
  - Không phân biệt dấu tiếng Việt
  - Tìm kiếm chính xác (nâng cấp các phase sau)
  - Chỉ lọc message chưa bị xóa
- **Acceptance Criteria:**
  - [ ] Chuyển sang tab "Tin nhắn"
  - [ ] Hiển thị danh sách hội thoại có chứa từ khóa
  - [ ] Sắp xếp theo thời gian gửi message mới nhất

#### FR-115: Tab Tin nhắn (kết quả tìm kiếm)

- **Mô tả:** Hiển thị danh sách tin nhắn phù hợp với keyword
- **Cấu trúc mỗi item:**
  - Avatar
  - Tên hội thoại (tên cá nhân hoặc tên nhóm)
  - Preview tin nhắn: Nội dung chứa từ khóa, tối đa 2 dòng
  - Thời gian tin nhắn (theo FR-033)
- **Rule cắt preview:**
  - contextBefore = 80 ký tự trước keyword
  - contextAfter = 80 ký tự sau keyword
  - Format: `<contextBefore> <keyword> <contextAfter>`
  - Thêm `...` ở đầu nếu preview không bắt đầu từ đầu tin nhắn
  - Thêm `...` ở cuối nếu preview không kết thúc tại cuối tin nhắn
- **Acceptance Criteria:**
  - [ ] Highlight keyword trong preview
  - [ ] Hiển thị tối đa 2 dòng
  - [ ] Ellipsis đúng rule (đầu/cuối)

#### FR-116: Click kết quả tìm kiếm

- **Mô tả:** Hành vi khi click vào 1 kết quả
- **Acceptance Criteria:**
  - [ ] Click user → Tạo/Mở DM
  - [ ] Click group → Mở group chat
  - [ ] Click message → Mở hội thoại tại đúng message đó, scroll đúng vị trí
  - [ ] Click thread → Mở đúng thread
  - [ ] Reset unread nếu có và gửi yêu cầu cập nhật trạng thái

#### FR-117: "Xem thêm" trong kết quả tìm kiếm

- **Mô tả:** Khi kết quả tìm kiếm có `hasMore=true`, hiển thị textlink "Xem thêm"
- **Acceptance Criteria:**
  - [ ] Click "Xem thêm" → Gọi API phân trang tiếp theo
  - [ ] Load thêm kết quả, append vào danh sách hiện tại

---

### 3.12 Hành vi Click hội thoại

#### FR-130: Click DM

- **Mô tả:** Mở màn hình chat DM
- **Acceptance Criteria:**
  - [ ] Điều hướng sang màn hình chat cá nhân
  - [ ] Hiển thị loading → Lấy cache (nếu có) → Fetch từ server

#### FR-131: Click Group

- **Mô tả:** Mở màn hình chat group
- **Luồng chi tiết:**
  1. Điều hướng, hiển thị header + skeleton loader
  2. Kiểm tra cache local → Nếu có → Render tạm (fast path)
  3. Gọi API `GET /api/v1/channels/{channelId}`
  4. Server kiểm tra: group tồn tại? User là member?
  5. Trả về: danh sách thành viên, roles, tin nhắn, vị trí unread đầu tiên
  6. Client render messages, scroll tới tin nhắn chưa đọc đầu tiên
  7. Đăng ký realtime cho conversation
  8. Gửi API reset unread_count
- **Error Handling:**
  - Group không tồn tại → "Nhóm không tồn tại"
  - User không là member → "Bạn không có quyền truy cập cuộc trò chuyện này"
- **Acceptance Criteria:**
  - [ ] Tự động scroll tới tin nhắn chưa đọc đầu tiên
  - [ ] Đăng ký nhận realtime updates
  - [ ] Reset badge sau khi mở

#### FR-132: Click Thread

- **Mô tả:** Mở màn hình chat + auto open thread
- **Acceptance Criteria:**
  - [ ] Mở hội thoại chứa thread
  - [ ] Tự động mở panel thread tương ứng

#### FR-133: Mark Read sau khi mở hội thoại

- **Mô tả:** Gửi API mark read sau khi open
- **API:**
  - Hội thoại: `conversation_id/read`
  - Chuỗi: `thread_id/read`
- **Server xử lý:**
  - Cập nhật `conversation_unread_count = 0`
  - Cập nhật `mention_unread_count = 0` (nếu có)
  - Cập nhật `thread_unread_count = 0` (nếu có)
  - Push realtime event
- **Client cập nhật sau mark read:**
  - Badge Tổng
  - Badge Lượt nhắc đến
  - Badge Chuỗi
  - Badge Nhóm, Cá nhân
  - Bỏ highlight hội thoại (nếu là thread → bỏ highlight cả hội thoại tin gốc và hội thoại chứa chuỗi)
- **Acceptance Criteria:**
  - [ ] Gọi API mark read ngay khi mở hội thoại
  - [ ] Cập nhật tất cả badge liên quan sau mark read
  - [ ] Đồng bộ realtime cho các thiết bị khác

#### FR-134: Realtime khi đang trong hội thoại

- **Mô tả:** Sau khi mở hội thoại, client nhận cập nhật realtime
- **Kết thúc realtime khi:**
  - Người dùng rời khỏi màn hình chat
  - Mất quyền truy cập (bị remove khỏi nhóm)
  - Mất mạng
  - Kill app
- **Acceptance Criteria:**
  - [ ] Tin nhắn mới hiển thị ngay lập tức
  - [ ] Chỉnh sửa/xóa tin nhắn cập nhật realtime
  - [ ] Thay đổi thành viên cập nhật realtime

---

### 3.13 Phiên đăng nhập

#### FR-140: Đăng nhập nhiều thiết bị

- **Mô tả:** 1 user có thể đăng nhập nhiều thiết bị cùng lúc
- **Acceptance Criteria:**
  - [ ] Mỗi thiết bị có `deviceId` riêng
  - [ ] Mỗi thiết bị có trạng thái presence riêng
  - [ ] Inbox đồng bộ giống nhau trên tất cả thiết bị
  - [ ] Read/unread sync theo user, **KHÔNG** theo device

#### FR-141: Quản lý phiên làm việc

- **Mô tả:** Mỗi lần login tạo 1 phiên làm việc
- **Acceptance Criteria:**
  - [ ] Access token hết hạn → Client tự động gọi refresh token
  - [ ] Refresh token thành công → Không gián đoạn trải nghiệm
  - [ ] Refresh token không hợp lệ → Logout → Điều hướng về Login

#### FR-142: Đăng ký thiết bị

- **Mô tả:** Sau login thành công, server ghi nhận/cập nhật thiết bị
- **Acceptance Criteria:**
  - [ ] Đánh dấu thiết bị ACTIVE
  - [ ] Phục vụ push notification
  - [ ] Phục vụ đồng bộ đa thiết bị

---

## 4. Yêu cầu phi chức năng

### 4.1 Performance

#### NFR-001: Thời gian load Home lần đầu

- **Mô tả:** Thời gian load Home lần đầu < 2-3 giây trong điều kiện mạng bình thường
- **Chiến lược:**
  - Load skeleton UI trước
  - Gọi API song song
  - Ưu tiên dữ liệu quan trọng nhất (inbox hội thoại)
- **Acceptance Criteria:**
  - [ ] First Contentful Paint < 1s
  - [ ] Full data render < 2-3s trên mạng 3G/4G bình thường
  - [ ] Skeleton hiển thị ngay khi vào trang

#### NFR-002: API timeout handling

- **Mô tả:** Xử lý khi API bị timeout
- **Acceptance Criteria:**
  - [ ] API inbox timeout → "Không thể tải dữ liệu" + nút retry
  - [ ] Mạng yếu → Hiển thị dữ liệu cache cục bộ (nếu có)
  - [ ] Không block toàn màn hình cho lỗi đơn lẻ

### 4.2 Lazy Loading & Pagination

#### NFR-010: Giới hạn số box chat hiển thị

- **Mô tả:** Mặc định hiển thị 20 box hội thoại đầu tiên
- **Logic sắp xếp khi load thêm:**
  - `lastActivityTime` giảm dần
  - Có unread > không unread
- **Acceptance Criteria:**
  - [ ] Ban đầu load 20 items
  - [ ] Scroll gần cuối → Trigger load thêm trang tiếp
  - [ ] Load thêm thất bại → Giữ nguyên danh sách hiện tại + toast "Không thể tải thêm hội thoại"

#### NFR-011: Pagination cho tất cả tab

- **Mô tả:** Áp dụng lazy loading cho tất cả tab (Tất cả, Lượt đề cập, Chuỗi tin, Nhóm, Cá nhân)
- **Acceptance Criteria:**
  - [ ] Scroll xuống gần cuối → Load thêm page
  - [ ] Hiển thị loading indicator khi đang load thêm
  - [ ] Không duplicate items khi load thêm

### 4.3 Caching & Offline

#### NFR-020: Dữ liệu lần đầu đăng nhập

- **Mô tả:** Lần đầu login lấy toàn bộ từ server
- **Acceptance Criteria:**
  - [ ] Lấy danh sách channel user tham gia
  - [ ] Lấy last message mỗi channel
  - [ ] Lấy trạng thái unread/mention
  - [ ] Không phụ thuộc dữ liệu local cũ

#### NFR-021: Dữ liệu lần sau đăng nhập

- **Mô tả:** Load cache local trước, đồng thời gọi API sync
- **Acceptance Criteria:**
  - [ ] Client load dữ liệu cache local (nếu có) → Hiển thị ngay
  - [ ] Song song gọi API inbox để sync dữ liệu mới
  - [ ] Sau khi API trả về → Cập nhật UI với dữ liệu mới

#### NFR-022: Lưu cache local

- **Mô tả:** Lưu dữ liệu để tối ưu trải nghiệm
- **Dữ liệu lưu:**
  - Danh sách inbox
  - Last sync time
- **Mục đích:**
  - Fast open lần sau
  - Offline mode
- **Acceptance Criteria:**
  - [ ] Cache chỉ dùng để hiển thị tạm, không phải dữ liệu chính xác
  - [ ] Luôn ưu tiên dữ liệu server khi có kết nối

### 4.4 Realtime & Đồng bộ

#### NFR-030: Cập nhật realtime

- **Mô tả:** Home cần cập nhật realtime khi:
  - Có tin nhắn mới
  - Có mention mới
- **Acceptance Criteria:**
  - [ ] Tin nhắn mới → Hội thoại nhảy lên đầu danh sách
  - [ ] Mention mới → Badge mention tăng
  - [ ] Thread reply mới → Badge thread cập nhật
  - [ ] Đồng bộ trên tất cả thiết bị đăng nhập

#### NFR-031: Đồng bộ đa thiết bị

- **Mô tả:** Inbox đồng bộ giống nhau trên tất cả thiết bị
- **Acceptance Criteria:**
  - [ ] Read/unread sync theo user, không theo device
  - [ ] Mark read trên 1 thiết bị → Các thiết bị khác cập nhật badge
  - [ ] Tin nhắn mới đến tất cả thiết bị đồng thời

---

## 5. API Specifications

### 5.1 Danh sách API

| # | API | Method | Mục đích |
|---|-----|--------|---------|
| 1 | `/api/v1/me` | GET | Lấy thông tin user đang đăng nhập |
| 2 | `/api/v1/chat/inbox` | GET | Lấy danh sách hội thoại kèm last message |
| 3 | `/api/v1/users/unread` | GET | Lấy số lượng badge tại các tab |
| 4 | `/api/v1/me/mentions` | GET | Lấy danh sách mention |
| 5 | `/api/v1/messages/threads/preview` | GET | Lấy danh sách thread preview |
| 6 | `/api/v1/channels` | GET | Lấy danh sách group/DM (có filter type, sort) |
| 7 | `/api/v1/channels/{channelId}` | GET | Lấy thông tin chi tiết 1 channel |
| 8 | `/searchService/api/v1/search` | POST | Tìm kiếm (type: CHAT, USER, CHANNEL, MESSAGE) |

### 5.2 API Response — `/api/v1/me`

```
Response:
  - userID: string
  - avatar: string (URL)
  - name: string
  - email: string
```

### 5.3 API Response — `/api/v1/chat/inbox`

```
Response: Array<InboxItem>
  - channelId: string
  - channelName: string
  - groupAvatar: string
  - groupType: 'DM' | 'GROUP'
  - isThread: boolean
  - lastActivityTime: timestamp
  - hasUnread: boolean
  - hasMentions: boolean
  - lastMessage:
    - content: string
    - timestamp: timestamp
    - type: 'TEXT' | 'STICKER' | 'IMAGE' | 'VIDEO' | 'FILE'
  - threadPreview (nếu isThread=true):
    - topic: string
    - lastMessage:
      - content: string
      - timestamp: timestamp
```

### 5.4 API Response — `/api/v1/users/unread`

```
Response:
  - totalUnread: number
  - mentionUnread: number
  - threadUnread: number
  - groupUnread: number
  - dmUnread: number
```

### 5.5 API Request/Response — `/searchService/api/v1/search`

```
Request (POST):
  - type: 'CHAT' | 'USER' | 'CHANNEL' | 'MESSAGE'
  - keyword: string

Response:
  - results: Array<SearchResult>
  - hasMore: boolean
  - total: number
```

---

## 6. UI/UX Requirements

### 6.1 Thanh tiêu đề (Header)

- Cố định khi scroll
- Thành phần:
  1. Logo (ReadOnly)
  2. Nút tìm kiếm (icon kính lúp) → Mở tìm kiếm
  3. Nút thêm mới (icon "+") → Tạo nhóm chat mới
  4. Avatar người dùng đang đăng nhập → Mở quản lý tài khoản
  5. Icon trạng thái online/offline của người dùng

### 6.2 Thanh bộ lọc hội thoại (Tab Bar)

- Cố định khi scroll
- Chỉ 1 tab được active tại 1 thời điểm
- 5 tab: Tất cả | Lượt nhắc | Chuỗi tin | Nhóm | Cá nhân
- Mỗi tab có badge hiển thị số chưa đọc (ẩn khi 0, hiển thị 99+ khi > 99)

### 6.3 Thanh điều hướng dưới (Bottom Navigation)

- 4 menu: Trang chủ | Công việc | Thông báo | Trợ lý AI
- Menu Thông báo có badge số thông báo chưa đọc

---

*Tài liệu này được tạo từ tài liệu nghiệp vụ Trang chủ v1.2 và Checklist v1.0*
