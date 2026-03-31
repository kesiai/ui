> **安装命令**: `npx shadcn@latest add @kesi/form-form-info`

# Form.FormInfo 表单信息

## 简介

`FormFormInfo` 是一个动态组件加载器，用于在表单中嵌入自定义的动态组件内容。

- **动态加载**：支持运行时加载和渲染动态组件代码
- **错误边界**：内置错误边界，捕获运行时错误
- **参数传递**：支持向动态组件传递参数
- **灵活配置**：通过 widgetContent 配置组件代码

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `schema` | `object` | 否 | - | 组件配置对象 |
| `schema.widgetContent` | `string` | 否 | - | 动态组件代码字符串 |
| `args` | `Array<{key: string, value: any}>` | 否 | - | 传递给组件的参数数组 |
| `outProps` | `Record<string, any>` | 否 | - | 外部属性对象 |

## 基本用法

### 1. 基础用法

最简单的用法，显示一个空白的表单信息组件。

```tsx
import { FormFormInfo } from '@/components/kesi/form-form-info/form-form-info'

function Example() {
  return (
    <FormFormInfo
      schema={{
        widgetContent: ''
      }}
    />
  )
}
```

### 2. 传递参数

向组件传递参数。

```tsx
function Example() {
  return (
    <FormFormInfo
      schema={{
        widgetContent: 'console.log("Component loaded")'
      }}
      args={[
        { key: 'param1', value: 'value1' },
        { key: 'param2', value: 123 }
      ]}
    />
  )
}
```

### 3. 使用外部属性

传递外部属性配置。

```tsx
function Example() {
  return (
    <FormFormInfo
      schema={{
        widgetContent: '// component code here'
      }}
      outProps={{
        inList: false,
        viewPage: true
      }}
    />
  )
}
```

## 完整示例

### 动态信息展示

创建一个动态信息展示组件。

```tsx
import { FormFormInfo } from '@/components/kesi/form-form-info/form-form-info'
import { Card } from '@/components/ui/card'

function DynamicInfoDisplay() {
  const componentCode = `
    React.createElement('div', { className: 'p-4 bg-blue-50 rounded' },
      React.createElement('h3', { className: 'font-bold mb-2' }, '动态信息'),
      React.createElement('p', null, '这是一个动态加载的组件'),
      React.createElement('p', { className: 'text-sm text-gray-600' },
        '当前时间: ' + new Date().toLocaleString()
      )
    )
  `

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">表单信息组件</h2>
      <FormFormInfo
        schema={{
          widgetContent: componentCode
        }}
      />
    </Card>
  )
}
```

## 注意事项

1. **待实现功能**：当前组件处于待迁移状态，LazyBabelTransformedCode 组件尚未实现。

2. **代码转换**：widgetContent 需要通过 Babel 进行代码转换，目前功能未完全实现。

3. **错误处理**：组件内置错误边界，可以捕获运行时错误并显示。

4. **性能考虑**：动态代码执行可能存在性能和安全风险，生产环境需谨慎使用。

5. **参数格式**：args 数组中的每个元素需要包含 key 和 value 属性。
