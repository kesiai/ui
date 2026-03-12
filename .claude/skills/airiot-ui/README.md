# Airiot UI 组件库助手

这个技能帮助你根据业务需求选择合适的 Airiot UI 组件，并提供完整的使用指南。

## 使用方法

直接描述你的需求，例如：
- "我需要一个用户登录表单"
- "要展示数据表格，支持搜索和分页"
- "需要实现一个地图展示功能"
- "要做一个视频播放器"

技能会自动分析需求并推荐最合适的组件，同时提供：
- 组件详细信息和导入路径
- 基础和高级用法示例
- 组合组件的完整使用示例
- 最佳实践和注意事项

## 支持的组件类型

### 📦 容器组件 (8个)
将相关内容组织在一起，提供不同的展示形式
- Card - 卡片容器
- Carousel - 轮播容器
- ContainerContextProvider - 上下文提供者容器
- ContainerIteration - 迭代容器
- Modal - 模态框
- Panel - 面板
- Popover - 浮层
- Tabs - 标签页容器

### 🔌 数据源组件 (7个)
提供数据查询能力，连接不同类型的数据源
- DataSourceApi - API数据源
- DataSourceHistory - 历史数据源
- DataSourceInterface - 接口数据源
- DataSourceMessage - 消息数据源
- DataSourceRealtime - 实时数据源
- DataSourceTable - 数据表源
- DataSourceView - 视图数据源

### 🧩 基础组件 (9个)
显示基础数据和内容
- Bar - 条形组件
- Button - 按钮
- ConnectWidget - 连接组件
- Iframe - 内嵌框架
- Image - 图片
- Status - 状态指示器
- Svg - SVG组件
- Text - 文本
- Textarea - 文本域

### 📝 表单组件 (16个)
数据输入和表单处理
- FormArea - 表单域组件
- FormBytesArray - 字节数组
- FormCheckbox - 复选框
- FormDate - 日期选择器
- FormDateRange - 日期范围
- FormEditableTable - 可编辑表格
- FormField - 表单字段
- FormFormInfo - 表单信息
- FormInput - 输入框
- FormInputNumber - 数字输入
- FormLink - 链接输入
- FormMap - 地图选择
- FormRadio - 单选框
- FormRate - 评分
- FormRichText - 富文本
- FormSchema - 表单模式
- FormSelect - 选择器
- FormSerialNumber - 序列号
- FormSlider - 滑块
- FormSwitch - 开关
- FormTableDataSelect - 表数据选择
- FormTableSelect - 表格选择
- FormTime - 时间选择器
- FormUpload - 文件上传
- FormUserRole - 用户角色
- FormWidget - 表单控件

### 📊 图表组件 (1个)
数据可视化展示
- ChartEcharts - ECharts图表

### 💼 业务组件 (4个)
特定业务场景的组件
- DataPoint - 数据点
- DataViewChart - 数据视图图表
- Player - 播放器
- QRCode - 二维码

### ✳️ 视图组件 (12个)
展示数据库数据的完整视图系统
- ViewActions - 视图操作
- ViewAdvancedFilter - 高级过滤器
- ViewBatch - 批量操作
- ViewDataAggregate - 数据聚合
- ViewDataTable - 数据表格
- ViewDemo - 视图演示
- ViewDetail - 详情视图
- ViewField - 视图字段
- ViewFilter - 过滤器
- ViewModel - 视图模型
- ViewPagination - 分页器
- ViewTools - 视图工具

### 🗺️ GIS组件 (10个)
地理信息系统组件
- GisCodeEditor - GIS代码编辑器
- GisCustomLayer - 自定义图层
- GisGeojsonParse - GeoJSON解析
- GisGeoserverWMS - GeoServer WMS
- GisKmzLoader - KMZ加载器
- GisMapCore - 地图容器
- GisPolygonDraw - 多边形绘制
- GisTableLayer - 表格图层
- GisWarnLayer - 警告图层
- GisXyzTile - XYZ瓦片

### 📹 视频组件 (5个)
视频播放和控件
- VideoButton - 视频控制按钮
- VideoPeriodsWidget - 视频时段
- VideoPlaybackWidget - 播放控件
- VideoTimeAxisWidget - 时间轴
- VideoWidget - 视频播放器

### 📱 移动端组件 (7个)
移动端UI组件
- MobileCalendar - 日历
- MobileDatePicker - 日期选择器
- MobileLocation - 定位
- MobileNavBar - 导航栏
- MobilePicker - 选择器
- MobilePopup - 弹出层
- MobileScanQR - 扫描二维码

### 🌍 3D组件 (11个)
3D模型展示和交互
- Model3D - 3D场景容器
- Model3DGeometryBox - 立方体
- Model3DGeometryCircle - 圆形
- Model3DGeometryCone - 圆锥
- Model3DGeometryCylinder - 圆柱
- Model3DGeometryPlane - 平面
- Model3DGeometrySphere - 球体
- Model3DGeometryTube - 管道
- Model3DLayout3D - 3D布局

