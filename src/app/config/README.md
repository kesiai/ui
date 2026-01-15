# 组件配置指南

本文档说明如何为组件库添加新组件的配置。

## 目录结构

```
src/
└── app/
    ├── App.tsx                  # 主应用组件
    ├── components/              # 应用层组件
    │   ├── FormControl.tsx      # 通用表单控件
    │   └── PropsFormPanel.tsx   # 属性面板组件
    └── config/                  # 组件配置目录
        ├── types.ts             # 类型定义
        ├── index.ts             # 导出所有配置
        ├── README.md            # 配置说明文档
        └── components/          # 各组件的配置文件
            ├── bar.config.tsx   # Bar 组件配置
            └── ...              # 其他组件配置
```

## 如何添加新组件

### 步骤 1: 创建组件配置文件

在 `src/app/config/components/` 目录下创建新的配置文件，例如 `mycomponent.config.tsx`:

```tsx
import React from 'react'
import { MyComponent } from '../../../registry/blocks/...'
import { ComponentConfig } from '../types'

// 定义属性配置
export const myComponentPropsConfig = [
  {
    name: 'title',
    label: '标题',
    type: 'text' as const,
    default: '默认标题'
  },
  {
    name: 'size',
    label: '尺寸',
    type: 'select' as const,
    default: 'medium',
    options: [
      { value: 'small', label: '小' },
      { value: 'medium', label: '中' },
      { value: 'large', label: '大' }
    ]
  },
  {
    name: 'disabled',
    label: '禁用',
    type: 'boolean' as const,
    default: false
  }
]

// 定义默认属性值
export const myComponentDefaultProps = {
  title: '默认标题',
  size: 'medium',
  disabled: false
}

// 实现预览渲染函数
const renderMyComponentPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <MyComponent
        title={props.title}
        size={props.size}
        disabled={props.disabled}
      />
    </div>
  )
}

// 实现代码预览函数（可选）
const renderMyComponentCodePreview = (props: Record<string, any>) => {
  return `<MyComponent
  title="${props.title}"
  size="${props.size}"
  ${props.disabled ? 'disabled' : ''}
/>`
}

// 实现自定义表单（可选）
const renderMyComponentCustomForm = (
  props: Record<string, any>,
  onChange: (name: string, value: any) => void
) => {
  // 当某些属性需要特殊处理时使用
  // 返回 null 表示不需要自定义表单
  return null
}

// 导出组件配置
export const myComponentConfig: ComponentConfig = {
  id: 'mycomponent',
  name: '我的组件',
  propsConfig: myComponentPropsConfig,
  defaultProps: myComponentDefaultProps,
  renderPreview: renderMyComponentPreview,
  renderCodePreview: renderMyComponentCodePreview,
  renderCustomForm: renderMyComponentCustomForm // 可选
}
```

### 步骤 2: 在配置索引中注册

在 `src/app/config/index.ts` 中导出新配置:

```ts
export type { ComponentConfig, PropConfig, PropConfigOption, PropConfigType } from './types'
export { barConfig } from './components/bar.config'
export { myComponentConfig } from './components/mycomponent.config' // 新增
```

### 步骤 3: 在 App.tsx 中注册组件

在 [App.tsx](../App.tsx) 中:

1. 导入配置:

```tsx
import { barConfig, myComponentConfig } from './config'
```

2. 添加到 `componentConfigMap`:

```tsx
const componentConfigMap: Record<string, ComponentConfig> = {
  bar: barConfig,
  mycomponent: myComponentConfig  // 新增
}
```

3. 在分类中添加组件:

```tsx
{
  id: 'business',
  name: '业务组件',
  icon: '💼',
  components: [
    { id: 'bar', config: barConfig },
    { id: 'mycomponent', config: myComponentConfig }  // 新增
  ]
}
```

4. 在初始化状态中添加组件默认属性:

```tsx
const [componentProps, setComponentProps] = useState<Record<string, Record<string, any>>>({
  bar: barConfig.defaultProps,
  mycomponent: myComponentConfig.defaultProps  // 新增
})
```

## 支持的属性类型

`types.ts` 中定义了以下属性类型:

- `text`: 文本输入框
- `number`: 数字输入框（支持 min、max、step）
- `color`: 颜色选择器
- `select`: 下拉选择框（需要 options 配置）
- `boolean`: 复选框
- `range`: 滑块选择器

## ComponentConfig 接口说明

```tsx
interface ComponentConfig {
  id: string                      // 组件唯一标识
  name: string                    // 组件显示名称
  propsConfig: PropConfig[]       // 属性配置数组
  defaultProps: Record<string, any>  // 默认属性值
  renderPreview: (props: Record<string, any>) => React.ReactElement  // 预览渲染函数
  renderCodePreview?: (props: Record<string, any>) => string  // 代码预览函数（可选）
  renderCustomForm?: (props: Record<string, any>, onChange: Function) => React.ReactElement | null  // 自定义表单（可选）
}
```

## 最佳实践

1. **保持配置文件简洁**: 配置文件应该只包含配置和渲染逻辑，避免复杂业务逻辑
2. **使用 TypeScript**: 确保类型安全，利用 `as const` 进行类型断言
3. **复用通用组件**: 优先使用 `FormControl` 组件，只在必要时实现 `renderCustomForm`
4. **统一代码风格**: 遵循现有配置文件的命名和结构约定
5. **提供合理的默认值**: 确保组件在默认状态下有良好的展示效果

## 示例参考

查看 [bar.config.tsx](./components/bar.config.tsx) 获取完整的配置示例。
