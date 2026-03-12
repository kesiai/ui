## FormRadio - 单选框组件

### 导入路径
```tsx
import { FormRadio } from '@/components/airiot/form-radio/form-radio'
```

### 基础用法
```tsx
import { FormRadio } from '@/components/airiot/form-radio/form-radio'

function RadioExample() {
  const [gender, setGender] = useState('male')

  return (
    <FormRadio
      value={gender}
      onChange={setGender}
      options={[
        { label: '男', value: 'male' },
        { label: '女', value: 'female' }
      ]}
    />
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | string \| number | - | 当前值 |
| onChange | (value) => void | - | 变化回调 |
| options | Array<{ label: string, value: any }> | [] | 选项列表 |
| disabled | boolean | false | 是否禁用 |
| direction | 'horizontal' \| 'vertical' | 'horizontal' | 排列方向 |

### 示例
```tsx
import { FormRadio, FormItem, Card } from '@/components/airiot'

function UserForm() {
  const [gender, setGender] = useState('male')
  const [level, setLevel] = useState('basic')

  return (
    <Card cardTitle="用户信息">
      <FormItem label="性别">
        <FormRadio
          value={gender}
          onChange={setGender}
          options={[
            { label: '男', value: 'male' },
            { label: '女', value: 'female' }
          ]}
          direction="horizontal"
        />
      </FormItem>

      <FormItem label="会员等级">
        <FormRadio
          value={level}
          onChange={setLevel}
          options={[
            { label: '基础版', value: 'basic' },
            { label: '高级版', value: 'premium' },
            { label: '企业版', value: 'enterprise' }
          ]}
        />
      </FormItem>
    </Card>
  )
}
```

### 注意事项
- 同一组单选框互斥
- 支持水平和垂直布局
- 可以配合 FormItem 使用