import type { ComponentConfig } from './types'

// 动态导入 registry/blocks 目录下所有的 config.tsx 文件
const registryModules = import.meta.glob('../../registry/blocks/**/config.tsx', { eager: true })

// 分类配置映射
const categoryConfig: Record<string, { name: string; icon: string; order: number }> = {
  'components': { name: '基础组件', icon: '🧩', order: 0 },
  'business': { name: '业务组件', icon: '💼', order: 1 },
  'form': { name: '表单组件', icon: '📝', order: 2 },
  'view': { name: '视图组件', icon: '✳️', order: 2 },
  'table-field': { name: '表格字段组件', icon: '📋', order: 3 },
  'chart': { name: '图表组件', icon: '📊', order: 4 },
  'advanced': { name: '高级组件', icon: '⚡', order: 5 },
  '3d': { name: '3D 组件', icon: '🎮', order: 6 },
  'gis': { name: '地图组件', icon: '🗺️', order: 7 },
  'video': { name: '视频组件', icon: '🎬', order: 8 },
  'mobile': { name: '移动端组件', icon: '📱', order: 9 },
  'containers': { name: '容器组件', icon: '📦', order: 10 },
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

  // 提取分类和组件名
  // 例如: ../../registry/blocks/form/form-input/config.tsx
  const match = path.match(/registry\/blocks\/([^/]+)\/([^/]+)\/config\.tsx$/)
  if (!match) continue

  const [, categoryDir, componentDir] = match
  const componentId = componentDir

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
    registryConfigs[config.id || componentId] = config

    // 添加到临时分类
    if (!categoriesTemp[categoryDir]) {
      categoriesTemp[categoryDir] = []
    }
    categoriesTemp[categoryDir].push(config.id || componentId)
  }
}

// 构建最终的分类数组
Object.entries(categoriesTemp)
  .sort(([, a], [, b]) => a.length - b.length) // 按组件数量排序
  .forEach(([categoryDir, componentIds]) => {
    const catConfig = categoryConfig[categoryDir]
    if (catConfig) {
      componentCategories.push({
        id: categoryDir,
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
