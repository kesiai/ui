import * as React from "react"
import { cn } from "@/lib/utils"
import {
  MousePointer,
  Pencil,
  Minus,
  Square,
  Circle,
  PenTool,
  Star,
  Hexagon,
  Copy,
  Trash2,
  Undo2,
  Redo2,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export interface ToolbarProps {
  mode: string
  editable?: boolean
  selectedCount?: number
  onModeChange: (mode: string) => void
  onCopy: () => void
  onDelete: () => void
  onUndo: () => void
  onRedo: () => void
}

const tools = [
  { mode: "select", icon: MousePointer, label: "选择", shortcut: "V" },
  { mode: "fhpath", icon: Pencil, label: "铅笔", shortcut: "P" },
  { mode: "line", icon: Minus, label: "直线", shortcut: "L" },
  { mode: "rect", icon: Square, label: "矩形", shortcut: "R" },
  { mode: "ellipse", icon: Circle, label: "椭圆", shortcut: "O" },
  { mode: "path", icon: PenTool, label: "钢笔", shortcut: "B" },
  { mode: "star", icon: Star, label: "星形", shortcut: "S" },
  { mode: "polygon", icon: Hexagon, label: "多边形", shortcut: "G" },
]

export const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  (
    {
      mode,
      editable = true,
      selectedCount = 0,
      onModeChange,
      onCopy,
      onDelete,
      onUndo,
      onRedo,
    },
    ref
  ) => {
    const [isCollapsed, setIsCollapsed] = React.useState(false)

    return (
      <div
        ref={ref}
        className="bg-white border border-slate-200 rounded-lg shadow-lg z-50"
        style={{ minWidth: "400px" }}
      >
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 bg-slate-50 cursor-move">
          <span className="text-sm font-semibold text-slate-700">工具栏</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronUp size={14} />
            )}
          </Button>
        </div>

        {!isCollapsed && (
          <div className="flex items-center gap-1 p-2">
            {tools.map((tool) => {
              const Icon = tool.icon
              return (
                <Button
                  key={tool.mode}
                  variant={mode === tool.mode ? "default" : "ghost"}
                  size="icon"
                  className={cn(
                    "h-8 w-8",
                    mode === tool.mode && "bg-blue-500 text-white hover:bg-blue-600"
                  )}
                  onClick={() => editable && onModeChange(tool.mode)}
                  disabled={!editable}
                  title={`${tool.label} (${tool.shortcut})`}
                >
                  <Icon size={16} />
                </Button>
              )
            })}

            <div className="w-px h-6 mx-2 bg-slate-300" />

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onCopy}
              // disabled={!editable || selectedCount === 0}
              title="复制 (Ctrl+C)"
            >
              <Copy size={16} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onDelete}
              // disabled={!editable || selectedCount === 0}
              title="删除 (Delete)"
            >
              <Trash2 size={16} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onUndo}
              disabled={!editable}
              title="撤销 (Ctrl+Z)"
            >
              <Undo2 size={16} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onRedo}
              disabled={!editable}
              title="重做 (Ctrl+Shift+Z)"
            >
              <Redo2 size={16} />
            </Button>
          </div>
        )}
      </div>
    )
  }
)

Toolbar.displayName = "Toolbar"
