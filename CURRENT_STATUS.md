# BANK 1 AICC Demo V2 - Current Status

Last updated: 2026-07-22 16:25 +08:00

## 1. Overall Status

The project is a mature front-end demo for BANK 1 AICC. It includes authentication, global shell, agent status and call toolbar, inbound voice workspace, BankApp, Webchat, and WhatsApp customer simulations, video demo, live chat workspace, static Monitoring screenshots, call management configuration, routing configuration, local-only employee management, and a local-only design system page. Visible management pages now open as closable workspace tabs so agents can switch back to active call, popup, and Live Chat tabs.

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
- Customer-visible Monitoring menu for static Home / Monitor dashboard screenshot switching.
- Customer-visible `AI` side-menu group with `Quality Manage` and `AI Assist Config` external links; both open a new browser tab without changing the current workspace.
- Route-aware menu selection.
- Left-menu management entries open or reuse workspace page tabs instead of replacing the workbench.
- Registered management-page URLs remain compatible by opening the matching workspace tab and returning to `/`.
- Unified customer/local visibility profile for local-only menus and guarded routes.
- Header notification button.
- Header Internal Chat entry.
- Agent profile area.
- Header uses separate brand, call-toolbar, and right-action regions; profile name and team/status text truncate within compact fixed widths.
- Single-action Sign In; the former service-mode selector is removed from the profile menu and header.
- Profile menu follows explicit Unsigned / Not Ready / Ready / Pre-AUX / AUX state branches, with current status displayed beside the team name.
- Status after Sign-in is shared Global Control Configuration, defaults to Not Ready, and applies to the next sign-in in the current browser session.
- Global Control labels `System Idle Log-out Timeout` and `Auto Log-out Warning Lead Time` distinguish the system timeout from its pre-log-out warning and from the agent toolbar Sign Out action.
- Sign out confirmation and active-service block.
- AUX reason menu from Busy Reason.
- All Not Ready states expose Busy Reason AUX options; in After Call Work, choosing one cancels the saved Global Control countdown so agents can extend CRM editing time.
- Agent Settings entry separated at the bottom of the profile menu with system prompt sound on/off control.

## 5. Completed Agent and Call Toolbar

- Agent status model: Unsigned, Ready, Not Ready, AUX, Pre-AUX.
- The current demo account retains its existing Voice + Digital-equivalent channel capability internally; no service mode is exposed to the agent.
- Call statuses: Idle, Incoming, Talking, Hold.
- Answer, Hold, Transfer, Hang Up.
- Hang Up uses a split-button: the main action performs normal end, and the caret selects an abnormal end reason.
- Ready / Not Ready toggle.
- Timer display.
- Global Control `Auto Cancel ACW Duration` drives the next voice/video After Call Work timer.
- Toolbar More menu currently exposes Outbound Call; toolbar display settings are hidden from the More menu.
- Outbound Call modal entry with per-number TL approval before external calling is enabled.
- Call identification and Skill display during call lifecycle.
- Active-call and not-ready handoff warnings.

## 6. Completed Workspace Tabs

- Home tab.
- Home tab displays the selected static monitoring Home screenshot, defaulting to `Home-Agent`.
- Home is the only top workspace tab that keeps an icon; other top workspace tabs are text-first.
- Closable Monitor tab opens from Monitoring menu items and displays the selected static Monitor screenshot.
- BankApp Demo tab.
- Webchat Demo tab.
- WhatsApp Demo tab.
- Email workspace source is retained but its customer menu entry is temporarily hidden.
- Fixed Live Chat tab.
- Dynamic PSTN / Voice Call tabs.
- Dynamic Video Call tabs.
- Closable workspace page tabs for visible Call Management, Routing Config, local-only Employee Management, and local-only Design System pages.
- Duplicate management page tabs are prevented by stable `page:*` tab keys.
- Ended call tab close behavior.
- A new voice/video interaction automatically removes all ended voice/video tabs and their embedded CRM workspaces, leaving only the latest call available for CRM editing.
- Active call tab close protection.
- Live Chat unread, duration, and unanswered SLA alert display.

## 7. Completed Inbound Voice Workspace

