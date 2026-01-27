import React from 'react'
import { api, app, config, use } from 'xadmin'
import { Upload, Modal, Button, message, Progress, Tooltip, Form } from 'antd'
import { C } from 'xadmin-ui'
import Icon from '../component/Editor/component/Icon'
import { LineHeightOutlined, ExclamationCircleOutlined, DeleteOutlined, PaperClipOutlined,
  EyeOutlined, StopOutlined } from '@ant-design/icons'
import { PDFPreviewModal } from './ShowAttachment'
import { getFormValues } from '../component/Editor/utils'
import { uuid } from '../component/Editor/utils3'
import { dealSchema } from './tool'
import './UploadAttachment.css'

const { confirm } = Modal;

const restrictedFileExtensions = [
  'html',  // HTML files
  'htm',
  'js',    // JavaScript files
  'php',   // PHP files
  'php3',
  'php4',
  'php5',
  'phtml',
  'asp',   // ASP files
  'aspx',
  'jsp',   // JSP files
  'jspx',
  'sh',    // Shell script files
  'pl',    // Perl script files
  'py',    // Python script files
  'rb',    // Ruby script files
  'exe',   // Executable files
  'bat',   // Batch files
  'cmd',   // Command files
  'com',   // Command files
  'vbs',   // VBScript files
  'vb',    // VBScript files
  'vbe',   // VBScript Encoded script files
  'wsf',   // Windows Script File
  'wsh',   // Windows Script Host file
  'xml',   // XML files (can contain embedded JavaScript)
  'swf',   // Flash files
  'jar',   // Java files
  'class'  // Java class files
];

// const imageType = ["xbm", "tif", "pjp", "apng", "svgz", "jpg", "jpeg", "ico", "tiff",
//   "gif", "svg", "jfif", "webp", "png", "bmp", "pjpeg", "avif"]
// const videoType = ["ogm", "wmv", "mpg", "asf", "webm", "ogv", "mov", "mpeg", "mp4",
//   "m4v", "avi"]
// const audioType = ["webm", "opus", "oga", "wma", "flac", "weba", "m4a", "wav", "ogg",
//   "mp3"]

const fileType = [
  "doc", "docx", "pdf", "xls", "xlsx", "ppt", "pptx", "txt", "csv", "dwg", 
  "bin", "css", "json", "map", "wasm", "obj", "fbx", "glb", "gltf", "ply", 
  "pcd", "3mf", "mtl"
];
const imageType = [
  "jpg", "jpeg", "png", "webp", "bmp", "gif", "exif", "svg", "ico", "tif"
];
const videoType = [
  "mp4", "wmv", "3gp", "avi", "flv", "vob", "m4v", "mov", "rmvb", "webm"
];
const audioType = [
  "mp3", "wav", "flac", "ape", "aac", "opus", "pcm"
];

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const UploadButton = ({ styleType }) => {
  
  if (!styleType || styleType == 'picture-card') {
    return (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">{_t1('上传')}</div>
      </div>
    )
  } else {
    return <Button><Icon type="plus" />{_t1('上传')}</Button>
  }
}

const TextToAudio = ({ mediaChange }) => {
  const [visible, setVisiable] = React.useState(false)
  const [url, setUrl] = React.useState()
  

  return <>
    <Button style={{ marginLeft: 8 }} onClick={() => setVisiable(true)}>
      <LineHeightOutlined />{_t1('文字转音频')}
    </Button>
    <Modal
      visible={visible}
      title={_t1("文字转音频")}
      onOk={() => {
        url && mediaChange(url)
        setVisiable(false)
      }}
      onCancel={() => setVisiable(false)}
    >
      <C is="Dashboard.BoradcastButton" onChange={url => setUrl(url)} />
    </Modal>
  </>
}

