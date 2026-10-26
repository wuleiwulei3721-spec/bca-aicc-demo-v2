import { create } from 'zustand'
import { employeeProfiles } from '../mock/employeeManagement'
import type { EmployeeProfile } from '../types'
import { normalizeEmployeeId } from '../utils/audit'

interface EmployeeManagementStore {
  employeeProfiles: EmployeeProfile[]
  resetEmployeeProfiles: () => void
  upsertEmployeeProfile: (profile: EmployeeProfile) => void
}

function cloneProfile(profile: EmployeeProfile): EmployeeProfile {
  return {
    ...profile,
    employeeId: normalizeEmployeeId(profile.employeeId),
    skillSettings: profile.skillSettings.map((setting) => ({ ...setting })),
  }
}

function cloneInitialProfiles() {
  return employeeProfiles.map(cloneProfile)
}

export const useEmployeeManagementStore = create<EmployeeManagementStore>(
  (set) => ({
    employeeProfiles: cloneInitialProfiles(),
    resetEmployeeProfiles: () =>
      set({
        employeeProfiles: cloneInitialProfiles(),
      }),
    upsertEmployeeProfile: (profile) =>
      set((state) => {
        const existingIndex = state.employeeProfiles.findIndex(
          (item) => item.employeeId === normalizeEmployeeId(profile.employeeId),
        )
        const nextProfile = cloneProfile(profile)

        return {
          employeeProfiles:
            existingIndex >= 0
              ? state.employeeProfiles.map((item, index) =>
                  index === existingIndex ? nextProfile : item,
                )
              : [...state.employeeProfiles, nextProfile],
        }
      }),
  }),
)
