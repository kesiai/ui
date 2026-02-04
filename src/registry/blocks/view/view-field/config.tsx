import React from 'react'
import ViewField from './view-field'
import { ComponentConfig } from '@/app/config/types'

export const viewFieldPropsConfig = [
  {
    name: 'name',
    label: '字段名称',
    type: 'text' as const,
    default: 'name',
    description: '字段的唯一标识符'
  },
  {
    name: 'label',
    label: '字段标签',
    type: 'text' as const,
    default: '名称',
    description: '字段显示的标签文本'
  },
  {
    name: 'type',
    label: '字段类型',
    type: 'select' as const,
    default: 'text',
    options: [
      { value: 'text', label: '文本' },
      { value: 'textarea', label: '多行文本' },
      { value: 'number', label: '数字' },
      { value: 'select', label: '下拉选择' },
      { value: 'checkbox', label: '复选框' },
      { value: 'radio', label: '单选框' },
      { value: 'switch', label: '开关' },
      { value: 'slider', label: '滑块' },
      { value: 'date', label: '日期' },
      { value: 'rate', label: '评分' }
    ],
    description: '字段的显示类型'
  },
  {
    name: 'value',
    label: '字段值',
    type: 'text' as const,
    default: '',
    description: '字段的值'
  },
  {
    name: 'description',
    label: '字段描述',
    type: 'text' as const,
    default: '',
    description: '字段的辅助说明文本'
  },
  {
    name: 'options',
    label: '选项配置',
    type: 'json' as const,
    default: '[]',
    description: '下拉选择或单选框的选项（JSON 数组格式）'
  },
  {
    name: 'min',
    label: '最小值',
    type: 'number' as const,
    default: 0,
    description: '滑块或数字的最小值'
  },
  {
    name: 'max',
    label: '最大值',
    type: 'number' as const,
    default: 100,
    description: '滑块或数字的最大值'
  },
  {
    name: 'format',
    label: '日期格式',
    type: 'text' as const,
    default: 'YYYY-MM-DD',
    description: '日期的显示格式'
  },
  {
    name: 'showExample',
    label: '显示示例',
    type: 'boolean' as const,
    default: true,
    description: '是否在预览中显示示例'
  }
]

export const viewFieldDefaultProps = {
  name: 'name',
  label: '名称',
  type: 'text',
  value: '示例文本',
  description: '这是字段的描述信息',
  options: [],
  min: 0,
  max: 100,
  format: 'YYYY-MM-DD',
  showExample: true
}

