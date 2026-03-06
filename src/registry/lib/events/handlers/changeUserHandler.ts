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
import { createAPI, getSettings } from '@airiot/client'
import { showSchemaFormDialog } from '../dialog-atom'
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
    const { nodeProp, showForm, fields } = params

    const updates: Record<string, string> = {}

    if (nodeProp) {
      for (const item of nodeProp) {
        updates[item.key] = item.value
      }
    }

    // 使用 API 修改用户
    const api = createAPI({ name: 'core/auth/user' })
    const saveUser = async (data: Record<string, string>) => {
      await api.fetch('', {
        method: 'PUT',
        noMessage: true,
        body: JSON.stringify(data)
      })
    }
    if (showForm) {
      // 获取当前用户信息
      const settings = await getSettings()

      const exSchema = settings?.userExpand || {}

      const schema = {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            title: '邮箱',
            format: 'email'
          },
          phone: {
            type: 'string',
            title: '电话',
          },
          language: {
            title: '系统语言',
            type: 'string',
          },
          ...(exSchema.properties || {})
        }
      }
      const formSchema = fields || {}

      const formData = await showSchemaFormDialog({
        schema,
        formSchema,
        title: '修改用户信息',
      })

      // 用户取消操作
      if (!formData) {
        return { success: true, data: { cancelled: true } }
      } else {
        saveUser(formData)
      }
      
    } else {
      saveUser(updates)
    }

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
