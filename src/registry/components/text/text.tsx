import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 文字内容
   */
  content?: string | number
  /**
   * 文本类型
   */
  textType?: 'mainText' | 'title1' | 'title2' | 'title3' | 'title4' | 'title5' | 'paragraph'
  /**
   * 显示模式
   */
  showMode?: 'inline' | 'block' | 'inline-block'
  /**
   * 首行缩进（像素）
   */
  textIndent?: number
  /**
   * 去除空格
   */
  isTrim?: boolean
  /**
   * 超出省略
   */
  ellipsis?: boolean
  /**
   * 占位文本
   */
  placeholder?: string
}

const Text = React.forwardRef<HTMLDivElement, TextProps>(
  (
    {
      className,
      content = '',
      textType = 'mainText',
      showMode = 'inline',
      textIndent = 0,
      isTrim = false,
      ellipsis = false,
      placeholder = '请输入文本信息',
      ...props
    },
    ref
  ) => {
    // 处理文本内容
    const textValue = React.useMemo(() => {
      let value = content?.toString() || ''

      // 去除空格
      if (isTrim && value) {
        value = value.replace(/\s+/g, '')
      }

      return value
    }, [content, isTrim])

    // 渲染文本元素
    const renderTextElement = () => {
      const displayStyle = {
        display: showMode,
        width: "100%",
        textIndent: textIndent ? `${textIndent}px` : undefined,
      }

      const textStyle = ellipsis
        ? {
            ...displayStyle,
            textOverflow: 'ellipsis',
            overflow: 'hidden' as const,
            whiteSpace: 'nowrap' as const,
          }
        : {
            ...displayStyle,
            whiteSpace: 'pre-wrap' as const,
          }

      const textColor = !textValue ? { color: '#ccc' } : {}

      const commonProps = {
        className: cn(
          // 根据文本类型应用不同的样式类
          textType === 'title1' && 'text-4xl font-bold',
          textType === 'title2' && 'text-3xl font-bold',
          textType === 'title3' && 'text-2xl font-semibold',
          textType === 'title4' && 'text-xl font-semibold',
          textType === 'title5' && 'text-lg font-medium',
          textType === 'paragraph' && 'text-base leading-relaxed',
          textType === 'mainText' && 'text-sm'
        ),
        style: { ...textStyle, ...textColor },
      }

      switch (textType) {
        case 'title1':
          return <h1 {...commonProps}>{textValue || placeholder}</h1>
        case 'title2':
          return <h2 {...commonProps}>{textValue || placeholder}</h2>
        case 'title3':
          return <h3 {...commonProps}>{textValue || placeholder}</h3>
        case 'title4':
          return <h4 {...commonProps}>{textValue || placeholder}</h4>
        case 'title5':
          return <h5 {...commonProps}>{textValue || placeholder}</h5>
        case 'paragraph':
          return <p {...commonProps}>{textValue || placeholder}</p>
        case 'mainText':
        default:
          return <span {...commonProps}>{textValue || placeholder}</span>
      }
    }

    return (
      <div
        ref={ref}
        className={cn("text-component", className)}
        style={{ width: '100%', height: '100%', display: "flex", alignItems: "center" }}
        {...props}
      >
        {renderTextElement()}
      </div>
    )
  }
)

Text.displayName = "Text"

export { Text }
