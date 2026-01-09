# 测试指南

完整的测试文档，包含测试配置、覆盖率报告和最佳实践。

## 📖 目录

- [测试概览](#测试概览)
- [运行测试](#运行测试)
- [测试统计](#测试统计)
- [测试覆盖](#测试覆盖)
- [编写测试](#编写测试)
- [测试最佳实践](#测试最佳实践)
- [覆盖率报告](#覆盖率报告)
- [常见问题](#常见问题)

---

## 🎯 测试概览

项目使用 Vitest 和 React Testing Library 进行测试，确保组件质量和稳定性。

### 测试技术栈

- **Vitest** - 快速的测试框架
- **React Testing Library** - 组件测试
- **@testing-library/user-event** - 用户交互模拟
- **@testing-library/jest-dom** - DOM 断言
- **@vitest/coverage-v8** - 覆盖率报告

### 测试配置

测试配置位于 `vitest.config.ts` 和 `test/setup.ts`。

---

## 🚀 运行测试

### 基本命令

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

### 运行特定测试

```bash
# 运行特定测试文件
npm test -- my-button.test

# 运行匹配的测试
npm test -- --grep "button"
```

---

## 📊 测试统计

### 当前测试状态

- **测试文件**: 2 个
- **测试用例**: 31 个
- **通过率**: 100% ✅
- **执行时间**: < 1 秒

### 测试分布

```
Test Files             Tests
  ✓ my-button.test.tsx    19    (128ms)
  ✓ utils.test.ts         12    (5ms)
```

---

## 📈 测试覆盖

### 1. MyButton 组件测试 (19 个测试)

**文件**: `src/components/ui/__tests__/my-button.test.tsx`

#### ✅ 渲染测试
- 正确渲染子元素
- 正确渲染文本内容

#### ✅ 样式变体测试
- `default` 变体
- `destructive` 变体
- `outline` 变体
- `secondary` 变体
- `ghost` 变体
- `link` 变体

#### ✅ 尺寸变体测试
- `default` 尺寸
- `sm` 尺寸
- `lg` 尺寸
- `icon` 尺寸

#### ✅ 功能测试
- HTML 属性传递
- 点击事件处理
- 聚焦功能
- ref 转发
- 自定义 className 合并

#### ✅ 状态测试
- 禁用状态
- 可见焦点状态
- 变体和尺寸组合

### 2. 工具函数测试 (12 个测试)

**文件**: `src/lib/__tests__/utils.test.ts`

#### ✅ cn 函数测试
- 合并多个类名
- 处理 undefined 和 null
- 移除冲突的 Tailwind 类
- 处理数组类名
- 处理对象条件类名
- 组合多种输入类型
- 处理空输入
- 复杂 Tailwind 冲突
- 最后类名优先
- 响应式变体
- 重要类名

---

## 💻 代码覆盖率

### 覆盖率统计

```
File            | % Stmts | % Branch | % Funcs | % Lines |
----------------|---------|----------|---------|---------|
All files       |     100 |      100 |     100 |     100 |
 components/ui  |     100 |      100 |     100 |     100 |
  my-button.tsx |     100 |      100 |     100 |     100 |
 lib            |     100 |      100 |     100 |     100 |
  utils.ts      |     100 |      100 |     100 |     100 |
```

### 覆盖率指标说明

| 指标 | 说明 | 当前状态 |
|------|------|----------|
| **语句覆盖率** | 执行的代码语句百分比 | ✅ 100% |
| **分支覆盖率** | 执行的代码分支（if/else）百分比 | ✅ 100% |
| **函数覆盖率** | 调用的函数百分比 | ✅ 100% |
| **行覆盖率** | 执行的代码行百分比 | ✅ 100% |

### 查看覆盖率报告

1. 生成覆盖率报告：
```bash
npm run test:coverage
```

2. 在浏览器中打开：
```bash
# macOS
open coverage/index.html

# Linux
xdg-open coverage/index.html

# Windows
start coverage/index.html
```

3. 查看 HTML 报告：
   - 绿色背景：已覆盖的代码
   - 红色背景：未被测试覆盖
   - 可点击文件查看详细覆盖情况

---

## ✍️ 编写测试

### 组件测试示例

在 `src/components/ui/__tests__/` 创建测试文件：

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MyComponent } from '../my-component'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent>Test</MyComponent>)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<MyComponent onClick={handleClick}>Click me</MyComponent>)

    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies variant classes', () => {
    render(<MyComponent variant="outline">Test</MyComponent>)
    const element = screen.getByText('Test')
    expect(element).toHaveClass('border')
  })
})
```

### 工具函数测试示例

在 `src/lib/__tests__/` 创建测试文件：

```typescript
import { describe, it, expect } from 'vitest'
import { myUtil } from '../my-util'

describe('myUtil', () => {
  it('should return correct result', () => {
    expect(myUtil('input')).toBe('expected output')
  })

  it('should handle edge cases', () => {
    expect(myUtil('')).toBe('')
    expect(myUtil(null)).toBe(null)
  })
})
```

### 测试文件命名

- 测试文件应与源文件同名
- 使用 `.test.ts` 或 `.test.tsx` 后缀
- 放在 `__tests__` 目录中

```
src/
├── components/ui/
│   ├── my-button.tsx
│   └── __tests__/
│       └── my-button.test.tsx
└── lib/
    ├── utils.ts
    └── __tests__/
        └── utils.test.ts
```

---

## 🎯 测试最佳实践

### ✅ DO

1. **测试用户可见的行为**
   ```tsx
   // ✅ 好
   expect(screen.getByRole('button')).toHaveTextContent('Submit')

   // ❌ 差
   expect(component.state.isOpen).toBe(true)
   ```

2. **使用语义化选择器**
   ```tsx
   // ✅ 最好
   screen.getByRole('button')
   screen.getByLabelText('Username')

   // ✅ 可接受
   screen.getByText('Submit')

   // ❌ 避免
   screen.getByTestId('submit-button')
   ```

3. **使用 userEvent 模拟用户交互**
   ```tsx
   // ✅ 好
   await user.click(button)
   await user.type(input, 'text')

   // ❌ 差
   fireEvent.click(button)
   ```

4. **保持测试简单和独立**
   ```tsx
   // ✅ 好 - 每个测试只验证一个功能
   it('renders button', () => {
    render(<MyButton />)
    expect(screen.getByRole('button')).toBeInTheDocument()
   })

   // ❌ 差 - 一个测试验证太多功能
   it('renders and works', () => {
    render(<MyButton />)
    // ... 20 行测试代码
   })
   ```

5. **使用描述性的测试名称**
   ```tsx
   // ✅ 好
   it('should disable button when disabled prop is true', () => {})

   // ❌ 差
   it('test', () => {})
   ```

### ❌ DON'T

1. **不要测试 CSS 类名**
   ```tsx
   // ❌ 差
   expect(button).toHaveClass('bg-blue-500')

   // ✅ 好 - 测试行为
   expect(button).toBeEnabled()
   ```

2. **不要测试内部实现细节**
   ```tsx
   // ❌ 差
   expect(component.instance().handleClick).toHaveBeenCalled()

   // ✅ 好 - 测试用户可见的结果
   expect(screen.getByText('Success')).toBeInTheDocument()
   ```

3. **不要过度使用 getByTestId**
   ```tsx
   // ❌ 差
   screen.getByTestId('submit-button')

   // ✅ 好
   screen.getByRole('button', { name: 'Submit' })
   ```

---

## 🔧 调试测试

### 1. 使用 UI 模式

```bash
npm run test:ui
```

在浏览器中查看测试结果和调试。

### 2. 调试输出

```typescript
it('debug example', () => {
  const result = myFunction()
  console.log('Debug:', result) // 会在测试输出中显示
  expect(result).toBe('expected')
})
```

### 3. 只运行特定测试

```bash
# 运行特定测试文件
npm test -- my-button.test

# 运行匹配的测试
npm test -- --grep "variant"
```

---

## 🌐 Coverage 文件夹

### 什么是 Coverage 文件夹？

`coverage/` 文件夹包含测试覆盖率报告。

```
coverage/
├── index.html              # 主报告（在浏览器中打开）
├── coverage-final.json     # 机器可读数据
├── components/             # 组件详细报告
└── lib/                    # 工具函数详细报告
```

### 关键特性

- 自动生成（运行 `npm run test:coverage` 时）
- 已在 `.gitignore` 中（不会提交到 Git）
- 可视化界面（HTML 网页）
- 包含详细数据（JSON 格式）

### 使用场景

1. 开发过程中检查覆盖率
2. CI/CD 中生成报告
3. 代码审查时查看覆盖率变化

---

## ❓ 常见问题

### Q: 如何测试使用 Context 的组件？

```typescript
import { render } from '@testing-library/react'
import { MyProvider } from './context'

it('renders with context', () => {
  render(
    <MyProvider value="test">
      <MyComponent />
    </MyProvider>
  )
})
```

### Q: 如何测试路由？

```typescript
import { MemoryRouter } from 'react-router-dom'

it('renders with router', () => {
  render(
    <MemoryRouter initialEntries={['/test']}>
      <MyComponent />
    </MemoryRouter>
  )
})
```

### Q: 如何模拟 window 对象？

```typescript
import { vi, beforeEach } from 'vitest'

beforeEach(() => {
  global.window.innerWidth = 1024
  vi.stubGlobal('matchMedia', () => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
})
```

### Q: Coverage 文件夹应该提交到 Git 吗？

**A**: 不应该。已经在 `.gitignore` 中忽略了。

### Q: 如何查看历史覆盖率趋势？

**A**: 使用 Codecov 或 Coveralls 等在线服务。

### Q: 覆盖率太低怎么办？

**A**:
1. 在浏览器中打开 `coverage/index.html`
2. 找到红色（未覆盖）的代码
3. 为这些代码添加测试
4. 重新运行 `npm run test:coverage`

### Q: 有些代码无法测试怎么办？

**A**: 在配置中排除这些文件：

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      exclude: [
        'node_modules/',
        'test/',
        '*.config.ts',
        'cli/',        // 排除 CLI 工具
        'registry/',   // 排除配置文件
      ],
    },
  },
})
```

---

## 📚 相关资源

- [Vitest 文档](https://vitest.dev/)
- [React Testing Library 文档](https://testing-library.com/react)
- [测试最佳实践](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## 🎯 总结

- ✅ **31 个测试全部通过**
- ✅ **100% 代码覆盖率**
- ✅ **完整的测试套件**
- ✅ **详细的测试文档**

保持高覆盖率，确保代码质量！🚀
