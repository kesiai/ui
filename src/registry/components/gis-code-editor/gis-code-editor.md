# 代码图层

## 简介

`CodeEditorViews` 是一个动态代码图层组件，允许通过编写 JavaScript 代码函数来创建和自定义 OpenLayers 图层。

- **动态代码执行**：支持执行 JavaScript 函数创建图层
- **OpenLayers 模块注入**：内置 OpenLayers 常用模块（layer、source）
- **参数化配置**：支持传递参数到代码函数中
- **图层可见性控制**：可动态控制图层的显示和隐藏
- **自动资源清理**：组件卸载时自动移除图层，防止内存泄漏

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `codeScript` | `string` | 否 | - | 返回图层实例的 JavaScript 函数字符串 |
| `params` | `CodeParam[]` | 否 | `[]` | 传递给代码函数的参数列表 |
| `display` | `boolean` | 否 | `true` | 是否显示图层 |
| `className` | `string` | 否 | - | 自定义 CSS 类名 |
| `cellKey` | `string` | 否 | - | 单元格唯一标识 |
| `map` | `Map` | 否 | - | 地图实例（通常从 Context 获取） |

### CodeParam

代码参数对象。

```typescript
interface CodeParam {
  name: string                                          // 参数名
  value: string | number | boolean | Record<string, unknown>  // 参数值
}
```

## 基本用法

### 1. 创建 OSM 图层

使用默认脚本创建 OpenStreetMap 图层。

```tsx
import { MapContainer } from '@/registry/components/gis-map-core'
import { CodeEditorViews } from '@/registry/components/gis-code-editor'

function OSMLayer() {
  const script = `(context, params) => {
  const { layer, source } = context;
  return new layer.Tile({
    source: new source.OSM()
  });
}`

  return (
    <MapContainer>
      <CodeEditorViews
        codeScript={script}
        cellKey="osm-layer"
      />
    </MapContainer>
  )
}
```

### 2. 创建 XYZ 瓦片图层

通过代码创建高德地图瓦片图层。

```tsx
function AmapLayer() {
  const script = `(context, params) => {
  const { layer, source } = context;
  return new layer.Tile({
    source: new source.XYZ({
      url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
    })
  });
}`

  return (
    <MapContainer>
      <CodeEditorViews
        codeScript={script}
        cellKey="amap-layer"
      />
    </MapContainer>
  )
}
```

### 3. 使用参数配置

通过 params 参数动态配置图层。

```tsx
function ParametrizedLayer() {
  const script = `(context, params) => {
  const { layer, source } = context;
  return new layer.Tile({
    source: new source.XYZ({
      url: params.url,
      crossOrigin: params.crossOrigin
    }),
    opacity: params.opacity
  });
}`

  const params = [
    {
      name: 'url',
      value: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
    },
    {
      name: 'crossOrigin',
      value: 'anonymous'
    },
    {
      name: 'opacity',
      value: 0.8
    }
  ]

  return (
    <MapContainer>
      <CodeEditorViews
        codeScript={script}
        params={params}
        cellKey="param-layer"
      />
    </MapContainer>
  )
}
```

### 4. 动态控制图层显示

通过 display 属性控制图层的显示和隐藏。

```tsx
function DynamicLayer() {
  const [visible, setVisible] = React.useState(true)

  const script = `(context, params) => {
  const { layer, source } = context;
  return new layer.Tile({
    source: new source.OSM()
  });
}`

  return (
    <div>
      <button onClick={() => setVisible(!visible)}>
        {visible ? '隐藏' : '显示'}图层
      </button>

      <MapContainer>
        <CodeEditorViews
          codeScript={script}
          display={visible}
          cellKey="dynamic-layer"
        />
      </MapContainer>
    </div>
  )
}
```

### 5. 创建带透明度的图层

通过代码配置图层透明度。

```tsx
function TransparentLayer() {
  const script = `(context, params) => {
  const { layer, source } = context;
  const tileLayer = new layer.Tile({
    source: new source.OSM()
  });
  tileLayer.setOpacity(params.opacity);
  return tileLayer;
}`

  const params = [
    {
      name: 'opacity',
      value: 0.5
    }
  ]

  return (
    <MapContainer>
      <CodeEditorViews
        codeScript={script}
        params={params}
        cellKey="transparent-layer"
      />
    </MapContainer>
  )
}
```

## 完整示例

### 多代码图层叠加

叠加多个代码图层，实现复杂的地图效果。

