# BANK 1 AICC Demo V2 - Project Context

Last updated: 2026-06-24 11:00 +08:00
Repository path: `D:\03projects\bca-aicc-demo-v2`

## 1. Project Name

- Repository name: `bca-aicc-demo-v2`
- Customer-facing demo name: `BANK 1 AICC Demo V2`
- Browser title / brand tone: `BANK 1 AICC Demo`

This is a front-end demo for an enterprise banking AICC agent desktop. It is not a Vite starter project anymore; the repository already contains multiple implemented workspaces, management pages, customer-side channel simulations, screenshots, mock data, and project recovery documents.

## 2. Project Goal

The project demonstrates how a BANK 1-style omnichannel AI contact center can support a bank agent through:

- inbound PSTN call pop-up and call handling,
- BankApp voice / video / live chat handoff,
- WhatsApp live chat handoff,
- customer profile, verification, journey, tickets, CRM workspace, and assistant panels,
- call management configuration,
- routing configuration and skill routing rules,
- a reusable design system for future AICC modules.

The main demo quality target is a dense, restrained, enterprise-grade agent workstation: high information density, clear operations, predictable layout, and stable interaction flow for repeated customer demonstrations.

## 3. Project Background and Demo Use

The demo represents a bank customer service agent console. The primary story is:

1. An agent logs in and signs in to a service mode.
2. The customer reaches BANK 1 through PSTN, BankApp, or WhatsApp.
3. The workspace opens the correct interaction tab.
4. The agent sees customer information, verification, journey, ticketing, next best action, quick action, CRM, and assistant context.
5. The agent can answer, hold, mute, transfer, make outbound calls, use internal chat, verify the customer, open CRM detail tabs, and handle live chat conversations.
6. Supervisory / admin-like configuration is shown through Call Management and Routing Config pages.

The application is a front-end demo. Data persistence is mostly in Zustand in-memory stores and mock files. Refreshing the browser generally restores default mock data.

## 4. Technology Stack

From `package.json`:

- React `19.2.6`
- React DOM `19.2.6`
- TypeScript `~6.0.2`
- Vite `8.0.12`
- Ant Design `6.4.2`
- `@ant-design/icons` `6.2.3`
- React Router DOM `7.15.1`
- Zustand `5.0.13`
- Less `4.6.4`
- ESLint `10.3.0`
- Day.js `1.11.21`

Common commands:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## 5. GitHub Repository

- Remote: `https://github.com/wuleiwulei3721-spec/bca-aicc-demo-v2.git`
- Main branch: `main`
- Current project direction: keep `main` as the customer-facing integration line unless the user explicitly asks for another branch strategy.
- Local changes may exist in future sessions; always run `git status --short --branch` before editing.

## 6. Vercel Deployment

Deployment is configured as a Vite SPA:

