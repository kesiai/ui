import * as React from 'react'
import type { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { SchemaForm } from '@/registry/components/schema-form/schema-form'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import {
  useEvents,
  useEvent,
  useEventsWithSpread,
  useGlobalDialogs
} from '@airiot/client'

export {
  useEvents,
  useEvent,
  useEventsWithSpread,
}
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
            defaultValues={initialValues}
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

export interface ConfirmDialogProps {
  /** 是否显示 */
  open: boolean
  /** 关闭回调 */
  onOpenChange: (open: boolean) => void
  /** 标题 */
  title?: string
  /** 描述内容 */
  description?: string
  /** 确认按钮文本 */
  confirmText?: string
  /** 取消按钮文本 */
  cancelText?: string
  /** 确认回调 */
  onConfirm: () => void
  /** 取消回调 */
  onCancel?: () => void
  /** 是否在点击遮罩层时关闭 */
  dismissible?: boolean
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title = '确认操作',
  description = '确定要执行此操作吗？',
  confirmText = '确定',
  cancelText = '取消',
  onConfirm,
  onCancel,
  dismissible = true,
}: ConfirmDialogProps) {
  const handleConfirm = React.useCallback(() => {
    onConfirm()
    if (dismissible) {
      onOpenChange(false)
    }
  }, [onConfirm, onOpenChange, dismissible])

  const handleCancel = React.useCallback(() => {
    onCancel?.()
    if (dismissible) {
      onOpenChange(false)
    }
  }, [onCancel, onOpenChange, dismissible])

  return (
    <AlertDialog open={open} onOpenChange={dismissible ? onOpenChange : undefined}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function useConfirmDialog() {
  const [config, setConfig] = React.useState<{
    title?: string
    description?: string
    confirmText?: string
    cancelText?: string
  } | null>(null)

  const [resolve, setResolve] = React.useState<
    ((value: boolean) => void) | null
  >(null)

  const confirm = React.useCallback(
    (options: {
      title?: string
      description?: string
      confirmText?: string
      cancelText?: string
    }): Promise<boolean> => {
      return new Promise((res) => {
        setConfig(options)
        setResolve(() => res)
      })
    },
    []
  )

  const handleConfirm = React.useCallback(() => {
    resolve?.(true)
    setConfig(null)
    setResolve(null)
  }, [resolve])

  const handleCancel = React.useCallback(() => {
    resolve?.(false)
    setConfig(null)
    setResolve(null)
  }, [resolve])

  const DialogComponent = React.useMemo(() => {
    if (!config) return null

    return (
      <ConfirmDialog
        open={true}
        onOpenChange={() => {
          handleCancel()
        }}
        title={config.title}
        description={config.description}
        confirmText={config.confirmText}
        cancelText={config.cancelText}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    )
  }, [config, handleConfirm, handleCancel])

  return { confirm, DialogComponent }
}

/**
 * 全局对话框组件
 *
 * 不需要任何 Provider，直接放在根组件即可
 */
export function GlobalDialogs() {
  const {
    confirmDialog,
    schemaFormDialog,
    handleConfirm,
    handleCancel,
    handleSchemaFormConfirm,
    handleSchemaFormCancel
  } = useGlobalDialogs()

  const confirmOpen = !!confirmDialog?.open
  const schemaFormOpen = !!schemaFormDialog?.open

  return (
    <>
      {/* 确认对话框 */}
      {confirmOpen && confirmDialog && (
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={(open) => {
            if (!open) {
              handleCancel()
            }
          }}
          title={confirmDialog.config?.title || '确认操作'}
          description={confirmDialog.config?.message || '确定要执行此操作吗？'}
          confirmText={confirmDialog.config?.confirmText || '确定'}
          cancelText={confirmDialog.config?.cancelText || '取消'}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
      {/* SchemaForm 对话框 */}
      {schemaFormOpen && schemaFormDialog && (
        <SchemaFormDialog
          open={schemaFormOpen}
          onOpenChange={(open) => {
            if (!open) {
              handleSchemaFormCancel()
            }
          }}
          title={schemaFormDialog.config?.title || '填写表单'}
          description={schemaFormDialog.config?.description || '请填写以下信息'}
          schema={schemaFormDialog.config?.schema}
          formSchema={schemaFormDialog.config?.formSchema}
          confirmText={schemaFormDialog.config?.confirmText || '确定'}
          cancelText={schemaFormDialog.config?.cancelText || '取消'}
          initialValues={schemaFormDialog.config?.initialValues}
          onConfirm={handleSchemaFormConfirm}
          onCancel={handleSchemaFormCancel}
        />
      )}
    </>
  )
}

// ============== 文档说明 ==============

/**
 * ## 1. 基本用法
 * ```tsx
 * const events = useEvents({
 *   click: [{ type: 'pageJump', params: { url: '/home' } }],
 *   doubleClick: [{ type: 'changeVar', params: { var: { name: 'a' }, varValue: 'test' } }]
 * })
 *
 * // 方式1: 展开到容器
 * <div {...events}>
 *   <Button>Click me</Button>
 * </div>
 *
 * // 方式2: 单独绑定
 * <Button onClick={events.click}>Click me</Button>
 * <Card onDoubleClick={events.doubleClick}>Double click me</Card>
 * ```
 *
 * ## 2. 动作类型
 *
 * ### 页面跳转 (pageJump)
 * ```tsx
 * {
 *   type: 'pageJump',
 *   params: {
 *     url: '/home',
 *     openWay: '_blank',
 *     showMessage: true
 *   }
 * }
 * ```
 *
 * ### 修改变量 (changeVar)
 * ```tsx
 * {
 *   type: 'changeVar',
 *   params: {
 *     var: { name: 'myVar' },
 *     varType: 'varValue',
 *     varValue: 'hello'
 *   }
 * }
 * ```
 *
 * ### 修改表数据 (changeTableData)
 * ```tsx
 * {
 *   type: 'changeTableData',
 *   params: {
 *     table: { id: 'table1', name: 'MyTable' },
 *     data: { id: 1, name: 'Item 1' },
 *     showForm: true,
 *     nodeProp: [
 *       { key: 'name', value: 'New Name' }
 *     ],
 *     successMess: true,
 *     successContent: '修改成功'
 *   }
 * }
 * ```
 *
 * ### 调用流程 (callFlow)
 * ```tsx
 * {
 *   type: 'callFlow',
 *   params: {
 *     flow: { id: 'flow1', name: 'MyFlow' },
 *     showForm: true,
 *     params: { param1: 'value1' },
 *     successMess: true
 *   }
 * }
 * ```
 *
 * ## 3. 动作配置
 *
 * ### 二次确认
 * ```tsx
 * {
 *   type: 'pageJump',
 *   params: { url: '/home' },
 *   confirm: {
 *     title: '确认跳转',
 *     message: '确定要跳转到首页吗？',
 *     confirmText: '确定',
 *     cancelText: '取消'
 *   }
 * }
 * ```
 *
 * ### 延迟执行
 * ```tsx
 * {
 *   type: 'pageJump',
 *   params: { url: '/home' },
 *   delay: 1000 // 延迟 1 秒执行
 * }
 * ```
 *
 * ## 4. 动作依赖
 *
 * 动作按顺序执行，后一个动作可以访问前一个动作的结果：
 * ```tsx
 * {
 *   click: [
 *     { type: 'api', params: { url: '/api/user' } }, // 返回用户数据
 *     { type: 'changeVar', params: { var: { name: 'currentUser' }, varValue: '{prevResult}' } }
 *   ]
 * }
 * ```
 *
 * ## 5. 使用 GlobalDialogs
 *
 * 对话框状态使用 jotai atoms 管理，不需要嵌套 Provider。
 * 只需要在应用根组件中放置 GlobalDialogs 组件：
 *
 * ```tsx
 * import { GlobalDialogs } from '@/registry/components/events/events'
 *
 * function App() {
 *   return (
 *     <>
 *       <YourApplication />
 *       <GlobalDialogs />
 *     </>
 *   )
 * }
 * ```
 */
