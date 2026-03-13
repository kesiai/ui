---
name: airiot-ui
description: "Airiot UI 组件库助手 - 智能选择组件并自动生成安装命令。支持98+个组件，涵盖容器、表单、数据源、视图、GIS、视频、3D、移动端等10大分类，提供完整的组件文档和组合系统指南。自动检测使用的组件并生成对应的npm安装命令，一键安装所有依赖。"
author: yuhaotian
version: 2.0.0
category: ui-components
tags: ["react", "typescript", "ui-library", "components", "auto-install", "code-generation"]
keywords: ["组件", "UI", "表单", "图表", "地图", "3D", "视频", "移动端", "视图系统", "GIS系统", "组件安装", "代码生成"]
---

# Airiot UI 组件库助手

这个技能帮助你根据业务需求选择合适的 Airiot UI 组件，并提供完整的使用指南。

## 🎯 功能特性

- **智能需求分析** - 自动分析你的描述并推荐最合适的组件
- **详细文档** - 每个组件都有完整的 Props 说明和代码示例
- **组合组件支持** - 为复杂组件系统提供完整的搭配方案
- **最佳实践** - 提供性能优化和使用建议

## 🚀 使用方法

直接描述你的需求，例如：
- "我需要一个用户登录表单"
- "要展示数据表格，支持搜索和分页"
- "需要实现一个地图展示功能"
- "要做一个视频播放器"
- "需要创建一个复杂的数据录入表单"

## 📦 组件安装说明

> **重要**: 本技能生成的代码中使用的组件需要先通过以下方式安装到你的项目中。

### 安装方式

所有组件都发布为 `@airiot/ComponentName` 格式的 npm 包，基于 shadcn/ui 构建。

#### 单个组件安装

```bash
# 安装单个组件
npx shadcn@latest add @airiot/ComponentName
```

#### 批量安装

```bash
# 一次性安装多个组件
npx shadcn@latest add @airiot/Carousel @airiot/ContainerCard @airiot/ViewModel
```

### 安装示例

当技能生成页面代码时，会在代码前显示需要安装的组件清单：

```bash
## 需要安装的组件

- @airiot/Carousel
- @airiot/ContainerCard
- @airiot/ViewModel
- @airiot/ViewDataTable
```

你只需复制这些安装命令并执行即可。

### 组件使用

安装完成后，就可以在代码中使用：

```tsx
import { Carousel } from '@/components/airiot/container-carousel';
import { ViewModel } from '@/components/airiot/view-model/view-model';

function Example() {
  return (
    <Carousel>...</Carousel>
    <ViewModel>...</ViewModel>
  );
}
```

### 注意事项

1. **先安装再使用**: 所有组件必须先通过 `npx shadcn@latest add` 命令安装
2. **路径配置**: 安装后组件会自动添加到正确的导入路径
3. **shadcn/ui**: 确保你的项目已配置 shadcn/ui
4. **组件文档**: 点击组件名链接可查看详细文档

## 📦 组件分类

### 📦 容器组件 (8个)
将相关内容组织在一起，提供不同的展示形式

**用途**: 将一组相关的数据或业务组织在一起，提供不同的展示形式

**适用场景**:
- 需要将多个相关内容展示在一个卡片中
- 需要轮播展示多个内容
- 需要标签页切换不同内容
- 需要弹窗显示内容
- 需要浮层提示
- 需要上下文共享
- 需要迭代渲染列表

**主要组件**:
- [`Card`](data/container-card.md) - 卡片容器，支持标题、边框、内边距
- [`Carousel`](data/container-carousel.md) - 轮播容器，支持自动播放、指示器
- [`ContainerContextProvider`](data/container-context-provider.md) - 上下文提供者容器，跨组件共享状态
- [`ContainerIteration`](data/container-iteration.md) - 迭代容器，循环渲染子组件
- [`Modal`](data/container-modal.md) - 模态框容器，弹出式对话框
- [`Panel`](data/container-panel.md) - 面板容器，手风琴式折叠展开
- [`Popover`](data/container-popover.md) - 浮层容器，点击/悬停触发
- [`Tabs`](data/container-tabs.md) - 标签页容器，多标签切换

### 🔌 数据源组件 (7个)
提供数据查询能力，连接不同类型的数据源

**用途**: 提供数据查询能力，连接不同类型的数据源

**适用场景**:
- 需要从API获取数据
- 需要读取历史数据
- 需要连接实时数据流
- 需要操作数据库表
- 需要处理消息数据
- 需要调用接口
- 需要查询视图

