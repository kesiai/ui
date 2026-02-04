
import { CodeEditorViews } from '@/registry/blocks/gis/code-editor-views/code-editor-views'
import { MapContainer } from '../map-container/map-container'
import { ComponentConfig } from '@/app/config/types'

export const codeEditorViewsPropsConfig = [
    {
        name: 'codeScript',
        label: '脚本内容',
        type: 'text' as const,
        default: '(context, params) => {\n  const { layer, source } = context;\n  return new layer.Tile({\n    source: new source.OSM()\n  });\n}',
        placeholder: '请输入返回图层实例的函数字符串'
    },
    {
        name: 'display',
        label: '是否显示',
        type: 'boolean' as const,
        default: true
    }
]

export const codeEditorViewsDefaultProps = {
    codeScript: '(context, params) => {\n  const { layer, source } = context;\n  return new layer.Tile({\n    source: new source.OSM()\n  });\n}',
    display: true
}

const renderCodeEditorViewsPreview = (props: Record<string, any>) => {
    return (
        <div className="w-full h-[300px] border border-gray-200 rounded overflow-hidden relative flex flex-col">
            <div className="h-1/3 p-2 bg-gray-50 border-b overflow-auto text-xs font-mono">
                {props.codeScript || '// No code'}
            </div>
            <div className="flex-1 relative">
                <MapContainer>
                    <CodeEditorViews
                        codeScript={props.codeScript}
                        display={props.display}
                        cellKey="preview"
                    />
                </MapContainer>
            </div>
        </div>
    )
}

const renderCodeEditorViewsCodePreview = (props: Record<string, any>) => {
    return `<CodeEditorViews
  codeScript={\`${props.codeScript}\`}
  display={${props.display}}
  cellKey="your-cell-key"
/>`
}

export const codeEditorViewsConfig: ComponentConfig = {
    id: 'code-editor-views',
    name: '代码图层',
    propsConfig: codeEditorViewsPropsConfig,
    defaultProps: codeEditorViewsDefaultProps,
    renderPreview: renderCodeEditorViewsPreview,
    renderCodePreview: renderCodeEditorViewsCodePreview
}
