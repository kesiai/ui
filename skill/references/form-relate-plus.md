> **安装命令**: `npx shadcn@latest add @kesi/form-relate-plus`

# Form.RelatePlus 关联字段Plus

## 简介

`FormRelatePlus` 是增强版的关联字段组件，支持更多选择方式和显示模式，适用于复杂的数据关联场景。

- **多种选择方式**：支持下拉选择和弹窗选择两种方式
- **多种显示模式**：支持选择器、卡片和表格三种显示模式
- **单选/多选**：灵活支持单选和多选
- **快速新增**：支持直接新增关联记录
- **丰富展示**：可配置显示字段，展示更丰富的信息

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `relateSchema` | `object` | 是 | - | 关联配置对象 |
| `relateSchema.relateTo` | `string` | 否 | - | 关联到的表名 |
| `relateSchema.relate` | `object` | 否 | - | 关联配置 |
| `relateSchema.relate.id` | `string` | 否 | - | 关联表ID |
| `relateSchema.recordSelectType` | `'select' \| 'modal'` | 否 | `'select'` | 选择方式 |
| `relateSchema.selectType` | `'single' \| 'multiple'` | 否 | `'single'` | 选择类型 |
| `relateSchema.showType` | `'select' \| 'card' \| 'table'` | 否 | `'select'` | 显示方式 |
| `relateSchema.showField` | `string` | 否 | - | 显示字段 |
| `relateSchema.allowAdd` | `boolean` | 否 | `false` | 是否允许新增 |
| `relateSchema.editDisabled` | `boolean` | 否 | `false` | 编辑时禁用 |
| `relateSchema.createDisabled` | `boolean` | 否 | `false` | 创建时禁用 |
| `relateSchema.relateShowFields` | `array` | 否 | - | 关联显示字段配置 |
| `tableID` | `string` | 否 | - | 表ID |
| `input` | `object` | 否 | - | 输入对象 |
| `input.value` | `any` | 否 | - | 当前值 |
| `input.onChange` | `(value: any) => void` | 否 | - | 值变化回调 |
| `field` | `object` | 否 | - | 字段配置 |
| `field.schema` | `object` | 否 | - | 字段schema |
| `field.displayField` | `string` | 否 | - | 显示字段key |
| `field.relateShowFields` | `array` | 否 | - | 显示字段配置 |
| `meta` | `object` | 否 | - | 元数据 |
| `schema` | `object` | 否 | - | schema配置 |

## 基本用法

### 1. 基础下拉选择

最简单的用法，使用下拉选择模式。

```tsx
import { FormRelatePlus } from '@/components/kesi/form-relate-plus/form-relate-plus'
import { useState } from 'react'

function Example() {
  const [value, setValue] = useState(null)

  const relateSchema = {
    relate: {
      id: 'product-table'
    },
    recordSelectType: 'select' as const,
    selectType: 'single' as const,
    showType: 'select' as const
  }

  return (
    <FormRelatePlus
      relateSchema={relateSchema}
      tableID="product-table"
      input={{
        value,
        onChange: setValue
      }}
      field={{
        schema: relateSchema,
        displayField: 'name'
      }}
    />
  )
}
```

### 2. 弹窗选择模式

使用弹窗方式进行选择。

```tsx
function Example() {
  const [value, setValue] = useState(null)

  const relateSchema = {
    relate: {
      id: 'user-table'
    },
    recordSelectType: 'modal' as const,  // 使用弹窗
    selectType: 'single' as const,
    showType: 'select' as const
  }

  return (
    <FormRelatePlus
      relateSchema={relateSchema}
      tableID="user-table"
      input={{
        value,
        onChange: setValue
      }}
      field={{
        schema: relateSchema,
        displayField: 'username'
      }}
    />
  )
}
```

### 3. 多选模式

配置为多选模式。

```tsx
function Example() {
  const [value, setValue] = useState([])

  const relateSchema = {
    relate: {
      id: 'tag-table'
    },
    recordSelectType: 'select' as const,
    selectType: 'multiple' as const,  // 多选
    showType: 'select' as const
  }

  return (
    <FormRelatePlus
      relateSchema={relateSchema}
      tableID="tag-table"
      input={{
        value,
        onChange: setValue
      }}
      field={{
        schema: relateSchema,
        displayField: 'name'
      }}
    />
  )
}
```

### 4. 卡片显示模式

使用卡片方式显示已选项。

