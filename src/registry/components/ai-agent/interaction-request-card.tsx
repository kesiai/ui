"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Questionnaire,
  type QuestionnaireItemDefinition,
} from "@/components/ui/questionnaire";
import {
  ShieldQuestion,
  ClipboardList,
  Check,
  Loader2,
} from "lucide-react";
import type {
  AgentInteractionRequest,
  InteractionReplyAction,
} from "./ai-interaction";

/**
 * 询问模式交互卡片（ai-agent 内部组件）。
 *
 * - permission-request（kind=approval）：工具执行等待用户批准，提供 批准一次 / 始终批准 / 拒绝。
 * - elicitation-request（kind=input）：运行时等用户补充表单输入，用 shadcn 官方 Questionnaire 渲染。
 *
 * 用户作答后调用 reply(action, updatedInput)，由上层 POST /messages/{id}/permission-reply。
 * 表单使用官方 @shadcn/react 的 questionnaire（已移植为本地组件 src/components/ui/questionnaire）。
 * 类型定义在 ai-agent 内部（./ai-interaction）。
 */

type ReplyFn = (
  action: InteractionReplyAction,
  updatedInput?: Record<string, unknown>,
) => void;

/**
 * 将后端 schema 解析为 Questionnaire 的 items 定义。
 * schema 结构未知，兼容三种常见形态：
 *  1. 数组：[{ name, prompt/label, description, choices, input }]
 *  2. JSON Schema 对象：{ type:'object', properties, required }（枚举→choice，否则→input）
 *  3. 字符串提示（无结构）：兜底为单个 input
 * 返回的 items 仅作导航/校验/选项定义，渲染时按相同结构 map 出 Questionnaire.Item。
 */
function parseSchema(schema: unknown, req: AgentInteractionRequest): Array<{
  name: string;
  label: string;
  required?: boolean;
  choices?: Array<{ value: string; label: string }>;
  placeholder?: string;
}> {
  const fallbackLabel = req.title ?? req.message ?? "请补充信息";
  if (!schema) {
    return [{ name: "answer", label: fallbackLabel, required: true }];
  }

  // 1) 数组形态
  if (Array.isArray(schema)) {
    const fields = schema.map((raw) => {
      const s = (raw ?? {}) as Record<string, any>;
      const name = String(s.name ?? s.id ?? "field");
      const choices = Array.isArray(s.enum)
        ? s.enum.map((v: string) => ({ value: String(v), label: String(v) }))
        : Array.isArray(s.choices)
          ? s.choices.map((c: any) => ({ value: String(c.value ?? c), label: c.label ?? String(c.value ?? c) }))
          : undefined;
      return {
        name,
        required: Boolean(s.required),
        label: String(s.prompt ?? s.title ?? s.label ?? name),
        choices,
        placeholder: typeof s.input === 'object' && s.input
          ? String(s.input.placeholder ?? '')
          : undefined,
      };
    });
    return fields.length ? fields : [{ name: "answer", label: fallbackLabel, required: true }];
  }

  // 2) JSON Schema 对象形态
  if (typeof schema === 'object' && schema !== null) {
    const obj = schema as Record<string, any>;
    const props = obj.properties && typeof obj.properties === 'object' ? obj.properties : {};
    const requiredArr: string[] = Array.isArray(obj.required) ? obj.required : [];
    const keys = Object.keys(props);
    if (keys.length) {
      return keys.map((name) => {
        const p = props[name] as Record<string, any> || {};
        const choices = Array.isArray(p.enum)
          ? p.enum.map((v: string) => ({ value: String(v), label: String(v) }))
          : undefined;
        return {
          name,
          required: requiredArr.includes(name),
          label: String(p.title ?? p.description ?? name),
          choices,
          placeholder: typeof p.description === 'string' ? p.description : '',
        };
      });
    }
  }

  return [{ name: "answer", label: fallbackLabel, required: true }];
}

// ==================== 工具执行等待批准（questionnaire 单选确认） ====================

const permissionChoices: Array<{ value: InteractionReplyAction; label: string }> = [
  { value: 'approve_once', label: '批准一次' },
  { value: 'approve_always', label: '始终批准' },
  { value: 'deny', label: '拒绝' },
];

