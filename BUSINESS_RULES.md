# BANK 1 AICC Demo V2 - Business Rules

Last updated: 2026-06-24 11:00 +08:00

This document records the currently implemented business behavior. It describes demo rules, not production backend contracts.

## 1. Authentication Rules

- `/login` is public.
- All business pages under `/` require an authenticated session.
- Demo login validates against mock credentials.
- Successful login creates a session in `sessionStorage`.
- Invalid login shows an LDAP-style error message.
- If a session expires or cannot be parsed, it is removed and the user is sent back to `/login`.
- Log Out is blocked while there is an active customer service interaction.

## 2. Agent Service Mode Rules

Agents sign in with one of three service modes:

- `Voice only`
- `Digital only`
- `Voice + Digital`

Service mode controls handoff readiness:

- Voice and video interactions require `Voice only` or `Voice + Digital`.
- Digital / live chat interactions require `Digital only` or `Voice + Digital`.
- If the mode is incompatible, customer-side handoff displays a visible warning instead of silently opening a workspace.

## 3. Agent Status Rules

Implemented status model:

- `Unsigned`
- `Ready`
- `Not Ready`
- `AUX - {reason}`
- `Pre-AUX - {reason}`

### Sign In

- Sign In is available from the profile menu when status is `Unsigned`.
- Selecting a service mode signs the agent in and sets status to `Ready`.
- Digital-capable sign-in opens the fixed `Live Chat` tab and seeds default live chat demo sessions when appropriate.

### Sign Out

- Sign Out is available after sign-in.
- If there is any active customer service, Sign Out is blocked and a warning modal appears.
- If there is no active service, Sign Out asks for confirmation.
- Confirmed Sign Out sets status to `Unsigned`, clears service mode, clears call state, closes call tabs, clears live chat sessions, and hides video/share overlays.

### Ready

- `Ready` means the agent can receive compatible interactions.
- Ready can be toggled from the toolbar.
- Returning to Ready clears After Call Work and call handoff warnings.

### Not Ready

- `Not Ready` means the agent cannot receive new customer interactions.
- After a normal Hang Up, the agent temporarily enters `Not Ready` as After Call Work.
- After Call Work currently auto-returns to `Ready` after about 5 seconds.

### AUX

- AUX reasons are loaded from `Busy Reason Management`.
- Only active busy reasons appear in the profile menu.
- If the agent selects AUX while active service exists, the status becomes `Pre-AUX - {reason}`.
- When active service ends, `Pre-AUX` immediately becomes `AUX`.
- AUX clears call state and live chat sessions when it becomes active.

## 4. Call Status Rules

Implemented call statuses:

- `Idle`
- `Incoming`
- `Talking`
- `Hold`
- `Mute`

Only one voice/video call can be active at a time.

### Incoming

- PSTN, BankApp Voice, and BankApp Video create a dynamic call interaction tab.
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
- Hold, Mute, Transfer, and Hang Up are available.
- Timer runs from call start / status start.

### Hold

- Hold toggles between `Talking` and `Hold`.
- Entering Hold clears an active Mute timer.
- Hold elapsed time is accumulated separately.

### Mute

- Mute toggles between `Talking` and `Mute`.
- Entering Mute clears an active Hold timer.
- Mute elapsed time is accumulated separately.

### Hang Up

- Hang Up marks the current call interaction ended.
- It sets call status to `Idle`.
- It clears call timing and active call channel.
- It hides OpenEye video and resets desktop-share state.
- It moves the agent to `Not Ready` After Call Work unless the agent was already in `Pre-AUX`.
- Ended call tabs can be closed.

## 5. Toolbar Rules

Toolbar call context is visible for non-idle calls:

- PSTN voice shows `IVR 08123456789`.
- BankApp voice/video shows `BankID 00012345`.
- Skill is shown as `Skill Credit card activation`.
- Skill is shown during Incoming, Talking, Hold, and Mute.
- Idle / ended states hide call identification and Skill.

