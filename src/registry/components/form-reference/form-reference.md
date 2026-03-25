# Form.Reference 查找引用

## 简介

`FormReference` 是一个用于显示计算记录查找引用结果的组件，通过 API 获取并展示关联字段的值。

- **自动计算**：根据配置的 tableId 和数据自动调用计算记录 API
- **防抖优化**：使用防抖机制减少不必要的 API 调用，提升性能
- **字段格式化**：支持根据字段 schema 自动格式化显示值
- **加载状态**：显示加载动画，提供良好的用户体验
- **错误处理**：内置错误处理机制，防止计算失败影响页面

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `schema` | `object` | 否 | - | Schema 配置对象 |
| `schema.key` | `string` | 否 | - | 字段键名 |
| `schema.searchRelate` | `object` | 否 | - | 关联字段配置 |
| `schema.searchRelate.field` | `object` | 否 | - | 关联字段信息 |
| `schema.searchRelate.field.key` | `string` | 否 | - | 关联字段键名 |
| `schema.searchRelate.field.fieldSchema` | `any` | 否 | - | 关联字段 schema |
| `schema.numberFormat` | `string` | 否 | - | 数字格式化字符串 |
| `field` | `object` | 否 | - | 字段配置对象 |
| `field.key` | `string` | 否 | - | 字段键名（优先于 schema.key） |
| `option` | `object` | 否 | - | 选项配置对象 |
| `option.schema` | `object` | 否 | - | 选项 schema |
| `option.schema.name` | `string` | 否 | - | 表名称（格式：core/t/表ID/d） |
| `tableData` | `object` | 否 | - | 表格数据，用于计算引用值 |

### 工作原理

1. **提取 tableId**：从 `option.schema.name` 中提取表 ID（格式：`core/t/{tableId}/d`）
2. **调用 API**：使用提取的 tableId 和当前的 tableData 调用计算记录 API
3. **显示结果**：从返回结果中提取指定字段的值，并根据 schema 进行格式化显示
4. **防抖优化**：使用 800ms 的防抖延迟，避免频繁调用 API

## 基本用法

### 1. 基础查找引用

显示计算记录的查找引用结果。

```tsx
import { FormReference } from '@/registry/components/kesi/form-reference'

function Example() {
  const tableData = {
    field1: '测试数据',
    field2: 123
  }

  return (
    <FormReference
      schema={{
        key: 'reference',
        numberFormat: ''
      }}
      field={{
        key: 'result'
      }}
      option={{
        schema: {
          name: 'core/t/table123/d'
        }
      }}
      tableData={tableData}
    />
  )
}
```

### 2. 数字格式化

使用 numberFormat 格式化数字显示。

```tsx
function Example() {
  const tableData = {
    amount: 1234567.89
  }

  return (
    <FormReference
      schema={{
        key: 'amount',
        numberFormat: '#,##0.00'
      }}
      field={{
        key: 'formattedAmount'
      }}
      option={{
        schema: {
          name: 'core/t/calculations/d'
        }
      }}
      tableData={tableData}
    />
  )
}
```

### 3. 关联字段显示

显示关联字段的计算结果。

```tsx
function Example() {
  const tableData = {
    userId: 'user001',
    quantity: 10
  }

  return (
    <FormReference
      schema={{
        key: 'userName',
        searchRelate: {
          field: {
            key: 'name',
            fieldSchema: {
              type: 'text',
              label: '用户名'
            }
          }
        }
      }}
      field={{
        key: 'name'
      }}
      option={{
        schema: {
          name: 'core/t/userReference/d'
        }
      }}
      tableData={tableData}
    />
  )
}
```

## 完整示例

### 订单金额计算

根据订单数据自动计算并显示总金额。

