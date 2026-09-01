# BANK 1 AICC Demo V2 - Design System

Last updated: 2026-09-01 15:39 +08:00

This document records the current implemented visual rules. It should be treated as the design baseline for future pages and components.

## 1. Overall Design Principle

The application should feel like a banking contact center workstation:

- dense but readable,
- operational rather than marketing-oriented,
- restrained color usage,
- clear status and action hierarchy,
- stable layout for repeated demos,
- no decorative hero sections or large empty card compositions on business pages.

Future modules such as Dashboard, Supervisor, Admin, Online Chat extensions, or Video Call extensions should inherit this workbench style.

## 2. Layout Structure

The app shell is implemented by `BasicLayout`:

- Header height: `60px`.
- Left sider expanded width: `220px`.
- Left sider collapsed width: `48px`.
- The authenticated shell stays within one viewport; menu length must not make the browser page scroll.
- In expanded left sider mode, only the menu list scrolls vertically; the collapse button and menu search remain fixed at the top.
- Route entry may open the matching parent menu, but users can manually collapse the current parent group afterward.
- Main content uses a full workbench canvas.
- Workspace content is tab-driven through `AgentWorkspace`.
- Visible management pages open inside `AgentWorkspace` as closable workspace tabs; they should not replace the workbench canvas or hide active popup, call, or Live Chat tabs.
- Registered management-page URLs are compatibility entries: they may open the matching workspace tab, then return the URL to `/` so the workspace remains the stable shell.
- `AI` is an external-link side-menu group below Monitoring; `Quality Manage` and `AI Assist Config` open new browser tabs and must not navigate or reset the current workspace.
- Interaction workspaces use a high-density layout:
  - optional lead panel,
  - left customer context column,
  - center CRM / Conversation workspace,
  - right Assistant / Common Links panel.
- Email uses a dedicated high-density desktop layout: mailbox folders/list, a fixed 280px shared customer context column, the shared `CRM / Email` workspace shell, and a related-record rail inside the Email panel.

The main workspace should not be turned into a landing page. The first screen after login is a working console.

## 3. Header Design Principles

The header is a high-emphasis BANK 1 shell:

- Use the blue BANK 1 gradient / strong blue header treatment.
- Keep `BANK 1` as the main brand signal.
- Keep the agent call toolbar centered in a dedicated middle header region when signed in; it must not overlap the right-side controls.
- Keep notification, internal chat, profile, and logout on the right.
- Long profile text is single-line ellipsized so the right action area remains compact and stable.
- The header must remain scan-friendly at demo resolutions.

Agent profile area:

- Shows `Role - numeric ID agent name`.
- Shows team and current status separated by ` | `; service capability is not exposed as a selectable or displayable profile field.
- Profile metadata uses a 190px desktop width: name and team/status lines truncate independently, while avatar, menu trigger, and logout retain stable dimensions. The toolbar is offset slightly left through the header grid so this width does not reduce its available space.
- Do not use uploaded or photographic agent avatars. `AgentAvatar` displays the first non-whitespace display-name character on `#1473E6`; `CustomerAvatar` uses the fixed `UserOutlined` icon on `#809AFF`. Both are circular with a `1px rgba(255, 255, 255, 0.5)` border. Use the customer avatar in Live Chat and Interaction Log detail conversations; keep the Social Media popup's approved customer imagery unchanged.
- In the Live Chat message record, agent senders use `numeric ID-name`; customer and system senders retain their original labels.
- Live Chat Message Record date-range inputs and result timestamps use `DD-MM-YYYY HH:MM:SS`; when a time range is selectable, filtering must respect the selected seconds.
- Status dot reflects offline, ready, away, or busy.
- The profile menu is status-specific: Unsigned exposes Sign In and Settings; all Not Ready states expose AUX reasons and Sign Out; Ready exposes AUX reasons; Pre-AUX hides Sign Out.
- Agent Settings sits below a divider at the bottom of the profile menu. Current setting: system prompt sound on/off; future agent-owned preferences can be added in this modal.

## 4. Toolbar Design Principles

The toolbar is operational and compact:

