import * as React from 'react'
import { FormRelate } from '@/registry/components/form-relate/form-relate'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './form-relate.md?raw'

export const formRelatePropsConfig = [
  {
    name: 'internalTable',
    label: '内部表关联',
    type: 'boolean' as const,
    default: true,
    description: '是否为内部表关联'
  },
  {
    name: 'displayField',
    label: '显示字段',
    type: 'text' as const,
    default: 'name'
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

export const formRelateDefaultProps = {
  internalTable: true,
  displayField: 'text-60CF',
  selectType: 'single' as 'single' | 'multiple',
  allowSelectOld: true,
  canOrder: false,
  // 完整的测试参数
  fieldSchema: {
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
    recordSelectType: "select",
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

const renderFormRelatePreview = (props: Record<string, any>) => {
  const [value, setValue] = React.useState(null)

  // schema 是包含 relate.id 的完整结构
  const schema = formRelateDefaultProps.fieldSchema

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-2xl bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-700">
            <strong>提示：</strong>此为关联字段组件预览，实际使用时需要配置真实的数据表关联。
            <br />
            <span className="text-xs">关联表ID: {schema.relate?.id} | 显示字段key: {props.displayField}</span>
          </p>
        </div>
        <FormRelate
          input={{
            value,
            onChange: setValue
          }}
          field={{
            displayField: props.displayField,
            internalTable: props.internalTable,
            schema: schema,
            fieldSchema: schema
          }}
        />
      </div>
    </div>
  )
}

const renderFormRelateCodePreview = (props: Record<string, any>) => {
  return `<FormRelate
  input={{
    value: value,
    onChange: (value) => setValue(value)
  }}
  field={{
    displayField: "${props.displayField}",
    internalTable: ${props.internalTable},
    schema: ${JSON.stringify(formRelateDefaultProps.fieldSchema, null, 2)}
  }}
/>`
}

export const formRelateConfig: ComponentConfig = {
  id: 'form-relate',
  name: 'Form.Relate 关联字段',
  propsConfig: formRelatePropsConfig,
  defaultProps: formRelateDefaultProps,
  renderPreview: renderFormRelatePreview,
  renderCodePreview: renderFormRelateCodePreview,
  documentation: documentationMd
}

export default formRelateConfig
