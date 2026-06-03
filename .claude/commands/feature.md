---
name: feature
description: "Develop a Coralume feature end-to-end. Uses Stitch MCP for Figma design → analysis → design → implement → verify."
allowed-tools: Bash(git *), Bash(npm *), Bash(npx *), Bash(sed *), Bash(grep *), Bash(head *), Bash(tail *), Bash(cat *), Bash(echo *), Bash(find *), Bash(wc *), Bash(ls *), Read, Write, Edit, MultiEdit, Glob, Grep, Task, mcp__stitch
---

# Feature Development: $ARGUMENTS

## Execution Rules

You MUST follow these rules throughout. Violation of any rule is a failure condition.

1. **Execute every step in order.** Do NOT skip or merge steps.
2. **Each step has a CHECKPOINT.** Verify all items before moving to the next step.
3. **Sub-agent fallback.** If a sub-agent file (`.claude/agents/{name}.md`) does not exist, you MUST still perform that step's work yourself. The step is NOT optional.
4. **SRS is mandatory.** Every feature MUST cross-reference `context/specs/SRS.md`.
5. **Context files are mandatory.** Read ALL context files before coding.
6. **Stitch MCP is mandatory for UI.** BẮT BUỘC dùng Stitch MCP để lấy UI design từ Figma trước khi code bất kỳ component UI nào.
7. **Completion means verified.** A feature is DONE only when: every requirement is implemented, build succeeds, type check passes, and no new lint errors.

---

## Step 0: Load Context

**0a. Read context files:**
- `context/project-overview.md` — what are we building and why
- `context/architecture.md` — folder structure, system boundaries, invariants
- `context/ui-context.md` — design tokens
- `context/code-standards.md` — coding conventions
- `context/ai-workflow-rules.md` — scoping rules, verification checklist
- `context/progress-tracker.md` — what's done, what's next
- `context/specs/SRS.md` — read the relevant section for this feature
- `prisma/schema.prisma` — database models

**0b. Check for spec file:**
Look for `context/specs/NN-feature-name.md`. If it exists, read it — this is the primary requirement document.

**0c. Check current state:**
```bash
git branch --show-current 2>/dev/null || echo "Not in git"
git status --short 2>/dev/null | head -10 || echo "No git status"
find src/app -name "page.tsx" -type f 2>/dev/null | sort
find src/components -name "*.tsx" -type f 2>/dev/null | sort
find src/app/api -name "route.ts" -type f 2>/dev/null | sort
```

**0d. Extract requirements:**
List every functional requirement, validation rule, and quality requirement for this feature. Number them REQ-01, REQ-02, etc.

**CHECKPOINT Step 0:**
- [ ] All context files read
- [ ] Spec file read if it exists
- [ ] Requirements extracted with REQ-IDs
- [ ] If any item is missing, DO NOT proceed

---

## Step 1: Analysis

Use the **analyst** sub-agent if `.claude/agents/analyst.md` exists. If NOT, perform analysis yourself.

Analysis scope:
1. Review the SRS requirements (already in context)
2. Search existing code for related patterns
3. Identify affected files, data models needed, error scenarios, reusable components
4. Produce a structured analysis with numbered requirements (REQ-01, REQ-02, etc.)

If ambiguities found (requirements unclear or conflicting), ask the user for clarification BEFORE proceeding.

**CHECKPOINT Step 1:**
- [ ] Analysis summary produced with all sections filled
- [ ] Requirements listed explicitly with REQ-IDs
- [ ] Ambiguities resolved (asked user if needed)

---

## Step 2: Design (BẮT BUỘC dùng Stitch MCP)

**QUAN TRỌNG: Step 2 BẮT BUỘC dùng Stitch MCP để lấy UI design từ Figma.**
Không được skip step này. Không được code UI từ spec text.

Use the **designer** sub-agent if `.claude/agents/designer.md` exists. If NOT, perform design work yourself using Stitch MCP.

### Step 2a: Lấy UI design từ Figma qua Stitch MCP
Dùng Stitch MCP tools để:
1. Kết nối đến Figma file của Coralume
2. Lấy design tokens (colors, typography, spacing)
3. Lấy layout structure của screen đang làm
4. Lấy screenshot để reference

### Step 2b: Cross-reference với ui-context.md
So sánh design tokens từ Stitch với `context/ui-context.md`:
- Nếu trùng → OK, dùng tokens hiện tại
- Nếu khác → Ghi nhận diff, đề xuất cập nhật ui-context.md
- Nếu thiếu → Tạo tokens mới

### Step 2c: Produce UI Spec
```markdown
## UI Implementation Spec: [Screen Name]

### Screen Structure (from Stitch/Figma)
[Layout hierarchy]

### Components to Reuse
| Component | Exists in src/components/? | Figma matches? |

### Components to Create
| Component | Purpose | Figma Node |

### Responsive Mapping
| Breakpoint | Stitch Layout | Tailwind Classes |

### Accessibility
| Element | ARIA | Keyboard |
```

