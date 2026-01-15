import { useState, useMemo } from 'react'
import { barConfig, textConfig, textareaConfig, iframeConfig, buttonConfig, imageConfig, cardConfig, modalConfig, popoverConfig } from './config'
import { PropsFormPanel } from './components/PropsFormPanel'
import type { ComponentConfig } from './config/types'

// 组件分类定义
const componentCategories = [
  {
    id: 'business',
    name: '业务组件',
    icon: '💼',
    components: [
      { id: 'bar', config: barConfig },
      { id: 'text', config: textConfig },
      { id: 'textarea', config: textareaConfig },
      { id: 'iframe', config: iframeConfig },
      { id: 'button', config: buttonConfig },
      { id: 'image', config: imageConfig }
    ]
  },
  {
    id: 'form',
    name: '表单组件',
    icon: '📝',
    components: []
  },
  {
    id: 'chart',
    name: '图表组件',
    icon: '📊',
    components: []
  },
  {
    id: 'advanced',
    name: '高级组件',
    icon: '⚡',
    components: []
  },
  {
    id: '3d',
    name: '3D 组件',
    icon: '🎮',
    components: []
  },
  {
    id: 'video',
    name: '视频组件',
    icon: '🎬',
    components: []
  },
  {
    id: 'view',
    name: '视图组件',
    icon: '👁️',
    components: []
  },
  {
    id: 'containers',
    name: '容器组件',
    icon: '📦',
    components: [
      { id: 'card', config: cardConfig },
      { id: 'modal', config: modalConfig },
      { id: 'popover', config: popoverConfig }
    ]
  }
]

// 组件配置映射
const componentConfigMap: Record<string, ComponentConfig> = {
  bar: barConfig,
  text: textConfig,
  textarea: textareaConfig,
  iframe: iframeConfig,
  button: buttonConfig,
  image: imageConfig,
  card: cardConfig,
  modal: modalConfig,
  popover: popoverConfig
}

function App() {
  const [selectedCategory, setSelectedCategory] = useState('business')
  const [selectedComponent, setSelectedComponent] = useState('bar')

  // 为每个组件维护独立的状态
  const [componentProps, setComponentProps] = useState<Record<string, Record<string, any>>>({
    bar: barConfig.defaultProps,
    text: textConfig.defaultProps,
    textarea: textareaConfig.defaultProps,
    iframe: iframeConfig.defaultProps,
    button: buttonConfig.defaultProps,
    image: imageConfig.defaultProps,
    card: cardConfig.defaultProps,
    modal: modalConfig.defaultProps,
    popover: popoverConfig.defaultProps
  })

  // 获取当前选中的组件配置
  const currentComponentConfig = useMemo(() => {
    return componentConfigMap[selectedComponent]
  }, [selectedComponent])

  // 获取当前组件的分类信息
  const currentComponentInfo = useMemo(() => {
    const category = componentCategories.find(cat => cat.id === selectedCategory)
    return category?.components.find(comp => comp.id === selectedComponent)
  }, [selectedCategory, selectedComponent])

  // 处理属性变化
  const handlePropChange = (propName: string, value: any) => {
    setComponentProps(prev => ({
      ...prev,
      [selectedComponent]: {
        ...prev[selectedComponent],
        [propName]: value
      }
    }))
  }

  // 渲染当前组件的预览
  const renderComponentPreview = () => {
    if (!currentComponentConfig) {
      return (
        <div className="h-full flex items-center justify-center">
          <p className="text-slate-500">请选择一个组件</p>
        </div>
      )
    }

    const currentProps = componentProps[selectedComponent] || {}
    return currentComponentConfig.renderPreview(currentProps)
  }

  // 渲染属性表单
  const renderPropsForm = () => {
    if (!currentComponentConfig) {
      return (
        <div className="text-center text-slate-500 py-12">
          <p>该组件暂无属性配置</p>
        </div>
      )
    }

    const currentProps = componentProps[selectedComponent] || {}
    return (
      <PropsFormPanel
        config={currentComponentConfig}
        props={currentProps}
        onChange={handlePropChange}
      />
    )
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Component Library
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              组件展示与配置平台
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">
              {componentCategories.reduce((acc, cat) => acc + cat.components.length, 0)} 个组件
            </span>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧导航 */}
        <aside className="w-64 bg-white border-r border-slate-200 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
              组件分类
            </h2>
            <nav className="space-y-1">
              {componentCategories.map((category) => (
                <div key={category.id}>
                  <button
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                    <span className="ml-auto text-xs text-slate-500">
                      {category.components.length}
                    </span>
                  </button>

                  {/* 展开显示组件列表 */}
                  {selectedCategory === category.id && category.components.length > 0 && (
                    <div className="ml-6 mt-1 space-y-1">
                      {category.components.map((component) => (
                        <button
                          key={component.id}
                          onClick={() => setSelectedComponent(component.id)}
                          className={`w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors ${
                            selectedComponent === component.id
                              ? 'bg-blue-100 text-blue-700 font-medium'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {component.config?.name || component.id}
                        </button>
                      ))}
                    </div>
                  )}

                  {selectedCategory === category.id && category.components.length === 0 && (
                    <div className="ml-6 mt-1 text-xs text-slate-500 py-1.5">
                      暂无组件
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* 右侧内容区 */}
        <main className="flex-1 flex overflow-hidden">
          {/* 组件预览区 */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full">
                <div className="border-b border-slate-200 px-6 py-4">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {currentComponentInfo?.config?.name || '组件预览'}
                  </h2>
                </div>
                <div className="p-6" style={{ minHeight: '400px' }}>
                  {renderComponentPreview()}
                </div>
              </div>
            </div>
          </div>

          {/* 属性配置面板 */}
          <aside className="w-96 bg-white border-l border-slate-200 overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">
                属性配置
              </h2>
              {renderPropsForm()}
            </div>
          </aside>
        </main>
      </div>
    </div>
  )
}

export default App
