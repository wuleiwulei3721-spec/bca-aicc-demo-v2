import type { AttachmentCategory, AttachmentEntry } from '../../types/attachment'
import { getAttachmentKind } from '../../utils/attachmentRules'
import { getCategoryDescendantIds } from '../../utils/categoryTree'

export interface AttachmentFiltersValue { keyword: string; category: string; kind: string; status: string }
export const emptyAttachmentFilters: AttachmentFiltersValue = { keyword: '', category: '', kind: '', status: '' }
export function filterAttachments(entries: AttachmentEntry[], filters: AttachmentFiltersValue, includeRemark = false, categories?: readonly AttachmentCategory[]) {
  const keyword = filters.keyword.trim().toLowerCase()
  const categoryIds = filters.category && categories ? getCategoryDescendantIds(categories, filters.category) : undefined
  return entries.filter((entry) => [entry.name, entry.fileName, includeRemark ? entry.remark : ''].some((value) => value.toLowerCase().includes(keyword)) && (!filters.category || (categoryIds ? categoryIds.has(entry.categoryId) : filters.category === entry.categoryId)) && (!filters.kind || filters.kind === getAttachmentKind(entry)) && (!filters.status || filters.status === entry.status))
}

export type AttachmentFilterCategories = AttachmentCategory[]
