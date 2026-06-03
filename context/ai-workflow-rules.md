# AI Workflow Rules — Coralume

## Approach

**Spec-driven, incremental.** Mỗi unit có spec file riêng trong `context/specs/`. Agent đọc spec → implement → verify → update progress tracker. Không làm nhiều hơn spec yêu cầu.

---

## Scoping Rules

1. **MỘT unit tại một thời điểm.** Không gộp nhiều units vào một prompt.
2. **KHÔNG speculative changes.** Không cài đặt dependencies, tạo files, hoặc viết code "sẽ dùng sau". Chỉ cài/thứ gì spec yêu cầu.
3. **KHÔNG refactor code không liên quan.** Nếu thấy code cần refactor ở nơi khác, ghi chú ở progress tracker, không tự ý sửa.
4. **Giữ scope trong system boundary.** Unit về UI không đụng database. Unit về API không đụng styling. Trừ khi spec yêu cầu rõ ràng.
5. **Dependencies just in time.** Chỉ install package khi unit hiện tại cần nó cho behavior thật. Không install toàn bộ dependencies từ đầu.

---

## When to Split Work

Split thành sub-units khi:
- Unit yêu cầu cả UI + API + database schema (tách: 1) schema/models → 2) API → 3) UI)
- Unit có > 3 components chính cần xây dựng
- Unit cần tích hợp external service (payment, email, storage)
- Estimated work > 1 focused session

**Merge khi:**
- Hai adjacent units luôn làm chung trong một session
- Unit quá nhỏ không có standalone visible result (vd: chỉ thêm 1 CSS class)

---

## Handling Missing / Ambiguous Requirements

1. **KHÔNG đoán.** Nếu spec không rõ, dừng và hỏi user.
2. **Check context files trước.** Nếu requirement có thể resolve từ `project-overview.md`, `architecture.md`, hoặc `ui-context.md`, làm theo đó.
3. **Nếu không có trong context files:**
   - Ghi rõ assumption ở prompt cho user review
   - Hoặc hỏi user trực tiếp: "Spec không đề cập đến X. Bạn muốn xử lý thế nào?"
4. **Không tự thêm features** không có trong spec hoặc project-overview.

---

## Protected Files

Các file **KHÔNG được sửa** trừ khi có instruction rõ ràng:

| File/Path | Reason |
|-----------|--------|
| `context/*.md` (trừ progress-tracker.md) | Context files — chỉ update khi architecture/scope/standards thay đổi |
| `prisma/schema.prisma` | Database schema — chỉ update khi spec yêu cầu migration mới |
| `tailwind.config.ts` | Design tokens — chỉ update khi thêm token mới từ Design Spec |
| Generated files (Prisma client, `.next/`) | Auto-generated — không sửa |
| `node_modules/` | Dependencies — không sửa |

---

## Documentation Sync

1. **Sau mỗi unit hoàn thành,** cập nhật `context/progress-tracker.md`:
   - Mark unit complete trong "Completed"
   - Update "Current Phase"
   - Thêm session notes nếu cần cho context session sau
2. **Nếu implementation thay đổi kiến trúc,** cập nhật `context/architecture.md` trước khi tiếp tục.
3. **Nếu thêm CSS variable hoặc design token mới,** cập nhật `context/ui-context.md`.
4. **Nếu thay đổi convention trong quá trình build,** cập nhật `context/code-standards.md`.

---

## Verification Checklist (Trước khi Move On)

Mỗi unit PHẢI pass các check sau trước khi mark complete:

### Bắt buộc cho mọi unit
- [ ] Không TypeScript errors (`tsc --noEmit`)
- [ ] Không console errors trong browser
- [ ] `npm run build` passes
- [ ] Responsive hoạt động ở mobile (320px+) và desktop (1024px+)
- [ ] Spec requirements đều được fulfill (check từng item trong verification checklist của spec)

### UI units
- [ ] Dùng design tokens từ ui-context.md (không hardcode values)
- [ ] Animation theo spec (duration, easing, trigger)
- [ ] Accessibility: alt text, labels, keyboard navigation, focus states
- [ ] Loading states (skeleton/placeholder)
- [ ] Empty states

### API units
- [ ] Auth guard cho routes yêu cầu xác thực
- [ ] Input validation với Zod
- [ ] Error handling (try-catch, proper status codes)
- [ ] Consistent response format
- [ ] Rate limiting cho sensitive endpoints

### Auth units
- [ ] Email verification flow hoạt động
- [ ] JWT trong httpOnly cookie
- [ ] Role-based access check ở cả middleware và API
- [ ] Password hashing (bcrypt/argon2)

### Payment units
- [ ] SSL trên toàn trang
- [ ] Redirect qua cổng thanh toán (không lưu card info)
- [ ] Callback/webhook xử lý đúng
- [ ] Email xác nhận sau thanh toán thành công

---

## Build Order

Thứ tự units phải tuân theo rules sau:

1. **Foundation trước:** Setup project, database schema, auth infrastructure
2. **Security trước functionality:** Auth pages, middleware, role checks trước khi xây features
3. **Backend trước frontend wiring:** API routes trước, sau đó connect UI
4. **UI shell trước real data:** Components với placeholder data trước, sau đó connect API
5. **Public pages trước protected pages:** Home, About, Products trước Dashboard, Admin
6. **Core flow trước nice-to-have:** Register → Pay → Dashboard trước Blog, Community, Leaderboard

---

## Prompt Pattern

### Implement
```
Read context/specs/NN-feature-name.md.
Update context/progress-tracker.md to mark this as in progress.
Implement it exactly as specified.
Do not go beyond the scope of this unit.
```

### Correct
```
The [specific element] does not match the spec.
Expected: [what the spec says].
Current: [what was built].
Fix only this. Do not change anything else.
```

### Close
```
Implementation is complete and verified.
Mark unit NN complete in context/progress-tracker.md.
```