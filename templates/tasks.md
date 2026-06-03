# Task Registry — Con Sóc (Trang chủ)

## Status Legend
- `planned` — Chưa bắt đầu
- `in-progress` — Đang làm
- `review` — Đang review
- `testing` — Đang test
- `done` — Hoàn thành

---

### TASK-001: Quản lý phiên đăng nhập & Auth Guard
- **Status**: done
- **SRS**: 3.13 Phiên đăng nhập
- **Figma**: none
- **Branch**: feature/TASK-001-auth-session
- **Dependencies**: none
- **Priority**: P0
- **Description**: Xây dựng hệ thống xác thực và quản lý phiên đăng nhập. Bao gồm auth guard cho route Home, tự động refresh token khi hết hạn, xử lý logout khi refresh token không hợp lệ, và hỗ trợ đăng nhập đa thiết bị.
- **Requirements**: FR-140, FR-141, FR-142
- **Acceptance Criteria**:
  - [ ] Auth guard kiểm tra access token trước khi vào Home
  - [ ] Chưa đăng nhập → Redirect về Login
  - [ ] Token hết hạn → Tự động refresh, không gián đoạn UX
  - [ ] Refresh token không hợp lệ → Logout + redirect Login
  - [ ] Hỗ trợ đăng nhập nhiều thiết bị (mỗi thiết bị có deviceId)
  - [ ] Read/unread sync theo user, không theo device
  - [ ] Sau login → Server đánh dấu thiết bị ACTIVE

---

### TASK-002: Khởi tạo màn hình Home & Layout
- **Status**: done
- **SRS**: 3.1 Khởi tạo màn hình Home
- **Figma**: Sử dụng hình ảnh mockup sau : /Users/hiephoang/Desktop/vibe_coding/web_con_soc/doc/figma_home.jpg 
- **Branch**: feature/TASK-002-home-init-layout
- **Dependencies**: TASK-001
- **Priority**: P0
- **Description**: Xây dựng layout chính của trang Home gồm header cố định (logo, search icon, nút tạo nhóm, avatar user, trạng thái online), tab bar cố định (5 tab), vùng danh sách hội thoại, và bottom navigation. Implement logic gọi 3 API đồng thời, skeleton loading, và error handling.
- **Requirements**: FR-001, FR-002, FR-003, FR-004, FR-005
- **Acceptance Criteria**:
  - [ ] Layout Home gồm: Header cố định, Tab Bar cố định, Content area, Bottom Navigation
  - [ ] Header: Logo, nút tìm kiếm, nút "+", avatar user, icon trạng thái
  - [ ] Tab Bar: 5 tab (Tất cả, Lượt nhắc, Chuỗi tin, Nhóm, Cá nhân)
  - [ ] Bottom Navigation: 4 menu (Trang chủ, Công việc, Thông báo, Trợ lý AI)
  - [ ] Gọi đồng thời 3 API: `/api/v1/me`, `/api/v1/chat/inbox`, `/api/v1/users/unread`
  - [ ] API nào trả về → Render ngay, không chờ tất cả
  - [ ] Hiển thị skeleton UI cho từng section độc lập
  - [ ] API inbox lỗi → Empty state "Không thể tải danh sách hội thoại" + retry
  - [ ] API user info lỗi → Hiển thị thông tin mặc định
  - [ ] API badge lỗi → Ẩn badge, không block UI
  - [ ] Cả 3 API fail → Màn hình lỗi + nút retry
  - [ ] Tab Tất cả là tab mặc định

---

### TASK-003: Component Avatar
- **Status**: in-progress
- **SRS**: 3.3 Avatar & Title
- **Figma**: none
- **Branch**: feature/TASK-003-avatar-component
- **Dependencies**: TASK-002
- **Priority**: P0
- **Description**: Xây dựng component Avatar tái sử dụng cho cả DM, Group, và Thread. Bao gồm logic tạo text avatar mặc định (chữ cái đầu + cuối), hệ thống màu sắc nhất quán theo userId, và hiển thị title/tên hội thoại.
- **Requirements**: FR-020, FR-021, FR-022, FR-023
- **Acceptance Criteria**:
  - [ ] Avatar DM: Hiển thị ảnh user hoặc text mặc định
  - [ ] Text mặc định: Chữ cái đầu từ thứ nhất + chữ cái đầu từ cuối, in hoa (VD: "Nguyễn Văn A" → "NA")
  - [ ] Tên 1 từ → Lấy 1 chữ cái đầu (VD: "Admin" → "A")
  - [ ] Màu avatar: Cùng user = cùng màu, phân bổ đồng đều, không đổi theo thời gian
  - [ ] Avatar Group: Ảnh tùy chỉnh hoặc icon mặc định với màu ngẫu nhiên
  - [ ] Avatar Thread: Dùng avatar của group/DM chứa thread
  - [ ] Title: Luôn hiển thị channelName (tên group hoặc tên user)

