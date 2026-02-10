# Form 表单容器

## 简介

`Form` 是一个基于 React Hook Form 的表单容器组件，提供完整的表单状态管理和验证功能。

- **多种验证模式**：支持 onSubmit、onBlur、onChange、all 四种验证触发时机
- **灵活的布局系统**：提供7种预设布局样式，支持完全自定义样式
- **类型安全**：基于 TypeScript 的完整类型支持
- **丰富的验证规则**：集成 react-hook-form 的所有验证功能
- **Context 共享**：通过 FormProvider 向子组件共享表单状态和方法

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `formId` | `string` | 是 | - | 表单的唯一标识符 |
| `children` | `ReactNode` | 是 | - | 表单子组件，通常是 FormField 组件 |
| `onSubmit` | `(data: any) => void` | 是 | - | 表单提交回调函数，接收表单数据 |
| `onEffect` | `(formData: any, setFormData: (data: any) => void) => void` | 否 | - | 表单数据变化时的副作用回调 |
| `classNames` | `ClassNamesConfig` | 否 | - | 自定义表单各元素的样式类名 |
| `mode` | `'onSubmit' \| 'onBlur' \| 'onChange' \| 'all'` | 否 | `'onSubmit'` | 表单验证的触发时机 |
| `reValidateMode` | `'onChange' \| 'onBlur' \| 'onSubmit'` | 否 | `'onChange'` | 错误状态下的重新验证时机 |
| `defaultValues` | `object` | 否 | `{}` | 表单字段的默认值 |
| `resolver` | `Resolver` | 否 | - | 自定义验证解析器，如 Yup、Zod 等 |
| `context` | `any` | 否 | - | 传递给验证器的上下文对象 |
| `delayError` | `number` | 否 | - | 延迟显示错误的时间（毫秒） |

### ClassNamesConfig

自定义样式类配置对象：

```typescript
interface ClassNamesConfig {
  form?: string       // 表单容器样式
  field?: string      // 字段容器样式
  label?: string      // 标签样式
  input?: string      // 输入框样式
  description?: string // 描述文本样式
  error?: string      // 错误信息样式
}
```

### 预设布局样式

组件提供7种预设布局样式：

| 布局名称 | 说明 |
|---------|------|
| `default` | 默认布局，适中的间距 |
| `compact` | 紧凑布局，节省空间 |
| `spacious` | 宽松布局，更舒适的视觉 |
| `grid` | 两列网格布局，节省垂直空间 |
| `card` | 每个字段都是卡片样式 |
| `inline` | 水平布局，标签和输入框在同一行 |
| `onlabel` | 无 Label 布局，仅显示输入框 |

## 基本用法

### 1. 基本表单

创建一个最简单的表单。

```tsx
import { Form } from '@airiot/client'
import FormField from '@/registry/components/form-field/form-field'

function Example() {
  const handleSubmit = (data: any) => {
    console.log('Form submitted:', data)
  }

  return (
    <Form
      formId="my-form"
      onSubmit={handleSubmit}
    >
      <FormField name="username" label="用户名" type="text" required />
      <FormField name="email" label="邮箱" type="email" required />
      <button type="submit">提交</button>
    </Form>
  )
}
```

### 2. 使用预设布局

使用组件提供的预设布局样式。

```tsx
import { Form } from '@airiot/client'
import FormField from '@/registry/components/form-field/form-field'
import { layoutPresets } from '@/registry/components/form/config'

function Example() {
  const handleSubmit = (data: any) => {
    console.log('Form submitted:', data)
  }

  return (
    <Form
      formId="my-form"
      onSubmit={handleSubmit}
      classNames={layoutPresets.grid}
    >
      <FormField name="username" label="用户名" type="text" required />
      <FormField name="email" label="邮箱" type="email" required />
      <FormField name="password" label="密码" type="password" required />
      <FormField name="phone" label="电话" type="tel" />
      <button type="submit">提交</button>
    </Form>
  )
}
```

### 3. 自定义样式

完全自定义表单的样式。

```tsx
function Example() {
  const handleSubmit = (data: any) => {
    console.log('Form submitted:', data)
  }

  return (
    <Form
      formId="my-form"
      onSubmit={handleSubmit}
      classNames={{
        form: 'space-y-6 p-6 bg-white rounded-lg',
        field: 'space-y-2',
        label: 'block text-sm font-medium text-gray-700',
        input: 'mt-1 block w-full rounded-md border-gray-300 shadow-sm',
        description: 'mt-1 text-sm text-gray-500',
        error: 'mt-1 text-sm text-red-600'
      }}
    >
      <FormField
        name="username"
        label="用户名"
        type="text"
        placeholder="请输入用户名"
        description="用于登录的唯一标识"
        required
      />
      <button type="submit">提交</button>
    </Form>
  )
}
```

