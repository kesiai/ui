# My Component Library

自定义组件库，兼容 shadcn-ui CLI 工作流。

## 📖 目录

- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [使用方法](#使用方法)
- [可用命令](#可用命令)
- [添加新组件](#添加新组件)
- [示例组件](#示例组件-mybutton)
- [测试](#测试)
- [技术栈](#技术栈)
- [生产环境部署](#生产环境部署)

---

## 🚀 快速开始

### 1. 安装依赖

```bash
cd my-component-library
npm install
```

### 2. 启动本地 Registry 服务器

```bash
npm run registry:dev
```

服务器将在 `http://localhost:3001` 启动。

### 3. 在其他项目中使用组件

#### a. 初始化 shadcn-ui（如果还没有）

```bash
npx shadcn@latest init
```

#### b. 配置自定义 registry

编辑项目中的 `components.json`，添加或修改 `registry` 字段：

```json
{
  "registry": "http://localhost:3001/api/registry"
}
```

#### c. 安装你的组件

```bash
npx shadcn@latest add my-button
```

组件将被安装到你的项目的 `@/components/ui` 目录。

---

## 📁 项目结构

```
my-component-library/
├── src/
│   ├── components/
│   │   ├── ui/                  # UI 组件源码
│   │   │   ├── __tests__/       # 组件测试
│   │   │   └── my-button.tsx
│   │   └── index.ts             # 组件导出入口
│   └── lib/
│       ├── __tests__/           # 工具函数测试
│       ├── utils.ts             # 工具函数
│       └── index.ts             # 工具函数导出
├── registry/                    # shadcn-ui 兼容的 registry 配置
│   └── my-button.json
├── cli/
│   └── server.ts                # 本地 registry 服务器
├── config/                      # 组件库配置
├── components.json              # shadcn-ui 配置文件
├── vitest.config.ts             # 测试配置
└── package.json
```

---

## 💻 使用方法

### 在项目中使用组件

安装完成后，直接导入使用：

```tsx
import { MyButton } from "@/components/ui/my-button"

export default function Page() {
  return (
    <MyButton variant="default" size="default">
      点击我
    </MyButton>
  )
}
```

### API 端点

| 端点 | 说明 |
|------|------|
| `GET /api/registry` | 列出所有组件 |
| `GET /api/registry/:name` | 获取特定组件 |

---

## ⚡ 可用命令

### Registry 服务器

```bash
npm run registry:dev    # 启动 registry 服务器
```

### 测试命令

```bash
npm test                # 运行测试（监听模式）
npm run test:run        # 运行所有测试
npm run test:ui         # 打开测试 UI 界面
npm run test:coverage   # 生成覆盖率报告
```

### 开发命令

```bash
npm run dev             # 启动开发服务器
npm run build           # 构建项目
npm run lint            # 代码检查
npm run type-check      # TypeScript 类型检查
```

---

## ➕ 添加新组件

### 1. 创建组件源码

在 `src/components/ui/` 中创建你的组件，例如 `my-card.tsx`：

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

interface MyCardProps {
  title: string
  children: React.ReactNode
  className?: string
}

export const MyCard = React.forwardRef<HTMLDivElement, MyCardProps>(
  ({ title, children, className }, ref) => {
    return (
      <div ref={ref} className={cn("rounded-lg border p-6", className)}>
        <h3 className="text-lg font-semibold">{title}</h3>
        {children}
      </div>
    )
  }
)

MyCard.displayName = "MyCard"
```

### 2. 创建组件测试

在 `src/components/ui/__tests__/` 创建测试文件：

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MyCard } from '../my-card'

describe('MyCard', () => {
  it('renders title correctly', () => {
    render(<MyCard title="Test Title">Content</MyCard>)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })
})
```

### 3. 创建 registry 配置

在 `registry/` 目录中创建对应的 JSON 文件，例如 `my-card.json`：

```json
{
  "name": "my-card",
  "type": "components:ui",
  "registryDependencies": [],
  "files": [
    {
      "path": "src/components/ui/my-card.tsx",
      "content": "你的组件源码字符串",
      "type": "components:ui"
    }
  ]
}
```

### 4. 重启 registry 服务器

```bash
npm run registry:dev
```

### 5. 安装新组件

```bash
npx shadcn@latest add my-card
```

---

## 🎨 示例组件：MyButton

已包含的 MyButton 组件支持多种样式和尺寸。

### Variants（样式变体）

- `default` - 默认样式
- `destructive` - 危险操作样式
- `outline` - 轮廓样式
- `secondary` - 次要样式
- `ghost` - 幽灵样式
- `link` - 链接样式

### Sizes（尺寸变体）

- `default` - 默认大小
- `sm` - 小尺寸
- `lg` - 大尺寸
- `icon` - 图标按钮

### 使用示例

```tsx
import { MyButton } from "@/components/ui/my-button"

// 基础用法
<MyButton>默认按钮</MyButton>

// 不同样式
<MyButton variant="outline">轮廓按钮</MyButton>
<MyButton variant="ghost">幽灵按钮</MyButton>
<MyButton variant="destructive">删除</MyButton>

// 不同尺寸
<MyButton size="sm">小按钮</MyButton>
<MyButton size="lg">大按钮</MyButton>

// 组合使用
<MyButton variant="outline" size="lg" disabled>
  禁用的大按钮
</MyButton>

// 带事件处理
<MyButton onClick={() => alert('Clicked!')}>
  点击我
</MyButton>
```

---

## 🧪 测试

项目包含完整的测试套件，确保组件质量和稳定性。

### 运行测试

```bash
# 运行所有测试（监听模式）
npm test

# 运行所有测试（一次性）
npm run test:run

# 运行测试并打开 UI 界面
npm run test:ui

# 运行测试并生成覆盖率报告
npm run test:coverage
```

### 测试覆盖

- ✅ **MyButton 组件**: 19 个测试用例
  - 渲染测试
  - 样式变体测试（6 种 variant）
  - 尺寸变体测试（4 种 size）
  - 交互和事件处理测试
  - 状态测试（禁用、聚焦等）

- ✅ **工具函数**: 12 个测试用例
  - cn 函数的各种场景
  - Tailwind 类名冲突处理
  - 边界情况处理

### 测试覆盖率

```
File            | % Stmts | % Branch | % Funcs | % Lines |
----------------|---------|----------|---------|---------|
All files       |     100 |      100 |     100 |     100 |
 components/ui  |     100 |      100 |     100 |     100 |
  my-button.tsx |     100 |      100 |     100 |     100 |
 lib            |     100 |      100 |     100 |     100 |
  utils.ts      |     100 |      100 |     100 |     100 |
```

### 查看测试文档

详细的测试指南请参考 [TESTING.md](./TESTING.md)。

---

## 🛠️ 技术栈

### 核心技术

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式

### 工具库

- **class-variance-authority** - 组件变体管理
- **clsx** - 条件类名
- **tailwind-merge** - 样式合并

### 开发工具

- **Vite** - 构建工具
- **Vitest** - 测试框架
- **React Testing Library** - 组件测试
- **ESLint** - 代码检查
- **TypeScript** - 类型检查

### Registry 服务器

- **Express** - Web 服务器
- **tsx** - TypeScript 执行

---

## 🚀 生产环境部署

### 1. 部署 Registry 服务器

将 `cli/server.ts` 部署到你的服务器，使用真实的域名。

例如部署到 `https://registry.yourdomain.com`

### 2. 更新 components.json

```json
{
  "registry": "https://registry.yourdomain.com/api/registry"
}
```

### 3. 发布到 npm（可选）

如果你想通过 npm 分发组件：

```bash
npm publish
```

然后在其他项目中安装：

```bash
npm install my-component-library
```

---

## 📄 License

MIT
