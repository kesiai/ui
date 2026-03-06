/**
 * 修改系统设置处理器
 */

import type {
  ActionHandler,
  ActionResult,
  EventContext,
  ChangeSystemSettingParams,
} from '../events.types'
import { showResultMessage } from './utils'

export const changeSystemSettingHandler: ActionHandler = async (
  params: ChangeSystemSettingParams,
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
    console.log('修改系统设置:', updates)

    showResultMessage({ success: true }, params)

    return { success: true, data: { updates } }
  } catch (error) {
    const result: ActionResult = {
      success: false,
      error: error instanceof Error ? error.message : '修改系统设置失败',
    }
    showResultMessage(result, params)
    return result
  }
}
