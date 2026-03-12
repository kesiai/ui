## Model3DLayout3D - 3D布局组件

### 导入路径
```tsx
import { Model3DLayout3D } from '@/components/airiot/model-3d-layout-3d/model-3d-layout-3d'
```

### 基础用法
```tsx
import { Model3DLayout3D, Model3DGeometryBox } from '@/components/airiot'

function LayoutExample() {
  const items = [
    { id: 1, position: [0, 0, 0], size: [1, 1, 1] },
    { id: 2, position: [2, 0, 0], size: [1, 1, 1] },
    { id: 3, position: [0, 2, 0], size: [1, 1, 1] }
  ]

  return (
    <Model3DLayout3D
      items={items}
      onItemSelect={handleItemSelect}
    >
      {(item) => (
        <Model3DGeometryBox
          position={item.position}
          size={item.size}
          color={item.color}
        />
      )}
    </Model3DLayout3D>
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| items | Array<{ id, position, size, color }> | [] | 布局项 |
| onItemSelect | (item) => void | - | 项选择回调 |
| gridSize | number | 1 | 网格大小 |
| cameraPosition | [number, number, number] | [5, 5, 5] | 相机位置 |

### 示例
```tsx
import {
  Model3DLayout3D,
  Model3DGeometryBox,
  Model3DGeometrySphere
} from '@/components/airiot'

function BuildingLayout() {
  const floors = [
    {
      id: 'floor1',
      name: '一楼',
      items: [
        { id: 'room1', type: 'box', position: [0, 0, 0], size: [2, 1, 2], color: '#ff9999' },
        { id: 'room2', type: 'box', position: [3, 0, 0], size: [2, 1, 2], color: '#9999ff' }
      ]
    },
    {
      id: 'floor2',
      name: '二楼',
      items: [
        { id: 'room3', type: 'box', position: [0, 2, 0], size: [4, 1, 3], color: '#99ff99' }
      ]
    }
  ]

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        {floors.map(floor => (
          <button key={floor.id} style={{ marginRight: 8 }}>
            {floor.name}
          </button>
        ))}
      </div>

      <Model3DLayout3D
        items={floors.flatMap(floor => floor.items.map(item => ({
          ...item,
          floor: floor.name
        })))}
        onItemSelect={(item) => console.log('选中:', item)}
        cameraPosition={[8, 8, 8]}
      >
        {(item) => {
          if (item.type === 'box') {
            return (
              <Model3DGeometryBox
                position={item.position}
                size={item.size}
                color={item.color}
                wireframe={false}
              />
            )
          } else if (item.type === 'sphere') {
            return (
              <Model3DGeometrySphere
                position={item.position}
                radius={item.size[0] / 2}
                color={item.color}
              />
            )
          }
        }}
      </Model3DLayout3D>
    </div>
  )
}
```

### 使用场景
- 建筑物布局展示
- 工厂设备布局
- 3D数据可视化
- VR场景搭建

### 注意事项
- 支持多种几何体组合
- 可以分层级管理
- 支持交互选择和操作