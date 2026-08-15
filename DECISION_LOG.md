# Decision Log

Last updated: 2026-08-13 16:00 +08:00

This document records important product and system design decisions that can be confirmed from the current codebase, project documents, `DEV_LOG.md`, and readable Git history. It intentionally omits bug fixes, visual micro-adjustments, temporary test data, copy-only tweaks, and implementation details that do not affect product direction.

--------------------------------------------------

Decision ID:
DEC-044

Module:
Customer Outbound / Busy Reason

Decision:
Outbound calling requires an active Busy Reason configured for outbound. The DEMO defaults `Callback Finrisk` and `Callback Misinform` to this eligibility. `Miss Information` and `Financial Risk` remain per-call business reasons for customer numbers. Ordinary Agents request TL/SPV approval for customer numbers; TL-and-above accounts call those numbers directly. Call Agent always exposes only TL/SPV targets and requires the same outbound AUX, but does not use external-number approval.

Reason:
The customer requires callback work to be explicitly separated from normal AUX use, while retaining existing per-call business attribution and approval demonstration.

Impact:
Busy Reason maintains `Support Outbound` as a list-level setting supporting multiple active reasons. Customer outbound approval remains valid while the agent moves between eligible AUX reasons, and becomes invalid only after the agent leaves the eligible set or the eligible configuration is removed. Future backend integration must enforce the same status, role, approval, and audit constraints server-side.

Status:
Implemented as front-end Demo behavior

Source:
Customer annotation and confirmed plan on 2026-08-13; Code: `src/pages/call-management/BusyReasonManagementPage.tsx`, `src/layouts/components/OutboundCallModal.tsx`, `src/pages/inbound/components/CustomerInformationCard.tsx`, `src/utils/outboundApproval.ts`; Docs: `BUSINESS_RULES.md`, `CURRENT_STATUS.md`, `DEV_LOG.md`

--------------------------------------------------

Decision ID:
DEC-043

Module:
Customer Verification V2 / HaloApp Voice

Decision:
HaloApp login status is a rule applicability dimension for every HaloApp KBV rule: `Same for Both`, `Logged In`, or `Not Logged In`. The agent receives the status only at the first Voice handoff and cannot change it. Perbankan uses a HaloApp-only 3-answer Logged In rule plus a shared Phone/HaloApp-not-logged-in 5-answer rule; Kartu Kredit uses the same structure with 3 and 4 answers. Other skills retain one `Same for Both` configuration.

Reason:
The customer needs lower-friction KBV for authenticated HaloApp callers in two confirmed skills, without turning every other skill into duplicate logged-in/guest configurations or trusting unsupported in-call login changes.

Impact:
Enabled configurations are unique across overlapping channel, skill, customer-segment, and login-status conditions. The management page exposes the login-status list/filter/form field and supports copying a full rule draft. A future trusted status callback must define whether a current KBV is reset or re-run before it changes this frozen initial condition.

Status:
Implemented as front-end Demo behavior

Source:
Customer requirement confirmed on 2026-07-30; Code: `src/types/verificationRuleV2.ts`, `src/utils/verificationRuleV2.ts`, `src/mock/verificationRuleV2.ts`, `src/pages/call-management/VerificationRuleV2Page.tsx`, `src/pages/inbound/components/CustomerInformationCard.tsx`; Docs: `BUSINESS_RULES.md`, `CURRENT_STATUS.md`, `CURRENT_TODO.md`, `DEV_LOG.md`

--------------------------------------------------

Decision ID:
DEC-042

Module:
Demo Authentication / Transfer Permission

Decision:
The Demo exposes two safe accounts in the same workbench: `888888 / 888888` is the ordinary Agent account, and `666666 / 666666` is the female TL account Maya Lestari. The TL account receives `transfer:external-number`, which exposes direct `Transfer Number` behavior, and calls external numbers directly after selecting the required reason. Ordinary Agents see only SPV and TL records in Call Agent; TL-and-above roles see the full Call Agent list.