---

### TASK-004: Component Preview & Định dạng thời gian
- **Status**: planned
- **SRS**: 3.4 Preview nội dung
- **Figma**: none
- **Branch**: feature/TASK-004-preview-time-format
- **Dependencies**: TASK-002
- **Priority**: P0
- **Description**: Xây dựng component hiển thị preview nội dung tin nhắn và utility định dạng thời gian. Preview hỗ trợ nhiều loại nội dung (text, sticker, ảnh, video, file). Thời gian hiển thị theo rule: hh:mm / Hôm qua / Tên thứ / dd/mm / dd/mm/yyyy.
- **Requirements**: FR-030, FR-031, FR-032, FR-033
- **Acceptance Criteria**:
  - [ ] Preview DM/Group: 1 dòng duy nhất từ lastMessage.content
  - [ ] Preview Thread: 2 dòng (topic + reply mới nhất)
  - [ ] Text: Cắt tối đa 50 ký tự + "…."
  - [ ] Sticker → "Sticker"
  - [ ] Hình ảnh → "N hình ảnh"
  - [ ] Video → "N video"
  - [ ] File → "N tệp đính kèm"
  - [ ] Text + media → Hiển thị text
  - [ ] Reaction → Không đổi preview
  - [ ] Edit last message → Update preview
  - [ ] Delete last message → "Tin nhắn đã bị xóa"
  - [ ] Tin nhắn hệ thống (join/leave/rename) → Không hiển thị preview
  - [ ] Thời gian trong ngày T → hh:mm
  - [ ] Ngày T-1 → "Hôm qua"
  - [ ] T-2 đến T-6 → Tên thứ (Thứ Hai...Chủ nhật)
  - [ ] T-7+ trong năm → dd/mm
  - [ ] T-7+ khác năm → dd/mm/yyyy

---

### TASK-005: Hệ thống Badge & Trạng thái chưa đọc
- **Status**: planned
- **SRS**: 3.5 Badge & Trạng thái chưa đọc
- **Figma**: none
- **Branch**: feature/TASK-005-badge-system
- **Dependencies**: TASK-002
- **Priority**: P0
- **Description**: Xây dựng hệ thống badge hiển thị số lượng chưa đọc cho từng tab. Bao gồm component Badge, Zustand store quản lý state unread, và logic tăng/giảm/reset badge cho: tổng unread, mention, thread, nhóm, cá nhân.
- **Requirements**: FR-040, FR-041, FR-042, FR-043, FR-044, FR-045
- **Acceptance Criteria**:
  - [ ] Badge component: Ẩn khi count=0, hiển thị số khi 1-99, hiển thị "99+" khi >99
  - [ ] Badge Tab Tất cả: Tổng tin nhắn chưa đọc
  - [ ] Badge Tab Lượt nhắc: Số mention chưa đọc (chỉ mention trực tiếp)
  - [ ] Badge Tab Chuỗi: Số thread có unread (boolean per thread, không cộng dồn)
  - [ ] Badge Tab Nhóm: Số nhóm có tin chưa đọc
  - [ ] Badge Tab Cá nhân: Số DM có tin chưa đọc
  - [ ] Badge KHÔNG reset khi chỉ mở tab (Lượt nhắc, Chuỗi)
  - [ ] Badge chỉ reset khi mở đúng hội thoại → API mark read
  - [ ] Sau mark read → Server push realtime → Cập nhật tất cả badge liên quan
  - [ ] Badge source of truth là server, client chỉ cache

---

