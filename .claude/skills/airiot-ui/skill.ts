import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

interface ComponentData {
  id: string
  name: string
  category: string
  description: string
  importPath: string
  props?: any
  examples?: string[]
  notes?: string[]
}

interface Category {
  id: string
  name: string
  icon: string
  components: Component[]
}

interface Component {
  id: string
  name: string
  description: string
  standalone?: boolean
  composite?: boolean
  children?: string[]
  props?: any
}

interface ComponentAnalysis {
  components: Component[]
  description: string
  reasoning: string[]
}

// 组件分类配置
const CATEGORIES: Category[] = [
  {
    id: "containers",
    name: "容器组件",
    icon: "📦",
    components: [
      { id: "container-card", name: "卡片容器", description: "将内容放在卡片中展示", standalone: true },
      { id: "container-carousel", name: "轮播容器", description: "轮播展示多个内容", standalone: true },
      { id: "container-context-provider", name: "上下文提供者容器", description: "跨组件共享状态", standalone: true },
      { id: "container-iteration", name: "迭代容器", description: "循环渲染子组件", standalone: true },
      { id: "container-modal", name: "模态框容器", description: "弹窗显示内容", standalone: true },
      { id: "container-panel", name: "面板容器", description: "可折叠的面板", standalone: true },
      { id: "container-popover", name: "浮层容器", description: "浮层提示内容", standalone: true },
      { id: "container-tabs", name: "标签页容器", description: "标签页切换不同内容", standalone: true }
    ]
  },
  {
    id: "data-source",
    name: "数据源",
    icon: "🔌",
    components: [
      { id: "datasource-api", name: "API数据源", description: "从API获取数据", standalone: true },
      { id: "datasource-history", name: "历史数据源", description: "读取历史数据", standalone: true },
      { id: "datasource-interface", name: "接口数据源", description: "动态接口调用", standalone: true },
      { id: "datasource-message", name: "消息数据源", description: "处理消息数据", standalone: true },
      { id: "datasource-realtime", name: "实时数据源", description: "连接实时数据流", standalone: true },
      { id: "datasource-table", name: "数据表源", description: "操作数据库表", standalone: true },
      { id: "datasource-view", name: "视图数据源", description: "读取视图数据", standalone: true }
    ]
  },
  {
    id: "basic",
    name: "基础组件",
    icon: "🧩",
    components: [
      { id: "bar", name: "条形组件", description: "展示条形数据", standalone: true },
      { id: "button", name: "按钮", description: "可点击的按钮", standalone: true },
      { id: "connect-widget", name: "连接组件", description: "状态连接指示", standalone: true },
      { id: "iframe", name: "内嵌框架", description: "嵌入外部内容", standalone: true },
      { id: "image", name: "图片", description: "展示图片", standalone: true },
      { id: "status", name: "状态指示器", description: "显示状态信息", standalone: true },
      { id: "svg", name: "SVG组件", description: "矢量图标展示", standalone: true },
      { id: "text", name: "文本", description: "显示文本内容", standalone: true },
      { id: "textarea", name: "文本域", description: "多行文本输入", standalone: true }
    ]
  },
  {
    id: "form",
    name: "表单组件",
    icon: "📝",
    components: [
      { id: "form-area", name: "表单域组件", description: "表单区域分组", standalone: true },
      { id: "form-bytes-array", name: "字节数组", description: "二进制数据输入", standalone: true },
      { id: "form-checkbox", name: "复选框", description: "多选输入", standalone: true },
      { id: "form-date", name: "日期选择器", description: "选择日期", standalone: true },
      { id: "form-date-range", name: "日期范围", description: "时间段选择", standalone: true },
      { id: "form-editable-table", name: "可编辑表格", description: "内联编辑", standalone: true },
      { id: "form-field", name: "表单字段", description: "字段级组件", standalone: true },
      { id: "form-form-info", name: "表单信息", description: "元数据展示", standalone: true },
      { id: "form-input", name: "输入框", description: "文本输入", standalone: true },
      { id: "form-input-number", name: "数字输入", description: "数值输入", standalone: true },
      { id: "form-link", name: "链接输入", description: "URL输入", standalone: true },
      { id: "form-map", name: "地图选择", description: "地理位置选择", standalone: true },
      { id: "form-radio", name: "单选框", description: "单选输入", standalone: true },
      { id: "form-rate", name: "评分", description: "星级评分", standalone: true },
      { id: "form-rich-text", name: "富文本", description: "富文本编辑", standalone: true },
      { id: "form-schema", name: "表单模式", description: "JSON Schema驱动", standalone: true },
      { id: "form-select", name: "选择器", description: "下拉选择", standalone: true },
      { id: "form-serial-number", name: "序列号", description: "序号生成", standalone: true },
      { id: "form-slider", name: "滑块", description: "范围选择", standalone: true },
      { id: "form-switch", name: "开关", description: "状态切换", standalone: true },
      { id: "form-table-data-select", name: "表数据选择", description: "表格数据选择", standalone: true },
      { id: "form-table-select", name: "表格选择", description: "表格数据选取", standalone: true },
      { id: "form-time", name: "时间选择器", description: "选择时间", standalone: true },
      { id: "form-upload", name: "文件上传", description: "文件上传", standalone: true },
      { id: "form-user-role", name: "用户角色", description: "角色选择", standalone: true },
      { id: "form-widget", name: "表单控件", description: "自定义控件", standalone: true }
    ]
  },
  {
    id: "chart",
    name: "图表组件",
    icon: "📊",
    components: [
      { id: "chart-echarts", name: "ECharts图表", description: "数据可视化图表", standalone: true }
    ]
  },
  {
    id: "business",
    name: "业务组件",
    icon: "💼",
    components: [
      { id: "data-point", name: "数据点", description: "展示数据点信息", standalone: true },
      { id: "data-view-chart", name: "数据视图图表", description: "业务数据图表", standalone: true },
      { id: "player", name: "播放器", description: "音视频播放", standalone: true },
      { id: "qr-code", name: "二维码", description: "二维码生成和扫描", standalone: true }
    ]
  },
  {
    id: "view",
    name: "视图组件",
    icon: "✳️",
    components: [
      { id: "view-actions", name: "视图操作", description: "批量操作组件", standalone: true },
      { id: "view-advanced-filter", name: "高级过滤器", description: "复杂条件过滤", standalone: true },
      { id: "view-batch", name: "批量操作", description: "批量数据处理", standalone: true },
      { id: "view-data-aggregate", name: "数据聚合", description: "数据统计", standalone: true },
      { id: "view-data-table", name: "数据表格", description: "核心表格组件", composite: true },
      { id: "view-demo", name: "视图演示", description: "示例展示", standalone: true },
      { id: "view-detail", name: "详情视图", description: "详细信息展示", standalone: true },
      { id: "view-field", name: "视图字段", description: "字段展示", standalone: true },
      { id: "view-filter", name: "过滤器", description: "数据过滤", standalone: true },
      { id: "view-model", name: "视图模型", description: "数据模型展示", standalone: true },
      { id: "view-pagination", name: "分页器", description: "数据分页", standalone: true },
      { id: "view-tools", name: "视图工具", description: "辅助工具", standalone: true }
    ]
  },
  {
    id: "gis",
    name: "GIS组件",
    icon: "🗺️",
    components: [
      { id: "gis-code-editor", name: "GIS代码编辑器", description: "代码编辑工具", standalone: true },
      { id: "gis-custom-layer", name: "自定义图层", description: "自定义地图图层", standalone: true },
      { id: "gis-geojson-parse", name: "GeoJSON解析", description: "地理数据解析", standalone: true },
      { id: "gis-geoserver-wms", name: "GeoServer WMS", description: "地图服务", standalone: true },
      { id: "gis-kmz-loader", name: "KMZ加载器", description: "地理数据加载", standalone: true },
      { id: "gis-map-core", name: "地图容器", description: "核心地图组件", composite: true },
      { id: "gis-polygon-draw", name: "多边形绘制", description: "绘制工具", standalone: true },
      { id: "gis-table-layer", name: "表格图层", description: "数据表格图层", standalone: true },
      { id: "gis-warn-layer", name: "警告图层", description: "警告信息展示", standalone: true },
      { id: "gis-xyz-tile", name: "XYZ瓦片", description: "地图瓦片服务", standalone: true }
    ]
  },
  {
    id: "video",
    name: "视频组件",
    icon: "📹",
    components: [
      { id: "video-button", name: "视频控制按钮", description: "播放控制", standalone: true },
      { id: "video-periods-widget", name: "视频时段", description: "时间段管理", standalone: true },
      { id: "video-playback-widget", name: "播放控件", description: "播放控制界面", standalone: true },
      { id: "video-time-axis-widget", name: "时间轴", description: "时间线展示", standalone: true },
      { id: "video-widget", name: "视频播放器", description: "主播放组件", composite: true }
    ]
  },
  {
    id: "mobile",
    name: "移动端组件",
    icon: "📱",
    components: [
      { id: "mobile-calendar", name: "日历", description: "移动端日历", standalone: true },
      { id: "mobile-date-picker", name: "日期选择器", description: "移动端日期选择", standalone: true },
      { id: "mobile-location", name: "定位", description: "地理位置定位", standalone: true },
      { id: "mobile-nav-bar", name: "导航栏", description: "移动端导航", standalone: true },
      { id: "mobile-picker", name: "选择器", description: "移动端选择器", standalone: true },
      { id: "mobile-popup", name: "弹出层", description: "移动端弹窗", standalone: true },
      { id: "mobile-scan-qr", name: "扫描二维码", description: "二维码扫描", standalone: true }
    ]
  },
  {
    id: "3d",
    name: "三维组件",
    icon: "🌍",
    components: [
      { id: "model-3d", name: "3D场景容器", description: "核心3D场景", composite: true },
      { id: "model-3d-geometry-box", name: "立方体", description: "3D立方体", standalone: true },
      { id: "model-3d-geometry-circle", name: "圆形", description: "3D圆形", standalone: true },
      { id: "model-3d-geometry-cone", name: "圆锥", description: "3D圆锥", standalone: true },
      { id: "model-3d-geometry-cylinder", name: "圆柱", description: "3D圆柱", standalone: true },
      { id: "model-3d-geometry-plane", name: "平面", description: "3D平面", standalone: true },
      { id: "model-3d-geometry-sphere", name: "球体", description: "3D球体", standalone: true },
      { id: "model-3d-geometry-tube", name: "管道", description: "3D管道", standalone: true },
      { id: "model-3d-layout-3d", name: "3D布局", description: "3D空间布局", standalone: true },
      { id: "model-3d-card", name: "3D卡片", description: "3D卡片展示", standalone: true }
    ]
  }
]

