## FormArea - 表单域组件

### 导入路径
```tsx
import { FormArea } from '@/components/airiot/form-area/form-area'
```

### 基础用法
```tsx
import { FormArea, FormItem } from '@/components/airiot'

function FormAreaExample() {
  return (
    <FormArea title="基本信息" layout="grid">
      <FormItem label="用户名" name="username">
        <Input placeholder="请输入用户名" />
      </FormItem>
      <FormItem label="邮箱" name="email">
        <Input placeholder="请输入邮箱" type="email" />
      </FormItem>
    </FormArea>
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | - | 区域标题 |
| layout | 'vertical' \| 'horizontal' \| 'grid' | 'vertical' | 布局方式 |
| span | number | 1 | 网格列数（grid布局） |
| gutter | number | 16 | 间隔间距 |

### 示例
```tsx
import { FormArea, FormItem, Input, Select } from '@/components/airiot'

function UserForm() {
  return (
    <div style={{ maxWidth: 800 }}>
      <FormArea title="基本信息" layout="grid" span={2}>
        <FormItem label="用户名" name="username" required>
          <Input placeholder="请输入用户名" />
        </FormItem>
        <FormItem label="邮箱" name="email" required>
          <Input placeholder="请输入邮箱" type="email" />
        </FormItem>
        <FormItem label="角色" name="role" span={2}>
          <Select
            options={[
              { label: '管理员', value: 'admin' },
              { label: '用户', value: 'user' }
            ]}
          />
        </FormItem>
      </FormArea>
    </div>
  )
}
```

### 注意事项
- 支持响应式网格布局
- 可以嵌套使用
- 适用于复杂表单分组