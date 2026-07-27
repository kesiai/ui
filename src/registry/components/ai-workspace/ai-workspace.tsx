"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Loader2,
  Save,
  File,
  Folder,
  FolderOpen,
  FilePlus,
  FolderPlus,
  Download,
  Eye,
  Pencil,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { workspaceApi } from "./workspace-api";
import { renderMarkdown } from "./markdown";
import type { AgentWorkspaceFileEntry, AgentWorkspaceFileDetail } from "./types";

export interface AgentWorkspaceProps {
  /** 智能体 ID */
  agentId: string;
  /** 自定义类名 */
  className?: string;
}

export function AgentWorkspace({ agentId, className }: AgentWorkspaceProps) {
  // 文件树状态
  const [treeMap, setTreeMap] = useState<Record<string, AgentWorkspaceFileEntry[]>>({});
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<string | null>(null);
  const [file, setFile] = useState<AgentWorkspaceFileDetail | null>(null);
  const [content, setContent] = useState("");
  const [fileLoading, setFileLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(true);
  const [loadingDir, setLoadingDir] = useState<Set<string>>(new Set());

  // 新建弹窗状态
  const [showNewFile, setShowNewFile] = useState(false);
  const [showNewDir, setShowNewDir] = useState(false);
  const [newPath, setNewPath] = useState("");
  const [newDirPath, setNewDirPath] = useState("");
  const [opError, setOpError] = useState("");

  // 初始化加载根目录
  useEffect(() => {
    if (agentId) loadDir("");
  }, [agentId]);

  /** 加载目录子节点 */
  const loadDir = useCallback(async (dirPath: string) => {
    if (!agentId) return;
    setLoadingDir(prev => new Set([...prev, dirPath]));
    try {
      const entries = await workspaceApi.getTree(agentId, dirPath);
      setTreeMap(prev => ({ ...prev, [dirPath]: entries }));
    } catch { /* ignore */ } finally {
      setLoadingDir(prev => { const n = new Set(prev); n.delete(dirPath); return n; });
    }
  }, [agentId]);

  /** 展开/折叠目录 */
  const toggleDir = useCallback((path: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(path)) { next.delete(path); return next; }
      next.add(path);
      if (!treeMap[path]) loadDir(path);
      return next;
    });
  }, [treeMap, loadDir]);

  /** 选择文件 */
  const selectFile = useCallback(async (path: string) => {
    if (!agentId) return;
    setSelected(path);
    setPreview(path.toLowerCase().endsWith(".md"));
    setFileLoading(true);
    try {
      const detail = await workspaceApi.getFile(agentId, path);
      setFile(detail);
      setContent(detail.content || "");
    } catch { setFile(null); } finally { setFileLoading(false); }
  }, [agentId]);

  /** 保存文件 */
  const saveCurrentFile = useCallback(async () => {
    if (!agentId || !selected) return;
    setSaving(true);
    try {
      await workspaceApi.saveFile(agentId, { path: selected, content });
      setFile(p => p ? { ...p, content } : null);
    } finally { setSaving(false); }
  }, [agentId, selected, content]);

  /** 下载文件 */
  const downloadCurrentFile = useCallback(async () => {
    if (!agentId || !selected) return;
    const name = selected.split("/").pop() || "download";
    await workspaceApi.downloadFile(agentId, selected, name);
  }, [agentId, selected]);

  /** 父目录路径 */
  const parentDir = (childPath: string) => {
    const idx = childPath.lastIndexOf("/");
    return idx >= 0 ? childPath.slice(0, idx) : "";
  };

  /** 当前选中节点的父目录 */
  const getParentPath = (): string => {
    if (!selected) return "";
    if (selected.endsWith("/")) return selected;
    const idx = selected.lastIndexOf("/");
    return idx >= 0 ? selected.slice(0, idx + 1) : "";
  };

  /** 新建文件 */
  const createFile = useCallback(async () => {
    if (!agentId || !newPath.trim()) return;
    setOpError("");
    const name = newPath.trim().replace(/^\/+/, "");
    const fullPath = getParentPath() + name;
    try {
      await workspaceApi.saveFile(agentId, { path: fullPath, content: "" });
      setShowNewFile(false); setNewPath("");
      loadDir(parentDir(fullPath));
    } catch (e: any) { setOpError(e?.message || "创建失败"); }
  }, [agentId, newPath, loadDir, selected]);

  /** 新建目录 */
  const createDirectory = useCallback(async () => {
    if (!agentId || !newDirPath.trim()) return;
    setOpError("");
    const name = newDirPath.trim().replace(/^\/+|\/+$/g, "");
    const fullPath = getParentPath() + name + "/";
    try {
      await workspaceApi.createDir(agentId, { path: fullPath });
      setShowNewDir(false); setNewDirPath("");
      loadDir(parentDir(fullPath));
    } catch (e: any) { setOpError(e?.message || "创建失败"); }
  }, [agentId, newDirPath, loadDir, selected]);

  /** 删除节点 */
  const deleteNode = useCallback(async (entry: AgentWorkspaceFileEntry) => {
    if (!agentId) return;
    const label = entry.path || entry.name || "";
    if (!confirm(`确定删除「${label}」？不可撤销。`)) return;
    const p = entry.path || "";
    try {
      if (entry.type === "dir") await workspaceApi.deleteDir(agentId, p, true);
      else await workspaceApi.deleteFile(agentId, p);
      if (selected === p) { setSelected(null); setFile(null); setContent(""); }
      setTreeMap(prev => { const n = { ...prev }; delete n[p]; return n; });
      loadDir(parentDir(p));
    } catch { /* ignore */ }
  }, [agentId, selected, loadDir]);

  const isMd = selected?.toLowerCase().endsWith(".md");

  /** 递归渲染树节点 */
  const renderNode = (entry: AgentWorkspaceFileEntry, depth: number): React.ReactNode => {
    const p = entry.path || "";
    const isDir = entry.type === "dir";
    const isExpanded = expanded.has(p);
    const isSelected = selected === p;
    const isLoading = loadingDir.has(p);
    const children = treeMap[p] || [];

    return (
      <div key={p}>
        <div
          className={`group flex items-center gap-1.5 py-0.5 px-2 rounded cursor-pointer text-sm hover:bg-accent/60 ${isSelected ? "bg-accent" : ""}`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => isDir ? toggleDir(p) : selectFile(p)}
        >
          {isDir ? (
            isLoading
              ? <Loader2 className="h-3 w-3 shrink-0 animate-spin text-muted-foreground" />
              : <ChevronRight className={`h-3 w-3 shrink-0 text-muted-foreground transition ${isExpanded ? "rotate-90" : ""}`} />
          ) : <span className="w-3 shrink-0" />}
          {isDir ? (isExpanded ? <FolderOpen className="h-3.5 w-3.5 shrink-0 text-blue-500" /> : <Folder className="h-3.5 w-3.5 shrink-0 text-blue-500" />)
            : <File className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
          <span className="truncate text-xs">{entry.name}</span>
          <button className="ml-auto opacity-0 group-hover:opacity-60 hover:!opacity-100"
            onClick={e => { e.stopPropagation(); deleteNode(entry); }} title="删除">
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
        {isDir && isExpanded && children
          .sort((a, b) => {
            if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
            return (a.name || "").localeCompare(b.name || "");
          })
          .map(child => renderNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className={`flex h-full border rounded-lg overflow-hidden relative ${className || ""}`}>
      {/* 左侧：文件树 */}
      <div className="w-56 shrink-0 border-r bg-background flex flex-col min-h-0">
        <div className="flex items-center justify-between px-3 py-2 border-b shrink-0">
          <span className="text-xs font-medium text-muted-foreground">文件</span>
          <div className="flex gap-0.5">
            <Button variant="ghost" size="icon" className="h-6 w-6" title="新建文件" onClick={() => setShowNewFile(true)}>
              <FilePlus className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" title="新建目录" onClick={() => setShowNewDir(true)}>
              <FolderPlus className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-auto">
          <div className="min-w-max">
            {(() => {
              const rootEntries = treeMap[""] || [];
              return rootEntries.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8">暂无文件</p>
              ) : (
                <div className="py-1">
                  {[...rootEntries].sort((a, b) => {
                    if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
                    return (a.name || "").localeCompare(b.name || "");
                  }).map(entry => renderNode(entry, 0))}
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* 右侧：编辑器/预览 */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/20 shrink-0">
          <span className="text-xs text-muted-foreground truncate max-w-[60%]">
            {selected || "未选择文件"}
          </span>
          <div className="flex items-center gap-1">
            {isMd && selected && (
              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setPreview(!preview)}>
                {preview ? <><Pencil className="h-3 w-3 mr-1" />编辑</> : <><Eye className="h-3 w-3 mr-1" />预览</>}
              </Button>
            )}
            {selected && (
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={saveCurrentFile} disabled={saving}>
                {saving ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Save className="h-3 w-3 mr-1" />}
                保存
              </Button>
            )}
            {selected && (
              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={downloadCurrentFile}>
                <Download className="h-3 w-3 mr-1" />下载
              </Button>
            )}
          </div>
        </div>
        <div className="flex-1 min-h-0">
          {fileLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : file ? (
            isMd && preview ? (
              <ScrollArea className="h-full">
                <div
                  className="p-4 prose prose-sm dark:prose-invert max-w-none overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
                />
              </ScrollArea>
            ) : (
              <Textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="文件内容为空"
                className="w-full h-full resize-none border-0 rounded-none font-mono text-sm p-4 focus-visible:ring-0"
                style={{ tabSize: 2 }}
              />
            )
          ) : selected ? (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">文件内容为空</div>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">选择文件查看内容</div>
          )}
        </div>
      </div>

      {/* 新建文件弹窗 */}
      {showNewFile && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80" onClick={() => setShowNewFile(false)}>
          <div className="w-80 p-4 rounded-lg border bg-card shadow-lg" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-medium mb-3">新建文件</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">文件名</Label>
                <Input placeholder="例如: config.yaml" className="h-8 text-sm font-mono" value={newPath}
                  onChange={e => setNewPath(e.target.value)} autoFocus
                  onKeyDown={e => { if (e.key === "Enter") createFile(); if (e.key === "Escape") setShowNewFile(false); }} />
              </div>
              {opError && <p className="text-xs text-destructive">{opError}</p>}
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" onClick={() => { setShowNewFile(false); setNewPath(""); setOpError(""); }}>取消</Button>
                <Button size="sm" onClick={createFile} disabled={!newPath.trim()}>创建</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 新建目录弹窗 */}
      {showNewDir && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80" onClick={() => setShowNewDir(false)}>
          <div className="w-80 p-4 rounded-lg border bg-card shadow-lg" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-medium mb-3">新建目录</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">目录名</Label>
                <Input placeholder="例如: scripts" className="h-8 text-sm font-mono" value={newDirPath}
                  onChange={e => setNewDirPath(e.target.value)} autoFocus
                  onKeyDown={e => { if (e.key === "Enter") createDirectory(); if (e.key === "Escape") setShowNewDir(false); }} />
              </div>
              {opError && <p className="text-xs text-destructive">{opError}</p>}
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" onClick={() => { setShowNewDir(false); setNewDirPath(""); setOpError(""); }}>取消</Button>
                <Button size="sm" onClick={createDirectory} disabled={!newDirPath.trim()}>创建</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
