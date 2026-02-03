import * as React from 'react'
import { TableFieldUpload } from '@/registry/blocks/table-field/table-field-upload/table-field-upload'
import { ComponentConfig } from '@/app/config/types'

export const tableFieldUploadPropsConfig = [
  {
    name: 'styleType',
    label: '展示样式',
    type: 'select' as const,
    default: 'picture-card',
    options: [
      { value: 'picture-card', label: '图片卡片' },
      { value: 'text', label: '文本列表' },
      { value: 'video', label: '视频' },
      { value: 'audio', label: '音频' }
    ]
  },
  {
    name: 'accept',
    label: '接受文件类型',
    type: 'text' as const,
    default: '',
    description: '例如：.jpg,.png,.pdf 或留空使用默认类型'
  },
  {
    name: 'size',
    label: '文件大小限制(MB)',
    type: 'number' as const,
    default: undefined
  },
  {
    name: 'width',
    label: '宽度(px)',
    type: 'number' as const,
    default: 104,
    description: '图片卡片模式下的宽度'
  },
  {
    name: 'height',
    label: '高度(px)',
    type: 'number' as const,
    default: 104,
    description: '图片卡片模式下的高度'
  },
  {
    name: 'maxUploadNum',
    label: '最大上传数量',
    type: 'number' as const,
    default: undefined,
    description: '为空则不限制'
  },
  {
    name: 'disabled',
    label: '禁用',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'autoZip',
    label: '自动压缩',
    type: 'boolean' as const,
    default: false,
    description: '自动压缩图片'
  },
  {
    name: 'autoName',
    label: '自动重命名',
    type: 'boolean' as const,
    default: false,
    description: '上传时自动重命名文件'
  }
]

export const tableFieldUploadDefaultProps = {
  styleType: 'picture-card' as 'picture-card' | 'text' | 'video' | 'audio',
  accept: '',
  size: undefined,
  width: 104,
  height: 104,
  maxUploadNum: undefined,
  disabled: false,
  autoZip: false,
  autoName: false
}

const renderTableFieldUploadPreview = (props: Record<string, any>) => {
  const [value, setValue] = React.useState(null)

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-2xl bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <TableFieldUpload
          input={{
            value,
            onChange: setValue
          }}
          field={{
            schema: {
              styleType: props.styleType,
              accept: props.accept,
              size: props.size,
              width: props.width,
              height: props.height,
              maxUploadNum: props.maxUploadNum,
              disabled: props.disabled,
              autoZip: props.autoZip,
              autoName: props.autoName
            }
          }}
          type="upload_attachment"
        />
      </div>
    </div>
  )
}

const renderTableFieldUploadCodePreview = (props: Record<string, any>) => {
  return `<TableFieldUpload
  input={{
    value: value,
    onChange: (value) => setValue(value)
  }}
  field={{
    schema: {
      styleType: "${props.styleType}",
      accept: "${props.accept}",
      size: ${props.size},
      width: ${props.width},
      height: ${props.height},
      maxUploadNum: ${props.maxUploadNum},
      disabled: ${props.disabled},
      autoZip: ${props.autoZip},
      autoName: ${props.autoName}
    }
  }}
  type="upload_attachment"
/>`
}

export const tableFieldUploadConfig: ComponentConfig = {
  id: 'table-field-upload',
  name: 'TableField.Upload 上传',
  propsConfig: tableFieldUploadPropsConfig,
  defaultProps: tableFieldUploadDefaultProps,
  renderPreview: renderTableFieldUploadPreview,
  renderCodePreview: renderTableFieldUploadCodePreview
}

export default tableFieldUploadConfig
