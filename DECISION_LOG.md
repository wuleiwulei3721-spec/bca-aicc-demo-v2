# Decision Log

Last updated: 2026-07-07

This document records important product and system design decisions that can be confirmed from the current codebase, project documents, `DEV_LOG.md`, and readable Git history. It intentionally omits bug fixes, visual micro-adjustments, temporary test data, copy-only tweaks, and implementation details that do not affect product direction.

--------------------------------------------------

Decision ID:
DEC-001

Module:
Overall Product

Decision:
The project is a front-end BANK 1 AICC demo for an enterprise banking agent desktop, not a generic web template or marketing site.

Reason:
The implemented system centers on agent sign-in, inbound voice/video/live chat handling, customer information, CRM, assistant, verification, tickets, and management configuration. Current documentation repeatedly defines the target experience as a dense, restrained, repeatable banking service workstation.

Impact:
Future work should preserve the workbench-first information architecture and avoid turning the first screen into a landing page, marketing page, or sparse dashboard unless product scope changes.

Status:
Implemented

Source:
文档: `PROJECT_CONTEXT.md`, `DESIGN_SYSTEM.md`, `AGENTS.md`; 代码: `src/layouts/BasicLayout.tsx`, `src/pages/AgentWorkspace.tsx`, `src/pages/inbound/*`

--------------------------------------------------

Decision ID:
DEC-002

Module:
Routing and Authentication

Decision:
Business pages run under authenticated `BasicLayout`; `/login` is the public entry; unauthenticated users are redirected to `/login`.

Reason:
The system represents an agent desktop, so navigation, agent profile, media status, call toolbar, side menu, and internal chat must be available consistently after login. Public access is limited to the demo login page.

Impact:
New workbench, management, or design-system routes should be added under the authenticated shell unless explicitly designed as public customer-side simulations.

Status:
Implemented

Source:
代码: `src/routes.tsx`, `src/App.tsx`, `src/layouts/BasicLayout.tsx`; 文档: `PROJECT_CONTEXT.md`, `CURRENT_STATUS.md`; 历史记录: Git commits around customer auth and agent state demo update

--------------------------------------------------

Decision ID:
DEC-003

Module:
Workspace Tabs

Decision:
The main agent workspace uses a tab model with fixed Home / BankApp Demo / Webchat Demo / WhatsApp Demo / Live Chat entries and dynamic PSTN / Voice Call / Video Call interaction tabs.

Reason:
This preserves multiple demo contexts in one workbench while allowing inbound calls and channel simulations to open without navigating away from the agent desktop.

Impact:
Future interaction types should integrate through the existing tab model and `useAppStore` workspace state instead of creating isolated top-level pages that bypass the shell.

Status:
Implemented

Source:
代码: `src/pages/AgentWorkspace.tsx`, `src/store/appStore.ts`; 文档: `PROJECT_CONTEXT.md`, `CURRENT_STATUS.md`

--------------------------------------------------

Decision ID:
DEC-004

Module:
Workspace Tabs

Decision:
Active call tabs are not closable; ended call tabs become closable. Hang Up is the authoritative action for ending voice/video service.

Reason:
Closing a tab must not accidentally terminate or hide an active customer service flow. The call lifecycle is controlled by the toolbar and layout state machine.

Impact:
Any future tab-close behavior must respect call phase and should not make tab closure equivalent to Hang Up without explicit product confirmation.

Status:
Implemented

Source:
代码: `src/pages/AgentWorkspace.tsx`, `src/store/appStore.ts`, `src/layouts/BasicLayout.tsx`; 文档: `PROJECT_CONTEXT.md`, `BUSINESS_RULES.md`, `CURRENT_TODO.md`

--------------------------------------------------

Decision ID:
DEC-005

Module:
Multi-Channel Workspace

Decision:
Voice, video, and live chat reuse the shared `InteractionWorkspace` structure: left customer context, center CRM/conversation workspace, and right assistant/connection panel.

Reason:
The demo needs one consistent agent operating model across PSTN, BankApp voice, BankApp video, BankApp live chat, WhatsApp, and Webchat sessions.

Impact:
New channels should extend `InteractionWorkspace` with optional lead panels, overlays, or extra tabs rather than duplicating customer/CRM/assistant layouts.

Status:
Implemented

