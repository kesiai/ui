# KESI UI 组件索引

> AI Agent 先读本索引选择组件，再按需 Read 对应的完整文档。不要一次性读取所有文件。
> 安装命令统一格式：`npx shadcn@latest add @kesi/<组件名>`

---

## 表单组件（form-*，30 个 + 1 容器）

### 容器

| 组件 | 文件 | 说明 |
|------|------|------|
| Form | [form.md](form.md) | 表单容器，React Hook Form 封装，4 种验证模式 + 7 种预设布局 |

### 输入类

| 组件 | 文件 | 说明 | 适用场景 |
|------|------|------|---------|
| FormInput | [form-input.md](form-input.md) | 输入框，单行/多行文本域 | text/password/email/url/phone |
| FormInputNumber | [form-input-number.md](form-input-number.md) | 数字输入框，精度控制 | 数值、小数、步进 |
| FormTextarea | [form-textarea.md](form-textarea.md) | 多行文本 | 长文本、备注 |
| FormSlider | [form-slider.md](form-slider.md) | 滑动输入条 | 范围选择、百分比 |
| FormRate | [form-rate.md](form-rate.md) | 星级评价 | 评分、满意度 |
| FormSwitch | [form-switch.md](form-switch.md) | 开关切换 | 布尔值、启停 |
| FormSerialNumber | [form-serial-number.md](form-serial-number.md) | 自动序列号 | 编号、ID 自动生成 |

### 选择类

| 组件 | 文件 | 说明 | 适用场景 |
|------|------|------|---------|
| FormSelect | [form-select.md](form-select.md) | 下拉框（4 种样式变体） | 单选/多选下拉 |
| FormCheckbox | [form-checkbox.md](form-checkbox.md) | 复选框（单选/多选/全选） | 多选项 |
| FormRadio | [form-radio.md](form-radio.md) | 单选按钮组 | 少量互斥选项 |
| FormDate | [form-date.md](form-date.md) | 日期选择器（7 种模式） | date/time/datetime/week/month/quarter/year |
| FormTime | [form-time.md](form-time.md) | 时间选择器（原生） | HH:mm / HH:mm:ss |
| FormDateRange | [form-date-range.md](form-date-range.md) | 日期范围选择器 | 开始-结束日期 |
| FormArea | [form-area.md](form-area.md) | 省市区三级联动 | 地区选择 |

### 关联/引用类

| 组件 | 文件 | 说明 | 适用场景 |
|------|------|------|---------|
| FormRelate | [form-relate.md](form-relate.md) | 关联字段（单选/多选） | 表间单条/多条关联 |
| FormRelatePlus | [form-relate-plus.md](form-relate-plus.md) | 增强关联字段 | 下拉/弹窗/卡片/表格 4 种选择模式 |
| FormReference | [form-reference.md](form-reference.md) | 查找引用 | 计算记录引用结果展示 |
| FormTableSelect | [form-table-select.md](form-table-select.md) | 表选择器 | 选择系统中的数据表 |
| FormTableDataSelect | [form-table-data-select.md](form-table-data-select.md) | 表记录选择器 | 从指定表选择数据记录 |
| FormUserRole | [form-user-role.md](form-user-role.md) | 用户角色选择 | 系统用户选择 |

### 文件/内容类

| 组件 | 文件 | 说明 | 适用场景 |
|------|------|------|---------|
| FormUpload | [form-upload.md](form-upload.md) | 文件上传 | 图片/视频/音频/文件 |
| FormRichText | [form-rich-text.md](form-rich-text.md) | 富文本编辑器（CKEditor 5） | HTML 内容编辑 |
| FormLink | [form-link.md](form-link.md) | 链接输入 | 内部菜单链接 / 外部 URL |
| FormMap | [form-map.md](form-map.md) | 地图定位（高德） | 经纬度选择 |
| FormEditableTable | [form-editable-table.md](form-editable-table.md) | 可编辑子表 | 动态行增删的表格 |
| FormBytesArray | [form-bytes-array.md](form-bytes-array.md) | 字节数组 | 二进制数据 |

### 智能映射

| 组件 | 文件 | 说明 | 适用场景 |
|------|------|------|---------|
| FormField | [form-field.md](form-field.md) | 通用字段（30+ 类型自动映射） | 根据 controlType 自动渲染 |
| FormWidget | [form-widget.md](form-widget.md) | 智能字段映射 | 自动检测字段类型渲染控件 |
| SchemaForm | [form-schema-form.md](form-schema-form.md) | JSON Schema 驱动表单 | 根据表 schema 自动生成表单 |
| FormFormInfo | [form-form-info.md](form-form-info.md) | 动态组件加载器 | 运行时动态加载自定义组件 |

---

## 视图组件（view-*，11 个 + 2 系统指南）

> **所有视图组件必须在 `ViewModel` 容器内使用。** 详见 [system-view.md](system-view.md)