Toolbar more menu:

- `Outbound Call`
- `Settings`

Toolbar settings can switch display mode between icon and text.

## 6. Transfer Rules

Transfer is available in call and live chat contexts.

Call transfer modal:

- Tabs: `Transfer Agent`, `Transfer Skill`, `Transfer Number`, `Transfer IVR`.
- Transfer Agent supports search by name or employee ID.
- Transfer Agent can filter by skill queue.
- Agent row actions: `Consult`, `Transfer`, `Conference`.
- Transfer Skill supports search by skill name.
- Transfer Number accepts a phone number and supports `Transfer` and `Conference`.
- Transfer IVR lists enabled entries from `Call Management > Common Number Management`.
- Transfer IVR row action is `Transfer`.

Conversation transfer modal:

- Tabs: `Transfer Agent`, `Transfer Skill`.
- No `Transfer Number` or `Transfer IVR` tab.
- Agent row actions: `Transfer`, `Conference`.

Current demo behavior:

- Transfer action buttons close the modal.
- No real transfer, consultation, conference, queue update, or backend event is sent.

## 7. Outbound Rules

Outbound Call is available from the toolbar More menu.

Outbound modal:

- Tabs: `Call Number`, `Call Agent`.
- Call Number accepts a phone number and has a `Call` action.
- Call Agent supports name / employee ID search and skill queue filtering.
- Agent row action is `Call`.

Customer Information also supports an outbound approval demo:

- Request outbound starts a local `requesting` state.
- After about 3 seconds it becomes `approved`.
- Approved outbound can trigger the current call to talking state through a store request.

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
- outbound action.

Customer identity refresh:

- PSTN starts as `Unidentified Customer`.
- Refresh uses a demo Customer ID popover.
- Paste fills the demo Customer ID.
- Confirm loads mock customer profile, journey, and ticket history if the ID matches.
- Invalid or empty ID shows an inline error.

Contact Management:

- Contact types include Phone, WhatsApp, Email, and other configured groups.
- Contact edits are local to the current customer key.

Verification:

- Opens Customer Verification V2 in the right-side Verification tab.
- The CRM center workspace remains visible while the agent asks questions and marks Correct, Wrong, or Skip.
- Verification result updates customer verification status locally.

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

Common Links shows website names and website URLs from `Call Management > Common Link Management`; clicking a link opens the website in a new browser tab.

## 17. Live Chat Rules

Live Chat is opened automatically for digital-capable sign-in.

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
- Unread count caps at `99+`.
- New handoff sessions can flash the tab.

Conversation:

- Header shows channel icon, customer name, and service duration.
- Active session actions: `Transfer`, `End Service`.
- Customer-ended session action: `Close`.
- Sending a message appends a current-agent message in local state.
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
- Public phrases are sourced from `Call Management > Common Phrase Management`.
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
- Optional video share-selection and screen-sharing steps.
- Service Closed.

Handoff rules:

- Voice/video handoff requires agent Ready, call Idle, and compatible service mode.
- Live chat handoff requires agent Ready and digital-compatible service mode.
- If readiness fails, a warning is shown in the demo process panel.

PIN:

- BankApp PIN verification is a mock customer-side secure PIN page.
- It sets a local `verified` state only.
- Whether PIN reduces or replaces KBV is still a customer policy question.

## 19. WhatsApp Demo Rules

WhatsApp demo uses the BankApp demo framework with a WhatsApp variant.

Flow:

- Chat request.
- Business selection.
- Queue / agent chat.
- Agent Workspace handoff to Live Chat.
- Satisfaction rating / closed state.

WhatsApp demo is chat-only in the current implementation.

## 20. Call Management Rules

Visible customer pages:

- Verification Rules.
- Global Control Configuration.
- Blacklist Management.
- Priority List Management.
- Common Phrase Management.
- Common Link Management.
- Common Number Management.
- Sensitive Word Management.
- Busy Reason Management.

Hidden / redirected:

