import React from 'react'
import { lazy } from 'xadmin-ui'

const FormWidget = lazy(() => import('./common').then(mod => ({ default: mod.FormWidget })))
const UploadAttachment = lazy(() => import('../fieldComponent/UploadAttachment'))
const SingleUpload = lazy(() => import('../component/Editor/schema/upload').then(mod => ({ default: mod.SingleUpload })))

const UploadWidget = (props) => {
  return <FormWidget
    {...props}
    Component={UploadAttachment}
    extraField={{
      type: props.config?.uploadType === 'one' ? 'upload_attachment' : undefined
    }}
  />
}

const configList = ['styleType', 'accept', 'uploadPosition', 'width', 'height', 'size',
'folderType', 'folder', 'ftp', 'textToAudio', 'onlyCamera', 'mediaDelete' ]

const paramSchema = {
  type: 'object',
  properties: {
    config: {
      title: _r('配置项'),
      type: 'object',
      properties: {
        uploadType: {
          title: _r('单多选'),
          type: 'string',
          enum1: ['one', 'many'],
          enum_title1: [_r('单选'), _r('多选')],
        },
        ..._.pick(SingleUpload.properties, configList),
        onlyCamera: {
          title: _r('仅能通过移动端拍摄上传'),
          type: 'boolean',
          description: _r('勾选后，上传图片时只支持移动端相机拍摄上传，不支持本地上传图片'),
          field: {
            effect: (f, form) => {
              setTimeout(() => {
                form.setFieldData('accept', { display: !f.value })
                form.setFieldData('uploadPosition', { display: !f.value })
                form.setFieldData('folderType', { display: !f.value })
              })
            }
          }        },
        disabled: {
          type: 'boolean',
          title: _r('禁用状态')
        }
      },
      formEffect: SingleUpload.formEffect
    }
  }
}

const desc = ``
const shortcuts = [
  '只能上传png，不能超过200M',
  '有FTP前缀，仅能从媒体库上传'
]

const Upload = {
  title: _r('附件'),
  category: [_r('基础表单'), _r('数据表组件')],
  icon: require('./icons/附件.svg'),
  component: UploadWidget,
  initLayout: { width: 220, height: 110 },
  initParam: {
    labelLayout: 'horizontal',
    config: {
      uploadType: 'many',
      styleType: 'picture-card',
      uploadPosition: 'both',
      accept: 'image/*',
      ftp: false,      textToAudio: false,
      onlyCamera: false,
      mediaDelete: false,
      disabled: false
    }
  },
  paramSchema,
  desc,
  shortcuts,
  theme: [
    { selector: '.widget-input .ant-input', title: _r('输入框样式') }
  ]
}

export default Upload