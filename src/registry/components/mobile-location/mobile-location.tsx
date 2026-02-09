import * as React from "react"
import { cn } from "@/lib/utils"
import { InputGroup, InputGroupInput } from "@/components/ui/input-group"
import { toast } from "sonner"

// 百度地图 API 类型定义
interface BMapConstructor {
  Point: new (lng: number, lat: number) => BMapPoint
  Geolocation: new () => BMapGeolocation
  Geocoder: new () => BMapGeocoder
  BMAP_STATUS_SUCCESS: number
}

declare global {
  interface Window {
    BMap?: BMapConstructor
    onBMapCallback?: () => void,
    BMAP_STATUS_SUCCESS?: number
  }
}

interface BMapPoint {
  lng: number
  lat: number
}

interface BMapGeolocation {
  getCurrentPosition(callback: (this: BMapGeolocation, result: GeolocationResult) => void): void
  getStatus(): number
}

interface GeolocationResult {
  point?: BMapPoint
  address?: string
  addressComponents?: {
    province: string
    city: string
    district: string
  }
}

interface BMapGeocoder {
  getLocation(point: BMapPoint, callback: (result: GeocoderResult) => void): void
}

interface GeocoderResult {
  address: string
  point?: BMapPoint
  addressComponents?: {
    province: string
    city: string
    district: string
    street: string
  }
  surroundingPois?: Array<{ address: string }>
}

export interface MobileLocationProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "onError"> {
  /**
   * 百度地图 API Key
   */
  ak?: string
  /**
   * 默认地址值
   */
  defaultValue?: string
  /**
   * 当前值
   */
  value?: string
  /**
   * 占位符文字
   */
  placeholder?: string
  /**
   * 值变化回调
   */
  onChange?: (data: { address: string; lat: number; lng: number }) => void
  /**
   * 定位成功回调
   */
  onSuccess?: (data: { address: string; lat: number; lng: number }) => void
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 输入框尺寸
   */
  size?: "sm" | "md" | "lg"
}

const MobileLocation = React.forwardRef<HTMLDivElement, MobileLocationProps>(
  (
    {
      className,
      ak,
      defaultValue = "",
      value: controlledValue,
      placeholder = "定位中...",
      onChange,
      onSuccess,
      disabled = false,
      size = "md",
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const [isLocating, setIsLocating] = React.useState(true)
    const [locationError, setLocationError] = React.useState<string | null>(null)
    const isControlled = controlledValue !== undefined
    const value = isControlled ? controlledValue : internalValue

    // 初始化百度地图 SDK
    const initMap = React.useCallback(() => {
      return new Promise<BMapConstructor>((resolve, reject) => {
        // 检查是否已加载，直接使用 window.BMap
        if (window.BMap) {
          resolve(window.BMap)
          return
        }

        const script = document.createElement('script')
        script.setAttribute('type', 'text/javascript')
        script.setAttribute('src', `${window.location.protocol}//api.map.baidu.com/api?v=3.0&ak=${ak}&s=1&callback=onBMapCallback`)

        window.onBMapCallback = () => {
          if (window.BMap) {
            resolve(window.BMap)
          } else {
            reject(new Error('百度地图加载失败'))
          }
          // 清理回调
          window.onBMapCallback = undefined
        }

        script.onerror = () => {
          reject(new Error('百度地图脚本加载失败'))
          window.onBMapCallback = undefined
        }

        document.body.appendChild(script)
      })
    }, [ak])

    // 根据经纬度获取地址
    const getAddress = React.useCallback((lng: number, lat: number) => {
      const BMap = window.BMap
      if (!BMap) return

      const gpsPoint = new BMap.Point(lng, lat)
      const geoc = new BMap.Geocoder()

      geoc.getLocation(gpsPoint, function (rs) {
        let address = rs.surroundingPois && rs.surroundingPois.length > 0
          ? rs.surroundingPois[0].address
          : rs.address

        // 补充省市区信息
        if (rs.addressComponents) {
          address = address.includes(rs.addressComponents.city) ? address : rs.addressComponents.city + address
          address = address.includes(rs.addressComponents.province) ? address : rs.addressComponents.province + address
        }

        const data = {
          address,
          lat: rs.point?.lat ?? lat,
          lng: rs.point?.lng ?? lng
        }

        if (!isControlled) {
          setInternalValue(address)
        }
        onChange?.(data)
        onSuccess?.(data)
        setIsLocating(false)
      })
    }, [isControlled, onChange, onSuccess])

    // 获取当前位置
    const getCurrentLocation = React.useCallback(() => {
      const BMap = window.BMap
      if (!BMap) {
        const error = '百度地图未初始化'
        setLocationError(error)
        toast.error(error)
        setIsLocating(false)
        return
      }

      const geolocation = new BMap.Geolocation()

      geolocation.getCurrentPosition(function (this: BMapGeolocation, r) {
        if (this.getStatus() === window.BMAP_STATUS_SUCCESS && r.point) {
          getAddress(r.point.lng, r.point.lat)
        } else {          
          const error = '定位失败，请检查浏览器定位权限'
          setLocationError(error)
          toast.error(error)
          setIsLocating(false)
        }
      })
    }, [getAddress])

    // 初始化地图并开始定位
    React.useEffect(() => {
      if (ak) {
        initMap()
          .then(() => {
            getCurrentLocation()
          })
          .catch((error) => {
            const errorMessage = error instanceof Error ? error.message : '百度地图初始化失败'
            setLocationError(errorMessage)
            toast.error(errorMessage)
            setIsLocating(false)
          })
      } else {
        setIsLocating(false)
      }
    }, [ak, initMap, getCurrentLocation])

    // 处理受控值变化
    React.useEffect(() => {
      if (isControlled && controlledValue !== undefined) {
        setInternalValue(controlledValue)
      }
    }, [isControlled, controlledValue])

    const heightClass = size === "sm" ? "h-8" : size === "lg" ? "h-12" : "h-10"
    const textSizeClass = size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base"

    return (
      <div ref={ref} className={cn("mobile-location", className)} {...props}>
        <InputGroup className={cn(heightClass, textSizeClass, !disabled && !locationError && "border-primary/50 bg-primary/5")}>
          <InputGroupInput
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            readOnly
            className={cn(
              "text-slate-900",
              isLocating && "animate-pulse",
              locationError && "text-destructive"
            )}
          />
          {isLocating && (
            <svg
              className="animate-spin h-4 w-4 text-muted-foreground absolute right-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
        </InputGroup>
      </div>
    )
  }
)
MobileLocation.displayName = "MobileLocation"

export { MobileLocation }
