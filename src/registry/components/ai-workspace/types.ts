/**
 * 智能体工作区文件类型
 * 对齐后端 /agents/{id}/workspace 接口
 */

/** 文件树节点 */
export interface AgentWorkspaceFileEntry {
  name?: string;
  path?: string;
  size?: number;
  type?: 'file' | 'dir';
  updatedAt?: string;
}

/** 文件详情 */
export interface AgentWorkspaceFileDetail {
  content?: string;
  contentType?: string;
  name?: string;
  path?: string;
  size?: number;
  type?: 'file';
  updatedAt?: string;
}

/** 创建目录请求 */
export interface CreateAgentWorkspaceDirRequest {
  path: string;
}

/** 保存文件请求 */
export interface SaveAgentWorkspaceFileRequest {
  path: string;
  content?: string;
}
