> **安装命令**: `npx shadcn@latest add @kesi/view-advanced-filter`

# ViewAdvancedFilter 高级筛选组件

## 简介

`ViewAdvancedFilter` 是一个功能强大的高级筛选组件，支持多条件组合查询和灵活的规则配置。

- **多条件组合**：支持 AND/OR 逻辑组合多个筛选规则，实现复杂查询需求
- **多种字段类型**：支持文本、数字、选择、日期、日期范围等多种数据类型
- **丰富操作符**：提供包含、等于、大于、小于、介于等多种比较操作符
- **动态规则管理**：可动态添加、删除和修改筛选规则，灵活适应不同场景
- **QueryEditor 集成**：内置 QueryEditor 组件，提供可视化查询构建界面

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `modelId` | `string` | 否 | - | 模型标识符，用于自动加载字段定义 |
| `fields` | `FilterField[]` | 否 | - | 筛选字段定义数组 |
| `maxRules` | `number` | 否 | `10` | 允许添加的最大筛选规则数量 |
| `collapsible` | `boolean` | 否 | `true` | 是否启用折叠功能 |
| `defaultCollapsed` | `boolean` | 否 | `false` | 默认是否折叠状态 |
| `showFieldSelector` | `boolean` | 否 | `true` | 是否显示字段选择下拉框 |
| `className` | `string` | 否 | - | 自定义样式类名 |
| `onFilterChange` | `(rules: FilterRule[], logicOperator: LogicOperator) => void` | 否 | - | 筛选规则变化时的回调函数 |

### FilterField 接口

筛选字段定义接口：

```typescript
interface FilterField {
  name: string                              // 字段名称
  label: string                             // 字段显示标签
  type: 'text' | 'number' | 'select' | 'date' | 'date-range'  // 字段类型
  options?: { value: string; label: string }[]  // 选项（仅 select 类型）
  placeholder?: string                      // 占位符文本
}
```

### FilterRule 接口

筛选规则接口：

```typescript
interface FilterRule {
  id: string           // 规则唯一标识
  field: string        // 筛选字段名称
  operator: string     // 操作符（eq, gt, lt, contains 等）
  value: any          // 筛选值
  operator2?: string  // 第二个操作符（用于范围查询）
  value2?: any        // 第二个筛选值（用于范围查询）
}
```

### LogicOperator 类型

逻辑操作符类型：`'AND' | 'OR'`

## 基本用法

### 1. 使用自动模型字段

最简单的方式是通过 modelId 自动加载模型的字段定义。

```tsx
import { ViewAdvancedFilter } from '@/components/kesi/view-advanced-filter/view-advanced-filter'

function UserList() {
  return (
    <ViewAdvancedFilter
      modelId="user"
    />
  )
}
```

### 2. 自定义字段定义

手动定义筛选字段，提供更灵活的配置。

```tsx
import { ViewAdvancedFilter } from '@/components/kesi/view-advanced-filter/view-advanced-filter'

function ProductFilter() {
  const fields = [
    { name: 'name', label: '产品名称', type: 'text' as const, placeholder: '请输入产品名称' },
    { name: 'category', label: '分类', type: 'select' as const, options: [
      { value: 'electronics', label: '电子产品' },
      { value: 'clothing', label: '服装' },
      { value: 'food', label: '食品' }
    ]},
    { name: 'price', label: '价格', type: 'number' as const },
    { name: 'createTime', label: '创建时间', type: 'date' as const }
  ]

  return (
    <ViewAdvancedFilter
      fields={fields}
      maxRules={5}
    />
  )
}
```

### 3. 监听筛选变化

通过 onFilterChange 回调获取筛选规则并执行查询。

