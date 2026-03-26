# FormField 表单字段

## 简介

`FormField` 是一个通用的表单字段组件，支持多种输入类型，用于构建复杂的表单界面。

- **类型丰富**：支持文本、数字、选择、日期、富文本等30多种字段类型
- **表单集成**：与 Form 组件无缝集成，自动处理验证和状态
- **灵活配置**：支持必填、禁用、描述、自定义样式等配置
- **自动验证**：集成表单验证规则，实时显示错误提示
- **样式定制**：支持 className 和 classNames 进行样式定制

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `name` | `string` | 是 | - | 字段名称，用于表单数据绑定 |
| `label` | `ReactNode` | 否 | - | 字段标签文本 |
| `type` | `string` | 否 | `'text'` | 字段类型（见下方支持的类型） |
| `description` | `ReactNode` | 否 | - | 字段描述文本 |
| `children` | `ReactNode \| function` | 否 | - | 自定义渲染函数或子组件 |
| `required` | `boolean` | 否 | `false` | 是否必填 |
| `rules` | `object` | 否 | - | 验证规则对象 |
| `className` | `string` | 否 | - | 容器的自定义 className |
| `classNames` | `object` | 否 | - | 各部分的自定义 className |

### classNames 对象结构

```tsx
classNames: {
  field?: string,      // 字段容器
  label?: string,      // 标签
  input?: string,      // 输入控件
  description?: string, // 描述
  error?: string       // 错误提示
}
```

### 支持的字段类型

#### 基础类型
- `text` - 文本输入框
- `number` - 数字输入框
- `textarea` - 多行文本框
- `select` - 下拉选择框
- `checkbox` - 复选框
- `radio` - 单选框
- `switch` - 开关
- `slider` - 滑块
- `date` - 日期选择器
- `rate` - 评分组件

#### 增强类型（table-*）
- `table-text` - 文本输入（增强版）
- `table-textarea` - 多行文本（增强版）
- `table-number` - 数字输入（增强版）
- `table-select` - 下拉选择（增强版）
- `table-checkbox` - 复选框（增强版）
- `table-date` - 日期选择（增强版）
- `table-date-range` - 日期范围（增强版）
- `table-time` - 时间选择（增强版）
- `table-rate` - 评分组件（增强版）
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
- `table-relate-plus` - 关联字段Plus
- `table-relate` - 关联字段

## 基本用法

### 1. 基础文本字段

最简单的用法，创建一个文本输入字段。

```tsx
import { FormField } from '@/registry/components/kesi/form-field/form-field'
import { Form } from '@airiot/client'

function Example() {
  return (
    <Form formId="my-form" onSubmit={(data) => console.log(data)}>
      <FormField
        name="username"
        label="用户名"
        type="text"
        placeholder="请输入用户名"
      />
    </Form>
  )
}
```

### 2. 必填字段

标记字段为必填项。

```tsx
function Example() {
  return (
    <Form formId="my-form">
      <FormField
        name="email"
        label="邮箱地址"
        type="text"
        required
        placeholder="请输入邮箱"
      />
    </Form>
  )
}
```

### 3. 带描述的字段

添加字段描述信息。

```tsx
function Example() {
  return (
    <Form formId="my-form">
      <FormField
        name="password"
        label="密码"
        type="text"
        description="密码长度至少8位，包含字母和数字"
        required
      />
    </Form>
  )
}
```

### 4. 数字输入字段

使用数字类型输入。

```tsx
function Example() {
  return (
    <Form formId="my-form">
      <FormField
        name="age"
        label="年龄"
        type="number"
        description="请输入您的年龄"
      />
    </Form>
  )
}
```

### 5. 下拉选择字段

使用选择类型，配置选项。

```tsx
function Example() {
  const options = [
    { value: 'option1', name: '选项1' },
    { value: 'option2', name: '选项2' },
    { value: 'option3', name: '选项3' }
  ]

  return (
    <Form formId="my-form">
      <FormField
        name="category"
        label="分类"
        type="select"
        options={options}
        required
      />
    </Form>
  )
}
```

### 6. 禁用字段

设置字段为禁用状态。

```tsx
function Example() {
  return (
    <Form formId="my-form">
      <FormField
        name="readonly"
        label="只读字段"
        type="text"
        disabled
        value="不可编辑"
      />
    </Form>
  )
}
```

