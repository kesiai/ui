import React from 'react'

export interface PropConfigOption {
  value: string
  label: string
}

export type PropConfigType =
  'number' | 'color' | 'select' | 'boolean' | 'text' | 'input' | 'range' | 'code' | 'array' | 'json' | 'object' | 'model-name' | 'table-id'

export interface PropConfig {
  name: string
  label: string
  type: PropConfigType
  default: any
  min?: number
  max?: number
  step?: number
  options?: PropConfigOption[]
  placeholder?: string
  description?: string
}

export interface ComponentConfig {
  id: string
  name: string
  propsConfig: PropConfig[]
  defaultProps: Record<string, any>
  renderPreview: (props: Record<string, any>) => React.ReactElement
  renderCodePreview?: (props: Record<string, any>) => string
  renderCustomForm?: (props: Record<string, any>, onChange: (name: string, value: any) => void) => React.ReactElement | null
  documentation?: string // 组件文档的 markdown 内容
}
