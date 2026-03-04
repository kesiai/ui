/**
 * 执行指令处理器 - 暂不处理
 */

import type {
  ActionHandler,
  ActionResult,
  EventContext,
} from '../events.types'

export const executeCommandHandler: ActionHandler = async (
  _params: any,
  _context: EventContext
): Promise<ActionResult> => {
  return {
    success: false,
    error: '执行指令功能暂未实现',
  }
}
