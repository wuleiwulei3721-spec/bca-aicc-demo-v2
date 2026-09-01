# BANK 1 AICC Demo V2 - Project Context

Last updated: 2026-08-27 17:38 +08:00
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

1. An agent logs in and signs in with the configured default agent status.
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

`VITE_APP_VISIBILITY_PROFILE` controls customer-visible versus local-only modules:

- Default / customer deployment behavior: `customer`, which hides local-only modules.
- Local maintainer behavior: set `VITE_APP_VISIBILITY_PROFILE=local` in `.env.local` to show local-only modules.
- Current local-only modules: `/design-system` and `/employee-management/*`.
- Customer deployments should leave this variable unset or set it to `customer`.

## 7. Application Routes

Current router structure:

- `/login` -> public login page.
- `/tl-outbound-approval?requestId=...` -> public lightweight TL approval simulation popup for a pending external-number request.
- `/` -> authenticated `BasicLayout` -> `AgentWorkspace`.
- Monitoring screenshot menu items also open `/` and switch the Home or Monitor workspace tab image; there are no standalone Monitoring routes in the current scope.
- `AI` is a side-menu group with external child links for `Quality Manage` and `AI Assist Config`; these open new browser tabs and do not change the current workspace.
- `/design-system` -> local-only compatibility entry that opens the Design System workspace tab and returns to `/` when `VITE_APP_VISIBILITY_PROFILE=local`.
- `/call-management/verification-rules` -> compatibility entry that opens the current Verification Rule V2 workspace tab and returns to `/`.
- `/call-management/global-control-configuration`
- `/call-management/blacklist`
- `/call-management/priority-list`
- `/call-management/common-phrases`
- `/call-management/common-links`
- `/call-management/quick-actions`
- `/call-management/common-numbers`
- `/call-management/sensitive-words`
- `/call-management/busy-reasons`
- `/call-management/session-end-reasons`
- `/call-management/call-record-query`
- `/call-management/login-log`
- `/call-management/*` legacy or hidden routes redirect to Verification Rules.
- `/social-media/interaction-log` -> compatibility entry that opens the Social Media Interaction Log workspace tab and returns to `/`.
- `/social-media/*` redirects to `/social-media/interaction-log`.
- `/routing-config/channels`
- `/routing-config/vdn`
- `/routing-config/sites`
- `/routing-config/business-types`
- `/routing-config/skill-queues`
- `/routing-config/site-access-volume`
- `/routing-config/skill-routing-rules`
- `/routing-config/working-time-plans`
- `/routing-config/*` redirects depending on feature flag.
- `/employee-management/employee-profiles` -> local-only compatibility entry that opens the Employee Profile workspace tab and returns to `/` when `VITE_APP_VISIBILITY_PROFILE=local`.
- `/employee-management/*` redirects depending on visibility profile.
- `*` under authenticated routes redirects to `/`.

All business routes under `/` require an authenticated demo session.

## 8. Major Source Areas

