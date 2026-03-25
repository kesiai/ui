### ⚠️ 组合使用说明

> **重要**: view-field 是 视图系统 的子组件，不能单独使用。
>
> 必须配合父组件 view-model 使用。请查看 [视图系统 完整指南](data/view-system.md) 了解正确的使用方法。

# ViewField 字段显示组件

## 简介

`ViewField` 是一个通用的字段显示组件，支持多种数据类型的展示和格式化。

- **30+ 字段类型**：支持文本、数字、日期、选择、地图、附件等 30+ 种字段类型
- **自动渲染**：根据字段类型自动选择最合适的渲染组件
- **灵活配置**：支持标签、描述、选项等多种配置
- **自定义渲染**：支持通过 children 函数完全自定义渲染逻辑
- **统一样式**：使用统一的 Field、FieldLabel、FieldDescription 组件保证样式一致性

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `name` | `string` | 是 | - | 字段名称 |
| `value` | `any` | 是 | - | 字段值 |
| `item` | `any` | 否 | - | 完整的数据对象 |
| `type` | `string` | 否 | `'text'` | 字段类型 |
| `schema` | `object` | 否 | - | 字段 schema 定义 |
| `label` | `ReactNode \| string` | 否 | - | 字段标签 |
| `description` | `ReactNode \| string` | 否 | - | 字段描述 |
| `children` | `ReactNode \| (props: any) => ReactNode` | 否 | - | 自定义渲染内容 |

### 支持的字段类型

#### 基础类型
- `text` - 文本输入
- `textarea` - 多行文本
- `number` - 数字输入
- `password` - 密码输入
- `select` - 下拉选择
- `checkbox` - 复选框
- `radio` - 单选框
- `switch` - 开关
- `slider` - 滑块
- `date` - 日期选择
- `date-range` - 日期范围
- `time` - 时间选择
- `rate` - 评分

#### TableField 高级类型
- `table-text` - 表格字段文本
- `table-textarea` - 表格字段多行文本
- `table-number` - 表格字段数字
- `table-select` - 表格字段下拉选择
- `table-checkbox` - 表格字段复选框
- `table-date` - 表格字段日期
- `table-date-range` - 表格字段日期范围
- `table-time` - 表格字段时间
- `table-rate` - 表格字段评分
- `table-rich-text` - 富文本编辑器
- `table-map` - 地图定位
- `table-upload` - 附件上传
- `table-link` - 链接组件
- `table-serial-number` - 序列号
- `table-user-role` - 用户角色
- `table-bytes-array` - 字节数组
- `table-reference` - 查找引用
- `table-form-info` - 表单信息
- `table-editable-table` - 可编辑表格
- `table-relate-plus` - 关联字段 Plus
- `table-relate` - 关联字段

## 基本用法

### 1. 基础文本字段

最简单的文本字段显示。

```tsx
import { ViewField } from '@/components/kesi/view-field/view-field'

function UserProfile() {
  return (
    <ViewField
      name="username"
      label="用户名"
      value="john_doe"
      type="text"
    />
  )
}
```

### 2. 数字字段

显示数字类型的字段。

```tsx
import { ViewField } from '@/components/kesi/view-field/view-field'

function ProductInfo() {
  return (
    <ViewField
      name="price"
      label="价格"
      value={99.99}
      type="number"
      description="商品价格（元）"
    />
  )
}
```

### 3. 日期字段

显示日期类型的字段。

```tsx
import { ViewField } from '@/components/kesi/view-field/view-field'

function TaskDetail() {
  return (
    <ViewField
      name="dueDate"
      label="截止日期"
      value="2025-12-31"
      type="date"
      format="YYYY-MM-DD"
    />
  )
}
```

### 4. 下拉选择字段

显示选择类型的字段。

```tsx
import { ViewField } from '@/components/kesi/view-field/view-field'

function OrderStatus() {
  const options = [
    { value: 'pending', label: '待处理' },
    { value: 'processing', label: '处理中' },
    { value: 'completed', label: '已完成' }
  ]

  return (
    <ViewField
      name="status"
      label="订单状态"
      value="processing"
      type="select"
      options={options}
    />
  )
}
```

