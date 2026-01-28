import * as React from "react"
import { ChevronDown, MinusCircle, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export type PtzAction =
  | "up"
  | "down"
  | "left"
  | "right"
  | "upLeft"
  | "upRight"
  | "downLeft"
  | "downRight"
  | "zoomIn"
  | "zoomOut"

export type ButtonWidgetControlMode = "click" | "hold"

export interface ButtonWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number | string
  bg?: string
  btnColor?: string
  controlMode?: ButtonWidgetControlMode
  disable?: boolean
  onActionClick?: (action: PtzAction) => void
  onActionStart?: (action: PtzAction) => void
  onActionEnd?: (action: PtzAction) => void
}

type ControlItem = {
  action: PtzAction
  label: string
  placement: React.CSSProperties
  icon: "arrow" | "plus" | "minus"
  rotateDeg?: number
}

const DEFAULT_SIZE = 220

const ButtonWidget = React.forwardRef<HTMLDivElement, ButtonWidgetProps>(
  (
    {
      className,
      size = DEFAULT_SIZE,
      bg = "#222641",
      btnColor = "#757c99",
      controlMode = "hold",
      disable = false,
      onActionClick,
      onActionStart,
      onActionEnd,
      ...props
    },
    ref
  ) => {
    const containerSize = React.useMemo<React.CSSProperties>(() => {
      if (typeof size === "number") {
        return { width: size, height: size }
      }
      return { width: size, height: size }
    }, [size])

    const items = React.useMemo<ControlItem[]>(() => {
      const inner = "9%"
      const corner = "19%"
      return [
        {
          action: "up",
          label: "上",
          icon: "arrow",
          rotateDeg: 180,
          placement: { top: inner, left: "50%", transform: "translate(-50%, 0)" },
        },
        {
          action: "upLeft",
          label: "左上",
          icon: "arrow",
          rotateDeg: 135,
          placement: { top: corner, left: corner },
        },
        {
          action: "left",
          label: "左",
          icon: "arrow",
          rotateDeg: 90,
          placement: { top: "50%", left: inner, transform: "translate(0, -50%)" },
        },
        {
          action: "downRight",
          label: "右下",
          icon: "arrow",
          rotateDeg: -45,
          placement: { bottom: corner, right: corner },
        },
        {
          action: "down",
          label: "下",
          icon: "arrow",
          rotateDeg: 0,
          placement: { bottom: inner, left: "50%", transform: "translate(-50%, 0)" },
        },
        {
          action: "right",
          label: "右",
          icon: "arrow",
          rotateDeg: -90,
          placement: { top: "50%", right: inner, transform: "translate(0, -50%)" },
        },
        {
          action: "upRight",
          label: "右上",
          icon: "arrow",
          rotateDeg: 225,
          placement: { top: corner, right: corner },
        },
        {
          action: "downLeft",
          label: "左下",
          icon: "arrow",
          rotateDeg: 45,
          placement: { bottom: corner, left: corner },
        },
        {
          action: "zoomIn",
          label: "放大",
          icon: "plus",
          placement: {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -110%)",
          },
        },
        {
          action: "zoomOut",
          label: "缩小",
          icon: "minus",
          placement: {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, 10%)",
          },
        },
      ]
    }, [])

    const callStart = React.useCallback(
      (action: PtzAction) => {
        if (disable) return
        onActionStart?.(action)
      },
      [disable, onActionStart]
    )

    const callEnd = React.useCallback(
      (action: PtzAction) => {
        if (disable) return
        onActionEnd?.(action)
      },
      [disable, onActionEnd]
    )

    const callClick = React.useCallback(
      (action: PtzAction) => {
        if (disable) return
        onActionClick?.(action)
      },
      [disable, onActionClick]
    )

    const renderIcon = (item: ControlItem) => {
      if (item.icon === "plus") return <PlusCircle className="h-5 w-5" />
      if (item.icon === "minus") return <MinusCircle className="h-5 w-5" />
      return (
        <ChevronDown
          className="h-5 w-5"
          style={
            item.rotateDeg !== undefined
              ? { transform: `rotate(${item.rotateDeg}deg)` }
              : undefined
          }
        />
      )
    }

    const bindHoldEvents = (action: PtzAction) => {
      return {
        onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => {
          if (disable) return
          e.preventDefault()
          e.currentTarget.setPointerCapture?.(e.pointerId)
          callStart(action)
        },
        onPointerUp: (e: React.PointerEvent<HTMLButtonElement>) => {
          if (disable) return
          e.preventDefault()
          callEnd(action)
        },
        onPointerLeave: () => {
          callEnd(action)
        },
        onPointerCancel: () => {
          callEnd(action)
        },
      }
    }

    return (
      <div
        ref={ref}
        className={cn("w-full h-full flex items-center justify-center", className)}
        {...props}
      >
        <div
          className={cn(
            "relative rounded-full select-none",
            disable && "opacity-50 pointer-events-none"
          )}
          style={{ ...containerSize, background: bg }}
        >
          <div
            className="absolute inset-[14%] rounded-full"
            style={{ background: "rgba(0,0,0,0.18)" }}
          />
          <div
            className="absolute inset-[34%] rounded-full"
            style={{ background: "rgba(0,0,0,0.25)" }}
          />

          {items.map((item) => {
            const isClickMode = controlMode === "click"
            const baseEvents = isClickMode
              ? {
                  onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault()
                    callClick(item.action)
                  },
                }
              : bindHoldEvents(item.action)

            return (
              <button
                key={item.action}
                type="button"
                title={item.label}
                aria-label={item.label}
                className={cn(
                  "absolute grid place-items-center rounded-full",
                  "h-10 w-10",
                  "bg-transparent hover:bg-white/10 active:bg-white/20",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "transition-colors"
                )}
                style={{ ...item.placement, color: btnColor }}
                {...baseEvents}
              >
                {renderIcon(item)}
              </button>
            )
          })}
        </div>
      </div>
    )
  }
)

ButtonWidget.displayName = "ButtonWidget"

export { ButtonWidget }