export const PermissionRequestCard: React.FC<{
  request: AgentInteractionRequest;
  onReply: ReplyFn;
}> = ({ request, onReply }) => {
  const [busy, setBusy] = React.useState(false);

  // 单个确认项：approval → approve_once / approve_always / deny
  const items: QuestionnaireItemDefinition[] = React.useMemo(
    () => [{ name: 'approval', required: true, choices: permissionChoices.map((c) => ({ value: c.value })) }],
    [],
  );

  const handleSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const value = String(formData.get('approval') ?? '');
      const action = permissionChoices.find((c) => c.value === value)?.value;
      if (!action) return;
      setBusy(true);
      onReply(action);
      setBusy(false);
    },
    [onReply],
  );

  return (
    <Card className="my-2 bg-background">
      <CardHeader className="gap-1.5 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <ShieldQuestion className="size-4" />
          {request.title || "工具执行需要您的批准"}
        </CardTitle>
        {request.message && (
          <CardDescription className="text-sm whitespace-pre-wrap">
            {request.message}
          </CardDescription>
        )}
        {request.tool && (
          <div className="bg-muted flex flex-wrap gap-1.5 rounded-md px-2 py-1 text-xs">
            <span className="text-muted-foreground">工具</span>
            <code className="font-mono">{request.tool}</code>
            {request.opencodePermissionId && (
              <span className="text-muted-foreground">· {request.opencodePermissionId}</span>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="pb-3">
        <Questionnaire.Root
          items={items}
          onSubmit={handleSubmit}
          className="space-y-3"
        >
          <Questionnaire.Item name="approval" required>
            <Questionnaire.Title className="sr-only">选择操作</Questionnaire.Title>
            <Questionnaire.Choices className="flex flex-wrap gap-2">
              {permissionChoices.map((c) => (
                <Questionnaire.Choice
                  key={c.value}
                  value={c.value}
                  className="flex cursor-pointer items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm hover:bg-accent"
                >
                  <Questionnaire.ChoiceInput className="size-4" />
                  <Questionnaire.ChoiceLabel>{c.label}</Questionnaire.ChoiceLabel>
                  <Questionnaire.ChoiceShortcut />
                </Questionnaire.Choice>
              ))}
            </Questionnaire.Choices>
            <Questionnaire.Error className="text-destructive mt-1 text-xs" />
          </Questionnaire.Item>
          <div className="flex items-center justify-end gap-2 pt-1">
            <Questionnaire.Submit className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm whitespace-nowrap disabled:opacity-50">
              {busy ? <Loader2 className="size-4 shrink-0 animate-spin" /> : <Check className="size-4 shrink-0" />}
              {busy ? "提交中..." : "确定"}
            </Questionnaire.Submit>
          </div>
        </Questionnaire.Root>
      </CardContent>
    </Card>
  );
};

// ==================== 运行时等用户补充输入（官方 Questionnaire） ====================

export const ElicitationRequestCard: React.FC<{
  request: AgentInteractionRequest;
  onReply: ReplyFn;
}> = ({ request, onReply }) => {
  const [busy, setBusy] = React.useState(false);
  const fields = React.useMemo(() => parseSchema(request.schema, request), [request.schema, request]);

  // Questionnaire items 定义（名称/必填/选项），供 `items` prop 驱动导航与校验
  const items: QuestionnaireItemDefinition[] = React.useMemo(
    () =>
      fields.map((field) => ({
        name: field.name,
        required: field.required,
        choices: field.choices?.map((c) => ({ value: c.value })),
      })),
    [fields],
  );

  const handleSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const updatedInput: Record<string, unknown> = {};
      for (const [key, value] of formData.entries()) {
        updatedInput[key] = value;
      }
      setBusy(true);
      onReply('submit', updatedInput);
      setBusy(false);
    },
    [onReply],
  );

  if (fields.length === 0) return null;

  return (
    <Card className="my-2 bg-background">
      <CardHeader className="gap-1.5 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <ClipboardList className="size-4" />
          {request.title || "请补充信息"}
        </CardTitle>
        {request.message && (
          <CardDescription className="text-sm whitespace-pre-wrap">
            {request.message}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pb-3">
        <Questionnaire.Root items={items} onSubmit={handleSubmit} className="space-y-4">
          <Questionnaire.Progress />
          {fields.map((field) => {
            const choiceDef = field.choices?.find((c) => c.value === field.choices?.[0].value);
            const firstChoiceValue = choiceDef?.value;
            return (
              <Questionnaire.Item
                key={field.name}
                name={field.name}
                required={field.required}
              >
                <Questionnaire.Title className="text-sm font-semibold">
                  {field.label}
                </Questionnaire.Title>
                <Questionnaire.Choices className="mt-2 flex flex-wrap gap-3">
                  {field.choices?.map((c) => (
                    <Questionnaire.Choice
                      key={c.value}
                      value={c.value}
                      defaultChecked={c.value === firstChoiceValue}
                      className="flex cursor-pointer items-center gap-2 text-sm"
                    >
                      <Questionnaire.ChoiceInput className="size-4" />
                      <Questionnaire.ChoiceLabel>{c.label}</Questionnaire.ChoiceLabel>
                      <Questionnaire.ChoiceShortcut />
                    </Questionnaire.Choice>
                  ))}
                  {!field.choices && (
                    <Questionnaire.Input
                      aria-label={field.label}
                      placeholder={field.placeholder || "请输入"}
                      className="h-8"
                    />
                  )}
                </Questionnaire.Choices>
                <Questionnaire.Error className="text-destructive mt-1 text-xs" />
              </Questionnaire.Item>
            );
          })}
          <div className="flex items-center gap-2 pt-1">
            {fields.length > 1 && (
              <Questionnaire.Previous className="hover:bg-accent rounded-md px-3 py-1.5 text-sm">
                上一步
              </Questionnaire.Previous>
            )}
            <Questionnaire.Skip className="hover:bg-accent rounded-md px-3 py-1.5 text-sm">
              跳过
            </Questionnaire.Skip>
            {fields.length > 1 && (
              <Questionnaire.Next className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 py-1.5 text-sm">
                下一步
              </Questionnaire.Next>
            )}
            <Questionnaire.Submit className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm whitespace-nowrap disabled:opacity-50">
              {busy ? <Loader2 className="size-4 shrink-0 animate-spin" /> : <Check className="size-4 shrink-0" />}
              {busy ? "提交中..." : "提交"}
            </Questionnaire.Submit>
          </div>
        </Questionnaire.Root>
      </CardContent>
    </Card>
  );
};

/** 统一的询问模式卡片：按 kind 分发 */
export const InteractionRequestCard: React.FC<{
  request: AgentInteractionRequest;
  onReply: ReplyFn;
}> = ({ request, onReply }) => {
  return request.kind === 'approval'
    ? <PermissionRequestCard request={request} onReply={onReply} />
    : <ElicitationRequestCard request={request} onReply={onReply} />;
};

export default InteractionRequestCard;
