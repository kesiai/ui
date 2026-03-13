# 3D 系统完整使用指南

## 简介

3D 系统是一组协同工作的组件，用于 3D 模型展示和交互。所有 3D 组件都必须以 `Model3D` 为核心场景容器，配合各种几何体和布局组件使用。

## 系统架构

```
Model3D (核心3D场景)
├── Model3DGeometryBox (立方体)
├── Model3DGeometrySphere (球体)
├── Model3DGeometryCylinder (圆柱)
├── Model3DGeometryCone (圆锥)
├── Model3DGeometryPlane (平面)
├── Model3DGeometryCircle (圆形)
├── Model3DGeometryTube (管道)
├── Model3DLayout3D (3D布局)
└── Model3DCard (3D卡片)
```

## 基础使用

### 最小可用组合

```tsx
import { Model3D } from '@/components/airiot/model3d/model3d';

function Simple3DScene() {
  return (
    <Model3D
      camera={{ position: [5, 5, 5], fov: 75 }}
      style={{ height: '400px' }}
    >
      <Model3DGeometryBox
        position={[0, 0, 0]}
        args={[1, 1, 1]}
        color="orange"
      />
    </Model3D>
  );
}
```

### 完整功能组合

```tsx
import {
  Model3D
} from '@/components/airiot/model3d/model3d';
import {
  Model3DGeometryBox
} from '@/components/airiot/model3d-geometry-box/model3d-geometry-box';
import {
  Model3DGeometrySphere
} from '@/components/airiot/model3d-geometry-sphere/model3d-geometry-sphere';
import {
  Model3DGeometryCylinder
} from '@/components/airiot/model3d-geometry-cylinder/model3d-geometry-cylinder';
import {
  Model3DLayout3D
} from '@/components/airiot/model3d-layout3d/model3d-layout3d';
import {
  Model3DCard
} from '@/components/airiot/model3d-card/model3d-card';

function Complete3DSystem() {
  const [selectedModel, setSelectedModel] = useState(null);

  return (
    <div className="scene-container">
      {/* 核心3D场景 */}
      <Model3D
        camera={{ position: [10, 10, 10], fov: 75 }}
        controls={true}
        onModelClick={(model) => setSelectedModel(model)}
        style={{ height: '600px' }}
      >
        {/* 环境光 */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        {/* 布局容器 */}
        <Model3DLayout3D
          position={[0, 0, 0]}
          gridSize={5}
          cellSize={2}
        >
          {/* 第一行 */}
          <Model3DGeometryBox
            position={[0, 0, 0]}
            args={[1, 1, 1]}
            color="blue"
            onClick={() => console.log('Box clicked')}
          />

          <Model3DGeometrySphere
            position={[2, 0, 0]}
            args={[0.5, 32, 32]}
            color="red"
          />

          {/* 第二行 */}
          <Model3DGeometryCylinder
            position={[0, 0, 2]}
            args={[0.5, 0.5, 1, 32]}
            color="green"
          />

          <Model3DGeometryCone
            position={[2, 0, 2]}
            args={[0.5, 1, 32]}
            color="purple"
          />
        </Model3DLayout3D>

        {/* 3D卡片 */}
        <Model3DCard
          position={[5, 2, 0]}
          title="信息卡片"
          content="这是一个3D卡片组件"
          width={2}
          height={1}
        />
      </Model3D>

      {/* 控制面板 */}
      <div className="controls">
        <button onClick={() => setSelectedModel(null)}>
          重置选择
        </button>
        <button onClick={handleAddModel}>
          添加模型
        </button>
        <button onClick={handleDeleteModel}>
          删除模型
        </button>
      </div>

      {/* 模型信息 */}
      {selectedModel && (
        <div className="model-info">
          <h3>选中模型信息</h3>
          <p>类型: {selectedModel.type}</p>
          <p>位置: {selectedModel.position.join(', ')}</p>
        </div>
      )}
    </div>
  );
}
```

## 组件详解

### Model3D (核心3D场景)

**必须作为核心容器**，提供 3D 场景基础功能。

**关键 Props**:
```tsx
interface Model3DProps {
  camera?: { position: [number, number, number]; fov?: number };
  controls?: boolean;                  // 启用轨道控制
  onModelClick?: (model: any) => void;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
```

### Model3DGeometryBox (立方体)

标准立方体几何体。

### Model3DGeometrySphere (球体)

球体几何体。

### Model3DGeometryCylinder (圆柱)

圆柱体几何体。

### Model3DGeometryCone (圆锥)

圆锥体几何体。

