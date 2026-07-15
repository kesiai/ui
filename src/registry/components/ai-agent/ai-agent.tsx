"use client";

import {
  ComposerAddAttachment,
  ComposerAttachments,
  UserMessageAttachments,
} from "@/components/assistant-ui/attachment";
import { MarkdownText } from "@/components/assistant-ui/markdown-text";
import { DotMatrix } from "@/components/assistant-ui/dot-matrix";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
  ComposerQuotePreview,
  QuoteBlock,
  SelectionToolbar,
} from "@/components/assistant-ui/quote";
import { ComposerTriggerPopover } from "@/components/assistant-ui/composer-trigger-popover";
import { DirectiveText } from "@/components/assistant-ui/directive-text";
import { Source, Sources } from "@/components/assistant-ui/sources";
import { File } from "@/components/assistant-ui/file";
import { Image } from "@/components/assistant-ui/image";
import {
  ActionBarMorePrimitive,
  ActionBarPrimitive,
  type AssistantState,
  BranchPickerPrimitive,
  ComposerPrimitive,
  ErrorPrimitive,
  groupPartByType,
  MessagePrimitive,
  SuggestionPrimitive,
  ThreadPrimitive,
  unstable_useMentionAdapter,
  unstable_useSlashCommandAdapter,
  useAuiState,
  useMessageTiming,
  AssistantRuntimeProvider, type AssistantRuntime,
  Unstable_AudioMessagePart,
  type Unstable_SlashCommand,
  AuiIf,
  ThreadListItemMorePrimitive,
  ThreadListItemPrimitive,
  ThreadListPrimitive,
} from "@assistant-ui/react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BrainIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  DownloadIcon,
  FileTextIcon,
  GlobeIcon,
  HelpCircleIcon,
  LanguagesIcon,
  LoaderIcon,
  MenuIcon,
  MicIcon,
  MoreHorizontalIcon,
  PanelLeftIcon,
  PencilIcon,
  PlusIcon,
  RefreshCwIcon,
  ShareIcon,
  SlashIcon,
  SquareIcon,
  WrenchIcon,
  ArchiveIcon,
  TrashIcon,
} from "lucide-react";
import {
  LexicalComposerInput,
  type DirectiveChipProps,
} from "@assistant-ui/react-lexical";
import { createContext, useContext, useState, useEffect, type FC, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAPI } from '@kesi/client'
import { ToolResultCard } from "./render/tool-result-card";
import { KesiTextRenderer } from "./render/rich-text";
import type { RenderRegistry } from "./render/registry";

const RenderRegistryContext = createContext<RenderRegistry | undefined>(undefined);

// ==================== Agent UI Context ====================
// 头像配置类型（从 runtime.tsx 迁移）
export type AvatarConfig =
  | string
  | { type: "text"; text: string }
  | { type: "image"; src: string; alt?: string };

export interface AvatarSettings {
  /** 用户头像 */
  user?: AvatarConfig;
  /** 助手头像 */
  agent?: AvatarConfig;
}

/** 标准化头像格式 */
interface NormalizedAvatar {
  kind: "image" | "text";
  value: string;
  alt?: string;
}

/**
 * 标准化头像配置
 * @param a 头像配置
 * @returns 标准化后的头像，或 undefined
 */
export function normalizeAvatar(a: AvatarConfig | undefined | null): NormalizedAvatar | undefined {
  if (!a) return undefined;
  if (typeof a === "string") {
    if (!a) return undefined;
    const looksLikeImage =
      /^(https?:\/\/|data:|\/|\.\/|\.\.\/|blob:)/i.test(a) ||
      /\.(png|jpe?g|gif|webp|svg|bmp|avif|ico)$/i.test(a);
    return looksLikeImage ? { kind: "image", value: a } : { kind: "text", value: a };
  }
  return a.type === "image"
    ? { kind: "image", value: a.src, alt: a.alt }
    : { kind: "text", value: a.text };
}

/** Agent UI 上下文 - 存储需要在 UI 组件中访问的业务参数 */
interface AgentUIContextValue {
  /** 当前 Agent ID */
  agentId: string;
  /** 设置 Agent ID */
  setAgentId: (id: string) => void;
  /** 预计输入内容（前言） */
  preamble?: string;
  /** 头像设置 */
  avatar?: AvatarSettings;
}

export const AgentUIContext = createContext<AgentUIContextValue | null>(null);

/**
 * Agent UI Hook - 在 UI 组件中访问业务参数
 * @throws 如果在 AgentUIProvider 外部使用
 */
export const useAgentUI = (): AgentUIContextValue => {
  const ctx = useContext(AgentUIContext);
  if (!ctx) {
    throw new Error('useAgentUI must be used within AgentUIProvider');
  }
  return ctx;
};

/**
 * Agent UI Provider - 提供业务参数给整个组件树
 */
export const AgentUIProvider: FC<{
  children: ReactNode;
  initialAgentId: string;
  preamble?: string;
  avatar?: AvatarSettings;
}> = ({ children, initialAgentId, preamble, avatar }) => {
  const [agentId, setAgentId] = useState(initialAgentId);

  // 当 initialAgentId 变化时同步更新内部 state
  useEffect(() => {
    setAgentId(initialAgentId);
  }, [initialAgentId]);

  return (
    <AgentUIContext.Provider value={{ agentId, setAgentId, preamble, avatar }}>
      {children}
    </AgentUIContext.Provider>
  );
};

// ==================== 头像渲染辅助 ====================

/** 检查是否启用头像模式 */
const useAvatarMode = () => {
  const { avatar } = useAgentUI();
  return !!(avatar && (avatar.user || avatar.agent));
};

