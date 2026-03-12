# 组件库选择与使用助手

这个技能帮助你根据业务需求选择合适的组件，并提供完整的组件使用指南。

## 功能

1. **需求分析** - 分析你的需求并推荐最合适的组件
2. **组件选择** - 展示推荐的组件详细信息
3. **代码示例** - 提供可运行的代码示例
4. **最佳实践** - 提供使用注意事项和最佳实践

## 使用方法

直接描述你的需求，例如：
- "我需要一个用户登录表单"
- "要展示数据表格，支持搜索和分页"
- "需要实现一个地图展示功能"
- "要做一个视频播放器"

## 组件分类

### 📦 容器组件 (8个)
将相关内容组织在一起，提供不同的展示形式
- Card - 卡片容器，支持标题、边框、内边距
- Carousel - 轮播容器，支持自动播放、指示器
- ContainerContextProvider - 上下文提供者容器，跨组件共享状态
- ContainerIteration - 迭代容器，循环渲染子组件
- Modal - 模态框，弹出式对话框
- Panel - 面板容器，手风琴式折叠展开
- Popover - 浮层容器，点击/悬停触发
- Tabs - 标签页容器，多标签切换

### 🔌 数据源组件 (7个)
提供数据查询能力，连接不同类型的数据源
- DataSourceApi - API数据源，RESTful API接口
- DataSourceHistory - 历史数据源，本地历史数据管理
- DataSourceInterface - 接口数据源，动态接口调用
- DataSourceMessage - 消息数据源，实时消息处理
- DataSourceRealtime - 实时数据源，WebSocket连接
- DataSourceTable - 数据表源，数据库表操作
- DataSourceView - 视图数据源，数据库视图查询

### 🧩 基础组件 (9个)
显示基础数据和内容
- Bar - 条形组件，进度条和数据展示
- Button - 按钮，各种交互操作
- ConnectWidget - 连接组件，状态连接指示
- Iframe - 内嵌框架，外部内容嵌入
- Image - 图片，图片展示组件
- Status - 状态指示器，状态展示
- Svg - SVG组件，矢量图标
- Text - 文本，基础文本展示
- Textarea - 文本域，多行文本输入

### 📝 表单组件 (16个)
数据输入和表单处理
- FormArea - 表单域组件，表单区域分组
- FormBytesArray - 字节数组，二进制数据输入
- FormCheckbox - 复选框，多选输入
- FormDate - 日期选择器，日期输入
- FormDateRange - 日期范围，时间段选择
- FormEditableTable - 可编辑表格，内联编辑
- FormField - 表单字段，字段级组件
- FormFormInfo - 表单信息，元数据展示
- FormInput - 输入框，基础文本输入
- FormInputNumber - 数字输入，数值输入
- FormLink - 链接输入，URL输入
- FormMap - 地图选择，地理位置选择
- FormRadio - 单选框，单选输入
- FormRate - 评分，星级评分
- FormRichText - 富文本，富文本编辑
- FormSchema - 表单模式，JSON Schema驱动
- FormSelect - 选择器，下拉选择
- FormSerialNumber - 序列号，序号生成
- FormSlider - 滑块，范围选择
- FormSwitch - 开关，状态切换
- FormTableDataSelect - 表数据选择，表格数据选择
- FormTableSelect - 表格选择，表格数据选取
- FormTime - 时间选择器，时间输入
- FormUpload - 文件上传，文件上传组件
- FormUserRole - 用户角色，角色选择
- FormWidget - 表单控件，自定义控件

### 📊 图表组件 (1个)
数据可视化展示
- ChartEcharts - ECharts图表，数据可视化图表

### 💼 业务组件 (4个)
特定业务场景的组件
- DataPoint - 数据点，数据展示点
- DataViewChart - 数据视图图表，业务数据图表
- Player - 播放器，音视频播放
- QRCode - 二维码，二维码生成和扫描

### ✳️ 视图组件 (12个)
展示数据库数据的完整视图系统
- ViewActions - 视图操作，批量操作组件
- ViewAdvancedFilter - 高级过滤器，复杂条件过滤
- ViewBatch - 批量操作，批量数据处理
- ViewDataAggregate - 数据聚合，数据统计
- ViewDataTable - 数据表格，核心表格组件
- ViewDemo - 视图演示，示例展示
- ViewDetail - 详情视图，详细信息展示
- ViewField - 视图字段，字段展示
- ViewFilter - 过滤器，数据过滤
- ViewModel - 视图模型，数据模型展示
- ViewPagination - 分页器，数据分页
- ViewTools - 视图工具，辅助工具

