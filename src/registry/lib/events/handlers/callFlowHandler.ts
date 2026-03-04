/**
 * 调用流程处理器
 */

import type {
  ActionHandler,
  ActionResult,
  EventContext,
  CallFlowParams,
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

export const callFlowHandler: ActionHandler = async (
  params: CallFlowParams,
  _context: EventContext
): Promise<ActionResult> => {
  try {
    const { flow, params: flowParams } = params

    // TODO: 实现实际的流程调用逻辑
    // 可能需要调用 API 或其他服务来执行流程
    await new Promise((resolve) => setTimeout(resolve, 500))

    showResultMessage({ success: true }, params)

    return {
      success: true,
      data: {
        flowId: flow.id || JSON.stringify(flow),
        params: flowParams,
        result: { /* 流程执行结果 */ },
      },
    }
  } catch (error) {
    const result: ActionResult = {
      success: false,
      error: error instanceof Error ? error.message : '调用流程失败',
    }
    showResultMessage(result, params)
    return result
  }
}
