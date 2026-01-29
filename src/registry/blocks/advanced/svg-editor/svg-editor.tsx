import * as React from "react"
import { cn } from "@/lib/utils"
import { Toolbar, ToolbarProps } from "./toolbar"
import { Tree } from "./tree"
import type { TreeNode } from "./tree"
import { PropertyPanel, Property } from "./property-panel"
import "./svg-editor.css"

export interface SvgEditorProps {
  /**
   * SVG 内容字符串
   */
  initialSvg?: string
  /**
   * 宽度
   */
  width?: number | string
  /**
   * 高度
   */
  height?: number | string
  /**
   * 画布背景色
   * @default transparent
   */
  backgroundColor?: string
  /**
   * 是否显示工具栏
   * @default true
   */
  showToolbar?: boolean
  /**
   * 是否可编辑
   * @default true
   */
  editable?: boolean
  /**
   * SVG 内容变化回调
   */
  onSvgChange?: (svg: string) => void
  /**
   * 元素选中回调
   */
  onSelectionChange?: (elements: any[]) => void
  /**
   * 属性变化回调
   */
  onPropertyChange?: (key: string, value: any) => void
}

type DrawingMode =
  | "select"
  | "fhpath"
  | "line"
  | "rect"
  | "ellipse"
  | "path"
  | "star"
  | "polygon"
  | "image"

// svgedit 相关类型定义
declare global {
  interface Window {
    airiotSVG?: Record<string, any>
  }
}

// 图标列表
const iconList: Record<string, string> = {
  fhpath: "✏️",
  line: "📏",
  rect: "⬜",
  ellipse: "⭕",
  path: "✎️",
  star: "⭐",
  polygon: "⬡",
  image: "🖼️",
}

// 路径名称映射
const pathNames: Record<string, string> = {
  fhpath: "线条",
  line: "线段",
  rect: "矩形",
  ellipse: "椭圆",
  path: "钢笔",
  star: "星形",
  polygon: "多边形",
  image: "图片",
}

