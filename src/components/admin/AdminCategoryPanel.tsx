import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, EllipsisOutlined, FolderAddOutlined, FolderOutlined } from '@ant-design/icons'
import { Dropdown, Input, Tree } from 'antd'
import type { TreeDataNode, TreeProps } from 'antd'
import { useState } from 'react'
import type { Key } from 'react'
import { getCategoryDepth, getCategoryDescendantIds } from '../../utils/categoryTree'
import './AdminCategoryPanel.less'
import { BaseButton } from '../BaseButton'
import { BaseCard } from '../BaseCard'

export interface AdminCategoryItem {
  id: string
  name: string
  count: number
  parentId?: string | null
  deleteDisabled?: boolean
  deleteTitle?: string
}

export interface AdminCategoryPanelProps {
  items: AdminCategoryItem[]
  hierarchy?: boolean
  maxDepth?: number
  createParentId?: string | null
  createParentLabel?: string
  onChildCreate?: (id: string) => void
  onCreateParentReset?: () => void
  selectedId: string
  allId: string
  totalCount: number
  search: string
  newName: string
  renameId: string
  renameName: string
  canCreate: boolean
  disabled?: boolean
  maxNameLength?: number
  onSearchChange: (value: string) => void
  onSelect: (id: string) => void
  onNewNameChange: (value: string) => void
  onCreate: () => void
  onRenameStart: (id: string) => void
  onRenameNameChange: (value: string) => void
  onRenameSave: () => void
  onRenameCancel: () => void
  onDelete: (id: string) => void
}

