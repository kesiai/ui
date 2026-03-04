'use client'

import * as React from 'react'
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

/**
 * 二次确认对话框组件
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false)
 *
 * <ConfirmDialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="确认删除"
 *   description="确定要删除此项目吗？此操作不可恢复。"
 *   confirmText="删除"
 *   cancelText="取消"
 *   onConfirm={() => {
 *     // 执行删除操作
 *     setOpen(false)
 *   }}
 * />
 * ```
 */
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

/**
 * 显示确认对话框的 Hook
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const confirm = useConfirmDialog()
 *
 *   const handleDelete = async () => {
 *     const confirmed = await confirm({
 *       title: '确认删除',
 *       description: '确定要删除此项目吗？',
 *     })
 *
 *     if (confirmed) {
 *       // 执行删除
 *     }
 *   }
 *
 *   return <button onClick={handleDelete}>删除</button>
 * }
 * ```
 */
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
