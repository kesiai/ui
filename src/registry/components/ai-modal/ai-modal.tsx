"use client";

import { useState, useCallback } from "react";
import { BotIcon, Maximize2Icon, Minimize2Icon, XIcon } from "lucide-react";
import { Thread } from "@/components/assistant-ui/thread";
import { Assistant } from "@/registry/components/ai-agent/ai-agent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { AssistantRuntimeProvider, type AssistantRuntime, useAuiState } from "@assistant-ui/react";
import {
  AssistantModalPrimitive,
} from "@assistant-ui/react";

interface AIModalProps {
  runtime?: AssistantRuntime;
  triggerClassName?: string;
  triggerPosition?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  title?: string;
  modalSize?: { width: string; height: string };
  modalClassName?: string;
  showExpandButton?: boolean;
  expandPosition?: "fullscreen" | "large";
}

const positionClasses = {
  "bottom-right": "right-4 bottom-4",
  "bottom-left": "left-4 bottom-4",
  "top-right": "right-4 top-4",
  "top-left": "left-4 top-4",
};

export const AIModal = ({
  runtime,
  triggerClassName,
  triggerPosition = "bottom-right",
  title = "",
  modalSize = { width: "400px", height: "500px" },
  modalClassName = "",
  showExpandButton = true,
  expandPosition = "fullscreen"
}: AIModalProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleExpand = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFullscreen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setIsFullscreen(false);
  }, []);

  const triggerPositionClass = positionClasses[triggerPosition];

  const modalContent = (
    <>
        {/* 浮动按钮和 Modal */}
        <AssistantModalPrimitive.Root
          open={isModalOpen && !isFullscreen}
          onOpenChange={setIsModalOpen}
        >
          <AssistantModalPrimitive.Anchor
            className={cn("fixed z-50 size-11", triggerPositionClass)}
          >
            <AssistantModalPrimitive.Trigger asChild>
                <button
                  className={cn(
                    "size-full rounded-full bg-primary shadow-lg transition-all hover:scale-110 active:scale-90 flex items-center justify-center text-primary-foreground",
                    triggerClassName
                  )}
                >
                  <BotIcon />
              </button>
            </AssistantModalPrimitive.Trigger>
          </AssistantModalPrimitive.Anchor>

          <AssistantModalPrimitive.Content
            sideOffset={16}
            className={cn(
              "rounded-xl border bg-popover shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out",
              modalClassName
            )}
            style={{ width: modalSize.width, height: modalSize.height }}
          >
            {/* Modal 头部 */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <BotIcon className="size-4 text-primary" />
                <h3 className="font-semibold text-sm">
                  {title || 'AI Assistant'}
                </h3>
              </div>
              <div className="flex items-center gap-1">
                {showExpandButton && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleExpand}
                        className="size-8 rounded hover:bg-accent flex items-center justify-center transition-colors"
                      >
                        <Maximize2Icon className="size-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Expand</TooltipContent>
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
                  <TooltipContent side="bottom">Close</TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Thread 内容 */}
            <div className="h-[calc(100%-52px)] overflow-hidden">
              <Thread />
            </div>
          </AssistantModalPrimitive.Content>
        </AssistantModalPrimitive.Root>

        {/* 全屏 Dialog - 使用 Assistant 组件 */}
        <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
          <DialogContent
            className={cn(
              "fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-[60] p-0 overflow-hidden gap-0",
              expandPosition === "fullscreen"
                ? "!h-screen !w-screen !max-w-screen rounded-none border-0"
                : "!h-[90vh] !w-[90vw] !max-w-[90vw]"
            )}
            onInteractOutside={(e) => e.preventDefault()}
          >
            <Assistant title={title} className={cn(expandPosition === "fullscreen" ? "h-screen!" : "h-[90vh]!")} />
          </DialogContent>
        </Dialog>
    </>
  );

  return runtime ? (
    <AssistantRuntimeProvider runtime={runtime}>
      {modalContent}
    </AssistantRuntimeProvider>
  ) : (
    modalContent
  );
};
