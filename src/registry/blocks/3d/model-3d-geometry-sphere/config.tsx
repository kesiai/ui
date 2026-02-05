import { Model3dGeometrySphere } from '@/registry/blocks/3d/model-3d-geometry-sphere/model-3d-geometry-sphere'
import { Model3d } from '@/registry/blocks/3d/model-3d/model-3d'
import { ComponentConfig } from '@/app/config/types'

// 默认配置
const defaultModel3dGeometrySphereProps = {
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
  args: [100, 32, 32]
}

export const model3dGeometrySpherePropsConfig = [
  {
    name: 'meshConfig',
    label: '网格配置',
    type: 'text' as const,
    default: JSON.stringify(defaultModel3dGeometrySphereProps.meshConfig)
  },
  {
    name: 'materialsConfig',
    label: '材质配置',
    type: 'text' as const,
    default: JSON.stringify(defaultModel3dGeometrySphereProps.materialsConfig)
  },
  {
    name: 'editMode',
    label: '编辑模式',
    type: 'boolean' as const,
    default: defaultModel3dGeometrySphereProps.editMode
  },
  {
    name: 'name',
    label: '名称',
    type: 'text' as const,
    default: defaultModel3dGeometrySphereProps.name,
    placeholder: '请输入几何体名称'
  },
  {
    name: 'args',
    label: '尺寸参数',
    type: 'text' as const,
    default: JSON.stringify(defaultModel3dGeometrySphereProps.args),
    description: '参数格式: [半径, 宽度分段, 高度分段]'
  }
]

export const model3dGeometrySphereDefaultProps = {
  meshConfig: JSON.stringify(defaultModel3dGeometrySphereProps.meshConfig),
  materialsConfig: JSON.stringify(defaultModel3dGeometrySphereProps.materialsConfig),
  editMode: defaultModel3dGeometrySphereProps.editMode,
  name: defaultModel3dGeometrySphereProps.name,
  args: JSON.stringify(defaultModel3dGeometrySphereProps.args)
}

const renderModel3dGeometrySpherePreview = (props: Record<string, any>) => {
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
            <Model3dGeometrySphere
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

const renderModel3dGeometrySphereCodePreview = (props: Record<string, any>) => {
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

  let innerCode = `<Model3dGeometrySphere`
  if (props.meshConfig && meshConfig !== undefined) innerCode += `\n    meshConfig={${JSON.stringify(meshConfig)}}`
  if (props.materialsConfig && materialsConfig !== undefined) innerCode += `\n    materialsConfig={${JSON.stringify(materialsConfig)}}`
  if (props.editMode) innerCode += `\n    editMode`
  if (props.name) innerCode += `\n    name="${props.name}"`
  if (props.args && args !== undefined) innerCode += `\n    args={${JSON.stringify(args)}}`
  innerCode += `\n  />`

  let code = `<Model3d\n  sceneConfig={${JSON.stringify(exampleModel3dConfig.sceneConfig)}}\n  cameraConfig={${JSON.stringify(exampleModel3dConfig.cameraConfig)}}\n  controlConfig={${JSON.stringify(exampleModel3dConfig.controlConfig)}}\n  environmentConfig={${JSON.stringify(exampleModel3dConfig.environmentConfig)}}\n  lightConfig={${JSON.stringify(exampleModel3dConfig.lightConfig)}}\n  helperConfig={${JSON.stringify(exampleModel3dConfig.helperConfig)}}\n>\n  ${innerCode}\n</Model3d>`

  return code
}

export const model3dGeometrySphereConfig: ComponentConfig = {
  id: 'model-3d-geometry-sphere',
  name: 'Model3dGeometrySphere 球体',
  propsConfig: model3dGeometrySpherePropsConfig,
  defaultProps: model3dGeometrySphereDefaultProps,
  renderPreview: renderModel3dGeometrySpherePreview,
  renderCodePreview: renderModel3dGeometrySphereCodePreview
}