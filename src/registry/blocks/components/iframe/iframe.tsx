import * as React from "react"
import { cn } from "@/lib/utils"
import { useUser } from "@/registry/lib/airiot/client"

export interface IframeProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  /**
   * iframe 地址
   */
  iframeSrc?: string
  /**
   * 携带 token
   */
  hasToken?: boolean
}

const Iframe = React.forwardRef<HTMLIFrameElement, IframeProps>(
  (
    {
      className,
      iframeSrc = '',
      hasToken = false,
      ...props
    },
    ref
  ) => {
    // 获取 token
    const token = useUser().user?.token || ''

    // 构建 URL
    const buildSrc = React.useMemo(() => {
      let src = iframeSrc

      // 添加 token
      if (hasToken && token && src) {
        const separator = src.indexOf('?') > 0 ? '&' : '?'
        src = `${src}${separator}token=${token}`
      }

      return src
    }, [iframeSrc, hasToken, token])

    // 如果没有 URL，显示占位提示
    if (!buildSrc) {
      return (
        <div
          className={cn(
            "flex items-center justify-center bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg",
            className
          )}
          style={{ width: '100%', height: '100%', minHeight: '200px' }}
        >
          <p className="text-sm text-slate-500 text-center px-4">
            用于嵌入网页内容，嵌入的网址的页面展示内容会在 iframe 窗口内显示
          </p>
        </div>
      )
    }

    return (
      <iframe
        ref={ref}
        src={buildSrc}
        className={cn("w-full h-full border-0", className)}
        frameBorder="0"
        allowFullScreen
        allowTransparency
        {...props}
      />
    )
  }
)

Iframe.displayName = "Iframe"

export { Iframe }
