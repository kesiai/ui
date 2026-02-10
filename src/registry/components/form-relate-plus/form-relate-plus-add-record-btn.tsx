import * as React from 'react'
import { createAPI } from '@airiot/client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

export interface FormRelatePlusAddRecordBtnProps {
  relateSchema: {
    allowAdd?: boolean
    selectType?: 'single' | 'multiple'
    editDisabled?: boolean
    createDisabled?: boolean
  } & Record<string, any>
  tableID?: string
  input?: {
    value?: any
    onChange?: (value: any) => void
  }
  meta?: {
    data?: {
      disabled?: boolean
    }
  }
}

const FormRelatePlusAddRecordBtn: React.FC<FormRelatePlusAddRecordBtnProps> = (props) => {
  const { relateSchema, tableID, meta } = props

  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [tableSchema, setTableSchema] = React.useState<any>(null)

  // Check if button should be shown
  const isDisabled = meta?.data?.disabled ?? relateSchema.editDisabled ?? relateSchema.createDisabled ?? false

  React.useEffect(() => {
    if (open && tableID && !tableSchema) {
      setLoading(true)
      const schemaAPI = createAPI({
        resource: 'core/t/schema',
        name: 'schema'
      })

      schemaAPI.get(tableID)
        .then((res) => {
          setTableSchema(res)
          setLoading(false)
        })
        .catch((err) => {
          console.error('Failed to load table schema:', err)
          setLoading(false)
        })
    }
  }, [open, tableID, tableSchema])

  if (!relateSchema.allowAdd) return null

  // TODO: 实现表单提交处理
  // const handleSubmit = async (formData: Record<string, any>) => {
  //   if (!tableID) return
  //   const dataAPI = createAPI({
  //     resource: `core/t/${tableID}/d`,
  //     name: 'data'
  //   })
  //   const result = await dataAPI.save(formData)
  //   const newItem = { ...formData, id: result.InsertedID || result.id }
  //   if (relateSchema.selectType === 'multiple') {
  //     input?.onChange?.([...(input.value || []), newItem])
  //   } else {
  //     input?.onChange?.(newItem)
  //   }
  //   setOpen(false)
  // }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isDisabled}
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        <Plus className="h-4 w-4" />
        新增记录
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>新增记录</DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">加载中...</div>
            </div>
          ) : tableSchema ? (
            <div className="py-4">
              <p className="text-sm text-muted-foreground mb-4">
                TODO: 实现表单渲染器 - {tableSchema.name || tableSchema.title}
              </p>
              <p className="text-xs text-muted-foreground">
                表单字段: {tableSchema.schema?.fields?.map((f: any) => f.key).join(', ') || '无'}
              </p>
              {/* TODO: Implement form renderer using form-widget or similar */}
            </div>
          ) : (
            <div className="py-4 text-center text-sm text-muted-foreground">
              无法加载表单配置
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export { FormRelatePlusAddRecordBtn }
export default FormRelatePlusAddRecordBtn