```tsx
function Example() {
  const [value, setValue] = useState(null)

  const relateSchema = {
    relate: {
      id: 'product-table'
    },
    recordSelectType: 'select' as const,
    selectType: 'single' as const,
    showType: 'card' as const,  // 卡片显示
    relateShowFields: [
      { key: 'name', title: '产品名称' },
      { key: 'price', title: '价格' },
      { key: 'stock', title: '库存' }
    ]
  }

  return (
    <FormRelatePlus
      relateSchema={relateSchema}
      tableID="product-table"
      input={{
        value,
        onChange: setValue
      }}
      field={{
        schema: relateSchema,
        displayField: 'name',
        relateShowFields: relateSchema.relateShowFields
      }}
    />
  )
}
```

### 5. 表格显示模式

使用表格方式显示已选项。

```tsx
function Example() {
  const [value, setValue] = useState([])

  const relateSchema = {
    relate: {
      id: 'order-table'
    },
    recordSelectType: 'modal' as const,
    selectType: 'multiple' as const,
    showType: 'table' as const,  // 表格显示
    relateShowFields: [
      { key: 'orderNo', title: '订单号' },
      { key: 'amount', title: '金额' },
      { key: 'status', title: '状态' }
    ]
  }

  return (
    <FormRelatePlus
      relateSchema={relateSchema}
      tableID="order-table"
      input={{
        value,
        onChange: setValue
      }}
      field={{
        schema: relateSchema,
        displayField: 'orderNo'
      }}
    />
  )
}
```

### 6. 允许新增记录

配置允许快速新增关联记录。

```tsx
function Example() {
  const [value, setValue] = useState(null)

  const relateSchema = {
    relate: {
      id: 'category-table'
    },
    recordSelectType: 'select' as const,
    selectType: 'single' as const,
    showType: 'select' as const,
    allowAdd: true  // 允许新增
  }

  return (
    <FormRelatePlus
      relateSchema={relateSchema}
      tableID="category-table"
      input={{
        value,
        onChange: setValue
      }}
      field={{
        schema: relateSchema,
        displayField: 'name'
      }}
    />
  )
}
```

### 7. 禁用状态

根据操作类型设置禁用。

```tsx
function Example() {
  const [value] = useState(null)
  const [isEditMode] = useState(true)

  const relateSchema = {
    relate: {
      id: 'product-table'
    },
    recordSelectType: 'select' as const,
    selectType: 'single' as const,
    showType: 'select' as const,
    editDisabled: isEditMode,  // 编辑时禁用
    createDisabled: !isEditMode  // 创建时禁用
  }

  return (
    <FormRelatePlus
      relateSchema={relateSchema}
      tableID="product-table"
      input={{
        value,
        onChange: () => {}
      }}
      field={{
        schema: relateSchema,
        displayField: 'name'
      }}
    />
  )
}
```

## 完整示例

### 产品关联选择器

创建一个完整的产品关联选择器，支持多种显示模式。

```tsx
import { FormRelatePlus } from '@/components/kesi/form-relate-plus/form-relate-plus'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function ProductRelateSelector() {
  const [selectedProducts, setSelectedProducts] = useState([])
  const [showType, setShowType] = useState('select')

  const relateSchema = {
    relate: {
      id: 'product-table',
      fields: [
        {
          key: 'name',
          title: '产品名称',
          fieldSchema: {
            type: 'string',
            fieldType: 'input'
          }
        },
        {
          key: 'price',
          title: '价格',
          fieldSchema: {
            type: 'number',
            fieldType: 'inputNumber'
          }
        },
        {
          key: 'stock',
          title: '库存',
          fieldSchema: {
            type: 'number',
            fieldType: 'inputNumber'
          }
        }
      ]
    },
    recordSelectType: 'modal' as const,
    selectType: 'multiple' as const,
    showType: showType as 'select' | 'card' | 'table',
    allowAdd: true,
    relateShowFields: [
      { key: 'name', title: '产品名称' },
      { key: 'price', title: '价格' },
      { key: 'stock', title: '库存' }
    ]
  }

  const handleSave = () => {
    console.log('已选择的产品:', selectedProducts)
    alert(`已保存 ${selectedProducts.length} 个产品`)
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">产品关联选择</h2>

      <Tabs value={showType} onValueChange={setShowType} className="mb-6">
        <TabsList>
          <TabsTrigger value="select">选择器模式</TabsTrigger>
          <TabsTrigger value="card">卡片模式</TabsTrigger>
          <TabsTrigger value="table">表格模式</TabsTrigger>
        </TabsList>

        <TabsContent value={showType} className="mt-4">
          <FormRelatePlus
            relateSchema={relateSchema}
            tableID="product-table"
            input={{
              value: selectedProducts,
              onChange: setSelectedProducts
            }}
            field={{
              schema: relateSchema,
              displayField: 'name',
              relateShowFields: relateSchema.relateShowFields
            }}
            schema={{
              name: '产品关联'
            }}
          />
        </TabsContent>
      </Tabs>

      {selectedProducts.length > 0 && (
        <div className="mt-6 p-4 bg-slate-50 rounded">
          <h3 className="font-medium mb-2">已选择 {selectedProducts.length} 个产品</h3>
          <div className="text-sm text-muted-foreground">
            {selectedProducts.map((product: any, index: number) => (
              <div key={index} className="py-1">
                {product.name || product.id}
              </div>
            ))}
          </div>
        </div>
      )}

      <Button onClick={handleSave} className="mt-6">
        保存选择
      </Button>
    </Card>
  )
}
```

