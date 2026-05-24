# Context Snapshot - 2026-05-24 01:44 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/whatsapp-demo-detail`
- Change: BankApp / WhatsApp Demo top information cleanup.

## Latest Change

- BankApp Demo and WhatsApp Demo no longer show the top `Customer Access Demo` canvas header.
- The phone preview header keeps only `Customer BankApp` / `Customer WhatsApp`.
- The phone preview header no longer repeats the current step label or the `Bank1` / `Netinfo` owner badge.
- `bankapp-demo__stage` remains the shared unified canvas, but now uses a single content-row grid.
- Right-side AICC Process remains the only place that shows current step, owner badge, Next/Reset, and final Completed state.

## Key Files

- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with the existing Vite/Rolldown chunk size warning.
- Browser smoke check `/`: BankApp top cleanup passed; Channel and Customer Type controls still work.
- Browser smoke check `/`: WhatsApp top cleanup passed; Live Chat handoff, return-to-demo preservation, and final disabled `Completed` state still work.
- Browser smoke check `/design-system`: passed.

## Risks

- The final amount of whitespace and phone height should still be reviewed on the target leadership demo display.
- No automated browser regression tests exist; verification remains lint/build plus manual browser smoke checks.
