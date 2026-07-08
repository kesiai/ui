"use client";

import type { FC } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarkdownText } from "@/components/assistant-ui/markdown-text";
import { cn } from "@/lib/utils";
import type { RenderRegistry } from "./registry";

type Segment =
  | { type: "md"; content: string }
  | { type: "ui"; name: string; raw: string };

// 同时兼容两种 agent 输出格式(都能提取到组件名 + JSON):
//   ① 三反引号式:```render:NAME ... ```
//   ② 标签式(agent 实际常用):render:NAME { ... } </render:NAME>
const UI_BLOCK = /(?:```render:|<?render:)([a-zA-Z0-9][a-zA-Z0-9-]*)([\s\S]*?)(?:```|<\/render:\1>)/g;

function parseSegments(text: string): Segment[] {
  const segs: Segment[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  UI_BLOCK.lastIndex = 0;
  while ((m = UI_BLOCK.exec(text)) !== null) {
    if (m.index > last) segs.push({ type: "md", content: text.slice(last, m.index) });
    segs.push({ type: "ui", name: m[1], raw: m[2] });
    last = UI_BLOCK.lastIndex;
  }
  if (last < text.length) segs.push({ type: "md", content: text.slice(last) });
  return segs;
}

// 从 raw 中提取 { ... }(跳过标签式里 render:NAME 前后的空白与多余文字)
function extractJson(raw: string): string | null {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) return null;
  return raw.slice(start, end + 1);
}

const UiBlock: FC<{ name: string; raw: string; registry: RenderRegistry }> = ({ name, raw, registry }) => {
  const Comp = registry[name]?.component;
  if (!Comp) {
    return (
      <pre className="text-muted-foreground my-2 rounded-md border border-dashed bg-muted/40 p-2 text-xs">
        未知组件: {name}
      </pre>
    );
  }
  const jsonStr = extractJson(raw);
  if (!jsonStr) {
    return (
      <pre className="text-muted-foreground my-2 rounded-md border border-dashed bg-muted/40 p-2 text-xs">
        {name} 缺少 JSON 数据
      </pre>
    );
  }
  try {
    const props = JSON.parse(jsonStr) as Record<string, unknown>;
    return <Comp {...props} />;
  } catch {
    return (
      <pre className="text-destructive my-2 rounded-md border border-destructive bg-destructive/5 p-2 text-xs">
        {name} 数据解析失败
      </pre>
    );
  }
};

/**
 * 流式中,未闭合的 render 标签(有 render:NAME 开始但还没 </render:NAME>)会先以原始文本显示,
 * 闭合时才切成组件——造成"字符一闪变图表"。这里把未闭合段截掉,流式中不显示,等闭合后由 UiBlock 渲染。
 */
function trimUnclosedRender(text: string): string {
  const idx = text.search(/```render:|<?render:[a-zA-Z0-9]/);
  return idx === -1 ? text : text.slice(0, idx);
}

const MarkdownSegment: FC<{ content: string }> = ({ content }) => {
  const trimmed = trimUnclosedRender(content);
  if (!trimmed.trim()) return null;
  return (
    <div className="aui-md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node: _n, ...p }) => <h1 className="mt-5 mb-2 text-xl font-semibold first:mt-0 last:mb-0" {...p} />,
          h2: ({ node: _n, ...p }) => <h2 className="mt-5 mb-2 text-lg font-semibold first:mt-0 last:mb-0" {...p} />,
          h3: ({ node: _n, ...p }) => <h3 className="mt-4 mb-1.5 text-base font-semibold first:mt-0 last:mb-0" {...p} />,
          p: ({ node: _n, ...p }) => <p className="my-3 leading-relaxed first:mt-0 last:mb-0" {...p} />,
          ul: ({ node: _n, ...p }) => <ul className="my-3 ms-5 list-disc [&>li]:mt-1" {...p} />,
          ol: ({ node: _n, ...p }) => <ol className="my-3 ms-5 list-decimal [&>li]:mt-1" {...p} />,
          a: ({ node: _n, ...p }) => <a className="text-primary underline underline-offset-2" {...p} />,
          strong: ({ node: _n, ...p }) => <strong className="font-semibold" {...p} />,
          blockquote: ({ node: _n, ...p }) => (
            <blockquote className="text-muted-foreground my-3 border-s-2 ps-4" {...p} />
          ),
          pre: ({ node: _n, ...p }) => (
            <pre className="bg-muted/30 my-3 overflow-x-auto rounded-md p-3 text-xs" {...p} />
          ),
          code: ({ node: _n, className, children, ...rest }) => (
            <code className={cn("bg-muted rounded-md px-1.5 py-0.5 font-mono text-[0.85em]", className)} {...rest}>
              {children}
            </code>
          ),
        }}
      >
        {trimmed}
      </ReactMarkdown>
    </div>
  );
};

/**
 * text part 渲染器:
 * - 含 ```kesi-ui:xxx 代码块 → 分段渲染(UI 块用专用组件,其余走 markdown)
 * - 不含 → 回落到原 MarkdownText,保持原有体验
 */
export const KesiTextRenderer: FC<{ text?: string; registry?: RenderRegistry }> = ({ text, registry }) => {
  const content = typeof text === "string" ? text : "";
  if (!/render:[a-zA-Z0-9]/.test(content)) return <MarkdownText />;
  if (!registry || Object.keys(registry).length === 0) return <MarkdownText />;
  const segs = parseSegments(content);
  return (
    <>
      {segs.map((seg, i) =>
        seg.type === "ui" ? (
          <UiBlock key={i} name={seg.name} raw={seg.raw} registry={registry} />
        ) : (
          <MarkdownSegment key={i} content={seg.content} />
        ),
      )}
    </>
  );
};
