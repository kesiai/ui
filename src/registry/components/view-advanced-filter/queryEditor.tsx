import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { NullInput, TextInput, VariateRangeTimeInput } from './Methods'
import { convertProps, getMethods } from './util'
import _ from 'lodash'

// 全局 app 对象的默认处理
const app = (globalThis as any).app

const convert = (schema: any) => {
  if (schema?.config === '区域') {
    schema.multiple = true
  }
  return schema
}

const convert1 = (schema: any, options?: any) => {
  const opts = options || {}
  if (opts.path === undefined) {
    opts.path = []
  }
  if (opts.lookup === undefined) {
    opts.lookup = {}
  }
  return schema
}

const BindDataWrap = (props: any) => {
  const { children, bind, DataWrap, selectMethod } = props
  if (['isNull', 'notNull'].indexOf(selectMethod) > -1) { // 为空，不为空，不渲染 DataWrap
    return null
  }

  return (
    bind ? (
      DataWrap ?
        <DataWrap {...props} /> :
        null
    ) : children
  )
}

interface QueryItemFromProps {
  value: any
  schema: any
  fieldKey: string
  onChange: (value: any) => void
  unbind?: boolean
  timeRangeQuery?: boolean
  DataWrap?: any
  showValidBtn?: boolean
  relation?: string
  ifOnlyOr?: boolean
  allowAndOp?: boolean
  selectHide?: boolean
  fieldPlaceholder?: string
  btnName?: string
  onlyOneType?: boolean
}

