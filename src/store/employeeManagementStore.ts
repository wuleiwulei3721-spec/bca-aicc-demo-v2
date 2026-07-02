import { create } from 'zustand'
import { employeeProfiles } from '../mock/employeeManagement'
import type { EmployeeProfile } from '../types'

interface EmployeeManagementStore {
  employeeProfiles: EmployeeProfile[]
  resetEmployeeProfiles: () => void
  upsertEmployeeProfile: (profile: EmployeeProfile) => void
}

function cloneProfile(profile: EmployeeProfile): EmployeeProfile {
  return {
    ...profile,
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
          (item) => item.employeeId === profile.employeeId,
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
