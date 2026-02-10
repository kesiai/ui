# View Field Field Map 迁移文档

## 概述

已将旧代码 `src/src/TableFieldRender.js` 中的字段渲染逻辑迁移到新版 `src/registry/components/view-field/field-map.tsx` 中。

## 主要变更

### 1. 移除的依赖
- ❌ **antd** - Modal, Tooltip, Loading
- ❌ **xadmin** - use, api, C, Loading, Model
- ✅ **shadcn/ui** - Dialog, Tooltip 替代 antd 组件
- ✅ **dayjs** - 替代 moment 进行日期格式化
- ✅ **Intl.NumberFormat** - 替代 xadmin 的 NumberFormat
- ✅ **lucide-react** - 图标组件

### 2. 字段类型映射

#### 基础类型
```typescript
'text'           // 文本输入
'textarea'       // 多行文本
'number'         // 数字（支持格式化）
'password'       // 密码
'select'         // 选择器（支持颜色标签）
'checkbox'       // 复选框
'radio'          // 单选框
'switch'         // 开关
'slider'         // 滑块
'date'           // 日期
'date-range'     // 日期范围
'time'           // 时间
'rate'           // 星级评价
'boolean'        // 布尔值
```

#### TableField 类型（使用已迁移的 table-field 组件）
```typescript
'table-text'           // 表格文本
'table-textarea'       // 表格多行文本
'table-number'         // 表格数字
'table-select'         // 表格选择器
'table-checkbox'       // 表格复选框
'table-date'           // 表格日期
'table-date-range'     // 表格日期范围
'table-time'           // 表格时间
'table-rate'           // 表格星级评价
'table-rich-text'      // 表格富文本
'table-map'            // 表格地图
'table-upload'         // 表格附件上传
'table-link'           // 表格链接
'table-serial-number'  // 表格序号
'table-user-role'      // 表格用户角色
'table-bytes-array'    // 表格字节数组
'table-reference'      // 表格查找引用
'table-form-info'      // 表格表单信息
'table-editable-table' // 表格可编辑表格
'table-relate-plus'    // 表格关联增强
'table-relate'         // 表格关联
```

#### 特殊类型
```typescript
'formula'    // 公式字段
'script'     // 脚本渲染
'reference'  // 查找引用
```

### 3. 使用方式

#### 方式一：使用 ViewField 组件（推荐）

```tsx
import ViewField from '@/registry/components/view-field/view-field'

// 基础使用
<ViewField
  name="fieldName"
  label="字段名称"
  value="字段值"
  schema={{
    fieldType: 'text',
    // 其他 schema 配置
  }}
/>

// 带描述
<ViewField
  name="age"
  label="年龄"
  value={25}
  schema={{
    fieldType: 'number',
    decimal: 1, // 保留1位小数
  }}
  description="用户年龄"
/>

// 选择器（带颜色标签）
<ViewField
  name="status"
  label="状态"
  value="active"
  schema={{
    fieldType: 'select',
    enum1: ['active', 'inactive', 'pending'],
    enum_title1: ['激活', '未激活', '待处理'],
    enum_color1: ['#10b981', '#6b7280', '#f59e0b'],
  }}
/>

// 日期格式化
<ViewField
  name="createdAt"
  label="创建时间"
  value="2024-01-15"
  schema={{
    fieldType: 'date',
    filedFormat: 'YYYY-MM-DD HH:mm:ss',
  }}
/>

// 日期范围
<ViewField
  name="dateRange"
  label="日期范围"
  value="2024-01-01 - 2024-12-31"
  schema={{
    fieldType: 'dateRange',
    filedFormat: 'YYYY-MM-DD',
    NullShow: 'forever', // 无结束日期时显示"长期"
  }}
/>

// 使用 table-field 组件
<ViewField
  name="content"
  label="内容"
  value="<p>富文本内容</p>"
  schema={{
    fieldType: 'textEditor',
    disabled: true, // 只读模式
  }}
/>

// 可编辑表格（显示在对话框中）
<ViewField
  name="tableData"
  label="表格数据"
  value={[
    { name: '张三', age: 25 },
    { name: '李四', age: 30 },
  ]}
  schema={{
    fieldType: 'editableTable',
  }}
/>
```

#### 方式二：直接使用 ViewFieldRender

```tsx
import { ViewFieldRender } from '@/registry/components/view-field/field-map'

// 根据 schema.fieldType 自动渲染
<ViewFieldRender
  value="字段值"
  schema={{
    fieldType: 'text',
  }}
/>

// 手动指定 type
<ViewFieldRender
  type="select"
  value="option1"
  schema={{
    enum1: ['option1', 'option2'],
    enum_title1: ['选项1', '选项2'],
  }}
/>
```

#### 方式三：直接使用 fieldMap

```tsx
import fieldMap from '@/registry/components/view-field/field-map'

const TextComponent = fieldMap['text']
const SelectComponent = fieldMap['select']

<TextComponent value="文本内容" />
<SelectComponent
  value="option1"
  schema={{
    enum1: ['option1', 'option2'],
    enum_title1: ['选项1', '选项2'],
  }}
/>
```