const ItemRender = ({ file, onRemove }) => {
  let url = file.url || (file.response?.url ? (getMediaUrl(file.response?.url)) : '')

  // 上传中状态，显示进度条
  if (file.status === 'uploading') {
    return <div style={{ width: 400 }}>
      <Progress percent={file.percent} size="small" showInfo={false} />
    </div>
  }

  return <div class="ant-upload-list-item ant-upload-list-item-done ant-upload-list-item-list-type-text">
    <div class="ant-upload-list-item-info">
      <span class="ant-upload-span">
        <div class="ant-upload-text-icon">
          <span role="img" aria-label="paper-clip" class="anticon anticon-paper-clip">
            <PaperClipOutlined />
          </span>
        </div>
        <a target="_blank" rel="noopener noreferrer" class="ant-upload-list-item-name"
          title={file.name || ''} href={url} >{file.name || ''}</a>
        <span class="ant-upload-list-item-card-actions">
          {
            file?.name?.endsWith('.pdf') && <PDFPreviewModal file={location.origin + url} modalProps={{ width: '50%' }} title={ file?.name?? '' } >
              <button title={_t1("预览")} type="button" class="ant-btn ant-btn-text ant-btn-sm ant-btn-icon-only ant-upload-list-item-card-actions-btn">
                <EyeOutlined />
              </button>
            </PDFPreviewModal>
          }
          <button onClick={() => onRemove(file)} title={_t1("删除文件")} type="button" class="ant-btn ant-btn-text ant-btn-sm ant-btn-icon-only ant-upload-list-item-card-actions-btn">
            <DeleteOutlined />
          </button>
        </span>
      </span>
    </div>
  </div>
}

