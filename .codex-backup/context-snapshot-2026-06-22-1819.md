# Context Snapshot - 2026-06-22 18:19 +08:00

## Project

- Repository: `D:\03projects\bca-aicc-demo-v2`
- Branch: `main`
- App: BANK 1 AICC Demo V2
- Change type: Call Management feature addition with Live Chat linkage.

## Latest Change

Added `Call Management > Common Phrase Management`:

- Route: `/call-management/common-phrases`
- Scope: public Live Chat quick replies only.
- My Phrases remain local to the Live Chat workspace.
- Public phrase categories and phrases are stored in `callManagementStore`.
- Refreshing the app restores default mock data.
- Live Chat `Quick Replies > Public Phrases` now reads from the shared common phrase store.

## Data Model

- `CommonPhraseCategory`
  - `categoryId`
  - `categoryName`
- `CommonPhraseEntry`
  - `phraseId`
  - `shortcutCode`
  - `phraseText`
  - `categoryId`

## Key Behavior

- Left panel manages categories.
- Right panel manages phrases for all categories or the selected category.
- `All Categories` is aggregate view only; Add is disabled there.
- Shortcut Code is globally unique after trim + lowercase normalization.
- Category Name is unique after trim + lowercase normalization.
- Deleting a category confirms and cascades to its phrases.
- Selected phrases can be moved to another category; source categories are disabled as move targets.

## Validation

- `npx tsc --noEmit --pretty false` passed.
- `npm.cmd run lint` passed.
- `npm.cmd run build` passed with the existing large chunk warning.
- HTTP smoke passed:
  - `/` -> 200
  - `/call-management/common-phrases` -> 200
  - `/call-management/priority-list` -> 200
  - `/call-management/blacklist` -> 200
- Browser plugin was not callable, and Node REPL fallback could not import `playwright`, so screenshot-level browser automation was not completed.

## Risks

- No backend persistence exists; this is demo store behavior.
- Manual UI review is still recommended to confirm left/right layout and Live Chat public phrase synchronization.
