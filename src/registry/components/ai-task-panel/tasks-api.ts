/**
 * 任务 API 客户端（task 模式专用）
 * 基于 eap/swagger 的 /tasks 路径组实现，供 task 模式右侧详情面板使用。
 */
import { createAPI } from '@kesi/client';

export interface Task {
  id: string;
  title: string;
  description?: string;
  type?: string;
  status?: string; // pending / running / completed / failed / cancelled
  data?: Record<string, any>;
  agentId?: string;
  assigneeId: string;
  assigneeType: string; // agent / user
  initiativeId?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskRun {
  id: string;
  taskId: string;
  agentId?: string;
  status?: string; // pending / running / completed / failed
  error?: string;
  startedAt?: string;
  finishedAt?: string;
  triggerMessageId?: string;
  retryOfRunId?: string;
}

const tasksAPI = createAPI({ name: 'eap/tasks' });

const asJson = <T>(r: any): T => r?.json ?? r;

export const tasksApi = {
  /** GET /tasks/:id */
  async getById(id: string): Promise<Task> {
    const detail = asJson<Task>(await tasksAPI.fetch(`/${id}`));
    if (!detail?.id) throw new Error('Task not found');
    return detail;
  },

  /** GET /tasks/:id/runs */
  async listRuns(id: string): Promise<TaskRun[]> {
    const list = asJson<any>(await tasksAPI.fetch(`/${id}/runs`));
    return Array.isArray(list) ? list : [];
  },
};

export default tasksApi;
