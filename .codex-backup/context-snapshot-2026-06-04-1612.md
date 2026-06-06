# Context Snapshot - 2026-06-04 16:12 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Path: `D:\03projects\bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Purpose: BANK 1 AICC enterprise demo, with customer Production on `main` hiding unfinished management menus and local development continuing Routing Config / Call Management.

## Current Work

- Scope: `Routing Config > Media Service Rule Plans` modal only.
- The modal remains a temporary Chinese confirmation version.
- This round added field-scoped variable insertion and lighter numeric unit styling.
- `Channels` was not changed; Voice / Video rule plan fields were not added.

## Key Changes

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
  - Replaced the global template variable bar with `mediaServiceVariablesByMessageField`.
  - Add/Edit message fields now show a small `插入变量` dropdown only when that field has applicable variables.
  - Variables insert into the latest textarea cursor/selection when available; no cursor record appends to the end.
  - View/Delete do not show variable insertion controls.
  - Media Service Rule Plans numeric fields now render `InputNumber` plus scoped lightweight unit text instead of `addonAfter`.
- `src/styles/index.less`
  - Added scoped field heading, variable select, and number unit control styles for the media rule modal.

## Variable Scope

- 接入成功欢迎语: `{customerName}`, `{channelName}`
- 非人工服务时间提示语: `{workTime}`
- 排队提示语: `{estimatedWaitMinutes}`
- 分配坐席成功问候语: `{customerName}`, `{agentName}`, `{timeoutMinutes}`
- 坐席挂断提醒: `{customerName}`, `{agentName}`
- 未回复超时前提醒: `{reminderMinutes}`
- 未回复超时客户提醒: `{customerName}`
- 未回复超时坐席提醒: `{customerName}`, `{timeoutMinutes}`
- 排队超时提示语 and 自动回复内容 do not show variable insertion.

## Voice / Video Applicability

- Reusable: access concurrency, minimum scan interval, non-working time notice, max queue customers, queue waiting notice, queue timeout, queue timeout notice, access/welcome notice.
- Reusable with renamed semantics: agent no-reply warning/breach as agent answer/response SLA; agent no-reply timeout as answer timeout or session response timeout.
- Not directly reusable: Webchat recall limit, text customer no-reply auto close, text agent no-reply auto response.
- Future Voice-specific rules: IVR/waiting audio, ring timeout, no-answer reroute, abandoned call notice, callback.
- Future Video-specific rules: video waiting room, camera/mic prompt, video access timeout, reconnect timeout, text/voice fallback.

## Validation

- `npm run lint`: passed.
- `npm run build`: passed; only existing Vite/Rolldown chunk size warning.
- Browser `http://127.0.0.1:5181/routing-config/media-service-rule-plans`:
  - Add modal shows 8 field-level variable dropdowns and 10 lightweight unit controls.
  - Top global `可用变量` bar is removed.
  - Modal-scoped `.ant-input-number-group-addon` count is 0.
  - View modal does not show `插入变量`.
  - Edit save refreshes `Updated Date` to `2026-06-04`; `Updated By` remains `Admin`.
  - Delete guard still blocks referenced plans.
- Browser `/routing-config/channels`: Rule Plan binding column still displays text plans and no render error.

## Risk

- Browser automation could not reliably move a textarea cursor with Home/Arrow keys or click into the middle of textarea text. The implementation uses real textarea selection records, but arbitrary cursor insertion still needs manual verification in a real browser.
- AntD deprecation warnings remain in other project areas, including generic CRUD `addonAfter`; this round only removed `addonAfter` from the Media Service Rule Plans modal numeric fields.