Reason:
The customer needs to demonstrate that external-number transfer is a TL-and-above operation while preserving the ordinary-agent transfer experience and without adding a separate TL application.

Impact:
The authenticated session carries the explicit permission and role scope to the toolbar and its dialogs. The TL account changes only the external outbound, `Transfer Number`, and Call Agent list visibility capabilities; it does not gain a TL dashboard, supervisor management features, backend authorization, or cross-device workflow. Every external outbound still requires one selected reason, `Miss Information` or `Financial Risk`, but only ordinary Agents create TL approval requests.

Status:
Implemented as front-end Demo behavior

Source:
Customer requirement and approved plan on 2026-07-23; Code: `src/mock/auth.ts`, `src/types/auth.ts`, `src/layouts/BasicLayout.tsx`, `src/layouts/components/AgentToolbar.tsx`, `src/layouts/components/TransferModal.tsx`, `src/layouts/components/OutboundCallModal.tsx`; Docs: `BUSINESS_RULES.md`, `CURRENT_STATUS.md`, `CURRENT_TODO.md`, `PROJECT_CONTEXT.md`, `DEV_LOG.md`

--------------------------------------------------

Decision ID:
DEC-041

Module:
Customer Information / Contact Information

Decision:
Customer-visible contact information is read-only and sourced from CRM-backed customer profile data. Customer Information always provides an `All Contact Details` viewer for structured, multi-value CRM contacts across communication, social media, and app-store channels. The agent contact-edit entry is hidden in every customer deployment; the previous Contact Management mock is available only when local visibility and the explicit `VITE_ENABLE_CONTACT_EDIT=true` maintainer flag are both enabled.

Reason:
The customer requires agents to view all CRM-provided contact details without making changes. The existing modal creates local mock changes and has no CRM write-back, audit, or permission contract, so exposing it as the customer experience would misrepresent the intended workflow.

Impact:
The formal viewer has no input, add, delete, save, dial, messaging, or external-link actions. Future customer-facing contact editing must be designed as a CRM-authorized workflow with confirmed field ownership, validation, auditing, write-back, and failure handling. The local flag preserves the legacy DEMO for maintenance only and must not be treated as a customer deployment setting.

Status:
Implemented

Source:
Customer requirement and approved plan on 2026-07-23; Code: `src/config/featureFlags.ts`, `src/config/moduleVisibility.ts`, `src/pages/inbound/components/CustomerInformationCard.tsx`; Docs: `BUSINESS_RULES.md`, `DESIGN_SYSTEM.md`, `CURRENT_STATUS.md`, `CURRENT_TODO.md`, `PROJECT_CONTEXT.md`, `DEV_LOG.md`

--------------------------------------------------

Decision ID:
DEC-040

Module:
Customer Verification V2 / CRM

Decision:
Segment, Skill, and Scenario are captured for the active interaction when KBV first opens. They are not recomputed after CRM CIS refresh, and the agent's condition changes persist when KBV is reopened in that same interaction.

Reason:
CRM profile loading can legitimately change the displayed customer segment after KBV. Recalculating KBV conditions from that new profile changes the verification context partway through one customer service interaction and makes repeat verification inconsistent.

Impact:
Customer-information refresh updates profile, journey, and ticket data only. A new customer interaction establishes a new KBV condition context. The current front-end demo does not persist this context across browser refreshes.

Status:
Implemented

Source:
Customer feedback and approved follow-up on 2026-07-23; Code: `src/pages/inbound/InteractionWorkspace.tsx`, `src/pages/inbound/components/CustomerInformationCard.tsx`, `src/pages/inbound/components/CustomerVerificationV2Modal.tsx`; Docs: `BUSINESS_RULES.md`, `DESIGN_SYSTEM.md`, `DEV_LOG.md`

--------------------------------------------------

Decision ID:
DEC-039

Module:
Customer Information / CRM / KBV

