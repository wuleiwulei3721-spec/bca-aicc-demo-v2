import { useMemo, useState } from 'react'
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EnterOutlined,
  PlusOutlined,
  RightOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { Input } from 'antd'
import { BaseButton } from '../../../components'
import type {
  LiveChat2QuickReplyGroup,
  LiveChat2QuickReplyPhrase,
  LiveChat2QuickReplyScope,
} from './liveChat2QuickReplies'

interface LiveChat2QuickRepliesPanelProps {
  groups: LiveChat2QuickReplyGroup[]
  onGroupsChange: (groups: LiveChat2QuickReplyGroup[]) => void
  onInsertPhrase: (text: string) => void
}

interface PhraseFormState {
  code: string
  error: string
  groupId: string
  mode: 'create' | 'edit'
  phraseId?: string
  text: string
}

const myScope: LiveChat2QuickReplyScope = 'my'
const publicScope: LiveChat2QuickReplyScope = 'public'

function createQuickReplyId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000)}`
}

function phraseMatchesSearch(
  phrase: LiveChat2QuickReplyPhrase,
  normalizedSearch: string,
) {
  if (!normalizedSearch) {
    return true
  }

  return [phrase.code, phrase.text].some((value) =>
    value.toLowerCase().includes(normalizedSearch),
  )
}

function getPhraseValidationError({
  code,
  groups,
  groupId,
  phraseId,
  text,
}: {
  code: string
  groups: LiveChat2QuickReplyGroup[]
  groupId: string
  phraseId?: string
  text: string
}) {
  const normalizedCode = code.trim()
  const normalizedText = text.trim()
  const targetGroup = groups.find((group) => group.groupId === groupId)

  if (!targetGroup || targetGroup.scope !== myScope) {
    return 'My phrases only.'
  }

  if (!normalizedCode) {
    return 'Code is required.'
  }

  if (!/^[a-z0-9]+$/i.test(normalizedCode)) {
    return 'Use letters or numbers only.'
  }

  if (!normalizedText) {
    return 'Phrase is required.'
  }

  const isDuplicateCode = targetGroup.phrases.some(
    (phrase) =>
      phrase.id !== phraseId &&
      phrase.code.toLowerCase() === normalizedCode.toLowerCase(),
  )

  return isDuplicateCode ? 'Code already exists in this group.' : ''
}

export function LiveChat2QuickRepliesPanel({
  groups,
  onGroupsChange,
  onInsertPhrase,
}: LiveChat2QuickRepliesPanelProps) {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [expandedSections, setExpandedSections] = useState({
    my: true,
    public: true,
  })
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  )
  const [isCreatingGroup, setIsCreatingGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null)
  const [editingGroupName, setEditingGroupName] = useState('')
  const [phraseForm, setPhraseForm] = useState<PhraseFormState | null>(null)
  const normalizedSearch = searchKeyword.trim().toLowerCase()
  const groupsByScope = useMemo(
    () => ({
      my: groups.filter((group) => group.scope === myScope),
      public: groups.filter((group) => group.scope === publicScope),
    }),
    [groups],
  )

  const handleCreateGroup = () => {
    const groupName = newGroupName.trim()

    if (!groupName) {
      return
    }

    const groupId = createQuickReplyId('my-group')

    onGroupsChange([
      ...groups,
      {
        groupId,
        groupName,
        phrases: [],
        scope: myScope,
      },
    ])
    setExpandedGroups((current) => ({ ...current, [groupId]: true }))
    setNewGroupName('')
    setIsCreatingGroup(false)
  }

  const handleRenameGroup = (groupId: string) => {
    const groupName = editingGroupName.trim()

    if (!groupName) {
      return
    }

    onGroupsChange(
      groups.map((group) =>
        group.groupId === groupId && group.scope === myScope
          ? { ...group, groupName }
          : group,
      ),
    )
    setEditingGroupId(null)
    setEditingGroupName('')
  }

  const handleDeleteGroup = (groupId: string) => {
    onGroupsChange(
      groups.filter(
        (group) => group.groupId !== groupId || group.scope !== myScope,
      ),
    )
    if (phraseForm?.groupId === groupId) {
      setPhraseForm(null)
    }
  }

  const isGroupExpanded = (groupId: string) =>
    expandedGroups[groupId] ?? true

  const toggleGroupExpanded = (groupId: string) => {
    setExpandedGroups((current) => ({
      ...current,
      [groupId]: !(current[groupId] ?? true),
    }))
  }

  const handleSubmitPhrase = () => {
    if (!phraseForm) {
      return
    }

    const error = getPhraseValidationError({
      code: phraseForm.code,
      groups,
      groupId: phraseForm.groupId,
      phraseId: phraseForm.phraseId,
      text: phraseForm.text,
    })

    if (error) {
      setPhraseForm({ ...phraseForm, error })
      return
    }

    const nextPhrase = {
      code: phraseForm.code.trim(),
      id: phraseForm.phraseId ?? createQuickReplyId('phrase'),
      text: phraseForm.text.trim(),
    }

    onGroupsChange(
      groups.map((group) => {
        if (group.groupId !== phraseForm.groupId || group.scope !== myScope) {
          return group
        }

        if (phraseForm.mode === 'edit') {
          return {
            ...group,
            phrases: group.phrases.map((phrase) =>
              phrase.id === phraseForm.phraseId ? nextPhrase : phrase,
            ),
          }
        }

        return {
          ...group,
          phrases: [...group.phrases, nextPhrase],
        }
      }),
    )
    setPhraseForm(null)
  }

  const handleDeletePhrase = (groupId: string, phraseId: string) => {
    onGroupsChange(
      groups.map((group) =>
        group.groupId === groupId && group.scope === myScope
          ? {
              ...group,
              phrases: group.phrases.filter((phrase) => phrase.id !== phraseId),
            }
          : group,
      ),
    )
    if (phraseForm?.phraseId === phraseId) {
      setPhraseForm(null)
    }
  }

  const renderPhraseForm = (groupId: string) => {
    if (!phraseForm || phraseForm.groupId !== groupId) {
      return null
    }

    return (
      <div className="livechat2-quick-reply-panel__phrase-form">
        <Input
          aria-label="Quick reply code"
          placeholder="Code"
          size="small"
          value={phraseForm.code}
          onChange={(event) =>
            setPhraseForm({
              ...phraseForm,
              code: event.target.value,
              error: '',
            })
          }
          onPressEnter={handleSubmitPhrase}
        />
        <Input.TextArea
          aria-label="Quick reply phrase"
          autoSize={{ maxRows: 4, minRows: 2 }}
          placeholder="Phrase"
          size="small"
          value={phraseForm.text}
          onChange={(event) =>
            setPhraseForm({
              ...phraseForm,
              error: '',
              text: event.target.value,
            })
          }
        />
        {phraseForm.error && <em>{phraseForm.error}</em>}
        <div>
          <BaseButton
            icon={<CheckOutlined />}
            size="small"
            type="primary"
            variant="primary"
            onClick={handleSubmitPhrase}
          />
          <BaseButton
            icon={<CloseOutlined />}
            size="small"
            variant="secondary"
            onClick={() => setPhraseForm(null)}
          />
        </div>
      </div>
    )
  }

  const renderSection = (
    scope: LiveChat2QuickReplyScope,
    title: string,
  ) => {
    const scopeGroups = groupsByScope[scope]
    const visibleGroups = scopeGroups
      .map((group) => ({
        ...group,
        phrases: group.phrases.filter((phrase) =>
          phraseMatchesSearch(phrase, normalizedSearch),
        ),
      }))
      .filter((group) => !normalizedSearch || group.phrases.length > 0)
    const isExpanded = expandedSections[scope]
    const isMySection = scope === myScope

    return (
      <section className="livechat2-quick-reply-panel__section">
        <header className="livechat2-quick-reply-panel__section-header">
          <button
            aria-expanded={isExpanded}
            className="livechat2-quick-reply-panel__section-toggle"
            type="button"
            onClick={() =>
              setExpandedSections((current) => ({
                ...current,
                [scope]: !current[scope],
              }))
            }
          >
            {isExpanded ? <DownOutlined /> : <RightOutlined />}
            <strong>{title}</strong>
          </button>
          {isMySection && (
            <button
              aria-label="Add quick reply group"
              className="livechat2-quick-reply-panel__section-add"
              title="Add group"
              type="button"
              onClick={() => {
                setExpandedSections((current) => ({ ...current, my: true }))
                setIsCreatingGroup(true)
              }}
            >
              <PlusOutlined />
            </button>
          )}
        </header>

        {isExpanded && (
          <div className="livechat2-quick-reply-panel__section-body">
            {isMySection && isCreatingGroup && (
              <div className="livechat2-quick-reply-panel__group-create">
                <Input
                  autoFocus
                  aria-label="New group name"
                  placeholder="Group name"
                  size="small"
                  value={newGroupName}
                  onChange={(event) => setNewGroupName(event.target.value)}
                  onPressEnter={handleCreateGroup}
                />
                <button
                  aria-label="Save group"
                  type="button"
                  onClick={handleCreateGroup}
                >
                  <CheckOutlined />
                </button>
                <button
                  aria-label="Cancel group"
                  type="button"
                  onClick={() => {
                    setIsCreatingGroup(false)
                    setNewGroupName('')
                  }}
                >
                  <CloseOutlined />
                </button>
              </div>
            )}

            {visibleGroups.length > 0 ? (
              visibleGroups.map((group) => (
                <article
                  className="livechat2-quick-reply-panel__group"
                  key={group.groupId}
                >
                  <header>
                    {editingGroupId === group.groupId ? (
                      <div className="livechat2-quick-reply-panel__group-edit">
                        <Input
                          autoFocus
                          aria-label="Edit group name"
                          size="small"
                          value={editingGroupName}
                          onChange={(event) =>
                            setEditingGroupName(event.target.value)
                          }
                          onPressEnter={() => handleRenameGroup(group.groupId)}
                        />
                        <button
                          aria-label="Save group name"
                          type="button"
                          onClick={() => handleRenameGroup(group.groupId)}
                        >
                          <CheckOutlined />
                        </button>
                        <button
                          aria-label="Cancel group edit"
                          type="button"
                          onClick={() => {
                            setEditingGroupId(null)
                            setEditingGroupName('')
                          }}
                        >
                          <CloseOutlined />
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          aria-expanded={isGroupExpanded(group.groupId)}
                          className="livechat2-quick-reply-panel__group-toggle"
                          type="button"
                          onClick={() => toggleGroupExpanded(group.groupId)}
                        >
                          {isGroupExpanded(group.groupId) ? (
                            <DownOutlined />
                          ) : (
                            <RightOutlined />
                          )}
                          <strong>{group.groupName}</strong>
                        </button>
                        {isMySection && (
                          <div className="livechat2-quick-reply-panel__group-actions">
                            <button
                              aria-label={`Add phrase to ${group.groupName}`}
                              title="Add phrase"
                              type="button"
                              onClick={() => {
                                setExpandedGroups((current) => ({
                                  ...current,
                                  [group.groupId]: true,
                                }))
                                setPhraseForm({
                                  code: '',
                                  error: '',
                                  groupId: group.groupId,
                                  mode: 'create',
                                  text: '',
                                })
                              }}
                            >
                              <PlusOutlined />
                            </button>
                            <button
                              aria-label={`Edit ${group.groupName}`}
                              title="Edit group"
                              type="button"
                              onClick={() => {
                                setEditingGroupId(group.groupId)
                                setEditingGroupName(group.groupName)
                              }}
                            >
                              <EditOutlined />
                            </button>
                            <button
                              aria-label={`Delete ${group.groupName}`}
                              title="Delete group"
                              type="button"
                              onClick={() => handleDeleteGroup(group.groupId)}
                            >
                              <DeleteOutlined />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </header>

                  {isGroupExpanded(group.groupId) && (
                    <>
                      {renderPhraseForm(group.groupId)}

                      <div className="livechat2-quick-reply-panel__phrases">
                        {group.phrases.length > 0 ? (
                          group.phrases.map((phrase) => (
                            <div
                              className="livechat2-quick-reply-panel__phrase"
                              key={phrase.id}
                            >
                              <button
                                className="livechat2-quick-reply-panel__phrase-main"
                                type="button"
                                onClick={() => onInsertPhrase(phrase.text)}
                              >
                                <strong>{phrase.code}</strong>
                                <span>{phrase.text}</span>
                              </button>
                              {isMySection && (
                                <div className="livechat2-quick-reply-panel__phrase-actions">
                                  <button
                                    aria-label={`Insert ${phrase.code}`}
                                    title="Insert"
                                    type="button"
                                    onClick={() => onInsertPhrase(phrase.text)}
                                  >
                                    <EnterOutlined />
                                  </button>
                                  <button
                                    aria-label={`Edit ${phrase.code}`}
                                    title="Edit phrase"
                                    type="button"
                                    onClick={() =>
                                      setPhraseForm({
                                        code: phrase.code,
                                        error: '',
                                        groupId: group.groupId,
                                        mode: 'edit',
                                        phraseId: phrase.id,
                                        text: phrase.text,
                                      })
                                    }
                                  >
                                    <EditOutlined />
                                  </button>
                                  <button
                                    aria-label={`Delete ${phrase.code}`}
                                    title="Delete phrase"
                                    type="button"
                                    onClick={() =>
                                      handleDeletePhrase(
                                        group.groupId,
                                        phrase.id,
                                      )
                                    }
                                  >
                                    <DeleteOutlined />
                                  </button>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="livechat2-quick-reply-panel__empty">
                            No phrases
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </article>
              ))
            ) : (
              <div className="livechat2-quick-reply-panel__empty">
                No phrases found
              </div>
            )}
          </div>
        )}
      </section>
    )
  }

  return (
    <aside
      aria-label="Quick replies"
      className="livechat2-quick-reply-panel"
    >
      <div className="livechat2-quick-reply-panel__search">
        <Input
          allowClear
          aria-label="Search quick replies"
          placeholder="Search code or keyword"
          prefix={<SearchOutlined />}
          size="small"
          value={searchKeyword}
          onChange={(event) => setSearchKeyword(event.target.value)}
        />
      </div>
      <div className="livechat2-quick-reply-panel__content">
        {renderSection(myScope, 'My Phrases')}
        {renderSection(publicScope, 'Public Phrases')}
      </div>
    </aside>
  )
}
