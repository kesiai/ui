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
      // 基础类型
      { value: 'text', label: '📝 文本' },
      { value: 'textarea', label: '📃 多行文本' },
      { value: 'number', label: '🔢 数字' },
      { value: 'password', label: '🔒 密码' },
      { value: 'select', label: '📋 下拉选择' },
      { value: 'checkbox', label: '☑️ 复选框' },
      { value: 'radio', label: '⭕ 单选框' },
      { value: 'switch', label: '🔘 开关' },
      { value: 'slider', label: '🎚️ 滑块' },
      { value: 'date', label: '📅 日期' },
      { value: 'date-range', label: '📆 日期范围' },
      { value: 'time', label: '🕐 时间' },
      { value: 'rate', label: '⭐ 评分' },
      // 高级类型（原 TableField 类型）
      { value: 'rich-text', label: '📝 富文本编辑器' },
      { value: 'map', label: '🗺️ 地图定位' },
      { value: 'upload', label: '📎 附件上传' },
      { value: 'link', label: '🔗 链接组件' },
      { value: 'serial-number', label: '🔢 序列号' },
      { value: 'user-role', label: '👤 用户角色' },
      { value: 'bytes-array', label: '💾 字节数组' },
      { value: 'reference', label: '🔍 查找引用' },
      { value: 'form-info', label: '📋 表单信息' },
      { value: 'editable-table', label: '📊 可编辑表格' },
      { value: 'relate-plus', label: '🔗 关联字段Plus' },
      { value: 'relate', label: '🔗 关联字段' }
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
  type: 'text' as 'text' | 'textarea' | 'number' | 'password' | 'select' | 'checkbox' | 'radio' | 'switch' | 'slider' | 'date' | 'date-range' | 'time' | 'rate' |
    'rich-text' | 'map' | 'upload' | 'link' | 'serial-number' | 'user-role' |
    'bytes-array' | 'reference' | 'form-info' | 'editable-table' | 'relate-plus' | 'relate',
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
    'text': '文本',
    'textarea': '多行文本',
    'number': '数字',
    'password': '密码',
    'select': '下拉选择',
    'checkbox': '复选框',
    'radio': '单选框',
    'switch': '开关',
    'slider': '滑块',
    'date': '日期',
    'date-range': '日期范围',
    'time': '时间',
    'rate': '评分',
    'rich-text': '富文本编辑器',
    'map': '地图定位',
    'upload': '附件上传',
    'link': '链接组件',
    'serial-number': '序列号',
    'user-role': '用户角色',
    'bytes-array': '字节数组',
    'reference': '查找引用',
    'form-info': '表单信息',
    'editable-table': '可编辑表格',
    'relate-plus': '关联字段Plus',
    'relate': '关联字段'
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
      // 基础类型
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
      case 'date-range':
        return '2025-12-31 - 2026-3-12'
      case 'time':
        return '14:30:00'
      case 'textarea':
        return '这是多行文本示例\n第二行内容'

      // 高级类型
      case 'rich-text':
        return '<p>富文本示例</p>'
      case 'map':
        return { lng: 116.404, lat: 39.915, name: '北京市' }
      case 'upload':
        return [{ name: 'example.jpg', url: 'https://example.com/file.jpg' }]
      case 'link':
        return 'https://example.com'
      case 'serial-number':
        return 'SN20241201001'
      case 'user-role':
        return [{ name: '张三', id: 'user001' }]
      case 'bytes-array':
        return 'SGVsbG8gV29ybGQ='
      case 'reference':
        return [{ name: '关联项', value: '123' }]
      case 'form-info':
        return '表单信息示例'
      case 'editable-table':
        return [{ name: '张三', age: 25 }, { name: '李四', age: 30 }]
      case 'relate':
      case 'relate-plus':
        return [{id: "方法", name: "感特好22"}]

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
  return `import { ViewField } from '@/registry/components/view-field/view-field'

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
