/**
 * 修改用户处理器
 */

import type {
  ActionHandler,
  ActionResult,
  EventContext,
  ChangeUserParams,
  ResultMessage,
} from '../events.types'
import { toast } from 'sonner'

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

export const changeUserHandler: ActionHandler = async (
  params: ChangeUserParams,
  _context: EventContext
): Promise<ActionResult> => {
  try {
    const { nodeProp } = params

    const updates: Record<string, string> = {}

    if (nodeProp) {
      for (const item of nodeProp) {
        updates[item.key] = item.value
      }
    }

    // 使用 @airiot/client 的用户设置
    const { useUser } = require('@airiot/client')
    useUser(updates)

    showResultMessage({ success: true }, params)

    return { success: true, data: { updates } }
  } catch (error) {
    const result: ActionResult = {
      success: false,
      error: error instanceof Error ? error.message : '修改用户失败',
    }
    showResultMessage(result, params)
    return result
  }
}