export function AdminCategoryPanel({ items, selectedId, allId, totalCount, search, newName, renameId, renameName, canCreate, disabled, maxNameLength, onSearchChange, onSelect, onNewNameChange, onCreate, onRenameStart, onRenameNameChange, onRenameSave, onRenameCancel, onDelete, hierarchy = false, maxDepth = 5, createParentId, onChildCreate, onCreateParentReset }: AdminCategoryPanelProps) {
  const [expandedKeys, setExpandedKeys] = useState<Key[]>(() => items.filter((item) => items.some((child) => child.parentId === item.id)).map((item) => item.id))
  const [searchExpansion, setSearchExpansion] = useState<{ query: string; keys: Key[] }>({ query: '', keys: [] })
  const query = search.trim().toLowerCase()
  const visibleIds = new Set(items.filter((item) => !query || items.some((node) => getCategoryDescendantIds(items, item.id).has(node.id) && node.name.toLowerCase().includes(query))).map((item) => item.id))
  const searchKeys = items.filter((item) => visibleIds.has(item.id) && items.some((child) => child.parentId === item.id && visibleIds.has(child.id))).map((item) => item.id)
  const expandAncestors = (id: string) => {
    const chain = new Set<string>()
    let current = items.find((item) => item.id === id)
    while (current && !chain.has(current.id)) {
      chain.add(current.id)
      current = items.find((item) => item.id === current!.parentId)
    }
    setExpandedKeys((keys) => [...new Set([...keys, ...chain])])
  }
  const startChildCreate = (id: string) => {
    expandAncestors(id)
    onSearchChange('')
    onRenameCancel()
    onChildCreate?.(id)
  }
  const saveChild = () => {
    if (!canCreate || disabled || !createParentId) return
    expandAncestors(createParentId)
    onCreate()
  }
  let editorKey = '__admin-category-child-editor__'
  while (items.some((item) => item.id === editorKey)) editorKey += '_'
  const visited = new Set<string>()
  const buildNode = (item: AdminCategoryItem): TreeDataNode[] => {
    if (visited.has(item.id) || !visibleIds.has(item.id)) return []
    visited.add(item.id)
    const children = items.filter((child) => child.parentId === item.id).flatMap(buildNode)
    if (createParentId === item.id) children.unshift({
      key: editorKey,
      selectable: false,
      isLeaf: true,
      title: <div className="common-phrase-management__category-edit" onClick={(event) => event.stopPropagation()} onDoubleClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
        <Input key={item.id} autoFocus aria-label={`New subcategory under ${item.name}`} placeholder="New subcategory" disabled={disabled} maxLength={maxNameLength} value={newName} onChange={(event) => onNewNameChange(event.target.value)} onPressEnter={saveChild} onKeyDown={(event) => { if (event.key === 'Escape') onCreateParentReset?.() }} />
        <button aria-label="Save subcategory" title="Save" disabled={!canCreate || disabled} type="button" onClick={saveChild}><CheckOutlined /></button>
        <button aria-label="Cancel subcategory" title="Cancel" disabled={disabled} type="button" onClick={onCreateParentReset}><CloseOutlined /></button>
      </div>,
    })
    return [{
      key: item.id,
      icon: <FolderOutlined />,
      children,
      title: renameId === item.id ? <div className="common-phrase-management__category-edit" onClick={(event) => event.stopPropagation()} onDoubleClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
        <Input autoFocus aria-label={`Rename ${item.name}`} disabled={disabled} maxLength={maxNameLength} value={renameName} onChange={(event) => onRenameNameChange(event.target.value)} onPressEnter={onRenameSave} onKeyDown={(event) => { if (event.key === 'Escape') onRenameCancel() }} />
        <button aria-label="Save category name" title="Save" disabled={disabled} type="button" onClick={onRenameSave}><CheckOutlined /></button>
        <button aria-label="Cancel category name" title="Cancel" disabled={disabled} type="button" onClick={onRenameCancel}><CloseOutlined /></button>
      </div> : <div className="admin-category-hierarchy__title">
        <span className="admin-category-hierarchy__name" title={item.name}>{item.name}</span><em>{item.count}</em>
        <span className="admin-category-hierarchy__actions" onClick={(event) => event.stopPropagation()} onDoubleClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
          <Dropdown trigger={['click']} disabled={disabled} menu={{ items: [
            { key: 'add', label: 'Add subcategory', icon: <FolderAddOutlined />, disabled: disabled || !onChildCreate || getCategoryDepth(items, item.id) >= maxDepth },
            { key: 'rename', label: 'Rename', icon: <EditOutlined />, disabled },
            { key: 'delete', label: <span title={item.deleteTitle}>{'Delete'}</span>, icon: <DeleteOutlined />, disabled: disabled || item.deleteDisabled },
          ], onClick: ({ key, domEvent }) => {
            domEvent.stopPropagation()
            if (key === 'add') startChildCreate(item.id)
            else if (key === 'rename') { onCreateParentReset?.(); onRenameStart(item.id) }
            else if (key === 'delete') onDelete(item.id)
          } }}>
            <button type="button" disabled={disabled} aria-label={`Actions for ${item.name}`} title="Category actions"><EllipsisOutlined /></button>
          </Dropdown>
        </span>
      </div>,
    }]
  }
  const treeData = hierarchy ? items.filter((item) => !item.parentId || !items.some((node) => node.id === item.parentId)).flatMap(buildNode) : []
  const onExpand: TreeProps['onExpand'] = (keys) => {
    if (query) setSearchExpansion({ query, keys })
    else setExpandedKeys(keys)
  }
  return <BaseCard compact className={hierarchy ? 'common-phrase-management__categories admin-category-hierarchy' : 'common-phrase-management__categories'}>
    <div className="common-phrase-management__category-search">
      <Input allowClear disabled={disabled} placeholder="Search category" value={search} onChange={(event) => onSearchChange(event.target.value)} />
    </div>
    <button className={['common-phrase-management__category-item', selectedId === allId ? 'is-selected' : ''].filter(Boolean).join(' ')} disabled={disabled} type="button" onClick={() => onSelect(allId)}>
      <span>All Categories</span><em>{totalCount}</em>
    </button>
    <div className="common-phrase-management__category-list">
      {hierarchy ? <Tree blockNode showIcon disabled={disabled} treeData={treeData} selectedKeys={selectedId === allId ? [] : [selectedId]} expandedKeys={query ? searchExpansion.query === query ? searchExpansion.keys : searchKeys : expandedKeys} autoExpandParent={false} onExpand={onExpand} onSelect={(_, { node }) => { if (node.selectable !== false) onSelect(String(node.key)) }} /> : items.map((item) => <div className={['common-phrase-management__category-row', selectedId === item.id ? 'is-selected' : ''].filter(Boolean).join(' ')} key={item.id}>
        {renameId === item.id ? <div className="common-phrase-management__category-edit">
          <Input autoFocus disabled={disabled} maxLength={maxNameLength} value={renameName} onChange={(event) => onRenameNameChange(event.target.value)} onPressEnter={onRenameSave} />
          <button aria-label="Save category name" title="Save" disabled={disabled} type="button" onClick={onRenameSave}><CheckOutlined /></button>
          <button aria-label="Cancel category name" title="Cancel" disabled={disabled} type="button" onClick={onRenameCancel}><CloseOutlined /></button>
        </div> : <>
          <button className="common-phrase-management__category-main" disabled={disabled} type="button" onClick={() => onSelect(item.id)}><span>{item.name}</span><em>{item.count}</em></button>
          <div className="common-phrase-management__category-actions">
            <button aria-label={`Rename ${item.name}`} title="Rename" disabled={disabled} type="button" onClick={() => onRenameStart(item.id)}><EditOutlined /></button>
            <button aria-label={`Delete ${item.name}`} title={item.deleteTitle ?? 'Delete'} disabled={disabled || item.deleteDisabled} type="button" onClick={() => onDelete(item.id)}><DeleteOutlined /></button>
          </div>
        </>}
      </div>)}
    </div>
    {(!hierarchy || !createParentId) && <div className="common-phrase-management__category-create">
      <Input disabled={disabled} maxLength={maxNameLength} placeholder="New category" value={newName} onChange={(event) => onNewNameChange(event.target.value)} onPressEnter={() => { if (canCreate && !disabled) onCreate() }} />
      <BaseButton disabled={!canCreate || disabled} icon={<FolderAddOutlined />} variant="primary" onClick={onCreate}>Add</BaseButton>
    </div>}
  </BaseCard>
}