- Shared `InteractionWorkspace` layout.
- PSTN call simulation.
- BankApp voice workspace.
- Unidentified PSTN customer initial state.
- Customer identity refresh demo.
- Customer Information card.
- Customer Information card includes a compact `Special Handling` action that opens a read-only static demo modal.
- Customer Information verification action is channel-aware: PSTN and BankApp Voice use compact `KBV`; logged-in BankApp text uses compact `PIN`; BankApp text guest, Webchat text, and unsupported channels hide the action.
- Guest customer information is channel-aware: text-channel guests keep the entered name / phone / email with customer ID shown as `-`, while BankApp voice / video guests show generated `Guest-06290001`-style names, the entered phone number, and `-` for unavailable fields.
- Customer Verification V2 right-side tab for KBV.
- Call Flow Detail modal.
- Send Email modal.
- Contact Management modal.
- Unified TL approval demo for external outbound number, external transfer number, and customer-phone outbound actions. A pending request opens a separate TL simulation popup over the supplied complete dashboard image, approvals use a fixed two-minute timeout, and the component-styled bottom-right result popup can include an optional TL note.
- Customer Journey.
- Ticketing History.
- Next Best Action.
- Quick Action.
- Dynamic CRM business tabs.
- CRM screenshot with fallback.
- Assistant screenshot with fallback.
- Common Links tab.
- Verification tab for side-by-side CRM comparison.
- Call Transfer modal includes Transfer IVR targets from Common Number.
- Voice Transfer supports Ready-only agent filtering, SPV/TL priority ordering, consultation cancellation, a compact Actions column, release transfer for skill / IVR, immediate approved number transfer with retryable deterministic failure, and conference mode that temporarily disables toolbar Transfer.
- Transfer success/failure uses an English banner below the toolbar. The local-only `Channel Simulation > Transferred Call` preview shows a green transfer icon after the channel duration without consuming customer-card action space.

## 8. Completed Video Call Workspace

- Video Call workspace using the shared interaction layout.
- BankApp video customer profile.
- OpenEye floating client overlay.
- OpenEye screenshot rendering.
- BankApp video desktop sharing is customer-initiated from the BCA-owned Haloapp client screenshot.
- Agent-side video floating window only views the customer-shared screen.
- Video calls hide the toolbar Transfer action.
- Hang Up hides OpenEye overlay and resets share state.

## 9. Completed Live Chat Workspace

- Formal `Live Chat` tab uses the `LiveChat2Page` implementation.
- Current / History customer list.
- Unified WhatsApp / BankApp / Webchat customer list; channel filter controls are hidden for the three-channel demo.
- Customer panel collapse / expand.
- Access-time and message-time sorting.
- Star color state remains for compatibility, but the customer list star marker UI is hidden.
- Unread clearing on focus.
- SLA / unanswered state with a horizontal unanswered progress bar in expanded and collapsed customer list states.
- Live Chat workspace tab aggregates unanswered warning and breach customer counts with compact colored badges.
- Conversation workspace.
- Webchat active conversations show a static floating `Customer is typing` indicator above the agent composer for demo purposes.
- Send message local state.
- End Service / Close session behavior.
- End Service uses a split-button: the main action keeps the normal confirmation modal, and the caret selects an abnormal end reason without a second confirmation.
- Customer-ended mock session handling.
- Transfer modal from conversation.
- Quick Replies right-side tab.
- Public Phrases in Quick Replies are sourced from Call Management common phrase configuration.
- Agent replies are blocked before sending when they match Call Management sensitive words.
- Message Record right-side tab.
- Local recall state.

## 10. Completed BankApp Demo

- Customer-side BankApp stage.
- Voice / Video / Live Chat channel selection.
- Registered / Guest customer type.
- V1.8 Haloapp flow screenshots extracted from the customer requirements document for channel, guest input, queue, connected, PIN, sharing, and satisfaction states.
- Customer-side text pages are presented as BCA-owned read-only screenshots; Netinfo behavior is shown as SDK/API handoff and agent workspace handling.
- Service closed screenshot.
- Voice handoff to Agent Workspace.
- Video handoff to Agent Workspace.
- Live Chat handoff to Live Chat workspace.
- PIN verification can be opened from the agent Customer Information card for logged-in BankApp text customers; the displayed PIN page is marked as BCA-owned and returns success / failed results to Netinfo.
- Voice client screenshots retain keypad capability for IVR transfer scenarios.

## 11. Completed WhatsApp Demo

- Customer-side WhatsApp simulation.
- Chat request screenshot.
- Business selection screenshot.
- Agent chat screenshot.
- Live Chat handoff.
- Satisfaction rating screenshot.
- Reuses BankApp demo framework with WhatsApp-specific steps.

## 12. Completed Webchat Demo