Source:
代码: `src/pages/inbound/InteractionWorkspace.tsx`, `src/pages/inbound/InboundPage.tsx`, `src/pages/inbound/VideoCallPage.tsx`, `src/pages/inbound/LiveChat2Page.tsx`; 文档: `PROJECT_CONTEXT.md`, `CURRENT_STATUS.md`

--------------------------------------------------

Decision ID:
DEC-006

Module:
Agent Status and Service Mode

Decision:
Agent sign-in mode gates handoff eligibility: Voice only handles voice/video, Digital only handles text channels, and Voice + Digital handles both.

Reason:
The demo must show media-skill mismatch clearly instead of accepting all simulated traffic regardless of agent capability.

Impact:
Future handoff entry points should check `voiceVideoHandoffReadiness` or `digitalHandoffReadiness` before creating service workspaces.

Status:
Implemented

Source:
代码: `src/layouts/BasicLayout.tsx`, `src/store/appStore.ts`, `src/pages/bankapp/BankAppDemoPage.tsx`; 文档: `BUSINESS_RULES.md`, `CURRENT_STATUS.md`; 历史记录: `DEV_LOG.md`

--------------------------------------------------

Decision ID:
DEC-007

Module:
Agent Status

Decision:
AUX requested during active service becomes Pre-AUX first; actual AUX applies only after active customer work is finished.

Reason:
This preserves active service continuity while allowing the agent to queue a post-service unavailable state.

Impact:
Status changes must continue to consider active call and active live chat sessions; future backend integration should map this behavior to server-side service lifecycle.

Status:
Implemented

Source:
代码: `src/layouts/BasicLayout.tsx`, `src/utils/agentStatus.ts`; 文档: `BUSINESS_RULES.md`, `AGENTS.md`

--------------------------------------------------

Decision ID:
DEC-008

Module:
Call Lifecycle

Decision:
Only one unfinished voice/video call can be handled at a time; additional voice/video handoff is blocked when there is an active call or the agent is not Ready.

Reason:
The current demo focuses on a clear single-call operator flow and avoids ambiguous parallel voice/video call handling.

Impact:
Any future multi-call, consult-call, or queue-stacking capability requires a product-level decision and likely changes to `BasicLayout`, `AgentToolbar`, and `useAppStore`. 【需要产品经理确认】

Status:
Implemented for current single-call flow; multi-call is Pending

Source:
代码: `src/layouts/BasicLayout.tsx`, `src/store/appStore.ts`; 文档: `BUSINESS_RULES.md`, `CURRENT_TODO.md`

--------------------------------------------------

Decision ID:
DEC-009

Module:
Call Toolbar

Decision:
The header toolbar is the single control surface for Answer, Hold, Mute, Transfer, Hang Up, Ready/Not Ready, Outbound Call, and toolbar settings.

Reason:
Customer service controls need to remain visible regardless of active workspace tab; the toolbar provides persistent status, timer, customer access identifier, and skill context.

Impact:
New call actions should be added through the toolbar model instead of being hidden inside individual workspace cards.

Status:
Implemented

Source:
代码: `src/layouts/components/AgentToolbar.tsx`, `src/layouts/BasicLayout.tsx`; 文档: `BUSINESS_RULES.md`, `CURRENT_STATUS.md`

--------------------------------------------------

Decision ID:
DEC-010

Module:
Call Context Display

Decision:
Call context in the toolbar shows access identifier and `Skill`; the customer information card no longer owns the duplicated menu hint for call routing context.

Reason:
The skill must be visible immediately during ringing and active service, while customer information should remain focused on customer profile and verification.

Impact:
Future IVR/menu/skill context should be surfaced near call controls when it affects call handling, with customer cards retaining customer-centric data.

Status:
Implemented

Source:
代码: `src/layouts/components/AgentToolbar.tsx`, `src/layouts/BasicLayout.tsx`; 历史记录: `DEV_LOG.md`; 文档: `BUSINESS_RULES.md`

--------------------------------------------------

Decision ID:
DEC-011

Module:
Transfer

Decision:
Call transfer and conversation transfer are separate modal variants: call transfer supports phone number, consult, transfer, and conference; conversation transfer does not expose phone-number transfer.

Reason:
Voice/video and text-channel transfer are different service operations. The text conversation flow should not show phone-number transfer controls that do not apply to chat.

Impact:
Future transfer rules must keep media-specific behavior explicit instead of using one undifferentiated transfer form.

Status:
Implemented

