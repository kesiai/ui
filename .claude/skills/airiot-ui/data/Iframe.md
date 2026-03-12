## Iframe - 内嵌框架组件

### 导入路径
```tsx
import { Iframe } from '@/components/airiot/iframe/iframe'
```

### 基础用法
```tsx
import { Iframe } from '@/components/airiot/iframe/iframe'

function IframeExample() {
  return (
    <Iframe
      src="https://example.com"
      title="外部页面"
      width="100%"
      height="500px"
      allow="fullscreen"
    />
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| src | string | - | iframe 源地址 |
| title | string | - | 标题 |
| width | string \| number | '100%' | 宽度 |
| height | string \| number | '400px' | 高度 |
| allow | string | - | 允许的权限 |
| sandbox | string | - | 沙盒限制 |
| onLoad | () => void | - | 加载完成回调 |

### 示例
```tsx
import { Iframe, Button, Modal } from '@/components/airiot'

function DocumentViewer() {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <Button onClick={() => setVisible(true)}>
        查看文档
      </Button>

      <Modal
        title="文档预览"
        open={visible}
        onOpenChange={setVisible}
        modalWidth="80%"
        modalHeight="80vh"
      >
        <Iframe
          src="https://docs.example.com/manual.pdf"
          title="技术文档"
          width="100%"
          height="100%"
          allow="fullscreen"
          onLoad={() => console.log('文档加载完成')}
        />
      </Modal>
    </div>
  )
}
```

### 注意事项
- 注意同源策略限制
- 可以设置安全沙盒
- 支持加载事件监听