// 自定义文件项渲染函数
const itemRender = (originNode, file, currFileList, actions) => {
  const { preview, remove } = actions

  const bigFile = file.size / 1024 / 1024 > 20

  if (file.status === 'uploading') {
    return <div className='upload-loading-container'>
      <div className='upload-loading-inner'>
        <span>{_t1('文件上传中')}</span>
        {
          !bigFile && <Tooltip title={_t1("终止上传")}>
            <StopOutlined onClick={() => remove(file)} />
          </Tooltip>
        }
        <Progress percent={file.percent} size="small" showInfo={false} />
      </div>
    </div>
  }

  return (
    <div className="upload-item-container" key={file.uid}>
      {/* 核心：图片容器（仅显示图片） */}
      <div className="upload-item-img-wrapper">
        <img
          src={getMediaUrl(file.url || file.response?.url)}
          className="upload-item-img"
          alt={file.name}
        />
      </div>

      {/* 全屏蒙版容器（标题、大小、按钮都在蒙版内） */}
      <div className="upload-item-mask">
        {/* 文本容器：名称 + 大小 */}
        <div className="upload-item-text-wrap">
          <div className="upload-item-name">{file.name}</div>
        </div>
        
        {/* 操作按钮 */}
        <div className="upload-item-actions">
          <button 
            className="upload-item-btn"
            onClick={(e) => {
              e.stopPropagation();
              preview && preview()
            }}
          >
            <EyeOutlined className="upload-item-icon" />
          </button>
          
          <button 
            className="upload-item-btn"
            onClick={(e) => {
              e.stopPropagation();
              remove && remove()
            }}
          >
            <DeleteOutlined className="upload-item-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

// 加水印
const addWatermark = (file, opt, user) => {
  return new Promise((resolve, reject) => {
    if (!opt?.use) { // 未配置水印
      resolve(file)
      return
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = document.createElement('img');
      img.src = reader.result;
      img.onload = () => {
        // 第一步：初始化画布，画图片
        const canvas = document.createElement('canvas');
        const imgW = img.naturalWidth
        const imgH = img.naturalHeight
        canvas.width = imgW;
        canvas.height = imgH;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
  
        // 第二步：设置画布参数，颜色，透明度等
        ctx.fillStyle = opt.color || 'gray';
        ctx.globalAlpha = 0.5;
        ctx.font = `${opt.fontSize || 100}px Arial`
  
        // 第三步：解析文字
        const text = opt.contentType === 'time' ? moment().format('YYYY-MM-DD HH:mm:ss') :
          opt.contentType === 'user' ? user?.username :
          opt.contentType === 'text' ? (opt.content || 'Airiot') :
          'Airiot'
  
        // 第四步：计算文字位置并绘制
        const textWidth = ctx.measureText(text)?.width || 0
        const textHeight = opt.fontSize || 100
        if (opt.position === 'repeat') { // 重复
          if (opt.rotate) ctx.rotate(Math.PI / 180 * opt.rotate); // 旋转
          const space = ctx.space || 50
          for (let x = -imgW; x < imgW*1.4; x += (space+textWidth)) {
            for (let y = -imgH; y < imgH*1.4; y += (space+textHeight)) {
              ctx.fillText(text, x, y);
            }
          }
        } else { // 单个
          const pst = opt.position?.split('-') || ['left', 'top']
          const x = pst[0] === 'left' ? 20 :
            pst[0] === 'center' ? imgW/2 - textWidth/2
            : imgW - textWidth - 20
          const y = pst[1] === 'top' ? textHeight + 20 :
            pst[1] === 'center' ? imgH/2 + textHeight/2
            : imgH - 20
          ctx.fillText(text, x, y);
        }
  
        canvas.toBlob((result) => resolve(result));
      };
    };
  })
}

// 自动压缩
// base64转码（压缩完成后的图片为base64编码，这个方法可以将base64编码转回file文件）
const dataURLtoFile = (dataurl, filename) => {
  var arr = dataurl.split(',')
  var mime = arr[0].match(/:(.*?);/)[1]
  var bstr = atob(arr[1])
  var n = bstr.length
  var u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}
const autoZip = (file, zip) => {
  var fileSize = parseFloat(parseInt(file['size']) / 1024).toFixed(2)
  var read = new FileReader()
  read.readAsDataURL(file)
  return new Promise(function (resolve, reject) {
    if (!zip) { // 未配置自动压缩
      resolve(file)
      return
    }
    read.onload = function (e) {
      var img = new Image()
      img.src = e.target.result
      img.onload = function () {
        // 默认按比例压缩
        var w = this.width
        var h = this.height
        // 生成canvas
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        var base64
        // 创建属性节点
        canvas.setAttribute('width', w)
        canvas.setAttribute('height', h)
        ctx.drawImage(this, 0, 0, w, h)
        if (fileSize < 100) {
          // 如果图片小于100k 那么压缩0.5
          base64 = canvas.toDataURL(file['type'], 0.5)
        } else if (fileSize > 100 && fileSize < 500) {
          // 如果图片大于100k并且小于500k 那么压缩0.2
          base64 = canvas.toDataURL(file['type'], 0.2)
        } else {
          // 如果图片超过500k 那么压缩0.1
          base64 = canvas.toDataURL(file['type'], 0.1)
        }
        // 回调函数返回file的值（将base64编码转成file）
        const files = dataURLtoFile(base64, file.name) // 如果后台接收类型为base64的话这一步可以省略
        resolve(files)
      }
    }
  })
}

const getAccept = (ac, styleType) => {
  const res = ac ?? (styleType === 'text' ? '*'
    : styleType === 'video' ? 'video/*'
    : styleType === 'audio' ? 'audio/*' : 'image/*')
  
  if (res === 'video/*') {
    return videoType.map(v => '.' + v).join(',')
  } else if (res == 'audio/*') {
    return audioType.map(v => '.' + v).join(',')
  } else if (res == 'image/*') {
    return imageType.map(v => '.' + v).join(',')
  } else if (res == '*') {
    return fileType.map(v => '.' + v).join(',')
  } else {
    return res
  }
}

const LocalUpload = (props) => {
  const { field = {}, fileList, setFileList, showPreview, handleChange, onRemove, isSingleUpload, media, input,
    cellKey, mediaChange, maxUploadNum } = props
  const { schema } = field
  const { user } = use('redux', state => ({ user: state.user }))
  
  const styleType = schema.styleType || 'picture-card'
  const ifMedia = schema.uploadPosition === 'media'
  const accept = getAccept(schema.accept, styleType)

  // 同步到媒体库的话，统一使用媒体库上传地址 mediaLibrary/upload
  const url = api({ name: 'media' }).getHost() + 'core/mediaLibrary/upload?action='
    + (schema.onlyCamera ? 'rename' : 'cover')
  // 表定义中设置了上传文件夹
  const catalog = field.schema?.folderType === 'folder' ? ('&catalog=' + field.schema.folder) : ''

  const [uploadUrl, setUploadUrl] = React.useState(url + catalog)

  const changePath = (path) => {
    //  allown 我的文件夹
    if (path && path != 'allown') {
      setUploadUrl(url + '&catalog=' + encodeURIComponent(path))
    }
  }

  const beforeUpload = (oldFile, newfileList) => {
    if (_.isNumber(maxUploadNum) && newfileList?.length + fileList?.length > maxUploadNum) {
      message.warning({ content: _t1("最多上传{{num}}个", { num: maxUploadNum }), key: 'maxNum' })
      return false
    }
    return new Promise((resolve, reject) => {
      if (schema.size && oldFile.size / 1024 / 1024 > schema.size) {
        message.error(`${_t1('文件大小不可超过')}${schema.size}MB`)
        return
      }

      if (oldFile.size / 1024 / 1024 > 20) { //大文件切片上传
        const Uploader = C('Media.Uploader')
        if (!Uploader) {
          message.error(_t1('文件大于400M，请用媒体库上传'))
          reject(new Error('缺少媒体库上传组件'))
          return
        }
        
        const sliceUrl = window.origin + '/rest/core/mediaLibrary/uploadChunk'
        const sliceUploader = new Uploader(sliceUrl, {
          showProgress: true,
          enableSlice: true,
        }, "");
        
        // 1. 创建符合antd Upload规范的文件对象（核心：带uid、percent等属性）
        const antdFile = {
          ...oldFile,
          uid: oldFile.uid || Date.now() + Math.random().toString(36).substr(2, 9), // 保证唯一标识
          name: oldFile.name,
          size: oldFile.size,
          percent: 0, // 初始进度
          status: 'uploading', // 上传状态
          // 挂载暂停/继续方法到文件对象，方便组件调用
          pause: () => sliceUploader?.pause(),
          proceed: () => sliceUploader?.proceed()
        }

        input.onChange('loading')
        sliceUploader
          .upload(oldFile)
          .onProgress(({ percentage }) => {
            antdFile.percent = percentage - 5
            setFileList(prev => {
              // 替换/追加当前上传的文件
              const existIndex = prev.findIndex(item => item.uid === antdFile.uid)
              if (existIndex > -1) {
                const newList = [...prev]
                newList[existIndex] = antdFile
                return newList
              } else {
                return [...prev, antdFile]
              }
            })
          })
          .onComplete(() => {
            message.success({ content: `${oldFile.name}上传成功`, key: oldFile.name })
            message.destroy(oldFile.name) // 关闭loading提示
            antdFile.status = 'done'
            const projectId = _.get(api({ name: 'media' }).getHeaders(), 'x-request-project')
            antdFile.url = '/rest/core/fileServer/mediaLibrary/' + projectId + '/' + oldFile.name

            // 更新fileList
            setFileList(prev => {
              const existIndex = prev.findIndex(item => item.uid === antdFile.uid)
              const newList = [...prev]
              if (existIndex > -1) {
                newList[existIndex] = antdFile
              } else {
                newList.push(antdFile)
              }

              // 同步更新表单值，切片上传没走antd默认的逻辑，所以不会出发onChange，需要手动更新
              if (isSingleUpload) {
                input.onChange(antdFile)
              } else {
                input.onChange(newList)
              }

              return newList
            })

            resolve(antdFile) // 告诉Upload组件上传完成
          })
          .onError((err) => {
            message.error({ content: `${oldFile.name}上传失败`, key: oldFile.name })
            message.destroy(oldFile.name)
            antdFile.status = 'error'
            setFileList(prev => {
              const existIndex = prev.findIndex(item => item.uid === antdFile.uid)
              if (existIndex > -1) {
                const newList = [...prev]
                newList[existIndex] = antdFile
                return newList
              }
              return prev
            })
            reject(err) // 上传失败reject
          })
        return
      }
      
      if (schema.base64) { // 不上传媒体库，直接存base数据
        const reader = new FileReader()
        reader.readAsDataURL(oldFile)
        reader.onload = () => {
          setFileList(prevFileList => {
            // prevFileList 是最新的状态
            if (isSingleUpload) {
              // 单文件上传：直接替换
              const newFileList = [{ url: reader.result, name: oldFile?.name }];
              mediaChange(reader.result, oldFile?.name);
              return newFileList;
            } else {
              // 多文件上传：基于最新列表追加
              const urls = prevFileList.map(item => item.url ?? item.response?.url ?? '').filter(Boolean);
              const names = prevFileList.map(item => item.name ?? '').filter(Boolean);
              // 追加新文件
              const newUrls = [...urls, reader.result];
              const newNames = [...names, oldFile?.name];
              // 更新媒体数据
              mediaChange(newUrls, newNames);
              // 返回更新后的文件列表（用于状态更新）
              return [...prevFileList, { url: reader.result, name: oldFile?.name }];
            }
          });
        }
        reader.onerror = (error) => console.error(error)
        return
      }
      
      const fileType = oldFile?.name?.substring(oldFile?.name?.lastIndexOf('.') + 1)
      if (restrictedFileExtensions.indexOf(fileType) > -1) {
        message.error(`不可上传${fileType}文件`)
        return
      }
      if (accept?.indexOf(fileType) === -1) {
        message.error(_t1("请上传正确类型文件"))
        return
      }
      (async () => {
        try {
          let file = await autoZip(oldFile, schema.autoZip)
          if (schema.autoName) {
            let name = uuid(16, 16) + '.' + file?.name?.split('.')?.[1]
            file = new File([file], name)
          }
          // 是否可以选择上传位置
          if (schema?.uploadFolder || schema?.folderType === 'upload') {
            confirm({
              title: _t1('请选择上传目录!'),
              icon: <ExclamationCircleOutlined />,
              content: <C is="Media.FolderSelectTree" input={{ onChange: changePath }} />,
              onOk() {
                input.onChange('loading')
                addWatermark(file, schema.watermark, user).then(f => {
                  resolve(f)
                })
              },
              onCancel() {},
            })
          } else {
            input.onChange('loading')
            addWatermark(file, schema.watermark, user).then(f => {
              resolve(f)
            })
          }
        } catch (err) {
          reject(err);  // 捕获 await 抛出的错误，手动 reject
        }
      })();
    })
  }

  // 只移动端上传时，电脑端不能上传，弹出提示
  const handleClick = (e) => {
    if (!config('isMobile') && schema.onlyCamera) {
      message.warning(_t1('不支持当前客户端操作'))
      e.stopPropagation()
      e.preventDefault()
    }
  }
  // 专门用来获取input的dom，因为表定义页面，预览时有两个dom
  const cls = 'this-' + Math.round(Math.random()*1000000) 
  React.useEffect(() => {
    if (!config('isMobile') && schema.onlyCamera) {
      setTimeout(() => {
        const a = document.querySelector(`.${cls}`)?.getElementsByTagName('input')?.[0]
        if (a)a.disabled = true
      })
    }
  }, [])

  const hideAddBtn = (isSingleUpload && fileList.length >= 1)

  // 图片卡片时，media要在upload外面，文件时，media在upload里面，为解决样式恶心问题
  return styleType === 'picture-card' ?
    <>
      <div className='table-upload-attach'>
        <Upload
          accept={accept}
          action={uploadUrl}
          listType={styleType}
          fileList={fileList}
          multiple={!isSingleUpload}
          headers={_.omit(api({ name: 'media' }).getHeaders(), 'Content-Type')}
          capture={schema.onlyCamera ? 'camera' : null}
          onPreview={showPreview}
          onChange={handleChange}
          onRemove={onRemove}
          beforeUpload={beforeUpload}
          itemRender={itemRender}
          className={`upload-list-custom-${cellKey} ${cls}`}
          disabled={schema.disabled}
          onClick={handleClick}
        >
          {hideAddBtn || ifMedia ? null : <UploadButton styleType={styleType} />}
        </Upload>
      </div>
      {media}
    </>
    :
    <Upload
      accept={accept}
      action={uploadUrl}
      listType={styleType}
      fileList={fileList}
      multiple={!isSingleUpload}
      headers={_.omit(api({ name: 'media' }).getHeaders(), 'Content-Type')}
      capture={schema.onlyCamera ? 'camera' : null}
      onPreview={showPreview}
      onChange={handleChange}
      itemRender={(children, file) => <ItemRender file={file} onRemove={onRemove} />}
      beforeUpload={beforeUpload}
      className={`upload-list-custom-${cellKey} ${cls}`}
      disabled={schema.disabled}
      onClick={handleClick}
    >
      {hideAddBtn || ifMedia ? null : <UploadButton styleType={styleType} />}
      <div onClick={e => e.stopPropagation()} style={{ display: 'inline-flex' }} >
        {
          schema.styleType === 'audio' && schema.textToAudio && !(isSingleUpload && fileList.length >= 1)
          && app.get('components')?.['Dashboard.BoradcastButton'] &&
          <TextToAudio mediaChange={mediaChange} />
        }
      </div>
      <div onClick={e => e.stopPropagation()} style={{ display: 'inline-flex' }} >
        {media}
      </div>
    </Upload>
}

const MediaUpload = ({ schema, isSingleUpload, input, style }) => {
  const ifMedia = app.apps.find(item => item.name === 'airiot.media' || item.name === 'iot.media') // 判断是否加载媒体库模块
  const needMedia = !(schema.uploadPosition === 'local') // 判断是否需要媒体库，仅本地上传时不需要，只调相机时不需要
  if (!ifMedia || !needMedia || schema.onlyCamera) return null
  const styleType = schema.styleType || 'picture-card'

  
  if (schema.disabled) return null
  return <C
    is='MediaModal'
    uploadHidden
    multiple={!isSingleUpload}
    fileSize={schema.size}
    uploadType={
      styleType === 'text' ? 'all' :
        styleType === 'video' ? 'video' :
          styleType === 'audio' ? 'audio' :
            'img'
    }
    input={input}
    customSchema={schema}
  >
    {
      styleType === 'picture-card' ?
        <div className='custom-media' style={style}>
          <div>
            <Icon style={{ color: 'red' }} svg={require('./媒体库.svg')} />
            <div>{_t1('媒体库')}</div>
          </div>
        </div> : null
    }
  </C>
}

// const restUrl = (fs) => {
//   if (_.isArray(fs)) {
//     return fs.map(f => ({
//       ...f,
//       url: f?.url?.startsWith(config('mediaUrl')) ? f?.url : config('mediaUrl') + f?.url
//     }))
//   }
//   return []
// }

const fileFormat = (file) => {
  if (!_.isObject(file)) return file
  const res = _.cloneDeep(file)
  res.thumbUrl = getMediaUrl(file.response?.url || file.url)
  return res
}

function getMediaUrl(url) {
  return url?.startsWith('/rest') ? url : config('mediaUrl') + '/' + url
}

const UploadAttachment = props => {

  const { input, input: { value, onChange }, field, field: { schema: fieldSchema, type }, antdForm, cellKey, meta } = props

  const f = Form.useForm()
  let values = getFormValues(fieldSchema, antdForm || f)
  const schema = dealSchema(fieldSchema, values, meta)

  const isSingleUpload = type === 'upload_attachment'
  const maxUploadNum = fieldSchema?.maxUploadNum
  const [fileList, setFileList] = React.useState(() => {
    if (isSingleUpload) {
      return value && value != '' ? [value] : []
    } else {
      return _.isArray(value) ? value : []
    }
  })

  // 默认值生效
  React.useEffect(() => {
    setTimeout(() => { // 必须用setTimeout，否则会被拦截
      if (!value && schema?.defaultVal && onChange && schema?.defaultValType !== 'logic') {
        onChange(schema.defaultVal)
        // setFileList()
      }
    })
  }, [])

  React.useEffect(() => {
    if (value === 'loading') return
    setFileList(() => {
      if (isSingleUpload) {
        return value && value != '' ? [value] : []
      } else {
        return _.isArray(value) ? value : []
      }
    })
  }, [isSingleUpload, value])

  const cKey = schema.key || cellKey
  const styleType = schema.styleType || 'picture-card'
  const width = schema.width
  const height = schema.height
  const mediaDelete = schema?.mediaDelete

  const [preview, setPreview] = React.useState({
    visible: false,
    image: null,
    title: null
  })

  const cancelPreview = () => setPreview({ visible: false, image: null, title: null })

  const showPreview = async file => {
    let fileType = file.name.substring(file.name.lastIndexOf(".") + 1) // 截取文件后缀名
    if (['png', 'jpg', 'jpeg', 'gif'].indexOf(fileType) === -1) return // 只有图片支持预览
    if (file.response?.url) {
      file.preview = getMediaUrl(file.response.url)
    } else if (!file.url && !file.preview) {
      file.preview = file.originFileObj instanceof Blob ? await getBase64(file.originFileObj) : file.thumbUrl;
    }
    setPreview({ visible: true, image: file.url || file.preview, title: file.name || file.url.substring(file.url.lastIndexOf('/') + 1) })
  }

  const handleChange = ({ file, fileList }) => {
    const fList = fileList.filter(f => f.status)
    let result = fList.map(fileFormat)
    let ifAdd = fList.some(item => item.uid === file.uid) // 新增还是删除
    if (ifAdd && schema.sort === 'desc') { // 如果是新增，并且排序在前
      result = [file, ...fList.filter(item => item.uid !== file.uid)]
    }
    setFileList(result)

    if (file) {
      if (file.status === 'error') {
        message.error(`上传失败: ${file.response?.message}`);
      }
      if (file.status === 'done') {
        if (isSingleUpload) {
          const _file = { ...fileFormat(file), response: { ...file.response, url: getMediaUrl(file?.response?.url) } }
          onChange(_file)
          setFileList([_file])
        } else {
          const list = result.map(f => ({ ...f, response: { ...f.response, url: getMediaUrl(f?.response?.url) } }))
          onChange(list)
          setFileList(list)
        }
      }
    }
  }

  const onRemoveChange = (file) => {
    if (isSingleUpload) {
      onChange(null)
      setFileList([])
    } else {
      if (fileList.filter(f => f.uid !== file.uid)?.length === 0) {
        setFileList(null)
        onChange(null)
      } else {
        onChange(fileList.filter(f => f.uid !== file.uid))
        setFileList(fileList.filter(f => f.uid !== file.uid))

      }
    }
  }

  const deleteMediaFile = (file) => {
    const projectId = _.get(api({ name: 'media' }).getHeaders(), 'x-request-project')
    const url = file?.url || file?.response?.url
    const uri = url.split(projectId + '/')[1]
    const path = encodeURIComponent(uri) + '&completeDelete=true'
    if (path) {
      api({ name: 'core/mediaLibrary' })
        .fetch('?path=' + path, { method: 'DELETE' })
        .then(({ status }) => {
          if (status == 200) {
            message.success(_t1('删除成功'))
            onRemoveChange(file)
          }
        })
    }
  }

  const onRemove = file => {
    return new Promise((resolve, reject) => {
      if (mediaDelete) {
        confirm({
          title: _t1('是否同步删除媒体库源文件？'),
          icon: <ExclamationCircleOutlined />,
          okText: _t1('确定删除'),
          cancelText: _t1('只删除附件'),
          onOk() {
            deleteMediaFile(file)
            resolve(false)
          },
          onCancel() {
            onRemoveChange(file)
            resolve(false)
          },
        })
      } else {
        onRemoveChange(file)
        resolve(false)
      }
    })
  }

  const getFtpUrl = (url) => { // ftp前缀
    let result = url
    const ftpSet = app.context.settings?.ftpSettings
    let u = url.split('/ftpServer/')?.[1]
    if (u && ftpSet) {
      result = `ftp://${ftpSet.username}:${ftpSet.password}@${ftpSet.host}:${ftpSet.port}`
        + u.substring(u.indexOf('/'))
    }
    return result
  }

  const mediaChange = (url, name) => {
    if (!url || url === '/rest') return

    if (isSingleUpload) { // 附件
      let file = {
        uid: Math.random(),
        name: name || url.split('/')[url.split('/').length - 1],
        status: 'done',
        url: url,
        ftpUrl: schema.ftp ? getFtpUrl(url) : undefined
      }
      // setFileList([file])
      onChange(file)
    } else { // 附件组
      if (_.isNumber(maxUploadNum) && url?.length + input.value?.length > maxUploadNum) {
        message.warning({ content: _t1("最多上传{{num}}个", { num: maxUploadNum }), key: 'maxNum' })
        return
      }
      let newList = url.map((item, index) => ({
        uid: Math.random(),
        name: name?.[index] || item.split('/')[item.split('/').length - 1],
        status: 'done',
        url: item,
        ftpUrl: schema.ftp ? getFtpUrl(item) : undefined
      }))

      let result = schema.sort === 'desc' ? [...newList, ...fileList] : [...fileList, ...newList]
      let getUrl = (f) => (f.url ?? f.response?.url ?? '').replace(/\/rest/g, '')
      // 去重
      let r = result.reduce((prev, cur) => {
        if (prev.some(o => getUrl(o) === getUrl(cur))) {
          return prev
        } else {
          return [...prev, cur]
        }
      }, [])
      onChange(r)
    }
  }

  let defaultWidth = width ? width : 104, defaultHeight = height ? height : 104

  let css = (<style>{`
  .upload-list-custom-${cKey} .ant-upload-list-item {float: left; width: ${defaultWidth}px; height: ${defaultHeight}px;margin-right: 8px;}
  .upload-list-custom-${cKey} .ant-upload-list-picture-card-container {width: ${defaultWidth}px;height: ${defaultHeight}px; }
  .upload-list-custom-${cKey} .ant-upload-select-picture-card {width:${defaultWidth}px;height: ${defaultHeight}px;}
  `}</style>)

  let divHeight = height || (styleType === 'picture-card' ? 104 : undefined) // 防抖动

  let mediaValue
  if (isSingleUpload) {
    mediaValue = fileList?.[0]?.url || fileList?.[0]?.response?.url || ''
  } else {
    mediaValue = fileList?.map(item => item.url ?? item.response?.url ?? '').filter(item => item !== '')
  }

  return (
    <div style={{ height: divHeight, overflow: 'auto', display: 'flex' }} className="clearfix custom-upload">
      {(width || height) && css}
      <LocalUpload
        cellKey={cKey}
        field={field}
        fileList={fileList}
        setFileList={setFileList}
        isSingleUpload={isSingleUpload}
        maxUploadNum={maxUploadNum}
        showPreview={showPreview}
        handleChange={handleChange}
        mediaChange={mediaChange}
        onRemove={onRemove}
        input={input}
        media={<MediaUpload
          schema={schema}
          isSingleUpload={isSingleUpload}
          input={{ value: mediaValue, onChange: mediaChange }}
          style={{ width: defaultWidth, height: defaultHeight }}
        />}
      />

      <Modal
        visible={preview.visible}
        title={preview.title}
        footer={null}
        onCancel={cancelPreview}
      >
        <img alt="example" style={{ width: '100%' }} src={preview.image} />
      </Modal>
    </div>
  )
}

export { fileType, imageType, videoType, audioType }
export default UploadAttachment