Decision:
Customer identity refresh no longer accepts agent-entered Customer IDs. Only a completed voice KBV `Apply Verified` requests CRM CIS through `postMessage`; a valid matching CIS response refreshes the left customer profile, journey, and ticket information while preserving `Verified`.

Reason:
Customer information must be sourced from the CRM after KBV rather than manually entered by an agent, which reduces identity-selection risk in the customer-service workflow.

Impact:
The current screenshot-based CRM uses a same-origin front-end DEMO bridge with versioned request/response messages and correlation IDs. AICC ignores untrusted, malformed, mismatched, empty, or unknown CIS responses and retains its existing profile on failure. This does not establish a production CRM iframe, origin allowlist, authentication, audit, or customer-data API contract; those details must be confirmed before real integration.

Status:
Implemented as DEMO bridge; production integration Pending

Source:
Customer requirement and approved implementation plan on 2026-07-23; Code: `src/pages/inbound/InteractionWorkspace.tsx`, `src/pages/inbound/components/CrmPanel.tsx`, `src/utils/crmCustomerIdentity.ts`; Docs: `BUSINESS_RULES.md`, `PROJECT_CONTEXT.md`, `CURRENT_STATUS.md`, `CURRENT_TODO.md`, `DEV_LOG.md`

--------------------------------------------------

Decision ID:
DEC-038

Module:
External Number Approval

Decision:
Toolbar outbound number and Customer Information customer-phone outbound require a TL approval simulation. Both entries require `Miss Information` or `Financial Risk` as part of the request. `Transfer Number` is not visible to ordinary agents; it is a TL-and-above operation and transfers directly without a separate TL approval.

Reason:
The previous Customer Information-only three-second automatic approval did not make the TL role or decision visible in customer demonstrations. A separate TL popup makes the authorization step understandable while preserving the existing agent workbench and no-backend demo boundary.

Impact:
The same-browser demo stores and synchronizes ordinary-Agent outbound and customer-phone approval records with localStorage and BroadcastChannel. Both approval scopes include the selected reason, so changing the number or reason invalidates the previous authorization. Closing the originating modal does not cancel the request, allowing the agent to handle an incoming interaction and return to the same exact-number approval; Log Out clears pending and unused approvals. Any Customer Information card with a nonempty phone number can initiate outbound without waiting for KBV or CRM identity; the card opens a compact Reason modal and uses the same `Requesting...` pending copy as toolbar outbound. A completed Call from either entry creates and focuses a new `Outbound Call` voice workspace carrying the dialed number, then enters `Talking`. TL can approve or reject with an optional generic note; there is no countdown or automatic approval timeout. The TL account's direct external outbound and Transfer Number permissions are documented separately in DEC-042. The TL popup reuses one window, overlays the supplied complete dashboard screenshot with a light mask, and processes pending requests FIFO through a single centered light-blue-header/white-body Modal; agent results use a compact non-masked `BaseModal` in the bottom-right corner. This is not a production approval, routing, permission, audit, or cross-device contract; a real integration must replace the local transport and introduce TL identity, authorization, persistence, and audit requirements.

Status:
Implemented

Source:
Customer requirement and approved implementation plans on 2026-07-22 and 2026-07-23; Code: `src/utils/outboundApproval.ts`, `src/hooks/useExternalOperationApproval.ts`, `src/pages/TlOutboundApprovalPage.tsx`, `src/layouts/components/OutboundCallModal.tsx`, `src/layouts/components/TransferModal.tsx`, `src/pages/inbound/components/CustomerInformationCard.tsx`; Docs: `BUSINESS_RULES.md`, `CURRENT_STATUS.md`, `CURRENT_TODO.md`, `PROJECT_CONTEXT.md`, `DEV_LOG.md`

--------------------------------------------------

Decision ID:
DEC-037

Module:
Email Channel / Workspace

