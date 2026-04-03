> **安装命令**: `npx shadcn@latest add @kesi/form-serial-number`

# Form.SerialNumber 序列号

## 简介

`FormSerialNumber` 是一个自动生成序列号的表单组件，通常用于唯一标识符的自动生成和显示。

- **自动生成**：序列号由系统自动生成，无需手动输入
- **只读显示**：默认禁用输入，仅用于展示序列号
- **灵活配置**：支持自定义序列号生成规则（文本、时间、数字）
- **视觉区分**：使用灰色背景标识只读状态
- **简洁实用**：界面简洁，专注于序列号显示

## Props 参数说明

继承自 `BaseFormFieldProps`（`value` 被重写为 `string` 类型）。

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `value` | `string` | 否 | - | 当前值 |
| `disabled` | `boolean` | 否 | `true` | 是否禁用（默认禁用） |
| `onChange` | `(value: any) => void` | 否 | - | 值变更回调（继承自 BaseFormFieldProps） |
| `onBlur` | `() => void` | 否 | - | 失焦回调（继承自 BaseFormFieldProps） |
| `name` | `string` | 否 | - | 字段名（继承自 BaseFormFieldProps） |
| `ref` | `Ref<any>` | 否 | - | ref 引用（继承自 BaseFormFieldProps） |
| `id` | `string` | 否 | - | 字段 ID（继承自 BaseFormFieldProps） |
| `schema` | `Record<string, any>` | 否 | - | 表单 schema（继承自 BaseFormFieldProps） |
| `record` | `any` | 否 | - | 表单记录数据（继承自 BaseFormFieldProps） |

## 基本用法

### 1. 基础序列号显示

最简单的用法，显示一个自动生成的序列号。

```tsx
import { FormSerialNumber } from '@/components/kesi/form-serial-number/form-serial-number'

function Example() {
  const [serialNumber, setSerialNumber] = useState('SN-20240210-0001')

  return (
    <FormSerialNumber
      value={serialNumber}
      onChange={setSerialNumber}
    />
  )
}
```

### 2. 使用默认禁用状态

序列号默认禁用，只用于显示。

```tsx
function Example() {
  const serialNumber = 'SN-20240210-0001'

  return (
    <FormSerialNumber value={serialNumber} />
  )
}
```

### 3. 启用编辑状态

特殊情况下可以启用编辑（不推荐）。

```tsx
function Example() {
  const [serialNumber, setSerialNumber] = useState('SN-20240210-0001')

  return (
    <FormSerialNumber
      value={serialNumber}
      onChange={setSerialNumber}
      disabled={false}
    />
  )
}
```

### 4. 在表单中使用

配合表单使用，自动生成序列号。

```tsx
function Example() {
  const [formData, setFormData] = useState({
    serialNumber: '',
    name: '',
    quantity: 0
  })

  // 模拟自动生成序列号
  React.useEffect(() => {
    const serial = `SN-${Date.now()}-${Math.floor(Math.random() * 10000)}`
    setFormData(prev => ({ ...prev, serialNumber: serial }))
  }, [])

  return (
    <form>
      <FormSerialNumber
        value={formData.serialNumber}
        onChange={(value) => setFormData(prev => ({ ...prev, serialNumber: value }))}
      />
      {/* 其他表单字段 */}
    </form>
  )
}
```

### 5. 只读查看模式

在查看页面中显示序列号。

```tsx
function Example() {
  const serialNumber = 'SN-20240210-0001'

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">序列号</label>
      <FormSerialNumber value={serialNumber} />
    </div>
  )
}
```

### 6. 批量生成序列号

为多个项目生成序列号。

```tsx
function Example() {
  const [items, setItems] = useState([
    { id: 1, serialNumber: '' },
    { id: 2, serialNumber: '' },
    { id: 3, serialNumber: '' }
  ])

  React.useEffect(() => {
    const generateSerials = () => {
      setItems(prevItems => prevItems.map((item, index) => ({
        ...item,
        serialNumber: `SN-${Date.now()}-${String(index + 1).padStart(4, '0')}`
      })))
    }
    generateSerials()
  }, [])

  return (
    <div className="space-y-4">
      {items.map(item => (
        <div key={item.id}>
          <label>项目 {item.id}</label>
          <FormSerialNumber value={item.serialNumber} />
        </div>
      ))}
    </div>
  )
}
```

## 完整示例

### 订单管理系统序列号生成

创建一个完整的订单管理系统，自动生成订单序列号。

