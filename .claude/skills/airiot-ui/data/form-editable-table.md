# Form.EditableTable 可编辑表格

## 简介

`FormEditableTable` 是一个功能强大的可编辑表格组件，支持动态添加、删除和编辑表格行数据。

- **动态编辑**：支持动态添加和删除表格行
- **多种显示模式**：支持表格和卡片两种显示方式
- **灵活配置**：可配置最小/最大行数、字段类型、权限控制等
- **批量操作**：支持多选和批量删除功能
- **字段丰富**：支持多种字段类型（文本、数字、附件、关联等）
- **权限控制**：支持按钮级别的权限控制
- **卡片布局**：支持1/2/3列的卡片布局切换

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `input` | `object` | 否 | - | 输入对象，包含 value 和 onChange |
| `input.value` | `any[]` | 否 | `[]` | 表格数据数组 |
| `input.onChange` | `(value: any[] \| null) => void` | 否 | - | 值变化回调函数 |
| `input.name` | `string` | 否 | - | 字段名称 |
| `schema` | `object` | 否 | - | 表格配置对象 |
| `schema.key` | `string` | 否 | - | 表格的唯一标识 |
| `schema.disabled` | `boolean` | 否 | `false` | 是否禁用整个表格 |
| `schema.minCount` | `number` | 否 | `0` | 最小行数限制 |
| `schema.maxCount` | `number` | 否 | `100` | 最大行数限制 |
| `schema.forms` | `object` | 否 | - | 表单字段配置 |
| `schema.forms.form` | `string[]` | 否 | - | 字段key数组 |
| `schema.forms.properties` | `object` | 否 | - | 字段配置对象 |
| `schema.defaultVal` | `any[]` | 否 | - | 默认值数组 |
| `schema.displayForm` | `'grid' \| 'card'` | 否 | `'grid'` | 显示方式 |
| `schema.uniqueFields` | `string[]` | 否 | - | 唯一字段数组 |
| `schema.uniqueRow` | `boolean` | 否 | `false` | 行是否唯一 |
| `schema.showPagination` | `boolean` | 否 | - | 是否显示分页 |
| `schema.btnText` | `object` | 否 | - | 按钮文本配置 |
| `schema.createAddBtn` | `object` | 否 | - | 新增模式添加按钮权限 |
| `schema.editAddBtn` | `object` | 否 | - | 编辑模式添加按钮权限 |
| `schema.createDelBtn` | `object` | 否 | - | 新增模式删除按钮权限 |
| `schema.editDelBtn` | `object` | 否 | - | 编辑模式删除按钮权限 |
| `schema.cardLayout` | `'1' \| '2' \| '3'` | 否 | `'3'` | 卡片布局列数 |
| `batchOption` | `boolean` | 否 | `false` | 是否启用批量操作 |
| `inline` | `boolean` | 否 | `false` | 是否内联显示 |
| `meta` | `object` | 否 | - | 元数据对象 |
| `record` | `any` | 否 | - | 记录数据对象 |
| `antdForm` | `any` | 否 | - | Ant Design 表单实例 |

### schema.forms.properties 结构

每个字段的配置对象：

```tsx
{
  key: string,              // 字段key
  title: string,            // 字段标题
  type: string,             // 字段类型
  fieldType: string,        // 字段子类型
  need: boolean,            // 是否必填
  width?: number            // 列宽
}
```

### 按钮权限配置对象

```tsx
{
  show: boolean,            // 是否显示
  userRange: string,        // 用户范围
  users: any[],            // 用户列表
  roles: any[]             // 角色列表
}
```

## 基本用法

### 1. 基础可编辑表格

最简单的用法，提供基础的表格编辑功能。

```tsx
import { FormEditableTable } from '@/components/kesi/form-editable-table/form-editable-table'
import { useState } from 'react'

function Example() {
  const [data, setData] = useState([
    { key: 1, field1: '值1', field2: 100 }
  ])

  return (
    <FormEditableTable
      input={{
        value: data,
        onChange: setData
      }}
      schema={{
        forms: {
          form: ['field1', 'field2'],
          properties: {
            field1: {
              key: 'field1',
              title: '字段1',
              type: 'string',
              fieldType: 'input'
            },
            field2: {
              key: 'field2',
              title: '字段2',
              type: 'number',
              fieldType: 'inputNumber'
            }
          }
        }
      }}
    />
  )
}
```