### 用户团队关联管理

创建用户团队关联管理界面。

```tsx
import { FormRelatePlus } from '@/components/kesi/form-relate-plus/form-relate-plus'
import { useState } from 'react'
import { Card } from '@/components/ui/card'

function UserTeamManager() {
  const [teamMembers, setTeamMembers] = useState([])
  const [teamLead, setTeamLead] = useState(null)

  const memberRelateSchema = {
    relate: {
      id: 'user-table'
    },
    recordSelectType: 'modal' as const,
    selectType: 'multiple' as const,
    showType: 'table' as const,
    relateShowFields: [
      { key: 'username', title: '用户名' },
      { key: 'email', title: '邮箱' },
      { key: 'role', title: '角色' }
    ]
  }

  const leadRelateSchema = {
    relate: {
      id: 'user-table'
    },
    recordSelectType: 'select' as const,
    selectType: 'single' as const,
    showType: 'card' as const,
    relateShowFields: [
      { key: 'username', title: '用户名' },
      { key: 'department', title: '部门' }
    ]
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">团队设置</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">团队负责人</h3>
          <FormRelatePlus
            relateSchema={leadRelateSchema}
            tableID="user-table"
            input={{
              value: teamLead,
              onChange: setTeamLead
            }}
            field={{
              schema: leadRelateSchema,
              displayField: 'username'
            }}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">团队成员</h3>
          <FormRelatePlus
            relateSchema={memberRelateSchema}
            tableID="user-table"
            input={{
              value: teamMembers,
              onChange: setTeamMembers
            }}
            field={{
              schema: memberRelateSchema,
              displayField: 'username'
            }}
          />
        </div>

        <div className="p-4 bg-blue-50 rounded">
          <p className="text-sm">
            <strong>团队负责人:</strong> {teamLead?.username || '未设置'}
          </p>
          <p className="text-sm mt-2">
            <strong>团队成员数:</strong> {teamMembers.length}
          </p>
        </div>
      </div>
    </Card>
  )
}
```

## 注意事项

1. **tableID 必需**：必须提供有效的 tableID，指向要关联的表。

2. **recordSelectType 区别**：
   - `select`：下拉选择模式，适合选项较少的场景
   - `modal`：弹窗选择模式，适合选项较多的场景

3. **showType 显示模式**：
   - `select`：紧凑的选择器显示
   - `card`：卡片方式显示，更直观
   - `table`：表格方式显示，适合多选

4. **relateShowFields 配置**：配置要显示的字段数组，每个元素包含 key 和 title。

5. **allowAdd 权限**：设置 allowAdd 需要配合后端权限验证。

6. **值格式**：
   - 单选：值为对象或 null
   - 多选：值为数组

7. **displayField**：指定用于显示的主要字段，通常使用字段的 key。

8. **子组件依赖**：FormRelatePlus 由三个子组件组成：
   - FormRelatePlusDataSelect：数据选择
   - FormRelatePlusAddRecordBtn：新增按钮
   - FormRelatePlusDataShow：数据显示

9. **性能考虑**：对于大数据量，建议使用 `modal` 模式配合分页。

10. **受控组件**：必须通过 input.value 和 input.onChange 管理状态。
