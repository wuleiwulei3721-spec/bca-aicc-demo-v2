# BANK 1 AICC Demo V2 - Current Status

Last updated: 2026-08-21 10:45 +08:00

## 1. Overall Status

The project is a mature front-end demo for BANK 1 AICC. It includes authentication, global shell, agent status and call toolbar, inbound voice workspace, BankApp, Webchat, and WhatsApp customer simulations, video demo, live chat workspace, static Monitoring screenshots, call management configuration, Social Media Interaction Log, routing configuration, local-only employee management, and a local-only design system page. Visible management pages now open as closable workspace tabs so agents can switch back to active call, popup, and Live Chat tabs.

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
- Global Control `Digital Media Capacity` configures active service capacity through `Max Digital Media Services` (default 3) and Live Chat Current ended-session retention through `Max Live Chat Ended Session Retention` (default 10).
- Header Log Out first blocks active call, Live Chat, or Live Chat 2 services; when no service is active, it blocks signed-in Ready and Pre-AUX states until the agent switches to Not Ready or AUX. Unsigned, Not Ready, and AUX states then use a confirmation dialog.
- Idle system log-out monitors Unsigned, Not Ready, and AUX states, resets on window activity or warning dismissal, shows a pre-expiry warning, and returns to Login at the configured timeout.
- Sign out confirmation and active-service block.
- AUX reason menu from Busy Reason.
- All Not Ready states expose Busy Reason AUX options; if a customer service remains active during After Call Work, choosing one displays Pre-AUX while the saved Global Control countdown continues and then automatically enters AUX.
- Agent Settings entry separated at the bottom of the profile menu with system prompt sound on/off control.

## 5. Completed Agent and Call Toolbar

- Agent status model: Unsigned, Ready, Not Ready, AUX, Pre-AUX.
- The current demo account retains fixed full-channel capability internally; no service mode is exposed to the agent and no legacy service-mode mismatch prompt is shown.
- Call statuses: Idle, Incoming, Talking, Hold.
- Answer, Hold, Transfer, Hang Up.
- Hang Up uses a split-button only when its current media has an active abnormal end reason; otherwise it remains the normal single Hang Up action.
- The toolbar restores the Ready / Not Ready button. Default Not Ready sign-in can enter Ready once, then keeps Ready visible but locked until a Voice or Video Incoming popup occurs; thereafter it supports normal two-way toggling for that signed-in session. Default Ready sign-in is immediately toggleable.
- Voice/video After Call Work remains Not Ready until its configured automatic Ready transition. When the agent chooses AUX during the call or ACW while another service remains active, the header profile retains Pre-AUX through ACW while the toolbar timer displays Not Ready, then the state automatically enters AUX without restarting the saved countdown.
- Timer display.
- Global Control `Auto Cancel ACW Duration` drives the next voice/video After Call Work timer.
- Toolbar More menu currently exposes Outbound Call; toolbar display settings are hidden from the More menu.
- Customer-number Outbound Call and Customer Information phone outbound use `Miss Information` or `Financial Risk`. Ordinary Agents can request TL/SPV approval before entering an eligible AUX, but the approved Call action requires an active AUX configured with `Support Outbound`; TL-and-above calls directly only from an eligible AUX. Switching between eligible outbound AUX reasons retains pending and approved requests; leaving all eligible AUX reasons or disabling the last eligible reason invalidates them. Both completed Call actions create and focus an `Outbound Call` customer workspace carrying the dialed number, then enter the same `Talking` state. The Call Number form uses aligned, icon-free controls.
- `Outbound Call > Call Agent` shows only SPV and TL entries for every role. Calling an agent requires an active AUX configured with `Support Outbound`, but does not use external-number approval.
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
- Customer and local profiles expose the Email workspace entry below WhatsApp.
- Customer and local profiles expose the Social Media workspace entry immediately below Email.
- Customer profiles expose a separate `Social Media > Interaction Log` workspace-page entry.
- Fixed Live Chat tab.
- Dynamic PSTN / Voice Call / Outbound Call tabs.
- Dynamic Video Call tabs.
- Closable workspace page tabs for visible Call Management, Routing Config, local-only Employee Management, and local-only Design System pages.
- Closable workspace page tab for the visible Social Media Interaction Log page.
- Duplicate management page tabs are prevented by stable `page:*` tab keys.
- Ended call tab close behavior.
- A new voice/video interaction automatically removes all ended voice/video tabs and their embedded CRM workspaces, leaving only the latest call available for CRM editing.
- Active call tab close protection.
- Live Chat unread, duration, and unanswered SLA alert display.

