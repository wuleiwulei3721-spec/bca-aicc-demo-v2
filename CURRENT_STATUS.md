# BANK 1 AICC Demo V2 - Current Status

Last updated: 2026-06-18 11:02 +08:00

## 1. Overall Status

The project is a mature front-end demo for BANK 1 AICC. It includes authentication, global shell, agent status and call toolbar, inbound voice workspace, BankApp and WhatsApp customer simulations, video demo, live chat workspace, call management configuration, routing configuration, and a design system page.

This repository is still a demo application:

- Most data is mock data.
- Most state is local Zustand state.
- There is no production backend integration.
- There is no real voice/video/chat gateway integration.

## 2. Completed Foundation

- Vite React TypeScript project.
- Ant Design integration.
- Less token system.
- Ant Design theme file.
- React Router route protection.
- Zustand stores.
- Base components.
- Admin CRUD components.
- Vercel SPA rewrite.
- GitHub remote configured.

## 3. Completed Authentication

- `/login` page.
- Demo login validation.
- Session storage.
- Public login guard.
- Authenticated layout guard.
- Logout confirmation.
- Active service guard blocking logout.

## 4. Completed Global Shell

- BANK 1 branded header.
- Collapsible side menu.
- Menu search in expanded side menu.
- Route-aware menu selection.
- Header notification button.
- Header Internal Chat entry.
- Agent profile area.
- Service mode sign-in.
- Sign out confirmation and active-service block.
- AUX reason menu from Busy Reason Management.

## 5. Completed Agent and Call Toolbar

- Agent status model: Unsigned, Ready, Not Ready, AUX, Pre-AUX.
- Service modes: Voice only, Digital only, Voice + Digital.
- Call statuses: Idle, Incoming, Talking, Hold, Mute.
- Answer, Hold, Mute, Transfer, Hang Up.
- Ready / Not Ready toggle.
- Timer display.
- Toolbar display settings.
- Outbound Call modal entry.
- Call identification and Skill display during call lifecycle.
- Active-call and incompatible-service-mode handoff warnings.

## 6. Completed Workspace Tabs

- Home tab.
- BankApp Demo tab.
- WhatsApp Demo tab.
- Fixed Live Chat tab.
- Dynamic PSTN / Voice Call tabs.
- Dynamic Video Call tabs.
- Ended call tab close behavior.
- Active call tab close protection.
- Live Chat unread and duration display.

## 7. Completed Inbound Voice Workspace

- Shared `InteractionWorkspace` layout.
- PSTN call simulation.
- BankApp voice workspace.
- Unidentified PSTN customer initial state.
- Customer identity refresh demo.
- Customer Information card.
- Customer Verification V2 modal.
- Call Flow Detail modal.
- Send Email modal.
- Contact Management modal.
- Outbound approval demo.
- Customer Journey.
- Ticketing History.
- Next Best Action.
- Quick Action.
- Dynamic CRM business tabs.
- CRM screenshot with fallback.
- Assistant screenshot with fallback.
- Connection tab.

## 8. Completed Video Call Workspace

- Video Call workspace using the shared interaction layout.
- BankApp video customer profile.
- OpenEye floating client overlay.
- OpenEye screenshot rendering.
- BankApp video desktop-share selection state.
- BankApp screen-sharing demo image.
- Hang Up hides OpenEye overlay and resets share state.

## 9. Completed Live Chat Workspace

- Formal `Live Chat` tab uses the `LiveChat2Page` implementation.
- Current / History customer list.
- WhatsApp / BankApp / Webchat filtering.
- All-channel toggle.
- Customer panel collapse / expand.
- Access-time and message-time sorting.
- Star color state.
- Unread clearing on focus.
- SLA / unanswered state.
- Conversation workspace.
- Send message local state.
- End Service / Close session behavior.
- Customer-ended mock session handling.
- Transfer modal from conversation.
- Quick Replies right-side tab.
- Message Record right-side tab.
- Local recall state.

## 10. Completed BankApp Demo

- Customer-side BankApp stage.
- Voice / Video / Live Chat channel selection.
- Registered / Guest customer type.
- Channel screenshots.
- Business selection screenshots.
- Business confirmation screenshots.
- Queue / calling / connected screenshots.
- Service closed screenshot.
- Voice handoff to Agent Workspace.
- Video handoff to Agent Workspace.
- Live Chat handoff to Live Chat workspace.
- PIN verification mock page.
- Video desktop sharing demo state.

## 11. Completed WhatsApp Demo

- Customer-side WhatsApp simulation.
- Chat request screenshot.
- Business selection screenshot.
- Agent chat screenshot.
- Live Chat handoff.
- Satisfaction rating screenshot.
- Reuses BankApp demo framework with WhatsApp-specific steps.

## 12. Completed Call Management

Customer-visible pages:

- Verification Rules, implemented as Verification Rule V2.
- Global Control Configuration.
- Blacklist Management.
- Priority List Management.
- Busy Reason Management.

Implemented behaviors:

- Verification Rule V2 CRUD.
- Verification Rule V2 Question Bank.
- Rule preview using agent verification modal.
- Scenario-based KBV question model.
- Blacklist add / batch add / delete.
- Priority list add / batch add / delete.
- Priority Match Rule filtering.
- Busy reason edit and default selection.
- Local store state for demo changes.

## 13. Completed Routing Config

Routing Config is visible by default.

Pages implemented:

- VDN.
- Access Sites.
- Channels.
- Business Types.
- Skill Queues.
- Site Access Volume.
- Skill Routing Rules.
- Working Time Plans.

Implemented behaviors:

- Admin-style query toolbars.
- Add / Edit / View / Delete modal patterns where applicable.
- Status badge display.
- Channel media business config.
- Webchat-specific recall field.
- Phone account management disabled.
- Business Types `Source Business Code`.
- Skill Routing Rules batch behavior and duplicate handling.
- Local store state for demo changes.

## 14. Completed Design System

`/design-system` currently demonstrates:

- Color system.
- Typography.
- Spacing.
- Button system.
- Status system.
- Card system.
- Modal system.
- Table system.
- Admin Management Page contract.
- Tabs system.
- Timeline / Journey system.
- Chat system.
- Toolbar system.
- Reusable component contracts.

## 15. Completed Assets

Current public assets include:

- Login illustration.
- CRM workspace screenshot.
- Assistant workspace screenshot.
- OpenEye video call screenshot.
- OpenEye share-selection screenshot.
- BankApp customer-side screenshots.
- WhatsApp customer-side screenshots.
- WhatsApp customer avatar.
- Icons and favicon.

## 16. Current Validation Baseline

Latest recorded validation before this documentation task:

- TypeScript check passed.
- ESLint passed.
- Production build passed with existing large chunk warning.
- HTTP smoke checks passed for recent Call Management / Routing Config pages.

This documentation task intentionally does not change runtime code.

## 17. Known Demo Boundaries

- No backend API integration.
- No real CRM SSO handoff.
- No real voice/video protocol.
- No real OpenEye integration.
- No real WhatsApp / BankApp / Webchat gateway.
- No real routing engine.
- No production persistence.
- No automated Playwright test suite.

## 18. Current Branch State at Handoff

- Expected branch: `main`.
- Expected remote: `origin/main`.
- Future maintainers should run `git status --short --branch` before making changes.