### 5. 复选框字段

显示布尔类型的字段。

```tsx
import { ViewField } from '@/components/kesi/view-field/view-field'

function UserSettings() {
  return (
    <ViewField
      name="emailVerified"
      label="邮箱验证"
      value={true}
      type="checkbox"
      description="是否已验证邮箱"
    />
  )
}
```

### 6. 滑块字段

显示数值范围字段。

```tsx
import { ViewField } from '@/components/kesi/view-field/view-field'

function VolumeControl() {
  return (
    <ViewField
      name="volume"
      label="音量"
      value={65}
      type="slider"
      min={0}
      max={100}
    />
  )
}
```

### 7. 评分字段

显示评分类型的字段。

```tsx
import { ViewField } from '@/components/kesi/view-field/view-field'

function ProductReview() {
  return (
    <ViewField
      name="rating"
      label="产品评分"
      value={4}
      type="rate"
      max={5}
    />
  )
}
```

### 8. 自定义渲染

使用 children 函数自定义渲染逻辑。

```tsx
import { ViewField } from '@/components/kesi/view-field/view-field'

function CustomField({ item }) {
  return (
    <ViewField
      name="status"
      label="状态"
      value={item.status}
      item={item}
    >
      {({ value }) => (
        <span className={`px-2 py-1 rounded ${
          value === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )}
    </ViewField>
  )
}
```

### 9. 使用 Schema

通过 schema 定义字段，自动推断类型。

```tsx
import { ViewField } from '@/components/kesi/view-field/view-field'

function SchemaField({ data }) {
  const schema = {
    fieldType: 'table-select',
    options: [
      { value: 'admin', label: '管理员' },
      { value: 'user', label: '普通用户' }
    ]
  }

  return (
    <ViewField
      name="role"
      label="角色"
      value={data.role}
      schema={schema}
      item={data}
    />
  )
}
```

### 10. 多行文本

显示多行文本内容。

```tsx
import { ViewField } from '@/components/kesi/view-field/view-field'

function DescriptionField() {
  return (
    <ViewField
      name="description"
      label="描述"
      value="这是第一行\n这是第二行\n这是第三行"
      type="textarea"
    />
  )
}
```

## 完整示例

### 用户详情卡片

完整的用户详情展示卡片。

```tsx
import { ViewField } from '@/components/kesi/view-field/view-field'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function UserProfileCard({ user }) {
  const roleOptions = [
    { value: 'admin', label: '管理员' },
    { value: 'user', label: '普通用户' },
    { value: 'guest', label: '访客' }
  ]

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>用户信息</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ViewField
          name="username"
          label="用户名"
          value={user.username}
          type="text"
        />

        <ViewField
          name="email"
          label="邮箱"
          value={user.email}
          type="text"
          description="用于登录和接收通知"
        />

        <ViewField
          name="role"
          label="角色"
          value={user.role}
          type="select"
          options={roleOptions}
        />

        <ViewField
          name="verified"
          label="邮箱验证"
          value={user.verified}
          type="checkbox"
        />

        <ViewField
          name="createdAt"
          label="注册时间"
          value={user.createdAt}
          type="date"
          format="YYYY-MM-DD HH:mm:ss"
        />

        <ViewField
          name="bio"
          label="个人简介"
          value={user.bio}
          type="textarea"
        />
      </CardContent>
    </Card>
  )
}
```

### 产品信息展示

产品详细信息展示，包含多种字段类型。

```tsx
import { ViewField } from '@/components/kesi/view-field/view-field'
import { Card, CardContent } from '@/components/ui/card'

