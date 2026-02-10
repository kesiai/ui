import React, { useRef, useState, useEffect } from 'react'
import EZUIKit from 'ezuikit-js'
import { createAPI } from '@airiot/client'

interface EzuikitVideoProps {
  tableData?: any
  videoAction?: string
  cellKey?: string
  videoData?: any
  url?: string
  accessToken?: string
  [key: string]: any
}

const EzuikitVideo: React.FC<EzuikitVideoProps> = (props) => {
  const { tableData, videoAction="preview", cellKey, videoData } = props
  const ezuikitContainer = useRef<HTMLDivElement>(null)
  const ezuikitVideoContainer = useRef<HTMLDivElement>(null)
  const [ ezopen, setEzopen ] = useState<{url?: string, accessToken?: string}>({ url: props?.url, accessToken: props?.accessToken })
  const player = useRef<any>(null)
  const tableDataId = tableData?.id || 'name'
  const randows = Math.random()

  const check = () => {
    if(typeof window !== "undefined") {
      let userAgentInfo = window.navigator.userAgent
      let agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod")
      let flag = true;
      for(let i=0;i<agents.length;i++) {
        if(userAgentInfo.indexOf(agents[i])>0) {
          flag = false;
          break;
        }
      }
      return flag
    }
    return true
  }

  useEffect(()=>{
    if(ezopen?.url && ezopen?.accessToken && tableDataId) {
      let containerElement = document.getElementById(`video-ezuikit-${cellKey}`)
      let clientHeight = containerElement?.clientHeight || 400
      let clientWidth = containerElement?.clientWidth || '100%'

      let videoContainer = document.getElementById(`video-container-${tableDataId}-${cellKey}-${randows || 0}`)
      if (videoContainer) videoContainer.innerHTML = ''

      const isMobile = check()
      
      // if(player.current) { player.current.stop(); player.current = null }
      
      try {
          player.current = new EZUIKit.EZUIKitPlayer({
            id: `video-container-${tableDataId}-${cellKey}-${randows || 0}`, // 视频容器ID
            accessToken: ezopen.accessToken,
            url: ezopen.url,
            width: clientWidth,
            height: clientHeight,
            template: !isMobile ? 'mobileLive' : 'theme',
            autoplay: true
          })
      } catch (e) {
          console.error("EZUIKit init failed", e)
      }
    }
  }, [ ezopen?.url, ezopen?.accessToken, tableDataId, cellKey ])

  const getTableSchema = async (tableId: string) => {
    const api = createAPI({ resource: 'core/t/schema' })
    try {
      const { json } = await api.get(tableId) as any
      return json
    } catch (err) {
      console.error("Get table schema failed", err)
      return {}
    }
  }

  const getUrl = async (id: string, tableId: string, driverInstanceId: string, type: string) => {
    const table = await getTableSchema(tableId)
    const groupId = table?.device?.groupId
    if (groupId) {
      const api = createAPI({ resource: 'driver/driver/httpProxy' })
      api.fetch(`?type=${type}&groupId=${groupId}`, {
        method: 'POST',
        body: JSON.stringify({
          table: tableId, id, driverInstanceId
        })
      })
        .then(({ json }: any) => {
          setEzopen(json?.data?.data)
        })
        .catch(err => console.error(err))
    }
  }

  useEffect(() => {
    const tableId = tableData?.table?.id || tableData?.table
    const driverInstanceId = videoData?.driverInstanceId
    if(videoAction == 'preview' && driverInstanceId && tableId && tableData?.id) getUrl(tableData?.id, tableId, driverInstanceId, 'ezopenPreview')
    if(videoAction == 'record' && driverInstanceId && tableId && tableData?.id) getUrl(tableData?.id, tableId, driverInstanceId, 'ezopenRecord')
  }, [ tableData?.id, videoAction, videoData?.driverInstanceId ])

  useEffect(() => {
    return () => { if(player.current && typeof player.current.stop === 'function') { player.current.stop() } }
  }, [])

  return (
    <>
      <div className='video-ezuikit' id={`video-ezuikit-${cellKey}`} ref={ezuikitVideoContainer} style={{ width: '100%', height: '100%' }}>
        <div id={`video-container-${tableDataId}-${cellKey}-${randows || 0}`} ref={ezuikitContainer}></div>
      </div>
    </>
  )
}

export { EzuikitVideo }
export default EzuikitVideo