const QueryItemFrom = ({ value, schema, fieldKey, onChange, unbind, timeRangeQuery, DataWrap, showValidBtn }: QueryItemFromProps) => {
  const [methods, setMethods] = useState<any[]>()
  const [isTime, setIsTime] = useState<boolean>()
  const [fieldCovert, setFieldCovert] = useState<any>({ schema: schema.properties[fieldKey] || {} })
  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [rangeType, setRangeTypeState] = useState(value?.timeRange?.rangeType)

  const selectMethod = value?.method
  const isRange = ['range', 'notRange'].indexOf(selectMethod as string) > -1

  const setRangeType = (v: string) => {
    setRangeTypeState(v)
    if (isRange) {
      onChange({ ...value, timeRange: { rangeType: v } })
    } else {
      const val = v == 'fixed' ? null : v
      onChange({ ...value, value: val, timeRange: { rangeType: v } })
    }
  }

  // 监听容器宽度变化
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.getBoundingClientRect().width ||
          containerRef.current.offsetWidth ||
          containerRef.current.clientWidth
        setContainerWidth(width)
      }
    }

    // 初始获取宽度
    const timer = setTimeout(updateWidth, 0)

    // ResizeObserver 监听后续变化
    let observer: ResizeObserver | undefined
    if (window.ResizeObserver) {
      observer = new ResizeObserver(entries => {
        if (entries[0]) {
          setContainerWidth(entries[0].contentRect.width)
        }
      })

      if (containerRef.current) {
        observer.observe(containerRef.current)
      }
    }

    // 窗口大小变化时也更新
    window.addEventListener('resize', updateWidth)

    return () => {
      clearTimeout(timer)
      if (observer) observer.disconnect()
      window.removeEventListener('resize', updateWidth)
    }
  }, [])

  // 添加 useLayoutEffect 确保在 DOM 更新后立即获取尺寸
  useLayoutEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.getBoundingClientRect().width
      if (width > 0) {
        setContainerWidth(width)
      }
    }
  })

  // 检查是否为关联字段的子字段（格式为 "parentField.childField"）
  const isNestedField = fieldKey.includes('.')
  let fieldSchema: any = {}
  const filters = schema.filters ? _.map(schema.filters, (val: any) => val)?.reduce((a: any, b: any) => a.concat(b)) : []
  const filterSchema = filters.find((v: any) => v.key == fieldKey && v.component)

  if (isNestedField) {
    // 解析父字段和子字段
    const [parentKey, childKey] = fieldKey.split('.')
    const parentSchema = schema.properties[parentKey]

    // 从父字段的 relate.fields 和 relateShowFields 中查找子字段
    let childField: any = null

    // 先从 relate.fields 中查找
    if (parentSchema?.relate?.fields) {
      childField = parentSchema.relate.fields.find((field: any) => field.key === childKey)
    }

    // 如果在 relate.fields 中没找到，则从 relateShowFields 中查找
    if (!childField && parentSchema?.relateShowFields) {
      childField = parentSchema.relateShowFields.find((field: any) => field.key === childKey)
    }

    // 如果找到了子字段，使用其 fieldSchema
    if (childField) {
      fieldSchema = childField.fieldSchema || {}
    }
  } else {
    // 对于非嵌套字段，使用原来的逻辑
    const f = fieldKey.replace('.', '.properties.')
    fieldSchema = _.omit(_.get(schema.properties, f), 'filterByRes') || {}
  }

  const defaultType = isRange ? 'fixed' : null

  const ops = ['range', 'notRange'].indexOf(selectMethod as string) > -1
    ? [{ label: '固定范围', value: 'fixed' }, { label: '变化范围', value: 'dynamic' }]
    : [{ label: '固定时间', value: 'fixed' }, { label: '今天', value: 'nowinstant d' }, { label: '明天', value: 'nowinstant + 1d' }, { label: '昨天', value: 'nowinstant - 1d' }]

  useEffect(() => {
    // 对于嵌套字段，我们需要根据子字段的 fieldSchema 获取合适的方法
    if (isNestedField) {
      const [parentKey, childKey] = fieldKey.split('.')
      const parentSchema = schema.properties[parentKey]

      if (parentSchema?.config === "关联字段") {
        // 为关联字段的子字段确定适当的方法
        const ms = getMethods({ properties: { [childKey]: fieldSchema } }, childKey)
        setMethods(ms)

        // 检查是否为时间字段
        if (['date', 'datetime', 'date-time'].includes(fieldSchema?.format) || fieldSchema?.fieldType === 'datePicker') {
          setIsTime(true)
        }
      } else {
        // 如果不是标准的关联字段格式，回退到原始实现
        const ms = getMethods(schema, fieldKey)
        setMethods(ms)
        if (['date', 'datetime', 'date-time'].includes(schema.properties[fieldKey]?.format) || schema.properties[fieldKey]?.fieldType == 'datePicker') setIsTime(true)
      }
    } else {
      // 非嵌套字段使用原始逻辑
      const ms = getMethods(schema, fieldKey)
      setMethods(ms)
      if (['date', 'datetime', 'date-time'].includes(schema.properties[fieldKey]?.format) || schema.properties[fieldKey]?.fieldType == 'datePicker') setIsTime(true)
    }
  }, [schema, fieldKey])

  const onMethodChange = (key: string) => {
    onChange({ ..._.omit(value, 'timeRange'), method: key, value: null })
  }

  const onValueChange = (v: any) => {
    onChange({ ...value, value: v?.target ? v.target.value : v })
  }

  const onTimeRangeChange = (timeRange: any, v: any) => {
    onChange({ ...value, timeRange, value: v })
  }

  const onValidChange = (v: boolean) => {
    onChange({ ...value, valid: v })
  }

  const getConvertCom = (fSchema: any, method: any) => {
    if (!fSchema.fieldType && !fSchema.relateTo && !fSchema.relate && !fSchema.enum && !fSchema.enum1) return
    let convertSchema: any
    if (method?.type == 'multipleSelect') {
      if (fSchema.type == 'array') {
        convertSchema = convert1(fSchema)
      } else {
        convertSchema = convert1({ items: { type: fSchema.type, properties: {}, relateTo: fSchema.relateTo }, ...fSchema, selectType: 'multiple', type: 'array' })
      }
      if (convertSchema.type == 'array') convertSchema = convert(fSchema)
    } else if (fSchema.type == 'object' && ['eq', 'ne'].indexOf(method?.key as string) > -1 && (fSchema.relateTo || fSchema.relate)) {
      convertSchema = convert1(fSchema)
    } else {
      convertSchema = convert(fSchema)
    }    
    setFieldCovert(convertSchema)
    const type = convertSchema.type
    const formFields = app?.get('form_fields')
    return formFields?.[type]?.component
  }

  const ValueComponent = React.useMemo(() => {
    if (!methods) return NullInput
    const method = _.find(methods, m => m.key == selectMethod) || (methods && methods[0])
    if (fieldSchema?.selectFace) fieldSchema.selectFace = 'select'
    const fSchema = { ...filterSchema, ...fieldSchema }
    if (method?.useCustomCom) {
      return method.component
    }
    if (method?.key == 'isNull' || method?.key == 'notNull') {
      return method?.component
    }
    if (method?.key == 'eq' || method?.key == 'ne') {
      if (fSchema.component) {
        return fSchema.component
      } else if (fSchema?.type === 'string' && fSchema.fieldType == 'input') {
        return method.component
      } else if (!fSchema?.format && fSchema?.type !== 'number') {
        return getConvertCom(fSchema, method) || method.component
      }
      return method.component
    }
    if (method?.type == 'multipleSelect' && ['in', 'nin'].indexOf(method?.key as string) > -1) {
      if (fSchema.enum) return method.component
      return getConvertCom(fSchema, method) || fSchema.component || method?.component || TextInput
    }
    if (fSchema.fieldType && (fSchema.enum || fSchema.enum1) || fSchema.relateTo || fSchema.fieldType === 'area') {
      return fSchema.component || getConvertCom(fSchema, method) || TextInput
    }
    if (method?.type == 'multipleSelect' && fSchema.type == 'array') {
      return fSchema.component || method?.component || getConvertCom(fSchema, method) || fSchema.field?.component || TextInput
    }
    return fSchema.component || method?.component || getConvertCom(fSchema, method) || TextInput
  }, [JSON.stringify(methods), selectMethod])

  const type = schema?.properties?.[fieldKey]?.type

  // 根据容器宽度决定布局方式
  const isNarrowLayout = containerWidth > 0 && containerWidth < 300

  return (
    _.isEmpty(methods) ? null :
      <div ref={containerRef} className={isNarrowLayout ? 'mb-4' : ''}>
        {isNarrowLayout ? (
          // 窄屏布局：三行显示
          <>
            <div className="w-full mb-2">
              <Select
                value={selectMethod || ''}
                onValueChange={onMethodChange}
              >
                <SelectTrigger className="w-full min-w-32.5">
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  {(methods || []).map(m => {
                    return <SelectItem key={m.key} value={m.key}>{m.name}</SelectItem>
                  })}
                </SelectContent>
              </Select>
            </div>

            {selectMethod ?
              <>
                <div className="mb-2 w-full">
                  {
                    ['range', 'notRange', 'gt', 'lt'].indexOf(selectMethod as string) > -1 && timeRangeQuery && isTime ?
                      <Select value={rangeType || defaultType} onValueChange={setRangeType}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="请选择" />
                        </SelectTrigger>
                        <SelectContent>
                          {ops.map(op => <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>)}
                        </SelectContent>
                      </Select> :
                      <BindDataWrap input={{ value: value?.value, onChange: onValueChange }} field={{ ...fieldSchema, unbind }} bind={!unbind} DataWrap={DataWrap} selectMethod={selectMethod}>
                        <div className="w-full">
                          <ValueComponent {...fieldCovert} input={{ value: value?.value, onChange: onValueChange }} field={{...fieldCovert, schema: fieldCovert}} label={fieldSchema.title} meta={{}} className="w-full" />
                        </div>
                      </BindDataWrap>
                  }
                </div>

                {showValidBtn ?
                  <div className="mb-2">
                    <BindDataWrap input={{ value: value?.valid, onChange: onValidChange }} field={{ title: '生效', type: 'boolean', unbind }} bind={!unbind} DataWrap={DataWrap} selectMethod={selectMethod}>
                      <Switch
                        checked={_.isNil(value?.valid) || value?.valid}
                        onCheckedChange={onValidChange}
                      />
                    </BindDataWrap>
                  </div>
                  : null}
              </>
              : null}
          </>
        ) : (
          // 宽屏布局：原来的两行显示
          <>
            <div className="w-full flex flex-row mb-2">
              <Select
                value={selectMethod || ''}
                onValueChange={onMethodChange}
              >
                <SelectTrigger
                  className="mr-2 w-25 h-auto min-w-32.5 shrink-0"
                >
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  {(methods || []).map(m => {
                    return <SelectItem key={m.key} value={m.key}>{m.name}</SelectItem>
                  })}
                </SelectContent>
              </Select>
              {selectMethod ?
                <div className="flex flex-wrap grow gap-2 items-center">
                  <div className={`
                    grow
                    ${['isNull', 'notNull'].indexOf(selectMethod as string) === -1 && type !== 'boolean' ? 'min-w-50 flex-basis-50' : 'min-w-auto flex-basis-auto'}
                  `}>
                    {
                      ['range', 'notRange', 'gt', 'lt'].indexOf(selectMethod as string) > -1 && timeRangeQuery && isTime ?
                        <Select value={rangeType || defaultType} onValueChange={setRangeType}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="请选择" />
                          </SelectTrigger>
                          <SelectContent>
                            {ops.map(op => <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>)}
                          </SelectContent>
                        </Select> :
                        <BindDataWrap input={{ value: value?.value, onChange: onValueChange }} field={{ ...fieldSchema, unbind }} bind={!unbind} DataWrap={DataWrap} selectMethod={selectMethod}>
                          <ValueComponent {...fieldCovert} input={{ value: value?.value, onChange: onValueChange }} field={{...fieldCovert, schema: fieldCovert}} label={fieldSchema.title} meta={{}} className="w-full" />
                        </BindDataWrap>
                    }
                  </div>
                  {showValidBtn ?
                    <div className="shrink-0 min-w-15">
                      <BindDataWrap input={{ value: value?.valid, onChange: onValidChange }} field={{ title: '生效', type: 'boolean', unbind }} bind={!unbind} DataWrap={DataWrap} selectMethod={selectMethod}>
                        <Switch
                          checked={_.isNil(value?.valid) || value?.valid}
                          onCheckedChange={onValidChange}
                        />
                      </BindDataWrap>
                    </div>
                    : null}
                </div>
                : null}
            </div>
          </>
        )}

        {
          ['range', 'notRange', 'gt', 'lt'].indexOf(selectMethod as string) > -1 && timeRangeQuery && isTime &&
          (rangeType == 'dynamic' ? <VariateRangeTimeInput {...fieldSchema} input={{ value: value?.timeRange, onChange: onTimeRangeChange }} field={fieldCovert} label={fieldSchema.title}></VariateRangeTimeInput> :
            rangeType == 'fixed' || defaultType == 'fixed' ?
              <div className="mb-2">
                <BindDataWrap input={{ value: value?.value, onChange: onValueChange }} field={{ ...fieldSchema, unbind }} bind={!unbind} DataWrap={DataWrap} selectMethod={selectMethod}>
                  <ValueComponent {...fieldCovert} input={{ value: value?.value, onChange: onValueChange }} field={{...fieldCovert, schema: fieldCovert}} label={fieldSchema.title} meta={{}} className="w-full" />
                </BindDataWrap>
              </div> : null)
        }
      </div>
  )
}