function ProductDetail({ product }) {
  const categoryOptions = [
    { value: 'electronics', label: '电子产品' },
    { value: 'clothing', label: '服装' },
    { value: 'food', label: '食品' }
  ]

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {/* 基本信息 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">基本信息</h3>
          <div className="space-y-4">
            <ViewField
              name="name"
              label="产品名称"
              value={product.name}
              type="text"
            />

            <ViewField
              name="category"
              label="分类"
              value={product.category}
              type="select"
              options={categoryOptions}
            />

            <ViewField
              name="price"
              label="价格"
              value={product.price}
              type="number"
              description="商品价格（元）"
            />
          </div>
        </div>

        {/* 评分和库存 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">评分和库存</h3>
          <div className="grid grid-cols-2 gap-4">
            <ViewField
              name="rating"
              label="用户评分"
              value={product.rating}
              type="rate"
              max={5}
            />

            <ViewField
              name="stock"
              label="库存数量"
              value={product.stock}
              type="number"
              description="当前库存"
            />
          </div>
        </div>

        {/* 产品描述 */}
        <ViewField
          name="description"
          label="产品描述"
          value={product.description}
          type="textarea"
        />

        {/* 时间信息 */}
        <div className="grid grid-cols-2 gap-4">
          <ViewField
            name="createdAt"
            label="创建时间"
            value={product.createdAt}
            type="date"
          />

          <ViewField
            name="updatedAt"
            label="更新时间"
            value={product.updatedAt}
            type="date"
          />
        </div>

        {/* 状态标识 */}
        <ViewField
          name="active"
          label="上架状态"
          value={product.active}
          type="switch"
        />
      </CardContent>
    </Card>
  )
}
```

### 任务详情面板

任务管理系统的详情面板。

```tsx
import { ViewField } from '@/components/kesi/view-field/view-field'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function TaskDetailPanel({ task }) {
  const statusOptions = [
    { value: 'pending', label: '待处理' },
    { value: 'in_progress', label: '进行中' },
    { value: 'completed', label: '已完成' },
    { value: 'cancelled', label: '已取消' }
  ]

  const priorityOptions = [
    { value: 'low', label: '低' },
    { value: 'medium', label: '中' },
    { value: 'high', label: '高' },
    { value: 'urgent', label: '紧急' }
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>任务详情</CardTitle>
          <Badge variant="secondary">#{task.id}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ViewField
          name="title"
          label="任务标题"
          value={task.title}
          type="text"
        />

        <div className="grid grid-cols-2 gap-4">
          <ViewField
            name="status"
            label="状态"
            value={task.status}
            type="select"
            options={statusOptions}
          />

          <ViewField
            name="priority"
            label="优先级"
            value={task.priority}
            type="select"
            options={priorityOptions}
          />
        </div>

        <ViewField
          name="assignee"
          label="负责人"
          value={task.assignee}
          type="text"
        />

        <div className="grid grid-cols-2 gap-4">
          <ViewField
            name="startDate"
            label="开始日期"
            value={task.startDate}
            type="date"
          />

          <ViewField
            name="dueDate"
            label="截止日期"
            value={task.dueDate}
            type="date"
          />
        </div>

        <ViewField
          name="progress"
          label="完成进度"
          value={task.progress}
          type="slider"
          min={0}
          max={100}
          description="任务完成百分比"
        />

        <ViewField
          name="description"
          label="任务描述"
          value={task.description}
          type="textarea"
        />
      </CardContent>
    </Card>
  )
}
```

## 注意事项

1. **类型推断优先级**：schema.fieldType > type 参数，使用 schema 时优先级更高

2. **日期格式化**：日期类型使用 dayjs 进行格式化，确保项目中已安装 dayjs

3. **选项配置**：select 和 radio 类型的 options 必须是 { value: string, label: string }[] 格式

4. **自定义渲染**：children 函数接收 { name, value, item, schema, ...rest } 参数

5. **TableField 类型**：table-* 类型主要用于表格编辑场景，查看时通常使用基础类型即可

6. **性能考虑**：大量字段时建议使用 React.memo 或 useMemo 优化性能

7. **样式覆盖**：可以通过 className 属性自定义样式，但需要注意优先级

8. **空值处理**：组件会自动处理 null、undefined 等空值情况

9. **Schema 对象**：schema 对象应包含 fieldType 和其他必要的字段配置信息

10. **向后兼容**：组件保留了旧的逻辑以支持没有 schema 的使用方式