### TASK-006: Danh sách hội thoại & Conversation Item
- **Status**: planned
- **SRS**: 3.2 Danh sách hội thoại & Box hội thoại
- **Figma**: none
- **Branch**: feature/TASK-006-conversation-list
- **Dependencies**: TASK-003, TASK-004, TASK-005
- **Priority**: P0
- **Description**: Xây dựng component danh sách hội thoại và từng item hội thoại. Mỗi item gồm: Avatar, Title, Preview, Thời gian, Icon chưa đọc, Icon chuỗi. Xử lý logic hiển thị/ẩn hội thoại theo điều kiện (thread, group, DM, bị kick).
- **Requirements**: FR-010, FR-011, FR-012, FR-013, FR-014, FR-015, FR-016
- **Acceptance Criteria**:
  - [ ] Mỗi item = 1 card clickable gồm: Avatar, Title, Preview, Time, Unread icon
  - [ ] isThread=true → Hiển thị box riêng với icon chuỗi
  - [ ] Thread chỉ hiển thị nếu user có liên quan (reply/mention/follow)
  - [ ] Group chỉ hiển thị khi: user là member + có >=1 tin nhắn
  - [ ] DM hiển thị khi có >=1 tin nhắn, 1 cặp user = 1 DM duy nhất
  - [ ] User bị kick/rời nhóm/nhóm giải tán → Hội thoại tự ẩn
  - [ ] Tin nhắn mới → Hội thoại nhảy lên đầu danh sách
  - [ ] Đang mở hội thoại → Không tăng badge, không cập nhật preview
  - [ ] hasUnread=true → In đậm tên + icon chưa đọc

---

### TASK-007: Tab Tất cả
- **Status**: planned
- **SRS**: 3.6 Tab Tất cả
- **Figma**: none
- **Branch**: feature/TASK-007-tab-all
- **Dependencies**: TASK-006
- **Priority**: P0
- **Description**: Implement tab Tất cả — tab mặc định hiển thị toàn bộ inbox items (DM, Group, Thread) sắp xếp theo lastActivityTime giảm dần.
- **Requirements**: FR-060, FR-061
- **Acceptance Criteria**:
  - [ ] Tab Tất cả active mặc định khi vào Home
  - [ ] Hiển thị tất cả loại hội thoại (DM + Group + Thread) không phân loại
  - [ ] Sắp xếp theo lastActivityTime giảm dần
  - [ ] Mỗi item hiển thị đầy đủ: Avatar, Tên, Preview, Thời gian, Icon unread, Icon chuỗi
  - [ ] Click item → Mở chi tiết hội thoại

---

### TASK-008: Tab Lượt đề cập
- **Status**: planned
- **SRS**: 3.7 Tab Lượt đề cập
- **Figma**: none
- **Branch**: feature/TASK-008-tab-mentions
- **Dependencies**: TASK-006
- **Priority**: P1
- **Description**: Implement tab Lượt đề cập — hiển thị danh sách tin nhắn mention trực tiếp đến user (không bao gồm mention all). Gọi API /api/v1/me/mentions, sắp xếp theo created_at.
- **Requirements**: FR-070, FR-071, FR-072
- **Acceptance Criteria**:
  - [ ] Gọi API GET /api/v1/me/mentions khi chọn tab
  - [ ] Chỉ hiển thị mention trực tiếp, KHÔNG hiển thị mention @all
  - [ ] Sắp xếp theo created_at mới nhất lên đầu
  - [ ] Preview: Hiển thị tin nhắn mention (không phải last message)
  - [ ] Mention trong thread: Chỉ hiển thị tin nhắn mention, KHÔNG topic
  - [ ] Hiển thị tối đa 1 dòng preview
  - [ ] isRead=false → In đậm item
  - [ ] Badge KHÔNG reset khi mở tab
  - [ ] Hiển thị skeleton/cache khi đang tải
  - [ ] Click item → Mở hội thoại, scroll/focus tới messageId

---

### TASK-009: Tab Chuỗi tin
- **Status**: planned
- **SRS**: 3.8 Tab Chuỗi tin
- **Figma**: none
- **Branch**: feature/TASK-009-tab-threads
- **Dependencies**: TASK-006
- **Priority**: P1
- **Description**: Implement tab Chuỗi tin — hiển thị danh sách thread mà user tham gia hoặc được mention. Gọi API /api/v1/messages/threads/preview, sắp xếp theo last_reply_at.
- **Requirements**: FR-080, FR-081
- **Acceptance Criteria**:
  - [ ] Gọi API GET /api/v1/messages/threads/preview khi chọn tab
  - [ ] Hiển thị thread nếu: user đã reply HOẶC được mention trực tiếp
  - [ ] Sắp xếp theo last_reply_at mới nhất lên đầu
  - [ ] Preview: Topic (tin nhắn gốc) + Reply mới nhất
  - [ ] Thời gian: last_reply_at (theo rule FR-033)
  - [ ] In đậm + icon chưa đọc cho thread chưa đọc
  - [ ] Badge KHÔNG reset khi mở tab
  - [ ] Hiển thị skeleton/cache khi đang tải

