import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  useExternalStoreRuntime,
  type AttachmentAdapter,
  type PendingAttachment,
  type CompleteAttachment,
  type SpeechSynthesisAdapter,
  type FeedbackAdapter,
  type ExternalStoreAdapter,
  type ThreadMessage,
  type AppendMessage,
  type ThreadAssistantMessagePart,
  type MessageTiming,
  unstable_getInteractableSnapshots,
  unstable_formatInteractableSnapshot
} from "@assistant-ui/react";
import { toToolsJSONSchema } from "assistant-stream";
import { createAPI, getConfig } from '@kesi/client'
import type { AssistantRuntime, Attachment, DataMessagePart, FileMessagePart, ImageMessagePart, ModelContext, ThreadUserMessagePart, ToolExecutionStatus } from "@assistant-ui/react";
import { buildRenderPrompt, type RenderRegistry } from "./render/registry";
import { cacheToolResult } from "./tools";

/** Token 用量 */
type AgentTokens = {
  cacheRead?: number;
  cacheWrite?: number;
  input: number;
  output: number;
  total: number;
};

/** 模型用量明细（按模型 ID 索引） */
type AgentModelUsage = {
  inputTokens?: number;
  outputTokens?: number;
  cacheReadTokens?: number;
  cacheWriteTokens?: number;
};

/** 后端响应元数据（user 消息 metadata.backendResponse） */
type BackendResponseMetadata = {
  adapterType?: string;
  agentName?: string;
  command?: string;
  content?: string;
  cwd?: string;
  elapsedMs?: number;
  finishReason?: string;
  mode?: string;
  modelId?: string;
  providerId?: string;
  rootPath?: string;
  sessionId?: string;
  sessionIdAfter?: string;
  status?: string;
  tokens?: AgentTokens;
  usage?: Record<string, AgentModelUsage>;
};

/** 调度元数据（user 消息 metadata 顶层） */
type DispatchMetadata = {
  dispatchAttempts?: number;
  dispatchKind?: string;
  dispatchLastAt?: string;
  dispatchMessageId?: string;
  dispatchSessionId?: string;
  dispatchStatus?: string;
  dispatchStream?: boolean;
  gatewayStatus?: string;
};

/** 消息元数据 */
type AgentMessageMetadata = DispatchMetadata & {
  custom?: Record<string, unknown>;
  backendResponse?: BackendResponseMetadata;
  adapterType?: string;
  agentName?: string;
  command?: string;
  content?: string;
  cwd?: string;
  elapsedMs?: number;
  finishReason?: string;
  mode?: string;
  modelId?: string;
  providerId?: string;
  rootPath?: string;
  sessionId?: string;
  status?: string;
  tokens?: AgentTokens;
  usage?: Record<string, AgentModelUsage>;
};

/** 会话附件 */
type AgentSessionAttachment = {
  contentType?: string;
  filename?: string;
  url: string;
};

/** 消息块（对应后端 entity.AgentMessagePart） */
type AgentMessagePart = {
  id?: string;
  messageId?: string;
  sessionId?: string;
  role?: string;
  type: string;                         // "text" | "reasoning" | "tool-call" | "tool_result" | "error"
  text?: string;                        // 文本内容（原来叫 content）
  toolName?: string;                    // 工具名称（原来叫 tool）
  toolCallId?: string;                  // 工具调用 ID
  args?: any;                           // 工具输入（原来叫 input）
  argsText?: string;                    // 工具输入的字符串形式
  result?: any;                         // 工具输出（原来叫 output）
  state?: { status?: string };          // 工具状态
  payload?: Record<string, any>;
  metadata?: Record<string, any>;
  seq?: number;
  sourcePartId?: string;
  createdBy?: string;
  createdAt?: string;
  agentId?: string;
  filename?: string;
  url?: string;
  mimeType?: string;
};

/** 后端消息（对应后端 entity.AgentMessage），包含 parts 数组 */
type AgentSessionMessage = {
  id: string;
  agentId?: string;
  sessionId?: string;
  role: string;                         // "user" | "assistant"
  status?: string;
  source?: string;
  requestedBy?: string;

  // === assistant 消息特有 ===
  parentId?: string;
  agentName?: string;
  modelId?: string;
  providerId?: string;
  mode?: string;
  finishReason?: string;
  tokens?: AgentTokens;
  usage?: Record<string, AgentModelUsage>;
  cwd?: string;
  rootPath?: string;

  // === 通用 ===
  wakeupId?: string;
  remoteMessageId?: string;
  closeReason?: string;
  processLossRetryCount?: number;
  continuationAttempt?: number;
  scheduledRetryAt?: string;
  scheduledRetryAttempt?: number;
  scheduledRetryReason?: string;
  lastHeartbeatAt?: string;
  startedAt?: string;
  endedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  metadata?: AgentMessageMetadata;
  attachments?: AgentSessionAttachment[];
  parts?: AgentMessagePart[];
};

const agentApi = createAPI({ name: 'eap/agents' });
const sessionApi = createAPI({ name: 'eap/agent-sessions' });
const feedbackApi = createAPI({ name: 'eap/feedbacks' });
const messageApi = createAPI({ name: 'eap/messages' });

// ==================== Attachment Adapter ====================
/**
 * 通过后端 API 上传/删除附件。sessionId 由外部 setter 更新。
 */
class SessionAttachmentAdapter implements AttachmentAdapter {
  accept = ".jpg,.jpeg,.png,.gif,.bmp,.webp,.svg,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.json,.xml,.md,.yaml,.yml,.log";
  private _sessionId: string | undefined;

