import React, { useEffect } from 'react'
import { app, use } from 'xadmin'
import { C } from 'xadmin-ui'
import { SchemaForm } from 'xadmin-form'
import { Select, Checkbox, Modal, Form, Tooltip, InputNumber, Input } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import { baseConfig, keyForm, commonFormEffect, editConfig } from './common'
import { FormTitle } from '../component/PropertiesForm'
import Icon from '../component/Icon'
import UploadAttachment, { fileType, imageType, videoType, audioType } from '../../../fieldComponent/UploadAttachment'
import _ from 'lodash'
import DVContainer from '../component/DefaultValContainer'

// 类型下拉选
const acceptComponent = ({ input }) => {
  const { form } = use('form')
  const { settings } = use('get.settings')
  const [options, setOptions] = React.useState([])
  

  React.useEffect(() => {
    if (!settings?.ftpSettings) {
      // ftp 根据系统是否安装显示
      setTimeout(() => form.setFieldData('ftp', { display: false }))
    }
  }, [])

  React.useEffect(() => {
    form.useEffect(({ values }) => {
      let ops = [
        ...imageType.map(v => ({ label: v, value: '.' + v })),
        { label: _t1('全部'), value: 'image/*' }
      ]
      if (values.styleType === 'text') {
        ops = [
          ...fileType.map(v => ({ label: v, value: '.' + v })),
          { label: _t1('全部'), value: '*' }
        ]
      } else if (values.styleType === 'video') {
        ops = [
          ...videoType.map(v => ({ label: v, value: '.' + v })),
          { label: _t1('全部'), value: 'video/*' }
        ]
      } else if (values.styleType === 'audio') {
        ops = [
          ...audioType.map(v => ({ label: v, value: '.' + v })),
          { label: _t1('全部'), value: 'audio/*' }
        ]
      }
      setOptions(ops)
      let l = values.accept ? values.accept?.split(',') : null
      if (l) {
        l.forEach(item => {
          if (!ops.find(item2 => item2.value === item)) {
            form.change('accept', null)
          }
        })
      }
    })
  }, [])

  const handleChange = val => {
    if (val.indexOf('*') > -1) { // 文件不限制
      input.onChange('*')
    } else if (val.indexOf('image/*') > -1) { // 图片不限制
      input.onChange('image/*')
    } else if (val.indexOf('video/*') > -1) { // 视频不限制
      input.onChange('video/*')
    } else if (val.indexOf('audio/*') > -1) { // 音频不限制
      input.onChange('audio/*')
    } else {
      input.onChange(val.join(','))
    }
  }

  return <Select
    mode='multiple'
    options={options}
    value={input.value ? input.value.split(',') : []}
    onChange={handleChange}
    allowClear
  />
}

const FormLayout = ({ children }) => {
  return (
    <Form style={{ padding: '0 10px' }}>
      <FormTitle>{_t1('内容配置')}</FormTitle>
      {children.filter(item => ['contentType', 'content'].includes(item.key))}
      <FormTitle>{_t1('样式配置')}</FormTitle>
      {children.filter(item => ['position', 'color', 'fontSize', 'space', 'rotate'].includes(item.key))}
    </Form>
  )
}