- `src/App.tsx`: Ant Design `ConfigProvider` and router provider.
- `src/routes.tsx`: route definitions, workspace page tab route bridges, feature-flagged Routing Config redirects, and local-only module guards.
- `src/config/workspacePageTabs.tsx`: registry for menu-driven workspace page tabs, including menu key, route path, label, icon, module visibility key, and page component.
- `src/components/WorkspacePageRouteOpener.tsx`: compatibility route bridge that opens a registered workspace page tab and returns the URL to `/`.
- `src/config/moduleVisibility.ts`: unified customer/local module visibility profile.
- `src/layouts/BasicLayout.tsx`: global shell, header, side menu, agent status, call toolbar, handoff readiness, sign out / logout guards, internal chat entry.
- `src/layouts/components/*`: toolbar, profile area, agent settings, Transfer, Outbound, Internal Chat, Toolbar Settings.
- `src/utils/outboundApproval.ts` and `src/hooks/useExternalOperationApproval.ts`: localStorage + BroadcastChannel synchronization for the external-number TL approval simulation.
- `src/pages/TlOutboundApprovalPage.tsx`: customer-supplied complete TL dashboard image and component-based popup approval decision surface.
- `src/pages/AgentWorkspace.tsx`: workspace tab container for Home, Monitor, BankApp Demo, Webchat Demo, WhatsApp Demo, Email, Live Chat, PSTN, Voice Call, Video Call, and registered management page tabs.
- `src/pages/inbound/InteractionWorkspace.tsx`: shared three-column workspace foundation.
- `src/pages/inbound/InboundPage.tsx`: voice / PSTN and BankApp voice workspace.
- `src/pages/inbound/VideoCallPage.tsx`: video call workspace and OpenEye floating client overlay.
- `src/pages/inbound/LiveChat2Page.tsx`: current Live Chat workspace.
- `src/pages/bankapp/BankAppDemoPage.tsx`: BankApp customer-side channel simulation.
- `src/pages/whatsapp/WhatsAppDemoPage.tsx`: WhatsApp simulation using the BankApp demo framework.
- `src/pages/email/EmailPage.tsx`: code-built Email agent workspace with mailbox folders, customer context, message handling, CRM, thread records, and Ticket registration.
- `src/pages/social-media/SocialMediaPage.tsx`: Social Media agent workspace with queue filters, post/review handling, CRM preview, and CWU prototype.
- `src/pages/social-media/SocialMediaInteractionLogPage.tsx`: Social Media Interaction Log workspace page for social channel history query, agent lookup, alert review, and conversation detail.
- `src/pages/call-management/*`: customer-visible call management configuration pages.
- `src/pages/routing-config/*`: routing configuration data maintenance pages.
- `src/pages/employee-management/*`: local-only employee profile management pages.
- `src/components/*`: base UI components and compatibility components.
- `src/components/admin/*`: unified admin CRUD layout, toolbar, table, modal, and form field components.
- `src/mock/*`: demo data.
- `src/types/*`: shared business and config types.
- `src/store/*`: Zustand stores for auth, app interaction state, call
  management, routing config, and local-only employee management.
- `src/styles/index.less`, `src/styles/tokens.less`, `src/styles/theme.ts`: global style rules, tokens, and Ant Design theme.

## 9. Main Modules

### Login and Authentication

- Demo login page at `/login`.
- Demo credentials are implemented in mock auth data: `888888 / 888888` is the ordinary Agent account, and `666666 / 666666` is the TL Demo account Maya Santoso (`EMP-10108`), used to demonstrate direct external outbound, `Transfer Number`, and broader Call Agent visibility.
- Session is stored in `sessionStorage`.
- Protected routes redirect unauthenticated users to `/login`.
- Log Out is blocked while active customer service exists.

### BasicLayout and Agent Toolbar

The shell contains:

- BANK 1 header brand.
- Central call toolbar.
- Notification and Internal Chat buttons.
- Agent profile, status, and single-action sign in / sign out menu.
- Agent Settings entry separated at the bottom of the profile menu; current setting controls system prompt sound on/off.
- Collapsible side menu with search.
- Route-aware selected menu state.
- `AI` external-link group below Monitoring, with `Quality Manage` and `AI Assist Config`.

The toolbar supports:

