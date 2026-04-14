import * as React from "react"
import { WebControl } from "./web-control.esm.min.js"

// 初始化参数接口
export interface InitConfig {
  appkey?: string
  ip?: string
  port?: number
  secret?: string
  enableHTTPS?: number
  language?: string
  layout?: string
  playMode?: number
  reconnectDuration?: number
  reconnectTimes?: number
  showSmart?: number
  showToolbar?: number
  toolBarButtonIDs?: string
  snapDir?: string
  videoDir?: string
}

// 节点接口
export interface Node {
  id: string
  [key: string]: any
}

// 预览配置
export interface PlayConfig {
  streamMode?: string
}

// 回放配置
export interface PlayBackConfig {
  startTimeStamp?: string
  endTimeStamp?: string
  playTimeStamp?: string
  recordLocation?: string
}

// 组件属性
export interface IscVideoProps {
  /** 编辑模式 */
  editMode?: boolean
  /** 节点列表 */
  nodes?: Node[]
  /** 初始化配置 */
  initConfig?: InitConfig
  /** 预览配置 */
  playConfig?: PlayConfig
  /** 回放配置 */
  playBackConfig?: PlayBackConfig
}

// 获取初始化参数
const getInitArgument = (initConfig?: InitConfig): any => {
  const defaultInit = {
    appkey: "",
    ip: "",
    port: 443,
    secret: "",
    enableHTTPS: 1,
    language: "zh_CN",
    layout: "2x2",
    playMode: 0,
    reconnectDuration: 5,
    reconnectTimes: 5,
    showSmart: 0,
    showToolbar: 1,
    toolBarButtonIDs: "2048,2049,2050,2304,2306,2305,2307,2308,2309,4096,4608,4097,4099,4098,4609,4100",
    snapDir: "D:/snap",
    videoDir: "D:/video",
  }
  return { ...defaultInit, ...initConfig }
}

// 更新播放/回放
const update = async ({
  oWebControl,
  nodes = [],
  initConfig,
  playConfig,
  playBackConfig,
}: {
  oWebControl: any
  nodes: Node[]
  initConfig?: InitConfig
  playConfig?: PlayConfig
  playBackConfig?: PlayBackConfig
}) => {
  const initArgument = getInitArgument(initConfig)
  if (initArgument?.playMode === 0) {
    // 停止所有预览
    await oWebControl.JS_RequestInterface({
      argument: {},
      funcName: "stopAllPreview",
    })
    // 批量播放
    await oWebControl.JS_RequestInterface({
      argument: {
        list: nodes.map((node, index) => ({
          authUuid: "",
          cameraIndexCode: node?.id,
          ezvizDirect: 0,
          gpuMode: 0,
          streamMode: parseInt(playConfig?.streamMode || "0"),
          transMode: 1,
          wndId: index + 1,
        })),
      },
      funcName: "startMultiPreviewByCameraIndexCode",
    })
    console.log("批量播放")
  } else if (initArgument?.playMode === 1) {
    // 停止所有回放
    await oWebControl.JS_RequestInterface({
      argument: {},
      funcName: "stopAllPlayback",
    })
    // 批量回放
    await oWebControl.JS_RequestInterface({
      argument: {
        list: nodes.map((node, index) => ({
          authUuid: "",
          cameraIndexCode: node?.id,
          endTimeStamp: Math.floor(new Date(playBackConfig?.endTimeStamp || Date.now()).getTime() / 1000),
          ezvizDirect: 0,
          gpuMode: 0,
          playTimeStamp: Math.floor(new Date(playBackConfig?.playTimeStamp || Date.now()).getTime() / 1000),
          recordLocation: parseInt(playBackConfig?.recordLocation || "0"),
          startTimeStamp: Math.floor(new Date(playBackConfig?.startTimeStamp || Date.now()).getTime() / 1000),
          transMode: 1,
          wndId: index + 1,
        })),
      },
      funcName: "startMultiPlaybackByCameraIndexCode",
    })
    console.log("批量回放")
  }
}

