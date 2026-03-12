## FormSwitch - 开关组件

### 导入路径
```tsx
import { FormSwitch } from '@/components/airiot/form-switch/form-switch'
```

### 基础用法
```tsx
import { FormSwitch } from '@/components/airiot/form-switch/form-switch'

function SwitchExample() {
  const [checked, setChecked] = useState(false)

  return (
    <FormSwitch
      checked={checked}
      onChange={setChecked}
      checkedChildren="开"
      unCheckedChildren="关"
    />
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| checked | boolean | false | 是否选中 |
| onChange | (checked) => void | - | 变化回调 |
| checkedChildren | ReactNode | '开' | 选中时的文字 |
| unCheckedChildren | ReactNode | '关' | 未选中时的文字 |
| disabled | boolean | false | 是否禁用 |
| size | 'small' \| 'default' | 'default' | 尺寸 |

### 示例
```tsx
import { FormSwitch, FormItem, Card, Space } from '@/components/airiot'

function SwitchDemo() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [autoSave, setAutoSave] = useState(true)

  return (
    <Card cardTitle="系统设置">
      <Space direction="vertical" style={{ width: '100%' }}>
        <FormItem label="接收通知">
          <FormSwitch
            checked={notifications}
            onChange={setNotifications}
            checkedChildren="已开启"
            unCheckedChildren="已关闭"
          />
          <span style={{ marginLeft: 8, color: '#999' }}>
            {notifications ? '您将收到重要通知' : '您不会收到任何通知'}
          </span>
        </FormItem>

        <FormItem label="深色模式">
          <FormSwitch
            checked={darkMode}
            onChange={setDarkMode}
            size="default"
            checkedChildren="深色"
            unCheckedChildren="浅色"
          />
        </FormItem>

        <FormItem label="自动保存">
          <FormSwitch
            checked={autoSave}
            onChange={setAutoSave}
            checkedChildren="自动保存已启用"
            unCheckedChildren="自动保存已禁用"
            disabled={false}
          />
        </FormItem>

        <div style={{ marginTop: 16, padding: 12, background: '#f5f5f5' }}>
          <h4>当前设置：</h4>
          <p>通知: {notifications ? '开启' : '关闭'}</p>
          <p>主题: {darkMode ? '深色' : '浅色'}</p>
          <p>自动保存: {autoSave ? '开启' : '关闭'}</p>
        </div>
      </Space>
    </Card>
  )
}
```

### 使用场景
- 开关设置项
- 状态切换
- 功能启用/禁用

### 注意事项
- 支持自定义文字
- 可以配合标签使用
- 支持禁用状态