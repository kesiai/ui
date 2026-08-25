import { DevicePointsChart } from "@/registry/components/render-device-points-chart/render-device-points-chart"
import { ComponentConfig } from "@/app/config/types"
import documentationMd from "./render-device-points-chart.md?raw"

export const renderDevicePointsChartConfig: ComponentConfig = {
  id: 'render-device-points-chart',
  name: 'Render 设备点位图表',
  propsConfig: [
    {
      name: 'device',
      label: '设备名',
      type: 'text' as const,
      default: '1#泵',
      description: '设备名称（render:device-points-chart 的 device 字段）'
    },
  ],
  defaultProps: {
    device: '1#泵',
  },
  renderPreview: (props: Record<string, any>) => {
    return (
      <div className="w-full">
        <DevicePointsChart
          device={props.device || '1#泵'}
          points={[
            { name: '温度', unit: '℃', data: [
              { time: '08:00', value: 42.1 },
              { time: '08:05', value: 42.6 },
              { time: '08:10', value: 41.9 },
              { time: '08:15', value: 43.2 },
            ]},
            { name: '压力', unit: 'MPa', data: [
              { time: '08:00', value: 0.8 },
              { time: '08:05', value: 0.82 },
              { time: '08:10', value: 0.79 },
              { time: '08:15', value: 0.85 },
            ]},
          ]}
        />
      </div>
    )
  },
  renderCodePreview: (props: Record<string, any>) => {
    return `import { DevicePointsChart } from "@/registry/components/render-device-points-chart"

// render 标签（AI 主动输出）:
//   <render:device-points-chart {"device":"${props.device || '1#泵'}","points":[...]} </render:device-points-chart>
// 按需注册:
//   renderRegistry={{ 'device-points-chart': DevicePointsChart }}`
  },
  documentation: documentationMd,
}

export default renderDevicePointsChartConfig
