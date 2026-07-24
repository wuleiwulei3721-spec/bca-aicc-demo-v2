export const featureFlags = {
  enableContactEdit:
    String(import.meta.env.VITE_ENABLE_CONTACT_EDIT ?? 'false').toLowerCase() ===
    'true',
  enableRoutingConfigMenus:
    String(import.meta.env.VITE_ENABLE_ADMIN_MENUS ?? 'true').toLowerCase() !==
    'false',
} as const
