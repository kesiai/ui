import { TextArea } from '@/registry/components/textarea/textarea'
import { ComponentConfig } from '@/app/config/types'

export const textareaPropsConfig = [
  {
    name: 'content',
    label: '文字内容',
    type: 'text' as const,
    default: '这是一段多行文本示例。\n可以输入多行内容。',
    placeholder: '请输入文本内容'
  },
  {
    name: 'textIndent',
    label: '首行缩进（像素）',
    type: 'number' as const,
    default: 0,
    min: 0,
    max: 100,
    step: 1,
    description: '设置文本首行缩进的像素数'
  },
  {
    name: 'placeholder',
    label: '占位提示',
    type: 'text' as const,
    default: '请输入文本信息',
    placeholder: '请输入占位文本'
  },
  {
    name: 'rows',
    label: '行数',
    type: 'number' as const,
    default: 4,
    min: 2,
    max: 20,
    step: 1
  },
  {
    name: 'disabled',
    label: '禁用状态',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'readOnly',
    label: '只读状态',
    type: 'boolean' as const,
    default: false
  }
]

export const textareaDefaultProps = {
  content: '这是一段多行文本示例。\n可以输入多行内容。',
  textIndent: 0,
  placeholder: '请输入文本信息',
  rows: 4,
  disabled: false,
  readOnly: false
}

const renderTextareaPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <TextArea
          content={props.content}
          textIndent={props.textIndent}
          placeholder={props.placeholder}
          rows={props.rows}
          disabled={props.disabled}
          readOnly={props.readOnly}
        />
      </div>
    </div>
  )
}

const renderTextareaCodePreview = (props: Record<string, any>) => {
  return `<TextArea
  content="${props.content.replace(/\n/g, '\\n')}"
  ${props.textIndent > 0 ? `textIndent={${props.textIndent}}` : ''}
  placeholder="${props.placeholder}"
  rows={props.rows}
  ${props.disabled ? 'disabled' : ''}
  ${props.readOnly ? 'readOnly' : ''}
/>`
}

export const textareaConfig: ComponentConfig = {
  id: 'textarea',
  name: 'TextArea 多行文本',
  propsConfig: textareaPropsConfig,
  defaultProps: textareaDefaultProps,
  renderPreview: renderTextareaPreview,
  renderCodePreview: renderTextareaCodePreview
}
