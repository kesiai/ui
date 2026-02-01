import { CodeEditorViews } from '@/registry/blocks/gis/code-editor-views/code-editor-views'
import { MapContainer } from '@/registry/blocks/gis/map-container/map-container'
import { ComponentConfig } from '../types'

export const codeEditorViewsPropsConfig = [
  {
    name: 'codeScript',
    label: '代码脚本',
    type: 'text' as const,
    default: `/* (ol, params) => {
  // 具体可以参考 https://openlayers.org/
  // params 为参数配置项，可通过 params.xxx 获取参数值 
  const { map } = ol
  const layers = [ new ol.layer.Tile({
    source: new ol.source.OSM(),
  }) ]
  if(map) {
    map.getLayers().extend(layers)
  }
  return layers[0]
} */`,
    description: '自定义 OpenLayers 脚本代码'
  },
  {
    name: 'display',
    label: '显示',
    type: 'boolean' as const,
    default: true
  }
]

export const codeEditorViewsDefaultProps = {
  codeScript: '',
  params: [],
  display: true
}

const renderCodeEditorViewsPreview = (props: Record<string, unknown>) => {
  return (
    <div className="flex flex-col">
      {/* 地图容器 */}
      <div className="rounded-lg overflow-hidden border border-slate-200">
        <MapContainer
          width="100%"
          height={300}
          viewOptions={{
            position: { center: [116.391, 39.9042] },
            zoom: 10
          }}
          cellKey="preview-map"
        >
          <CodeEditorViews
            codeScript={props.codeScript as string}
            display={props.display as boolean}
            cellKey="preview"
          />
        </MapContainer>
      </div>
      {/* 代码预览 */}
      <div className="mt-2 p-2 bg-slate-100 rounded text-xs text-left font-mono text-slate-500 max-h-24 overflow-auto">
        {props.codeScript ? String(props.codeScript).slice(0, 200) + '...' : '// 暂无脚本'}
      </div>
    </div>
  )
}

const renderCodeEditorViewsCodePreview = (props: Record<string, unknown>) => {
  return `<CodeEditorViews
  codeScript={\`${props.codeScript || ''}\`}
  params={[]}
  display={${props.display}}
  cellKey="your-cell-key"
  map={mapInstance}
/>`
}

export const codeEditorViewsConfig: ComponentConfig = {
  id: 'codeEditorViews',
  name: '代码层',
  propsConfig: codeEditorViewsPropsConfig,
  defaultProps: codeEditorViewsDefaultProps,
  renderPreview: renderCodeEditorViewsPreview,
  renderCodePreview: renderCodeEditorViewsCodePreview
}
