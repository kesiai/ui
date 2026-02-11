import * as React from "react"
import { cn } from "@/lib/utils"
import "./svg.css"

export interface SvgEditorProps {
  className?: string
  /**
   * SVG 内容字符串
   */
  initialSvg?: string
  /**
   * 宽度
   */
  width?: number | string
  /**
   * 高度
   */
  height?: number | string
}

const SvgEditor = React.forwardRef<HTMLDivElement, SvgEditorProps>(
  (
    {
      className,
      initialSvg = "",
      width = "100%",
      height = "100%",
      ...props
    },
    ref
  ) => {
    // 内部 SVG 内容状态
    const [currentSvg, setCurrentSvg] = React.useState(initialSvg)

    // 当 initialSvg prop 变化时更新内部状态
    React.useEffect(() => {
      if (initialSvg && initialSvg !== currentSvg) {
        setCurrentSvg(initialSvg)
      }
    }, [initialSvg])

    // 解析 SVG 字符串，提取实际的 SVG 内容
    const getSvgContent = (svgString: string) => {
      if (!svgString) return ""

      // 如果字符串包含 <svg> 标签，提取它
      const svgMatch = svgString.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i)
      if (svgMatch) {
        return svgMatch[0]
      }

      // 否则返回原字符串
      return svgString
    }

    const svgContent = getSvgContent(currentSvg || "")

    return (
      <div
        ref={ref}
        className={cn("svg-editor", "svg-editor-view-only", className)}
        style={{ width, height }}
        {...props}
      >
        {svgContent ? (
          <div
            className="svg-editor-view-only-content"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <div className="svg-editor-empty">
            <p>暂无 SVG 内容</p>
          </div>
        )}
      </div>
    )
  }
)

SvgEditor.displayName = "SvgEditor"

export { SvgEditor }
