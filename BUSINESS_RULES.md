# BANK 1 AICC Demo V2 - Business Rules

Last updated: 2026-07-24 13:57 +08:00

This document records the currently implemented business behavior. It describes demo rules, not production backend contracts.

## 1. Authentication Rules

- `/login` is public.
- All business pages under `/` require an authenticated session.
- Demo login validates against two mock credentials: `888888 / 888888` creates Agent Budi Kartika, and `666666 / 666666` creates TL Maya Lestari.
- Successful login creates a session in `sessionStorage`.
- Invalid login shows an LDAP-style error message.
- If a session expires or cannot be parsed, it is removed and the user is sent back to `/login`.
- Log Out is blocked while there is an active customer service interaction.

## 2. Agent Sign-in Capability Rules

- The unsigned profile menu exposes `Sign In` and `Settings`, and does not expose a service-mode selector.
- Both demo accounts retain existing voice, video, and digital capability internally after sign-in. The TL account additionally has `transfer:external-number`; this delivery does not model channel eligibility from Employee Profile skill bindings.
- Voice/video and live-chat handoff still require the agent to be `Ready`; active-call protection remains unchanged.

## 3. Agent Status Rules

Implemented status model:

- `Unsigned`
- `Ready`
- `Not Ready`
- `AUX - {reason}`
- `Pre-AUX - {reason}`

### Sign In

- Sign In is available from the profile menu when status is `Unsigned`.
- Sign In uses `Call Management > Global Control Configuration > Status after Sign-in`; its default is `Not Ready`.
- The current demo has fixed internal full-channel capability. Voice/video and text handoffs are gated only by `Ready` state and active-service guards; no sign-in-mode mismatch warning is shown.
- A Not Ready sign-in opens no Live Chat service or default customer session. The first switch to Ready opens the fixed `Live Chat` tab and seeds default live chat demo sessions.
- Saving or resetting Global Control Configuration changes the status applied by the next sign-in in the current browser session. Refresh resets the demo configuration to its mock defaults.
- Global Control `System Idle Log-out Timeout` is a system-session inactivity setting. `Auto Log-out Warning Lead Time` defines how long before that timeout the system warns the agent. Neither setting represents or changes the agent toolbar `Sign Out` action.

### Profile Menu

- The profile team line displays the current agent status after ` | `. AUX and Pre-AUX display as `AUX: {reason}` and `Pre-AUX: {reason}`.
- `Not Ready` menu: read-only current status, `Ready`, active Busy Reason entries as AUX options, `Sign Out`, `Settings`.
- `Ready` menu: read-only current status, active Busy Reason entries as AUX options, `Settings`.
- `Pre-AUX` menu: read-only current status, `Ready`, `Settings`. Sign Out is hidden while service is still draining.
- `AUX` menu: read-only current status, `Ready`, `Sign Out`, `Settings`.
- The profile menu does not show a separate `Signed in` item.

### Sign Out

- Sign Out is available after sign-in.
- If there is any active customer service, Sign Out is blocked and a warning modal appears.
- If there is no active service, Sign Out asks for confirmation.
- Confirmed Sign Out sets status to `Unsigned`, clears the internal demo channel capability, clears call state, closes call tabs, clears live chat sessions, and hides video/share overlays.

### System Log Out

- Header `Log Out` ends the system session and returns to `/login`; it is separate from the agent media `Sign Out` action.
- Log Out first checks for an active call, Live Chat, or Live Chat 2 service. When one exists, it is blocked with `You have active customer service in progress. Please finish or close it before logging out.`
- When the agent is signed in and is neither `Not Ready` nor AUX, including `Ready` and `Pre-AUX`, Log Out is blocked with: `To prevent new customer work from being assigned while you log out, change your status to Not Ready or AUX before logging out.`
- `Unsigned`, `Not Ready`, and AUX statuses show the `Confirm Log Out` confirmation. Confirming clears agent service state, clears the auth session, and returns to the login page.
- Idle monitoring applies only while status is `Unsigned`, `Not Ready`, or AUX. It resets whenever the agent enters one of those statuses, leaves that scope, closes the warning, or performs a window activity such as focus, pointer movement/click, keyboard input, scrolling, or touch input.
- At `System Idle Log-out Timeout - Auto Log-out Warning Lead Time`, the demo shows `Session Expiring`; closing the dialog or choosing `Continue Working` resets the timer. At the full timeout, the demo automatically logs out.
- This is a current-window front-end demo only. It does not provide server session invalidation, multi-tab synchronization, or a backend authentication revocation flow.

### Ready

- `Ready` means the agent can receive compatible interactions.
- Ready can be toggled from the toolbar.
- Returning to Ready clears After Call Work and call handoff warnings.

### Not Ready

- `Not Ready` means the agent cannot receive new customer interactions.
- The agent can select an active Busy Reason to enter AUX from any Not Ready state, whether it was entered manually or by After Call Work.
- After a normal Hang Up, the agent temporarily enters `Not Ready` as After Call Work.
- After Call Work auto-returns to `Ready` after the saved `Call Management > Global Control Configuration > Auto Cancel ACW Duration`; the mock default is 10 seconds.
- Selecting an AUX reason during After Call Work cancels its timer and preserves the ended voice/video workspace so the agent can finish CRM editing before manually returning to Ready.

### AUX