- Answer.
- Hold.
- Mute.
- Transfer.
- Hang Up.
- Conditional split-button abnormal end reason selection for active voice/video calls; the caret is hidden when no active reason applies.
- Ready / Not Ready toggle.
- Timer display.
- More menu for Outbound Call; toolbar Settings is temporarily hidden.
- Customer-number Outbound Call and Customer Information outbound actions require an active AUX configured with `Support Outbound` and retain the `Miss Information` or `Financial Risk` business reason. Ordinary Agents keep the TL approval request/result flow, while TL-and-above accounts call directly. Any eligible nonempty Customer Information phone number can initiate that flow without KBV completion. A completed external Call creates a background `Outbound Call` voice interaction carrying the dialed number, keeps the current workspace focused instead of opening a customer screen pop, and enters `Talking`. `Transfer Number` remains a TL-and-above permission, hidden from `888888` and available to `666666` without additional approval.
- In `Outbound Call > Call Agent`, ordinary Agents see only SPV and TL records; TL-and-above roles see the complete agent list. Calling an agent does not require an outbound AUX and enters a background `Outbound Call` voice interaction without a customer screen pop.
- `Channel Simulation > Transferred Call` is local-only and opens a PSTN receiving-seat preview with source-agent transfer metadata; it is a local demo visualization, not a real routed call.
- Call identification display: `IVR: {ANI Number}` for PSTN and `HaloApp: {BCAID}` / `HaloApp: Guest` for HaloApp voice and video; the current HaloApp BCAID mock is `00012345`. Future Webchat voice/video follows `Webchat: {BCAID}` / `Webchat: Guest-0001`.
- Skill display during active call lifecycle; outbound number and agent calls display `Skill -`.

### Agent Workspace

Workspace tabs include:

- Home.
- Monitor, opened from Monitoring menu items.
- BankApp Demo.
- Webchat Demo.
- WhatsApp Demo.
- Live Chat.
- Dynamic call tabs for PSTN / Voice Call / Video Call.
- Closable management page tabs opened from the left menu, including Call Management, Routing Config, and local-only Employee Management / Design System entries when visible.

Active calls cannot be closed from the tab. Ended call tabs can be closed.
Only the Home workspace tab keeps an icon; other top workspace tabs are text-first to keep the tab bar compact.

Visible management pages open inside `AgentWorkspace` as closable tabs instead
of replacing the workbench. Clicking the same left-menu management item reuses
the existing page tab. Direct visits to registered management URLs are kept as
compatibility entries: the route opens the matching page tab and navigates back
to `/` so active customer service tabs remain available.

The Home and Monitor tabs can display customer-provided static monitoring
screenshots from the `Monitoring` side menu:

- `Home-Agent`, `Home-TL`, and `Home-SPV` replace the fixed Home tab image.
- `Monitor-TL` and `Monitor-OM` open or reuse the closable Monitor tab.
- This is a static screenshot demo only. It does not add TL / SPV / OM login
  roles, permissions, live reporting data, or monitoring interactions.

### Inbound / Voice Workspace

Inbound voice workspace uses the shared three-column layout:

- Left: Customer Information, Customer Journey, Ticketing History, Next Best Action, Quick Action.
- Center: CRM workspace, Conversation tab when applicable, dynamic business tabs.
- Right: Assistant, Common Links, and optional extra tabs.

PSTN initially shows an unidentified customer. After voice KBV passes, AICC requests the CIS from CRM through a same-origin DEMO `postMessage` bridge and refreshes the Customer Information, journey, ticket data, and structured CRM contact values from the mock CIS lookup. Manual Customer ID entry is not available. Customer Information provides a read-only all-channel contact viewer; real CRM iframe, origin allowlist, and customer-data API integration remain future work.

### Video Call Workspace

Video call uses the same interaction workspace and adds an OpenEye floating video window when the current active interaction is connected. BankApp video desktop sharing is initiated from the BCA-owned Haloapp client screenshot; the agent-side floating window only views the customer-shared screen.

### Live Chat Workspace

Current formal Live Chat uses `LiveChat2Page`:

- Current / History customer list.
- Unified WhatsApp, BankApp, and Webchat customer list.
- Customer list collapsed / expanded states.
- Sorting by access time or message time.
- Star color marker UI is hidden in the customer list; compatibility state remains local.
- Unread count aggregation on the Live Chat tab.
- Unanswered SLA warning / breach count aggregation on the Live Chat tab.
- SLA / unanswered timer display with a horizontal progress bar based on the breach threshold.
- Conversation workspace.
- Quick Replies tab.
- Public Quick Replies are maintained through `Call Management > Common Phrase`.
- Agent replies are checked against `Call Management > Sensitive Word` before sending.
- Message Record tab.
- Transfer modal.
- End Service / Close behavior.
- Message sending and local draft state.