/** 头像渲染：avatar 模式下未配置的一方回退为默认文字头像（用户 U / 助手 A） */
const MessageAvatar: FC<{ kind: "user" | "agent"; className?: string }> = ({
  kind,
  className,
}) => {
  const { avatar } = useAgentUI();
  const raw = kind === "user" ? avatar?.user : avatar?.agent;
  const avatarConfig =
    normalizeAvatar(raw) ??
    { kind: "text" as const, value: kind === "user" ? "U" : "A" };
  return (
    <div
      className={cn(
        "bg-muted text-foreground/70 flex size-8 shrink-0 select-none items-center justify-center overflow-hidden rounded-full text-xs font-medium",
        className,
      )}
    >
      {avatarConfig.kind === "image" ? (
        <img
          src={avatarConfig.value}
          alt={avatarConfig.alt ?? (kind === "user" ? "用户头像" : "助手头像")}
          className="size-full object-cover"
        />
      ) : (
        <span className="truncate px-1">{avatarConfig.value}</span>
      )}
    </div>
  );
};

const Logo: FC = () => {
  return (
    <div className="flex items-center gap-2 px-2 text-sm font-medium">
      <span className="text-foreground/90">kesi-ui</span>
    </div>
  );
};

/** Agent 选择下拉列表 */
export const AgentSelect: FC = () => {
  const { agentId, setAgentId } = useAgentUI();
  const [agents, setAgents] = useState<Array<{ value: string; label: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const api = createAPI({ name: 'eap/agents' });
    api.fetch('').then(({ json }: any) => {
      const items = Array.isArray(json) ? json : [];
      setAgents(items.map((a: any) => ({ value: a.id, label: a.title || a.name || a.id })));
    }).catch(() => {
      setAgents([]);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-muted-foreground px-3 py-1.5 text-xs">加载...</div>;

  return (
    <Select value={agentId} onValueChange={setAgentId}>
      <SelectTrigger className="aui-agent-select h-8 w-full border-0 bg-transparent px-3 text-sm shadow-none hover:bg-accent">
        <SelectValue placeholder="选择 Agent" />
      </SelectTrigger>
      <SelectContent>
        {agents.length === 0 && (
          <SelectItem value="__empty__" disabled>无可用 Agent</SelectItem>
        )}
        {agents.map((a) => (
          <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export const Sidebar: FC<{ collapsed?: boolean; title?: string }> = ({ collapsed, title }) => {
  return (
    <aside
      className={cn(
        "flex h-full flex-col overflow-hidden transition-all duration-200",
        collapsed ? "w-12" : "w-65",
      )}
    >
      { title && (
        <div
          className={cn(
            "mt-2 flex h-12 shrink-0 items-center transition-[padding] duration-200",
            collapsed ? "px-3.5" : "px-6",
          )}
        >
          <span
            className={cn(
              "text-foreground/90 ml-2 text-sm font-medium whitespace-nowrap transition-opacity duration-200",
              collapsed && "opacity-0",
            )}
          >
            {title}
          </span>
        </div>
      )}
      {collapsed ? (
        <ThreadListPrimitive.New asChild>
          <TooltipIconButton
            tooltip="新对话"
            side="right"
            variant="ghost"
            size="icon"
            className="mt-1 ml-2 size-8"
          >
            <PlusIcon className="size-4" />
          </TooltipIconButton>
        </ThreadListPrimitive.New>
      ) : (
        <div className="relative w-65 flex-1 overflow-y-auto p-3">
          <AgentSelect />
          <ThreadList />
        </div>
      )}
    </aside>
  );
};

export const MobileSidebar: FC = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 md:hidden"
        >
          <MenuIcon className="size-4" />
          <span className="sr-only">切换菜单</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-70 flex-col p-0">
        <div className="flex h-12 shrink-0 items-center px-4">
          <Logo />
        </div>
        <div className="relative flex-1 overflow-y-auto p-3">
          <ThreadList />
        </div>
      </SheetContent>
    </Sheet>
  );
};


export const ThreadList: FC = () => {
  return (
    <ThreadListPrimitive.Root className="aui-root aui-thread-list-root flex flex-col gap-1">
      <ThreadListNew />
      <AuiIf condition={(s) => s.threads.isLoading}>
        <ThreadListSkeleton />
      </AuiIf>
      <AuiIf condition={(s) => !s.threads.isLoading}>
        <ThreadListPrimitive.Items>
          {() => <ThreadListItem />}
        </ThreadListPrimitive.Items>
      </AuiIf>
    </ThreadListPrimitive.Root>
  );
};

const ThreadListNew: FC = () => {
  return (
    <ThreadListPrimitive.New asChild>
      <Button
        variant="outline"
        className="aui-thread-list-new h-9 justify-start gap-2 rounded-lg px-3 text-sm hover:bg-muted data-active:bg-muted"
      >
        <PlusIcon className="size-4" />
        新对话
      </Button>
    </ThreadListPrimitive.New>
  );
};

const ThreadListSkeleton: FC = () => {
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          role="status"
          aria-label="Loading threads"
          className="aui-thread-list-skeleton-wrapper flex h-9 items-center px-3"
        >
          <Skeleton className="aui-thread-list-skeleton h-4 w-full" />
        </div>
      ))}
    </div>
  );
};

const ThreadListItem: FC = () => {
  return (
    <ThreadListItemPrimitive.Root className="aui-thread-list-item group flex h-9 items-center gap-2 rounded-lg transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none data-active:bg-muted">
      <ThreadListItemPrimitive.Trigger className="aui-thread-list-item-trigger flex h-full min-w-0 flex-1 items-center px-3 text-start text-sm">
        <span className="aui-thread-list-item-title min-w-0 flex-1 truncate">
          <ThreadListItemPrimitive.Title fallback="New Chat" />
        </span>
      </ThreadListItemPrimitive.Trigger>
      <ThreadListItemMore />
    </ThreadListItemPrimitive.Root>
  );
};

const ThreadListItemMore: FC = () => {
  return (
    <ThreadListItemMorePrimitive.Root>
      <ThreadListItemMorePrimitive.Trigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="aui-thread-list-item-more me-2 size-7 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:bg-accent data-[state=open]:opacity-100 group-data-active:opacity-100"
        >
          <MoreHorizontalIcon className="size-4" />
          <span className="sr-only">更多选项</span>
        </Button>
      </ThreadListItemMorePrimitive.Trigger>
      <ThreadListItemMorePrimitive.Content
        side="bottom"
        align="start"
        className="aui-thread-list-item-more-content z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
      >
        <ThreadListItemPrimitive.Archive asChild>
          <ThreadListItemMorePrimitive.Item className="aui-thread-list-item-more-item flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
            <ArchiveIcon className="size-4" />
            归档
          </ThreadListItemMorePrimitive.Item>
        </ThreadListItemPrimitive.Archive>
        <ThreadListItemPrimitive.Delete asChild>
          <ThreadListItemMorePrimitive.Item className="aui-thread-list-item-more-item flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-destructive text-sm outline-none hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive">
            <TrashIcon className="size-4" />
            删除
          </ThreadListItemMorePrimitive.Item>
        </ThreadListItemPrimitive.Delete>
      </ThreadListItemMorePrimitive.Content>
    </ThreadListItemMorePrimitive.Root>
  );
};

const ThreadTitle: FC = () => {
  const title = useAuiState(
    (s) =>
      s.threads.threadItems.find((t) => t.id === s.threads.mainThreadId)?.title,
  );

  return (
    <span className="min-w-0 truncate text-sm font-medium">
      {title ?? "新对话"}
    </span>
  );
};

export const Header: FC<{
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}> = ({ sidebarCollapsed, onToggleSidebar }) => {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 px-4">
      <MobileSidebar />
      <TooltipIconButton
        variant="ghost"
        size="icon"
        tooltip={sidebarCollapsed ? "显示侧边栏" : "隐藏侧边栏"}
        side="bottom"
        onClick={onToggleSidebar}
        className="hidden size-8 md:flex"
      >
        <PanelLeftIcon className="size-4" />
      </TooltipIconButton>
      <ThreadTitle />
      <TooltipIconButton
        variant="ghost"
        size="icon"
        tooltip="分享"
        side="bottom"
        disabled
        className="ml-auto size-8"
      >
        <ShareIcon className="size-4" />
      </TooltipIconButton>
    </header>
  );
};

// Startup exposes a loading placeholder thread; treat it as a new chat so
// the composer mounts centered. Loads after startup keep the docked layout.
const isNewChatView = (s: AssistantState) =>
  s.thread.messages.length === 0 &&
  (!s.thread.isLoading || s.threads.isLoading);

export const Thread: FC<{ readOnly?: boolean }> = ({ readOnly }) => {
  const isEmpty = useAuiState(isNewChatView);

  return (
    <ThreadPrimitive.Root
      className="aui-root aui-thread-root bg-background @container flex h-full flex-col"
      style={{
        ["--thread-max-width" as string]: "44rem",
        ["--composer-bg" as string]:
          "color-mix(in oklab, var(--color-muted) 30%, var(--color-background))",
        ["--composer-radius" as string]: "1.5rem",
        ["--composer-padding" as string]: "8px",
      }}
    >
      <ThreadPrimitive.Viewport
        turnAnchor="top"
        data-slot="aui_thread-viewport"
        className={cn(
          "relative flex flex-1 flex-col overflow-x-auto overflow-y-scroll scroll-smooth px-4 pt-4",
          isEmpty && "justify-center",
        )}
      >
        <AuiIf condition={isNewChatView}>
          <ThreadWelcome />
        </AuiIf>

        <div
          data-slot="aui_message-group"
          className="mb-14 flex flex-col gap-y-6 empty:hidden"
        >
          <ThreadPrimitive.Messages>
            {({ message }) => {
              if (message.composer.isEditing) return <EditComposer />;
              if (message.role === "user") return <UserMessage />;
              return <AssistantMessage />;
            }}
          </ThreadPrimitive.Messages>
        </div>

        {!readOnly && (
        <ThreadPrimitive.ViewportFooter
          className={cn(
            "aui-thread-viewport-footer bg-background mx-auto flex w-full max-w-(--thread-max-width) flex-col gap-4 overflow-visible pb-4 md:pb-6",
            !isEmpty && "sticky bottom-0 mt-auto rounded-t-(--composer-radius)",
          )}
        >
          <ThreadScrollToBottom />
          <Composer />
          <AuiIf condition={isNewChatView}>
            <div className="aui-thread-welcome-suggestions-shell min-h-19">
              <AuiIf condition={(s) => s.composer.isEmpty}>
                <ThreadSuggestions />
              </AuiIf>
            </div>
          </AuiIf>
        </ThreadPrimitive.ViewportFooter>
        )}
      </ThreadPrimitive.Viewport>

      <SelectionToolbar />
    </ThreadPrimitive.Root>
  );
};

const ThreadScrollToBottom: FC = () => {
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <TooltipIconButton
        tooltip="滚动到底部"
        variant="outline"
        className="aui-thread-scroll-to-bottom dark:border-border dark:bg-background dark:hover:bg-accent absolute -top-12 z-10 self-center rounded-full p-4 disabled:invisible"
      >
        <ArrowDownIcon />
      </TooltipIconButton>
    </ThreadPrimitive.ScrollToBottom>
  );
};

