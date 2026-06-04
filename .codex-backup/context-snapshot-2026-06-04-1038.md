# Context Snapshot - 2026-06-04 10:38 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Focus: `Skill Routing Rules` Batch Add duplicate rule wording.

## Current Change

- Renamed the Batch Add section from `Generated Routing Rules Preview` to `Duplicate Routing Rules`.
- Updated the helper text to:
  `The following route combinations already exist. Selected rows will update the existing skill queue to the current target queue; unselected rows will remain unchanged.`
- Changed the duplicate table data source from `batchPreviewRows` to `duplicatePreviewRows`.

## Scope Preserved

- No query field changes.
- No main table column changes.
- No save logic changes.
- No store/type/mock changes.

## Validation

- `npm run lint`: passed.
- `npm run build`: passed; existing Vite/Rolldown chunk size warning only.
- Browser `/routing-config/skill-routing-rules`: page renders and `Batch Add` button exists.
- Source scan confirmed:
  - `Duplicate Routing Rules`
  - new helper text
  - `dataSource={duplicatePreviewRows}`

## Risk

- In-app browser click on `Batch Add` still timed out through the control API, so modal visual validation is based on source scan plus build.
