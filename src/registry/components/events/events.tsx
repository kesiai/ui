/**
 * 事件系统 - 统一导出
 *
 * 提供完整的事件和动作管理系统，包括：
 * - useEvents Hook: 用于组件事件绑定
 * - 事件和动作类型定义
 * - 动作处理器
 * - 对话框组件（确认对话框、表单对话框）
 * - GlobalDialogs: 监听 jotai atoms 的全局对话框组件
 *
 * @example 基本用法
 * ```tsx
 * import { useEvents } from '@/registry/components/events/events'
 *
 * function MyComponent() {
 *   const events = useEvents({
 *     click: [
 *       { type: 'changeVar', params: { var: { path: 'a' }, varValue: 'haha' } },
 *       { type: 'pageJump', params: { url: '/home' } }
 *     ],
 *     doubleClick: []
 *   })
 *
 *   return (
 *     <div {...events}>
 *       <p>hah</p>
 *       <Button onClick={events.click}>Click me</Button>
 *       <Card onDoubleClick={events.doubleClick}>Double click me</Card>
 *     </div>
 *   )
 * }
 * ```
 */

// ============== 导出 Hooks ==============

export {
  useEvents,
  useEvent,
  useEventsWithSpread,
} from '../../lib/events/useEvents'

// ============== 导出类型 ==============

export type {
  EventType,
  ActionType,
  ValueType,
  OpenWay,
  PermissionType,
  PageJumpParams,
  ChangeVarParams,
  ChangeTableDataParams,
  ChangeDictParams,
  DataPointProperty,
  ChangeDataPointParams,
  FieldValuePair,
  ChangeSystemSettingParams,
  ChangeUserParams,
  CallFlowParams,
  Action,
  EventConfig,
  EventContext,
  ActionResult,
  ActionHandler,
  EventHandlerReturn,
  EventsReturn,
  ResultMessage,
} from '@/registry/lib/events/events.types'

// ============== 导出动作处理器相关 ==============

export {
  pageJumpHandler,
  changeVarHandler,
  changeTableDataHandler,
  changeDictHandler,
  changeDataPointHandler,
  changeSystemSettingHandler,
  changeUserHandler,
  callFlowHandler,
  executeCommandHandler,
  sendRequestHandler,
  actionHandlers,
  getActionHandler,
} from '@/registry/lib/events/action-handlers'

// ============== 导出对话框相关 ==============

export {
  showConfirmDialog,
  showFormDialog,
  closeConfirmDialog,
  closeFormDialog,
  useGlobalDialogs,
} from '@/registry/lib/events/dialog-atom'

export type { ConfirmDialogConfig, FormDialogConfig, FormField } from '@/registry/lib/events/action-handlers'

// ============== 导出事件执行相关 ==============

export {
  eventTypeToReactEvent,
  reactEventToEventType,
  executeAction,
  executeActions,
  createEventHandler,
  parseEventConfig,
} from '@/registry/lib/events/event-execution'

// ============== 导出对话框组件 ==============

import {
  ConfirmDialog,
  useConfirmDialog,
} from './ConfirmDialog'
export {
  ConfirmDialog,
  useConfirmDialog,
}
export type { ConfirmDialogProps } from './ConfirmDialog'

import {
  FormDialog,
  useFormDialog,
} from './FormDialog'
export {
  FormDialog,
  useFormDialog,
}
export type {
  FormDialogProps,
  FormField as FormDialogField,
  FormFieldType,
} from './FormDialog'

// ============== GlobalDialogs - 全局对话框组件 ==============

import { GlobalDialogs } from './DialogComponents'
export { GlobalDialogs }

// ============== 文档说明 ==============

/**
 * ## 1. 基本用法
 * ```tsx
 * const events = useEvents({
 *   click: [{ type: 'pageJump', params: { url: '/home' } }],
 *   doubleClick: [{ type: 'changeVar', params: { var: { name: 'a' }, varValue: 'test' } }]
 * })
 *
 * // 方式1: 展开到容器
 * <div {...events}>
 *   <Button>Click me</Button>
 * </div>
 *
 * // 方式2: 单独绑定
 * <Button onClick={events.click}>Click me</Button>
 * <Card onDoubleClick={events.doubleClick}>Double click me</Card>
 * ```
 *
 * ## 2. 动作类型
 *
 * ### 页面跳转 (pageJump)
 * ```tsx
 * {
 *   type: 'pageJump',
 *   params: {
 *     url: '/home',
 *     openWay: '_blank',
 *     showMessage: true
 *   }
 * }
 * ```
 *
 * ### 修改变量 (changeVar)
 * ```tsx
 * {
 *   type: 'changeVar',
 *   params: {
 *     var: { name: 'myVar' },
 *     varType: 'varValue',
 *     varValue: 'hello'
 *   }
 * }
 * ```
 *
 * ### 修改表数据 (changeTableData)
 * ```tsx
 * {
 *   type: 'changeTableData',
 *   params: {
 *     table: { id: 'table1', name: 'MyTable' },
 *     data: { id: 1, name: 'Item 1' },
 *     showForm: true,
 *     nodeProp: [
 *       { key: 'name', value: 'New Name' }
 *     ],
 *     successMess: true,
 *     successContent: '修改成功'
 *   }
 * }
 * ```
 *
 * ### 调用流程 (callFlow)
 * ```tsx
 * {
 *   type: 'callFlow',
 *   params: {
 *     flow: { id: 'flow1', name: 'MyFlow' },
 *     showForm: true,
 *     params: { param1: 'value1' },
 *     successMess: true
 *   }
 * }
 * ```
 *
 * ## 3. 动作配置
 *
 * ### 二次确认
 * ```tsx
 * {
 *   type: 'pageJump',
 *   params: { url: '/home' },
 *   confirm: {
 *     title: '确认跳转',
 *     message: '确定要跳转到首页吗？',
 *     confirmText: '确定',
 *     cancelText: '取消'
 *   }
 * }
 * ```
 *
 * ### 延迟执行
 * ```tsx
 * {
 *   type: 'pageJump',
 *   params: { url: '/home' },
 *   delay: 1000 // 延迟 1 秒执行
 * }
 * ```
 *
 * ## 4. 动作依赖
 *
 * 动作按顺序执行，后一个动作可以访问前一个动作的结果：
 * ```tsx
 * {
 *   click: [
 *     { type: 'api', params: { url: '/api/user' } }, // 返回用户数据
 *     { type: 'changeVar', params: { var: { name: 'currentUser' }, varValue: '{prevResult}' } }
 *   ]
 * }
 * ```
 *
 * ## 5. 使用 GlobalDialogs
 *
 * 对话框状态使用 jotai atoms 管理，不需要嵌套 Provider。
 * 只需要在应用根组件中放置 GlobalDialogs 组件：
 *
 * ```tsx
 * import { GlobalDialogs } from '@/registry/components/events/events'
 *
 * function App() {
 *   return (
 *     <>
 *       <YourApplication />
 *       <GlobalDialogs />
 *     </>
 *   )
 * }
 * ```
 */
