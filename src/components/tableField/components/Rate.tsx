import * as React from 'react'
import { Star, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import isNil from 'lodash/isNil'

export interface RateComponentProps {
  input: {
    value?: number
    onChange?: (value: number) => void
  }
  field?: {
    schema?: {
      count?: number
      disabled?: boolean
      defaultVal?: number
      defaultValType?: 'fixed' | 'logic'
      inList?: boolean
      [key: string]: any
    }
    filter?: any
    meta?: any
  }
  record?: any
  [key: string]: any
}

const RateComponent = React.forwardRef<HTMLDivElement, RateComponentProps>(
  (props, ref) => {
    const { input, field: { schema } = {}, record } = props
    const { value, onChange } = input || {}

    const {
      count = 5,
      disabled = false,
      defaultVal,
      defaultValType = 'fixed',
      inList = false
    } = schema || {}

    // 默认值生效
    React.useEffect(() => {
      const timer = setTimeout(() => {
        if (!value && defaultVal && defaultValType !== 'logic') {
          onChange?.(defaultVal)
        }
      }, 0)
      return () => clearTimeout(timer)
    }, [])

    const currentValue = isNil(value) || value === '' ? defaultVal : value
    const ratingValue = (currentValue !== undefined && currentValue !== null) ? currentValue : 0

    // 根据 count 判断使用哪种样式
    const isLineMode = count > 5
    const className = cn(
      'flex items-center',
      isLineMode && 'gap-1'
    )

    // 确定每颗星的状态
    const getStarStatus = (index: number) => {
      const starValue = index + 1
      if (ratingValue >= starValue) return 'full'
      if (ratingValue >= starValue - 0.5) return 'half'
      return 'empty'
    }

    const getColorClass = () => {
      if (!ratingValue) return 'text-gray-300'
      if (ratingValue < 5) return 'text-red-500'
      if (ratingValue < 8) return 'text-yellow-500'
      return 'text-green-500'
    }

    const handleClick = (index: number) => {
      if (!disabled) {
        onChange?.(index + 1)
      }
    }

    const handleHover = (index: number) => {
      // 可以添加悬停效果
    }

    if (isLineMode) {
      // 线条模式 - 当 count > 5 时使用
      return (
        <div ref={ref} className={cn(className, getColorClass())}>
          {!inList && (
            <span className="mr-2 text-sm font-medium">
              {ratingValue > 0 ? `${ratingValue}/${count}` : `${count}级`}
            </span>
          )}
          <div className="flex items-center gap-0.5">
            {Array.from({ length: count }).map((_, index) => {
              const status = getStarStatus(index)
              return (
                <div
                  key={index}
                  className={cn(
                    "cursor-pointer transition-all",
                    disabled && "cursor-not-allowed opacity-50",
                    status === 'full' ? 'opacity-100' : 'opacity-30'
                  )}
                  onClick={() => handleClick(index)}
                  onMouseEnter={() => handleHover(index)}
                >
                  <Minus
                    className={cn(
                      "w-4 h-4",
                      inList ? 'w-3 h-3' : 'w-5 h-5'
                    )}
                  />
                </div>
              )
            })}
          </div>
          {inList && ratingValue > 0 && (
            <span className="ml-2 text-sm">
              {ratingValue}级
            </span>
          )}
        </div>
      )
    }

    // 星星模式 - 默认
    return (
      <div ref={ref} className={cn(className, getColorClass())}>
        {Array.from({ length: count }).map((_, index) => {
          const status = getStarStatus(index)
          return (
            <Star
              key={index}
              className={cn(
                "cursor-pointer transition-all",
                inList ? 'w-4 h-4' : 'w-6 h-6',
                disabled && "cursor-not-allowed opacity-50",
                status === 'full' ? 'fill-current' : 'fill-transparent'
              )}
              onClick={() => !disabled && handleClick(index)}
            />
          )
        })}
        {ratingValue > 0 && !inList && (
          <span className="ml-2 text-sm font-medium">
            {ratingValue}/{count}
          </span>
        )}
      </div>
    )
  }
)

RateComponent.displayName = 'RateComponent'

export default RateComponent
