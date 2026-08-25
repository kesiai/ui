"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BotIcon, XIcon } from "lucide-react";
import {
  Assistant,
  AgentUIProvider,
  AgentSelect,
  type AvatarSettings,
} from "@/registry/components/ai-agent/ai-agent";
import { useAgentRuntime } from "@/registry/components/ai-agent/runtime";
import type { RenderRegistry } from "@/registry/components/ai-agent/registry";
import { AssistantRuntimeProvider } from "@assistant-ui/react";

/**
 * AI 按钮 —— 点击弹出「任务模式」AI 对话弹窗。
 *
 * 与 ai-modal 的区别：
 *  - UI：触发为普通 Button，弹窗在页面中心（标准 Dialog）
 *  - 任务：执行时创建一个 Task（isTaskRuntime: true，走 /eap/tasks）
 *  - 智能体：在弹窗内通过 AgentSelect 页面上选择，不由配置写死
 *  - 自定义系统提示词：通过 preamble 传入，首条消息注入
 *  - 每次打开弹窗时重建 runtime，不保留上次对话内容
 *
 * 底层全部复用 ai-agent 能力（useAgentRuntime / Assistant / AgentSelect / Thread），
 * 不重复实现 runtime / 会话 / 渲染逻辑。
 */
interface AIButtonProps {
  /** 按钮文案 */
  label?: React.ReactNode;
  /** 按钮变体（透传 ui/button） */
  variant?: React.ComponentProps<typeof Button>["variant"];
  /** 按钮尺寸（透传 ui/button） */
  size?: React.ComponentProps<typeof Button>["size"];
  /** 按钮图标（渲染在 label 左侧） */
  icon?: React.ReactNode;
  /** 按钮扩展类名 */
  className?: string;
  /** 弹窗标题 */
  title?: React.ReactNode;
  /** 自定义系统提示词（通过 preamble 首条消息注入，定义助手行为/角色） */
  preamble?: string;
  /** 自定义显示组件注册表（透传 ai-agent） */
  renderRegistry?: RenderRegistry;
  /** 头像配置（透传 ai-agent） */
  avatar?: AvatarSettings;
  /** 弹窗宽度（CSS 值，如 "min(48rem, 92vw)"） */
  dialogWidth?: string;
  /** 弹窗高度（CSS 值，如 "min(36rem, 85vh)"） */
  dialogHeight?: string;
  /** 是否只读（隐藏输入框） */
  readOnly?: boolean;
  /** 受控：是否打开 */
  open?: boolean;
  /** 受控：打开状态变化 */
  onOpenChange?: (open: boolean) => void;
}

/**
 * 弹窗内容（任务模式对话）。
 * 挂在 key 控制的子组件中：每次打开 key 递增 → 本组件重挂载 → useAgentRuntime 重建 → 清空上次消息。
 */
const AgentTaskDialog: React.FC<{
  title?: React.ReactNode;
  preamble?: string;
  renderRegistry?: RenderRegistry;
  avatar?: AvatarSettings;
  readOnly?: boolean;
  onClose: () => void;
}> = ({ title, preamble, renderRegistry, avatar, readOnly, onClose }) => {
  // 任务模式 runtime：每次挂载重建，创建 Task（isTaskRuntime: true，走 /eap/tasks）。
  // agentId 不在此传死，由弹窗内 AgentSelect 在页面选择。
  const runtime = useAgentRuntime({
    isTaskRuntime: true,
    preamble,
    renderRegistry,
  });

  if (!runtime) return null;

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {/* 弹窗头部：标题 + Agent 选择 + 关闭 */}
      <DialogHeader className="border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <BotIcon className="size-4 shrink-0 text-primary" />
            {title && (
              <DialogTitle className="truncate text-sm font-semibold">
                {title}
              </DialogTitle>
            )}
            {/* 智能体：在弹窗内页面选择（运行时选择，不走配置写死） */}
            <div className="w-40 shrink-0">
              <AgentSelect />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 shrink-0 items-center justify-center rounded transition-colors hover:bg-accent"
            aria-label="关闭"
          >
            <XIcon className="size-4" />
          </button>
        </div>
      </DialogHeader>

      {/* 主体：任务模式对话（纯对话，隐藏任务详情侧栏与左侧会话栏） */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <Assistant
          runtime={runtime}
          title={typeof title === "string" ? title : undefined}
          avatar={avatar}
          showAgentSelect={false}
          hideSidebar
          hideTaskPanel
          readOnly={readOnly}
        />
      </div>
    </AssistantRuntimeProvider>
  );
};

export const AIButton = ({
  label = "AI 助手",
  variant = "default",
  size = "default",
  icon = <BotIcon className="size-4" />,
  className,
  title = "AI 助手",
  preamble,
  renderRegistry,
  avatar,
  dialogWidth = "min(48rem, 92vw)",
  dialogHeight = "min(36rem, 85vh)",
  readOnly = false,
  open,
  onOpenChange,
}: AIButtonProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  // 每次打开时递增，作为弹窗内容 key → 强制重建 runtime，清空上次对话
  const [sessionKey, setSessionKey] = React.useState(0);

  const isOpen = open ?? internalOpen;

  const handleOpenChange = (v: boolean) => {
    // 打开时递增 key，确保本次内容全新（不保留上次消息）
    if (v) setSessionKey((k) => k + 1);
    setInternalOpen(v);
    onOpenChange?.(v);
  };

  return (
    <AgentUIProvider avatar={avatar}>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant={variant} size={size} className={className}>
            {icon && <span className="mr-2">{icon}</span>}
            {label}
          </Button>
        </DialogTrigger>

        <DialogContent
          className="flex flex-col gap-0 p-0 overflow-hidden"
          style={{ width: dialogWidth, height: dialogHeight, maxWidth: "none" }}
          showCloseButton={false}
        >
          {/* key 变化 → AgentTaskDialog 重挂载 → runtime 重建 → 消息清空 */}
          <AgentTaskDialog
            key={sessionKey}
            title={title}
            preamble={preamble}
            renderRegistry={renderRegistry}
            avatar={avatar}
            readOnly={readOnly}
            onClose={() => handleOpenChange(false)}
          />
        </DialogContent>
      </Dialog>
    </AgentUIProvider>
  );
};

export default AIButton;