**主要组件**:
- [`DataSourceApi`](data/datasource-api.md) - API数据源，RESTful API接口
- [`DataSourceHistory`](data/datasource-history.md) - 历史数据源，本地历史数据管理
- [`DataSourceInterface`](data/datasource-interface.md) - 接口数据源，动态接口调用
- [`DataSourceMessage`](data/datasource-message.md) - 消息数据源，实时消息处理
- [`DataSourceRealtime`](data/datasource-realtime.md) - 实时数据源，WebSocket连接
- [`DataSourceTable`](data/datasource-table.md) - 数据表源，数据库表操作
- [`DataSourceView`](data/datasource-view.md) - 视图数据源，数据库视图查询

### 🧩 基础组件 (9个)
显示基础数据和内容

**用途**: 显示基础数据和内容

**适用场景**:
- 显示文本、图片
- 显示状态指示器
- 显示SVG图标
- 显示iframe内容
- 连接小部件
- 展示进度条
- 多行文本输入

**主要组件**:
- [`Bar`](data/bar.md) - 条形组件，进度条和数据展示
- [`Button`](data/button.md) - 按钮，各种交互操作
- [`ConnectWidget`](data/connect-widget.md) - 连接组件，状态连接指示
- [`Iframe`](data/iframe.md) - 内嵌框架，外部内容嵌入
- [`Image`](data/image.md) - 图片，图片展示组件
- [`Status`](data/status.md) - 状态指示器，状态展示
- [`Svg`](data/svg.md) - SVG组件，矢量图标
- [`Text`](data/text.md) - 文本，基础文本展示
- [`Textarea`](data/textarea.md) - 文本域，多行文本输入

### 📝 表单组件 (16个)
数据输入和表单处理

**用途**: 数据输入和表单处理，包含基础字段和业务特定字段

**适用场景**:
- 用户输入数据
- 选择选项（下拉、单选、多选）
- 日期时间选择
- 文件上传
- 表格编辑
- 地理位置选择
- 富文本编辑
- 评分输入
- 滑块调整

**主要组件**:
- [`FormArea`](data/form-area.md) - 表单域组件，表单区域分组
- [`FormBytesArray`](data/form-bytes-array.md) - 字节数组，二进制数据输入
- [`FormCheckbox`](data/form-checkbox.md) - 复选框，多选输入
- [`FormDate`](data/form-date.md) - 日期选择器，日期输入
- [`FormDateRange`](data/form-date-range.md) - 日期范围，时间段选择
- [`FormEditableTable`](data/form-editable-table.md) - 可编辑表格，内联编辑
- [`FormField`](data/form-field.md) - 表单字段，字段级组件
- [`FormFormInfo`](data/form-form-info.md) - 表单信息，元数据展示
- [`FormInput`](data/form-input.md) - 输入框，基础文本输入
- [`FormInputNumber`](data/form-input-number.md) - 数字输入，数值输入
- [`FormLink`](data/form-link.md) - 链接输入，URL输入
- [`FormMap`](data/form-map.md) - 地图选择，地理位置选择
- [`FormRadio`](data/form-radio.md) - 单选框，单选输入
- [`FormRate`](data/form-rate.md) - 评分，星级评分
- [`FormRichText`](data/form-rich-text.md) - 富文本，富文本编辑
- [`FormSchema`](data/schema-form.md) - 表单模式，JSON Schema驱动
- [`FormSelect`](data/form-select.md) - 选择器，下拉选择
- [`FormSerialNumber`](data/form-serial-number.md) - 序列号，序号生成
- [`FormSlider`](data/form-slider.md) - 滑块，范围选择
- [`FormSwitch`](data/form-switch.md) - 开关，状态切换
- [`FormTableDataSelect`](data/table-data-select.md) - 表数据选择，表格数据选择
- [`FormTableSelect`](data/table-select.md) - 表格选择，表格数据选取
- [`FormTime`](data/form-time.md) - 时间选择器，时间输入
- [`FormUpload`](data/form-upload.md) - 文件上传，文件上传组件
- [`FormUserRole`](data/form-user-role.md) - 用户角色，角色选择
- [`FormWidget`](data/form-widget.md) - 表单控件，自定义控件

### 📊 图表组件 (1个)
数据可视化展示

**用途**: 使用ECharts将数据可视化

**适用场景**:
- 需要展示各种类型的图表
- 需要交互式图表
- 需要自定义图表样式
- 实时数据监控

**主要组件**:
- [`ChartEcharts`](data/chart-echarts.md) - ECharts图表，数据可视化图表

### 💼 业务组件 (4个)
特定业务场景的组件

**用途**: 特定业务场景的组件

**适用场景**:
- 展示数据点信息
- 展示数据集视图
- 生成二维码
- 音视频播放

**主要组件**:
- [`DataPoint`](data/data-point.md) - 数据点，数据展示点
- [`DataViewChart`](data/data-view-chart.md) - 数据视图图表，业务数据图表
- [`Player`](data/player.md) - 播放器，音视频播放
- [`QRCode`](data/qrcode.md) - 二维码，二维码生成和扫描

