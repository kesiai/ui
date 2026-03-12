import type { ComponentConfig } from './types'

// 动态导入 registry 目录下所有的 config.tsx 文件
const registryModules = import.meta.glob('../../registry/**/config.tsx', { eager: true })

// 分类配置映射 - 根据组件功能分类，而不是目录结构
const categoryConfig: Record<string, { name: string; icon: string; order: number }> = {
  'containers': { name: '容器组件', icon: '📦', order: 0 },
  'data-source': { name: '数据源', icon: '🔌', order: 1 },
  'basic': { name: '基础组件', icon: '🧩', order: 2 },
  'form': { name: '表单组件', icon: '📝', order: 3 },
  'chart': { name: '图表组件', icon: '📊', order: 4 },
  'business': { name: '业务组件', icon: '💼', order: 5 },
  'view': { name: '视图组件', icon: '✳️', order: 6 },
  'gis': { name: 'GIS组件', icon: '🗺️', order: 7 },
  'video': { name: '视频组件', icon: '📹', order: 8 },
  'mobile': { name: '移动端组件', icon: '📱', order: 9 },
  '3d': { name: '三维组件', icon: '🌍', order: 9 }
}

// 根据组件 ID 判断分类
function getCategoryByComponentId(componentId: string): string {
  // 容器组件
  if (componentId.startsWith('container-')) {
    return 'containers'
  }

  // 数据源组件
  if (componentId.startsWith('datasource-')) {
    return 'data-source'
  }

  // 表单组件
  if (componentId.startsWith('form-')) {
    return 'form'
  }

  // 基础组件
  const basicComponents = [
    'button', 'text', 'image', 'status', 'statuses',
    'bar', 'iframe', 'textarea', 'shadcn-button',
    'connect-widget', 'svg'
  ]
  if (basicComponents.includes(componentId)) {
    return 'basic'
  }

  // 表单组件
  const formComponents = [
    'form',
    'table-select', 'table-data-select', 'point-table',
    // 表单输入组件
    'form-input', 'form-input-number', 'form-textarea',
    'form-select', 'form-checkbox', 'form-radio', 'form-switch',
    'form-slider', 'form-rate', 'form-upload',
    // 表单日期时间组件
    'form-date', 'form-date-range', 'form-time',
    // 表单数据组件
    'form-bytes-array', 'form-serial-number',
    // 表单业务组件
    'form-link', 'form-map', 'form-rich-text',
    'form-user-role', 'form-reference', 'form-form-info',
    'form-editable-table', 'form-relate', 'form-relate-plus',
    // 表单容器组件
    'form-area', 'form-field', 'form-widget',
    'form-tableField', 'schema-form'
  ]
  if (formComponents.includes(componentId)) {
    return 'form'
  }

  // 图表组件
  const chartComponents = [
    'chart-echarts', 'liquid-level', 'network-graph', 'node-tree-select', 'ruler-comp'
  ]
  if (chartComponents.includes(componentId)) {
    return 'chart'
  }

  // 视图组件
  if (componentId.startsWith('view-')) {
    return 'view'
  }

  // GIS组件
  if (componentId.startsWith('gis-')) {
    return 'gis'
  }

  // 视频组件
  if (componentId.startsWith('video-')) {
    return 'video'
  }

  // 移动端组件
  if (componentId.startsWith('mobile-')) {
    return 'mobile'
  }

  if (componentId.startsWith('model-3d')) {
    return '3d'
  }

  // 默认归为业务组件
  return 'business'
}

// 提取 registry 中的所有配置导出
const registryConfigs: Record<string, ComponentConfig> = {}

// 用于存储分类和组件的关系
const componentCategories: Array<{
  id: string
  name: string
  icon: string
  components: Array<{ id: string }>
}> = []

// 临时分类存储
const categoriesTemp: Record<string, string[]> = {}

for (const path in registryModules) {
  const module = registryModules[path] as any

  // 提取组件名（从路径中提取，不再依赖目录结构作为分类）
  // 支持:
  // 1. ../../registry/components/button/config.tsx
  // 2. ../../registry/components/container-tabs/config.tsx
  // 3. ../../registry/components/svg/config.tsx (业务组件)
  const match = path.match(/registry\/(components|blocks)\/(.+)\/config\.tsx$/)
  if (!match) continue

  const [, , componentPath] = match
  // 从路径中提取最后一部分作为组件ID
  const componentId = componentPath.split('/').pop() || componentPath

  // 获取组件配置
  let config: ComponentConfig | null = null
  if (module.default) {
    config = module.default as ComponentConfig
  } else if (module[`${componentId}Config`]) {
    config = module[`${componentId}Config`] as ComponentConfig
  } else {
    // 查找所有以 Config 结尾的导出
    for (const key in module) {
      if (key.endsWith('Config') && module[key]?.id) {
        config = module[key] as ComponentConfig
        break
      }
    }
  }

  if (config) {
    const finalComponentId = config.id || componentId
    registryConfigs[finalComponentId] = config

    // 根据组件 ID 判断分类
    const categoryKey = getCategoryByComponentId(finalComponentId)

    // 添加到临时分类
    if (!categoriesTemp[categoryKey]) {
      categoriesTemp[categoryKey] = []
    }
    categoriesTemp[categoryKey].push(finalComponentId)
  }
}

// 构建最终的分类数组
Object.entries(categoriesTemp)
  .sort(([, a], [, b]) => a.length - b.length) // 按组件数量排序
  .forEach(([categoryKey, componentIds]) => {
    const catConfig = categoryConfig[categoryKey]
    if (catConfig) {
      componentCategories.push({
        id: categoryKey,
        name: catConfig.name,
        icon: catConfig.icon,
        components: componentIds.map(id => ({ id }))
      })
    }
  })

// 按配置的顺序排序
componentCategories.sort((a, b) => {
  const orderA = categoryConfig[a.id]?.order ?? 999
  const orderB = categoryConfig[b.id]?.order ?? 999
  return orderA - orderB
})

// 导出配置
export { registryConfigs, componentCategories }

// 导出类型
export type { ComponentConfig, PropConfig, PropConfigOption, PropConfigType } from './types'
