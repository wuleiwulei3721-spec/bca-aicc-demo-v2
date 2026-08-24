import {
  EditOutlined,
  KeyOutlined,
  PlusOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { Alert, Input, InputNumber, Select, TreeSelect } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import {
  AdminFilterField,
  AdminFormField,
  AdminModal,
  AdminModalFooter,
  AdminPage,
  AdminTable,
  AdminToolbar,
  BaseButton,
  BaseCard,
  BaseTabs,
  StatusBadge,
} from '../../components'
import { useOperationFeedback } from '../../contexts/operationFeedbackContext'
import { employeeOrganizationUnits } from '../../mock/employeeManagement'
import {
  useEmployeeManagementStore,
  useRoutingConfigStore,
} from '../../store'
import type {
  EmployeePositionType,
  EmployeeProfile,
  EmployeeRole,
  EmployeeSkillSetting,
  EmployeeStatus,
} from '../../types'

type EmployeeModalMode = 'create' | 'edit' | null

interface EmployeeFilters {
  aiccId: string
  employeeId: string
  employeeName: string
  positionType: '' | EmployeePositionType
  roleName: '' | EmployeeRole
  status: '' | EmployeeStatus
  unitId: string
}

const defaultFilters: EmployeeFilters = {
  aiccId: '',
  employeeId: '',
  employeeName: '',
  positionType: '',
  roleName: '',
  status: '',
  unitId: '',
}

const statusOptions: Array<{ label: string; value: '' | EmployeeStatus }> = [
  { label: 'All', value: '' },
  { label: 'Normal', value: 'Normal' },
  { label: 'Resigned', value: 'Resigned' },
  { label: 'Frozen', value: 'Frozen' },
  { label: 'Disabled', value: 'Disabled' },
]

const employeeStatusOptions = statusOptions.filter(
  (option): option is { label: string; value: EmployeeStatus } =>
    option.value !== '',
)

const positionTypeOptions: Array<{
  label: string
  value: '' | EmployeePositionType
}> = [
  { label: 'All', value: '' },
  { label: 'Management', value: 'Management' },
  { label: 'Agent', value: 'Agent' },
]

const employeePositionTypeOptions = positionTypeOptions.filter(
  (option): option is { label: string; value: EmployeePositionType } =>
    option.value !== '',
)

const roleOptions: Array<{ label: string; value: '' | EmployeeRole }> = [
  { label: 'All', value: '' },
  { label: 'Agent', value: 'Agent' },
  { label: 'TL', value: 'TL' },
  { label: 'SPV', value: 'SPV' },
  { label: 'OM', value: 'OM' },
  { label: 'QA', value: 'QA' },
]

const employeeRoleOptions = roleOptions.filter(
  (option): option is { label: string; value: EmployeeRole } =>
    option.value !== '',
)

const languageOptions = [
  { label: 'Indonesian', value: 'Indonesian' },
  { label: 'English', value: 'English' },
  { label: 'Chinese', value: 'Chinese' },
]

const genderOptions = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
]

const returnTaskTypeOptions = [
  { label: 'Standard Callback', value: 'Standard Callback' },
  { label: 'Supervisor Callback', value: 'Supervisor Callback' },
  { label: 'Digital Callback', value: 'Digital Callback' },
]

const vdnOptions = [
  { label: 'Retail Inbound VDN', value: 'Retail Inbound VDN' },
  { label: 'Card Emergency VDN', value: 'Card Emergency VDN' },
]

function normalizeValue(value: string) {
  return value.trim().toLowerCase()
}

function flattenOrganizationUnits() {
  const units: Array<{ unitId: string; unitName: string }> = []

  const visit = (items: typeof employeeOrganizationUnits) => {
    items.forEach((item) => {
      units.push({ unitId: item.unitId, unitName: item.unitName })
      if (item.children?.length) {
        visit(item.children)
      }
    })
  }

  visit(employeeOrganizationUnits)

  return units
}

const organizationUnitOptions = flattenOrganizationUnits()

function toTreeData(items: typeof employeeOrganizationUnits): Array<{
  children?: ReturnType<typeof toTreeData>
  title: string
  value: string
}> {
  return items.map((item) => ({
    children: item.children ? toTreeData(item.children) : undefined,
    title: item.unitName,
    value: item.unitId,
  }))
}

