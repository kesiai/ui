import { useState, useMemo } from 'react'
import { barConfig, textConfig, textareaConfig, iframeConfig, buttonConfig, imageConfig, cardConfig, carouselConfig, contextProviderConfig, iterationConfig, modalConfig, popoverConfig, panelConfig,
  tabsConfig, statusConfig, model3dConfig, statusesConfig, playerConfig, qrcodeConfig, chartLineConfig, chartBarConfig, dateRangeConfig, areaConfig, rateConfig, mobilePickerConfig, dataPointConfig,
  formInputConfig, formSelectConfig, formInputNumberConfig, formSliderConfig, formRadioConfig, formSwitchConfig, formCheckboxConfig, formDateConfig, formConfig, formFieldConfig, schemaFormConfig, mobilePopupConfig, mobileCalendarConfig,
  mobileNavBarConfig, mobileLocationConfig, mobileScanQRConfig,
  buttonControlConfig, videoControlConfig, videoPeriodsConfig, timeAxisConfig, videoPlaybackConfig, connectWidgetConfig, dataSourceConfig } from './config'
import { PropsFormPanel } from './components/PropsFormPanel'
import { LoginDialog } from './components/LoginDialog'
import type { ComponentConfig } from './config/types'
import { setConfig, useUser, useLogout } from '@airiot/client'

// 配置 @airiot/client
const apiHost = import.meta.env.VITE_AIRIOT_API_URL 
const projectId = import.meta.env.VITE_AIRIOT_PROJECT_ID

console.log('🔧 配置 @airiot/client:', { apiHost, projectId })

try {
  setConfig({
    language: 'zh-CN',
    rest: apiHost + '/rest/',
    projectId,
    settings: {
      apiHost,
      projectId,
    }
  })
} catch (error) {
  console.warn('Failed to set @airiot/client config:', error)
}

// 组件分类定义
const componentCategories = [
  {
    id: 'business',
    name: '业务组件',
    icon: '💼',
    components: [
      { id: 'data-source', config: dataSourceConfig },
      { id: 'bar', config: barConfig },
      { id: 'text', config: textConfig },
      { id: 'textarea', config: textareaConfig },
      { id: 'iframe', config: iframeConfig },
      { id: 'button', config: buttonConfig },
      { id: 'image', config: imageConfig },
      { id: 'status', config: statusConfig },
      { id: 'statuses', config: statusesConfig },
      { id: 'data-point', config: dataPointConfig }
    ]
  },
  {
    id: 'form',
    name: '表单组件',
    icon: '📝',
    components: [
      { id: 'form', config: formConfig },
      { id: 'form-field', config: formFieldConfig },
      { id: 'schema-form', config: schemaFormConfig },
      { id: 'form-date-range', config: dateRangeConfig },
      { id: 'form-area', config: areaConfig },
      { id: 'form-rate', config: rateConfig },
      { id: 'form-input', config: formInputConfig },
      { id: 'form-input-number', config: formInputNumberConfig },
      { id: 'form-select', config: formSelectConfig },
      { id: 'form-slider', config: formSliderConfig },
      { id: 'form-radio', config: formRadioConfig },
      { id: 'form-switch', config: formSwitchConfig },
      { id: 'form-checkbox', config: formCheckboxConfig },
      { id: 'form-date', config: formDateConfig }
    ]
  },
  {
    id: 'chart',
    name: '图表组件',
    icon: '📊',
    components: [
      { id: 'chart-line', config: chartLineConfig },
      { id: 'chart-bar', config: chartBarConfig }
    ]
  },
  {
    id: 'advanced',
    name: '高级组件',
    icon: '⚡',
    components: [
      { id: 'qrcode', config: qrcodeConfig },
      { id: 'player', config: playerConfig },
      { id: 'connectWidget', config: connectWidgetConfig }
    ]
  },
  {
    id: '3d',
    name: '3D 组件',
    icon: '🎮',
    components: [
      { id: 'model-3d', config: model3dConfig }
    ]
  },
  {
    id: 'video',
    name: '视频组件',
    icon: '🎬',
    components: [
      { id: 'buttonControl', config: buttonControlConfig },
      { id: 'videoControl', config: videoControlConfig },
      { id: 'videoPeriods', config: videoPeriodsConfig },
      { id: 'timeAxis', config: timeAxisConfig },
      { id: 'videoPlayback', config: videoPlaybackConfig }
    ]
  },
  {
    id: 'view',
    name: '视图组件',
    icon: '👁️',
    components: []
  },
  {
    id: 'mobile',
    name: '移动端组件',
    icon: '📱',
    components: [
      { id: 'mobile-nav-bar', config: mobileNavBarConfig },
      { id: 'mobile-location', config: mobileLocationConfig },
      { id: 'mobile-scan-qr', config: mobileScanQRConfig },
      { id: 'mobile-popup', config: mobilePopupConfig },
      { id: 'mobile-calendar', config: mobileCalendarConfig },
      { id: 'mobile-picker', config: mobilePickerConfig }
    ]
  },
  {
    id: 'containers',
    name: '容器组件',
    icon: '📦',
    components: [
      { id: 'card', config: cardConfig },
      { id: 'carousel', config: carouselConfig },
      { id: 'context-provider', config: contextProviderConfig },
      { id: 'iteration', config: iterationConfig },
      { id: 'modal', config: modalConfig },
      { id: 'popover', config: popoverConfig },
      { id: 'panel', config: panelConfig },
      { id: 'tabs', config: tabsConfig }
    ]
  }
]

