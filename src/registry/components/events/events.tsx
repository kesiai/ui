import {
  useEvents,
  useEvent,
  useEventsWithSpread,
} from '@airiot/client'

export {
  useEvents,
  useEvent,
  useEventsWithSpread,
}

import { ConfirmDialog, useConfirmDialog } from './ConfirmDialog'
export { ConfirmDialog, useConfirmDialog }

import { SchemaFormDialog } from "./SchemaFormDialog";
export { SchemaFormDialog }

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