| 组件 | 文件 | 说明 | 适用场景 |
|------|------|------|---------|
| ViewModel | [view-model.md](view-model.md) | 模型视图容器（核心） | CRUD 页面的最外层容器 |
| ViewDataTable | [view-data-table.md](view-data-table.md) | 数据表格（TanStack Table） | 数据列表展示 |
| ViewFilter | [view-filter.md](view-filter.md) | 自动筛选表单 | 根据 schema 自动生成过滤器 |
| ViewPagination | [view-pagination.md](view-pagination.md) | 分页器 | 数据分页展示 |
| ViewActions | [view-actions.md](view-actions.md) | CRUD 操作栏 | 新增/查看/编辑/删除/导出/复制 |
| ViewAdvancedFilter | [view-advanced-filter.md](view-advanced-filter.md) | 高级筛选（AND/OR） | 复杂多条件组合查询 |
| BatchActions | [view-batch.md](view-batch.md) | 批量操作 | 批量删除/批量修改 |
| ViewDataAggregate | [view-data-aggregate.md](view-data-aggregate.md) | 数据统计聚合 | 计数/求和/平均/分组统计 |
| ViewTools | [view-tools.md](view-tools.md) | 工具栏 | 记录数/每页条数/列显示控制 |
| ViewDemo | [view-demo.md](view-demo.md) | 综合演示 | 完整组合使用示例 |

### 系统指南

| 文件 | 说明 |
|------|------|
| [system-view.md](system-view.md) | 视图系统完整使用指南 — ViewModel 容器架构 |
| [system-gis.md](system-gis.md) | GIS 系统完整使用指南 — GisMapCore 容器架构 |

---

## GIS 组件（gis-*，10 个）

> **所有 GIS 组件必须以 `GisMapCore` 为核心容器。** 详见 [system-gis.md](system-gis.md)

| 组件 | 文件 | 说明 | 适用场景 |
|------|------|------|---------|
| GisMapCore | [gis-map-core.md](gis-map-core.md) | 2D 地图容器（核心） | GIS 页面的最外层容器 |
| GisXyzTile | [gis-xyz-tile.md](gis-xyz-tile.md) | XYZ 瓦片底图 | 标准瓦片底图服务 |
| GisCustomLayer | [gis-custom-layer.md](gis-custom-layer.md) | 自定义矢量图层 | 点/线/面/圆几何图形 |
| GisPolygonDraw | [gis-polygon-draw.md](gis-polygon-draw.md) | 区域绘制工具 | 绘制点/线/面/圆/半圆 |
| GisGeoJsonParse | [gis-geojson-parse.md](gis-geojson-parse.md) | GeoJSON 数据层 | 加载 GeoJSON 矢量数据 |
| GisTableLayer | [gis-table-layer.md](gis-table-layer.md) | 数据表层 | 数据库表数据地图可视化（WebSocket 实时） |
| GisWarnLayer | [gis-warn-layer.md](gis-warn-layer.md) | 报警层 | 实时报警闪烁标记 |
| GisKmzLoader | [gis-kmz-loader.md](gis-kmz-loader.md) | KMZ 文件层 | KMZ 压缩文件加载渲染 |
| GisGeoserverWms | [gis-geoserver-wms.md](gis-geoserver-wms.md) | GeoServer WMS 层 | WMS 服务图层 |
| GisCodeEditor | [gis-code-editor.md](gis-code-editor.md) | 代码图层 | JS 动态创建 OpenLayers 图层 |

---

## 选型决策速查

| 页面交互模式 | 推荐组件方案 | 数据源 |
|-------------|------------|--------|
| **纯展示**（仪表盘） | shadcn Card + echarts | `createAPI` |
| **带过滤的展示**（默认） | shadcn Table + 自定义 Filter + createAPI | `createAPI` |
| **CRUD 管理**（用户指定） | ViewModel + ViewFilter + ViewDataTable + ViewPagination + ViewActions | `ViewModel` |
| **地图展示** | GisMapCore + GisXyzTile + GisCustomLayer | `createAPI` |

## 组合系统规则

| 系统 | 核心容器 | 必须配套 | 文档 |
|------|---------|---------|------|
| 视图系统 | `ViewModel` | ViewFilter + ViewDataTable + ViewPagination (+ ViewActions 如需 CRUD) | [system-view.md](system-view.md) |
| GIS 系统 | `GisMapCore` | GisXyzTile + 业务图层组件 | [system-gis.md](system-gis.md) |

## 按场景速查

| 场景 | 推荐阅读顺序 |
|------|------------|
| CRUD 数据管理页 | system-view.md → view-model.md → view-data-table.md → view-filter.md → view-actions.md |
| 展示型列表页 | system-view.md → view-model.md → view-data-table.md（只读模式） |
| 仪表盘/概览 | 无需 view 组件，用 shadcn Card + echarts |
| 地图页 | system-gis.md → gis-map-core.md → gis-xyz-tile.md → 按需选图层 |
| 表单设计 | form.md → 按控件类型查阅对应 form-*.md |
| Schema 驱动表单 | form-schema-form.md → form-field.md → form-widget.md |
