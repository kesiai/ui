import { Iteration } from '@/registry/blocks/containers/iteration/iteration'
import { ComponentConfig } from '../types'

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

// 示例：使用 IterationContext 的子组件
function IterationItemDemo() {
  const { IterationContext } = require('@airiot/client')
  const { value, index } = require('react').useContext(IterationContext)

  return (
    <div className="p-4 m-2 bg-blue-50 rounded border border-blue-200">
      <p className="text-sm font-medium">索引: {index}</p>
      <p className="text-sm">名称: {value.name}</p>
      <p className="text-sm">值: {value.value}</p>
    </div>
  )
}

const renderIterationPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full h-full bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-4" style={{ minHeight: '400px' }}>
        <Iteration iterationList={props.iterationList}>
          <div className="p-4 m-2 bg-blue-50 rounded border border-blue-200">
            <p className="text-sm font-medium">迭代项内容</p>
            <p className="text-xs text-slate-500">使用 IterationContext 获取数据</p>
          </div>
        </Iteration>
      </div>
    </div>
  )
}

const renderIterationCodePreview = (props: Record<string, any>) => {
  const listString = JSON.stringify(props.iterationList, null, 2)
    .split('\n')
    .map(line => '  ' + line)
    .join('\n')

  let code = `<Iteration\n  iterationList={${listString}}\n>`
  code += `\n  <YourComponent />\n`
  code += `</Iteration>`

  return code
}

export const iterationConfig: ComponentConfig = {
  id: 'iteration',
  name: 'Iteration 迭代',
  propsConfig: iterationPropsConfig,
  defaultProps: iterationDefaultProps,
  renderPreview: renderIterationPreview,
  renderCodePreview: renderIterationCodePreview
}