const SvgEditor = React.forwardRef<HTMLDivElement, SvgEditorProps>(
  (
    {
      className,
      initialSvg = "",
      width = "100%",
      height = "100%",
      backgroundColor = "transparent",
      editable = true,
      onSvgChange,
      onSelectionChange,
      onPropertyChange,
      ...props
    },
    ref
  ) => {
    const canvasContainerRef = React.useRef<HTMLDivElement>(null)
    const svgCanvasRef = React.useRef<any>(null)
    const toolbarRef = React.useRef<HTMLDivElement>(null)

    const [mode, setMode] = React.useState<DrawingMode>("select")
    const [selectedElements, setSelectedElements] = React.useState<any[]>([])
    const [selectedKeys, setSelectedKeys] = React.useState<string[]>([])
    const [treeData, setTreeData] = React.useState<TreeNode[]>([])
    const [expandedKeys, setExpandedKeys] = React.useState<string[]>([])
    const [properties, setProperties] = React.useState<Property[]>([])
    const [isCanvasReady, setIsCanvasReady] = React.useState(false)

    // 工具栏位置
    const [toolbarPosition, setToolbarPosition] = React.useState({ x: 20, y: 20 })

    // 获取画布所有元素
    const getAllPath = React.useCallback((svg: any) => {
      if (!svg) return []

      try {
        // 查找 id 为 "svgcontent" 的 SVG 元素
        const svgContentSvg = canvasContainerRef.current?.querySelector('#svgcontent') || svg.svgElem || svg.svgCanvas?.svgContent || svg.getCurrentDrawing?.svgElem_

        if (!svgContentSvg) {
          console.warn('SVG content element not found, checking all SVGs...')
          // 先输出所有 SVG 元素用于调试
          const allSvgs = canvasContainerRef.current?.querySelectorAll('svg')
          console.log('All SVG elements found:', allSvgs)
          allSvgs?.forEach((svgElem: any) => {
            console.log('SVG element:', {
              tagName: svgElem.tagName,
              id: svgElem.id,
              class: svgElem.getAttribute('class')
            })
          })
          return []
        }

        console.log('SVG content found:', svgContentSvg)

        const getChildren = (node: Element) => {
          const children = Array.from(node.children || [])
          return children
            .filter((item) => item.tagName !== "title")
            .map((child) => {
              const childData: TreeNode = {
                id: child.id || `node-${Math.random().toString(36).substring(2, 11)}`,
                key: child.id || `node-${Math.random().toString(36).substring(2, 11)}`,
                disabled: ["g", "animate", "animateMotion"].includes(child?.tagName),
                icon: iconList[child.getAttribute("data-type") ?? child?.tagName],
                title: `${pathNames[child.getAttribute("data-type") ?? child?.tagName] || child?.tagName}(${child?.id || child.tagName})`,
                tagName: child.tagName,
                name: child.getAttribute("data-name") ?? undefined,
                dataType: child.getAttribute("data-type") ?? undefined,
                children: getChildren(child),
              }
              return childData
            })
        }

        // 获取 svgcontent 下所有顶层元素（包括直接的形状元素和分组）
        const topLevelElements = Array.from(svgContentSvg.children || []).filter((item: any) => {
          const tagName = item.tagName
          // 排除 metadata 元素
          return !["title", "desc", "defs"].includes(tagName)
        })

        console.log('Top level elements:', topLevelElements)

        // 如果没有 group 元素，直接返回顶层元素
        const groups = topLevelElements.filter((item: any) => item.tagName === "g")
        const shapes = topLevelElements.filter((item: any) => item.tagName !== "g")

        const result: TreeNode[] = []

        // 添加分组
        groups.forEach((group: any) => {
          result.push({
            id: group.id || `group-${Math.random().toString(36).substring(2, 11)}`,
            key: group.id || `group-${Math.random().toString(36).substring(2, 11)}`,
            disabled: true,
            tagName: group.tagName || "",
            title: `分组(${group.id || '未命名'})`,
            name: group.getAttribute("data-name") ?? undefined,
            dataType: group.getAttribute("data-type") ?? undefined,
            children: getChildren(group),
          })
        })

        // 添加直接形状元素
        shapes.forEach((shape: any) => {
          result.push({
            id: shape.id || `shape-${Math.random().toString(36).substring(2, 11)}`,
            key: shape.id || `shape-${Math.random().toString(36).substring(2, 11)}`,
            disabled: false,
            tagName: shape.tagName,
            title: `${pathNames[shape.getAttribute("data-type") ?? shape.tagName] || shape.tagName}(${shape.id || shape.tagName})`,
            name: shape.getAttribute("data-name") ?? undefined,
            dataType: shape.getAttribute("data-type") ?? undefined,
            children: [],
          })
        })

        console.log('Tree result:', result)
        return result
      } catch (error) {
        console.error('Error getting tree data:', error)
        return []
      }
    }, [])

    // 获取选中元素的属性
    const getSelectedProperties = React.useCallback((elements: any[]) => {
      if (elements.length === 0) return []

      const elem = elements[0]
      if (!elem) return []

      const props: Property[] = []

      // 基本信息
      props.push({
        key: "basic.name",
        label: "名称",
        type: "text",
        value: elem.getAttribute("data-name") || "",
        onChange: (value) => {
          elem.setAttribute("data-name", value)
          onPropertyChange?.("basic.name", value)
        },
      })

      props.push({
        key: "basic.id",
        label: "ID",
        type: "text",
        value: elem.id || "",
        onChange: (value) => {
          elem.id = value
          onPropertyChange?.("basic.id", value)
        },
      })

      // 几何属性
      if (elem.tagName === "rect") {
        props.push({
          key: "geometry.x",
          label: "X 坐标",
          type: "number",
          value: parseFloat(elem.getAttribute("x") || "0"),
          onChange: (value) => {
            elem.setAttribute("x", value.toString())
            onPropertyChange?.("geometry.x", value)
          },
        })
        props.push({
          key: "geometry.y",
          label: "Y 坐标",
          type: "number",
          value: parseFloat(elem.getAttribute("y") || "0"),
          onChange: (value) => {
            elem.setAttribute("y", value.toString())
            onPropertyChange?.("geometry.y", value)
          },
        })
        props.push({
          key: "geometry.width",
          label: "宽度",
          type: "number",
          value: parseFloat(elem.getAttribute("width") || "0"),
          onChange: (value) => {
            elem.setAttribute("width", value.toString())
            onPropertyChange?.("geometry.width", value)
          },
        })
        props.push({
          key: "geometry.height",
          label: "高度",
          type: "number",
          value: parseFloat(elem.getAttribute("height") || "0"),
          onChange: (value) => {
            elem.setAttribute("height", value.toString())
            onPropertyChange?.("geometry.height", value)
          },
        })
      }

      if (elem.tagName === "ellipse") {
        props.push({
          key: "geometry.cx",
          label: "圆心 X",
          type: "number",
          value: parseFloat(elem.getAttribute("cx") || "0"),
          onChange: (value) => {
            elem.setAttribute("cx", value.toString())
            onPropertyChange?.("geometry.cx", value)
          },
        })
        props.push({
          key: "geometry.cy",
          label: "圆心 Y",
          type: "number",
          value: parseFloat(elem.getAttribute("cy") || "0"),
          onChange: (value) => {
            elem.setAttribute("cy", value.toString())
            onPropertyChange?.("geometry.cy", value)
          },
        })
        props.push({
          key: "geometry.rx",
          label: "X 半径",
          type: "number",
          value: parseFloat(elem.getAttribute("rx") || "0"),
          onChange: (value) => {
            elem.setAttribute("rx", value.toString())
            onPropertyChange?.("geometry.rx", value)
          },
        })
        props.push({
          key: "geometry.ry",
          label: "Y 半径",
          type: "number",
          value: parseFloat(elem.getAttribute("ry") || "0"),
          onChange: (value) => {
            elem.setAttribute("ry", value.toString())
            onPropertyChange?.("geometry.ry", value)
          },
        })
      }

      // 样式属性
      props.push({
        key: "style.fill",
        label: "填充颜色",
        type: "color",
        value: elem.getAttribute("fill") || "none",
        onChange: (value) => {
          elem.setAttribute("fill", value)
          onPropertyChange?.("style.fill", value)
        },
      })
      props.push({
        key: "style.stroke",
        label: "边框颜色",
        type: "color",
        value: elem.getAttribute("stroke") || "#000000",
        onChange: (value) => {
          elem.setAttribute("stroke", value)
          onPropertyChange?.("style.stroke", value)
        },
      })
      props.push({
        key: "style.strokeWidth",
        label: "边框宽度",
        type: "slider",
        value: parseFloat(elem.getAttribute("stroke-width") || "1"),
        min: 0,
        max: 20,
        step: 0.5,
        unit: "px",
        onChange: (value) => {
          elem.setAttribute("stroke-width", value.toString())
          onPropertyChange?.("style.strokeWidth", value)
        },
      })
      props.push({
        key: "style.opacity",
        label: "透明度",
        type: "slider",
        value: parseFloat(elem.getAttribute("opacity") || "1"),
        min: 0,
        max: 1,
        step: 0.01,
        unit: "",
        onChange: (value) => {
          elem.setAttribute("opacity", value.toString())
          onPropertyChange?.("style.opacity", value)
        },
      })

      return props
    }, [onPropertyChange])

    // 初始化 svgedit
    React.useEffect(() => {
      if (!canvasContainerRef.current || !editable) return

      // 动态导入 svgedit
      import("@svgedit/svgcanvas")
        .then((module) => {
          const { default: SvgCanvas } = module
          const container = canvasContainerRef.current!

          // 清空容器
          container.innerHTML = ""

          // 使用固定尺寸，确保与 CSS 一致
          const w = 800
          const h = 600

          // 创建编辑器配置
          const config = {
            initFill: { color: "FFFFFF", opacity: 1 },
            initStroke: { color: "000000", opacity: 1, width: 1 },
            text: { stroke_width: 0, font_size: 24, font_family: "serif" },
            initOpacity: 1,
            dimensions: [w, h] as [number, number],
            baseUnit: "px",
            extensions: [],
            allowedOrigins: undefined,
          }

          const svgCanvas = new SvgCanvas(container, config)
          svgCanvasRef.current = svgCanvas

          // 设置初始 SVG
          if (initialSvg) {
            svgCanvas.setSvgString(initialSvg)
          }

          // 初始化树数据
          setTimeout(() => {
            const tree = getAllPath(svgCanvas)
            setTreeData(tree)
          }, 100)

          // 标记画布已就绪
          setIsCanvasReady(true)

          // 监听选择变化
          svgCanvas.bind("selected", (elems: any[]) => {
            setSelectedElements(elems)
            setSelectedKeys(elems.map((e) => e.id))
            const tree = getAllPath(svgCanvas)
            setTreeData(tree)
            const props = getSelectedProperties(elems)
            setProperties(props)
            onSelectionChange?.(elems)
          })

          // 监听内容变化
          svgCanvas.bind("changed", () => {
            const svgContent = svgCanvas.getSvgString()
            onSvgChange?.(svgContent)
            // 更新树数据
            const tree = getAllPath(svgCanvas)
            setTreeData(tree)
          })
        })
        .catch((error) => {
          console.error("Failed to load svgedit:", error)
          setIsCanvasReady(false)
        })

      return () => {
        // 清理
        setIsCanvasReady(false)
        if (svgCanvasRef.current) {
          svgCanvasRef.current.clear()
          svgCanvasRef.current = null
        }
      }
    }, [editable, initialSvg, getAllPath, getSelectedProperties, onSvgChange, onSelectionChange])

    // 工具栏拖拽
    const handleDrag = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!toolbarRef.current) return

        const startX = e.clientX - toolbarPosition.x
        const startY = e.clientY - toolbarPosition.y

        const handleMouseMove = (moveEvent: MouseEvent) => {
          const newX = moveEvent.clientX - startX
          const newY = moveEvent.clientY - startY
          setToolbarPosition({ x: newX, y: newY })
        }

        const handleMouseUp = () => {
          document.removeEventListener("mousemove", handleMouseMove)
          document.removeEventListener("mouseup", handleMouseUp)
        }

        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)
      },
      [toolbarPosition]
    )

    // 切换工具模式
    const handleModeChange = (newMode: DrawingMode) => {
      if (!editable) return
      setMode(newMode)
      if (svgCanvasRef.current) {
        svgCanvasRef.current.setMode(newMode)
      }
    }

    // 复制元素
    const handleCopy = () => {
      if (!svgCanvasRef.current || selectedElements.length === 0) return
      svgCanvasRef.current.copySelectedElements()
      svgCanvasRef.current.pasteElements(10, 10)
    }

    // 删除元素
    const handleDelete = () => {
      if (!svgCanvasRef.current || selectedElements.length === 0) return
      svgCanvasRef.current.deleteSelectedElements()
      setSelectedElements([])
      setSelectedKeys([])
      setProperties([])
    }

    // 撤销
    const handleUndo = () => {
      if (!svgCanvasRef.current) return
      svgCanvasRef.current.undoMgr.undo()
      // 刷新树和属性
      const svg = svgCanvasRef.current
      const tree = getAllPath(svg)
      setTreeData(tree)
      const selected = svg.getSelectedElems()
      const props = getSelectedProperties(selected)
      setProperties(props)
    }

    // 重做
    const handleRedo = () => {
      if (!svgCanvasRef.current) return
      svgCanvasRef.current.undoMgr.redo()
      // 刷新树和属性
      const svg = svgCanvasRef.current
      const tree = getAllPath(svg)
      setTreeData(tree)
      const selected = svg.getSelectedElems()
      const props = getSelectedProperties(selected)
      setProperties(props)
    }

    // 处理键盘快捷键
    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (!editable) return

        if (e.ctrlKey || e.metaKey) {
          if (e.key === "z") {
            e.preventDefault()
            e.shiftKey ? handleRedo() : handleUndo()
          } else if (e.key === "c") {
            e.preventDefault()
            handleCopy()
          } else if (e.key === "v") {
            e.preventDefault()
            handleCopy()
          } else if (e.key === "x") {
            e.preventDefault()
            handleDelete()
          }
        }
      }

      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }, [editable, handleUndo, handleRedo, handleCopy, handleDelete])

    // 处理树节点选择
    const handleTreeSelect = (keys: string[]) => {
      if (!svgCanvasRef.current || keys.length === 0) return

      const elem = svgCanvasRef.current.getElem(keys[0])
      if (elem) {
        svgCanvasRef.current.selectOnly([elem])
        setSelectedElements([elem])
        setSelectedKeys(keys)
        const props = getSelectedProperties([elem])
        setProperties(props)
      }
    }

    // 处理树节点展开/折叠
    const handleTreeExpand = (keys: string[]) => {
      setExpandedKeys(keys)
    }

    // 处理属性变化
    const handlePropertyChange = (key: string, value: any) => {
      setProperties((prev) => {
        const newProps = [...prev]
        const idx = newProps.findIndex((p) => p.key === key)
        if (idx !== -1) {
          newProps[idx] = { ...newProps[idx], value }
        }
        return newProps
      })
      onPropertyChange?.(key, value)
    }

    return (
      <div
        ref={ref}
        className={cn("svg-editor", className)}
        style={{ width, height }}
        {...props}
      >
        {/* 左侧元素树 */}
        <div className="svg-editor-sidebar svg-editor-sidebar-left">
          <div className="svg-editor-sidebar-header">
            <h3>元素列表</h3>
          </div>
          <div className="svg-editor-tree">
            <Tree
              data={treeData}
              selectedKeys={selectedKeys}
              expandedKeys={expandedKeys}
              onSelect={handleTreeSelect}
              onExpand={handleTreeExpand}
            />
          </div>
        </div>

        {/* 中间画布 */}
        <div
          className="svg-editor-canvas"
          style={{ backgroundColor }}
        >
          <div
            ref={canvasContainerRef}
            className="svg-editor-canvas-inner"
            style={{ pointerEvents: isCanvasReady ? 'auto' : 'none' }}
          />
        </div>

        {/* 右侧属性面板 */}
        <div className="svg-editor-sidebar svg-editor-sidebar-right">
          <div className="svg-editor-sidebar-header">
            <h3>属性设置</h3>
          </div>
          <div className="svg-editor-property">
            <PropertyPanel
              title={selectedElements.length > 0 ? `已选中 ${selectedElements.length} 个元素` : "属性"}
              properties={properties}
              onChange={handlePropertyChange}
            />
          </div>
        </div>

        {/* 可拖拽工具栏 */}
        {editable && (
          <div
            ref={toolbarRef}
            className="svg-editor-toolbar"
            style={{
              left: `${toolbarPosition.x}px`,
              top: `${toolbarPosition.y}px`,
            }}
          >
            <Toolbar
              mode={mode}
              editable={editable}
              selectedCount={selectedElements.length}
              onModeChange={handleModeChange}
              onCopy={handleCopy}
              onDelete={handleDelete}
              onUndo={handleUndo}
              onRedo={handleRedo}
            />
          </div>
        )}
      </div>
    )
  }
)

SvgEditor.displayName = "SvgEditor"

export { SvgEditor, SvgEditorProps, type TreeNode }