export const ThreadWelcome: FC = () => {
  return (
    <div className="aui-thread-welcome-root mx-auto mb-6 flex w-full max-w-(--thread-max-width) flex-col items-center px-4 text-center">
      <h1 className="aui-thread-welcome-message-inner fade-in slide-in-from-bottom-1 animate-in fill-mode-both text-2xl font-semibold duration-200">
        今天我能帮你做什么？
      </h1>
    </div>
  );
};

export const ThreadSuggestions: FC = () => {
  return (
    <div className="aui-thread-welcome-suggestions grid w-full @md:grid-cols-3 gap-2 pb-4">
      <ThreadPrimitive.Suggestions>
        {() => <ThreadSuggestionItem />}
      </ThreadPrimitive.Suggestions>
    </div>
  );
};

const ThreadSuggestionItem: FC = () => {
  return (
    <div className="aui-thread-welcome-suggestion-display fade-in slide-in-from-bottom-2 @md:nth-[n+3]:block nth-[n+3]:hidden animate-in fill-mode-both duration-200">
      <SuggestionPrimitive.Trigger send asChild>
        <Button
          variant="ghost"
          className="aui-thread-welcome-suggestion h-auto w-full @md:flex-col flex-wrap items-start justify-start gap-1 rounded-xl border bg-background px-4 py-3 text-start text-sm transition-colors hover:bg-muted"
        >
          <SuggestionPrimitive.Title className="aui-thread-welcome-suggestion-text-1 font-medium" />
          <SuggestionPrimitive.Description className="aui-thread-welcome-suggestion-text-2 text-muted-foreground empty:hidden" />
        </Button>
      </SuggestionPrimitive.Trigger>
    </div>
  );
};