## 示例

**示例 1 - 用户管理**
> 用户: "我需要一个用户列表页面，支持搜索和分页"

**技能输出**:
```
## 推荐组件

### ViewModel - 视图模型
- 导入: '@/components/airiot/view-model/view-model'
- 描述: 数据模型展示，所有视图组件都在此容器下使用

基础用法:
```tsx
import ViewModel from '@/components/airiot/view-model/view-model'
import ViewDataTable from '@/components/airiot/view-data-table/view-data-table'
import ViewFilter from '@/components/airiot/view-filter/view-filter'
import ViewPagination from '@/components/airiot/view-pagination/view-pagination'

function UserList() {
  return (
    <ViewModel>
      <ViewDataTable api="/api/users">
        <ViewFilter />
        <ViewPagination />
      </ViewDataTable>
    </ViewModel>
  )
}
```

### Card - 卡片容器
- 导入: '@/components/airiot/container-card/container-card'
- 描述: 将内容组织在卡片中，提供更好的视觉层次

基础用法:
```tsx
import Card from '@/components/airiot/container-card/container-card'

function UserCard() {
  return (
    <Card cardTitle="用户信息" cardBordered={true}>
      {/* 用户内容 */}
    </Card>
  )
}
```
```

**示例 2 - 数据可视化**
> 用户: "要实现一个实时数据监控大屏，包含图表和地图"

**技能输出**:
```
## 推荐组件

### ChartEcharts - ECharts图表
- 导入: '@/components/airiot/chart-echarts/chart-echarts'
- 描述: 数据可视化图表组件

基础用法:
```tsx
import ChartEcharts from '@/components/airiot/chart-echarts/chart-echarts'

function RealtimeChart() {
  return (
    <ChartEcharts
      option={{
        title: { text: '实时监控' },
        xAxis: { type: 'category' },
        yAxis: { type: 'value' },
        series: [{
          data: [120, 200, 150, 80],
          type: 'line'
        }]
      }}
    />
  )
}
```

### GisMapCore - 地图容器
- 导入: '@/components/airiot/gis-map-core/gis-map-core'
- 描述: 地图容器，支持多种图层和交互

基础用法:
```tsx
import GisMapCore from '@/components/airiot/gis-map-core/gis-map-core'

function MapDashboard() {
  return (
    <GisMapCore
      center={[116.40, 39.90]}
      zoom={10}
      style={{ height: '500px' }}
    >
      {/* 地图内容 */}
    </GisMapCore>
  )
}
```
```

**示例 3 - 表单页面**
> 用户: "需要创建一个复杂的用户注册表单，包含各种输入类型"

**技能输出**:
```
## 推荐组件

### FormSchema - 表单生成器
- 导入: '@/components/airiot/schema-form/schema-form'
- 描述: 根据JSON Schema动态生成表单

基础用法:
```tsx
import FormSchema from '@/components/airiot/schema-form/schema-form'

function RegistrationForm() {
  const schema = {
    type: 'object',
    properties: {
      username: { type: 'string', title: '用户名' },
      email: { type: 'string', format: 'email' },
      age: { type: 'number', minimum: 18 }
    }
  }

  return (
    <FormSchema
      schema={schema}
      onChange={(values) => console.log(values)}
    />
  )
}
```

### FormRichText - 富文本编辑器
- 导入: '@/components/airiot/form-rich-text/form-rich-text'
- 描述: 支持格式的富文本编辑器

基础用法:
```tsx
import FormRichText from '@/components/airiot/form-rich-text/form-rich-text'

function BiographyForm() {
  return (
    <FormRichText
      value={content}
      onChange={setContent}
      height={200}
      placeholder="请输入个人简介..."
    />
  )
}
```
```
```

## 注意事项

1. **组合组件使用**
   - 视图组件: 所有视图组件（ViewDataTable、ViewFilter、ViewPagination等）都必须在 ViewModel 容器下使用
   - GIS组件: GisMapCore 可以添加 GisPolygonDraw、GisTableLayer 等图层
   - 3D组件: Model3D 支持各种几何体组件组合使用
   - 视频组件: VideoWidget 可以搭配 VideoButton、VideoPlaybackWidget 等控件

2. **依赖要求**
   - 使用前请确保已安装相关依赖（ECharts、Three.js等）
   - 部分组件需要特定的数据源配置
   - 移动端组件需要在移动环境中使用

3. **文档参考**
   - 每个组件都有详细的 Props 说明和使用示例
   - 可以查看对应的 MDN 文档了解更多 API
   - 注意组件的浏览器兼容性要求

## 统计信息

- **总计组件**: 68+ 个
- **覆盖场景**: 表单、图表、地图、视频、3D、移动端等
- **支持语言**: TypeScript
- **更新频率**: 持续迭代更新