/**
 * 修改表数据处理器
 */

import type {
  ActionHandler,
  ActionResult,
  EventContext,
  ChangeTableDataParams,
  ResultMessage,
} from '../events.types'
import { toast } from 'sonner'

/**
 * 解析变量值 - 支持变量路径和组件值
 */
function resolveValue(value: any, _context: EventContext): any {
  if (typeof value !== 'string') return value

  // 检查是否是变量路径格式，如 "vars.a.b"
  if (value.startsWith('vars.')) {
    const path = value.slice(5)
    const { useVar } = require('@airiot/client')
    return useVar(path)
  }

  // 检查是否是组件值格式
  if (value.startsWith('component.')) {
    return value
  }

  return value
}

/**
 * 显示执行结果消息
 */
function showResultMessage(
  result: ActionResult,
  resultConfig?: ResultMessage
) {
  if (!resultConfig) return

  if (result.success) {
    if (resultConfig.successMess !== false) {
      toast.success(resultConfig.successContent || '操作成功', {
        duration: resultConfig.successTime || 3000,
      })
    }
  } else {
    if (resultConfig.errorMess !== false) {
      toast.error(resultConfig.errorContent || result.error || '操作失败', {
        duration: resultConfig.errorTime || 3000,
      })
    }
  }
}

export const changeTableDataHandler: ActionHandler = async (
  params: ChangeTableDataParams,
  _context: EventContext
): Promise<ActionResult> => {
  try {
    const { table, data, nodeProp } = params

    // 处理字段和值
    const processedData = { ...data }
    if (nodeProp) {
      for (const item of nodeProp) {
        if (item.varType === 'comValue') {
          processedData[item.key] = resolveValue(item.value, context)
        } else {
          processedData[item.key] = item.value
        }
      }
    }

    // 使用 @airiot/client 的表数据设置
    const { useTableData } = require('@airiot/client')
    const tableId = table.id || JSON.stringify(table)
    useTableData(tableId, processedData)

    showResultMessage({ success: true }, params)

    return { success: true, data: { table, data: processedData } }
  } catch (error) {
    const result: ActionResult = {
      success: false,
      error: error instanceof Error ? error.message : '修改表数据失败',
    }
    showResultMessage(result, params)
    return result
  }
}
