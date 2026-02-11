import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { MapPin, Edit } from 'lucide-react'
import { getConfig } from '@airiot/client'
import AMapLoader from '@amap/amap-jsapi-loader'
import isEmpty from 'lodash/isEmpty'

const config = getConfig()
console.log(config.user)
console.log(config.language)

export interface FormMapProps {
  value?: {
    name?: string
    lng?: number
    lat?: number
  }
  onChange?: (value: { name?: string; lng: number; lat: number } | null) => void
  placeholder?: string
  lngLat?: boolean
  positionName?: boolean
  canEdit?: boolean
  canHand?: boolean
  defaultVal?: { name?: string; lng: number; lat: number }
  showType?: 'map' | 'modal'
  size?: 'small' | 'middle' | 'large'
  disabled?: boolean
  filter?: any
  meta?: any
  record?: any
  [key: string]: any
}

// 地图组件占位符 - 等待GIS部分迁移
const GisPlaceholder: React.FC<{
  inputValue?: any
  mapHeight?: number
  input?: {
    value?: any
    onChange?: (val: any) => void
  }
}> = ({ inputValue, mapHeight = 400, input }) => {
  return (
    <div
      className="flex items-center justify-center bg-slate-100 rounded-md border-2 border-dashed border-slate-300"
      style={{ height: mapHeight }}
    >
      <div className="text-center p-6">
        <MapPin className="h-10 w-10 text-slate-400 mx-auto mb-2" />
        <p className="text-slate-500 font-medium">等待GIS部分迁移</p>
        <p className="text-sm text-slate-400 mt-1">Gis.RecordLocation 组件需要从旧版迁移</p>
        {input?.value && (
          <div className="mt-4 p-3 bg-white rounded border text-sm">
            <p className="font-medium mb-1">当前坐标：</p>
            {inputValue?.center && (
              <p>中心点: [{inputValue.center[0]}, {inputValue.center[1]}]</p>
            )}
            {inputValue?.data && (
              <p>坐标: {JSON.stringify(inputValue.data[0]?.coordinates)}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const FormMap = React.forwardRef<HTMLInputElement, FormMapProps>(
  (props, ref) => {
    const {
      value,
      onChange,
      placeholder = '请选择位置',
      lngLat = true,
      positionName = true,
      canEdit = true,
      canHand = true,
      defaultVal,
      showType = 'modal',
      size = 'middle',
      disabled = false
    } = props

    const getInit = (v: any) => {
      return isEmpty(v) ? {} : {
        center: [v.lng, v.lat],
        data: [
          {
            coordinates: [v.lng, v.lat],
            type: 'Point'
          }
        ]
      }
    }

    const getShowName = (v: any) => {
      let result = ''
      if (v) {
        result = (positionName ? (v.name || '') : '') + (lngLat ? `(${v.lng},${v.lat})` : '')
      }
      return result
    }

    const getLocation = (callBack: (val: { lat: number; lng: number }) => void) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          callBack({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        () => {
          console.error('获取位置失败')
        }
      )
    }

    const [visible, setVisible] = React.useState(false)
    const [displayValue, setDisplayValue] = React.useState<string>(
      value ? getShowName(value) : ''
    )
    const [inputValue, setInputValue] = React.useState(getInit(value))
    const [point, setPoint] = React.useState(value || null)
    const [handVisible, setHandVisible] = React.useState(false)

    // 手动输入表单
    const [handForm, setHandForm] = React.useState<{
      name?: string
      lng?: number
      lat?: number
    }>(value || {})

    // 默认值生效
    React.useEffect(() => {
      setTimeout(() => {
        if (!displayValue && defaultVal && onChange) {
          onChange(defaultVal)
          setDisplayValue(getShowName(defaultVal))
          setInputValue(getInit(defaultVal))
        } else if (!displayValue && onChange) {
          // 没有默认值，获取当前定位
          getLocation((val) => {
            setInputValue(getInit(val))
          })
        }
      })
    }, [])

    // 高德地图加载
    const AMapLoad = AMapLoader.load({
      key: 'a98df42a1cbecc0bfc64090fe338b37b',
      version: '1.4.15',
      AMapUI: {
        version: '1.1',
        plugins: [],
      }
    })

    const initAMap = (domId: string) => {
      AMapLoad.then((AMap: any) => {
        AMap.service(['AMap.PlaceSearch', 'AMap.Autocomplete'], function() {
          const auto = new AMap.Autocomplete({
            input: domId
          })

          AMap.event.addListener(auto, 'select', function(data: any) {
            if (data.poi.location != undefined) {
              const datapoi = {
                name: data.poi.district + data.poi.address + data.poi.name,
                lng: data.poi.location.lng,
                lat: data.poi.location.lat
              }
              setInputValue(getInit(datapoi))
              setPoint(datapoi)
            }
          })
        })
      }).catch((err: any) => {
        console.error(err)
      })
    }

    const replaceInput = (domID: string, name: string) => {
      const container = document.getElementById(domID)?.parentNode
      const oldInput = document.getElementById(domID)
      if (!container || !oldInput) return

      const newInput = oldInput.cloneNode(true) as HTMLInputElement
      newInput.id = domID
      newInput.value = name

      container.replaceChild(newInput, oldInput)
    }

    // 地图选中的地址，同步到搜索框中
    React.useEffect(() => {
      const domID = showType === 'map' ? 'tipinput2' : 'tipinput'
      const inputDom = document.getElementById(domID)
      if (inputDom && point?.name) {
        replaceInput(domID, point.name)
        setTimeout(() => {
          initAMap(domID)
        }, 100)
      }
    }, [point?.name])

    React.useEffect(() => {
      if (showType === 'map') {
        initAMap('tipinput2')
      }
    }, [showType])

    const inputChange = (val: any, cb?: (point: any) => void) => {
      if (JSON.stringify(val || {}) === JSON.stringify(inputValue || {})) return
      setInputValue(val)
      const [lng, lat] = val?.data?.[0]?.coordinates || []

      if (lng && lat) {
        fetch(`https://restapi.amap.com/v3/geocode/regeo?key=f1430b13cf18a4cf75ca41a7bb742874&&location=${lng},${lat}`)
          .then(response => {
            if (response.status === 200) {
              return response.json()
            }
          })
          .then((data: any) => {
            const p = {
              name: data.regeocode.formatted_address,
              lng,
              lat
            }
            setPoint(p)
            cb && cb(p)
          })
          .catch((err: any) => {
            setPoint({ lng, lat })
            console.error(err)
          })
      }
    }

    const handleOk = () => {
      if (point) {
        setDisplayValue(getShowName(point))
        onChange?.(point)
      }
      setVisible(false)
    }

    const handleHandSubmit = () => {
      if (handForm.lng && handForm.lat) {
        const newPoint = {
          name: handForm.name,
          lng: Number(handForm.lng),
          lat: Number(handForm.lat)
        }
        setDisplayValue(getShowName(newPoint))
        onChange?.(newPoint)
        setHandVisible(false)
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      if (!value) {
        onChange?.(null)
        setDisplayValue('')
      }
    }

    const openModal = () => {
      if (!canEdit || disabled) return
      setVisible(true)

      if (showType === 'map') return
      initAMap('tipinput')
    }

    const sizeClasses = {
      small: 'h-8 px-2 py-1 text-sm',
      middle: 'h-10 px-3 py-2',
      large: 'h-12 px-4 py-3 text-lg'
    }

    // showType === 'map' 直接展示地图，不用弹窗
    if (showType === 'map') {
      return (
        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium">位置：</span>
            <Input
              disabled={disabled}
              className="inline-block w-64 mr-4"
              id="tipinput2"
              placeholder="输入位置进行搜索"
            />
          </div>
          <GisPlaceholder
            inputValue={inputValue}
            mapHeight={400}
            input={{
              value: inputValue,
              onChange: (val) => {
                inputChange(val, (point) => {
                  setDisplayValue(getShowName(point))
                  onChange?.(point)
                })
              }
            }}
          />
        </div>
      )
    }

    return (
      <>
        <div className="flex gap-2">
          <Input
            value={displayValue}
            ref={ref}
            allowClear
            onChange={handleChange}
            placeholder={placeholder}
            className={sizeClasses[size as 'small' | 'middle' | 'large']}
          />
          {canEdit && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={disabled}
                      onClick={openModal}
                    >
                      <MapPin className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>地图选点</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {canHand && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={disabled}
                        onClick={() => setHandVisible(true)}
                      >
                        <Edit className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>手动输入</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </>
          )}
        </div>

        <Dialog open={visible} onOpenChange={setVisible}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>地图选点</DialogTitle>
            </DialogHeader>
            <div>
              <div className="mb-4">
                <span className="text-sm font-medium">位置：</span>
                <Input
                  className="inline-block w-64 mr-4"
                  id="tipinput"
                  placeholder="输入位置进行搜索"
                />
              </div>
              <GisPlaceholder
                inputValue={inputValue}
                mapHeight={500}
                input={{
                  value: inputValue,
                  onChange: inputChange
                }}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setVisible(false)}>
                取消
              </Button>
              <Button type="button" onClick={handleOk}>
                确定
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={handVisible} onOpenChange={setHandVisible}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>手动输入</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hand-name">地址</Label>
                <Input
                  id="hand-name"
                  value={handForm.name || ''}
                  onChange={(e) => setHandForm({ ...handForm, name: e.target.value })}
                  placeholder="请输入地址"
                />
              </div>
              {lngLat && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="hand-lng">经度 *</Label>
                    <Input
                      id="hand-lng"
                      type="number"
                      value={handForm.lng || ''}
                      onChange={(e) => setHandForm({ ...handForm, lng: e.target.value as any })}
                      placeholder="请输入经度"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hand-lat">纬度 *</Label>
                    <Input
                      id="hand-lat"
                      type="number"
                      value={handForm.lat || ''}
                      onChange={(e) => setHandForm({ ...handForm, lat: e.target.value as any })}
                      placeholder="请输入纬度"
                    />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setHandVisible(false)}>
                取消
              </Button>
              <Button
                type="button"
                onClick={handleHandSubmit}
                disabled={!handForm.lng || !handForm.lat}
              >
                保存
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }
)

FormMap.displayName = 'FormMap'

export { FormMap }
export default FormMap
