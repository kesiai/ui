/**
 * 页面跳转处理器
 */

import type {
  ActionHandler,
  ActionResult,
  EventContext,
  PageJumpParams,
} from '../events.types'
import { toast } from 'sonner'

export const pageJumpHandler: ActionHandler = async (
  params: PageJumpParams,
  _context: EventContext
): Promise<ActionResult> => {
  console.log('pageJumpHandler called with params:', params)
  try {
    const { url, openWay = '_self', showMessage = true } = params

    // 检查权限（简化实现，实际需要根据用户角色判断）
    if (params.permission === 'users' && params.users?.length) {
      // TODO: 检查当前用户是否在允许列表中
    }
    if (params.permission === 'roles' && params.roles?.length) {
      // TODO: 检查当前用户角色是否在允许列表中
    }

    console.log('Executing jump to:', url, 'with openWay:', openWay)

    // 执行跳转
    if (openWay === '_blank') {
      window.open(url, '_blank')
    } else {
      window.location.href = url
    }

    console.log('Jump executed')

    if (showMessage) {
      toast.success('页面跳转成功')
    }

    return { success: true, data: { url, openWay } }
  } catch (error) {
    console.error('pageJumpHandler error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '页面跳转失败',
    }
  }
}