const getType = (item: any) => {
  // 工作表显示字段类型，不显示数据类型
  if (item.config) return item.config
  const typeList: any = { string: '字符串', number: '数字', integer: '整数', boolean: '布尔', object: '对象', array: '数组' }
  return typeList[item.type] || '字符串'
}

interface QueryFieldSelectProps {
  schema: any
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const QueryFieldSelect = ({ schema, value, onChange, placeholder }: QueryFieldSelectProps) => {
  const properties = schema?.properties ? convertProps(schema.properties, schema.form) : []
  const ops = properties.filter((item: any) => item.key != 'model' && item.key != 'dashboard' && item.fieldType !== 'editableTable')

  // Handle field selection, supporting nested selections
  const handleFieldChange = (selectedValue: string) => {
    onChange(selectedValue)
  }

  return (
    <Select
      value={value || ''}
      onValueChange={handleFieldChange}
    >
      <SelectTrigger className="mr-2 grow">
        <SelectValue placeholder={placeholder || "选择过滤字段"} />
      </SelectTrigger>
      <SelectContent>
        {ops.map((item: any) => {
          const key = item.key || item.id
          const title = item.title || item.name

          // Check if this is a relate field
          if (item.config === "关联字段" && item.selectType !== 'multiple' && (item.relate?.fields?.length || item.relateShowFields?.length)) {
            return (
              <React.Fragment key={key}>
                {/* 保留关联字段本身作为一级选择 */}
                <SelectItem value={key}>
                  <span className="text-muted-foreground">[{getType(item)}]</span> {title}
                </SelectItem>

                {/* Add options from relate.fields with indentation */}
                {(item.relate?.fields || []).map((relateField: any) => {
                  const relateKey = `${key}.${relateField.key}`
                  return (
                    <SelectItem key={relateKey} value={relateKey}>
                      <span className="pl-5">
                        <span className="text-muted-foreground">[{getType(relateField.fieldSchema)}]</span> {relateField.title}
                      </span>
                    </SelectItem>
                  )
                })}

                {/* Add options from relateShowFields with indentation */}
                {(item.relateShowFields || []).map((relateField: any) => {
                  const relateKey = `${key}.${relateField.key}`
                  // Check if this field is already included in relate.fields
                  const isDuplicate = item.relate?.fields?.some((f: any) => f.key === relateField.key)
                  // 处理relateField.fieldSchema为空时显示错误问题
                  if (!isDuplicate && relateField?.fieldSchema) {
                    return (
                      <SelectItem key={relateKey} value={relateKey}>
                        <span className="pl-5">
                          <span className="text-muted-foreground">[{getType(relateField.fieldSchema)}]</span> {relateField.title || relateField.label}
                        </span>
                      </SelectItem>
                    )
                  }
                  return null
                })}
              </React.Fragment>
            )
          }

          // Return regular option for non-related fields
          if (!key || !title) return null
          return (
            <SelectItem key={key} value={key}>
              <span className="text-muted-foreground">[{getType(item)}]</span> {title}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}

interface QueryItemProps {
  value: any
  schema: any
  onChange: (value: any) => void
  onDelete: () => void
  selectHide?: boolean
  fieldPlaceholder?: string
  unbind?: boolean
  timeRangeQuery?: boolean
  DataWrap?: any
  showValidBtn?: boolean
  relation?: string
  ifOnlyOr?: boolean
  allowAndOp?: boolean
}

const QueryItem = (props: QueryItemProps) => {
  const { value, schema, onChange, onDelete, selectHide, fieldPlaceholder } = props

  return (
    <>
      {selectHide ? null : (
        <div className="w-full flex flex-row items-center mb-2">
          <QueryFieldSelect schema={schema} value={value?.field || ''} onChange={(field) => onChange({ field })} placeholder={fieldPlaceholder} />
          <div className="ml-2 shrink-0">
            <button
              type="button"
              onClick={onDelete}
              className="hover:text-destructive transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>
          </div>
        </div>
      )}
      {value?.field ? <QueryItemFrom {...props} fieldKey={value?.field} /> : null}
    </>
  )
}

interface QueryFormProps {
  query: any[]
  schema: any
  onChange: (query: any[]) => void
  relation?: string
  ifOnlyOr?: boolean
  allowAndOp?: boolean
  selectHide?: boolean
  fieldPlaceholder?: string
  unbind?: boolean
  timeRangeQuery?: boolean
  DataWrap?: any
  showValidBtn?: boolean
}

const QueryForm = (props: QueryFormProps) => {
  const { query, schema, onChange, relation, ifOnlyOr } = props

  let error: any = {}

  const onItemChange = (i: number) => (value: any) => {
    const f = value.field.replace('.', '.properties.')
    if (_.get(schema.properties, f)?.type == 'boolean') {
      if (_.isNil(value?.value)) {
        value['value'] = true
      }
    }
    onChange([
      ...query.slice(0, i),
      value,
      ...query.slice(i + 1)
    ])
  }

  const onItemDelete = (i: number) => () => {
    onChange([
      ...query.slice(0, i),
      ...query.slice(i + 1)
    ])
  }

  const onAddQuery = () => {
    onChange([...query, {}])
  }

  // 使用 findLastIndex 的替代方案
  const getErrorIndex = () => {
    for (let i = query.length - 1; i >= 0; i--) {
      if (query[i]?.field && error[query[i].field]) {
        return i
      }
    }
    return -1
  }

  return (
    <>
      {query.map((item, i) => {
        const errorIndex = error[item.field] ? getErrorIndex() : -1
        const key = item.field ? (item.field + (item.method || '') + i) : i
        return (
          <span key={key}>
            <QueryItem {...props} onChange={onItemChange(i)} onDelete={onItemDelete(i)} value={item} />
            {errorIndex == i && <div className="text-xs text-destructive">{error[item.field]}</div>}
            {(!relation || relation == 'and') && !ifOnlyOr ?
              i == query.length - 1 ? (
                <Button type="button" onClick={onAddQuery}>+ {'且'}</Button>
              ) : (
                <div className="mx-4 mb-2">{'且'}</div>
              ) : null}
          </span>
        )
      })}
    </>
  )
}

interface QueryEditorProps {
  input?: {
    value?: any[]
    onChange?: (value: any[]) => void
  }
  relation?: string
  unbind?: boolean
  style?: React.CSSProperties
  DataWrap?: any
  btnName?: string
  onlyOneType?: boolean
  schema?: any
  selectHide?: boolean
  fieldPlaceholder?: string
  timeRangeQuery?: boolean
  showValidBtn?: boolean
  allowAndOp?: boolean
}

/**
 * QueryEditor 组件
 * @description 查询编辑器组件，用于构建复杂的查询条件
 *
 * @param input - 输入值和变更回调
 * @param relation - 逻辑关系 ('and' | 'or')
 * @param style - 自定义样式
 * @param btnName - 按钮名称
 * @param onlyOneType - 只能且和或二选一
 * @param schema - 数据模型 schema
 * @param selectHide - 隐藏字段选择
 * @param fieldPlaceholder - 字段占位符
 * @param timeRangeQuery - 时间范围查询
 * @param showValidBtn - 显示生效失效按钮
 * @param allowAndOp - 允许且操作
 */
const QueryEditor = (props: QueryEditorProps) => {
  const { input = {}, relation, style, btnName, onlyOneType, schema } = props
  const { value = [], onChange } = input
  const [queries, setQueries] = useState(value)

  const saveQueries = (qs: any[]) => {
    const filtered = qs.filter(q => !_.isEmpty(q))
    setQueries(filtered)
    onChange && onChange(filtered)
  }

  useEffect(() => {
    setQueries(input.value || [])
  }, [input.value])

  const addQuery = useCallback((i: number) => {
    const query = queries[i] || []
    const newQuery = [
      ...query,
      { field: '' }
    ]
    saveQueries([..._.set(queries, i, newQuery)])
  }, [queries])

  const onAddOrQuery = useCallback(() => {
    saveQueries([
      ...queries,
      [{}]
    ])
  }, [queries])

  const setQuery = (i: number) => (query: any[]) => {
    const newQuerys = _.cloneDeep(queries)
    if (newQuerys?.length) newQuerys[i] = query
    if (_.isEmpty(query)) {
      saveQueries([...queries.slice(0, i), ...queries.slice(i + 1)])
    } else {
      saveQueries(newQuerys)
    }
  }

  if (schema?.name == "warning") {
    schema.properties['recoveryTime'] = {
      title: '报警恢复时间',
      type: 'string',
      format: "date-time"
    }
  }
  if (_.isEmpty(queries)) {
    return <Button type="button" onClick={() => addQuery(0)}>{btnName || '添加过滤条件'}</Button>
  } else {
    const ifOnlyAnd = onlyOneType && queries[0]?.length > 1 // 只使用且，不用或
    const ifOnlyOr = onlyOneType && queries.length > 1 // 只使用或，不用且
    return queries.map((query, i) => {
      return (
        <div key={i} style={style}>
          <QueryForm
            {...props}
            schema={schema}
            query={query}
            onChange={setQuery(i)}
            ifOnlyOr={ifOnlyOr}
          />
          {(!relation || relation == 'or') && !ifOnlyAnd ?
            i == queries.length - 1 ? (
              <Button style={{ marginLeft: '0.5rem' }} type="button" onClick={onAddOrQuery}>+ {'或'}</Button>
            ) : (
              <div className="flex items-center my-2">
                <Separator className="flex-1" />
                <span className="px-2 text-sm text-muted-foreground">{'或'}</span>
                <Separator className="flex-1" />
              </div>
            )
            : null
          }
        </div>
      )
    })
  }
}

export default QueryEditor
export { QueryEditor, QueryItem, QueryForm, QueryFieldSelect, QueryItemFrom, BindDataWrap }
