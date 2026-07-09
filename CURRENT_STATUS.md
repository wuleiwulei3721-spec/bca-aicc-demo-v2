# BANK 1 AICC Demo V2 - Current Status

Last updated: 2026-07-08 11:30 +08:00

## 1. Overall Status

The project is a mature front-end demo for BANK 1 AICC. It includes authentication, global shell, agent status and call toolbar, inbound voice workspace, BankApp, Webchat, and WhatsApp customer simulations, video demo, live chat workspace, call management configuration, routing configuration, local-only employee management, and a local-only design system page.

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
- Unified customer/local visibility profile for local-only menus and guarded routes.
- Header notification button.
- Header Internal Chat entry.
- Agent profile area.
- Service mode sign-in.
- Sign out confirmation and active-service block.
- AUX reason menu from Busy Reason Management.
- Agent Settings entry separated at the bottom of the profile menu with system prompt sound on/off control.

## 5. Completed Agent and Call Toolbar

- Agent status model: Unsigned, Ready, Not Ready, AUX, Pre-AUX.
- Service modes: Voice only, Digital only, Voice + Digital.
- Call statuses: Idle, Incoming, Talking, Hold, Mute.
- Answer, Hold, Mute, Transfer, Hang Up.
- Hang Up uses a split-button: the main action performs normal end, and the caret selects an abnormal end reason.
- Ready / Not Ready toggle.
- Timer display.
- Toolbar More menu currently exposes Outbound Call; toolbar display settings are hidden from the More menu.
- Outbound Call modal entry.
- Call identification and Skill display during call lifecycle.
- Active-call and incompatible-service-mode handoff warnings.

## 6. Completed Workspace Tabs

- Home tab.
- BankApp Demo tab.
- Webchat Demo tab.
- WhatsApp Demo tab.
- Fixed Live Chat tab.
- Dynamic PSTN / Voice Call tabs.
- Dynamic Video Call tabs.
- Ended call tab close behavior.
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
- Outbound approval demo.
- Customer Journey.
- Ticketing History.
- Next Best Action.
- Quick Action.
- Dynamic CRM business tabs.
- CRM screenshot with fallback.
- Assistant screenshot with fallback.
- Common Links tab.
- Verification tab for side-by-side CRM comparison.
- Call Transfer modal includes Transfer IVR targets from Common Number Management.

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
- WhatsApp / BankApp / Webchat filtering.
- All-channel toggle.
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

## 13. Completed Call Management

Customer-visible pages:

- Verification Rules, implemented as Verification Rule V2.
- Global Control Configuration.
- Blacklist Management.
- Priority List Management.
- Common Phrase Management.
- Common Link Management.
- Common Number Management.
- Sensitive Word Management.
- Busy Reason Management.
- Session End Reason Management.
- Call Record Query.

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
- Common Link Management feeds the shared right-side Common Links tab in voice, video, and Live Chat workspaces.
- Common number CRUD for IVR transfer target name, number, status, and remark.
- Enabled common numbers feed the call Transfer modal `Transfer IVR` tab.
- Sensitive word CRUD with fixed category dictionary.
- Sensitive word detection in Live Chat agent reply sending.
- Busy reason edit and default selection.
- Session End Reason Management CRUD for abnormal Voice, Video, and DM service end reasons.
- Session End Reason Management filters by Keyword, Applicable Media, and Status.
- Call Record Query for current-agent Phone, BankApp Voice, BankApp Video, BankApp DM, Webchat, and WhatsApp records.
- Call Record Query filters by keyword, channel, media type, ended by, end reason, and date range.
- Call Record Query details show compact voice playback, OpenEye-style vertical video replay, or DM conversation bubbles on the left, plus CWU Registration on the right.
- Call Record Query allows local CWU Registration editing only for records ended within the last 24 hours.
- Call Record Query list separates Customer Name / Customer ID and Agent Name / Agent ID, shows Contact, Queue, Service Time, Ended By, and End Reason.
- Call Record Query treats CWU Registration summary as mandatory, so Summary Status and Summary Time are not exposed in the filter, list, or detail summary header.
- Call Record Query uses `Contact` for the customer-side identifier: phone and WhatsApp numbers, BankID for logged-in BankApp/Webchat, and guest IDs for guest Webchat.
- Email and Social Media records are intentionally excluded from Call Record Query in the current scope.
- Local store state for demo changes.

## 14. Completed Routing Config

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
- Local store state for demo changes.

## 15. Completed Local-Only Employee Management

Employee Management is implemented in `main` but is visible only when `VITE_APP_VISIBILITY_PROFILE=local`; customer/default profile hides the menu and redirects direct routes.

Implemented page:

- Employee Profile Management.

Implemented behaviors:

- Admin-style query toolbar with Employee ID, Employee Name, AICC ID, Organization Unit, Position Type, Employee Status, and Employee Role filters.
- Add / Edit employee profile modal with English UI fields and optional Alias field.
- Employee profile table with status badges and row actions.
- Password Reset action is displayed as a placeholder button with no click effect.
- Agent Capacity Settings modal with Skill Configuration and Other Configuration tabs.
- Skill Configuration selects Routing Config Skill Queues first, then stores Agent Weight / Skill Weight for selected skills per employee.
- Other Configuration stores Live Chat Max Services per employee.
- Local mock store state for demo changes, seeded with 10 employee profiles.

## 16. Completed Design System

`/design-system` currently demonstrates the design system when `VITE_APP_VISIBILITY_PROFILE=local`:

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

## 17. Completed Assets

Current public assets include:

- Login illustration.
- CRM workspace screenshot.
- Assistant workspace screenshot.
- OpenEye video call screenshot.
- OpenEye share-selection screenshot.
- BankApp customer-side screenshots.
- Webchat customer-side screenshots.
- WhatsApp customer-side screenshots.
- WhatsApp customer avatar.
- Icons and favicon.

## 18. Current Validation Baseline

Latest recorded validation before this documentation task:

- TypeScript check passed.
- ESLint passed.
- Production build passed with existing large chunk warning.
- HTTP smoke checks passed for recent Call Management / Routing Config pages.

This documentation task intentionally does not change runtime code.

## 19. Known Demo Boundaries

- No backend API integration.
- No real CRM SSO handoff.
- No real voice/video protocol.
- No real OpenEye integration.
- No real WhatsApp / BankApp / Webchat gateway.
- No real routing engine.
- No production persistence.
- No automated Playwright test suite.
- Employee Management is local-only mock data and does not connect to real LDAP, HR, workforce management, permission, or employee skill backends.

## 20. Current Branch State at Handoff

- Expected branch: `main`.
- Expected remote: `origin/main`.
- Future maintainers should run `git status --short --branch` before making changes.
