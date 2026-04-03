> **安装命令**: `npx shadcn@latest add @kesi/form-user-role`

# Form.UserRole 用户角色

## 简介

`FormUserRole` 是一个用户角色选择组件，支持从系统中加载并选择用户信息。

- **动态加载**：自动从后端 API 加载用户列表数据
- **单选模式**：支持单选用户模式（已实现）
- **多选模式**：支持多选用户模式（待实现）
- **字段映射**：可配置显示字段和关联字段
- **管理员过滤**：可选择是否过滤管理员账号

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `value` | `any` | 否 | - | 当前选中的用户对象 |
| `onChange` | `(value: any) => void` | 否 | - | 值变化回调 |
| `name` | `string` | 否 | `'user'` | 字段名，用于指定资源名称 |
| `displayField` | `string` | 否 | `'name'` | 显示字段名 |
| `showField` | `string` | 否 | - | 额外获取并展示的字段名 |
| `ignoreAdmin` | `boolean` | 否 | `false` | 是否忽略管理员账号 |
| `fieldSchema` | `object` | 否 | - | 字段 schema 配置 |
| `fieldSchema.enum` | `string[]` | 否 | - | 枚举值列表 |
| `fieldSchema.enum_title` | `string[]` | 否 | - | 枚举显示名列表 |
| `fieldSchema.enum1` | `string[]` | 否 | - | 二级枚举值列表 |
| `fieldSchema.enum_title1` | `string[]` | 否 | - | 二级枚举显示名列表 |
| `label` | `string` | 否 | `'用户'` | 标签文本 |
| `disabled` | `boolean` | 否 | `false` | 是否禁用 |
| `mode` | `'single' \| 'multiple'` | 否 | `'single'` | 选择模式 |

### FormUserRoleOption

用户选项的类型定义：

```typescript
interface FormUserRoleOption {
  value: string    // 用户 ID
  label: string    // 显示标签
  key: string      // 唯一标识
  item?: any       // 完整的用户对象
}
```

## 基本用法

### 1. 基础用户选择

使用默认配置选择用户。

```tsx
import { FormUserRole } from '@/components/kesi/form-user-role'
import { useState } from 'react'

function Example() {
  const [user, setUser] = useState(null)

  return (
    <FormUserRole
      value={user}
      onChange={setUser}
      name="user"
      displayField="name"
      label="用户"
    />
  )
}
```

### 2. 忽略管理员账号

过滤掉管理员账号，只显示普通用户。

```tsx
function Example() {
  const [user, setUser] = useState(null)

  return (
    <FormUserRole
      value={user}
      onChange={setUser}
      name="user"
      displayField="name"
      ignoreAdmin
      label="选择用户"
    />
  )
}
```

### 3. 自定义显示字段

使用不同的字段作为显示标签。

```tsx
function Example() {
  const [user, setUser] = useState(null)

  return (
    <FormUserRole
      value={user}
      onChange={setUser}
      name="user"
      displayField="username"
      label="用户名"
    />
  )
}
```

### 4. 禁用状态

禁用用户选择器，防止修改。

```tsx
function Example() {
  const [user] = useState({ id: 'user1', name: '张三' })

  return (
    <FormUserRole
      value={user}
      onChange={() => {}}
      name="user"
      displayField="name"
      disabled
    />
  )
}
```

### 5. 带额外字段

配置额外的显示字段。

```tsx
function Example() {
  const [user, setUser] = useState(null)

  return (
    <FormUserRole
      value={user}
      onChange={setUser}
      name="user"
      displayField="name"
      showField="department"
      label="用户"
    />
  )
}
```

## 完整示例

### 任务分配表单

分配任务给指定用户。

