import * as React from "react"

import { cn } from "@/lib/utils"
import {
  Drawer,
  DrawerContent,
  DrawerClose,
  DrawerPortal
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export interface MobilePopupProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, "children"> {
  /**
   * 触发按钮文字
   */
  text?: string
  /**
   * 弹出框标题
   */
  title?: string
  /**
   * 抽屉位置
   */
  position?: "left" | "right" | "top" | "bottom"
  /**
   * 是否显示蒙层
   */
  mask?: boolean
  /**
   * 是否显示关闭按钮
   */
  showCloseButton?: boolean
  /**
   * 是否显示保存按钮
   */
  showFormSubmitBtn?: boolean
  /**
   * 是否显示取消按钮
   */
  showFormCancelBtn?: boolean
  /**
   * 是否显示弹出框
   */
  popVisible?: boolean
  /**
   * 打开回调
   */
  onOpen?: () => void
  /**
   * 关闭回调
   */
  onClose?: () => void
  /**
   * 保存回调
   */
  onSubmit?: () => void
  /**
   * 弹出框内容
   */
  children?: React.ReactNode
}

const MobilePopup = React.forwardRef<HTMLButtonElement, MobilePopupProps>(
  (
    {
      className,
      text = "弹出框",
      title,
      position = "bottom",
      mask = true,
      showCloseButton = false,
      showFormSubmitBtn = false,
      showFormCancelBtn = false,
      popVisible,
      onOpen,
      onClose,
      onSubmit,
      children,
      ...props
    },
    ref
  ) => {
    const [visible, setVisible] = React.useState(false)

    React.useEffect(() => {
      if (popVisible !== undefined) {
        setVisible(popVisible)
      }
    }, [popVisible])

    const handleOpen = React.useCallback((): void => {
      setVisible(true)
      onOpen?.()
    }, [onOpen])

    const handleClose = React.useCallback((): void => {
      setVisible(false)
      onClose?.()
    }, [onClose])

    const handleSubmit = React.useCallback((): void => {
      onSubmit?.()
      handleClose()
    }, [onSubmit, handleClose])

    // 根据位置计算内容样式
    const getPositionDirection = (): "top" | "bottom" | "left" | "right" => {
      switch (position) {
        case "left":
          return "left"
        case "right":
          return "right"
        case "top":
          return "top"
        case "bottom":
        default:
          return "bottom"
      }
    }

    return (
      <>
        <Button
          ref={ref}
          className="w-full h-full app-popup-button"
          onClick={handleOpen}
          {...props}
        >
          {text}
        </Button>

        <Drawer open={visible} onOpenChange={setVisible} direction={getPositionDirection()}>
          <DrawerPortal>
            <DrawerContent
              className={cn(
                "app-popup",
                className
              )}
            >
              <div className="app-popup-body-header p-4 text-center sm:text-left">
                {title}
              </div>

              <div className="app-popup-body overflow-y-auto flex-1 p-4">
                {children}
              </div>

              {showFormSubmitBtn || showFormCancelBtn ? (
                <div className="ant-modal-footer flex gap-2 p-4 mt-auto">
                  {showFormSubmitBtn && (
                    <Button onClick={handleSubmit}>
                      保存
                    </Button>
                  )}
                  {showFormCancelBtn && (
                    <Button variant="outline" onClick={handleClose}>
                      取消
                    </Button>
                  )}
                </div>
              ) : null}

              {showCloseButton && (
                <DrawerClose
                  className={cn(
                    "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
                  )}
                ><X className="h-4 w-4" /></DrawerClose>
              )}
            </DrawerContent>
          </DrawerPortal>
        </Drawer>
      </>
    )
  }
)
MobilePopup.displayName = "MobilePopup"

export { MobilePopup }
