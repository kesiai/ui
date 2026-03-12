## Model3DGeometryBox - 3D立方体几何体组件

### 导入路径
```tsx
import { Model3DGeometryBox } from '@/components/airiot/model-3d-geometry-box/model-3d-geometry-box'
```

### 基础用法
```tsx
import { Model3DGeometryBox, Model3D } from '@/components/airiot'

function BoxExample() {
  return (
    <Model3D>
      <Model3DGeometryBox
        position={[0, 0, 0]}
        size={[1, 1, 1]}
        color="blue"
      />
    </Model3D>
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| position | [number, number, number] | [0, 0, 0] | 位置坐标 |
| size | [number, number, number] | [1, 1, 1] | 尺寸 |
| color | string | '#ff0000' | 颜色 |
| wireframe | boolean | false | 是否显示线框 |

### 示例
```tsx
import { Model3DGeometryBox, Model3D, Button, Card } from '@/components/airiot'

function CubeDemo() {
  const [color, setColor] = useState('blue')
  const [wireframe, setWireframe] = useState(false)

  return (
    <Card cardTitle="3D立方体">
      <Model3D
        style={{ height: 400 }}
        cameraPosition={[5, 5, 5]}
      >
        <Model3DGeometryBox
          position={[0, 0, 0]}
          size={[2, 2, 2]}
          color={color}
          wireframe={wireframe}
        />
      </Model3D>

      <div style={{ marginTop: 16 }}>
        <Button
          type={color === 'blue' ? 'primary' : 'default'}
          onClick={() => setColor('blue')}
        >
          蓝色
        </Button>
        <Button
          type={color === 'red' ? 'primary' : 'default'}
          onClick={() => setColor('red')}
          style={{ marginLeft: 8 }}
        >
          红色
        </Button>
        <Button
          type={color === 'green' ? 'primary' : 'default'}
          onClick={() => setColor('green')}
          style={{ marginLeft: 8 }}
        >
          绿色
        </Button>
        <Button
          type={wireframe ? 'primary' : 'default'}
          onClick={() => setWireframe(!wireframe)}
          style={{ marginLeft: 8 }}
        >
          {wireframe ? '实体' : '线框'}
        </Button>
      </div>
    </Card>
  )
}
```

### 支持的颜色
- 预设颜色：red, green, blue, yellow, purple, orange
- 自定义颜色：支持十六进制、RGB、RGBA

### 注意事项
- 需要配合 Model3D 使用
- 支持动态更新属性
- 可以添加光照和材质