### Model3DGeometryPlane (平面)

平面几何体。

### Model3DGeometryCircle (圆形)

圆形几何体。

### Model3DGeometryTube (管道)

管道几何体。

### Model3DLayout3D (3D布局)

3D 空间布局容器。

### Model3DCard (3D卡片)

3D 空间中的卡片组件。

## 常见模式

### 1. 简单 3D 场景

```tsx
function Basic3DScene() {
  return (
    <Model3D style={{ height: '300px' }}>
      <Model3DGeometryBox position={[0, 0, 0]} args={[1, 1, 1]} />
    </Model3D>
  );
}
```

### 2. 多个几何体组合

```tsx
function MultipleGeometries() {
  return (
    <Model3D camera={{ position: [5, 5, 5] }}>
      {/* 立方体 */}
      <Model3DGeometryBox position={[0, 0, 0]} color="blue" />

      {/* 球体 */}
      <Model3DGeometrySphere position={[2, 0, 0]} color="red" />

      {/* 圆柱 */}
      <Model3DGeometryCylinder position={[-2, 0, 0]} color="green" />
    </Model3D>
  );
}
```

### 3. 网格布局

```tsx
function GridLayout() {
  return (
    <Model3D camera={{ position: [10, 10, 10] }}>
      <Model3DLayout3D
        gridSize={3}
        cellSize={2}
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <Model3DGeometryBox
            key={i}
            position={[
              (i % 3) * 2 - 2,
              0,
              Math.floor(i / 3) * 2 - 2
            ]}
            color={getRandomColor()}
          />
        ))}
      </Model3DLayout3D>
    </Model3D>
  );
}
```

### 4. 交互式 3D 场景

```tsx
function Interactive3DScene() {
  const [objects, setObjects] = useState([]);

  return (
    <Model3D camera={{ position: [5, 5, 5] }} onModelClick={handleObjectClick}>
      {objects.map((obj, index) => (
        <Model3DGeometryBox
          key={index}
          position={obj.position}
          args={obj.args}
          color={obj.color}
        />
      ))}
    </Model3D>
  );
}
```

## 高级功能

### 1. 动画效果

```tsx
function Animated3DScene() {
  const [rotation, setRotation] = useState(0);

  useAnimationFrame(() => {
    setRotation(prev => prev + 0.01);
  });

  return (
    <Model3D camera={{ position: [5, 5, 5] }}>
      <Model3DGeometryBox
        position={[0, 0, 0]}
        args={[1, 1, 1]}
        rotation={[0, rotation, 0]}
      />
    </Model3D>
  );
}
```

### 2. 数据可视化

```tsx
function DataVisualization3D() {
  const data = [
    { value: 10, position: [0, 0, 0] },
    { value: 20, position: [2, 0, 0] },
    { value: 15, position: [4, 0, 0] }
  ];

  return (
    <Model3D camera={{ position: [5, 5, 5] }}>
      {data.map((item, index) => (
        <Model3DGeometryBox
          key={index}
          position={[item.position[0], item.value / 2, item.position[2]]}
          args={[1, item.value, 1]}
          color="blue"
        />
      ))}
    </Model3D>
  );
}
```

### 3. 模型切换

```tsx
function ModelSwitcher() {
  const [currentModel, setCurrentModel] = useState('box');

  return (
    <div>
      <Model3D camera={{ position: [5, 5, 5] }}>
        {currentModel === 'box' && (
          <Model3DGeometryBox args={[1, 1, 1]} />
        )}
        {currentModel === 'sphere' && (
          <Model3DGeometrySphere args={[0.5, 32, 32]} />
        )}
        {currentModel === 'cylinder' && (
          <Model3DGeometryCylinder args={[0.5, 0.5, 1, 32]} />
        )}
      </Model3D>

      <div className="model-selector">
        <button onClick={() => setCurrentModel('box')}>立方体</button>
        <button onClick={() => setCurrentModel('sphere')}>球体</button>
        <button onClick={() => setCurrentModel('cylinder')}>圆柱</button>
      </div>
    </div>
  );
}
```

## 注意事项

1. **必须使用 Model3D**：作为 3D 系统的核心容器
2. **光照设置**：适当配置环境光和方向光
3. **性能优化**：大量模型时使用 InstancedMesh
4. **内存管理**：及时销毁不再需要的对象

## 最佳实践

1. **组件复用**：创建可复用的 3D 组件
2. **状态管理**：合理管理 3D 对象的状态
3. **事件处理**：优化事件监听，避免性能问题
4. **调试工具**：使用 3D 调试工具辅助开发