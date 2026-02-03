import * as React from 'react'
import { cn } from '@/lib/utils'
import isNil from 'lodash/isNil'
import isEmpty from 'lodash/isEmpty'

// 导入迁移后的字段组件
import { TableFieldText } from '@/registry/blocks/table-field/table-field-text/table-field-text'
import { TableFieldNumber } from '@/registry/blocks/table-field/table-field-number/table-field-number'
import { TableFieldSelect } from '@/registry/blocks/table-field/table-field-select/table-field-select'
import { TableFieldDate } from '@/registry/blocks/table-field/table-field-date/table-field-date'
import { TableFieldDateRange } from '@/registry/blocks/table-field/table-field-date-range/table-field-date-range'
import { TableFieldTime } from '@/registry/blocks/table-field/table-field-time/table-field-time'
import { TableFieldCheckbox } from '@/registry/blocks/table-field/table-field-checkbox/table-field-checkbox'
import { TableFieldRate } from '@/registry/blocks/table-field/table-field-rate/table-field-rate'
import { TableFieldRichText } from '@/registry/blocks/table-field/table-field-rich-text/table-field-rich-text'
import { TableFieldMap } from '@/registry/blocks/table-field/table-field-map/table-field-map'
import { TableFieldUpload } from '@/registry/blocks/table-field/table-field-upload/table-field-upload'
import AreaComponent from '../form-area/form-area'
import {
  RelateSelect,
  RelateMultiSelect,
  RelateModelSelect,
  TableFieldRelate as RelateComponent,
  schemaConverter,
} from '@/registry/blocks/table-field/table-field-relate'
import { TableFieldRelatePlus } from '@/registry/blocks/table-field/table-field-relate-plus/table-field-relate-plus'
import { TableFieldUserRole } from '@/registry/blocks/table-field/table-field-user-role/table-field-user-role'
import { TableFieldSerialNumber } from '@/registry/blocks/table-field/table-field-serial-number/table-field-serial-number'
import { TableFieldBytesArray } from '@/registry/blocks/table-field/table-field-bytes-array/table-field-bytes-array'
import { TableFieldReference } from '@/registry/blocks/table-field/table-field-reference/table-field-reference'
import { TableFieldFormInfo } from '@/registry/blocks/table-field/table-field-form-info/table-field-form-info'
import { TableFieldLink } from '@/registry/blocks/table-field/table-field-link/table-field-link'
import { TableFieldEditableTable } from '@/registry/blocks/table-field/table-field-editable-table/table-field-editable-table'

export interface FormWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 字段配置（schema）
   */
  config?: Record<string, any>
  /**
   * 字段值
   */
  value?: any
  /**
   * 输入对象
   */
  input?: {
    value?: any
    onChange?: (value: any) => void
  }
  /**
   * 默认值
   */
  defaultValue?: any
  /**
   * 单元格键值
   */
  cellKey?: string
  /**
   * 字段配置项
   */
  fieldSchema?: string
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 字段标签
   */
  label?: string
  /**
   * 占位符
   */
  placeholder?: string
  /**
   * 是否必填
   */
  required?: boolean
  /**
   * 描述文本
   */
  description?: string
  /**
   * 错误提示
   */
  error?: string
  /**
   * 大小
   */
  size?: 'small' | 'middle' | 'large'
  /**
   * 元数据
   */
  meta?: any
  /**
   * 记录数据
   */
  record?: any
}

/**
 * 根据字段 schema 选择对应的组件
 */
