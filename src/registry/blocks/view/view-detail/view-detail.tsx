import React, { useState } from 'react'
import { useModelItem, useModelGet, useModel, useFormSchema } from '@airiot/client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Loader2 } from 'lucide-react'

interface ViewDetailProps {
  modelId?: string
  itemId?: string
  fields?: Array<{
    key: string
    label: string
    type?: 'text' | 'number' | 'date' | 'boolean' | 'json'
    render?: (value: any, record: any) => React.ReactNode
  }>
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  readonly?: boolean
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const ViewDetail: React.FC<ViewDetailProps> = ({
  itemId,
  size = 'lg',
  trigger,
  open: controlledOpen,
  onOpenChange
}) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const { title, data, loading, model } = useModelGet({ id: itemId })
  const { fields } = useFormSchema({ schema: model })

  // 渲染字段值
  const renderValue = (field: any, record: any) => {
    const value = record?.[field.key]

    if (field.render) {
      return field.render(value, record)
    }

    if (field.type === 'boolean') {
      return value ? (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          是
        </Badge>
      ) : (
        <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-300">
          否
        </Badge>
      )
    }

    if (field.type === 'date') {
      return value ? new Date(value).toLocaleString('zh-CN') : '-'
    }

    if (field.type === 'json') {
      return (
        <pre className="text-xs bg-slate-100 p-2 rounded overflow-auto max-h-32">
          {JSON.stringify(value, null, 2)}
        </pre>
      )
    }

    if (field.type === 'number') {
      return value?.toLocaleString() ?? '-'
    }

    return value || '-'
  }

  const content = (
    <DialogContent className={size}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : data ? (
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-4 pr-4">
            {fields.map((field, index) => (
              <div key={field.key} className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">
                    {field.label}
                  </label>
                </div>
                <div className="text-sm text-slate-900">
                  {renderValue(field, data)}
                </div>
                {index < fields.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
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
          <Button
            variant="outline"
          >
            关闭
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )

  if (trigger) {
    return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      {content}
    </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange || setInternalOpen}>
      {content}
    </Dialog>
  )
}

export default ViewDetail
