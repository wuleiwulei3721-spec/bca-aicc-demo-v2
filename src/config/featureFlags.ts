export const featureFlags = {
  enableRoutingConfigMenus:
    import.meta.env.VITE_ENABLE_ADMIN_MENUS === 'true',
} as const
