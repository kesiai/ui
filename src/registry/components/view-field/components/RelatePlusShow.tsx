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
import { ChevronDown, ChevronUp, Table as TableIcon } from 'lucide-react'
import { ViewFieldRender } from '@/registry/components/view-field/field-map'

// ============================================
// 工具函数
// ============================================

// 递归解析 JSON 字符串
function parseJsonStrings(data: any): any {
  if (!data) return data

  const clonedData: any = JSON.parse(JSON.stringify(data))

  const processValue = (value: any): any => {
    if (isString(value)) {
      try {
        const parsed = JSON.parse(value)
        if (isObject(parsed) && parsed !== null) {
          return processValue(parsed)
        }
        return value
      } catch (e) {
        return value
      }
    }

    if (isArray(value)) {
      return value.map(item => processValue(item))
    }

    if (isObject(value) && value !== null) {
      Object.keys(value).forEach(key => {
        ;(value as any)[key] = processValue((value as any)[key])
      })
      return value
    }

    return value
  }

  return processValue(clonedData)
}

// ============================================
// 单条记录展示
// ============================================

const ItemShow: React.FC<{
  relateSchema: any
  val: any
  field?: any
  detailPage?: boolean
}> = ({ relateSchema, val, field, detailPage }) => {
  const displayField = field?.displayField || 'name'

  // 详情页模式
  if (detailPage) {
    return (
      <div className="inline-block bg-slate-50 rounded border p-3 mr-2 mt-2 align-top" style={{ width: 500 }}>
        <div className="flex mb-2">
          <span className="w-24 text-slate-600">记录编号：</span>
          <span className="flex-1">{val.id}</span>
        </div>
        {relateSchema.relateShowFields?.map((f: any, index: number) => (
          <div key={index} className="flex">
            <span className="w-24 text-slate-600">{f.title}：</span>
            <span className="flex-1">
              <ViewFieldRender
                value={val[f.key]}
                schema={f.fieldSchema}
                type={f.fieldSchema?.fieldType}
              />
            </span>
          </div>
        ))}
      </div>
    )
  }

  // 多字段展示模式
  if (relateSchema.relateShowFields?.length > 0) {
    return (
      <div className="inline-block bg-slate-50 rounded border p-2 mr-2 mt-2 align-top" style={{ width: 'calc(50% - 10px)' }}>
        <div className="font-medium text-sm mb-1">{val[displayField]}</div>
        {relateSchema.relateShowFields.map((f: any, index: number) => (
          <div key={index} className="text-xs text-slate-600 flex">
            <span className="w-20">{f.title}：</span>
            <span className="flex-1 truncate">
              <ViewFieldRender
                value={val[f.key]}
                schema={f.fieldSchema}
                type={f.fieldSchema?.fieldType}
              />
            </span>
          </div>
        ))}
      </div>
    )
  }

  // 默认标签模式
  return (
    <span className="inline-block border rounded px-2 py-1 text-xs bg-slate-50">
      {val[displayField]}
    </span>
  )
}

// ============================================
// 表格展示模式
// ============================================

const TableShow: React.FC<{
  relateSchema: any
  val: any[]
  field?: any
}> = ({ relateSchema, val, field }) => {
  const [open, setOpen] = React.useState(false)

  if (!isArray(val) || val.length === 0) {
    return <span className="text-muted-foreground">空</span>
  }

  // 获取显示字段
  const getDisplayFields = () => {
    const fields: any[] = []
    if (field?.displayField) {
      fields.push({ key: field.displayField, title: '名称' })
    }
    if (relateSchema?.showField) {
      fields.push({ key: relateSchema.showField, title: relateSchema.showField })
    }
    if (field?.relateShowFields?.length > 0) {
      fields.push(...field.relateShowFields)
    }
    return fields.filter(f => f.key)
  }

  const displayFields = getDisplayFields()

  if (displayFields.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{val.length} 条数据</span>
      </div>
    )
  }

  return (
    <>
      <div
        className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
        onClick={() => setOpen(true)}
      >
        <TableIcon className="h-4 w-4" />
        <span>{val.length} 条数据</span>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>关联数据</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100">
                  {displayFields.map((field) => (
                    <th
                      key={field.key}
                      className="border border-slate-200 px-4 py-2 text-left text-sm font-medium"
                    >
                      {field.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {val.map((row: any, index: number) => (
                  <tr key={index}>
                    {displayFields.map((field) => (
                      <td
                        key={field.key}
                        className="border border-slate-200 px-4 py-2 text-sm"
                      >
                        <ViewFieldRender
                          value={row[field.key]}
                          schema={{ title: field.title }}
                          type="text"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// ============================================
// 关联字段 Plus 主组件
// ============================================

export interface RelatePlusShowProps {
  value: any
  schema?: any
  inList?: boolean
}

const RelatePlusShow: React.FC<RelatePlusShowProps> = ({ value, schema, inList }) => {
  const [expand, setExpand] = React.useState(false)

  if (isNil(value)) {
    return <span className="text-muted-foreground">空</span>
  }

  const showType = schema?.showType || 'select'

  // Card 模式
  if (showType === 'card') {
    const items = isArray(value) ? value : [value]
    const parsedItems = items.map(item => parseJsonStrings(item))

    // 列表中最多显示 6 条
    if (inList) {
      const displayItems = parsedItems.slice(0, 6)
      return (
        <div className="flex flex-wrap">
          {displayItems.map((item: any, index: number) => (
            <ItemShow
              key={index}
              relateSchema={schema}
              val={item}
              field={{ displayField: schema?.displayField || 'name' }}
            />
          ))}
          {items.length > 6 && (
            <div className="text-blue-600 cursor-pointer text-sm ml-2 mt-3">
              +{items.length - 6} 条
            </div>
          )}
        </div>
      )
    }

    // 非列表模式，支持展开/收起
    const displayList = expand ? parsedItems : parsedItems.slice(0, 6)

    return (
      <div className="m-1">
        {displayList.map((item: any, index: number) => (
          <ItemShow
            key={index}
            relateSchema={schema}
            val={item}
            field={{ displayField: schema?.displayField || 'name' }}
            detailPage={schema?.detailPage}
          />
        ))}
        {items.length > 6 && (
          <div
            className="text-blue-600 cursor-pointer text-sm mt-2"
            onClick={() => setExpand(!expand)}
          >
            {expand ? (
              <>
                收起（共 {items.length} 条）
                <ChevronUp className="h-4 w-4 inline ml-1" />
              </>
            ) : (
              <>
                展开更多（共 {items.length} 条）
                <ChevronDown className="h-4 w-4 inline ml-1" />
              </>
            )}
          </div>
        )}
      </div>
    )
  }

  // Table 模式
  if (showType === 'table') {
    const items = isArray(value) ? value : [value]
    const parsedItems = items.map(item => parseJsonStrings(item))
    return (
      <TableShow
        relateSchema={schema}
        val={parsedItems}
        field={{ displayField: schema?.displayField || 'name' }}
      />
    )
  }

  // 默认展示
  const items = isArray(value) ? value : [value]
  return (
    <div className="flex flex-wrap gap-1">
      {items.map((item: any, index: number) => (
        <span
          key={index}
          className="inline-block border rounded px-2 py-1 text-xs bg-slate-50"
        >
          {item?.name || item}
        </span>
      ))}
    </div>
  )
}

export default RelatePlusShow
