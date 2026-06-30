"use client";

import type {
  AddToolResultOptions,
  ThreadMessage,
} from "@assistant-ui/react";

/**
 * 暂存 tool result，供 SSE 流处理时使用。
 */
const toolResultCache = new Map<string, AddToolResultOptions>();

export function cacheToolResult(options: AddToolResultOptions) {
  toolResultCache.set(options.toolCallId, options);
}

export function getCachedToolResult(toolCallId: string) {
  return toolResultCache.get(toolCallId);
}

/**
 * 从消息 content 中提取所有 tool-call parts。
 */
export function extractToolCalls(
  content: ThreadMessage["content"],
): Array<{ toolCallId: string; toolName: string; args: any; result?: any }> {
  if (!Array.isArray(content)) return [];
  return content
    .filter((p): p is any => p?.type === "tool-call")
    .map((p: any) => ({
      toolCallId: p.toolCallId,
      toolName: p.toolName,
      args: p.args,
      result: p.result,
    }));
}

/**
 * 检查一条消息中所有 tool-call 是否都已携带 result。
 */
export function areAllToolsResolved(message: ThreadMessage): boolean {
  const calls = extractToolCalls(message.content);
  return calls.length > 0 && calls.every((t) => t.result !== undefined);
}