Decision:
The Email-channel delivery is a code-built, closable agent workspace opened from `Channel Simulation > Email`. It covers Inbox, Sent, Drafts, Trash, Reply, Forward, Ignore, thread records, and CWU, directly reuses the shared five-card customer column, and uses Live Chat's `CrmPanel` with the same CRM screenshot and `CRM / Email` tab styling. It does not embed the legacy full-system Email design screenshots and does not add Email Record Inquiry or Email Template Deploy.

Reason:
The Email reference images contain a complete legacy application shell and fixed dimensions, so the mailbox interaction remains code-built. Reusing the existing Live Chat customer and CRM workspace components keeps shared behavior and visual contracts identical across channels, including the current CRM screenshot already used by Live Chat.

Impact:
Email handling uses anonymized front-end mock data and resets when the tab is closed/reopened or the app refreshes. 2026-07-24 update: Ignore moves the email to Trash, while a completed Forward removes the source and forwarding record from all four folders, including when resumed from a saved draft. Reply/Send, Draft, Ignore, Recover, thread, SLA, and CWU behavior remains front-end only. The same date's customer-release approval exposes the Email menu in both customer and local visibility profiles. Email verification stays hidden until a rule is confirmed. Email Record Inquiry remains separate from Interaction Log, and Email Template Deploy remains a future independent scope.

Status:
Implemented

Source:
Customer-provided Email design images and implementation requests on 2026-07-18 and 2026-07-24; Code: `src/pages/email/EmailPage.tsx`, `src/mock/email.ts`, `src/types/email.ts`, `src/layouts/BasicLayout.tsx`, `src/pages/AgentWorkspace.tsx`, `src/pages/inbound/components/CrmPanel.tsx`, `src/pages/inbound/components/LeftColumn.tsx`, `src/store/appStore.ts`; Docs: `PROJECT_CONTEXT.md`, `CURRENT_STATUS.md`, `CURRENT_TODO.md`, `DESIGN_SYSTEM.md`, `BUSINESS_RULES.md`; History: `DEV_LOG.md`

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
DEC-036

Module:
Workspace Tabs / Management Navigation

Decision:
Visible management pages open or reuse closable `AgentWorkspace` page tabs instead of replacing the whole workspace route. Direct visits to registered management URLs are compatibility entries that open the matching tab and return to `/`. Local-only Employee Management and Design System keep the existing `VITE_APP_VISIBILITY_PROFILE=local` visibility rule.

Reason:
Agents need to keep active popup, call, PSTN, Live Chat, and channel simulation tabs available while reviewing or changing configuration. Full-page management routes made it impossible to switch back to the active service workspace without losing the workbench context.

Impact:
Future management-style pages should be registered in the workspace page tab registry with a stable `page:*` tab key, menu key, route path, label, icon, visibility key, and component. New admin pages should not bypass the workspace tab model unless a product-level exception is confirmed.

Status:
Implemented

Source:
代码: `src/config/workspacePageTabs.tsx`, `src/components/WorkspacePageRouteOpener.tsx`, `src/pages/AgentWorkspace.tsx`, `src/layouts/BasicLayout.tsx`, `src/routes.tsx`, `src/store/appStore.ts`; 文档: `PROJECT_CONTEXT.md`, `CURRENT_STATUS.md`, `DESIGN_SYSTEM.md`; 历史记录: `DEV_LOG.md`

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
Superseded by DEC-036

Supersession:
After agent-controlled service-mode selection was removed, this gating is no longer used by the demo. The current account has fixed full-channel capability; handoffs are gated only by `Ready` state and active-service guards until a confirmed employee-skill media model is available.

Source:
代码: `src/layouts/BasicLayout.tsx`, `src/store/appStore.ts`, `src/pages/bankapp/BankAppDemoPage.tsx`; 文档: `BUSINESS_RULES.md`, `CURRENT_STATUS.md`; 历史记录: `DEV_LOG.md`

--------------------------------------------------

Decision ID:
DEC-036

Module:
Agent Sign-in and Global Control

