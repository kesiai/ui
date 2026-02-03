import React, { useState } from 'react'
import { PropConfig } from '../config/types'
import { CodeEditorModal } from './CodeEditorModal'

const modelRegistry = () => {}
interface FormControlProps {
  config: PropConfig
  value: any
  onChange: (name: string, value: any) => void
}

export const FormControl: React.FC<FormControlProps> = ({ config, value, onChange }) => {
  const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false)

  const handleChange = (newValue: any) => {
    onChange(config.name, newValue)
  }

  const handleOpenCodeEditor = () => {
    setIsCodeEditorOpen(true)
  }

  const handleCloseCodeEditor = () => {
    setIsCodeEditorOpen(false)
  }

  const handleSaveCode = (code: string) => {
    console.log('Saving code:', config.name, code)
    onChange(config.name, code)
  }

  switch (config.type) {
    case 'number':
      return (
        <input
          type="number"
          value={value as number}
          onChange={(e) => handleChange(Number(e.target.value))}
          min={config.min}
          max={config.max}
          step={config.step}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      )

    case 'text':
      return (
        <input
          type="text"
          value={value as string}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={config.placeholder}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      )

    case 'color':
      return (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={value as string || '#000000'}
            onChange={(e) => handleChange(e.target.value)}
            className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
          />
          <input
            type="text"
            value={value as string}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="#000000"
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
      )

    case 'select':
      return (
        <select
          value={value as string}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
        >
          {config.options?.map((opt) => (
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
            onChange={(e) => handleChange(e.target.checked)}
            className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm text-slate-600">{value ? '是' : '否'}</span>
        </label>
      )

    case 'range':
      return (
        <div className="space-y-2">
          <input
            type="range"
            value={value as number}
            onChange={(e) => handleChange(Number(e.target.value))}
            min={config.min}
            max={config.max}
            step={config.step || 1}
            className="w-full"
          />
          <div className="text-sm text-slate-600 text-center">{value}</div>
        </div>
      )

    case 'code':
      return (
        <div>
          <button
            onClick={handleOpenCodeEditor}
            className="w-full px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            {value ? '编辑图表代码' : '添加图表代码'}
          </button>
          {value && (
            <p className="mt-2 text-xs text-slate-500">
              已配置自定义图表代码
            </p>
          )}
          <CodeEditorModal
            isOpen={isCodeEditorOpen}
            onClose={handleCloseCodeEditor}
            code={value as string}
            onSave={handleSaveCode}
            title={config.label}
          />
        </div>
      )
    case 'array':
      return (
        <div className="space-y-2">
          <textarea
            value={value ? JSON.stringify(value, null, 2) : ''}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value)
                handleChange(parsed)
              } catch (error) {
              }
            }}
            placeholder='请输入JSON数组'
            rows={6}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono text-sm"
          />
          <div className="text-xs text-slate-500">
            {/* {config.description || '支持JSON数组格式'} */}
          </div>
        </div>
      )
    case 'object':
      return (
        <div className="space-y-2">
          <textarea
            value={value ? JSON.stringify(value, null, 2) : ''}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value)
                handleChange(parsed)
              } catch (error) {
              }
            }}
            placeholder='请输入JSON对象'
            rows={8}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono text-sm"
          />
          <div className="text-xs text-slate-500">
            {config.description || '支持JSON对象格式'}
          </div>
        </div>
      )
    case 'input':
      return (
        <input
          type="text"
          value={value as string || ''}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={config.placeholder}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      )
    case 'model-name':
      const optons = Object.keys(modelRegistry.models).map(key => ({ value: key, label: modelRegistry.models[key].title?.toString() || key }))
      return (
        <select
          value={value as string}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
        >
          <option key={""} value={""}>
            无
          </option>
          {optons.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )
    case 'table-id':
      return (
        <input
          type="text"
          value={value as string}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={config.placeholder}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      )
    default:
      return null
  }
}