// 获取组件详细数据
function getComponentData(componentId: string): ComponentData | null {
  const dataPath = join(__dirname, 'data', `${componentId}.md`)

  if (!existsSync(dataPath)) {
    return null
  }

  try {
    const content = readFileSync(dataPath, 'utf-8')
    const lines = content.split('\n')

    // 解析导入路径
    let importPath = ''
    let description = ''
    let examples: string[] = []
    let notes: string[] = []

    let currentSection = ''

    for (const line of lines) {
      if (line.startsWith('## 导入路径')) {
        currentSection = 'import'
      } else if (line.startsWith('## Props') || line.startsWith('## 基础用法')) {
        currentSection = 'props'
      } else if (line.startsWith('## 示例')) {
        currentSection = 'examples'
      } else if (line.startsWith('## 注意事项')) {
        currentSection = 'notes'
      } else if (currentSection === 'import' && line.includes('```tsx')) {
        const importMatch = line.match(/import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/)
        if (importMatch) {
          importPath = importMatch[2]
        }
      } else if (currentSection === 'examples' && line.startsWith('```tsx')) {
        let exampleCode = ''
        let capture = true
        for (let i = lines.indexOf(line) + 1; i < lines.length; i++) {
          if (lines[i].startsWith('```')) {
            capture = false
          } else if (capture) {
            exampleCode += lines[i] + '\n'
          } else {
            break
          }
        }
        if (exampleCode) {
          examples.push(exampleCode.trim())
        }
      } else if (line.startsWith('- ') && currentSection === 'notes') {
        notes.push(line.substring(2))
      }
    }

    return {
      id: componentId,
      name: CATEGORIES.find(c =>
        c.components.find(comp => comp.id === componentId)
      )?.components.find(comp => comp.id === componentId)?.name || componentId,
      category: CATEGORIES.find(c =>
        c.components.find(comp => comp.id === componentId)
      )?.id || 'basic',
      description: CATEGORIES.find(c =>
        c.components.find(comp => comp.id === componentId)
      )?.components.find(comp => comp.id === componentId)?.description || '',
      importPath,
      examples,
      notes
    }
  } catch (error) {
    console.error(`Error reading component data for ${componentId}:`, error)
    return null
  }
}

