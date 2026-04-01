import { Model3d } from '@/registry/components/model-3d/model-3d'
import { ComponentConfig } from '@/app/config/types'

// 默认配置，基于 ../3d/src/Space/initParam.js（简化版）
const defaultModel3dProps = {
  variables: [],
  meshes: [],
  sceneConfig: {
    fog: {
      enable: false,
      near: 1,
      far: 10000,
      color: '#FFFFFF'
    },
    ground: {
      enable: true,
      width: 1000,
      height: 1000,
      color: '#748FA5'
    }
  },
  cameraConfig: {
    fov: 45,
    near: 1,
    far: 10000,
    position: { x: 0, y: 200, z: 500 },
    lookAt: { x: 0, y: 0, z: 0 }
  },
  controlConfig: {
    controlType: 'orbit',
    orbitConfig: {
      enabled: true,
      enableRotate: true,
      rotateSpeed: 1,
      maxPolarAngle: 3.14,
      minPolarAngle: 0,
      enableZoom: true,
      zoomSpeed: 1,
      minDistance: 0,
      enablePan: true,
      panSpeed: 1,
      enableDamping: false,
      dampingFactor: 0.05,
      autoRotate: false,
      autoRotateSpeed: 2
    },
    pointerLockConfig: {
      enabled: true,
      eyeHeight: 170,
      moveSpeed: 1000,
      fallSpeed: 100,
      jumpHeight: 100
    },
    flyConfig: {
      enabled: true
    }
  },
  snapshotConfig: {
    showBar: true
  },
  environmentConfig: {
    type: 'sky'
  },
  renderConfig: {
    outputEncoding: 'sRGBEncoding'
  },
  lightConfig: {
    ambientLight: [
      {
        enable: true,
        color: '#FFFFFF'
      }
    ],
    directionalLight: [
      {
        enable: true,
        color: '#FFFFFF',
        castShadow: true,
        position: {
          x: 0,
          y: 300,
          z: 300
        }
      }
    ]
  },
  helperConfig: {
    gridConfig: {
      enable: true,
      size: 1000,
      divisions: 20,
      colorCenterLine: '#FFFFFF',
      colorGrid: '#FFFFFF'
    },
    axesConfig: {
      enable: true,
      size: 500
    }
  },
  composerConfig: {
    unrealBloom: { enable: false }
  },
  loadingConfig: {}
}

export const model3dPropsConfig = [
  {
    name: 'sceneConfig',
    label: '场景配置',
    type: 'text' as const,
    default: JSON.stringify(defaultModel3dProps.sceneConfig)
  },
  {
    name: 'cameraConfig',
    label: '相机配置',
    type: 'text' as const,
    default: JSON.stringify(defaultModel3dProps.cameraConfig)
  },
  {
    name: 'controlConfig',
    label: '控制配置',
    type: 'text' as const,
    default: JSON.stringify(defaultModel3dProps.controlConfig)
  },
  {
    name: 'environmentConfig',
    label: '环境配置',
    type: 'text' as const,
    default: JSON.stringify(defaultModel3dProps.environmentConfig)
  },
  {
    name: 'lightConfig',
    label: '光照配置',
    type: 'text' as const,
    default: JSON.stringify(defaultModel3dProps.lightConfig)
  },
  {
    name: 'helperConfig',
    label: '辅助器配置',
    type: 'text' as const,
    default: JSON.stringify(defaultModel3dProps.helperConfig)
  }
]

export const model3dDefaultProps = {
  sceneConfig: JSON.stringify(defaultModel3dProps.sceneConfig),
  cameraConfig: JSON.stringify(defaultModel3dProps.cameraConfig),
  controlConfig: JSON.stringify(defaultModel3dProps.controlConfig),
  environmentConfig: JSON.stringify(defaultModel3dProps.environmentConfig),
  lightConfig: JSON.stringify(defaultModel3dProps.lightConfig),
  helperConfig: JSON.stringify(defaultModel3dProps.helperConfig)
}

const renderModel3dPreview = (props: Record<string, any>) => {
  // 解析 JSON 配置，解析失败返回 undefined
  const parseJson = (str: string) => {
    try {
      return JSON.parse(str)
    } catch {
      return undefined
    }
  }

  const sceneConfig = parseJson(props.sceneConfig)
  const cameraConfig = parseJson(props.cameraConfig)
  const controlConfig = parseJson(props.controlConfig)
  const environmentConfig = parseJson(props.environmentConfig)
  const lightConfig = parseJson(props.lightConfig)
  const helperConfig = parseJson(props.helperConfig)

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full h-96 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center p-4">
          <Model3d
            sceneConfig={sceneConfig}
            cameraConfig={cameraConfig}
            controlConfig={controlConfig}
            environmentConfig={environmentConfig}
            lightConfig={lightConfig}
            helperConfig={helperConfig}
          >
          </Model3d>
        </div>
      </div>
    </div>
  )
}

const renderModel3dCodePreview = (props: Record<string, any>) => {
  const parseJson = (str: string) => {
    try {
      return JSON.parse(str)
    } catch {
      return undefined
    }
  }

  const sceneConfig = parseJson(props.sceneConfig)
  const cameraConfig = parseJson(props.cameraConfig)
  const controlConfig = parseJson(props.controlConfig)
  const environmentConfig = parseJson(props.environmentConfig)
  const lightConfig = parseJson(props.lightConfig)
  const helperConfig = parseJson(props.helperConfig)

  let code = `<Model3d`
  if (props.script) code += `\n  script="${props.script}"`
  code += `\n  sceneConfig={${JSON.stringify(sceneConfig)}}`
  code += `\n  cameraConfig={${JSON.stringify(cameraConfig)}}`
  code += `\n  controlConfig={${JSON.stringify(controlConfig)}}`
  code += `\n  environmentConfig={${JSON.stringify(environmentConfig)}}`
  code += `\n  lightConfig={${JSON.stringify(lightConfig)}}`
  code += `\n  helperConfig={${JSON.stringify(helperConfig)}}`
  code += `\n>`
  code += `\n  {/* 子组件 */}`
  code += `\n</Model3d>`

  return code
}

export const model3dConfig: ComponentConfig = {
  id: 'model-3d',
  name: '三维空间容器',
  propsConfig: model3dPropsConfig,
  defaultProps: model3dDefaultProps,
  renderPreview: renderModel3dPreview,
  renderCodePreview: renderModel3dCodePreview,
}