This is still a front-end simulation, not a real message gateway integration.

### BankApp, Webchat, and WhatsApp Demo

BankApp supports:

- Voice.
- Video.
- Live Chat.
- Registered / Guest customer type.
- Customer-side screenshot flow using BCA-owned Haloapp V1.8 reference screens.
- Business selection and confirmation.
- Voice/video handoff to Agent Workspace.
- Live chat handoff to Live Chat.
- PIN verification mock.
- Customer-initiated video desktop-share mock with agent-side view-only behavior.

Webchat supports:

- Text-only customer-side simulation in the current scope.
- Registered / Guest customer type.
- Registered customer flow starts directly in queue without media selection, information input, or menu selection.
- Guest customer flow shows contact information / business selection before queue.
- Handoff to Live Chat as a new Webchat customer.
- Satisfaction rating / closed flow.

WhatsApp supports:

- Chat request flow.
- Business selection.
- Agent chat screenshot.
- Handoff to Live Chat.
- Satisfaction rating / closed flow.

### Email Workspace

The Email workspace is available from `Channel Simulation > Email` in both customer and local visibility profiles. Its menu action opens or reuses one closable `Email` workspace tab.

The current Email demo supports:

- Inbox, Sent, Drafts, and Trash folders with search and local counts.
- Email selection, read state, SLA progress, and related thread records.
- Reply, Save Draft, Edit Draft, and Send with local folder/thread updates. Forward requires a receiver and, after Send, removes the source and forwarding record from Inbox, Sent, Drafts, and Trash.
- Ignore with AD, Spam, or Sales Email reason; ignored messages move to Trash with SLA stopped.
- Trash recovery returns a trashed or ignored mock email to its original folder.
- The shared Customer Information, Customer Journey, Ticketing History, Next Best Action, and Quick Action column used by the other interaction workspaces; Email is shown as the access channel.
- The shared Live Chat `CrmPanel`, including the same CRM screenshot, `CRM / Email` tab styling, and closable CRM business-detail tabs.
- Ticket registration with linked single-select Category and Product, editable Summary / Note, and one-click draft generation.

Email message and Ticket changes are local component state. Closing and reopening the Email tab or refreshing the application restores the default anonymized mock data. Email verification is not exposed because no Email verification rule is confirmed. Email Record Inquiry and Email Template Deploy remain separate future scope.

### Social Media Workspace

The Social Media workspace is available immediately after Email under `Channel Simulation` in both customer and local visibility profiles. Its menu action opens or reuses one closable `Social Media` workspace tab.

The separate `Social Media > Interaction Log` menu opens `/social-media/interaction-log` as a registered workspace page tab. It is customer-visible and intentionally separate from `Call Management > Interaction Log`.

The current front-end demo provides anonymized social queue items across Facebook, Instagram, X, YouTube, LinkedIn, TikTok, App Store, and Google Play. Agents can filter by channel and item type (Chats, Comments, Mentions, Reviews), search the queue, inspect post context and conversation/detail views, switch between CRM preview and conversation, open the local CWU prototype, and send a local reply for a Review. All state resets when the tab is closed or the application refreshes.

Social Media does not add a real social-network API, authentication, delivery, moderation, routing, audit, persistence, or service-ending lifecycle in the current scope. The implemented Social Media Interaction Log is a front-end mock query page only.

### Call Management

Customer-visible Call Management pages:

- Verification Rules: current V2 KBV rule management.
- Global Control Configuration.
- Blacklist.
- Priority List.
- Common Phrase.
- Common Link.
- Quick Action Management.
- Common Number.
- Sensitive Word.
- AUX Reason Management.
- Abnormal End Reasons.
- Interaction Log.
- Login Log.

Legacy or hidden routes redirect to Verification Rules.

