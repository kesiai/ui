import * as React from "react"
import { Canvas, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { OrbitControls, Environment, PerspectiveCamera, TransformControls, PointerLockControls, FlyControls, useProgress } from "@react-three/drei"
import { suspend } from 'suspend-react'
import { cn } from "@/lib/utils"
import { Suspense } from "react"

// 默认配置，基于 ../3d/src/Space/initParam.js
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
    position: { x: 0, y: 200, z: 500 }, // 修正 cameraPositon -> position
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
  loadingConfig: {},
  script: '',
  onFreeze: undefined
}

export interface Model3dProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 场景配置 */
  sceneConfig?: any
  /** 相机配置 */
  cameraConfig?: any
  /** 控制配置 */
  controlConfig?: any
  /** 环境配置 */
  environmentConfig?: any
  /** 光照配置 */
  lightConfig?: any
  /** 辅助器配置 */
  helperConfig?: any
  /** 子组件 */
  children?: React.ReactNode
}

// 获取元素宽高比
const getAspect = (dom: HTMLElement | null) => {
  if (!dom) return 1
  const { offsetWidth, offsetHeight } = dom
  const aspect = offsetWidth / offsetHeight || 1
  return aspect
}

// 调整 Canvas 大小的组件
const ResizeCanvas = () => {
  const { gl } = useThree()

  React.useEffect(() => {
    const wrap3dElement = document.querySelector('.model-3d-container')
    if (!wrap3dElement) return

    const resize = () => {
      const computedStyle = window.getComputedStyle(wrap3dElement)
      const transform = computedStyle.transform
      const scaleMatch = transform?.match(/scale\((.*?)\)/)
      const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1
      const width = (wrap3dElement as HTMLElement).offsetWidth * scale
      const height = (wrap3dElement as HTMLElement).offsetHeight * scale
      gl.setSize(width, height)
    }

    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(wrap3dElement)

    return () => {
      resizeObserver.disconnect()
    }
  }, [gl])

  return null
}

const useBackground = (background: any, backgroundImage: any, environmentConfig: any) => {
  const { imageType, panorama, posX, negX, posY, negY, posZ, negZ } = backgroundImage || {}
  const { scene } = useThree()

  React.useEffect(() => {
    if (imageType === 'panorama' && panorama) {
      const textureLoader = new THREE.TextureLoader()
      textureLoader.load(panorama, (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping
        scene.background = texture
        scene.environment = texture
      })
    } else if (imageType === 'cube' && posX && negX && posY && negY && posZ && negZ) {
      scene.background = new THREE.CubeTextureLoader().load([posX, negX, posY, negY, posZ, negZ])
      scene.environment = new THREE.CubeTextureLoader().load([posX, negX, posY, negY, posZ, negZ])
    } else {
      scene.background = background ? new THREE.Color(background) : null
      if (!environmentConfig?.type) {
        scene.environment = null
      }
    }
  }, [scene, background, backgroundImage, environmentConfig])
}

const Ground = ({ ground }: any) => {
  const { materialType = 'MeshBasicMaterial', width = 100, height = 100, color = '#AAAAAA' } = ground || {}

  return (
    <>
      {ground?.enable ? (
        <mesh name='$nativeGround' receiveShadow castShadow rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[width, height]} />
          <meshPhongMaterial color={color} side={THREE.DoubleSide} />
        </mesh>
      ) : null}
    </>
  )
}

// 场景组件
const Scene = (props: any) => {
  const { sceneConfig, environmentConfig } = props
  const { background, backgroundImage, fog, ground } = sceneConfig || {}
  const { color = '#FFFFFF', near = 1, far = 10000 } = fog || {}

  useBackground(background, backgroundImage, environmentConfig)

  return (
    <>
      {fog && fog.enable && <fog attach='fog' args={[color, near, far]} />}
      <Ground ground={ground} />
    </>
  )
}

// 相机组件
const Camera = ({ cameraConfig, aspect }: any) => {
  const { fov = 45, near = 1, far = 10000, position: cameraPositon = { x: 0, y: 200, z: 500 }, lookAt: cameraLookAt = { x: 0, y: 0, z: 0 } } = cameraConfig || {}

  // 简化：移除 store hooks 和 spring 动画，直接使用位置
  const position: [number, number, number] = [cameraPositon.x, cameraPositon.y, cameraPositon.z]

  return (
    <PerspectiveCamera
      makeDefault
      fov={fov}
      near={near}
      far={far}
      aspect={aspect}
      position={position}
    />
  )
}

const setCamera = (shadow: any) => {
  shadow.camera.near = 0.5
  shadow.camera.far = 5000
  shadow.camera.top = 1000
  shadow.camera.bottom = -2000
  shadow.camera.right = 1000
  shadow.camera.left = -2000
  shadow.mapSize.width = 2800
  shadow.mapSize.height = 2800
}

