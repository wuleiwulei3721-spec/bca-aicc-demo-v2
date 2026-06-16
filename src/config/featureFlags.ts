export const featureFlags = {
  enableRoutingConfigMenus:
    String(import.meta.env.VITE_ENABLE_ADMIN_MENUS ?? 'true').toLowerCase() !==
    'false',
} as const