- Customer-side Webchat simulation is available from Channel Simulation below BankApp.
- Current scope is text only; voice and video media are not yet implemented.
- Registered customers queue directly without media selection, customer information input, or business menu selection.
- Guest customers show contact information / business selection before queue.
- Webchat handoff opens Live Chat with a new Webchat customer session.
- Webchat PIN verification is temporarily hidden pending customer confirmation.
- Webchat queue, agent chat, and satisfaction rating use the latest desensitized screenshots from the customer Webchat folder.

## 13. Implemented but Temporarily Hidden Email Workspace

- Email workspace implementation is retained in source but has no Channel Simulation menu entry in the current customer demo because the work is incomplete.
- When re-enabled, Email opens or reuses one closable Email workspace tab; closing it falls back to Home.
- Four-part desktop workspace for mailbox folders, customer context, Mail / CRM content, and thread records.
- Inbox, Sent, Drafts, and Trash folder switching with search, refresh feedback, counts, selected mail, read state, and SLA progress.
- Reply and Forward compose flows with anonymous BANK 1 addresses, built-in response templates, basic rich-text controls, Save Draft, and Send.
- Sending adds a Sent record and related thread item; replying marks the source email replied and stops its SLA.
- Drafts can be opened and edited; Trash has a recover flow back to Inbox.
- Ignore supports AD, Spam, and Sales Email reasons, keeps the email in Inbox, and stops its SLA.
- Customer context reuses Customer Information, Journey, Ticketing, NBA, and Quick Action components.
- CRM is code-built with BANK 1-safe content and no legacy customer screenshot.
- CWU drawer supports Business Type, Summary, one-click generation, and local confirmation.
- Email verification is hidden because Email verification rules are not confirmed.
- All Email workflow state is front-end local state and resets after refresh or closing/reopening the tab.
- Email Record Inquiry and Email Template Deploy are not implemented in this scope.

## 14. Completed Call Management

Customer-visible pages:

- Verification Rules, implemented as Verification Rule V2.
- Global Control Configuration.
- Blacklist.
- Priority List.
- Common Phrase.
- Common Link.
- Common Number.
- Sensitive Word.
- Busy Reason.
- Abnormal End Reasons.
- Interaction Log.

These pages open from the left menu as closable workspace tabs. Direct `/call-management/*` visits open the matching workspace tab and return to `/`, preserving active interaction tabs.

Implemented behaviors:

- Verification Rule V2 CRUD.
- Verification Rule V2 Question Bank.
- Rule preview using agent verification modal.
- Scenario-based KBV question model.
- Blacklist add / batch add / delete.
- Priority list add / batch add / delete.
- Priority Match Rule filtering.
- Common phrase category and phrase CRUD.
- Common phrase batch move between categories.
- Public phrase linkage into the Live Chat Quick Replies tab.
- Common link CRUD for website name, website address, and remark.
- Common Link feeds the shared right-side Common Links tab in voice, video, and Live Chat workspaces.
- Common number CRUD for IVR transfer target name, number, status, and remark.
- Enabled common numbers feed the call Transfer modal `Transfer IVR` tab.
- Sensitive word CRUD with fixed category dictionary.
- Sensitive word detection in Live Chat agent reply sending.
- Busy reason keyword/status filtering and editing.
- Abnormal End Reasons CRUD for abnormal Voice, Video, and DM service end reasons.
- Abnormal End Reasons filters by Keyword, Applicable Media, and Status.
- Interaction Log for current-agent Phone, BankApp Voice, BankApp Video, BankApp DM, Webchat, and WhatsApp records, seeded with 30 mock records.
- Interaction Log filters by keyword, channel, media type, ended by, end reason, and date range, defaulting to the current day.
- Interaction Log list separates Customer Name / Customer ID and Agent Name / Agent ID, shows Contact, Queue, Service Time, Ended By, End Reason, and QM Score.
- Numeric QM Scores open a read-only third-party QM system-window preview at the source image ratio; only the source image's top-right X closes it, and empty scores render as non-interactive `-`.
- Interaction Log details use a consistent layout: Voice and Video show left media playback, middle transcript, and right read-only CWU; DM shows conversation bubbles plus right read-only CWU without an empty media column.
- Interaction Log treats CWU summary as mandatory and read-only in the query page, so Summary Status, Summary Time, and edit actions are not exposed.
- Interaction Log uses `Contact` for the customer-side identifier: phone and WhatsApp numbers, BankID for logged-in BankApp/Webchat, and guest IDs for guest Webchat.
- Email and Social Media records are intentionally excluded from Interaction Log in the current scope.
- Local store state for demo changes.

## 15. Completed Routing Config

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

