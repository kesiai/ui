import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

export type FieldType = 'string' | 'number' | 'boolean'

export interface FieldProps {
  type: FieldType
  render?: (schema: Record<string, any>) => React.ReactNode
  schema?: Record<string, any>
  [key: string]: any
}

/**
 * 基础数据表字段组件
 * 根据类型返回基础输入组件
 */
const Field = React.forwardRef<any, FieldProps>(
  ({ type, render, schema, ...props }, ref) => {
    // 如果传了 render，直接返回渲染函数的结果
    if (render) {
      return <>{render(schema || {})}</>
    }

    // 验证 type 是否有效
    if (type !== 'string' && type !== 'number' && type !== 'boolean') {
      return null
    }

    // 根据 type 返回对应的输入组件
    switch (type) {
      case 'string': {
        return (
          <Input
            ref={ref as React.Ref<HTMLInputElement>}
            type="text"
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
              "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "file:text-foreground placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            )}
            {...props}
            {...schema}
          />
        )
      }

      case 'number': {
        return (
          <Input
            ref={ref as React.Ref<HTMLInputElement>}
            type="number"
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
              "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "file:text-foreground placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            )}
            {...props}
            {...schema}
          />
        )
      }

      case 'boolean': {
        const {
          value,
          onChange,
          disabled,
          ...restSchema
        } = schema || {}

        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              ref={ref as React.Ref<HTMLButtonElement>}
              id="field-checkbox"
              checked={!!value}
              onCheckedChange={(checked) => {
                if (onChange) {
                  onChange(checked)
                }
              }}
              disabled={disabled}
              {...restSchema}
              {...props}
            />
            <label
              htmlFor="field-checkbox"
              className={cn(
                "text-sm font-medium leading-none",
                "peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              )}
            >
              {schema?.label || ''}
            </label>
          </div>
        )
      }

      default:
        return null
    }
  }
)

Field.displayName = 'Field'

export default Field
