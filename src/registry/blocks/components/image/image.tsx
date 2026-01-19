import * as React from "react"
import { cn } from "@/lib/utils"

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /**
   * 图片地址
   */
  src?: string
  /**
   * 增加浏览器参数（避免缓存）
   */
  addParameters?: boolean
  /**
   * SVG 内容（用于内联 SVG）
   */
  svgContent?: string
  /**
   * 等比缩放（仅 SVG）
   */
  preserveAspectRatio?: boolean
  /**
   * 背景颜色
   */
  backgroundColor?: string
  /**
   * 占位提示
   */
  alt?: string
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      className,
      src = '',
      addParameters = false,
      svgContent,
      preserveAspectRatio = true,
      backgroundColor = '',
      alt = '图片',
      ...props
    },
    ref
  ) => {
    // 处理图片 URL（添加时间戳避免缓存）
    const imageSrc = React.useMemo(() => {
      if (!src) return ''

      if (addParameters) {
        const separator = src.indexOf('?') > 0 ? '&' : '?'
        return `${src}${separator}t=${new Date().getTime()}`
      }

      return src
    }, [src, addParameters])

    // 判断是否为 SVG
    const isSvg = React.useMemo(() => {
      return typeof src === 'string' && src.includes('.svg')
    }, [src])

    // 渲染 SVG
    if (isSvg && svgContent) {
      return (
        <div
          className={cn("image-container", className)}
          style={{
            background: backgroundColor || undefined,
            width: '100%',
            height: '100%'
          }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      )
    }

    // 渲染普通图片
    return (
      <div
        className={cn("image-wrapper", className)}
        style={{ width: '100%', height: '100%' }}
      >
        {src ? (
          <img
            ref={ref}
            src={imageSrc}
            alt={alt}
            className={cn("image-component", className)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              backgroundColor: backgroundColor || undefined,
              userSelect: 'none',
              draggable: false
            }}
            {...props}
          />
        ) : (
          <div
            className={cn(
              "image-placeholder flex items-center justify-center border-2 border-dashed border-slate-300 rounded-lg",
              className
            )}
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: backgroundColor || undefined
            }}
          >
            <p className="text-sm text-slate-500">请上传图片</p>
          </div>
        )}
      </div>
    )
  }
)

Image.displayName = "Image"

export { Image }
