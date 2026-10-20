# BANK 1 attachment delivery context

Updated: 2026-10-20 11:53 +08:00
Base HEAD: `3e12292`; attachment delivery is dirty, uncommitted work.
This is a context snapshot, not a full code backup or a commit.

- Done: Attachment Management, shared catalog/content registry, Email integration, and all three agent Live Chat channels.
- Entry: Call Management after Common Link; `/call-management/attachments` opens/reuses an authenticated closable workspace tab in customer/local profiles.
- Runtime map: attachment management/components/domain, workspace registry/menu/routes, Email composer/templates/drafts/types, Live Chat conversation/Message Record/types, and `src/store/appStore.ts`.
- Exact rules: `BUSINESS_RULES.md`; product decision: DEC-060.
- Shared categories, entries, File/Blob bytes, and content IDs exist only in frontend memory; full refresh resets them.
- Human explicitly selected the frontend demo boundary: no attachment API, environment flag, FastAPI/MySQL migration, SMTP, gateway, or production permissions.
- Local preview: http://127.0.0.1:5175
- Validation: 12 Node attachment tests passed; final `npm run lint` and `npm run build` succeeded after all layer/CSS fixes. Frontend TypeScript diagnostics: 147 baseline versus 146 current, with no newly introduced errors; diagnostics are not globally clean.
- Frontend TypeScript comparison: original HEAD tracked files 147 diagnostics, current 146, no new diagnostics; global typecheck is not clean.
- Browser checks cover Email oversize draft/send recovery, three-channel sends, session isolation, sensitive-word atomic blocking, customer Email picker layering, and sent image preservation after deletion.
- CUA checked management at 1366x768 and 1920x1080; document width equaled viewport width, with no horizontal overflow. Existing large chunk warning remains.
- Production binary storage/persistence, backend authorization/audit, SMTP, and chat gateway work remain future scope.
- No deployment, commit, or push was performed or requested for this delivery.
- Snapshot contains no secrets or customer data.
