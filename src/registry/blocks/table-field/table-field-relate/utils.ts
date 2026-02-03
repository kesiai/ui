import isEmpty from 'lodash/isEmpty'
import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'

/**
 * 在 tableSchema 中查找 value?.relate?.id 等于 tableID 的对应 key
 */
export const findRelateKeyInTableSchema = (tableSchema: any, tableID: string): string | null => {
  if (!tableSchema || !tableSchema.properties) {
    return null
  }

  for (const [key, property] of Object.entries(tableSchema.properties)) {
    if ((property as any)?.relate?.id === tableID) {
      return key
    }
  }

  return null
}

/**
 * 在树形数据中查找节点
 */
export const findTreeNode = (treeData: any[], value: any): any => {
  for (const node of treeData) {
    if (node.value === value) {
      return node
    }
    if (node.children && node.children.length > 0) {
      const found = findTreeNode(node.children, value)
      if (found) return found
    }
  }
  return null
}

/**
 * 获取查询过滤器 - TODO 待实现
 */
export const getQueryFilter = (_filterObj: any, _field: any, _getFormState?: () => any) => {
  // TODO: 实现查询过滤器逻辑
  // 这个函数需要从 queryEditor 获取查询过滤条件
}

/**
 * 处理过滤器
 */
export const dealFilter = (
  _filterObj: any,
  _field: any,
  _getQueryFilter: typeof import('./utils').getQueryFilter,
  _getFormState?: () => any
) => {
  // TODO: 实现过滤器处理逻辑
  // 需要结合 getQueryFilter 和 getFormState 来处理过滤条件
}

/**
 * 简单的 fieldRender 函数
 * 用于在列表中显示字段值
 */
export const fieldRender = (value: any, _schema?: any): React.ReactNode => {
  // 字符串、数字、布尔值直接显示
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value
  }

  // 对象显示 .name
  if (isObject(value) && !isArray(value)) {
    return (value as any).name ?? (value as any).id ?? JSON.stringify(value)
  }

  // 数组显示 .name join(',')
  if (isArray(value)) {
    return value
      .map(item => {
        if (typeof item === 'string' || typeof item === 'number') {
          return item
        }
        if (isObject(item)) {
          return (item as any).name ?? (item as any).id
        }
        return JSON.stringify(item)
      })
      .filter(Boolean)
      .join(',')
  }

  // 空值处理
  if (isEmpty(value)) {
    return null
  }

  return JSON.stringify(value)
}

/**
 * 获取表单状态 - 用于获取其他字段的值
 * 类似于 use('form') 的功能
 */
export const getFormState = (formState: any, currentFieldKey?: string) => {
  // TODO: 实现表单状态获取逻辑
  // 这个函数应该从 form state 中获取其他字段的值
  // 用于字段联动和脚本计算
  if (!formState) {
    return {}
  }

  const values: Record<string, any> = {}
  for (const key in formState.values) {
    // 跳过当前字段，避免循环依赖
    if (key !== currentFieldKey) {
      values[key] = formState.values[key]
    }
  }

  return { values }
}

/**
 * 获取表单所有值 - 用于字段脚本
 */
export const getFormValues = (schema: any, formState?: any) => {
  if (!formState) {
    return null
  }

  const values: Record<string, any> = {}
  for (const key in formState.values) {
    if (key !== schema.key) {
      values[key] = formState.values[key]
    }
  }

  return values
}
