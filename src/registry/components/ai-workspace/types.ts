/**
 * 工作区文件类型
 * 对齐后端 /agents/{id}/workspace 和 /tasks/{id}/workspace 接口
 */

/** 工作区模式 */
export type WorkspaceMode = 'agent' | 'task';

// ======== Agent 模式类型（向后兼容） ========

/** 文件树节点（agent 模式） */
export interface AgentWorkspaceFileEntry {
  name?: string;
  path?: string;
  size?: number;
  type?: 'file' | 'dir';
  updatedAt?: string;
}

/** 文件详情（agent 模式） */
export interface AgentWorkspaceFileDetail {
  content?: string;
  contentType?: string;
  name?: string;
  path?: string;
  size?: number;
  type?: 'file';
  updatedAt?: string;
}

/** 创建目录请求（agent 模式） */
export interface CreateAgentWorkspaceDirRequest {
  path: string;
}

/** 保存文件请求（agent 模式） */
export interface SaveAgentWorkspaceFileRequest {
  path: string;
  content?: string;
}

// ======== Task 模式类型 ========

/** 文件树节点（task 模式原始类型） */
export interface TaskWorkspaceEntry {
  name: string;
  path: string;
  isDir: boolean;
  size?: number;
  updatedAt?: string;
}

/** 文件详情（task 模式） */
export interface TaskWorkspaceFile {
  path: string;
  content?: string;
  size?: number;
  contentType?: string;
  updatedAt?: string;
}

// ======== 统一内部类型（组件使用） ========

/** 统一的文件树节点（归一化后） */
export interface WorkspaceNode {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size?: number;
  updatedAt?: string;
}

/** 统一的文件详情（归一化后） */
export interface WorkspaceFileDetail {
  path: string;
  content?: string;
  size?: number;
  contentType?: string;
  updatedAt?: string;
}

// ======== API 接口定义 ========

export interface WorkspaceApi {
  getTree(id: string, path?: string): Promise<WorkspaceNode[]>;
  getFile(id: string, path: string): Promise<WorkspaceFileDetail>;
  saveFile(id: string, path: string, content: string): Promise<void>;
  deleteFile(id: string, path: string): Promise<void>;
  createDir(id: string, path: string): Promise<void>;
  deleteDir(id: string, path: string, recursive?: boolean): Promise<void>;
  downloadFile(id: string, path: string, filename?: string): Promise<void>;
}