```tsx
import { FormUserRole } from '@/components/kesi/form-user-role'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'

function TaskAssignmentForm() {
  const [task, setTask] = useState({
    title: '',
    description: '',
    assignee: null
  })

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>任务标题</Label>
        <Input
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          placeholder="请输入任务标题"
        />
      </div>

      <div className="space-y-2">
        <Label>任务描述</Label>
        <Textarea
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          placeholder="请输入任务描述"
        />
      </div>

      <div className="space-y-2">
        <Label>分配给</Label>
        <FormUserRole
          value={task.assignee}
          onChange={(assignee) => setTask({ ...task, assignee })}
          name="user"
          displayField="name"
          showField="department"
          ignoreAdmin
          label="用户"
        />
      </div>

      {task.assignee && (
        <div className="p-3 bg-blue-50 rounded text-sm">
          已分配给：<strong>{task.assignee.name}</strong>
          {task.assignee.department && <span>（{task.assignee.department}）</span>}
        </div>
      )}
    </div>
  )
}
```

### 审批流程配置

配置审批流程的审批人。

```tsx
function ApprovalWorkflowForm() {
  const [approvers, setApprovers] = useState({
    firstLevel: null,
    secondLevel: null,
    finalLevel: null
  })

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>一级审批人</Label>
        <FormUserRole
          value={approvers.firstLevel}
          onChange={(user) => setApprovers({ ...approvers, firstLevel: user })}
          name="user"
          displayField="name"
          label="一级审批人"
        />
      </div>

      <div className="space-y-2">
        <Label>二级审批人</Label>
        <FormUserRole
          value={approvers.secondLevel}
          onChange={(user) => setApprovers({ ...approvers, secondLevel: user })}
          name="user"
          displayField="name"
          label="二级审批人"
        />
      </div>

      <div className="space-y-2">
        <Label>最终审批人</Label>
        <FormUserRole
          value={approvers.finalLevel}
          onChange={(user) => setApprovers({ ...approvers, finalLevel: user })}
          name="user"
          displayField="name"
          ignoreAdmin
          label="最终审批人"
        />
      </div>
    </div>
  )
}
```

### 团队成员管理

管理团队成员，显示完整的用户信息。

```tsx
function TeamMemberForm() {
  const [member, setMember] = useState({
    userId: null,
    role: ''
  })

  return (
    <div className="space-y-4">
      <FormUserRole
        value={member.userId}
        onChange={(user) => setMember({ ...member, userId: user })}
        name="user"
        displayField="name"
        showField="email"
        label="选择成员"
      />

      {member.userId && (
        <div className="p-4 border rounded space-y-2">
          <div><strong>姓名：</strong>{member.userId.name}</div>
          <div><strong>邮箱：</strong>{member.userId.email}</div>
          <div><strong>工号：</strong>{member.userId.id}</div>
        </div>
      )}
    </div>
  )
}
```

## 注意事项

1. **多选模式待实现**：当前版本中，`mode` 设置为 `'multiple'` 时会显示"用户多选（待实现）"占位文本，多选功能尚未实现。

2. **API 依赖**：组件依赖 `@airiot/client` 的 `createAPI` 方法，确保已正确配置和初始化。

3. **资源名称**：`name` 默认为 `'user'`，组件会拼接为 `'core/' + name` 作为资源路径，如果使用其他用户表，需要修改此配置。

4. **字段映射**：`displayField` 指定在下拉列表中显示的字段，默认为 `'name'`。可以根据实际需求修改为其他字段，如 `'username'`、`'nickname'` 等。

5. **加载时机**：用户列表在首次打开下拉菜单时加载，之后会缓存结果，避免重复请求。

6. **值格式**：`onChange` 返回的是完整的用户对象，而不是用户 ID，这使得后续处理更方便。

7. **管理员过滤**：当 `ignoreAdmin` 为 `true` 时，会过滤掉 `id` 为 `'admin'` 的用户，确保只显示普通用户。

8. **查询限制**：组件默认查询最多 100 条用户记录，如果用户数量超过此限制，需要修改组件源码中的 `limit` 参数。

9. **显示优先级**：组件优先显示 `value[displayField]`，如果不存在则显示 `value.id`，确保始终有内容显示。

10. **错误处理**：如果加载用户列表失败，组件会在控制台输出错误信息，并在下拉列表中显示"暂无数据"。