Source:
代码: `src/layouts/components/TransferModal.tsx`, `src/pages/inbound/components/ConversationWorkspace.tsx`, `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`; 文档: `BUSINESS_RULES.md`

--------------------------------------------------

Decision ID:
DEC-012

Module:
Customer Context

Decision:
Customer Information owns verification, identity refresh, contact management, outbound contact actions, email actions, and access-detail entry; Journey, Ticketing History, Next Best Action, and Quick Action open CRM workspace tabs.

Reason:
The left column acts as the customer context and action launcher, while the center CRM workspace is the destination for deeper case, ticket, offer, and action details.

Impact:
New customer-side actions should decide whether they are context controls in the left column or business records opened as CRM tabs.

Status:
Implemented

Source:
代码: `src/pages/inbound/InteractionWorkspace.tsx`, `src/pages/inbound/components/LeftColumn.tsx`, `src/pages/inbound/components/CrmPanel.tsx`; 文档: `PROJECT_CONTEXT.md`, `BUSINESS_RULES.md`, `CURRENT_STATUS.md`

--------------------------------------------------

Decision ID:
DEC-013

Module:
Customer Verification V2

Decision:
Verification Rules V2 are modeled as rules matched by channel, customer segment, and skill queue, with scenarios, question blocks, required-correct counts, max-wrong-attempt settings, and organization overrides.

Reason:
The verification flow has too many variants for a hardcoded question list. A rule/scenario/block model gives the demo a maintainable structure for customer segment and scenario-specific KBV behavior.

Impact:
Future KBV changes should extend the V2 model rather than patching verification UI branches directly.

Status:
Implemented

Source:
代码: `src/types/verificationRuleV2.ts`, `src/utils/verificationRuleV2.ts`, `src/pages/call-management/VerificationRulesPage.tsx`, `src/pages/inbound/components/CustomerVerificationV2Modal.tsx`; 文档: `BUSINESS_RULES.md`, `CURRENT_STATUS.md`; 历史记录: `DEV_LOG.md`

--------------------------------------------------

Decision ID:
DEC-014

Module:
Customer Verification V2

Decision:
The V2 question bank stores question names only; the agent-facing modal asks the agent to mark Correct, Wrong, or Skip rather than displaying stored answers.

Reason:
The current demo confirms question selection and evaluation flow, but real answer sources, masking policy, and backend verification responsibility are not confirmed.

Impact:
Do not add answer values, real identity data, or automated answer validation to the visible demo without confirming the production policy. 【需要产品经理确认】

Status:
Partial

Source:
代码: `src/types/verificationRuleV2.ts`, `src/pages/inbound/components/CustomerVerificationV2Modal.tsx`; 文档: `BUSINESS_RULES.md`, `CURRENT_TODO.md`

--------------------------------------------------

Decision ID:
DEC-015

Module:
BankApp PIN and KBV

Decision:
BankApp PIN verification and KBV question verification are separate verification modes by channel: KBV applies to voice channels, while PIN applies to logged-in BankApp text / Live Chat verification in the current demo.

Reason:
Customer research clarified that question verification is for voice channels, while PIN verification is used when the customer is logged in to the BankApp text scenario. Current code keeps PIN state in the BankApp demo flow while Verification Rules V2 remains a KBV configuration model.

Impact:
Do not merge PIN settings into Verification Rule V2 unless customer policy changes. Webchat PIN remains hidden pending customer confirmation.

Status:
Implemented

Source:
代码: `src/store/appStore.ts`, `src/pages/bankapp/BankAppDemoPage.tsx`, `src/pages/inbound/components/CustomerVerificationModal.tsx`; 历史记录: `DEV_LOG.md`; 文档: `BUSINESS_RULES.md`, `CURRENT_TODO.md`

--------------------------------------------------

Decision ID:
DEC-016

Module:
Live Chat

Decision:
The formal Live Chat workspace uses `LiveChat2Page` behind the visible `Live Chat` tab; legacy `livechat2` naming is kept as compatibility state only.

Reason:
The customer-facing workspace should present one formal Live Chat entry while preserving compatibility for existing state mappings and handoff paths.

Impact:
Future text-channel work should target `LiveChat2Page` and the visible `Live Chat` tab, not create another temporary live chat route or label.

Status:
Implemented