These pages open from the left menu as closable workspace tabs. Direct `/routing-config/*` visits open the matching workspace tab and return to `/` while preserving feature-flag redirects.

Implemented behaviors:

- Admin-style query toolbars.
- Add / Edit / View / Delete modal patterns where applicable.
- Status badge display.
- Channel media business config.
- Routing Config media type options include Voice, Video, DM, and Non-DM.
- Instagram, LinkedIn, Facebook, X, Tik Tok, and YouTube support DM plus Non-DM; AppStore and PlayStore support Non-DM only.
- Channels Edit Channel media type selector shows all configured media types, while selected values drive the Business Config tabs.
- DM channel Business Config includes Queue Configuration for outside-service-hours, queue waiting, and queue timeout messages.
- Non-DM appears as a Business Config media tab with no configuration content in the current demo.
- Channels Business Config Agent Service warning and breach threshold labels include colored status dots that reuse Live Chat SLA warning and breach colors.
- Webchat-specific recall field.
- Phone account management disabled.
- Business Types `Source Business Code`.
- Skill Queues include required `Access Code` after `VDN` in list columns and Add / Edit / View forms; Keyword search includes Access Code.
- Skill Routing Rules batch behavior and duplicate handling.
- Working Time Plans hide internal plan IDs from query, list, editor, and preview surfaces.
- Local store state for demo changes.

## 16. Completed Local-Only Employee Management

Employee Management is implemented in `main` but is visible only when `VITE_APP_VISIBILITY_PROFILE=local`; customer/default profile hides the menu and redirects direct routes. In local profile, the page opens as a closable workspace tab.

Implemented page:

- Employee Profile.

Implemented behaviors:

- Admin-style query toolbar with Employee ID, Employee Name, AICC ID, Organization Unit, Position Type, Employee Status, and Employee Role filters.
- Add / Edit employee profile modal with English UI fields and optional Alias field.
- Employee profile table with status badges and row actions.
- Password Reset action is displayed as a placeholder button with no click effect.
- Agent Capacity Settings modal with Skill Configuration and Other Configuration tabs.
- Skill Configuration selects Routing Config Skill Queues first, then stores Agent Weight / Skill Weight for selected skills per employee.
- Other Configuration stores Live Chat Max Services per employee.
- Local mock store state for demo changes, seeded with 10 employee profiles.

## 17. Completed Design System

`/design-system` currently demonstrates the design system as a local-only closable workspace tab when `VITE_APP_VISIBILITY_PROFILE=local`:

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

## 18. Completed Assets

Current public assets include:

- Login illustration.
- CRM workspace screenshot.
- Assistant workspace screenshot.
- OpenEye video call screenshot.
- OpenEye share-selection screenshot.
- BankApp customer-side screenshots.
- Webchat customer-side screenshots.
- WhatsApp customer-side screenshots.
- Monitoring screenshots for `Home-Agent`, `Home-TL`, `Home-SPV`, `Monitor-TL`, and `Monitor-OM`.
- WhatsApp customer avatar.
- Icons and favicon.

## 19. Current Validation Baseline

Latest recorded validation:

- ESLint passed.
- Production build passed with existing large chunk warning.
- Browser smoke checks passed for workspace management-page tabs: left-menu open/reuse, close fallback, direct URL bridge, active PSTN tab coexistence, and customer/local visibility profile behavior.
- Email browser smoke checks passed for menu/tab lifecycle, Reply/Send, Draft editing, Ignore, Trash recovery, CRM, CWU, state reset, and 1366x768 / 1440x900 / 1920x1080 layout widths.
- Vercel production deployment completed at `https://netinfo-aicc-demo-v2.vercel.app` with `VITE_APP_VISIBILITY_PROFILE=customer` and `VITE_ENABLE_ADMIN_MENUS=true`; post-deploy smoke confirmed AI links, Call Management tab opening, and hidden Employee Management / Design System.

## 20. Known Demo Boundaries

- No backend API integration.
- No real CRM SSO handoff.
- No real voice/video protocol.
- No real OpenEye integration.
- No real WhatsApp / BankApp / Webchat gateway.
- No real Email mailbox, SMTP, attachment, template deployment, record inquiry, or CWU backend integration.
- No real routing engine.
- No production persistence.
- No automated Playwright test suite.
- Employee Management is local-only mock data and does not connect to real LDAP, HR, workforce management, permission, or employee skill backends.

## 21. Current Branch State at Handoff

- Expected branch: `main`.
- Expected remote: `origin/main`.
- Future maintainers should run `git status --short --branch` before making changes.