### 4. 设置默认值

为表单字段设置默认值。

```tsx
function Example() {
  const handleSubmit = (data: any) => {
    console.log('Form submitted:', data)
  }

  return (
    <Form
      formId="my-form"
      defaultValues={{
        username: 'admin',
        email: 'admin@example.com',
        role: 'user'
      }}
      onSubmit={handleSubmit}
    >
      <FormField name="username" label="用户名" type="text" required />
      <FormField name="email" label="邮箱" type="email" required />
      <FormField name="role" label="角色" type="text" />
      <button type="submit">提交</button>
    </Form>
  )
}
```

### 5. 不同的验证模式

配置表单验证的触发时机。

```tsx
function Example() {
  const handleSubmit = (data: any) => {
    console.log('Form submitted:', data)
  }

  return (
    <Form
      formId="my-form"
      mode="onBlur"  // 失焦时验证
      reValidateMode="onChange"  // 错误后变更时重新验证
      onSubmit={handleSubmit}
    >
      <FormField
        name="email"
        label="邮箱"
        type="email"
        required
        description="失焦时会验证邮箱格式"
      />
      <button type="submit">提交</button>
    </Form>
  )
}
```

### 6. 使用副作用回调

监听表单数据变化并执行副作用。

```tsx
function Example() {
  const handleSubmit = (data: any) => {
    console.log('Form submitted:', data)
  }

  const handleEffect = (formData: any, setFormData: (data: any) => void) => {
    // 当 username 变化时，自动填充 email
    if (formData.username) {
      setFormData({
        ...formData,
        email: `${formData.username}@example.com`
      })
    }
  }

  return (
    <Form
      formId="my-form"
      onEffect={handleEffect}
      onSubmit={handleSubmit}
    >
      <FormField name="username" label="用户名" type="text" required />
      <FormField name="email" label="邮箱" type="email" required />
      <button type="submit">提交</button>
    </Form>
  )
}
```

### 7. 网格布局

使用网格布局展示多列表单。

```tsx
function Example() {
  const handleSubmit = (data: any) => {
    console.log('Form submitted:', data)
  }

  return (
    <Form
      formId="my-form"
      classNames={layoutPresets.grid}
      onSubmit={handleSubmit}
    >
      <FormField name="firstName" label="名" type="text" required />
      <FormField name="lastName" label="姓" type="text" required />
      <FormField name="email" label="邮箱" type="email" required />
      <FormField name="phone" label="电话" type="tel" />
      <FormField name="city" label="城市" type="text" />
      <FormField name="country" label="国家" type="text" />
      <button type="submit" className="col-span-2">提交</button>
    </Form>
  )
}
```

## 完整示例

### 用户注册表单

创建一个完整的用户注册表单，包含多种字段类型和验证规则。

```tsx
import { Form } from '@airiot/client'
import FormField from '@/registry/components/form-field/form-field'
import { layoutPresets } from '@/registry/components/form/config'

function RegistrationForm() {
  const handleSubmit = (data: any) => {
    console.log('Registration data:', data)
    // 发送注册请求
    fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">用户注册</h2>

      <Form
        formId="registration-form"
        mode="onBlur"
        classNames={layoutPresets.spacious}
        onSubmit={handleSubmit}
      >
        <FormField
          name="username"
          label="用户名"
          type="text"
          placeholder="请输入用户名"
          description="4-20个字符，只能包含字母、数字和下划线"
          required
        />

        <FormField
          name="email"
          label="邮箱地址"
          type="email"
          placeholder="请输入邮箱"
          description="我们会向此邮箱发送验证邮件"
          required
        />

        <FormField
          name="password"
          label="密码"
          type="password"
          placeholder="请输入密码"
          description="至少8个字符，包含字母和数字"
          required
        />

        <FormField
          name="confirmPassword"
          label="确认密码"
          type="password"
          placeholder="请再次输入密码"
          required
        />

        <FormField
          name="phone"
          label="手机号码"
          type="tel"
          placeholder="请输入手机号码"
          description="用于接收重要通知"
        />

        <FormField
          name="bio"
          label="个人简介"
          type="textarea"
          placeholder="简单介绍一下自己"
          description="最多200个字符"
        />

        <FormField
          name="agreed"
          label="我已阅读并同意用户协议"
          type="checkbox"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          注册
        </button>
      </Form>
    </div>
  )
}
```

