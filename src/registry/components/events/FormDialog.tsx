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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

export type FormFieldType = 'text' | 'number' | 'boolean' | 'select' | 'textarea'

export interface FormField {
  name: string
  label: string
  type?: FormFieldType
  defaultValue?: any
  required?: boolean
  placeholder?: string
  options?: { label: string; value: string | number }[]
  validate?: (value: any) => string | null
}

export interface FormDialogProps {
  /** 是否显示 */
  open: boolean
  /** 关闭回调 */
  onOpenChange: (open: boolean) => void
  /** 标题 */
  title?: string
  /** 描述内容 */
  description?: string
  /** 表单字段配置 */
  fields: FormField[]
  /** 确认按钮文本 */
  confirmText?: string
  /** 取消按钮文本 */
  cancelText?: string
  /** 确认回调 */
  onConfirm: (data: Record<string, any>) => void
  /** 取消回调 */
  onCancel?: () => void
  /** 初始值 */
  initialValues?: Record<string, any>
  /** 是否在点击遮罩层时关闭 */
  dismissible?: boolean
}

/**
 * 表单对话框组件
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false)
 *
 * <FormDialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="请输入信息"
 *   fields={[
 *     { name: 'name', label: '名称', type: 'text', required: true },
 *     { name: 'age', label: '年龄', type: 'number' },
 *     { name: 'active', label: '是否启用', type: 'boolean', defaultValue: true },
 *   ]}
 *   onConfirm={(data) => {
 *     console.log(data)
 *     setOpen(false)
 *   }}
 * />
 * ```
 */
export function FormDialog({
  open,
  onOpenChange,
  title = '填写表单',
  description = '请填写以下信息',
  fields,
  confirmText = '确定',
  cancelText = '取消',
  onConfirm,
  onCancel,
  initialValues = {},
  dismissible = true,
}: FormDialogProps) {
  // 表单数据状态
  const [formData, setFormData] = React.useState<Record<string, any>>({})
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  // 当对话框打开时，初始化表单数据
  React.useEffect(() => {
    if (open) {
      const initialData: Record<string, any> = {}
      fields.forEach((field) => {
        const key = field.name
        initialData[key] =
          initialValues[key] !== undefined
            ? initialValues[key]
            : field.defaultValue !== undefined
              ? field.defaultValue
              : ''
      })
      setFormData(initialData)
      setErrors({})
    }
  }, [open, fields, initialValues])

  // 更新字段值
  const handleFieldChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    // 清除该字段的错误
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[name]
      return newErrors
    })
  }

  // 验证表单
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    fields.forEach((field) => {
      const value = formData[field.name]

      // 必填验证
      if (field.required && (value === undefined || value === '')) {
        newErrors[field.name] = `${field.label}不能为空`
        isValid = false
      }

      // 自定义验证
      if (field.validate) {
        const error = field.validate(value)
        if (error) {
          newErrors[field.name] = error
          isValid = false
        }
      }
    })

    setErrors(newErrors)
    return isValid
  }

  // 确认提交
  const handleConfirm = React.useCallback(() => {
    if (!validateForm()) {
      return
    }

    onConfirm(formData)
    if (dismissible) {
      onOpenChange(false)
    }
  }, [formData, fields, onConfirm, onOpenChange, dismissible])

  // 取消
  const handleCancel = React.useCallback(() => {
    onCancel?.()
    if (dismissible) {
      onOpenChange(false)
    }
  }, [onCancel, onOpenChange, dismissible])

  // 渲染表单字段
  const renderField = (field: FormField) => {
    const key = field.name
    const value = formData[key]
    const error = errors[key]

    switch (field.type) {
      case 'boolean':
        return (
          <div className="flex items-center space-x-2" key={key}>
            <Switch
              id={key}
              checked={value}
              onCheckedChange={(checked) => handleFieldChange(key, checked)}
            />
            <Label htmlFor={key}>{field.label}</Label>
          </div>
        )

      case 'textarea':
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={key}
              value={value}
              onChange={(e) => handleFieldChange(key, e.target.value)}
              placeholder={field.placeholder}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        )

      case 'select':
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={String(value)}
              onValueChange={(v) => handleFieldChange(key, v)}
            >
              <SelectTrigger className={error ? 'border-red-500' : ''} id={key}>
                <SelectValue placeholder={field.placeholder || '请选择'} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        )

      case 'number':
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={key}
              type="number"
              value={value}
              onChange={(e) => handleFieldChange(key, e.target.value)}
              placeholder={field.placeholder}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        )

      case 'text':
      default:
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={key}
              type="text"
              value={value}
              onChange={(e) => handleFieldChange(key, e.target.value)}
              placeholder={field.placeholder}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={dismissible ? onOpenChange : undefined}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">{fields.map(renderField)}</div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {cancelText}
          </Button>
          <Button onClick={handleConfirm}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/**
 * 显示表单对话框的 Hook
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const showForm = useFormDialog()
 *
 *   const handleClick = async () => {
 *     const result = await showForm({
 *       title: '请输入信息',
 *       fields: [
 *         { name: 'name', label: '名称', type: 'text', required: true },
 *         { name: 'age', label: '年龄', type: 'number' },
 *       ],
 *     })
 *
 *     if (result) {
 *       console.log(result)
 *     }
 *   }
 *
 *   return <button onClick={handleClick}>打开表单</button>
 * }
 * ```
 */
export function useFormDialog() {
  const [config, setConfig] = React.useState<{
    title?: string
    description?: string
    fields: FormField[]
    confirmText?: string
    cancelText?: string
    initialValues?: Record<string, any>
  } | null>(null)

  const [resolve, setResolve] = React.useState<
    ((value: Record<string, any> | null) => void) | null
  >(null)

  const showForm = React.useCallback(
    (options: {
      title?: string
      description?: string
      fields: FormField[]
      confirmText?: string
      cancelText?: string
      initialValues?: Record<string, any>
    }): Promise<Record<string, any> | null> => {
      return new Promise((res) => {
        setConfig(options)
        setResolve(() => res)
      })
    },
    []
  )

  const handleConfirm = React.useCallback(
    (data: Record<string, any>) => {
      resolve?.(data)
      setConfig(null)
      setResolve(null)
    },
    [resolve]
  )

  const handleCancel = React.useCallback(() => {
    resolve?.(null)
    setConfig(null)
    setResolve(null)
  }, [resolve])

  const DialogComponent = React.useMemo(() => {
    if (!config) return null

    return (
      <FormDialog
        open={true}
        onOpenChange={() => {
          handleCancel()
        }}
        title={config.title}
        description={config.description}
        fields={config.fields}
        confirmText={config.confirmText}
        cancelText={config.cancelText}
        initialValues={config.initialValues}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    )
  }, [config, handleConfirm, handleCancel])

  return { showForm, DialogComponent }
}