- AUX reasons are loaded from `Busy Reason`.
- Only active busy reasons appear in the profile menu.
- If the agent selects AUX while active service exists, the status becomes `Pre-AUX - {reason}`.
- When active service ends, `Pre-AUX` immediately becomes `AUX`.
- AUX clears call state and live chat sessions when it becomes active. Ended voice/video workspace tabs remain available until a later voice/video interaction replaces them.

## 4. Call Status Rules

Implemented call statuses:

- `Idle`
- `Incoming`
- `Talking`
- `Hold`

Only one voice/video call can be active at a time.

### Incoming

- PSTN, BankApp Voice, and BankApp Video create and activate a dynamic call interaction tab.
- A new voice/video interaction removes all ended voice/video workspace tabs. Their embedded CRM workspaces are unmounted, so only the latest voice/video interaction remains available for CRM editing.
- The toolbar shows Answer and call context.
- Answer flashes while the call is incoming.
- Auto-answer currently starts talking after about 3 seconds.

### Answer

- Answer is enabled only when `callStatus === Incoming`.
- Answer changes call status to `Talking`.
- The current interaction phase becomes active.
- Video call answer can show the OpenEye floating window.

### Talking

- Talking is the connected call state.
- Hold, Transfer, and Hang Up are available.
- Timer runs from call start / status start.

### Hold

- Hold toggles between `Talking` and `Hold`.
- Hold elapsed time is accumulated separately.

### Hang Up

- Hang Up main action marks the current call interaction ended normally.
- Hang Up shows the `Abnormal End Reason` caret only when at least one active abnormal reason applies to the current Voice or Video media type. When none applies, Hang Up remains a normal single button without the caret.
- Selecting an abnormal Hang Up reason ends the call immediately without another confirmation.
- It sets call status to `Idle`.
- It clears call timing and active call channel.
- It hides OpenEye video and resets desktop-share state.
- It moves the agent to `Not Ready` After Call Work unless the agent was already in `Pre-AUX`.
- Ended call tabs can be closed manually while no new voice/video interaction has arrived; the next voice/video interaction closes all remaining ended call tabs automatically.

## 5. Toolbar Rules

Toolbar call context is visible for non-idle calls:

- PSTN voice shows `IVR 08123456789`.
- BankApp voice/video shows `BankID 00012345`.
- Skill is shown as `Skill Credit card activation`.
- Skill is shown during Incoming, Talking, and Hold.
- Idle / ended states hide call identification and Skill.

Toolbar more menu:

- `Outbound Call`
- `Settings`

Toolbar settings can switch display mode between icon and text.

## 6. Transfer Rules

Transfer is available in call and live chat contexts.

Call transfer modal:

- Normal-agent tabs: `Transfer Agent`, `Transfer Skill`, `Transfer IVR`.
- Transfer Agent supports search by name or employee ID.
- Transfer Agent can filter by skill queue.
- Call transfer displays only `Ready` agents. `SPV` and `TL` agents are ordered before regular agents.
- Call transfer defaults to `Consult` enabled and `Transfer` / `Conference` disabled.
- Selecting `Consult` immediately enters the demo consultation state: the selected row becomes red `Cancel Consult`, other rows cannot start a consultation, and only the selected row enables `Transfer` / `Conference`.
- Closing the transfer modal or selecting `Cancel Consult` restores the default call-transfer actions. The call toolbar does not change during consultation.
- A successful agent transfer ends the current agent's call using the ordinary Hang Up lifecycle and enters ACW. The current agent completes CWU for that call; the receiving agent's continued service is a new call record with its own CWU / ticket, not a shared editable popup.
- A successful conference closes the modal and disables the toolbar Transfer button with native title `Transfer unavailable during conference`. The toolbar returns to its normal availability when the call ends.
- The Transfer Agent table keeps a fixed 248px Actions column with compact cell padding so `Cancel Consult`, `Transfer`, and `Conference` remain adjacent without clipping or a stretched empty action area.
- Transfer Skill supports search by skill name. Selecting Transfer is a release transfer: it closes the modal, ends the current call through ordinary Hang Up / ACW, and shows `Transferred to skill queue {Skill Name}.` below the toolbar.
- `Transfer Number` is not visible to ordinary agents. `888888 / 888888` has no permission for it. `666666 / 666666` is the TL Demo account and has `transfer:external-number`, which displays the tab. The tab accepts a phone number and its `Transfer` action is enabled as soon as a number is entered; it does not require TL approval. A successful transfer closes the modal, ends the current call through ordinary Hang Up / ACW, and shows `Transferred to {Number}.` below the toolbar. Numbers ending in `000` deterministically simulate a failure, keep the modal open, and show `We couldn't complete the transfer. Please try again.`.
- Transfer IVR lists enabled entries from `Call Management > Common Number`.
- Transfer IVR row action is a release transfer: it closes the modal, ends the current call through ordinary Hang Up / ACW, and shows `Transferred to IVR {Name}.` below the toolbar.
- Video calls do not expose the call Transfer action in the header toolbar.

Conversation transfer modal:

- Tabs: `Transfer Agent`, `Transfer Skill`.
- No `Transfer Number` or `Transfer IVR` tab.
- Agent row actions: `Transfer`, `Conference`.

Current demo behavior:

- Transfer feedback uses a shared English banner directly below the toolbar and auto-hides after four seconds. Every completed release / successful transfer reuses the current agent's ordinary Hang Up / ACW flow.
- `Channel Simulation > Transferred Call` is a local-only receiving-seat preview and is hidden in the customer visibility profile. It creates a new PSTN interaction carrying source-agent transfer metadata and shows a green transfer icon after the channel duration. It does not open a second editable popup or send a backend event.

## 7. Outbound Rules

Outbound Call is available from the toolbar More menu.

Outbound modal:

- Tabs: `Call Number`, `Call Agent`.
- Call Number accepts a phone number and requires one fixed reason: `Miss Information` or `Financial Risk`. Ordinary Agents see `Request Approval` and can Call only after TL approval for the exact number-and-reason request. TL-and-above accounts select the same reason but Call directly and do not see a Request Approval action.
- Call Agent supports name / employee ID search and skill queue filtering. Ordinary Agents can only view SPV and TL records; TL-and-above roles can view all records.
- Agent row action is `Call`.

Customer Information customer-phone outbound uses the same role rule. Its compact card action opens an `Outbound Reason` modal; ordinary Agents select `Miss Information` or `Financial Risk` before creating the request, while TL-and-above selects the reason and directly unlocks Outbound.

### External Number TL Approval

- The approval scope is a single action and target: toolbar outbound number plus its selected reason, or Customer Information customer phone number plus its selected reason. Editing the number or outbound reason, or closing the originating modal releases a pending or approved authorization; executing the original operation consumes it.
- An ordinary Agent creates a pending request and opens or reuses one same-origin `/tl-outbound-approval` popup from the click event. If the browser blocks the popup, the request is cancelled and the agent is told to allow popups before retrying.
- The TL popup uses the customer-provided complete TL dashboard screenshot as a contained foreground image, so the BANK 1 header, left navigation, and dashboard edge are not cropped. A light mask blocks the static dashboard while approval is active. The approval surface reuses the shared light-blue `BaseModal` title with one white body, is centered in the TL viewport, and has an `Approval` title with a right-aligned countdown. Its body contains only the small agent avatar/name, relevant request description including the required outbound reason, an optional generic note, Approve / Reject actions, and a compact next-item indicator when another request is queued.
- The optional note can accompany either Approve or Reject and is included in the agent notification. Approve enables only the original exact-number action. Reject returns the originating entry to a requestable state. Timeout expires the request and hides the TL approval surface without a result card.
- Approval records are synchronized between same-origin browser windows with `BroadcastChannel` and `localStorage` so pending state survives refresh in the current browser. The TL window processes pending requests FIFO; resolving a current request advances to the next and only closes the popup after the final item. When exactly one real request is open, the TL page appends one local-only simulated follow-up item to make the two-item queue visible in the Demo; it does not create a seat-side authorization or notification. Agent approval result popups reuse a non-masked `BaseModal` at the bottom-right, are manually closable, and disappear after five seconds.
- This is a front-end Demo simulation only. It does not create a real TL queue, permission check, backend audit record, or cross-device approval workflow.

No real dialer integration exists.

## 8. Internal Chat Rules

Internal Chat opens from the header message icon.

Implemented behavior:

- Agent sessions are sorted by latest message timestamp.
- Search supports agent name and employee ID.
- Left list shows unread count and latest message.
- Right side shows the selected internal conversation.
- Composer accepts text.

Current demo boundary:

- The Send button is visual only in the current implementation.
- It does not persist or append a new internal chat message.

## 9. Customer Information Rules

Customer Information shows:

- customer profile,
- access channel and access duration,
- verification status,
- customer contact actions,
- verification entry,
- call flow detail,
- email action,
- outbound action,
- read-only Special Handling demo information.

Special Handling:

- `Special Handling` is available only after a valid CRM CIS identifies the customer. Unidentified PSTN and Guest customers do not show it.
- Clicking it opens a read-only modal with static demo handling information: `Customer Profile` = `Orang Kaya`, `Handling` = `Jangan ditanya dulunya`.
- The current demo does not call a customer API, edit the data, or persist changes.

Customer identity refresh:

- PSTN starts as `Unidentified Customer`; Customer Information has no manual Customer ID input or refresh action. It shows the anonymous caller number `08123456789`, while email and CIS render as `-` and do not expose CRM-dependent actions.
- After voice KBV meets its requirements and the agent selects `Apply Verified`, AICC marks the customer `Verified` and sends a same-origin CRM CIS `postMessage` request with a version and correlation ID.
- The CRM demo bridge returns the CIS in a matching response. AICC accepts only matching, same-origin, non-empty CIS responses, then uses the CIS to load mock customer profile, journey, and ticket history.
- Invalid origin, message type, correlation ID, empty CIS, unknown CIS, or timeout leaves the current customer information unchanged and shows a refresh failure message. A completed KBV remains `Verified`.
- `Apply Failed`, incomplete KBV, Clear All, and PIN verification do not request CRM CIS.
- Segment, Skill, and Scenario are captured when KBV is first opened for an interaction. Later CRM customer-information refreshes do not recalculate them; agent changes to those conditions remain available when reopening KBV during the same interaction.
- This is a front-end demo bridge, not a real CRM iframe, origin allowlist, authentication, or customer-data API contract.

Guest customer information:

- Text-channel guests, including BankApp Live Chat and Webchat, keep the customer-entered name, phone number, and email, but show customer ID / CIS as `-`.
- BankApp voice and video guests only provide a phone number on the customer side. The agent workspace shows a generated `Guest-06290001`-style name, keeps the entered phone number, and shows `-` for email and customer ID / CIS.
- Registered customers continue to show the full mock customer profile.
- Unavailable customer information should be represented as `-` in the current demo instead of blank values.

Customer contact information:

- Customer Information displays the phone number and email from the current CRM-backed customer profile. After a valid CRM CIS is available, its header provides an `All Contact Details` viewer; it is read-only and does not dial, send, or open external links. The viewer is hidden while the customer is unidentified or a Guest.
- The viewer groups Phone, WhatsApp, BankApp, Email, Facebook, Instagram, X, TikTok, YouTube, LinkedIn, App Store, and Play Store. Each group presents fixed left channel identity and right-side CRM values; a channel can contain zero or more values, and no CRM value shows `-`.
- Agents cannot add, edit, or delete contacts in the customer profile. Unidentified customers have no CRM contact values; after a valid CIS refresh, the viewer reads the refreshed CRM-backed profile.
- The legacy Contact Management DEMO remains available only to local maintainers when `VITE_APP_VISIBILITY_PROFILE=local` and `VITE_ENABLE_CONTACT_EDIT=true`; it is local-only mock state, not a CRM write-back capability or customer-visible feature.
- Any future customer-facing contact editing requires confirmed CRM write authority, audit requirements, field ownership, validation, and failure handling.

Verification:

- Voice channels show a compact `KBV` action, which opens Customer Verification V2 in the right-side Verification tab.
- BankApp Voice / VoIP uses `KBV` for both logged-in and guest customers.
- BankApp text / Live Chat for logged-in BankApp customers shows a compact `PIN` action on the Customer Information card.
- BankApp text / Live Chat guest customers do not show a verification action in the current demo.
- BankApp PIN verification sets the card status to `Verifying`, opens the mock secure PIN page in the BankApp customer demo, and updates the card to `Verified` or `Verification Failed` from the simulated callback result.
- The PIN page represents a BCA-provided client page. In the demo, Netinfo initiates the PIN verification request and BCA returns the result to Netinfo.
- PIN can be requested up to 3 times. While waiting, after success, and after the third failed attempt, the `PIN` action is disabled.
- WhatsApp, BankApp video, Webchat, and unsupported channels do not show a verification action in the current demo.
- For KBV, the CRM center workspace remains visible while the agent asks questions and marks Correct, Wrong, or Skip.
- KBV verification result is managed by the shared interaction workspace so that a CIS-driven customer refresh preserves the completed status.

Call Flow Detail:

- Voice / IVR contexts show IVR Journey.
- Text and non-IVR contexts can suppress IVR Journey.
- Live Chat can show transfer history.

## 10. Customer Verification V2 Rules

Verification V2 is the current KBV model.

Rule matching:

- Rules match by enabled channel code, skill queue, and customer segment.
- Customer segment is inferred from profile but can be adjusted in the agent modal.
- Skill can be adjusted in the agent verification tab or management preview modal.
- Scenario selector is shown only when the matched rule has multiple scenarios.

Rule model:

- A rule contains channel codes, skill queue, customer segments, status, and scenarios.
- A scenario contains question blocks.
- Question block types include:
  - `Mandatory`
  - `Dynamic`
  - `Static`
  - `Alternative`
  - custom blocks such as Branch Data, Customer Data, Layering.

Question bank:

- Question Bank stores question names only.
- Answers are not shown in the agent-side modal.
- Deleting a question removes it from rule configurations after confirmation in the management page flow.

Evaluation:

- Correct Required is derived from scenario question blocks.
- Mandatory / Dynamic / Static / custom blocks have required correct counts.
- Alternative questions can substitute missing correct answers for Dynamic or Static blocks.
- Skip does not count as correct or wrong.
- Wrong count is recalculated from current selected statuses.
- If Max Wrong is set, reaching the limit marks the evaluation failed.
- If Max Wrong is No Limit, no wrong counter is shown.
- `Apply Verified` is enabled only after requirements are met and failure condition is not active.
- `Apply Failed` is manually available when a rule exists.
- `Clear All` resets answer progress.
- Switching conditions preserves answers for overlapping question IDs and removes statuses for questions no longer in the effective question set.

Preview:

- Management Preview reuses the same verification modal.
- In Preview, Skill and Customer Segment are read-only.
- Preview does not save rules or customer verification state.

## 11. Customer Journey Rules

Customer Journey:

- Shows interaction history from mock journey data.
- Sorts by date descending.
- Collapsed state shows 2 items.
- Expanded state shows up to 10 items.
- Clicking an item opens `Interaction Detail`.
- Detail modal shows customer/agent conversation and summary sections.

Channels shown in journey include Email, X, Instagram, TikTok, and WhatsApp.

## 12. Ticketing History Rules

Ticketing History:

- Sorts tickets by created date descending.
- Collapsed state shows 2 items.
- Expanded state shows up to 10 items.
- Clicking a ticket opens a dynamic CRM workspace tab.
- Dynamic CRM tab key uses the ticket number.
- The tab includes ticket type, reference, CRM link, description, and a mock CRM detail form.

## 13. Next Best Action Rules

Next Best Action:

- Shows recommended services from mock data.
- Collapsed state shows 2 actions.
- Expanded state shows all actions.
- Clicking an item opens a dynamic CRM workspace tab.
- The tab is treated as recommendation detail.

## 14. Quick Action Rules

Quick Action:

- Shows compact action buttons.
- Clicking an action opens a dynamic CRM workspace tab.
- The tab is treated as a quick action form.

## 15. CRM Workspace Rules

CRM panel:

- Fixed `CRM` tab always exists.
- If a conversation is present, fixed `Conversation` tab exists and is not closable.
- Dynamic business tabs are opened by Ticketing, Next Best Action, and Quick Action.
- Dynamic tabs are closable.
- CRM screenshot path: `/screenshots/crm-workspace.jpg`.
- If screenshot loading fails, code fallback UI renders.

## 16. Assistant Panel Rules

Assistant panel:

- Fixed `Assistant` tab.
- Fixed `Common Links` tab.
- Extra tabs can be added by workspace features, such as Quick Replies and Message Record.
- Assistant screenshot path: `/screenshots/assistant-workspace.jpg`.
- If screenshot loading fails, code fallback UI renders.

Common Links shows website names and website URLs from `Call Management > Common Link`; clicking a link opens the website in a new browser tab.

## 17. Live Chat Rules

Live Chat opens and seeds default current demo sessions when the signed-in agent first becomes Ready.

Customer list:

- Supports Current and History views.
- Supports collapsed and expanded layouts.
- Supports channel filters: All, WhatsApp, BankApp, Webchat.
- All filter toggles all channels on/off.
- Supports sorting by access time or message time.
- Active conversations show elapsed service time.
- History conversations show ended time.
- Star colors remain local compatibility state, but the customer list star marker UI is hidden.
- Unread count is cleared when a session is focused.
- Active conversations show an unanswered progress bar in the customer list. The bar uses the red / breach SLA threshold as 100%, shows green before warning, switches to warning color at the warning threshold, and switches to breach color at the breach threshold.

Workspace tab:

- Fixed tab label is `Live Chat`.
- Shows longest active service duration when there are active service sessions.
- Aggregates unread count for active, unread, non-ended sessions.
- Aggregates active, non-ended unanswered sessions by SLA state on the tab: warning count uses the orange badge and breach count uses the red badge.
- Unread count caps at `99+`.
- New handoff sessions can flash the tab.

Conversation:

- Header shows channel icon, customer name, and service duration.
- Active session actions: `Transfer`, `End Service`.
- Customer-ended session action: `Close`.
- Active Webchat sessions show a static floating `Customer is typing` indicator above the agent composer in the current demo.
- The typing indicator does not participate in the composer height, so typing state changes should not resize the agent input area.
- Webchat typing is not connected to customer-side Webchat Demo input events or screenshots.
- Sending a message appends a current-agent message in local state.
- End Service main action keeps the confirmation modal, then records a normal agent end after confirmation.
- End Service shows the `Abnormal End Reason` caret only when at least one active abnormal reason applies to DM. When none applies, End Service remains a normal single button and retains its confirmation modal.
- Selecting an abnormal End Service reason ends the session immediately without another confirmation.
- End Service adds a system message, marks session ended, then moves it to History.
- Close removes the active session and adds it to closed history.

Message Record:

- Opens as a right Assistant extra tab.
- Searches and locates historical / current messages.
- Does not replace the conversation center panel.

Quick Replies:

- Fixed Assistant extra tab.
- Supports My/Public phrase groups.
- My groups and phrases can be maintained locally.
- Public phrases are read-only in the agent workspace.
- Public phrases are sourced from `Call Management > Common Phrase`.
- Insert places text into the active composer and focuses the cursor at the end.
- Slash command candidates should reflect local quick reply changes.

Recall:

- Demo rule expects WhatsApp messages not to show Recall / Re-edit.
- BankApp and Webchat can retain recall capability for current-agent messages within demo rules.

Sensitive word check:

- Agent replies are checked before sending in the Live Chat workspace.
- If the reply contains a configured sensitive word, the system blocks sending and shows the matched sensitive word and category to the agent.
- The blocked draft remains in the composer so the agent can revise it.
- Matching is a front-end demo contains check after trim and lowercase normalization.

## 18. BankApp Demo Rules

BankApp demo variants:

- Voice.
- Video.
- Live Chat.

Client page ownership:

- Haloapp / BankApp text, voice, video, PIN, desktop-share, and satisfaction pages are BCA-owned client pages.
- Netinfo demo behavior starts at SDK/API handoff, routing, agent workspace, message exchange, verification request/result, and call popup behavior.
- The customer-side demo uses the approved V1.8 flow screenshots as read-only client references and should not imply Netinfo builds those pages.

Customer type:

- Registered.
- Guest.

Flow:

- Channel selection.
- Optional guest phone or personal information step.
- Business selection.
- Business confirmation.
- Calling / queue step.
- Connected or chat step.
- Agent Workspace handoff.
- Optional customer-initiated video screen-sharing step.
- Service Closed.

Handoff rules:

- Voice/video handoff requires agent Ready and call Idle.
- Live chat handoff requires agent Ready.
- If readiness fails, a warning is shown in the demo process panel.

PIN:

