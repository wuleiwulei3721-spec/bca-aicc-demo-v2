import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  CheckOutlined,
  IdcardOutlined,
  MailOutlined,
} from '@ant-design/icons'
import { Avatar, Tooltip } from 'antd'
import type { CustomerInformation, VerificationStatus } from '../types'
import { BaseCard } from './BaseCard'
import { BaseButton } from './BaseButton'
import { PhoneIcon } from './PhoneIcon'
import { StatusBadge } from './StatusBadge'

export type CustomerOutboundRequestStatus =
  | 'idle'
  | 'requesting'
  | 'approved'

export interface CustomerInformationPanelProps {
  accessChannelNode?: ReactNode
  accessRouteHintNode?: ReactNode
  className?: string
  customer: CustomerInformation
  headerExtra?: ReactNode
  onOpenCallFlow?: () => void
  onOpenSpecialHandling?: () => void
  onRequestOutbound?: () => void
  onSendEmail?: () => void
  onStartOutbound?: () => void
  onVerify?: () => void
  outboundDisabledTitle?: string
  isDirectOutbound?: boolean
  outboundRequestStatus?: CustomerOutboundRequestStatus
  verifyButtonDisabled?: boolean
  verifyButtonLabel?: string
  verifyButtonTitle?: string
  verificationFailureReason?: string
  verificationStatus?: VerificationStatus
}

function verificationBadge(status: VerificationStatus) {
  if (status === 'Verified') {
    return { label: 'Verified', status: 'verified' as const }
  }

  if (status === 'Verification Failed') {
    return { label: 'Failed', status: 'failed' as const }
  }

  if (status === 'Verifying') {
    return { label: 'Verifying', status: 'warning' as const }
  }

  return { label: 'Unverified', status: 'warning' as const }
}

function customerLevelLabel(customerType: string) {
  if (!customerType || customerType === 'Regular Customer') {
    return null
  }

  if (customerType === 'Priority Customer') {
    return 'Priority'
  }

  return customerType
}