const SpotLightComp = (props: any) => {
  const { helper, color = 0xffffff, intensity = 1, distance = 0, angle = Math.PI / 3, penumbra = 0, decay = 1, castShadow = false, position = { x: 0, y: 0, z: 0 }, target = { x: 0, y: 0, z: 0 } } = props

  const ref = React.useRef<any>(null)

  React.useEffect(() => {
    if (ref.current?.shadow.camera) {
      const shadow = ref.current?.shadow
      setCamera(shadow)
    }
  }, [])

  return <>
    <spotLight ref={ref} visible={true} color={color} intensity={intensity} distance={distance} angle={angle} penumbra={penumbra} decay={decay} castShadow={castShadow} position={[position.x, position.y, position.z]}>
      {helper ? <Helper type={THREE.SpotLightHelper} args={['black']} /> : null}
    </spotLight>
    {ref?.current?.target ? <primitive object={ref?.current?.target} position={[target?.x, target?.y, target?.z]} /> : null}
  </>
}

const DirectionalLightComp = (props: any) => {
  const { helper, color = 0xffffff, intensity = 1, castShadow = false, position = { x: 0, y: 0, z: 0 }, target = { x: 0, y: 0, z: 0 } } = props

  const ref = React.useRef<any>(null)

  React.useEffect(() => {
    if (ref.current?.shadow.camera) {
      const shadow = ref.current?.shadow
      setCamera(shadow)
    }
  }, [])

  return <>
    <directionalLight ref={ref} visible={true} color={color} intensity={intensity} position={[position.x, position.y, position.z]} castShadow={castShadow}>
      {helper ? <Helper type={THREE.DirectionalLightHelper} args={[50, 'black']} /> : null}
    </directionalLight>
    {ref?.current?.target ? <primitive object={ref?.current?.target} position={[target?.x, target?.y, target?.z]} /> : null}
  </>
}

// 灯光组件
const Lights = ({ lightConfig }: any) => {
  const { ambientLight, directionalLight, hemisphereLight, pointLight, rectAreaLight, spotLight } = lightConfig || {}
  return (
    <>
      {ambientLight && ambientLight.length && (
        ambientLight.filter((item: any) => item.enable).map((item: any) => {
          const { color = 0xffffff, intensity = 1 } = item
          return <ambientLight key={`ambient-${color}`} color={color} intensity={intensity} />
        })
      )}
      {directionalLight && directionalLight.length && (
        directionalLight.filter((item: any) => item.enable).map((item: any) => (
          <DirectionalLightComp key={`directional-${item.color}`} {...item} />
        ))
      )}
      {hemisphereLight && hemisphereLight.length && (
        hemisphereLight.filter((item: any) => item.enable).map((item: any) => {
          const { skyColor = 0xffffff, groundColor = 0xffffff, intensity = 1, position = { x: 0, y: 0, z: 0 } } = item
          return <hemisphereLight key={`hemisphere-${skyColor}`} color={skyColor} groundColor={groundColor} intensity={intensity} position={[position.x, position.y, position.z]} />
        })
      )}
      {pointLight && pointLight.length && (
        pointLight.filter((item: any) => item.enable).map((item: any) => {
          const { color = 0xffffff, intensity = 1, distance = 0, decay = 1, castShadow = false, position = { x: 0, y: 0, z: 0 } } = item
          return <pointLight key={`point-${color}`} color={color} intensity={intensity} distance={distance} decay={decay} castShadow={castShadow} position={[position.x, position.y, position.z]} />
        })
      )}
      {spotLight && spotLight.length && (
        spotLight.filter((item: any) => item.enable).map((item: any) => (
          <SpotLightComp key={`spot-${item.color}`} {...item} />
        ))
      )}
    </>
  )
}

const GridHelper = ({ gridConfig = {} }: any) => {
  const { enable, size = 10, divisions = 10, colorCenterLine = 0x444444, colorGrid = 0x888888 } = gridConfig || {}
  return (
    <>
      {enable && <gridHelper args={[size, divisions, colorCenterLine, colorGrid]} />}
    </>
  )
}

const AxesHelper = ({ axesConfig = {} }: any) => {
  const { enable, size = 1 } = axesConfig || {}
  return (
    <>
      {enable && <axesHelper args={[size]} />}
    </>
  )
}

// 辅助器组件
const Helper = (props: any) => {
  const { helperConfig } = props
  const { gridConfig = {}, axesConfig = {} } = helperConfig || {}

  return (
    <>
      <GridHelper gridConfig={gridConfig} />
      <AxesHelper axesConfig={axesConfig} />
    </>
  )
}

