import {
  Field,
  FieldDescription,
  FieldLabel
} from "@/components/ui/field"
import type { ReactNode } from 'react'
import React, { cloneElement } from 'react'
import dayjs from 'dayjs'
import isNil from 'lodash/isNil'
import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'
import isString from 'lodash/isString'
import isNumber from 'lodash/isNumber'
import isEmpty from 'lodash/isEmpty'
import isFunction from 'lodash/isFunction'
import { CheckCircle2, XCircle, Table as TableIcon, Link2, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import ShowAttachment from '@/registry/components/view-field-show-attachment/view-field-show-attachment'
import RelateShow from '@/registry/components/view-field-relate-show/view-field-relate-show'
import RelatePlusShow from '@/registry/components/view-field-relate-plus-show/view-field-relate-plus-show'
import '@/registry/components/view-field-show-attachment/ShowAttachment.css'

// ============================================
// 基础展示组件
// ============================================

// 文本展示
const Text = ({ value }: { value: any }) => {
  if (isNil(value)) return <span className="text-muted-foreground">空</span>
  // 处理对象类型的值
  if (isObject(value) && !isArray(value)) {
    const obj = value as Record<string, any>
    // 优先显示 name，其次显示 id，最后显示 JSON
    if ('name' in obj) return <span>{obj.name}</span>
    if ('id' in obj) return <span>{obj.id}</span>
    return <span>{JSON.stringify(value)}</span>
  }
  // 处理数组类型
  if (isArray(value)) {
    const displayValues = (value as any[]).map((item: any) => {
      if (isObject(item)) {
        const obj = item as Record<string, any>
        return obj.name || obj.id || JSON.stringify(item)
      }
      return item
    })
    return <span>{displayValues.join(', ')}</span>
  }
  return <span>{value}</span>
}

// 多行文本展示
const Textarea = ({ value }: { value: any }) => {
  if (isNil(value)) return <span className="text-muted-foreground">空</span>
  // 处理对象类型的值
  if (isObject(value) && !isArray(value)) {
    const obj = value as Record<string, any>
    if ('name' in obj) return <div className="whitespace-pre-wrap break-word">{obj.name}</div>
    if ('id' in obj) return <div className="whitespace-pre-wrap break-word">{obj.id}</div>
    return <div className="whitespace-pre-wrap break-word">{JSON.stringify(value)}</div>
  }
  return <div className="whitespace-pre-wrap break-word">{value}</div>
}

// 数字展示（带格式化）
const Number = ({ value, schema }: { value: any; schema?: any }) => {
  if (isNil(value)) return <span className="text-muted-foreground">空</span>

  let displayValue = value

  // 小数位数格式化
  if (isNumber(value) && schema?.decimal) {
    displayValue = value.toFixed(schema.decimal)
  }

  // 千分位格式化
  if (schema?.bitNum) {
    try {
      return new Intl.NumberFormat('zh-CN', { notation: schema.bitNum as any }).format(displayValue)
    } catch (e) {
      // 格式化失败，返回原值
    }
  }

  return <span>{displayValue}</span>
}

// 密码展示
const Password = ({ }: { value: any }) => {
  return <span>······</span>
}

// 布尔值展示
const BooleanIcon = ({ value }: { value: any }) => {
  if (isNil(value)) return <span className="text-muted-foreground">空</span>
  return value ? (
    <CheckCircle2 className="h-5 w-5 text-green-500" />
  ) : (
    <XCircle className="h-5 w-5 text-gray-400" />
  )
}

// 选择器展示（支持颜色标签）
const Select = ({ value, schema }: { value: any; schema?: any }) => {
  if (isNil(value)) return <span className="text-muted-foreground">空</span>

  const getDisplayText = (val: any) => {
    if (schema?.enum1 && schema?.enum_title1) {
      const index = schema.enum1.indexOf(val)
      return index >= 0 ? schema.enum_title1[index] : val
    }
    return val
  }

  const getColor = (val: any) => {
    if (schema?.enum_color1 && schema?.enum1) {
      const index = schema.enum1.indexOf(val)
      return index >= 0 ? schema.enum_color1[index] : undefined
    }
    return undefined
  }

  // 多选
  if (isArray(value)) {
    return (
      <div className="flex flex-wrap gap-1">
        {value.map((item, index) => {
          const text = getDisplayText(item)
          const color = getColor(item)
          return (
            <span
              key={index}
              className={cn(
                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white",
                !color && "bg-gray-500"
              )}
              style={color ? { backgroundColor: color || 'gray' } : {}}
            >
              {text}
            </span>
          )
        })}
      </div>
    )
  }

  // 单选
  const text = getDisplayText(value)
  const color = getColor(value)
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white",
        !color && "bg-gray-500"
      )}
      style={color ? { backgroundColor: color || 'gray' } : {}}
    >
      {text}
    </span>
  )
}