Decision:
The profile menu exposes one Sign In action. The current demo account keeps its existing full-channel capability internally, while `Status after Sign-in` from Global Control Configuration determines the next signed-in agent status and defaults to Not Ready.

Reason:
The customer requested that service eligibility is no longer chosen by the agent at sign-in. The current front-end demo has no channel-media mapping on employee-bound skills, so this delivery removes the selector without introducing an unconfirmed skill model.

Impact:
Not Ready sign-in creates no default Live Chat customer service. The first switch to Ready opens and seeds the default Live Chat demo sessions. Global Control changes are shared in memory and reset on browser refresh; future skill-driven routing must replace the hidden fixed capability with confirmed binding data.

Status:
Implemented

Source:
Code: `src/layouts/BasicLayout.tsx`, `src/layouts/components/AgentProfileArea.tsx`, `src/store/callManagementStore.ts`, `src/pages/call-management/GlobalControlConfigurationPage.tsx`; Docs: `BUSINESS_RULES.md`, `CURRENT_STATUS.md`

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
The header toolbar is the single persistent control surface for Answer, Hold, Mute, Transfer, Hang Up, Ready / Not Ready, and Outbound Call. A default-Not Ready sign-in can first enter Ready from the toolbar; its Ready button is then locked until a Voice or Video Incoming popup occurs, after which the toolbar resumes normal two-way status toggling for the current signed-in session.

Reason:
Customer service controls need to remain visible regardless of active workspace tab; the toolbar provides persistent status, timer, customer access identifier, and skill context. The customer requires a first-login guard without removing the established toolbar control.

Impact:
New call actions should be added through the toolbar model instead of being hidden inside individual workspace cards. Voice and Video Incoming popup paths must unlock the first-login toolbar guard; text-channel activity must not.

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
DEC-036

Module:
Voice Call Transfer

Decision:
An agent-to-agent call transfer ends the current agent's call segment and follows the ordinary ACW / CWU lifecycle. The receiving agent continues in a new call record with a separate CWU and ticket; the two agents do not concurrently edit one interaction popup or work order.

Reason:
Customer clarification confirmed that a transfer creates a new call record, and each call record owns one ticket. This avoids conflicting edits when an agent resolves one question and transfers a later question to a TL.

Impact:
The current transfer demo uses a ready-only agent list with consultation and conference controls. Agent, skill, and IVR transfers release the current agent through the existing Hang Up path. `Transfer Number` is hidden from ordinary agents and, when enabled for a TL-and-above capability, completes immediately without approval. Numbers ending in `000` provide the deterministic retryable failure path for the Demo. Conference remains in the current call and temporarily disables another transfer with the native title `Transfer unavailable during conference`. The receiving-seat story is represented only by the local-only `Channel Simulation > Transferred Call` preview, which opens a new PSTN interaction and displays a source-transfer icon inside the customer channel tag. The Interaction Log end-reason label remains `Normal` for now; a future `Transferred` end reason requires separate confirmation.

Status:
Implemented as local demo behavior

Source:
Customer clarification on 2026-07-22; Code: `src/layouts/components/TransferModal.tsx`, `src/layouts/components/AgentToolbar.tsx`; Docs: `BUSINESS_RULES.md`, `CURRENT_STATUS.md`

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
Customer-visible Call Management scope currently includes Verification Rules, Global Control Configuration, Blacklist, Priority List, Common Phrase, Common Link, Common Number, Sensitive Word, Busy Reason, Abnormal End Reasons, and Interaction Log; hidden/legacy Call Management routes redirect to Verification Rules.

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
Common Phrase owns public Live Chat quick replies only; agent-owned My Phrases remain local to the Live Chat workspace.

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
Common Link is a lightweight Call Management menu for maintaining frequently used website references with website name, website address, and remark fields.

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
Common Number owns enabled IVR transfer targets shown in the call Transfer modal `Transfer IVR` tab.

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
Sensitive Word owns the shared word list used to block Live Chat agent replies before sending.

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
2026-07-10 update: the visible Call Management menu and page title are now `Interaction Log`; the route remains `/call-management/call-record-query`.
Call Record Query covers only current-agent Phone voice, BankApp Voice, BankApp Video, BankApp DM, Webchat, and WhatsApp records in the current demo. Email流水查询 and Social Media查询 are separate future scopes and are not added as menus or placeholders in this delivery.