## 7. Completed Inbound Voice Workspace

- Shared `InteractionWorkspace` layout.
- PSTN call simulation.
- BankApp voice workspace.
- Unidentified PSTN customer initial state with anonymous caller number, `-` email/CIS, and no CRM-dependent customer actions.
- KBV-approved CRM CIS customer-information refresh demo: no manual Customer ID entry; valid same-origin CRM postMessage responses refresh profile, journey, and ticket history while retaining `Verified`.
- Customer Information card.
- CRM-identified Customer Information cards include a compact `Special Handling` action that opens a read-only static demo modal; it is hidden before identity refresh and for Guests.
- Customer Information verification action is channel-aware: PSTN and BankApp Voice use compact `KBV`; logged-in BankApp text uses compact `PIN`; BankApp text guest, Webchat text, and unsupported channels hide the action.
- Guest customer information is channel-aware: text-channel guests keep the entered name / phone / email with customer ID shown as `-`, while BankApp voice / video guests show generated `Guest-06290001`-style names, the entered phone number, and `-` for unavailable fields.
- Customer Verification V2 right-side tab for KBV.
- KBV V2 captures HaloApp Voice login status from the first handoff. All HaloApp rules expose `Same for Both` / `Logged In` / `Not Logged In` in management; Perbankan and Kartu Kredit use HaloApp-only logged-in 3-answer rules plus multi-channel Phone/HaloApp-not-logged-in 5- and 4-answer rules respectively, while other skills retain one `Same for Both` configuration. Rule rows support Copy and prevent overlapping enabled conditions.
- Call Flow Detail modal: PSTN displays IVR Journey only; BankApp Voice / Video and digital channels display the customer-selected Business Menu Selection Record instead. The BankApp demo defaults to `Credit Card`. Transfer History is always shown and includes the current agent's active service row with `-` duration / transfer time until completed.
- Send Email modal.
- CRM-backed read-only customer contact display with an `IdcardOutlined` `All Contact Details` header viewer. Its grouped left-channel/right-value list supports multi-value and empty CRM states while reusing the legacy editor's channel icons. Legacy Contact Management DEMO is local-only and disabled by default.
- Two Demo login identities: `888888 / 888888` is Agent Budi Kartika (`EMP-10027`) and `666666 / 666666` is TL Maya Santoso (`EMP-10108`) with a distinct female avatar. Both use the same workbench; TL receives `transfer:external-number`, which displays `Transfer Number` with consultation-first transfer and conference actions. Ordinary Agent Call Agent lists are limited to SPV and TL records; TL sees all records. Only ordinary-Agent external outbound and customer-phone calls create TL approvals. Pending requests remain valid when the seat closes its originating modal to handle other work; only a number or Reason change, execution, or Log Out makes the prior request unusable. Pending requests share one masked TL simulation window and are processed as a FIFO queue, with the centered approval Modal displaying the current item, remaining-queue count, and optional TL note without a countdown; it closes after the final item is resolved. A real first request creates one TL-page-only mock follow-up after five seconds if it remains pending. Both seat-side entries show `Requesting...` while pending, and the Customer Information request action appears only while its phone row is hovered or keyboard-focused. The result modal uses concise `Approval Granted` or `Approval Rejected` copy, keeps Outbound, number, and Reason on its primary row, places optional Note beneath it, and stays open until manually closed.
- Customer Journey: Phone, BankApp, Webchat, WhatsApp, Email, and Social Media history. Phone, BankApp, Webchat, and WhatsApp rows derive the displayed value from the Category of every Ticket in the linked Interaction Log record, show `-` when no Ticket exists, omit success/failure icons, and reuse its media-specific read-only detail modal; Email and Social Media retain the existing Interaction Detail modal.
- Ticketing History displays one-line-ellipsized Ticket Category, CRM Ticket ID, and created date; Ticket Category is also used as the dynamic CRM tab title.
- Shared CRM Ticket modal for inbound voice, video, and digital workspaces: it uses the Transfer / Outbound dialog component and is positioned at the right side of the workspace. The compact `Ticket` header retains the light-blue title treatment, rounded modal frame, and standard right-side close. Its one white content surface matches the Customer Information outbound-reason modal. Product / Category / Summary / Note labels are bold; One-Click Generation remains normal weight. Category and Product are searchable single-select dropdowns, with Product disabled before Category and filtered by the supplied Category-Product mapping; long selected values use the standard fixed-height one-line ellipsis, with the arrow right-aligned and vertically centered. All four control values use 12px primary text and an 18px line height. Summary has a visible 250-character limit and Note has a 1000-character limit; both counts are normal-weight 11px text inside the lower-right of the editor. The white form body scrolls independently while One-Click Generation stays at the left of the fixed footer and Cancel / Confirm stay on the right. All four fields are required. Each opening and One-Click Generation prepares an editable valid mock draft. Confirm saves an in-memory CRM ticket, clears the open form for the next ticket, and adds it to Ticketing History.
- Next Best Action.
- Quick Action.
- Dynamic CRM business tabs.
- CRM screenshot with fallback.
- Assistant screenshot with fallback.
- Common Links tab.
- Verification tab for side-by-side CRM comparison.
- Call Transfer modal includes Transfer IVR targets from Common Number.
- Voice Transfer supports Ready-only agent filtering, Agent-only SPV/TL transfer-target visibility, SPV/TL priority ordering, consultation cancellation for agent and number targets, a compact Actions column, release transfer for skill / IVR, consultation-first number transfer with retryable deterministic failure, and conference mode that temporarily disables toolbar Transfer.
- Active PSTN voice shows `IVR: 08123456789`; HaloApp voice/video shows `HaloApp: 00012345` for logged-in customers or `HaloApp: Guest` for guests.
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
- Current / History customer list. Current unifies active service sessions up to the Global Control `Max Digital Media Services` limit (default 3) and recently ended Live Chat sessions up to `Max Live Chat Ended Session Retention` (default 10) for continued CRM editing; Close or the next retention-capacity eviction moves an ended session to History.
- Unified WhatsApp / BankApp / Webchat customer list; channel filter controls are hidden for the three-channel demo.
- Customer panel collapse / expand.
- Access-time and message-time sorting.
- Star color state remains for compatibility, but the customer list star marker UI is hidden.
- Unread clearing on focus.
- SLA / unanswered state with a horizontal unanswered progress bar in expanded and collapsed customer list states.
- Live Chat workspace tab aggregates unanswered warning and breach customer counts with compact colored badges.
- Conversation workspace.
- Conversation header keeps only the total service duration; unanswered reminder timing remains in the customer list.
- Send message local state.
- End Service retains the completed session in Current without counting it as active service; Close moves it to History while keeping existing CRM behavior.
- New Live Chat handoffs stop at the configured `Max Digital Media Services` limit and remain in the customer-side simulated queue when capacity is full.
- End Service uses a split-button only when DM has an active abnormal end reason; otherwise it remains the normal confirmation-based End Service action.
- Customer-ended mock session handling.
- Transfer modal from voice and conversation workspaces; ordinary Agents see only SPV and TL transfer targets, while TL and other roles see all targets.
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
- PIN verification can be opened from the agent Customer Information card for logged-in BankApp text customers; the displayed PIN page is marked as BCA-owned and returns success / failed results to Netinfo. Hovering the failed verification status shows the PIN input error; when locked, the disabled PIN action shows the attempt-limit reason.
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