### 🗺️ GIS组件 (10个)
地理信息系统组件
- GisCodeEditor - GIS代码编辑器，代码编辑工具
- GisCustomLayer - 自定义图层，自定义地图图层
- GisGeojsonParse - GeoJSON解析，地理数据解析
- GisGeoserverWMS - GeoServer WMS，地图服务
- GisKmzLoader - KMZ加载器，地理数据加载
- GisMapCore - 地图容器，核心地图组件
- GisPolygonDraw - 多边形绘制，绘制工具
- GisTableLayer - 表格图层，数据表格图层
- GisWarnLayer - 警告图层，警告信息展示
- GisXyzTile - XYZ瓦片，地图瓦片服务

### 📹 视频组件 (5个)
视频播放和控件
- VideoButton - 视频控制按钮，播放控制
- VideoPeriodsWidget - 视频时段，时间段管理
- VideoPlaybackWidget - 播放控件，播放控制界面
- VideoTimeAxisWidget - 时间轴，时间线展示
- VideoWidget - 视频播放器，主播放组件

### 📱 移动端组件 (7个)
移动端UI组件
- MobileCalendar - 日历，移动端日历
- MobileDatePicker - 日期选择器，移动端日期选择
- MobileLocation - 定位，地理位置定位
- MobileNavBar - 导航栏，移动端导航
- MobilePicker - 选择器，移动端选择器
- MobilePopup - 弹出层，移动端弹窗
- MobileScanQR - 扫描二维码，二维码扫描

### 🌍 3D组件 (11个)
3D模型展示和交互
- Model3D - 3D场景容器，核心3D场景
- Model3DGeometryBox - 立方体，3D立方体
- Model3DGeometryCircle - 圆形，3D圆形
- Model3DGeometryCone - 圆锥，3D圆锥
- Model3DGeometryCylinder - 圆柱，3D圆柱
- Model3DGeometryPlane - 平面，3D平面
- Model3DGeometrySphere - 球体，3D球体
- Model3DGeometryTube - 管道，3D管道
- Model3DLayout3D - 3D布局，3D空间布局

## 输出格式

当分析你的需求时，我会提供：

### 1. 需求分析
- 需求关键词提取
- 组件分类推荐
- 替代方案建议

### 2. 推荐组件列表
按优先级排序的组件推荐：
- 组件名称和简短描述
- 所属分类和数量
- 难度等级（初级/中级/高级）
- 典型使用场景

### 3. 详细组件信息
每个推荐组件的详细信息：
- 导入路径
- 核心Props说明
- 基础用法示例
- 高级用法示例
- 注意事项和最佳实践

### 4. 组合使用指南
对于复杂组件系统：
- 组件依赖关系
- 完整组合示例
- 样式和布局建议

### 5. 实现建议
- 代码结构建议
- 性能优化提示
- 测试和调试建议

## 示例

**用户输入**: "我需要一个可以搜索和分页的用户列表"

**技能输出**:
```
## 推荐组件

### 1. Card - 卡片容器
- 分类: 容器组件
- 描述: 将内容组织在卡片容器中，支持标题、边框和内边距设置
- 导入路径: '@/components/airiot/container-card/container-card'

基础用法:
```tsx
import { Card } from '@/components/airiot/container-card/container-card'

function CardExample() {
  return (
    <Card
      cardTitle="卡片标题"
      cardBordered={true}
      cardPadding={24}
    >
      {/* 卡片内容 */}
    </Card>
  )
}
```

### 2. Modal - 模态框
- 分类: 容器组件
- 描述: 弹出式模态框，支持标题、描述、尺寸设置
- 导入路径: '@/components/airiot/container-modal/container-modal'

基础用法:
```tsx
import { Modal } from '@/components/airiot/container-modal/container-modal'

function ModalExample() {
  return (
    <Modal
      title="模态框标题"
      description="模态框描述"
      open={isOpen}
      onOpenChange={setIsOpen}
      modalWidth={600}
    >
      {/* 模态框内容 */}
    </Modal>
  )
}
```

### 3. Tabs - 标签页
- 分类: 容器组件
- 描述: 标签页容器，支持多个标签切换
- 导入路径: '@/components/airiot/container-tabs/container-tabs'

基础用法:
```tsx
import { Tabs } from '@/components/airiot/container-tabs/container-tabs'