### 7. 自定义样式

使用 classNames 自定义各部分样式。

```tsx
function Example() {
  return (
    <Form formId="my-form">
      <FormField
        name="custom"
        label="自定义样式"
        type="text"
        classNames={{
          field: 'custom-field-class',
          label: 'custom-label-class',
          input: 'custom-input-class'
        }}
      />
    </Form>
  )
}
```

## 完整示例

### 用户注册表单

创建一个完整的用户注册表单，包含多种字段类型。

```tsx
import { FormField } from '@/registry/components/kesi/form-field/form-field'
import { Form } from '@airiot/client'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    age: 0,
    gender: '',
    bio: '',
    subscribe: false
  })

  const handleSubmit = (data: any) => {
    console.log('提交数据:', data)
    alert('注册成功！')
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">用户注册</h2>

      <Form
        formId="registration-form"
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <FormField
            name="username"
            label="用户名"
            type="text"
            placeholder="请输入用户名"
            required
            description="4-20个字符，只能包含字母、数字和下划线"
          />

          <FormField
            name="email"
            label="邮箱地址"
            type="text"
            placeholder="example@email.com"
            required
            description="用于接收重要通知和找回密码"
          />

          <FormField
            name="password"
            label="密码"
            type="text"
            placeholder="请输入密码"
            required
            description="至少8位，包含字母和数字"
          />

          <FormField
            name="age"
            label="年龄"
            type="number"
            placeholder="请输入年龄"
          />

          <FormField
            name="gender"
            label="性别"
            type="select"
            options={[
              { value: 'male', name: '男' },
              { value: 'female', name: '女' },
              { value: 'other', name: '其他' }
            ]}
          />

          <FormField
            name="bio"
            label="个人简介"
            type="textarea"
            description="简单介绍一下自己"
          />

          <FormField
            name="subscribe"
            label="订阅新闻通讯"
            type="checkbox"
            description="接收最新的产品更新和优惠信息"
          />

          <Button type="submit" className="w-full">
            注册
          </Button>
        </div>
      </Form>
    </div>
  )
}
```

### 产品信息表单

创建产品信息录入表单，使用增强型字段。

```tsx
import { FormField } from '@/registry/components/kesi/form-field/form-field'
import { Form } from '@airiot/client'

function ProductForm() {
  const handleSubmit = (data: any) => {
    console.log('产品信息:', data)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">产品信息</h2>

      <Form formId="product-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="productName"
            label="产品名称"
            type="table-text"
            required
          />

          <FormField
            name="productCode"
            label="产品编码"
            type="table-text"
            required
          />

          <FormField
            name="category"
            label="产品分类"
            type="table-select"
            options={[
              { value: 'electronics', name: '电子产品' },
              { value: 'clothing', name: '服装' },
              { value: 'food', name: '食品' }
            ]}
            required
          />

          <FormField
            name="price"
            label="价格"
            type="table-number"
            required
          />

          <FormField
            name="stock"
            label="库存数量"
            type="table-number"
            required
          />

          <FormField
            name="productionDate"
            label="生产日期"
            type="table-date"
          />

          <FormField
            name="description"
            label="产品描述"
            type="table-rich-text"
            classNames={{ field: 'col-span-2' }}
          />

          <FormField
            name="location"
            label="仓库位置"
            type="table-map"
          />
        </div>
      </Form>
    </div>
  )
}
```

## 注意事项

1. **必须在 Form 内使用**：FormField 必须作为 Form 组件的子组件使用，否则会显示错误提示。

2. **name 唯一性**：确保每个 FormField 的 name 在同一个表单中是唯一的。

3. **类型配置**：type 属性决定渲染的字段类型，确保 type 值在支持列表中。

4. **children 使用**：提供 children 时，会覆盖默认的输入控件渲染。

5. **表单上下文**：FormField 通过 useFormContext 获取表单上下文，实现数据绑定和验证。

6. **必填验证**：required 属性会在标签旁显示红色星号，并添加必填验证规则。

7. **样式优先级**：classNames 的优先级高于默认样式，但低于全局样式。

8. **错误显示**：验证失败时，错误信息会自动显示在字段下方。

9. **受控组件**：字段由表单统一管理，不要尝试手动控制 value。

10. **选项格式**：select 类型的 options 应为 { value, name } 格式的数组。
