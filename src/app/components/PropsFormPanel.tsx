import React, { useMemo, useCallback } from 'react'
import { ComponentConfig } from '../config/types'
import { FormControl } from './FormControl'

interface PropsFormPanelProps {
  config: ComponentConfig
  props: Record<string, any>
  onChange: (name: string, value: any) => void
}

export const PropsFormPanel: React.FC<PropsFormPanelProps> = ({ config, props, onChange }) => {
  // 检查是否是数据源组件（有 submit 属性）
  const hasSubmitProp = useMemo(() => {
    return config.propsConfig.some(p => p.name === 'submit')
  }, [config.propsConfig])

  // 处理属性值变化，当 tableId 变化时清空依赖它的配置项
  const handleChange = useCallback((name: string, value: any) => {
    // 先更新当前属性值
    onChange(name, value)

    // 如果修改的是 tableId，清空所有依赖于它的配置项
    if (name === 'tableId') {
      config.propsConfig.forEach(propConfig => {
        if (propConfig.dependsOn === 'tableId') {
          onChange(propConfig.name, propConfig.default)
        }
      })
    }
  }, [config.propsConfig, onChange])

  // 生成新的 submit 值
  const handleRefresh = () => {
    const newSubmit = Date.now().toString() + Math.random().toString(36).substring(2, 9)
    handleChange('submit', newSubmit)
  }

  return (
    <div className="space-y-4">
      {/* 数据源刷新按钮 */}
      {hasSubmitProp && (
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-sm font-medium text-blue-900">数据源</span>
          <button
            onClick={handleRefresh}
            className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
          >
            刷新数据
          </button>
        </div>
      )}

      {/* 渲染标准属性表单 */}
      {config.propsConfig.map(propConfig => {
        // 跳过 submit 属性，不显示在表单中
        if (propConfig.name === 'submit') {
          return null
        }

        // 使用默认值当 props 中的值为 undefined
        const propValue = props[propConfig.name] !== undefined
          ? props[propConfig.name]
          : config.defaultProps[propConfig.name]

        return (
          <div key={propConfig.name} className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              {propConfig.label}
            </label>
            <FormControl
              config={propConfig}
              value={propValue}
              onChange={handleChange}
              allValues={props} // 传入所有 props 值，用于处理依赖关系
            />
          </div>
        )
      })}

      {/* 渲染自定义表单（如果有） */}
      {config.renderCustomForm && config.renderCustomForm(props, handleChange)}

      {/* 代码预览 */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          代码预览
        </label>
        <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-slate-100">
            <code>{
              config.renderCodePreview
                ? config.renderCodePreview({
                    ...config.defaultProps,
                    ...props
                  })
                : '// Code preview not available'
            }</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
