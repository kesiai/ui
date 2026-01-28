# Layout 布局组件架构设计

## 核心问题解答

### 1. 运行时和编辑时是否需要分开？

**方案：同一个组件，通过 `editable` 属性控制**

```tsx
// 运行时模式（轻量级）
<Layout layoutType="free">
  {children}
</Layout>

// 编辑模式（带拖拽编辑）
<Layout
  layoutType="free"
  editable={true}
  onLayoutChange={(layout) => console.log('布局更新:', layout)}
>
  {children}
</Layout>
```

**优势：**
- ✅ **单一数据源**：运行时和编辑时使用相同的数据结构（`componentLayout`）
- ✅ **一致性保证**：所见即所得，编辑时看到的就是运行时的效果
- ✅ **代码复用**：布局逻辑只写一次，避免两套代码不一致
- ✅ **易于维护**：修改布局逻辑只需改一个地方

### 2. 如何保证效果一致性？

**答案：通过相同的数据结构和渲染逻辑**

```typescript
// 数据结构（运行时和编辑时共用）
interface ComponentLayout {
  free: Record<string, { x: number; y: number; width: number; height: number }>
  flex: Record<string, { width: number; height: number }>
  grid: Array<{ x: number; y: number; w: number; h: number; i: string }>
}

// 编辑器更新数据
onLayoutChange({
  free: {
    'btn-1': { x: 100, y: 50, width: 80, height: 40 }
  }
})

// 运行时使用相同数据渲染
<Layout componentLayout={componentLayout}>
  <button key="btn-1">按钮</button>
</Layout>
```

**一致性保证：**
1. ✅ 编辑器直接修改 `componentLayout` 数据
2. ✅ 运行时使用完全相同的 `componentLayout` 渲染
3. ✅ 无需转换或映射，零差异

### 3. 如何避免运行时组件过重？

**方案：条件渲染 + 代码分割**

```typescript
// 方案1: 条件渲染（已实现）
if (editable) {
  // 只在编辑模式加载编辑器
  return <FreeLayoutEditor />
}
// 运行时使用轻量级渲染器
return <FreeLayout />

// 方案2: 动态导入（可选，针对大型编辑器）
const FreeLayoutEditor = React.lazy(() => import('./editors/FreeLayoutEditor'))

if (editable) {
  return (
    <React.Suspense fallback={<FreeLayout />}>
      <FreeLayoutEditor />
    </React.Suspense>
  )
}
```

**性能对比：**
| 模式 | 依赖 | 包体积 | 功能 |
|------|------|--------|------|
| 运行时 | 无 | ~2KB | 仅渲染布局 |
| 编辑时 | react-grid-layout | ~50KB | 渲染 + 拖拽编辑 |
| 节省 | - | **96%** | 运行时不加载编辑功能 |

### 4. 在编辑器中的使用流程

```typescript
// 你的编辑器架构
function Editor() {
  const [layoutData, setLayoutData] = useState({
    free: {
      'btn-1': { x: 10, y: 10, width: 80, height: 40 }
    }
  })

  return (
    <div className="flex">
      {/* 可视化编辑区 */}
      <div className="flex-1">
        <Layout
          layoutType="free"
          componentLayout={layoutData}
          editable={true}
          onLayoutChange={setLayoutData}  // 实时更新数据
        >
          <button key="btn-1">按钮 1</button>
        </Layout>
      </div>

      {/* Code编辑区 */}
      <div className="w-80">
        <CodeEditor
          value={JSON.stringify(layoutData, null, 2)}
          onChange={(code) => setLayoutData(JSON.parse(code))}
        />
      </div>

      {/* 实时预览区（运行时模式） */}
      <div className="flex-1">
        <Layout
          layoutType="free"
          componentLayout={layoutData}
          editable={false}  // 纯运行时，无编辑功能
        >
          <button key="btn-1">按钮 1</button>
        </Layout>
      </div>
    </div>
  )
}
```

## 数据流图

```
┌─────────────┐
│  可视化编辑  │ ←→ 拖拽修改 → componentLayout
└─────────────┘
        ↓
        ↓ (实时同步)
        ↓
┌─────────────┐
│  Code编辑   │ ←→ 手写JSON → componentLayout
└─────────────┘
        ↓
        ↓ (实时同步)
        ↓
   componentLayout (单一数据源)
        ↓
        ↓
   ┌────┴────┐
   ↓         ↓
运行时渲染  编辑时渲染
(轻量级)   (带编辑器)
```

## 关键设计原则

1. **单一数据源**: componentLayout 是唯一的真相来源
2. **数据驱动视图**: 修改数据，视图自动更新
3. **模式切换**: 通过 `editable` 属性控制，而非两套组件
4. **性能优化**: 运行时不加载编辑器代码
5. **所见即所得**: 编辑时 = 运行时，完全一致

## 总结

- ✅ **不需要分开**：同一组件，通过 `editable` 控制
- ✅ **一致性保证**：相同数据结构 + 相同渲染逻辑
- ✅ **性能优化**：条件渲染，运行时零额外负担
- ✅ **开发效率**：一套代码，两个模式，易维护