```tsx
import { FormReference } from '@/registry/components/kesi/form-reference'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

function OrderCalculation() {
  const [orderData, setOrderData] = useState({
    productId: 'prod001',
    quantity: 5,
    unitPrice: 99.99
  })

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>产品单价</Label>
        <Input
          type="number"
          value={orderData.unitPrice}
          onChange={(e) => setOrderData({
            ...orderData,
            unitPrice: Number(e.target.value)
          })}
        />
      </div>

      <div className="space-y-2">
        <Label>数量</Label>
        <Input
          type="number"
          value={orderData.quantity}
          onChange={(e) => setOrderData({
            ...orderData,
            quantity: Number(e.target.value)
          })}
        />
      </div>

      <div className="space-y-2">
        <Label>总金额</Label>
        <div className="p-3 bg-gray-50 rounded border">
          <FormReference
            schema={{
              key: 'totalAmount',
              numberFormat: '¥#,##0.00'
            }}
            field={{
              key: 'total'
            }}
            option={{
              schema: {
                name: 'core/t/orderCalculation/d'
              }
            }}
            tableData={orderData}
          />
        </div>
      </div>
    </div>
  )
}
```

### 库存预警显示

根据当前库存显示库存预警信息。

```tsx
function InventoryWarning() {
  const [inventoryData, setInventoryData] = useState({
    productId: 'prod001',
    currentStock: 50,
    minStock: 10
  })

  return (
    <div className="space-y-4">
      <FormReference
        schema={{
          key: 'warningLevel',
          searchRelate: {
            field: {
              key: 'level',
              fieldSchema: {
                type: 'select',
                options: [
                  { value: 'normal', label: '正常' },
                  { value: 'low', label: '偏低' },
                  { value: 'critical', label: '紧急' }
                ]
              }
            }
          }
        }}
        field={{
          key: 'level'
        }}
        option={{
          schema: {
            name: 'core/t/inventoryCheck/d'
          }
        }}
        tableData={inventoryData}
      />
    </div>
  )
}
```

### 统计数据展示

在表格中显示计算后的统计数据。

```tsx
function StatisticsTable() {
  const [data] = useState([
    {
      id: '1',
      sales: 10000,
      cost: 6000
    },
    {
      id: '2',
      sales: 15000,
      cost: 9000
    }
  ])

  return (
    <table className="w-full">
      <thead>
        <tr>
          <th className="border p-2">ID</th>
          <th className="border p-2">销售额</th>
          <th className="border p-2">成本</th>
          <th className="border p-2">利润率</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            <td className="border p-2">{row.id}</td>
            <td className="border p-2">{row.sales}</td>
            <td className="border p-2">{row.cost}</td>
            <td className="border p-2">
              <FormReference
                schema={{
                  key: 'profitRate',
                  numberFormat: '0.00%'
                }}
                field={{
                  key: 'rate'
                }}
                option={{
                  schema: {
                    name: 'core/t/profitCalculation/d'
                  }
                }}
                tableData={row}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

## 注意事项

1. **API 依赖**：组件依赖 `@airiot/client` 的 `createAPI` 方法创建 API 实例，确保已正确配置和初始化。

2. **表名格式**：`option.schema.name` 必须遵循特定格式 `core/t/{tableId}/d`，组件会从这个格式中提取 tableId。

3. **防抖延迟**：组件使用 800ms 的防抖延迟，这意味着在 tableData 变化后，最多延迟 800ms 才会调用 API，避免频繁请求。

4. **字段优先级**：显示字段时，`field.key` 的优先级高于 `schema.key`，确保使用正确的字段键名。

5. **空值处理**：如果 API 返回空值或计算失败，组件不会显示任何内容，不会抛出错误。

6. **计算记录 API**：组件使用固定的计算记录 API 资源：`computerecord/computerecord/search`，确保后端已实现此接口。

7. **请求方式**：API 请求使用 POST 方法，请求体包含 tableId 和 data 字段，确保后端接口能够正确处理。

8. **字段格式化**：组件使用 `fieldRender` 工具函数格式化显示值，确保已导入 `@/registry/lib/form-relate-utils` 中的此函数。

9. **性能考虑**：由于涉及网络请求，组件显示可能有延迟，建议配合加载状态使用（组件已内置加载动画）。

10. **错误处理**：组件捕获 API 调用错误并在控制台输出，不会在页面上显示错误信息，确保页面稳定性。
