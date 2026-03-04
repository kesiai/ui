/**
 * 事件执行工具函数
 */

import type {
  Action,
  ActionResult,
  EventConfig,
  EventContext,
  EventType,
} from './events.types'
import { getActionHandler } from './action-handlers'
import {
  showConfirmDialog as baseShowConfirmDialog,
  showFormDialog as baseShowFormDialog,
} from './dialog-atom'

/**
 * 解析事件类型到 React 事件名称的映射
 */
export const eventTypeToReactEvent: Record<EventType, string> = {
  click: 'onClick',
  doubleClick: 'onDoubleClick',
  mouseEnter: 'onMouseEnter',
  mouseLeave: 'onMouseLeave',
  change: 'onChange',
  submit: 'onSubmit',
  focus: 'onFocus',
  blur: 'onBlur',
  input: 'onInput',
}

/**
 * 解析 React 事件名称到事件类型的映射
 */
export const reactEventToEventType: Record<string, EventType> = {
  onClick: 'click',
  onDoubleClick: 'doubleClick',
  onMouseEnter: 'mouseEnter',
  onMouseLeave: 'mouseLeave',
  onChange: 'change',
  onSubmit: 'submit',
  onFocus: 'focus',
  onBlur: 'blur',
  onInput: 'input',
}

/**
 * 显示二次确认对话框
 */
export function showConfirmDialog(
  confirmConfig?: {
    title?: string
    message?: string
    confirmText?: string
    cancelText?: string
  }
): Promise<boolean> {
  console.log('showConfirmDialog called with config:', confirmConfig)
  return baseShowConfirmDialog(confirmConfig)
}

/**
 * 显示表单对话框
 */
export function showFormDialog(
  fields: any[],
  initialValues?: Record<string, any>,
  title?: string,
  description?: string
): Promise<Record<string, any> | null> {
  return baseShowFormDialog(fields, initialValues, title, description)
}

/**
 * 执行单个动作
 */
export async function executeAction(
  action: Action,
  context: EventContext
): Promise<ActionResult> {
  console.log('executeAction called for action:', action.type, 'with confirm:', !!action.confirm)
  try {
    // 检查是否需要二次确认
    if (action.confirm) {
      console.log('Showing confirm dialog with config:', action.confirm)
      const confirmed = await showConfirmDialog(action.confirm)
      console.log('User confirmed:', confirmed)
      if (!confirmed) {
        return { success: false, error: '用户取消操作' }
      }
    }

    // 检查是否需要显示表单
    if (action.params?.showForm) {
      // 根据动作类型确定需要显示的表单字段
      const formConfig = getFormFieldsForAction(action.type, action.params)
      if (formConfig.fields && formConfig.fields.length > 0) {
        const formData = await showFormDialog(
          formConfig.fields,
          formConfig.initialValues,
          formConfig.title,
          formConfig.description
        )
        if (!formData) {
          return { success: false, error: '用户取消操作' }
        }
        // 合并表单数据到 params
        action.params = { ...action.params, ...formData }
      }
    }

    // 检查是否需要延迟执行
    if (action.delay && action.delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, action.delay))
    }

    // 获取动作处理器并执行
    const handler = getActionHandler(action.type)
    const result = await handler(action.params, context)

    return result
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '执行动作失败',
    }
  }
}

/**
 * 获取动作需要显示的表单字段
 */
function getFormFieldsForAction(
  actionType: string,
  params: any
): {
  fields: any[]
  initialValues?: Record<string, any>
  title?: string
  description?: string
} {
  const result: {
    fields: any[]
    initialValues?: Record<string, any>
    title?: string
    description?: string
  } = {
    fields: [],
    title: '填写信息',
    description: '请填写以下信息',
  }

  switch (actionType) {
    case 'changeTableData':
      result.title = '修改表数据'
      result.description = '请输入要修改的数据'
      if (params.nodeProp) {
        result.fields = params.nodeProp.map((item: any) => ({
          name: item.key,
          label: item.key,
          type: 'text',
          defaultValue: item.value,
          required: true,
        }))
      }
      break

    case 'changeDataPoint':
      result.title = '修改数据点配置'
      result.description = '请输入数据点属性'
      if (params.dataPointMulti) {
        result.fields = params.dataPointMulti.map((item: any) => ({
          name: `dp_${item.dataPoint?.id || 'unknown'}_${item.key}`,
          label: `${item.dataPoint?.name || '数据点'} - ${item.key}`,
          type: 'text',
          defaultValue: item.value,
          required: true,
        }))
      }
      break

    case 'changeSystemSetting':
      result.title = '修改系统设置'
      result.description = '请输入系统设置信息'
      if (params.nodeProp) {
        result.fields = params.nodeProp.map((item: any) => ({
          name: item.key,
          label: item.key,
          type: 'text',
          defaultValue: item.value,
          required: true,
        }))
      }
      break

    case 'changeUser':
      result.title = '修改用户信息'
      result.description = '请输入用户信息'
      if (params.nodeProp) {
        result.fields = params.nodeProp.map((item: any) => ({
          name: item.key,
          label: item.key,
          type: 'text',
          defaultValue: item.value,
          required: true,
        }))
      }
      break

    case 'callFlow':
      result.title = '调用流程'
      result.description = '请输入流程参数'
      if (params.params) {
        result.initialValues = params.params
        result.fields = Object.keys(params.params).map((key) => ({
          name: key,
          label: key,
          type: 'text',
          defaultValue: params.params[key],
        }))
      }
      break

    default:
      break
  }

  return result
}

/**
 * 执行事件的所有动作（按顺序）
 */
export async function executeActions(
  actions: Action[],
  context: EventContext
): Promise<ActionResult[]> {
  const results: ActionResult[] = []
  let prevResult: any = undefined

  for (let i = 0; i < actions.length; i++) {
    const action = actions[i]
    const actionContext = {
      ...context,
      prevResult,
    }

    const result = await executeAction(action, actionContext)
    results.push(result)

    // 保存当前结果供下一个动作使用
    if (result.success) {
      prevResult = result.data
    } else {
      // 如果动作执行失败，可以选择停止或继续
      // 这里选择停止执行后续动作
      break
    }
  }

  return results
}

/**
 * 创建事件处理器函数
 */
export function createEventHandler(
  eventType: EventType,
  actions: Action[],
  onLoadingChange?: (loading: boolean) => void,
  onError?: (error: string) => void
) {
  return async (e?: React.SyntheticEvent) => {
    if (!actions || actions.length === 0) {
      return
    }

    // 阻止默认行为（如表单提交）
    e?.preventDefault()

    onLoadingChange?.(true)

    try {
      const context: EventContext = {
        eventType,
        eventParams: e,
      }

      const results = await executeActions(actions, context)

      // 检查是否有失败的执行
      const hasFailure = results.some((r) => !r.success)
      if (hasFailure) {
        const lastError = results.reverse().find((r) => r.error)?.error
        onError?.(lastError || '事件执行失败')
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '未知错误'
      onError?.(errorMessage)
    } finally {
      onLoadingChange?.(false)
    }
  }
}

/**
 * 解析事件配置，生成事件处理器映射
 */
export function parseEventConfig(
  config: EventConfig
): Record<EventType, (e?: React.SyntheticEvent) => Promise<void>> {
  const handlers: Record<
    EventType,
    (e?: React.SyntheticEvent) => Promise<void>
  > = {} as any

  for (const [eventType, actions] of Object.entries(config)) {
    if (actions && actions.length > 0) {
      handlers[eventType as EventType] = createEventHandler(
        eventType as EventType,
        actions
      )
    }
  }

  return handlers
}
