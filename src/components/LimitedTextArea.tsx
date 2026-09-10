import { Input } from 'antd'
import type { TextAreaProps } from 'antd/es/input'
import { clampLimitedChange } from './limitedInputUtils'

export interface LimitedTextAreaProps
  extends Omit<TextAreaProps, 'maxLength' | 'showCount'> {
  maxLength?: number
  showCount?: boolean
}

export function LimitedTextArea({
  maxLength = 2000,
  onChange,
  showCount = true,
  ...props
}: LimitedTextAreaProps) {
  return (
    <div className="aicc-limited-textarea">
      <Input.TextArea
        {...props}
        maxLength={maxLength}
        onChange={(event) => onChange?.(clampLimitedChange(event, maxLength))}
        showCount={showCount}
      />
    </div>
  )
}
