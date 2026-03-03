---
name: commit-push-changelog
description: When asked to "commit and push", create an accurate commit message and maintain changes-log.md with a timestamped entry.
---

# Commit + Push with changes-log.md

## When to use
Use this skill any time the user asks to:
- "commit and push"
- "push my changes"
- "make a commit"
- "commit this"

## Goal
1) Generate a concise, accurate git commit message.
2) Ensure a `changes-log.md` exists at repo root.
3) Append a new entry to `changes-log.md` for every commit with:
   - Date/time (ISO-8601, local time)
   - Commit message
   - Short summary
   - More detailed description (what + why + impact)
   - Files changed (optional but preferred)

## Rules for the commit message
- Must be based on actual diff / changed files.
- Prefer Conventional Commits format:
  - feat: ...
  - fix: ...
  - chore: ...
  - docs: ...
  - refactor: ...
  - test: ...
- Keep it <= 72 characters if possible.
- No vague messages like "update" or "changes".

## Required workflow (always)
0) Verify git context:
   - Run `git branch --show-current`
   - Confirm repository is cleanly understood
   - If on `main` or `master`, warn the user before committing
1) Inspect changes:
   - `git status`
   - Review diff or changed files list (do not guess)
2) Propose:
   - A single best commit message (concise)
   - The `changes-log.md` entry content
3) Apply changes:
   - If `changes-log.md` does not exist, create it with a title header.
   - Append the new entry at the TOP (newest first).
4) Commit and push:
   - `git add -A`
   - `git commit -m "<message>"`
   - `git push`

## changes-log.md format (repo root)
- Keep newest entries first.
- Use this template exactly:

## YYYY-MM-DD HH:MM (TZ)
**Commit:** `<commit message>`

**Summary**
- <1–3 bullets>

**Details**
- What changed:
  - <bullets>
- Why:
  - <bullets>
- Impact / Notes:
  - <bullets>

**Files**
- <optional list of key files changed>

## If information is missing
If the diff is not available, ask for it or instruct the user to run:
- `git status`
- `git diff --stat`
- `git diff`
Then proceed.