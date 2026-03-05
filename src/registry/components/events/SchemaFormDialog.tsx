'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import SchemaForm from '@/registry/components/schema-form/schema-form'
import type { ReactNode } from 'react'
import { toast } from 'sonner'

export interface SchemaFormDialogProps {
  /** 是否显示 */
  open: boolean
  /** 关闭回调 */
  onOpenChange: (open: boolean) => void
  /** 标题 */
  title?: string
  /** 描述内容 */
  description?: string
  /** JSON Schema */
  schema?: any
  /** 表单 Schema (可选) */
  formSchema?: any
  /** 确认按钮文本 */
  confirmText?: string
  /** 取消按钮文本 */
  cancelText?: string
  /** 确认回调 */
  onConfirm: (data: any) => void | Promise<void>
  /** 取消回调 */
  onCancel?: () => void
  /** 初始值 */
  initialValues?: Record<string, any>
  /** 子组件 */
  children?: ReactNode | ((props: any) => ReactNode)
  /** 是否在点击遮罩层时关闭 */
  dismissible?: boolean
  /** 自定义类名 */
  classNames?: Record<'form' | 'group' | 'field' | 'label' | 'input' | 'description' | 'error', string>
}

/**
 * 基于 @airiot/client SchemaForm 的表单对话框组件
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false)
 *
 * const schema = {
 *   type: 'object',
 *   properties: {
 *     name: { type: 'string', title: '名称' },
 *     age: { type: 'integer', title: '年龄' }
 *   }
 * }
 *
 * <SchemaFormDialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="请输入信息"
 *   schema={schema}
 *   onConfirm={(data) => {
 *     console.log(data)
 *     setOpen(false)
 *   }}
 * />
 * ```
 */
export function SchemaFormDialog({
  open,
  onOpenChange,
  title = '填写表单',
  description = '请填写以下信息',
  schema,
  formSchema,
  confirmText = '确定',
  cancelText = '取消',
  onConfirm,
  onCancel,
  initialValues = {},
  children,
  dismissible = true,
  classNames,
}: SchemaFormDialogProps) {
  const [submitting, setSubmitting] = React.useState(false)

  // 表单提交处理
  const handleSubmit = React.useCallback(
    async (data: any) => {
      setSubmitting(true)
      try {
        await onConfirm(data)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : '操作失败')
      } finally {
        setSubmitting(false)
      }
    },
    [onConfirm]
  )

  // 取消
  const handleCancel = React.useCallback(() => {
    onCancel?.()
    if (dismissible) {
      onOpenChange(false)
    }
  }, [onCancel, onOpenChange, dismissible])

  return (
    <Dialog open={open} onOpenChange={dismissible ? onOpenChange : undefined}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {schema && (
          <SchemaForm
            schema={schema}
            formSchema={formSchema}
            formId="schema-form-dialog"
            initialValues={initialValues}
            onSubmit={handleSubmit}
            classNames={classNames}
          >
            {children}
          </SchemaForm>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={submitting}>
            {cancelText}
          </Button>
          <Button type="submit" form="schema-form-dialog" disabled={submitting}>
            {submitting ? '提交中...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
