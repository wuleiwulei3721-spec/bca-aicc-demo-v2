import { Input } from 'antd'
import type { InputProps } from 'antd/es/input'
import { clampLimitedChange } from './limitedInputUtils'

export interface LimitedInputProps
  extends Omit<InputProps, 'maxLength' | 'showCount'> {
  maxLength?: number
  showCount?: boolean
}

export function LimitedInput({
  maxLength = 2000,
  onChange,
  showCount = true,
  ...props
}: LimitedInputProps) {
  return (
    <div className="aicc-limited-input">
      <Input
        {...props}
        maxLength={maxLength}
        onChange={(event) => onChange?.(clampLimitedChange(event, maxLength))}
        showCount={showCount}
      />
    </div>
  )
}
