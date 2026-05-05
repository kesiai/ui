"use client";

import { useState } from "react";
import { MenuIcon, PanelLeftIcon } from "lucide-react";
import { AssistantRuntimeProvider, type AssistantRuntime } from "@assistant-ui/react";
import { Thread } from "@/components/assistant-ui/thread";
import { ThreadList } from "@/components/assistant-ui/thread-list";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const Assistant = ({ runtime }: { runtime: AssistantRuntime }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="flex h-dvh w-full">
        {/* Sidebar */}
        <aside
          className={`
            border-r bg-muted/30 p-2 flex flex-col transition-all duration-300 ease-in-out
            ${isSidebarOpen ? "w-64 opacity-100" : "w-0 opacity-0 overflow-hidden"}
          `}
        >
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