---

### TASK-010: Tab Nhóm chat
- **Status**: planned
- **SRS**: 3.9 Tab Nhóm chat
- **Figma**: none
- **Branch**: feature/TASK-010-tab-groups
- **Dependencies**: TASK-006
- **Priority**: P1
- **Description**: Implement tab Nhóm — hiển thị danh sách nhóm user tham gia. Mỗi item chỉ gồm avatar + tên nhóm (không preview tin nhắn). Gọi API /api/v1/channels?type=group, cache-first strategy.
- **Requirements**: FR-090, FR-091, FR-092
- **Acceptance Criteria**:
  - [ ] Gọi API GET /api/v1/channels?type=group&sort=lastActivityAt,desc
  - [ ] Kiểm tra local cache trước → Hiển thị dữ liệu cũ → Đồng thời gọi API sync
  - [ ] Không có cache → Hiển thị skeleton
  - [ ] Sắp xếp theo lastActivityAt mới nhất lên đầu
  - [ ] Mỗi item: Avatar nhóm + Tên nhóm (không preview)
  - [ ] In đậm nhóm có hasUnread=true
  - [ ] Click → Mở màn hình chat group
  - [ ] lastActivityAt chỉ cập nhật khi: gửi tin mới, reply thread, tạo nhóm

---

### TASK-011: Tab Cá nhân
- **Status**: planned
- **SRS**: 3.10 Tab Cá nhân
- **Figma**: none
- **Branch**: feature/TASK-011-tab-personal
- **Dependencies**: TASK-006
- **Priority**: P1
- **Description**: Implement tab Cá nhân — hiển thị danh sách user đã chat 1-1. Mỗi item gồm avatar, tên, trạng thái online/offline. Hỗ trợ tạo DM mới khi chọn user chưa có hội thoại.
- **Requirements**: FR-100, FR-101, FR-102, FR-103
- **Acceptance Criteria**:
  - [ ] Gọi API GET /api/v1/channels?type=DM&sort=lastActivityAt,desc
  - [ ] Kiểm tra local cache trước → Hiển thị dữ liệu cũ → Đồng thời gọi API sync
  - [ ] Chỉ hiển thị DM có >=1 message (không tính đã xóa)
  - [ ] Sắp xếp theo lastActivityAt mới nhất lên đầu
  - [ ] Mỗi item: Avatar + Tên cá nhân + Icon online/offline
  - [ ] In đậm user có hasUnread=true
  - [ ] Click user đã có DM → Mở DM cũ (20-30 tin mới nhất)
  - [ ] Click user chưa có DM → Server tạo DM mới → Mở chat rỗng
  - [ ] 1 cặp user = 1 DM duy nhất (không tạo trùng)

---

### TASK-012: Tìm kiếm — Khởi tạo & Autocomplete
- **Status**: planned
- **SRS**: 3.11 Tìm kiếm
- **Figma**: none
- **Branch**: feature/TASK-012-search-init-autocomplete
- **Dependencies**: TASK-006
- **Priority**: P1
- **Description**: Xây dựng màn hình tìm kiếm khởi tạo (MH6.1) và chức năng autocomplete realtime (MH6.2). Bao gồm: màn hình gần đây + danh bạ, ô tìm kiếm với debounce 300ms, gọi song song API search USER + CHANNEL, tab Trò chuyện kết quả.
- **Requirements**: FR-110, FR-111, FR-112, FR-113, FR-117
- **Acceptance Criteria**:
  - [ ] Click icon kính lúp → Mở màn hình tìm kiếm
  - [ ] Auto focus vào ô nhập, hiển thị bàn phím
  - [ ] Placeholder: "Tìm kiếm tin nhắn, người dùng, nhóm chat"
  - [ ] Độ dài tối đa: 225 ký tự
  - [ ] Icon "x" xóa toàn bộ text, icon Back quay lại Home
  - [ ] Chưa nhập → Hiển thị "Gần đây" (tối đa 5) + Danh bạ (alphabet)
  - [ ] Nhập >= 2 ký tự → Debounce 300ms → Gọi song song API (USER + CHANNEL)
  - [ ] Tìm kiếm user: theo tên, SĐT, email (active, có quyền chat)
  - [ ] Tìm kiếm group: theo tên group (đã tham gia)
  - [ ] KHÔNG tìm nội dung tin nhắn ở bước autocomplete
  - [ ] Sắp xếp: Server results (lastActivityAt) → Danh bạ → Chưa tương tác (alphabet)
  - [ ] Tối đa 5 kết quả mỗi loại
  - [ ] Tab "Trò chuyện": Avatar + Fullname (không username)
  - [ ] hasMore=true → Hiển thị textlink "Xem thêm"
  - [ ] Không có kết quả → "Không tìm thấy kết quả phù hợp"
  - [ ] API lỗi → Màn hình trống, không blocking