// 日期格式化
const DateField = ({ value, schema }: { value: any; schema?: any }) => {
  if (isNil(value)) return <span className="text-muted-foreground">空</span>

  let format = 'YYYY-MM-DD'

  // 从 filedFormat 获取格式
  if (schema?.filedFormat) {
    format = schema.filedFormat
  } else if (schema?.format || schema?.format2) {
    // 兼容旧格式
    const formatMap: Record<string, string> = {
      'ym': 'YYYY-MM',
      'date': 'YYYY-MM-DD',
      'datetime': 'YYYY-MM-DD HH:mm:ss',
      'ymdh': 'YYYY-MM-DD HH',
    }
    format = formatMap[schema.format || schema.format2] || format
  }

  return <span>{dayjs(value).format(format)}</span>
}

// 日期范围展示
const DateRange = ({ value, schema }: { value: any; schema?: any }) => {
  if (isNil(value)) return <span className="text-muted-foreground">空</span>

  let format = 'YYYY-MM-DD'
  if (schema?.filedFormat) {
    format = schema.filedFormat
  }

  const [startDateString, endDateString] = (value || '').split(' - ')
  const endShow = endDateString
    ? dayjs(endDateString).format(format)
    : (schema?.NullShow === 'forever' ? '长期' : '至今')

  return (
    <span>
      {dayjs(startDateString).format(format)} - {endShow}
    </span>
  )
}

// 时间展示
const TimeField = ({ value }: { value: any; schema?: any }) => {
  if (isNil(value)) return <span className="text-muted-foreground">空</span>
  return <span>{value}</span>
}

// 滑块展示
const Slider = ({ value }: { value: any; schema?: any }) => {
  if (isNil(value)) return <span className="text-muted-foreground">空</span>
  return <span>{value}</span>
}

// 评分展示
const Rate = ({ value, schema }: { value: any; schema?: any }) => {
  if (isNil(value)) return <span className="text-muted-foreground">空</span>
  const max = schema?.max || 5
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "text-lg",
            i < value ? "text-yellow-400" : "text-gray-300"
          )}
        >
          ★
        </span>
      ))}
      <span className="ml-2 text-sm text-muted-foreground">({value})</span>
    </div>
  )
}

// ============================================
// TableField 类型展示组件
// ============================================

// 富文本展示
const RichText = ({ value }: { value: any }) => {
  if (isNil(value)) return <span className="text-muted-foreground">空</span>
  // 简化版：显示纯文本内容
  const text = isString(value) ? value.replace(/<[^>]*>/g, '') : ''
  if (text.length > 100) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-help">{text.substring(0, 100)}...</span>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-md break-word">{text}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
  return <span dangerouslySetInnerHTML={{ __html: value }} />
}

// 地图定位展示
const Map = ({ value }: { value: any }) => {
  if (isNil(value) || isEmpty(value)) return <span className="text-muted-foreground">空</span>

  let v = value
  if (isString(value)) {
    try {
      v = JSON.parse(value)
    } catch (e) { }
  }

  return (
    <div className="flex items-center gap-1">
      <MapPin className="h-4 w-4 text-muted-foreground" />
      <span>
        {v?.name || ''} {v?.lng !== undefined && `(${v.lng}, ${v.lat})`}
      </span>
    </div>
  )
}

// 附件上传展示
const Upload = ({ value, schema, inList }: { value: any; schema?: any; inList?: boolean }) => {
  if (isNil(value) || (isArray(value) && value.length === 0)) {
    return <span className="text-muted-foreground">空</span>
  }

  return <ShowAttachment schema={schema} value={value} inList={inList} />
}

// 链接展示
const Link = ({ value, schema }: { value: any; schema?: any }) => {
  if (isNil(value)) return <span className="text-muted-foreground">空</span>

  const handleClick = () => {
    if (schema?.linkType === 'in') {
      // 内部跳转
      console.log('Navigate to:', value)
    } else {
      window.open(value, '_blank')
    }
  }

  return (
    <a
      href="javascript:void(0);"
      onClick={handleClick}
      className="flex items-center gap-1 text-blue-600 hover:underline"
    >
      <Link2 className="h-4 w-4" />
      {value}
    </a>
  )
}