function TabsExample() {
  const tabs = [
    { title: '标签1' },
    { title: '标签2' }
  ]

  return (
    <Tabs tabs={tabs} defaultValue="tab1">
      {/* 标签内容 */}
    </Tabs>
  )
}
```

### 4. Carousel - 轮播图
- 分类: 容器组件
- 描述: 轮播图容器，支持自动播放、指示器等
- 导入路径: '@/components/airiot/container-carousel/container-carousel'

基础用法:
```tsx
import { Carousel } from '@/components/airiot/container-carousel/container-carousel'

function CarouselExample() {
  return (
    Carousel
      autoplay={true}
      autoplaySpeed={3}
    >
      {/* 轮播项 */}
    </Carousel>
  )
}
```

### 5. Popover - 浮层
- 分类: 容器组件
- 描述: 点击或悬触触发的浮层容器
- 导入路径: '@/components/airiot/container-popover/container-popover'

基础用法:
```tsx
import { Popover } from '@/components/airiot/container-popover/container-popover'

function PopoverExample() {
  return (
    <Popover
      buttonName="点击触发"
      placement="bottom"
    >
      {/* 浮层内容 */}
    </Popover>
  )
}
```

### 6. Panel - 面板
- 分类: 容器组件
- 描述: 手风琴式面板容器，支持多个面板折叠展开
- 导入路径: '@/components/airiot/container-panel/container-panel'

基础用法:
```tsx
import { Panel } from '@/components/airiot/container-panel/container-panel'

function PanelExample() {
  const panels = [
    { title: '面板1' },
    { title: '面板2' }
  ]

  return (
    <Panel panels={panels} accordion={true}>
      {/* 面板内容 */}
    </Panel>
  )
}
```

## 组合使用说明
ViewDataTable 需要搭配 ViewFilter 和 ViewPagination 使用，以实现完整的列表功能。

## 注意事项
- 确保API路径正确
- 根据需要配置分页参数
- 可以添加自定义的过滤条件
```

## 高级示例

**示例 4 - 物联网监控大屏**
> 用户: "需要做一个IoT设备监控大屏，实时展示设备状态、地理位置和数据趋势"

**技能输出**:
```
## 推荐组件

### 1. 数据展示层
- ViewModel - 视图模型容器，所有视图组件都在此下使用
- GisMapCore - 地图展示，设备位置分布
- ChartEcharts - 数据趋势图表，多维度数据展示

### 2. 数据源层
- DataSourceRealtime - 实时数据源，WebSocket连接
- DataSourceApi - 历史数据源，API查询

### 3. 控制层
- ViewActions - 批量操作，设备控制
- VideoWidget - 视频监控（可选）

组合使用示例:
```tsx
// 完整的监控大屏实现
import {
  ViewModel,
  ViewDataTable,
  ViewFilter,
  ViewPagination,
  ViewActions,
  GisMapCore,
  GisCustomLayer,
  ChartEcharts,
  DataSourceRealtime,
  Card
} from '@/components/airiot'

function IoTMonitorDashboard() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {/* 左侧：设备列表 */}
      <Card cardTitle="设备列表">
        <ViewModel>
          <ViewDataTable
            api="/api/devices"
            realtime={true}
            refreshInterval={5000}
          >
            <ViewFilter />
            <ViewPagination />
          </ViewDataTable>
          <ViewActions />
        </ViewModel>
      </Card>

      {/* 右上：地图 */}
      <Card cardTitle="设备分布" style={{ height: '400px' }}>
        <GisMapCore center={[116.40, 39.90]} zoom={5}>
          <GisCustomLayer
            type="point"
            data={deviceLocations}
            onClick={handleDeviceClick}
          />
        </GisMapCore>
      </Card>

      {/* 右下：趋势图 */}
      <Card cardTitle="数据趋势">
        <ChartEcharts
          option={chartOption}
          realtime={true}
          interval={3000}
        />
      </Card>
    </div>
  )
}
```
```

## 性能优化建议

1. **大数据量处理**
   - 使用虚拟滚动（ViewDataTable）
   - 分页加载数据
   - 数据缓存策略

2. **实时数据优化**
   - WebSocket连接复用
   - 数据节流和防抖
   - 状态管理优化

3. **渲染优化**
   - 组件懒加载
   - 避免不必要的重渲染
   - 使用 useMemo 和 useCallback