- Use icon + text mode by default.
- Use familiar call icons for Answer, Hold, Transfer, and Hang Up.
- Do not replace call actions with decorative text buttons.
- Answer flashes only for incoming calls.
- Hang Up uses danger styling.
- Hang Up can use a compact split-button when abnormal end reasons are available: the main danger action stays on the left, and the right caret opens those reasons.
- Hold uses selected / active styling.
- The Ready / Not Ready control remains visible in the toolbar. During the first default-Not Ready sign-in, its Ready state is visibly disabled until a Voice or Video Incoming popup unlocks the ordinary toggle behavior; disabled Ready keeps the same visual on hover and must not suggest clickability.
- More actions are behind an ellipsis menu; Settings is temporarily hidden from the toolbar More menu.
- At narrow desktop widths, toolbar actions use their existing icons and tooltips while their text labels and call context are hidden to preserve the right-side controls.
- Shared operation feedback uses `OperationFeedbackProvider` and `OperationNotice`: a compact English `success`, `info`, or `error` banner directly below the Header, centered without covering the call controls. It shows only the latest non-blocking result, resets its timer when superseded, and auto-hides after four seconds. Transfer, Email, management configuration, workspace, and local Employee Management outcomes must call the shared feedback hook; do not create page-specific toast styles, title-level success Alerts, or use the default Ant message position for operational outcomes.
- `OperationNotice` uses a polite live status region for success/info and an assertive alert for errors. Keep validation, duplicate-data guidance, sensitive-word blocks, association/delete guards, login errors, and service/SLA/new-customer warnings in their existing contextual Alert or modal forms. Keep destructive confirmation and approval results as dialogs; do not convert them into an auto-dismissed notice.
- Do not show a success notice when the resulting state is already immediately visible in the workspace, such as a CRM-driven Customer Information refresh. Keep success feedback for actions whose completion would otherwise be unclear.

Call context display:

- During `Incoming`, `Talking`, and `Hold`, show call identification and Skill.
- PSTN displays `IVR +08123456789`.
- BankApp voice/video displays `BankID 00012345`.
- Skill displays as a second row; inbound calls use `Skill Credit card activation` and outbound number / agent calls use `Skill -`.
- Idle / ended call state hides call identification and Skill.

## 5. Card Design Principles

Use `BaseCard` and `SectionCard` patterns:

- Cards use white or subtle highlighted backgrounds.
- Border radius should remain compact: 4px, 6px, or 8px depending on component.
- Compact business cards use small headers and tight body padding.
- Card headers should be short and functional.
- Expandable cards use a compact arrow affordance.
- Do not nest UI cards inside other cards.
- Do not create floating card page sections unless the card represents a real repeated item, modal section, or framed tool.

Inbound left-column cards:

