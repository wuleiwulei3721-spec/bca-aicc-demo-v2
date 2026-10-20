import { Input, Select, TreeSelect } from 'antd'
import { AdminFilterField, AdminToolbar, BaseButton } from '..'
import type { AttachmentCategory } from '../../types/attachment'
import { buildCategorySelectTree } from '../../utils/categoryTree'
import type { ReactNode } from 'react'
import type { AttachmentFiltersValue } from './attachmentFilterModel'
export type { AttachmentFiltersValue } from './attachmentFilterModel'
export function AttachmentFilters({ value, categories, onChange, onSearch, onReset, management, primaryActions, showCategory = true, showType = true }: {
  value: AttachmentFiltersValue; categories: AttachmentCategory[]; onChange: (value: AttachmentFiltersValue) => void
  onSearch: () => void; onReset: () => void; management?: boolean; primaryActions?: ReactNode; showCategory?: boolean; showType?: boolean
}) {
  return <AdminToolbar filters={<>
    <AdminFilterField label="Keyword" width={250}><Input placeholder={management ? 'Name, filename, remark' : 'Name or filename'} value={value.keyword} onChange={(event) => onChange({ ...value, keyword: event.target.value })} onPressEnter={onSearch} /></AdminFilterField>
    {showCategory && <AdminFilterField label="Category" width={210}><TreeSelect<string> style={{ width: '100%', height: 32 }} placeholder="All Categories" allowClear showSearch treeDefaultExpandAll treeNodeLabelProp="label" treeNodeFilterProp="label" treeData={buildCategorySelectTree(categories)} value={value.category || undefined} onChange={(category) => onChange({ ...value, category: category ?? '' })} /></AdminFilterField>}
    {showType && <AdminFilterField label="File Type" width={120}><Select value={value.kind} options={[{ value: '', label: 'All types' }, ...['image', 'video', 'pdf'].map((kind) => ({ value: kind, label: kind === 'pdf' ? 'PDF' : kind[0].toUpperCase() + kind.slice(1) }))]} onChange={(kind) => onChange({ ...value, kind })} /></AdminFilterField>}
    {management && <AdminFilterField label="Status" width={155}><Select value={value.status} options={[{ value: '', label: 'All statuses' }, { value: 'Active', label: 'Enabled' }, { value: 'Disabled', label: 'Disabled' }]} onChange={(status) => onChange({ ...value, status })} /></AdminFilterField>}
  </>} actions={<><BaseButton variant="primary" onClick={onSearch}>Search</BaseButton><BaseButton onClick={onReset}>Reset</BaseButton></>} primaryActions={primaryActions} />
}