- BankApp PIN verification is a mock customer-side secure PIN page.
- It is triggered from the agent Customer Information card for logged-in BankApp text / Live Chat customers.
- The agent-side card shows `Verifying` while the customer PIN page is open.
- The customer demo page can submit success or simulate failure; success marks the customer `Verified`, while three failed attempts mark verification failed and disable further PIN requests.
- PIN verification is separate from KBV question rules. In the current demo, KBV is used for voice channels and PIN is used for logged-in BankApp text verification.
- Webchat PIN verification is temporarily hidden pending customer confirmation.

Video desktop sharing:

- Video client UI has no keypad and no transfer action.
- Customer starts desktop sharing from the Haloapp video call page; the client button changes from `Desktop Share` to `Stop Sharing`.
- The agent side only views the customer-shared screen in the floating video window.
- The demo does not show sensitive-word masking or desensitization during video desktop sharing.

## 19. Webchat Demo Rules

Webchat demo variants:

- Text only in the current implementation.
- Registered.
- Guest.

Flow:

- Registered customer starts directly in queue without media selection, customer information input, or menu selection.
- Guest customer first sees contact information / business selection, then enters the queue.
- Queue / routing.
- Agent receives a new Webchat customer in Live Chat.
- Customer and agent exchange Webchat text messages.
- Service closed / satisfaction rating.

Current scope:

- Webchat voice and video are acknowledged as possible media but are not implemented yet.

## 20. WhatsApp Demo Rules

WhatsApp demo uses the BankApp demo framework with a WhatsApp variant.

Flow:

- Chat request.
- Business selection.
- Queue / agent chat.
- Agent Workspace handoff to Live Chat.
- Satisfaction rating / closed state.

WhatsApp demo is chat-only in the current implementation.

## 21. Email Workspace Rules

- Email is available from `Channel Simulation` in both customer and local visibility profiles. It does not add a standalone route; its menu action opens or reuses one closable `Email` workspace tab.
- Current scope is the agent Email handling workspace only. Email Record Inquiry and Email Template Deploy remain separate future scope.
- Inbox, Sent, Drafts, and Trash use anonymized front-end mock data. All changes reset after refresh or closing/reopening the Email tab.
- Selecting an email marks it read and updates the shared customer context, `CRM / Email` content, and the related thread record.
- Reply creates a Sent email, appends the thread record, marks the source email `Replied`, and stops the source SLA.
- Forward uses the same composer and requires an explicit receiver. After Send, the source email and forwarding record are removed from Inbox, Sent, Drafts, and Trash; Forward does not create a Sent item.
- Save Draft creates or updates a Drafts item. Sending a normal edited draft removes the draft and creates a Sent item; sending a saved Forward draft removes both the draft and its original source without creating a Sent item.
- Ignore reasons are `AD`, `Spam`, and `Sales Email`. Ignore marks the email `No reply`, stops SLA, and moves it from Inbox to Trash.
- Trash Recover returns the pre-seeded or ignored trashed email to its original folder and clears the ignore marker.
- CWU Registration requires at least one Business Type and a Summary. One-Click Generation creates an editable local summary before confirmation.
- Email verification is not shown because no confirmed Email verification channel rule exists.
- Email directly reuses Live Chat's `CrmPanel`; CRM uses the same current screenshot and Email uses the same tab styling as Conversation. Legacy full-system Email design screenshots are not embedded.
- No real mailbox, SMTP, attachment upload, routing, permission, audit, template deployment, record inquiry, or CWU backend integration exists.

## 22. Social Media Workspace Rules

- Social Media is available from `Channel Simulation` directly after Email in both customer and local visibility profiles. It does not add a standalone route; its menu action opens or reuses one closable `Social Media` workspace tab.
- The workspace uses local anonymized mock data for Facebook, Instagram, X, YouTube, LinkedIn, TikTok, App Store, and Google Play. It distinguishes `Chats`, `Cmts`, `AT`, and `Reviews` queue items.
- Search plus channel/type filters only affect local queue visibility. Selecting an item opens its local CRM preview or conversation/post-detail area and does not create a Live Chat session.
- Reply SLA progress is visual demo state only. Review replies, CWU popover states, queue selection, and filters are local component state and reset after closing/reopening the tab or refreshing the application.
- Social Media does not currently integrate channel authentication, real API delivery, moderation, routing, persistence, audit, abnormal service ending, or Social Media record inquiry. It must not be folded into Interaction Log without a separately confirmed query model.

## 23. Call Management Rules

Visible customer pages:

- Verification Rules.
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

Hidden / redirected:

- Text Channel Settings is not shown as a customer menu entry.
- Old routing-configuration route redirects.

### Blacklist

- Entries contain Channel, Restricted Number, Restriction Policy, Validity Days, Remark, Created Date, Created By.
- Restriction policies:
  - Block Access.
  - Prohibit Transfer to Agent.
- Add / Batch Add are local demo actions.
- Delete supports selected rows and confirmation.
- Store is local front-end state.

### Priority List

- Entries contain Channel, Identifier, Match Rule, Remark, Created Date, Created By.
- Match rules:
  - Exact Match.
  - Partial Match.
- Search supports Channel, Identifier, and Match Rule.
- Empty Match Rule means all match rules.
- Batch Add uses manually selected Match Rule.
- Duplicate check uses `Channel + normalized Identifier + Match Rule`.
- Exact and Partial rules for the same identifier can coexist.
- Store is local front-end state.

### Busy Reason

