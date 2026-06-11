export const featureFlags = {
  enableAdminMenus: import.meta.env.VITE_ENABLE_ADMIN_MENUS === 'true',
} as const