  setSessionId(sessionId: string | undefined) {
    this._sessionId = sessionId;
  }

  async add(state: { file: File }): Promise<PendingAttachment> {
    return {
      id: state.file.name,
      type: state.file.type.startsWith("image/") ? "image" : "file",
      name: state.file.name,
      contentType: state.file.type,
      file: state.file,
      status: { type: "requires-action", reason: "composer-send" },
    };
  }

  async send(attachment: PendingAttachment): Promise<CompleteAttachment> {
    const sid = this._sessionId;
    if (!sid) throw new Error("SessionAttachmentAdapter: no sessionId set");

    const formData = new FormData();
    formData.append("file", attachment.file);
    formData.append("contentType", attachment.contentType ?? "");
    formData.append("createdBy", "kesi-ui");

    const sessionApi = createAPI({ name: 'eap/agent-sessions' })
    const host = (sessionApi as any).host ?? getConfig().rest ?? "/rest/";
    const uploadUrl = `${host}eap/agent-sessions/${sid}/attachments`;
    const headers = { ...sessionApi.headers };
    delete headers["Content-Type"];

    const resp = await fetch(uploadUrl, { method: "POST", headers, body: formData });
    const json = await resp.json();

    const objectKey: string = json.objectKey ?? json.id ?? "";
    const url: string = json.url ?? `/${objectKey}`;

    const content: ThreadUserMessagePart[] = attachment.type === "image"
      ? [{ type: "image", image: url, filename: attachment.name }]
      : [{ type: "file", data: url, mimeType: attachment.contentType ?? "application/octet-stream", filename: attachment.name }];

    return {
      id: attachment.id,
      type: attachment.type,
      name: attachment.name,
      contentType: attachment.contentType,
      status: { type: "complete" },
      content,
    };
  }

  async remove(attachment: Attachment): Promise<void> {
    const sid = this._sessionId;
    if (!sid) return;
    const part = (attachment as any).content?.[0];
    const objectKey = (attachment as any).objectKey ?? (part?.data ? extractObjectKey(part.data) : undefined);
    if (objectKey) {
      try {
        await sessionApi.fetch(`/${sid}/attachments/${objectKey}`, { method: "DELETE" });
      } catch { /* 删除失败不阻塞 */ }
    }
  }
}

/** 从 URL 中提取 objectKey */
function extractObjectKey(url: string): string {
  try {
    const u = new URL(url);
    return u.pathname.split("/").pop() ?? url;
  } catch {
    return url;
  }
}

const attachmentAdapter = new SessionAttachmentAdapter();

// ==================== Speech Adapter ====================
const speechAdapter: SpeechSynthesisAdapter = {
  speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    const subscribers = new Set<() => void>();

    const result: {
      status: { type: "running" } | { type: "ended"; reason: "finished" | "cancelled" };
      cancel: () => void;
      subscribe: (cb: () => void) => () => void;
    } = {
      status: { type: "running" },
      cancel: () => {
        speechSynthesis.cancel();
        result.status = { type: "ended", reason: "cancelled" };
        subscribers.forEach((cb) => cb());
      },
      subscribe(cb: () => void) {
        subscribers.add(cb);
        return () => subscribers.delete(cb);
      },
    };

    utterance.addEventListener("end", () => {
      result.status = { type: "ended", reason: "finished" };
      subscribers.forEach((cb) => cb());
    });
    utterance.addEventListener("error", () => {
      result.status = { type: "ended", reason: "cancelled" };
      subscribers.forEach((cb) => cb());
    });

    speechSynthesis.speak(utterance);
    return result;
  },
};

// ==================== Feedback Adapter ====================
const feedbackAdapter: FeedbackAdapter = {
  async submit({ type, message }) {
    await feedbackApi.fetch('', {
      method: "POST",
      body: JSON.stringify({ messageId: message.id, rating: type }),
    });
  },
};

