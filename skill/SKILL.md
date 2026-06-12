---
name: kesi-ui
description: "KESI UI 实现 — 接收 kesi-frontend 的页面设计报告，负责具体的 UI 组件选型和代码实现。根据设计报告中每个页面的数据展示方式、交互模式，选择合适的组件（表格/图表/表单/视图/GIS），安装组件，编写页面代码。"
---

# KESI UI 实现

接收页面设计报告，用组件实现具体页面。

> **组件索引：** [references/INDEX.md](references/INDEX.md) — 必须先读索引选择组件，再按需 Read 对应文档。不要一次性读取所有 54 个文件。

---

## 输入验证

### 从 kesi-frontend 接收

1. `design-report.json` — 页面设计报告
2. 项目目录路径

### 验证清单

1. ✅ `design-report.json` 存在且可解析
2. ✅ `version` 为 `"1.0"`
3. ✅ `pages` 数组非空
4. ✅ 项目目录存在且包含 `package.json`、`tsconfig.json`
5. ✅ `components.json` 存在（shadcn registry 配置）

任何验证失败 → 报告缺失项，不继续。

---

## 执行流程

```
━━━ kesi-ui ━━━
📋 共 N 个页面待实现
━━━━━━━━━━━━━━
```

**生成任何代码之前，必须完成以下步骤：**

```
1. 分析需求 → 识别每个页面需要的组件类型
2. 读索引   → Read: references/INDEX.md
3. 检查已装 → Glob: src/components/kesi/**/index.tsx，排除已安装的组件
4. 定位分类 → 通过前缀（form-/view-/gis-）筛选对应文件
5. 匹配组件 → 从 INDEX.md 中选取最匹配的组件（单次推荐不超过 3 个）
6. 读文档   → Read 推荐组件的完整文档，重点看「适用场景」和「Props 参数」
7. 安装组件 → 批量安装（见下方优化策略）
8. 写入代码 → Write/Edit 创建或修改项目文件
```

### 强制确认点

| 步骤 | 检查点 | 需要用户确认 |
|------|--------|------------|
| 1-3（分析+索引+检查） | 汇总已识别的组件清单 | ✅ 是 |
| 4-6（定位+匹配+读文档） | 输出推荐组件列表和理由 | ✅ 是 |
| 7（安装） | 输出安装结果 | ❌ 否（自动） |
| 8（写代码） | 输出修改文件清单 | ❌ 否（自动） |

---

## 项目上下文（代码生成前必须执行）

```bash
# 1. 路径别名
npx shadcn@latest info --json 2>/dev/null | head -50

# 2. 已安装组件清单
ls src/components/kesi/*/index.tsx 2>/dev/null || echo "无已安装 kesi 组件"

# 3. 依赖版本
cat package.json | grep -E '"@kesi|"react"|"react-dom"|"tailwindcss"'
```

---

## 组件分类与命名规则

| 前缀 | 分类 | 数量 | 适用场景 |
|------|------|------|---------|
| `form-*` | 表单 | 30 | 输入、选择、日期、上传、富文本、滑块 |
| `view-*` | 视图 | 11 | 数据表格、分页、过滤、批量操作、详情 |
| `gis-*` | GIS | 10 | 地图、图层、绘制、瓦片、GeoJSON |

> **图表不提供内置组件。** 需要图表时直接使用 `echarts`（`import * as echarts from 'echarts'`）。

> `form.md` 是表单根组件（无前缀）。

---

## 页面级组件选型决策表

> 从 design-report.json 获得每个页面的 `mode` 字段，按下表选择组件方案。

| 页面交互模式 | 组件方案 | 数据源 | 需安装的组件 |
|-------------|---------|--------|------------|
| **纯展示**（仪表盘） | shadcn Card + echarts | `createAPI` | 无（echarts 手动 import） |
| **带过滤的展示**（默认） | shadcn Table + 自定义 Filter + createAPI | `createAPI` | 无（shadcn 基础组件） |
| **CRUD 管理**（用户指定） | ViewModel 视图系统 | `ViewModel` | view-model, view-data-table, view-filter, view-pagination, view-actions |
| **地图展示** | GIS 组件系统 | `createAPI` | gis-map-core, gis-xyz-tile + 业务图层 |

