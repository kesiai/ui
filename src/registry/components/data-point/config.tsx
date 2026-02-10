import { DataPoint } from '@/registry/components/data-point/data-point'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './data-point.md?raw'

export const dataPointPropsConfig = [
  {
    name: 'tableId',
    label: '数据表ID',
    type: 'text' as const,
    default: 'device',
    placeholder: '例如: device, sensor'
  },
  {
    name: 'tableDataId',
    label: '数据行ID',
    type: 'text' as const,
    default: 'device-001',
    placeholder: '例如: device-001'
  },
  {
    name: 'tableDataName',
    label: '显示名称',
    type: 'text' as const,
    default: '温度传感器',
    placeholder: '请输入显示名称'
  },
  {
    name: 'tagId',
    label: '标签ID',
    type: 'text' as const,
    default: 'temperature',
    placeholder: '例如: temperature, humidity'
  },
  {
    name: 'animated',
    label: '数字动画',
    type: 'boolean' as const,
    default: true
  },
  {
    name: 'initVisible',
    label: '初始显示详情',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'config.fixed',
    label: '小数位数',
    type: 'number' as const,
    default: 2,
    min: 0,
    max: 6,
    step: 1
  }
]

export const dataPointDefaultProps = {
  tableId: 'device',
  tableDataId: 'device-001',
  tableDataName: '温度传感器',
  tagId: 'temperature',
  animated: true,
  initVisible: false,
  config: {
    fixed: 2
  }
}

const renderDataPointPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <DataPoint
          tableId={props.tableId}
          tableDataId={props.tableDataId}
          tableDataName={props.tableDataName}
          tagId={props.tagId}
          animated={props.animated}
          initVisible={props.initVisible}
          config={props.config}
        />
        <div className="mt-4 text-xs text-slate-500">
          <p>💡 提示: 配置有效的 tableId、tableDataId 和 tagId 来显示实际数据</p>
        </div>
      </div>
    </div>
  )
}

const renderDataPointCodePreview = (props: Record<string, any>) => {
  return `<DataPoint
  tableId="${props.tableId}"
  tableDataId="${props.tableDataId}"
  tableDataName="${props.tableDataName}"
  tagId="${props.tagId}"
  animated={${props.animated}}
  initVisible={${props.initVisible}}
  config={{
    fixed: ${props.config?.fixed || 2}
  }}
/>`
}

export const dataPointConfig: ComponentConfig = {
  id: 'data-point',
  name: 'DataPoint 数据点',
  propsConfig: dataPointPropsConfig,
  defaultProps: dataPointDefaultProps,
  renderPreview: renderDataPointPreview,
  renderCodePreview: renderDataPointCodePreview,
  documentation: documentationMd
}
