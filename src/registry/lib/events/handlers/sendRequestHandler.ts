/**
 * 发送请求处理器 - 暂不处理
 */

import type {
  ActionHandler,
  ActionResult,
  EventContext,
} from '../events.types'

export const sendRequestHandler: ActionHandler = async (
  _params: any,
  _context: EventContext
): Promise<ActionResult> => {
  return {
    success: false,
    error: '发送请求功能暂未实现',
  }
}
