## FormSlider - 滑块组件

### 导入路径
```tsx
import { FormSlider } from '@/components/airiot/form-slider/form-slider'
```

### 基础用法
```tsx
import { FormSlider } from '@/components/airiot/form-slider/form-slider'

function SliderExample() {
  const [value, setValue] = useState(50)

  return (
    <FormSlider
      value={value}
      onChange={setValue}
      min={0}
      max={100}
      step={1}
      marks={{
        0: '0',
        50: '50',
        100: '100'
      }}
    />
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | number | - | 当前值 |
| onChange | (value) => void | - | 变化回调 |
| min | number | 0 | 最小值 |
| max | number | 100 | 最大值 |
| step | number | 1 | 步长 |
| marks | object | {} | 刻度标记 |

### 示例
```tsx
import { FormSlider, FormItem, Card, Space, NumberInput } from '@/components/airiot'

function VolumeControl() {
  const [volume, setVolume] = useState(50)
  const [brightness, setBrightness] = useState(80)

  return (
    <Card cardTitle="音量与亮度控制">
      <Space direction="vertical" style={{ width: '100%' }}>
        <FormItem label="音量控制">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span>0</span>
            <FormSlider
              value={volume}
              onChange={setVolume}
              min={0}
              max={100}
              step={1}
              marks={{
                0: '静音',
                50: '50%',
                100: '最大'
              }}
              style={{ flex: 1 }}
            />
            <NumberInput
              value={volume}
              onChange={setVolume}
              min={0}
              max={100}
              style={{ width: 60 }}
            />
          </div>
          <div style={{ marginTop: 8, textAlign: 'center', color: '#666' }}>
            当前音量: {volume}%
          </div>
        </FormItem>

        <FormItem label="屏幕亮度">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span>暗</span>
            <FormSlider
              value={brightness}
              onChange={setBrightness}
              min={0}
              max={100}
              step={5}
              marks={{
                0: '0%',
                50: '50%',
                100: '100%'
              }}
              style={{ flex: 1 }}
            />
            <span>亮</span>
          </div>
        </FormItem>

        <div style={{ marginTop: 16, padding: 12, background: '#f0f0f0' }}>
          <h4>实时预览：</h4>
          <div
            style={{
              width: '100%',
              height: 100,
              background: `linear-gradient(to right, #333, #fff)`,
              opacity: brightness / 100
            }}
          />
        </div>
      </Space>
    </Card>
  )
}
```

### 使用场景
- 音量控制
- 亮度调节
- 价格范围选择
- 进度设置

### 注意步骤配置
- step=1: 精确到整数
- step=0.1: 精确到小数点后一位
- step=0.01: 精确到小数点后两位

### 注意事项
- 支持垂直和水平方向
- 可以自定义刻度显示
- 支持拖拽和点击操作