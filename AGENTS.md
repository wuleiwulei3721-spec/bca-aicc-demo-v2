# BANK 1 AICC Demo V2 - Codex Operating Rules

Last updated: 2026-07-14 09:48 +08:00
Scope: entire repository at `D:\03projects\bca-aicc-demo-v2`

This file is the required entry point for future Codex sessions and maintainers. Its job is to restore project context quickly, protect confirmed product decisions, and keep the project knowledge base current without relying on chat history, sidebar memory, or a specific OpenAI account.

## 1. Session Startup Rules

Every new Codex session must read `AGENTS.md` first.

Before modifying code, UI, configuration, mock data, or documentation, use this layered reading strategy.

Level 1 - required for every task:

1. `PROJECT_CONTEXT.md`
2. `CURRENT_STATUS.md`
3. `CURRENT_TODO.md`

Level 2 - read only when relevant:

- UI, UX, layout, component, page design, or visual consistency task: read `DESIGN_SYSTEM.md`.
- Business flow, state machine, customer journey, verification, call handling, routing, or admin configuration task: read `BUSINESS_RULES.md` and `DECISION_LOG.md`.
- Debugging, regression investigation, historical recovery, rollback, or "why was this built this way" task: read the top rules and archive index in `DEV_LOG.md`, then search `DEV_LOG.md` and `docs/archive/dev-log/` by keyword.

Do not read all of `DEV_LOG.md` by default. It is an active log plus archive index, not a startup manual.

After the required reading, run:

```bash
git status --short --branch
```

Only then inspect task-specific source files. Do not start implementation before this startup pass is complete.

## 2. Knowledge Base Map

Use the project documents for their intended roles. Do not duplicate large sections across files.

- `PROJECT_CONTEXT.md`: long-term project map. Keep project goal, background, routes, main modules, technology stack, deployment notes, data boundaries, and broad risks here.
- `CURRENT_STATUS.md`: what is currently completed. Keep it module-based and outcome-based; do not write process history here.
- `CURRENT_TODO.md`: what is still open. Keep customer confirmations, unfinished work, demo acceptance risks, future enhancements, and blocked items here.
- `DESIGN_SYSTEM.md`: stable UI rules. Keep layout, Header, Toolbar, Card, Modal, Tabs, button, icon, typography, spacing, color, and admin page contracts here.
- `BUSINESS_RULES.md`: confirmed business behavior. Keep agent status, call status, transfer, outbound, internal chat, customer information, verification, journey, ticket, Live Chat, BankApp, WhatsApp, Call Management, and Routing Config rules here.
- `DECISION_LOG.md`: long-term important decisions and why they were chosen. Do not record ordinary bug fixes, small visual tweaks, icon changes, color changes, copy edits, or temporary test data here.
- `DEV_LOG.md`: current active development log and archive index. Use it for recent important changes, rollback clues, deployments, and links to older archived logs.
- `docs/archive/dev-log/`: historical development log archives. Search this folder when investigating older decisions, regressions, or rollback context.
- `.codex-backup/`: handoff and recovery snapshots. Use for account switching, major delivery, major context recovery, or explicit backup requests, not for every small change.

## 3. Automatic Documentation Maintenance

Codex is responsible for deciding when the knowledge base needs updates. Do not push this judgment back to the product manager for routine factual updates.

After any real project modification, check whether these documents need updates:

- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `DESIGN_SYSTEM.md`
- `BUSINESS_RULES.md`
- `DECISION_LOG.md`
- `DEV_LOG.md`

Use this policy:

- Update factual documents automatically when the facts changed and the source of truth is clear.
- Ask the product manager before recording high-impact or uncertain product/business decisions.
- If a fact must be recorded but the conclusion is not confirmed, mark it with `【需要产品经理确认】`.
- Do not invent product decisions, business rules, customer policies, backend behavior, or future scope.

Update triggers:

- `PROJECT_CONTEXT.md`: update when project goals, module structure, route structure, technology stack, deployment model, data/persistence boundary, or broad known risks change.
- `CURRENT_STATUS.md`: update when a page, module, main workflow, or customer-demo capability is completed.
- `CURRENT_TODO.md`: update when a customer request is added/cancelled, a TODO is created/completed, a demo acceptance risk is found, or a product confirmation item changes.
- `DESIGN_SYSTEM.md`: update when a stable visual rule, component contract, admin page contract, or reusable UI pattern changes.
- `BUSINESS_RULES.md`: update when a confirmed business process, state transition, validation rule, or channel behavior changes.
- `DECISION_LOG.md`: update only for important long-term product, architecture, business-rule, multi-channel, branding, or workflow decisions.
- `DEV_LOG.md`: append for important features, versions, deployments, architecture changes, business-rule changes, data/model changes, critical fixes, rollback notes, or knowledge-base maintenance.

