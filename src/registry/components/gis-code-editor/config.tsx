
import { CodeEditorViews } from '@/registry/components/gis-code-editor/gis-code-editor'
import { MapContainer } from '../gis-map-core/gis-map-core'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './gis-code-editor.md?raw'

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
        <div className="w-full h-100 border border-gray-200 rounded overflow-hidden relative flex flex-col">
            <div className="flex-1 relative">
                <MapContainer>
                    <CodeEditorViews
                        codeScript={props.codeScript}
                        display={props.display}
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
/>`
}

export const codeEditorViewsConfig: ComponentConfig = {
    id: 'gis-code-editor',
    name: '代码图层',
    propsConfig: codeEditorViewsPropsConfig,
    defaultProps: codeEditorViewsDefaultProps,
    renderPreview: renderCodeEditorViewsPreview,
    renderCodePreview: renderCodeEditorViewsCodePreview,
    documentation: documentationMd
}
