import { Model3dLayout3d } from '@/registry/components/model-3d-layout-3d/model-3d-layout-3d'
import { Model3d } from '@/registry/components/model-3d/model-3d'
import { ComponentConfig } from '@/app/config/types'

// 默认配置
const defaultModel3dLayout3dProps = {
  meshConfig: {
    visible: true,
    position: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    rotation: { x: 0, y: 0, z: 0 },
    opacity: 1,
    color: '#FFFFFF'
  },
  isSprite: false,
  isFixd: false,
  layoutWidth: 400,
  layoutHeight: 250,
  cellKey: '',
  editMode: false,
  className: ''
}

export const model3dLayout3dPropsConfig = [
  {
    name: 'meshConfig',
    label: '网格配置',
    type: 'text' as const,
    default: JSON.stringify(defaultModel3dLayout3dProps.meshConfig)
  },
  {
    name: 'isSprite',
    label: '精灵图模式',
    type: 'boolean' as const,
    default: defaultModel3dLayout3dProps.isSprite
  },
  {
    name: 'isFixd',
    label: '固定位置',
    type: 'boolean' as const,
    default: defaultModel3dLayout3dProps.isFixd
  },
  {
    name: 'layoutWidth',
    label: '布局宽度',
    type: 'text' as const,
    default: defaultModel3dLayout3dProps.layoutWidth.toString(),
    placeholder: '请输入布局宽度'
  },
  {
    name: 'layoutHeight',
    label: '布局高度',
    type: 'text' as const,
    default: defaultModel3dLayout3dProps.layoutHeight.toString(),
    placeholder: '请输入布局高度'
  },
  {
    name: 'cellKey',
    label: '单元格键',
    type: 'text' as const,
    default: defaultModel3dLayout3dProps.cellKey,
    placeholder: '请输入单元格键'
  },
  {
    name: 'editMode',
    label: '编辑模式',
    type: 'boolean' as const,
    default: defaultModel3dLayout3dProps.editMode
  },
  {
    name: 'className',
    label: 'CSS类名',
    type: 'text' as const,
    default: defaultModel3dLayout3dProps.className,
    placeholder: '请输入CSS类名'
  }
]

export const model3dLayout3dDefaultProps = {
  meshConfig: JSON.stringify(defaultModel3dLayout3dProps.meshConfig),
  isSprite: defaultModel3dLayout3dProps.isSprite,
  isFixd: defaultModel3dLayout3dProps.isFixd,
  layoutWidth: defaultModel3dLayout3dProps.layoutWidth.toString(),
  layoutHeight: defaultModel3dLayout3dProps.layoutHeight.toString(),
  cellKey: defaultModel3dLayout3dProps.cellKey,
  editMode: defaultModel3dLayout3dProps.editMode,
  className: defaultModel3dLayout3dProps.className
}

const renderModel3dLayout3dPreview = (props: Record<string, any>) => {
  // 解析 JSON 配置，解析失败返回 undefined
  const parseJson = (str: string) => {
    try {
      return JSON.parse(str)
    } catch {
      return undefined
    }
  }

  const meshConfig = parseJson(props.meshConfig)
  const layoutWidth = props.layoutWidth ? parseInt(props.layoutWidth) : defaultModel3dLayout3dProps.layoutWidth
  const layoutHeight = props.layoutHeight ? parseInt(props.layoutHeight) : defaultModel3dLayout3dProps.layoutHeight

  // 用于示例展示的简化 Model3d 配置
  const exampleModel3dConfig = {
    sceneConfig: {
      fog: { enable: false },
      ground: { enable: true, width: 1000, height: 1000, color: '#748FA5' }
    },
    cameraConfig: {
      fov: 45,
      position: { x: 0, y: 200, z: 500 },
      lookAt: { x: 0, y: 0, z: 0 }
    },
    controlConfig: {
      controlType: 'orbit',
      orbitConfig: { enabled: true }
    },
    environmentConfig: {
      type: 'sky'
    },
    lightConfig: {
      ambientLight: [{ enable: true, color: '#FFFFFF' }],
      directionalLight: [{ enable: true, color: '#FFFFFF', position: { x: 0, y: 300, z: 300 } }]
    },
    helperConfig: {
      gridConfig: { enable: true, size: 1000, divisions: 20 },
      axesConfig: { enable: true, size: 500 }
    }
  }

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full h-96 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center p-4">
          <Model3d {...exampleModel3dConfig}>
            <Model3dLayout3d
              meshConfig={meshConfig}
              isSprite={props.isSprite}
              isFixd={props.isFixd}
              layoutWidth={layoutWidth}
              layoutHeight={layoutHeight}
              cellKey={props.cellKey}
              editMode={props.editMode}
              className={props.className}
              setMeshs={() => {}} // 提供空函数，避免组件显示"请放入三维空间中使用"
            >
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed #ccc'
              }}>
                <span style={{ color: '#666' }}>三维布局容器</span>
              </div>
            </Model3dLayout3d>
          </Model3d>
        </div>
      </div>
    </div>
  )
}