### 何时使用 ViewModel（仅限用户明确要求 CRUD 时）

| 使用场景 | 说明 |
|----------|------|
| ✅ 需要增删改查的数据管理页 | ViewModel 提供 ViewActions 自动处理 |
| ✅ 需要过滤+分页+排序+CRUD 的完整列表页 | ViewModel 自动处理所有功能 |

---

## 组合系统指南

> 组合系统的组件必须完整配套使用，不可遗漏。

### 视图组件系统

> 完整指南: [references/system-view.md](references/system-view.md)

**核心规则**: 所有视图组件必须在 `ViewModel` 容器内使用。

```
ViewModel (容器)
  ├─ ViewFilter (过滤器)
  ├─ ViewDataTable (数据表格)
  ├─ ViewPagination (分页器)
  └─ ViewActions (操作栏)
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

### GIS 组件系统

> 完整指南: [references/system-gis.md](references/system-gis.md)

**核心规则**: `GisMapCore` 作为最外层容器。

```
GisMapCore (地图容器)
  ├─ GisXyzTile (底图瓦片)
  ├─ GisCustomLayer (自定义图层)
  └─ GisPolygonDraw (绘制工具)
```

### 与 shadcn/ui 互操作

- 容器/布局 → 优先用 shadcn（Card, Dialog, Sheet 等）
- 表单/数据/视图 → 优先用 kesi（ViewModel, FormInput 等）

---

## 组件安装优化

### 批量安装（推荐）

```bash
# ✅ 一次命令安装多个组件
npx shadcn@latest add @kesi/view-model @kesi/view-data-table @kesi/view-filter @kesi/view-pagination @kesi/view-actions

# ✅ 批量安装表单组件
npx shadcn@latest add @kesi/form-input @kesi/form-select @kesi/form-date
```

### 降级策略

1. 批量安装失败 → 逐个安装，定位问题组件
2. 单个组件安装失败 → 跳过，使用 shadcn/ui 基础组件替代
3. registry 不可达 → 检查 `npx shadcn@latest info --json` 中的 registry 配置

---

## 文件操作安全规则

1. **新增文件**：直接 Write（目标文件不存在时）
2. **修改已有文件**：必须使用 Edit（不是 Write），保留未改动部分
3. **覆盖已有文件**：必须先 Read 确认内容，告知用户将被覆盖的部分，获得确认后才能 Write

---

## 错误处理等级

| 等级 | 场景 | AI 行为 |
|------|------|---------|
| 🔴 阻断 | 项目目录不存在、registry 不可达 | 停止，报告原因 |
| 🟡 可恢复 | 单个组件安装失败、单页面生成失败 | 跳过，继续其他，最后汇总 |
| 🟢 可忽略 | 非关键样式缺失 | 记录到报告，继续 |

---

## 代码生成策略

当需要生成 > 5 个页面时：
1. 先生成所有页面的骨架（import + 组件结构 + export）
2. 再逐个填充完整逻辑
3. 每个页面生成后检查 import 路径正确性

---

## 兜底策略

> 如果 INDEX.md 扫描后未找到匹配的组件，读取最相关分类的系统指南（`system-*.md`）查找子组件。

---

## 输出格式

完成代码写入后，输出以下摘要：

```markdown
## 需求分析
[分析每个页面的组件类型需求]

## 推荐组件
- `@kesi/ComponentName` - 适用场景说明

## 已安装
- @kesi/ComponentName

## 已修改/新增文件
- src/pages/xxx.tsx (新增)
- src/pages/yyy.tsx (修改)

## 安装命令
npx shadcn@latest add @kesi/ComponentName ...

📊 执行摘要
- 页面数: N 个（成功 M 个，跳过 K 个）
- 安装组件: X 个
- 新增文件: Y 个
- 修改文件: Z 个
```

---

## 关键约束

1. **先读索引再读文档再生成代码** — 所有 Props 必须来自实际文档，绝不猜测
2. **组合系统必须配套** — 视图/GIS 组件不可遗漏必需组件
3. **不重复安装已装组件** — 步骤 3 已排除，安装命令只包含未安装的组件
4. **使用 TypeScript** — 所有代码必须包含类型
5. **明确告知错误用法** — 遇到 Model 嵌套 ViewModel 等错误用法时提醒