```tsx
import { FormSerialNumber } from '@/components/kesi/form-serial-number/form-serial-number'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function OrderForm() {
  const [order, setOrder] = useState({
    serialNumber: '',
    customerName: '',
    product: '',
    quantity: 1,
    totalAmount: 0
  })

  const [orders, setOrders] = useState<any[]>([])
  const [orderCount, setOrderCount] = useState(0)

  // 自动生成订单序列号
  useEffect(() => {
    const date = new Date()
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
    const serial = `ORD-${dateStr}-${String(orderCount + 1).padStart(4, '0')}`
    setOrder(prev => ({ ...prev, serialNumber: serial }))
  }, [orderCount])

  const handleSubmit = () => {
    if (!order.customerName || !order.product) {
      alert('请填写完整的订单信息')
      return
    }

    setOrders([...orders, { ...order, createdAt: new Date() }])
    setOrderCount(prev => prev + 1)

    // 重置表单
    setOrder({
      serialNumber: '',
      customerName: '',
      product: '',
      quantity: 1,
      totalAmount: 0
    })
  }

  return (
    <div className="space-y-6 p-6 border rounded-lg">
      <h2 className="text-xl font-semibold">订单管理系统</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-2">
          <label className="text-sm font-medium">订单序列号</label>
          <FormSerialNumber
            value={order.serialNumber}
            onChange={(value) => setOrder(prev => ({ ...prev, serialNumber: value }))}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">客户名称</label>
          <Input
            value={order.customerName}
            onChange={(e) => setOrder({ ...order, customerName: e.target.value })}
            placeholder="请输入客户名称"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">产品名称</label>
          <Input
            value={order.product}
            onChange={(e) => setOrder({ ...order, product: e.target.value })}
            placeholder="请输入产品名称"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">数量</label>
          <Input
            type="number"
            value={order.quantity}
            onChange={(e) => setOrder({ ...order, quantity: parseInt(e.target.value) || 0 })}
            min="1"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">总金额</label>
          <Input
            type="number"
            value={order.totalAmount}
            onChange={(e) => setOrder({ ...order, totalAmount: parseFloat(e.target.value) || 0 })}
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <Button onClick={handleSubmit} className="w-full">
        创建订单
      </Button>

      {orders.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">已创建的订单</h3>
          <div className="space-y-2">
            {orders.map((o, index) => (
              <div key={index} className="p-3 bg-slate-50 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{o.serialNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {o.customerName} - {o.product} x {o.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">¥{o.totalAmount.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(o.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

### 产品批次序列号生成器

创建一个产品批次管理界面，自动生成批次序列号。

```tsx
import { FormSerialNumber } from '@/components/kesi/form-serial-number/form-serial-number'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'

interface Batch {
  serialNumber: string
  productLine: string
  productionDate: string
  quantity: number
  status: 'pending' | 'in-progress' | 'completed'
}

function BatchProductionManager() {
  const [batches, setBatches] = useState<Batch[]>([])
  const [currentBatch, setCurrentBatch] = useState<Partial<Batch>>({
    productLine: '',
    productionDate: new Date().toISOString().split('T')[0],
    quantity: 0,
    status: 'pending'
  })

  const [batchCounter, setBatchCounter] = useState(0)

  // 生成批次序列号
  useEffect(() => {
    if (currentBatch.productLine) {
      const date = new Date()
      const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
      const lineCode = currentBatch.productLine.substring(0, 3).toUpperCase()
      const serial = `BATCH-${lineCode}-${dateStr}-${String(batchCounter + 1).padStart(4, '0')}`
      setCurrentBatch(prev => ({ ...prev, serialNumber: serial }))
    }
  }, [batchCounter, currentBatch.productLine])

  const createBatch = () => {
    if (!currentBatch.productLine || !currentBatch.quantity) {
      alert('请填写完整的批次信息')
      return
    }

    setBatches([...batches, currentBatch as Batch])
    setBatchCounter(prev => prev + 1)
    setCurrentBatch({
      productLine: currentBatch.productLine,
      productionDate: new Date().toISOString().split('T')[0],
      quantity: 0,
      status: 'pending'
    })
  }

  const updateStatus = (index: number, status: Batch['status']) => {
    const updatedBatches = [...batches]
    updatedBatches[index].status = status
    setBatches(updatedBatches)
  }

  return (
    <div className="space-y-6 p-6 border rounded-lg">
      <h2 className="text-xl font-semibold">产品批次管理</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-2">
          <label className="text-sm font-medium">批次序列号</label>
          <FormSerialNumber
            value={currentBatch.serialNumber || ''}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">产品线</label>
          <select
            className="w-full px-3 py-2 border rounded"
            value={currentBatch.productLine}
            onChange={(e) => setCurrentBatch({ ...currentBatch, productLine: e.target.value })}
          >
            <option value="">选择产品线</option>
            <option value="电子产品">电子产品</option>
            <option value="机械设备">机械设备</option>
            <option value="化工产品">化工产品</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">生产日期</label>
          <input
            type="date"
            className="w-full px-3 py-2 border rounded"
            value={currentBatch.productionDate}
            onChange={(e) => setCurrentBatch({ ...currentBatch, productionDate: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">数量</label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded"
            value={currentBatch.quantity}
            onChange={(e) => setCurrentBatch({ ...currentBatch, quantity: parseInt(e.target.value) || 0 })}
            min="1"
          />
        </div>

        <div className="flex items-end">
          <Button onClick={createBatch} className="w-full">
            创建批次
          </Button>
        </div>
      </div>

      {batches.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">批次列表</h3>
          <div className="space-y-2">
            {batches.map((batch, index) => (
              <div key={index} className="p-4 border rounded">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{batch.serialNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {batch.productLine} | {batch.productionDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{batch.quantity} 件</p>
                    <select
                      className="text-xs border rounded px-2 py-1"
                      value={batch.status}
                      onChange={(e) => updateStatus(index, e.target.value as Batch['status'])}
                    >
                      <option value="pending">待生产</option>
                      <option value="in-progress">生产中</option>
                      <option value="completed">已完成</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

## 注意事项

1. **默认禁用**：序列号组件默认禁用，因为序列号通常由系统自动生成，不应手动修改。

2. **自动生成**：实际应用中，序列号应该在创建新记录时由后端或前端逻辑自动生成，而不是用户输入。

3. **唯一性**：确保序列号的唯一性，通常结合时间戳、随机数或递增计数器来生成。

4. **格式规范**：定义清晰的序列号格式规范，便于识别和管理（如：`前缀-日期-序号`）。

5. **只读显示**：在大多数情况下，序列号应该保持只读状态，仅用于显示和标识。

6. **性能考虑**：批量生成序列号时注意性能，避免在循环中执行高开销操作。

7. **并发安全**：在高并发场景下，序列号生成需要考虑线程安全和去重问题。

8. **存储格式**：序列号作为字符串存储，确保数据库字段类型匹配。
