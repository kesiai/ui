import { useState, useEffect, useCallback, useRef } from "react";
import {
  useExternalStoreRuntime,
  CompositeAttachmentAdapter,
  SimpleImageAttachmentAdapter,
  SimpleTextAttachmentAdapter,
  type SpeechSynthesisAdapter,
  type FeedbackAdapter,
  type ExternalStoreAdapter,
  type ThreadMessage,
  type AppendMessage,
  type ThreadAssistantMessagePart,
} from "@assistant-ui/react";
import { createAPI, getConfig } from '@kesi/client'

type AgentSessionMessage = {
  id?: string;
  sessionId?: string;
  agentId?: string;
  role: string;                         // "user" | "assistant" | "tool"
  type: string;                         // "text" | "thinking" | "tool_use" | "tool_result" | "error"
  content?: string;                     // 文本内容（替代原来的 message）
  tool?: string;                        // 工具名称
  input?: any;                          // 工具输入
  output?: string;                      // 工具输出
  payload?: Record<string, any>;        // 扩展负载
  metadata?: Record<string, any>;
  seq?: number;                         // 同一 run 下的过程序号
  runId?: string;
  sourceMessageId?: string;             // 触发该过程消息的用户消息 ID
  createdBy?: string;
  createdAt?: string;
};

const agentApi = createAPI({ name: 'eap/agents' });
const sessionApi = createAPI({ name: 'eap/agent-sessions' });
const feedbackApi = createAPI({ name: 'eap/feedbacks' });

// ==================== Attachment Adapter ====================
const attachmentAdapter = new CompositeAttachmentAdapter([
  new SimpleImageAttachmentAdapter(),
  new SimpleTextAttachmentAdapter(),
]);

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

/** 后端 AgentSessionMessage → ThreadMessage */
function toThreadMessage(m: AgentSessionMessage): ThreadMessage | null {
  const id = m.id ?? genId();
  const now = new Date(m.createdAt ?? Date.now());
  const metadata = { custom: {} as Record<string, unknown> };
  const base = { id, createdAt: now, metadata };

  // ─── tool_use → ToolCallMessagePart ──────────────────────────
  if (m.type === 'tool_use') {
    return {
      ...base,
      role: 'assistant' as const,
      content: [{
        type: 'tool-call' as const,
        toolCallId: m.runId ?? id,
        toolName: m.tool ?? '',
        args: (m.input ?? {}) as any,
        argsText: typeof m.input === 'string' ? m.input : JSON.stringify(m.input ?? {}),
      }],
      status: { type: 'complete' as const, reason: 'stop' as const },
    } as unknown as ThreadMessage;
  }

  // ─── tool_result → 嵌入到对应 tool-call 的 result 字段 ──────
  //  ToolCallMessagePart.result 本身可携带结果；这里用 DataMessagePart
  //  占位，runtime 加载历史时会以 tool-call + result 形式展示。
  if (m.type === 'tool_result') {
    return {
      ...base,
      role: 'assistant' as const,
      content: [{
        type: 'data' as const,
        name: `tool_result:${m.tool ?? ''}`,
        data: {
          toolCallId: m.runId ?? id,
          toolName: m.tool ?? '',
          output: m.output ?? m.content ?? '',
        },
      }],
      status: { type: 'complete' as const, reason: 'stop' as const },
    } as unknown as ThreadMessage;
  }

  // ─── thinking → ReasoningMessagePart ──────────────────────────
  if (m.type === 'thinking') {
    return {
      ...base,
      role: 'assistant' as const,
      content: [{ type: 'reasoning' as const, text: m.content ?? '' }],
      status: { type: 'complete' as const, reason: 'stop' as const },
    } as unknown as ThreadMessage;
  }

  // ─── text / error → TextMessagePart ───────────────────────────
  const text = m.type === 'error' ? `[Error] ${m.content ?? ''}` : (m.content ?? '');

  if (m.role === 'assistant') {
    return {
      ...base,
      role: 'assistant' as const,
      content: [{ type: 'text' as const, text }],
      status: { type: 'complete' as const, reason: 'stop' as const },
    } as unknown as ThreadMessage;
  }

  // user（含 system 等兜底）
  return {
    ...base,
    role: 'user' as const,
    content: [{ type: 'text' as const, text }],
    attachments: [] as readonly any[],
  } as unknown as ThreadMessage;
}