const organizationTreeData = toTreeData(employeeOrganizationUnits)

function getNextEmployeeId(entries: EmployeeProfile[]) {
  const nextSequence =
    entries.reduce((maxSequence, entry) => {
      const match = /^EMP-(\d+)$/.exec(entry.employeeId)

      return match ? Math.max(maxSequence, Number(match[1])) : maxSequence
    }, 10000) + 1

  return `EMP-${String(nextSequence).padStart(5, '0')}`
}

function createDefaultDraft(entries: EmployeeProfile[]) {
  const employeeId = getNextEmployeeId(entries)
  const selectedUnit = organizationUnitOptions[2] ?? organizationUnitOptions[0]

  return {
    aiccExtension: '',
    aiccId: `AICC${employeeId.replace(/\D/g, '').slice(-4)}`,
    aiccPassword: '',
    alias: '',
    email: '',
    employeeId,
    employeeName: '',
    employeePassword: '',
    gender: '',
    homeRole: 'Agent' as EmployeeRole,
    internalNumber: '',
    language: 'Indonesian',
    lastLoginTime: '-',
    liveChatMaxServices: 5,
    officePhone: '',
    positionLevel: '',
    positionType: 'Agent' as EmployeePositionType,
    returnTaskType: 'Standard Callback',
    roleName: 'Agent' as EmployeeRole,
    skillSettings: [],
    status: 'Normal' as EmployeeStatus,
    teamName: '',
    unitId: selectedUnit?.unitId ?? '',
    unitName: selectedUnit?.unitName ?? '',
    vdn: 'Retail Inbound VDN',
  }
}

function renderEmployeeStatus(status: EmployeeStatus) {
  const statusMap: Record<
    EmployeeStatus,
    { label: string; status: 'success' | 'disabled' | 'warning' | 'error' }
  > = {
    Disabled: { label: 'Disabled', status: 'disabled' },
    Frozen: { label: 'Frozen', status: 'warning' },
    Normal: { label: 'Normal', status: 'success' },
    Resigned: { label: 'Resigned', status: 'error' },
  }

  const badge = statusMap[status]

  return (
    <StatusBadge dot label={badge.label} size="small" status={badge.status} />
  )
}

function coerceWeight(value: number | null | undefined, min: number, max: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return min
  }

  return Math.min(max, Math.max(min, value))
}