// 序列号展示
const SerialNumber = ({ value }: { value: any }) => {
  if (isNil(value)) return <span className="text-muted-foreground">空</span>
  return <span className="font-mono">{value}</span>
}

// 用户角色展示
const UserRole = ({ value }: { value: any }) => {
  if (isNil(value)) return <span className="text-muted-foreground">空</span>

  if (isArray(value)) {
    return (
      <div className="flex flex-wrap gap-1">
        {value.map((item: any, index: number) => (
          <span
            key={index}
            className="inline-block border rounded px-2 py-0.5 text-xs"
          >
            {item?.name || item}
          </span>
        ))}
      </div>
    )
  }

  return <span>{value?.name || value}</span>
}

// 字节数组展示
const BytesArray = ({ value }: { value: any }) => {
  if (isNil(value)) return <span className="text-muted-foreground">空</span>
  return <span className="font-mono text-xs">{value}</span>
}

// 查找引用展示
const Reference = ({ value, schema }: { value: any; schema?: any }) => {
  if (value === 'computing') {
    return <span>计算中...</span>
  }

  if (isNil(value)) {
    return <span className="text-muted-foreground">空</span>
  }

  const fieldKey = schema?.searchRelate?.field?.key
  const fSchema = schema?.searchRelate?.field?.fieldSchema

  let displayValue = value

  // 排序
  if (['asc', 'desc'].includes(schema?.sort || '') && isArray(displayValue)) {
    displayValue = [...displayValue].sort((a, b) => {
      if (schema.sort === 'asc') return (a[fieldKey] || '') > (b[fieldKey] || '') ? 1 : -1
      return (a[fieldKey] || '') < (b[fieldKey] || '') ? 1 : -1
    })
  }

  // 条数限制
  if (schema?.numberLimit > 0 && isArray(displayValue)) {
    displayValue = displayValue.slice(0, schema.numberLimit)
  }

  // 数组渲染
  if (isArray(displayValue)) {
    return (
      <div className="flex flex-wrap gap-1">
        {displayValue.map((v: any, index: number) => {
          const val = v[fieldKey]
          const nf = schema?.numberFormat

          // 计数情况
          if (schema?.computeMethod === 'count') {
            return (
              <span key={index} className="inline-block border rounded px-2 py-0.5 text-xs">
                {val}
              </span>
            )
          }

          // 数字格式化
          if (nf && isNumber(val)) {
            let formattedVal: any = val
            if (nf === 'int') formattedVal = Math.round(val)
            else if (nf === 'float1') formattedVal = val.toFixed(1)
            else if (nf === 'float2') formattedVal = val.toFixed(2)
            else if (nf === '%') formattedVal = Math.round(val * 100) + '%'
            else if (nf === '%2') formattedVal = (val * 100) + '%'
            else formattedVal = dayjs(val).format(nf)

            return (
              <span key={index} className="inline-block border rounded px-2 py-0.5 text-xs">
                {formattedVal}
              </span>
            )
          }

          // 日期格式化
          if (nf) {
            return (
              <span key={index} className="inline-block border rounded px-2 py-0.5 text-xs">
                {dayjs(val).format(nf)}
              </span>
            )
          }

          // 布尔值
          if (fSchema?.type === 'boolean') {
            return (
              <span key={index} className="inline-flex items-center">
                <BooleanIcon value={val} />
              </span>
            )
          }

          // 默认
          return (
            <span key={index} className="inline-block border rounded px-2 py-0.5 text-xs">
              {val}
            </span>
          )
        })}
      </div>
    )
  }

  // 单值渲染
  return <span>{displayValue}</span>
}

// 表单信息展示
const FormInfo = ({ value }: { value: any; schema?: any }) => {
  if (isNil(value)) return <span className="text-muted-foreground">空</span>
  // 简化版：直接显示值
  return <span>{String(value)}</span>
}

// ============================================
// 可编辑表格展示组件（迁移自旧版 ShowTable.js）
// ============================================

// 默认渲染组件
const DefaultRender = ({ value }: { value: any }) => {
  return <span>{value ?? ''}</span>
}