## 13. Implemented Email Workspace

- `Channel Simulation > Email` is available in both customer and local visibility profiles.
- Email opens or reuses one closable Email workspace tab; closing it falls back to Home.
- High-density desktop workspace for mailbox folders, shared customer context, `CRM / Email` content, and the thread record rail inside Email.
- Inbox, Sent, Drafts, and Trash folder switching with search, refresh feedback, counts, selected mail, read state, and SLA progress.
- Reply and Forward compose flows with anonymous BANK 1 addresses, built-in response templates, basic rich-text controls, Save Draft, and Send. A sent Forward removes both its source and forwarding record from all four folders; a saved Forward draft retains that behavior when later sent.
- Sending a Reply or normal draft adds a Sent record and related thread item; replying marks the source email replied and stops its SLA.
- Drafts can be opened and edited; Trash has a recover flow back to Inbox.
- Ignore supports AD, Spam, and Sales Email reasons, moves the email to Trash, and stops its SLA.
- Customer context directly reuses the shared Customer Information, Journey, Ticketing, NBA, and Quick Action column; Customer Information shows Email as the access channel.
- The workspace directly reuses Live Chat's `CrmPanel`: CRM uses the same screenshot and Email replaces the visible Conversation label while keeping the same tab styling.
- The shared customer context column is fixed at 280px in the Email layout. Mailbox folders use solid green, blue, orange, and red icon circles with a subtle active background; search uses one prefixed input plus a separate refresh control.
- Ticket modal reuses the shared CRM Ticket component: Category and Product use searchable single-select dropdowns, Product is filtered by Category, Summary and Note are editable required fields, and One-Click Generation creates an editable valid mock draft from the left of the fixed footer. Summary is limited to 250 characters, Note to 1000, and both show a normal-weight 11px lower-right in-input count. Confirm clears the retained right-side modal after local CRM save. Email and interaction workspaces share the same below-toolbar success notice, and Email no longer renders a separate Ticket saved status badge. The internal CWU mock stores the selected Category and Product as single values.
- Email verification is hidden because Email verification rules are not confirmed.
- All Email workflow state is front-end local state and resets after refresh or closing/reopening the tab.
- Email Record Inquiry and Email Template Deploy are not implemented in this scope.

