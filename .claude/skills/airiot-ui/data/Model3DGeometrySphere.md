## Model3DGeometrySphere - 3D球体几何体组件

### 导入路径
```tsx
import { Model3DGeometrySphere } from '@/components/airiot/model-3d-geometry-sphere/model-3d-geometry-sphere'
```

### 基础用法
```tsx
import { Model3DGeometrySphere, Model3D } from '@/components/airiot'

function SphereExample() {
  return (
    <Model3D>
      <Model3DGeometrySphere
        position={[0, 0, 0]}
        radius={1}
        color="orange"
      />
    </Model3D>
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| position | [number, number, number] | [0, 0, 0] | 位置坐标 |
| radius | number | 1 | 半径 |
| color | string | '#ff6600' | 颜色 |
| segments | number | 32 | 分段数（影响平滑度） |

### 示例
```tsx
import { Model3DGeometrySphere, Model3D, Button, Card, Slider } from '@/components/airiot'

function PlanetDemo() {
  const [radius, setRadius] = useState(1)
  const [segments, setSegments] = useState(32)
  const [color, setColor] = useState('orange')

  return (
    <Card cardTitle="3D球体">
      <Model3D
        style={{ height: 400 }}
        cameraPosition={[3, 3, 3]}
      >
        <Model3DGeometrySphere
          position={[0, 0, 0]}
          radius={radius}
          color={color}
          segments={segments}
        />
      </Model3D>

      <div style={{ marginTop: 16 }}>
        <div style={{ marginBottom: 8 }}>
          <label>半径: {radius}</label>
          <Slider
            value={radius}
            onChange={setRadius}
            min={0.5}
            max={2}
            step={0.1}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>平滑度: {segments}</label>
          <Slider
            value={segments}
            onChange={setSegments}
            min={8}
            max={64}
            step={8}
          />
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            type={color === 'orange' ? 'primary' : 'default'}
            onClick={() => setColor('orange')}
          >
            橙色
          </Button>
          <Button
            type={color === 'blue' ? 'primary' : 'default'}
            onClick={() => setColor('blue')}
          >
            蓝色
          </Button>
          <Button
            type={color === 'red' ? 'primary' : 'default'}
            onClick={() => setColor('red')}
          >
            红色
          </Button>
        </div>
      </div>
    </Card>
  )
}
```

### 性能优化
- 分段数越高越平滑，但性能消耗越大
- 推荐 16-32 之间平衡性能和视觉效果
- 动态物体建议使用较低的分段数

### 注意事项
- 球体是完美的圆形几何体
- 适合模拟行星、球体等对象
- 支持材质和纹理贴图