```tsx
import { ViewAdvancedFilter, FilterRule, LogicOperator } from '@/components/kesi/view-advanced-filter/view-advanced-filter'
import { useSetModelState, useModelGetItems } from '@kesi/client'

function OrderFilter() {
  const setWheres = useSetModelState('wheres')
  const { getItems } = useModelGetItems()

  const handleFilterChange = (rules: FilterRule[], logicOperator: LogicOperator) => {
    // 构建查询条件
    const conditions = rules.map(rule => ({
      field: rule.field,
      operator: rule.operator,
      value: rule.value
    }))

    setWheres({
      logicOperator,
      conditions
    })

    // 执行查询
    getItems()
  }

  return (
    <ViewAdvancedFilter
      modelId="order"
      onFilterChange={handleFilterChange}
    />
  )
}
```

### 4. 限制规则数量

通过 maxRules 属性限制用户可以添加的最大规则数。

```tsx
import { ViewAdvancedFilter } from '@/components/kesi/view-advanced-filter/view-advanced-filter'

function SimpleFilter() {
  return (
    <ViewAdvancedFilter
      modelId="task"
      maxRules={3}
      collapsible={false}
    />
  )
}
```

### 5. 默认折叠状态

设置默认折叠以节省页面空间。

```tsx
import { ViewAdvancedFilter } from '@/components/kesi/view-advanced-filter/view-advanced-filter'

function CompactFilter() {
  return (
    <ViewAdvancedFilter
      modelId="customer"
      defaultCollapsed={true}
      collapsible={true}
    />
  )
}
```

### 6. 隐藏字段选择器

当只有一个字段或固定字段时，可以隐藏字段选择器。

```tsx
import { ViewAdvancedFilter } from '@/components/kesi/view-advanced-filter/view-advanced-filter'

function SingleFieldFilter() {
  const fields = [
    { name: 'keyword', label: '关键词', type: 'text' as const }
  ]

  return (
    <ViewAdvancedFilter
      fields={fields}
      showFieldSelector={false}
      maxRules={5}
    />
  )
}
```

### 7. 日期范围筛选

使用 date-range 类型进行日期范围查询。

```tsx
import { ViewAdvancedFilter } from '@/components/kesi/view-advanced-filter/view-advanced-filter'

function DateRangeFilter() {
  const fields = [
    { name: 'createTime', label: '创建时间', type: 'date-range' as const },
    { name: 'updateTime', label: '更新时间', type: 'date-range' as const }
  ]

  return (
    <ViewAdvancedFilter
      fields={fields}
      maxRules={3}
    />
  )
}
```

## 完整示例

### 用户管理高级筛选

完整的用户管理筛选功能，包含多种字段类型和查询逻辑。

```tsx
import { ViewAdvancedFilter, FilterField } from '@/components/kesi/view-advanced-filter/view-advanced-filter'
import { useSetModelState, useModelGetItems } from '@kesi/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

function UserAdvancedFilter() {
  const setWheres = useSetModelState('wheres')
  const { getItems } = useModelGetItems()

  const userFields: FilterField[] = [
    {
      name: 'username',
      label: '用户名',
      type: 'text',
      placeholder: '请输入用户名'
    },
    {
      name: 'email',
      label: '邮箱',
      type: 'text',
      placeholder: '请输入邮箱地址'
    },
    {
      name: 'status',
      label: '状态',
      type: 'select',
      options: [
        { value: 'active', label: '激活' },
        { value: 'inactive', label: '未激活' },
        { value: 'suspended', label: '已冻结' }
      ]
    },
    {
      name: 'role',
      label: '角色',
      type: 'select',
      options: [
        { value: 'admin', label: '管理员' },
        { value: 'user', label: '普通用户' },
        { value: 'guest', label: '访客' }
      ]
    },
    {
      name: 'age',
      label: '年龄',
      type: 'number'
    },
    {
      name: 'registerDate',
      label: '注册日期',
      type: 'date'
    }
  ]

  const handleFilterChange = (rules: any[], logicOperator: 'AND' | 'OR') => {
    console.log('筛选规则:', rules)
    console.log('逻辑操作符:', logicOperator)

    // 将筛选规则转换为查询条件
    const conditions = rules.map(rule => {
      if (rule.operator === 'between') {
        return {
          field: rule.field,
          operator: 'between',
          value: [rule.value, rule.value2]
        }
      }
      return {
        field: rule.field,
        operator: rule.operator,
        value: rule.value
      }
    })

    setWheres({
      logicOperator,
      conditions
    })

    getItems()
  }

  const handleReset = () => {
    setWheres({})
    getItems()
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">高级筛选</h3>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            重置筛选
          </Button>
        </div>

        <ViewAdvancedFilter
          fields={userFields}
          maxRules={8}
          collapsible={true}
          defaultCollapsed={false}
          onFilterChange={handleFilterChange}
        />
      </CardContent>
    </Card>
  )
}
```