const renderViewFieldPreview = (props: Record<string, any>) => {
  // 解析 options
  let options = props.options || []
  try {
    options = typeof props.options === 'string'
      ? JSON.parse(props.options)
      : props.options
  } catch (e) {
    options = []
  }

  const typeMap: Record<string, string> = {
    text: '文本',
    textarea: '多行文本',
    number: '数字',
    select: '下拉选择',
    checkbox: '复选框',
    radio: '单选框',
    switch: '开关',
    slider: '滑块',
    date: '日期',
    rate: '评分'
  }

  // 示例数据
  const mockItem = {
    field: {
      options,
      min: props.min,
      max: props.max
    }
  }

  // 根据类型生成示例值
  const getExampleValue = () => {
    switch (props.type) {
      case 'checkbox':
        return true
      case 'switch':
        return true
      case 'number':
        return 42
      case 'slider':
        return 65
      case 'rate':
        return 4
      case 'select':
      case 'radio':
        return options.length > 0 ? options[0].value : 'option1'
      case 'date':
        return '2025-12-31'
      default:
        return props.value || '示例文本'
    }
  }

  return (
    <div className="h-full flex items-center justify-center p-8 overflow-auto">
      <div className="w-full max-w-3xl">
        <h3 className="text-lg font-semibold mb-4 text-center">ViewField 字段显示组件</h3>
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          {props.showExample ? (
            <div className="space-y-6">
              {/* 配置展示 */}
              <div className="text-sm text-slate-600">
                <p className="font-semibold mb-2">📋 当前配置：</p>
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <div className="flex gap-6">
                    <p><strong>字段名称：</strong><code className="ml-2 px-2 py-1 bg-white rounded text-xs">{props.name}</code></p>
                    <p><strong>字段类型：</strong>{typeMap[props.type] || props.type}</p>
                    <p><strong>字段标签：</strong>{props.label || '-'}</p>
                  </div>
                  <div className="flex gap-6">
                    <p><strong>描述：</strong>{props.description || '-'}</p>
                    {(props.type === 'slider' || props.type === 'number') && (
                      <>
                        <p><strong>最小值：</strong>{props.min}</p>
                        <p><strong>最大值：</strong>{props.max}</p>
                      </>
                    )}
                    {props.type === 'date' && (
                      <p><strong>日期格式：</strong><code className="ml-2 px-2 py-1 bg-white rounded text-xs">{props.format}</code></p>
                    )}
                  </div>
                  {(props.type === 'select' || props.type === 'radio') && options.length > 0 && (
                    <p><strong>选项：</strong>
                      <code className="ml-2 px-2 py-1 bg-white rounded text-xs">
                        {options.map((opt: any) => opt.label).join(', ')}
                      </code>
                    </p>
                  )}
                </div>
              </div>

              {/* 功能说明 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>💡 ViewField 说明</strong>
                </p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• <strong>多种类型</strong>：支持 text、textarea、number、select、checkbox、radio、switch、slider、date、rate</li>
                  <li>• <strong>灵活配置</strong>：可配置标签、描述、选项等属性</li>
                  <li>• <strong>自定义渲染</strong>：支持通过 children 自定义渲染内容</li>
                  <li>• <strong>样式统一</strong>：使用统一的 Field、FieldLabel、FieldDescription 组件</li>
                  <li>• <strong>类型映射</strong>：根据 type 自动选择对应的显示组件</li>
                  <li>• 支持多种日期格式（通过 dayjs 格式化）</li>
                  <li>• 支持滑块、评分等交互式显示</li>
                </ul>
              </div>

              {/* 组件预览 */}
              <div className="border-t border-slate-200 pt-6">
                <p className="text-sm text-slate-600 mb-4">组件预览：</p>
                <div className="bg-slate-50 rounded-lg p-6">
                  <ViewField
                    name={props.name}
                    label={props.label}
                    type={props.type}
                    value={getExampleValue()}
                    description={props.description}
                    item={mockItem}
                    options={options.length > 0 ? options : undefined}
                    min={props.min}
                    max={props.max}
                    format={props.format}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-sm p-4 border border-dashed border-slate-300 rounded-md">
              ViewField 字段显示组件（已隐藏示例）
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const renderViewFieldCodePreview = (props: Record<string, any>) => {
  return `import { ViewField } from '@/registry/blocks/view/view-field/view-field'

const MyField = ({ data }: { data: any }) => {
  return (
    <ViewField
      name="${props.name}"
      label="${props.label}"
      type="${props.type}"
      value={data.${props.name}}
      description="${props.description}"
      item={data}
      ${['select', 'radio'].includes(props.type) ? `options={${JSON.stringify(props.options || [])}}` : ''}
      ${props.type === 'slider' ? `min={${props.min}} max={${props.max}}` : ''}
      ${props.type === 'date' ? `format="${props.format}"` : ''}
      ${props.type === 'rate' ? `max={${props.max}}` : ''}
    />
  )
}`
}

export const viewFieldConfig: ComponentConfig = {
  id: 'view-field',
  name: 'ViewField 字段显示组件',
  propsConfig: viewFieldPropsConfig,
  defaultProps: viewFieldDefaultProps,
  renderPreview: renderViewFieldPreview,
  renderCodePreview: renderViewFieldCodePreview
}
