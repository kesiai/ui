import React from 'react'
import { ComponentConfig } from '../config/types'
import { FormControl } from './FormControl'

interface PropsFormPanelProps {
  config: ComponentConfig
  props: Record<string, any>
  onChange: (name: string, value: any) => void
}

export const PropsFormPanel: React.FC<PropsFormPanelProps> = ({ config, props, onChange }) => {
  return (
    <div className="space-y-4">
      {/* 渲染标准属性表单 */}
      {config.propsConfig.map(propConfig => (
        <div key={propConfig.name} className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            {propConfig.label}
          </label>
          <FormControl
            config={propConfig}
            value={props[propConfig.name]}
            onChange={onChange}
          />
        </div>
      ))}

      {/* 渲染自定义表单（如果有） */}
      {config.renderCustomForm && config.renderCustomForm(props, onChange)}

      {/* 代码预览 */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          代码预览
        </label>
        <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-slate-100">
            <code>{config.renderCodePreview ? config.renderCodePreview(props) : '// Code preview not available'}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
