# Form.Checkbox 多选框组件

## 简介

`FormCheckbox` 是一个支持单选和多选的复选框组件。

- **灵活模式**：支持单选和多选两种模式
- **全选功能**：支持全选/取消全选
- **半选状态**：部分选中时显示半选状态
- **禁用控制**：支持禁用单个选项或整体禁用
- **布局灵活**：支持全选框单独一行或同行显示
- **受控/非受控**：支持受控和非受控两种模式

## 适用场景

- 多选项选择（兴趣爱好、标签等）
- 权限配置
- 批量操作
- 协议确认
- 过滤条件选择

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `value` | `string \| string[]` | 否 | - | 当前值（受控模式） |
| `defaultValue` | `string \| string[]` | 否 | - | 默认值（非受控模式） |
| `options` | `CheckboxOption[]` | 否 | `[]` | 选项列表 |
| `config` | `FormCheckboxConfig` | 否 | `{}` | 配置项 |
| `onChange` | `(value: string \| string[]) => void` | 否 | - | 值变化回调 |

### CheckboxOption 选项结构

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `label` | `string` | 是 | - | 显示文字 |
| `value` | `string` | 是 | - | 选项值 |
| `isDefault` | `boolean` | 否 | `false` | 是否默认选中 |

### FormCheckboxConfig 配置项

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `disabled` | `boolean` | 否 | `false` | 是否禁用所有选项 |
| `isCheckAll` | `boolean` | 否 | `false` | 是否显示全选框 |
| `checkAllSeparate` | `boolean` | 否 | `false` | 全选框是否单独一行 |

## 基本用法

### 1. 基础多选框

```tsx
import { FormCheckbox } from '@/components/kesi/form-checkbox/form-checkbox'

function BasicCheckbox() {
  const options = [
    { label: '选项 A', value: '1' },
    { label: '选项 B', value: '2' },
    { label: '选项 C', value: '3' }
  ]

  return <FormCheckbox options={options} />
}
```

### 2. 单选模式

```tsx
function SingleCheckbox() {
  const options = [
    { label: '同意协议', value: 'agree' }
  ]

  return <FormCheckbox options={options} />
}
```

### 3. 带默认值

```tsx
function CheckboxWithDefault() {
  const options = [
    { label: '篮球', value: 'basketball', isDefault: true },
    { label: '足球', value: 'football' },
    { label: '网球', value: 'tennis', isDefault: true }
  ]

  return <FormCheckbox options={options} />
}
```

### 4. 受控模式

```tsx
import { useState } from 'react'

function ControlledCheckbox() {
  const [value, setValue] = useState<string[]>(['1'])

  const options = [
    { label: '选项 A', value: '1' },
    { label: '选项 B', value: '2' },
    { label: '选项 C', value: '3' }
  ]

  return (
    <div>
      <FormCheckbox
        value={value}
        onChange={setValue}
        options={options}
      />
      <p className="mt-2">选中值: {value.join(', ')}</p>
    </div>
  )
}
```

### 5. 带全选功能

```tsx
function CheckboxWithCheckAll() {
  const options = [
    { label: '选项 A', value: '1' },
    { label: '选项 B', value: '2' },
    { label: '选项 C', value: '3' },
    { label: '选项 D', value: '4' }
  ]

  return (
    <FormCheckbox
      options={options}
      config={{ isCheckAll: true }}
    />
  )
}
```

### 6. 全选框单独一行

```tsx
function CheckboxWithSeparateCheckAll() {
  const options = [
    { label: '选项 A', value: '1' },
    { label: '选项 B', value: '2' },
    { label: '选项 C', value: '3' }
  ]

  return (
    <FormCheckbox
      options={options}
      config={{
        isCheckAll: true,
        checkAllSeparate: true
      }}
    />
  )
}
```

### 7. 禁用状态

```tsx
function DisabledCheckbox() {
  const options = [
    { label: '选项 A', value: '1' },
    { label: '选项 B', value: '2' },
    { label: '选项 C', value: '3' }
  ]

  return (
    <FormCheckbox
      options={options}
      config={{ disabled: true }}
    />
  )
}
```

## 完整示例

### 兴趣爱好选择

```tsx
import { FormCheckbox } from '@/components/kesi/form-checkbox/form-checkbox'
import { useState } from 'react'

function HobbiesSelector() {
  const [hobbies, setHobbies] = useState<string[]>([])

  const hobbiesOptions = [
    { label: '篮球', value: 'basketball' },
    { label: '足球', value: 'football' },
    { label: '游泳', value: 'swimming' },
    { label: '跑步', value: 'running' },
    { label: '阅读', value: 'reading' },
    { label: '音乐', value: 'music' }
  ]

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">选择您的兴趣爱好</h3>
      <FormCheckbox
        value={hobbies}
        onChange={setHobbies}
        options={hobbiesOptions}
        config={{ isCheckAll: true }}
      />
      <p className="mt-4 text-sm text-gray-600">
        已选择: {hobbies.length > 0 ? hobbies.join(', ') : '无'}
      </p>
    </div>
  )
}
```

### 权限配置