Do not add `DECISION_LOG.md` entries for:

- ordinary bug fixes,
- font tweaks,
- icon changes,
- color changes,
- minor spacing changes,
- copy-only edits,
- temporary test data,
- low-risk local cleanup.

## 4. When To Ask The Product Manager

Ask before implementing or documenting if any of these are true:

- the business meaning is unclear,
- two project documents disagree,
- a change would create a long-term product or architecture constraint,
- a customer-visible demo promise may change,
- a rule affects agent status, call handling, verification, routing, or channel behavior and cannot be confirmed from current docs/code,
- sensitive customer wording or branding is uncertain.

Do not ask for routine factual maintenance, such as:

- marking a completed task done in `CURRENT_TODO.md`,
- adding a completed feature to `CURRENT_STATUS.md`,
- logging an implemented change in `DEV_LOG.md`,
- updating `PROJECT_CONTEXT.md` after a route/module/deployment change that is visible in code.

## 5. Project Development Principles

- Treat this as an enterprise banking AICC demo, not a generic web app.
- Keep UI dense, restrained, operational, and demo-ready.
- Do not create marketing landing pages for business workspaces.
- Do not casually refactor global styles, tokens, route structure, stores, or shared components.
- Do not change confirmed business logic unless the user explicitly requests it or the current task requires it.
- Prefer existing patterns over new abstractions.
- Prefer existing components over handwritten local UI.
- Keep changes scoped to the user request.
- Do not revert user changes unless explicitly asked.
- Do not save secrets, credentials, real customer data, or sensitive customer materials.

## 6. Design System Rules

Before changing UI, read `DESIGN_SYSTEM.md`.

Use these components first:

- `BaseButton`
- `BaseCard`
- `BaseModal`
- `BaseTable`
- `BaseTabs`
- `StatusBadge`
- `ToolbarButton`
- `SearchInput`
- `TimelineFlow`
- `CustomerInformationPanel`

For management pages, use:

- `AdminPage`
- `AdminToolbar`
- `AdminFilterField`
- `AdminTable`
- `AdminModal`
- `AdminFormField`
- `AdminModalFooter`

Do not handwrite duplicate query bars, table styles, pagination rules, modal footers, Actions columns, or input-height systems inside individual admin pages.

## 7. Admin Page Rules

Call Management and Routing Config pages must follow the current admin contract:

- Query controls are 32px high.
- Search uses primary.
- Reset uses secondary.
- Search / Reset stay in the query action group.
- Add / Batch Add stay in the right primary-action group and use primary.
- Delete uses danger.
- Keyword width: about 240-260px.
- Normal input/select width: about 200-220px.
- Status width: about 150-160px.
- Main list default pagination: 10 rows.
- Table header bold, row data normal weight.
- First data field is not automatically bold.
- Status columns use `StatusBadge` text labels.
- Switches are used inside add/edit modals, not list status columns.
- Actions column should be fixed right for horizontally scrollable tables.
- Long lists scroll at page level unless inside a modal.

## 8. Business Rule Protection

Before changing business behavior, read `BUSINESS_RULES.md` and `DECISION_LOG.md`.

High-impact areas:

- Agent state machine.
- Sign In / Sign Out / Log Out guards.
- Ready / Not Ready / AUX / Pre-AUX.
- Call status machine.
- Answer / Hold / Mute / Transfer / Outbound / Hang Up.
- BankApp and WhatsApp handoff readiness.
- Live Chat session lifecycle.
- Customer Verification V2 rule model.
- Priority List duplicate and match-rule behavior.
- Blacklist and Busy Reason management.
- Routing Config data model.

If business complexity increases or exceptions keep accumulating, stop and model the concept properly. Do not keep patching one-off UI conditions.

## 9. Inbound and Workspace Rules

Inbound-related changes must consider the full chain:

