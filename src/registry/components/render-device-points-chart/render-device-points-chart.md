# Render 设备点位图表 (DevicePointsChart)

设备表点位的时序折线图（echarts）。AI 在回复中使用 render 标签主动输出，当用户询问设备点位
的**时序数据、趋势、历史值、随时间变化、曲线、折线**时使用。

## render 标签用法

```
<render:device-points-chart {"device":"1#泵","points":[{"name":"温度","unit":"℃","data":[{"time":"08:00","value":42.1}]}]} </render:device-points-chart>
```

## 基本用法（作为组件直接渲染）

```tsx
import { DevicePointsChart } from "@/registry/components/render-device-points-chart"

<DevicePointsChart
  device="1#泵"
  points={[
    { name: "温度", unit: "℃", data: [{ time: "08:00", value: 42.1 }] },
  ]}
/>
```

## Props

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `device` | `string` | 是 | 设备名称（图表标题） |
| `points` | `DevicePoint[]` | 是 | 点位数组，每个点位为 `{ name, unit?, data: [{time, value}] }` |

## RenderRegistry 条目

组件自含 `RenderRegistry` 注册信息（component + description + schema + rules）。
`description`/`schema` markdown 明确告诉 AI 何时用、怎么填 JSON（触发关键词：趋势/时序/历史/变化/曲线/折线/随时间/点位数据）。

## 按需注册

```ts
import { RenderRegistry as DevicePointsChartRegistry } from "@/registry/components/render-device-points-chart"

useAgentRuntime({
  renderRegistry: {
    "device-points-chart": DevicePointsChartRegistry,
  },
})
```
