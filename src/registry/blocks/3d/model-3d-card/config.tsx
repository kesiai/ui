import { Model3dCard } from '@/registry/blocks/3d/model-3d-card/model-3d-card'
import { Model3d } from '@/registry/blocks/3d/model-3d/model-3d'
import { ComponentConfig } from '@/app/config/types'

// 默认配置
const defaultModel3dCardProps = {
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
  cardConfig: {
    cardWidth: '200px',
    lineWidth: '100px',
    lineHeight: '100px'
  },
  dataConfig: {
    lineCount: 1,
    dataList: [
      { label: '标签1', value: '值1' },
      { label: '标签2', value: '值2' }
    ]
  },
  cellKey: '',
  editMode: false,
  className: ''
}

export const model3dCardPropsConfig = [
  {
    name: 'meshConfig',
    label: '网格配置',
    type: 'text' as const,
    default: JSON.stringify(defaultModel3dCardProps.meshConfig)
  },
  {
    name: 'isSprite',
    label: '精灵图模式',
    type: 'boolean' as const,
    default: defaultModel3dCardProps.isSprite
  },
  {
    name: 'isFixd',
    label: '固定位置',
    type: 'boolean' as const,
    default: defaultModel3dCardProps.isFixd
  },
  {
    name: 'cardConfig',
    label: '卡片配置',
    type: 'text' as const,
    default: JSON.stringify(defaultModel3dCardProps.cardConfig)
  },
  {
    name: 'dataConfig',
    label: '数据配置',
    type: 'text' as const,
    default: JSON.stringify(defaultModel3dCardProps.dataConfig)
  },
  {
    name: 'cellKey',
    label: '单元格键',
    type: 'text' as const,
    default: defaultModel3dCardProps.cellKey,
    placeholder: '请输入单元格键'
  },
  {
    name: 'editMode',
    label: '编辑模式',
    type: 'boolean' as const,
    default: defaultModel3dCardProps.editMode
  },
  {
    name: 'className',
    label: 'CSS类名',
    type: 'text' as const,
    default: defaultModel3dCardProps.className,
    placeholder: '请输入CSS类名'
  }
]

export const model3dCardDefaultProps = {
  meshConfig: JSON.stringify(defaultModel3dCardProps.meshConfig),
  isSprite: defaultModel3dCardProps.isSprite,
  isFixd: defaultModel3dCardProps.isFixd,
  cardConfig: JSON.stringify(defaultModel3dCardProps.cardConfig),
  dataConfig: JSON.stringify(defaultModel3dCardProps.dataConfig),
  cellKey: defaultModel3dCardProps.cellKey,
  editMode: defaultModel3dCardProps.editMode,
  className: defaultModel3dCardProps.className
}

const renderModel3dCardPreview = (props: Record<string, any>) => {
  // 解析 JSON 配置，解析失败返回 undefined
  const parseJson = (str: string) => {
    try {
      return JSON.parse(str)
    } catch {
      return undefined
    }
  }

  const meshConfig = parseJson(props.meshConfig)
  const cardConfig = parseJson(props.cardConfig)
  const dataConfig = parseJson(props.dataConfig)

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
            <Model3dCard
              meshConfig={meshConfig}
              isSprite={props.isSprite}
              isFixd={props.isFixd}
              cardConfig={cardConfig}
              dataConfig={dataConfig}
              cellKey={props.cellKey}
              editMode={props.editMode}
              className={props.className}
            />
          </Model3d>
        </div>
      </div>
    </div>
  )
}

const renderModel3dCardCodePreview = (props: Record<string, any>) => {
  const parseJson = (str: string) => {
    try {
      return JSON.parse(str)
    } catch {
      return undefined
    }
  }

  const meshConfig = parseJson(props.meshConfig)
  const cardConfig = parseJson(props.cardConfig)
  const dataConfig = parseJson(props.dataConfig)

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

  let innerCode = `<Model3dCard`
  if (props.meshConfig && meshConfig !== undefined) innerCode += `\n    meshConfig={${JSON.stringify(meshConfig)}}`
  if (props.isSprite) innerCode += `\n    isSprite`
  if (props.isFixd) innerCode += `\n    isFixd`
  if (props.cardConfig && cardConfig !== undefined) innerCode += `\n    cardConfig={${JSON.stringify(cardConfig)}}`
  if (props.dataConfig && dataConfig !== undefined) innerCode += `\n    dataConfig={${JSON.stringify(dataConfig)}}`
  if (props.cellKey) innerCode += `\n    cellKey="${props.cellKey}"`
  if (props.editMode) innerCode += `\n    editMode`
  if (props.className) innerCode += `\n    className="${props.className}"`
  innerCode += `\n  />`

  let code = `<Model3d\n  sceneConfig={${JSON.stringify(exampleModel3dConfig.sceneConfig)}}\n  cameraConfig={${JSON.stringify(exampleModel3dConfig.cameraConfig)}}\n  controlConfig={${JSON.stringify(exampleModel3dConfig.controlConfig)}}\n  environmentConfig={${JSON.stringify(exampleModel3dConfig.environmentConfig)}}\n  lightConfig={${JSON.stringify(exampleModel3dConfig.lightConfig)}}\n  helperConfig={${JSON.stringify(exampleModel3dConfig.helperConfig)}}\n>\n  ${innerCode}\n</Model3d>`

  return code
}

export const model3dCardConfig: ComponentConfig = {
  id: 'model-3d-card',
  name: 'Model3dCard 3D卡片',
  propsConfig: model3dCardPropsConfig,
  defaultProps: model3dCardDefaultProps,
  renderPreview: renderModel3dCardPreview,
  renderCodePreview: renderModel3dCardCodePreview
}