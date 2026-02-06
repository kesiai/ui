import { Model3dGeometryTube } from '@/registry/blocks/3d/model-3d-geometry-tube/model-3d-geometry-tube'
import { Model3d } from '@/registry/blocks/3d/model-3d/model-3d'
import { ComponentConfig } from '@/app/config/types'

// 默认配置
const defaultModel3dGeometryTubeProps = {
  meshConfig: {
    visible: true,
    position: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    rotation: { x: 0, y: 0, z: 0 },
    opacity: 1,
    color: '#FFFFFF'
  },
  materialsConfig: {
    materials: []
  },
  editMode: false,
  name: '',
  onClick: undefined,
  args: [] // 曲线参数复杂，留空让组件使用默认值
}

export const model3dGeometryTubePropsConfig = [
  {
    name: 'meshConfig',
    label: '网格配置',
    type: 'text' as const,
    default: JSON.stringify(defaultModel3dGeometryTubeProps.meshConfig)
  },
  {
    name: 'materialsConfig',
    label: '材质配置',
    type: 'text' as const,
    default: JSON.stringify(defaultModel3dGeometryTubeProps.materialsConfig)
  },
  {
    name: 'editMode',
    label: '编辑模式',
    type: 'boolean' as const,
    default: defaultModel3dGeometryTubeProps.editMode
  },
  {
    name: 'name',
    label: '名称',
    type: 'text' as const,
    default: defaultModel3dGeometryTubeProps.name,
    placeholder: '请输入几何体名称'
  },
  {
    name: 'args',
    label: '曲线参数',
    type: 'text' as const,
    default: JSON.stringify(defaultModel3dGeometryTubeProps.args),
    description: '参数格式: [曲线, 管状分段, 半径, 径向分段, 是否闭合]。留空使用默认正弦曲线。'
  }
]

export const model3dGeometryTubeDefaultProps = {
  meshConfig: JSON.stringify(defaultModel3dGeometryTubeProps.meshConfig),
  materialsConfig: JSON.stringify(defaultModel3dGeometryTubeProps.materialsConfig),
  editMode: defaultModel3dGeometryTubeProps.editMode,
  name: defaultModel3dGeometryTubeProps.name,
  args: JSON.stringify(defaultModel3dGeometryTubeProps.args)
}

const renderModel3dGeometryTubePreview = (props: Record<string, any>) => {
  // 解析 JSON 配置，解析失败返回 undefined
  const parseJson = (str: string) => {
    try {
      return JSON.parse(str)
    } catch {
      return undefined
    }
  }

  const meshConfig = parseJson(props.meshConfig)
  const materialsConfig = parseJson(props.materialsConfig)
  const args = parseJson(props.args)

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
            <Model3dGeometryTube
              meshConfig={meshConfig}
              materialsConfig={materialsConfig}
              editMode={props.editMode}
              name={props.name}
              args={args}
            />
          </Model3d>
        </div>
      </div>
    </div>
  )
}

const renderModel3dGeometryTubeCodePreview = (props: Record<string, any>) => {
  const parseJson = (str: string) => {
    try {
      return JSON.parse(str)
    } catch {
      return undefined
    }
  }

  const meshConfig = parseJson(props.meshConfig)
  const materialsConfig = parseJson(props.materialsConfig)
  const args = parseJson(props.args)

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

  let innerCode = `<Model3dGeometryTube`
  if (props.meshConfig && meshConfig !== undefined) innerCode += `\n    meshConfig={${JSON.stringify(meshConfig)}}`
  if (props.materialsConfig && materialsConfig !== undefined) innerCode += `\n    materialsConfig={${JSON.stringify(materialsConfig)}}`
  if (props.editMode) innerCode += `\n    editMode`
  if (props.name) innerCode += `\n    name="${props.name}"`
  if (props.args && args !== undefined && args.length > 0) innerCode += `\n    args={${JSON.stringify(args)}}`
  innerCode += `\n  />`

  let code = `<Model3d\n  sceneConfig={${JSON.stringify(exampleModel3dConfig.sceneConfig)}}\n  cameraConfig={${JSON.stringify(exampleModel3dConfig.cameraConfig)}}\n  controlConfig={${JSON.stringify(exampleModel3dConfig.controlConfig)}}\n  environmentConfig={${JSON.stringify(exampleModel3dConfig.environmentConfig)}}\n  lightConfig={${JSON.stringify(exampleModel3dConfig.lightConfig)}}\n  helperConfig={${JSON.stringify(exampleModel3dConfig.helperConfig)}}\n>\n  ${innerCode}\n</Model3d>`

  return code
}

export const model3dGeometryTubeConfig: ComponentConfig = {
  id: 'model-3d-geometry-tube',
  name: 'Model3dGeometryTube 管状体',
  propsConfig: model3dGeometryTubePropsConfig,
  defaultProps: model3dGeometryTubeDefaultProps,
  renderPreview: renderModel3dGeometryTubePreview,
  renderCodePreview: renderModel3dGeometryTubeCodePreview
}