---
description: "Create a detailed implementation plan for a Coralume feature WITHOUT writing code. Use in Plan mode to review before executing."
---

# Implementation Plan: $ARGUMENTS

## Load Context

```bash
echo "=== PROGRESS TRACKER ==="
cat context/progress-tracker.md 2>/dev/null
echo ""
echo "=== EXISTING PAGES ==="
find src/app -name "page.tsx" -type f 2>/dev/null | sort
echo ""
echo "=== EXISTING COMPONENTS ==="
find src/components -name "*.tsx" -type f 2>/dev/null | sort
echo ""
echo "=== EXISTING API ROUTES ==="
find src/app/api -name "route.ts" -type f 2>/dev/null | sort
echo ""
echo "=== EXISTING LIBS ==="
find src/lib -name "*.ts" -type f 2>/dev/null | sort
echo ""
echo "=== SPECS ==="
ls context/specs/ 2>/dev/null || echo "No spec files yet"
```

## Instructions

You are in **PLAN MODE**. Do NOT write any code. Instead:

1. Read the relevant context files from `context/`
2. Search codebase for related existing code
3. Check if a spec file exists in `context/specs/` for this feature
4. Produce a detailed plan:

```markdown
## Plan: [Feature Name]

### Overview
[What this feature does and why it matters for Coralume]

### SRS Requirements (from Coralume-SRS.md)
| ID | Requirement | Section | Priority |
|----|-------------|---------|----------|
| [XX-XX] | [from SRS] | [section] | Must have |

### Design Reference (from ui-context.md)
[Relevant design tokens, colors, typography, animation for this feature]

### Files to Create
| File | Purpose | Layer |
|------|---------|-------|
| src/app/[route]/page.tsx | Page component | UI |
| src/components/sections/[name].tsx | Section component | UI |
| src/app/api/v1/[route]/route.ts | API handler | API |
| src/lib/[name].ts | Business logic | Lib |

### Files to Modify
| File | Change | Reason |
|------|--------|--------|

### Data Flow
User action → Middleware check → API Route → Zod validation → Prisma query → Response → UI update

### Auth & Role Requirements
- [ ] Public / Requires login / Admin only / Coral Staff only
- [ ] Email verification required?
- [ ] Role check in middleware?
- [ ] Role check in API route?

### Error Handling Plan
| Error Type | Detection | UI Response |
|------------|-----------|-------------|
| Network | fetch fails | error.tsx + retry button |
| Validation | Zod parse fails | Inline form errors (Vietnamese) |
| Auth | 401 response | Redirect to /dang-nhap |
| Not found | 404 response | not-found.tsx |
| Not verified | User isVerified=false | Redirect to /verify-email |

### Implementation Steps (in order)
1. [Step with specific file and what to do]
2. [Step 2...]
3. [Step 3...]

### Dependencies
[Other units/features that must be complete first — check progress-tracker.md]

### Risks & Edge Cases
[What could go wrong]

### Estimated Effort
[S/M/L/XL with rationale]
```

After presenting the plan, ask: **"Approve this plan? If yes, I'll start implementing."**