### 2. 设置行数限制

配置最小和最大行数限制。

```tsx
function Example() {
  const [data, setData] = useState([
    { key: 1, field1: '值1' }
  ])

  return (
    <FormEditableTable
      input={{
        value: data,
        onChange: setData
      }}
      schema={{
        minCount: 1,      // 至少保留1行
        maxCount: 5,      // 最多5行
        forms: {
          form: ['field1'],
          properties: {
            field1: {
              key: 'field1',
              title: '字段1',
              type: 'string',
              fieldType: 'input'
            }
          }
        }
      }}
    />
  )
}
```

### 3. 使用卡片显示模式

切换到卡片布局显示数据。

```tsx
function Example() {
  const [data, setData] = useState([
    { key: 1, field1: '值1', field2: 100 }
  ])

  return (
    <FormEditableTable
      input={{
        value: data,
        onChange: setData
      }}
      schema={{
        displayForm: 'card',    // 使用卡片模式
        cardLayout: '2',         // 2列布局
        forms: {
          form: ['field1', 'field2'],
          properties: {
            field1: {
              key: 'field1',
              title: '字段1',
              type: 'string',
              fieldType: 'input'
            },
            field2: {
              key: 'field2',
              title: '字段2',
              type: 'number',
              fieldType: 'inputNumber'
            }
          }
        }
      }}
    />
  )
}
```

### 4. 禁用表格

设置表格为禁用状态，禁止编辑。

```tsx
function Example() {
  const [data] = useState([
    { key: 1, field1: '值1' }
  ])

  return (
    <FormEditableTable
      input={{
        value: data,
        onChange: () => {}
      }}
      schema={{
        disabled: true,  // 禁用表格
        forms: {
          form: ['field1'],
          properties: {
            field1: {
              key: 'field1',
              title: '字段1',
              type: 'string',
              fieldType: 'input'
            }
          }
        }
      }}
    />
  )
}
```

### 5. 自定义按钮文本

配置添加和删除按钮的文本。

```tsx
function Example() {
  const [data, setData] = useState([])

  return (
    <FormEditableTable
      input={{
        value: data,
        onChange: setData
      }}
      schema={{
        btnText: {
          add: '新增数据行',
          delete: '删除选中'
        },
        forms: {
          form: ['field1'],
          properties: {
            field1: {
              key: 'field1',
              title: '字段1',
              type: 'string',
              fieldType: 'input'
            }
          }
        }
      }}
    />
  )
}
```

### 6. 启用批量删除

允许用户多选并批量删除行。

```tsx
function Example() {
  const [data, setData] = useState([
    { key: 1, field1: '值1' },
    { key: 2, field1: '值2' }
  ])

  return (
    <FormEditableTable
      input={{
        value: data,
        onChange: setData
      }}
      schema={{
        forms: {
          form: ['field1'],
          properties: {
            field1: {
              key: 'field1',
              title: '字段1',
              type: 'string',
              fieldType: 'input'
            }
          }
        }
      }}
      batchOption  // 启用批量操作
    />
  )
}
```

### 7. 配置必填字段

标记某些字段为必填。

```tsx
function Example() {
  const [data, setData] = useState([
    { key: 1, name: '', age: 0 }
  ])

  return (
    <FormEditableTable
      input={{
        value: data,
        onChange: setData
      }}
      schema={{
        forms: {
          form: ['name', 'age'],
          properties: {
            name: {
              key: 'name',
              title: '姓名',
              type: 'string',
              fieldType: 'input',
              need: true  // 必填字段
            },
            age: {
              key: 'age',
              title: '年龄',
              type: 'number',
              fieldType: 'inputNumber',
              need: false
            }
          }
        }
      }}
    />
  )
}
```

## 完整示例

### 员工信息管理表格

创建一个完整的员工信息管理系统，支持多种字段类型。

