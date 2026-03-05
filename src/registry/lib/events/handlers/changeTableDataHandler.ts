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

    console.log('修改表数据:', { table, data, nodeProp })
    
    showResultMessage({ success: true }, params)

    return { success: true, data: { table, data: {} } }
  } catch (error) {
    const result: ActionResult = {
      success: false,
      error: error instanceof Error ? error.message : '修改表数据失败',
    }
    showResultMessage(result, params)
    return result
  }
}