- Customer Information stays fixed at the top. The shared customer-context column containing Customer Information, Customer Journey, Ticketing History, Next Best Action, and Quick Action is fixed at `270px` on desktop across inbound voice/video, Live Chat, Email, and Social Media workspaces; narrow stacked layouts may expand it to the container width.
- Customer Information exposes a compact `Call` action only for a phone row with a usable number. It appears on hover or keyboard focus, remains disabled with `Switch to outbound AUX` until outbound AUX eligibility is active, and opens the existing compact `Outbound Reason` modal when eligible. It preserves the TL approval state/result popup for ordinary Agents. The resulting outbound call creates no workspace tab and does not activate a customer screen pop. The bottom access-channel tag, verification status, and KBV action share the same compact geometry while retaining their semantic colors.
- Customer Information keeps the compact name-plus-icon/value presentation. Phone, Email, Customer Number, and Segmentation use the same 24px icon slot and centered 20px icon container as the Customer Journey channel rows; their values start on the same text baseline as Journey Category. Segmentation uses a neutral `TeamOutlined` customer-group icon. Identified profiles use country-coded phone formatting. Email renders the address and its contact verification status as separate text spans: only the address receives hover/focus underline, while `Verified` / `Unverified` uses the same semantic text color and small type scale as verification status without a background, parentheses, or label underline. Customer Information fact rows keep a fixed 22px height with a tightened vertical gap; the phone action reserves its horizontal column and sizes to its text so hover/focus does not change row height or leave unnecessary space. Customer Information inline controls use one compact standard: 22px height, 10px text, 650 font weight, 18px line height, 8px horizontal padding, compact radius, and shared hover/focus treatment. The direct `Call` action, Special Handling, and access-channel tag use the same base geometry with their respective semantic colors. When Special Handling is available, it stays on the same row at the far right of Segmentation and sizes to its text. Unidentified interactions keep the three icon rows with `-` placeholder values except for a channel-provided WhatsApp number in an unidentified WhatsApp Phone row; they do not render an avatar, Segmentation, Special Handling, CRM-dependent header actions, or customer-phone outbound until a valid CIS loads. The toolbar remains responsible for the anonymous caller number used in call identification. The shared access duration is fixed mock data formatted as `mm:ss` below one hour or `hh:mm:ss` at one hour or above; Email SLA and Social Media reply-SLA timers remain separate.
- Verification status and entry controls are conditional by channel/media: PSTN, BankApp Voice/Video, and Webchat Voice/Video keep the status plus `KBV`; registered BankApp text keeps the status plus `PIN`; WhatsApp, Email, Webchat text, Social Media, and guest BankApp text omit both. Social Media's populated customer state is `Identified, Unverified`; hiding the status/action is still required. The shared bottom-row control geometry remains unchanged when either verification element is omitted.
- Webchat text keeps `Webchat` as the internal channel value but uses the `bca.co.id` display-label override in the Customer Information access tag; the override does not change the channel icon, style, routing, or verification rule matching.
- Customer-profile contact information is read-only in customer deployments. Its header provides the compact `IdcardOutlined` `All Contact Details` icon with a tooltip; the Customer Number / CIS fact row uses a centered literal `SIC` marker in the shared fixed icon slot. The modal groups channels in a clean two-column list: fixed left channel icon/name and right CRM values stacked as read-only text, including `-` empty states. The viewer and local legacy editor reuse one shared channel-icon presentation. Do not render editing controls in customer deployments. The legacy pencil is local-maintainer-only behind its explicit feature flag and appears beside the viewer only when enabled.
- Journey / Ticket / NBA / Quick Action live in the scroll area.
- Collapsed journey and ticket lists show the most recent two items.
- Expanded journey and ticket lists show up to ten items.
- Empty Customer Journey, Ticketing History, and Next Best Action cards use the compact shared message `No data available.`; Quick Action remains available independently of customer-specific data.
- Shared Ticket registration keeps the existing right-side modal shell with one white content surface, matching the Customer Information outbound-reason modal. Category and Product are searchable single-select controls; Product stays disabled until a Category is selected and only exposes products linked to that Category. Both use the standard fixed-height single-line Select layout: a long selected value is ellipsized and the arrow stays right-aligned and vertically centered. All four editable control values use 12px primary text with an 18px line height; Summary and Note counts sit inside the lower-right corner in normal 11px text. Ticketing History Category follows Customer Journey's one-line ellipsis rule. Summary is capped at 250 and Note at 1000. Ticket text areas reuse the shared limited-input component and its count treatment. One-Click Generation occupies the left side of the fixed footer, aligned with the Cancel / Confirm action group on the right.

## 6. Modal Design Principles

Use `BaseModal` or `AdminModal`, not raw modal structures.

Current modal kinds:

- `standard`
- `transfer`
- `outbound`
- `internal-chat`
- `settings`
- `verification`
- `detail`
- `email`

General rules:

- Modal title area should be compact.
- Body should have enough padding and clear section separation.
- Transfer / Outbound / Internal Chat modals use a light blue title/body treatment with white content panels.
- Search controls and action buttons inside modals should align to the same height.
- Long modal content should scroll inside the modal body, not push footer actions off-screen.
- Admin modal footers should use `AdminModalFooter`.
- The Customer Information `Outbound Reason` Modal uses a light-blue header with one uninterrupted white content body. A nonempty customer phone number exposes the compact `Call` action only while its phone row is hovered or receives keyboard focus; the action remains disabled when the agent is not in an eligible outbound AUX.
- The TL approval route remains available for ordinary-Agent outbound number and Customer Information phone requests. Its pending popup includes a 10-second countdown and retains the `N more pending` queue indicator when additional requests exist; timeout closes the popup and uses the standard right-bottom result dialog to require a new request. This approval/result UI is separate from customer screen-pop behavior.

## 7. Tab Design Principles

Use `BaseTabs`.

Variants:

- `toolbar`: workspace tabs, CRM tabs.
- `modal`: modal internal tabs.
- `assistant`: right-side Assistant / Common Links / extra tabs.

Rules:

