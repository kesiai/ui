---
name: kesi-ui
description: "KESI UI 实现 — 接收 kesi-frontend 的页面设计报告，负责具体的 UI 组件选型和代码实现。根据设计报告中每个页面的数据展示方式、交互模式，选择合适的组件（表格/图表/表单/视图/GIS），安装组件，编写页面代码。"
---

# KESI UI 实现

接收页面设计报告，用组件实现具体页面。

---

## 执行流程

**生成任何代码之前，必须完成以下步骤：**

```
1. 分析需求 → 识别组件类型
2. 扫描目录 → Glob: .claude/skills/kesi-ui/references/*.md
3. 检查已装 → Glob: src/components/kesi/**/index.tsx，排除已安装的组件
4. 定位分类 → 通过前缀筛选对应文件
5. 匹配组件 → 从中选取最匹配的组件（单组件推荐不超过 3 个，组合系统除外）
6. 读取文档 → Read 工具读取推荐组件的完整文档，重点读取「适用场景」和「Props 参数说明」
7. 安装组件 → Bash 执行 npx shadcn@latest add 安装未安装的组件
8. 写入代码 → Write/Edit 工具直接创建或修改项目文件
```

### 兜底策略

> 如果扫描后未找到匹配的组件，读取最相关分类的系统指南（`system-*.md`）查找子组件。

### 项目上下文

> 生成代码前，从项目配置中读取实际的 import alias，不要硬编码 `@/`。

```bash
# 读取项目路径别名
Read: tsconfig.json → compilerOptions.paths
# 或 shadcn 项目
Bash: npx shadcn@latest info --json → aliases
```

### 与 shadcn/ui 互操作

> Kesi UI 组件可与 shadcn/ui 组件混合使用。当用户需求同时涉及两者时：
> - 容器/布局 → 优先用 shadcn（`Card`, `Dialog`, `Sheet` 等）
> - 表单/数据/视图 → 优先用 kesi（`ViewModel`, `FormInput`等）

### 组件分类与命名规则

| 前缀 | 分类 | 组件数 | 适用场景 |
|------|------|--------|---------|
| `form-*` | 表单 | 30 | 输入、选择、日期、上传、富文本、滑块 |
| `view-*` | 视图 | 11 | 数据表格、分页、过滤、批量操作、详情 |
| `gis-*` | GIS | 10 | 地图、图层、绘制、瓦片、GeoJSON |

> **图表不提供内置组件。** 需要图表时直接使用 `echarts`（`import * as echarts from 'echarts'`），自行封装 React 组件或使用 `useRef` + `useEffect` 初始化。参考 ECharts 官方文档：https://echarts.apache.org/zh/option.html

> `form.md` 是表单根组件（无前缀）。

### 页面级组件选型决策表

> 从 kesi-frontend 的规划报告获得页面列表后，根据下表为每个页面选择组件方案。

**默认策略：纯展示或带过滤的展示。CRUD 需用户显式指定。**

```
页面交互模式（由 kesi-frontend 规划报告标注）
  ├─ 纯展示 → shadcn/ui Card + echarts（直接使用） + createAPI
  ├─ 带过滤的展示（默认）→ shadcn/ui Table + createAPI + 自定义 Filter
  ├─ CRUD 管理（用户指定）→ ViewModel 视图系统
  └─ 地图展示 → GIS 组件系统
```

| 页面交互模式 | 组件方案 | 数据源 |
|-------------|---------|--------|
| **纯展示**（仪表盘、概览） | shadcn/ui Card + chart-echarts + createAPI | `createAPI` |
| **带过滤的展示**（默认） | shadcn/ui Table + 自定义 Filter + createAPI | `createAPI` |
| **CRUD 管理**（用户显式指定） | ViewModel 视图系统 | `ViewModel`（内部 Model） |
| **地图展示** | GisMapCore + 图层组件 | `createAPI` |

#### 何时使用 ViewModel（仅限用户明确要求 CRUD 时）

| 使用场景 | 说明 |
|----------|------|
| ✅ 需要增删改查的数据管理页 | ViewModel 提供 ViewActions 自动处理新增、编辑、删除、查看 |
| ✅ 需要过滤+分页+排序+CRUD 的完整列表页 | ViewModel 自动处理所有这些功能 |

#### ViewModel 完整组件配套（CRUD 页面使用）

```
ViewModel (tableId="表ID")
  ├─ ViewFilter          → 搜索过滤栏
  ├─ ViewDataTable       → 数据表格
  │   └─ TableColumn     → 自定义列（可选，不写则自动根据表 schema 生成）
  ├─ ViewPagination      → 分页器
  └─ ViewActions         → CRUD 操作按钮（新增/查看/编辑/删除/导出/复制）
```

**CRUD 页面示例：**

```tsx
<ViewModel tableId="building_info" initQuery>
  <ViewFilter filters={[{ key: 'building' }]} />
  <ViewDataTable>
    <TableColumn name="id" title="编号" width={120} fixed="left" />
    <TableColumn name="name" title="名称" width={160} />
  </ViewDataTable>
  <ViewPagination showTotal showSizeChanger />
</ViewModel>
```

---

## 组合系统指南

> 组合系统的组件必须完整配套使用，不可遗漏。

### 视图组件系统

> 完整指南: [system-view.md](references/system-view.md)

**核心规则**: 所有视图组件必须在 `ViewModel` 容器内使用。

```
ViewModel (容器)
  ├─ ViewFilter (过滤器)
  ├─ ViewDataTable (数据表格)
  ├─ ViewPagination (分页器)
  └─ ViewActions (操作栏)
```

```tsx
// 错误: 不能嵌套
<Model><ViewModel>...</ViewModel></Model>  // ❌
```

### GIS 组件系统

> 完整指南: [system-gis.md](references/system-gis.md)

**核心规则**: `GisMapCore` 作为最外层容器。

```
GisMapCore (地图容器)
  ├─ GisXyzTile (底图瓦片)
  ├─ GisCustomLayer (自定义图层)
  └─ GisPolygonDraw (绘制工具)
```

---

## 输出格式

完成代码写入后，在对话中输出以下摘要：

```markdown
## 需求分析
[分析用户需求，识别组件类型]

## 推荐组件
- `@kesi/ComponentName` - 简短说明

## 已安装
- @kesi/ComponentName

## 已修改文件
- src/pages/xxx.tsx

## 安装命令
npx shadcn@latest add @kesi/ComponentName
```

---

## 关键约束

1. **先读文档再生成代码** - 所有 Props 必须来自实际文档，绝不猜测
2. **组合系统必须配套** - 视图/GIS 组件不可遗漏必需组件
3. **不重复推荐已装组件** - 步骤 3 已排除，安装命令只包含未安装的组件
4. **使用 TypeScript** - 所有代码示例必须包含类型
5. **明确告知错误用法** - 遇到嵌套等错误用法时需提醒用户
