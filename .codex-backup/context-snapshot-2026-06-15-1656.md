# Context Snapshot - 2026-06-15 16:56 +08:00

Project: `D:\03projects\bca-aicc-demo-v2`

## Current Goal

Fix the management-form textarea height rule so batch textareas in `Blacklist Management` and `Priority List Management` actually render as multi-line fields.

## Root Cause

The shared CRUD modal rule used:

```css
.routing-config-crud-modal__field .ant-input {
  height: var(--routing-config-control-height);
  min-height: var(--routing-config-control-height);
}
```

Ant Design TextArea also renders with `.ant-input`, so this forced textareas to the same 32px single-line control height and overrode the batch textarea min-height.

## Completed

- Changed the shared single-line input rule to `.ant-input:not(textarea)`.
- Added a shared textarea rule:
  - `height: auto`
  - `min-height: 76px`
  - `resize: vertical`
- Kept the batch list-management rule at `min-height: 176px`.
- Kept both Batch Add textareas at `rows={8}`.
- Single-line Input, Select and InputNumber controls remain 32px.

## Validation

- `npx tsc --noEmit --pretty false` passed.
- `npm.cmd run lint` passed.
- `npm.cmd run build` passed; only the existing Vite/Rolldown chunk size warning remains.
- HTTP smoke:
  - `/call-management/blacklist` returned 200.
  - `/call-management/priority-list` returned 200.

## Risks

- Browser click-level verification was not completed.
- Manual verification should reopen both Batch Add modals and confirm the textarea is no longer one-line.

## Rollback

- Reverting `.ant-input:not(textarea)` back to `.ant-input` will restore previous behavior but will also reintroduce the one-line textarea bug.
- To roll back safely, remove only the shared textarea rule if a later design changes textarea defaults.
