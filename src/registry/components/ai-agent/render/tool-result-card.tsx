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
import { cn } from "@/lib/utils";
import type { ToolCallMessagePartProps } from "@assistant-ui/react";

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
  const [open, setOpen] = useState(true);
  const Icon = (toolName && ICONS[toolName]) || Wrench;
  const statusType = (status as { type?: string } | undefined)?.type;
  const running = statusType === "running";
  const errored = statusType === "incomplete";

  const resultText = formatResult(result);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="aui-custom-tool-card bg-card my-2 overflow-hidden rounded-lg border"
    >
      <CollapsibleTrigger className="hover:bg-accent flex w-full items-center gap-2 px-3 py-2 text-left text-sm">
        <Icon className="text-muted-foreground size-4 shrink-0" />
        <span className="font-medium">{toolName}</span>
        {running && (
          <Loader2 className="text-muted-foreground size-3.5 shrink-0 animate-spin" />
        )}
        {!running && !errored && (
          <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
        )}
        {errored && <XCircle className="size-3.5 shrink-0 text-destructive" />}
        <span className="text-muted-foreground ml-1 min-w-0 flex-1 truncate font-mono text-xs">
          {summarizeArgs(args)}
        </span>
        <ChevronDown
          className={cn(
            "text-muted-foreground size-4 shrink-0 transition-transform",
            !open && "-rotate-90",
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        {resultText !== null && (
          <pre className="bg-muted/30 border-t max-h-80 overflow-auto overflow-x-auto whitespace-pre-wrap break-all px-3 py-2 text-xs">
            {resultText}
          </pre>
        )}
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
