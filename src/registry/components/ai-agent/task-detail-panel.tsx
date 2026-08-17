"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Info, Play, FolderTree, Clock, Loader2, CheckCircle2, AlertCircle, ListTodo,
} from "lucide-react";
import { AgentWorkspace } from "../ai-workspace/ai-workspace";
import { createAPI } from "@kesi/client";
import { tasksApi } from "./tasks-api";
import type { Task, TaskRun } from "./tasks-api";

// ======== 任务状态映射 ========
const STATUS_MAP: Record<string, { label: string; className: string; icon: typeof ListTodo }> = {
  pending:   { label: '待处理', className: 'bg-yellow-500/20 text-yellow-700 border', icon: Clock },
  running:   { label: '进行中', className: 'bg-blue-500/20 text-blue-700 border', icon: Loader2 },
  completed: { label: '已完成', className: 'bg-green-500/20 text-green-700 border', icon: CheckCircle2 },
  failed:    { label: '失败', className: 'bg-red-500/20 text-red-700 border', icon: AlertCircle },
  cancelled: { label: '已取消', className: 'bg-gray-500/20 text-gray-700 border', icon: AlertCircle },
};

// ======== 运行状态映射 ========
const RUN_STATUS_MAP: Record<string, { label: string; className: string }> = {
  queued:        { label: '排队中', className: 'bg-slate-500/20 text-slate-700 border border-slate-500/30' },
  running:       { label: '运行中', className: 'bg-blue-500/20 text-blue-700 border border-blue-500/30' },
  waiting_input: { label: '等待输入', className: 'bg-amber-500/20 text-amber-700 border border-amber-500/30' },
  succeeded:     { label: '已完成', className: 'bg-green-500/20 text-green-700 border border-green-500/30' },
  failed:        { label: '失败', className: 'bg-red-500/20 text-red-700 border border-red-500/30' },
  cancelled:     { label: '已取消', className: 'bg-gray-500/20 text-gray-700 border border-gray-500/30' },
  timed_out:     { label: '超时', className: 'bg-orange-500/20 text-orange-700 border border-orange-500/30' },
};

const StatusBadge = ({ status }: { status?: string }) => {
  const c = STATUS_MAP[status || ''] || { label: status || '未知', className: 'bg-gray-500/20 text-gray-700 border' };
  return <Badge variant="outline" className={c.className}>{c.label}</Badge>;
};

const RunStatusBadge = ({ status }: { status?: string }) => {
  const c = RUN_STATUS_MAP[status || ''] || { label: status || '未知', className: 'bg-gray-500/20 text-gray-700 border' };
  return <Badge variant="outline" className={c.className}>{c.label}</Badge>;
};

/**
 * 任务详情面板（task 模式右侧栏）
 * 三个 Tab：基本信息 / 运行记录 / 工作目录
 */
