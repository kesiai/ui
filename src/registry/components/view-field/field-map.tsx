import React from 'react'
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
import ShowAttachment from './components/ShowAttachment'
import RelateShow from './components/RelateShow'
import RelatePlusShow from './components/RelatePlusShow'
import './components/ShowAttachment.css'

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
    if ('name' in obj) return <div className="whitespace-pre-wrap break-words">{obj.name}</div>
    if ('id' in obj) return <div className="whitespace-pre-wrap break-words">{obj.id}</div>
    return <div className="whitespace-pre-wrap break-words">{JSON.stringify(value)}</div>
  }
  return <div className="whitespace-pre-wrap break-words">{value}</div>
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
const Password = ({ value }: { value: any }) => {
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
const TimeField = ({ value, schema }: { value: any; schema?: any }) => {
  if (isNil(value)) return <span className="text-muted-foreground">空</span>
  return <span>{value}</span>
}

// 滑块展示
const Slider = ({ value, schema }: { value: any; schema?: any }) => {
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
            <p className="max-w-md break-words">{text}</p>
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
const FormInfo = ({ value, schema }: { value: any; schema?: any }) => {
  if (isNil(value)) return <span className="text-muted-foreground">空</span>
  // 简化版：直接显示值
  return <span>{String(value)}</span>
}

// 可编辑表格展示（在对话框中显示）
const EditableTable = ({ value, schema }: { value: any; schema?: any }) => {
  const [open, setOpen] = React.useState(false)

  if (!isArray(value) || value.length === 0) {
    return <span className="text-muted-foreground">空</span>
  }

  // 简化版：只显示数据条数
  return (
    <>
      <div
        className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
        onClick={() => setOpen(true)}
      >
        <TableIcon className="h-4 w-4" />
        <span>{value.length} 条数据</span>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>表格内容</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100">
                  {Object.keys(value[0] || {}).map((key) => (
                    <th
                      key={key}
                      className="border border-slate-200 px-4 py-2 text-left text-sm font-medium"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {value.map((row: any, index: number) => (
                  <tr key={index}>
                    {Object.values(row).map((cell: any, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="border border-slate-200 px-4 py-2 text-sm"
                      >
                        {isString(cell) || isNumber(cell) ? String(cell) : JSON.stringify(cell)}
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
              <p className="max-w-md break-words">{str}</p>
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

// 辅助函数：判断是否需要使用脚本渲染
const shouldRenderScript = (schema: any) => {
  return !!(schema?.fieldRenderScript || schema?.allScript)
}

export const ViewFieldRender = ({ type, value, schema, ...props }: any) => {
  // 优先判断脚本渲染
  if (shouldRenderScript(schema)) {
    const ScriptComponent = fieldMap['script']
    return <ScriptComponent value={value} schema={schema} {...props} />
  }

  // 判断公式
  if (schema?.textContent === 'logic' || schema?.config === '公式') {
    const FormulaComponent = fieldMap['formula']
    return <FormulaComponent value={value} schema={schema} {...props} />
  }

  // 判断查找引用
  if (schema?.config === '查找引用') {
    const ReferenceComponent = fieldMap['reference']
    return <ReferenceComponent value={value} schema={schema} {...props} />
  }

  // 根据 fieldType 映射到对应的组件
  let fieldType = type || schema?.fieldType

  // 映射旧字段类型到新类型
  const typeMapping: Record<string, string | undefined> = {
    'input': schema?.config === '文本' ? 'text' : undefined,
    'inputNumber': 'number',
    'datePicker': 'date',
    'dateRange': 'date-range',
    'timePicker': 'time',
    'textEditor': 'rich-text',
    'attachment': 'upload',
    'attachments': 'upload',
    'editableTable': 'editable-table',
    'link': 'link',
    'map': 'map',
    'area': 'map',
  }

  const mappedType = typeMapping[fieldType]
  if (mappedType) {
    fieldType = mappedType
  }

  // 获取对应的组件
  const FieldComponent = fieldMap[fieldType] || fieldMap['text']

  return <FieldComponent value={value} schema={schema} {...props} />
}

export default fieldMap
