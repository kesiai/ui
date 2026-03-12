## ViewActions - 视图操作组件

### 导入路径
```tsx
import { ViewActions } from '@/components/airiot/view-actions/view-actions'
```

### 基础用法
```tsx
import { ViewActions } from '@/components/airiot/view-actions/view-actions'

function ActionsExample() {
  return (
    <ViewActions>
      <Button onClick={handleAdd}>新增</Button>
      <Button onClick={handleEdit}>编辑</Button>
      <Button onClick={handleDelete}>删除</Button>
    </ViewActions>
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| children | ReactNode | - | 操作按钮 |
| layout | 'horizontal' \| 'vertical' | 'horizontal' | 布局方向 |
| spacing | number | 8 | 间距 |
| divider | boolean | false | 是否显示分隔线 |

### 示例
```tsx
import { ViewActions, Button, Dropdown, Space } from '@/components/airiot'

function UserActions() {
  const actions = [
    { key: 'add', label: '新增用户', icon: 'plus' },
    { key: 'import', label: '导入用户', icon: 'upload' },
    { key: 'export', label: '导出用户', icon: 'download' }
  ]

  return (
    <ViewActions
      layout="horizontal"
      spacing={12}
      divider={true}
    >
      <Button type="primary" icon="plus">
        新增用户
      </Button>

      <Dropdown
        menu={{
          items: actions.map(action => ({
            key: action.key,
            label: action.label,
            icon: action.icon
          }))
        }}
      >
        <Button icon="more">
          更多操作
        </Button>
      </Dropdown>
    </ViewActions>
  )
}
```

### 使用场景
- 表格操作栏
- 列表头部操作
- 详情页操作区

### 注意事项
- 支持批量操作
- 可以配合下拉菜单使用
- 自动处理权限控制