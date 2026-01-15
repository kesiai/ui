import React from 'react'
import { PropConfig } from '../config/types'

interface FormControlProps {
  config: PropConfig
  value: any
  onChange: (name: string, value: any) => void
}

export const FormControl: React.FC<FormControlProps> = ({ config, value, onChange }) => {
  const handleChange = (newValue: any) => {
    onChange(config.name, newValue)
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

    default:
      return null
  }
}