function getLastAssistantText(sessionMessages: AgentSessionMessage[]) {
  const lastAssistant = [...sessionMessages].reverse().find((m) => m.role === "assistant");
  return lastAssistant?.message ?? "";
}

/**
 * POST .../messages?stream=true 读取 SSE 流，逐步构建 assistant 消息的 content parts。
 *
 * 每次内容变化时通过 onMessageChange 回调最新的 parts 数组，
 * 调用方用其直接替换 assistant 消息的 content。
 */
async function streamRunInSession(params: {
  sessionId: string;
  userText: string;
  requestedBy: string;
  signal: AbortSignal;
  onMessageChange: (content: ThreadAssistantMessagePart[]) => void;
}): Promise<void> {
  const { sessionId, userText, requestedBy, signal, onMessageChange } = params;

  const sessionApi = createAPI({ name: 'eap/agent-sessions' })
  const host = (sessionApi as any).host ?? getConfig().rest ?? '/rest/';
  const url = `${host}eap/agent-sessions/${sessionId}/messages?stream=true`;
  const headers: Record<string, string> = sessionApi.headers;

  console.log('[streamRunInSession] start fetching SSE stream...', { url, sessionId, userText });

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      role: 'user',
      type: 'text',
      content: userText,
      metadata: {},
      requestedBy,
    }),
    signal,
  });

  if (!response.ok || !response.body) return;

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let textContent = '';
  let finalText = '';

  // 按 callId 索引 tool-call part 在 content 数组中的位置
  const toolIdxMap = new Map<string, number>();
  const parts: ThreadAssistantMessagePart[] = [];

  function emit() {
    onMessageChange([...parts]);
  }

  function upsertTextPart(text: string) {
    textContent = text;
    const i = parts.findIndex(p => p.type === 'text');
    const textPart: ThreadAssistantMessagePart = { type: 'text', text };
    if (i >= 0) {
      parts[i] = textPart;
    } else {
      // 文本放在工具调用之前
      parts.unshift(textPart);
      // 修正后面 tool-call 的索引
      toolIdxMap.forEach((idx, callId) => toolIdxMap.set(callId, idx + 1));
    }
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

        if (!dataStr || dataStr === '[DONE]') continue;

        try {
          const parsed = JSON.parse(dataStr);

          if (eventType === 'run:output') {
            const text = parsed.data?.payload?.text;
            if (text && text !== textContent) {
              upsertTextPart(text);
              emit();
            }
          } else if (eventType === 'run:completed') {
            const final = parsed.data?.payload?.assistantMessage;
            if (final) {
              finalText = final;
              if (final !== textContent) upsertTextPart(final);
              emit();
            }
          } else if (eventType === 'run:tool_use') {
            const { tool, callId, input } = parsed.data?.payload ?? {};
            console.log('[streamRunInSession] tool use', { tool, callId, input });
            if (!callId) continue;
            const toolPart: ThreadAssistantMessagePart = {
              type: 'tool-call',
              toolCallId: callId,
              toolName: tool ?? '',
              args: (input ?? {}) as any,
              argsText: typeof input === 'string' ? input : JSON.stringify(input ?? {}),
            };
            toolIdxMap.set(callId, parts.length);
            parts.push(toolPart);
            emit();
          } else if (eventType === 'run:tool_result') {
            const { tool, callId, output } = parsed.data?.payload ?? {};
            console.log('[streamRunInSession] tool result', { tool, callId, output });
            if (!callId) continue;
            const i = toolIdxMap.get(callId);
            if (i !== undefined) {
              const p = parts[i] as any;
              parts[i] = { ...p, result: output } as ThreadAssistantMessagePart;
              emit();
            }
          }
        } catch {
          // 非 JSON data 行，跳过
        }
      }
    }
  } catch (err: any) {
    if (err.name !== 'AbortError') throw err;
  }
}

