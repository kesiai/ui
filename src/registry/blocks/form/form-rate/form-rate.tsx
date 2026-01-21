import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

export interface RateProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 当前值
   */
  value?: number
  /**
   * 星星总数
   */
  count?: number
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 是否允许清除
   */
  allowClear?: boolean
  /**
   * 变化回调
   */
  onChange?: (value: number) => void
  /**
   * 单元格键值
   */
  cellKey?: string
  /**
   * 是否显示分数
   */
  showScore?: boolean
  /**
   * 大小
   */
  size?: 'sm' | 'md' | 'lg'
}

const Rate = React.forwardRef<HTMLDivElement, RateProps>(
  (
    {
      value = 0,
      count = 5,
      disabled = false,
      allowClear = true,
      onChange,
      cellKey,
      showScore = false,
      size = 'md',
      className,
      ...props
    },
    ref
  ) => {
    const [hoverValue, setHoverValue] = React.useState<number | null>(null)
    const currentValue = hoverValue !== null ? hoverValue : value

    const handleClick = (index: number) => {
      if (disabled) return

      const newValue = index + 1
      if (allowClear && value === newValue) {
        onChange?.(0)
      } else {
        onChange?.(newValue)
      }
    }

    const handleMouseEnter = (index: number) => {
      if (disabled) return
      setHoverValue(index + 1)
    }

    const handleMouseLeave = () => {
      setHoverValue(null)
    }

    const getStarColor = (index: number) => {
      if (index < currentValue) {
        if (currentValue < count * 0.4) return 'text-red-500'
        if (currentValue < count * 0.6) return 'text-yellow-500'
        return 'text-green-500'
      }
      return 'text-gray-300'
    }

    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8'
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rate-component flex items-center gap-1",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {showScore && value > 0 && (
          <span className="mr-2 text-sm font-medium">
            {value}/{count}
          </span>
        )}
        {Array.from({ length: count }).map((_, index) => (
          <Star
            key={index}
            className={cn(
              sizeClasses[size],
              "transition-all duration-200",
              getStarColor(index),
              !disabled && "cursor-pointer hover:scale-110"
            )}
            fill={index < currentValue ? "currentColor" : "none"}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          />
        ))}
      </div>
    )
  }
)

Rate.displayName = "Rate"

export default Rate