const slashCommands: readonly Unstable_SlashCommand[] = [
  {
    id: "summarize",
    description: "总结对话",
    icon: "FileText",
    execute: () => console.log("[base example] /summarize invoked"),
  },
  {
    id: "translate",
    description: "翻译文本到其他语言",
    icon: "Languages",
    execute: () => console.log("[base example] /translate invoked"),
  },
  {
    id: "search",
    description: "搜索网络信息",
    icon: "Globe",
    execute: () => console.log("[base example] /search invoked"),
  },
  {
    id: "help",
    description: "列出可用命令",
    icon: "HelpCircle",
    execute: () => console.log("[base example] /help invoked"),
  },
];

const slashIconMap: Record<string, FC<{ className?: string }>> = {
  FileText: FileTextIcon,
  Languages: LanguagesIcon,
  Globe: GlobeIcon,
  HelpCircle: HelpCircleIcon,
};

function DirectiveChip(props: DirectiveChipProps) {
  const { directiveId, directiveType, label } = props;
  const showWrench = directiveType !== "command";
  return (
    <span
      className="aui-directive-chip"
      data-directive-type={directiveType}
      data-directive-id={directiveId}
    >
      {showWrench && (
        <span className="aui-directive-chip-icon">
          <WrenchIcon className="size-3" />
        </span>
      )}
      <span className="aui-directive-chip-label">{label}</span>
    </span>
  );
}

export const Composer: FC = () => {
  const mention = unstable_useMentionAdapter({ fallbackIcon: WrenchIcon });
  const slash = unstable_useSlashCommandAdapter({
    commands: slashCommands,
    iconMap: slashIconMap,
    fallbackIcon: SlashIcon,
  });

  return (
    <ComposerPrimitive.Unstable_TriggerPopoverRoot>
      <ComposerPrimitive.Root className="aui-composer-root relative flex w-full flex-col">
        <ComposerPrimitive.AttachmentDropzone asChild>
          <div
            data-slot="aui_composer-shell"
            className="border-border/60 data-[dragging=true]:border-ring focus-within:border-border dark:border-muted-foreground/15 dark:focus-within:border-muted-foreground/30 flex w-full flex-col gap-2 rounded-(--composer-radius) border bg-(--composer-bg) p-(--composer-padding) shadow-[0_4px_16px_-8px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow] focus-within:shadow-[0_6px_24px_-8px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.05)] data-[dragging=true]:border-dashed data-[dragging=true]:bg-[color-mix(in_oklab,var(--color-accent)_50%,var(--color-background))] dark:shadow-none"
          >
            <ComposerQuotePreview />
            <ComposerAttachments />
            <LexicalComposerInput
              directiveChip={DirectiveChip}
              placeholder="发送消息...（@ 提及，/ 命令）"
              className="aui-composer-input [&_.aui-lexical-placeholder]:text-muted-foreground/80 relative max-h-32 min-h-10 w-full resize-none bg-transparent px-2.5 py-1 text-base outline-none [&_.aui-directive-chip]:inline-flex [&_.aui-directive-chip]:items-baseline [&_.aui-directive-chip]:gap-1 [&_.aui-directive-chip]:rounded-md [&_.aui-directive-chip]:bg-blue-100 [&_.aui-directive-chip]:px-1.5 [&_.aui-directive-chip]:py-0.5 [&_.aui-directive-chip]:text-[13px] [&_.aui-directive-chip]:leading-none [&_.aui-directive-chip]:font-medium [&_.aui-directive-chip]:text-blue-700 dark:[&_.aui-directive-chip]:bg-blue-900/50 dark:[&_.aui-directive-chip]:text-blue-300 [&_.aui-directive-chip-icon]:self-center [&_.aui-lexical-input]:min-h-lh [&_.aui-lexical-input]:outline-none [&_.aui-lexical-placeholder]:pointer-events-none [&_.aui-lexical-placeholder]:absolute [&_.aui-lexical-placeholder]:top-0 [&_.aui-lexical-placeholder]:right-0 [&_.aui-lexical-placeholder]:left-0 [&_.aui-lexical-placeholder]:truncate [&_.aui-lexical-placeholder]:px-2.5 [&_.aui-lexical-placeholder]:py-1"
            />
            <ComposerAction />
          </div>
        </ComposerPrimitive.AttachmentDropzone>

        <ComposerTriggerPopover char="@" {...mention} />

        <ComposerTriggerPopover
          char="/"
          {...slash}
          emptyItemsLabel="无匹配命令"
        />
      </ComposerPrimitive.Root>
    </ComposerPrimitive.Unstable_TriggerPopoverRoot>
  );
};

