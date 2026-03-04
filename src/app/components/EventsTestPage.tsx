'use client'

import * as React from 'react'
import { useEvents } from '@/registry/components/events/events'
import { usePageVarValue, usePageVar, useSetPageVar, Page } from '@airiot/client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

// Card 组件的临时实现（如果 @/components/ui/card 不存在）
function TempCard({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-slate-200 ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  )
}

function VarPage({ addLog }: any) {
  const testVar = usePageVarValue('test')

  // ============== 修改变量 ==============
  const changeVarNormal = useEvents({
    click: [{
      type: 'changeVar',
      params: {
        var: { name: 'testVar', path: 'test' },
        varValue: `正常-${new Date().toLocaleTimeString()}`
      }
    }]
  })

  const changeVarDelay = useEvents({
    click: [{
      type: 'changeVar',
      params: {
        var: { name: 'testVar', path: 'test' },
        varValue: `延迟-${new Date().toLocaleTimeString()}`
      },
      delay: 1000
    }]
  })

  const changeVarConfirm = useEvents({
    click: [{
      type: 'changeVar',
      params: {
        var: { name: 'testVar', path: 'test' },
        varValue: `确认-${new Date().toLocaleTimeString()}`
      },
      confirm: {
        title: '确认修改变量',
        message: '确定要修改变量吗？',
        confirmText: '确定',
        cancelText: '取消'
      }
    }]
  })

  return (
    <>
      <h3 className="text-base font-semibold text-slate-900 mb-3">
        🔧 修改变量
      </h3>
      <div className="space-y-2">
        <Button
          onClick={() => {
            changeVarNormal.click?.()
            addLog('修改变量: 正常')
          }}
          className="w-full"
          size="sm"
        >
          正常修改
        </Button>
        <Button
          onClick={() => {
            changeVarDelay.click?.()
            addLog('修改变量: 延迟 1s')
          }}
          className="w-full"
          variant="outline"
          size="sm"
        >
          延迟修改 (1s)
        </Button>
        <Button
          onClick={() => {
            changeVarConfirm.click?.()
            addLog('修改变量: 二次确认')
          }}
          className="w-full"
          variant="secondary"
          size="sm"
        >
          确认修改
        </Button>
      </div>

      {/* 显示变量值 */}
      <div className="mt-4 p-3 bg-slate-50 rounded-lg">
        <div className="text-xs text-slate-500 mb-1">当前变量值 (test):</div>
        <div className="font-mono text-sm text-slate-700 break-all">
          {JSON.stringify(testVar, null, 2)}
        </div>
      </div>
    </>
  )
}

/**
 * useEvents 测试页面
 *
 * 用于测试和演示 useEvents hook 的各种功能
 * 每个动作都有三个测试场景：正常、延迟、二次确认
 */