const waterSchema = {
  type: 'object',
  properties: {
    contentType: {
      title: _r('显示信息'),
      type: 'string',
      enum1: ['time', 'user', 'text'],
      enum_title1: [_r('拍摄时间'), _r('拍摄人'), _r('文本内容')],
      field: {
        effect: (f, form) => {
          const value = f.value
          setTimeout(() => {
            form.setFieldData('content', { display: value === 'text' })
          })
        }
      }
    },
    content: {
      title: _r('文本信息'),
      type: 'string'
    },
    position: {
      title: _r('显示位置'),
      type: 'string',
      enum1: ['center-center', 'right-bottom', 'right-top', 'left-bottom', 'left-top', 'repeat'],
      enum_title1: [_r('居中'), _r('右下方'), _r('右上方'), _r('左下方'), _r('左上方'), _r('重复铺满')],
      field: {
        effect: (f, form) => {
          const value = f.value
          setTimeout(() => {
            form.setFieldData('space', { display: value === 'repeat' })
            form.setFieldData('rotate', { display: value === 'repeat' })
          })
        }
      }
    },
    color: {
      title: _r('水印信息颜色'),
      type: 'string',
      fieldType: 'color'
    },
    fontSize: {
      title: _r('水印字体大小'),
      type: 'number'
    },
    space: {
      title: _r('水印信息间距'),
      type: 'number'
    },
    rotate: {
      title: _r('水印旋转角度'),
      type: 'number'
    }
  },
  required: ['contentType']
}

// 水印配置项
const WatermarkOpt = ({ input }) => {
  const [vis, setVis] = React.useState(false)
  const onChange = (e) => {
    input.onChange({
      ...(input.value || {}),
      use: e.target.checked,
      contentType: e.target.checked ? (input.value?.contentType || 'time') : null
    })
  }
  const changeOpt = (v) => {
    const res = v || {}
    if (!res.contentType || (res.contentType === 'text' && !res.content)) { // 未配置水印内容
      res.use = false
    } else {
      res.use = true
    }
    input.onChange(res)
  }
  return <>
    <Checkbox checked={input.value?.use} onChange={onChange}>{_t1('照片水印')}</Checkbox>
    <SettingOutlined onClick={() => setVis(true)} style={{ cursor: 'pointer' }} />
    <Modal visible={vis} title={_t1("水印信息配置")} onCancel={() => setVis(false)} footer={null}>
      <C is="I18nSchemaForm"
        onChange={changeOpt}
        formKey="watermark"
        initialValues={input.value}
        schema={waterSchema}
        component={FormLayout}
      />
    </Modal>
  </>
}

// 移动端配置项
const OnlyCamera = ({ input, field }) => {
  const onChange = (e) => {
    input.onChange(e.target.checked)
  }
  return <>
    <Checkbox checked={input.value} onChange={onChange}>
      {_t1('仅能通过移动端拍摄上传')}
      <Tooltip placement="top" title={field.description} >
        <Icon type="question-circle" style={{ color: 'rgba(0, 0, 0, 0.45)' }} />
      </Tooltip>
    </Checkbox>
  </>
}

const PreviewSize = ({ input: { value = {}, onChange } }) => {
  const chg = (v, f) => {
    onChange({ ...value, [f]: v })
  }
  return <>
    <InputNumber onChange={v => chg(v, 'width')} value={value.width} min={0} placeholder={_t1('宽')} />
    <InputNumber onChange={v => chg(v, 'height')} value={value.height} min={0} placeholder={_t1('高')} style={{ marginLeft: 10 }} />
  </>
}

const Folder = ({ input }) => {
  const [state, setState] = React.useState({
    type: input.value ? (input.value?.startsWith('我的文件/') ? 'private' : 'public') : null,
    dir: input.value?.startsWith('我的文件/') ? input.value?.substring(5) : input.value
  })
  const options = [
    { value: 'public', label: _t1('公共目录') },
    { value: 'private', label: _t1('个人目录') }
  ]
  const handleChange = (t, val) => {
    setState(before => {
      const res = t === 'type' ? (val ? { [t]: val } : {}) : {
        ...before,
        [t]: val
      }
      input.onChange(res.type === 'public' ? res.dir : (res.type === 'private' ? ('我的文件/' + (res.dir || '')) : null) )
      return res
    })
  }

  return <>
    <Select
      value={state.type}
      onChange={v => handleChange('type', v)}
      options={options}
      allowClear
      placeholder={_t1('类型')}
    />
    {
      state.type === 'public' ? <C is="Media.FolderSelectTree"
        input={{ value: state.dir, onChange: v => handleChange('dir', v) }}
        omit={['我的文件']}
      /> : state.type === 'private' ? <Input
        value={state.dir}
        onChange={e => handleChange('dir', e.target.value)}
      /> : null
    }
  </>
}