```tsx
import { MapContainer } from '@/registry/components/gis-map-core'
import { CodeEditorViews } from '@/registry/components/gis-code-editor'

function MultiCodeLayerMap() {
  const osmScript = `(context, params) => {
  const { layer, source } = context;
  return new layer.Tile({
    source: new source.OSM()
  });
}`

  const amapScript = `(context, params) => {
  const { layer, source } = context;
  const tileLayer = new layer.Tile({
    source: new source.XYZ({
      url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
    })
  });
  tileLayer.setOpacity(0.5);
  return tileLayer;
}`

  return (
    <MapContainer
      width="100%"
      height="600px"
      viewOptions={{
        position: { center: [116.391, 39.9042] },
        zoom: 10
      }}
    >
      {/* 底层：OSM 图层 */}
      <CodeEditorViews
        codeScript={osmScript}
        display={true}
        cellKey="osm-base-layer"
      />

      {/* 顶层：半透明高德图层 */}
      <CodeEditorViews
        codeScript={amapScript}
        display={true}
        cellKey="amap-overlay-layer"
      />
    </MapContainer>
  )
}
```

### 动态脚本编辑器

创建一个可以动态编辑和执行代码的图层。

```tsx
function DynamicCodeEditor() {
  const [script, setScript] = React.useState(`(context, params) => {
  const { layer, source } = context;
  return new layer.Tile({
    source: new source.OSM()
  });
}`)

  const [isValid, setIsValid] = React.useState(true)

  const handleScriptChange = (value: string) => {
    setScript(value)
    try {
      // 验证脚本是否有效
      // eslint-disable-next-line no-eval
      const fn = eval(value)
      setIsValid(typeof fn === 'function')
    } catch {
      setIsValid(false)
    }
  }

  return (
    <div>
      <textarea
        value={script}
        onChange={(e) => handleScriptChange(e.target.value)}
        style={{ width: '100%', height: '200px', fontFamily: 'monospace' }}
      />
      {!isValid && <p style={{ color: 'red' }}>脚本语法错误</p>}

      <MapContainer>
        <CodeEditorViews
          codeScript={script}
          display={isValid}
          cellKey="editor-layer"
        />
      </MapContainer>
    </div>
  )
}
```

### 条件参数配置

根据条件动态配置参数。

```tsx
function ConditionalParamsLayer() {
  const [layerType, setLayerType] = React.useState('osm')

  const script = `(context, params) => {
  const { layer, source } = context;
  if (params.type === 'osm') {
    return new layer.Tile({
      source: new source.OSM()
    });
  } else if (params.type === 'amap') {
    return new layer.Tile({
      source: new source.XYZ({
        url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
      })
    });
  }
  return null;
}`

  const params = [
    {
      name: 'type',
      value: layerType
    }
  ]

  return (
    <div>
      <select value={layerType} onChange={(e) => setLayerType(e.target.value)}>
        <option value="osm">OpenStreetMap</option>
        <option value="amap">高德地图</option>
      </select>

      <MapContainer>
        <CodeEditorViews
          codeScript={script}
          params={params}
          cellKey="conditional-layer"
        />
      </MapContainer>
    </div>
  )
}
```

## Context 对象说明

代码函数接收的 `context` 对象包含以下 OpenLayers 模块：

```typescript
{
  layer: {
    Tile: typeof TileLayer      // Tile 图层类
  },
  source: {
    OSM: typeof OSM,             // OSM 数据源类
    XYZ: typeof XYZ              // XYZ 数据源类
  },
  map: Map                       // 地图实例
}
```

## 注意事项

1. **代码函数必须返回图层实例**：`codeScript` 必须是一个返回 OpenLayers Layer 实例的函数

2. **安全风险**：使用 `eval` 执行代码存在安全风险，请确保脚本来源可信

3. **错误处理**：脚本执行错误会在控制台输出，不会中断应用运行

4. **资源清理**：组件卸载或 `codeScript`/`params` 变化时，会自动移除旧图层

5. **参数值处理**：如果参数值是对象且包含 `vval` 属性，会自动提取 `vval` 的值

6. **显示控制**：`display` 属性变化时只会更新图层可见性，不会重新创建图层

7. **脚本格式**：脚本必须是函数表达式，如 `(context, params) => { ... }`

8. **依赖注入**：目前仅注入了部分 OpenLayers 模块，如需其他模块请联系开发者扩展

9. **性能考虑**：频繁变化 `codeScript` 或 `params` 会导致图层重复创建，影响性能

10. **cellKey 唯一性**：确保 `cellKey` 在同一地图中唯一，否则可能导致图层冲突
