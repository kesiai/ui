/**
 * 工作区 API 客户端
 * agent 模式: /eap/agents/{id}/workspace/*  (type: 'file'/'dir')
 * task  模式: /eap/tasks/{id}/workspace/*   (isDir: boolean)
 * 两者接口结构完全一致，仅 base path 和返回字段名不同。
 */

import { createAPI, getHeaders } from '@kesi/client';
import type { WorkspaceMode, WorkspaceNode, WorkspaceFileDetail, WorkspaceApi } from './types';

const apis = {
  agent: createAPI({ name: 'eap/agents' }),
  task:  createAPI({ name: 'eap/tasks' }),
};

/** 归一化：{type:'dir'} 或 {isDir:true} → WorkspaceNode */
function normalizeEntry(raw: any): WorkspaceNode {
  return {
    name: raw.name || '',
    path: raw.path || '',
    type: (raw.type === 'dir' || raw.isDir) ? 'dir' : 'file',
    size: raw.size,
    updatedAt: raw.updatedAt,
  };
}

/** 归一化文件详情 */
function normalizeFile(raw: any): WorkspaceFileDetail {
  return {
    path: raw.path || '',
    content: raw.content,
    size: raw.size,
    contentType: raw.contentType,
    updatedAt: raw.updatedAt,
  };
}

/**
 * 创建统一工作区 API
 * @param mode - 'agent' | 'task'
 */
export function createWorkspaceApi(mode: WorkspaceMode): WorkspaceApi {
  const api = apis[mode];
  const base = mode === 'agent' ? 'agents' : 'tasks';

  const asJson = <T>(r: any): T => r?.json ?? r;

  return {
    /** GET /{id}/workspace/tree[?path=...] */
    async getTree(id: string, path = '') {
      const q = path ? `?path=${encodeURIComponent(path)}` : '';
      const data = asJson<any>(await api.fetch(`/${id}/workspace/tree${q}`));
      const entries = Array.isArray(data) ? data : (data?.entries || []);
      return entries.map(normalizeEntry);
    },

    /** GET /{id}/workspace/file?path=... */
    async getFile(id: string, path: string) {
      const q = `?path=${encodeURIComponent(path)}`;
      return normalizeFile(asJson<any>(await api.fetch(`/${id}/workspace/file${q}`)));
    },

    /** PUT /{id}/workspace/file */
    async saveFile(id: string, path: string, content: string) {
      await api.fetch(`/${id}/workspace/file`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, content }),
      });
    },

    /** DELETE /{id}/workspace/file?path=... */
    async deleteFile(id: string, path: string) {
      await api.fetch(`/${id}/workspace/file?path=${encodeURIComponent(path)}`, { method: 'DELETE' });
    },

    /** POST /{id}/workspace/dirs */
    async createDir(id: string, path: string) {
      await api.fetch(`/${id}/workspace/dirs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      });
    },

    /** DELETE /{id}/workspace/dirs?path=...&recursive=... */
    async deleteDir(id: string, path: string, recursive = false) {
      await api.fetch(`/${id}/workspace/dirs?path=${encodeURIComponent(path)}&recursive=${recursive}`, { method: 'DELETE' });
    },

    /** 下载文件 */
    async downloadFile(id: string, path: string, filename?: string) {
      const cleanPath = path.replace(/^\/?(workspace\/)?[a-f0-9]{24}\/?/, '');
      const params = new URLSearchParams({ path: cleanPath });
      const headers = getHeaders();
      const authHeader = headers['Authorization'] || '';
      const projectId = headers['x-request-project'] || '';
      if (authHeader) params.set('token', authHeader.replace(/^Bearer\s+/i, ''));
      if (projectId) params.set('x-request-project', projectId);
      const url = `/rest/eap/${base}/${id}/workspace/file/download?${params.toString()}`;
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || path.split('/').pop() || 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
  };
}