### 配置表单

创建一个设置表单，使用水平布局。

```tsx
import { Form } from '@airiot/client'
import FormField from '@/registry/components/form-field/form-field'
import { layoutPresets } from '@/registry/components/form/config'

function SettingsForm() {
  const handleSubmit = (data: any) => {
    console.log('Settings saved:', data)
    // 保存设置
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">系统设置</h2>

      <Form
        formId="settings-form"
        classNames={layoutPresets.inline}
        defaultValues={{
          siteName: '我的网站',
          siteUrl: 'https://example.com',
          postsPerPage: 10,
          allowComments: true,
          moderationEnabled: false
        }}
        onSubmit={handleSubmit}
      >
        <FormField
          name="siteName"
          label="网站名称"
          type="text"
          required
        />

        <FormField
          name="siteUrl"
          label="网站地址"
          type="url"
          required
        />

        <FormField
          name="postsPerPage"
          label="每页显示文章数"
          type="number"
          min={1}
          max={50}
        />

        <FormField
          name="allowComments"
          label="允许评论"
          type="checkbox"
        />

        <FormField
          name="moderationEnabled"
          label="启用评论审核"
          type="checkbox"
        />

        <div className="col-span-5 flex justify-end gap-4 mt-6">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            取消
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            保存设置
          </button>
        </div>
      </Form>
    </div>
  )
}
```

### 动态表单

创建一个包含动态字段的表单。

```tsx
import { Form } from '@airiot/client'
import FormField from '@/registry/components/form-field/form-field'
import { useState } from 'react'

function DynamicForm() {
  const [fields, setFields] = useState(['field1'])

  const addField = () => {
    setFields([...fields, `field${fields.length + 1}`])
  }

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index))
  }

  const handleSubmit = (data: any) => {
    console.log('Form submitted:', data)
  }

  return (
    <Form
      formId="dynamic-form"
      onSubmit={handleSubmit}
      classNames={layoutPresets.card}
    >
      {fields.map((fieldName, index) => (
        <div key={fieldName} className="p-4 border rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">项目 {index + 1}</h3>
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => removeField(index)}
                className="text-red-600 hover:text-red-800"
              >
                删除
              </button>
            )}
          </div>

          <FormField
            name={`items[${index}].name`}
            label="名称"
            type="text"
            required
          />

          <FormField
            name={`items[${index}].quantity`}
            label="数量"
            type="number"
            min={1}
          />

          <FormField
            name={`items[${index}].price`}
            label="单价"
            type="number"
            min={0}
            step={0.01}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addField}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400"
      >
        + 添加项目
      </button>

      <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md">
        提交
      </button>
    </Form>
  )
}
```

## 注意事项

1. **formId 必须唯一**：同一页面上的多个表单应该有不同的 formId，避免冲突。

2. **子组件要求**：Form 的子组件应该使用 FormField 或其他集成了 useFormContext 的组件，以正确访问表单状态。

3. **验证模式选择**：
   - `onSubmit`：默认模式，用户提交表单时才验证，适合大多数场景
   - `onBlur`：字段失焦时验证，提供即时反馈
   - `onChange`：每次输入变化都验证，实时性最强但性能开销大
   - `all`： onBlur 和 onChange 都触发，最严格的验证

4. **样式覆盖优先级**：`classNames` prop 的优先级高于预设布局。如果同时使用，预设布局会被覆盖。

5. **默认值初始化**：`defaultValues` 只在表单初始化时使用一次。后续需要重置表单时，应使用 `reset()` 方法。

6. **副作用函数使用**：`onEffect` 回调中调用 `setFormData` 会触发新的 effect，注意避免无限循环。建议使用条件判断。

7. **类型安全**：建议为表单数据定义 TypeScript 接口，以获得完整的类型提示和检查。

8. **布局响应式**：预设布局主要针对桌面端设计。移动端可能需要额外的响应式样式调整。

9. **表单提交**：`onSubmit` 回调只在验证通过后触发。如果需要自定义提交逻辑，可以使用 `form.handleSubmit(onSubmit)` 包装。

10. **嵌套表单**：不支持嵌套的 Form 组件。如果需要嵌套字段，使用点号表示法，如 `user.address.city`。
