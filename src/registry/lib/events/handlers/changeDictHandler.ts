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
    const { systemVar, value } = params

    
    console.log('修改系统设置:', params)

    showResultMessage({ success: true }, params)

    return { success: true, data: { systemVar, value } }
  } catch (error) {
    const result: ActionResult = {
      success: false,
      error: error instanceof Error ? error.message : '修改数据字典失败',
    }
    showResultMessage(result, params)
    return result
  }
}