---

### TASK-013: Tìm kiếm — Nội dung tin nhắn
- **Status**: planned
- **SRS**: 3.11 Tìm kiếm
- **Figma**: none
- **Branch**: feature/TASK-013-search-messages
- **Dependencies**: TASK-012
- **Priority**: P2
- **Description**: Implement tìm kiếm nội dung tin nhắn (MH6.3). Khi user nhấn Enter, gọi API search type=MESSAGE. Hiển thị kết quả trong tab "Tin nhắn" với preview có highlight keyword và ellipsis.
- **Requirements**: FR-114, FR-115, FR-116
- **Acceptance Criteria**:
  - [ ] Nhấn Enter → Gọi API POST /searchService/api/v1/search (type=MESSAGE)
  - [ ] Phạm vi: group member + DM, loại trừ rỗng
  - [ ] Match: Không phân biệt hoa/thường, không phân biệt dấu tiếng Việt
  - [ ] Chỉ tìm message chưa bị xóa
  - [ ] Tab "Tin nhắn": Avatar + Tên hội thoại + Preview + Thời gian
  - [ ] Preview: contextBefore (80 ký tự) + keyword + contextAfter (80 ký tự)
  - [ ] Thêm "..." đầu nếu không bắt đầu từ đầu tin nhắn
  - [ ] Thêm "..." cuối nếu không kết thúc tại cuối tin nhắn
  - [ ] Highlight keyword trong preview
  - [ ] Hiển thị tối đa 2 dòng
  - [ ] Sắp xếp theo thời gian message mới nhất
  - [ ] Click kết quả → Mở hội thoại tại đúng message, scroll đúng vị trí
  - [ ] Click thread → Mở đúng thread
  - [ ] Reset unread nếu có

---

### TASK-014: Hành vi Click hội thoại & Mark Read
- **Status**: planned
- **SRS**: 3.12 Hành vi Click hội thoại
- **Figma**: none
- **Branch**: feature/TASK-014-click-behavior
- **Dependencies**: TASK-007
- **Priority**: P1
- **Description**: Implement hành vi khi click vào hội thoại từ danh sách Home. Bao gồm: điều hướng đến chat DM/Group/Thread, mark read API, cập nhật badge sau khi đọc, đăng ký realtime cho conversation đang mở.
- **Requirements**: FR-130, FR-131, FR-132, FR-133, FR-134
- **Acceptance Criteria**:
  - [ ] Click DM → Mở màn hình chat cá nhân
  - [ ] Click Group → Mở chat group (header + skeleton → cache → fetch)
  - [ ] Click Group: Server kiểm tra tồn tại + membership
  - [ ] Group không tồn tại → "Nhóm không tồn tại"
  - [ ] User không là member → "Bạn không có quyền truy cập cuộc trò chuyện này"
  - [ ] Click Thread → Mở hội thoại + auto open thread panel
  - [ ] Tự động scroll tới tin nhắn chưa đọc đầu tiên
  - [ ] Gọi API mark read ngay khi mở (conversation_id/read hoặc thread_id/read)
  - [ ] Server reset: conversation_unread_count=0, mention_unread_count=0, thread_unread_count=0
  - [ ] Server push realtime event sau mark read
  - [ ] Client cập nhật tất cả badge (Tổng, Lượt nhắc, Chuỗi, Nhóm, Cá nhân)
  - [ ] Bỏ highlight hội thoại (thread → bỏ cả tin gốc + chuỗi)
  - [ ] Đăng ký realtime cho conversation đang mở
  - [ ] Realtime kết thúc khi: rời màn hình, mất quyền, mất mạng, kill app

---