```tsx
import { FormEditableTable } from '@/components/kesi/form-editable-table/form-editable-table'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Employee {
  key: number
  name: string
  department: string
  position: string
  salary: number
  email: string
}

function EmployeeManager() {
  const [employees, setEmployees] = useState<Employee[]>([
    { key: 1, name: '张三', department: '技术部', position: '工程师', salary: 8000, email: 'zhangsan@example.com' }
  ])

  const handleAddEmployee = () => {
    const newEmployee: Employee = {
      key: Date.now(),
      name: '',
      department: '',
      position: '',
      salary: 0,
      email: ''
    }
    setEmployees([...employees, newEmployee])
  }

  const handleExport = () => {
    console.log('导出数据:', employees)
    alert(`导出 ${employees.length} 条员工数据`)
  }

  return (
    <div className="space-y-6 p-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">员工信息管理</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              导出数据
            </Button>
            <Button onClick={handleAddEmployee}>
              添加员工
            </Button>
          </div>
        </div>

        <FormEditableTable
          input={{
            value: employees,
            onChange: setEmployees
          }}
          schema={{
            key: 'employee-table',
            minCount: 0,
            maxCount: 50,
            displayForm: 'grid',
            cardLayout: '3',
            btnText: {
              add: '添加员工',
              delete: '删除选中'
            },
            forms: {
              form: ['name', 'department', 'position', 'salary', 'email'],
              properties: {
                name: {
                  key: 'name',
                  title: '姓名',
                  type: 'string',
                  fieldType: 'input',
                  need: true
                },
                department: {
                  key: 'department',
                  title: '部门',
                  type: 'string',
                  fieldType: 'input',
                  need: true
                },
                position: {
                  key: 'position',
                  title: '职位',
                  type: 'string',
                  fieldType: 'input'
                },
                salary: {
                  key: 'salary',
                  title: '薪资',
                  type: 'number',
                  fieldType: 'inputNumber'
                },
                email: {
                  key: 'email',
                  title: '邮箱',
                  type: 'string',
                  fieldType: 'input'
                }
              }
            }
          }}
          batchOption
        />

        <div className="mt-4 text-sm text-muted-foreground">
          共 {employees.length} 条记录
        </div>
      </Card>
    </div>
  )
}
```

### 产品库存管理系统

创建一个产品库存管理界面，使用卡片布局显示。

```tsx
import { FormEditableTable } from '@/components/kesi/form-editable-table/form-editable-table'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Product {
  key: number
  productName: string
  category: string
  price: number
  stock: number
  sku: string
}

function InventoryManager() {
  const [products, setProducts] = useState<Product[]>([
    { key: 1, productName: '笔记本电脑', category: '电子产品', price: 5999, stock: 50, sku: 'LAPTOP-001' }
  ])

  const calculateTotalValue = () => {
    return products.reduce((total, product) => total + (product.price * product.stock), 0)
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: '缺货', variant: 'destructive' as const }
    if (stock < 10) return { label: '库存紧张', variant: 'default' as const }
    return { label: '库存充足', variant: 'secondary' as const }
  }

  return (
    <div className="space-y-6 p-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">产品库存管理</h2>
          <Badge variant="outline" className="text-lg px-4 py-2">
            总价值: ¥{calculateTotalValue().toLocaleString()}
          </Badge>
        </div>

        <FormEditableTable
          input={{
            value: products,
            onChange: setProducts
          }}
          schema={{
            key: 'inventory-table',
            minCount: 1,
            maxCount: 100,
            displayForm: 'card',   // 使用卡片模式
            cardLayout: '3',       // 3列布局
            btnText: {
              add: '添加产品',
              delete: '删除选中'
            },
            forms: {
              form: ['productName', 'category', 'price', 'stock', 'sku'],
              properties: {
                productName: {
                  key: 'productName',
                  title: '产品名称',
                  type: 'string',
                  fieldType: 'input',
                  need: true
                },
                category: {
                  key: 'category',
                  title: '分类',
                  type: 'string',
                  fieldType: 'input',
                  need: true
                },
                price: {
                  key: 'price',
                  title: '单价',
                  type: 'number',
                  fieldType: 'inputNumber',
                  need: true
                },
                stock: {
                  key: 'stock',
                  title: '库存数量',
                  type: 'number',
                  fieldType: 'inputNumber',
                  need: true
                },
                sku: {
                  key: 'sku',
                  title: 'SKU编码',
                  type: 'string',
                  fieldType: 'input'
                }
              }
            }
          }}
        />

        <div className="mt-6 grid grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">产品总数</div>
            <div className="text-2xl font-bold">{products.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">库存总量</div>
            <div className="text-2xl font-bold">
              {products.reduce((sum, p) => sum + p.stock, 0)}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">库存总值</div>
            <div className="text-2xl font-bold">
              ¥{calculateTotalValue().toLocaleString()}
            </div>
          </Card>
        </div>
      </Card>
    </div>
  )
}
```