Interaction Log is implemented at `/call-management/call-record-query` and is
scoped to the current agent's Phone, BankApp Voice,
BankApp Video, BankApp DM, Webchat, and WhatsApp records. It uses Contact /
Call Type / Queue / Service Time / Ended By / Rating Score / QM Score to show the
customer-side identifier, queue context, start-end service time, service ending
metadata, customer satisfaction, and quality score.
Numeric QM Scores open a static third-party quality-management detail preview
in the current demo. The preview uses the customer-confirmed original image;
future unified sign-in integration will replace it with the corresponding
third-party detail page.
Its detail modal keeps the main area focused on playback or conversation
content and the right side focused on read-only CWU; it does not add a CRM
or customer detail card in the current scope. Voice and Video details use
left media playback, middle transcript, and right CWU columns; DM details use
conversation plus right CWU without an empty media column. Voice media stacks
Voice Recording Playback above the PSTN active-call Screen Recording Playback.
Video media uses an OpenEye-style vertical replay with two video panes and a
playback bar, without call-control buttons, labels, or icons. It intentionally excludes Email and Social Media
records; Email Record Inquiry remains future scope, and Social Media records are handled by the separate `Social Media > Interaction Log` module.

Login Log is implemented at `/call-management/login-log`. It queries Employee ID / Name through one Keyword field, Time Range, Operation, and Log Out Type. The list records Employee ID, Employee Name, Operation, Log Out Type, and Time. It defaults to the latest seven calendar days and sorts Time descending. Login rows display `-` for Log Out Type; manual log-out uses `User` and idle automatic log-out uses `System`. Browser-close and network-heartbeat detection require a backend/CTI service and are represented only by seeded System records in the current demo.

Abnormal End Reasons maintains agent-selectable abnormal end reasons for Voice,
Video, and DM service endings. `Normal` is the system default normal end reason
and is not listed as a maintainable abnormal reason. The default configuration
contains two disabled DM reasons only; Voice and Video remain available for future
management configuration, but have no preconfigured abnormal reason.

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

Routing Config media types currently include Voice, Video, DM, and Non-DM.
Non-DM is used for social channel comments, replies, mentions, and app-store
reviews. Instagram, LinkedIn, Facebook, X, Tik Tok, and YouTube support DM
and Non-DM media; AppStore and PlayStore support Non-DM only.
Channels Business Config lets DM and Non-DM select and preview one fixed
new-customer alert sound. Voice and Video continue to rely on OpenEye ringing;
the alert plays once for a new text/non-DM interaction only when the agent's
existing System prompt sound setting is enabled.
Skill Queues include a required Access Code field shown after VDN in lists
and add/edit/view forms. Keyword search includes Access Code.

### Employee Management

Employee Management is implemented in `main` but is local-only and hidden from customer profile builds. It is visible only when `VITE_APP_VISIBILITY_PROFILE=local`.

Current local-only page:

- Employee Profile.

Current behaviors:

- Admin-style filters for employee ID, employee name, AICC ID, organization unit, position type, employee status, and employee role.
- Add / Edit employee profile modal with English UI fields.
- Employee profile table with status badges and row actions.
- Password Reset action is a placeholder button with no backend effect.
- Agent Capacity Settings modal supports Skill Configuration and Other Configuration tabs.
- Skill Configuration selects Routing Config skill queues and stores Agent Weight / Skill Weight per selected skill.
- Other Configuration stores Live Chat Max Services per employee.
- All employee management data is local mock state; it is not connected to LDAP, HR, permission, or workforce management backends.

### Design System

