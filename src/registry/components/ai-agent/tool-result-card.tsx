"use client";

import { useState, type FC } from "react";
import {
  ChevronDown,
  Terminal,
  FileText,
  Search,
  Wrench,
  Globe,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { ToolCallMessagePartProps } from "@assistant-ui/react";
import { toolActionLabel, hasToolActionLabel } from "./tool-labels";
import { ACTIVITY_ROW_BASE, LoadingText } from "./activity-ui";

const ICONS: Record<string, FC<{ className?: string }>> = {
  Bash: Terminal,
  Skill: Wrench,
  Read: FileText,
  Edit: FileText,
  Write: FileText,
  Glob: Search,
  Grep: Search,
  Task: Wrench,
  WebSearch: Globe,
  WebFetch: Globe,
};

export const ToolResultCard: FC<ToolCallMessagePartProps> = ({
  toolName,
  args,
  result,
  status,
}) => {
  const [open, setOpen] = useState(false);
  const Icon = (toolName && ICONS[toolName]) || Wrench;
  const statusType = (status as { type?: string } | undefined)?.type;
  const running = statusType === "running";
  const errored = statusType === "incomplete";

  const resultText = formatResult(result);
  const argsText = formatExtraArgs(args);

  // 与思考行同一套行样式（图标位/间距一致），但**不限宽**：命令与参数本来就可能很长
  // 参数里带了 description（agent 自己写的一句话说明）时，label 直接用这句话，
  // 比「读取文件 / 执行命令」这类工具动作更能说明这一次到底在干什么
  const actionLabel = hasToolActionLabel(toolName)
    ? toolActionLabel(toolName)
    : toolName || '调用工具';
  const label = extractDescription(args) || actionLabel;
  const command = extractCommand(args);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      data-slot="tool-call-row"
      className="aui-custom-tool-card group/tool-card my-2"
    >
      <CollapsibleTrigger className={ACTIVITY_ROW_BASE}>
        <Icon className="size-4 shrink-0" />
        <span className="shrink-0 leading-none">
          {running ? <LoadingText text={label} /> : label}
        </span>
        <span className="text-muted-foreground/70 min-w-0 flex-1 truncate font-mono text-xs">
          {summarizeArgs(args)}
        </span>
        {running && <Loader2 className="size-3.5 shrink-0 animate-spin" />}
        {!running && !errored && (
          <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
        )}
        {errored && <XCircle className="size-3.5 shrink-0 text-destructive" />}
        <ChevronDown className="size-4 shrink-0 transition-transform group-data-[state=closed]/trigger:-rotate-90" />
      </CollapsibleTrigger>

      <CollapsibleContent className="group/collapsible-content overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <div className="bg-muted/20 mt-1 space-y-2 rounded-md border p-2">
          <div>
            <div className="text-muted-foreground mb-1 flex items-center gap-2 text-xs font-medium">
              {command ? (argsText ? '指令与参数' : '指令') : '参数'}
              {toolName && (
                <span className="font-mono text-[10px] font-normal opacity-60">{toolName}</span>
              )}
            </div>
            {command && (
              <pre className="bg-background mb-1 max-h-40 overflow-auto rounded border px-2 py-1 font-mono text-xs whitespace-pre-wrap break-all">
                {command}
              </pre>
            )}
            {argsText && (
              <pre className="bg-background max-h-60 overflow-auto rounded border px-2 py-1 font-mono text-xs whitespace-pre-wrap break-all">
                {argsText}
              </pre>
            )}
            {!command && !argsText && (
              <p className="text-muted-foreground text-xs">{'无参数'}</p>
            )}
          </div>

          {resultText !== null && (
            <div>
              <div className="text-muted-foreground mb-1 text-xs font-medium">
                {'执行结果'}
              </div>
              <pre className="bg-background max-h-80 overflow-auto rounded border px-2 py-1 font-mono text-xs whitespace-pre-wrap break-all">
                {resultText}
              </pre>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

/** 智能兜底:常见 result 形态优先解析,其余 JSON 序列化 */
function formatResult(result: unknown): string | null {
  if (result === null || result === undefined) return null;
  if (typeof result === "string") return result;
  if (typeof result === "object") {
    const r = result as Record<string, unknown>;
    if (typeof r.output === "string") return r.output;
    if (typeof r.content === "string") return r.content;
    if (typeof r.stdout === "string") return r.stdout;
    if (Array.isArray(r.content)) {
      return r.content
        .map((c) =>
          typeof c === "object" && c !== null
            ? (c as { text?: string }).text ?? JSON.stringify(c)
            : String(c),
        )
        .join("\n");
    }
  }
  return JSON.stringify(result, null, 2);
}

/**
 * 展开面板里的「参数」文本
 *
 * 剔除已经在别处展示过的键，避免同一份内容出现两次（看着重复）：
 * - `command`：上面已平铺成指令行
 * - `description`：已经是本行的标题
 * 剔完一个键都不剩就不渲染参数块（例如 Bash 只传了 command + description）。
 */
function formatExtraArgs(args: unknown): string {
  if (args === null || args === undefined) return "";
  if (typeof args === "string") return args;
  if (typeof args === "object") {
    const { command: _c, description: _d, ...rest } = args as Record<string, unknown>;
    return Object.keys(rest).length ? JSON.stringify(rest, null, 2) : "";
  }
  try {
    return JSON.stringify(args, null, 2);
  } catch {
    return String(args);
  }
}

/** 参数里的 description：agent 给这次调用写的一句话说明（有就当行标题） */
function extractDescription(args: unknown): string {
  if (args && typeof args === "object") {
    const d = (args as Record<string, unknown>).description;
    if (typeof d === "string" && d.trim()) return d.trim();
  }
  return "";
}

/** 命令类工具（Bash 等）单独把 command 拎出来平铺展示，读起来更像一条指令 */
function extractCommand(args: unknown): string {
  if (args && typeof args === "object" && typeof (args as Record<string, unknown>).command === "string") {
    return (args as Record<string, string>).command;
  }
  return "";
}

/** args 摘要:展示命令 / 路径 / pattern 等,方便一眼看出工具在干嘛 */
function summarizeArgs(args: unknown): string {
  if (!args) return "";
  if (typeof args === "string") return truncate(args);
  if (typeof args === "object") {
    const a = args as Record<string, unknown>;
    if (typeof a.command === "string") return truncate(a.command);
    if (typeof a.file_path === "string") return truncate(a.file_path);
    if (typeof a.path === "string") return truncate(a.path);
    if (typeof a.pattern === "string") return truncate(a.pattern);
    if (typeof a.query === "string") return truncate(a.query);
    if (typeof a.name === "string") return truncate(a.name);
  }
  return truncate(JSON.stringify(args));
}

function truncate(s: string, n = 48): string {
  const t = s.trim().replace(/\s+/g, " ");
  return t.length > n ? `${t.slice(0, n)}…` : t;
}

export default ToolResultCard;