// ==================== Helpers ====================
function genId() {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

/** 后端 AgentSessionMessage（含 parts 数组）→ ThreadMessage */
function toThreadMessage(m: AgentSessionMessage): ThreadMessage | null {
  const id = m.id ?? genId();
  const now = new Date(m.createdAt ?? Date.now());
  const metadata = m.metadata ?? { custom: {} as Record<string, unknown> };
  const base = { id, createdAt: now, metadata };

  const parts = m.parts ?? [];
  if (parts.length === 0) return null;

  const content: ThreadAssistantMessagePart[] = [];
  const host = getConfig().rest ?? '/rest/';
  const joinUrl = (base: string, path: string) => base.replace(/\/+$/, '') + '/' + path.replace(/^\/+/, '');

  for (const part of parts) {
    switch (part.type) {
      case 'text': {
        let txt = part.text ?? '';

        if (m.role === 'user') {
          // user 消息：去掉 {## ... ##} 包裹的系统拼装内容，只保留用户真实输入
          txt = txt.replace(/\{##.*?##\}/gs, '').trim();
          content.push({ type: 'text', text: txt });
          break;
        }

        // assistant 消息：解析 front-toolcall 标记，按位置分割为 text / tool-call 交替片段
        const tcRegex = /\[\[front-toolcall:\s*(\S+)\s*(\{.*?\})\s*\]\]/g;
        let lastIdx = 0;
        let tcMatch: RegExpExecArray | null;
        let hasMatch = false;
        while ((tcMatch = tcRegex.exec(txt)) !== null) {
          hasMatch = true;
          const before = txt.slice(lastIdx, tcMatch.index);
          if (before) content.push({ type: 'text', text: before });
          try {
            const args = JSON.parse(tcMatch[2]);
            const callId = `front_${tcMatch[1]}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
            content.push({ type: 'tool-call', toolCallId: callId, toolName: tcMatch[1], args, argsText: tcMatch[2], result: {}, } as any);
          } catch {
            content.push({ type: 'text', text: tcMatch[0] });
          }
          lastIdx = tcMatch.index + tcMatch[0].length;
        }
        if (hasMatch) {
          const after = txt.slice(lastIdx);
          if (after) content.push({ type: 'text', text: after });
        } else {
          content.push({ type: 'text', text: txt });
        }
        break;
      }

      case 'reasoning':
        content.push({ type: 'reasoning', text: part.text ?? '' });
        break;

      case 'tool-call': {
        const callId = part.toolCallId ?? part.id ?? genId();
        const tcPart: ThreadAssistantMessagePart & { result?: any } = {
          type: 'tool-call',
          toolCallId: callId,
          toolName: part.toolName ?? '',
          args: (part.args ?? {}) as any,
          argsText: part.argsText ?? (typeof part.args === 'string' ? part.args : JSON.stringify(part.args ?? {})),
        };
        // tool-call part 自带 result（后端已合并）
        if (part.result != null) {
          tcPart.result = part.result;
        }
        content.push(tcPart as ThreadAssistantMessagePart);
        break;
      }

      case 'tool_result': {
        // 兜底：没有匹配 tool-call 时用 data part
        content.push({
          type: 'data',
          name: `tool_result:${part.toolName ?? ''}`,
          data: {
            toolCallId: part.sourcePartId ?? genId(),
            toolName: part.toolName ?? '',
            output: part.result ?? part.text ?? '',
          },
        });
        break;
      }

      case 'image': {
        const img = part;
        content.push({ type: 'image', image: joinUrl(host, img.url ?? ''), filename: img.filename } as ImageMessagePart);
        break;
      }

      case 'file': {
        const f = part;
        content.push({ type: 'file', data: joinUrl(host, f.url ?? ''), mimeType: f.mimeType ?? 'application/octet-stream', filename: f.filename } as FileMessagePart);
        break;
      }

      case 'data': {
        const d = part;
        content.push({ type: 'data', data: d.url, name: d.filename ?? 'data' } as DataMessagePart);
        break;
      }

      case 'error':
        content.push({ type: 'text', text: `[Error] ${part.text ?? ''}` });
        break;
    }
  }
  
  // 转换后端 attachments → ThreadMessage.attachments（CompleteAttachment[]）
  let msgAttachments: readonly CompleteAttachment[] | undefined;
  if (m.attachments) {
    const host = getConfig().rest ?? '/rest/';
    msgAttachments = m.attachments.map((att) => {
      const isImage = att.contentType?.startsWith('image/');
      const fullUrl = joinUrl(host, att.url);
      return {
        id: att.url,
        type: isImage ? 'image' as const : 'file' as const,
        name: att.filename ?? 'file',
        contentType: att.contentType,
        status: { type: 'complete' as const },
        content: isImage
          ? [{ type: 'image' as const, image: fullUrl, filename: att.filename }]
          : [{ type: 'file' as const, data: fullUrl, mimeType: att.contentType ?? 'application/octet-stream', filename: att.filename }],
      } as CompleteAttachment;
    });
  }

  if (content.length === 0) return null;

  // 对 assistant 消息，从后端数据严格映射 MessageTiming（7 字段）
  if (m.role === 'assistant') {
    const startedAtMs = m.startedAt ? new Date(m.startedAt).getTime() : undefined;
    const endedAtMs = m.endedAt ? new Date(m.endedAt).getTime() : undefined;
    const firstPartMs = parts.find(p => p.createdAt)?.createdAt;
    const firstTokenMs = firstPartMs ? new Date(firstPartMs).getTime() : undefined;

    const totalStreamTime: number = (startedAtMs && endedAtMs) ? (endedAtMs - startedAtMs) : 0;
    const tokenCount: number | undefined = m.tokens?.output ?? m.tokens?.total;
    const tokensPerSecond: number | undefined = (tokenCount != null && totalStreamTime > 0)
      ? tokenCount / (totalStreamTime / 1000)
      : undefined;

    const timing: MessageTiming = {
      streamStartTime: startedAtMs ?? now.getTime(),
      firstTokenTime: (startedAtMs && firstTokenMs) ? (firstTokenMs - startedAtMs) : undefined,
      totalStreamTime,
      tokenCount,
      tokensPerSecond,
      totalChunks: parts.length,
      toolCallCount: parts.filter(p => p.type === 'tool-call').length,
    };
    console.log('[toThreadMessage] assistant message timing', { id, timing });
    (metadata as any).timing = timing;
  }

  // AgentSessionMessage.status → MessageStatus
  const msgStatus: ThreadMessage['status'] | undefined = (() => {
    switch (m.status) {
      case 'queued':
      case 'scheduled_retry':
      case 'running': return { type: 'running' as const };
      case 'succeeded': return { type: 'complete' as const, reason: 'stop' as const };
      case 'failed': return { type: 'incomplete' as const, reason: 'error' as const };
      case 'cancelled': return { type: 'incomplete' as const, reason: 'cancelled' as const };
      case 'timed_out': return { type: 'incomplete' as const, reason: 'cancelled' as const };
      default: return undefined;
    }
  })();

  if (m.role === 'user') {
    return {
      ...base,
      role: 'user',
      content,
      attachments: msgAttachments ?? [],
      ...(msgStatus ? { status: msgStatus } : {}),
    } as unknown as ThreadMessage;
  }

  return {
    ...base,
    role: 'assistant',
    content,
    attachments: msgAttachments,
    status: msgStatus ?? { type: 'complete' as const, reason: 'stop' as const },
  } as unknown as ThreadMessage;
}

/**
 * 解析 `[[front-toolcall: toolName {...}]]` 标记，返回解析结果和清理后的文本。
 */
function parseFrontToolcall(text: string): {
  cleaned: string;
  calls: { toolName: string; args: any; argsText: string; raw: string }[];
} {
  const calls: { toolName: string; args: any; argsText: string; raw: string }[] = [];
  const regex = /\[\[front-toolcall:\s*(\S+)\s*(\{.*?\})\s*\]\]/g;
  let cleaned = text;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    try {
      const args = JSON.parse(match[2]);
      calls.push({ toolName: match[1], args, argsText: match[2], raw: match[0] });
      cleaned = cleaned.replace(match[0], '');
    } catch {
      // JSON 解析失败，跳过
    }
  }
  return { cleaned, calls };
}

/**
 * POST .../messages?stream=true 读取 SSE 流，逐步构建 assistant 消息的 content parts。
 *
 * 每次内容变化时通过 onMessageChange 回调最新的 parts 数组，
 * 调用方用其直接替换 assistant 消息的 content。
 */
async function streamRunInSession(params: {
  sessionId: string;
  message: AppendMessage;
  messages: ThreadMessage[];
  context: ModelContext;
  requestedBy: string;
  signal: AbortSignal;
  onMessageChange: (content: ThreadAssistantMessagePart[]) => void;
  renderRegistry?: RenderRegistry;
  /** 预计输入内容（前言）：首条消息发送时注入到 userText 前 */
  preamble?: string;
}): Promise<MessageTiming> {
  const { sessionId, message, messages, context, requestedBy, signal, onMessageChange, renderRegistry, preamble } = params;

  // 从 AppendMessage 中提取文本，enrich，提取附件
  const contentParts = Array.isArray(message.content) ? message.content : [];
  const textPart = contentParts.find((p: any) => p.type === 'text') as { type: 'text'; text: string } | undefined;
  const rawText = textPart?.text ?? (typeof message.content === 'string' ? message.content : '');
  let userText = enrichWithInteractables([ ...messages, message as unknown as ThreadMessage ], rawText);
  const attachments = [ ...(message.attachments ?? []).map((att: CompleteAttachment) => {
      return att.content?.[0]
  }), ...contentParts.filter((p: any) => p.type !== 'text') as ThreadUserMessagePart[]].filter(Boolean) as ThreadUserMessagePart[];

  const sessionApi = createAPI({ name: 'eap/agent-sessions' })
  const host = (sessionApi as any).host ?? getConfig().rest ?? '/rest/';
  const url = `${host}eap/agent-sessions/${sessionId}/messages?stream=true`;
  const headers: Record<string, string> = sessionApi.headers;
  headers['Accept'] = 'text/event-stream';

  console.log('[StreamRunInSession] start fetching SSE stream...', { url, sessionId, userText });

  // 转换 attachments 为后端格式
  const attachmentItems: AgentSessionAttachment[] = attachments.map((a: any) => {
    if (a.type === 'image') return { contentType: a.filename?.endsWith('.png') ? 'image/png' : 'image/jpeg', filename: a.filename ?? 'image', url: a.image };
    if (a.type === 'file') return { contentType: a.mimeType ?? 'application/octet-stream', filename: a.filename ?? 'file', url: a.data };
    return { contentType: 'application/octet-stream', filename: a.filename ?? 'file', url: a.data ?? a.image ?? '' };
  })
  console.log('[StreamRunInSession] messages', messages);
  if(messages.length == 0) {
    // tools → 转为文字附在 userText 前（API 不支持 tools 参数）
    const toolsSchema = context.tools ? toToolsJSONSchema(context.tools) : undefined;
    const toolsPrefix = toolsSchema
      ? `{## 以下是用户侧可用的工具列表。你可以使用这些工具，注意！！这些工具调用不需要你真正去执行，只要给用户侧返回 tool-call 类型的信息即可，不用去关心返回结果。\n\n可用工具：\n${JSON.stringify(toolsSchema, null, 2)} ##}`
      : '';
    userText = toolsPrefix ? `${toolsPrefix}${userText}` : userText;

    // 注入渲染协议提示词(替代 CLAUDE.md,首条对话带上,agent 后续记得)
    if (renderRegistry && Object.keys(renderRegistry).length > 0) {
      const renderPrefix = `\n{## ${buildRenderPrompt(renderRegistry)} ##}\n`;
      userText = `${renderPrefix}${userText}`;
    }

    // 注入预计输入内容(前言) —— 与 renderRegistry 同路径,首条消息带上
    if (preamble && preamble.trim()) {
      userText = `{## ${preamble.trim()} ##}\n${userText}`;
    }
  }

  console.log("[streamRunInSession] messages.length:", messages.length, "hasRegistry:", !!renderRegistry, "最终 userText:", userText);
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      role: 'user',
      type: 'text',
      content: userText,
      metadata: message.metadata ?? {},
      requestedBy,
      attachments: attachmentItems,
    }),
    signal,
  });

  if (!response.ok || !response.body) return {
    streamStartTime: 0,
    totalChunks: 0,
    toolCallCount: 0,
  } as MessageTiming;

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  // 按 callId 索引 tool-call part 在 content 数组中的位置
  const toolIdxMap = new Map<string, number>();
  const parts: ThreadAssistantMessagePart[] = [];

  // timing tracking
  const streamStartTime = Date.now();
  let firstTokenTime: number | undefined;
  let totalChunks = 0;
  let toolCallCount = 0;
  let tokenCount: number | undefined;

  function emit() {
    if (firstTokenTime === undefined && parts.length > 0) {
      firstTokenTime = Date.now();
    }
    totalChunks++;
    onMessageChange([...parts]);
  }

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      while (buffer.includes('\n\n')) {
        const idx = buffer.indexOf('\n\n');
        const block = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);

        let eventType = '';
        let dataStr = '';

        for (const line of block.split('\n')) {
          if (line.startsWith('event: ')) eventType = line.slice(7).trim();
          else if (line.startsWith('data: ')) dataStr = line.slice(6).trim();
        }

        if (!dataStr || dataStr === '[DONE]') {
          if (eventType === 'done') break;
          continue;
        }

        try {
          const parsed = JSON.parse(dataStr);
          const payload = parsed.data?.payload ?? {};

          if (eventType === 'reasoning') {
            const chunk = payload.text;
            if (chunk) {
              const lastPart = parts[parts.length - 1];
              if (lastPart?.type === 'reasoning') {
                (lastPart as { type: 'reasoning'; text: string }).text += chunk;
              } else {
                parts.push({ type: 'reasoning', text: chunk });
              }
              emit();
            }
          } else if (eventType === 'tool-call') {
            const { toolCallId, toolName, args, argsText } = payload;
            console.log('[streamRunInSession] tool use', { toolCallId, toolName, args });
            if (!toolCallId) continue;
            toolCallCount++;
            const toolPart: ThreadAssistantMessagePart = {
              type: 'tool-call',
              toolCallId,
              toolName: toolName ?? '',
              args: (args ?? {}) as any,
              argsText: argsText ?? (typeof args === 'string' ? args : JSON.stringify(args ?? {})),
            };
            toolIdxMap.set(toolCallId, parts.length);
            parts.push(toolPart);
            emit();
          } else if (eventType === 'tool-result') {
            const { toolCallId, result } = payload;
            console.log('[streamRunInSession] tool result', { toolCallId });
            if (!toolCallId) continue;
            cacheToolResult({ toolCallId, result } as any);
            const i = toolIdxMap.get(toolCallId);
            if (i !== undefined) {
              const p = parts[i] as any;
              parts[i] = { ...p, result } as ThreadAssistantMessagePart;
              emit();
            }
          } else if (eventType === 'text') {
            const { deltaType, text } = payload;
            if (text && (deltaType === 'text_delta' || !deltaType)) {
              const lastPart = parts[parts.length - 1];
              if (lastPart?.type === 'text') {
                (lastPart as { type: 'text'; text: string }).text += text;
              } else {
                parts.push({ type: 'text', text });
              }
              // 检查文本中是否包含 front-toolcall 标记
              const fullText = (parts[parts.length - 1] as any)?.text ?? '';
              const { cleaned, calls } = parseFrontToolcall(fullText);
              if (calls.length > 0) {
                // 更新 text part 为清理后的文本
                const textIdx = parts.length - 1;
                if (cleaned) {
                  (parts[textIdx] as any).text = cleaned;
                } else {
                  parts.splice(textIdx, 1); // 纯标记，移除 text part
                }
                // 追加 tool-call parts
                for (const call of calls) {
                  const callId = `front_${call.toolName}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
                  parts.push({
                    type: 'tool-call',
                    toolCallId: callId,
                    toolName: call.toolName,
                    args: call.args,
                    argsText: call.argsText,
                  });
                }
              }
              emit();
            }
          } else if (eventType === 'completed') {
            const data = parsed.data;
            tokenCount = data?.tokens?.output ?? data?.tokens?.total;
            if (data?.status === 'failed') {
              // 错误状态：从 backendResponse 提取错误信息
              const errReason = data?.metadata?.backendResponse?.finishReason ?? data?.closeReason ?? '未知错误';
              const errMsg = `[错误] 执行失败：${errReason}`;
              const lastTextIdx = parts.map(p => p.type).lastIndexOf('text');
              if (lastTextIdx >= 0) {
                parts[lastTextIdx] = { type: 'text', text: errMsg };
              } else {
                parts.push({ type: 'text', text: errMsg });
              }
              emit();
            } else if (data?.status === 'succeeded' && data?.metadata?.backendResponse?.content) {
              // 成功：用 backendResponse.content 覆盖最后一个 text part（完整文本）
              // const fullText = data.metadata.backendResponse.content;
              // const lastTextIdx = parts.map(p => p.type).lastIndexOf('text');
              // if (lastTextIdx >= 0) {
              //   parts[lastTextIdx] = { type: 'text', text: fullText };
              //   emit();
              // }
            }
            break;
          }
        } catch {
          // 非 JSON data 行，跳过
        }
      }
    }
  } catch (err: any) {
    if (err.name !== 'AbortError') throw err;
  }

  const totalStreamTime = Date.now() - streamStartTime;
  const tokensPerSecond: number | undefined = (tokenCount != null && totalStreamTime > 0)
    ? tokenCount / (totalStreamTime / 1000)
    : undefined;

  const timing: MessageTiming = {
    streamStartTime,
    firstTokenTime,
    totalStreamTime,
    tokenCount,
    tokensPerSecond,
    totalChunks,
    toolCallCount,
  };
  return timing;
}

/** 从已有消息中提取可交互工具快照，拼接到 userText 前让模型感知当前状态 */
function enrichWithInteractables(messages: ThreadMessage[], userText: string): string {
  const snapshots: string[] = [];
  console.log('[enrichWithInteractables] scanning', messages.length, 'messages');
  for (const msg of messages) {
    if (msg.role !== 'user') continue;
    console.log('[enrichWithInteractables] checking user msg', msg.id, 'metadata:', JSON.stringify(msg.metadata));
    const items = unstable_getInteractableSnapshots(msg as any);
    console.log('[enrichWithInteractables] snapshots found:', items?.length ?? 0);
    if (!items?.length) continue;
    for (const item of items) {
      const formatted = unstable_formatInteractableSnapshot(item);
      console.log('[enrichWithInteractables] snapshot', item.name, ':', formatted.slice(0, 120));
      snapshots.push(formatted);
    }
  }
  if (snapshots.length === 0) {
    console.log('[enrichWithInteractables] no snapshots, returning original text');
    return userText;
  }
  const result = '{##' + snapshots.join('\n') + '##}\n\n' + userText;
  console.log('[enrichWithInteractables] enriched text length:', result.length);
  return result;
}

// ==================== useAgentRuntime ====================

export const useAgentRuntime = (agentId: string, options?: { renderRegistry?: RenderRegistry; preamble?: string }) => {
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [threads, setThreads] = useState<Array<{
    status: 'regular';
    id: string;
    remoteId?: string;
    title?: string;
  }>>([]);
  const [currentThreadId, setCurrentThreadId] = useState<string | undefined>(undefined);
  const [requestedBy] = useState('kesi-ui');
  const [toolStatuses, setToolStatuses] = useState<Record<string, ToolExecutionStatus>>({});

  // renderRegistry 用 ref 存,onNew 闭包读取,避免依赖变化导致重建
  const renderRegistryRef = useRef<RenderRegistry | undefined>(options?.renderRegistry);
  renderRegistryRef.current = options?.renderRegistry;

  // preamble 同样用 ref 存,首条消息注入时读取
  const preambleRef = useRef<string | undefined>(options?.preamble);
  preambleRef.current = options?.preamble;

  const runIdRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const isNewSessionRef = useRef(false);        // onNew 新建 session 时屏蔽 useEffect 加载
  const pollingRef = useRef<{ messageId: string; timer: ReturnType<typeof setInterval> } | null>(null);

  const runtime = useRef<AssistantRuntime>(null as any);

  // ---------- 初始加载 thread 列表 ----------
  useEffect(() => {
    agentApi.fetch(`/${agentId}/sessions`, { method: 'GET' }).then(({ json }) => {
      setThreads((json as any[]).map((s: any) => ({
        status: 'regular' as const,
        id: s.id,
        remoteId: s.id,
        title: s.title,
      })));
    });
  }, [agentId]);

  // ---------- thread 切换时加载消息，并轮询 running 的 assistant message ----------
  useEffect(() => {
    // 清除旧轮询
    if (pollingRef.current) {
      clearInterval(pollingRef.current.timer);
      pollingRef.current = null;
    }

    attachmentAdapter.setSessionId(currentThreadId);
    if (!currentThreadId) {
      setMessages([]);
      return;
    }
    // onNew 刚新建 session，消息由乐观插入 + SSE 驱动，跳过加载
    if (isNewSessionRef.current) {
      isNewSessionRef.current = false;
      return;
    }
    sessionApi.fetch(`/${currentThreadId}/messages`, { method: 'GET' })
      .then(({ json }) => {
        const raw = json as AgentSessionMessage[];
        const msgs = raw.map(toThreadMessage).filter((m): m is ThreadMessage => m != null);
        setMessages(msgs);

        // 检查最后一个 assistant message 是否 running → 启动轮询
        const lastAssistant = raw.filter(m => m.role === 'assistant').at(-1);
        if (lastAssistant && lastAssistant.id && (lastAssistant.status === 'running' || lastAssistant.status === 'queued')) {
          const timer = setInterval(async () => {
            try {
              const { json: updated } = await messageApi.fetch(`/${lastAssistant.id}`, { method: 'GET' });
              const msg = toThreadMessage(updated as AgentSessionMessage);
              if (msg) {
                setMessages(prev => prev.map(m => m.id === msg.id ? msg : m));
                // 如果消息已完成，停止轮询
                const status = (updated as AgentSessionMessage).status;
                if (status && !['running', 'queued'].includes(status)) {
                  clearInterval(timer);
                  if (pollingRef.current?.timer === timer) pollingRef.current = null;
                }
              }
            } catch { /* 静默失败 */ }
          }, 2000);
          pollingRef.current = { messageId: lastAssistant.id, timer };
        }
      })
      .catch(() => setMessages([]));

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current.timer);
        pollingRef.current = null;
      }
    };
  }, [currentThreadId]);

  // ---------- 同步 toolStatuses → messages 中 tool-call part 的状态 ----------
  useEffect(() => {
    if (Object.keys(toolStatuses).length === 0) return;
    setMessages(prev => prev.map(msg => {
      if (msg.role !== 'assistant') return msg;
      const content = msg.content.map(part => {
        if (part.type !== 'tool-call') return part;
        const status = toolStatuses[(part as any).toolCallId];
        if (!status) return part;
        return { ...part, status: { type: 'running' as const } } as ThreadAssistantMessagePart;
      });
      return { ...msg, content } as ThreadMessage;
    }));
  }, [toolStatuses]);

  // ---------- onNew ----------
  const onNew = useCallback(async (message: AppendMessage) => {
    console.log('[onNew] ========== START ==========', {
      currentThreadId,
      userText: message.content?.[0]?.type === 'text' ? message.content[0].text : '(empty)',
      timestamp: new Date().toISOString(),
    });
    console.log('[onNew] message', message);
    // 取消旧任务
    abortRef.current?.abort();

    const userText = message.content?.[0]?.type === 'text'
      ? message.content[0].text
      : (typeof message.content === 'string' ? message.content : '');
    if (!userText) {
      console.log('[onNew] userText empty, return');
      return;
    }
    
    // session 是持久会话：已有 threadId 直接复用，否则创建新会话
    const sessionId = currentThreadId ?? await (async () => {
      console.log('[onNew] creating new session...', { agentId });

      const { json } = await agentApi.fetch(`/${agentId}/sessions`, {
        method: 'POST',
        body: JSON.stringify({
          // initialMessage: userText,
          title: userText.slice(0, 30),
          metadata: {},
          requestedBy,
        }),
      });
      const newId = (json.sessionId ?? json.id) as string;
      console.log('[onNew] session created', { newId, json });

      if (!newId) throw new Error("Failed to create session");

      setThreads(prev => [...prev, {
        status: 'regular' as const,
        id: newId,
        remoteId: newId,
        title: userText.slice(0, 30),
      }]);
      isNewSessionRef.current = true;
      setCurrentThreadId(newId);
      
      return newId;
    })();

    const isNewThread = !currentThreadId; // 创建时的 currentThreadId 值
    console.log('[onNew] resolved sessionId', {
      sessionId,
      isNewThread,
    });

    // 乐观插入 user + assistant
    const userId = genId();
    const assistantId = genId();
    const runId = `run_${Date.now()}`;
    runIdRef.current = runId;

    console.log('[onNew] optimistic messages', { userId, assistantId, runId, userText });

    // userMsg = AppendMessage + userId
    const userMsg: ThreadMessage = { id: userId, ...message } as unknown as ThreadMessage;
    const assistantMsg: ThreadMessage = {
      id: assistantId, role: 'assistant',
      content: [{ type: 'text', text: '' }],
      status: { type: 'running' }, metadata: {},
    } as unknown as ThreadMessage;

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setIsRunning(true);

    // AbortController
    const ac = new AbortController();
    abortRef.current = ac;

    try {
      console.log('[onNew] start SSE stream...', { sessionId });
      const timing = await streamRunInSession({
        sessionId,
        signal: ac.signal,
        message: message,
        messages: isNewThread ? [] : messages,
        context: runtime.current?.thread.getModelContext(),
        requestedBy,
        renderRegistry: renderRegistryRef.current,
        preamble: preambleRef.current,
        onMessageChange(content) {
          // console.log('[onNew] SSE: content updated', { assistantId, parts: content.map(p => p.type) });
          setMessages(prev => prev.map(m =>
            m.id === assistantId
              ? { ...m, content } as ThreadMessage
              : m,
          ));
        },
      });

      // 标记 complete，写入 timing 供 MessageTiming 组件显示
      console.log('[onNew] SSE done, marking complete', { assistantId });
      setMessages(prev => prev.map(m =>
        m.id === assistantId
          ? { ...m, status: { type: 'complete' as const, reason: 'stop' as const }, metadata: { ...(m.metadata as any), timing } } as ThreadMessage
          : m,
      ));
    } catch (err) {
      console.log('[onNew] error during SSE stream', { err, sessionId });
      throw err;
    } finally {
      console.log('[onNew] ========== END ==========', { isRunning: false, sessionId });
      setIsRunning(false);
      runIdRef.current = null;
      abortRef.current = null;
    }
  }, [agentId, requestedBy, currentThreadId]);

  // ---------- onReload ----------
  const onReload = useCallback(async (_parentId: string | null, _config: any) => {
    if (!currentThreadId) return;

    abortRef.current?.abort();

    setIsRunning(true);
    const assistantId = genId();
    const runId = `run_${Date.now()}`;
    runIdRef.current = runId;

    // 追加一条空的 assistant（reload 通常不新增 user 消息）
    setMessages(prev => [...prev, {
      id: assistantId, role: 'assistant',
      content: [{ type: 'text', text: '' }],
      status: { type: 'running' }, metadata: {},
    } as unknown as ThreadMessage]);

    const ac = new AbortController();
    abortRef.current = ac;

    try {
      // reload = 用最后一条 user 文本重新触发
      const lastUserText = messages.filter(m => m.role === 'user').at(-1);
      const userText = typeof lastUserText?.content === 'string'
        ? lastUserText.content
        : (lastUserText?.content?.[0] as any)?.text ?? '';

      if (!userText) return;

      const timing = await streamRunInSession({
        sessionId: currentThreadId,
        signal: ac.signal,
        message: { content: [{ type: 'text' as const, text: userText }], parentId: null, sourceId: null, runConfig: undefined } as unknown as AppendMessage,
        messages,
        context: runtime.current?.thread.getModelContext(),
        requestedBy,
        renderRegistry: renderRegistryRef.current,
        preamble: preambleRef.current,
        onMessageChange(content) {
          setMessages(prev => prev.map(m =>
            m.id === assistantId
              ? { ...m, content } as ThreadMessage
              : m,
          ));
        },
      });

      setMessages(prev => prev.map(m =>
        m.id === assistantId
          ? { ...m, status: { type: 'complete' as const, reason: 'stop' as const }, metadata: { ...(m.metadata as any), timing } } as ThreadMessage
          : m,
      ));
    } finally {
      setIsRunning(false);
      runIdRef.current = null;
      abortRef.current = null;
    }
  }, [currentThreadId, messages, requestedBy]);

  // ---------- onEdit ----------
  const onEdit = useCallback(async (editMessage: AppendMessage) => {
    if (!currentThreadId) return;

    abortRef.current?.abort();

    setIsRunning(true);
    const assistantId = genId();
    const runId = `run_${Date.now()}`;
    runIdRef.current = runId;

    // 追加一条编辑后的 user + 新 assistant running
    const editUserId = genId();
    setMessages(prev => [...prev, {
      id: editUserId,
      ...editMessage
    } as unknown as ThreadMessage, {
      id: assistantId, role: 'assistant',
      content: [{ type: 'text', text: '' }],
      status: { type: 'running' }, metadata: {},
    } as unknown as ThreadMessage]);

    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const timing = await streamRunInSession({
        sessionId: currentThreadId,
        signal: ac.signal,
        message: editMessage,
        messages,
        context: runtime.current?.thread.getModelContext(),
        requestedBy,
        renderRegistry: renderRegistryRef.current,
        preamble: preambleRef.current,
        onMessageChange(content) {
          setMessages(prev => prev.map(m =>
            m.id === assistantId
              ? { ...m, content } as ThreadMessage
              : m,
          ));
        },
      });

      setMessages(prev => prev.map(m =>
        m.id === assistantId
          ? { ...m, status: { type: 'complete' as const, reason: 'stop' as const }, metadata: { ...(m.metadata as any), timing } } as ThreadMessage
          : m,
      ));
    } finally {
      setIsRunning(false);
      runIdRef.current = null;
      abortRef.current = null;
    }
  }, [currentThreadId, requestedBy]);

  // ---------- onCancel ----------
  const onCancel = useCallback(async () => {
    abortRef.current?.abort();

    // 如果后端有 cancel endpoint 可以在这调用
    // const runId = runIdRef.current;
    // if (runId) { ... }

    setIsRunning(false);
    runIdRef.current = null;
  }, []);

  // ---------- store ----------
  const store: ExternalStoreAdapter = {
    messages,
    isRunning,
    onNew,
    onEdit,
    onReload,
    onCancel,
    unstable_enableToolInvocations: true,
    onAddToolResult: (options) => {
      cacheToolResult(options);
      // 更新最后一条 assistant 消息中匹配的 tool-call part 的 result 和状态
      // setMessages(prev => {
      //   const lastAssistantIdx = prev.map(m => m.role).lastIndexOf('assistant');
      //   if (lastAssistantIdx < 0) return prev;
      //   const msg = prev[lastAssistantIdx];
      //   const content = msg.content.map(part => {
      //     if (part.type !== 'tool-call' || (part as any).toolCallId !== options.toolCallId) return part;
      //     return { ...part, status: { type: 'complete' as const, reason: 'stop' as const }, result: options.result } as ThreadAssistantMessagePart;
      //   });
      //   const updated = [...prev];
      //   updated[lastAssistantIdx] = { ...msg, content } as ThreadMessage;
      //   return updated;
      // });
    },
    setToolStatuses: (statuses) => { setToolStatuses(statuses); },

    adapters: {
      threadList: {
        threadId: currentThreadId,
        threads,
        onSwitchToThread: async (id) => { setCurrentThreadId(id); },
        onSwitchToNewThread: async () => { setCurrentThreadId(undefined); },
        onRename: async (id, title) => {
          await sessionApi.fetch(`/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ title }),
          });
          setThreads(prev => prev.map(t => t.id === id ? { ...t, title } : t));
        },
        onArchive: async (id) => {
          await sessionApi.fetch(`/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status: 'archived' }),
          });
          setThreads(prev => prev.filter(t => t.id !== id));
        },
        onDelete: async (id) => {
          await sessionApi.fetch(`/${id}`, { method: 'DELETE' });
          if (currentThreadId === id) setCurrentThreadId(undefined);
          setThreads(prev => prev.filter(t => t.id !== id));
        },
      },
      attachments: attachmentAdapter,
      speech: speechAdapter,
      feedback: feedbackAdapter,
    },
    
  };

  runtime.current = useExternalStoreRuntime(store);
  return runtime.current;
};

// ==================== useReadOnlyRuntime ====================

/**
 * 只读模式 Runtime — 将后端消息转为只读 AssistantRuntime
 * 用于会话管理中的详情弹窗，仅展示历史记录，不发送消息
 */
export function useReadOnlyRuntime(messages: AgentSessionMessage[]): AssistantRuntime {
  const store = useMemo<ExternalStoreAdapter>(() => {
    if (!messages || messages.length === 0) {
      return {
        messages: [],
        isRunning: false,
        onNew: async () => {},
        onEdit: async () => {},
        onReload: async () => {},
        onCancel: async () => {},
        onCopy: async () => true,
        onNewThread: async () => {},
        onSwitchThread: async () => {},
        onAddToolResult: () => {},
      };
    }

    const threadMessages = messages
      .map(toThreadMessage)
      .filter((m): m is ThreadMessage => m !== null);

    return {
      messages: threadMessages,
      isRunning: false,
      onNew: async () => {},
      onEdit: async () => {},
      onReload: async () => {},
      onCancel: async () => {},
      onCopy: async () => true,
      onNewThread: async () => {},
      onSwitchThread: async () => {},
      onAddToolResult: () => {},
    };
  }, [messages]);

  return useExternalStoreRuntime(store);
}
