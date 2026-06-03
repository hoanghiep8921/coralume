---
description: "Analyze a document or requirement for Coralume and propose implementation tasks. Pass a file path or topic."
---

# Analyze: $ARGUMENTS

## Load Document

```bash
echo "=== DOCUMENT ==="
if [ -f "$ARGUMENTS" ]; then
    echo "File: $ARGUMENTS"
    wc -l "$ARGUMENTS"
    echo ""
    head -80 "$ARGUMENTS"
else
    echo "File not found: $ARGUMENTS"
    echo ""
    echo "=== Available context files ==="
    ls context/ 2>/dev/null
    echo ""
    echo "=== SRS ==="
    ls Coralume-SRS.md 2>/dev/null && echo "Coralume-SRS.md exists" || echo "No SRS found"
fi
echo ""
echo "=== CURRENT PROGRESS ==="
grep -E "^- " context/progress-tracker.md 2>/dev/null | head -20
echo ""
echo "=== NEXT UP ==="
sed -n '/## Next Up/,/^$/p' context/progress-tracker.md 2>/dev/null
```

## Analysis

Read the document and analyze:

1. **Summarize** the key requirements and what they describe
2. **Cross-reference** with `Coralume-SRS.md` — what's new vs already covered?
3. **Cross-reference** with `context/progress-tracker.md` — what's already built?
4. **Identify** new features, API routes, database changes, UI pages needed
5. **Map** to Coralume's architecture: which folder owns what
6. **Flag** any ambiguous requirements that need clarification

## Output

```markdown
## Document Analysis: [filename/topic]

### Summary
[What this describes and how it fits into Coralume]

### New Requirements (not yet implemented)
| # | Requirement | Priority | Complexity | SRS Reference |
|---|-------------|----------|------------|---------------|

### Overlapping Requirements (already covered)
| # | Requirement | Existing Implementation | Gaps |
|---|-------------|------------------------|------|

### Suggested Implementation Order
1. [Foundation/infrastructure tasks first]
2. [Core flow tasks]
3. [Nice-to-have tasks]

### Risks & Open Questions
[What needs clarification before building]

### Recommended Next Steps
1. [action items in priority order]
```
