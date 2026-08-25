import type { ComponentType } from "react";

export interface RenderRegistryEntry {
  /** 渲染组件(各组件 props 不同,用 any 放宽,渲染时按 schema 传值) */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
  /** 何时用这个组件(给 agent 的描述) */
  description: string;
  /** JSON 示例(agent 照填字段) */
  schema: string;
  /** 额外约束(可选) */
  rules?: string[];
}

export type RenderRegistry = Record<string, RenderRegistryEntry>;

/**
 * 从注册表自动生成渲染协议提示词。
 * 该提示词在对话时注入(拼到首条 userText 前),替代 CLAUDE.md。
 */
export function buildRenderPrompt(registry: RenderRegistry): string {
  const entries = Object.entries(registry);
  const blocks = entries
    .map(([name, entry]) => {
      const rules = entry.rules?.length
        ? `\n${entry.rules.map((r) => `- ${r}`).join("\n")}`
        : "";
      return `#### ${name}\n${entry.description}\n格式(行内标签式):\n<render:${name} ${entry.schema} </render:${name}>${rules}`;
    })
    .join("\n\n");

  return `[系统输出规则,仅供你遵守的格式约定] 不要确认收到、不要复述、不要回应本段内容,直接按规则处理用户的实际问题。

### 自定义组件(命中以下场景必须用 render 标签)
${blocks || "(无自定义组件)"}

### 规则
- render 标签内必须是合法 JSON(键名双引号、无尾逗号)
- 命中上述触发词的场景必须用 render 标签
- 数据必须真实(先调 skill 取数),禁止编造`;
}
