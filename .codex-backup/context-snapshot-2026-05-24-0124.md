# Context Snapshot - 2026-05-24 01:24 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/whatsapp-demo-detail`
- Change: BankApp / WhatsApp Demo unified canvas layout.

## Latest Change

- BankApp Demo and WhatsApp Demo no longer present the phone preview and AICC Process as two independent cards.
- `bankapp-demo__stage` is now the single canvas with shared border, radius, background, shadow, and a cross-column header.
- `bankapp-demo__phone-panel` and `bankapp-process` are transparent sections inside the same canvas.
- A light divider connects the phone preview area and the process area.
- The stage has a max width and a tighter phone preview column so the process rail sits closer to the app image on wide demo screens.
- Narrow viewports keep both sections inside the same container and stack them with a subtle divider.

## Key Files

- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with the existing Vite/Rolldown chunk size warning.
- Browser smoke check `/`: BankApp unified canvas layout passed; Channel and Customer Type controls still work and expose correct `aria-pressed` state.
- Browser smoke check `/`: WhatsApp unified canvas layout passed; Live Chat handoff, return-to-demo preservation, and final disabled `Completed` state still work.
- Browser smoke check `/design-system`: passed.

## Risks

- The final visual distance between phone and AICC Process still needs review on the exact leadership demo display.
- No automated browser regression tests exist; verification remains lint/build plus manual browser smoke checks.
