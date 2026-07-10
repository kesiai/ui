"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Thread, AgentSelect } from "@/registry/components/ai-agent/ai-agent";
import { AssistantModalPrimitive, AssistantRuntimeProvider, useAuiState, useAui, type AssistantRuntime } from "@assistant-ui/react";
import { BotIcon, ChevronDownIcon, Maximize2Icon, Minimize2Icon, XIcon, TrashIcon, MoreHorizontalIcon, ArchiveIcon, PlusIcon } from "lucide-react";
import { useCallback, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type FC, forwardRef } from "react";
import {
  ThreadListItemMorePrimitive,
  ThreadListItemPrimitive,
  ThreadListPrimitive,
} from "@assistant-ui/react";

import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";

interface AIModalProps {
  runtime?: AssistantRuntime;
  triggerClassName?: string;
  triggerPosition?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  title?: string;
  modalSize?: { width: string; height: string };
  modalClassName?: string;
  showExpandButton?: boolean;
  onChangeAgent?: (agentId: string) => void;
}

const positionClasses = {
  "bottom-right": "right-4 bottom-4",
  "bottom-left": "left-4 bottom-4",
  "top-right": "right-4 top-4",
  "top-left": "left-4 top-4",
};

/** 下拉列表形式的 Thread 选择器 */
const ThreadListSelect: React.FC = () => {
  const { threadItems, mainThreadId, isLoading } = useAuiState((s) => s.threads);
  const threadsApi = useAui().threads();

  const handleValueChange = (value: string) => {
    if (value === '__new__') {
      threadsApi.switchToNewThread();
    } else {
      threadsApi.switchToThread(value);
    }
  };

  return (
    <Select value={mainThreadId } onValueChange={handleValueChange}>
      <SelectTrigger className="min-w-24 max-w-60 h-7 border-0 bg-transparent px-1 shadow-none text-sm font-semibold focus:ring-2 focus:ring-blue-500">
        <SelectValue placeholder="选择对话" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__new__" className="text-blue-600">
          <PlusIcon className="size-3.5" />
          新对话
        </SelectItem>
        {isLoading && (
          <SelectItem value="__loading__" disabled>
            加载中...
          </SelectItem>
        )}
        {!isLoading && threadItems.length === 0 && (
          <SelectItem value="__empty__" disabled>
            无对话
          </SelectItem>
        )}
        <ThreadListPrimitive.Items>
          {() => <ThreadListItem />}
        </ThreadListPrimitive.Items>
      </SelectContent>
    </Select>
  );
};

const ThreadListItem: FC = () => {
  const item = useAuiState((s) => s.threadListItem)
  return (
    <div className="aui-thread-list-item group flex h-9 items-center gap-2 rounded-lg transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none data-active:bg-muted">
      <SelectItem key={item.id} value={item.id} className="aui-thread-list-item-trigger flex h-full min-w-0 flex-1 items-center px-3 text-start text-sm">
        <span className="aui-thread-list-item-title min-w-0 flex-1 truncate">
          <ThreadListItemPrimitive.Title fallback="新对话" />
        </span>
      </SelectItem>
      <ThreadListItemMore />
    </div>
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
          <span className="sr-only">更多</span>
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


type AssistantModalButtonProps = { "data-state"?: "open" | "closed" };

const AssistantModalButton = forwardRef<
  HTMLButtonElement,
  AssistantModalButtonProps
>(({ "data-state": state, ...rest }, ref) => {
  const tooltip = state === "open" ? "关闭助手" : "打开助手";

  return (
    <TooltipIconButton
      variant="default"
      tooltip={tooltip}
      side="left"
      {...rest}
      className="aui-modal-button size-full rounded-full shadow transition-transform hover:scale-110 active:scale-90"
      ref={ref}
    >
      <BotIcon
        data-state={state}
        className="aui-modal-button-closed-icon absolute size-6 transition-all data-[state=closed]:rotate-0 data-[state=open]:rotate-90 data-[state=closed]:scale-100 data-[state=open]:scale-0"
      />

      <ChevronDownIcon
        data-state={state}
        className="aui-modal-button-open-icon absolute size-6 transition-all data-[state=closed]:-rotate-90 data-[state=open]:rotate-0 data-[state=closed]:scale-0 data-[state=open]:scale-100"
      />
      <span className="aui-sr-only sr-only">{tooltip}</span>
    </TooltipIconButton>
  );
});

export const AIModal = ({
  runtime,
  triggerClassName,
  triggerPosition = "bottom-right",
  title: _title = "",
  modalSize = { width: "500px", height: "600px" },
  modalClassName = "",
  showExpandButton = true,
  onChangeAgent,
}: AIModalProps) => {
  const [expanded, setExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(v => !v);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setExpanded(false);
  }, []);

  const triggerPositionClass = positionClasses[triggerPosition];

  const currentSize = expanded
    ? { width: "80vw", height: "85vh" }
    : modalSize;

  const modalContent = (
    <AssistantModalPrimitive.Root
      open={isModalOpen}
      onOpenChange={(open) => { setIsModalOpen(open); if (!open) setExpanded(false); }}
    >
      <AssistantModalPrimitive.Anchor
        className={cn("fixed z-50 size-11", triggerPositionClass)}
      >
        <AssistantModalPrimitive.Trigger asChild>
            <AssistantModalButton />
        </AssistantModalPrimitive.Trigger>
      </AssistantModalPrimitive.Anchor>

      <AssistantModalPrimitive.Content
        sideOffset={16}
        className={cn(
          "aui-root aui-modal-content data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom-1/2 data-[state=closed]:slide-out-to-right-1/2 data-[state=closed]:zoom-out data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-1/2 data-[state=open]:slide-in-from-right-1/2 data-[state=open]:zoom-in z-50 h-125 w-100 overflow-clip overscroll-contain rounded-xl border bg-popover p-0 text-popover-foreground shadow-md outline-none data-[state=closed]:animate-out data-[state=open]:animate-in [&>.aui-thread-root]:bg-inherit [&>.aui-thread-root_.aui-thread-viewport-footer]:bg-inherit transition-[width,height,inset] duration-300 ease-in-out",
          modalClassName
        )}
        style={{ width: currentSize.width, height: currentSize.height }}
      >
        {/* Modal 头部 */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <BotIcon className="size-4 text-primary shrink-0" />
            {onChangeAgent && <AgentSelect onChangeAgent={onChangeAgent} />}
            <ThreadListSelect />
          </div>
          <div className="flex items-center gap-1">
            {showExpandButton && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleToggle}
                    className="size-8 rounded hover:bg-accent flex items-center justify-center transition-colors"
                  >
                    {expanded ? <Minimize2Icon className="size-4" /> : <Maximize2Icon className="size-4" />}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">{expanded ? "还原" : "展开"}</TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleCloseModal}
                  className="size-8 rounded hover:bg-accent flex items-center justify-center transition-colors"
                >
                  <XIcon className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">关闭</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Thread 内容 */}
        <div className="h-[calc(100%-52px)] overflow-hidden">
          <Thread />
        </div>
      </AssistantModalPrimitive.Content>
    </AssistantModalPrimitive.Root>
  );

  return runtime ? (
    <AssistantRuntimeProvider runtime={runtime}>
      {modalContent}
    </AssistantRuntimeProvider>
  ) : (
    modalContent
  );
};
