import * as React from "react"
import { cn } from "@/lib/utils"
import {
  ChevronRight,
  ChevronDown,
  MousePointer,
  Pencil,
  Minus,
  Square,
  Circle,
  PenTool,
  Star,
  Hexagon,
  FileText,
  Layers,
} from "lucide-react"

export interface TreeNode {
  id: string
  key: string
  title: string
  tagName: string
  name?: string
  dataType?: string
  disabled?: boolean
  children?: TreeNode[]
  icon?: React.ReactNode
}

export interface TreeProps {
  data: TreeNode[]
  selectedKeys?: string[]
  expandedKeys?: string[]
  onSelect?: (keys: string[]) => void
  onExpand?: (keys: string[]) => void
  className?: string
}

const iconMap: Record<string, React.ReactNode> = {
  select: <MousePointer size={14} />,
  fhpath: <Pencil size={14} />,
  line: <Minus size={14} />,
  rect: <Square size={14} />,
  ellipse: <Circle size={14} />,
  path: <PenTool size={14} />,
  star: <Star size={14} />,
  polygon: <Hexagon size={14} />,
  g: <Layers size={14} />,
  default: <FileText size={14} />,
}

const TreeNodeComponent: React.FC<{
  node: TreeNode
  level: number
  selectedKeys?: string[]
  expandedKeys?: string[]
  onSelect?: (key: string) => void
  onExpand?: (key: string) => void
}> = ({ node, level, selectedKeys, expandedKeys, onSelect, onExpand }) => {
  const isSelected = selectedKeys?.includes(node.id)
  const isExpanded = expandedKeys?.includes(node.id)
  const hasChildren = node.children && node.children.length > 0

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!node.disabled) {
      onSelect?.(node.id)
    }
  }

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (hasChildren) {
      onExpand?.(node.id)
    }
  }

  const getIcon = () => {
    if (node.icon) return node.icon
    if (iconMap[node.dataType || ""]) return iconMap[node.dataType || ""]
    if (iconMap[node.tagName || ""]) return iconMap[node.tagName || ""]
    return iconMap.default
  }

  return (
    <div className={cn("tree-node", isSelected && "tree-node-selected")}>
      <div
        className={cn(
          "tree-node-content",
          node.disabled && "tree-node-disabled"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
      >
        {hasChildren && (
          <button
            className="tree-node-expand"
            onClick={handleExpand}
            disabled={node.disabled}
          >
            {isExpanded ? (
              <ChevronDown size={12} />
            ) : (
              <ChevronRight size={12} />
            )}
          </button>
        )}
        {!hasChildren && <span className="tree-node-spacer" />}
        <span className="tree-node-icon">{getIcon()}</span>
        <span className="tree-node-label">{node.title}</span>
      </div>

      {hasChildren && isExpanded && (
        <div className="tree-node-children">
          {node.children?.map((child) => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              level={level + 1}
              selectedKeys={selectedKeys}
              expandedKeys={expandedKeys}
              onSelect={onSelect}
              onExpand={onExpand}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const Tree = React.forwardRef<HTMLDivElement, TreeProps>(
  (
    { data = [], selectedKeys = [], expandedKeys = [], onSelect, onExpand, className },
    ref
  ) => {
    const handleNodeSelect = (key: string) => {
      onSelect?.([key])
    }

    const handleNodeExpand = (key: string) => {
      if (expandedKeys.includes(key)) {
        onExpand?.(expandedKeys.filter((k) => k !== key))
      } else {
        onExpand?.([...expandedKeys, key])
      }
    }

    return (
      <div
        ref={ref}
        className={cn("tree", className)}
      >
        {data.map((node) => (
          <TreeNodeComponent
            key={node.id}
            node={node}
            level={0}
            selectedKeys={selectedKeys}
            expandedKeys={expandedKeys}
            onSelect={handleNodeSelect}
            onExpand={handleNodeExpand}
          />
        ))}
      </div>
    )
  }
)

Tree.displayName = "Tree"
