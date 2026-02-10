import { ContextProvider, useContextProvider, type Table, type TableData } from '@/registry/components/container-context-provider/context-provider'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './container-context-provider.md?raw'

// 示例子组件 - 使用context数据
function ContextConsumer() {
  const { table, tableData, data } = useContextProvider()

  return (
    <div className="space-y-4 p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Table 数据</h3>
        <p className="text-gray-600">ID: {table.id}</p>
        <p className="text-gray-600">Name: {table.name}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">TableData 数据</h3>
        <p className="text-gray-600">ID: {tableData.id}</p>
        <p className="text-gray-600">Name: {tableData.name}</p>
        <div className="mt-2">
          <p className="text-sm text-gray-500">关联的Table:</p>
          <p className="text-gray-600">  - ID: {tableData.table.id}</p>
          <p className="text-gray-600">  - Name: {tableData.table.name}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Data 数组</h3>
        <p className="text-sm text-gray-500 mb-2">数组长度: {data.length}</p>
        <div className="space-y-1">
          {data.map((item: any, index: number) => (
            <div key={index} className="text-gray-600 text-sm">
              {JSON.stringify(item)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const contextProviderPropsConfig = [
  {
    name: 'table.id',
    label: '📋 Table',
    type: 'select' as const,
    default: 'table-001',
    description: '选择表格',
    options: [
      { label: '用户表', value: 'table-001' },
      { label: '订单表', value: 'table-002' },
      { label: '产品表', value: 'table-003' },
      { label: '部门表', value: 'table-004' }
    ]
  },
  {
    name: 'tableData.id',
    label: '📊 TableData',
    type: 'select' as const,
    default: 'data-001',
    description: '选择表格数据',
    options: [
      { label: '第一条数据', value: 'data-001' },
      { label: '第二条数据', value: 'data-002' },
      { label: '第三条数据', value: 'data-003' },
      { label: '第四条数据', value: 'data-004' }
    ]
  },
  {
    name: 'data',
    label: '📦 Data 数组',
    type: 'array' as const,
    default: [
      { id: 1, name: '项目1', status: 'active' },
      { id: 2, name: '项目2', status: 'pending' },
      { id: 3, name: '项目3', status: 'completed' }
    ],
    description: '上下文中传递的数据数组（JSON格式）'
  }
]

export const contextProviderDefaultProps = {
  'table.id': 'table-001',
  'tableData.id': 'data-001',
  data: [
    { id: 1, name: '项目1', status: 'active' },
    { id: 2, name: '项目2', status: 'pending' },
    { id: 3, name: '项目3', status: 'completed' }
  ]
}

// Table映射表
const tableMap: Record<string, { id: string; name: string }> = {
  'table-001': { id: 'table-001', name: '用户表' },
  'table-002': { id: 'table-002', name: '订单表' },
  'table-003': { id: 'table-003', name: '产品表' },
  'table-004': { id: 'table-004', name: '部门表' }
}

// TableData映射表
const tableDataMap: Record<string, { id: string; name: string }> = {
  'data-001': { id: 'data-001', name: '第一条数据' },
  'data-002': { id: 'data-002', name: '第二条数据' },
  'data-003': { id: 'data-003', name: '第三条数据' },
  'data-004': { id: 'data-004', name: '第四条数据' }
}

const renderContextProviderPreview = (props: Record<string, any>) => {
  const tableId = props['table.id'] || 'table-001'
  const tableDataId = props['tableData.id'] || 'data-001'

  const table: Table = tableMap[tableId] || tableMap['table-001']
  const tableData: TableData = {
    ...tableDataMap[tableDataId] || tableDataMap['data-001'],
    table: table
  }

  const data = props.data || [
    { id: 1, name: '项目1', status: 'active' },
    { id: 2, name: '项目2', status: 'pending' },
    { id: 3, name: '项目3', status: 'completed' }
  ]

  return (
    <div className="h-full flex items-center justify-center p-4" style={{ minHeight: '400px' }}>
      <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
        <ContextProvider
          table={table}
          tableData={tableData}
          data={data}
          className="h-full"
        >
          <div className="h-full flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Context Provider 示例</h2>
            <p className="text-gray-600 mb-6">子组件通过 useContextProvider hook 获取上下文数据</p>
            <ContextConsumer />
          </div>
        </ContextProvider>
      </div>
    </div>
  )
}

const renderContextProviderCodePreview = (props: Record<string, any>) => {
  const tableId = props['table.id'] || 'table-001'
  const tableDataId = props['tableData.id'] || 'data-001'

  const table = tableMap[tableId] || tableMap['table-001']
  const tableData = tableDataMap[tableDataId] || tableDataMap['data-001']

  const data = props.data || [
    { id: 1, name: '项目1', status: 'active' },
    { id: 2, name: '项目2', status: 'pending' },
    { id: 3, name: '项目3', status: 'completed' }
  ]

  let code = `import { ContextProvider, useContextProvider } from '@/registry/components/container-context-provider/context-provider'

function ChildComponent() {
  const { table, tableData, data } = useContextProvider()

  return (
    <div>
      <p>Table: {table.name}</p>
      <p>TableData: {tableData.name}</p>
      <p>Data Length: {data.length}</p>
    </div>
  )
}

function App() {
  const table = { id: '${table.id}', name: '${table.name}' }
  const tableData = {
    id: '${tableData.id}',
    name: '${tableData.name}',
    table: table
  }
  const data = ${JSON.stringify(data, null, 2)}

  return (
    <ContextProvider
      table={table}
      tableData={tableData}
      data={data}
    >
      <ChildComponent />
    </ContextProvider>
  )
}`

  return code
}

export const contextProviderConfig: ComponentConfig = {
  id: 'container-context-provider',
  name: 'ContextProvider 上下文容器',
  propsConfig: contextProviderPropsConfig,
  defaultProps: contextProviderDefaultProps,
  renderPreview: renderContextProviderPreview,
  renderCodePreview: renderContextProviderCodePreview,
  documentation: documentationMd
}
