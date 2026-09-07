"use client";

import { useAuiState } from "@assistant-ui/react";
import { TaskDetailPanel } from "./task-detail-panel";

/**
 * 任务面板（task 模式右侧栏）
 *
 * 从 ai-agent 的 Base 组件中抽取为独立组件，职责单一：
 * 仅在 task 运行时且未隐藏时，渲染右侧任务详情面板。
 * 面板是否显示由父组件 Base 通过 `showTaskDetail` 决定，
 * 自身只负责读取当前线程的任务 id 并渲染 TaskDetailPanel。
 */
export function TaskPanel({ showTaskDetail }: { showTaskDetail: boolean }) {
  const taskId = useAuiState((s) => s.threads.mainThreadId);

  if (!showTaskDetail) return null;

  return (
    <aside className="min-w-[24rem] flex-1 border-l bg-background overflow-hidden">
      <TaskDetailPanel taskId={taskId ?? ''} />
    </aside>
  );
}