```tsx
import { FormCheckbox } from '@/components/kesi/form-checkbox/form-checkbox'

function PermissionConfig() {
  const permissions = [
    { label: '查看', value: 'view', isDefault: true },
    { label: '创建', value: 'create' },
    { label: '编辑', value: 'edit' },
    { label: '删除', value: 'delete' },
    { label: '导出', value: 'export' }
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">权限配置</h3>

      <div>
        <h4 className="text-sm font-medium mb-2">用户管理</h4>
        <FormCheckbox
          options={permissions}
          config={{ isCheckAll: true, checkAllSeparate: true }}
        />
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">内容管理</h4>
        <FormCheckbox
          options={permissions}
          config={{ isCheckAll: true, checkAllSeparate: true }}
        />
      </div>
    </div>
  )
}
```

### 批量操作

```tsx
import { FormCheckbox } from '@/components/kesi/form-checkbox/form-checkbox'
import { useState } from 'react'

function BatchOperation() {
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const items = [
    { label: '文件 1.pdf', value: 'file1' },
    { label: '文件 2.docx', value: 'file2' },
    { label: '文件 3.xlsx', value: 'file3' },
    { label: '文件 4.pptx', value: 'file4' },
    { label: '文件 5.jpg', value: 'file5' }
  ]

  const handleBatchDelete = () => {
    console.log('批量删除:', selectedItems)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">文件列表</h3>
        {selectedItems.length > 0 && (
          <button
            onClick={handleBatchDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            删除选中 ({selectedItems.length})
          </button>
        )}
      </div>

      <FormCheckbox
        value={selectedItems}
        onChange={setSelectedItems}
        options={items}
        config={{ isCheckAll: true }}
      />
    </div>
  )
}
```

### 协议确认

```tsx
import { FormCheckbox } from '@/components/kesi/form-checkbox/form-checkbox'
import { useState } from 'react'

function AgreementForm() {
  const [agreed, setAgreed] = useState<string[]>([])

  const agreements = [
    { label: '我已阅读并同意用户协议', value: 'user-agreement' },
    { label: '我已阅读并同意隐私政策', value: 'privacy-policy' }
  ]

  const canSubmit = agreed.length === agreements.length

  return (
    <form className="space-y-4">
      <FormCheckbox
        value={agreed}
        onChange={setAgreed}
        options={agreements}
      />

      <button
        type="submit"
        disabled={!canSubmit}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
      >
        提交
      </button>
    </form>
  )
}
```

### 标签过滤器

```tsx
import { FormCheckbox } from '@/components/kesi/form-checkbox/form-checkbox'
import { useState } from 'react'

function TagFilter() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const tags = [
    { label: '技术', value: 'tech' },
    { label: '设计', value: 'design' },
    { label: '产品', value: 'product' },
    { label: '运营', value: 'operation' },
    { label: '市场', value: 'marketing' }
  ]

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-sm font-medium mb-3">按标签筛选</h3>
      <FormCheckbox
        value={selectedTags}
        onChange={setSelectedTags}
        options={tags}
        config={{ isCheckAll: true }}
      />
      <div className="mt-3 flex gap-2">
        {selectedTags.map(tag => (
          <span
            key={tag}
            className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
```

### 动态选项

```tsx
import { FormCheckbox } from '@/components/kesi/form-checkbox/form-checkbox'
import { useState } from 'react'

function DynamicCheckbox() {
  const [options, setOptions] = useState([
    { label: '选项 A', value: '1' },
    { label: '选项 B', value: '2' }
  ])
  const [value, setValue] = useState<string[]>([])

  const addOption = () => {
    const newOption = {
      label: `选项 ${options.length + 1}`,
      value: (options.length + 1).toString()
    }
    setOptions([...options, newOption])
  }

  return (
    <div>
      <button
        onClick={addOption}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        添加选项
      </button>

      <FormCheckbox
        value={value}
        onChange={setValue}
        options={options}
        config={{ isCheckAll: true }}
      />
    </div>
  )
}
```

## 注意事项

1. **单选与多选模式**：
   - 当 `options` 只有一个选项时，自动切换为单选模式
   - 多个选项时为多选模式，返回值为数组

2. **受控与非受控模式**：
   - 提供 `value` 属性时为受控模式，需要通过 `onChange` 更新
   - 提供 `defaultValue` 时为非受控模式，组件内部管理状态

3. **全选状态**：
   - 当所有选项都被选中时，全选框自动选中
   - 当部分选项被选中时，全选框显示半选状态
   - 单选模式下不显示全选框

4. **半选状态**：
   - 半选状态通过特殊样式显示
   - 半选时点击全选框会选中所有选项

5. **禁用控制**：
   - `config.disabled` 会禁用所有选项包括全选框
   - 禁用状态下所有选项都不可交互

6. **布局选项**：
   - `checkAllSeparate: false`：全选框和选项在同一行（横向排列）
   - `checkAllSeparate: true`：全选框单独一行，选项纵向排列

7. **值格式**：
   - 多选模式返回字符串数组
   - 单选模式返回字符串（如果选中）或空字符串（如果未选中）
