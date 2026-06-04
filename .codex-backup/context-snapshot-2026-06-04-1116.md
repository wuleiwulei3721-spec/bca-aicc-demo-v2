# Context Snapshot - 2026-06-04 11:16 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Focus: `Working Time Plans` Holiday/Special row alignment.

## Current Change

- Adjusted Holiday / Special schedule row grid from:
  `150px 150px 240px 120px 120px 30px`
- To:
  `150px 150px minmax(360px, 1fr) 120px 120px 30px`

## Rationale

- Fixed 240px for Holiday Name / Reason made the Start time column begin too early.
- The middle name/reason column now absorbs remaining space, aligning the Start time column with Work/Ramadan schedule rows.

## Scope Preserved

- No field changes.
- No validation changes.
- No save logic changes.
- No modal text changes.

## Validation

- `npm run lint`: passed.
- `npm run build`: passed; existing Vite/Rolldown chunk size warning only.
- Source scan confirmed the new grid template is applied to both Holiday and Special rows.

## Risk

- Manual browser review is still needed for exact visual alignment in the user's viewport.
