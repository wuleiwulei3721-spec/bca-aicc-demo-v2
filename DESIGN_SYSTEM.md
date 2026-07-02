# BANK 1 AICC Demo V2 - Design System

Last updated: 2026-07-02 17:56 +08:00

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
- Main content uses a full workbench canvas.
- Workspace content is tab-driven through `AgentWorkspace`.
- Interaction workspaces use a high-density layout:
  - optional lead panel,
  - left customer context column,
  - center CRM / Conversation workspace,
  - right Assistant / Common Links panel.

The main workspace should not be turned into a landing page. The first screen after login is a working console.

## 3. Header Design Principles

The header is a high-emphasis BANK 1 shell:

- Use the blue BANK 1 gradient / strong blue header treatment.
- Keep `BANK 1` as the main brand signal.
- Keep the agent call toolbar centered in the header when signed in.
- Keep notification, internal chat, profile, and logout on the right.
- Avoid adding long text or extra navigation into the header.
- The header must remain scan-friendly at demo resolutions.

Agent profile area:

- Shows role + agent name.
- Shows team and selected service mode.
- Status dot reflects offline, ready, away, or busy.
- Sign In / Sign Out / AUX actions are accessed from the profile menu.
- Agent Settings sits below a divider at the bottom of the profile menu. Current setting: system prompt sound on/off; future agent-owned preferences can be added in this modal.

## 4. Toolbar Design Principles

The toolbar is operational and compact:

- Use icon + text mode by default.
- Use familiar call icons for Answer, Hold, Mute, Transfer, Hang Up, Ready / Not Ready.
- Do not replace call actions with decorative text buttons.
- Answer flashes only for incoming calls.
- Hang Up uses danger styling.
- Ready uses success / ready styling.
- Hold and Mute use selected / active styling.
- More actions are behind an ellipsis menu; Settings is temporarily hidden from the toolbar More menu.

Call context display:

- During `Incoming`, `Talking`, `Hold`, and `Mute`, show call identification and Skill.
- PSTN displays `IVR 08123456789`.
- BankApp voice/video displays `BankID 00012345`.
- Skill displays as a second row, currently `Skill Credit card activation`.
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

- Customer Information stays fixed at the top.
- Journey / Ticket / NBA / Quick Action live in the scroll area.
- Collapsed journey and ticket lists show the most recent two items.
- Expanded journey and ticket lists show up to ten items.

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

## 7. Tab Design Principles

Use `BaseTabs`.

Variants:

- `toolbar`: workspace tabs, CRM tabs.
- `modal`: modal internal tabs.
- `assistant`: right-side Assistant / Common Links / extra tabs.

Rules:

- Workspace tabs can be editable-card style.
- Home and Live Chat fixed tabs are not closable.
- Live Chat workspace tab may show compact status badges after the longest service duration: orange for unanswered SLA warning count and red for unanswered SLA breach count.
- Routing Config Channels Business Config uses the same Live Chat SLA warning and breach colors for Agent Service threshold status dots.
- Active call tabs are not closable; ended call tabs are closable.
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
- Page container scrolls vertically for long lists.
- Internal table vertical scroll is only for long tables inside modals.
- Actions column should be fixed right when horizontal scroll is needed.
- Complex filters may wrap, but Search / Reset stay in the query action group and Batch Add / Add stay in the right primary-action group.
- Local-only management modules such as Employee Management must still use English UI text and the same admin layout contract as customer-visible management pages.

## 14. Responsive and Demo Quality Rules

Before changing UI, verify the target demo resolution:

- Header controls should not overlap profile actions.
- Inbound three-column layout should not overflow horizontally.
- Live Chat four-column layout should still leave Customer Information, Conversation, and Assistant usable.
- CRM / Assistant screenshots should render without distortion or fallback unless the file is missing.
- Text inside buttons, tabs, cards, and table cells should not overlap or clip.

If a change affects pages or interactions, run `npm run lint`, `npm run build`, and browser smoke checks unless the task is documentation-only.