### ✳️ 视图组件 (11个)
展示数据库数据的完整视图系统

**用途**: 展示数据库数据的完整视图系统

**适用场景**:
- 列表展示数据
- 数据过滤和搜索
- 数据分页
- 数据详情展示
- 批量操作
- 数据增删改查
- 数据聚合统计

**注意**: 视图组件是一个组合系统，需要搭配使用

**组合使用文档**: [视图系统完整指南](data/view-system.md) - 包含所有组件的组合示例和最佳实践

**主要组件**:
- [`ViewActions`](data/view-actions.md) - 视图操作，批量操作组件
- [`ViewAdvancedFilter`](data/view-advanced-filter.md) - 高级过滤器，复杂条件过滤
- [`ViewBatch`](data/view-batch.md) - 批量操作，批量数据处理
- [`ViewDataAggregate`](data/view-data-aggregate.md) - 数据聚合，数据统计
- [`ViewDataTable`](data/view-data-table.md) - 数据表格，核心表格组件
- [`ViewDetail`](data/view-detail.md) - 详情视图，详细信息展示
- [`ViewField`](data/view-field.md) - 视图字段，字段展示
- [`ViewFilter`](data/view-filter.md) - 过滤器，数据过滤
- [`ViewModel`](data/view-model.md) - 视图模型，数据模型展示
- [`ViewPagination`](data/view-pagination.md) - 分页器，数据分页
- [`ViewTools`](data/view-tools.md) - 视图工具，辅助工具

### 🗺️ GIS组件 (10个)
地理信息系统组件

**用途**: 地理信息系统组件

**适用场景**:
- 展示地图
- 绘制地理要素
- 加载不同地图图层
- 地理数据处理
- 地理信息编辑

**注意**: GIS组件是组合系统，需要搭配使用

**组合使用文档**: [GIS系统完整指南](data/gis-system.md) - 包含地图、图层、绘制工具等组件的组合示例和最佳实践

**主要组件**:
- [`GisCodeEditor`](data/gis-code-editor.md) - GIS代码编辑器，代码编辑工具
- [`GisCustomLayer`](data/gis-custom-layer.md) - 自定义图层，自定义地图图层
- [`GisGeojsonParse`](data/gis-geojson-parse.md) - GeoJSON解析，地理数据解析
- [`GisGeoserverWMS`](data/gis-geoserver-wms.md) - GeoServer WMS，地图服务
- [`GisKmzLoader`](data/gis-kmz-loader.md) - KMZ加载器，地理数据加载
- [`GisMapCore`](data/gis-map-core.md) - 地图容器，核心地图组件
- [`GisPolygonDraw`](data/gis-polygon-draw.md) - 多边形绘制，绘制工具
- [`GisTableLayer`](data/gis-table-layer.md) - 表格图层，数据表格图层
- [`GisWarnLayer`](data/gis-warn-layer.md) - 警告图层，警告信息展示
- [`GisXyzTile`](data/gis-xyz-tile.md) - XYZ瓦片，地图瓦片服务

### 📹 视频组件 (5个)
视频播放和控件

**用途**: 视频播放和控件

**适用场景**:
- 视频播放
- 视频时间轴控制
- 视频片段标记
- 视频时段管理

**注意**: 视频组件是组合系统，需要搭配使用

**组合使用文档**: [视频系统完整指南](data/video-system.md) - 包含播放器、控件、时间轴等组件的组合示例

**主要组件**:
- [`VideoButton`](data/video-button.md) - 视频控制按钮，播放控制
- [`VideoPeriodsWidget`](data/video-periods-widget.md) - 视频时段，时间段管理
- [`VideoPlaybackWidget`](data/video-playback-widget.md) - 播放控件，播放控制界面
- [`VideoTimeAxisWidget`](data/video-time-axis.md) - 时间轴，时间线展示
- [`VideoWidget`](data/video-widget.md) - 视频播放器，主播放组件

### 📱 移动端组件 (7个)
移动端UI组件

**用途**: 移动端UI组件

**适用场景**:
- 移动端页面布局
- 移动端日期选择
- 移动端地理位置
- 移动端扫码
- 移动端导航

**主要组件**:
- [`MobileCalendar`](data/mobile-calendar.md) - 日历，移动端日历
- [`MobileDatePicker`](data/mobile-date-picker.md) - 日期选择器，移动端日期选择
- [`MobileLocation`](data/mobile-location.md) - 定位，地理位置定位
- [`MobileNavBar`](data/mobile-nav-bar.md) - 导航栏，移动端导航
- [`MobilePicker`](data/mobile-picker.md) - 选择器，移动端选择器
- [`MobilePopup`](data/mobile-popup.md) - 弹出层，移动端弹窗
- [`MobileScanQR`](data/mobile-scan-qr.md) - 扫描二维码，二维码扫描

