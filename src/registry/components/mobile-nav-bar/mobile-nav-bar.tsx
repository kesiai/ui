import * as React from "react"
import { cn } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"

export interface MobileNavBarProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * 标题文字
   */
  title?: string
  /**
   * 返回区域文字
   */
  back?: string
  /**
   * 是否显示返回箭头
   */
  backArrow?: boolean
  /**
   * 左侧图标 URL
   */
  icon?: string
  /**
   * 返回按钮点击回调
   */
  onBack?: () => void
  /**
   * 是否禁用返回功能
   */
  disableBack?: boolean
}

const MobileNavBar = React.forwardRef<HTMLElement, MobileNavBarProps>(
  (
    {
      className,
      title,
      back,
      backArrow = true,
      icon,
      onBack,
      disableBack = false,
      ...props
    },
    ref
  ) => {
    const handleBackClick = React.useCallback(() => {
      if (disableBack) return

      if (onBack) {
        onBack()
      } else {
        // 默认使用浏览器历史回退
        window.history.back()
      }
    }, [onBack, disableBack])

    return (
      <header
        ref={ref}
        className={cn(
          "mobile-nav-bar flex items-center h-11 px-4 bg-white border-b border-slate-200",
          className
        )}
        {...props}
      >
        {/* 左侧区域 */}
        <div className="flex items-center gap-2">
          {icon ? (
            <img src={icon} alt="" className="h-5 w-5" />
          ) : (
            (back || backArrow) && (
              <button
                type="button"
                onClick={handleBackClick}
                disabled={disableBack}
                className={cn(
                  "flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors",
                  disableBack && "pointer-events-none opacity-50"
                )}
              >
                {backArrow && <ArrowLeft className="h-4 w-4" />}
                {back && <span className="text-sm">{back}</span>}
              </button>
            )
          )}
        </div>

        {/* 标题 */}
        <div className="flex-1 text-center">
          <h1 className="text-base font-medium text-slate-900 truncate">{title}</h1>
        </div>

        {/* 右侧占位，保持标题居中 */}
        <div className="flex items-center gap-2" style={{ width: icon ? '24px' : (back || backArrow) ? 'auto' : '0' }}>
          {icon ? null : <div className="h-4 w-4" />}
        </div>
      </header>
    )
  }
)
MobileNavBar.displayName = "MobileNavBar"

export { MobileNavBar }
