"use client";

import { type FC } from "react";
import { FileDownIcon, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createAPI } from "@kesi/client";

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
    const api = createAPI({ name: "eap/agents" });
    const authHeader = api.headers?.["Authorization"] || api.headers?.authorization || "";
    const projectId = api.headers?.["x-request-project"] || "";
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
