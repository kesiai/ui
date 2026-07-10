"use client";

import {
  unstable_useInteractable,
  unstable_useInteractableVersions,
  unstable_interactableTool,
  defineToolkit,
} from "@assistant-ui/react";
import { createContext, useContext, type FC } from "react";

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

// ==================== Document Artifact ====================

type Document = {
  title?: string;
  content?: string;
};

const emptyDoc: Document = { title: "", content: "" };

/** 文档上下文：当前选中的 artifact ID */
export const DocumentCtx = createContext<{
  documentId: string | undefined;
  setDocumentId: (id: string | undefined) => void;
}>({ documentId: undefined, setDocumentId: () => {} });

/** 包装 DocumentButton 自动读取 Context 并设置 documentId */
export const DocumentWithCtx: FC<{
  state: Document;
  version?: { isLatest: boolean };
  id?: string;
}> = (props) => {
  const { setDocumentId } = useContext(DocumentCtx);
  console.log("DocumentWithCtx props", props);
  return (
    <DocumentButton
      {...props}
      onClick={() => {
        setDocumentId(props.id);
      }}
    />
  );
};

/** 文档编辑器（全尺寸面板） */
export const DocumentEditor: FC<{ id?: string }> = ({ id }) => {
  const [state, { setState }] = unstable_useInteractable("document", {
    id,
    description: "用户可编辑的文档。创建时 content 必填，title 可选。",
    stateSchema: {
      type: "object",
      properties: {
        title: { type: "string" },
        content: { type: "string" },
      },
    },
    initialState: emptyDoc,
  });

  const versions = unstable_useInteractableVersions<Document>(id ?? "", "document");
  const doc: Document = (state ?? emptyDoc) as Document;

  return (
    <div className="mx-auto my-2 w-full max-w-(--thread-max-width) rounded-lg border p-4 text-sm">
      <div className="mb-3 flex items-center gap-2">
        <span>📝</span>
        <input
          value={doc.title ?? ""}
          onChange={(e) => setState((prev: any) => ({ ...prev, title: e.target.value }))}
          placeholder="文档标题"
          className="flex-1 bg-transparent text-base font-semibold outline-none placeholder:text-muted-foreground/50"
        />
        {versions.length > 0 && (
          <div className="relative shrink-0">
            <select
              value=""
              onChange={(e) => {
                const idx = parseInt(e.target.value, 10);
                if (!isNaN(idx)) versions[idx]?.restore();
              }}
              className="text-muted-foreground hover:text-foreground cursor-pointer appearance-none rounded border-0 bg-transparent pr-4 text-xs underline decoration-dotted underline-offset-2 transition-colors"
            >
              <option value="" disabled>{versions.length} 个版本</option>
              {versions.map((v, i) => (
                <option key={i} value={i}>
                  v{i + 1} — {v.origin === "user-edit" ? "用户编辑" : "AI 创建"}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <textarea
        value={doc.content ?? ""}
        onChange={(e) => setState((prev: any) => ({ ...prev, content: e.target.value }))}
        placeholder="在此输入文档内容..."
        rows={12}
        className="text-foreground w-full resize-y rounded-md border bg-transparent p-3 text-sm leading-relaxed outline-none transition-colors focus:border-blue-500 placeholder:text-muted-foreground/50"
      />
    </div>
  );
};

/** 文档选择按钮（内联渲染） */
const DocumentButton: FC<{
  state: Document;
  version?: { isLatest: boolean };
  onClick?: () => void;
}> = ({ state, version, onClick }) => {
  const isReadOnly = version ? !version.isLatest : false;
  const preview = (state.content ?? "").slice(0, 80);

  return (
    <button
      type="button"
      onClick={() => onClick?.()}
      className="mx-auto my-2 w-full min-h-4 max-w-(--thread-max-width) rounded-lg border p-3 text-left text-sm transition-colors hover:bg-accent"
    >
      <div className="mb-1 flex items-center gap-2">
        <span>📄</span>
        <span className="font-medium">{state.title || "无标题"}</span>
        {isReadOnly && <span className="text-muted-foreground text-xs">（历史版本）</span>}
      </div>
      <p className="text-muted-foreground line-clamp-2 text-xs">{preview || "空文档"}</p>
    </button>
  );
};

/** 文档 artifact toolkit */
export const toolkit = defineToolkit({
  document: unstable_interactableTool({
    description: "用户可以打开和编辑的文档。创建新文档请指定 title 和 content。",
    stateSchema: {
      type: "object",
      properties: {
        title: { type: "string" },
        content: { type: "string" },
      },
    },
    render: ({ state, version, id }) => (
      <DocumentWithCtx state={state as Document} version={version} id={id ?? ""} />
    ),
  }),
});