# Context Snapshot - 2026-06-10 10:08 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/livechat-copy-update`
- Base: clean customer-facing `main` worktree at `D:\03projects\bca-aicc-demo-v2-main-fix`
- Purpose: adjust formal Live Chat popup content for customer Vercel Preview.

## Latest Change

- Updated formal `LiveChat2Page` mock content through `liveChat2Sessions`.
- Reworked customer preview scenarios for WhatsApp card unblock, Haloapps device binding, Webchat branch appointment, credit card installment conversion, replacement card delivery, and Paylater repayment history.
- Updated default Quick Replies to BANK 1 service, verification, follow-up, and security wording.

## Key Files

- `src/mock/inbound.ts`
- `src/pages/inbound/components/liveChat2QuickReplies.ts`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Scope Guard

- Did not modify legacy `LiveChatPage.tsx`.
- Did not modify routes, store, TypeScript types, or admin/internal branch files.
- This branch is intended for Vercel Preview, not immediate Production release.

## Validation

- `npm run lint` passed.
- `npm run build` passed with the existing Vite chunk size warning and plugin timing note.
- `git diff --check` passed.
- Local Chrome CDP smoke passed for login, Voice + Digital Sign In, formal Live Chat content, Quick Replies, Message Record, and `Routing Config` hidden from the customer-facing page.

## Risk

- Copy was drafted for demo preview and still needs customer confirmation on tone, language mix, and final scenario wording.