export function CustomerInformationPanel({
  accessChannelNode,
  accessRouteHintNode,
  className,
  customer,
  headerExtra,
  onOpenCallFlow,
  onOpenSpecialHandling,
  onRequestOutbound,
  onSendEmail,
  onStartOutbound,
  onVerify,
  outboundDisabledTitle,
  isDirectOutbound = false,
  outboundRequestStatus = 'idle',
  verifyButtonDisabled = false,
  verifyButtonLabel = 'Verify',
  verifyButtonTitle,
  verificationFailureReason,
  verificationStatus,
}: CustomerInformationPanelProps) {
  const [internalVerificationStatus] = useState(customer.verificationStatus)
  const status = verificationStatus ?? internalVerificationStatus
  const badge = verificationBadge(status)
  const { profile } = customer
  const outboundRequestLabel =
    outboundRequestStatus === 'requesting'
      ? 'Requesting...'
      : outboundRequestStatus === 'approved'
        ? 'Call'
        : isDirectOutbound
          ? 'Call'
          : 'Request Approval'
  const handleOutboundClick =
    outboundRequestStatus === 'approved'
      ? onStartOutbound
      : onRequestOutbound
  const levelLabel = customerLevelLabel(profile.customerType)
  const avatarSrc = profile.avatarUrl.trim() || undefined
  const defaultAccessChannelNode = (
    <span className="aicc-customer-info__channel-fallback">
      <span>{customer.accessChannel}</span>
      <span className="aicc-customer-info__channel-duration">
        <span aria-hidden="true">&middot;</span>
        {customer.accessDuration}
      </span>
    </span>
  )

  return (
    <BaseCard
      className={className}
      compact
      headerExtra={headerExtra}
      title="Customer Information"
      tone="highlight"
    >
      <div className="aicc-customer-info">
        <div className="aicc-customer-info__identity">
          <div className="aicc-customer-info__avatar-wrap">
            <Avatar
              className="aicc-customer-info__avatar"
              size={58}
              src={avatarSrc}
            >
              {profile.avatarInitials}
            </Avatar>
            {levelLabel && (
              <StatusBadge label={levelLabel} size="small" status="selected" />
            )}
            {onOpenSpecialHandling && (
              <button
                className="aicc-customer-info__special-handling"
                title="View special handling information"
                type="button"
                onClick={onOpenSpecialHandling}
              >
                Special Handling
              </button>
            )}
          </div>

          <div className="aicc-customer-info__main">
            <div className="aicc-customer-info__name">{profile.name}</div>
            <div className="aicc-customer-info__facts">
              <div
                className={[
                  'aicc-customer-info__phone-row',
                  `aicc-customer-info__phone-row--${outboundRequestStatus}`,
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className="aicc-customer-info__phone-value">
                  <PhoneIcon />
                  {profile.phoneNumber}
                </span>
                {(onRequestOutbound || onStartOutbound || outboundDisabledTitle) && (
                  <button
                    className={[
                      'aicc-customer-info__outbound-request',
                      `aicc-customer-info__outbound-request--${outboundRequestStatus}`,
                      isDirectOutbound &&
                        'aicc-customer-info__outbound-request--direct',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    disabled={outboundRequestStatus === 'requesting' || !handleOutboundClick}
                    aria-label={outboundRequestLabel}
                    title={outboundDisabledTitle}
                    type="button"
                    onClick={handleOutboundClick}
                  >
                    {outboundRequestStatus === 'approved' && <CheckOutlined />}
                    <span>{outboundRequestLabel}</span>
                  </button>
                )}
              </div>
              {onSendEmail ? (
                <button
                  className="aicc-customer-info__fact-action"
                  title="Send email"
                  type="button"
                  onClick={onSendEmail}
                >
                  <MailOutlined />
                  <span className="aicc-customer-info__email-value">
                    {profile.email}
                  </span>
                </button>
              ) : (
                <span className="aicc-customer-info__fact-static">
                  <MailOutlined />
                  <span className="aicc-customer-info__email-value">
                    {profile.email}
                  </span>
                </span>
              )}
              <span>
                <IdcardOutlined />
                {profile.cisNumber}
              </span>
            </div>
          </div>
        </div>

        <div className="aicc-customer-info__access-strip">
          <button
            className="aicc-customer-info__channel-action"
            disabled={!onOpenCallFlow}
            title="View call flow detail"
            type="button"
            onClick={onOpenCallFlow}
          >
            {accessChannelNode ?? defaultAccessChannelNode}
          </button>
          {verificationFailureReason ? (
            <Tooltip title={verificationFailureReason}>
              <span
                className="aicc-customer-info__verification"
                title={verificationFailureReason}
              >
                <StatusBadge
                  label={badge.label}
                  size="small"
                  status={badge.status}
                />
              </span>
            </Tooltip>
          ) : (
            <StatusBadge
              className="aicc-customer-info__verification"
              label={badge.label}
              size="small"
              status={badge.status}
            />
          )}
          {onVerify && (
            verifyButtonDisabled && verifyButtonTitle ? (
              <Tooltip title={verifyButtonTitle}>
                <span title={verifyButtonTitle}>
                  <BaseButton disabled size="small" type="primary">
                    {verifyButtonLabel}
                  </BaseButton>
                </span>
              </Tooltip>
            ) : (
              <BaseButton
                disabled={verifyButtonDisabled}
                size="small"
                title={verifyButtonTitle}
                type="primary"
                onClick={onVerify}
              >
                {verifyButtonLabel}
              </BaseButton>
            )
          )}
        </div>
        {accessRouteHintNode && (
          <div className="aicc-customer-info__route-hint">
            {accessRouteHintNode}
          </div>
        )}
      </div>
    </BaseCard>
  )
}