## 14. Implemented Social Media Workspace

- `Channel Simulation > Social Media` is available in both customer and local visibility profiles, directly below Email.
- Social Media opens or reuses one closable workspace tab; closing it falls back to Home.
- The standalone agent workspace provides search, channel and item-type filters, reply SLA progress, a queue for Chats / Comments / Mentions / Reviews, CRM preview, post detail, and local CWU prototype states.
- Review items include a local draft and Send reply interaction. Queue, filters, drafts, replies, CWU, and active selection reset after refresh or closing/reopening the tab.
- Demo data covers Facebook, Instagram, X, YouTube, LinkedIn, TikTok, App Store, and Google Play using anonymized mock content.
- The separate `Social Media > Interaction Log` page is customer-visible. It uses anonymized mock records for Twitter, Facebook, Instagram, YouTube, TikTok, and LinkedIn; supports channel, message type, customer account, agent, team, BCA account, ticket type, mandatory customer-contact time range, distribution time, first-response time, response-duration, and summary filters; exposes agent lookup; and provides alert and conversation detail modals.
- Social Media Interaction Log applies current front-end role scoping: OM, RTFM, SPV, and TL can view all seeded records; ordinary agents see only records assigned to their session display name.
- The Social Media workspace and Social Media Interaction Log do not add real social API delivery, authentication, moderation, persistence, routing, or service-ending behavior.

## 15. Completed Call Management

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
- Login Log.

These pages open from the left menu as closable workspace tabs. Direct `/call-management/*` visits open the matching workspace tab and return to `/`, preserving active interaction tabs.

Implemented behaviors:

- Verification Rule V2 CRUD.
- Verification Rule V2 Question Bank.
- Rule preview using agent verification modal.
- Scenario-based KBV question model.
- Blacklist required-channel batch add with a Status switch defaulting to Enabled, dedicated editable `062` Phone country code / phone number mode, a Country Code list column (`-` for non-Phone channels), fixed non-Phone `Prohibit Transfer to Agent` policy, duplicate preview/skip, inline enabled/disabled list Status switch, status filtering, Reason, and delete.
- Priority list add / batch add / delete with required Reason.
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
- Busy reason Productivity Type (`Productive` / `Non-Productive`) filtering and editing, plus a read-only list `Support Outbound` status maintained by a switch in the edit modal. `Callback Finrisk` and `Callback Misinform` are the active default customer-outbound AUX reasons; disabled reasons cannot be selected for outbound permission.
- Abnormal End Reasons CRUD for configurable Voice, Video, and DM service end reasons, seeded with two active DM reasons only.
- Abnormal End Reasons filters by Keyword, Applicable Media, and Status.
- Interaction Log for current-agent Phone, BankApp Voice, BankApp Video, BankApp DM, Webchat, and WhatsApp records, seeded with 30 mock records.
- Interaction Log filters by keyword, channel, media type, call type, ended by, rating score, and date range, defaulting to the current day.
- Interaction Log list separates Customer Name / Customer ID and Agent Name / Agent ID, shows Contact, Call Type, Queue, Service Time, Ended By, Rating Score, and QM Score.
- Numeric QM Scores open a read-only third-party QM system-window preview at the source image ratio; only the source image's top-right X closes it, and empty scores render as non-interactive `-`.
- Interaction Log Rating Score is `1` to `5` or `-`; PSTN is not interaction-bound to its periodic satisfaction outreach and renders `-`, while BankApp, Webchat, and WhatsApp mock records include stored ratings with optional feedback.
- Interaction Log details use a consistent layout: Voice and Video show left media playback, middle transcript, and a read-only Ticket / Summary card plus Satisfaction panel on the right; DM shows conversation bubbles plus the same right-side panels without an empty media column. Each Ticket uses a CRM-style ID label and one plain Category text value styled like Summary; Product is retained but not displayed. Ticket entries and the single AI-generated service Summary are separated inside one scrollable card. Satisfaction shows stars and the final rating number without a denominator.
- Interaction Log treats CWU summary as mandatory and read-only in the query page, so Summary Status, Summary Time, and edit actions are not exposed.
- Interaction Log uses `Contact` for the customer-side identifier: phone and WhatsApp numbers, BankID for logged-in BankApp/Webchat, and guest IDs for guest Webchat.
- Email and Social Media records are intentionally excluded from `Call Management > Interaction Log`; Social Media records are shown only in the separate `Social Media > Interaction Log` page.
- Login Log records successful system Login plus manual and idle Log Out events in current demo memory. It defaults to the last seven calendar days, includes 19 seeded records across that period, and sorts Time descending. It filters combined Employee ID / Name keyword, Time Range, Operation, and Log Out Type; Login renders `-`, while manual and idle Log Out render `User` and `System` respectively.
- Local store state for demo changes.

