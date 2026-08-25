"use client";

import { type FC } from "react";
import { FileDownIcon, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getHeaders } from "@kesi/client";

// ==================== FileDownloadCard ====================

/**
 * 文件下载卡片 — 通过 render 标签协议渲染。
 *
 * AI 在回复中使用 render 标签：
 *   <render:FileDownloadCard {"filePath":"users/admin/deliver/hello.txt","fileName":"hello.txt"} </render:FileDownloadCard>
 *
 * agentId 由 UiBlock 自动注入，无需 AI 填写。
 */
export const FileDownloadCard: FC<{
  agentId?: string;
  filePath?: string;
  fileName?: string;
  fileSize?: string;
}> = ({ agentId, filePath, fileName, fileSize }) => {
  if (!agentId || !filePath) {
    return (
      <div className="my-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        文件下载参数不完整
      </div>
    );
  }

  const name = fileName || filePath.split("/").pop() || "download";

  const handleDownload = () => {
    // 清洗 filePath：去掉 AI 可能误加的绝对路径前缀
    const cleanPath = filePath.replace(/^\/?(workspace\/)?[a-f0-9]{24}\/?/, "");
    const base = `/rest/eap/agents/${agentId}/workspace/file/download`;
    const params = new URLSearchParams({ path: cleanPath });
    const headers = getHeaders();
    const authHeader = headers["Authorization"] || "";
    const projectId = headers["x-request-project"] || "";
    if (authHeader) params.set("token", authHeader.replace(/^Bearer\s+/i, ""));
    if (projectId) params.set("x-request-project", projectId);
    const url = `${base}?${params.toString()}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      className={cn(
        "my-2 flex items-center gap-3 rounded-lg border bg-card p-4",
        "shadow-sm transition-shadow hover:shadow-md",
      )}
    >
      {/* 文件图标 */}
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
        <FileIcon className="size-5" />
      </div>

      {/* 文件信息 */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{name}</p>
        {fileSize && (
          <p className="text-xs text-muted-foreground">{fileSize}</p>
        )}
      </div>

      {/* 下载按钮 */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="shrink-0 gap-1.5"
        onClick={handleDownload}
      >
        <FileDownIcon className="size-4" />
        下载
      </Button>
    </div>
  );
};

/**
 * RenderRegistry 条目：向 ai-agent 注册该组件，供 render 标签协议渲染。
 * 独立组件自含注册信息（component + description + schema + rules），与 ai-agent 解耦。
 */
export const RenderRegistry = {
  component: FileDownloadCard,
  description:
    "文件下载卡片。创建/生成文件后必须用它返回，禁止纯文本给路径。" +
    "filePath 是工作区根目录下的相对路径（如 users/admin/deliver/hello.txt），不要带前缀。" +
    "agentId 无需填写（前端自动注入）。唯一例外：批量工程文件（如搭建项目）。",
  schema: '{"filePath": "users/admin/deliver/hello.txt", "fileName": "hello.txt", "fileSize": "1 KB"}',
  rules: [
    "生成文件后必须使用此组件，禁止纯文本给出文件路径",
    "filePath 必须是工作区相对路径，不要带前缀",
    "批量工程文件（搭建项目等）不需要此组件",
  ],
};

export default FileDownloadCard;