const ComposerAction: FC = () => {
  return (
    <div className="aui-composer-action-wrapper relative flex items-center justify-between">
      <div className="flex items-center gap-1">
        <ComposerAddAttachment />
      </div>
      <div className="flex items-center gap-1.5">
        <AuiIf condition={(s) => s.thread.capabilities.dictation}>
          <AuiIf condition={(s) => s.composer.dictation == null}>
            <ComposerPrimitive.Dictate asChild>
              <TooltipIconButton
                tooltip="语音输入"
                side="bottom"
                type="button"
                variant="ghost"
                size="icon"
                className="aui-composer-dictate size-7 rounded-full"
                aria-label="开始语音输入"
              >
                <MicIcon className="aui-composer-dictate-icon size-4" />
              </TooltipIconButton>
            </ComposerPrimitive.Dictate>
          </AuiIf>
          <AuiIf condition={(s) => s.composer.dictation != null}>
            <ComposerPrimitive.StopDictation asChild>
              <TooltipIconButton
                tooltip="停止语音"
                side="bottom"
                type="button"
                variant="ghost"
                size="icon"
                className="aui-composer-stop-dictation text-destructive size-7 rounded-full"
                aria-label="停止语音输入"
              >
                <SquareIcon className="aui-composer-stop-dictation-icon size-3.5 animate-pulse fill-current" />
              </TooltipIconButton>
            </ComposerPrimitive.StopDictation>
          </AuiIf>
        </AuiIf>
        <AuiIf condition={(s) => !s.thread.isRunning}>
          <ComposerPrimitive.Send asChild>
            <TooltipIconButton
              tooltip="发送消息"
              side="bottom"
              type="button"
              variant="default"
              size="icon"
              className="aui-composer-send size-7 rounded-full"
              aria-label="发送消息"
            >
              <ArrowUpIcon className="aui-composer-send-icon size-4.5" />
            </TooltipIconButton>
          </ComposerPrimitive.Send>
        </AuiIf>
        <AuiIf condition={(s) => s.thread.isRunning}>
          <ComposerPrimitive.Cancel asChild>
            <Button
              type="button"
              variant="default"
              size="icon"
              className="aui-composer-cancel size-7 rounded-full"
              aria-label="停止生成"
            >
              <SquareIcon className="aui-composer-cancel-icon size-3.5 fill-current" />
            </Button>
          </ComposerPrimitive.Cancel>
        </AuiIf>
      </div>
    </div>
  );
};

const TextPart: FC<{ text?: string }> = ({ text }) => {
  const registry = useContext(RenderRegistryContext);
  return <KesiTextRenderer text={text} registry={registry} />;
};

const MessageError: FC = () => {
  return (
    <MessagePrimitive.Error>
      <ErrorPrimitive.Root className="aui-message-error-root border-destructive bg-destructive/10 text-destructive dark:bg-destructive/5 mt-2 rounded-md border p-3 text-sm dark:text-red-200">
        <ErrorPrimitive.Message className="aui-message-error-message line-clamp-2" />
      </ErrorPrimitive.Root>
    </MessagePrimitive.Error>
  );
};

const AssistantWorkingIndicator: FC = () => {
  const isEmpty = useAuiState((s) => s.message.content.length === 0);
  if (isEmpty) {
    return (
      <span
        data-slot="aui_assistant-message-indicator"
        className="text-muted-foreground inline-flex items-center gap-2 align-middle"
      >
        <DotMatrix state="connecting" aria-hidden />
        <span className="text-sm">连接中...</span>
      </span>
    );
  }
  return (
    <span
      data-slot="aui_assistant-message-indicator"
      className="animate-pulse font-sans"
      aria-label="助手正在工作"
    >
      {"●"}
    </span>
  );
};

