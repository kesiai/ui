import React from 'react'
import isArray from 'lodash/isArray'
import isString from 'lodash/isString'
import isObject from 'lodash/isObject'
import isNil from 'lodash/isNil'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ExternalLink } from 'lucide-react'
import { createAPI } from '@airiot/client'

// ============================================
// 工具函数
// ============================================

// 解析 JSON 字符串
function parseJsonString(data: any): any {
  if (!data) return data
  if (isString(data)) {
    try {
      const parsed = JSON.parse(data)
      if (isObject(parsed) && parsed !== null) {
        return parseJsonString(parsed)
      }
      return data
    } catch (e) {
      return data
    }
  }
  if (isArray(data)) {
    return data.map(item => parseJsonString(item))
  }
  if (isObject(data) && data !== null) {
    Object.keys(data).forEach((key) => {
      ;(data as any)[key] = parseJsonString((data as any)[key])
    })
    return data
  }
  return data
}

// ============================================
// 详情展示组件
// ============================================

interface DetailData {
  title: string
  value: any
}

const DetailShow: React.FC<{
  children: React.ReactNode
  schema?: any
  value: any
}> = ({ children, schema, value }) => {
  const [open, setOpen] = React.useState(false)
  const [detailData, setDetailData] = React.useState<DetailData[]>([])
  const [loading, setLoading] = React.useState(false)

  const getDetailData = async () => {
    setLoading(true)
    try {
      const schemaAPI = createAPI({ resource: 'core/t/schema', name: 'schema' })
      const dataAPI = createAPI({ resource: `core/t/${schema?.relateSchema?.id}/d`, name: 'data' })

      // 获取关联表结构
      const relateTable = await schemaAPI.get(schema?.relateSchema?.id) as any
      if (!relateTable?.schema) {
        console.error('该表已被删除')
        setLoading(false)
        return
      }

      // 获取详情数据
      const data = await dataAPI.get(value?.id) as any
      if (isNil(data) || Object.keys(data).length === 0) {
        console.error('该条数据已被删除')
        setLoading(false)
        return
      }

      // 构建详情数据
      const result: DetailData[] = []
      if (schema?.recordDetail?.showField && isArray(schema.recordDetail.showField)) {
        schema.recordDetail.showField.forEach((key: string) => {
          const fieldSchema: any = relateTable.schema.properties[key]
          const fieldValue = data?.[key]
          result.push({
            title: fieldSchema?.title || key,
            value: isObject(fieldValue) ? (fieldValue as any).name : fieldValue
          })
        })
      }

      setDetailData(result)
      setLoading(false)
    } catch (e) {
      console.error('获取数据失败', e)
      setLoading(false)
    }
  }

  if (!value?.id) {
    return <>{children || ''}</>
  }

  const showType = schema?.recordDetail?.showType

  // Popover 展示
  if (showType === 'popover') {
    return (
      <TooltipProvider>
        <Tooltip open={open} onOpenChange={setOpen}>
          <TooltipTrigger asChild onClick={getDetailData}>
            <span className="detail-span cursor-pointer text-blue-600 hover:underline inline-flex items-center gap-1">
              {children}
            </span>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-md max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="p-4">加载中...</div>
            ) : (
              <div className="space-y-2">
                {detailData.map((item, index) => (
                  <div key={index} className="flex min-h-[35px]">
                    <span className="w-24 text-slate-600">{item.title}：</span>
                    <span className="flex-1">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Modal 展示
  if (showType === 'modal') {
    return (
      <>
        <span
          className="detail-span cursor-pointer text-blue-600 hover:underline inline-flex items-center gap-1"
          onClick={() => {
            getDetailData()
            setOpen(true)
          }}
        >
          {children}
        </span>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>记录详情</DialogTitle>
            </DialogHeader>
            {loading ? (
              <div className="p-4 text-center">加载中...</div>
            ) : (
              <div className="space-y-2">
                {detailData.map((item, index) => (
                  <div key={index} className="flex min-h-[35px]">
                    <span className="w-32 text-slate-600">{item.title}：</span>
                    <span className="flex-1">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // 页面跳转展示
  if (showType === 'page') {
    return (
      <span
        className="detail-span cursor-pointer text-blue-600 hover:underline inline-flex items-center gap-1"
        onClick={() => {
          const url = `/app/table/${schema?.relateSchema?.id}/${value?.id}/detail`
          window.open(url, '_blank')
        }}
      >
        {children}
        <ExternalLink className="h-3 w-3" />
      </span>
    )
  }

  // 默认返回子元素
  return <>{children || ''}</>
}

// ============================================
// 卡片展示组件
// ============================================

const RelateCard: React.FC<{
  value: any
  relateFields?: any[]
  displayField?: string
}> = ({ value, relateFields, displayField = 'name' }) => {
  const parsedValue = parseJsonString(value)

  if (!relateFields || relateFields.length === 0) {
    return (
      <span className="inline-block border rounded px-2 py-1 text-xs bg-slate-50">
        {parsedValue?.[displayField] || parsedValue?.id || ''}
      </span>
    )
  }

  return (
    <div className="inline-block bg-slate-50 rounded border p-2 mr-2 mt-2 align-top" style={{ width: 'calc(50% - 10px)' }}>
      <div className="font-medium text-sm mb-1">{parsedValue?.[displayField] || parsedValue?.id || ''}</div>
      {relateFields.map((field: any, index: number) => {
        const fieldValue = parsedValue?.[field.key]
        const displayValue = isObject(fieldValue) ? (fieldValue as any).name : fieldValue

        return (
          <div key={index} className="text-xs text-slate-600 flex">
            <span className="mr-2">{field.title}：</span>
            <span className="flex-1 truncate">{displayValue}</span>
          </div>
        )
      })}
    </div>
  )
}

// ============================================
// 关联字段展示主组件
// ============================================

export interface RelateShowProps {
  value: any
  schema?: any
  inList?: boolean
}

const RelateShow: React.FC<RelateShowProps> = ({ value, schema, inList }) => {
  // 数据表单选 (object type)
  if (schema?.type === 'object' && schema?.relateSchema?.tableType === 'table') {
    const field = schema.relateSchema.fields && schema.relateSchema.fields[0]
    let v = value
    if (isString(value)) {
      try {
        v = JSON.parse(value)
      } catch (e) {}
    }

    const fieldValue = v?.[field?.key]
    const displayValue = isObject(fieldValue) ? (fieldValue as any).name : fieldValue

    return (
      <DetailShow schema={schema} value={v}>
        <span>{displayValue || ''}</span>
      </DetailShow>
    )
  }

  // 数据表多选 (array type)
  if (schema?.type === 'array' && schema?.relateSchema?.tableType === 'table') {
    const field = schema.relateSchema.fields && schema.relateSchema.fields[0]
    let v = value
    if (isString(value)) {
      try {
        v = JSON.parse(value)
      } catch (e) {}
    }

    if (!isArray(v) || v.length === 0) {
      return <span className="text-muted-foreground">空</span>
    }

    // 表格展示模式
    if (schema.showType === 'table') {
      return (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{v.length} 条数据</span>
        </div>
      )
    }

    // 卡片展示模式
    if (schema.showType === 'card' && schema.relateShowFields?.length > 0 && !inList) {
      return (
        <div className="flex flex-wrap">
          {v.map((item: any, index: number) => (
            <RelateCard
              key={index}
              value={item}
              relateFields={schema.relateShowFields}
              displayField={field?.displayField}
            />
          ))}
        </div>
      )
    }

    // 默认列表展示模式
    return (
      <div className="flex flex-wrap gap-1">
        {v.map((item: any, index: number) => {
          const fieldValue = item?.[field?.key]
          const displayValue = isObject(fieldValue) ? (fieldValue as any).name : fieldValue

          return (
            <React.Fragment key={index}>
              <DetailShow schema={schema} value={item}>
                <span className="inline-block border rounded px-2 py-1 text-xs bg-slate-50">
                  {displayValue || ''}
                </span>
              </DetailShow>
              {index < v.length - 1 && <span>, </span>}
            </React.Fragment>
          )
        })}
      </div>
    )
  }

  // 兼容旧格式（内部表 User/Role/Department）
  const showField = schema?.showField || 'name'

  if (isArray(value)) {
    return (
      <div className="flex flex-wrap gap-1">
        {value.map((item: any, index: number) => (
          <span
            key={index}
            className="inline-block border rounded px-2 py-1 text-xs bg-slate-50"
          >
            {item?.[showField] || item}
          </span>
        ))}
      </div>
    )
  }

  return <span>{(value as any)?.[showField] || value}</span>
}

export default RelateShow