const publicConfig = {
  properties: {
    styleType: {
      title: _r("类型"),
      type: "string",
      enum1: ['text', 'picture', 'picture-card', 'video', 'audio'],
      enum_title1: [_r('文件'), _r('图片'), _r('图片卡片'), _r('视频'), _r('音频')],
      field: {
        effect: (f, form) => {
          setTimeout(() => {
            const path = f.name.split('styleType')?.[0] || ''
            form.setFieldData(`${path}showType`, { display: f.value === 'picture-card' })
          })
        }
      }
    },
    showType: {
      title: _r('显示方式'),
      type: "string",
      enum1: ['smallImage', 'card'],
      enum_title1: [_r('缩略图'), _r('卡片')],
      selectFace: "flatten",
      selectType: 'single',
      field: {
        defaultValue: 'card'
      }
    },
    accept: {
      title: _r("格式"),
      type: "string",
      field: {
        component: acceptComponent
      }
      // description: "例如image/*(所有类型图片),或.png,.doc(特定格式文件)"
    },
    uploadPosition: {
      title: _r("上传位置"),
      type: "string",
      enum1: ['media', 'local', 'both'],
      enum_title1: [_r('仅从媒体库'), _r('仅本地上传'), _r('不限制')]
    },
    mediaDelete: {
      title: _r("删除媒体库源文件"),
      type: "boolean",
    },
    autoZip: {
      title: _r("自动压缩"),
      type: "boolean",
    },
    size: {
      title: _r("大小"),
      type: "number",
      description: _r("允许上传文件的最大值(MB)")
    },
    allScript: editConfig.allScript,
    width: {
      title: _r("宽度"),
      type: "number",
    },
    height: {
      title: _r("高度"),
      type: "number",
    },
    previewSize: {
      title: _r("预览尺寸"),
      type: "object",
      properties: {},
      field: {
        component: PreviewSize
      },
      description: _r('设置鼠标悬浮图片时，图片的预览尺寸，当只填写宽度时，高度将根据图片比例自适应，若不设置预览尺寸，默认为300X300px')
    },
    folderType: {
      title: _r("存储目录"),
      type: "string",
      enum1: ['none', 'folder', 'upload'],
      enum_title1: [_r('不指定'), _r('指定文件夹'), _r('上传时指定')],
      // selectFace: "flatten",
      // selectType: 'single',
      description: _r('若未指定，文件将自动保存至根目录;若指定目录，上传的文件会自动存储到所选目录下:若上传时指定，用户可自主上传时选择存储目录。'),
      field: {
        effect: ({ value, name }, form) => {
          setTimeout(() => {
            const path = name.split('folderType')?.[0] || ''
            form.setFieldData(`${path}folder`, { display: value === 'folder', required: value === 'folder' })
          })
        }
      }
    },
    widthInForm: editConfig.widthInForm,
    folder: {
      title: _r('文件夹'),
      type: 'string',
      field: {
        component: Folder
      }
    },
    ...baseConfig,
    createShow: {
      title: _r("创建时显示"),
      type: "boolean"
    },
    editShow: {
      title: _r("修改时显示"),
      type: "boolean"
    },
    detailNotShow: {
      title: _r("查看时不显示"),
      type: "boolean"
    },
    listFields: {
      title: _r("列表中显示"),
      type: "boolean"
    },
    editableFields: {
      title: _r("列表中可编辑"),
      type: "boolean"
    },
    ftp: {
      title: _r("FTP前缀"),
      type: "boolean"
    },
    textToAudio: {
      title: _r("文字转音频"),
      type: "boolean"
    },
    onlyCamera: {
      title: _r('仅能通过移动端拍摄上传'),
      type: 'boolean',
      description: _r('勾选后，上传图片时只支持移动端相机拍摄上传，不支持本地上传图片'),
      field: {
        effect: (f, form) => {
          setTimeout(() => {
            const path = f.name.split('folderType')?.[0] || ''
            form.setFieldData(`${path}accept`, { display: !f.value })
            form.setFieldData(`${path}uploadPosition`, { display: !f.value })
            form.setFieldData(`${path}folderType`, { display: !f.value })
          })
        },
        attrs: {
          groupSize: {
            labelCol: {
              sm: { span: 0 }
            },
            wrapperCol: {
              sm: { span: 19, offset: 5 }
            }
          }
        },
        component: OnlyCamera
      }
    },
    watermark: {
      title: _r("照片水印"),
      type: "object",
      properties: {},
      field: {
        attrs: {
          groupSize: {
            labelCol: {
              sm: { span: 0 }
            },
            wrapperCol: {
              sm: { span: 19, offset: 5 }
            }
          }
        },
        component: WatermarkOpt
      }
    },
    base64: {
      title: _r("base64编码格式"),
      type: "boolean"
    },
    autoName: {
      title: _r('生成随机文件名'),
      type: "boolean"
    },
    addToken: {
      title: _r('下载时增加认证信息'),
      type: "boolean"
    }
  },
  required: ["title", "key"],
  form: [keyForm, 'title', 'styleType', 'showType', 'accept', 'uploadPosition', 'width', 'height',
    'size', 'previewSize', 'folderType', 'folder', 'defaultVal', 'widthInForm', '*', 'need',
    'listFields', 'editableFields', 'onlyCamera', 'watermark', 'base64' ],
  formEffect: (form) => {
    form.useField('styleType', ({ value }) => {
      if (value === 'text' || value === 'audio') {
        form.setFieldData('width', { display: false })
        form.change('width', null)
        form.setFieldData('height', { display: false })
        form.change('height', null)
      } else {
        form.setFieldData('width', { display: true })
        form.setFieldData('height', { display: true })
      }
      if (value === 'audio') {
        if (app.get('components')?.['Dashboard.BoradcastButton']) {
          form.setFieldData('textToAudio', { display: true })
        }
      } else {
        form.setFieldData('textToAudio', { display: false })
        form.change('textToAudio', null)
      }
      const isImage = value === 'picture' || value === 'picture-card'
      form.setFieldData('onlyCamera', { display: isImage })
      form.setFieldData('watermark', { display: isImage })
      form.setFieldData('base64', { display: isImage })
      form.setFieldData('previewSize', { display: isImage })
      form.setFieldData('autoZip', { display: isImage })
      if (!isImage) {
        form.change('autoZip', false)
      }
    })

    commonFormEffect(form)
  }
}