// 启动插件
const start = ({
  nodes = [],
  initConfig,
  playConfig,
  playBackConfig,
  setInit,
  setActiveWin,
  instanceId,
}: {
  nodes: Node[]
  initConfig?: InitConfig
  playConfig?: PlayConfig
  playBackConfig?: PlayBackConfig
  setInit: (init: boolean) => void
  setActiveWin: (winId: number) => void
  instanceId: string
}) => {
  // 检查 WebControl 是否可用（已通过导入）
  const oWebControl = new WebControl({
    szPluginContainer: `iscPlayWnd-${instanceId}`,
    iServicePortStart: 15900,
    iServicePortEnd: 15900,
    szClassId: "23BF3B0A-2C56-4D97-9C03-0CB103AA8F11",
    cbConnectSuccess: async () => {
      console.log("cbConnectSuccess")
      // 启动服务
      await oWebControl.JS_StartService("window", {
        dllPath: "./VideoPluginConnect.dll",
      })
      console.log("启动服务")
      // 创建窗口
      const container = document.querySelector(`#iscPlayWnd-${instanceId}`)
      if (!container) return
      const { clientWidth, clientHeight } = container as HTMLElement
      await oWebControl.JS_CreateWnd(`iscPlayWnd-${instanceId}`, clientWidth, clientHeight)
      console.log("创建窗口")
      // 获取公钥
      await oWebControl.JS_RequestInterface({
        funcName: "getRSAPubKey",
        argument: JSON.stringify({
          keyLength: 1024,
        }),
      })
      console.log("获取公钥")
      // 初始化
      const initArgument = getInitArgument(initConfig)
      await oWebControl.JS_RequestInterface({
        argument: initArgument,
        funcName: "init",
      })
      setInit(true)
      console.log("初始化")
      update({ oWebControl, nodes, initConfig, playConfig, playBackConfig })
      // 设置窗口大小
      oWebControl.JS_Resize(clientWidth, clientHeight)
      // 监听消息
      oWebControl.JS_SetWindowControlCallback({
        cbIntegrationCallBack({ responseMsg }: any) {
          if (responseMsg?.type === 1) {
            setActiveWin(responseMsg?.msg?.wndId)
          } else if (responseMsg?.type === 6) {
            setActiveWin(1)
          }
        },
      })
    },
    cbConnectError: () => {
      console.log("cbConnectError")
    },
    cbConnectClose: (bNormalClose: boolean) => {
      console.log("cbConnectClose", bNormalClose)
    },
  })
  return oWebControl
}

// 停止插件
const stop = async ({
  oWebControl,
  setInit,
}: {
  oWebControl: any
  setInit: (init: boolean) => void
}) => {
  if (oWebControl) {
    try {
      await oWebControl.JS_RequestInterface({
        funcName: "uninit",
      })
      if (oWebControl.JS_HideWnd) {
        oWebControl.JS_HideWnd()
      }
      await oWebControl.JS_DestroyWnd()
      console.log("销毁成功")
      setInit(false)
    } catch (error) {
      console.error("停止插件失败", error)
    }
  }
}

// 播放单个视频
const play = async ({
  oWebControl,
  wndId,
  nodeId,
  streamMode,
}: {
  oWebControl: any
  wndId: number
  nodeId: string
  streamMode?: string
}) => {
  await oWebControl.JS_RequestInterface({
    argument: {
      authUuid: "",
      cameraIndexCode: nodeId,
      ezvizDirect: 0,
      gpuMode: 0,
      streamMode: parseInt(streamMode || "0"),
      transMode: 1,
      wndId,
    },
    funcName: "startPreview",
  })
}

// 主组件
const IscVideo: React.FC<IscVideoProps> = ({
  editMode = false,
  nodes = [],
  initConfig,
  playConfig,
  playBackConfig,
}) => {
  const oWebControlRef = React.useRef<any>(null)
  const [instanceId] = React.useState(() => Math.random().toString(36).substr(2, 9))
  const [init, setInit] = React.useState(false)
  const [activeWin, setActiveWin] = React.useState(1)

  // 启动/停止插件
  React.useEffect(() => {
    if (!editMode) {
      try {
        oWebControlRef.current = start({
          nodes,
          initConfig,
          playConfig,
          playBackConfig,
          setInit,
          setActiveWin,
          instanceId,
        })
        console.log(oWebControlRef.current, "oWebControlRef.current")
      } catch (error) {
        console.error("启动插件失败", error)
      }
    }
    return () => {
      try {
        setTimeout(() => {
          if (oWebControlRef.current) {
            stop({ oWebControl: oWebControlRef.current, setInit })
          }
        }, 500)
      } catch (error) {
        console.error("停止插件失败", error)
      }
    }
  }, [])

  // 节点变化时更新
  React.useEffect(() => {
    if (!editMode && init && oWebControlRef.current) {
      try {
        update({
          oWebControl: oWebControlRef.current,
          nodes,
          initConfig,
          playConfig,
          playBackConfig,
        })
      } catch (error) {
        console.error("更新播放失败", error)
      }
    }
  }, [JSON.stringify(nodes)])

  if (editMode) {
    return (
      <div
        id={`iscPlayWnd-${instanceId}`}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "1px dashed #ccc",
          borderRadius: "4px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <div style={{ textAlign: "center", color: "#666" }}>
          <div>ISC 视频组件</div>
          <div style={{ fontSize: "12px", marginTop: "8px" }}>请预览查看视频显示效果</div>
        </div>
      </div>
    )
  }

  return (
    <div
      id={`iscPlayWnd-${instanceId}`}
      style={{ width: "100%", height: "100%", minHeight: "300px" }}
    />
  )
}

IscVideo.displayName = "IscVideo"

export { IscVideo }