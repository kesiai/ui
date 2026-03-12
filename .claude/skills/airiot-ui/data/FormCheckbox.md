## FormCheckbox - 复选框组件

### 导入路径
```tsx
import { FormCheckbox } from '@/components/airiot/form-checkbox/form-checkbox'
```

### 基础用法
```tsx
import { FormCheckbox } from '@/components/airiot/form-checkbox/form-checkbox'

function CheckboxExample() {
  const [checked, setChecked] = useState(false)

  return (
    <FormCheckbox
      checked={checked}
      onChange={setChecked}
      label="记住我"
    />
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| checked | boolean | false | 是否选中 |
| onChange | (checked) => void | - | 变化回调 |
| label | string | - | 标签文本 |
| disabled | boolean | false | 是否禁用 |
| indeterminate | boolean | false | 是否半选 |

### 示例
```tsx
import { FormCheckbox, FormCheckboxGroup, Card } from '@/components/airiot'

function PermissionForm() {
  const [permissions, setPermissions] = useState<string[]>([])

  const permissionOptions = [
    { label: '查看', value: 'read' },
    { label: '创建', value: 'create' },
    { label: '编辑', value: 'edit' },
    { label: '删除', value: 'delete' }
  ]

  return (
    <Card cardTitle="权限设置">
      <FormCheckbox
        checked={permissions.length === permissionOptions.length}
        onChange={(checked) => {
          setPermissions(checked ? permissionOptions.map(p => p.value) : [])
        }}
        label="全选"
        indeterminate={permissions.length > 0 && permissions.length < permissionOptions.length}
      />

      <FormCheckboxGroup
        options={permissionOptions}
        value={permissions}
        onChange={setPermissions}
        direction="vertical"
      />
    </Card>
  )
}
```

### 注意事项
- 支持单个和多个复选框
- 可以配合 FormCheckboxGroup 使用
- 支持半选状态