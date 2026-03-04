/**
 * 修改数据字典处理器
 */

import type {
  ActionHandler,
  ActionResult,
  EventContext,
  ChangeDictParams,
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

export const changeDictHandler: ActionHandler = async (
  params: ChangeDictParams,
  _context: EventContext
): Promise<ActionResult> => {
  try {
    const { systemVar, varType = 'varValue', value } = params

    let valueToSet: any

    if (varType === 'comValue') {
      valueToSet = resolveValue(value, _context)
    } else {
      valueToSet = value
    }

    // 使用 @airiot/client 的数据字典设置
    const { useDict } = require('@airiot/client')
    const dictPath = systemVar.path || Object.keys(systemVar).join('.')
    useDict(dictPath, valueToSet)

    showResultMessage({ success: true }, params)

    return { success: true, data: { systemVar, value: valueToSet } }
  } catch (error) {
    const result: ActionResult = {
      success: false,
      error: error instanceof Error ? error.message : '修改数据字典失败',
    }
    showResultMessage(result, params)
    return result
  }
}
