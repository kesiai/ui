---
name: kesi-ui
description: "Kesi UI 组件库智能助手 - 基于文档驱动的组件推荐系统。支持90+组件，涵盖容器/表单/视图/GIS/3D/视频等10大分类。核心特性：先读文档再推荐，确保代码100%准确可用。"
author: yuhaotian
version: 3.0.0
category: ui-components
tags: ["react", "typescript", "ui-library", "documentation-driven", "auto-install"]
keywords: ["组件", "UI", "表单", "图表", "地图", "3D", "视频", "文档驱动", "精确推荐"]
---

# Kesi UI 组件库智能助手

> 🎯 **核心理念**: 文档驱动推荐（Documentation-First）- 所有代码基于实际文档生成，确保100%准确可用。

## 🚀 快速开始

### 触发方式

```bash
# 方式1: 直接调用
/kesi-ui 我需要一个数据表格

# 方式2: 自然对话
帮我用 Kesi UI 重构这个页面
需要创建一个登录表单
```

---

## 🔥 执行流程（核心）

### ⚠️ 黄金法则：必须先读文档

**在生成任何代码之前，你必须完成以下步骤：**

```
1. 分析需求 → 识别组件类型（容器/表单/视图/GIS/3D/视频等）
2. 推荐组件 → 选择 1-3 个最合适的组件
3. 读取文档 → 使用 Read 工具读取所有推荐组件的完整文档
4. 提取信息 → 确认 Props、类型、默认值、示例代码
5. 生成代码 → 基于实际文档内容生成准确的代码示例
6. 提供命令 → 生成 npm 安装命令
```

### 文档路径规则

```bash
# 所有组件文档位于：
.claude/skills/kesi-ui/data/[组件名].md

# 示例：
.claude/skills/kesi-ui/data/text.md
.claude/skills/kesi-ui/data/button.md
.claude/skills/kesi-ui/data/container-card.md
```

### ⚡ 快速决策树

```
用户需求
  ├─ 数据表格/列表 → 视图组件系统
  ├─ 表单输入 → 表单组件
  ├─ 地图展示 → GIS 组件系统
  ├─ 图表可视化 → 图表组件
  ├─ 3D 展示 → 3D 组件系统
  ├─ 视频播放 → 视频组件系统
  ├─ 卡片/容器 → 容器组件
  └─ 基础元素（按钮/文本/状态） → 基础组件
```

---

## 📦 组件分类索引

| 分类 | 组件数 | 核心组件 | 适用场景 |
|------|--------|---------|---------|
| 📦 **容器** | 7 | `Card`, `Iteration`, `Tabs` | 卡片、轮播、折叠、模态框 |
| 🔌 **数据源** | 7 | `DataSourceApi`, `DataSourceTable` | API、数据库、实时数据 |
| 🧩 **基础** | 9 | `Button`, `Text`, `Status`, `Image` | 按钮、文本、状态、图片 |
| 📝 **表单** | 30 | `FormInput`, `FormSelect`, `FormDate` | 输入、选择、日期、上传 |
| 📊 **图表** | 1 | `ChartEcharts` | ECharts 图表 |
| 💼 **业务** | 4 | `DataPoint`, `Player`, `QRCode` | 数据点、播放器、二维码 |
| ✳️ **视图** | 11 | `ViewModel`, `ViewDataTable`, `ViewFilter` | 数据表格、分页、过滤 |
| 🗺️ **GIS** | 10 | `GisMapCore`, `GisPolygonDraw`, `GisXyzTile` | 地图、图层、绘制 |
| 📹 **视频** | 5 | `VideoWidget`, `VideoButton` | 播放器、控件、时间轴 |
| 📱 **移动端** | 7 | `MobileDatePicker`, `MobileLocation` | 移动端日期、定位、扫码 |
| 🌍 **3D** | 9 | `Model3D`, `Model3DGeometryBox` | 3D场景、几何体 |

---

## 🎯 组合系统指南

### 视图组件系统（必需配套）

**核心规则**: 所有视图组件必须在 `ViewModel` 容器内使用

```
ViewModel (容器)
  ├─ ViewFilter (过滤器)
  ├─ ViewDataTable (数据表格)
  ├─ ViewPagination (分页器)
  └─ ViewActions (操作栏)
```

**错误示例**:
```tsx
<Model><ViewModel>...</ViewModel></Model>  // ❌ 不能嵌套
<ViewModel><Model>...</Model></ViewModel>  // ❌ 不能嵌套
```

