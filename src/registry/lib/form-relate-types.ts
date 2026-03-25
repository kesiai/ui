/**
 * 关联字段相关的类型定义
 */

export interface RelateFieldOption {
  value: string
  label: string
  key?: string
  item?: any
}

export interface RelateFieldProps {
  value?: any
  onChange?: (value: any) => void
  field?: {
    schema?: Record<string, any>
    filter?: any
    meta?: any
    key?: string
    displayField?: string
    tableID?: string
    relateShowFields?: Array<{
      key: string
      title: string
      mapToCurrent?: boolean
      mapField?: string
      fieldSchema?: any
    }>
    option?: {
      form?: {
        change: (field: string, value: any) => void
      }
    }
  }
  meta?: any
  record?: any
  antdForm?: any
  label?: string
  disabled?: boolean
}

export interface AsyncSelectProps extends RelateFieldProps {
  value?: {
    key: string
    label: string
    item?: any
  } | null
  mode?: 'multiple' | 'tags'
  isOptionSelected?: (option: RelateFieldOption) => boolean
  style?: React.CSSProperties
}