export function EmployeeProfileManagementPage() {
  const employeeProfiles = useEmployeeManagementStore(
    (state) => state.employeeProfiles,
  )
  const upsertEmployeeProfile = useEmployeeManagementStore(
    (state) => state.upsertEmployeeProfile,
  )
  const skillQueues = useRoutingConfigStore((state) => state.skillQueues)
  const [appliedFilters, setAppliedFilters] =
    useState<EmployeeFilters>(defaultFilters)
  const [draft, setDraft] = useState<EmployeeProfile>(() =>
    createDefaultDraft(employeeProfiles),
  )
  const [filterDraft, setFilterDraft] =
    useState<EmployeeFilters>(defaultFilters)
  const [modalMode, setModalMode] = useState<EmployeeModalMode>(null)
  const { notify } = useOperationFeedback()
  const [skillSettingsTarget, setSkillSettingsTarget] =
    useState<EmployeeProfile | null>(null)
  const [skillSettingsDraft, setSkillSettingsDraft] =
    useState<EmployeeProfile | null>(null)
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const skillQueueOptions = useMemo(
    () =>
      skillQueues.map((skillQueue) => ({
        label: skillQueue.skillQueueName,
        value: skillQueue.skillQueueCode,
      })),
    [skillQueues],
  )
  const skillQueueNameMap = useMemo(
    () =>
      new Map(
        skillQueues.map((skillQueue) => [
          skillQueue.skillQueueCode,
          skillQueue.skillQueueName,
        ]),
      ),
    [skillQueues],
  )

  const filteredEntries = useMemo(
    () =>
      employeeProfiles.filter((entry) => {
        const employeeIdKeyword = normalizeValue(appliedFilters.employeeId)
        const employeeNameKeyword = normalizeValue(appliedFilters.employeeName)
        const aiccIdKeyword = normalizeValue(appliedFilters.aiccId)
        const matchesEmployeeId = employeeIdKeyword
          ? entry.employeeId.toLowerCase().includes(employeeIdKeyword)
          : true
        const matchesEmployeeName = employeeNameKeyword
          ? entry.employeeName.toLowerCase().includes(employeeNameKeyword)
          : true
        const matchesAiccId = aiccIdKeyword
          ? entry.aiccId.toLowerCase().includes(aiccIdKeyword)
          : true
        const matchesUnit = appliedFilters.unitId
          ? entry.unitId === appliedFilters.unitId
          : true
        const matchesPosition = appliedFilters.positionType
          ? entry.positionType === appliedFilters.positionType
          : true
        const matchesStatus = appliedFilters.status
          ? entry.status === appliedFilters.status
          : true
        const matchesRole = appliedFilters.roleName
          ? entry.roleName === appliedFilters.roleName
          : true

        return (
          matchesEmployeeId &&
          matchesEmployeeName &&
          matchesAiccId &&
          matchesUnit &&
          matchesPosition &&
          matchesStatus &&
          matchesRole
        )
      }),
    [appliedFilters, employeeProfiles],
  )

  const validationErrors = useMemo(() => {
    if (!modalMode) {
      return []
    }

    const errors: string[] = []
    const normalizedEmployeeId = normalizeValue(draft.employeeId)
    const normalizedName = normalizeValue(draft.employeeName)
    const normalizedPassword = normalizeValue(draft.employeePassword)
    const normalizedRoleName = normalizeValue(draft.roleName)
    const normalizedHomeRole = normalizeValue(draft.homeRole)
    const normalizedPositionType = normalizeValue(draft.positionType)
    const normalizedUnit = normalizeValue(draft.unitId)
    const normalizedGender = normalizeValue(draft.gender)

    if (!normalizedEmployeeId) {
      errors.push('Employee ID is required.')
    }

    if (!normalizedName) {
      errors.push('Employee Name is required.')
    }

    if (!normalizedPassword) {
      errors.push('Employee Password is required.')
    }

    if (!normalizedRoleName) {
      errors.push('Role Name is required.')
    }

    if (!normalizedHomeRole) {
      errors.push('Home Role is required.')
    }

    if (!normalizedPositionType) {
      errors.push('Position Type is required.')
    }

    if (!normalizedUnit) {
      errors.push('Organization Unit is required.')
    }

    if (!normalizedGender) {
      errors.push('Gender is required.')
    }

    if (
      normalizedEmployeeId &&
      employeeProfiles.some(
        (entry) =>
          normalizeValue(entry.employeeId) === normalizedEmployeeId &&
          (modalMode === 'create' || entry.employeeId !== draft.employeeId),
      )
    ) {
      errors.push('Employee ID already exists.')
    }

    return errors
  }, [
    draft.employeeId,
    draft.employeeName,
    draft.employeePassword,
    draft.gender,
    draft.homeRole,
    draft.positionType,
    draft.roleName,
    draft.unitId,
    employeeProfiles,
    modalMode,
  ])

  const updateDraft = <Key extends keyof EmployeeProfile>(
    key: Key,
    value: EmployeeProfile[Key],
  ) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }))
  }

  const handleSearch = () => {
    setAppliedFilters({ ...filterDraft })
  }

  const handleReset = () => {
    setAppliedFilters(defaultFilters)
    setFilterDraft(defaultFilters)
  }

  const openCreateModal = () => {
    setDraft(createDefaultDraft(employeeProfiles))
    setModalMode('create')
    setSubmitAttempted(false)
  }

  const openEditModal = (entry: EmployeeProfile) => {
    setDraft({
      ...entry,
      skillSettings: entry.skillSettings.map((setting) => ({ ...setting })),
    })
    setModalMode('edit')
    setSubmitAttempted(false)
  }

  const closeModal = () => {
    setDraft(createDefaultDraft(employeeProfiles))
    setModalMode(null)
    setSubmitAttempted(false)
  }

  function mergeSkillSettings(
    selectedSkillQueueCodes: string[],
    settings: EmployeeSkillSetting[],
  ) {
    const settingMap = new Map(
      settings.map((setting) => [setting.skillQueueCode, setting]),
    )

    return selectedSkillQueueCodes.map((skillQueueCode) => ({
      agentWeight: settingMap.get(skillQueueCode)?.agentWeight ?? 1,
      skillQueueCode,
      skillWeight: settingMap.get(skillQueueCode)?.skillWeight ?? 1,
    }))
  }

  const handleSave = () => {
    setSubmitAttempted(true)

    if (validationErrors.length > 0) {
      return
    }

    const selectedUnit = organizationUnitOptions.find(
      (unit) => unit.unitId === draft.unitId,
    )
    const nextEntry: EmployeeProfile = {
      ...draft,
      aiccExtension: draft.aiccExtension.trim(),
      aiccId: draft.aiccId.trim(),
      aiccPassword: draft.aiccPassword.trim(),
      alias: draft.alias?.trim(),
      email: draft.email.trim(),
      employeeId: draft.employeeId.trim(),
      employeeName: draft.employeeName.trim(),
      employeePassword: draft.employeePassword.trim(),
      internalNumber: draft.internalNumber.trim(),
      officePhone: draft.officePhone.trim(),
      positionLevel: draft.positionLevel.trim(),
      teamName: draft.teamName.trim(),
      unitName: selectedUnit?.unitName ?? draft.unitName,
    }

    upsertEmployeeProfile(nextEntry)
    notify(
      modalMode === 'edit'
        ? 'Employee profile updated.'
        : 'Employee profile added.',
    )
    closeModal()
  }

  const openSkillSettings = (entry: EmployeeProfile) => {
    const nextEntry = {
      ...entry,
      skillSettings: entry.skillSettings.map((setting) => ({ ...setting })),
    }
    setSkillSettingsTarget(entry)
    setSkillSettingsDraft(nextEntry)
  }

  const closeSkillSettings = () => {
    setSkillSettingsTarget(null)
    setSkillSettingsDraft(null)
  }

  const updateSkillSetting = (
    skillQueueCode: string,
    key: 'agentWeight' | 'skillWeight',
    value: number | null,
  ) => {
    setSkillSettingsDraft((currentDraft) =>
      currentDraft
        ? {
            ...currentDraft,
            skillSettings: currentDraft.skillSettings.map((setting) =>
              setting.skillQueueCode === skillQueueCode
                ? {
                    ...setting,
                    [key]: coerceWeight(value, 1, 9999),
                  }
                : setting,
            ),
          }
        : currentDraft,
    )
  }

  const updateLiveChatMaxServices = (value: number | null) => {
    setSkillSettingsDraft((currentDraft) =>
      currentDraft
        ? {
            ...currentDraft,
            liveChatMaxServices: coerceWeight(value, 0, 100),
          }
        : currentDraft,
    )
  }

  const saveSkillSettings = () => {
    if (!skillSettingsDraft) {
      return
    }

    upsertEmployeeProfile(skillSettingsDraft)
    notify('Skill settings updated.')
    closeSkillSettings()
  }

  const columns: ColumnsType<EmployeeProfile> = [
    {
      dataIndex: 'employeeId',
      title: 'Employee ID',
      width: 150,
    },
    {
      dataIndex: 'employeeName',
      title: 'Employee Name',
      width: 170,
    },
    {
      dataIndex: 'status',
      render: (status: EmployeeStatus) => renderEmployeeStatus(status),
      title: 'Employee Status',
      width: 150,
    },
    {
      dataIndex: 'homeRole',
      title: 'Home Role',
      width: 120,
    },
    {
      dataIndex: 'positionType',
      title: 'Position Type',
      width: 140,
    },
    {
      dataIndex: 'positionLevel',
      title: 'Position Level',
      width: 140,
    },
    {
      dataIndex: 'unitName',
      title: 'Organization Unit',
      width: 220,
    },
    {
      dataIndex: 'roleName',
      title: 'Role Name',
      width: 120,
    },
    {
      dataIndex: 'teamName',
      title: 'Team Name',
      width: 170,
    },
    {
      dataIndex: 'lastLoginTime',
      title: 'Last Login Time',
      width: 170,
    },
    {
      fixed: 'right',
      render: (_, record) => (
        <div className="routing-config-crud__row-actions employee-profile-management__row-actions">
          <button
            aria-label={`Edit ${record.employeeName}`}
            title="Edit"
            type="button"
            onClick={() => openEditModal(record)}
          >
            <EditOutlined />
          </button>
          <button
            aria-label={`Password Reset ${record.employeeName}`}
            title="Password Reset"
            type="button"
          >
            <KeyOutlined />
          </button>
          <button
            aria-label={`Capacity Settings ${record.employeeName}`}
            title="Capacity Settings"
            type="button"
            onClick={() => openSkillSettings(record)}
          >
            <SettingOutlined />
          </button>
        </div>
      ),
      title: 'Actions',
      width: 136,
    },
  ]

  const skillColumns: ColumnsType<EmployeeSkillSetting> = [
    {
      dataIndex: 'skillQueueCode',
      render: (value: string) => value,
      title: 'Skill ID',
      width: 160,
    },
    {
      dataIndex: 'skillQueueCode',
      render: (value: string) => skillQueueNameMap.get(value) ?? value,
      title: 'Skill Name',
      width: 240,
    },
    {
      dataIndex: 'agentWeight',
      render: (value: number, record) => (
        <InputNumber
          max={9999}
          min={1}
          value={value}
          onChange={(nextValue) =>
            updateSkillSetting(record.skillQueueCode, 'agentWeight', nextValue)
          }
        />
      ),
      title: 'Agent Weight',
      width: 180,
    },
    {
      dataIndex: 'skillWeight',
      render: (value: number, record) => (
        <InputNumber
          max={9999}
          min={1}
          value={value}
          onChange={(nextValue) =>
            updateSkillSetting(record.skillQueueCode, 'skillWeight', nextValue)
          }
        />
      ),
      title: 'Skill Weight',
      width: 180,
    },
  ]

  return (
    <AdminPage
      className="employee-profile-management"
      title="Employee Profile"
    >
      <BaseCard compact>
        <AdminToolbar
          actions={
            <>
              <BaseButton variant="primary" onClick={handleSearch}>
                Search
              </BaseButton>
              <BaseButton variant="secondary" onClick={handleReset}>
                Reset
              </BaseButton>
              <BaseButton
                className="employee-profile-management__add-button"
                icon={<PlusOutlined />}
                variant="primary"
                onClick={openCreateModal}
              >
                Add
              </BaseButton>
            </>
          }
          filters={
            <>
              <AdminFilterField label="Employee ID" width={220}>
                <Input
                  placeholder="Employee ID"
                  value={filterDraft.employeeId}
                  onChange={(event) =>
                    setFilterDraft((currentDraft) => ({
                      ...currentDraft,
                      employeeId: event.target.value,
                    }))
                  }
                />
              </AdminFilterField>
              <AdminFilterField label="Employee Name" width={220}>
                <Input
                  placeholder="Employee Name"
                  value={filterDraft.employeeName}
                  onChange={(event) =>
                    setFilterDraft((currentDraft) => ({
                      ...currentDraft,
                      employeeName: event.target.value,
                    }))
                  }
                />
              </AdminFilterField>
              <AdminFilterField label="AICC ID" width={200}>
                <Input
                  placeholder="AICC ID"
                  value={filterDraft.aiccId}
                  onChange={(event) =>
                    setFilterDraft((currentDraft) => ({
                      ...currentDraft,
                      aiccId: event.target.value,
                    }))
                  }
                />
              </AdminFilterField>
              <AdminFilterField label="Organization Unit" width={220}>
                <TreeSelect
                  allowClear
                  showSearch
                  treeDefaultExpandAll
                  placeholder="Organization Unit"
                  treeData={organizationTreeData}
                  value={filterDraft.unitId || undefined}
                  onChange={(value) =>
                    setFilterDraft((currentDraft) => ({
                      ...currentDraft,
                      unitId: value ?? '',
                    }))
                  }
                />
              </AdminFilterField>
              <AdminFilterField label="Position Type" width={170}>
                <Select
                  options={positionTypeOptions}
                  value={filterDraft.positionType}
                  onChange={(value) =>
                    setFilterDraft((currentDraft) => ({
                      ...currentDraft,
                      positionType: value,
                    }))
                  }
                />
              </AdminFilterField>
              <AdminFilterField label="Employee Status" width={170}>
                <Select
                  options={statusOptions}
                  value={filterDraft.status}
                  onChange={(value) =>
                    setFilterDraft((currentDraft) => ({
                      ...currentDraft,
                      status: value,
                    }))
                  }
                />
              </AdminFilterField>
              <AdminFilterField label="Employee Role" width={170}>
                <Select
                  options={roleOptions}
                  value={filterDraft.roleName}
                  onChange={(value) =>
                    setFilterDraft((currentDraft) => ({
                      ...currentDraft,
                      roleName: value,
                    }))
                  }
                />
              </AdminFilterField>
            </>
          }
        />
        <AdminTable<EmployeeProfile>
          columns={columns}
          dataSource={filteredEntries}
          horizontalScroll={1700}
          pagination={{}}
          rowKey="employeeId"
        />
      </BaseCard>
      <AdminModal
        destroyOnClose
        open={Boolean(modalMode)}
        title={
          modalMode === 'edit'
            ? 'Edit Employee Profile'
            : 'Add Employee Profile'
        }
        width={1120}
        onCancel={closeModal}
      >
        <div className="routing-config-crud-modal__sections">
          {submitAttempted && validationErrors.length > 0 && (
            <Alert
              showIcon
              className="routing-config-crud-modal__validation"
              description={
                <ul>
                  {validationErrors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              }
              message="Please fix the form."
              type="warning"
            />
          )}
          <div className="employee-profile-management__form">
            <AdminFormField label="Employee ID" required>
              <Input
                disabled={modalMode === 'edit'}
                value={draft.employeeId}
                onChange={(event) =>
                  updateDraft('employeeId', event.target.value)
                }
              />
            </AdminFormField>
            <AdminFormField label="Employee Name" required>
              <Input
                value={draft.employeeName}
                onChange={(event) =>
                  updateDraft('employeeName', event.target.value)
                }
              />
            </AdminFormField>
            <AdminFormField label="Alias">
              <Input
                value={draft.alias}
                onChange={(event) => updateDraft('alias', event.target.value)}
              />
            </AdminFormField>
            <AdminFormField label="Employee Password" required>
              <Input.Password
                value={draft.employeePassword}
                onChange={(event) =>
                  updateDraft('employeePassword', event.target.value)
                }
              />
            </AdminFormField>
            <AdminFormField label="AICC ID">
              <Input
                value={draft.aiccId}
                onChange={(event) => updateDraft('aiccId', event.target.value)}
              />
            </AdminFormField>
            <AdminFormField label="AICC Extension">
              <Input
                value={draft.aiccExtension}
                onChange={(event) =>
                  updateDraft('aiccExtension', event.target.value)
                }
              />
            </AdminFormField>
            <AdminFormField label="AICC Password">
              <Input.Password
                value={draft.aiccPassword}
                onChange={(event) =>
                  updateDraft('aiccPassword', event.target.value)
                }
              />
            </AdminFormField>
            <AdminFormField label="VDN">
              <Select
                options={vdnOptions}
                value={draft.vdn}
                onChange={(value) => updateDraft('vdn', value)}
              />
            </AdminFormField>
            <AdminFormField label="Internal Number">
              <Input
                value={draft.internalNumber}
                onChange={(event) =>
                  updateDraft('internalNumber', event.target.value)
                }
              />
            </AdminFormField>
            <AdminFormField label="Language">
              <Select
                options={languageOptions}
                value={draft.language}
                onChange={(value) => updateDraft('language', value)}
              />
            </AdminFormField>
            <AdminFormField label="Return Task Type">
              <Select
                options={returnTaskTypeOptions}
                value={draft.returnTaskType}
                onChange={(value) => updateDraft('returnTaskType', value)}
              />
            </AdminFormField>
            <AdminFormField label="Role Name" required>
              <Select
                options={employeeRoleOptions}
                value={draft.roleName}
                onChange={(value) => updateDraft('roleName', value)}
              />
            </AdminFormField>
            <AdminFormField label="Home Role" required>
              <Select
                options={employeeRoleOptions}
                value={draft.homeRole}
                onChange={(value) => updateDraft('homeRole', value)}
              />
            </AdminFormField>
            <AdminFormField label="Position Type" required>
              <Select
                options={employeePositionTypeOptions}
                value={draft.positionType}
                onChange={(value) => updateDraft('positionType', value)}
              />
            </AdminFormField>
            <AdminFormField label="Position Level">
              <Input
                value={draft.positionLevel}
                onChange={(event) =>
                  updateDraft('positionLevel', event.target.value)
                }
              />
            </AdminFormField>
            <AdminFormField label="Employee Status" required>
              <Select
                options={employeeStatusOptions}
                value={draft.status}
                onChange={(value) => updateDraft('status', value)}
              />
            </AdminFormField>
            <AdminFormField label="Organization Unit" required>
              <TreeSelect
                showSearch
                treeDefaultExpandAll
                treeData={organizationTreeData}
                value={draft.unitId}
                onChange={(value) => updateDraft('unitId', value ?? '')}
              />
            </AdminFormField>
            <AdminFormField label="Gender" required>
              <Select
                options={genderOptions}
                value={draft.gender}
                onChange={(value) => updateDraft('gender', value)}
              />
            </AdminFormField>
            <AdminFormField label="Office Phone">
              <Input
                value={draft.officePhone}
                onChange={(event) =>
                  updateDraft('officePhone', event.target.value)
                }
              />
            </AdminFormField>
            <AdminFormField label="Email">
              <Input
                value={draft.email}
                onChange={(event) => updateDraft('email', event.target.value)}
              />
            </AdminFormField>
            <AdminFormField label="Team Name">
              <Input
                value={draft.teamName}
                onChange={(event) =>
                  updateDraft('teamName', event.target.value)
                }
              />
            </AdminFormField>
          </div>
        </div>
        <AdminModalFooter>
          <BaseButton variant="secondary" onClick={closeModal}>
            Cancel
          </BaseButton>
          <BaseButton variant="primary" onClick={handleSave}>
            Save
          </BaseButton>
        </AdminModalFooter>
      </AdminModal>
      <AdminModal
        destroyOnClose
        open={Boolean(skillSettingsTarget)}
        title={`Agent Capacity Settings - ${
          skillSettingsTarget?.employeeName ?? ''
        }`}
        width={980}
        onCancel={closeSkillSettings}
      >
        {skillSettingsDraft && (
          <BaseTabs
            items={[
              {
                key: 'skills',
                label: 'Skill Configuration',
                children: (
                  <div className="employee-profile-management__skill-config">
                    <AdminFormField label="Skill Queues" fullWidth>
                      <Select
                        mode="multiple"
                        options={skillQueueOptions}
                        placeholder="Select skill queues"
                        value={skillSettingsDraft.skillSettings.map(
                          (setting) => setting.skillQueueCode,
                        )}
                        onChange={(selectedSkillQueueCodes) =>
                          setSkillSettingsDraft((currentDraft) =>
                            currentDraft
                              ? {
                                  ...currentDraft,
                                  skillSettings: mergeSkillSettings(
                                    selectedSkillQueueCodes,
                                    currentDraft.skillSettings,
                                  ),
                                }
                              : currentDraft,
                          )
                        }
                      />
                    </AdminFormField>
                    <AdminTable<EmployeeSkillSetting>
                      columns={skillColumns}
                      dataSource={skillSettingsDraft.skillSettings}
                      horizontalScroll={760}
                      pagination={false}
                      rowKey="skillQueueCode"
                      tableVariant="modal"
                    />
                  </div>
                ),
              },
              {
                key: 'other',
                label: 'Other Configuration',
                children: (
                  <div className="employee-profile-management__other-config">
                    <AdminFormField label="Live Chat Max Services">
                      <span className="employee-profile-management__number-control">
                        <InputNumber
                          max={100}
                          min={0}
                          value={skillSettingsDraft.liveChatMaxServices}
                          onChange={updateLiveChatMaxServices}
                        />
                        <em>items</em>
                      </span>
                    </AdminFormField>
                  </div>
                ),
              },
            ]}
            variant="modal"
          />
        )}
        <AdminModalFooter>
          <BaseButton variant="secondary" onClick={closeSkillSettings}>
            Cancel
          </BaseButton>
          <BaseButton variant="primary" onClick={saveSkillSettings}>
            Save
          </BaseButton>
        </AdminModalFooter>
      </AdminModal>
    </AdminPage>
  )
}
