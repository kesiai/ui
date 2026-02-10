import React, { useState, useEffect, useMemo } from 'react'
import { createAPI } from '@airiot/client'
import { JessibucaVideo } from './JessibucaVideo'

// Mocking translations
const _t1 = (str: string) => str

const getPointNode = async (id: string, tableId: string) => {
  if (id && tableId) {
    const api = createAPI({ resource: `core/t/${tableId}/d` })
    try {
      return await api.get(id)
    } catch (err) {
      console.error("Error fetching point node", err)
      return null
    }
  }
  return null
}

interface PointVideoProps {
    id?: string
    tableId?: string
    type?: string
    styles?: any
    configure?: any
    resolution?: string
    frameRate?: string
    videoData?: any
    reload?: any
    rtmpType?: string
    jessConfigute?: any
    [key: string]: any
}

const PointVideo: React.FC<PointVideoProps> = (props) => {
  const { id, type, configure, resolution, frameRate, videoData, tableId, reload, rtmpType } = props
  const [wsUrl, setWsUrl] = useState<{type: string | null, url: string | null}>({ type: null, url: null })
  
  let rtspResolution = configure?.resolution || resolution
  let rtspFrameRate = configure?.frameRate || frameRate
  let url = videoData?.url

  const getWsUrl = (rtsp: string, resolution: any, frameRate: any) => {
    const _url = rtmpType == 'rtmp-ws' ? 'pullRtmp' : 'pullRtsp'

    if (rtmpType == 'rtmp-ws' && rtsp.indexOf('rtsp:') > -1) {
      console.error(_t1('请填写正确的 rtmp 地址'))
    }
    
    const api = createAPI({ resource: `video/live/${_url}` })
    api.fetch('', {
      method: 'POST',
      body: JSON.stringify({
        videoUrl: rtsp,
        resolution,
        frameRate
      })
    })
      .then(({ json }: any) => {
        setWsUrl({ type: json?.protocol, url: json?.url })
      })
      .catch(err => {
        console.error(err.message)
      })
  }

  useEffect(() => {
    (async () => {
      if ((id && tableId) || url) {
        try {
          const tableData = await getPointNode(id!, tableId!)
          if (url) {
            if (url && (url.indexOf('rtsp:') > -1 || url.indexOf('rtmp:') > -1)) {
              getWsUrl(url, rtspResolution, rtspFrameRate)
            }
          } else if (tableData?._settings?.video?.rtspUrl) {
            const rtspUrl = tableData?._settings?.video?.rtspUrl
            getWsUrl(rtspUrl, rtspResolution, rtspFrameRate)
            return
          }
        } catch (err: any) {
          console.error(err.message)
        }
      }
    })()
  }, [id, url, type, rtspResolution, rtspFrameRate, reload])

  return useMemo(() => wsUrl.url ? <JessibucaVideo {...props} videoData={wsUrl} jessConfigute={props?.jessConfigute} /> : <div className="flex items-center justify-center h-full text-slate-400">暂无数据</div>, [JSON.stringify(wsUrl), props])
}

interface StreamVideoProps {
    videoId?: any
    videoUid?: any
    videoData?: any
    tableData?: any
    rtmpType?: string
    configure?: any
    resolution?: string
    frameRate?: string
    reload?: any
    [key: string]: any
}

const StreamVideo: React.FC<StreamVideoProps> = props => {
  const { videoId, videoUid, videoData, tableData, rtmpType } = props
  // const [currentData, setCurrentData] = useState<string | null>(null) // unused
  const currentData = null
  
  // Mock context data
  const ctxTableData = { id: 'mock-ctx-id' } // Should come from context if available
  let rtspResolution = props?.configure?.resolution || props?.resolution || videoData?.resolution
  let frameRate = props?.configure?.frameRate || props?.frameRate || videoData?.frameRate

  const pointId = (videoId || videoUid) ? (videoId || videoUid) : (
    (ctxTableData && ctxTableData.id) || currentData || tableData?.id
  )
  const tableId = tableData?.table?.id

  return useMemo(() => <PointVideo tableId={tableId} id={pointId} {...props} />, [pointId, videoData?.url, rtspResolution, frameRate, tableId, props?.reload, rtmpType])
}

export { StreamVideo }
export default StreamVideo