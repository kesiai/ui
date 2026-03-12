# ViewDataTable 数据表格视图

## 导入路径

```tsx
import {
  ViewDataTable,
  ViewFilter,
  ViewPagination,
  ViewActions,
  ViewDetail,
  ViewBatch
} from '@/components/airiot/view/view-data-table'
```

## 完整使用示例

```tsx
import {
  ViewDataTable,
  ViewFilter,
  ViewPagination,
  ViewActions,
  ViewDetail,
  ViewBatch
} from '@/components/airiot/view/view-data-table'
import { Button } from '@/components/airiot/button/button'
import { FormInput } from '@/components/airiot/form/form-input/form-input'
import { Text } from '@/components/airiot/text/text'

function UserManagementView() {
  // 表格列配置
  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (text: string) => <Text>{text}</Text>
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (text: string) => <Text>{text}</Text>
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => <Text>{text}</Text>
    }
  ]

  return (
    <ViewDataTable
      title="用户管理"
      api="/api/users"
      columns={columns}
      enableSelection={true}
      enablePagination={true}
      enableFilter={true}
    >
      {/* 批量操作栏 */}
      <ViewBatch>
        <Button variant="primary" onClick={() => console.log('批量删除')}>
          批量删除
        </Button>
        <Button variant="secondary" onClick={() => console.log('批量导出')}>
          批量导出
        </Button>
      </ViewBatch>

      {/* 过滤器 */}
      <ViewFilter>
        <FormInput
          placeholder="搜索用户名"
          field="username"
          operator="contains"
        />
        <FormInput
          placeholder="搜索邮箱"
          field="email"
          operator="contains"
        />
      </ViewFilter>

      {/* 数据表格 */}
      <ViewDataTable.List />

      {/* 分页器 */}
      <ViewPagination />

      {/* 操作栏 */}
      <ViewActions>
        <Button variant="primary" onClick={() => console.log('新增')}>
          新增用户
        </Button>
        <Button variant="secondary" onClick={() => console.log('刷新')}>
          刷新
        </Button>
      </ViewActions>

      {/* 详情弹窗 */}
      <ViewDetail title="用户详情">
        <div className="p-4">
          <Text>详情内容...</Text>
        </div>
      </ViewDetail>
    </ViewDataTable>
  )
}
```

## Props

### ViewDataTable

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | - | 视图标题 |
| api | string | - | API接口地址 |
| columns | Array | - | 表格列配置 |
| enableSelection | boolean | false | 是否启用选择 |
| enablePagination | boolean | true | 是否启用分页 |
| enableFilter | boolean | true | 是否启用过滤 |
| rowKey | string | 'id' | 行数据的唯一标识 |

### ViewFilter

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| fields | Array | - | 过滤字段配置 |

### ViewPagination

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| pageSize | number | 10 | 每页条数 |
| showSizeChanger | boolean | true | 是否显示条数选择 |

### ViewActions

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| position | 'top' \| 'bottom' | 'top' | 操作栏位置 |

### ViewDetail

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | - | 详情标题 |
| width | number | 600 | 详情弹窗宽度 |

### ViewBatch

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| selectedKeys | Array | [] | 选中的行键 |

## 列配置

```tsx
const columns = [
  {
    title: '列标题',
    dataIndex: 'dataField',
    key: 'key',
    render: (text: any, record: any) => {
      // 自定义渲染
      return <span>{text}</span>
    },
    width: 150, // 列宽
    sorter: true, // 是否可排序
    filters: [ // 过滤器
      { text: '选项1', value: 'value1' },
      { text: '选项2', value: 'value2' }
    ]
  }
]
```

## 注意事项

- ViewDataTable 是一个容器组件，需要搭配其他视图组件使用
- 子组件的顺序会影响渲染顺序，请合理安排
- 使用时需要确保正确配置了所有需要的子组件