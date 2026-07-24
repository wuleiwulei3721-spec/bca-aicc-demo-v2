export const CRM_CIS_REQUEST_TYPE = 'bank1-aicc.crm.request-cis'
export const CRM_CIS_RESPONSE_TYPE = 'bank1-crm.customer-cis'
export const CRM_CIS_MESSAGE_VERSION = 1

export interface CrmCisRequestMessage {
  correlationId: string
  type: typeof CRM_CIS_REQUEST_TYPE
  version: typeof CRM_CIS_MESSAGE_VERSION
}

export interface CrmCisResponseMessage {
  cisNumber: string
  correlationId: string
  type: typeof CRM_CIS_RESPONSE_TYPE
  version: typeof CRM_CIS_MESSAGE_VERSION
}

function isMessageRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function isCrmCisRequestMessage(
  value: unknown,
): value is CrmCisRequestMessage {
  return (
    isMessageRecord(value) &&
    value.type === CRM_CIS_REQUEST_TYPE &&
    value.version === CRM_CIS_MESSAGE_VERSION &&
    typeof value.correlationId === 'string' &&
    value.correlationId.trim().length > 0
  )
}

export function isCrmCisResponseMessage(
  value: unknown,
): value is CrmCisResponseMessage {
  return (
    isMessageRecord(value) &&
    value.type === CRM_CIS_RESPONSE_TYPE &&
    value.version === CRM_CIS_MESSAGE_VERSION &&
    typeof value.correlationId === 'string' &&
    value.correlationId.trim().length > 0 &&
    typeof value.cisNumber === 'string' &&
    value.cisNumber.trim().length > 0
  )
}

export function createCrmCisRequest(correlationId: string): CrmCisRequestMessage {
  return {
    correlationId,
    type: CRM_CIS_REQUEST_TYPE,
    version: CRM_CIS_MESSAGE_VERSION,
  }
}

export function createCrmCisResponse(
  correlationId: string,
  cisNumber: string,
): CrmCisResponseMessage {
  return {
    cisNumber,
    correlationId,
    type: CRM_CIS_RESPONSE_TYPE,
    version: CRM_CIS_MESSAGE_VERSION,
  }
}