// Create a mapping of all available environment types
const environmentMap: Record<string, () => Promise<any>> = {
  'apartment': () => import('@pmndrs/assets/hdri/apartment.exr'),
  'bridge': () => import('@pmndrs/assets/hdri/bridge.exr'),
  'city': () => import('@pmndrs/assets/hdri/city.exr'),
  'dawn': () => import('@pmndrs/assets/hdri/dawn.exr'),
  'esplanade': () => import('@pmndrs/assets/hdri/esplanade.exr'),
  'forest': () => import('@pmndrs/assets/hdri/forest.exr'),
  'hall': () => import('@pmndrs/assets/hdri/hall.exr'),
  'lab': () => import('@pmndrs/assets/hdri/lab.exr'),
  'lobby': () => import('@pmndrs/assets/hdri/lobby.exr'),
  'night': () => import('@pmndrs/assets/hdri/night.exr'),
  'park': () => import('@pmndrs/assets/hdri/park.exr'),
  'sky': () => import('@pmndrs/assets/hdri/sky.exr'),
  'studio': () => import('@pmndrs/assets/hdri/studio.exr'),
  'sunrise': () => import('@pmndrs/assets/hdri/sunrise.exr'),
  'sunset': () => import('@pmndrs/assets/hdri/sunset.exr'),
  'venice': () => import('@pmndrs/assets/hdri/venice.exr'),
  'warehouse': () => import('@pmndrs/assets/hdri/warehouse.exr'),
  'workshop': () => import('@pmndrs/assets/hdri/workshop.exr')
}

const Environment3D = (props: any) => {
  const { environmentConfig } = props

  const data = suspend(async () => {
    if (environmentConfig?.type && environmentMap[environmentConfig.type]) {
      const module = await environmentMap[environmentConfig.type]()
      return module.default
    }
    return null
  }, [environmentConfig?.type])

  return data ? <Environment files={data} /> : null
}

// 控制组件
const Controls = (props: any) => {
  const { controlConfig } = props
  const { controlType, orbitConfig, pointerLockConfig, flyConfig } = controlConfig || {}

  const orbitRef = React.useRef<any>(null)
  const transRef = React.useRef<any>(null)

  const { scene, camera } = useThree((state) => state)

  // 简化：移除 store hooks 和 transform 逻辑

  return (
    <>
      {/* 简化：不渲染 TransformControls，因为 editMode 默认为 false */}
      <OrbitControls
        ref={orbitRef}
        makeDefault
        camera={camera}
        {...orbitConfig}
        enabled={orbitConfig?.enabled && controlType === 'orbit'}
        onEnd={() => {}}
      />
      {pointerLockConfig?.enabled && controlType === 'pointerLock' && (
        <PointerLockControls
          makeDefault
          camera={camera}
          {...pointerLockConfig}
        />
      )}
      {flyConfig?.enabled && controlType === 'fly' && (
        <FlyControls
          makeDefault
          camera={camera}
          {...flyConfig}
        />
      )}
    </>
  )
}

// 加载组件
const Loading = (props: any) => {
  const { loadingConfig, script } = props
  const { img, width, height, backgroundColor } = loadingConfig || {}

  const { progress } = useProgress()

  const style = {
    spin: {
      position: 'absolute' as const,
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: backgroundColor || 'transparent',
      pointerEvents: 'none' as const
    },
    loading: {
      background: img ? `url(${img})` : undefined,
      backgroundRepeat: 'no-repeat' as const,
      backgroundSize: 'contain' as const,
      width: width || '100px',
      height: height || '100px'
    }
  }

  // 简化：移除 script 事件

  return (
    <div style={style.spin}>
      {img ? (
        <div style={style.loading} />
      ) : (
        <div className="text-white">加载 3D 场景... {Math.round(progress)}%</div>
      )}
    </div>
  )
}

const Model3d = React.forwardRef<HTMLDivElement, Model3dProps>(
  (
    {
      className,
      sceneConfig = defaultModel3dProps.sceneConfig,
      cameraConfig = defaultModel3dProps.cameraConfig,
      controlConfig = defaultModel3dProps.controlConfig,
      environmentConfig = defaultModel3dProps.environmentConfig,
      lightConfig = defaultModel3dProps.lightConfig,
      helperConfig = defaultModel3dProps.helperConfig,
      children,
      ...props
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const [aspect, setAspect] = React.useState(1)

    React.useEffect(() => {
      if (containerRef.current) {
        const newAspect = getAspect(containerRef.current)
        setAspect(newAspect)
      }
    }, [])

    const onCreated = ({ gl }: any) => {
      gl.shadowMap.enabled = true
      gl.shadowMap.type = THREE.PCFSoftShadowMap
    }

    return (
      <div
        ref={ref}
        className={cn("model-3d-container w-full h-full relative", className)}
        {...props}
      >
        <div
          ref={containerRef}
          className="w-full h-full"
          style={{ position: 'relative' }}
        >
          <Suspense fallback={<Loading loadingConfig={{}} script="" />}>
            <Canvas
              frameloop="always"
              onCreated={onCreated}
              shadows
              flat
              gl={{
                outputColorSpace: THREE.LinearSRGBColorSpace,
                preserveDrawingBuffer: true
              }}
            >
              <ResizeCanvas />
              <Lights lightConfig={lightConfig} />
              <Scene sceneConfig={sceneConfig} environmentConfig={environmentConfig} />
              <Camera cameraConfig={cameraConfig} aspect={aspect} />
              <Environment3D environmentConfig={environmentConfig} />
              <Controls controlConfig={controlConfig} editMode={false} />
              <Helper helperConfig={helperConfig} />
              {/* 渲染子组件（3D 对象） */}
              {children}
            </Canvas>
          </Suspense>
        </div>
      </div>
    )
  }
)

Model3d.displayName = "Model3d"

export { Model3d }