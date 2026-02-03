import * as React from 'react'
import { TableFieldSelect } from '@/registry/blocks/table-field/table-field-select/table-field-select'
import { ComponentConfig } from '@/app/config/types'

export const tableFieldSelectPropsConfig = [
  {
    name: 'selectFace',
    label: '选择器外观',
    type: 'select' as const,
    default: 'select',
    options: [
      { value: 'select', label: '下拉框' },
      { value: 'flat', label: '平铺' },
      { value: 'button', label: '按钮组' }
    ]
  },
  {
    name: 'selectType',
    label: '选择类型',
    type: 'select' as const,
    default: 'single',
    options: [
      { value: 'single', label: '单选' },
      { value: 'multiple', label: '多选' }
    ]
  },
  {
    name: 'dataType',
    label: '数据类型',
    type: 'select' as const,
    default: 'string',
    options: [
      { value: 'string', label: '字符串' },
      { value: 'number', label: '数字' }
    ]
  },
  {
    name: 'enumList',
    label: '选项列表',
    type: 'array' as const,
    default: ['option1', 'option2', 'option3'],
    description: '选项值数组'
  },
  {
    name: 'enumTitle',
    label: '选项标题',
    type: 'array' as const,
    default: ['选项1', '选项2', '选项3'],
    description: '选项显示文本数组'
  },
  {
    name: 'defaultVal',
    label: '默认值',
    type: 'text' as const,
    default: ''
  },
  {
    name: 'disabled',
    label: '禁用',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'allowClear',
    label: '允许清空',
    type: 'boolean' as const,
    default: true
  },
  {
    name: 'size',
    label: '尺寸',
    type: 'select' as const,
    default: 'middle',
    options: [
      { value: 'small', label: '小' },
      { value: 'middle', label: '中' },
      { value: 'large', label: '大' }
    ]
  }
]

export const tableFieldSelectDefaultProps = {
  selectFace: 'select' as 'select' | 'flat' | 'button',
  selectType: 'single' as 'single' | 'multiple',
  dataType: 'string' as 'string' | 'number',
  enumList: ['option1', 'option2', 'option3'],
  enumTitle: ['选项1', '选项2', '选项3'],
  defaultVal: '',
  disabled: false,
  allowClear: true,
  size: 'middle' as 'small' | 'middle' | 'large'
}

const renderTableFieldSelectPreview = (props: Record<string, any>) => {
  const [value, setValue] = React.useState(props.defaultVal || '')

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <TableFieldSelect
          input={{
            value,
            onChange: setValue
          }}
          field={{
            schema: {
              selectFace: props.selectFace,
              selectType: props.selectType,
              dataType: props.dataType,
              enumList: props.enumList,
              enumTitle: props.enumTitle,
              defaultVal: props.defaultVal,
              disabled: props.disabled,
              size: props.size
            }
          }}
          allowClear={props.allowClear}
        />
      </div>
    </div>
  )
}

const renderTableFieldSelectCodePreview = (props: Record<string, any>) => {
  return `<TableFieldSelect
  input={{
    value: value,
    onChange: (value) => setValue(value)
  }}
  field={{
    schema: {
      selectFace: "${props.selectFace}",
      selectType: "${props.selectType}",
      dataType: "${props.dataType}",
      enumList: ${JSON.stringify(props.enumList)},
      enumTitle: ${JSON.stringify(props.enumTitle)},
      defaultVal: "${props.defaultVal}",
      disabled: ${props.disabled},
      size: "${props.size}"
    }
  }}
  allowClear={${props.allowClear}}
/>`
}

export const tableFieldSelectConfig: ComponentConfig = {
  id: 'table-field-select',
  name: 'TableField.Select 选择器',
  propsConfig: tableFieldSelectPropsConfig,
  defaultProps: tableFieldSelectDefaultProps,
  renderPreview: renderTableFieldSelectPreview,
  renderCodePreview: renderTableFieldSelectCodePreview
}

export default tableFieldSelectConfig
