import { featureFlags } from './featureFlags'

export type VisibilityProfile = 'customer' | 'local'
export type ModuleVisibilityKey =
  | 'call-management'
  | 'channel-simulation'
  | 'design-system'
  | 'employee-management'
  | 'monitoring'
  | 'routing-config'

const rawVisibilityProfile = String(
  import.meta.env.VITE_APP_VISIBILITY_PROFILE ?? 'customer',
).toLowerCase()

export const visibilityProfile: VisibilityProfile =
  rawVisibilityProfile === 'local' ? 'local' : 'customer'

export const isLocalVisibility = visibilityProfile === 'local'

const localOnlyModules = new Set<ModuleVisibilityKey>([
  'design-system',
  'employee-management',
])

export function isModuleVisible(moduleKey: ModuleVisibilityKey) {
  if (moduleKey === 'routing-config') {
    return featureFlags.enableRoutingConfigMenus
  }

  return isLocalVisibility || !localOnlyModules.has(moduleKey)
}

export function isLocalOnlyRouteVisible() {
  return isLocalVisibility
}