### TASK-015: Lazy Loading & Infinite Scroll
- **Status**: planned
- **SRS**: 4.2 Lazy Loading & Pagination
- **Figma**: none
- **Branch**: feature/TASK-015-lazy-loading
- **Dependencies**: TASK-002
- **Priority**: P1
- **Description**: Implement lazy loading với infinite scroll cho tất cả danh sách (inbox, mentions, threads, groups, DMs). Mặc định 20 items, scroll gần cuối trigger load thêm.
- **Requirements**: NFR-010, NFR-011
- **Acceptance Criteria**:
  - [ ] Mặc định load 20 box hội thoại đầu tiên
  - [ ] Scroll gần cuối → Trigger load thêm page tiếp theo
  - [ ] Sắp xếp: lastActivityTime giảm dần, unread ưu tiên
  - [ ] Load thêm thất bại → Giữ nguyên danh sách + toast "Không thể tải thêm hội thoại"
  - [ ] Áp dụng cho tất cả 5 tab
  - [ ] Hiển thị loading indicator khi đang load thêm
  - [ ] Không duplicate items khi load thêm

---

### TASK-016: Caching & Offline Mode
- **Status**: planned
- **SRS**: 4.3 Caching & Offline
- **Figma**: none
- **Branch**: feature/TASK-016-caching-offline
- **Dependencies**: TASK-002
- **Priority**: P2
- **Description**: Implement chiến lược caching local cho inbox data. Lần đầu login lấy toàn bộ từ server. Lần sau load cache trước, đồng thời gọi API sync. Lưu danh sách inbox + last sync time.
- **Requirements**: NFR-020, NFR-021, NFR-022
- **Acceptance Criteria**:
  - [ ] Lần đầu đăng nhập: Lấy toàn bộ từ server, không phụ thuộc local
  - [ ] Lần sau: Load cache local → Hiển thị ngay → Song song gọi API sync
  - [ ] Sau khi API trả về → Cập nhật UI với dữ liệu mới
  - [ ] Cache lưu: Danh sách inbox + Last sync time
  - [ ] Cache chỉ dùng hiển thị tạm, không phải source of truth
  - [ ] Luôn ưu tiên dữ liệu server khi có kết nối
  - [ ] Mất mạng → Hiển thị dữ liệu cache + thông báo offline

---

### TASK-017: Realtime & WebSocket
- **Status**: planned
- **SRS**: 4.4 Realtime & Đồng bộ
- **Figma**: none
- **Branch**: feature/TASK-017-realtime-websocket
- **Dependencies**: TASK-002
- **Priority**: P1
- **Description**: Implement kết nối WebSocket cho realtime updates trên Home. Cập nhật khi có tin nhắn mới, mention mới, reply thread, mark read từ thiết bị khác.
- **Requirements**: NFR-030, NFR-031
- **Acceptance Criteria**:
  - [ ] Tin nhắn mới → Hội thoại nhảy lên đầu danh sách
  - [ ] Mention mới → Badge mention tăng realtime
  - [ ] Thread reply mới → Badge thread cập nhật
  - [ ] Mark read trên 1 thiết bị → Các thiết bị khác cập nhật badge
  - [ ] Tin nhắn mới đến tất cả thiết bị đồng thời
  - [ ] Read/unread đồng bộ theo user, không theo device
  - [ ] Bị kick khỏi group → Realtime ẩn hội thoại

---

### TASK-018: Performance Optimization
- **Status**: planned
- **SRS**: 4.1 Performance
- **Figma**: none
- **Branch**: feature/TASK-018-performance
- **Dependencies**: TASK-002
- **Priority**: P2
- **Description**: Tối ưu hiệu năng trang Home. Đảm bảo load lần đầu < 2-3s, skeleton hiển thị ngay, API gọi song song, và xử lý graceful khi timeout/mạng yếu.
- **Requirements**: NFR-001, NFR-002
- **Acceptance Criteria**:
  - [ ] First Contentful Paint < 1s
  - [ ] Full data render < 2-3s trên mạng bình thường
  - [ ] Skeleton hiển thị ngay khi vào trang
  - [ ] API gọi song song (không sequential)
  - [ ] Ưu tiên render inbox trước các section khác
  - [ ] API timeout → "Không thể tải dữ liệu" + nút retry
  - [ ] Mạng yếu → Fallback cache local
  - [ ] Không block toàn màn hình cho lỗi đơn lẻ

---

*Tổng: 18 tasks | Tất cả status: planned*
*Được bóc tách từ doc/SRS.md — Con Sóc Trang chủ v1.0*