Source:
代码: `src/pages/AgentWorkspace.tsx`, `src/pages/inbound/LiveChat2Page.tsx`, `src/store/appStore.ts`; 文档: `PROJECT_CONTEXT.md`, `CURRENT_STATUS.md`; 历史记录: Git commits around livechat2 popup workspace

--------------------------------------------------

Decision ID:
DEC-017

Module:
Live Chat

Decision:
Live Chat combines a customer list lead panel with the shared interaction workspace, and separates Current and History conversation views.

Reason:
Agents need to triage multiple text sessions while retaining the same customer/CRM/assistant context model used by voice and video.

Impact:
New text-session features should preserve the list-plus-workspace pattern and avoid falling back from Current to History when Current has no active sessions.

Status:
Implemented

Source:
代码: `src/pages/inbound/LiveChat2Page.tsx`, `src/pages/inbound/components/LiveChat2CustomerPanel.tsx`; 文档: `BUSINESS_RULES.md`, `CURRENT_STATUS.md`; 历史记录: `DEV_LOG.md`

--------------------------------------------------

Decision ID:
DEC-018

Module:
Live Chat Channel Rules

Decision:
Live Chat supports WhatsApp, BankApp, and Webchat in one workspace, but channel-specific behavior remains explicit: WhatsApp hides Recall/Re-edit, while BankApp and Webchat can keep recall capability in the current demo.

Reason:
The channels share the same agent handling surface but have different message capabilities and demo requirements.

Impact:
Future text-channel capabilities must be checked per channel instead of assuming every chat channel supports the same actions.

Status:
Implemented

Source:
代码: `src/pages/inbound/LiveChat2Page.tsx`, `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`; 文档: `BUSINESS_RULES.md`; 历史记录: `DEV_LOG.md`

--------------------------------------------------

Decision ID:
DEC-019

Module:
BankApp, Webchat, and WhatsApp Simulations

Decision:
BankApp, Webchat, and WhatsApp are implemented as customer-side demo tabs that feed the agent workspace, not as real external channel integrations.

Reason:
The current project is a front-end demo without real BankApp, WhatsApp, Webchat, IVR, queue, OpenEye, or CRM backends.

Impact:
Do not treat these simulations as production integrations. Backend gateway contracts, authentication handshakes, and real delivery status remain future integration work. 【需要产品经理确认】

Status:
Partial

Source:
代码: `src/pages/bankapp/BankAppDemoPage.tsx`, `src/pages/whatsapp/WhatsAppDemoPage.tsx`, `src/store/appStore.ts`; 文档: `PROJECT_CONTEXT.md`, `BUSINESS_RULES.md`, `CURRENT_STATUS.md`, `CURRENT_TODO.md`

--------------------------------------------------

Decision ID:
DEC-020

Module:
Video Call

Decision:
Video Call uses the shared interaction workspace and an OpenEye-style floating client overlay; BankApp video adds desktop-share selection and screen-sharing demo states.

Reason:
The demo needs to show video context without implementing real media transport, and still keep the agent’s customer/CRM/assistant workspace consistent with voice.

Impact:
Future real video integration should replace the mock overlay/media state behind the same workspace concept where possible.

Status:
Implemented as visual demo; real media integration Pending

Source:
代码: `src/pages/inbound/VideoCallPage.tsx`, `src/pages/inbound/components/OpenEyeVideoWindow.tsx`, `src/store/appStore.ts`; 文档: `PROJECT_CONTEXT.md`, `BUSINESS_RULES.md`, `CURRENT_STATUS.md`, `CURRENT_TODO.md`

--------------------------------------------------

Decision ID:
DEC-021

Module:
Call Management

Decision:
Customer-visible Call Management scope currently includes Verification Rules, Global Control Configuration, Blacklist Management, Priority List Management, Common Phrase Management, Common Link Management, Common Number Management, Sensitive Word Management, and Busy Reason Management; hidden/legacy Call Management routes redirect to Verification Rules.

Reason:
The current demo exposes the management pages relevant to customer review and avoids leaving stale or unfinished configuration pages in the visible menu.

Impact:
New Call Management pages should be explicitly added to route, menu, status docs, and design-system/admin component patterns before becoming customer-visible.

Status:
Implemented

Source:
代码: `src/routes.tsx`, `src/layouts/BasicLayout.tsx`, `src/pages/call-management/*`; 文档: `PROJECT_CONTEXT.md`, `CURRENT_STATUS.md`; 历史记录: Git commits around call management list pages