- Active busy reasons appear as AUX options in the agent profile menu.
- Each Busy Reason has a `Productivity Type`: `Productive` or `Non-Productive`. The classification is maintained for future agent-status and report statistics, without changing the current AUX flow.
- Busy Reason management supports keyword, productivity type, and status filtering, plus reason, productivity type, status, and remark editing. It does not use a default-reason configuration.
- Store is local front-end state.

### Abnormal End Reasons

- Abnormal End Reasons maintains abnormal service end reasons for Voice, Video, and DM media.
- Social Media / Non-DM service ending is not included in the current scope.
- Voice, Video, and DM remain configurable media. Default data is limited to two DM reasons; Voice and Video have no preconfigured abnormal reason.
- `Normal` is the system default normal end reason and is not shown in the abnormal reason management list.
- Entries contain Reason Name, Applicable Media, Status, and Remark.
- Applicable Media supports Voice, Video, and DM.
- Search supports Keyword, Applicable Media, and Status.
- Add, Edit, and Delete are local demo actions.
- Reason Name is unique after trim and lowercase normalization.
- Only `Active` reasons appear in agent-side abnormal end reason menus. When the current media has no matching active reason, the abnormal-end caret is hidden.
- Default abnormal reasons are:
  - `Problem Teknis`: DM.
  - `Nasabah Tidak Ada Respons Lebih Lanjut`: DM.
- Agent normal end records `endedBy = Agent` and `endReasonName = Normal`.
- Agent abnormal end records `endedBy = Agent` and `endReasonName` as the selected abnormal reason.
- Customer-ended sessions record `endedBy = Customer` and `endReasonName = Normal`.
- System timeout sessions record `endedBy = System` and `endReasonName = Customer Timeout`.
- System abnormal disconnects should use `endedBy = System` with a specific reason such as `Connection Lost`, `System Error`, or `Channel Gateway Error`; they should not be mixed with customer timeout.
- Store is local front-end state.

### Common Phrase

- Common Phrase maintains only public quick reply phrases.
- Agent-owned My Phrases remain local to the Live Chat workspace and are not managed by this menu.
- Categories contain public common phrase entries.
- `All Categories` is a view-only aggregate and cannot be used when adding a new phrase.
- Adding a phrase requires a concrete category; when opened from `All Categories`, the add modal defaults to the first configured category and allows category selection.
- Shortcut Code is globally unique across public common phrases after trim and lowercase normalization.
- Category Name is unique after trim and lowercase normalization.
- Deleting a category requires confirmation and deletes all phrases under that category.
- Selected phrases can be moved to another category; source categories for selected rows are disabled as move targets.
- Store is local front-end state.

### Common Link

- Common Link maintains frequently used website references for the current demo session.
- Search supports Website Name and Website URL.
- List columns include No., Website Name, Website URL, Remark, and Actions.
- Add, Edit, and Delete are local demo actions.
- Website Name and Website URL are unique after trim and lowercase normalization.
- Website URL must start with `http://` or `https://`.
- Shared voice, video, and Live Chat workspaces read Common Link data in the right-side `Common Links` tab.
- Store is local front-end state.

### Common Number

- Common Number maintains IVR transfer targets for the current demo session.
- Entries contain Name, Number, Status, and Remark.
- Search supports Name, Number, and Status.
- List columns include No., Name, Number, Status, Remark, and Actions.
- Add, Edit, and Delete are local demo actions.
- Name and Number are unique after trim and lowercase normalization.
- Number is required but does not enforce strict phone format so IVR short codes and service numbers can be used.
- Only `Active` entries appear in the call Transfer modal `Transfer IVR` tab.
- Store is local front-end state.

### Sensitive Word

- Sensitive Word maintains sensitive words used to block Live Chat agent replies before sending.
- Search supports Sensitive Word and Category.
- Category is a fixed data dictionary and is not maintained in this menu.
- Current category examples include Security Credential, Personal Data Exposure, Regulatory or Compliance Risk, Profanity / Offensive Language, and Harassment / Discriminatory Language.
- List columns include No., Sensitive Word, Category, Remark, and Actions.
- Add, Edit, and Delete are local demo actions.
- Sensitive Word is unique after trim and lowercase normalization.
- Store is local front-end state.

### Interaction Log