/** 助手消息正文（GroupedParts + Error），头像 / 非头像模式共用 */
const AssistantMessageBody: FC = () => (
  <>
    <MessagePrimitive.GroupedParts
      groupBy={groupPartByType({
        reasoning: ["group-chainOfThought", "group-reasoning"],
        "tool-call": ["group-chainOfThought", "group-tool"],
        "standalone-tool-call": [],
      })}
    >
      {({ part, children }) => {
        switch (part.type) {
          case "group-chainOfThought":
            return <div data-slot="aui_chain-of-thought">{children}</div>;
          case "group-tool":
            return (
              <InlineToolGroupRoot>
                <InlineToolGroupTrigger
                  count={part.indices.length}
                  active={part.status.type === "running"}
                />
                <InlineToolGroupContent>{children}</InlineToolGroupContent>
              </InlineToolGroupRoot>
            );
          case "group-reasoning": {
            const running = part.status.type === "running";
            return (
              <InlineReasoningRoot streaming={running}>
                <InlineReasoningTrigger active={running} />
                <InlineReasoningContent aria-busy={running}>
                  <InlineReasoningText>{children}</InlineReasoningText>
                </InlineReasoningContent>
              </InlineReasoningRoot>
            );
          }
          case "text":
            return <TextPart text={(part as { text?: string }).text} />;
          case "reasoning":
            return <InlineReasoningText className="ps-0">
              <MarkdownText />
            </InlineReasoningText>;
          case "tool-call":
            return <ToolResultCard {...part} />;
          case "indicator":
            return <AssistantWorkingIndicator />;
          case "data":
            return part.dataRendererUI;
          case "image": {
            return <Image {...part} />;
          }
          case "file": {
            return <File {...part} />;
          }
          case "audio": {
            const audio = part as Unstable_AudioMessagePart;
            const audioData = audio.audio?.data;
            const audioFormat = audio.audio?.format ?? "mp3";
            const audioUrl = audioData?.startsWith("data:") ? audioData : `data:audio/${audioFormat};base64,${audioData}`;
            return audioData ? (
              <div className="my-2">
                <audio controls className="w-full h-10">
                  <source src={audioUrl} type={`audio/${audioFormat}`} />
                </audio>
              </div>
            ) : <span className="text-muted-foreground italic text-sm">[音频]</span>;
          }
          case "source": {
            return <Sources {...part} />
          }
          case "generative-ui": {
            return <MessagePrimitive.GenerativeUI components={{
              Button,
            }} {...part} />;
          }
          default:
            return null;
        }
      }}
    </MessagePrimitive.GroupedParts>
    <MessageError />
  </>
);

export const AssistantMessage: FC = () => {
  // reserves space for action bar and compensates with `-mb` for consistent msg spacing
  // keeps hovered action bar from shifting layout (autohide doesn't support absolute positioning well)
  // for pt-[n] use -mb-[n + 6] & min-h-[n + 6] to preserve compensation
  const ACTION_BAR_PT = "pt-1.5";
  const ACTION_BAR_HEIGHT = `-mb-7.5 min-h-7.5 ${ACTION_BAR_PT}`;
  const avatarMode = useAvatarMode();

  const footer = (
    <div
      data-slot="aui_assistant-message-footer"
      className={cn("ml-2 flex items-center", ACTION_BAR_HEIGHT)}
    >
      <BranchPicker />
      <AssistantActionBar />
    </div>
  );

  // 头像模式：头像在左，正文套气泡框（与用户消息一致的 bubble 样式）
  if (avatarMode) {
    return (
      <MessagePrimitive.Root
        data-slot="aui_assistant-message-root"
        data-role="assistant"
        data-avatar="true"
        className="fade-in slide-in-from-bottom-1 animate-in mx-auto w-full max-w-(--thread-max-width) duration-150"
      >
        <div className="flex gap-3 px-2">
          <MessageAvatar kind="agent" className="mt-0.5" />
          <div className="min-w-0 flex-1">
            <div className="bg-muted text-foreground rounded-2xl px-4 py-2 leading-relaxed wrap-break-word">
              <AssistantMessageBody />
            </div>
            {footer}
          </div>
        </div>
      </MessagePrimitive.Root>
    );
  }

  return (
    <MessagePrimitive.Root
      data-slot="aui_assistant-message-root"
      data-role="assistant"
      className="fade-in slide-in-from-bottom-1 animate-in relative mx-auto w-full max-w-(--thread-max-width) duration-150"
    >
      <div
        data-slot="aui_assistant-message-content"
        className="text-foreground px-2 leading-relaxed wrap-break-word"
      >
        <AssistantMessageBody />
      </div>
      {footer}
    </MessagePrimitive.Root>
  );
};

// ==================== 内联 ToolGroup（汉化版） ====================
const InlineToolGroupRoot: FC<{
  variant?: "ghost" | "outline" | "muted";
  children?: React.ReactNode;
}> = ({ variant = "ghost", children }) => (
  <Collapsible
    data-slot="tool-group-root"
    data-variant={variant}
    className="group/tool-group-root my-2"
  >
    {children}
  </Collapsible>
);

const InlineToolGroupTrigger: FC<{
  count: number;
  active?: boolean;
}> = ({ count, active }) => (
  <CollapsibleTrigger className="group/trigger flex w-full items-center gap-2 py-1 text-sm transition-colors">
    {active && (
      <LoaderIcon className="size-4 shrink-0 animate-spin" />
    )}
    <WrenchIcon className="size-4 shrink-0" />
    <span className="text-start font-medium leading-none">
      {count} 次工具调用
    </span>
    <ChevronDownIcon className="size-4 shrink-0 transition-transform group-data-[state=closed]/trigger:-rotate-90" />
  </CollapsibleTrigger>
);

const InlineToolGroupContent: FC<{ children?: React.ReactNode }> = ({ children }) => (
  <CollapsibleContent className="group/collapsible-content overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
    <div className="flex flex-col gap-2 pt-3">
      {children}
    </div>
  </CollapsibleContent>
);

// ==================== 内联 Reasoning（汉化版） ====================
const InlineReasoningRoot: FC<{
  streaming?: boolean;
  children?: React.ReactNode;
}> = ({ streaming: _streaming, children }) => (
  <Collapsible
    data-slot="reasoning-root"
    //defaultOpen={streaming}
    className="group/reasoning-root my-2"
  >
    {children}
  </Collapsible>
);

const InlineReasoningTrigger: FC<{
  active?: boolean;
}> = ({ active }) => (
  <CollapsibleTrigger className="group/trigger text-muted-foreground hover:text-foreground flex max-w-[75%] items-center gap-2 py-1 text-sm transition-colors">
    <BrainIcon className="size-4 shrink-0" />
    <span className="leading-none">思考{active ? " 中" : ""}</span>
    <ChevronDownIcon className="mt-0.5 size-4 shrink-0 transition-transform group-data-[state=closed]/trigger:-rotate-90" />
  </CollapsibleTrigger>
);