- Workspace tabs can be editable-card style.
- In the top workspace tab bar, only Home keeps an icon; Monitor, channel simulation, Live Chat, call, and management page tabs are text-first.
- Home and Live Chat fixed tabs are not closable.
- Live Chat workspace tab may show compact status badges after the longest service duration: orange for unanswered SLA warning count and red for unanswered SLA breach count.
- Routing Config Channels Business Config uses the same Live Chat SLA warning and breach colors for Agent Service threshold status dots.
- Active call tabs are not closable; ended call tabs are closable.
- Management page tabs use stable `page:*` keys, are closable, and reuse an existing tab when the same left-menu item is clicked again.
- The Email workspace is a customer-visible text-first closable workspace tab; repeated menu clicks reuse the same tab and closing it returns to Home.
- Closing a management page tab should fall back to a neighboring workspace tab when available, otherwise Home.
- CRM base tab is not closable.
- Conversation tab is not closable.
- Dynamic CRM business tabs are closable.
- The agent-side Customer Verification workflow opens as a fixed right-side Assistant tab so CRM can stay visible for answer comparison.
- Assistant extra tabs can be closable unless the feature requires fixed presence, such as Quick Replies.

## 8. Button Design Principles

Use `BaseButton`, `ToolbarButton`, or the admin component buttons.

Button variants:

- `primary`: main action.
- `secondary`: default supporting action.
- `ghost`: low-emphasis action.
- `toolbar`: compact workbench action.
- `danger`: destructive or end-service action.

Admin buttons:

- Search uses primary.
- Reset uses secondary.
- Add / Batch Add use primary and sit in the right primary-action area.
- Delete uses danger.
- Search / Reset should be equal height and usually equal width.
- Add / Batch Add should use natural text width.

Split action buttons:

- Use split buttons only when the main action has a clear default and the caret exposes related alternatives.
- When no alternative is available, omit the caret and render the main action with its normal full border radius.
- Keep the main button and caret at the same height with no layout shift.
- The caret segment should be icon-only with an accessible label and tooltip/title.
- End-service split buttons must preserve the existing main action behavior; abnormal alternatives live only under the caret menu.

## 9. Icon Usage Principles

Use `@ant-design/icons` and existing local icons:

- Use call icons for call actions.
- Use `PhoneIcon` where the project already uses it.
- Use channel icons for WhatsApp, BankApp, Webchat, Voice, Video where implemented.
- Prefer icon buttons for compact controls such as close, settings, history, search, star, recall, expand/collapse.
- Provide `aria-label` or `title` for icon-only controls.

Do not introduce hand-drawn SVG icons unless a local asset or icon library cannot cover the need.

## 10. Typography

Current typography scale from `/design-system`:

| Role | Size | Weight | Line Height | Usage |
| --- | --- | --- | --- | --- |
| Page Title | 20px | 600 | 28px | Workspace page heading |
| Section Header | 15px | 700 | 22px | Modal title and major sections |
| Card Title | 12px | 650 | 16px | Dense card header |
| Body Text | 13px | 400-600 | 20px | Primary content |
| Secondary Text | 12px | 600 | 18px | Metadata and labels |
| Caption | 11px | 650 | 16px | Badges and compact hints |
| Status Text | 11px | 650 | 18px | Status badge labels |

Rules:

- Do not use hero-scale text inside cards, panels, sidebars, dashboards, or toolbars.
- Letter spacing should remain normal.
- Long labels must not overflow their container.

## 11. Spacing

Current spacing tokens:

- Page padding: `12px` shell / `24px` standard.
- Card padding: `10px` compact / `16px` standard.
- Module gap: `8px` compact / `16px` standard.
- Row gap: `6px-8px`.
- Modal body gap: `10px`.
- Modal footer button gap: `8px`.
- Control heights:
  - small: `28px`,
  - default: `34px`,
  - large: `38px`,
  - modal button: `30px`,
  - toolbar button: `29px`.

## 12. Color Principles

Core colors:

- Primary blue: `#1769E0`.
- Strong blue: `#0F4FB4`.
- Header blue: `#0F5FC6`.
- Header gradient: `#0B4FA8 -> #1769E0 -> #1686CF`.
- Background: `#F4F7FB`.
- Card background: `#FFFFFF`.
- Subtle background: `#F8FBFF`.
- Border: `#DDE6F2`.
- Strong border: `#C8D6E8`.
- Hover: `#F3F8FF`.
- Active: `#DBEAFF`.
- Selected: `#E8F1FF`.
- Success: `#1F9D67`.
- Warning: `#D9822B`.
- Error / danger: `#D64545`.

Rules:

- Avoid one-note palettes.
- Keep BANK 1 blue as the primary system color, not the only color on the page.
- Use green only for ready, verified, success, or passed states.
- Use orange for warning, AUX, pending, or SLA warning states.
- Use red for failed, danger, hang up, or SLA breach states.
- Keep customer workbench backgrounds light and layered.

## 13. Admin Management Page Contract

