import * as React from 'react'
import { FormRelate } from '@/registry/components/form-relate-component/form-relate-component'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './form-relate-component.md?raw'

export const formRelateComponentPropsConfig = [
  {
    name: 'displayField',
    label: '显示字段',
    type: 'text' as const,
    default: 'name',
    description: '用于显示的字段名称'
  },
  {
    name: 'internalTable',
    label: '内部表关联',
    type: 'boolean' as const,
    default: true,
    description: '是否为内部表关联'
  }
]

export const formRelateComponentDefaultProps = {
  displayField: 'name',
  internalTable: true,
  // 完整的测试参数
  schema: {
      "allowAdd": false,
      "allowSelectOld": true,
      "canOrder": false,
      "config": "关联字段",
      "createShow": true,
      "defaultVal": null,
      "descriptionType": "tooltip",
      "editShow": true,
      "filterFields": true,
      "invalid": false,
      "key": "asset_id",
      "listFields": true,
      "need": true,
      "properties": {},
      "recordSelectType": "select",
      "relate": {
        "fields": [
          {
            "fieldSchema": {
              "canOrder": false,
              "config": "文本",
              "createShow": true,
              "descriptionType": "tooltip",
              "editShow": true,
              "fieldType": "input",
              "invalid": false,
              "key": "name",
              "listFields": true,
              "need": false,
              "size": "middle",
              "textContent": "text",
              "textType": "input",
              "title": "资产名称",
              "type": "string",
              "widthInForm": "24"
            },
            "key": "name",
            "title": "资产名称"
          }
        ],
        "function": [
          "formschema",
          "tableClear"
        ],
        "i18nProp": {},
        "id": "资产",
        "tableMajorType": "normal",
        "tableType": "table",
        "title": "资产",
        "tt": "normal"
      },
      "relateShowFields": null,
      "selectType": "single",
      "showField": null,
      "showType": "select",
      "size": "middle",
      "title": "调拨资产",
      "type": "object",
      "widthInForm": "24"
    }
}

const renderFormRelateComponentPreview = (props: Record<string, any>) => {
  const [value, setValue] = React.useState(null)

  // schema 是包含 relate.id 的完整结构
  const schema = formRelateComponentDefaultProps.schema

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-2xl bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-sm text-green-700">
            <strong>纯组件版本：</strong>这是一个纯组件，filterObj 需要从外部传入。
            <br />
            <span className="text-xs">关联表ID: {schema.relate?.id} | 显示字段key: {props.displayField}</span>
          </p>
        </div>
        <FormRelate
          value={value}
          onChange={setValue}
          schema={schema}
          displayField={props.displayField}
          internalTable={props.internalTable}
          filterObj={{}}
        />
      </div>
    </div>
  )
}

const renderFormRelateComponentCodePreview = (props: Record<string, any>) => {
  return `<FormRelate
  value={value}
  onChange={(value) => setValue(value)}
  schema={schema}
  displayField="${props.displayField}"
  internalTable={${props.internalTable}}
  filterObj={filterObj}
/>`
}

export const formRelateComponentConfig: ComponentConfig = {
  id: 'form-relate-component',
  name: '关联字段（纯组件）',
  propsConfig: formRelateComponentPropsConfig,
  defaultProps: formRelateComponentDefaultProps,
  renderPreview: renderFormRelateComponentPreview,
  renderCodePreview: renderFormRelateComponentCodePreview,
  documentation: documentationMd
}

export default formRelateComponentConfig
