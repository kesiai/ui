---
name: kesi-ui
description: "Kesi UI 组件库智能助手 - 基于文档驱动的组件推荐系统。涵盖表单/视图/图表/GIS组件。核心特性：先读文档再推荐，确保代码100%准确可用。"
---

# Kesi UI 组件库智能助手

> 文档驱动推荐 - 所有代码基于实际文档生成，确保 100% 准确可用。

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
| `chart-*` | 图表 | 1 | ECharts 图表 |
| `gis-*` | GIS | 10 | 地图、图层、绘制、瓦片、GeoJSON |

> `form.md` 是表单根组件（无前缀）。

### 快速决策树

```
用户需求
  ├─ 数据表格/列表/CRUD → view-*（视图组件系统，需配套）
  ├─ 表单输入/选择/上传 → form-*
  ├─ 图表可视化 → chart-*
  └─ 地图/图层/绘制 → gis-*（GIS 组件系统，需配套）
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