export function TaskDetailPanel({ taskId }: { taskId: string }) {
  const [task, setTask] = useState<Task | null>(null);
  const [runs, setRuns] = useState<TaskRun[]>([]);
  const [loading, setLoading] = useState(false);
  const [agentMap, setAgentMap] = useState<Map<string, string>>(new Map());

  // 加载智能体列表，用于把 agentId 映射为名称
  useEffect(() => {
    const api = createAPI({ name: 'eap/agents' });
    api.fetch('').then(({ json }: any) => {
      const items = Array.isArray(json) ? json : [];
      setAgentMap(new Map(items.map((a: any) => [a.id, a.title || a.name || a.id])));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!taskId) return;
    let alive = true;
    setLoading(true);
    setTask(null);
    setRuns([]);
    Promise.all([tasksApi.getById(taskId), tasksApi.listRuns(taskId)])
      .then(([t, r]) => { if (alive) { setTask(t); setRuns(r); } })
      .catch(() => {})
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [taskId]);

  if (!taskId) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        暂无任务
      </div>
    );
  }

  if (loading && !task) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Tabs defaultValue="info" className="flex h-full min-h-0 flex-col">
      <TabsList className="grid w-full shrink-0 grid-cols-3">
        <TabsTrigger value="info"><Info className="h-3.5 w-3.5" /><span className="ml-1">基本信息</span></TabsTrigger>
        <TabsTrigger value="runs"><Play className="h-3.5 w-3.5" /><span className="ml-1">运行记录</span></TabsTrigger>
        <TabsTrigger value="workspace"><FolderTree className="h-3.5 w-3.5" /><span className="ml-1">工作目录</span></TabsTrigger>
      </TabsList>

      <div className="flex-1 min-h-0">
        {/* 基本信息 */}
        <TabsContent value="info" className="h-full">
          <ScrollArea className="h-full">
            {task && (
              <div className="space-y-4 p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-muted-foreground">ID</span><p className="font-mono text-xs mt-0.5 break-all">{task.id}</p></div>
                  <div><span className="text-muted-foreground">状态</span><p className="mt-0.5"><StatusBadge status={task.status} /></p></div>
                  <div><span className="text-muted-foreground">类型</span><p className="mt-0.5">{task.type || '-'}</p></div>
                  <div><span className="text-muted-foreground">智能体 ID</span><p className="font-mono text-xs mt-0.5 break-all">{task.assigneeId || '-'}</p></div>
                  <div><span className="text-muted-foreground">关联 Agent</span><p className="mt-0.5">{agentMap.get(task.agentId || '') || task.agentId || '-'}</p></div>
                  <div><span className="text-muted-foreground">创建人</span><p className="mt-0.5">{task.createdBy || '-'}</p></div>
                  <div><span className="text-muted-foreground">指派类型</span><p className="mt-0.5">{task.assigneeType || '-'}</p></div>
                  {task.initiativeId && <div><span className="text-muted-foreground">Initiative</span><p className="font-mono text-xs mt-0.5 break-all">{task.initiativeId}</p></div>}
                  <div><span className="text-muted-foreground">创建时间</span><p className="mt-0.5">{task.createdAt ? new Date(task.createdAt).toLocaleString('zh-CN') : '-'}</p></div>
                  <div><span className="text-muted-foreground">更新时间</span><p className="mt-0.5">{task.updatedAt ? new Date(task.updatedAt).toLocaleString('zh-CN') : '-'}</p></div>
                </div>
                {task.description && (
                  <div>
                    <span className="text-sm text-muted-foreground">描述</span>
                    <p className="text-sm mt-1 whitespace-pre-wrap">{task.description}</p>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        {/* 运行记录 */}
        <TabsContent value="runs" className="h-full">
          <ScrollArea className="h-full">
            {runs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-sm text-muted-foreground py-16">
                <Play className="h-10 w-10 opacity-30" />
                <p>暂无运行记录</p>
                <p className="text-xs">任务执行后运行记录会显示在这里</p>
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {runs.map(run => (
                  <Card key={run.id} className="p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <RunStatusBadge status={run.status} />
                        <div className="min-w-0">
                          <p className="font-mono text-xs text-muted-foreground truncate">{run.id}</p>
                          <div className="flex gap-4 mt-1.5 text-xs text-muted-foreground">
                            <span>开始: {run.startedAt ? new Date(run.startedAt).toLocaleString('zh-CN') : '-'}</span>
                            <span>结束: {run.finishedAt ? new Date(run.finishedAt).toLocaleString('zh-CN') : '-'}</span>
                          </div>
                        </div>
                      </div>
                      {run.error && (
                        <Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-500/30 shrink-0 ml-2 max-w-[200px] truncate" title={run.error}>
                          {run.error}
                        </Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        {/* 工作目录 */}
        <TabsContent value="workspace" className="h-full">
          <div className="h-full p-3">
            <AgentWorkspace id={taskId} mode="task" className="h-full" />
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}
