import SchemaForm from '@/registry/components/schema-form/schema-form'
import { ComponentConfig } from '@/app/config/types'
import { layoutPresets } from '@/registry/components/form/config'

export const schemaFormPropsConfig = [
  {
    name: 'formId',
    label: '表单ID',
    type: 'text' as const,
    default: 'schema-form-demo',
    description: '表单的唯一标识符'
  },
  {
    name: 'layout',
    label: '布局样式',
    type: 'select' as const,
    default: 'default',
    options: Object.keys(layoutPresets).map(key => ({
      value: key,
      label: layoutPresets[key].name
    })),
    description: '选择表单的布局样式'
  },
  {
    name: 'classNames',
    label: '自定义样式类',
    type: 'json' as const,
    default: JSON.stringify(layoutPresets.default, null, 2),
    description: '自定义表单各元素的 className (JSON格式)'
  },
  {
    name: 'mode',
    label: '验证模式',
    type: 'select' as const,
    default: 'onSubmit',
    options: [
      { value: 'onSubmit', label: '提交时验证' },
      { value: 'onBlur', label: '失焦时验证' },
      { value: 'onChange', label: '变更时验证' },
      { value: 'all', label: '全部触发' }
    ],
    description: '表单验证的触发时机'
  },
  {
    name: 'reValidateMode',
    label: '重新验证模式',
    type: 'select' as const,
    default: 'onChange',
    options: [
      { value: 'onChange', label: '变更时' },
      { value: 'onBlur', label: '失焦时' },
      { value: 'onSubmit', label: '提交时' }
    ],
    description: '错误状态下的重新验证时机'
  },
  {
    name: 'schema',
    label: 'JSON Schema',
    type: 'json' as const,
    default: '{\n  "type": "object",\n  "properties": {\n    "username": {\n      "type": "string",\n      "title": "用户名"\n    },\n    "email": {\n      "type": "string",\n      "title": "邮箱",\n      "format": "email"\n    },\n    "age": {\n      "type": "number",\n      "title": "年龄"\n    },\n    "bio": {\n      "type": "string",\n      "title": "个人简介"\n    },\n    "subscribe": {\n      "type": "boolean",\n      "title": "订阅邮件"\n    },\n    "rating": {\n      "type": "number",\n      "title": "评分"\n    }\n  },\n  "required": ["username", "email"]\n}',
    description: 'JSON Schema 格式的表单定义'
  },
  {
    name: 'formSchema',
    label: '表单 Schema',
    type: 'json' as const,
    default: '{\n  "username": {\n    "type": "text",\n    "placeholder": "请输入用户名",\n    "description": "3-20个字符"\n  },\n  "email": {\n    "type": "text",\n    "placeholder": "请输入邮箱地址",\n    "description": "用于接收通知"\n  },\n  "age": {\n    "type": "number",\n    "placeholder": "请输入年龄",\n    "description": "必须大于18岁"\n  },\n  "bio": {\n    "type": "textarea",\n    "placeholder": "请输入个人简介",\n    "description": "介绍一下你自己"\n  },\n  "subscribe": {\n    "type": "checkbox",\n    "description": "是否订阅邮件通知"\n  },\n  "rating": {\n    "type": "rate",\n    "description": "请为我们的服务评分"\n  }\n}',
    description: '表单字段的 UI 配置（可选）'
  },
  {
    name: 'showExample',
    label: '显示示例表单',
    type: 'boolean' as const,
    default: true,
    description: '是否在预览中显示示例表单'
  }
]

export const schemaFormDefaultProps = {
  formId: 'schema-form-demo',
  layout: 'default' as keyof typeof layoutPresets,
  classNames: null,
  mode: 'onSubmit' as 'onSubmit' | 'onBlur' | 'onChange' | 'all',
  reValidateMode: 'onChange' as 'onChange' | 'onBlur' | 'onSubmit',
  schema: {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        title: '用户名'
      },
      email: {
        type: 'string',
        title: '邮箱',
        format: 'email'
      },
      age: {
        type: 'number',
        title: '年龄'
      },
      bio: {
        type: 'string',
        title: '个人简介'
      },
      subscribe: {
        type: 'boolean',
        title: '订阅邮件'
      },
      rating: {
        type: 'number',
        title: '评分'
      }
    },
    required: ['username', 'email']
  },
  formSchema: [
    { name: "name" }, "*"
  ],
  showExample: true
}