// 分析需求并推荐组件
function analyzeRequirement(requirement: string): ComponentAnalysis {
  const components: Component[] = []
  const reasoning: string[] = []

  // 简单的关键词匹配来推荐组件
  const lowerReq = requirement.toLowerCase()

  if (lowerReq.includes('按钮') || lowerReq.includes('button') || lowerReq.includes('点击')) {
    const component = CATEGORIES.find(c => c.id === 'basic')?.components.find(c => c.id === 'button')
    if (component) {
      components.push(component)
      reasoning.push("检测到需要交互操作，推荐使用按钮组件")
    }
  }

  if (lowerReq.includes('输入') || lowerReq.includes('input') || lowerReq.includes('表单')) {
    const component = CATEGORIES.find(c => c.id === 'form')?.components.find(c => c.id === 'form-input')
    if (component) {
      components.push(component)
      reasoning.push("检测到需要用户输入，推荐使用输入框组件")
    }
  }

  if (lowerReq.includes('选择') || lowerReq.includes('select') || lowerReq.includes('下拉')) {
    const component = CATEGORIES.find(c => c.id === 'form')?.components.find(c => c.id === 'form-select')
    if (component) {
      components.push(component)
      reasoning.push("检测到需要选择功能，推荐使用选择器组件")
    }
  }

  if (lowerReq.includes('表格') || lowerReq.includes('table') || lowerReq.includes('数据展示')) {
    const component = CATEGORIES.find(c => c.id === 'view')?.components.find(c => c.id === 'view-data-table')
    if (component) {
      components.push(component)
      reasoning.push("检测到需要数据展示，推荐使用数据表格组件")
    }
  }

  if (lowerReq.includes('图表') || lowerReq.includes('chart') || lowerReq.includes('可视化')) {
    const component = CATEGORIES.find(c => c.id === 'chart')?.components.find(c => c.id === 'chart-echarts')
    if (component) {
      components.push(component)
      reasoning.push("检测到需要数据可视化，推荐使用图表组件")
    }
  }

  if (lowerReq.includes('地图') || lowerReq.includes('gis') || lowerReq.includes('地理')) {
    const component = CATEGORIES.find(c => c.id === 'gis')?.components.find(c => c.id === 'gis-map-core')
    if (component) {
      components.push(component)
      reasoning.push("检测到需要地图展示，推荐使用GIS地图组件")
    }
  }

  if (lowerReq.includes('视频') || lowerReq.includes('video')) {
    const component = CATEGORIES.find(c => c.id === 'video')?.components.find(c => c.id === 'video-widget')
    if (component) {
      components.push(component)
      reasoning.push("检测到需要视频播放，推荐使用视频播放器组件")
    }
  }

  if (lowerReq.includes('卡片') || lowerReq.includes('card') || lowerReq.includes('容器')) {
    const component = CATEGORIES.find(c => c.id === 'containers')?.components.find(c => c.id === 'container-card')
    if (component) {
      components.push(component)
      reasoning.push("检测到需要卡片容器，推荐使用Card组件")
    }
  }

  if (lowerReq.includes('模态框') || lowerReq.includes('modal') || lowerReq.includes('弹窗')) {
    const component = CATEGORIES.find(c => c.id === 'containers')?.components.find(c => c.id === 'container-modal')
    if (component) {
      components.push(component)
      reasoning.push("检测到需要弹窗，推荐使用Modal组件")
    }
  }

  if (lowerReq.includes('标签') || lowerReq.includes('tabs') || lowerReq.includes('tab')) {
    const component = CATEGORIES.find(c => c.id === 'containers')?.components.find(c => c.id === 'container-tabs')
    if (component) {
      components.push(component)
      reasoning.push("检测到需要标签页，推荐使用Tabs组件")
    }
  }

  if (lowerReq.includes('轮播') || lowerReq.includes('carousel') || lowerReq.includes('slide')) {
    const component = CATEGORIES.find(c => c.id === 'containers')?.components.find(c => c.id === 'container-carousel')
    if (component) {
      components.push(component)
      reasoning.push("检测到需要轮播，推荐使用Carousel组件")
    }
  }

  if (lowerReq.includes('浮层') || lowerReq.includes('popover') || lowerReq.includes('tooltip')) {
    const component = CATEGORIES.find(c => c.id === 'containers')?.components.find(c => c.id === 'container-popover')
    if (component) {
      components.push(component)
      reasoning.push("检测到需要浮层，推荐使用Popover组件")
    }
  }

  if (lowerReq.includes('面板') || lowerReq.includes('panel') || lowerReq.includes('折叠')) {
    const component = CATEGORIES.find(c => c.id === 'containers')?.components.find(c => c.id === 'container-panel')
    if (component) {
      components.push(component)
      reasoning.push("检测到需要面板，推荐使用Panel组件")
    }
  }

  if (lowerReq.includes('3d') || lowerReq.includes('三维') || lowerReq.includes('3d')) {
    const component = CATEGORIES.find(c => c.id === '3d')?.components.find(c => c.id === 'model-3d')
    if (component) {
      components.push(component)
      reasoning.push("检测到需要3D展示，推荐使用3D场景组件")
    }
  }

  if (components.length === 0) {
    // 默认推荐基础组件
    const basicComponent = CATEGORIES.find(c => c.id === 'basic')?.components[0]
    if (basicComponent) {
      components.push(basicComponent)
      reasoning.push("未检测到特定需求，推荐使用基础组件")
    }
  }

  return {
    components,
    description: `基于需求"${requirement}"，推荐使用以下组件：`,
    reasoning
  }
}

export { CATEGORIES, getComponentData, analyzeRequirement }