const FieldComponentSelector: React.FC<{
  schema: Record<string, any>
  input: {
    value?: any
    onChange?: (value: any) => void
    onBlur?: (e: any) => void
  }
  field?: {
    schema?: Record<string, any>
    filter?: any
    meta?: any
  }
  meta?: any
  record?: any
  cellKey?: string
}> = ({ schema, input, field, meta, record, cellKey }) => {
  const config = schema || {}

  // 关联字段（新版）- 使用 recordSelectType
  if ((config.relateTo || config.relate) && config.recordSelectType) {
    const tableID = config.relate?.id || config.relateTo
    return <TableFieldRelatePlus relateSchema={config} tableID={tableID} input={input} field={field ? { schema: config, ...field } : { schema: config }} meta={meta} schema={schema} />
  }

  // 外部工作表关联 - 使用 relate?.id
  const convertedRelateSchema = React.useMemo(() => {
    return ['object', 'array'].includes(config.type) && config.relate?.id
      ? schemaConverter(config, {})
      : null
  }, [config])

  if (convertedRelateSchema) {
    const relateProps = {
      input,
      field: {
        schema: convertedRelateSchema.schema,
        fieldSchema: convertedRelateSchema.fieldSchema,
        displayField: convertedRelateSchema.displayField,
        tableID: convertedRelateSchema.tableID,
        relateShowFields: convertedRelateSchema.relateShowFields,
        key: convertedRelateSchema.key,
        option: {
          form: {
            change: (field: string, value: any) => {
              // TODO: 实现表单字段联动
              console.log('Relate field change:', field, value)
            }
          }
        }
      },
      meta,
      record,
      label: config.title || '请选择',
    }

    // 根据 type 选择对应组件
    if (convertedRelateSchema.type === 'relate_multi_select') {
      return <RelateMultiSelect {...relateProps} />
    }
    if (convertedRelateSchema.type === 'relate_fkselect') {
      return <RelateSelect {...relateProps} />
    }
    if (convertedRelateSchema.type === 'relate_list_fkselect') {
      return <RelateModelSelect {...relateProps} />
    }
  }

  // 内部表关联（internalTable）
  if (config.internalTable && config.relate) {
    return <RelateComponent input={input} field={{ schema: config, ...field, internalTable: true }} meta={meta} record={record} />
  }

  // 附件上传
  if (config.type === 'object' && config.fieldType === 'attachment') {
    return <TableFieldUpload input={input} field={{ schema: config, meta }} type="upload_attachment" />
  }

  if (config.type === 'array' && config.fieldType === 'attachments') {
    return <TableFieldUpload input={input} field={{ schema: config, meta }} type="upload_attachment_group" />
  }

  // 用户/角色关联
  if (['User', 'Role'].includes(config.relateTo || '')) {
    return <TableFieldUserRole input={input} field={{ schema: config, displayField: config.showField || 'name' }} meta={meta} record={record} />
  }

  // 关联字段只读
  if ((config.relateTo || config.relate) && config.disabled) {
    // TODO: 实现关联字段只读组件
    return <div className="text-sm text-muted-foreground">关联字段只读（待实现）</div>
  }

  // 文本输入
  if (config.type === 'string' && config.fieldType === 'input') {
    return <TableFieldText input={input} field={{ schema: config, meta }} meta={meta} record={record} />
  }

  // 枚举选择器
  if (config.enum1 && config.enum1.length > 0) {
    return <TableFieldSelect input={input} field={{ schema: config, meta }} meta={meta} record={record} />
  }

  // 数字输入
  if (config.type === 'number' && config.fieldType === 'inputNumber') {
    return <TableFieldNumber input={input} field={{ schema: config, meta }} meta={meta} record={record} />
  }

  // 日期选择
  if (config.type === 'string' && config.fieldType === 'datePicker') {
    return <TableFieldDate input={input} field={{ schema: config, meta }} meta={meta} record={record} />
  }

  // 日期范围
  if (config.type === 'string' && config.fieldType === 'dateRange') {
    return <TableFieldDateRange input={input} field={{ schema: config, meta }} meta={meta} record={record} cellKey={cellKey} />
  }

  // 时间选择
  if (config.type === 'string' && config.fieldType === 'timePicker') {
    return <TableFieldTime input={input} field={{ schema: config, meta }} meta={meta} record={record} />
  }

  // 地图定位
  if (config.type === 'object' && config.fieldType === 'map') {
    return <TableFieldMap input={input} field={{ schema: config, meta }} meta={meta} record={record} />
  }

  // 布尔值/复选框
  if (config.type === 'boolean' && (config.fieldType === 'checkbox' || config.fieldType === 'boolean')) {
    return <TableFieldCheckbox input={input} field={{ schema: config, meta }} meta={meta} record={record} label={config.title} />
  }

  // 可编辑表格
  if (config.fieldType === 'editableTable') {
    return <TableFieldEditableTable input={input} schema={config} meta={meta} record={record} />
  }

  // 只读表格
  if (config.fieldType === 'showTable') {
    // TODO: 实现只读表格组件
    return <div className="text-sm text-muted-foreground">只读表格（待实现）</div>
  }

  // 编号
  if (config.fieldType === 'serialNumber') {
    return <TableFieldSerialNumber input={input} field={{ schema: config }} />
  }

  // 链接
  if (config.fieldType === 'link') {
    return <TableFieldLink input={input} field={{ schema: config }} meta={meta} record={record} />
  }

  // 区域选择
  if (config.fieldType === 'area') {
    const areaInput = {
      value: input.value,
      onChange: input.onChange || (() => {})
    }
    return <AreaComponent input={areaInput} field={{ schema: config }} meta={meta || {}} areaType={config.areaType || 'pca'} />
  }

  // 报警关联
  if (config.relateTo === 'Warning') {
    // TODO: 实现报警组件
    return <div className="text-sm text-muted-foreground">报警（待实现）</div>
  }

  // 星级评价
  if (config.fieldType === 'rate') {
    return <TableFieldRate input={input} field={{ schema: config, meta }} meta={meta} record={record} />
  }

  // 富文本编辑器
  if (config.fieldType === 'textEditor') {
    return <TableFieldRichText input={input} field={{ schema: config, meta }} meta={meta} record={record} />
  }

  // 字节数组
  if (config.fieldType === 'bytesArray') {
    return <TableFieldBytesArray input={input} field={{ schema: config, filter: null }} meta={meta} record={record} />
  }

  // 多语言输入
  if (config.fieldType === 'languageInput') {
    // TODO: 实现多语言输入组件
    return <div className="text-sm text-muted-foreground">多语言输入（待实现）</div>
  }

  // 查找引用
  if (config.config === '查找引用') {
    return <TableFieldReference schema={config} field={{ key: config.key }} option={{ schema: { name: schema?.name } }} tableData={record} />
  }

  // 表单信息
  if (config.config === '表单信息') {
    return <TableFieldFormInfo schema={config} outProps={{ inList: false, viewPage: true }} />
  }

  // 默认：根据基础类型显示
  if (config.type === 'string') {
    return <TableFieldText input={input} field={{ schema: config, meta }} meta={meta} record={record} />
  }

  if (config.type === 'number') {
    return <TableFieldNumber input={input} field={{ schema: config, meta }} meta={meta} record={record} />
  }

  if (config.type === 'boolean') {
    return <TableFieldCheckbox input={input} field={{ schema: config, meta }} meta={meta} record={record} label={config.title} />
  }

  // 未知类型
  return (
    <div className="text-sm text-muted-foreground">
      未知字段类型: {config.type} {config.fieldType}
    </div>
  )
}

