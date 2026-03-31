import React, { useState } from 'react'
import { registryConfigs, componentCategories } from './config'
import { PropsFormPanel } from './components/PropsFormPanel'
import { DocumentationViewer } from './components/DocumentationViewer'
import { LoginDialog } from './components/LoginDialog'
import { EventsTestPage } from './components/EventsTestPage'
import type { ComponentConfig } from './config/types'
import { setConfig, useUser, useLogout } from '@airiot/client'
import { Routes, Route, Link, useParams, Outlet } from 'react-router-dom'
import { GlobalDialogs } from '@/registry/components/events/events'
import { toast } from 'sonner'
// 配置 @airiot/client
const apiHost = 'http://192.168.99.101:3031'
const projectId = 'ljnew'

// console.log('🔧 配置 @airiot/client:', { apiHost, projectId })
// console.log('🔧 配置 @airiot/client:', { componentCategories })
try {
  const { loadUser } = useUser()
  setConfig({
    language: 'zh-CN',
    rest: apiHost + '/rest/',
    projectId,
    toast: toast,
    settings: {
      apiHost,
      projectId,
    }
  })
  loadUser()
} catch (error) {
  console.warn('Failed to set @airiot/client config:', error)
}

// 组件配置映射
const componentConfigMap: Record<string, ComponentConfig> = registryConfigs

// 欢迎页组件
function WelcomePage() {
  return (
    <div className="text-center w-full flex flex-col justify-center items-center h-full">
      <div className="text-6xl mb-6">📚</div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">欢迎使用组件库</h2>
      <p className="text-slate-600 mb-6">请从左侧菜单选择一个组件查看详情</p>
      <div className="text-sm text-slate-500">
        共 {componentCategories.reduce((acc, cat) => acc + cat.components.length, 0)} 个组件
        分为 {componentCategories.length} 个分类
      </div>
    </div>
  )
}

// 组件详情页组件
function ComponentDetailPage() {
  const { componentId } = useParams<{ componentId: string }>()
  const componentConfig = componentConfigMap[componentId || '']

  const [componentProps, setComponentProps] = useState<Record<string, any>>(
    componentConfig?.defaultProps || {}
  )

  if (!componentConfig) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">组件未找到</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            返回首页
          </Link>
        </div>
      </div>
    )
  }

  // 处理属性变化
  const handlePropChange = (propName: string, value: any) => {
    setComponentProps(prev => ({
      ...prev,
      [propName]: value
    }))
  }

  // 渲染当前组件的预览
  const renderComponentPreview = () => {
    return componentConfig.renderPreview(componentProps)
  }

  return (
    <div className="flex w-full relative">
      {/* 左侧：组件预览区和文档区 */}
      <div className="flex-1 overflow-auto flex flex-col">
        {/* 组件预览区 */}
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                组件预览
              </h2>
            </div>
            <div className="p-6" style={{ minHeight: '400px' }}>
              {renderComponentPreview()}
            </div>
          </div>
        </div>

        {/* 文档展示区 */}
        {componentConfig.documentation && (
          <div className="px-6 pb-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="border-b border-slate-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  组件文档
                </h2>
              </div>
              <DocumentationViewer content={componentConfig.documentation} />
            </div>
          </div>
        )}
      </div>

      {/* 右侧：属性配置面板 */}
      <aside className="w-96 bg-white border-l border-slate-200 overflow-y-auto">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
            属性配置
          </h2>
          <PropsFormPanel
            config={componentConfig}
            props={componentProps}
            onChange={handlePropChange}
          />
        </div>
      </aside>
    </div>
  )
}

// HomePage - 包含左侧菜单和右侧内容区
function HomePage() {
  const { user: globalUser } = useUser()
  const { onLogout } = useLogout()
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)

  const handleLogout = () => {
    onLogout()
  }

  return (
    <>
      <div className="h-screen flex flex-col bg-slate-50">
        {/* 顶部导航栏 */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/" className="hover:opacity-80 transition-opacity">
                <h1 className="text-2xl font-bold text-slate-900">
                  Kesi UI
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  组件展示与配置平台
                </p>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/test-events"
                className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
              >
                事件测试
              </Link>
              <span className="text-sm text-slate-600 border-l border-slate-200 pl-4">
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
          {/* 左侧菜单 */}
          <aside className="w-80 min-w-80 bg-white border-r border-slate-200 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
                组件分类
              </h2>
              <nav className="space-y-1">
                {componentCategories.map((category) => (
                  <div key={category.id}>
                    <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-slate-700 bg-slate-50">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                      <span className="ml-auto text-xs text-slate-500">
                        {category.components.length}
                      </span>
                    </div>

                    {/* 组件列表 */}
                    {category.components.length > 0 && (
                      <div className="ml-6 mt-1 space-y-1">
                        {category.components.map((component) => {
                          const config = registryConfigs[component.id]
                          return (
                            <Link
                              key={component.id}
                              to={`/component/${component.id}`}
                              className="w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors block text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                            >
                              {config?.name?.split(' ').slice(1).join(' ') || component.id}
                            </Link>
                          )
                        })}
                      </div>
                    )}

                    {category.components.length === 0 && (
                      <div className="ml-6 mt-1 text-xs text-slate-500 py-1.5">
                        暂无组件
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </aside>

          {/* 右侧内容区 - 使用 Outlet 渲染子路由 */}
          <main className="flex-1 flex">
            <Outlet />
          </main>
        </div>
      </div>

      {/* 登录弹窗 */}
      <LoginDialog
        open={loginDialogOpen}
        onOpenChange={setLoginDialogOpen}
        onLoginSuccess={() => console.log('登录成功')}
      />
    </>
  )
}

// 主 App 组件
function App() {
  return (
    <>
      <GlobalDialogs />
      <Routes>
        <Route path="/" element={<HomePage />}>
          {/* 默认路由：显示欢迎页 */}
          <Route index element={<WelcomePage />} />

          {/* 组件详情路由：嵌套在 HomePage 内部 */}
          <Route
            path="component/:componentId"
            element={
              <ComponentDetailPageWrapper />
            }
          />
        </Route>

        {/* 事件测试页面路由 */}
        <Route
          path="test-events"
          element={<EventsTestPage />}
        />

        {/* 404 页面 */}
        <Route path="*" element={
          <div className="h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-900 mb-4">页面未找到</h1>
              <Link to="/" className="text-blue-600 hover:text-blue-700">
                返回首页
              </Link>
            </div>
          </div>
        } />
      </Routes>
    </>
  )
}

// ComponentDetailPage 包装器 - 用于添加 key 实现完全重新渲染
function ComponentDetailPageWrapper() {
  const { componentId } = useParams<{ componentId: string }>()
  return <ComponentDetailPage key={componentId} />
}

export default App
