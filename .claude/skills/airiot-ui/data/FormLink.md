## FormLink - 链接输入组件

### 导入路径
```tsx
import { FormLink } from '@/components/airiot/form-link/form-link'
```

### 基础用法
```tsx
import { FormLink } from '@/components/airiot/form-link/form-link'

function LinkExample() {
  const [url, setUrl] = useState('')

  return (
    <FormLink
      value={url}
      onChange={setUrl}
      placeholder="https://example.com"
      validate={true}
    />
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | string | - | 链接值 |
| onChange | (value) => void | - | 变化回调 |
| placeholder | string | '请输入链接' | 占位符 |
| validate | boolean | true | 是否验证 |
| protocols | Array | ['http', 'https', 'ftp'] | 允许的协议 |

### 示例
```tsx
import { FormLink, FormItem, Card, Space } from '@/components/airiot'

function LinkInputDemo() {
  const [website, setWebsite] = useState('')
  const [github, setGithub] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = () => {
    console.log('提交链接:', {
      website,
      github,
      email
    })
  }

  return (
    <Card cardTitle="链接信息">
      <Space direction="vertical" style={{ width: '100%' }}>
        <FormItem label="网站地址">
          <FormLink
            value={website}
            onChange={setWebsite}
            placeholder="https://example.com"
            validate={true}
            protocols={['http', 'https']}
          />
          {website && (
            <div style={{ marginTop: 4 }}>
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#1890ff' }}
              >
                访问网站 →
              </a>
            </div>
          )}
        </FormItem>

        <FormItem label="GitHub仓库">
          <FormLink
            value={github}
            onChange={setGithub}
            placeholder="https://github.com/username/repo"
            validate={true}
            protocols={['https']}
            pattern="github\\.com"
          />
          {github && (
            <div style={{ marginTop: 4 }}>
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#1890ff' }}
              >
                打开GitHub →
              </a>
            </div>
          )}
        </FormItem>

        <FormItem label="邮箱地址">
          <FormLink
            value={email}
            onChange={setEmail}
            placeholder="mailto:example@email.com"
            validate={true}
            protocols={['mailto']}
          />
          {email && (
            <div style={{ marginTop: 4 }}>
              <a
                href={email}
                style={{ color: '#1890ff' }}
              >
                发送邮件 →
              </a>
            </div>
          )}
        </FormItem>

        <div style={{ textAlign: 'right' }}>
          <button
            onClick={handleSubmit}
            disabled={!website || !github || !email}
            style={{
              padding: '8px 16px',
              background: (!website || !github || !email) ? '#ccc' : '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: (!website || !github || !email) ? 'not-allowed' : 'pointer'
            }}
          >
            保存链接
          </button>
        </div>
      </Space>
    </Card>
  )
}
```

### 支持的协议
- http:// - HTTP协议
- https:// - HTTPS协议
- ftp:// - FTP协议
- mailto: - 邮件链接
- tel: - 电话链接

### 验证规则
- URL格式验证
- 协议检查
- 域名格式
- 特定模式匹配

### 注意事项
- 自动添加协议前缀
- 支持自定义验证规则
- 可以预览链接内容