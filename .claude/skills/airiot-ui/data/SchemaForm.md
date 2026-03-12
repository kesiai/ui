## SchemaForm - 表单生成器组件

### 导入路径
```tsx
import { SchemaForm } from '@/components/airiot/schema-form/schema-form'
```

### 基础用法
```tsx
import { SchemaForm } from '@/components/airiot/schema-form/schema-form'

function SchemaExample() {
  const schema = {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        title: '用户名',
        required: true
      },
      age: {
        type: 'number',
        title: '年龄',
        minimum: 18
      },
      email: {
        type: 'string',
        title: '邮箱',
        format: 'email'
      }
    }
  }

  const [formData, setFormData] = useState({})

  return (
    <SchemaForm
      schema={schema}
      value={formData}
      onChange={setFormData}
      layout="vertical"
    />
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| schema | object | - | JSON Schema配置 |
| value | object | {} | 表单值 |
| onChange | (value) => void | - | 值变化回调 |
| layout | 'vertical' \| 'horizontal' | 'vertical' | 布局方式 |
| uiSchema | object | {} | UI配置 |

### 示例
```tsx
import { SchemaForm, Button, Card } from '@/components/airiot'

function UserSchemaForm() {
  const schema = {
    type: 'object',
    title: '用户信息',
    properties: {
      basic: {
        type: 'object',
        title: '基本信息',
        properties: {
          name: {
            type: 'string',
            title: '姓名',
            required: true
          },
          age: {
            type: 'number',
            title: '年龄',
            minimum: 18,
            maximum: 100
          },
          gender: {
            type: 'string',
            title: '性别',
            enum: ['male', 'female'],
            enumNames: ['男', '女']
          }
        }
      },
      contact: {
        type: 'object',
        title: '联系方式',
        properties: {
          email: {
            type: 'string',
            title: '邮箱',
            format: 'email'
          },
      phone: {
            type: 'string',
            title: '手机号',
            pattern: '^1[3-9]\\d{9}$'
          }
        }
      }
    }
  }

  const uiSchema = {
    basic: {
      'ui:order': ['name', 'gender', 'age'],
      age: {
        'ui:widget': 'updown'
      }
    },
    contact: {
      email: {
        'ui:placeholder': '请输入邮箱地址'
      },
      phone: {
        'ui:widget': 'tel'
      }
    }
  }

  const [formData, setFormData] = useState({})

  const handleSubmit = () => {
    console.log('提交数据:', formData)
  }

  return (
    <Card cardTitle="用户注册表单">
      <SchemaForm
        schema={schema}
        uiSchema={uiSchema}
        value={formData}
        onChange={setFormData}
        layout="vertical"
      />

      <div style={{ textAlign: 'right', marginTop: 16 }}>
        <Button
          type="primary"
          onClick={handleSubmit}
          disabled={Object.keys(formData).length === 0}
        >
          提交
        </Button>
      </div>
    </Card>
  )
}
```

### Schema 配置
- type: 字段类型 (string, number, boolean, array, object)
- title: 显示标题
- required: 是否必填
- minimum/maximum: 数值范围
- enum: 枚举值
- pattern: 正则表达式
- format: 格式验证

### 支持的字段类型
- 字符串: input, textarea, select
- 数字: input-number, range
- 布尔: checkbox, switch, radio
- 数组: checkboxes, select-multiple

### 注意事项
- 支持嵌套对象
- 动态表单生成
- 自定义UI组件
- 实时验证