## FormInputNumber - 数字输入框组件

### 导入路径
```tsx
import { FormInputNumber } from '@/components/airiot/form-input-number/form-input-number'
```

### 基础用法
```tsx
import { FormInputNumber } from '@/components/airiot/form-input-number/form-input-number'

function InputNumberExample() {
  const [value, setValue] = useState(0)

  return (
    <FormInputNumber
      value={value}
      onChange={setValue}
      min={0}
      max={100}
      step={1}
    />
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | number | - | 当前值 |
| onChange | (value) => void | - | 变化回调 |
| min | number | - | 最小值 |
| max | number | - | 最大值 |
| step | number | 1 | 步长 |
| precision | number | 0 | 精度 |
| disabled | boolean | false | 是否禁用 |

### 示例
```tsx
import { FormInputNumber, FormItem, Card, Space } from '@/components/airiot'

function NumberInputDemo() {
  const [quantity, setQuantity] = useState(1)
  const [price, setPrice] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [taxRate, setTaxRate] = useState(0)

  const subtotal = () => quantity * price
  const discountAmount = () => subtotal() * (discount / 100)
  const taxAmount = () => (subtotal() - discountAmount()) * (taxRate / 100)
  const total = () => subtotal() - discountAmount() + taxAmount()

  return (
    <Card cardTitle="订单计算器">
      <Space direction="vertical" style={{ width: '100%' }}>
        <FormItem label="商品数量">
          <FormInputNumber
            value={quantity}
            onChange={setQuantity}
            min={1}
            max={1000}
            step={1}
          />
        </FormItem>

        <FormItem label="单价">
          <FormInputNumber
            value={price}
            onChange={setPrice}
            min={0}
            precision={2}
            step={0.01}
            style={{ width: 150 }}
          />
        </FormItem>

        <FormItem label="折扣 (%)">
          <FormInputNumber
            value={discount}
            onChange={setDiscount}
            min={0}
            max={100}
            step={1}
            addonAfter="%"
          />
        </FormItem>

        <FormItem label="税率 (%)">
          <FormInputNumber
            value={taxRate}
            onChange={setTaxRate}
            min={0}
            max={20}
            step={0.1}
            precision={1}
            addonAfter="%"
          />
        </FormItem>

        <div style={{
          padding: 16,
          background: '#f5f5f5',
          borderRadius: 8,
          marginTop: 16
        }}>
          <h4>订单明细：</h4>
          <p>小计: ¥{subtotal().toFixed(2)}</p>
          <p>折扣: -¥{discountAmount().toFixed(2)}</p>
          <p>税费: ¥{taxAmount().toFixed(2)}</p>
          <hr style={{ margin: '8px 0' }} />
          <p style={{ fontSize: 16, fontWeight: 'bold' }}>
            总计: ¥{total().toFixed(2)}
          </p>
        </div>
      </Space>
    </Card>
  )
}
```

### 功能特性
- 支持键盘输入
- 支持按钮增减
- 自动格式化数字
- 支持前缀/后缀

### 数字格式
- 整数: 12345
- 小数: 123.45
- 货币: ¥123.45
- 百分比: 12.3%

### 注意事项
- 自动去除非法字符
- 支持步长调整
- 可以限制输入范围