- `BasicLayout`
- `AgentToolbar`
- `AgentWorkspace`
- `useAppStore`
- `InteractionWorkspace`
- `InboundPage`
- `VideoCallPage`
- `LiveChat2Page`
- inbound child components
- mock data and types

Do not update one layer without checking its effect on the others.

## 10. Routing and New Page Rules

When adding a page, confirm:

- route path,
- side menu entry,
- selected menu behavior,
- auth guard behavior,
- layout wrapper,
- state store impact,
- style scope,
- design system reuse,
- mock/type updates if needed.

Future Dashboard, Supervisor, Admin, Online Chat, or Video Call extensions must reuse the current shell and design system.

## 11. Type and Mock Data Rules

- If adding or changing mock fields, update TypeScript types.
- If changing a type contract, update all relevant mock and component usage.
- Prefer structured data models over ad hoc strings for business rules.
- Keep demo data anonymized and customer-safe.

## 12. Dev Log and Archive Rules

`DEV_LOG.md` should stay readable. Keep it as the current active log plus archive index.

- Keep recent active records in root `DEV_LOG.md`.
- Move older records to `docs/archive/dev-log/` by date range when the root log becomes too large.
- Do not rewrite historical archive entries except to fix broken Markdown or restore accidentally corrupted content.
- When investigating older context, use `rg` across `DEV_LOG.md` and `docs/archive/dev-log/`.

`DEV_LOG.md` entries should include:

- modification time,
- modified files or modules,
- reason,
- result,
- rollback notes,
- current risk.

## 13. Backup Rules

Do not create `.codex-backup` snapshots for every small change.

Create or suggest a backup set when:

- the user asks for handoff, backup, account switching, or recovery support,
- a major page/workflow/version is delivered,
- a large route/store/type/mock/business-rule change lands,
- context has been recovered from sessions or archives,
- the knowledge base itself is substantially reorganized.

Backup set format:

```text
.codex-backup/context-snapshot-YYYY-MM-DD-HHMM.md
.codex-backup/current-todo-YYYY-MM-DD-HHMM.md
.codex-backup/page-state-YYYY-MM-DD-HHMM.md
```

## 14. Sensitive Content Rules

Customer-visible UI, mock data, docs, backup files, and demo narration must use safe wording:

- Bank
- BankApp
- BANK 1

Avoid old customer brand names in visible content. Internal compatibility identifiers can remain only when needed for code continuity and must not leak into customer-facing UI.

Do not commit:

- keys,
- tokens,
- passwords beyond existing demo credentials,
- real customer records,
- unapproved customer screenshots,
- sensitive production data.

## 15. Validation Rules

For frontend or interaction changes, normally run:

```bash
npm run lint
npm run build
```

Use browser smoke checks when UI changes affect:

- `/`
- `/design-system`
- affected Call Management pages,
- affected Routing Config pages,
- affected modals or interaction paths.

For documentation-only tasks, lint/build can be skipped. The final response must explicitly say they were skipped because no runtime code changed.

## 16. Git Rules

- Always check `git status --short --branch` before edits.
- Do not use destructive commands such as `git reset --hard` or `git checkout --` unless the user explicitly asks.
- Do not overwrite user changes.
- If unrelated dirty files exist, leave them alone.
- If the user asks for a commit, stage only the intended files.

## 17. Production Deployment Rules

These rules are mandatory for Vercel or any other production / customer-visible deployment.

- Default release flow is: inspect `git status --short --branch`, run required validation, commit intended changes, push to the remote branch, then deploy the committed revision.
- Do not deploy a dirty working tree to production by default.
- If `git status --short --branch` shows uncommitted or untracked files before a production deployment, stop and ask the user whether to:
  - commit and push first,
  - deploy the dirty local workspace anyway,
  - or cancel the deployment.
- Treat "publish", "release", "deploy", "发布", and similar wording as requiring the default committed release flow unless the user explicitly says to deploy uncommitted local changes.
- Do not interpret a plan assumption such as "use current workspace" as permission to skip commit / push. If the user's requested release flow is unusual, risky, or ambiguous, ask for confirmation before deploying.
- Production deployments must explicitly use customer-safe environment settings when applicable, especially `VITE_APP_VISIBILITY_PROFILE=customer` so local-only modules such as Employee Management and Design System stay hidden.
- After deployment, record the production URL, deployment command, environment profile, validation results, and any rollback notes in `DEV_LOG.md`.
