import * as React from "react"
import * as THREE from "three"
import { Tube } from "@react-three/drei"

declare global {
  interface Window {
    model3d?: Record<string, THREE.Mesh>
    model3d_material?: Record<string, THREE.Material[]>
  }
}

class CustomSinCurve extends THREE.Curve<THREE.Vector3> {
  scale: number

  constructor(scale = 1) {
    super()
    this.scale = scale
  }

  getPoint(t: number, optionalTarget = new THREE.Vector3()) {
    const tx = t * 3 - 1.5
    const ty = t
    const tz = 0
    return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale)
  }
}

export interface Model3dGeometryTubeProps {
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
  /** 曲线参数 [曲线, 管状分段, 半径, 径向分段, 是否闭合] */
  args?: [THREE.Curve<THREE.Vector3>, number, number, number, boolean]
}

const Model3dGeometryTube: React.FC<Model3dGeometryTubeProps> = ({
  meshConfig = {},
  materialsConfig = {},
  editMode = false,
  name = "",
  onClick,
  args,
}) => {
  const { visible, position, scale, rotation, opacity, color } = meshConfig
  const { materials } = materialsConfig

  // 避免未使用参数警告
  if (materials) {
    // 材质配置占位
  }

  const meshRef = React.useRef<THREE.Mesh>(null)
  const materialRef = React.useRef<THREE.MeshPhysicalMaterial>(null)

  React.useEffect(() => {
    if (meshRef.current && materialRef.current) {
      // 原逻辑：将 mesh 和 material 存储到全局对象
      if (!window.model3d) {
        window.model3d = {}
      }
      if (!window.model3d_material) {
        window.model3d_material = {}
      }
      window.model3d[name] = meshRef.current
      window.model3d_material[name] = [materialRef.current]
    }
  }, [name])

  const gProps = {
    visible: visible,
    position: [position?.x || 0, position?.y || 0, position?.z || 0] as [number, number, number],
    scale: [scale?.x || 1, scale?.y || 1, scale?.z || 1] as [number, number, number],
    rotation: [
      THREE.MathUtils.degToRad(rotation?.x || 0),
      THREE.MathUtils.degToRad(rotation?.y || 0),
      THREE.MathUtils.degToRad(rotation?.z || 0),
    ] as [number, number, number],
    receiveShadow: true,
    castShadow: true,
    onClick: (e: any) => {
      e.stopPropagation()
      onClick?.()
      if (editMode) {
        // 编辑模式下的逻辑
        console.log("Tube clicked in edit mode", name)
      }
    },
  }

  const mProps = {
    opacity: opacity,
    transparent: true,
    alphaTest: opacity,
    color: color ? new THREE.Color(color) : undefined,
  }

  // 默认曲线
  const curve = React.useMemo(() => new CustomSinCurve(10), [])
  const tubeArgs = args || [curve, 20, 2, 8, false]

  return (
    <Tube ref={meshRef} name={name} args={tubeArgs} {...gProps}>
      <meshPhysicalMaterial ref={materialRef} {...mProps} />
    </Tube>
  )
}

Model3dGeometryTube.displayName = "Model3dGeometryTube"

export { Model3dGeometryTube }