### 4. 特殊功能

#### 4.1 脚本渲染

如果 schema 中配置了 `fieldRenderScript` 或 `allScript`，会自动使用脚本渲染：

```tsx
<ViewField
  name="customField"
  label="自定义字段"
  value={100}
  schema={{
    fieldType: 'number',
    fieldRenderScript: `
      if (value > 80) {
        return '<span style="color: red">' + value + '（高分）</span>'
      }
      return value
    `,
  }}
/>
```

#### 4.2 公式字段

```tsx
<ViewField
  name="formula"
  label="公式"
  value={{ a: 1, b: 2 }}
  schema={{
    textContent: 'logic', // 或 config: '公式'
  }}
/>
```

#### 4.3 查找引用

```tsx
<ViewField
  name="reference"
  label="关联数据"
  value={[
    { id: 1, name: '项目A', status: 'active' },
    { id: 2, name: '项目B', status: 'pending' },
  ]}
  schema={{
    config: '查找引用',
    searchRelate: {
      field: {
        key: 'name',
        fieldSchema: {
          type: 'text',
        },
      },
    },
    sort: 'asc', // 排序
    numberLimit: 5, // 最多显示5条
  }}
/>
```

### 5. 组件特性

#### 5.1 空值处理
所有组件都会自动处理空值，显示为"空"（灰色文本）

#### 5.2 数字格式化
```tsx
schema={{
  decimal: 2,        // 保留2位小数
  bitNum: 'compact', // 使用 Intl.NumberFormat 格式化
}}
```

#### 5.3 日期格式化
```tsx
schema={{
  filedFormat: 'YYYY-MM-DD HH:mm:ss', // 自定义格式
  // 或使用旧格式
  format: 'datetime', // 会映射为 'YYYY-MM-DD HH:mm:ss'
}}
```

#### 5.4 选择器颜色标签
```tsx
schema={{
  enum1: ['value1', 'value2', 'value3'],
  enum_title1: ['选项1', '选项2', '选项3'],
  enum_color1: ['#10b981', '#6b7280', '#f59e0b'], // 空字符串会显示为灰色
}}
```

### 6. 迁移对照表

| 旧代码 | 新代码 |
|--------|--------|
| `<C is="Model.BooleanIcon" />` | `<BooleanIcon />` |
| `<Modal />` | `<Dialog />` |
| `<Tooltip />` | `<Tooltip />` (shadcn/ui) |
| `<Loading />` | 简化处理，移除 |
| `use('common.DateFormat')` | `dayjs(value).format()` |
| `use('common.NumberFormat')` | `Intl.NumberFormat` |
| `C is="Model.DataTable"` | `<TableFieldEditableTable />` (在 Dialog 中) |

### 7. 注意事项

1. **所有 table-* 类型的组件都设置为 disabled 状态**，只用于显示，不可编辑
2. **可编辑表格**（table-editable-table）会显示为一个可点击的元素，点击后弹出对话框显示完整表格
3. **附件上传**（table-upload）使用已迁移的 TableFieldUpload 组件的显示部分
4. **脚本渲染**保留了原有功能，但移除了对 xadmin 的依赖
5. **向后兼容**：如果没有提供 schema，ViewField 会使用旧逻辑（通过 type 查找 fieldMap）

### 8. 示例：完整的表单渲染

```tsx
import ViewField from '@/registry/components/view-field/view-field'

function UserDetail({ user }) {
  return (
    <div className="space-y-4">
      <ViewField
        name="name"
        label="姓名"
        value={user.name}
        schema={{ fieldType: 'text' }}
      />

      <ViewField
        name="age"
        label="年龄"
        value={user.age}
        schema={{
          fieldType: 'number',
          decimal: 0,
        }}
      />

      <ViewField
        name="status"
        label="状态"
        value={user.status}
        schema={{
          fieldType: 'select',
          enum1: ['active', 'inactive'],
          enum_title1: ['激活', '未激活'],
          enum_color1: ['#10b981', '#6b7280'],
        }}
      />

      <ViewField
        name="bio"
        label="简介"
        value={user.bio}
        schema={{ fieldType: 'textarea' }}
      />

      <ViewField
        name="createdAt"
        label="创建时间"
        value={user.createdAt}
        schema={{
          fieldType: 'date',
          filedFormat: 'YYYY-MM-DD HH:mm:ss',
        }}
      />

      <ViewField
        name="attachments"
        label="附件"
        value={user.attachments}
        schema={{ fieldType: 'attachment' }}
      />
    </div>
  )
}
```

## 文件路径

- 新版字段映射: `d:\work\workspace\new-ui\air-ui\src\registry\blocks\view\view-field\field-map.tsx`
- ViewField 组件: `d:\work\workspace\new-ui\air-ui\src\registry\blocks\view\view-field\view-field.tsx`
- TableField 组件目录: `d:\work\workspace\new-ui\air-ui\src\registry\blocks\table-field\`
