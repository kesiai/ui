/**
 * 工具名 → 用户看得懂的动作词（执行过程状态条 + 工具卡片共用）
 *
 * 界面上不直接甩 `Read` / `Grep` 这类内部工具 id：状态条说「正在读取文件…」，
 * 工具卡片标题同样说「读取文件」。原始工具名保留在卡片标题后面（小号等宽），
 * 排障时仍能看到到底是哪个工具。
 *
 * 注：registry 是组件库、不带 i18n；这里直接给中文字面量，
 * 安装到应用侧后由 `npm run i18n:apply`（i18n codemod）统一包 `t()`。
 */

const TOOL_ACTION_KEYS: Record<string, string> = {
  Bash: '执行命令',
  Skill: '调用技能',
  Read: '读取文件',
  Edit: '修改文件',
  Write: '写入文件',
  Glob: '查找文件',
  Grep: '搜索内容',
  LS: '浏览目录',
  Task: '处理子任务',
  WebSearch: '联网搜索',
  WebFetch: '打开网页',
  TodoWrite: '整理任务清单',
};

/** 工具名 → 中文动作（未收录的工具回落到通用「调用工具」） */
export function toolActionLabel(toolName?: string): string {
  if (!toolName) return '调用工具';
  return TOOL_ACTION_KEYS[toolName] ?? '调用工具';
}

/** 该工具是否有专门的中文动作（没有就不必重复展示原始名） */
export function hasToolActionLabel(toolName?: string): boolean {
  return !!toolName && toolName in TOOL_ACTION_KEYS;
}
