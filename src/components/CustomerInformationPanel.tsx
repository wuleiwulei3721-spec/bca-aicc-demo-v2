import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  CheckOutlined,
  MailOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { Tooltip } from 'antd'
import type {
  CustomerInformation,
  CustomerProfile,
  VerificationStatus,
} from '../types'
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
  hideVerificationStatus?: boolean
  onOpenCallFlow?: () => void
  onOpenSpecialHandling?: () => void
  onRequestOutbound?: () => void
  onSendEmail?: () => void
  onStartOutbound?: () => void
  onVerify?: () => void
  outboundDisabled?: boolean
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

function customerSegmentationLabel(profile: CustomerProfile) {
  if (profile.segmentation?.trim()) {
    return profile.segmentation.trim()
  }

  if (!profile.customerType || profile.customerType === 'Guest') {
    return null
  }

  if (profile.customerType === 'Priority Customer') {
    return 'Prioritas - Upper Mass'
  }

  return profile.customerType
}

function formatPhoneNumber(phoneNumber: string) {
  const value = phoneNumber.trim()

  if (!value || value === '-') {
    return value
  }

  if (value.startsWith('+62')) {
    return value.slice(1)
  }

  if (value.startsWith('0')) {
    return `62 ${value.slice(1)}`
  }

  return value
}

function emailVerificationLabel(
  profile: CustomerProfile,
  verificationStatus: VerificationStatus,
) {
  const value = profile.email.trim()

  if (!value || value === '-') {
    return null
  }

  return (
    profile.emailVerificationStatus ??
    (verificationStatus === 'Verified' ? 'Verified' : 'Unverified')
  )
}

export function CustomerInformationPanel({
  accessChannelNode,
  accessRouteHintNode,
  className,
  customer,
  headerExtra,
  hideVerificationStatus = false,
  onOpenCallFlow,
  onOpenSpecialHandling,
  onRequestOutbound,
  onSendEmail,
  onStartOutbound,
  onVerify,
  outboundDisabled = false,
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
  const phoneNumber = formatPhoneNumber(profile.phoneNumber)
  const emailAddress = profile.email.trim()
  const emailStatus = emailVerificationLabel(profile, status)
  const customerNumber = profile.cisNumber.trim()
  const segmentationLabel = customerSegmentationLabel(profile)
  const shouldShowOutboundAction = outboundRequestStatus !== 'idle'
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
          <div className="aicc-customer-info__main">
            <div className="aicc-customer-info__name">{profile.name}</div>
            <div className="aicc-customer-info__facts">
              <div
                className={[
                  'aicc-customer-info__phone-row',
                  `aicc-customer-info__phone-row--${outboundRequestStatus}`,
                  shouldShowOutboundAction &&
                    'aicc-customer-info__phone-row--action-visible',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className="aicc-customer-info__fact-icon">
                  <PhoneIcon />
                </span>
                <span className="aicc-customer-info__phone-value">
                  {phoneNumber}
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
                    disabled={
                      outboundRequestStatus === 'requesting' ||
                      outboundDisabled ||
                      !handleOutboundClick
                    }
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
              <div className="aicc-customer-info__fact-row">
                <span className="aicc-customer-info__fact-icon">
                  <MailOutlined />
                </span>
                {onSendEmail ? (
                  <button
                    className="aicc-customer-info__fact-action"
                    title="Send email"
                    type="button"
                    onClick={onSendEmail}
                  >
                    <span className="aicc-customer-info__email-content">
                      <span className="aicc-customer-info__email-address">
                        {emailAddress}
                      </span>
                      {emailStatus && (
                        <span
                          className={`aicc-customer-info__email-verification aicc-customer-info__email-verification--${emailStatus.toLowerCase()}`}
                        >
                          {emailStatus}
                        </span>
                      )}
                    </span>
                  </button>
                ) : (
                  <span className="aicc-customer-info__fact-value aicc-customer-info__email-content">
                    <span className="aicc-customer-info__email-address">
                      {emailAddress}
                    </span>
                    {emailStatus && (
                      <span
                        className={`aicc-customer-info__email-verification aicc-customer-info__email-verification--${emailStatus.toLowerCase()}`}
                      >
                        {emailStatus}
                      </span>
                    )}
                  </span>
                )}
              </div>
              <div className="aicc-customer-info__fact-row">
                <span
                  aria-label="CIS"
                  className="aicc-customer-info__fact-icon aicc-customer-info__fact-icon--sic"
                  title="CIS"
                >
                  CIS
                </span>
                <span className="aicc-customer-info__fact-value">
                  {customerNumber}
                </span>
              </div>
            </div>
            {(segmentationLabel || onOpenSpecialHandling) && (
              <div className="aicc-customer-info__profile-meta">
                {segmentationLabel && (
                  <div className="aicc-customer-info__fact-row aicc-customer-info__fact-row--segmentation">
                    <span className="aicc-customer-info__fact-icon">
                      <TeamOutlined />
                    </span>
                    <span className="aicc-customer-info__fact-value">
                      {segmentationLabel}
                    </span>
                  </div>
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
            )}
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
          {!hideVerificationStatus && verificationFailureReason ? (
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
          ) : !hideVerificationStatus ? (
            <StatusBadge
              className="aicc-customer-info__verification"
              label={badge.label}
              size="small"
              status={badge.status}
            />
          ) : null}
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
