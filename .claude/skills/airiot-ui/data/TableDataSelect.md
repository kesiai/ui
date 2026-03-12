# TableDataSelect 表数据选择器

## 导入路径

```tsx
import { TableDataSelect } from '@/components/airiot/form/table-data-select'
import { useState } from 'react'
```

## 基础用法

```tsx
import { TableDataSelect } from '@/components/airiot/form/table-data-select'

function TableSelectExample() {
  const [selectedData, setSelectedData] = useState(null)

  const tableConfig = {
    table: 'users',
    fields: ['id', 'name', 'email'],
    where: { status: 'active' },
    pagination: { page: 1, size: 10 }
  }

  return (
    <TableDataSelect
      label="选择用户"
      placeholder="请选择用户"
      tableConfig={tableConfig}
      value={selectedData?.id}
      onChange={(value) => {
        setSelectedData(value)
      }}
      displayFields={['name', 'email']}
    />
  )
}
```

## 高级用法

```tsx
import { TableDataSelect } from '@/components/airiot/form/table-data-select'
import { Button } from '@/components/airiot/button'

function AdvancedTableSelectExample() {
  const [selectedData, setSelectedData] = useState([])
  const [visible, setVisible] = useState(false)

  const tableConfig = {
    table: 'products',
    fields: ['id', 'name', 'price', 'category'],
    where: { stock: { gt: 0 } },
    pagination: { page: 1, size: 20 },
    order: { name: 'asc' }
  }

  // 自定义渲染函数
  const renderOption = (record) => (
    <div>
      <div>{record.name}</div>
      <div className="text-gray-500">¥{record.price} - {record.category}</div>
    </div>
  )

  return (
    <div>
      <TableDataSelect
        label="选择商品"
        placeholder="请选择商品"
        tableConfig={tableConfig}
        value={selectedData.map(item => item.id)}
        onChange={(value) => {
          setSelectedData(value)
        }}
        multiple
        displayFields={['name', 'price']}
        renderOption={renderOption}
        showSearch
        showTotal
        rowSelection={{
          type: 'checkbox',
          onChange: (selectedRowKeys) => {
            console.log('选中的行:', selectedRowKeys)
          }
        }}
      />

      <div className="mt-4">
        <Button
          onClick={() => setVisible(!visible)}
          type="primary"
        >
          {visible ? '关闭选择器' : '打开选择器'}
        </Button>
      </div>

      {selectedData.length > 0 && (
        <div className="mt-4">
          <h3>已选择的商品：</h3>
          <ul>
            {selectedData.map(item => (
              <li key={item.id}>
                {item.name} - ¥{item.price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| name | string | - | 字段名 |
| label | string | - | 标签文本 |
| placeholder | string | - | 占位符 |
| value | string \| number \| string[] \| number[] | - | 选中值 |
| onChange | (value: any) => void | - | 变化事件 |
| tableConfig | TableConfig | - | 表格配置 |
| displayFields | string[] | - | 显示字段 |
| multiple | boolean | false | 是否多选 |
| searchable | boolean | true | 是否可搜索 |
| showSearch | boolean | true | 显示搜索框 |
| showTotal | boolean | true | 显示总数 |
| renderOption | (record: any) => ReactNode | - | 自定义选项渲染 |
| rowSelection | object | - | 行选择配置 |
| modalTitle | string | '选择数据' | 弹窗标题 |
| modalWidth | number | 800 | 弹窗宽度 |

## TableConfig 类型

```tsx
interface TableConfig {
  table: string // 表名
  fields: string[] // 查询字段
  where?: object // 查询条件
  pagination?: { page: number; size: number } // 分页
  order?: object // 排序
}
```

## rowSelection 配置

```tsx
interface RowSelection {
  type: 'radio' | 'checkbox'
  selectedRowKeys: string[] | number[]
  onChange: (selectedRowKeys: string[] | number[]) => void
  getCheckboxProps?: (record: any) => object
}
```

## 示例

### 带过滤的表选择器

```tsx
import { TableDataSelect } from '@/components/airiot/form/table-data-select'

function FilteredTableSelectExample() {
  const [selectedData, setSelectedData] = useState(null)

  const tableConfig = {
    table: 'orders',
    fields: ['id', 'orderNo', 'customerName', 'amount'],
    where: {
      status: 'completed',
      amount: { gte: 1000 }
    },
    order: { createdAt: 'desc' }
  }

  return (
    <TableDataSelect
      label="选择订单"
      placeholder="请选择订单"
      tableConfig={tableConfig}
      value={selectedData?.id}
      onChange={(value) => setSelectedData(value)}
      displayFields={['orderNo', 'customerName', 'amount']}
      searchable
    />
  )
}
```

### 带自定义渲染的表选择器

```tsx
import { TableDataSelect } from '@/components/airiot/form/table-data-select'

function CustomRenderTableSelectExample() {
  const [selectedData, setSelectedData] = useState([])

  const tableConfig = {
    table: 'employees',
    fields: ['id', 'name', 'position', 'department', 'salary'],
    where: { status: 'active' }
  }

  const renderOption = (record) => (
    <div className="flex items-center space-x-2">
      <img
        src={`/avatars/${record.id}.jpg`}
        alt={record.name}
        className="w-8 h-8 rounded-full"
      />
      <div>
        <div className="font-medium">{record.name}</div>
        <div className="text-sm text-gray-500">
          {record.position} - {record.department}
        </div>
        <div className="text-sm text-gray-500">
          ¥{record.salary.toLocaleString()}
        </div>
      </div>
    </div>
  )

  return (
    <TableDataSelect
      label="选择员工"
      placeholder="请选择员工"
      tableConfig={tableConfig}
      value={selectedData.map(item => item.id)}
      onChange={(value) => setSelectedData(value)}
      multiple
      displayFields={['name', 'position']}
      renderOption={renderOption}
      showSearch
    />
  )
}
```

## 注意事项

- 表选择器需要后端API支持
- 大数据量时建议使用分页
- 多选模式下，value 是数组类型
- 自定义渲染时，建议显示关键信息
- 可以通过 rowSelection 实现复杂的选择逻辑