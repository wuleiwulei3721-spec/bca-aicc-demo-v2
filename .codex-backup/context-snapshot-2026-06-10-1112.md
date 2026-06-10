# Context Snapshot - 2026-06-10 11:12 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/admin-config-latest`
- Scope: local internal admin branch for Call Management and Routing Config.

## Latest Change

- `Call Management > Global Control Configuration` now includes a `Routing Fallback` section.
- The new required `Default Skill Queue` field reads active skill queues from Routing Config.
- Default value is `SQ_GENERAL_ID / General Service - Indonesian`.

## Routing Requirement Context

- If no enabled skill routing rule matches, the routing requirement falls back to the global default skill queue.
- If the default queue is missing, disabled, or unsupported for the current media type, routing fails.
- The current demo only captures the configuration field; it does not implement a backend routing engine.

## Validation

- `npm run lint` passed.
- `npm run build` passed with the existing Vite/Rolldown chunk size warning.
- `git diff --check` passed with existing CRLF working tree warnings.

## Risk

- The field currently depends on the front-end Routing Config demo store. A real backend integration should source this value from a shared system configuration API.
