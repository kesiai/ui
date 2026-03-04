/**
 * 修改变量处理器
 *
 * 使用 @airiot/client 的 useSetPageVar 设置页面级变量
 *
 * @example
 * ```tsx
 * import { usePageVarValue } from '@airiot/client'
 *
 * function MyComponent() {
 *   const varA = usePageVarValue('a')
 *   const varB = usePageVarValue('b')
 *
 *   return (
 *     <div>
 *       <p>变量 a: {JSON.stringify(varA)}</p>
 *       <p>变量 b: {JSON.stringify(varB)}</p>
 *     </div>
 *   )
 * }
 * ```
 */

import type {
  ActionHandler,
  ActionResult,
  EventContext,
  ChangeVarParams,
} from '../events.types'
import { toast } from 'sonner'
import { useSetPageVar } from '@airiot/client'


export const changeVarHandler: ActionHandler = async (
  params: ChangeVarParams,
  _context: EventContext
): Promise<ActionResult> => {
  try {
    const { var: varConfig, varValue } = params
    const varPath = varConfig.path 
    const setPageVar = useSetPageVar(varPath)
    setPageVar(varValue)
    // 显示成功提示
    if (params.successMess !== false) {
      toast.success(params.successContent || '修改变量成功', {
        duration: params.successTime || 3000,
      })
    }
    return { success: true, data: { var: varConfig, value: varValue } }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '修改变量失败'

    // 显示失败提示
    if (params.errorMess !== false) {
      toast.error(params.errorContent || errorMessage, {
        duration: params.errorTime || 3000,
      })
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}
