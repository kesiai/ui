import * as React from "react"
import * as THREE from "three"
import { useGLTF } from "@react-three/drei"

declare global {
  interface Window {
    model3d?: Record<string, THREE.Mesh>
    model3d_material?: Record<string, THREE.Material[]>
  }
}

export interface Model3dMeshProps {
  /** 网格配置 */
  meshConfig?: {
    visible?: boolean
    position?: { x?: number; y?: number; z?: number }
    scale?: { x?: number; y?: number; z?: number }
    rotation?: { x?: number; y?: number; z?: number }
    opacity?: number
    color?: string
  }
  /** 材质配置 */
  materialsConfig?: {
    materials?: any[]
  }
  /** 编辑模式 */
  editMode?: boolean
  /** 名称 */
  name?: string
  /** 点击回调 */
  onClick?: () => void
  /** 双击回调 */
  onDblClick?: () => void
  /** 鼠标移入回调 */
  onMouseEnter?: () => void
  /** 鼠标移出回调 */
  onMouseLeave?: () => void
  /** 模型源文件 */
  src?: {
    fileList: Array<{
      url: string
      name?: string
      type?: string
    }>
  }
  /** 自适应缩放 */
  adaptive?: boolean
  /** 高亮配置 */
  highlightConfig?: {
    enable?: boolean
    color?: string
  }
  /** 边缘线框配置 */
  edgeConfig?: {
    enable?: boolean
    color?: string
  }
  /** 动画配置 */
  animationConfig?: any
  /** 自定义动画配置 */
  customAnimationConfig?: any
  /** 点云热力图颜色 */
  pointConfig?: {
    hotColor?: boolean
  }
  /** 自动刷新间隔（秒） */
  update?: number
  /** 合并参数函数（占位） */
  mergeParams?: (name: string, path: string, value: any) => void
  /** 触发事件函数（占位） */
  doEvents?: (event: string) => void
  /** 切换选中单元函数（占位） */
  changeSelectCell?: (name: string) => void
}

// 获取文件后缀
const getSuffix = (url: string): string | null => {
  if (!url) return null
  const arr = url.split('.')
  return arr[arr.length - 1].toLowerCase()
}