--------------------------------------------------

Decision ID:
DEC-022

Module:
Routing Config

Decision:
Routing Config is visible by default and can be hidden through `VITE_ENABLE_ADMIN_MENUS=false`.

Reason:
The customer-facing demo now needs routing configuration visibility, while the feature flag keeps a quick fallback if the menu must be removed for a specific build or review.

Impact:
Routing Config additions should respect the existing feature flag and menu routing structure.

Status:
Implemented

Source:
代码: `src/config/featureFlags.ts`, `src/routes.tsx`, `src/layouts/BasicLayout.tsx`; 文档: `PROJECT_CONTEXT.md`, `CURRENT_STATUS.md`; 历史记录: `DEV_LOG.md`, Git commit `fcfd5ab`

--------------------------------------------------

Decision ID:
DEC-023

Module:
Admin CRUD Pages

Decision:
Management pages should reuse the shared admin components (`AdminPage`, `AdminToolbar`, `AdminFilterField`, `AdminTable`, `AdminModal`, `AdminFormField`) instead of hand-building page-specific CRUD shells.

Reason:
Call Management and Routing Config contain many similar maintenance screens; shared components keep table, filter, modal, pagination, status, and action behavior consistent.

Impact:
Future admin-style pages should start from `src/components/admin/*` and only add page-specific fields or business validation.

Status:
Implemented

Source:
代码: `src/components/admin/*`, `src/pages/call-management/*`, `src/pages/routing-config/*`; 文档: `DESIGN_SYSTEM.md`, `AGENTS.md`, `CURRENT_STATUS.md`

--------------------------------------------------

Decision ID:
DEC-024

Module:
Priority List

Decision:
Priority List matching is explicitly modeled as user-selected `Exact Match` or `Partial Match`; duplicate detection includes Channel, normalized Identifier, and Match Rule.

Reason:
The latest implementation and history simplified matching away from implicit email-domain behavior toward a more understandable rule that can be selected and filtered directly.

Impact:
Backend implementation must use the same exact/partial semantics and duplicate key logic to avoid front-end/back-end mismatches.

Status:
Implemented

Source:
代码: `src/types/priorityList.ts`, `src/pages/call-management/PriorityListManagementPage.tsx`, `src/mock/priorityList.ts`; 历史记录: `DEV_LOG.md`, Git commit `c85f8e6`

--------------------------------------------------

Decision ID:
DEC-025

Module:
Data and Persistence

Decision:
The current project is a local front-end demo using mock data and Zustand stores; refresh resets demo state and no production backend persistence exists.

Reason:
The demo prioritizes interaction coverage and customer walkthroughs over real AICC/CRM/routing engine integration.

Impact:
Future API integration must define backend contracts for auth, routing, customer identity, CRM, verification, chat, and media lifecycle before replacing mock stores.

Status:
Implemented as demo boundary; production integration Pending

Source:
代码: `src/store/*`, `src/mock/*`; 文档: `PROJECT_CONTEXT.md`, `CURRENT_STATUS.md`, `CURRENT_TODO.md`

--------------------------------------------------

Decision ID:
DEC-026

Module:
Branding and Sensitive Content

Decision:
Customer-visible UI, mock data, documentation, and handoff summaries must use Bank / BankApp / BANK 1 wording and avoid old customer brand terms.

Reason:
The project is a sanitized customer-facing demo and must not leak historical or real customer brand language.

Impact:
Future visible copy, mock entries, screenshot references, docs, and backup notes must preserve the sanitized vocabulary. Internal compatibility identifiers may remain only if they are not customer-visible.

Status:
Implemented as project rule

Source:
文档: `AGENTS.md`, `PROJECT_CONTEXT.md`; 历史记录: `DEV_LOG.md`

--------------------------------------------------

Decision ID:
DEC-027

Module:
CRM and Assistant Workspace

Decision:
CRM and Assistant panels render screenshot-first system previews with code-based fallback UI if image loading fails.

Reason:
The demo needs realistic system visuals while remaining resilient when local screenshot assets are unavailable or being replaced.

Impact:
Future screenshot replacement should keep fallback behavior intact. Final screenshot quality and customer approval are still open. 【需要产品经理确认】

Status:
Implemented; final asset approval Pending

Source:
代码: `src/pages/inbound/components/CrmPanel.tsx`, `src/pages/inbound/components/AssistantPanel.tsx`; 文档: `PROJECT_CONTEXT.md`, `BUSINESS_RULES.md`, `CURRENT_STATUS.md`, `CURRENT_TODO.md`

