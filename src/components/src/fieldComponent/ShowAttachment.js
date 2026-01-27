import React from 'react'
import { api, config as _c, use } from 'xadmin'
import { C } from 'xadmin-ui'
import Icon from '../component/Editor/component/Icon'
import { Upload, Modal, Tooltip, Popover, Badge, Button, Typography } from 'antd'
import { VideoCameraOutlined, EyeOutlined, DownloadOutlined, AudioOutlined, LoadingOutlined, DownSquareFilled } from '@ant-design/icons'
import './ShowAttachment.css'
import _ from 'lodash'
import JSZip from 'jszip';
import { saveAs } from 'file-saver'

const { Text } = Typography;

function getMediaUrl(url) {
  if (url?.length > 200) return url // base64编码
  return url?.startsWith('/rest') ? url : _c('mediaUrl') + '/' + url
}

const VideoShow = ({ file, downloadFile, type, schema }) => {
  const [vis, setVis] = React.useState(false)

  const modalProps = _c('isMobile') ?
    { width: '80%', style: { maxWidth: 800 }, bodyStyle: { padding: 10 } } :
    {
      width: '60%',
      style: { maxWidth: 800 },
      title: file.name || file.url?.substring(file.url?.lastIndexOf('/') + 1)
    }

  return (
    <div className="show-video" style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
      {
        type === 'video' ?
          <VideoCameraOutlined className='video-icon' /> :
          <AudioOutlined className='video-icon' />
      }
      {
        file?.name?.length > 15 ?
          <Tooltip title={file.name}><span>{file.name.substring(0, 15) + '...'}</span></Tooltip>
          : <span>{file?.name}</span>
      }
      <div className='video-mask'>
        <EyeOutlined title={_t1('预览文件')} className='o-icon' onClick={() => setVis(true)} />
        <DownloadOutlined title={_t1('下载文件')} className='o-icon' onClick={() => downloadFile(file)} />
      </div>
      <Modal
        visible={vis}
        {...modalProps}
        footer={null}
        zIndex={1040}
        wrapClassName={schema?.key + '-preview'}
        onCancel={() => setVis(false)}
      >
        {
          type === 'video' ?
            <video
              alt={_t1("视频")}
              style={{ maxHeight: '70vh', width: '100%' }}
              src={file.url || (file.response?.url ? getMediaUrl(file.response.url) : file.preview)}
              controls
            /> :
            <audio
              alt={_t1("音频")}
              style={{ maxHeight: '70vh', width: '100%' }}
              src={file.url || (file.response?.url ? getMediaUrl(file.response.url) : file.preview)}
              controls
            />
        }

      </Modal>
    </div>
  )
}

const PDFPreviewModal = ({ file, title, modalProps = {}, children }) => {
  const [vis, setVis] = React.useState(false)
  const onPdf = () => setVis(true)

  return <>
    <span onClick={onPdf}>{children}</span>
    <Modal
      {...modalProps}
      title={title}

      width={'90%'}
      visible={vis}
      destroyOnClose={true}
      // wrapClassName={schema?.key + '-preview'}
      footer={null}
      zIndex={1040}
      onCancel={() => setVis(false)}
    >
      <div>
        <C is="Media.PdfPerview" url={file} />
      </div>
    </Modal>
  </>
}

const PDFPreview = ({ downloadFile, value, modalProps }) => {

  const fileUrl = getMediaUrl(value.url || (value.response?.url ? value.response.url : value.preview))
  return <span className='table-pdf-preview'>
    <span className='pdf-name'>{value?.name ?? ''}</span>
    <PDFPreviewModal file={location.origin + fileUrl} modalProps={modalProps} title={value?.name ?? ''} >
      <EyeOutlined className='pdf-preview-icon' />
    </PDFPreviewModal>
    <DownloadOutlined className='pdf-preview-icon' onClick={() => downloadFile(value)} />
  </span>
}

const FileDownload = ({ downloadFile, value, modalProps }) => {

  return _.isArray(value) ? (<>
    {value.map(item => (
      item?.name?.endsWith('.pdf') ? <PDFPreview downloadFile={downloadFile} value={item} modalProps={modalProps} /> :
        <a style={{ display: 'block' }} onClick={() => downloadFile(item)}>
          {item?.name ?? ''}
        </a>
    ))}
  </>) : (
    value?.name?.endsWith('.pdf') ? <PDFPreview downloadFile={downloadFile} value={value} modalProps={modalProps} /> :
      <a onClick={() => downloadFile(value)}>{value?.name ?? ''}</a>
  )
}

