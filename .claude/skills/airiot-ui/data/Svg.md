## Svg - SVG组件

### 导入路径
```tsx
import { Svg } from '@/components/airiot/svg/svg'
```

### 基础用法
```tsx
import { Svg } from '@/components/airiot/svg/svg'

function SvgExample() {
  return (
    <Svg
      icon="home"
      size={24}
      color="primary"
      viewBox="0 0 24 24"
    />
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| icon | string | - | 图标名称 |
| size | number | 24 | 尺寸 |
| color | string | 'inherit' | 颜色 |
| viewBox | string | '0 0 24 24' | 视图框 |
| className | string | - | CSS类名 |
| style | object | {} | 内联样式 |

### 示例
```tsx
import { Svg, Button, Space } from '@/components/airiot'

function IconExample() {
  const icons = [
    { name: 'home', color: 'primary' },
    { name: 'user', color: 'success' },
    { name: 'setting', color: 'warning' }
  ]

  return (
    <Space>
      {icons.map((icon, index) => (
        <Button key={index} type="text">
          <Svg
            icon={icon.name}
            size={20}
            color={icon.color}
          />
        </Button>
      ))}
    </Space>
  )
}
```

### 预置图标
- home - 首页
- user - 用户
- setting - 设置
- mail - 邮件
- phone - 电话
- calendar - 日历
- search - 搜索
- download - 下载
- upload - 上传

### 注意事项
- 支持自定义 SVG 路径
- 可以通过 CSS 控制样式
- 支持响应式尺寸