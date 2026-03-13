# Form.Select 下拉框

## 简介

`FormSelect` 是一个功能丰富的下拉选择组件，用于在表单中选择单个选项。

- **多种样式变体**：支持默认、边框、填充、幽灵四种样式风格
- **灵活的尺寸**：提供小、中、大三种尺寸以适应不同场景
- **搜索功能**：内置搜索功能，可快速过滤选项
- **清除功能**：支持一键清除已选内容
- **完全可控**：支持受控和非受控模式

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `value` | `string` | 否 | - | 当前选中的值 |
| `defaultValue` | `string` | 否 | - | 默认选中的值 |
| `placeholder` | `string` | 否 | `'请选择'` | 占位符文本 |
| `options` | `Array<{value: string; label: string; disabled?: boolean}>` | 否 | `[]` | 选项列表 |
| `disabled` | `boolean` | 否 | `false` | 是否禁用 |
| `readOnly` | `boolean` | 否 | `false` | 是否只读 |
| `bordered` | `boolean` | 否 | `true` | 是否显示边框 |
| `allowClear` | `boolean` | 否 | `false` | 是否显示清除按钮 |
| `showSearch` | `boolean` | 否 | `false` | 是否启用搜索功能 |
| `showArrow` | `boolean` | 否 | `true` | 是否显示下拉箭头 |
| `autoFocus` | `boolean` | 否 | `false` | 是否自动获取焦点 |
| `defaultOpen` | `boolean` | 否 | `false` | 是否默认展开下拉菜单 |
| `dropdownMatchSelectWidth` | `boolean` | 否 | `true` | 下拉菜单是否与选择器同宽 |
| `variant` | `'default' \| 'outline' \| 'filled' \| 'ghost'` | 否 | `'default'` | 样式变体 |
| `size` | `'sm' \| 'md' \| 'lg'` | 否 | `'md'` | 组件尺寸 |
| `onChange` | `(value: string) => void` | 否 | - | 值改变时的回调 |
| `onBlur` | `() => void` | 否 | - | 失去焦点时的回调 |
| `onFocus` | `() => void` | 否 | - | 获得焦点时的回调 |

### options

选项数组格式：

```typescript
interface Option {
  value: string    // 选项值
  label: string    // 显示文本
  disabled?: boolean  // 是否禁用该选项
}
```

**示例：**
```tsx
const options = [
  { value: 'apple', label: '苹果' },
  { value: 'banana', label: '香蕉' },
  { value: 'orange', label: '橙子', disabled: true }
]
```

## 基本用法

### 1. 基础下拉框

最简单的下拉框用法，提供选项列表供用户选择。

```tsx
import { FormSelect } from '@/components/airiot/form-select'

function Example() {
  const options = [
    { value: 'option1', label: '选项1' },
    { value: 'option2', label: '选项2' },
    { value: 'option3', label: '选项3' }
  ]

  return (
    <FormSelect
      placeholder="请选择"
      options={options}
    />
  )
}
```

### 2. 带搜索功能的下拉框

启用搜索功能，用户可以输入关键词过滤选项。

```tsx
function Example() {
  const options = [
    { value: 'beijing', label: '北京' },
    { value: 'shanghai', label: '上海' },
    { value: 'guangzhou', label: '广州' },
    { value: 'shenzhen', label: '深圳' }
  ]

  return (
    <FormSelect
      placeholder="搜索城市"
      options={options}
      showSearch
    />
  )
}
```

### 3. 可清空的下拉框

显示清除按钮，方便用户快速清空已选内容。

```tsx
function Example() {
  return (
    <FormSelect
      placeholder="可清空选择"
      options={[
        { value: '1', label: '选项1' },
        { value: '2', label: '选项2' }
      ]}
      allowClear
    />
  )
}
```

### 4. 受控模式

使用 `value` 和 `onChange` 完全控制组件状态。

```tsx
function Example() {
  const [value, setValue] = useState('')

  return (
    <FormSelect
      value={value}
      onChange={setValue}
      options={[
        { value: 'male', label: '男' },
        { value: 'female', label: '女' }
      ]}
      placeholder="请选择性别"
    />
  )
}
```

### 5. 不同尺寸

使用 `size` 属性调整组件大小。