const PhotoCard = ({ file, actions, previewSize, src, canDownload }) => {
  const { download } = actions
  const fileName = file.name
  return (
    <div className="photo-card-container" style={previewSize}>
      <div className="photo-card-image-wrapper">
        <img src={src} alt={fileName} loading="lazy" />
      </div>
      <div className="photo-card-info-wrapper">
        <div title={fileName} className="photo-card-file-info">
          {/* 文件名 - 黑色文字 */}
          <Text strong ellipsis className="photo-card-file-name">
            {fileName}
          </Text>
        </div>
        {
          canDownload?.downloadOne !== false && <Button
            icon={<DownloadOutlined />}
            onClick={download}
            size="middle"
            className="photo-card-download-btn"
          />
        }
      </div>
    </div>
  );
};

// 照片条组件
const PhotoBar = ({ file, actions, src, canDownload }) => {
  const { download } = actions
  const fileName = file.name
  return (
    <div className="photo-bar-container">
      {/* 左侧图片区域（20%） */}
      <div className="photo-bar-image-wrapper">
        <img src={src} alt={fileName} loading="lazy" />
      </div>
      {/* 中间文件名区域 */}
      <div title={fileName} className="photo-bar-name-wrapper">
        <span className="photo-bar-file-name">{fileName}</span>
      </div>
      {/* 右侧下载按钮区域 */}
      {
        canDownload?.downloadOne !== false && <div className="photo-bar-download-wrapper">
          <Button
            icon={<DownloadOutlined />}
            onClick={download}
            size="middle"
            className="photo-bar-download-btn"
          />
        </div>
      }
    </div>
  );
};

const ItemRender = ({ file, actions, inList, schema, canDownload }) => {
  const { previewSize } = schema
  const src = getMediaUrl(file.previewURL || file.url || (file.response?.url ? file.response.url : file.preview))

  console.log(999999, schema)
  if (inList) {
    return <Popover
      content={() => <PhotoCard file={file} actions={actions} previewSize={previewSize} src={src} canDownload={canDownload} />}
    >
      <div className="upload-item-img-wrapper">
        <img src={src} style={{ width: 36, height: 36 }} className="upload-item-img" />
      </div>
    </Popover>
  } else if (schema?.showType === 'smallImage') {
    return <PhotoBar file={file} actions={actions} src={src} canDownload={canDownload} />
  } else {
    return <PhotoCard file={file} actions={actions} previewSize={previewSize || { height: 200, width: 160 }} src={src} canDownload={canDownload} />
  }
}