- Framework preset: `Vite`
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`
- SPA refresh handling: `vercel.json` rewrites all routes to `/index.html`.

`VITE_ENABLE_ADMIN_MENUS` controls Routing Config visibility:

- Default behavior: Routing Config is visible.
- To hide Routing Config: set `VITE_ENABLE_ADMIN_MENUS=false`.
- `.env.example` documents this behavior.

## 7. Application Routes

Current router structure:

- `/login` -> public login page.
- `/` -> authenticated `BasicLayout` -> `AgentWorkspace`.
- `/design-system` -> authenticated `BasicLayout` -> `DesignSystem`.
- `/call-management/verification-rules` -> current Verification Rule V2 page.
- `/call-management/global-control-configuration`
- `/call-management/blacklist`
- `/call-management/priority-list`
- `/call-management/common-phrases`
- `/call-management/common-links`
- `/call-management/sensitive-words`
- `/call-management/busy-reasons`
- `/call-management/*` legacy or hidden routes redirect to Verification Rules.
- `/routing-config/channels`
- `/routing-config/vdn`
- `/routing-config/sites`
- `/routing-config/business-types`
- `/routing-config/skill-queues`
- `/routing-config/site-access-volume`
- `/routing-config/skill-routing-rules`
- `/routing-config/working-time-plans`
- `/routing-config/*` redirects depending on feature flag.
- `*` under authenticated routes redirects to `/`.

All business routes under `/` require an authenticated demo session.

## 8. Major Source Areas

- `src/App.tsx`: Ant Design `ConfigProvider` and router provider.
- `src/routes.tsx`: route definitions and feature-flagged Routing Config routes.
- `src/layouts/BasicLayout.tsx`: global shell, header, side menu, agent status, call toolbar, handoff readiness, sign out / logout guards, internal chat entry.
- `src/layouts/components/*`: toolbar, profile area, Transfer, Outbound, Internal Chat, Toolbar Settings.
- `src/pages/AgentWorkspace.tsx`: workspace tab container for Home, BankApp Demo, WhatsApp Demo, Live Chat, PSTN, Voice Call, and Video Call.
- `src/pages/inbound/InteractionWorkspace.tsx`: shared three-column workspace foundation.
- `src/pages/inbound/InboundPage.tsx`: voice / PSTN and BankApp voice workspace.
- `src/pages/inbound/VideoCallPage.tsx`: video call workspace and OpenEye floating client overlay.
- `src/pages/inbound/LiveChat2Page.tsx`: current Live Chat workspace.
- `src/pages/bankapp/BankAppDemoPage.tsx`: BankApp customer-side channel simulation.
- `src/pages/whatsapp/WhatsAppDemoPage.tsx`: WhatsApp simulation using the BankApp demo framework.
- `src/pages/call-management/*`: customer-visible call management configuration pages.
- `src/pages/routing-config/*`: routing configuration data maintenance pages.
- `src/components/*`: base UI components and compatibility components.
- `src/components/admin/*`: unified admin CRUD layout, toolbar, table, modal, and form field components.
- `src/mock/*`: demo data.
- `src/types/*`: shared business and config types.
- `src/store/*`: Zustand stores for auth, app interaction state, call management, and routing config.
- `src/styles/index.less`, `src/styles/tokens.less`, `src/styles/theme.ts`: global style rules, tokens, and Ant Design theme.

## 9. Main Modules

### Login and Authentication

- Demo login page at `/login`.
- Demo credentials are implemented in mock auth data.
- Session is stored in `sessionStorage`.
- Protected routes redirect unauthenticated users to `/login`.
- Log Out is blocked while active customer service exists.

### BasicLayout and Agent Toolbar

The shell contains:

- BANK 1 header brand.
- Central call toolbar.
- Notification and Internal Chat buttons.
- Agent profile, service mode, status, sign in / sign out menu.
- Collapsible side menu with search.
- Route-aware selected menu state.

The toolbar supports:

- Answer.
- Hold.
- Mute.
- Transfer.
- Hang Up.
- Ready / Not Ready toggle.
- Timer display.
- More menu for Outbound Call and Settings.
- Call identification display: `IVR` / `BankID`.
- Skill display during active call lifecycle.

### Agent Workspace

Workspace tabs include:

- Home.
- BankApp Demo.
- WhatsApp Demo.
- Live Chat.
- Dynamic call tabs for PSTN / Voice Call / Video Call.

Active calls cannot be closed from the tab. Ended call tabs can be closed.

### Inbound / Voice Workspace

Inbound voice workspace uses the shared three-column layout:

- Left: Customer Information, Customer Journey, Ticketing History, Next Best Action, Quick Action.
- Center: CRM workspace, Conversation tab when applicable, dynamic business tabs.
- Right: Assistant, Common Links, and optional extra tabs.

PSTN initially shows an unidentified customer. Customer identity can be refreshed through the Customer Information card using the demo customer ID.

### Video Call Workspace

Video call uses the same interaction workspace and adds an OpenEye floating video window when the current active interaction is connected. BankApp video also supports a desktop-share demo flow with OpenEye share-selection and BankApp screen-sharing images.

### Live Chat Workspace

Current formal Live Chat uses `LiveChat2Page`:

- Current / History customer list.
- WhatsApp, BankApp, and Webchat channel filters.
- Customer list collapsed / expanded states.
- Sorting by access time or message time.
- Star color marker UI is hidden in the customer list; compatibility state remains local.
- Unread count aggregation on the Live Chat tab.
- SLA / unanswered timer display with a horizontal progress bar based on the breach threshold.
- Conversation workspace.
- Quick Replies tab.
- Public Quick Replies are maintained through `Call Management > Common Phrase Management`.
- Agent replies are checked against `Call Management > Sensitive Word Management` before sending.
- Message Record tab.
- Transfer modal.
- End Service / Close behavior.
- Message sending, recall state, and local draft state.

This is still a front-end simulation, not a real message gateway integration.

### BankApp and WhatsApp Demo

BankApp supports:

- Voice.
- Video.
- Live Chat.
- Registered / Guest customer type.
- Customer-side screenshot flow.
- Business selection and confirmation.
- Voice/video handoff to Agent Workspace.
- Live chat handoff to Live Chat.
- PIN verification mock.
- Video desktop-share mock.

WhatsApp supports:

- Chat request flow.
- Business selection.
- Agent chat screenshot.
- Handoff to Live Chat.
- Satisfaction rating / closed flow.

### Call Management

Customer-visible Call Management pages:

- Verification Rules: current V2 KBV rule management.
- Global Control Configuration.
- Blacklist Management.
- Priority List Management.
- Common Phrase Management.
- Common Link Management.
- Sensitive Word Management.
- Busy Reason Management.

Legacy or hidden routes redirect to Verification Rules.

### Routing Config

Routing Config is visible by default and includes:

- VDN.
- Access Sites.
- Channels.
- Business Types.
- Skill Queues.
- Site Access Volume.
- Skill Routing Rules.
- Working Time Plans.

The pages use local routing config store data and shared admin components.

### Design System

`/design-system` documents and demonstrates the current component contracts:

- BaseButton.
- BaseCard.
- BaseModal.
- BaseTable.
- BaseTabs.
- StatusBadge.
- ToolbarButton.
- SearchInput.
- TimelineFlow.
- CustomerInformationPanel.
- AdminPage / AdminToolbar / AdminTable / AdminModal / AdminFormField.

## 10. Current Completed Modules

- React + Vite + TypeScript project skeleton.
- Ant Design theme and Less token layer.
- Auth route guard and demo login.
- Main BANK 1 shell with header, side menu, toolbar, and profile status.
- Agent service mode sign-in.
- Ready / Not Ready / AUX / Pre-AUX state handling.
- PSTN inbound call simulation.
- BankApp voice and video handoff.
- Video workspace with OpenEye floating client and screen-share demo.
- Shared InteractionWorkspace for voice, video, and live chat.
- Customer Information, verification, journey, tickets, next best actions, quick actions.
- CRM screenshot / fallback workspace.
- Assistant screenshot / fallback workspace.
- Common Links tab.
- Transfer, Outbound Call, Internal Chat, Toolbar Settings, Call Flow Detail, Send Email, Contact Management modals.
- Live Chat workspace with customer list, conversation, message record, quick replies, and local message state.
- BankApp and WhatsApp customer-side simulations with screenshot assets.
- Call Management pages listed above.
- Sensitive word detection for Live Chat agent replies.
- Routing Config pages listed above.
- Admin CRUD component set.
- Design System page.
- Vercel SPA rewrite configuration.
- Context backup and handoff documentation mechanism.

## 11. Current Unfinished or Partially Implemented Areas

- No real backend persistence. Stores are local demo state.
- No real AICC, IVR, CRM, OpenEye, BankApp, WhatsApp, Webchat, LDAP, queue, or routing engine integration.
- Video Call is a visual demo, not real audio/video.
- Live Chat is a front-end mock, not a real channel gateway.
- Webchat customer-side simulation is not implemented as a standalone customer demo entry.
- Dashboard, Admin dashboard, Supervisor pages, and reporting pages are not fully implemented workspaces.
- CRM and Assistant screenshots exist, but may still need final customer-approved images and quality checks.
- Localization is mixed: framework UI is mostly English; business content is a mix of English and Indonesian.
- Automated test coverage is not established.
- Production verification policy, audit fields, answer matching, failure handling, and backend rule execution still require customer confirmation.

## 12. Screenshot and Asset State

Current `public/screenshots/` contains:

- `crm-workspace.jpg`
- `assistant-workspace.jpg`
- `login-illustration.svg`
- OpenEye images.
- BankApp channel, business selection, confirmation, queue, chat, voice/video, screen-share, and service-closed images.
- WhatsApp chat request, business selection, agent chat, and satisfaction rating images.

CRM and Assistant components keep code-based fallback UI if image loading fails.

## 13. Data and Persistence Boundaries

Important demo boundary:

- `useAppStore`: workspace tabs, call interactions, live chat sessions, BankApp flow flags, verification rules.
- `useAuthStore`: demo session.
- `useCallManagementStore`: blacklist, priority list, busy reasons.
- `useRoutingConfigStore`: routing configuration collections.

These are front-end stores. They are not connected to production APIs. Most changes reset after refresh or new session.

## 14. Known Risks

- The project is UI-heavy and interaction-heavy, with limited automated test coverage.
- Build has historically shown a Vite / Rolldown large chunk warning.
- Browser visual verification is still important after any frontend change.
- Call state currently supports only one active voice/video call at a time.
- Closing a Video Call tab does not automatically hang up; Hang Up is the authoritative call end action.
- Some older compatibility code or internal identifiers may still exist in source, but customer-visible text should use Bank / BankApp / BANK 1 wording.
- `DEPLOY.md` may display encoding issues in non-UTF-8 terminals.

## 15. Handoff Reading Order

Future maintainers should read:

1. `AGENTS.md`
2. `PROJECT_CONTEXT.md`
3. `DESIGN_SYSTEM.md`
4. `BUSINESS_RULES.md`
5. `CURRENT_STATUS.md`
6. `CURRENT_TODO.md`
7. latest `DEV_LOG.md` entries
8. latest `.codex-backup/context-snapshot-*`, `current-todo-*`, and `page-state-*`

Then inspect the task-related source files before editing.