Reason:
Email has an independent 邮件流水查询 requirement with AICC-owned email satisfaction behavior, while Social Media has distinct DM / Comment / Mention / Review query and detail models. Combining them into one Call Record Query list would force unrelated fields and details into a single table and reduce demo clarity.

Impact:
2026-07-10 update: Interaction Log defaults Date Range to the current day, adds plain-text `QM Score`, exposes only `View` in the Actions column, keeps CWU read-only, and shows Voice Recording Playback plus Screen Recording Playback for voice records.
2026-07-10 11:21 update: Interaction Log seeds 30 mock records. Voice details use a three-column layout with widescreen agent screen recording on the left, voice playback/transcript in the middle, and narrow CWU on the right. Video details label the replay section `Video Recording Playback`.
2026-07-10 11:49 update: Voice `Screen Recording Playback` uses a PSTN active-call agent desktop screenshot instead of the earlier Live Chat agent screenshot.
2026-07-10 14:53 update: the score field contract is renamed to `qmScore` / `QM Score`. Detail modals now share the same information architecture: Voice and Video use left media playback, middle transcript, and right CWU; DM uses conversation plus right CWU without a media column.
2026-07-21 update: numeric QM Scores open a static third-party QM detail preview in the demo. The preview is a confirmed original reference image and intentionally has no simulated third-party controls; it uses the source image ratio without a BANK 1 modal title or duplicate close icon. Only the source image's top-right X closes the preview; future unified sign-in integration replaces it with the matching third-party detail page. Empty scores remain non-interactive.
2026-07-23 update: Interaction Log adds `Call Type` after Media and as a query filter. `Customer`, `Transfer`, and `Conference` distinguish direct interactions from transferred and three-party records so leadership can inspect agent transfer frequency.
2026-07-28 update: Interaction Log removes `End Reason` from the query and list, adds `Rating Score` (`1`-`5`) as a query/list field, and stacks Satisfaction below CWU in details. PSTN renders `-` because its periodic satisfaction outreach is not call-bound; BankApp, Webchat, and WhatsApp store score with optional feedback.
Future Email or Social Media record work should be added as independent modules or explicitly designed parent/tab structures, not silently folded into the current Call Record Query table. Call Record Query should follow the confirmed media display label `DM` instead of exposing internal Text/TEXT wording. The list uses `Contact` for customer-side identifiers rather than `Counterparty`. The list includes `Queue` and `Service Time`; missing Queue values render as `-`. The detail modal does not add a CRM/customer-detail card in the current scope, keeps media playback or conversation content separated from read-only CWU, and uses a CWU panel with Ticket No., multi-select Business Type, and Summary description on the right. Voice details use a compact playback bar without waveform display. Video details use an OpenEye-style vertical replay with two video panes and a playback bar, without live-call buttons, labels, or icons.

Status:
Implemented

Source:
Customer clarification on 2026-07-07 and 2026-07-10; Code: `src/pages/call-management/CallRecordQueryPage.tsx`, `src/mock/callRecords.ts`, `src/store/callManagementStore.ts`; Docs: `BUSINESS_RULES.md`, `CURRENT_STATUS.md`, `PROJECT_CONTEXT.md`; History: `DEV_LOG.md`

--------------------------------------------------

Decision ID:
DEC-035

Module:
Call Management / Service End Lifecycle

Decision:
Abnormal agent-side service end reasons are maintained in `Call Management > Abnormal End Reasons` for Voice, Video, and DM. `Normal` remains a system default reason and is not maintained in the abnormal reason list; the default configuration contains two active DM reasons only.

