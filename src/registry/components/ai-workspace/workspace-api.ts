/**
 * 智能体工作区 API 客户端
 * 后端: /agents/{id}/workspace/*
 */

import { createAPI } from '@kesi/client';
import type {
  AgentWorkspaceFileEntry,
  AgentWorkspaceFileDetail,
  CreateAgentWorkspaceDirRequest,
  SaveAgentWorkspaceFileRequest,
} from './types';

const agentsAPI = createAPI({ name: 'eap/agents' });

const asJson = <T>(r: any): T => r?.json ?? r;

/** 获取文件树 */
const getTree = async (agentId: string, path = ''): Promise<AgentWorkspaceFileEntry[]> => {
  const q = path ? `?path=${encodeURIComponent(path)}` : '';
  const result = await agentsAPI.fetch(`/${agentId}/workspace/tree${q}`) as any;
  return asJson<AgentWorkspaceFileEntry[]>(result);
};

/** 读取文件 */
const getFile = async (agentId: string, path: string): Promise<AgentWorkspaceFileDetail> => {
  const q = `?path=${encodeURIComponent(path)}`;
  const result = await agentsAPI.fetch(`/${agentId}/workspace/file${q}`) as any;
  return asJson<AgentWorkspaceFileDetail>(result);
};

/** 保存文件 */
const saveFile = async (agentId: string, req: SaveAgentWorkspaceFileRequest): Promise<AgentWorkspaceFileDetail> => {
  const result = await agentsAPI.fetch(`/${agentId}/workspace/file`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  }) as any;
  return asJson<AgentWorkspaceFileDetail>(result);
};

/** 删除文件 */
const deleteFile = async (agentId: string, path: string): Promise<void> => {
  const q = `?path=${encodeURIComponent(path)}`;
  await agentsAPI.fetch(`/${agentId}/workspace/file${q}`, { method: 'DELETE' });
};

/** 创建目录 */
const createDir = async (agentId: string, req: CreateAgentWorkspaceDirRequest): Promise<void> => {
  await agentsAPI.fetch(`/${agentId}/workspace/dirs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
};

/** 删除目录 */
const deleteDir = async (agentId: string, path: string, recursive = false): Promise<void> => {
  const q = `?path=${encodeURIComponent(path)}&recursive=${recursive}`;
  await agentsAPI.fetch(`/${agentId}/workspace/dirs${q}`, { method: 'DELETE' });
};

/** 下载文件 — 触发浏览器下载 */
const downloadFile = async (agentId: string, path: string, filename?: string): Promise<void> => {
  // 清洗 path：去掉可能误传的绝对路径前缀
  const cleanPath = path.replace(/^\/?(workspace\/)?[a-f0-9]{24}\/?/, "");
  const base = `/rest/eap/agents/${agentId}/workspace/file/download`;
  const params = new URLSearchParams({ path: cleanPath });
  const authHeader = agentsAPI.headers?.['Authorization'] || agentsAPI.headers?.authorization || '';
  const projectId = agentsAPI.headers?.['x-request-project'] || '';
  if (authHeader) params.set('token', authHeader.replace(/^Bearer\s+/i, ''));
  if (projectId) params.set('x-request-project', projectId);
  const url = `${base}?${params.toString()}`;
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || path.split('/').pop() || 'download';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const workspaceApi = {
  getTree,
  getFile,
  saveFile,
  deleteFile,
  createDir,
  deleteDir,
  downloadFile,
};