--------------------------------------------------

Decision ID:
DEC-029

Module:
Live Chat / Call Management

Decision:
Common Phrase Management owns public Live Chat quick replies only; agent-owned My Phrases remain local to the Live Chat workspace.

Reason:
The customer request targets a shared Call Management configuration for the text popup right-side public common phrases, while the existing workspace already has a separate My Phrases area for agent personal phrases.

Impact:
Future common phrase work should keep public phrase configuration in Call Management and avoid mixing it with agent personal phrase editing unless product scope explicitly changes.

Status:
Implemented

Source:
Code: `src/pages/call-management/CommonPhraseManagementPage.tsx`, `src/store/callManagementStore.ts`, `src/pages/inbound/LiveChat2Page.tsx`; Docs: `BUSINESS_RULES.md`, `CURRENT_STATUS.md`; History: `DEV_LOG.md`

--------------------------------------------------

Decision ID:
DEC-031

Module:
Call Management

Decision:
Common Link Management is a lightweight Call Management menu for maintaining frequently used website references with website name, website address, and remark fields.

Reason:
The customer request adds a simple management-console list for common links and explicitly scopes the fields to website name, website address, and remark, matching the existing admin CRUD page style.

Impact:
Future common-link work should preserve this lightweight admin-page shape unless product scope adds categories, status, permissions, or workspace insertion behavior.

Status:
Implemented

Source:
Code: `src/pages/call-management/CommonLinkManagementPage.tsx`, `src/store/callManagementStore.ts`; Docs: `BUSINESS_RULES.md`, `CURRENT_STATUS.md`; History: `DEV_LOG.md`

--------------------------------------------------

Decision ID:
DEC-032

Module:
Call Management / Transfer

Decision:
Common Number Management owns enabled IVR transfer targets shown in the call Transfer modal `Transfer IVR` tab.

Reason:
The customer request defines common numbers as a management-console configuration for voice agents to transfer customers into IVR flows such as VIP hotline service. The current demo transfer behavior closes the modal without backend dispatch, so Transfer IVR follows the same demo interaction boundary.

Impact:
Future real transfer integration should map `Active` common-number entries to backend IVR transfer targets while keeping conversation transfer separate from call-only IVR transfer.

Status:
Implemented

Source:
Code: `src/pages/call-management/CommonNumberManagementPage.tsx`, `src/store/callManagementStore.ts`, `src/layouts/components/TransferModal.tsx`; Docs: `BUSINESS_RULES.md`, `CURRENT_STATUS.md`; History: `DEV_LOG.md`

--------------------------------------------------

Decision ID:
DEC-033

Module:
Haloapp / BankApp Client Boundary

Decision:
Haloapp client pages for text, voice, video, PIN verification, desktop sharing, and satisfaction rating are BCA-owned. Netinfo demo behavior should show SDK/API handoff, routing, agent workspace handling, message exchange, PIN request/result, and call popup behavior, not ownership of the client pages.

Reason:
Customer clarification after the V1.8 flow update confirmed that text media client pages are provided by BCA, voice client must retain keypad for IVR input, video has no keypad or transfer, and video desktop sharing is initiated by the client while the agent only views it.

Impact:
Future Haloapp demo changes must use customer-provided flow screenshots for client pages, avoid inventing client UI, keep voice keypad visible, hide video transfer, and model desktop sharing as customer-initiated/view-only for the agent.

Status:
Implemented

Source:
Customer clarification on 2026-06-27; document `Haloapp及视频弹屏需求说明书V1.8.docx`; code: `src/pages/bankapp/BankAppDemoPage.tsx`, `src/pages/inbound/components/OpenEyeVideoWindow.tsx`, `src/layouts/components/AgentToolbar.tsx`

--------------------------------------------------

Decision ID:
DEC-030

Module:
Live Chat / Call Management

Decision:
Sensitive Word Management owns the shared word list used to block Live Chat agent replies before sending.

Reason:
The customer request defines sensitive words as a management-console configuration and expects the system to automatically detect agent reply text, prevent sending when matched, and prompt the agent to revise the reply.

Impact:
Future text-channel send flows should reuse the same sensitive-word check before dispatch. Category maintenance remains a fixed dictionary unless product scope explicitly adds dictionary administration.

