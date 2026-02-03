import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'

export interface TableFieldFormInfoProps {
  schema?: {
    widgetContent?: string
  }
  args?: Array<{
    key: string
    value: any
  }>
  outProps?: Record<string, any>
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; FallbackComponent?: React.ComponentType<{ error: Error }> },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    console.error(error)
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      const { FallbackComponent } = this.props
      if (FallbackComponent) {
        return <FallbackComponent error={this.state.error!} />
      }
      return (
        <p style={{ color: 'red' }}>
          运行时错误: {this.state.error?.message}
        </p>
      )
    }

    return this.props.children
  }
}

const TableFieldFormInfo: React.FC<TableFieldFormInfoProps> = ({ schema, args = [], outProps = {} }) => {
  const code = schema?.widgetContent

  // TODO: LazyBabelTransformedCode 组件待迁移
  // 原代码: <C is="LazyBabelTransformedCode" code={str} onTransformedCode={onTransformedCode} />
  // 这个组件负责将代码字符串进行 Babel 转换

  const propsArgs = args.reduce((prev, { key, value }) => {
    prev[key] = value
    return prev
  }, {} as Record<string, any>)

  return (
    <Card className="bg-muted/50">
      <CardContent className="p-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            表单信息组件（待迁移）
          </p>
          {code && (
            <div className="text-xs text-muted-foreground">
              <p>组件代码长度: {code.length} 字符</p>
              <p className="mt-1">
                依赖组件: LazyBabelTransformedCode 待迁移
              </p>
            </div>
          )}
          {Object.keys(propsArgs).length > 0 && (
            <div className="text-xs text-muted-foreground">
              <p>参数: {Object.keys(propsArgs).join(', ')}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export { TableFieldFormInfo }
export default TableFieldFormInfo