const InlineReasoningContent: FC<{
  "aria-busy"?: boolean;
  children?: React.ReactNode;
}> = ({ "aria-busy": ariaBusy, children }) => (
  <CollapsibleContent
    aria-busy={ariaBusy}
    className="group/collapsible-content text-muted-foreground relative overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
  >
    {children}
  </CollapsibleContent>
);

const InlineReasoningText: FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({ className, children }) => (
  <div
    className={`relative z-0 max-h-64 overflow-y-auto leading-relaxed ${className ?? ""}`}
  >
    {children}
  </div>
);

// ==================== 消息时间统计 ====================
const TimingBadge: FC = () => {
  const timing = useMessageTiming();
  if (timing?.totalStreamTime === undefined) return null;

  const fmt = (ms: number | undefined): string => {
    if (ms === undefined) return "—";
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            data-slot="message-timing-trigger"
            aria-label="消息耗时"
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center rounded-md p-1 font-mono text-xs tabular-nums transition-colors"
          >
            {fmt(timing.totalStreamTime)}
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={8}
          className="px-3 py-2 min-w-42"
        >
          <div className="grid gap-1.5 text-xs">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">首字耗时</span>
              <span className="font-mono tabular-nums">{fmt(timing.firstTokenTime)}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">总耗时</span>
              <span className="font-mono tabular-nums">{fmt(timing.totalStreamTime)}</span>
            </div>
            {timing.tokensPerSecond !== undefined && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">速度</span>
                <span className="font-mono tabular-nums">{timing.tokensPerSecond.toFixed(1)} tok/s</span>
              </div>
            )}
            {timing.tokenCount !== undefined && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">输出 Token</span>
                <span className="font-mono tabular-nums">{timing.tokenCount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">数据块</span>
              <span className="font-mono tabular-nums">{timing.totalChunks}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">工具调用</span>
              <span className="font-mono tabular-nums">{timing.toolCallCount}</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const AssistantActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className="aui-assistant-action-bar-root text-muted-foreground animate-in fade-in col-start-3 row-start-2 -ml-1 flex gap-1 duration-200"
    >
      <ActionBarPrimitive.Copy asChild>
        <TooltipIconButton tooltip="复制">
          <AuiIf condition={(s) => s.message.isCopied}>
            <CheckIcon className="animate-in zoom-in-50 fade-in duration-200 ease-out" />
          </AuiIf>
          <AuiIf condition={(s) => !s.message.isCopied}>
            <CopyIcon className="animate-in zoom-in-75 fade-in duration-150" />
          </AuiIf>
        </TooltipIconButton>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload asChild>
        <TooltipIconButton tooltip="重新生成">
          <RefreshCwIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Reload>
      <ActionBarMorePrimitive.Root>
        <ActionBarMorePrimitive.Trigger asChild>
          <TooltipIconButton
            tooltip="更多"
            className="data-[state=open]:bg-accent"
          >
            <MoreHorizontalIcon />
          </TooltipIconButton>
        </ActionBarMorePrimitive.Trigger>
        <ActionBarMorePrimitive.Content
          side="bottom"
          align="start"
          sideOffset={6}
          className="aui-action-bar-more-content bg-popover/95 text-popover-foreground data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:animate-out data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-xl border p-1.5 shadow-lg backdrop-blur-sm"
        >
          <ActionBarPrimitive.ExportMarkdown asChild>
            <ActionBarMorePrimitive.Item className="aui-action-bar-more-item hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm outline-none select-none">
              <DownloadIcon className="size-4" />
              导出为 Markdown
            </ActionBarMorePrimitive.Item>
          </ActionBarPrimitive.ExportMarkdown>
        </ActionBarMorePrimitive.Content>
      </ActionBarMorePrimitive.Root>
      <TimingBadge />
    </ActionBarPrimitive.Root>
  );
};

export const UserMessage: FC = () => {
  const avatarMode = useAvatarMode();

  // 头像模式：头像在右，气泡 + 头像的行式布局
  if (avatarMode) {
    return (
      <MessagePrimitive.Root
        data-slot="aui_user-message-root"
        data-role="user"
        data-avatar="true"
        className="fade-in slide-in-from-bottom-1 animate-in mx-auto w-full max-w-(--thread-max-width) duration-150"
      >
        <div className="flex items-start justify-end gap-3 px-2">
          <div className="aui-user-message-content-wrapper relative flex min-w-0 flex-col items-end">
            <UserMessageAttachments />
            <div className="aui-user-message-content peer bg-muted text-foreground rounded-2xl px-4 py-2 wrap-break-word empty:hidden flex flex-col gap-2">
              <MessagePrimitive.Quote>
                {(quote) => <QuoteBlock {...quote} />}
              </MessagePrimitive.Quote>
              <MessagePrimitive.Parts components={{ Text: DirectiveText, Image: Image, File: File, Source: Source }} />
            </div>
            <div className="aui-user-action-bar-wrapper absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 pr-2 peer-empty:hidden">
              <UserActionBar />
            </div>
          </div>
          <MessageAvatar kind="user" className="mt-0.5" />
        </div>

        <BranchPicker
          data-slot="aui_user-branch-picker"
          className="mt-2 -mr-1 justify-end"
        />
      </MessagePrimitive.Root>
    );
  }

  return (
    <MessagePrimitive.Root
      data-slot="aui_user-message-root"
      data-role="user"
      className="fade-in slide-in-from-bottom-1 animate-in mx-auto grid w-full max-w-(--thread-max-width) auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] content-start gap-y-2 px-2 duration-150 [&:where(>*)]:col-start-2"
    >
      <UserMessageAttachments />

      <div className="aui-user-message-content-wrapper relative col-start-2 min-w-0">
        <div className="aui-user-message-content peer bg-muted text-foreground rounded-xl px-4 py-2 wrap-break-word empty:hidden flex flex-col gap-2">
          <MessagePrimitive.Quote>
            {(quote) => <QuoteBlock {...quote} />}
          </MessagePrimitive.Quote>
          <MessagePrimitive.Parts components={{ Text: DirectiveText, Image: Image, File: File, Source: Source }} />
        </div>
        <div className="aui-user-action-bar-wrapper absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 pr-2 peer-empty:hidden">
          <UserActionBar />
        </div>
      </div>

      <BranchPicker
        data-slot="aui_user-branch-picker"
        className="col-span-full col-start-1 row-start-3 -mr-1 justify-end"
      />
    </MessagePrimitive.Root>
  );
};

const UserActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className="aui-user-action-bar-root flex flex-col items-end"
    >
      <ActionBarPrimitive.Edit asChild>
        <TooltipIconButton tooltip="编辑" className="aui-user-action-edit">
          <PencilIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Edit>
    </ActionBarPrimitive.Root>
  );
};