## 16. Completed Routing Config

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
- Instagram, LinkedIn, Facebook, X, Tik Tok, and YouTube support DM plus Non-DM; Email, AppStore, and PlayStore support Non-DM only.
- Channels Edit Channel media type selector shows all configured media types, while selected values drive the Business Config tabs.
- Media types without available Business Config fields show the standard no-configuration information prompt.
- DM channel Business Config includes Queue Configuration for outside-service-hours, queue waiting (with `{queuePosition}`), long-wait threshold/message, and queue timeout threshold/message. Non-Phone Voice and Video include the same configuration except the long-wait threshold/message.
- DM and Non-DM Business Config both support selecting and previewing a fixed new-customer alert sound; the selected sound plays once on a new matching interaction when System prompt sound is enabled.
- Voice and Video Business Config do not show an alert-sound configuration and continue to use OpenEye ringing.
- Channels Business Config Agent Service warning and breach threshold labels include colored status dots that reuse Live Chat SLA warning and breach colors.
- Phone account management disabled.
- Business Types `Source Business Code`.
- Skill Queues include required `Access Code` after `VDN` in list columns and Add / Edit / View forms; Keyword search includes Access Code.
- Skill Routing Rules batch behavior and duplicate handling.
- Working Time Plans hide internal plan IDs from query, list, editor, and preview surfaces.
- Local store state for demo changes.

## 17. Completed Local-Only Employee Management

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

## 18. Completed Design System

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

## 19. Completed Assets

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

## 20. Current Validation Baseline

Latest recorded validation:

- ESLint passed.
- Production build passed with existing large chunk warning.
- Browser smoke checks passed for workspace management-page tabs: left-menu open/reuse, close fallback, direct URL bridge, active PSTN tab coexistence, and customer/local visibility profile behavior.
- Email browser smoke checks passed for customer/local menu visibility, menu/tab lifecycle, shared customer context, `CRM / Email`, the shared CRM screenshot, dynamic CRM tabs, Reply/Send, Save Draft, Ignore, Trash recovery, search, Ticket, state reset, and 1366x768 / 1440x900 / 1920x1080 layout widths without page overflow.
- Latest Vercel production deployment completed at `https://netinfo-aicc-demo-v2.vercel.app` with `VITE_APP_VISIBILITY_PROFILE=customer` and `VITE_ENABLE_ADMIN_MENUS=true`; post-deploy smoke confirmed the Email menu and workspace are customer-visible while Transferred Call, Employee Management, and Design System remain hidden.

## 21. Known Demo Boundaries

- No backend API integration.
- No real CRM SSO handoff.
- No real voice/video protocol.
- No real OpenEye integration.
- No real WhatsApp / BankApp / Webchat gateway.
- No real Email mailbox, SMTP, attachment, template deployment, record inquiry, or Ticket backend integration.
- No real routing engine.
- No production persistence.
- No automated Playwright test suite.
- Employee Management is local-only mock data and does not connect to real LDAP, HR, workforce management, permission, or employee skill backends.

## 22. Current Branch State at Handoff

- Expected branch: `main`.
- Expected remote: `origin/main`.
- Future maintainers should run `git status --short --branch` before making changes.
