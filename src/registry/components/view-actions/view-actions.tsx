import React, { useState } from 'react'
import { useModelGet, useModelSave, useModelDelete, useFormSchema, useModelGetItems } from '@airiot/client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Field,
  FieldDescription,
  FieldLabel
} from "@/components/ui/field"
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
  Copy,
  AlertTriangle,
  Plus,
} from 'lucide-react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Loader2 } from 'lucide-react'
import ViewField from '@/registry/components/view-field/view-field'
import SchemaForm from '@/registry/components/schema-form/schema-form'

// ==================== Content Components ====================
// 这些组件只有在 Dialog 打开时才会渲染，从而触发数据加载

interface ViewActionContentProps {
  itemId: string
}

const ViewActionContent: React.FC<ViewActionContentProps> = ({ itemId }) => {
  const { data, loading, model } = useModelGet({ id: itemId })
  const { fields } = useFormSchema({ schema: model, formSchema: model.formSchema })

  return (
    <>
      <DialogHeader>
        <DialogTitle>{data ? (model.displayField && data[model.displayField] || data?._label || data?.name) : model.title}</DialogTitle>
      </DialogHeader>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : data ? (
        <ScrollArea className="max-h-[70vh] pr-3">
          <div className="space-y-4 pr-4">
            {fields.map((field) => {
              const label = field.label
              const description = field.description
              const fieldValue = (<span className='w-fit'><ViewField
                {...field}
                schema={field}
                value={data?.[field.name]}
                item={data}
                key={`formfield-${field.name}`}
                className={'w-fit'}
              /></span>)
              return (label || description) ? (
                <Field>
                  {label && <FieldLabel>
                    {label} :
                  </FieldLabel>}
                  {fieldValue}
                  {description && (
                    <FieldDescription>
                      {description}
                    </FieldDescription>
                  )}
                </Field>
              ) : fieldValue
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ) : (
        <div className="flex items-center justify-center py-12 text-slate-500">
          暂无数据
        </div>
      )}

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">关闭</Button>
        </DialogClose>
      </DialogFooter>
    </>
  )
}

interface EditActionContentProps {
  itemId: string
  onClose?: () => void
}

const EditActionContent: React.FC<EditActionContentProps> = ({ itemId, onClose }) => {
  const { title, data, loading, model } = useModelGet({ id: itemId })
  const { getItems } = useModelGetItems()
  const { saveItem } = useModelSave()
  const [saving, setSaving] = useState(false)

  const formId = `edit-form-${itemId}`

  const handleSave = async (values: any) => {
    setSaving(true)
    try {
      await saveItem(values)
      await getItems() // 刷新列表数据
      onClose?.()
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>编辑 {model?.title}</DialogTitle>
      </DialogHeader>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <ScrollArea className="max-h-[70vh] pr-3">
          <SchemaForm formId={formId} defaultValues={data} schema={model} formSchema={model.formSchema} onSubmit={handleSave} />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">取消</Button>
        </DialogClose>
        <Button form={formId} type="submit" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          保存
        </Button>
      </DialogFooter>
    </>
  )
}

interface ExportActionContentProps {
  itemId: string
  format?: 'json' | 'csv' | 'excel'
}

const ExportActionContent: React.FC<ExportActionContentProps> = ({ itemId, format = 'json' }) => {
  const { data, loading } = useModelGet({ id: itemId })

  const handleExport = () => {
    let content = ''
    let filename = `export_${itemId}`
    let mimeType = 'text/plain'

    switch (format) {
      case 'json':
        content = JSON.stringify(data, null, 2)
        filename += '.json'
        mimeType = 'application/json'
        break
      case 'csv':
        // Simple CSV export
        if (data && typeof data === 'object') {
          const headers = Object.keys(data)
          const values = Object.values(data).map(v =>
            typeof v === 'object' ? JSON.stringify(v) : String(v)
          )
          content = [headers.join(','), values.join(',')].join('\n')
        }
        filename += '.csv'
        mimeType = 'text/csv'
        break
      case 'excel':
        // For excel, you would typically use a library like xlsx
        content = JSON.stringify(data, null, 2)
        filename += '.json'
        break
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>导出数据</DialogTitle>
      </DialogHeader>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <ScrollArea className="max-h-[50vh]">
          <div className="space-y-4 pr-4">
            <p className="text-sm text-slate-600">
              选择导出格式：
            </p>
            <div className="grid gap-2">
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => handleExport()}
              >
                JSON 格式
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => handleExport()}
              >
                CSV 格式
              </Button>
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">关闭</Button>
        </DialogClose>
      </DialogFooter>
    </>
  )
}

interface CreateActionContentProps {
  onClose?: () => void
}

const CreateActionContent: React.FC<CreateActionContentProps> = ({ onClose }) => {
  const { getItems, model } = useModelGetItems()
  const { saveItem } = useModelSave()
  const [saving, setSaving] = useState(false)

  const formId = `create-form-${model.key}`

  const handleSave = async (values: any) => {
    setSaving(true)
    try {
      await saveItem(values)
      await getItems() // 刷新列表数据
      onClose?.()
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>新建 {model.title}</DialogTitle>
      </DialogHeader>
      <ScrollArea className="max-h-[70vh] pr-3">
        <SchemaForm formId={formId} schema={model} formSchema={model.form} onSubmit={handleSave} />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">取消</Button>
        </DialogClose>
        <Button form={formId} type="submit" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          创建
        </Button>
      </DialogFooter>
    </>
  )
}

interface CopyActionContentProps {
  itemId: string
  onClose?: () => void
}

const CopyActionContent: React.FC<CopyActionContentProps> = ({ itemId, onClose }) => {
  const { data, loading } = useModelGet({ id: itemId })
  const { saveItem } = useModelSave()
  const [copying, setCopying] = useState(false)

  const handleCopy = async () => {
    setCopying(true)
    try {
      if (data) {
        const newItem = {
          ...data,
          name: data.name ? `${data.name} (副本)` : undefined
        }
        delete newItem.id // 删除 id 以创建新项
        await saveItem(newItem)
        onClose?.()
      }
    } finally {
      setCopying(false)
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>复制数据</DialogTitle>
      </DialogHeader>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <ScrollArea className="max-h-[50vh]">
          <div className="space-y-4 pr-4">
            <p className="text-sm text-slate-600">
              确定要复制这条数据吗？
            </p>
            {data && (
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm font-medium">原数据：</p>
                <pre className="text-xs mt-2 overflow-auto">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">取消</Button>
        </DialogClose>
        <Button onClick={handleCopy} disabled={copying}>
          {copying ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          确认复制
        </Button>
      </DialogFooter>
    </>
  )
}

// ==================== Individual Action Components ====================

interface BaseActionProps {
  itemId: string
  children?: React.ReactNode
}

interface ViewActionProps extends BaseActionProps { }

export const ViewAction: React.FC<ViewActionProps> = ({ itemId, children }) => {
  const trigger = children || (
    <Button variant="ghost" size="sm">
      <Eye className="h-4 w-4" />
      查看
    </Button>
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <ViewActionContent itemId={itemId} />
      </DialogContent>
    </Dialog>
  )
}

interface EditActionProps extends BaseActionProps { }

export const EditAction: React.FC<EditActionProps> = ({ itemId, children }) => {
  const [open, setOpen] = useState(false)

  const trigger = children || (
    <Button variant="ghost" size="sm">
      <Edit className="h-4 w-4" />
      编辑
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <EditActionContent itemId={itemId} onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

interface CreateActionProps {
  children?: React.ReactNode
}

export const CreateAction: React.FC<CreateActionProps> = ({ children }) => {
  const [open, setOpen] = useState(false)

  const trigger = children || (
    <Button variant="ghost" size="sm">
      <Plus className="h-4 w-4" />
      新建
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <CreateActionContent onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

interface DeleteActionProps extends BaseActionProps {
  confirmMessage?: string
}

export const DeleteAction: React.FC<DeleteActionProps> = ({
  itemId,
  children,
  confirmMessage = '确定要删除这条数据吗？'
}) => {
  const { deleteItem } = useModelDelete()
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteItem(itemId)
      setOpen(false)
    } finally {
      setDeleting(false)
    }
  }

  const trigger = children || (
    <Button variant="ghost" size="sm">
      <Trash2 className="h-4 w-4 text-destructive" />
      删除
    </Button>
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" side='top' align="end">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <p className="text-sm">{confirmMessage}</p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={deleting}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              确认删除
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface ExportActionProps extends BaseActionProps {
  format?: 'json' | 'csv' | 'excel'
}

export const ExportAction: React.FC<ExportActionProps> = ({
  itemId,
  children,
  format = 'json'
}) => {
  const trigger = children || (
    <Button variant="ghost" size="sm">
      <Download className="h-4 w-4" />
      导出
    </Button>
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="md">
        <ExportActionContent itemId={itemId} format={format} />
      </DialogContent>
    </Dialog>
  )
}

interface CopyActionProps extends BaseActionProps { }

export const CopyAction: React.FC<CopyActionProps> = ({ itemId, children }) => {
  const [open, setOpen] = useState(false)

  const trigger = children || (
    <Button variant="ghost" size="sm">
      <Copy className="h-4 w-4" />
      复制
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="md">
        <CopyActionContent itemId={itemId} onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

// ==================== Actions Container Component ====================

export type ActionType = 'create' | 'edit' | 'delete' | 'view' | 'export' | 'copy'

interface ActionsProps {
  itemId?: string
  item?: any & { id: string }
  modelId?: string
  actions: ActionType[]
  variant?: 'buttons' | 'dropdown'
}

const Actions: React.FC<ActionsProps> = ({
  itemId,
  item,
  actions = ['view', 'edit'],
  variant = 'dropdown'
}) => {
  const id = itemId || item?.id
  if (!id) return null
  // Render as button group
  if (variant === 'buttons') {
    return (
      <div className="flex items-center gap-2">
        {actions.map((action) => (
          action === 'create' ? (
            <CreateAction key={action} />
          ) : action === 'delete' ? (
            <DeleteAction key={action} itemId={id!} />
          ) : action === 'view' ? (
            <ViewAction key={action} itemId={id!} />
          ) : action === 'edit' ? (
            <EditAction key={action} itemId={id!} />
          ) : action === 'export' ? (
            <ExportAction key={action} itemId={id!} />
          ) : action === 'copy' ? (
            <CopyAction key={action} itemId={id!} />
          ) : null
        ))}
      </div>
    )
  }

  // Render as dropdown menu
  const actionLabels: Record<ActionType, string> = {
    create: '新建',
    view: '查看',
    edit: '编辑',
    delete: '删除',
    export: '导出',
    copy: '复制'
  }

  const actionIcons: Record<ActionType, React.ReactNode> = {
    create: <Plus className="h-4 w-4" />,
    view: <Eye className="h-4 w-4" />,
    edit: <Edit className="h-4 w-4" />,
    delete: <Trash2 className="h-4 w-4 text-destructive" />,
    export: <Download className="h-4 w-4" />,
    copy: <Copy className="h-4 w-4" />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <span className="sr-only">打开菜单</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((action, index) => (
          <React.Fragment key={action}>
            {action === 'create' ? (
              <CreateAction>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  {actionIcons[action]}
                  {actionLabels[action]}
                </DropdownMenuItem>
              </CreateAction>
            ) : action === 'delete' ? (
              <DeleteAction itemId={id!}>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault()
                  }}
                >
                  {actionIcons[action]}
                  {actionLabels[action]}
                </DropdownMenuItem>
              </DeleteAction>
            ) : action === 'view' ? (
              <ViewAction itemId={id!}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  {actionIcons[action]}
                  {actionLabels[action]}
                </DropdownMenuItem>
              </ViewAction>
            ) : action === 'edit' ? (
              <EditAction itemId={id!}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  {actionIcons[action]}
                  {actionLabels[action]}
                </DropdownMenuItem>
              </EditAction>
            ) : action === 'export' ? (
              <ExportAction itemId={id!}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  {actionIcons[action]}
                  {actionLabels[action]}
                </DropdownMenuItem>
              </ExportAction>
            ) : action === 'copy' ? (
              <CopyAction itemId={id!}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  {actionIcons[action]}
                  {actionLabels[action]}
                </DropdownMenuItem>
              </CopyAction>
            ) : null}
            {index < actions.length - 1 && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Actions