Reason:
The customer requirement separates normal service completion from exceptional agent-selected ending causes, and Social Media / Non-DM is out of current scope. Voice, Video, and DM remain future-configurable media, while the current default data is limited to the two confirmed DM reasons.

Impact:
Voice/video Hang Up and Live Chat End Service should preserve the default normal action. The abnormal-reason caret renders only when an active configured reason matches the current media; otherwise the main action renders with its normal full shape. Abnormal reason selection ends immediately without a second confirmation. Service records split `Ended By` from `End Reason`: agent/customer normal ends use `Normal`, agent abnormal ends use the selected configured reason, and system ends use specific system reasons such as `Customer Timeout`, `Connection Lost`, `System Error`, or `Channel Gateway Error`. Do not add Social Media / Non-DM values unless that scope is explicitly added.

Status:
Implemented

Source:
Customer-provided requirement screenshot and plan on 2026-07-07; Code: `src/pages/call-management/SessionEndReasonManagementPage.tsx`, `src/layouts/components/AgentToolbar.tsx`, `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`, `src/store/appStore.ts`, `src/store/callManagementStore.ts`; Docs: `BUSINESS_RULES.md`, `CURRENT_STATUS.md`, `PROJECT_CONTEXT.md`

--------------------------------------------------

Decision ID:
DEC-036

Module:
Social Media Workspace

Decision:
Social Media is delivered as a dedicated, closable agent workspace tab opened from `Channel Simulation` immediately after Email. The integration preserves the existing BANK 1 shell and imports only the Social Media page, resources, local state, and menu/tab wiring from the collaborator delivery.

Reason:
The collaborator implementation was maintained in an independent repository and also contained unrelated global visual changes. Selective integration keeps the current customer-approved shell stable while adding the social queue demo.

Impact:
The current Social Media workspace simulates queue filtering, post/review/mention handling, CRM preview, CWU prototype, and review reply locally. It does not create Live Chat sessions or extend service-ending and Interaction Log rules. Future changes must be delivered through a feature branch or PR against the canonical repository instead of merging independent `main` histories.

Status:
Implemented as front-end demo; real integration Pending

Source:
Collaborator source commit `Rh3in/bca-aicc-demo-v2@5ca52fd`; Code: `src/pages/social-media/SocialMediaPage.tsx`, `src/layouts/BasicLayout.tsx`, `src/pages/AgentWorkspace.tsx`, `src/store/appStore.ts`; Docs: `PROJECT_CONTEXT.md`, `CURRENT_STATUS.md`, `BUSINESS_RULES.md`

--------------------------------------------------

Decision ID:
DEC-037

Module:
Live Chat Service List

Decision:
Current is a unified list containing active Live Chat service sessions up to Global Control `Max Digital Media Services` (default 3), plus recently ended Live Chat sessions up to `Max Live Chat Ended Session Retention` (default 10). End Service retains the completed session in Current; Close moves it to History. When the ended-session retention limit is exceeded, the retained session with the earliest end time moves to History.

Reason:
Customer clarification requires agents to continue CRM editing for recently completed conversations without treating those conversations as active service. A bounded retained list prevents Current from growing without limit while preserving the latest editing context.

Impact:
Active-service counters, SLA, unread badges, AUX guards, Sign Out guards, and handoff capacity use only active session slots. Saving or resetting Global Control immediately applies the ended-session retention limit by moving the earliest-ended excess sessions to History; lowering the active-service limit does not force-end already active sessions. History retains its current CRM behavior. When active capacity is full, the front-end demo leaves new customer handoffs in the customer-side queue rather than creating an additional service session.

Status:
Implemented

Source:
Customer clarification on 2026-07-31; Code: `src/store/appStore.ts`, `src/pages/inbound/LiveChat2Page.tsx`, `src/pages/bankapp/BankAppDemoPage.tsx`; Docs: `BUSINESS_RULES.md`, `CURRENT_STATUS.md`, `CURRENT_TODO.md`

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