export function EventsTestPage() {
  // 使用本地状态模拟全局变量（用于演示）
  const [globalVars] = React.useState<Record<string, any>>({})
  const [eventLog, setEventLog] = React.useState<string[]>([])

  // 记录事件日志
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setEventLog(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 20))
  }

  // 清空日志
  const clearLog = () => {
    setEventLog([])
  }

  // ============== 页面跳转 ==============
  const pageJumpNormal = useEvents({
    click: [{
      type: 'pageJump',
      params: {
        url: '/',
        showMessage: false // 测试时不跳转，避免离开页面
      }
    }]
  })

  const pageJumpDelay = useEvents({
    click: [{
      type: 'pageJump',
      params: {
        url: '/',
        showMessage: false
      },
      delay: 1000
    }]
  })

  const pageJumpConfirm = useEvents({
    click: [{
      type: 'pageJump',
      params: {
        url: '/',
        showMessage: false
      },
      confirm: {
        title: '确认跳转',
        message: '确定要跳转到首页吗？',
        confirmText: '确定',
        cancelText: '取消'
      }
    }]
  })

  // ============== 修改表数据 ==============
  const changeTableDataNormal = useEvents({
    click: [{
      type: 'changeTableData',
      params: {
        table: { id: 'testTable', name: '测试表' },
        data: { id: 1, name: '测试数据' },
        nodeProp: [
          { key: 'name', value: '正常更新', varType: 'varValue' }
        ],
        successMess: true,
        successContent: '表数据修改成功'
      }
    }]
  })

  const changeTableDataDelay = useEvents({
    click: [{
      type: 'changeTableData',
      params: {
        table: { id: 'testTable', name: '测试表' },
        data: { id: 1, name: '测试数据' },
        nodeProp: [
          { key: 'name', value: '延迟更新', varType: 'varValue' }
        ],
        successMess: true,
        successContent: '表数据延迟修改成功'
      },
      delay: 1000
    }]
  })

  const changeTableDataConfirm = useEvents({
    click: [{
      type: 'changeTableData',
      params: {
        table: { id: 'testTable', name: '测试表' },
        data: { id: 1, name: '测试数据' },
        nodeProp: [
          { key: 'name', value: '确认更新', varType: 'varValue' }
        ],
        successMess: true,
        successContent: '表数据确认修改成功'
      },
      confirm: {
        title: '确认修改表数据',
        message: '确定要修改表数据吗？',
        confirmText: '确定',
        cancelText: '取消'
      }
    }]
  })

  // ============== 修改数据字典 ==============
  const changeDictNormal = useEvents({
    click: [{
      type: 'changeDict',
      params: {
        systemVar: { name: 'status', path: 'system.status' },
        varType: 'varValue',
        value: 'active',
        successMess: true,
        successContent: '数据字典修改成功'
      }
    }]
  })

  const changeDictDelay = useEvents({
    click: [{
      type: 'changeDict',
      params: {
        systemVar: { name: 'status', path: 'system.status' },
        varType: 'varValue',
        value: 'paused',
        successMess: true,
        successContent: '数据字典延迟修改成功'
      },
      delay: 1000
    }]
  })

  const changeDictConfirm = useEvents({
    click: [{
      type: 'changeDict',
      params: {
        systemVar: { name: 'status', path: 'system.status' },
        varType: 'varValue',
        value: 'stopped',
        successMess: true,
        successContent: '数据字典确认修改成功'
      },
      confirm: {
        title: '确认修改数据字典',
        message: '确定要修改数据字典吗？',
        confirmText: '确定',
        cancelText: '取消'
      }
    }]
  })

  // ============== 修改数据点配置 ==============
  const changeDataPointNormal = useEvents({
    click: [{
      type: 'changeDataPoint',
      params: {
        dataPointMulti: [
          {
            dataPoint: { id: 'dp1', name: '数据点1' },
            key: 'value',
            value: '100'
          }
        ],
        successMess: true,
        successContent: '数据点修改成功'
      }
    }]
  })

  const changeDataPointDelay = useEvents({
    click: [{
      type: 'changeDataPoint',
      params: {
        dataPointMulti: [
          {
            dataPoint: { id: 'dp2', name: '数据点2' },
            key: 'value',
            value: '200'
          }
        ],
        successMess: true,
        successContent: '数据点延迟修改成功'
      },
      delay: 1000
    }]
  })

  const changeDataPointConfirm = useEvents({
    click: [{
      type: 'changeDataPoint',
      params: {
        dataPointMulti: [
          {
            dataPoint: { id: 'dp3', name: '数据点3' },
            key: 'value',
            value: '300'
          }
        ],
        successMess: true,
        successContent: '数据点确认修改成功'
      },
      confirm: {
        title: '确认修改数据点',
        message: '确定要修改数据点配置吗？',
        confirmText: '确定',
        cancelText: '取消'
      }
    }]
  })

  // ============== 修改系统设置 ==============
  const changeSystemSettingNormal = useEvents({
    click: [{
      type: 'changeSystemSetting',
      params: {
        nodeProp: [
          { key: 'theme', value: 'light' }
        ],
        successMess: true,
        successContent: '系统设置修改成功'
      }
    }]
  })

  const changeSystemSettingDelay = useEvents({
    click: [{
      type: 'changeSystemSetting',
      params: {
        nodeProp: [
          { key: 'theme', value: 'dark' }
        ],
        successMess: true,
        successContent: '系统设置延迟修改成功'
      },
      delay: 1000
    }]
  })

  const changeSystemSettingConfirm = useEvents({
    click: [{
      type: 'changeSystemSetting',
      params: {
        nodeProp: [
          { key: 'theme', value: 'auto' }
        ],
        successMess: true,
        successContent: '系统设置确认修改成功'
      },
      confirm: {
        title: '确认修改系统设置',
        message: '确定要修改系统设置吗？',
        confirmText: '确定',
        cancelText: '取消'
      }
    }]
  })

  // ============== 修改用户 ==============
  const changeUserNormal = useEvents({
    click: [{
      type: 'changeUser',
      params: {
        nodeProp: [
          { key: 'nickname', value: '正常用户' }
        ],
        successMess: true,
        successContent: '用户信息修改成功'
      }
    }]
  })

  const changeUserDelay = useEvents({
    click: [{
      type: 'changeUser',
      params: {
        nodeProp: [
          { key: 'nickname', value: '延迟用户' }
        ],
        successMess: true,
        successContent: '用户信息延迟修改成功'
      },
      delay: 1000
    }]
  })

  const changeUserConfirm = useEvents({
    click: [{
      type: 'changeUser',
      params: {
        nodeProp: [
          { key: 'nickname', value: '确认用户' }
        ],
        successMess: true,
        successContent: '用户信息确认修改成功'
      },
      confirm: {
        title: '确认修改用户信息',
        message: '确定要修改用户信息吗？',
        confirmText: '确定',
        cancelText: '取消'
      }
    }]
  })

  // ============== 调用流程 ==============
  const callFlowNormal = useEvents({
    click: [{
      type: 'callFlow',
      params: {
        flow: { id: 'flow1', name: '测试流程' },
        params: { action: 'normal' },
        successMess: true,
        successContent: '流程调用成功'
      }
    }]
  })

  const callFlowDelay = useEvents({
    click: [{
      type: 'callFlow',
      params: {
        flow: { id: 'flow2', name: '测试流程' },
        params: { action: 'delay' },
        successMess: true,
        successContent: '流程延迟调用成功'
      },
      delay: 1000
    }]
  })

  const callFlowConfirm = useEvents({
    click: [{
      type: 'callFlow',
      params: {
        flow: { id: 'flow3', name: '测试流程' },
        params: { action: 'confirm' },
        successMess: true,
        successContent: '流程确认调用成功'
      },
      confirm: {
        title: '确认调用流程',
        message: '确定要调用此流程吗？',
        confirmText: '确定',
        cancelText: '取消'
      }
    }]
  })

  // 查看当前全局变量
  const handleViewGlobalVars = () => {
    console.log('当前全局变量:', globalVars)
    toast.success('全局变量已打印到控制台')
    addLog('查看全局变量: ' + JSON.stringify(globalVars))
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            🧪 useEvents Hook 测试页面
          </h1>
          <p className="text-slate-600">
            测试和演示 useEvents hook 的各种功能 - 每个动作包含正常、延迟、二次确认三种场景
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* ============== 页面跳转 ============== */}
          <TempCard className="p-5">
            <h3 className="text-base font-semibold text-slate-900 mb-3">
              📌 页面跳转
            </h3>
            <div className="space-y-2">
              <Button
                onClick={() => {
                  pageJumpNormal.click?.()
                  addLog('页面跳转: 正常')
                }}
                className="w-full"
                size="sm"
              >
                正常跳转
              </Button>
              <Button
                onClick={() => {
                  pageJumpDelay.click?.()
                  addLog('页面跳转: 延迟 1s')
                }}
                className="w-full"
                variant="outline"
                size="sm"
              >
                延迟跳转 (1s)
              </Button>
              <Button
                onClick={() => {
                  pageJumpConfirm.click?.()
                  addLog('页面跳转: 二次确认')
                }}
                className="w-full"
                variant="secondary"
                size="sm"
              >
                确认跳转
              </Button>
            </div>
          </TempCard>

          {/* ============== 修改变量 ============== */}

          <TempCard className="p-5">
            <Page>
              <VarPage addLog={addLog} />
            </Page>
          </TempCard>

          {/* ============== 修改表数据 ============== */}
          <TempCard className="p-5">
            <h3 className="text-base font-semibold text-slate-900 mb-3">
              📊 修改表数据
            </h3>
            <div className="space-y-2">
              <Button
                onClick={() => {
                  changeTableDataNormal.click?.()
                  addLog('修改表数据: 正常')
                }}
                className="w-full"
                size="sm"
              >
                正常修改
              </Button>
              <Button
                onClick={() => {
                  changeTableDataDelay.click?.()
                  addLog('修改表数据: 延迟 1s')
                }}
                className="w-full"
                variant="outline"
                size="sm"
              >
                延迟修改 (1s)
              </Button>
              <Button
                onClick={() => {
                  changeTableDataConfirm.click?.()
                  addLog('修改表数据: 二次确认')
                }}
                className="w-full"
                variant="secondary"
                size="sm"
              >
                确认修改
              </Button>
            </div>
          </TempCard>

          {/* ============== 修改数据字典 ============== */}
          <TempCard className="p-5">
            <h3 className="text-base font-semibold text-slate-900 mb-3">
              📚 修改数据字典
            </h3>
            <div className="space-y-2">
              <Button
                onClick={() => {
                  changeDictNormal.click?.()
                  addLog('修改数据字典: 正常')
                }}
                className="w-full"
                size="sm"
              >
                正常修改
              </Button>
              <Button
                onClick={() => {
                  changeDictDelay.click?.()
                  addLog('修改数据字典: 延迟 1s')
                }}
                className="w-full"
                variant="outline"
                size="sm"
              >
                延迟修改 (1s)
              </Button>
              <Button
                onClick={() => {
                  changeDictConfirm.click?.()
                  addLog('修改数据字典: 二次确认')
                }}
                className="w-full"
                variant="secondary"
                size="sm"
              >
                确认修改
              </Button>
            </div>
          </TempCard>

          {/* ============== 修改数据点配置 ============== */}
          <TempCard className="p-5">
            <h3 className="text-base font-semibold text-slate-900 mb-3">
              📈 修改数据点配置
            </h3>
            <div className="space-y-2">
              <Button
                onClick={() => {
                  changeDataPointNormal.click?.()
                  addLog('修改数据点: 正常')
                }}
                className="w-full"
                size="sm"
              >
                正常修改
              </Button>
              <Button
                onClick={() => {
                  changeDataPointDelay.click?.()
                  addLog('修改数据点: 延迟 1s')
                }}
                className="w-full"
                variant="outline"
                size="sm"
              >
                延迟修改 (1s)
              </Button>
              <Button
                onClick={() => {
                  changeDataPointConfirm.click?.()
                  addLog('修改数据点: 二次确认')
                }}
                className="w-full"
                variant="secondary"
                size="sm"
              >
                确认修改
              </Button>
            </div>
          </TempCard>

          {/* ============== 修改系统设置 ============== */}
          <TempCard className="p-5">
            <h3 className="text-base font-semibold text-slate-900 mb-3">
              ⚙️ 修改系统设置
            </h3>
            <div className="space-y-2">
              <Button
                onClick={() => {
                  changeSystemSettingNormal.click?.()
                  addLog('修改系统设置: 正常')
                }}
                className="w-full"
                size="sm"
              >
                正常修改
              </Button>
              <Button
                onClick={() => {
                  changeSystemSettingDelay.click?.()
                  addLog('修改系统设置: 延迟 1s')
                }}
                className="w-full"
                variant="outline"
                size="sm"
              >
                延迟修改 (1s)
              </Button>
              <Button
                onClick={() => {
                  changeSystemSettingConfirm.click?.()
                  addLog('修改系统设置: 二次确认')
                }}
                className="w-full"
                variant="secondary"
                size="sm"
              >
                确认修改
              </Button>
            </div>
          </TempCard>

          {/* ============== 修改用户 ============== */}
          <TempCard className="p-5">
            <h3 className="text-base font-semibold text-slate-900 mb-3">
              👤 修改用户
            </h3>
            <div className="space-y-2">
              <Button
                onClick={() => {
                  changeUserNormal.click?.()
                  addLog('修改用户: 正常')
                }}
                className="w-full"
                size="sm"
              >
                正常修改
              </Button>
              <Button
                onClick={() => {
                  changeUserDelay.click?.()
                  addLog('修改用户: 延迟 1s')
                }}
                className="w-full"
                variant="outline"
                size="sm"
              >
                延迟修改 (1s)
              </Button>
              <Button
                onClick={() => {
                  changeUserConfirm.click?.()
                  addLog('修改用户: 二次确认')
                }}
                className="w-full"
                variant="secondary"
                size="sm"
              >
                确认修改
              </Button>
            </div>
          </TempCard>

          {/* ============== 调用流程 ============== */}
          <TempCard className="p-5">
            <h3 className="text-base font-semibold text-slate-900 mb-3">
              🔄 调用流程
            </h3>
            <div className="space-y-2">
              <Button
                onClick={() => {
                  callFlowNormal.click?.()
                  addLog('调用流程: 正常')
                }}
                className="w-full"
                size="sm"
              >
                正常调用
              </Button>
              <Button
                onClick={() => {
                  callFlowDelay.click?.()
                  addLog('调用流程: 延迟 1s')
                }}
                className="w-full"
                variant="outline"
                size="sm"
              >
                延迟调用 (1s)
              </Button>
              <Button
                onClick={() => {
                  callFlowConfirm.click?.()
                  addLog('调用流程: 二次确认')
                }}
                className="w-full"
                variant="secondary"
                size="sm"
              >
                确认调用
              </Button>
            </div>
          </TempCard>

          {/* ============== 全局变量查看 ============== */}
          <TempCard className="p-5">
            <h3 className="text-base font-semibold text-slate-900 mb-3">
              🗂️ 全局变量
            </h3>
            <Button
              onClick={handleViewGlobalVars}
              className="w-full"
              variant="outline"
              size="sm"
            >
              查看全局变量（控制台）
            </Button>
          </TempCard>
        </div>

        {/* 事件日志 */}
        <TempCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              📋 事件日志
            </h2>
            <Button
              onClick={clearLog}
              size="sm"
              variant="ghost"
            >
              清空
            </Button>
          </div>
          <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-xs max-h-64 overflow-auto">
            {eventLog.length === 0 ? (
              <div className="text-slate-500">暂无事件日志</div>
            ) : (
              eventLog.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </TempCard>

        {/* 文档说明 */}
        <TempCard className="p-5 mt-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            📚 使用说明
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
            <div>
              <strong className="text-slate-900">1. 动作类型：</strong>
              <p className="mt-1 text-slate-600">
                pageJump, changeVar, changeTableData, changeDict, changeDataPoint,
                changeSystemSetting, changeUser, callFlow
              </p>
            </div>
            <div>
              <strong className="text-slate-900">2. 测试场景：</strong>
              <p className="mt-1 text-slate-600">
                每个动作包含三种场景：正常执行、延迟执行(1s)、二次确认执行
              </p>
            </div>
            <div>
              <strong className="text-slate-900">3. 延迟配置：</strong>
              <p className="mt-1 text-slate-600 font-mono text-xs">
                {'{ type: "xxx", params: {...}, delay: 1000 }'}
              </p>
            </div>
            <div>
              <strong className="text-slate-900">4. 确认配置：</strong>
              <p className="mt-1 text-slate-600 font-mono text-xs">
                {'{ type: "xxx", params: {...}, confirm: { title, message } }'}
              </p>
            </div>
          </div>
        </TempCard>
      </div>
    </div>
  )
}