const ShowAttach = props => {
  const { schema, value, listType = 'picture-card', inList } = props
  const { styleType: type, showNum, previewSize, addToken, canDownload } = (schema || {})

  const [fileList, setfFileList] = React.useState()
  const user = use('auth.user')?.user

  React.useEffect(() => {
    let temp = _.isArray(value) ? value : value && value != '' ? [value] : []
    temp = temp.map(t => {
      let res = t
      if (_.isString(t)) {
        try {
          res = JSON.parse(t)
        } catch (e) { }
      }
      return res
    })
    let f = showNum ? temp.slice(0, showNum) : temp
    setfFileList(f?.map(file => {
      if (file.thumbUrl) return {
        ...file,
        previewURL: file.thumbUrl,
        thumbUrl: file.thumbUrl + '?thumbnail=true&width=70&height=70'
      }
      if (file.url?.indexOf('/rest') > -1) return {
        ...file,
        previewURL: file.url,
        url: file.url + '?thumbnail=true&width=70&height=70'
      }
      return file
    }))
  }, [value, showNum])

  const [previewVisible, setPreviewVisible] = React.useState(false)
  const [previewImage, setPreviewImage] = React.useState()
  const [previewTitle, setPreviewTitle] = React.useState()

  const handlePreview = file => {
    if (!file.url && !file.preview) {
      file.preview = file.thumbUrl;
    }
    setPreviewImage(file.url || (file.response?.url ? file.response.url : file.preview))
    setPreviewVisible(true)
    setPreviewTitle(file.name || file.url?.substring(file.url?.lastIndexOf('/') + 1))
  }

  const downloadFile = (val) => {
    const projectId = api({ name: 'media' }).headers['x-request-project']
    let url = getMediaUrl(val.previewURL || val.url || (val.response?.url ? val.response.url : val.preview))
    if (addToken) {
      url = url + '?x-request-project=' + projectId + '&token=' + user?.token
    }

    // 附件下载
    let a = document.createElement("a") //创建a标签
    let e = document.createEvent("MouseEvents"); //创建鼠标事件对象
    e.initEvent("click", false, false); //初始化事件对象
    a.href = url; //设置下载地址
    a.download = val.name; //设置下载文件名
    a.dispatchEvent(e); //给指定的元素，执行事件click事件
  }

  // 解决图片预览和修改modal同时出现
  const onClick = (e) => {
    e.stopPropagation()
  }

  const modalProps = _c('isMobile') ?
    { width: '80%', style: { maxWidth: 900 }, bodyStyle: { padding: 10 } } :
    { width: '70%', title: previewTitle }

  return type === 'text' ? (
    <FileDownload downloadFile={downloadFile} value={value} modalProps={modalProps} />
  ) :
    type === 'video' || type === 'audio' ? (
      _.isArray(value) && value?.length > 0 ?
        <div style={{ height: 42, overflowY: 'scroll' }}>
          {value.map(file => <VideoShow schema={schema} type={type} file={file} downloadFile={downloadFile} />)}
        </div>
        :
        value ? <div style={{ height: 42, overflowY: 'scroll' }}>
          <VideoShow schema={schema} type={type} file={value} downloadFile={downloadFile} />
        </div> : null
    ) : (
      <div className="show-attachment" onClick={onClick}>
        <Upload
          listType={listType}
          fileList={fileList?.map(f => ({ ...f, status: 'done' }))}
          // onPreview={handlePreview}
          onDownload={downloadFile}
          itemRender={(originNode, file, fileList, actions) => <ItemRender file={file} actions={actions} inList={inList} schema={schema} canDownload={canDownload} />}
          showUploadList={{ showPreviewIcon: false, showDownloadIcon: false, showRemoveIcon: false }}
        />
        <Modal
          {...modalProps}
          visible={previewVisible}
          wrapClassName={schema?.key + '-preview'}
          footer={null}
          zIndex={1040}
          onCancel={() => setPreviewVisible(false)}
        >
          <img alt={_t1("图片")} style={{ width: '100%' }} src={getMediaUrl(previewImage)} />
        </Modal>
      </div>
    )
}

const DownloadAllBtn = ({ value, fileName, className }) => {
  const [downloading, setDownloading] = React.useState(false)

  const getFileBlob = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('文件获取失败');
    return await response.blob();
  }

  const downloadAllFiles = async (e) => {
    setDownloading(true)
    e.stopPropagation()

    const zip = new JSZip();
    
    for (let i = 0; i < value.length; i++) {
      const file = value[i];
      const fileUrl = getMediaUrl(file.previewURL || file.url || (file.response?.url ? file.response.url : file.preview));
      try {
        const fileBlob = await getFileBlob(location.origin + fileUrl);
        const now = new Date();
        const timeZone = new Date().getTimezoneOffset() // 获取时区差值
        const utcDate = new Date(now.getTime() - timeZone * 60 * 1000); // 计算时间
        zip.file(
          file.name || `file_${i + 1}`,
          fileBlob,
          { date: utcDate }
        );
      } catch (error) {
        console.error(`文件 ${file.name} 获取失败:`, error);
      }
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    setDownloading(false)
    saveAs(zipBlob, `${fileName}_${moment().format('YYYYMMDDHHmmss')}.zip`);
  }

  return downloading ? <LoadingOutlined className={className} style={{ marginLeft: 8 }} />
  : <Tooltip title={_t1('全部下载')}>
    <Icon className={className + ' upload-download-all-btn'} onClick={downloadAllFiles} svg={require('./下载.svg')} />
  </Tooltip>
}

const ShowAttachment = props => {
  const { schema, value, item } = props
  const downloadAll = schema?.canDownload?.downloadAll === false ? false : true

  const fileName =  item?._label ? `${item?._label}_${schema?.title}` : schema?.title

  return schema?.listShow === 'num' && _.isArray(value) ? <>
    <Popover
      content={
        () => <div style={{ width: 400, height: 200, overflowY: 'scroll' }}>
          <ShowAttach {...props} />
        </div>
      }
      placement="right"
    >
      <Icon svg={require('./数量.svg')} />
      {value?.length}
    </Popover>
    {
      downloadAll && value?.length > 0 && <DownloadAllBtn value={value} fileName={fileName} />
    }
  </> : downloadAll && value?.length > 0 ?
  <Badge count={<DownloadAllBtn value={value} fileName={fileName} />}>
    <ShowAttach {...props} />
  </Badge> : <ShowAttach {...props} />
}

export { PDFPreviewModal, DownloadAllBtn }
export default ShowAttachment