/**
 * FormWidget - 表字段映射组件
 * 根据字段配置动态渲染对应的表单组件
 */
const FormWidget = React.forwardRef<HTMLDivElement, FormWidgetProps>(
  (
    {
      config = {},
      input,
      defaultValue,
      cellKey,
      disabled = false,
      label,
      placeholder,
      required = false,
      description,
      error,
      size = 'middle',
      meta,
      record,
      className,
      fieldSchema,
      ...props
    },
    ref
  ) => {
    let schema
    try {
      schema = fieldSchema ? JSON.parse(fieldSchema) : {}
    } catch (e) {
      console.error('解析 fieldSchema 出错', e)
    }

    const [insideVal, setInsideVal] = React.useState<any>(defaultValue)

    // 处理输入值
    const inputValue = input?.value || insideVal

    // 处理值变化
    const handleChange = React.useCallback((newValue: any) => {
      if (input?.onChange) {
        input.onChange(newValue)
      } else {
        setInsideVal(newValue)
      }
    }, [input])

    const inputProps = React.useMemo(() => ({
      value: inputValue,
      onChange: handleChange
    }), [inputValue, handleChange])

    // 空配置时的占位显示
    if (isEmpty(schema)) {
      return (
        <div
          ref={ref}
          className={cn(
            "form-widget flex items-center justify-center",
            "min-h-[130px] w-full text-sm text-muted-foreground",
            className
          )}
          {...props}
        >
          能够配置表定义中定义的所有字段
        </div>
      )
    }

    return (
      <div ref={ref} className={cn("form-widget space-y-2", className)} {...props}>
        {label && (
          <label className={cn(
            "text-sm font-medium leading-none",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          )}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <FieldComponentSelector
          schema={schema}
          input={inputProps}
          field={{ schema, meta }}
          meta={meta}
          record={record}
          cellKey={cellKey}
        />

        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

FormWidget.displayName = "FormWidget"

export { FieldComponentSelector }

export default FormWidget
