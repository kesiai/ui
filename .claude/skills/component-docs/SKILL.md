---
name: component-docs
description: "Generate Markdown documentation for React components. Analyzes component source code, config.tsx, and existing docs to create comprehensive component documentation following project standards."
---

# Component Docs Generator - 组件文档生成器

为组件库中的 React 组件生成符合项目规范的 Markdown 文档。

## 目标

为 `registry/components` 目录下包含 `config.tsx` 的组件生成完整的 Markdown 文档。

## 文档位置

生成的文档保存为：`registry/components/{component-name}/{component-name}.md`

## 使用流程

### Step 1: 分析组件结构

读取以下文件来理解组件：

1. **组件源码** - `registry/components/{component-name}/{component-name}.tsx`
   - 查找 Props 接口定义
   - 查找 JSDoc 注释
   - 理解组件功能和用途

2. **配置文件** - `registry/components/{component-name}/config.tsx`
   - 提取 `propsConfig` 数组
   - 提取 `defaultProps`
   - 理解每个属性的类型、默认值和描述

3. **现有文档** - `registry/components/{component-name}/{component-name}.md` (如果存在)
   - 查看是否已有文档内容
   - 如果存在，确认是否需要更新

### Step 2: 提取信息

从配置文件中提取 Props 信息：

```typescript
// 提取 propsConfig 数组
export const xxxPropsConfig = [
  {
    name: 'value',           // 属性名
    label: '当前值',          // 中文标签
    type: 'number',          // 类型
    default: 50,             // 默认值
    description: '...',      // 描述
    min: 0,                  // 最小值（可选）
    max: 100,                // 最大值（可选）
    options: [...]           // 选项（仅 select 类型）
  }
]
```

### Step 3: 生成文档

按照以下结构生成 Markdown 文档：

#### 文档结构

```markdown
# {组件中文名}

## 简介

`{ComponentName}` 是一个{简短描述，说明组件的核心用途}。

- **特性1**：具体描述（简短有力，一句话）
- **特性2**：具体描述（简短有力，一句话）
- **特性3**：具体描述（简短有力，一句话）
- **特性4**：具体描述（简短有力，一句话）
- **特性5**：具体描述（简短有力，一句话）

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
{从 propsConfig 提取，格式：| `propName` | `type` | 是/否 | `defaultValue` | description |}

{如果有复杂参数需要详细说明，添加以下子章节}

### {复杂参数名}

详细说明该参数的结构、用法和注意事项。

**示例：**
```tsx
<Component
  complexProp={{
    key1: 'value1',
    key2: 'value2'
  }}
/>
```

## 基本用法

### 1. {场景名称1}

{简短说明（1-2句话）这个示例的用途}

```tsx
import { {ComponentName} } from '@/registry/components/{component-dir}'

function Example() {
  return (
    <{ComponentName}
      {prop1}={value1}
      {prop2}={value2}
    />
  )
}
```

### 2. {场景名称2}

{简短说明}

```tsx
function Example() {
  return (
    <{ComponentName}
      {prop1}={value1}
    />
  )
}
```

{继续添加更多场景，总共 3-7 个示例}

## 完整示例

### {业务场景名称1}

{简短说明这个示例的业务场景和实现目标}

```tsx
import { {ComponentName} } from '@/registry/components/{component-dir}'
{如有其他导入，在此添加}

function Example() {
  {如有状态或逻辑，在此添加}

  return (
    <{ComponentName}
      {列举主要属性}
    >
      {子组件}
    </{ComponentName}>
  )
}
```

{继续添加更多完整示例，总共 2-4 个}

## 注意事项

1. **{注意点1标题}**：{详细说明和原因}

2. **{注意点2标题}**：{详细说明和原因}

3. **{注意点3标题}**：{详细说明和原因}

4. **{注意点4标题}**：{详细说明和原因}

5. **{注意点5标题}**：{详细说明和原因}
```

#### 内容要求

- **简介**：5 个特性列表，每个特性简短描述
- **Props 表格**：从 propsConfig 提取所有参数
- **基本用法**：3-7 个示例，覆盖常见场景
- **完整示例**：2-4 个可运行的完整代码
- **注意事项**：4-6 个实用注意点

### Step 4: 更新 config.tsx

在 `config.tsx` 中添加文档导入：

```typescript
// 在文件顶部添加 import
import documentationMd from './{component-name}.md?raw'

// 在 Config 对象中添加 documentation 字段
export const xxxConfig: ComponentConfig = {
  id: '{component-name}',
  name: '{组件中文名}',
  propsConfig: xxxPropsConfig,
  defaultProps: xxxDefaultProps,
  renderPreview: renderXxxPreview,
  renderCodePreview: renderXxxCodePreview,
  documentation: documentationMd  // 添加这一行
}
```

---

## 类型映射

将 `propsConfig` 中的类型映射到文档表格：

| propsConfig type | 文档显示类型 |
|------------------|--------------|
| `input` | `string` |
| `number` | `number` |
| `boolean` | `boolean` |
| `select` | `'option1' \| 'option2' \| ...` |
| `color` | `string` (CSS color) |
| `array` | `Array<{ name: string; value: string }>` |
| `object` | `object` |
| `range` | `number` |

---

## 组件名称转换

- **组件目录名** (kebab-case): `container-context-provider`
- **组件类名** (PascalCase): `ContainerContextProvider`
- **组件中文名**: 从 `config.name` 提取，如 "容器上下文提供者"

---

## 特殊处理

### 数据源组件 (datasource-*)
需要详细说明：
- URL 格式和占位符
- 认证方式
- 数据获取流程
- 子组件如何获取数据

### 容器组件 (container-*)
需要说明：
- 布局结构
- 子组件要求
- Context 提供

### 表单组件 (form-*)
需要说明：
- 绑定方式
- 验证规则
- 数据格式

### 视图组件 (view-*)
需要说明：
- 数据要求
- 列配置
- 事件处理

---

## 质量检查清单

生成文档后检查：

- [ ] 所有 Props 都在表格中列出
- [ ] 类型正确映射
- [ ] 默认值正确显示
- [ ] 代码示例可以复制粘贴使用
- [ ] 使用了正确的组件导入路径
- [ ] 注意事项实用且相关
- [ ] 中文表达清晰准确
- [ ] Markdown 格式正确

---

## 示例：生成 Bar 组件文档

用户请求：`为 bar 组件生成文档`

AI 应该：

1. 读取 `my-component-library/src/registry/components/bar/bar.tsx`
2. 读取 `my-component-library/src/registry/components/bar/config.tsx`
3. 提取 propsConfig:
   - value (number)
   - maxValue (number)
   - color (color)
   - borderColor (color)
   - direction (select: horizontal | vertical)
   - position (select: start | end)
   - visualMap (boolean)
4. 生成 `bar.md` 文档
5. 更新 `config.tsx` 添加文档导入