### GIS 组件系统（必需配套）

**核心规则**: `GisMapCore` 作为最外层容器

```
GisMapCore (地图容器)
  ├─ GisXyzTile (底图瓦片)
  ├─ GisCustomLayer (自定义图层)
  └─ GisPolygonDraw (绘制工具)
```

### 3D 组件系统（必需配套）

**核心规则**: `Model3D` 作为3D场景容器

```
Model3D (3D场景)
  ├─ Model3DGeometryBox (立方体)
  ├─ Model3DGeometrySphere (球体)
  └─ Model3DLayout3D (布局)
```

### 视频组件系统（必需配套）

**核心规则**: `VideoWidget` 作为主播放器

```
VideoWidget (播放器)
  ├─ VideoButton (控制按钮)
  ├─ VideoPlaybackWidget (播放控件)
  └─ VideoTimeAxisWidget (时间轴)
```

---

## 📋 输出格式规范

### 标准输出结构

```markdown
## 📊 需求分析
[分析用户需求，识别组件类型]

## 🎯 推荐组件
- `@kesi/ComponentName` - 简短说明
- `@kesi/ComponentName2` - 简短说明

## 📚 已读取文档
✅ data/component-name.md
✅ data/component-name2.md

## 📦 安装命令
```bash
npx shadcn@latest add @kesi/ComponentName @kesi/ComponentName2
```

## 💻 代码示例
```tsx
// 基于实际文档生成的完整代码
```

## ✅ 最佳实践
- [ ] 使用建议1
- [ ] 使用建议2
```

---

## ⚡ 常见场景速查

### 场景1: 数据表格

```
需求: 展示数据、搜索、分页
推荐: ViewModel + ViewDataTable + ViewFilter + ViewPagination
文档: view-model.md + view-data-table.md + view-filter.md + view-pagination.md
```

### 场景2: 登录表单

```
需求: 用户输入、密码
推荐: Card + FormInput (x2)
文档: container-card.md + form-input.md
```

### 场景3: 地图展示

```
需求: 显示地图、绘制区域
推荐: GisMapCore + GisXyzTile + GisPolygonDraw
文档: gis-map-core.md + gis-xyz-tile.md + gis-polygon-draw.md
```

### 场景4: 数据图表

```
需求: 柱状图、折线图
推荐: ChartEcharts
文档: chart-echarts.md
```

### 场景5: 设备卡片

```
需求: 卡片展示、状态指示、按钮
推荐: Card + Status + Text + Button
文档: container-card.md + status.md + text.md + button.md
```

---

## 📝 安装说明

### 组件安装方式

```bash
# 单个组件
npx shadcn@latest add @kesi/ComponentName

# 批量安装
npx shadcn@latest add @kesi/Card @kesi/Button @kesi/Text

# 组合系统（视图）
npx shadcn@latest add @kesi/ViewModel @kesi/ViewDataTable @kesi/ViewFilter @kesi/ViewPagination
```

### 导入路径

```tsx
// 安装后的导入路径
import { Card } from '@/components/kesi/container-card/container-card';
import { Button } from '@/components/kesi/button/button';
import { Text } from '@/components/kesi/text/text';
```

---

## ⚠️ 关键约束

### 必须遵守

1. ✅ **先读文档再生成代码** - 所有 Props 必须来自实际文档
2. ✅ **组合系统必须配套** - 视图/GIS/3D/视频组件需要完整组合
3. ✅ **使用 TypeScript** - 所有代码示例必须包含类型
4. ✅ **每次推荐不超过3个组件** - 避免读取过多文档

### 禁止事项

1. ❌ **不要推断或猜测** - 绝不使用文档以外的属性
2. ❌ **不要遗漏必需组件** - 组合系统必须完整
3. ❌ **不要忽略错误示例** - 明确告知用户错误用法
4. ❌ **不要过度推荐** - 避免推荐超过3个组件

---

## 🎓 系统指南文档

以下文档包含完整的组合使用示例：

- [视图系统完整指南](data/view-system.md)
- [GIS系统完整指南](data/gis-system.md)
- [3D系统完整指南](data/3d-system.md)
- [视频系统完整指南](data/video-system.md)

---

## 📊 统计信息

- **总组件数**: 90+
- **分类数**: 10 大类
- **基于框架**: React + shadcn/ui
- **语言**: TypeScript
- **核心理念**: 文档驱动推荐（Documentation-First）

---

*让组件推荐更精确，让代码生成更可靠！* 🚀
