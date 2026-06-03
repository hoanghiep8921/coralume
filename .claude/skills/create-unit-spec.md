---
name: create-unit-spec
description: Tạo spec file cho một unit development mới của Coralume — theo spec-driven workflow từ ai-workflow-rules.md
---

## Create Unit Spec

Khi được yêu cầu tạo spec file cho một unit mới, tuân theo các quy tắc sau:

### 1. File Location

```
context/specs/NN-feature-name.md
```

### 2. Spec File Template

```markdown
# Unit NN: [Feature Name]

## Goal

One or two sentences describing the concrete output of this unit.
Be specific: "Build X with Y so that Z can do W."

## Design

Visual and structural decisions specific to this unit.
Reference ui-context.md tokens where relevant.

## Implementation

### [Component or Sub-section Name]

Detailed description of what to build.

### [Next Sub-section]

Description.

## Dependencies

- package-name (reason)

## Verify when done

- [ ] Condition one
- [ ] Condition two
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Responsive at mobile and desktop
- [ ] npm run build passes
```

### 3. Unit Scoping Rules

- **MỘT unit tại một thời điểm** — Không gộp nhiều units
- **KHÔNG speculative changes** — Chỉ làm đúng spec
- **Giữ scope trong system boundary** — UI không đụng DB, API không đụng styling
- **Dependencies just in time** — Chỉ install khi unit cần

### 4. When to Split

Tách thành sub-units khi:
- Unit yêu cầu cả UI + API + database schema → tách: 1) schema → 2) API → 3) UI
- Unit có > 3 components chính
- Unit cần tích hợp external service (payment, email, storage)
- Estimated work > 1 focused session

### 5. Build Order Priority

1. Foundation (setup, schema, auth)
2. Security (auth guard, middleware)
3. Backend (API routes)
4. UI shell (components với placeholder)
5. Public pages (Home, About, Products)
6. Protected pages (Dashboard, Admin)
7. Core flow (Register → Pay → Dashboard)
8. Nice-to-have (Blog, Community, Leaderboard)

### 6. Planned Units

| Unit | Feature | Status |
|------|---------|--------|
| 01 | Project setup + database models | ✅ Complete |
| 02 | Authentication infrastructure | ⬜ Next |
| 03 | Home page | ⬜ |
| 04 | Products page | ⬜ |
| 05 | Auth flow | ⬜ |
| 06 | Payment flow | ⬜ |
| 07 | Dashboard | ⬜ |
| 08 | Admin panel | ⬜ |
| 09 | Coral portal | ⬜ |
| 10 | Blog, Leaderboard, Community | ⬜ |
