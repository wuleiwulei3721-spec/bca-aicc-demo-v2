import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import { useState } from 'react'
import { BaseButton, BaseModal } from '../../../components'
import {
  CONTACT_SECTIONS,
  CONTACT_TYPES,
  type ContactGroups,
  type ContactType,
} from './contactManagementData'

interface ContactManagementModalProps {
  contacts: ContactGroups
  open: boolean
  onCancel: () => void
  onSave: (contacts: ContactGroups) => void
}

const contactPlaceholders: Record<ContactType, string> = {
  Phone: '+62 21 0000 0000',
  WhatsApp: '+62 812 0000 0000',
  Haloapps: 'haloapps_id',
  Email: 'customer@email.com',
  Facebook: 'facebook.com/customer',
  Instagram: '@customer',
  X: '@customer',
  TikTok: '@customer',
  YouTube: 'youtube.com/@customer',
  'App Store': 'App Store review/profile',
  'Play Store': 'Play Store review/profile',
}

function createContactId(type: ContactType) {
  return `${type.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`
}

function cloneContacts(contacts: ContactGroups): ContactGroups {
  return CONTACT_TYPES.reduce((groups, type) => {
    groups[type] = contacts[type].map((contact) => ({ ...contact }))
    return groups
  }, {} as ContactGroups)
}

function sanitizeContacts(contacts: ContactGroups): ContactGroups {
  return CONTACT_TYPES.reduce((groups, type) => {
    groups[type] = contacts[type]
      .map((contact) => ({
        ...contact,
        value: contact.value.trim(),
      }))
      .filter((contact) => contact.value.length > 0)
    return groups
  }, {} as ContactGroups)
}

export function ContactManagementModal({
  contacts,
  open,
  onCancel,
  onSave,
}: ContactManagementModalProps) {
  const [draftContacts, setDraftContacts] = useState<ContactGroups>(() =>
    cloneContacts(contacts),
  )

  const addContact = (type: ContactType) => {
    setDraftContacts((current) => ({
      ...current,
      [type]: [
        ...current[type],
        {
          id: createContactId(type),
          value: '',
        },
      ],
    }))
  }

  const updateContact = (
    type: ContactType,
    contactId: string,
    value: string,
  ) => {
    setDraftContacts((current) => ({
      ...current,
      [type]: current[type].map((contact) =>
        contact.id === contactId ? { ...contact, value } : contact,
      ),
    }))
  }

  const deleteContact = (type: ContactType, contactId: string) => {
    setDraftContacts((current) => ({
      ...current,
      [type]: current[type].filter((contact) => contact.id !== contactId),
    }))
  }

  return (
    <BaseModal
      className="inbound-contact-management-modal"
      kind="detail"
      open={open}
      title="Contact Management"
      width={760}
      onCancel={onCancel}
    >
      <div className="inbound-contact-management">
        <div className="inbound-contact-management__sections">
          {CONTACT_SECTIONS.map((section) => (
            <section
              className="aicc-modal-section inbound-contact-management__section"
              key={section.title}
            >
              <div className="aicc-modal-section__header">
                <span className="aicc-modal-section__title">
                  {section.title}
                </span>
              </div>
              <div className="inbound-contact-management__grid">
                {section.types.map((type) => (
                  <section
                    className="inbound-contact-management__group"
                    key={type}
                  >
                    <header>
                      <strong>{type}</strong>
                      <button
                        aria-label={`Add ${type} contact`}
                        className="inbound-contact-management__add"
                        title={`Add ${type}`}
                        type="button"
                        onClick={() => addContact(type)}
                      >
                        <PlusOutlined />
                      </button>
                    </header>
                    <div className="inbound-contact-management__items">
                      {draftContacts[type].map((contact) => (
                        <div
                          className="inbound-contact-management__row"
                          key={contact.id}
                        >
                          <Input
                            placeholder={contactPlaceholders[type]}
                            size="small"
                            value={contact.value}
                            onChange={(event) =>
                              updateContact(
                                type,
                                contact.id,
                                event.target.value,
                              )
                            }
                          />
                          <button
                            aria-label={`Delete ${type} contact`}
                            className="inbound-contact-management__delete"
                            title="Delete"
                            type="button"
                            onClick={() => deleteContact(type, contact.id)}
                          >
                            <DeleteOutlined />
                          </button>
                        </div>
                      ))}
                      {draftContacts[type].length === 0 && (
                        <em className="inbound-contact-management__empty">
                          No contact added
                        </em>
                      )}
                    </div>
                  </section>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="aicc-modal-footer inbound-contact-management__footer">
          <BaseButton onClick={onCancel}>Cancel</BaseButton>
          <BaseButton
            type="primary"
            onClick={() => onSave(sanitizeContacts(draftContacts))}
          >
            Save
          </BaseButton>
        </footer>
      </div>
    </BaseModal>
  )
}