// 组件配置映射
const componentConfigMap: Record<string, ComponentConfig> = {
  'data-source': dataSourceConfig,
  bar: barConfig,
  qrcode: qrcodeConfig,
  'chart-line': chartLineConfig,
  'chart-bar': chartBarConfig,
  text: textConfig,
  textarea: textareaConfig,
  iframe: iframeConfig,
  button: buttonConfig,
  image: imageConfig,
  card: cardConfig,
  carousel: carouselConfig,
  'context-provider': contextProviderConfig,
  iteration: iterationConfig,
  modal: modalConfig,
  popover: popoverConfig,
  panel: panelConfig,
  tabs: tabsConfig,
  status: statusConfig,
  'model-3d': model3dConfig,
  statuses: statusesConfig,
  player: playerConfig,
  'form-date-range': dateRangeConfig,
  'form-area': areaConfig,
  'form-rate': rateConfig,
  form: formConfig,
  'form-field': formFieldConfig,
  'schema-form': schemaFormConfig,
  'mobile-picker': mobilePickerConfig,
  'data-point': dataPointConfig,
  'form-input': formInputConfig,
  'form-select': formSelectConfig,
  'form-input-number': formInputNumberConfig,
  'form-slider': formSliderConfig,
  'form-radio': formRadioConfig,
  'form-switch': formSwitchConfig,
  'form-checkbox': formCheckboxConfig,
  'form-date': formDateConfig,
  'mobile-popup': mobilePopupConfig,
  'mobile-calendar': mobileCalendarConfig,
  'mobile-nav-bar': mobileNavBarConfig,
  'mobile-location': mobileLocationConfig,
  'mobile-scan-qr': mobileScanQRConfig,
  buttonControl: buttonControlConfig,
  videoControl: videoControlConfig,
  videoPeriods: videoPeriodsConfig,
  timeAxis: timeAxisConfig,
  videoPlayback: videoPlaybackConfig,
  connectWidget: connectWidgetConfig
}

function App() {
  const { user: globalUser } = useUser()
  const { onLogout } = useLogout()
  const [selectedCategory, setSelectedCategory] = useState('business')
  const [selectedComponent, setSelectedComponent] = useState('bar')
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)

  // 处理登录成功
  const handleLoginSuccess = () => {
    // @airiot/client 会自动处理用户状态
    console.log('登录成功')
  }

  // 处理登出
  const handleLogout = () => {
    onLogout()
    window.location.reload()
  }

  // 为每个组件维护独立的状态
  const [componentProps, setComponentProps] = useState<Record<string, Record<string, any>>>({
    'data-source': dataSourceConfig.defaultProps,
    bar: barConfig.defaultProps,
    qrcode: qrcodeConfig.defaultProps,
    'chart-line': chartLineConfig.defaultProps,
    'chart-bar': chartBarConfig.defaultProps,
    text: textConfig.defaultProps,
    textarea: textareaConfig.defaultProps,
    iframe: iframeConfig.defaultProps,
    button: buttonConfig.defaultProps,
    image: imageConfig.defaultProps,
    card: cardConfig.defaultProps,
    carousel: carouselConfig.defaultProps,
    'context-provider': contextProviderConfig.defaultProps,
    iteration: iterationConfig.defaultProps,
    modal: modalConfig.defaultProps,
    popover: popoverConfig.defaultProps,
    panel: panelConfig.defaultProps,
    tabs: tabsConfig.defaultProps,
    status: statusConfig.defaultProps,
    'model-3d': model3dConfig.defaultProps,
    statuses: statusesConfig.defaultProps,
    player: playerConfig.defaultProps,
    'form-date-range': dateRangeConfig.defaultProps,
    'form-area': areaConfig.defaultProps,
    'form-rate': rateConfig.defaultProps,
    form: formConfig.defaultProps,
    'form-field': formFieldConfig.defaultProps,
    'schema-form': schemaFormConfig.defaultProps,
    'mobile-picker': mobilePickerConfig.defaultProps,
    'data-point': dataPointConfig.defaultProps,
    'form-input': formInputConfig.defaultProps,
    'form-select': formSelectConfig.defaultProps,
    'form-input-number': formInputNumberConfig.defaultProps,
    'form-slider': formSliderConfig.defaultProps,
    'form-radio': formRadioConfig.defaultProps,
    'form-switch': formSwitchConfig.defaultProps,
    'form-checkbox': formCheckboxConfig.defaultProps,
    'form-date': formDateConfig.defaultProps,
    'mobile-popup': mobilePopupConfig.defaultProps,
    'mobile-calendar': mobileCalendarConfig.defaultProps,
    'mobile-nav-bar': mobileNavBarConfig.defaultProps,
    'mobile-location': mobileLocationConfig.defaultProps,
    'mobile-scan-qr': mobileScanQRConfig.defaultProps,
    buttonControl: buttonControlConfig.defaultProps,
    videoControl: videoControlConfig.defaultProps,
    videoPeriods: videoPeriodsConfig.defaultProps,
    timeAxis: timeAxisConfig.defaultProps,
    videoPlayback: videoPlaybackConfig.defaultProps,
    connectWidget: connectWidgetConfig.defaultProps
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
    <>
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
              <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                {globalUser && (globalUser.token || globalUser.username || globalUser.id) ? (
                  <>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900">{globalUser.name || globalUser.username || globalUser.id || '用户'}</p>
                      <p className="text-xs text-slate-500">{globalUser.projectId || projectId || '未知项目'}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      登出
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setLoginDialogOpen(true)}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    登录
                  </button>
                )}
              </div>
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
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${selectedCategory === category.id
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
                          className={`w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors ${selectedComponent === component.id
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

    {/* 登录弹窗 */}
    <LoginDialog
      open={loginDialogOpen}
      onOpenChange={setLoginDialogOpen}
      onLoginSuccess={handleLoginSuccess}
    />
  </>
  )
}

export default App
