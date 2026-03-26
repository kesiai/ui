import React from 'react'
import { useModelGet } from '@airiot/client'
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Loader2 } from 'lucide-react'
import SchemaForm from '@/registry/components/schema-form/schema-form'
import { tableConverter } from "@/registry/lib/view-table-converter";
interface ViewDetailContentProps {
  itemId: string
}

const ViewDetailContent: React.FC<ViewDetailContentProps> = ({ itemId }) => {
  const { data, loading, model } = useModelGet({ id: itemId })

  const formId = `view-form-${itemId}`

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {data
            ? (model.displayField && data[model.displayField]) || data?._label || data?.name
            : model?.title}
        </DialogTitle>
      </DialogHeader>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : data ? (
        <ScrollArea className="max-h-[70vh] pr-3">
          <SchemaForm
            formId={formId}
            defaultValues={data}
            schema={model}
            schameConvert={tableConverter}
            formSchema={model.formSchema}
          />
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

export { ViewDetailContent }
