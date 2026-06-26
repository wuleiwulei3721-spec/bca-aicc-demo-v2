# BANK 1 AICC Demo V2 - Current TODO

Last updated: 2026-06-23 18:19 +08:00

This list focuses on current handoff priorities. Historical granular TODOs remain available in `PROJECT_CONTEXT.md`, `DEV_LOG.md`, and `.codex-backup/`.

## P0 - Customer Confirmation and Demo Acceptance

- Confirm final KBV / Customer Verification V2 policy:
  - whether PIN success reduces or replaces question verification,
  - whether authenticated channels need fewer questions,
  - whether `Berurut` must be strictly enforced,
  - whether agents can modify Skill / Customer Segment,
  - whether reason logging is required when conditions change.
- Confirm verification failure handling:
  - stop service,
  - allow retry,
  - transfer supervisor,
  - create ticket,
  - end service,
  - audit record fields.
- Confirm answer-source policy:
  - CRM,
  - Card Link,
  - CardPack,
  - Base24,
  - BankApp login context,
  - backend-only matching,
  - whether answers should ever be visible to agents.
- Confirm special verification scenarios:
  - ATO,
  - add-on,
  - O1-O3 / O4-O5,
  - branch combined verification,
  - mbl d,
  - KBB / BBP,
  - Paylater-specific rules.
- Confirm final language direction:
  - all English,
  - all Indonesian,
  - English framework UI with Indonesian business content.
- Confirm whether screenshots are approved for customer demos and public deployment.

## P1 - Manual Verification Before Customer Demo

- Verify `/` login, Sign In, service mode selection, Ready / Not Ready, AUX, Sign Out, and Log Out guards.
- Verify PSTN flow:
  - menu click opens incoming call,
  - Answer works,
  - Hold and Mute are mutually exclusive,
  - Transfer opens call transfer modal,
  - Transfer IVR shows enabled Common Number Management entries only,
  - Hang Up enters After Call Work then Ready.
- Verify toolbar call context:
  - PSTN shows IVR and Skill,
  - BankApp voice/video shows BankID and Skill,
  - Idle hides call context.
- Verify Customer Information:
  - identity refresh,
  - contact management,
  - outbound approval,
  - Send Email,
  - Call Flow Detail,
  - Customer Verification V2.
- Verify CRM and Assistant screenshot rendering:
  - `/screenshots/crm-workspace.jpg`,
  - `/screenshots/assistant-workspace.jpg`,
  - fallback does not appear unless intentionally testing missing images.
- Verify Ticketing History / Next Best Action / Quick Action:
  - click opens CRM dynamic tabs,
  - dynamic tabs can close,
  - tab labels remain compact.
- Verify Video Popup Workspace:
  - BankApp Video opens Video Call tab,
  - OpenEye floating window appears only during connected active video,
  - screen-share selection and BankApp screen-sharing demo work,
  - Hang Up hides OpenEye.
- Verify whether closing a Video Call tab without Hang Up is acceptable for demos.
- Verify Live Chat workspace:
  - fixed Live Chat tab opens after digital-capable sign-in,
  - Current / History views,
  - channel filters,
  - sorting,
  - hidden star marker behavior,
  - unread count,
  - SLA timer and unanswered progress bar,
  - Send message,
  - End Service / Close,
  - Message Record,
  - Quick Replies,
  - Sensitive Word send blocking,
  - Transfer.
- Verify Online Chat / text-channel story:
  - BankApp Live Chat handoff,
  - WhatsApp Demo handoff,
  - Webchat mock session in Live Chat,
  - decide whether a standalone Webchat customer simulation is required.
- Verify BankApp Demo:
  - Voice,
  - Video,
  - Live Chat,
  - Registered / Guest,
  - Agent Workspace step,
  - Service Closed step.
- Verify WhatsApp Demo:
  - request,
  - business selection,
  - agent chat,
  - handoff,
  - satisfaction rating.
- Verify Call Management:
  - Verification Rules,
  - Global Control Configuration,
  - Blacklist Management,
  - Priority List Management,
  - Common Phrase Management,
  - Common Link Management,
  - Common Number Management,
  - Sensitive Word Management,
  - Busy Reason Management.
- Verify Routing Config:
  - Routing Config visible by default,
  - Channels Phone Accounts disabled,
  - Webchat recall field only on Webchat Text business config,
  - Skill Routing Rules batch behavior,
  - Site Access Volume ratio validation,
  - Working Time Plans layout.
- Verify `/design-system` still loads and reflects current component rules.

## P1 - UI and Content Refinement

- CRM screenshot optimization:
  - confirm final customer-approved screenshot,
  - ensure it fits the panel without blur, crop, or fallback.
- Assistant screenshot optimization:
  - confirm final customer-approved screenshot,
  - ensure Assistant and Connection tabs stay readable.
- Modal style optimization:
  - keep Transfer / Outbound / Internal Chat in the current light-blue shell,
  - ensure inputs and actions align,
  - avoid returning to full-white or muddy modal backgrounds.
- Live Chat visual polish:
  - ensure four-column layout does not compress the core workspace,
  - keep Current / History and channel filters compact,
  - keep Message Record and Quick Replies usable.
- Localization optimization:
  - standardize terms such as Skill, Customer Segment, Scenario, BankApp, Webchat, WhatsApp,
  - keep Indonesian KBV questions and business cases readable.
- Routing Config content review:
  - align channel names, business type names, skill queues, and routing examples with customer narration.

## P2 - Future Features

- Add standalone Webchat customer simulation if customer requires it.
- Add Dashboard page if demo scope expands.
- Add Supervisor page if demo scope expands.
- Add Admin dashboard if demo scope expands beyond current management pages.
- Add Reporting / KPI pages if demo scope expands.
- Add real API integration layer if moving beyond front-end demo.
- Add Playwright smoke tests for:
  - login,
  - Sign In,
  - PSTN call,
  - BankApp handoff,
  - WhatsApp handoff,
  - Live Chat,
  - Verification Rule V2,
  - Routing Config core pages.
- Consider code splitting if Vite large chunk warning becomes a deployment or performance concern.
- Define production data contracts for:
  - verification rules,
  - routing config,
  - blacklist,
  - priority list,
  - busy reasons,
  - live chat sessions,
  - CRM and assistant integration.

## Not Currently Planned Without Confirmation

- Real simultaneous multi-call handling.
- Real OpenEye media protocol integration.
- Real WhatsApp / BankApp / Webchat gateway connection.
- Real CRM SSO / CRM embedded iframe integration.
- Backend persistence for management pages.
- Replacing the current workbench visual system with a new global style.