`/design-system` documents and demonstrates the current component contracts. It is local-only when `VITE_APP_VISIBILITY_PROFILE=local`.

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
- Single-action agent sign-in with the current demo account's existing full-channel capability retained internally.
- Ready / Not Ready / AUX / Pre-AUX state handling.
- PSTN inbound call simulation.
- BankApp voice and video handoff.
- Video workspace with OpenEye floating client and screen-share demo.
- Shared InteractionWorkspace for voice, video, and live chat.
- Customer Information, verification, journey, tickets, next best actions, quick actions.
- CRM screenshot / fallback workspace.
- Assistant screenshot / fallback workspace.
- Common Links tab.
- Transfer, Outbound Call, Internal Chat, Agent Settings, Toolbar Settings, Call Flow Detail, Send Email, and read-only All Contact Details modals. Legacy Contact Management is local-only and disabled by default because customer contact information is CRM read-only.
- Live Chat workspace with customer list, conversation, message record, quick replies, and local message state.
- Monitoring side menu with static Home / Monitor dashboard screenshot switching.
- AI external side-menu group for Quality Manage and AI Assist Config.
- BankApp, Webchat, and WhatsApp customer-side simulations with screenshot assets.
- Customer-visible Email agent workspace with mailbox folders, shared customer context, the Live Chat CRM screenshot, message handling, thread records, and Ticket registration.
- Customer-visible Social Media agent workspace with queue filtering, social post/review handling, CRM preview, local CWU prototype, and review reply simulation.
- Customer-visible Social Media Interaction Log workspace page with channel/type/account/agent/team/time/duration/ticket/summary filters, role-scoped mock visibility, agent lookup, alert detail, and conversation detail.
- Call Management pages listed above.
- Abnormal End Reasons for abnormal Voice / Video / DM service end reasons.
- Interaction Log for current-agent Phone, BankApp Voice, BankApp Video, BankApp DM, Webchat, and WhatsApp history, with 30 mock records, Contact, Queue, Service Time, Ended By, End Reason, QM Score, playback/transcript details, and read-only mandatory CWU summary.
- Common Number feeds enabled IVR transfer targets in the call Transfer modal.
- Quick Action Management maintains global enabled quick actions, their display order, and Updated Time / Updated By metadata for the shared customer-context cards in call, Email, and Social Media workspaces. Common Phrase, Common Link, Common Number, Sensitive Word, AUX Reason, Abnormal End Reasons, and Verification Rules expose the same update metadata pattern in their management lists. A quick action continues to open the local CRM mock detail tab; its configured Link Address is a displayed business reference and does not navigate externally.
- Call Management page timestamps, including management audit columns, Interaction Log Service Time, Login Log Time, configuration Last saved, and date-range controls, use `DD-MM-YYYY HH:MM:SS`. Routing Config retains its existing timestamp presentation until its own migration.
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
- Webchat customer-side simulation currently covers text only; voice and video Webchat media are future scope.
- Email Record Inquiry and Email Template Deploy are not part of the current Email workspace scope.
- Social Media has no real social-network gateway, persistence, moderation, routing, audit, or service-ending lifecycle. Social Media Interaction Log is front-end mock data until backend query contracts are confirmed.
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
- Webchat text entry, queue, agent chat, and satisfaction rating images.
- WhatsApp chat request, business selection, agent chat, and satisfaction rating images.
- Monitoring dashboard images under `public/screenshots/monitoring/` for `Home-Agent`, `Home-TL`, `Home-SPV`, `Monitor-TL`, and `Monitor-OM`.

CRM and Assistant components keep code-based fallback UI if image loading fails.

## 13. Data and Persistence Boundaries

Important demo boundary:

- `useAppStore`: workspace tabs, call interactions, call/session end metadata, live chat sessions, BankApp flow flags, verification rules.
- `useAuthStore`: demo session.
- `useCallManagementStore`: blacklist, priority list, busy reasons, session end reasons.
- `useRoutingConfigStore`: routing configuration collections.
- `EmailPage` local state: mailbox messages, folders, drafts, reply/ignore handling, thread records, SLA stop state, and Ticket registration backed by the existing internal CWU mock field.

These are front-end stores. They are not connected to production APIs. Most changes reset after refresh or new session.

## 14. Known Risks

- The project is UI-heavy and interaction-heavy, with limited automated test coverage.
- Build has historically shown a Vite / Rolldown large chunk warning.
- Browser visual verification is still important after any frontend change.
- Call state currently supports only one active voice/video call at a time.
- Closing a Video Call tab does not automatically hang up; Hang Up is the authoritative call end action.
- Email is a front-end workflow simulation with no mailbox, SMTP, attachment, template service, or Ticket backend integration.
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
