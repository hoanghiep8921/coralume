---
description: "Review code changes on the current Coralume branch. Optionally pass specific file paths."
---

# Code Review: $ARGUMENTS

## Load Changed Files

```bash
echo "=== CURRENT BRANCH ==="
git branch --show-current 2>/dev/null || echo "Not a git repo or no branch"
echo ""
echo "=== CHANGED FILES ==="
git diff --name-only HEAD~3 -- '*.ts' '*.tsx' '*.css' 2>/dev/null || echo "No recent changes or not a git repo"
echo ""
echo "=== RECENT COMMITS ==="
git log --oneline -5 2>/dev/null || echo "No git history"
```

## Review

Read the changed files and check against 6 criteria:

1. **Correctness** — Does it match SRS requirements? All UI states handled?
2. **Architecture Compliance** — Next.js App Router conventions? Server/Client boundaries? Folder ownership correct?
3. **Security** — Zod validation? Auth guards? No secrets in client? httpOnly cookies?
4. **Performance** — No unnecessary re-renders? next/image? Proper loading states?
5. **Design Token Compliance** — NO hardcoded colors? Coral Orange rule followed? Typography tokens used?
6. **Accessibility** — ARIA labels? Keyboard nav? Focus states? Vietnamese labels?

If `.claude/agents/reviewer.md` exists, delegate to the **reviewer** sub-agent with this prompt:

> You are reviewing code changes for Coralume. Check: correctness, architecture compliance, security (OWASP ASVS), performance, design token compliance, accessibility. Focus on Server/Client boundaries, auth guards, and Coralume design token usage. Produce a structured review report with 🔴 Critical, 🟡 Warning, 🔵 Info findings.

## Post-Review

If critical issues found, summarize and ask: **"Should I fix these issues?"**

If no issues: **"Review passed. Ready to continue."**