const renderModel3dLayout3dCodePreview = (props: Record<string, any>) => {
  const parseJson = (str: string) => {
    try {
      return JSON.parse(str)
    } catch {
      return undefined
    }
  }

  const meshConfig = parseJson(props.meshConfig)
  const layoutWidth = props.layoutWidth || defaultModel3dLayout3dProps.layoutWidth
  const layoutHeight = props.layoutHeight || defaultModel3dLayout3dProps.layoutHeight

  // 用于示例展示的简化 Model3d 配置
  const exampleModel3dConfig = {
    sceneConfig: {
      fog: { enable: false },
      ground: { enable: true, width: 1000, height: 1000, color: '#748FA5' }
    },
    cameraConfig: {
      fov: 45,
      position: { x: 0, y: 200, z: 500 },
      lookAt: { x: 0, y: 0, z: 0 }
    },
    controlConfig: {
      controlType: 'orbit',
      orbitConfig: { enabled: true }
    },
    environmentConfig: {
      type: 'sky'
    },
    lightConfig: {
      ambientLight: [{ enable: true, color: '#FFFFFF' }],
      directionalLight: [{ enable: true, color: '#FFFFFF', position: { x: 0, y: 300, z: 300 } }]
    },
    helperConfig: {
      gridConfig: { enable: true, size: 1000, divisions: 20 },
      axesConfig: { enable: true, size: 500 }
    }
  }

  let innerCode = `<Model3dLayout3d`
  if (props.meshConfig && meshConfig !== undefined) innerCode += `\n    meshConfig={${JSON.stringify(meshConfig)}}`
  if (props.isSprite) innerCode += `\n    isSprite`
  if (props.isFixd) innerCode += `\n    isFixd`
  if (props.layoutWidth) innerCode += `\n    layoutWidth={${layoutWidth}}`
  if (props.layoutHeight) innerCode += `\n    layoutHeight={${layoutHeight}}`
  if (props.cellKey) innerCode += `\n    cellKey="${props.cellKey}"`
  if (props.editMode) innerCode += `\n    editMode`
  if (props.className) innerCode += `\n    className="${props.className}"`
  innerCode += `\n    setMeshs={() => {}}`
  innerCode += `\n  >`
  innerCode += `\n    {/* 子组件内容 */}`
  innerCode += `\n  </Model3dLayout3d>`

  let code = `<Model3d\n  sceneConfig={${JSON.stringify(exampleModel3dConfig.sceneConfig)}}\n  cameraConfig={${JSON.stringify(exampleModel3dConfig.cameraConfig)}}\n  controlConfig={${JSON.stringify(exampleModel3dConfig.controlConfig)}}\n  environmentConfig={${JSON.stringify(exampleModel3dConfig.environmentConfig)}}\n  lightConfig={${JSON.stringify(exampleModel3dConfig.lightConfig)}}\n  helperConfig={${JSON.stringify(exampleModel3dConfig.helperConfig)}}\n>\n  ${innerCode}\n</Model3d>`

  return code
}

export const model3dLayout3dConfig: ComponentConfig = {
  id: 'model-3d-layout-3d',
  name: '三维布局',
  propsConfig: model3dLayout3dPropsConfig,
  defaultProps: model3dLayout3dDefaultProps,
  renderPreview: renderModel3dLayout3dPreview,
  renderCodePreview: renderModel3dLayout3dCodePreview
}