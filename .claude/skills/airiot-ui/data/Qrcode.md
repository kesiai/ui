## QRCode - 二维码组件

### 导入路径
```tsx
import { QRCode } from '@/components/airiot/qrcode/qrcode'
```

### 基础用法
```tsx
import { QRCode } from '@/components/airiot/qrcode/qrcode'

function QRCodeExample() {
  return (
    <QRCode
      value="https://example.com"
      size={200}
      level="H"
      includeMargin={true}
    />
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | string | - | 二维码内容 |
| size | number | 128 | 尺寸 |
| level | 'L' \| 'M' | 'L' | 容错级别 |
| includeMargin | boolean | false | 是否包含外边距 |
| bgColor | string | '#ffffff' | 背景色 |
| fgColor | string | '#000000' | 前景色 |

### 示例
```tsx
import { QRCode, Button, Card, Input } from '@/components/airiot'

function QRCodeGenerator() {
  const [value, setValue] = useState('https://example.com')
  const [showQR, setShowQR] = useState(false)

  return (
    <Card cardTitle="二维码生成器">
      <Input
        value={value}
        onChange={setValue}
        placeholder="请输入内容"
      />

      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Button
          type="primary"
          onClick={() => setShowQR(true)}
        >
          生成二维码
        </Button>
      </div>

      {showQR && (
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <QRCode
            value={value}
            size={200}
            level="H"
            includeMargin={true}
            bgColor="#f0f0f0"
            fgColor="#1890ff"
          />
          <Button
            type="link"
            onClick={() => {
              const canvas = document.querySelector('canvas')
              if (canvas) {
                const url = canvas.toDataURL('image/png')
                const link = document.createElement('a')
                link.download = 'qrcode.png'
                link.href = url
                link.click()
              }
            }}
            style={{ marginTop: 16 }}
          >
            下载二维码
          </Button>
        </div>
      )}
    </Card>
  )
}
```

### 容错级别
- L：约7%的错误可恢复
- M：约15%的错误可恢复
- Q：约25%的错误可恢复
- H：约30%的错误可恢复

### 注意事项
- 支持 URL、文本、电话号码等
- 可以自定义颜色
- 支持下载为图片