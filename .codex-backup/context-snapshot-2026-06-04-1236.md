# Context Snapshot - 2026-06-04 12:36 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Current local branch: `codex/text-channel-config-settings`
- Production branch: `main`
- Production customer URL: `https://netinfo-aicc-demo-v2.vercel.app/`

## Production State

- `main` has been pushed to `origin/main`.
- Vercel Production is the customer-facing release.
- Customer Production hides unfinished management menus:
  - `Call Management`
  - `Routing Config`
- Customer Production direct management URLs redirect to `/`.
- Production smoke check passed for `/`, `/design-system`, blocked management URLs, BankApp, WhatsApp, Live Chat, and PSTN.

## Local Development State

- Local workspace is back on `codex/text-channel-config-settings`.
- This branch is intended for continued development of unfinished management features.
- The branch reopens:
  - `Call Management > Text Channel Settings`
  - `Routing Config > Route Elements`
  - `Routing Config > VDN`
  - `Routing Config > Access Sites`
  - `Routing Config > Channels`
  - `Routing Config > Media Service Rule Plans`
  - `Routing Config > Business Types`
  - `Routing Config > Skill Queues`
  - `Routing Config > Access Accounts`
  - `Routing Config > Site Access Volume`
  - `Routing Config > Skill Routing Rules`
  - `Routing Config > Working Time Plans`

## Key Files Changed

- `src/layouts/BasicLayout.tsx`
- `src/routes.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with the existing Vite chunk size warning.
- Browser local smoke check on `http://127.0.0.1:5177/`: passed.

## Risk

- Local development branch intentionally differs from Production: local shows management menus; Production hides them.
- Before any future customer release, confirm whether management menus should remain hidden or be published.
