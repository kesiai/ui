# Render 文件下载卡片 (FileDownloadCard)

AI 创建/生成文件后，用于展示下载卡的组件。**禁止用纯文本给文件路径**。

## 基本用法

```tsx
import { FileDownloadCard } from "@/registry/components/render-file-download-card"

<FileDownloadCard
  agentId="your-agent-id"
  filePath="users/admin/deliver/hello.txt"
  fileName="hello.txt"
  fileSize="1 KB"
/>
```

## Props

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `agentId` | `string` | 是 | 智能体 ID（render 协议中由前端自动注入，AI 无需填写） |
| `filePath` | `string` | 是 | 工作区根目录下的相对路径（如 `users/admin/deliver/hello.txt`），不带前缀 |
| `fileName` | `string` | 否 | 下载文件名，缺省取 filePath 末段 |
| `fileSize` | `string` | 否 | 文件大小展示 |

## RenderRegistry 条目

组件自含 `RenderRegistry` 注册信息（component + description + schema + rules），
供 ai-agent 的 render 标签协议识别。

```ts
import { RenderRegistry } from "@/registry/components/render-file-download-card"
```

## 下载行为

点击「下载」按钮，访问：
`/rest/eap/agents/{agentId}/workspace/file/download?path={cleanPath}`

自动携带认证头（token / projectId），并清洗掉 AI 误加的绝对路径前缀。
