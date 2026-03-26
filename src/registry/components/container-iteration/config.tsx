import { useContext } from 'react'
import { Iteration } from '@/registry/components/container-iteration/container-iteration'
import { IterationContext } from '@airiot/client'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './container-iteration.md?raw'

export const iterationPropsConfig = [
  {
    name: 'iterationList',
    label: '迭代数据列表',
    type: 'array' as const,
    default: [
      { id: 1, name: '项目 1', value: 100 },
      { id: 2, name: '项目 2', value: 200 },
      { id: 3, name: '项目 3', value: 300 }
    ],
    description: '需要迭代的数据数组'
  }
]

export const iterationDefaultProps = {
  iterationList: [
    { id: 1, name: '项目 1', value: 100 },
    { id: 2, name: '项目 2', value: 200 },
    { id: 3, name: '项目 3', value: 300 }
  ]
}

// 迭代项示例组件
function IterationItemDemo() {
  const { value, index } = useContext(IterationContext)

  return (
    <div className="p-4 m-2 bg-linear-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
          索引: {index}
        </span>
        <span className="text-xs text-slate-500">ID: {value?.id}</span>
      </div>
      <div className="text-lg font-medium text-slate-800 mb-1">
        {value?.name || '未命名'}
      </div>
      <div className="text-sm text-slate-600">
        值: {value?.value}
      </div>
    </div>
  )
}

const renderIterationPreview = (props: Record<string, any>) => {
  const list = props.iterationList || iterationDefaultProps.iterationList

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full h-full bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-4" style={{ minHeight: '400px' }}>
        <Iteration iterationList={list}>
          <IterationItemDemo />
        </Iteration>
      </div>
    </div>
  )
}

const renderIterationCodePreview = (props: Record<string, any>) => {
  const list = props.iterationList || iterationDefaultProps.iterationList
  const listString = JSON.stringify(list, null, 2)
    .split('\n')
    .map(line => '  ' + line)
    .join('\n')

  let code = `<Iteration\n  iterationList={${listString}}\n>`
  code += `\n  <YourComponent />\n`
  code += `</Iteration>`

  return code
}

export const iterationConfig: ComponentConfig = {
  id: 'container-iteration',
  name: 'Iteration 迭代',
  propsConfig: iterationPropsConfig,
  defaultProps: iterationDefaultProps,
  renderPreview: renderIterationPreview,
  renderCodePreview: renderIterationCodePreview,
  documentation: documentationMd
}