Status:
Implemented

Source:
Code: `src/pages/call-management/SensitiveWordManagementPage.tsx`, `src/store/callManagementStore.ts`, `src/pages/inbound/LiveChat2Page.tsx`; Docs: `BUSINESS_RULES.md`, `CURRENT_STATUS.md`; History: `DEV_LOG.md`

--------------------------------------------------

Decision ID:
DEC-034

Module:
Call Management / Record Query

Decision:
Call Record Query covers only current-agent Phone voice, BankApp Voice, BankApp Video, BankApp DM, Webchat, and WhatsApp records in the current demo. Email流水查询 and Social Media查询 are separate future scopes and are not added as menus or placeholders in this delivery.

Reason:
Email has an independent 邮件流水查询 requirement with AICC-owned email satisfaction behavior, while Social Media has distinct DM / Comment / Mention / Review query and detail models. Combining them into one Call Record Query list would force unrelated fields and details into a single table and reduce demo clarity.

Impact:
Future Email or Social Media record work should be added as independent modules or explicitly designed parent/tab structures, not silently folded into the current Call Record Query table. Call Record Query should follow the confirmed media display label `DM` instead of exposing internal Text/TEXT wording. The list uses `Contact` for customer-side identifiers rather than `Counterparty`. The list includes `Queue` and `Service Time`; missing Queue values render as `-`. The detail modal does not add a CRM/customer-detail card in the current scope, keeps playback/conversation content on the left, and uses a CWU Registration panel with Ticket No., multi-select Business Type, and Summary description on the right. Voice details use a compact playback bar without waveform display. Video details use an OpenEye-style vertical replay with two video panes and a playback bar, without live-call buttons, labels, or icons.

Status:
Implemented

Source:
Customer clarification on 2026-07-07; Code: `src/pages/call-management/CallRecordQueryPage.tsx`, `src/mock/callRecords.ts`, `src/store/callManagementStore.ts`; Docs: `BUSINESS_RULES.md`, `CURRENT_STATUS.md`, `PROJECT_CONTEXT.md`; History: `DEV_LOG.md`

--------------------------------------------------

Decision ID:
DEC-035

Module:
Call Management / Service End Lifecycle

Decision:
Abnormal agent-side service end reasons are maintained in `Call Management > Session End Reason Management` for Voice, Video, and DM. `Normal` remains a system default reason and is not maintained in the abnormal reason list.

Reason:
The customer requirement separates normal service completion from exceptional agent-selected ending causes, and Social Media / Non-DM is out of current scope. The source attachment explicitly names Voice Calls and Digital Channels; Video is included in this demo as a synchronous-call extension of Voice, while BankApp text, Webchat, and WhatsApp use the DM abnormal reason set.

Impact:
Voice/video Hang Up and Live Chat End Service should preserve the default normal action while exposing abnormal reasons through a caret menu. Abnormal reason selection ends immediately without a second confirmation. Service records split `Ended By` from `End Reason`: agent/customer normal ends use `Normal`, agent abnormal ends use the selected configured reason, and system ends use specific system reasons such as `Customer Timeout`, `Connection Lost`, `System Error`, or `Channel Gateway Error`. Do not add Social Media / Non-DM values unless that scope is explicitly added.

Status:
Implemented

Source:
Customer-provided requirement screenshot and plan on 2026-07-07; Code: `src/pages/call-management/SessionEndReasonManagementPage.tsx`, `src/layouts/components/AgentToolbar.tsx`, `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`, `src/store/appStore.ts`, `src/store/callManagementStore.ts`; Docs: `BUSINESS_RULES.md`, `CURRENT_STATUS.md`, `PROJECT_CONTEXT.md`

--------------------------------------------------

Decision ID:
DEC-028

Module:
Localization

Decision:
The current demo keeps English UI framework labels with some Indonesian business terms and mock data; final localization policy is not yet locked.

Reason:
Current code and docs show mixed English operational UI and Indonesian banking/service terms. TODO documentation explicitly lists localization as an unresolved follow-up.

Impact:
Do not perform broad language rewrites without product confirmation on target language, terminology, and demo script. 【需要产品经理确认】

Status:
Pending

Source:
代码: `src/mock/*`, `src/pages/*`; 文档: `PROJECT_CONTEXT.md`, `BUSINESS_RULES.md`, `CURRENT_TODO.md`, `AGENTS.md`