**CHECKPOINT Step 2:**
- [ ] Stitch MCP đã lấy được UI design từ Figma
- [ ] UI spec produced
- [ ] Design tokens từ Stitch cross-referenced với ui-context.md
- [ ] Nếu Stitch unavailable → DỪNG LẠI, báo cho user

---

## Step 3: Implementation

Use the **coder** sub-agent if `.claude/agents/coder.md` exists. If NOT, implement yourself.

Implementation inputs:
- SRS requirements from Step 0
- Analysis from Step 1 (with REQ-IDs)
- UI spec from Step 2 (from Stitch/Figma)

Implementation rules:
1. Follow Next.js App Router architecture from `context/architecture.md`
2. Handle ALL UI states (loading, error, empty, success)
3. Use design tokens from `context/ui-context.md` — NEVER hardcode colors
4. Default to Server Components — `'use client'` only when needed
5. Validate inputs with Zod schemas from `src/lib/validation.ts`
6. Ensure accessibility: ARIA labels, keyboard nav, semantic HTML
7. Mobile-first responsive with Tailwind breakpoints
8. User-facing messages in Vietnamese
9. Follow `context/ai-workflow-rules.md` scoping rules
10. **UI phải match với Stitch/Figma design** — không deviate

After implementation:
```bash
npm run build 2>&1 | tail -20
```
If build fails, fix errors and rebuild. Repeat until build succeeds.

**CHECKPOINT Step 3:**
- [ ] All files created/modified
- [ ] Build succeeds (`npm run build`)
- [ ] Every REQ-ID from Step 0 implemented (self-check each one)
- [ ] Design tokens use — no hardcoded colors
- [ ] UI matches Stitch/Figma design
- [ ] Auth guards in place where required

---

## Step 4: Independent Review

**CRITICAL: You MUST NOT review your own code.** Use the `Task` tool to spawn an independent reviewer.

Spawn a Task agent with the **reviewer** sub-agent:

> You are an independent code reviewer for Coralume (Next.js, TypeScript, Tailwind CSS, Prisma, Zod). Review the code changes against: correctness, architecture compliance, security (auth guards, validation, no secrets), performance, design token compliance (NO hardcoded colors), accessibility, and Figma design match (via Stitch). Produce a structured review with 🔴 Critical, 🟡 Warning, 🔵 Info findings and a verdict.

If verdict is `BLOCKED` or `FIX REQUIRED`:
1. Fix ALL 🔴 critical issues
2. Fix ALL 🟡 warning issues
3. Rebuild and verify
4. Spawn a NEW reviewer agent for re-review

Do NOT proceed until review verdict is `APPROVED` (zero 🔴, zero 🟡).

---

## Step 5: Final Verification

Run all checks:
```bash
npm run build              # Must succeed
npx tsc --noEmit           # Must pass (or report errors)
npm run lint               # Zero new errors
```

Verify design token compliance:
```bash
grep -rn '#E87750\|#0F4C5C\|#B5D8E8\|#5BA8B5' \
  src/ --include="*.tsx" --include="*.ts" \
  | grep -v 'globals.css' | grep -v 'layout.tsx' || echo "✅ No hardcoded colors"
```

**QC Loop Exit Criteria:**
- [ ] Independent review verdict: `APPROVED` (zero 🔴, zero 🟡)
- [ ] Every REQ-ID: ✅ implemented and verified
- [ ] Build: SUCCESS
- [ ] Type check: PASS (or errors documented)
- [ ] Lint: zero new errors
- [ ] Design tokens: no hardcoded colors
- [ ] UI matches Stitch/Figma design

If ANY item NOT met, go back to the appropriate step and fix it.

You are NOT allowed to:
- Self-review your own code
- Exit without checking every REQ-ID
- Exit with hardcoded colors in source files
- Exit without verifying UI matches Stitch/Figma
- Summarize or ask to commit before all exit criteria are met

---

## Step 6: Complete

**Only reach this step after ALL exit criteria are met.**

1. Update `context/progress-tracker.md`:
   - Add completed item to "Completed" section
   - Update "Current Phase"
   - Add session notes

2. Produce final summary:

```markdown
## ✅ Feature Complete: [Feature Name]

### SRS Compliance
| REQ-ID | Requirement | Status | Implementation |
|--------|-------------|--------|----------------|
| REQ-01 | [description] | ✅ | [file + how] |

### Stitch/Figma Design Match
| Screen | Figma Node | Implementation | Match? |
|--------|-----------|----------------|--------|

### Files Created
| File | Purpose |

### Files Modified
| File | Change |

### Review History
- Iteration 1: [BLOCKED/FIX REQUIRED/APPROVED] — N critical, N warnings
- Iteration 2: [APPROVED] — 0 critical, 0 warnings

### Verification
- Build: ✅ PASS
- Type check: ✅ PASS
- Lint: ✅ 0 new errors
- Design tokens: ✅ No hardcoded colors
- Figma match: ✅ UI matches Stitch design
```