```tsx
function Example() {
  return (
    <div className="space-y-4">
      <FormSelect size="sm" placeholder="小尺寸" options={[]} />
      <FormSelect size="md" placeholder="中尺寸" options={[]} />
      <FormSelect size="lg" placeholder="大尺寸" options={[]} />
    </div>
  )
}
```

### 6. 不同样式变体

使用 `variant` 属性改变组件外观。

```tsx
function Example() {
  return (
    <div className="space-y-4">
      <FormSelect variant="default" placeholder="默认样式" options={[]} />
      <FormSelect variant="outline" placeholder="边框样式" options={[]} />
      <FormSelect variant="filled" placeholder="填充样式" options={[]} />
      <FormSelect variant="ghost" placeholder="幽灵样式" options={[]} />
    </div>
  )
}
```

### 7. 禁用和只读状态

禁用或只读状态下用户无法修改选择。

```tsx
function Example() {
  return (
    <div className="space-y-4">
      <FormSelect
        disabled
        value="option1"
        options={[{ value: 'option1', label: '选项1' }]}
        placeholder="禁用状态"
      />
      <FormSelect
        readOnly
        value="option1"
        options={[{ value: 'option1', label: '选项1' }]}
        placeholder="只读状态"
      />
    </div>
  )
}
```

## 完整示例

### 用户信息表单

在用户注册或信息编辑表单中使用下拉框选择用户类型和地区。

```tsx
import { FormSelect } from '@/components/airiot/form-select'

function UserForm() {
  const [userType, setUserType] = useState('')
  const [region, setRegion] = useState('')

  const userTypeOptions = [
    { value: 'admin', label: '管理员' },
    { value: 'user', label: '普通用户' },
    { value: 'guest', label: '访客' }
  ]

  const regionOptions = [
    { value: 'north', label: '华北地区' },
    { value: 'south', label: '华南地区' },
    { value: 'east', label: '华东地区' },
    { value: 'west', label: '西部地区' }
  ]

  return (
    <div className="space-y-4 w-full max-w-md">
      <div>
        <label className="block text-sm font-medium mb-2">用户类型</label>
        <FormSelect
          value={userType}
          onChange={setUserType}
          options={userTypeOptions}
          placeholder="请选择用户类型"
          allowClear
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">所在地区</label>
        <FormSelect
          value={region}
          onChange={setRegion}
          options={regionOptions}
          placeholder="请选择地区"
          showSearch
          allowClear
        />
      </div>
    </div>
  )
}
```

### 筛选器组件

实现多条件筛选的界面，支持搜索和快速清除。

```tsx
function FilterPanel() {
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState('')

  return (
    <div className="flex gap-4 items-end">
      <div className="flex-1">
        <label className="block text-sm font-medium mb-2">状态</label>
        <FormSelect
          value={status}
          onChange={setStatus}
          options={[
            { value: 'active', label: '激活' },
            { value: 'inactive', label: '未激活' },
            { value: 'pending', label: '待审核' }
          ]}
          placeholder="全部状态"
          allowClear
          size="sm"
        />
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium mb-2">优先级</label>
        <FormSelect
          value={priority}
          onChange={setPriority}
          options={[
            { value: 'high', label: '高' },
            { value: 'medium', label: '中' },
            { value: 'low', label: '低' }
          ]}
          placeholder="全部优先级"
          allowClear
          size="sm"
        />
      </div>
    </div>
  )
}
```

## 注意事项

1. **选项格式**：options 数组中每个对象必须包含 `value` 和 `label` 字段，`disabled` 字段可选

2. **搜索功能**：启用 `showSearch` 后，搜索会同时匹配选项的 `value` 和 `label` 字段（不区分大小写）

3. **受控模式**：使用 `value` 属性时，必须同时提供 `onChange` 回调来更新值，否则组件将变为只读

4. **清除功能**：`allowClear` 只在有值且非禁用、非只读状态下显示清除按钮

5. **样式定制**：使用 `variant` 和 `size` 属性可以快速调整组件外观，无需额外编写样式

6. **禁用选项**：可以通过设置 `disabled: true` 来禁用单个选项，禁用的选项无法被选中

7. **默认展开**：`defaultOpen` 仅在组件初始化时生效，用户交互后由组件内部状态控制
