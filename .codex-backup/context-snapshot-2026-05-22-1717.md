# Context Snapshot - 2026-05-22 17:17 +08:00

## Project

- Project: BANK 1 AICC Demo V2
- Path: `D:\03projects\bca-aicc-demo-v2`
- Branch: `codex/live-chat-detail`
- Focus: Conversation tab second-pass simplification.

## Current State

- This round intentionally touched only the Live Chat Conversation component, `.live-chat-conversation*` styles, and required project documentation/backups.
- Conversation header now shows:
  - Left: customer name, icon-only elapsed timer without a surrounding frame, and the existing ChannelTag.
  - Right: borderless Transfer and Invite text buttons plus a red close icon for ending service.
- Composer now only contains message input, emoji, attachment, and Send.
- Message metadata now sits above the bubble:
  - Customer: time only.
  - Previous agent: agent name and time.
  - Current agent: time only, with no `You` label.

## Key Files Changed

- `src/pages/inbound/components/ConversationWorkspace.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with the existing Vite/Rolldown chunk size warning.
- Browser smoke check `/`: Conversation header and message DOM match the new simplified structure; End Service confirmation closes the current customer and switches to the next one.
- Browser smoke check `/design-system`: page loads normally.
- Browser text input failed because the browser plugin reported a missing virtual clipboard, so sending a new typed message was not rechecked in-browser this round.

## Recovery Notes

- To revert only this round, restore the previous `ConversationWorkspace` header/action/message meta structure and the `.live-chat-conversation*` style block.
- Do not revert the Conversation tab feature, Live Chat customer switching, message send logic, or End Service confirmation unless explicitly requested.