- Text Channel Settings is not shown as a customer menu entry.
- Old routing-configuration route redirects.

### Blacklist Management

- Entries contain Channel, Restricted Number, Restriction Policy, Validity Days, Remark, Created Date, Created By.
- Restriction policies:
  - Block Access.
  - Prohibit Transfer to Agent.
- Add / Batch Add are local demo actions.
- Delete supports selected rows and confirmation.
- Store is local front-end state.

### Priority List Management

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

### Busy Reason Management

- Active busy reasons appear as AUX options in the agent profile menu.
- Updating the default reason keeps only one default busy reason.
- Default active AUX reasons are Break, Coaching/Meeting, Prayer, Toilet, Others, Callback Finrisk, Callback Misinform, Sick/Problem Non System, Routine Job, Problem System, and Special Assignment.
- Store is local front-end state.

### Common Phrase Management

- Common Phrase Management maintains only public quick reply phrases.
- Agent-owned My Phrases remain local to the Live Chat workspace and are not managed by this menu.
- Categories contain public common phrase entries.
- `All Categories` is a view-only aggregate and cannot be used when adding a new phrase.
- Adding a phrase requires a concrete category; when opened from `All Categories`, the add modal defaults to the first configured category and allows category selection.
- Shortcut Code is globally unique across public common phrases after trim and lowercase normalization.
- Category Name is unique after trim and lowercase normalization.
- Deleting a category requires confirmation and deletes all phrases under that category.
- Selected phrases can be moved to another category; source categories for selected rows are disabled as move targets.
- Store is local front-end state.

### Common Link Management

- Common Link Management maintains frequently used website references for the current demo session.
- Search supports Website Name and Website URL.
- List columns include No., Website Name, Website URL, Remark, and Actions.
- Add, Edit, and Delete are local demo actions.
- Website Name and Website URL are unique after trim and lowercase normalization.
- Website URL must start with `http://` or `https://`.
- Shared voice, video, and Live Chat workspaces read Common Link Management data in the right-side `Common Links` tab.
- Store is local front-end state.

### Common Number Management

- Common Number Management maintains IVR transfer targets for the current demo session.
- Entries contain Name, Number, Status, and Remark.
- Search supports Name, Number, and Status.
- List columns include No., Name, Number, Status, Remark, and Actions.
- Add, Edit, and Delete are local demo actions.
- Name and Number are unique after trim and lowercase normalization.
- Number is required but does not enforce strict phone format so IVR short codes and service numbers can be used.
- Only `Active` entries appear in the call Transfer modal `Transfer IVR` tab.
- Store is local front-end state.

### Sensitive Word Management

- Sensitive Word Management maintains sensitive words used to block Live Chat agent replies before sending.
- Search supports Sensitive Word and Category.
- Category is a fixed data dictionary and is not maintained in this menu.
- Current category examples include Security Credential, Personal Data Exposure, Regulatory or Compliance Risk, Profanity / Offensive Language, and Harassment / Discriminatory Language.
- List columns include No., Sensitive Word, Category, Remark, and Actions.
- Add, Edit, and Delete are local demo actions.
- Sensitive Word is unique after trim and lowercase normalization.
- Store is local front-end state.

## 21. Routing Config Rules

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
- Webchat Text Business Config shows `Webchat Message Recall Limit (sec)`.
- Non-Webchat text channels do not show that Webchat-specific field.
- Business Types include `Source Business Code`.
- Skill Routing Rules use configured route elements and target skill queues.
- Site Access Volume ratios should total 100% for the same channel + media combination.
- Working Time Plans support work schedule, Ramadan schedule, holiday schedule, and special working plans.

All Routing Config changes are front-end demo state only.

## 22. Localization Rules

Current implemented language mix:

- System shell and controls are mostly English.
- Business data, customer service topics, tickets, and KBV questions include Indonesian.
- Future localization must decide between:
  - all English,
  - all Indonesian,
  - English UI with Indonesian business data.

Do not introduce old customer brand names into visible UI or handoff docs.
