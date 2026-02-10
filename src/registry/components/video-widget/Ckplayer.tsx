import React, { useEffect, useRef } from 'react'

declare global {
  interface Window {
    ckplayer: any
  }
}

// Ensure ckplayer.js is available in public folder or CDN
const ckUrl = `/ckplayer/ckplayer.js`

interface CkplayerProps {
  url?: string
  tableData?: any
  [key: string]: any
}

const Ckplayer: React.FC<CkplayerProps> = ({ url, tableData }) => {
  const ckplayerRef = useRef<any>(null)
  
  useEffect(()=> {
    // Logic for rtmpUrlTemplate replacement if needed
    // if(tableData?.table?.device?.settings?.rtmpUrlTemplate && tableData.table.device.settings.rtmpUrlTemplate.indexOf('$$')>-1) {
    // }
    
    let finalUrl = url
    if (tableData?.id && tableData?.table?.device?.settings?.rtmpUrlTemplate && tableData.table.device.settings.rtmpUrlTemplate.indexOf('$$') > -1) {
        finalUrl = tableData.table.device.settings.rtmpUrlTemplate.replace('$$', tableData?.id)
    }

    let videoObject = {
      container: tableData?.id ? `#${tableData?.id}` : '#video_ckplayer', 
      variable: tableData?.id ?  `player${tableData?.id}` : 'playervideo_ckplayer', 
      autoplay: true,
      video: finalUrl,
      live: true, 
      debug: true,
      flashplayer: false,
      mobileCkControls: false
    }
    
    let ckplayer;
    if(window.ckplayer) {
      ckplayer = new window.ckplayer(videoObject)
      ckplayerRef.current = ckplayer
    } else {
      const elem = document.createElement('script')
      elem.src = ckUrl
      elem.type = 'text/javascript'
      elem.onload = function () {
        if(window.ckplayer) {
          ckplayer = new window.ckplayer(videoObject)
          ckplayerRef.current = ckplayer
        }
      }
      elem.onerror = function (event) {
        console.error("Ckplayer script load error", event)
      }
      document.head.appendChild(elem)
    }
   
  }, [ url, tableData ])

  return (
    <>
      <div id={tableData?.id || "video_ckplayer" } className="video_ck w-100 h-100" style={{ width: '100%', height: '100%' }}></div>
    </>
  )
}

export default Ckplayer