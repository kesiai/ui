/**
 * 修改数据点配置处理器
 */

import type {
  ActionHandler,
  ActionResult,
  EventContext,
  ChangeDataPointParams,
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

export const changeDataPointHandler: ActionHandler = async (
  params: ChangeDataPointParams,
  _context: EventContext
): Promise<ActionResult> => {
  try {
    const { dataPointMulti } = params

    const updates: Record<string, any> = {}

    for (const item of dataPointMulti) {
      const { dataPoint, key, value } = item
      const dataPointId = dataPoint.id || JSON.stringify(dataPoint)
      const valueToSet = resolveValue(value, context)

      if (!updates[dataPointId]) {
        updates[dataPointId] = {}
      }
      updates[dataPointId][key] = valueToSet
    }

    // 使用 @airiot/client 的数据点设置
    const { useDataPoint } = require('@airiot/client')

    // 遍历每个数据点进行设置
    for (const [dataPointId, values] of Object.entries(updates)) {
      useDataPoint(dataPointId, values)
    }

    showResultMessage({ success: true }, params)

    return { success: true, data: { updates } }
  } catch (error) {
    const result: ActionResult = {
      success: false,
      error: error instanceof Error ? error.message : '修改数据点配置失败',
    }
    showResultMessage(result, params)
    return result
  }
}
