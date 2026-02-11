import { Text } from '@/registry/components/text/text'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './text.md?raw'

export const textPropsConfig = [
  {
    name: 'content',
    label: '文字内容',
    type: 'text' as const,
    default: '这是一段示例文本',
    placeholder: '请输入文本内容'
  },
  {
    name: 'textType',
    label: '文本类型',
    type: 'select' as const,
    default: 'mainText',
    options: [
      { value: 'mainText', label: '正文' },
      { value: 'title1', label: '标题1' },
      { value: 'title2', label: '标题2' },
      { value: 'title3', label: '标题3' },
      { value: 'title4', label: '标题4' },
      { value: 'title5', label: '标题5' },
      { value: 'paragraph', label: '段落' }
    ]
  },
  {
    name: 'showMode',
    label: '显示模式',
    type: 'select' as const,
    default: 'inline',
    options: [
      { value: 'inline', label: '行内显示' },
      { value: 'block', label: '块级显示' },
      { value: 'inline-block', label: '行内块显示' }
    ]
  },
  {
    name: 'textIndent',
    label: '首行缩进（像素）',
    type: 'number' as const,
    default: 0,
    min: 0,
    max: 100,
    step: 1
  },
  {
    name: 'isTrim',
    label: '去除空格',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'ellipsis',
    label: '超出省略',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'placeholder',
    label: '占位文本',
    type: 'text' as const,
    default: '请输入文本信息',
    placeholder: '请输入占位文本'
  }
]

export const textDefaultProps = {
  content: '这是一段示例文本',
  textType: 'mainText' as const,
  showMode: 'inline' as const,
  textIndent: 0,
  isTrim: false,
  ellipsis: false,
  placeholder: '请输入文本信息'
}

const renderTextPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <Text
          content={props.content}
          textType={props.textType}
          showMode={props.showMode}
          textIndent={props.textIndent}
          isTrim={props.isTrim}
          ellipsis={props.ellipsis}
          placeholder={props.placeholder}
        />
      </div>
    </div>
  )
}

const renderTextCodePreview = (props: Record<string, any>) => {
  return `<Text
  content="${props.content}"
  textType="${props.textType}"
  showMode="${props.showMode}"
  ${props.textIndent > 0 ? `textIndent={${props.textIndent}}` : ''}
  ${props.isTrim ? 'isTrim' : ''}
  ${props.ellipsis ? 'ellipsis' : ''}
  placeholder="${props.placeholder}"
/>`
}

export const textConfig: ComponentConfig = {
  id: 'text',
  name: 'Text 文本',
  propsConfig: textPropsConfig,
  defaultProps: textDefaultProps,
  renderPreview: renderTextPreview,
  renderCodePreview: renderTextCodePreview,
  documentation: documentationMd
}
