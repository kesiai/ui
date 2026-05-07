"use client";

import { useState } from "react";
import { MenuIcon, PanelLeftIcon } from "lucide-react";
import { AssistantRuntimeProvider, type AssistantRuntime, useAuiState } from "@assistant-ui/react";
import { Thread } from "@/components/assistant-ui/thread";
import { ThreadList } from "@/components/assistant-ui/thread-list";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// ThreadTitle 组件
const ThreadTitle = () => {
  const messages = useAuiState((s) => s.thread.messages) as any[];

  // 从第一条用户消息获取标题
  const getThreadTitle = () => {
    if (!messages || messages.length === 0) {
      return "New Chat";
    }

    const firstUserMessage = messages.find((m) => m?.role === "user");
    if (firstUserMessage?.content) {
      const content = firstUserMessage.content;
      if (typeof content === "string") {
        return content.slice(0, 30) + (content.length > 30 ? "..." : "");
      }
    }
    return "New Chat";
  };

  return (
    <span className="text-sm font-medium truncate">
      {getThreadTitle()}
    </span>
  );
};

export const Assistant = ({ runtime, className, title }: { runtime: AssistantRuntime; className?: string; title?: string }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className={cn("flex max-h-dvh h-full w-full", className)}>
        {/* Sidebar */}
        <aside
          className={`
            border-r bg-muted/30 p-2 gap-2 flex flex-col transition-all duration-300 ease-in-out
            ${isSidebarOpen ? "w-64 opacity-100" : "w-0 opacity-0 overflow-hidden"}
          `}
        >
          {title && (
            <div className="p-2 font-semibold">
              {title}
            </div>
          )}
          <ThreadList />
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-hidden flex flex-col min-w-0">
          {/* Header with SidebarTrigger */}
          <header className="h-14 shrink-0 flex items-center gap-2 border-b px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="size-8"
            >
              {isSidebarOpen ? (
                <PanelLeftIcon className="size-4" />
              ) : (
                <MenuIcon className="size-4" />
              )}
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <ThreadTitle />
          </header>

          {/* Thread */}
          <div className="flex-1 overflow-hidden">
            <Thread />
          </div>
        </main>
      </div>
    </AssistantRuntimeProvider>
  );
};
