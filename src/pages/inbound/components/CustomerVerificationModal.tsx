import {
  CheckOutlined,
  CloseOutlined,
  MinusOutlined,
} from '@ant-design/icons'
import { Progress, Space, Tooltip } from 'antd'
import { AppButton } from '../../../components'
import { verificationQuestions } from '../../../mock/inbound'
import type { VerificationQuestion, VerificationStatus } from '../../../types'

export type QuestionStepStatus = 'correct' | 'wrong' | 'skipped'

interface CustomerVerificationModalProps {
  activeQuestionIndex: number
  questionStatuses: Record<string, QuestionStepStatus>
  onQuestionAction: (
    question: VerificationQuestion,
    questionIndex: number,
    status: QuestionStepStatus,
  ) => void
  onFinish: (status: VerificationStatus) => void
}

export function CustomerVerificationModal({
  activeQuestionIndex,
  questionStatuses,
  onQuestionAction,
  onFinish,
}: CustomerVerificationModalProps) {
  const completedCount = Object.keys(questionStatuses).length

  return (
    <div className="inbound-verification-workflow">
      <div className="inbound-verification-workflow__summary">
        <div>
          <span>CRM Verification Step</span>
          <strong>
            {completedCount} / {verificationQuestions.length}
          </strong>
        </div>
        <Progress
          percent={Math.round(
            (completedCount / verificationQuestions.length) * 100,
          )}
          showInfo={false}
          size="small"
        />
      </div>

      <div className="inbound-verification-list">
        {verificationQuestions.map((question, index) => {
          const status = questionStatuses[question.id]
          const isActive = !status && index === activeQuestionIndex

          return (
            <div
              className={[
                'inbound-verification-list__row',
                isActive ? 'inbound-verification-list__row--active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              key={question.id}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div className="inbound-verification-list__content">
                <strong>{question.question}</strong>
                <em>{question.answer}</em>
              </div>
              <Space size={5} wrap={false}>
                <Tooltip title="Correct">
                  <AppButton
                    className={
                      status === 'correct'
                        ? 'inbound-verify-action inbound-verify-action--correct inbound-verify-action--selected'
                        : 'inbound-verify-action inbound-verify-action--correct'
                    }
                    icon={<CheckOutlined />}
                    size="small"
                    onClick={() => onQuestionAction(question, index, 'correct')}
                  />
                </Tooltip>
                <Tooltip title="Wrong">
                  <AppButton
                    className={
                      status === 'wrong'
                        ? 'inbound-verify-action inbound-verify-action--wrong inbound-verify-action--selected'
                        : 'inbound-verify-action inbound-verify-action--wrong'
                    }
                    icon={<CloseOutlined />}
                    size="small"
                    onClick={() => onQuestionAction(question, index, 'wrong')}
                  />
                </Tooltip>
                <AppButton
                  className={
                    status === 'skipped'
                      ? 'inbound-verify-action inbound-verify-action--skip inbound-verify-action--selected'
                      : 'inbound-verify-action inbound-verify-action--skip'
                  }
                  icon={<MinusOutlined />}
                  size="small"
                  onClick={() => onQuestionAction(question, index, 'skipped')}
                >
                  Skip
                </AppButton>
              </Space>
            </div>
          )
        })}
      </div>

      <div className="inbound-verification-modal__footer">
        <AppButton type="primary" onClick={() => onFinish('Verified')}>
          Verification Passed
        </AppButton>
        <AppButton danger onClick={() => onFinish('Verification Failed')}>
          Verification Failed
        </AppButton>
      </div>
    </div>
  )
}