const DefaultSingleUpload = (props) => {
  const { form } = use('form')
  const [sch, setSch] = React.useState({})

  React.useEffect(() => {
    form.useEffect(({ values }) => {
      setSch(values)
    })
  }, [])
  
  return <UploadAttachment {...props} field={{ ...props.field, schema: _.omit(sch, ['disabled', 'createDisabled', 'editDisabled']), type: 'upload_attachment' }} />
}

const DefaultMultipleUpload = (props) => {
  const { form } = use('form')
  const [sch, setSch] = React.useState({})

  React.useEffect(() => {
    form.useEffect(({ values }) => {
      setSch(values)
    })
  }, [])
  
  return <UploadAttachment {...props} field={{ ...props.field, schema: _.omit(sch, ['disabled', 'createDisabled', 'editDisabled']) }} />
}

const CanDownload = ({ input }) => {
  const val = input.value || { downloadOne: true, downloadAll: true }
  return <div>
    <Checkbox
      checked={val.downloadOne || val.downloadAll}
      onChange={() => {
        if (val.downloadOne || val.downloadAll) {
          input.onChange({ downloadOne: false, downloadAll: false })
        } else {
          input.onChange({ downloadOne: true, downloadAll: true })
        }
      }}
    >{_t1('允许下载')}</Checkbox>
    <Checkbox
      checked={val.downloadOne}
      className='upload-sub-checkbox'
      onChange={() => input.onChange({
        ...val,
        downloadOne: !val.downloadOne
      })}
    >{_t1('单个下载')}</Checkbox>
    <Checkbox
      checked={val.downloadAll}
      className='upload-sub-checkbox'
      onChange={() => input.onChange({
        ...val,
        downloadAll: !val.downloadAll
      })}
    >
      {_t1('全部下载')}
      <Tooltip placement="top" title={_t1('全部下载支持下载当前附件组上传的全部文件，下载格式为压缩包(.zip)。')} >
        <Icon type="question-circle" style={{ color: 'rgba(0, 0, 0, 0.45)', marginLeft: 5 }} />
      </Tooltip>
    </Checkbox>
  </div>
}

