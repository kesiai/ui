import * as React from 'react'
import { cn } from '@/lib/utils'
import isEmpty from 'lodash/isEmpty'

// 导入迁移后的字段组件
import { FormInput } from '@/registry/components/form-input/form-input'
import { FormInputNumber } from '@/registry/components/form-input-number/form-input-number'
import { FormSelect } from '@/registry/components/form-select/form-select'
import { FormDate } from '@/registry/components/form-date/form-date'
import { FormDateRange } from '@/registry/components/form-date-range/form-date-range'
import { FormTime } from '@/registry/components/form-time/form-time'
import { FormCheckbox } from '@/registry/components/form-checkbox/form-checkbox'
import { Rate } from '@/registry/components/form-rate/form-rate'
import { FormRichText } from '@/registry/components/form-rich-text/form-rich-text'
import { FormMap } from '@/registry/components/form-map/form-map'
import { FormUpload } from '@/registry/components/form-upload/form-upload'
import { FormArea as AreaComponent } from '../form-area/form-area'
import { FormRelate } from '@/registry/components/form-relate/form-relate'
import { RelateSelect } from '@/registry/components/form-relate-select/form-relate-select'
import { RelateMultiSelect } from '@/registry/components/form-relate-multi-select/form-relate-multi-select'
import { RelateModelSelect } from '@/registry/components/form-relate-model-select/form-relate-model-select'
import { schemaConverter } from '@/registry/lib/form-relate-utils'
import { FormRelatePlus } from '@/registry/components/form-relate-plus/form-relate-plus'
import { FormUserRole } from '@/registry/components/form-user-role/form-user-role'
import { FormSerialNumber } from '@/registry/components/form-serial-number/form-serial-number'
import { FormBytesArray } from '@/registry/components/form-bytes-array/form-bytes-array'
import { FormReference } from '@/registry/components/form-reference/form-reference'
import { FormFormInfo } from '@/registry/components/form-form-info/form-form-info'
import { FormLink } from '@/registry/components/form-link/form-link'
import { FormEditableTable } from '@/registry/components/form-editable-table/form-editable-table'

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
}> = ({ schema, input, meta, record }) => {
  const config = schema || {}

  // 关联字段（新版）- 使用 recordSelectType
  if ((config.relateTo || config.relate) && config.recordSelectType) {
    const tableID = config.relate?.id || config.relateTo
    return <FormRelatePlus relateSchema={config} tableID={tableID} value={input.value} onChange={input.onChange} meta={meta} schema={schema} field={schema} />
  }

  // 外部工作表关联 - 使用 relate?.id
  const convertedRelateSchema = React.useMemo(() => {
    return ['object', 'array'].includes(config.type) && config.relate?.id
      ? schemaConverter(config, {})
      : null
  }, [config])

  if (convertedRelateSchema) {
    const relateProps = {
      value: input.value,
      onChange: input.onChange,
      input: { value: input.value, onChange: input.onChange }, // 添加 input 属性
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
    return <FormRelate input={{ value: input.value, onChange: input.onChange }} field={{ schema: config, internalTable: true }} meta={meta} record={record} />
  }

  // 附件上传
  if (config.type === 'object' && config.fieldType === 'attachment') {
    return <FormUpload value={input.value} onChange={input.onChange} placeholder={config.placeholder} disabled={config.disabled} defaultVal={config.defaultVal} type="upload_attachment" />
  }

  if (config.type === 'array' && config.fieldType === 'attachments') {
    return <FormUpload value={input.value} onChange={input.onChange} placeholder={config.placeholder} disabled={config.disabled} defaultVal={config.defaultVal} type="upload_attachment_group" />
  }

  // 用户/角色关联
  if (['User', 'Role'].includes(config.relateTo || '')) {
    return <FormUserRole value={input.value} onChange={input.onChange} name={config.name} displayField={config.showField || 'name'} meta={meta} record={record} />
  }

  // 关联字段只读
  if ((config.relateTo || config.relate) && config.disabled) {
    // TODO: 实现关联字段只读组件
    return <div className="text-sm text-muted-foreground">关联字段只读（待实现）</div>
  }

  // 文本输入
  if (config.type === 'string' && config.fieldType === 'input') {
    return <FormInput value={input.value} onChange={input.onChange} placeholder={config.placeholder} disabled={config.disabled} textContent={config.textContent} delBlank={config.delBlank} maxLength={config.maxLength} />
  }

  // 枚举选择器
  if (config.enum1 && config.enum1.length > 0) {
    return <FormSelect value={input.value} onChange={input.onChange} placeholder={config.placeholder} disabled={config.disabled} selectFace={config.selectFace} selectType={config.selectType} options={config.enum} />
  }

  // 数字输入
  if (config.type === 'number' && config.fieldType === 'inputNumber') {
    return <FormInputNumber value={input.value} onChange={input.onChange} placeholder={config.placeholder} disabled={config.disabled} unit={config.unit} decimal={config.decimal} precision={config.precision} min={config.min} max={config.max} />
  }

  // 日期选择
  if (config.type === 'string' && config.fieldType === 'datePicker') {
    return <FormDate value={input.value} onChange={input.onChange} placeholder={config.placeholder} disabled={config.disabled} defaultVal={config.defaultVal} defaultValType={config.defaultValType} format={config.format} format2={config.format2} />
  }

  // 日期范围
  if (config.type === 'string' && config.fieldType === 'dateRange') {
    return <FormDateRange value={input.value} onChange={input.onChange} placeholder={config.placeholder} disabled={config.disabled} defaultVal={config.defaultVal} size={config.size} />
  }

  // 时间选择
  if (config.type === 'string' && config.fieldType === 'timePicker') {
    return <FormTime value={input.value} onChange={input.onChange} placeholder={config.placeholder} disabled={config.disabled} defaultVal={config.defaultVal} defaultValType={config.defaultValType} timeFormat={config.timeFormat} size={config.size} />
  }

  // 地图定位
  if (config.type === 'object' && config.fieldType === 'map') {
    return <FormMap value={input.value} onChange={input.onChange} placeholder={config.placeholder} lngLat={config.lngLat} positionName={config.positionName} canEdit={config.canEdit} canHand={config.canHand} defaultVal={config.defaultVal} showType={config.showType} size={config.size} disabled={config.disabled} />
  }

  // 布尔值/复选框
  if (config.type === 'boolean' && (config.fieldType === 'checkbox' || config.fieldType === 'boolean')) {
    return <FormCheckbox value={input.value} onChange={input.onChange} label={config.title} disabled={config.disabled} />
  }

  // 可编辑表格
  if (config.fieldType === 'editableTable') {
    return <FormEditableTable value={input.value} onChange={input.onChange} schema={config} meta={meta} record={record} />
  }

  // 只读表格
  if (config.fieldType === 'showTable') {
    // TODO: 实现只读表格组件
    return <div className="text-sm text-muted-foreground">只读表格（待实现）</div>
  }

  // 编号
  if (config.fieldType === 'serialNumber') {
    return <FormSerialNumber value={input.value} onChange={input.onChange} serialRules={config.serialRules} />
  }

  // 链接
  if (config.fieldType === 'link') {
    return <FormLink value={input.value} onChange={input.onChange} placeholder={config.placeholder} disabled={config.disabled} linkType={config.linkType} size={config.size} />
  }

  // 区域选择
  if (config.fieldType === 'area') {
    return <AreaComponent value={input.value} onChange={input.onChange || (() => {})} areaType={config.areaType || 'pca'} />
  }

  // 报警关联
  if (config.relateTo === 'Warning') {
    // TODO: 实现报警组件
    return <div className="text-sm text-muted-foreground">报警（待实现）</div>
  }

  // 星级评价
  if (config.fieldType === 'rate') {
    return <Rate value={input.value} onChange={input.onChange} disabled={config.disabled} defaultVal={config.defaultVal} inList={config.inList} />
  }

  // 富文本编辑器
  if (config.fieldType === 'textEditor') {
    return <FormRichText value={input.value} onChange={input.onChange} placeholder={config.placeholder} disabled={config.disabled} defaultVal={config.defaultVal} defaultValType={config.defaultValType} inList={config.inList} key={config.key} title={config.title} ediforms={config.ediforms} toolbar={config.toolbar} />
  }

  // 字节数组
  if (config.fieldType === 'bytesArray') {
    return <FormBytesArray value={input.value} onChange={input.onChange} placeholder={config.placeholder} disabled={config.disabled} />
  }

  // 多语言输入
  if (config.fieldType === 'languageInput') {
    // TODO: 实现多语言输入组件
    return <div className="text-sm text-muted-foreground">多语言输入（待实现）</div>
  }

  // 查找引用
  if (config.config === '查找引用') {
    return <FormReference schema={config} key={config.key} option={{ schema: { name: schema?.name } }} tableData={record} />
  }

  // 表单信息
  if (config.config === '表单信息') {
    return <FormFormInfo schema={config} outProps={{ inList: false, viewPage: true }} />
  }

  // 默认：根据基础类型显示
  if (config.type === 'string') {
    return <FormInput value={input.value} onChange={input.onChange} placeholder={config.placeholder} disabled={config.disabled} />
  }

  if (config.type === 'number') {
    return <FormInputNumber value={input.value} onChange={input.onChange} placeholder={config.placeholder} disabled={config.disabled} />
  }

  if (config.type === 'boolean') {
    return <FormCheckbox value={input.value} onChange={input.onChange} label={config.title} disabled={config.disabled} />
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
            "min-h-32 w-full text-sm text-muted-foreground",
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

export { FormWidget }