### 订单查询系统

订单管理系统中的复杂筛选功能。

```tsx
import { ViewAdvancedFilter } from '@/components/kesi/view-advanced-filter/view-advanced-filter'
import { useSetModelState, useModelGetItems } from '@kesi/client'
import { Badge } from '@/components/ui/badge'

function OrderQuerySystem() {
  const setWheres = useSetModelState('wheres')
  const { getItems } = useModelGetItems()

  const orderFields = [
    {
      name: 'orderNo',
      label: '订单号',
      type: 'text' as const,
      placeholder: '请输入订单号'
    },
    {
      name: 'customerName',
      label: '客户名称',
      type: 'text' as const,
      placeholder: '请输入客户名称'
    },
    {
      name: 'status',
      label: '订单状态',
      type: 'select' as const,
      options: [
        { value: 'pending', label: '待处理' },
        { value: 'processing', label: '处理中' },
        { value: 'shipped', label: '已发货' },
        { value: 'delivered', label: '已送达' },
        { value: 'cancelled', label: '已取消' }
      ]
    },
    {
      name: 'totalAmount',
      label: '订单金额',
      type: 'number' as const
    },
    {
      name: 'paymentMethod',
      label: '支付方式',
      type: 'select' as const,
      options: [
        { value: 'credit_card', label: '信用卡' },
        { value: 'paypal', label: 'PayPal' },
        { value: 'bank_transfer', label: '银行转账' }
      ]
    },
    {
      name: 'createDate',
      label: '创建日期',
      type: 'date-range' as const
    }
  ]

  const handleFilterChange = (rules: any[], logicOperator: 'AND' | 'OR') => {
    // 处理日期范围
    const processedRules = rules.map(rule => {
      if (rule.operator === 'between' && rule.value && rule.value2) {
        return {
          field: rule.field,
          operator: 'between',
          value: [rule.value, rule.value2]
        }
      }
      return rule
    })

    setWheres({
      logicOperator,
      conditions: processedRules
    })

    getItems()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold">订单管理</h2>
        <Badge variant="secondary">高级筛选</Badge>
      </div>

      <ViewAdvancedFilter
        fields={orderFields}
        maxRules={10}
        collapsible={false}
        onFilterChange={handleFilterChange}
      />
    </div>
  )
}
```

## 注意事项

1. **ViewModel 上下文依赖**：组件需要在 ViewModel 提供的上下文中使用，否则无法获取模型和执行查询

2. **字段定义优先级**：如果同时提供了 modelId 和 fields，fields 的优先级更高

3. **操作符适配**：不同的字段类型支持不同的操作符，系统会根据字段类型自动显示可用的操作符

4. **日期范围查询**：使用 date-range 类型时，会自动显示两个日期输入框用于范围选择

5. **性能考虑**：maxRules 不宜设置过大，建议控制在 10-20 条以内以避免性能问题

6. **规则验证**：添加规则前会验证字段和操作符的有效性，无效的规则会被忽略

7. **条件构建**：onFilterChange 回调中需要自行构建符合后端 API 要求的查询条件格式

8. **状态同步**：使用 setWheres 更新筛选条件后，需要手动调用 getItems() 触发数据刷新

9. **折叠功能**：当 collapsible 为 false 时，defaultCollapsed 设置将被忽略

10. **字段选择器**：隐藏字段选择器时，用户仍可以通过规则编辑界面修改字段