### 🌍 3D组件 (11个)
3D模型展示和交互

**用途**: 3D模型展示和交互

**适用场景**:
- 展示3D模型
- 几何体展示
- 3D场景布局
- 3D数据可视化

**注意**: 三维组件是组合系统，需要搭配使用

**组合使用文档**: [3D系统完整指南](data/3d-system.md) - 包含3D场景、几何体、布局等组件的组合示例和最佳实践

**主要组件**:
- [`Model3D`](data/model3d.md) - 3D场景容器，核心3D场景
- [`Model3DGeometryBox`](data/model3d-geometry-box.md) - 立方体，3D立方体
- [`Model3DGeometryCircle`](data/model3d-geometry-circle.md) - 圆形，3D圆形
- [`Model3DGeometryCone`](data/model3d-geometry-cone.md) - 圆锥，3D圆锥
- [`Model3DGeometryCylinder`](data/model3d-geometry-cylinder.md) - 圆柱，3D圆柱
- [`Model3DGeometryPlane`](data/model3d-geometry-plane.md) - 平面，3D平面
- [`Model3DGeometrySphere`](data/model3d-geometry-sphere.md) - 球体，3D球体
- [`Model3DGeometryTube`](data/model3d-geometry-tube.md) - 管道，3D管道
- [`Model3DLayout3D`](data/model3d-layout3d.md) - 3D布局，3D空间布局
- [`Model3DCard`](data/model3d-card.md) - 3D卡片，3D卡片展示

## 📋 选择组件的步骤

1. **分析需求**: 确定你需要做什么
2. **选择分类**: 根据功能选择组件分类
3. **查看组件**: 查看具体组件的文档和示例
4. **组合使用**: 对于组合组件，查看完整的使用示例

## 🎯 常见场景的组件选择

### 场景1: 需要展示数据表格
- **选择**: 视图组件
- **主要**: `ViewModel` 作为视图容器
- **搭配**: `ViewDataTable` 表格容器、`ViewFilter` 过滤器、`ViewPagination` 分页器、`ViewActions` 操作栏

### 场景2: 需要地图展示
- **选择**: GIS组件
- **主要**: `GisMapCore` 作为地图容器
- **搭配**: 根据需要添加图层组件（`GisCustomLayer`、`GisPolygonDraw`等）

### 场景3: 需要表单输入
- **选择**: 表单组件
- **基础输入**: `FormInput`、`FormInputNumber`
- **选择器**: `FormSelect`、`FormRadio`、`FormCheckbox`
- **日期时间**: `FormDate`、`FormDateRange`、`FormTime`
- **高级**: `FormRichText`、`FormUpload`

### 场景3.1: 需要使用视图组件
- **选择**: 视图组件
- **容器**: `ViewModel` 必须作为最外层容器
- **内容**: 所有视图组件（ViewDataTable、ViewFilter等）都在 ViewModel 内使用

### 场景4: 需要数据可视化
- **选择**: 图表组件
- **主要**: `ChartEcharts`
- **支持**: 折线图、柱状图、饼图、散点图等所有ECharts类型

### 场景5: 需要3D展示
- **选择**: 三维组件
- **主要**: `Model3D` 作为3D场景容器
- **搭配**: 各种几何体组件（`Model3DGeometryBox`、`Model3DGeometrySphere`等）

### 场景6: 需要视频播放
- **选择**: 视频组件
- **主要**: `VideoWidget` 作为视频播放器
- **搭配**: `VideoButton` 控制按钮、`VideoPlaybackWidget` 播放控件

## 📝 输出示例

当你描述需求时，我会提供：

1. **需求分析** - 提取关键词和推荐分类
2. **推荐组件** - 按优先级排序的组件列表
3. **详细说明** - 每个组件的用途和Props
4. **代码示例** - 完整的使用代码
5. **最佳实践** - 使用建议和注意事项

## ⚠️ 注意事项

- **组合组件**: GIS、3D、视图、视频等组件需要搭配使用
- **视图组件**: 所有视图组件都必须在 ViewModel 容器下使用
- **移动端组件**: 主要在移动端环境中使用
- **依赖要求**: 部分组件需要额外依赖（如ECharts、Three.js）
- **性能优化**: 大数据量时注意性能优化

## 📊 统计信息

- **总计组件**: 68+ 个
- **覆盖分类**: 10个大类
- **支持语言**: TypeScript
- **更新频率**: 持续迭代更新

---

*使用这个技能，让组件选择变得简单高效！*