const SingleUpload = {
  type: "object",
  name: _r("附件"),
  title: _r("附件"),
  description:_r("用于上传单个文件、图片、卡片、视频和音频"),
  icon: "inbox",
  key: "single-upload",
  ...publicConfig,
  properties: {
    ...publicConfig.properties,
    defaultVal: {
      title: _r("默认值"),
      type: "string",
      field: {
        component: (props) => <DVContainer><DefaultSingleUpload {...props} /></DVContainer>,
        hideError: true
      }
    },
  }
}

const MultipleUpload = {
  type: "object",
  name: _r("附件组"),
  title: _r("附件组"),
  description:_r("用于上传多个文件、图片、卡片、视频和音频"),
  icon: "inbox",
  key: "multiple-upload",
  properties: {
    ...publicConfig.properties,
    sort: {
      title: _r("排序"),
      type: "string",
      enum1: ['asc', 'desc'],
      enum_title1: [_r('旧的在前'), _r('新的在前')],
      selectFace: "flatten",
      selectType: 'single'
    },
    listShow: {
      title: _r('展示形式'),
      type: 'string',
      enum1: ['flatten', 'num'],
      enum_title1: [_r('内容平铺'), _r('内容数量')],
      selectFace: "flatten",
      selectType: 'single',
      field: {
        effect: ({ value }, form) => {
          setTimeout(() => {
            form.setFieldData('showNum', { display: value !== 'num' })
          })
        }
      }
    },
    showNum: {
      title: _r("展示数量"),
      type: "number",
      fieldType: "inputNumber",
      min: 1,
      minimum: 1
    },
    maxUploadNum: {
      title: _r("最大上传数量"),
      type: "number",
      fieldType: "inputNumber",
      min: 1,
      minimum: 1
    },
    defaultVal: {
      title: _r("默认值"),
      type: "string",
      field: {
        component: (props) => <DVContainer><DefaultMultipleUpload {...props} /></DVContainer>,
        hideError: true
      }
    },
    canDownload: {
      title: _r("允许下载"),
      type: "object",
      properties: {},
      field: {
        component: CanDownload,
        attrs: {
          groupSize: {
            labelCol: {
              sm: { span: 0 }
            },
            wrapperCol: {
              sm: { span: 19, offset: 5 }
            }
          }
        },
      }
    }
  },
  required: publicConfig.required,
  form: [keyForm, 'title', 'styleType', 'showType', 'accept',
    'uploadPosition', 'sort', 'width', 'height', 'size', 'listShow', 'showNum', 'maxUploadNum', 'previewSize',
    'folderType', 'folder', 'defaultVal', 'widthInForm', '*'],
  formEffect: form => {
    commonFormEffect(form)
    publicConfig.formEffect(form)
  }
}

export { SingleUpload, MultipleUpload }