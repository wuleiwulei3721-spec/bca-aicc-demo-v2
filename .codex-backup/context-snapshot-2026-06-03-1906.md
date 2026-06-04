# Context Snapshot - 2026-06-03 19:06 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Focus: Routing Config admin page style standardization.

## Root Cause Fixed

- Custom `Channels` and `Media Service Rule Plans` pages missed the standard `<section className="routing-config-page">` wrapper.
- Many admin rules are scoped under `.routing-config-page`, including table font size, table padding, pagination font, toolbar control height, and button sizing.

## Current Change

- Added the missing `section.routing-config-page` wrapper around each custom page's `BaseCard compact`.
- Added `--routing-config-control-height: 32px` to `routing-config-crud-modal__sections` so complex modal sections inherit standard control height.

## Validation

- `npm run lint`: passed.
- `npm run build`: passed; existing Vite chunk size warning only.
- Browser confirmed each page has one `.routing-config-page` wrapper:
  - `/routing-config/channels`
  - `/routing-config/media-service-rule-plans`

## Standard For Future Custom Admin Pages

Use the full page skeleton, not partial class reuse:

```tsx
<PageContainer title="...">
  <section className="routing-config-page">
    <BaseCard compact>
      <div className="routing-config-page__admin-toolbar">...</div>
      <BaseTable size="small" ... />
    </BaseCard>
  </section>
  <BaseModal className="routing-config-crud-modal" kind="detail">...</BaseModal>
</PageContainer>
```
