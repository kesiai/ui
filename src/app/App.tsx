import { useState, useMemo } from 'react'
import { Bar } from '../registry/blocks/business/bar/bar'

// 组件分类定义
const componentCategories = [
  {
    id: 'business',
    name: '业务组件',
    icon: '💼',
    components: [
      { id: 'bar', name: 'Bar 进度条', component: Bar }
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
    components: []
  }
]

// Bar 组件的属性配置
const barPropConfig = [
  {
    name: 'value',
    label: '当前值',
    type: 'number',
    default: 50,
    min: 0,
    max: 100
  },
  {
    name: 'maxValue',
    label: '最大值',
    type: 'number',
    default: 100,
    min: 1
  },
  {
    name: 'color',
    label: '填充颜色',
    type: 'color',
    default: '#3b82f6'
  },
  {
    name: 'borderColor',
    label: '边框颜色',
    type: 'color',
    default: ''
  },
  {
    name: 'direction',
    label: '方向',
    type: 'select',
    default: 'horizontal',
    options: [
      { value: 'horizontal', label: '水平' },
      { value: 'vertical', label: '垂直' }
    ]
  },
  {
    name: 'position',
    label: '起始位置',
    type: 'select',
    default: 'start',
    options: [
      { value: 'start', label: '起始位置' },
      { value: 'end', label: '末端位置' }
    ]
  },
  {
    name: 'visualMap',
    label: '启用颜色映射',
    type: 'boolean',
    default: false
  }
]

function App() {
  const [selectedCategory, setSelectedCategory] = useState('business')
  const [selectedComponent, setSelectedComponent] = useState('bar')
  const [barProps, setBarProps] = useState({
    value: 50,
    maxValue: 100,
    color: '#3b82f6',
    borderColor: '',
    direction: 'horizontal' as 'horizontal' | 'vertical',
    position: 'start' as 'start' | 'end',
    visualMap: false
  })

  // 获取当前选中的组件
  const currentComponent = useMemo(() => {
    const category = componentCategories.find(cat => cat.id === selectedCategory)
    return category?.components.find(comp => comp.id === selectedComponent)
  }, [selectedCategory, selectedComponent])

  // 处理属性变化
  const handlePropChange = (propName: string, value: any) => {
    setBarProps(prev => ({
      ...prev,
      [propName]: value
    }))
  }

  // 渲染表单控件
  const renderFormControl = (config: any) => {
    const value = barProps[config.name as keyof typeof barProps]

    switch (config.type) {
      case 'number':
        return (
          <input
            type="number"
            value={value as number}
            onChange={(e) => handlePropChange(config.name, Number(e.target.value))}
            min={config.min}
            max={config.max}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        )

      case 'color':
        return (
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value as string || '#000000'}
              onChange={(e) => handlePropChange(config.name, e.target.value)}
              className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
            />
            <input
              type="text"
              value={value as string}
              onChange={(e) => handlePropChange(config.name, e.target.value)}
              placeholder="#000000"
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        )

      case 'select':
        return (
          <select
            value={value as string}
            onChange={(e) => handlePropChange(config.name, e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
          >
            {config.options.map((opt: any) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )

      case 'boolean':
        return (
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={value as boolean}
              onChange={(e) => handlePropChange(config.name, e.target.checked)}
              className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-600">{value ? '是' : '否'}</span>
          </label>
        )

      default:
        return null
    }
  }

  // 渲染当前组件的属性表单
  const renderPropsForm = () => {
    if (selectedComponent === 'bar') {
      return (
        <div className="space-y-4">
          {barPropConfig.map(config => (
            <div key={config.name} className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                {config.label}
              </label>
              {renderFormControl(config)}
            </div>
          ))}

          {/* 颜色映射配置（当启用时显示） */}
          {barProps.visualMap && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-slate-700 mb-3">
                颜色映射配置
              </p>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-green-500"></div>
                  <span>值 ≥ 30: 绿色</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-yellow-500"></div>
                  <span>值 ≥ 60: 黄色</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-red-500"></div>
                  <span>值 ≥ 90: 红色</span>
                </div>
              </div>
            </div>
          )}

          {/* 代码预览 */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              代码预览
            </label>
            <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-slate-100">
                <code>{`<Bar
  value={${barProps.value}}
  maxValue={${barProps.maxValue}}
  color="${barProps.color}"
  ${barProps.borderColor ? `borderColor="${barProps.borderColor}"` : ''}
  direction="${barProps.direction}"
  position="${barProps.position}"
  ${barProps.visualMap ? `visualMap={[...]}` : ''}
/>`}</code>
              </pre>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="text-center text-slate-500 py-12">
        <p>该组件暂无属性配置</p>
      </div>
    )
  }

  // 渲染当前组件的预览
  const renderComponentPreview = () => {
    const visualMap = barProps.visualMap ? [
      { data: 30, color: '#22c55e' },
      { data: 60, color: '#eab308' },
      { data: 90, color: '#ef4444' }
    ] : []

    if (selectedComponent === 'bar') {
      return (
        <div className="h-full flex items-center justify-center p-8">
          <div className="w-full h-48 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center p-4">
              <Bar
                value={barProps.value}
                maxValue={barProps.maxValue}
                color={barProps.color}
                borderColor={barProps.borderColor || undefined}
                direction={barProps.direction}
                position={barProps.position}
                visualMap={visualMap}
              />
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-slate-500">请选择一个组件</p>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              My Component Library
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
                          {component.name}
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
                    {currentComponent?.name || '组件预览'}
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
