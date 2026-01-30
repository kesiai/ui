import * as React from "react"
import { cn } from "@/lib/utils"
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import XYZ from 'ol/source/XYZ'
import type Map from 'ol/Map'
import { useMap } from '../map-container/map-container'

export interface CodeParam {
  name: string
  value: string | number | boolean | Record<string, unknown>
}

export interface CodeEditorViewsProps {
  /**
   * 代码脚本
   */
  codeScript?: string
  /**
   * 参数列表
   */
  params?: CodeParam[]
  /**
   * 是否显示
   */
  display?: boolean
  /**
   * CSS 类名
   */
  className?: string
  /**
   * 单元格唯一标识
   */
  cellKey?: string
  /**
   * 地图实例（由父组件传入）
   */
  map?: Map | null
}

// 提供给脚本使用的 OpenLayers 模块
const olModules = {
  layer: {
    Tile: TileLayer,
  },
  source: {
    OSM,
    XYZ,
  },
}

const CodeEditorViews = React.forwardRef<HTMLDivElement, CodeEditorViewsProps>(
  (
    {
      className,
      codeScript,
      params = [],
      display = true,
      cellKey,
      map: mapProp,
      ...props
    },
    ref
  ) => {
    const contextMap = useMap()
    const map = mapProp || contextMap
    const layerRef = React.useRef<TileLayer<OSM | XYZ> | null>(null)

    // 统一计算图层是否应该显示
    const shouldShow = React.useMemo(() => {
      return display == null || display
    }, [display])

    // 执行代码脚本
    React.useEffect(() => {
      if (!map || !codeScript) return

      try {
        // 构建参数对象
        const paramsObj: Record<string, unknown> = {}
        params?.forEach((item) => {
          const v = item.value && typeof item.value === 'object' && 'vval' in item.value 
            ? (item.value as Record<string, unknown>).vval 
            : item.value
          paramsObj[item.name] = v
        })

        // 执行脚本
        // eslint-disable-next-line no-eval
        const scriptFn = eval(codeScript)
        if (typeof scriptFn === 'function') {
          layerRef.current = scriptFn({ ...olModules, map }, paramsObj)
          if (layerRef.current) {
            layerRef.current.setVisible(shouldShow)
          }
        }
      } catch (error) {
        console.error('CodeEditorViews script error:', error)
      }

      return () => {
        if (layerRef.current && map) {
          try {
            map.removeLayer(layerRef.current)
          } catch (e) {
            // ignore
          }
          layerRef.current = null
        }
      }
    }, [map, codeScript, JSON.stringify(params)])

    // display 变化时，仅更新图层可见性
    React.useEffect(() => {
      if (!map || !layerRef.current) return
      layerRef.current.setVisible(shouldShow)
    }, [map, shouldShow])

    return (
      <div
        ref={ref}
        className={cn("code-editor-views", className)}
        style={{ display: 'none' }}
        data-cell-key={cellKey}
        {...props}
      />
    )
  }
)

CodeEditorViews.displayName = "CodeEditorViews"

export { CodeEditorViews }
