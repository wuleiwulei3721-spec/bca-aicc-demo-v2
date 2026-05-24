# Context Snapshot - 2026-05-24 13:48 +08:00

## Project

- Repo: `D:\03projects\bca-aicc-demo-v2`
- Branch: `codex/whatsapp-demo-detail`
- App: BANK 1 AICC Demo V2, React 19 / TypeScript / Vite / Ant Design 6.

## Current State

- BankApp and WhatsApp demos keep the unified customer app canvas plus AICC Process rail.
- BankApp Video now supports an OpenEye-driven desktop sharing flow after `Agent Workspace`.
- The Video flow adds `Select Sharing Program` and `View Agent Screen Sharing`, both tagged `Netinfo`.
- OpenEye shows `桌面共享` only for `bankapp-video`; clicking it displays `openeye-share-selection.png`, and clicking `确定` returns to BankApp Demo with the sharing view.

## Recent Change

- Added `public/screenshots/openeye-share-selection.png`.
- Added `public/screenshots/bankapp/video-screen-sharing.png`.
- Updated `appStore` with BankApp Video sharing selection/confirmation/reset state.
- Updated BankApp Video step sequencing and removed the old connected-page Screen share Start/Stop overlay.
- Updated `OpenEyeVideoWindow` to host the desktop sharing entry and confirmation hotspot.

## Key Files

- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/pages/inbound/components/OpenEyeVideoWindow.tsx`
- `src/pages/inbound/VideoCallPage.tsx`
- `src/store/appStore.ts`
- `src/types/bankapp.ts`
- `src/mock/bankapp.ts`
- `src/styles/index.less`
- `public/screenshots/openeye-share-selection.png`
- `public/screenshots/bankapp/video-screen-sharing.png`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed, with existing Vite/Rolldown chunk size warning.
- Browser `/`: BankApp Video reaches `Agent Workspace`, opens `Video Call`, shows OpenEye `桌面共享`, then selection screenshot.
- Browser `/`: OpenEye `确定` returns to `BankApp Demo`, shows `BankApp agent screen sharing`, and rail includes both new Netinfo steps.
- Browser `/`: Next Step reaches `Service Closed`; Reset clears the sharing view.
- Browser `/design-system`: loaded successfully.

## Risks

- `openeye-share-selection.png` is generated to match the supplied visual reference; replace it with a raw original attachment if one is provided.
- `video-screen-sharing.png` uses the current customer-side sharing screenshot content and must be approved before public deployment.
