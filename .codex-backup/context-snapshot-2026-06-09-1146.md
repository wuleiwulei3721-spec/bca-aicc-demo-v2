# Context Snapshot - 2026-06-09 11:46 +08:00

## Project

- Project: BANK 1 AICC Demo V2.
- Branch: `main`.
- Current focus: login visual polish and Header logout affordance.

## Latest Change

- Header system `Log Out` button now matches the adjacent status dropdown button size: 26x26 on desktop and 24x24 on mobile.
- Login page left-side visual now uses a real local image asset at `/screenshots/login-illustration.svg` instead of CSS-only illustration fragments.
- Login page `BANK 1` logo is fixed to the viewport top-left so it no longer moves down with the left visual area.

## Validation

- `npm run lint` passed.
- `npm run build` passed with the existing Vite chunk size warning.
- Local Chrome CDP visual smoke confirmed `/login` brand position at left 28 / top 26, login illustration loaded with natural size 620x360, and Header logout/dropdown buttons both measured 26x26.

## Risks

- The original UI attachment was not available as a repo file, so the login illustration is a recreated local SVG asset rather than a crop from the provided screenshot.
- If the UI team provides the original crop as a file, replace `/screenshots/login-illustration.svg` while keeping the same layout constraints.