// 主组件
const Model3dMesh: React.FC<Model3dMeshProps> = ({
  meshConfig = {},
  materialsConfig = {},
  editMode = false,
  name = "",
  onClick,
  onDblClick,
  onMouseEnter,
  onMouseLeave,
  src,
  adaptive = false,
  highlightConfig = {},
  edgeConfig = {},
  pointConfig = {},
  update,
  mergeParams,
  doEvents,
  changeSelectCell,
}) => {
  const { visible, position, scale, rotation, opacity, color } = meshConfig
  const { materials } = materialsConfig
  const { enable: highlightEnable, color: highlightColor = "red" } = highlightConfig
  const { enable: edgeEnable, color: edgeColor = "#FFFFFF" } = edgeConfig
  const { hotColor: pointHotColor } = pointConfig

  // 避免未使用参数警告
  if (mergeParams) {
    // 占位
  }
  if (doEvents) {
    // 占位
  }
  if (changeSelectCell) {
    // 占位
  }
  if (materials) {
    // 占位
  }
  if (opacity !== undefined) {
    // 占位
  }
  if (color) {
    // 占位
  }

  const [refreshKey, setRefreshKey] = React.useState(0)
  const groupRef = React.useRef<THREE.Group>(null)

  // 自动刷新逻辑
  React.useEffect(() => {
    if (!update || update <= 0) return
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1)
    }, update * 1000)
    return () => clearInterval(interval)
  }, [update])

  // 如果没有源文件，返回 null
  if (!src?.fileList?.length) {
    console.warn("Model3dMesh: No fileList provided")
    return null
  }

  // 选择第一个支持的文件（优先 gltf/glb）
  const supportedFormats = ['glb', 'gltf', 'obj', 'fbx', 'pcd']
  let selectedFile = src.fileList.find(file => {
    const suffix = getSuffix(file.url)
    return suffix && supportedFormats.includes(suffix)
  })
  if (!selectedFile) {
    selectedFile = src.fileList[0]
  }

  const suffix = getSuffix(selectedFile.url)
  const refreshUrl = refreshKey ? `${selectedFile.url}?refreshKey=${refreshKey}` : selectedFile.url

  let model: THREE.Object3D | null = null
  let animations: THREE.AnimationClip[] = []

  // 目前仅支持 GLTF/GLB 格式（使用 useGLTF）
  if (suffix === 'glb' || suffix === 'gltf') {
    try {
      const gltf = useGLTF(refreshUrl)
      model = gltf.scene
      animations = gltf.animations || []
    } catch (error) {
      console.error("Failed to load GLTF model:", error)
      return null
    }
  } else {
    // 其他格式暂不支持，显示占位符
    console.warn(`Model3dMesh: Format ${suffix} not yet supported, showing placeholder`)
    model = new THREE.Group()
    const box = new THREE.BoxGeometry(10, 10, 10)
    const mat = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
    const mesh = new THREE.Mesh(box, mat)
    model.add(mesh)
  }

  // 将模型和材质存储到全局对象（兼容原逻辑）
  React.useEffect(() => {
    if (model && groupRef.current) {
      if (!window.model3d) window.model3d = {}
      if (!window.model3d_material) window.model3d_material = {}
      // 查找第一个 Mesh
      let firstMesh: THREE.Mesh | null = null
      model.traverse((child) => {
        if (child instanceof THREE.Mesh && !firstMesh) {
          firstMesh = child
        }
      })
      if (firstMesh) {
        window.model3d[name] = firstMesh
      }
      // 收集材质
      const materialList: THREE.Material[] = []
      model.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          if (Array.isArray(child.material)) {
            materialList.push(...child.material)
          } else {
            materialList.push(child.material)
          }
        }
      })
      window.model3d_material[name] = materialList
    }
  }, [model, name])

  // 自适应缩放逻辑（简化）
  React.useEffect(() => {
    if (!adaptive || !model) return
    const box = new THREE.Box3().setFromObject(model)
    const size = box.getSize(new THREE.Vector3())
    const maxSide = Math.max(size.x, size.y, size.z)
    const scaleFactor = 300 / maxSide
    // 这里可以调用 mergeParams 更新 meshConfig，但暂时只记录
    console.log(`Adaptive scaling factor for ${name}: ${scaleFactor}`)
  }, [model, adaptive, name])

  // 高亮逻辑（简化）
  React.useEffect(() => {
    if (!model || !highlightEnable) return
    const highlightColorObj = new THREE.Color(highlightColor)
    model.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material]
        materials.forEach((mat) => {
          mat.color = highlightColorObj
        })
      }
    })
  }, [model, highlightEnable, highlightColor])

  // 边缘线框逻辑（简化）
  const edgesGeometry = React.useMemo(() => {
    if (!edgeEnable || !model) return null
    const edges: THREE.LineSegments[] = []
    model.traverse((child) => {
      if (child instanceof THREE.Mesh && child.geometry) {
        const edgesGeo = new THREE.EdgesGeometry(child.geometry)
        const edgesMat = new THREE.LineBasicMaterial({ color: edgeColor })
        const line = new THREE.LineSegments(edgesGeo, edgesMat)
        line.position.copy(child.position)
        line.rotation.copy(child.rotation)
        line.scale.copy(child.scale)
        edges.push(line)
      }
    })
    return edges
  }, [model, edgeEnable, edgeColor])

  // 点云热力图颜色逻辑（简化）
  React.useEffect(() => {
    if (!model || pointHotColor === undefined) return
    model.traverse((child) => {
      if (child instanceof THREE.Points && child.geometry) {
        const geometry = child.geometry
        const positions = geometry.attributes.position.array
        const colors = []
        for (let i = 0; i < positions.length; i += 3) {
          const y = positions[i + 2] // 假设 Y 轴是高度
          const color = new THREE.Color()
          color.setHSL((y + 1) / 2, 1, 0.5) // 简单映射
          colors.push(color.r, color.g, color.b)
        }
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
        if (child.material instanceof THREE.PointsMaterial) {
          child.material.vertexColors = true
        }
      }
    })
  }, [model, pointHotColor])

  // 事件处理
  const handleClick = (e: any) => {
    e.stopPropagation()
    onClick?.()
    if (editMode && changeSelectCell) {
      changeSelectCell(name)
    }
    if (!editMode && doEvents) {
      doEvents('click1')
    }
  }

  const handleDoubleClick = (e: any) => {
    e.stopPropagation()
    onDblClick?.()
    if (!editMode && doEvents) {
      doEvents('dbclick1')
    }
  }

  const handlePointerEnter = (e: any) => {
    e.stopPropagation()
    onMouseEnter?.()
    if (!editMode && doEvents) {
      doEvents('mouseover1')
    }
  }

  const handlePointerLeave = (e: any) => {
    e.stopPropagation()
    onMouseLeave?.()
    if (!editMode && doEvents) {
      doEvents('mouseleave1')
    }
  }

  // 组合属性
  const groupProps = {
    visible: visible,
    position: [position?.x || 0, position?.y || 0, position?.z || 0] as [number, number, number],
    scale: [scale?.x || 1, scale?.y || 1, scale?.z || 1] as [number, number, number],
    rotation: [
      THREE.MathUtils.degToRad(rotation?.x || 0),
      THREE.MathUtils.degToRad(rotation?.y || 0),
      THREE.MathUtils.degToRad(rotation?.z || 0),
    ] as [number, number, number],
    onClick: handleClick,
    onDoubleClick: handleDoubleClick,
    onPointerEnter: handlePointerEnter,
    onPointerLeave: handlePointerLeave,
    castShadow: true,
    receiveShadow: true,
  }

  return (
    <group ref={groupRef} name={name} {...groupProps}>
      <primitive object={model} />
      {edgesGeometry &&
        edgesGeometry.map((edge, idx) => (
          <primitive key={idx} object={edge} />
        ))}
    </group>
  )
}

Model3dMesh.displayName = "Model3dMesh"

export { Model3dMesh }