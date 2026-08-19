import { Input, Select } from 'antd'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  getProductsForTicketCategory,
  ticketCategoryProductOptions,
} from '../mock/ticketCategoryProducts'
import { BaseButton } from './BaseButton'
import { BaseModal } from './BaseModal'

export interface TicketRegistrationDraft {
  caseCategory: string
  product: string
  summary: string
  note: string
}

interface TicketRegistrationDrawerProps {
  contextLabel?: string
  open: boolean
  onClose: () => void
  onConfirm: (draft: TicketRegistrationDraft) => void
}

type TicketRegistrationField = keyof TicketRegistrationDraft

const emptyDraft = (): TicketRegistrationDraft => ({
  caseCategory: '',
  note: '',
  product: '',
  summary: '',
})

function generatedDraft(index: number, contextLabel?: string): TicketRegistrationDraft {
  const categoryOption =
    ticketCategoryProductOptions[index % ticketCategoryProductOptions.length]
  const product =
    categoryOption.products[index % categoryOption.products.length]
  const context = contextLabel?.trim() || 'the current customer interaction'

  return {
    caseCategory: categoryOption.category,
    note: 'Review the request with the customer and complete the required follow-up.',
    product,
    summary: `Customer contacted BANK 1 regarding ${context}. A ${categoryOption.category.toLowerCase()} request for ${product} has been prepared for CRM follow-up.`,
  }
}

export function TicketRegistrationDrawer({
  contextLabel,
  open,
  onClose,
  onConfirm,
}: TicketRegistrationDrawerProps) {
  const [draft, setDraft] = useState<TicketRegistrationDraft>(emptyDraft)
  const [error, setError] = useState<TicketRegistrationField | ''>('')
  const generationRef = useRef(0)
  const wasOpenRef = useRef(false)

  const generate = useCallback(() => {
    setDraft(generatedDraft(generationRef.current, contextLabel))
    generationRef.current += 1
    setError('')
  }, [contextLabel])

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      generate()
    }
    wasOpenRef.current = open
  }, [generate, open])

  const updateDraft = (patch: Partial<TicketRegistrationDraft>) => {
    setDraft((current) => ({ ...current, ...patch }))
    setError('')
  }

  const confirm = () => {
    if (!draft.caseCategory) {
      setError('caseCategory')
      return
    }

    if (!draft.product) {
      setError('product')
      return
    }

    if (!draft.summary.trim()) {
      setError('summary')
      return
    }

    if (!draft.note.trim()) {
      setError('note')
      return
    }

    onConfirm({
      caseCategory: draft.caseCategory,
      note: draft.note.trim(),
      product: draft.product,
      summary: draft.summary.trim(),
    })
    setDraft(emptyDraft())
    setError('')
  }

  return (
    <BaseModal
      destroyOnHidden
      className="aicc-ticket-modal"
      footer={
        <div className="aicc-ticket-modal__footer">
          <button
            className="aicc-ticket-form__generate"
            type="button"
            onClick={generate}
          >
            <span aria-hidden="true" className="aicc-ticket-form__sparkle">
              ✦
            </span>
            One-Click Generation
          </button>
          <div className="aicc-ticket-modal__actions">
            <BaseButton onClick={onClose}>Cancel</BaseButton>
            <BaseButton variant="primary" onClick={confirm}>
              Confirm
            </BaseButton>
          </div>
        </div>
      }
      kind="outbound"
      open={open}
      title="Ticket"
      width={480}
      wrapClassName="aicc-ticket-modal-wrap"
      onCancel={onClose}
    >
      <div className="aicc-ticket-form">
        <section>
          <span>Category</span>
          <Select
            className="aicc-ticket-form__select"
            optionFilterProp="label"
            options={ticketCategoryProductOptions.map(({ category }) => ({
              label: category,
              value: category,
            }))}
            placeholder="Select category"
            showSearch
            value={draft.caseCategory || undefined}
            onChange={(caseCategory) =>
              updateDraft({ caseCategory, product: '' })
            }
          />
          {error === 'caseCategory' && (
            <small className="aicc-ticket-form__field-error">
              Select a Category.
            </small>
          )}
        </section>
        <section>
          <span>Product</span>
          <Select
            className="aicc-ticket-form__select"
            disabled={!draft.caseCategory}
            optionFilterProp="label"
            options={getProductsForTicketCategory(draft.caseCategory).map(
              (product) => ({ label: product, value: product }),
            )}
            placeholder="Select product"
            showSearch
            value={draft.product || undefined}
            onChange={(product) => updateDraft({ product })}
          />
          {error === 'product' && (
            <small className="aicc-ticket-form__field-error">
              Select a Product.
            </small>
          )}
        </section>
        <label>
          <span>Summary</span>
          <Input.TextArea
            placeholder="Enter ticket summary"
            rows={5}
            maxLength={250}
            showCount
            value={draft.summary}
            onChange={(event) =>
              updateDraft({ summary: event.target.value.slice(0, 250) })
            }
          />
          {error === 'summary' && (
            <small className="aicc-ticket-form__field-error">
              Summary is required.
            </small>
          )}
        </label>
        <label>
          <span>Note</span>
          <Input.TextArea
            placeholder="Enter agent note"
            rows={5}
            maxLength={1000}
            showCount
            value={draft.note}
            onChange={(event) =>
              updateDraft({ note: event.target.value.slice(0, 1000) })
            }
          />
          {error === 'note' && (
            <small className="aicc-ticket-form__field-error">
              Note is required.
            </small>
          )}
        </label>
      </div>
    </BaseModal>
  )
}