export const EditComposer: FC = () => {
  return (
    <MessagePrimitive.Root
      data-slot="aui_edit-composer-wrapper"
      className="mx-auto flex w-full max-w-(--thread-max-width) flex-col px-2"
    >
      <ComposerPrimitive.Unstable_TriggerPopoverRoot>
        <ComposerPrimitive.Root className="aui-edit-composer-root border-border/60 dark:border-muted-foreground/15 ml-auto flex w-full max-w-[85%] flex-col rounded-(--composer-radius) border bg-(--composer-bg) shadow-[0_4px_16px_-8px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-none">
          <LexicalComposerInput
            directiveChip={DirectiveChip}
            autoFocus
            className="aui-edit-composer-input text-foreground min-h-14 w-full resize-none bg-transparent px-4 pt-3 pb-1 text-base outline-none [&_.aui-directive-chip]:inline-flex [&_.aui-directive-chip]:items-baseline [&_.aui-directive-chip]:gap-1 [&_.aui-directive-chip]:rounded-md [&_.aui-directive-chip]:bg-blue-100 [&_.aui-directive-chip]:px-1.5 [&_.aui-directive-chip]:py-0.5 [&_.aui-directive-chip]:text-[13px] [&_.aui-directive-chip]:leading-none [&_.aui-directive-chip]:font-medium [&_.aui-directive-chip]:text-blue-700 dark:[&_.aui-directive-chip]:bg-blue-900/50 dark:[&_.aui-directive-chip]:text-blue-300 [&_.aui-directive-chip-icon]:self-center [&_.aui-lexical-input]:min-h-lh [&_.aui-lexical-input]:outline-none"
          />
          <div className="aui-edit-composer-footer mx-2.5 mb-2.5 flex items-center gap-1.5 self-end">
            <ComposerPrimitive.Cancel asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 rounded-full px-3.5"
              >
                取消
              </Button>
            </ComposerPrimitive.Cancel>
            <ComposerPrimitive.Send asChild>
              <Button size="sm" className="h-8 rounded-full px-3.5">
                更新
              </Button>
            </ComposerPrimitive.Send>
          </div>
        </ComposerPrimitive.Root>
      </ComposerPrimitive.Unstable_TriggerPopoverRoot>
    </MessagePrimitive.Root>
  );
};

const BranchPicker: FC<BranchPickerPrimitive.Root.Props> = ({
  className,
  ...rest
}) => {
  return (
    <BranchPickerPrimitive.Root
      hideWhenSingleBranch
      className={cn(
        "aui-branch-picker-root text-muted-foreground mr-2 -ml-2 inline-flex items-center text-xs",
        className,
      )}
      {...rest}
    >
      <BranchPickerPrimitive.Previous asChild>
        <TooltipIconButton tooltip="上一个">
          <ChevronLeftIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Previous>
      <span className="aui-branch-picker-state font-medium">
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
      <BranchPickerPrimitive.Next asChild>
        <TooltipIconButton tooltip="下一个">
          <ChevronRightIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Next>
    </BranchPickerPrimitive.Root>
  );
};

export const Base: FC<{ className?: string; title?: string; readOnly?: boolean; renderRegistry?: RenderRegistry }> = ({ className, title, readOnly, renderRegistry }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={cn("bg-muted/30 flex h-full w-full", className)}>
      {!readOnly && (
      <div className="hidden md:block">
        <Sidebar collapsed={sidebarCollapsed} title={title} />
      </div>
      )}
      <div className={cn("flex flex-1 flex-col overflow-hidden", readOnly ? "p-0" : "p-2 md:pl-0")}>
        <div className="bg-background flex flex-1 flex-col overflow-hidden rounded-lg">
          {!readOnly && (
          <Header
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
          )}
          <main className="flex-1 overflow-hidden">
            <TooltipProvider>
              <RenderRegistryContext.Provider value={renderRegistry}>
                <Thread readOnly={readOnly} />
              </RenderRegistryContext.Provider>
            </TooltipProvider>
          </main>
        </div>
      </div>
    </div>
  );
};

export const Assistant = ({ runtime, className, title, readOnly, renderRegistry }: { runtime?: AssistantRuntime; className?: string; title?: string; readOnly?: boolean; renderRegistry?: RenderRegistry }) => {
  return runtime ? (
    <AssistantRuntimeProvider runtime={runtime}>
      <Base className={className} title={title} readOnly={readOnly} renderRegistry={renderRegistry} />
    </AssistantRuntimeProvider>
  ) : <Base className={className} title={title} readOnly={readOnly} renderRegistry={renderRegistry} />;
	};