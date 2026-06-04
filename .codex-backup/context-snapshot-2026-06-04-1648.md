# Context Snapshot - 2026-06-04 16:48 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Path: `D:\03projects\bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Purpose: BANK 1 AICC enterprise demo. Customer Production on `main` hides unfinished management menus; local development branch keeps Routing Config visible.

## Current Work

- Scope: `Routing Config > Media Service Rule Plans`.
- The modal remains the temporary Chinese confirmation version.
- Text retains the full existing configuration.
- Voice and Video now support first-version simplified access-only configuration.

## Key Changes

- Add modal Media Type can select `文字媒体`, `语音媒体`, or `视频媒体`.
- Edit/View lock Media Type.
- Text renders the existing full configuration:
  - Access
  - Queue
  - Agent opening/ending
  - Customer no reply
  - Agent no reply
  - Webchat recall
  - Agent no-reply service level
- Voice renders only:
  - Basic Info
  - Customer Service Configuration > Access Configuration
  - Max concurrent calls, minimum scan interval, access success welcome message
- Video renders only:
  - Basic Info
  - Customer Service Configuration > Access Configuration
  - Max concurrent videos, minimum scan interval, access success welcome message
- Voice / Video reuse existing `MediaServiceRulePlan` access fields. Hidden Text-only fields keep defaults but are not shown or validated.
- Mock data now includes `MSRP_VOICE_STANDARD` and `MSRP_VIDEO_STANDARD`.

## Validation

- `npm run lint`: passed.
- `npm run build`: passed; only existing Vite/Rolldown chunk size warning.
- Browser `http://127.0.0.1:5182/routing-config/media-service-rule-plans`:
  - Add default Text still renders the full Text configuration.
  - Add Voice renders only access configuration, with 1 variable dropdown and 2 numeric controls.
  - Add Video renders only access configuration, uses `接入并发视频数`, with 1 variable dropdown and 2 numeric controls.
  - Voice / Video do not show Queue, Customer No Reply, Agent No Reply, Agent Service, Webchat, SLA sections.
  - Empty Video plan name save shows only `方案名称为必填项。`, no Text-only validation.
  - View Voice and View Video render access-only read-only views without variable insertion controls.
  - Edit Voice locks media type and keeps access-only editable content.
- Browser `/routing-config/channels`: Rule Plan binding column still renders current Text bindings.

## Risk

- Voice / Video are intentionally minimal and do not include queue, waiting room, reconnect, callback, agent SLA, or media technical settings.
- Browser plugin typing was limited by virtual clipboard issues, so saving a non-empty Voice / Video plan should still be manually checked in a real browser.