const renderSchemaFormPreview = (props: Record<string, any>) => {
  const handleSubmit = (data: any) => {
    console.log('SchemaForm submitted:', data)
    alert('表单已提交，数据：' + JSON.stringify(data, null, 2))
  }

  // 解析 schema 和 formSchema
  let schema = props.schema
  let formSchema = props.formSchema

  try {
    schema = typeof props.schema === 'string'
      ? JSON.parse(props.schema)
      : props.schema
  } catch (e) {
    console.warn('Failed to parse schema:', e)
    schema = schemaFormDefaultProps.schema
  }

  try {
    formSchema = typeof props.formSchema === 'string'
      ? JSON.parse(props.formSchema)
      : props.formSchema
  } catch (e) {
    console.warn('Failed to parse formSchema:', e)
    formSchema = schemaFormDefaultProps.formSchema
  }

  // 根据 layout 选择对应的预设样式
  const layoutStyles = layoutPresets[props.layout] || layoutPresets.default
  const classNames = props.classNames ||
    {
      group: layoutStyles.container,
      field: layoutStyles.field,
      label: layoutStyles.label,
      input: layoutStyles.input,
      description: layoutStyles.descriptionClass,
      error: layoutStyles.error
    }

  return (
    <div className="h-full flex items-center justify-center p-8 overflow-auto">
      <div className="w-full max-w-2xl">
        <h3 className="text-lg font-semibold mb-4 text-center">SchemaForm 表单</h3>
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8">
          {props.showExample ? (
            <SchemaForm
              formId={props.formId}
              mode={props.mode}
              reValidateMode={props.reValidateMode}
              schema={schema}
              formSchema={formSchema}
              onSubmit={handleSubmit}
              classNames={classNames}
            >
              <div className="mt-6 pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                >
                  提交表单
                </button>
              </div>
            </SchemaForm>
          ) : (
            <div className="text-slate-500 text-sm p-4 border border-dashed border-slate-300 rounded-md">
              SchemaForm 容器（已隐藏示例）
            </div>
          )}
        </div>

        {/* Schema 说明 */}
        {props.showExample && (
          <div className="mt-6 bg-slate-50 rounded-lg border border-slate-200 p-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">💡 SchemaForm 说明</h4>
            <p className="text-xs text-slate-700 mb-3">
              SchemaForm 通过 JSON Schema 自动生成表单字段。您可以通过配置 schema 和 formSchema 来定义表单结构。
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="text-xs font-semibold text-slate-900 mb-2">JSON Schema</h5>
                <p className="text-xs text-slate-600">
                  定义数据结构和验证规则
                </p>
              </div>
              <div>
                <h5 className="text-xs font-semibold text-slate-900 mb-2">Form Schema</h5>
                <p className="text-xs text-slate-600">
                  定义字段的 UI 表现形式
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const renderSchemaFormCodePreview = (props: Record<string, any>) => {
  const schemaStr = typeof props.schema === 'object'
    ? JSON.stringify(props.schema, null, 2)
    : props.schema

  const formSchemaStr = typeof props.formSchema === 'object'
    ? JSON.stringify(props.formSchema, null, 2)
    : props.formSchema

  return `import { SchemaForm } from '@airiot/client'

const MySchemaForm = () => {
  const handleSubmit = (data: any) => {
    console.log('Form submitted:', data)
  }

  const schema = ${schemaStr}

  const formSchema = ${formSchemaStr}

  return (
    <SchemaForm
      formId="${props.formId}"
      mode="${props.mode}"
      reValidateMode="${props.reValidateMode}"
      schema={schema}
      formSchema={formSchema}
      onSubmit={handleSubmit}
    >
      {(methods) => (
        <button type="submit">提交</button>
      )}
    </SchemaForm>
  )
}`
}

export const schemaFormConfig: ComponentConfig = {
  id: 'schema-form',
  name: 'SchemaForm JSON Schema 表单',
  propsConfig: schemaFormPropsConfig,
  defaultProps: schemaFormDefaultProps,
  renderPreview: renderSchemaFormPreview,
  renderCodePreview: renderSchemaFormCodePreview
}