// 卡片展示组件
const CardComponent = ({
  value,
  schema,
}: {
  value: any[]
  schema: any
}) => {
  const { tableFields, cardLayout, defaultVal } = schema || {}
  const cardValue = value || defaultVal || []

  if (!isArray(cardValue) || cardValue.length === 0) {
    return <span className="text-muted-foreground">暂无数据</span>
  }

  // 根据 cardLayout 确定列宽：1=全宽，2=半宽，3=三分之一
  const getColSpan = () => {
    if (cardLayout === '1') return 'w-full'
    if (cardLayout === '2') return 'w-1/2'
    return 'w-1/3'
  }

  const colSpanClass = getColSpan()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cardValue.map((item: any, index: number) => (
        <div
          key={index}
          className={cardLayout === '1' ? 'col-span-full' : cardLayout === '2' ? 'col-span-1' : 'col-span-1'}
        >
          <div className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow">
            {tableFields?.form?.map((key: string) => {
              const fieldSchema = tableFields.properties?.[key]
              if (!fieldSchema) return null

              return (
                <div key={key} className="mb-2 last:mb-0">
                  <label className="text-sm font-medium text-muted-foreground">
                    {fieldSchema.title || key}
                  </label>
                  <div className="mt-1">
                    <ViewFieldRender
                      type={fieldSchema.fieldType}
                      value={item?.[key]}
                      schema={fieldSchema}
                      inList={true}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// 表格展示组件
const TableComponent = ({
  value,
  schema,
}: {
  value: any[]
  schema: any
}) => {
  const { tableFields, showPagination } = schema || {}

  if (!isArray(value) || value.length === 0) {
    return <span className="text-muted-foreground">暂无数据</span>
  }

  // 构建列配置
  const columns = tableFields?.form?.map((key: string) => {
    const fieldSchema = tableFields.properties?.[key]
    return {
      key: fieldSchema?.key || key,
      dataIndex: fieldSchema?.key || key,
      title: fieldSchema?.title || key,
      width: fieldSchema?.fieldType === 'attachments' ? 270 : 150,
      fieldType: fieldSchema?.fieldType,
      fieldSchema,
    }
  }) || []

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-slate-200 dark:border-slate-700">
        <thead>
          <tr className="bg-slate-100 dark:bg-slate-800">
            {columns.map((col) => (
              <th
                key={col.key}
                className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-left text-sm font-medium"
                style={{ width: col.width }}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {value.map((row: any, rowIndex: number) => (
            <tr key={rowIndex} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm"
                >
                  <ViewFieldRender
                    type={col.fieldType}
                    value={row?.[col.dataIndex]}
                    schema={col.fieldSchema}
                    inList={true}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// 可编辑表格展示（主组件）
const EditableTable = ({ value, schema, inList = true }: { value: any; schema?: any; inList?: boolean }) => {
  const [open, setOpen] = React.useState(false)

  // 解析 value（可能是 JSON 字符串）
  let tableValue = value
  if (isString(value)) {
    try {
      tableValue = JSON.parse(value)
    } catch (e) {
      console.error('表格数据格式问题', value)
      tableValue = []
    }
  }

  // 合并 defaultVal
  const displayValue = tableValue || schema?.defaultVal || []

  if (!isArray(displayValue) || displayValue.length === 0) {
    return <span className="text-muted-foreground">空</span>
  }

  const displayForm = schema?.displayForm || 'grid'
  const title = schema?.title || '表格内容'

  // 列表中的展示（点击打开弹窗）
  if (inList) {
    return (
      <>
        <div
          className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
          onClick={() => setOpen(true)}
        >
          <TableIcon className="h-4 w-4" />
          <span>{displayValue.length}</span>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-6xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            {displayForm === 'card' ? (
              <CardComponent value={displayValue} schema={schema} />
            ) : (
              <TableComponent value={displayValue} schema={schema} />
            )}
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // 直接展示
  return displayForm === 'card' ? (
    <CardComponent value={displayValue} schema={schema} />
  ) : (
    <TableComponent value={displayValue} schema={schema} />
  )
}

// 关联字段 Plus 展示
const RelatePlus = ({ value, schema, inList }: { value: any; schema?: any; inList?: boolean }) => {
  return <RelatePlusShow value={value} schema={schema} inList={inList} />
}

// 关联字段展示
const Relate = ({ value, schema, inList }: { value: any; schema?: any; inList?: boolean }) => {
  return <RelateShow value={value} schema={schema} inList={inList} />
}

// ============================================
// 特殊类型展示组件
// ============================================

// 公式展示
const Formula = ({ value }: { value: any }) => {
  if (isString(value) || isNumber(value)) {
    return <span>{value}</span>
  } else if (isArray(value) && (isString(value[0]) || isNumber(value[0]))) {
    return <span>{value.join(',')}</span>
  } else if (isArray(value) || isObject(value)) {
    let str = JSON.stringify(value)
    if (str.length > 50) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help">{str.substring(0, 50)}...</span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-md break-word">{str}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }
    return <span>{str}</span>
  }
  return <span></span>
}

// 字段渲染脚本
const ScriptRender = ({ value, schema }: { value: any; schema?: any }) => {
  const [content, setContent] = React.useState('')
  const [error, setError] = React.useState(false)

  React.useEffect(() => {
    let renderVal: any
    let result: any = ''
    try {
      if (schema?.fieldRenderScript) {
        const fn = new Function('{ value }', 'let renderVal;' + schema.fieldRenderScript + ';return renderVal')
        renderVal = fn({ value })
      }
      if (schema?.allScript) {
        const fn = new Function('{ value }', "return " + schema.allScript)
        const frs = fn({ value })?.renderVal
        if (frs) renderVal = frs
      }
      if (renderVal && isFunction(renderVal)) {
        result = renderVal({ value })
      }
      if (result && isFunction(result.then)) {
        result.then((val: any) => setContent(val))
      } else {
        setContent(result)
      }
    } catch (e) {
      console.error('字段渲染脚本报错', e)
      setError(true)
    }
  }, [value, schema])

  if (error) {
    return <span className="text-red-500">字段渲染脚本错误</span>
  }

  if (isString(content)) {
    return <span dangerouslySetInnerHTML={{ __html: content }} />
  } else if (isNil(content)) {
    return null
  }

  return <span>{content}</span>
}

// ============================================
// 字段类型映射
// ============================================

const fieldMap: { [key: string]: React.ComponentType<any> } = {
  // 基础类型（融合 TableField 类型）
  'text': Text,
  'textarea': Textarea,
  'number': Number,
  'password': Password,
  'select': Select,
  'checkbox': BooleanIcon, // 复选框显示为布尔值
  'radio': Select, // 单选框复用选择器逻辑
  'switch': BooleanIcon, // 开关显示为布尔值
  'slider': Slider,
  'date': DateField,
  'date-range': DateRange,
  'time': TimeField,
  'rate': Rate,
  'rich-text': RichText,
  'map': Map,
  'upload': Upload,
  'link': Link,
  'serial-number': SerialNumber,
  'user-role': UserRole,
  'bytes-array': BytesArray,
  'form-info': FormInfo,
  'editable-table': EditableTable,
  'relate-plus': RelatePlus,
  'relate': Relate,

  // 特殊类型
  'formula': Formula,
  'script': ScriptRender,
  'reference': Reference,
  'boolean': BooleanIcon,
}

// ============================================
// 统一字段渲染入口
// ============================================

export const ViewFieldRender = ({ value, schema, tableSchema, ...props }: any) => {

  const fieldType = tableSchema?.fieldType || schema?.fieldType

  const mergeSchema = { ...schema, ...tableSchema }
  // console.log(fieldType, mergeSchema)
  // 判断公式
  if (mergeSchema?.textContent === 'logic' || fieldType === '公式') {
    const FormulaComponent = fieldMap['formula']
    return <FormulaComponent value={value} schema={schema} {...props} />
  }

  // 判断查找引用
  if (fieldType === '查找引用') {
    const ReferenceComponent = fieldMap['reference']
    return <ReferenceComponent value={value} schema={schema} {...props} />
  }

  // 获取对应的组件
  const FieldComponent = fieldMap[fieldType] || fieldMap['text']

  return <FieldComponent value={value} schema={mergeSchema} {...props} />
}

// ============================================
// ViewField 主组件
// ============================================

type ViewFieldProps = {
  value: any
  item: any
  schema?: any
  tableSchame?: any
  children?: ReactNode | ((props: any) => ReactNode)
  [key: string]: any
}

const ViewField = ({ children, schema, ...restProps }: ViewFieldProps) => {
  const childrenProps = { schema, ...restProps }
  return (
    children ? (typeof children === 'function' ? children(childrenProps) : cloneElement(children as React.ReactElement<any>, childrenProps)) : (
      <ViewFieldRender {...childrenProps} />
    )
  )
}

export default ViewField
