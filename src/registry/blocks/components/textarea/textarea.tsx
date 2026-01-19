import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * 文字内容
   */
  content?: string
  /**
   * 首行缩进（像素）
   */
  textIndent?: number
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      content = '',
      textIndent = 0,
      value,
      ...props
    },
    ref
  ) => {
    // 使用 content 或 value 属性
    const textValue = (value !== undefined ? value : content) as string

    return (
      <div
        className={cn("textarea-container", className)}
        style={{ width: '100%', height: '100%', padding: '8px' }}
      >
        <textarea
          ref={ref}
          className={cn(
            "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            "resize-none",
            className
          )}
          style={{
            textIndent: textIndent ? `${textIndent}px` : undefined,
            height: '100%',
            minHeight: '80px'
          }}
          value={textValue}
          {...props}
        />
      </div>
    )
  }
)

TextArea.displayName = "TextArea"

export { TextArea }
