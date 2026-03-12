# Model3D 3D场景容器

## 导入路径

```tsx
import {
  Model3D,
  Model3DLayout3D,
  Model3DGeometryBox,
  Model3DGeometrySphere,
  Model3DGeometryCylinder,
  Model3DGeometryPlane,
  Model3DGeometryCone,
  Model3DGeometryTube,
  Model3DGeometryCircle,
  Model3DCard
} from '@/components/airiot/3d'
```

## 完整使用示例

```tsx
import {
  Model3D,
  Model3DLayout3D,
  Model3DGeometryBox,
  Model3DGeometrySphere,
  Model3DGeometryCylinder,
  Model3DGeometryPlane,
  Model3DCard
} from '@/components/airiot/3d'
import { Button } from '@/components/airiot/button'
import { Text } from '@/components/airiot/text'

function ThreeDSceneExample() {
  // 3D场景配置
  const sceneConfig = {
    camera: {
      position: [5, 5, 5],
      lookAt: [0, 0, 0]
    },
    lights: [
      {
        type: 'directional',
        position: [5, 5, 5],
        intensity: 1
      },
      {
        type: 'ambient',
        intensity: 0.5
      }
    ],
    controls: {
      enablePan: true,
      enableZoom: true,
      enableRotate: true
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Text variant="title">3D场景示例</Text>
        <div className="space-x-2">
          <Button onClick={() => console.log('重置视角')}>重置视角</Button>
          <Button onClick={() => console.log('切换线框')}>切换线框</Button>
        </div>
      </div>

      <Model3D {...sceneConfig}>
        {/* 3D布局 */}
        <Model3DLayout3D>
          {/* 立方体 */}
          <Model3DGeometryBox
            position={[-2, 0, 0]}
            size={[1, 1, 1]}
            color="#ff0000"
            onClick={() => console.log('点击了立方体')}
          />

          {/* 球体 */}
          <Model3DGeometrySphere
            position={[0, 0, 0]}
            radius={0.5}
            color="#00ff00"
            wireframe={false}
          />

          {/* 圆柱体 */}
          <Model3DGeometryCylinder
            position={[2, 0, 0]}
            radiusTop={0.3}
            radiusBottom={0.5}
            height={1}
            color="#0000ff"
          />

          {/* 平面 */}
          <Model3DGeometryPlane
            position={[0, -1, 0]}
            width={4}
            height={4}
            color="#888888"
          />

          {/* 3D卡片 */}
          <Model3DCard
            position={[0, 2, 0]}
            width={1}
            height={1.5}
            depth={0.1}
            content={
              <div className="p-2">
                <Text variant="title">3D卡片</Text>
                <Text variant="body">这是一个3D卡片组件</Text>
              </div>
            }
          />
        </Model3DLayout3D>
      </Model3D>
    </div>
  )
}
```

## Props

### Model3D

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| camera | CameraConfig | - | 相机配置 |
| lights | LightConfig[] | - | 灯光配置 |
| controls | ControlsConfig | - | 控制器配置 |
| style | React.CSSProperties | - | 容器样式 |

### CameraConfig

```tsx
interface CameraConfig {
  position: [number, number, number]
  lookAt: [number, number, number]
  fov?: number // 视野角度
}
```

### LightConfig

```tsx
interface LightConfig {
  type: 'directional' | 'point' | 'spot' | 'ambient'
  position?: [number, number, number]
  intensity?: number
  color?: string
}
```

### ControlsConfig

```tsx
interface ControlsConfig {
  enablePan?: boolean
  enableZoom?: boolean
  enableRotate?: boolean
  autoRotate?: boolean
  autoRotateSpeed?: number
}
```

### Model3DGeometryBox

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| position | [number, number, number] | [0, 0, 0] | 位置 |
| size | [number, number, number] | [1, 1, 1] | 尺寸 |
| color | string | '#ffffff' | 颜色 |
 wireframe | boolean | false | 是否线框模式 |
| onClick | () => void | - | 点击事件 |

### Model3DGeometrySphere

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| position | [number, number, number] | [0, 0, 0] | 位置 |
| radius | number | 1 | 半径 |
| color | string | '#ffffff' | 颜色 |
| wireframe | boolean | false | 是否线框模式 |

### Model3DGeometryCylinder

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| position | [number, number, number] | [0, 0, 0] | 位置 |
| radiusTop | number | 1 | 顶部半径 |
| radiusBottom | number | 1 | 底部半径 |
| height | number | 2 | 高度 |
| color | string | '#ffffff' | 颜色 |

### Model3DLayout3D

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| grid | boolean | true | 是否显示网格 |
| axes | boolean | false | 是否显示坐标轴 |

### Model3DCard

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| position | [number, number, number] | [0, 0, 0] | 位置 |
| width | number | 1 | 宽度 |
| height | number | 1 | 高度 |
| depth | number | 0.1 | 深度 |
| content | ReactNode | - | 卡片内容 |

## 注意事项

- Model3D 是3D场景的根容器，必须作为最外层组件
- 所有几何体组件必须作为 Model3D 或 Model3DLayout3D 的子组件
- 使用3D卡片时，content属性需要传入React节点
- 动态更新几何体属性时，需要重新渲染组件
- 性能优化：避免在每一帧创建大量几何体