For Call Management, Routing Config, Employee Management, or future maintenance pages, use:

- `AdminPage`
- `AdminToolbar`
- `AdminFilterField`
- `AdminTable`
- `AdminModal`
- `AdminFormField`
- `AdminModalFooter`
- `StatusBadge`

Do not handwrite a separate query bar, table style, pagination style, fixed Actions column, modal footer, or input-height system inside each page.

Admin list rules:

- Query controls are 32px high.
- Keyword width: about `240-260px`.
- Normal input/select width: about `200-220px`.
- Status width: about `150-160px`.
- Main list default pagination: 10 rows.
- Table headers are bold.
- Data rows use normal font weight.
- First data field should not be artificially bold unless the design system says so.
- Status columns use text badges, not switches.
- Switches belong in add/edit modals.
- Size columns for the target desktop workspace before enabling horizontal scroll. Long URLs, remarks, and other secondary text use one-line ellipsis; do not leave avoidable whitespace in one column while pushing essential fields or actions behind a horizontal scrollbar.
- Use horizontal table scroll only when the confirmed minimum widths still cannot fit the target desktop workspace. In that case, keep the Actions column fixed right; otherwise do not set horizontal scroll or fixed table columns.
- For manually ordered configuration lists, show Move to Top, Move Up, Move Down, and Move to Bottom as direct icon-only Actions controls with tooltips. Keep boundary and filtered-list controls disabled; do not introduce a page-specific dropdown ordering pattern.
- Edit modals show requested editable fields only. Do not add created/modified information panels unless the management-page contract explicitly requires them.
- Admin page content may scroll vertically inside the workspace for long lists; the browser page and left sider top search/collapse area must remain fixed.
- Internal table vertical scroll is only for long tables inside modals.
- Complex filters may wrap, but Search / Reset stay in the query action group and Batch Add / Add stay in the right primary-action group.
- Admin filter controls must use the shared 32px alignment for Input, Select, and Date/RangePicker controls; placeholders and selected values should be vertically centered.
- Call Management audit timestamps use `DD-MM-YYYY HH:MM:SS` and display `Created By` / `Created Time` or `Updated By` / `Updated Time`; `Modified` is not used as a second label for the same last-update meaning. Other management modules will adopt this format in their own migration scope.
- When update audit columns are present, list them at the end in `Updated Time`, then `Updated By`, then `Actions` order. Size management-table columns to their content and use horizontal scrolling only when confirmed minimum widths cannot fit the target workspace.
- `LimitedInput` and `LimitedTextArea` are the shared character-limit controls. Remark fields default to 2000 characters, while business-specific limits are passed explicitly, such as Sensitive Word 100, Common Phrase 100, Common Link Website Name / Website URL 200, Quick Action Action Name / Link Address 200, Question Name 100, Ticket Summary 250, or Ticket Note 1000. They share the Ticket count style: a compact normal-weight count that stays inside the control without changing the field geometry, and clamp over-limit change events at the configured maximum.
- Local-only management modules such as Employee Management must still use English UI text and the same admin layout contract as customer-visible management pages.

## 14. Responsive and Demo Quality Rules

Before changing UI, verify the target demo resolution:

- Header controls should not overlap profile actions.
- Inbound three-column layout should not overflow horizontally.
- Live Chat four-column layout should still leave Customer Information, Conversation, and Assistant usable.
- Live Chat customer lists show all three demo channels together; channel filter controls stay hidden, with sort and collapse actions grouped beside Current / History.
- Email must keep mailbox, customer context, mail body, and thread record usable at 1366x768 and larger desktop demo resolutions; each panel owns its vertical scrolling and the browser page must not scroll horizontally.
- Email must reuse the shared Live Chat customer column and `CrmPanel`. Its CRM tab uses the same current CRM screenshot as Live Chat; the legacy full-system Email design screenshots must not be embedded or used to duplicate the application shell.
- Email folder controls use solid circular colors sampled from the approved reference: Inbox `#00B578`, Sent `#39B0FF`, Drafts `#FF8200`, and Trash `#EF4444`, with white icons and `#EFF6FF` for the active background. Search is a single rounded input with a leading search icon; Refresh is the separate adjacent icon button.
- CRM / Assistant screenshots should render without distortion or fallback unless the file is missing.
- Text inside buttons, tabs, cards, and table cells should not overlap or clip.

If a change affects pages or interactions, run `npm run lint`, `npm run build`, and browser smoke checks unless the task is documentation-only.
