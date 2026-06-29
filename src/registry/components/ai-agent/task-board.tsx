"use client";

import { unstable_useInteractable } from "@assistant-ui/react";
import type { FC } from "react";

/**
 * 可交互任务看板组件。
 * 模型通过 `update_taskBoard` 工具读写任务列表，用户也可以直接勾选。
 */
export const TaskBoard: FC = () => {
  const [state, { setState }] = unstable_useInteractable(
    "taskBoard",
    {
      description:
        "任务看板。模型通过 update_taskBoard 工具管理任务：add / update / remove / clear。新任务 title 必填，done=false。",
      stateSchema: {
        type: "object",
        properties: {
          tasks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                title: { type: "string" },
                done: { type: "boolean" },
              },
              required: ["id", "title", "done"],
            },
          },
        },
        required: ["tasks"],
      },
      initialState: { tasks: [{ id: "1", title: "示例任务", done: false }] },
    },
  );

  const tasks: { id: string; title: string; done: boolean }[] =
    (state as any)?.tasks ?? [];

  return (
    <div className="mx-auto mb-2 w-full max-w-(--thread-max-width) rounded-lg border p-3 text-sm">
      <h4 className="mb-2 flex items-center gap-1.5 font-medium">
        <span>📋</span> 任务看板
      </h4>
      {tasks.length === 0 ? (
        <p className="text-muted-foreground text-xs">
          暂无任务，让 AI 帮你添加吧
        </p>
      ) : (
        <ul className="space-y-1">
          {tasks.map((t) => (
            <li key={t.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={t.done}
                onChange={() =>
                  setState((prev: any) => ({
                    tasks: (prev.tasks ?? []).map((x: any) =>
                      x.id === t.id ? { ...x, done: !x.done } : x,
                    ),
                  }))
                }
                className="size-3.5"
              />
              <span
                className={
                  t.done ? "text-muted-foreground line-through" : ""
                }
              >
                {t.title}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
