'use client'

import { useContextProvider } from '@/registry/blocks/containers/context-provider/context-provider'
import { useDatasourceValue } from '@airiot/client'

/**
 * 数据源预览组件 - 展示数据获取方式
 */
interface DataSourcePreviewProps {
  /** 数据源ID */
  dataSourceId?: string
}

export function DataSourcePreview({ dataSourceId }: DataSourcePreviewProps) {
  const { data: contextData } = useContextProvider()
  // ContextProvider 的 data 是数组，第一个元素是数据源数据 {data, loading}
  const contextValue = contextData?.[0]
  const contextLoading = contextValue?.loading

  // useDatasourceValue 直接返回数据源数据 {data, loading}
  const jotaiValue = dataSourceId ? useDatasourceValue(`${dataSourceId}`) : undefined
  const jotaiData = jotaiValue?.data
  const jotaiLoading = jotaiValue?.loading

  return (
    <div className="space-y-6 p-4">
      {/* ContextProvider 数据 */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-blue-600 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          方式1: ContextProvider (useContextProvider)
          {contextLoading && <span className="text-xs text-yellow-600 ml-2">加载中...</span>}
        </h3>
        {!contextData ? (
          <div className="text-center py-4 text-slate-400 bg-slate-50 rounded">
            <p className="text-sm">等待数据...</p>
          </div>
        ) : !Array.isArray(contextData) || contextData.length === 0 ? (
          <div className="text-center py-4 text-slate-400 bg-slate-50 rounded">
            <p className="text-sm">暂无数据</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-xs text-slate-500">
              数据条数: <span className="font-mono text-blue-600">{contextData.length}</span>
            </div>
            <pre className="bg-slate-800 text-green-400 p-3 rounded text-xs overflow-x-auto max-h-64">
              {JSON.stringify(contextData.slice(0, 3), null, 2)}
              {contextData.length > 3 && '\n... (仅显示前3条)'}
            </pre>
          </div>
        )}
      </div>

      {/* Jotai Atom 数据 */}
      {dataSourceId && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-purple-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            方式2: Jotai Atom (useDatasourceValue)
            <span className="text-xs text-slate-400 font-normal ml-2">Path: {dataSourceId}</span>
            {jotaiLoading && <span className="text-xs text-yellow-600 ml-2">加载中...</span>}
          </h3>
          {!jotaiData ? (
            <div className="text-center py-4 text-slate-400 bg-slate-50 rounded">
              <p className="text-sm">等待数据...</p>
            </div>
          ) : !Array.isArray(jotaiData) || jotaiData.length === 0 ? (
            <div className="text-center py-4 text-slate-400 bg-slate-50 rounded">
              <p className="text-sm">暂无数据</p>
            </div>
          ) : (
            <pre className="bg-slate-800 text-green-400 p-3 rounded text-xs overflow-x-auto max-h-64">
              {JSON.stringify(jotaiValue, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}