### 采购订单明细表

创建一个采购订单明细管理，支持行数限制和验证。

```tsx
import { FormEditableTable } from '@/components/kesi/form-editable-table/form-editable-table'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface OrderItem {
  key: number
  productCode: string
  productName: string
  quantity: number
  unitPrice: number
  totalAmount: number
}

function PurchaseOrderForm() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { key: 1, productCode: 'P001', productName: '产品A', quantity: 10, unitPrice: 100, totalAmount: 1000 }
  ])

  const calculateOrderTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  }

  const handleSubmit = () => {
    if (orderItems.length === 0) {
      alert('请至少添加一个订单项')
      return
    }

    const hasInvalidItem = orderItems.some(item =>
      !item.productCode || !item.productName || item.quantity <= 0 || item.unitPrice <= 0
    )

    if (hasInvalidItem) {
      alert('请完善所有必填信息')
      return
    }

    console.log('提交订单:', orderItems)
    alert('订单提交成功！总金额: ¥' + calculateOrderTotal())
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-6">采购订单明细</h2>

          <FormEditableTable
            input={{
              value: orderItems,
              onChange: setOrderItems
            }}
            schema={{
              key: 'order-items-table',
              minCount: 1,      // 至少1行
              maxCount: 20,     // 最多20行
              displayForm: 'grid',
              btnText: {
                add: '添加订单项',
                delete: '删除选中'
              },
              forms: {
                form: ['productCode', 'productName', 'quantity', 'unitPrice', 'totalAmount'],
                properties: {
                  productCode: {
                    key: 'productCode',
                    title: '产品编码',
                    type: 'string',
                    fieldType: 'input',
                    need: true
                  },
                  productName: {
                    key: 'productName',
                    title: '产品名称',
                    type: 'string',
                    fieldType: 'input',
                    need: true
                  },
                  quantity: {
                    key: 'quantity',
                    title: '数量',
                    type: 'number',
                    fieldType: 'inputNumber',
                    need: true
                  },
                  unitPrice: {
                    key: 'unitPrice',
                    title: '单价',
                    type: 'number',
                    fieldType: 'inputNumber',
                    need: true
                  },
                  totalAmount: {
                    key: 'totalAmount',
                    title: '金额',
                    type: 'number',
                    fieldType: 'inputNumber'
                  }
                }
              }
            }}
            batchOption
          />

          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded">
              <span className="text-lg font-medium">订单总额:</span>
              <span className="text-2xl font-bold text-blue-600">
                ¥{calculateOrderTotal().toLocaleString()}
              </span>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmit} className="flex-1">
                提交订单
              </Button>
              <Button
                variant="outline"
                onClick={() => setOrderItems([])}
                className="flex-1"
              >
                清空明细
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

## 注意事项

1. **key 唯一性**：确保每行数据的 `key` 值唯一，通常使用 `Date.now()` 或递增 ID。

2. **行数限制**：`minCount` 和 `maxCount` 限制表格的行数，删除时会自动检查最小行数。

3. **空值处理**：当 `onChange` 传入空数组或 `null` 时，表格会显示为空。

4. **字段配置**：`forms.form` 和 `forms.properties` 必须对应，确保所有字段都在 properties 中定义。

5. **必填验证**：`need: true` 标记必填字段，会在标题旁显示红色星号。

6. **卡片布局**：`cardLayout` 只在 `displayForm: 'card'` 时生效，支持 1/2/3 列布局。

7. **批量删除**：批量删除只在表格模式下可用，卡片模式不支持。

8. **性能优化**：对于大数据量表格，建议设置合理的 `maxCount` 并使用分页。

9. **权限控制**：按钮权限配置需要后端配合，前端只控制显示状态。

10. **数据同步**：修改数据后立即调用 `onChange`，确保外部状态同步更新。

11. **列宽配置**：附件类型字段建议设置更大的列宽（270px），其他字段默认 200px。

12. **禁用状态**：`schema.disabled` 会禁用整个表格，包括添加和删除操作。

13. **唯一性验证**：如需验证字段唯一性，需在外层逻辑中实现。

14. **字段类型**：确保 `fieldType` 与对应的组件类型匹配，否则无法正确渲染。
