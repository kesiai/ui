## GisCodeEditor - GIS代码编辑器组件

### 导入路径
```tsx
import { GisCodeEditor } from '@/components/airiot/gis-code-editor/gis-code-editor'
```

### 基础用法
```tsx
import { GisCodeEditor } from '@/components/airiot/gis-code-editor/gis-code-editor'

function CodeEditorExample() {
  const [code, setCode] = useState(`// 绘制一个多边形
const polygon = new Polygon([
  [120.15, 30.28],
  [120.16, 30.28],
  [120.16, 30.29],
  [120.15, 30.29]
], {
  fillColor: 'red',
  fillOpacity: 0.3
})`)

  return (
    <GisCodeEditor
      value={code}
      onChange={setCode}
      language="javascript"
      height={300}
      theme="vs-dark"
    />
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | string | - | 代码内容 |
| onChange | (value) => void | - | 变化回调 |
| language | string | 'javascript' | 语言类型 |
| height | number | 200 | 高度 |
| theme | 'vs' \| 'vs-dark' \| 'hc-black' | 'vs' | 主题 |
| showLineNumbers | boolean | true | 显示行号 |

### 示例
```tsx
import { GisCodeEditor, Button, Card } from '@/components/airiot'

function GisScriptEditor() {
  const [script, setScript] = useState('')

  const runScript = () => {
    try {
      // 执行GIS脚本逻辑
      console.log('执行脚本:', script)
    } catch (error) {
      console.error('脚本执行错误:', error)
    }
  }

  return (
    <Card cardTitle="GIS脚本编辑器">
      <GisCodeEditor
        value={script}
        onChange={setScript}
        language="javascript"
        height={400}
        theme="vs-dark"
        showLineNumbers={true}
      />

      <div style={{ marginTop: 16 }}>
        <Button type="primary" onClick={runScript}>
          运行脚本
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={() => setScript('')}>
          清空
        </Button>
      </div>
    </Card>
  )
}
```

### 支持的语言
- JavaScript
- TypeScript
- JSON
- SQL
- Python

### 注意事项
- 支持语法高亮
- 可以自定义主题
- 支持自动补全功能