- Interaction Log is the current demo's 通话记录查询 / interaction history page under Call Management. Its route remains `/call-management/call-record-query`.
- Current scope includes Phone voice, BankApp Voice, BankApp Video, BankApp DM, Webchat, and WhatsApp service records.
- The current demo seeds 30 mock records; at least 12 records are dynamically placed within the current day so the default Date Range has enough data for paging.
- Current scope excludes Email and Social Media records. Email Record Inquiry and Social Media query remain separate future scopes and are not exposed in the current Call Management menu; the implemented Email handling workspace does not change this boundary.
- Production permission intent is: agents see their own records, TL sees their own group, and SPV sees groups under managed TLs. The current demo has no permission system, so records are seeded as the current agent view only.
- Search supports keyword, Channel, Media Type, Call Type, Ended By, End Reason, and Date Range. Default date range is the current day from `00:00:00` to `23:59:59`.
- `Call Type` identifies how the record arrived at the current agent: `Customer` for a direct customer interaction, `Transfer` for a transferred interaction, and `Conference` for a three-party interaction. It is available as both a list field and query filter for leadership transfer-frequency checks.
- The list uses `Contact` for the customer-side contact identifier: phone and WhatsApp show the number, logged-in BankApp/Webchat show BankID, and guest Webchat shows a guest ID such as `guest-7118`.
- The list shows `Queue`; missing queue values render as `-`.
- The list shows `Service Time` as `start time - end time`.
- The list shows `QM Score` as plain text or `-`; QM Score is not a search filter in the current demo.
- A numeric `QM Score` is a third-party quality-management detail entry. The current demo opens a customer-confirmed static third-party system-window preview at the original image ratio. Only the source image's top-right close X is interactive; other third-party toolbar icons remain static, `-` is not clickable, and mask / Esc do not close the preview. Future unified sign-in integration should replace this preview with the corresponding third-party detail page.
- End lifecycle fields are split into `Ended By` and `End Reason`.
- `Ended By` values are `Agent`, `Customer`, or `System`.
- Normal agent and customer endings both use `End Reason = Normal`; channel/media context is already shown by Channel and Media Type.
- Agent abnormal endings use the selected Session End Reason value. System endings use specific system reasons such as `Customer Timeout`, `Connection Lost`, `System Error`, or `Channel Gateway Error`.
- Voice records use a three-column detail layout: left media playback, middle `Auto Transcript`, and right read-only CWU. The left media column stacks `Voice Recording Playback` above `Screen Recording Playback`; the screen recording uses a PSTN active-call agent desktop recording frame and is not a customer video surface.
- Video records use a three-column detail layout: left `Video Recording Playback`, middle `Auto Transcript`, and right read-only CWU. The replay is an OpenEye-style vertical replay with two video panes and a playback bar; it should not include the live-call buttons, labels, or icons from the OpenEye call screen.
- DM records use a two-column detail layout: conversation-style bubbles with speaker, avatar, and time on the left, and read-only CWU on the right. DM details do not show an empty media column.
- Detail modal does not add a CRM or customer-detail card in the current scope; customer and service metadata stay in the list-level fields.
- Detail modal right side shows read-only CWU with Ticket No., multi-select Business Type, and Summary description only.
- CWU Registration summary is mandatory in the current demo, so the list and filters do not expose Summary Status or Summary Time.
- Interaction Log exposes only the View action. CWU edit entry points and the Edit CWU modal are not shown in the current demo.
- Store is local front-end state.

## 24. Routing Config Rules

Routing Config is visible unless `VITE_ENABLE_ADMIN_MENUS=false`.

Implemented customer-review pages:

- VDN.
- Access Sites.
- Channels.
- Business Types.
- Skill Queues.
- Site Access Volume.
- Skill Routing Rules.
- Working Time Plans.

Important rules:

- Channels has Phone account management disabled.
- Routing Config media types include Voice, Video, DM, and Non-DM.
- Non-DM represents social non-direct-message scenarios such as comments, replies, mentions, and app-store reviews.
- Instagram, LinkedIn, Facebook, X, Tik Tok, and YouTube support DM plus Non-DM media.
- AppStore and PlayStore support Non-DM only.
- Channels Edit Channel media type selector shows all configured media types; the current channel's selected media types determine which Business Config tabs are shown.
- Channels DM Business Config shows `Queue Configuration` immediately after `Access Configuration`.
- `Queue Configuration` contains `Outside Service Hours Message`, `Queue Waiting Message`, and `Queue Timeout Message`.
- `Queue Waiting Message` does not support estimated-wait dynamic parameters in the current demo.
- Channels Non-DM Business Config shows a tab but no configuration content in the current demo.
- Webchat DM Business Config shows `Webchat Message Recall Limit (sec)`.
- Non-Webchat text channels do not show that Webchat-specific field.
- Channels Business Config `Agent Service Configuration` keeps the existing `Agent No Reply Warning (sec)` and `Agent No Reply Breach (sec)` labels, and uses colored dots matching Live Chat SLA warning and breach colors to clarify the threshold severity.
- Business Types include `Source Business Code`.
- Skill Queues require `Access Code`; it appears after `VDN` in list columns and Add / Edit / View forms. Keyword search includes Access Code.
- Skill Routing Rules use configured route elements and target skill queues.
- Site Access Volume ratios should total 100% for the same channel + media combination.
- Working Time Plans support work schedule, Ramadan schedule, holiday schedule, and special working plans. Their plan codes are local internal keys and are not displayed or user-maintained.

All Routing Config changes are front-end demo state only.

## 25. Local-Only Module Visibility Rules

`main` is the customer release integration line. Local-only modules can live in `main`, but must be hidden from customer builds through `VITE_APP_VISIBILITY_PROFILE`.

- Default / customer profile is `customer`.
- `customer` hides local-only menu entries and redirects direct local-only routes back to `/`.
- `local` shows local-only modules for local maintainer use.
- Current local-only modules are Employee Management and Design System.
- Employee Management is front-end mock state only and does not connect to LDAP, HR, permission, workforce management, or employee skill backends.
- Customer deployment environments must not set `VITE_APP_VISIBILITY_PROFILE=local`.

## 26. Localization Rules

Current implemented language mix:

- System shell and controls are mostly English.
- Business data, customer service topics, tickets, and KBV questions include Indonesian.
- Future localization must decide between:
  - all English,
  - all Indonesian,
  - English UI with Indonesian business data.

Do not introduce old customer brand names into visible UI or handoff docs.