// ==================== useAgentRuntime ====================

export const useAgentRuntime = (agentId: string) => {
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

  const runIdRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

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

  // ---------- thread 切换时加载消息 ----------
  useEffect(() => {
    if (!currentThreadId) {
      setMessages([]);
      return;
    }
    sessionApi.fetch(`/${currentThreadId}/messages`, { method: 'GET' })
      .then(({ json }) => setMessages(
        (json as AgentSessionMessage[]).map(toThreadMessage).filter((m): m is ThreadMessage => m != null),
      ))
      .catch(() => setMessages([]));
  }, [currentThreadId]);

  // ---------- onNew ----------
  const onNew = useCallback(async (message: AppendMessage) => {
    console.log('[onNew] ========== START ==========', {
      currentThreadId,
      userText: message.content?.[0]?.type === 'text' ? message.content[0].text : '(empty)',
      timestamp: new Date().toISOString(),
    });

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

        setCurrentThreadId(newId);
        setThreads(prev => [...prev, {
          status: 'regular' as const,
          id: newId,
          remoteId: newId,
          title: userText.slice(0, 30),
        }]);
        return newId;
      })();

    console.log('[onNew] resolved sessionId', {
      sessionId,
      isNewThread: !currentThreadId, // 创建时的 currentThreadId 值
    });

    // 乐观插入 user + assistant
    const userId = genId();
    const assistantId = genId();
    const runId = `run_${Date.now()}`;
    runIdRef.current = runId;

    console.log('[onNew] optimistic messages', { userId, assistantId, runId, userText });

    const userMsg: ThreadMessage = {
      id: userId, role: 'user',
      content: [{ type: 'text', text: userText }],
      attachments: [], metadata: {},
    } as unknown as ThreadMessage;
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
      // 新创建的 session 已在 initialMessage 中发送，无需重复 trigger
      // if (currentThreadId) {
      //   console.log('[onNew] triggering run for existing session', { sessionId, userText });
      // } else {
      //   console.log('[onNew] skip trigger — new session already received initialMessage', { sessionId });
      // }

      console.log('[onNew] start SSE stream...', { sessionId });
      await streamRunInSession({
        sessionId,
        signal: ac.signal,
        userText,
        requestedBy,
        onMessageChange(content) {
          console.log('[onNew] SSE: content updated', { assistantId, parts: content.map(p => p.type) });
          setMessages(prev => prev.map(m =>
            m.id === assistantId
              ? { ...m, content } as ThreadMessage
              : m,
          ));
        },
      });

      // 标记 complete
      console.log('[onNew] SSE done, marking complete', { assistantId });
      setMessages(prev => prev.map(m =>
        m.id === assistantId
          ? { ...m, status: { type: 'complete' as const, reason: 'stop' as const } }
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


      await streamRunInSession({
        sessionId: currentThreadId,
        signal: ac.signal,
        userText,
        requestedBy,
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
          ? { ...m, status: { type: 'complete' as const, reason: 'stop' as const } }
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

    const newText = editMessage.content?.[0]?.type === 'text'
      ? editMessage.content[0].text
      : '';

    setIsRunning(true);
    const assistantId = genId();
    const runId = `run_${Date.now()}`;
    runIdRef.current = runId;

    // 追加一条编辑后的 user + 新 assistant running
    const editUserId = genId();
    setMessages(prev => [...prev, {
      id: editUserId, role: 'user',
      content: [{ type: 'text', text: newText }],
      attachments: [], metadata: {},
    } as unknown as ThreadMessage, {
      id: assistantId, role: 'assistant',
      content: [{ type: 'text', text: '' }],
      status: { type: 'running' }, metadata: {},
    } as unknown as ThreadMessage]);

    const ac = new AbortController();
    abortRef.current = ac;

    try {

      await streamRunInSession({
        sessionId: currentThreadId,
        signal: ac.signal,
        userText,
        requestedBy,
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
          ? { ...m, status: { type: 'complete' as const, reason: 'stop' as const } }
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

  return useExternalStoreRuntime(store);
};
