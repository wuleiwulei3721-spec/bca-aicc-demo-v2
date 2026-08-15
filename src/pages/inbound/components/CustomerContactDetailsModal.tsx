import { BaseButton, BaseModal } from '../../../components'
import type { CustomerCrmContacts } from '../../../types'
import { ContactChannelIcon } from './ContactChannelIcon'
import {
  CUSTOMER_CONTACT_DETAIL_SECTIONS,
} from './contactManagementData'

interface CustomerContactDetailsModalProps {
  contacts?: CustomerCrmContacts
  open: boolean
  onClose: () => void
}

export function CustomerContactDetailsModal({
  contacts,
  open,
  onClose,
}: CustomerContactDetailsModalProps) {
  return (
    <BaseModal
      centered
      className="inbound-contact-details-modal"
      kind="detail"
      open={open}
      title="All Contact Details"
      width={680}
      onCancel={onClose}
    >
      <div className="inbound-contact-details">
        <div className="inbound-contact-details__sections">
          {CUSTOMER_CONTACT_DETAIL_SECTIONS.map((section) => (
            <section
              className="aicc-modal-section inbound-contact-details__section"
              key={section.title}
            >
              <div className="aicc-modal-section__header">
                <span className="aicc-modal-section__title">
                  {section.title}
                </span>
              </div>
              <div className="inbound-contact-details__list">
                {section.types.map((type) => {
                  const values = contacts?.[type] ?? []

                  return (
                    <div className="inbound-contact-details__row" key={type}>
                      <span className="inbound-contact-details__label">
                        <ContactChannelIcon type={type} />
                        <strong>{type}</strong>
                      </span>
                      <div className="inbound-contact-details__values">
                        {values.length > 0 ? (
                          values.map((value) => (
                            <span
                              className="inbound-contact-details__value"
                              key={`${type}-${value}`}
                            >
                              {value}
                            </span>
                          ))
                        ) : (
                          <span className="inbound-contact-details__empty">
                            -
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>

        <footer className="aicc-modal-footer inbound-contact-details__footer">
          <BaseButton type="primary" onClick={onClose}>
            Close
          </BaseButton>
        </footer>
      </div>
    </BaseModal>
  )
}
