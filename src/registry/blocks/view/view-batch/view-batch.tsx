import React, { useState } from 'react'
import { pick, omit, find, isNil, isEmpty } from 'lodash'
import { useModelDelete, useModelSave, useModelGetItems, useModel, useModelSelect, useModelCallback } from '@airiot/client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Loader2, Trash2, Edit } from 'lucide-react'
import SchemaForm from '@/registry/blocks/form/schema-form/schema-form'

// ==================== Content Components ====================
// 这些组件只有在 Dialog 打开时才会渲染，从而触发数据加载

interface BatchDeleteContentProps {
  onClose?: () => void
}

const BatchDeleteContent: React.FC<BatchDeleteContentProps> = ({
  onClose
}) => {
  const { deleteItem } = useModelDelete()
  const { getItems } = useModelGetItems()
  const { selected } = useModelSelect<{ id: string, [key: string]: any }>()
  const { model } = useModel()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      // 批量删除
      await Promise.all(selected.map(item => deleteItem(item.id)))
      // 刷新列表
      await getItems()
      onClose?.()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>确认批量删除</DialogTitle>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="text-sm text-slate-600">
          确定要删除选中的 <Badge variant="destructive">{selected.length}</Badge> 项数据吗？此操作不可撤销。
        </div>

        {selected && selected.length > 0 && (
          <ScrollArea className="max-h-[60vh] border rounded-lg">
            <div className="p-4 space-y-2 pr-4">
              {selected.map((item) => (
                <div key={item.id} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded">
                  <div className="flex-1">
                    {model.displayField && item[model.displayField] || item._label || item.name || item.id}
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" disabled={deleting}>
            取消
          </Button>
        </DialogClose>
        <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
          {deleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          确认删除
        </Button>
      </DialogFooter>
    </>
  )
}

interface BatchChangeContentProps {
  onClose?: () => void
}

const BatchChangeContent: React.FC<BatchChangeContentProps> = ({
  onClose
}) => {
  const { model } = useModel()
  const { saveItem } = useModelSave()
  const { getItems } = useModelGetItems()
  const { selected } = useModelSelect<{ id: string, [key: string]: any }>()
  const [saving, setSaving] = useState(false)
  const fields = (model.batchChangeFields || ['name', 'money']) as string[]
  const fs = fields.map(f => f.split('.')[0])
  const formSchema = model.form !== undefined ? fs.map(name => find(model.form, f => f && (f == name || f.key == name || f.name == name)) || name) : ['*']
  const formId = `batch-change-form-${Date.now()}`

  const handleSubmit = useModelCallback(async (_get, set, atoms, values: any) => {
    setSaving(true)
    try {
      // 批量修改：传递 ids 和要修改的字段值
      let ret = await Promise.all(selected.map(item => saveItem({ id: item.id, ...values }, true)))
      // 刷新列表
      if(isNil(ret) || isEmpty(ret)) {
        getItems()
      } else {
        ret.forEach(item => set(atoms.item(item.id), item))
      }
      onClose?.()
    } finally {
      setSaving(false)
    }
  }, [selected, saveItem, getItems, onClose])

  return (
    <>
      <DialogHeader>
        <DialogTitle>批量修改</DialogTitle>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="text-sm text-slate-600">
          已选择 <Badge variant="secondary">{selected.length}</Badge> 项数据，请输入要修改的字段值。
        </div>

        <ScrollArea className="max-h-[60vh] pr-3">
          <SchemaForm
            formId={formId}
            schema={omit({
              ...model,
              properties: pick(model.properties, fs),
              form: formSchema
            }, 'required')}
            formSchema={formSchema}
            onSubmit={handleSubmit}
          />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" disabled={saving}>
            取消
          </Button>
        </DialogClose>
        <Button form={formId} type="submit" disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          确认修改
        </Button>
      </DialogFooter>
    </>
  )
}

// ==================== Batch Actions Components ====================

interface BaseBatchActionProps {
  children?: React.ReactNode
}

export const BatchDeleteAction: React.FC<BaseBatchActionProps> = ({
  children
}) => {
  const [open, setOpen] = useState(false)

  const trigger = children || (
    <Button variant="ghost" size="sm">
      <Trash2 className="h-4 w-4" />
      批量删除
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <BatchDeleteContent
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

export const BatchChangeAction: React.FC<BaseBatchActionProps> = ({
  children
}) => {
  const [open, setOpen] = useState(false)

  const trigger = children || (
    <Button variant="ghost" size="sm">
      <Edit className="h-4 w-4" />
      批量修改
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <BatchChangeContent
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

// ==================== BatchActions Container Component ====================

export type BatchActionType = 'batch-delete' | 'batch-change'

interface BatchActionsProps {
  actions: BatchActionType[]
  variant?: 'buttons' | 'dropdown'
  disabled?: boolean
  children?: React.ReactNode
}

const BatchActions: React.FC<BatchActionsProps> = ({
  actions = ['batch-delete', 'batch-change'],
  variant = 'dropdown',
  disabled = false,
  children
}) => {
  const actionLabels: Record<BatchActionType, string> = {
    'batch-delete': '批量删除',
    'batch-change': '批量修改'
  }

  const actionIcons: Record<BatchActionType, React.ReactNode> = {
    'batch-delete': <Trash2 className="h-4 w-4" />,
    'batch-change': <Edit className="h-4 w-4" />
  }
  const { selected } = useModelSelect<{ id: string }>()
  const isDisabled = disabled || selected.length === 0

  // Render as button group
  if (variant === 'buttons') {
    return (
      <div className="flex items-center gap-2">
        {selected.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            已选 {selected.length} 项
          </Badge>
        )}
        {actions.map((action) => (
          action === 'batch-delete' ? (
            <BatchDeleteAction key={action} />
          ) : action === 'batch-change' ? (
            <BatchChangeAction key={action} />
          ) : null
        ))}
        {children}
      </div>
    )
  }

  // Render as dropdown menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isDisabled}>
          批量操作
          {selected.length > 0 && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {selected.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((action, index) => (
          <React.Fragment key={action}>
            {action === 'batch-delete' ? (
              <BatchDeleteAction>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  {actionIcons[action]}
                  {actionLabels[action]}
                </DropdownMenuItem>
              </BatchDeleteAction>
            ) : action === 'batch-change' ? (
              <BatchChangeAction>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  {actionIcons[action]}
                  {actionLabels[action]}
                </DropdownMenuItem>
              </BatchChangeAction>
            ) : null}
            {index < actions.length - 1 && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default BatchActions
