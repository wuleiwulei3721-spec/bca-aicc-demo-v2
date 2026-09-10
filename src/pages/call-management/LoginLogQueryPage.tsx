import { DatePicker, Input, Select } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs, { type Dayjs } from 'dayjs'
import { useMemo, useState } from 'react'
import {
  AdminFilterField,
  AdminPage,
  AdminTable,
  AdminToolbar,
  BaseButton,
  BaseCard,
} from '../../components'
import { useCallManagementStore } from '../../store'
import type {
  LoginLogEntry,
  LoginLogLogoutType,
  LoginLogOperation,
} from '../../types'
import { formatCallManagementDateTime } from '../../utils/audit'

const { RangePicker } = DatePicker

type LoginLogDateRange = [Dayjs, Dayjs]

interface LoginLogFilters {
  dateRange: LoginLogDateRange
  logoutType: 'All' | LoginLogLogoutType
  keyword: string
  operation: 'All' | LoginLogOperation
}

const operationOptions: Array<{
  label: string
  value: LoginLogFilters['operation']
}> = [
  { label: 'All Operations', value: 'All' },
  { label: 'Login', value: 'Login' },
  { label: 'Log Out', value: 'Log Out' },
]

const logoutTypeOptions: Array<{
  label: string
  value: LoginLogFilters['logoutType']
}> = [
  { label: 'All Log Out Types', value: 'All' },
  { label: 'User', value: 'User' },
  { label: 'System', value: 'System' },
]

function createDefaultFilters(): LoginLogFilters {
  return {
    dateRange: [dayjs().subtract(6, 'day').startOf('day'), dayjs().endOf('day')],
    logoutType: 'All',
    keyword: '',
    operation: 'All',
  }
}

function formatDateTime(value: string) {
  return formatCallManagementDateTime(value)
}

function matchesFilters(entry: LoginLogEntry, filters: LoginLogFilters) {
  const keyword = filters.keyword.trim().toLowerCase()
  const occurredAt = dayjs(entry.occurredAt)
  const [rangeStart, rangeEnd] = filters.dateRange

  return (
    (!keyword ||
      entry.employeeId.toLowerCase().includes(keyword) ||
      entry.employeeName.toLowerCase().includes(keyword)) &&
    (filters.operation === 'All' || entry.operation === filters.operation) &&
    (filters.logoutType === 'All' || entry.logoutType === filters.logoutType) &&
    (occurredAt.isSame(rangeStart, 'second') || occurredAt.isAfter(rangeStart)) &&
    (occurredAt.isSame(rangeEnd, 'second') || occurredAt.isBefore(rangeEnd))
  )
}

export function LoginLogQueryPage() {
  const loginLogs = useCallManagementStore((state) => state.loginLogs)
  const [appliedFilters, setAppliedFilters] = useState<LoginLogFilters>(() =>
    createDefaultFilters(),
  )
  const [draftFilters, setDraftFilters] = useState<LoginLogFilters>(() =>
    createDefaultFilters(),
  )

  const filteredLogs = useMemo(
    () =>
      loginLogs
        .filter((entry) => matchesFilters(entry, appliedFilters))
        .sort(
          (first, second) =>
            Date.parse(second.occurredAt) - Date.parse(first.occurredAt),
        ),
    [appliedFilters, loginLogs],
  )

  const columns: ColumnsType<LoginLogEntry> = [
    {
      dataIndex: 'employeeId',
      title: 'Employee ID',
      width: 150,
    },
    {
      dataIndex: 'employeeName',
      ellipsis: true,
      title: 'Employee Name',
      width: 180,
    },
    {
      dataIndex: 'operation',
      title: 'Operation',
      width: 130,
    },
    {
      dataIndex: 'logoutType',
      render: (value: LoginLogEntry['logoutType']) => value ?? '-',
      title: 'Log Out Type',
      width: 140,
    },
    {
      dataIndex: 'occurredAt',
      render: (value: string) => formatDateTime(value),
      title: 'Time',
      width: 210,
    },
  ]

  const handleSearch = () => {
    setAppliedFilters({ ...draftFilters })
  }

  const handleReset = () => {
    const nextFilters = createDefaultFilters()

    setDraftFilters(nextFilters)
    setAppliedFilters(nextFilters)
  }

  return (
    <AdminPage
      className="login-log-query"
      title="Login Log"
    >
      <BaseCard compact>
        <AdminToolbar
          filters={
            <>
              <AdminFilterField label="Keyword" width={260}>
                <Input
                  allowClear
                  placeholder="Employee ID / name"
                  value={draftFilters.keyword}
                  onChange={(event) =>
                    setDraftFilters((currentFilters) => ({
                      ...currentFilters,
                      keyword: event.target.value,
                    }))
                  }
                />
              </AdminFilterField>
              <AdminFilterField label="Time Range" width={300}>
                <RangePicker
                  allowClear={false}
                  format="DD-MM-YYYY HH:mm:ss"
                  showTime
                  value={draftFilters.dateRange}
                  onChange={(value) => {
                    if (!value?.[0] || !value[1]) {
                      return
                    }

                    setDraftFilters((currentFilters) => ({
                      ...currentFilters,
                      dateRange: [value[0], value[1]],
                    }))
                  }}
                />
              </AdminFilterField>
              <AdminFilterField label="Operation" width={170}>
                <Select
                  options={operationOptions}
                  value={draftFilters.operation}
                  onChange={(value) =>
                    setDraftFilters((currentFilters) => ({
                      ...currentFilters,
                      operation: value,
                    }))
                  }
                />
              </AdminFilterField>
              <AdminFilterField label="Log Out Type" width={170}>
                <Select
                  options={logoutTypeOptions}
                  value={draftFilters.logoutType}
                  onChange={(value) =>
                    setDraftFilters((currentFilters) => ({
                      ...currentFilters,
                      logoutType: value,
                    }))
                  }
                />
              </AdminFilterField>
              <div className="routing-config-page__admin-actions">
                <BaseButton variant="primary" onClick={handleSearch}>
                  Search
                </BaseButton>
                <BaseButton variant="secondary" onClick={handleReset}>
                  Reset
                </BaseButton>
              </div>
            </>
          }
        />
        <AdminTable<LoginLogEntry>
          columns={columns}
          dataSource={filteredLogs}
          horizontalScroll={810}
          pagination={{}}
          rowKey="id"
        />
      </BaseCard>
    </AdminPage>
  )
}
