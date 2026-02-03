import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerClose,
  DrawerPortal
} from "@/registry/ui/drawer"
import { toast } from "sonner"
import { QrCode } from "lucide-react"

export interface MobileScanQRProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, "onChange"> {
  /**
   * 按钮文字
   */
  text?: string
  /**
   * 二维码扫描成功回调
   */
  onSuccess?: (data: string) => void
  /**
   * 值变化回调
   */
  onChange?: (value: string) => void
  /**
   * 扫描二维码 url 跳转事件
   */
  onRoute?: (url: string) => void
}

const MobileScanQR = React.forwardRef<HTMLButtonElement, MobileScanQRProps>(
  (
    {
      className,
      text = "扫描二维码",
      onSuccess,
      onChange,
      onRoute,
      ...props
    },
    ref
  ) => {
    const [visible, setVisible] = React.useState(false)
    const [isScanning, setIsScanning] = React.useState(false)
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const videoRef = React.useRef<HTMLVideoElement>(null)
    const animationRef = React.useRef<number>()

    // 获取摄像头流
    const getUserMedia = React.useCallback((constraints: MediaStreamConstraints, success: (stream: MediaStream) => void, error: (err: Error) => void) => {
      const nav = window.navigator as any
      if (nav && nav.mediaDevices && nav.mediaDevices.getUserMedia) {
        // 最新标准 API
        nav.mediaDevices.getUserMedia(constraints).then(success).catch(error)
      } else if (nav.webkitGetUserMedia) {
        // webkit 内核浏览器
        nav.webkitGetUserMedia(constraints).then(success).catch(error)
      } else if (nav.mozGetUserMedia) {
        // Firefox 浏览器
        nav.mozGetUserMedia(constraints).then(success).catch(error)
      } else if (nav.getUserMedia) {
        // 旧版 API
        nav.getUserMedia(constraints).then(success).catch(error)
      } else {
        throw new Error('你的浏览器不支持访问用户媒体设备')
      }
    }, [])

    // 扫描二维码
    const scanQRCode = React.useCallback(async () => {
      const canvas = canvasRef.current
      const video = videoRef.current
      if (!canvas || !video) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      if (video.readyState !== video.HAVE_ENOUGH_DATA) return

      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight

      if (canvas.height === 0 && canvas.width === 0) return

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      // 动态导入 jsQR
      const { default: jsQR } = await import('jsqr')

      const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" })

      if (code && code.data) {
        const qrData = code.data.trim()
        onChange?.(qrData)
        onSuccess?.(qrData)

        // 判断是否为 URL
        const urlRegex = /^(https?:\/\/|ftp:\/\/|www\.)[^\s/$.?#].[^\s]*$/i
        if (urlRegex.test(qrData)) {
          window.location.href = qrData
        } else {
          onRoute?.(qrData)
        }

        stopScanning()
      }
    }, [onChange, onSuccess, onRoute])

    // 停止扫描
    const stopScanning = React.useCallback(() => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = undefined
      }
      const video = videoRef.current
      if (video && video.srcObject) {
        const stream = video.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
        video.srcObject = null
      }
      setIsScanning(false)
    }, [])

    // 开始扫描
    const startScanning = React.useCallback(() => {
      const video = videoRef.current
      if (!video) return

      getUserMedia(
        { video: { facingMode: 'environment' } },
        (stream) => {
          video.srcObject = stream
          video.setAttribute("playsinline", "true")
          video.play()
          setIsScanning(true)

          const tick = () => {
            scanQRCode().catch(console.error)
            animationRef.current = requestAnimationFrame(tick)
          }
          tick()
        },
        () => {
          toast.error('访问用户媒体设备失败')
          stopScanning()
        }
      )
    }, [getUserMedia, scanQRCode, stopScanning])

    // 关闭扫描器
    const handleClose = React.useCallback(() => {
      setVisible(false)
      stopScanning()
    }, [stopScanning])

    // 弹窗打开时启动扫描，关闭时停止
    React.useEffect(() => {
      if (visible) {
        setTimeout(() => {
          startScanning()
        }, 100)
      } else {
        stopScanning()
      }
    }, [visible, startScanning, stopScanning])

    // 清理动画帧
    React.useEffect(() => {
      return () => {
        stopScanning()
      }
    }, [stopScanning])

    return (
      <>
        <Button
          ref={ref}
          className={cn("w-full", className)}
          onClick={() => setVisible(true)}
          {...props}
        >
          <QrCode className="h-4 w-4 mr-2" />
          {text}
        </Button>

        <Drawer open={visible} onOpenChange={setVisible} direction="bottom">
          <DrawerPortal>
            <DrawerContent className="h-full">
              <div className="relative flex flex-col h-full bg-black">
                {/* 扫描区域 */}
                <div className="flex-1 relative overflow-hidden">
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    playsInline
                    muted
                  />
                  <canvas
                    ref={canvasRef}
                    className="qr-canvas absolute inset-0 w-full h-full"
                  />

                  {/* 扫描框 */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-64 h-64 border-2 border-white/80 rounded-lg">
                      {/* 扫描线动画 */}
                      {isScanning && (
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-green-500 animate-[scan_2s_linear_infinite]">
                          <style>{`
                            @keyframes scan {
                              0%, 100% { top: 0; }
                              50% { top: 100%; }
                            }
                          `}</style>
                        </div>
                      )}
                      {/* 四角装饰 */}
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-500 -mt-0.5 -ml-0.5 rounded-tl-lg" />
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-500 -mt-0.5 -mr-0.5 rounded-tr-lg" />
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-500 -mb-0.5 -ml-0.5 rounded-bl-lg" />
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-500 -mb-0.5 -mr-0.5 rounded-br-lg" />
                    </div>
                  </div>
                </div>

                {/* 底部操作区 */}
                <div className="h-16 bg-white flex items-center justify-between px-4">
                  <span className="text-sm text-slate-600">
                    {isScanning ? '正在扫描...' : '请将二维码放入框内'}
                  </span>
                  <DrawerClose asChild>
                    <Button variant="outline" size="sm" onClick={handleClose}>
                      取消
                    </Button>
                  </DrawerClose>
                </div>

                <DrawerClose />
              </div>
            </DrawerContent>
          </DrawerPortal>
        </Drawer>
      </>
    )
  }
)
MobileScanQR.displayName = "MobileScanQR"

export { MobileScanQR }
