# 组件 schema.json 编写规范（编辑器属性配置）

> 每个组件目录下放一个可选的 `schema.json`，声明该组件在 **KESI 可视化编辑器** 中的面板元数据与可编辑属性。
> `npm run build:registry` 时自动合并进 `public/r/{name}.json` 的 `kesi` 扩展字段（shadcn CLI 忽略未知字段，完全兼容）。
> 不写 schema.json 的组件照常发布，编辑器会对其走"源码推断"兜底（无默认值、无分组、控件类型按 TS 类型猜测）。

## 批量生成（推荐起点）

`npm run gen:schemas`（[scripts/gen-schemas.mjs](../scripts/gen-schemas.mjs)）：

- 从每个组件的 `config.tsx` 自动生成 schema.json（esbuild 转译后执行模块顶层，`propsConfig` / 中文名 / import 路径全自动提取）
- 已有 schema.json 的目录**跳过不覆盖**——手工写过的（bar、button）保持手工维护
- 无 config.tsx 或无组件源码的目录跳过并汇总报告
- 适合新组件先写 config.tsx → 跑生成 → 再手工微调（分组 group、description、defaultCode 等）

## 手工编写规范

## 文件位置

```
src/registry/components/
└── bar/
    ├── bar.tsx        ← 组件本体（不感知编辑器）
    ├── config.tsx     ← 旧演示系统配置（构建时跳过，与新 schema 无关）
    └── schema.json    ← 编辑器配置（本规范）
```

## 字段说明

```jsonc
{
  // 面板显示名（同时覆盖 registry 条目的 title）
  "displayName": "进度条",
  // 面板描述（同时覆盖条目 description）
  "description": "可配置方向/颜色映射的进度条",
  // 面板分类 id：basic / form / view / gis / chart / containers / business ...
  "category": "basic",
  // 图标名（预留，暂用分类默认图标）
  "icon": "bar",
  // 插入画布的初始 JSX（想带初始属性就写在这里，如 "<Bar value={80} />"）
  "defaultCode": "<Bar />",
  // 插入页面的 import 语句（安装路径约定：@/components/kesi/{name}/{name}）
  "importCode": "import { Bar } from '@/components/kesi/bar/bar';",
  // JSX 标签名（缺省按 name 转 PascalCase）
  "jsxName": "Bar",
  // 可编辑属性列表
  "props": [ ... ]
}
```

## props 属性项

字段与旧 `config.tsx` 的 `propsConfig` 完全同构，直接迁移即可：

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | string | 属性名（必须，对应组件 props，如 `btnText`） |
| `label` | string | 显示名（缺省显示 name） |
| `type` | string | 控件类型，见下表 |
| `default` | any | 默认值（面板未编辑时显示；**不写入页面代码**） |
| `description` | string | 悬浮提示 |
| `placeholder` | string | 输入占位符（text / textarea） |
| `options` | `{label, value}[]` | select 选项 |
| `min` / `max` | number | number 范围 |
| `group` | string | 分组名（如"基础/样式/数据"），缺省归入「属性」组 |

### 内置控件类型（type）

| type | 控件 | 适用 |
|------|------|------|
| `text` | 单行输入 | 字符串 |
| `textarea` | 多行输入 | 长文本 |
| `number` | 数字输入（支持 min/max） | 数值 |
| `boolean` | 开关 | 布尔 |
| `color` | 色块 + 色值输入 | 颜色 |
| `select` | 下拉选择（配 options） | 枚举 |
| `json` | JSON 编辑（合法才提交） | 对象/数组 |
| `expression` | 表达式编辑器 | 数据绑定/表达式 |

### 特殊编辑器

需要编辑器侧实现的复杂控件（如数据点选择器），`type` 直接写**编辑器注册名**（如 `"data-point"`）。
组件库只声明名字，编辑器通过 `registerPropEditor('data-point', ...)` 提供实现——
未注册时面板自动按类型兜底渲染并给出提示，**不会报错**。

### 别名

`string→text`、`enum→select`、`bool→boolean`、`int/float→number` 会自动归一。

## 完整示例（button）

```json
{
  "displayName": "按钮",
  "category": "basic",
  "defaultCode": "<Button />",
  "importCode": "import { Button } from '@/components/kesi/button/button';",
  "props": [
    { "name": "text", "label": "按钮文字", "type": "text", "default": "按钮", "placeholder": "请输入按钮文字", "group": "基础" },
    {
      "name": "variant", "label": "按钮样式", "type": "select", "default": "default", "group": "基础",
      "options": [
        { "value": "default", "label": "默认" },
        { "value": "destructive", "label": "危险" }
      ]
    },
    { "name": "bgColor", "label": "背景色", "type": "color", "group": "样式" },
    { "name": "pointId", "label": "绑定数据点", "type": "data-point", "group": "数据" }
  ]
}
```

## 编辑器侧行为（供理解，无需作者关心）

- **默认值不落码**：插入组件只写 `defaultCode`；面板显示 `default`，用户编辑才写入 JSX，清除属性即回到默认值。
- **发布流程**：`npm run build:registry` → 部署 `public/r` 到 `https://d.gtsiot.cn/front/r`；编辑器远程为主、本地 `localhost:3000` 兜底。
- **选中反查**：编辑器按页面 import 路径（`@/components/kesi/{name}/{name}`）反查组件，所以 `importCode` 必须符合该约定（或显式写对）。

## 参考实现

- [src/registry/components/bar/schema.json](../src/registry/components/bar/schema.json)
- [src/registry/components/button/schema.json](../src/registry/components/button/schema.json)
