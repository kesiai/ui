import * as React from 'react'
import { FormRelatePlus } from '@/registry/components/form-relate-plus/form-relate-plus'
import { ComponentConfig } from '@/app/config/types'

export const formRelatePlusPropsConfig = [
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
    name: 'showType',
    label: '显示方式',
    type: 'select' as const,
    default: 'select',
    options: [
      { value: 'select', label: '选择器' },
      { value: 'card', label: '卡片' },
      { value: 'table', label: '表格' }
    ]
  },
  {
    name: 'allowAdd',
    label: '允许新增',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'allowSelectOld',
    label: '允许选择旧值',
    type: 'boolean' as const,
    default: true
  },
  {
    name: 'canOrder',
    label: '可排序',
    type: 'boolean' as const,
    default: false
  }
]

export const formRelatePlusDefaultProps = {
  selectType: 'single' as 'single' | 'multiple',
  showType: 'select' as 'select' | 'card' | 'table',
  allowAdd: false,
  allowSelectOld: true,
  canOrder: false,
  // 完整的测试参数
  relateSchema: {
    allowAdd: false,
    allowSelectOld: true,
    canOrder: false,
    config: "关联字段",
    createShow: true,
    defaultVal: null,
    descriptionType: "tooltip",
    editShow: true,
    insideFilter: [],
    invalid: false,
    key: "relate-table-6A5F",
    listFields: true,
    need: false,
    properties: {},
    recordSelectType: 'modal',
    relate: {
      fields: [
        {
          fieldSchema: {
            canOrder: false,
            config: "文本",
            createShow: true,
            descriptionType: "tooltip",
            editShow: true,
            fieldType: "input",
            invalid: false,
            key: "text-60CF",
            listFields: true,
            need: false,
            rowKey: "B5EE",
            size: "middle",
            textContent: "text",
            textType: "input",
            title: "批号",
            type: "string",
            widthInForm: "8"
          },
          key: "text-60CF",
          title: "批号"
        }
      ],
      function: [
        "formschema",
        "fieldRules",
        "tablePermission",
        "gis"
      ],
      i18nProp: {},
      id: "文本时间",
      tableMajorType: "normal",
      tableType: "table",
      title: "文本时间",
      tt: "normal"
    },
    relateShowFields: null,
    selectType: "single",
    showField: null,
    showType: "select",
    size: "middle",
    title: "关联字段",
    type: "object",
    widthInForm: "24"
  }
}

const renderFormRelatePlusPreview = (props: Record<string, any>) => {
  const [value, setValue] = React.useState(null)

  // relateSchema 是完整的 schema 结构，包含 relate.id
  const relateSchema = formRelatePlusDefaultProps.relateSchema

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-2xl bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-700">
            <strong>提示：</strong>此为关联字段Plus组件预览，实际使用时需要配置真实的数据表关联。
            <br />
            <span className="text-xs">关联表ID: {relateSchema.relate?.id} | 显示字段key: text-60CF (字段名: 批号)</span>
          </p>
        </div>
        <FormRelatePlus
          relateSchema={relateSchema}
          tableID={relateSchema.relate?.id || formRelatePlusDefaultProps.tableID}
          input={{
            value,
            onChange: setValue
          }}
          field={{
            schema: relateSchema,
            displayField: "text-60CF"  // 使用字段key，不是字段名
          }}
        />
      </div>
    </div>
  )
}

const renderFormRelatePlusCodePreview = (props: Record<string, any>) => {
  return `<FormRelatePlus
  relateSchema={{
    selectType: "${props.selectType}",
    showType: "${props.showType}",
    allowAdd: ${props.allowAdd},
    ... // 其他关联字段配置
  }}
  tableID="your-table-id"
  input={{
    value: value,
    onChange: (value) => setValue(value)
  }}
/>`
}

export const formRelatePlusConfig: ComponentConfig = {
  id: 'form-relate-plus',
  name: 'Form.RelatePlus 关联字段Plus',
  propsConfig: formRelatePlusPropsConfig,
  defaultProps: formRelatePlusDefaultProps,
  renderPreview: renderFormRelatePlusPreview,
  renderCodePreview: renderFormRelatePlusCodePreview
}

export default formRelatePlusConfig
