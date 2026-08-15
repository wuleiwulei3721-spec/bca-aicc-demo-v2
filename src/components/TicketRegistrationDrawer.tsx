import { Checkbox, Input, Select } from 'antd'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BaseButton } from './BaseButton'
import { BaseModal } from './BaseModal'

export interface TicketRegistrationDraft {
  product: string[]
  category: string[]
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

const productOptions = [
  'Credit Card',
  'Debit Card',
  'Deposit Account',
  'BankApp',
  'Loan',
  'Investment',
]

const categoryOptions = [
  'Activation',
  'Card Replacement',
  'Transaction Inquiry',
  'Service Request',
  'Complaint',
  'Follow-up',
]

const emptyDraft = (): TicketRegistrationDraft => ({
  category: [],
  note: '',
  product: [],
  summary: '',
})

function generatedDraft(index: number, contextLabel?: string): TicketRegistrationDraft {
  const product = productOptions[index % productOptions.length]
  const category = categoryOptions[index % categoryOptions.length]
  const context = contextLabel?.trim() || 'the current customer interaction'

  return {
    category: [category],
    note: 'Review the request with the customer and complete the required follow-up.',
    product: [product],
    summary: `Customer contacted BANK 1 regarding ${context}. A ${category.toLowerCase()} request for ${product} has been prepared for CRM follow-up.`,
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
    if (draft.product.length === 0) {
      setError('product')
      return
    }

    if (draft.category.length === 0) {
      setError('category')
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
      category: [...draft.category],
      note: draft.note.trim(),
      product: [...draft.product],
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
          <BaseButton onClick={onClose}>Cancel</BaseButton>
          <BaseButton variant="primary" onClick={confirm}>
            Confirm
          </BaseButton>
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
            maxTagCount={Number.MAX_SAFE_INTEGER}
            mode="multiple"
            optionFilterProp="label"
            optionRender={(option) => (
              <span className="aicc-ticket-select-option">
                <Checkbox
                  checked={draft.category.includes(String(option.value))}
                  onChange={() => undefined}
                />
                <span>{option.label}</span>
              </span>
            )}
            options={categoryOptions.map((value) => ({ label: value, value }))}
            placeholder="Select category"
            showSearch
            value={draft.category}
            onChange={(category) => updateDraft({ category })}
          />
          {error === 'category' && (
            <small className="aicc-ticket-form__field-error">
              Select at least one Category.
            </small>
          )}
        </section>
        <section>
          <span>Product</span>
          <Select
            className="aicc-ticket-form__select"
            maxTagCount={Number.MAX_SAFE_INTEGER}
            mode="multiple"
            optionFilterProp="label"
            optionRender={(option) => (
              <span className="aicc-ticket-select-option">
                <Checkbox
                  checked={draft.product.includes(String(option.value))}
                  onChange={() => undefined}
                />
                <span>{option.label}</span>
              </span>
            )}
            options={productOptions.map((value) => ({ label: value, value }))}
            placeholder="Select product"
            showSearch
            value={draft.product}
            onChange={(product) => updateDraft({ product })}
          />
          {error === 'product' && (
            <small className="aicc-ticket-form__field-error">
              Select at least one Product.
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
            onChange={(event) => updateDraft({ summary: event.target.value })}
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
            value={draft.note}
            onChange={(event) => updateDraft({ note: event.target.value })}
          />
          {error === 'note' && (
            <small className="aicc-ticket-form__field-error">
              Note is required.
            </small>
          )}
        </label>
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
      </div>
    </BaseModal>
  )
}
