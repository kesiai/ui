/**
 * AI 交互请求类型（询问模式）。
 *
 * 由 ai-agent 的 SSE 事件产生（permission-request / elicitation-request），
 * 供 runtime 解析后用，也供 interaction-request-card 渲染询问 UI 用。
 * 定义在 ai-agent 内部，供运行时事件解析与询问卡片渲染共享。
 */

/** 运行时交互请求（permission-request / elicitation-request） */
export interface AgentInteractionRequest {
  /** 请求类型：工具批准 (approval) 或 表单补充输入 (input) */
  kind: 'approval' | 'input';
  /** 对应 SSE 事件名：permission-request / elicitation-request */
  eventType: 'permission-request' | 'elicitation-request';
  /** 回传给 POST /messages/{id}/permission-reply 的 requestId（必取 payload.requestId） */
  requestId: string;
  /** 事件所属消息 id，用于构造 reply 请求地址 */
  messageId: string;
  /** 交互标题（payload.title） */
  title?: string;
  /** 交互提示语（payload.message） */
  message?: string;
  /** 需要用户补充信息的表单结构（elicitation-request 可选） */
  schema?: unknown;
  /** 已有表单值（elicitation-request 可选） */
  input?: Record<string, unknown>;
  /** 待批准的工具信息（permission-request 可选） */
  tool?: string;
  /** 工具输入参数（permission-request 可选） */
  toolInput?: unknown;
  /** opencode 权限标识（permission-request 可选） */
  opencodePermissionId?: string;
  /** 交互接收时间（用于自动超时/去重） */
  receivedAt?: number;
}

/** permission-reply 的 action 枚举 */
export type InteractionReplyAction =
  | 'approve_once'
  | 'approve_always'
  | 'deny'
  | 'submit'
  | 'cancel';
