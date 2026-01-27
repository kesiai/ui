import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogPortal,
} from "@/registry/components/ui/dialog/dialog"
import { Button } from "@/registry/blocks/components/button/button"
import { ChevronsUpDown, Loader2, ArrowLeft, Check } from "lucide-react"

// ====================== 类型定义 ======================

/** 选择器选项类型 */
export interface PickerOption {
  id?: string
  pId?: string | null
  label?: string
  title?: string
  value: string | number
  children?: PickerOption[]
  child?: any[]
  isLeaf?: boolean
  selectable?: boolean
  isRecord?: boolean
}

/** 输入对象类型 */
interface InputProps {
  value?: string | string[] | number | any
  onChange?: (value: any) => void
}

/** 组件 Props 类型 */
export interface MobilePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 选项列表（normal 或 table 模式使用） */
  options?: PickerOption[]
  /** 树形数据（tableData 级联模式使用，已由外部整理好） */
  treeData?: PickerOption[]
  /** 默认值 */
  defaultValue?: any
  /** 输入对象 */
  input?: InputProps
  /** 是否禁用 */
  disabled?: boolean
  /** 容器 DOM */
  containerDOM?: HTMLElement
  /** 仪表盘模式 */
  dashboardMode?: boolean
  /** 占位符 */
  placeholder?: string
  /** 选择模式 */
  selectModel?: 'normal' | 'table' | 'tableData'
  /** 是否多选 */
  multiple?: boolean
  /** 加载状态 */
  loading?: boolean
  /** 级联选择回调（当用户选择非叶子节点时调用，由外部决定如何加载下一级数据） */
  onCascadeSelect?: (item: PickerOption) => void
  /** 返回上一级回调（由外部处理） */
  onCascadeBack?: () => void
  /** 当前级联层级 */
  cascadeLevel?: number
  /** 当前级联路径 */
  cascadePath?: string[]
}

// ====================== 子组件 ======================

/** 普通选择列表 */
interface PickerListProps {
  data: PickerOption[]
  value?: any
  onConfirm: (value: any) => void
  onClose: () => void
  disabled?: boolean
  placeholder?: string
  multiple?: boolean
}

const PickerList: React.FC<PickerListProps> = ({
  data,
  value,
  onConfirm,
  onClose,
  disabled = false,
  placeholder = "请选择",
  multiple = false
}) => {
  const [selectedValue, setSelectedValue] = React.useState<any>(() => {
    if (multiple) {
      return Array.isArray(value) ? [...value] : []
    }
    return value
  })

  // 同步外部 value 的变化
  React.useEffect(() => {
    if (multiple) {
      if (Array.isArray(value)) {
        setSelectedValue([...value])
      }
    } else {
      setSelectedValue(value)
    }
  }, [value, multiple])

  const handleItemClick = (item: PickerOption) => {
    if (multiple) {
      setSelectedValue((prev: any[]) => {
        const currentValue = String(item.value)
        if (prev.includes(currentValue)) {
          return prev.filter(v => v !== currentValue)
        } else {
          return [...prev, currentValue]
        }
      })
    } else {
      setSelectedValue(String(item.value))
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
        <Button variant="ghost" size="sm" text="关闭" onClick={onClose} className="flex-1 justify-start" />
        <div className="text-sm font-medium text-gray-900">{placeholder}</div>
        <Button variant="ghost" size="sm" text="完成" onClick={() => onConfirm(selectedValue)} className="flex-1 justify-end" />
      </div>
      <div className="flex-1 overflow-auto">
        {data.map((item) => {
          const isSelected = multiple
            ? Array.isArray(selectedValue) && selectedValue.includes(String(item.value))
            : selectedValue === String(item.value)

          return (
            <div
              key={String(item.value)}
              className={cn(
                "flex items-center justify-between px-4 py-3 border-b cursor-pointer",
                disabled && "opacity-50 cursor-not-allowed",
                isSelected && "bg-blue-50"
              )}
              onClick={() => !disabled && handleItemClick(item)}
            >
              <span className="text-sm">{item.label || item.title}</span>
              {isSelected && <Check className="h-4 w-4 text-blue-500" />}
            </div>
          )
        })}
        {data.length === 0 && (
          <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
            暂无数据
          </div>
        )}
      </div>
    </div>
  )
}

/** 级联选择列表 */
interface CascadePickerListProps {
  data: PickerOption[]
  value?: any
  onConfirm: (value: any) => void
  onClose: () => void
  onSelect: (item: PickerOption) => void
  disabled?: boolean
  level: number
  currentPath: string[]
  onBack: () => void
  loading?: boolean
  multiple?: boolean
}

const CascadePickerList: React.FC<CascadePickerListProps> = ({
  data,
  value,
  onConfirm,
  onClose,
  onSelect,
  disabled = false,
  level,
  currentPath,
  onBack,
  loading = false,
  multiple = false
}) => {
  const [selectedValue, setSelectedValue] = React.useState<any>(() => {
    if (multiple) {
      return Array.isArray(value) ? [...value] : []
    }
    return value
  })

  // 同步外部 value 的变化
  React.useEffect(() => {
    if (multiple) {
      if (Array.isArray(value)) {
        setSelectedValue([...value])
      }
    } else {
      setSelectedValue(value)
    }
  }, [value, multiple])

  // 递归获取节点及其所有子节点的值
  const getAllChildValues = (item: PickerOption): string[] => {
    const values = [String(item.value)]
    const children = item.children || item.child
    if (children && children.length > 0) {
      children.forEach(child => {
        values.push(...getAllChildValues(child))
      })
    }
    return values
  }

  const handleItemClick = (item: PickerOption) => {
    if (multiple) {
      // 多选模式：切换选中状态（包含所有子节点）
      setSelectedValue((prev: any[]) => {
        const allChildValues = getAllChildValues(item)
        const isCurrentlySelected = prev.includes(String(item.value))

        if (isCurrentlySelected) {
          // 取消选中父节点：移除所有子节点
          return prev.filter(v => !allChildValues.includes(v))
        } else {
          // 选中父节点：添加所有子节点（去重）
          const newValues = allChildValues.filter(v => !prev.includes(v))
          return [...prev, ...newValues]
        }
      })
    } else {
      setSelectedValue(String(item.value))
      if (item.isLeaf || (!item.children?.length && !item.child?.length)) {
        // 叶子节点：仅选中，不立即确认，用户需点击"确定"按钮
      } else {
        // 非叶子节点：进入下一级
        onSelect(item)
      }
    }
  }

  // 多选模式下点击箭头进入下一级
  const handleArrowClick = (e: React.MouseEvent, item: PickerOption) => {
    e.stopPropagation()
    if (multiple && (item.children?.length || item.child?.length)) {
      onSelect(item)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-2">
          {level > 0 && (
            <Button variant="ghost" text={<ArrowLeft className="h-4 w-4" />} size="sm" onClick={onBack}>
              
            </Button>
          )}
          <Button variant="ghost" size="sm" text="关闭" onClick={onClose}>
          </Button>
        </div>
        <Button variant="ghost" size="sm" text="完成" onClick={() => onConfirm(selectedValue)}>
        </Button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          {data.map((item) => {
            const isSelected = multiple
              ? Array.isArray(selectedValue) && selectedValue.includes(String(item.value))
              : selectedValue === String(item.value)

            return (
              <div
                key={String(item.value)}
                className={cn(
                  "flex items-center justify-between px-4 py-3 border-b cursor-pointer",
                  disabled && "opacity-50 cursor-not-allowed",
                  isSelected && "bg-blue-50"
                )}
                onClick={() => !disabled && handleItemClick(item)}
              >
                <span className="text-sm">{item.label || item.title}</span>
                <div className="flex items-center gap-2">
                  {(item.child?.length || item.children?.length) && (
                    <div
                      className={cn(
                        "text-gray-400 text-xs cursor-pointer p-1",
                        multiple && "hover:bg-gray-100 rounded"
                      )}
                      onClick={(e) => {
                        if (multiple) {
                          handleArrowClick(e, item)
                        }
                      }}
                    >
                      ›
                    </div>
                  )}
                  {isSelected && <Check className="h-4 w-4 text-blue-500" />}
                </div>
              </div>
            )
          })}
          {data.length === 0 && (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
              暂无数据
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ====================== 主组件 ======================

const MobilePicker = React.forwardRef<HTMLDivElement, MobilePickerProps>(
  (
    {
      className,
      options = [],
      treeData = [],
      defaultValue,
      input = {},
      disabled = false,
      containerDOM,
      dashboardMode = false,
      placeholder = "请选择",
      selectModel = "normal",
      multiple = false,
      loading = false,
      onCascadeSelect,
      onCascadeBack,
      cascadeLevel = 0,
      cascadePath = [],
      ...props
    },
    ref
  ) => {
    const [visible, setVisible] = React.useState(false)
    const [value, setValue] = React.useState(input.value || defaultValue)
    const { onChange } = input

    // 级联导航内部状态（tableData 模式下自动处理级联）
    const [currentLevelData, setCurrentLevelData] = React.useState<PickerOption[]>(treeData)
    const [internalLevel, setInternalLevel] = React.useState(0)
    const [internalPath, setInternalPath] = React.useState<PickerOption[]>([])

    // 当外部 treeData 变化时，同步到内部状态
    React.useEffect(() => {
      if (!onCascadeSelect) {
        setCurrentLevelData(treeData)
      }
    }, [treeData, onCascadeSelect])

    // 打开选择器
    const handleOpen = () => {
      if (!disabled && !dashboardMode) {
        setVisible(true)
        // 重置级联状态
        setCurrentLevelData(treeData)
        setInternalLevel(0)
        setInternalPath([])
      }
    }

    // 关闭选择器
    const handleClose = () => {
      setVisible(false)
    }

    // 确认选择
    const handleConfirm = (v: any) => {
      onChange?.(v)
      setValue(v)
      setVisible(false)
    }

    // 级联选择 - 优先使用外部回调，如果没有则内部处理
    const handleCascadeSelect = (item: PickerOption) => {
      if (onCascadeSelect) {
        // 如果外部提供了回调，使用外部逻辑
        onCascadeSelect(item)
      } else {
        // 否则内部处理：使用 item 的 children 或 child 进入下一级
        const nextLevel = item.children || item.child
        if (nextLevel && nextLevel.length > 0) {
          setCurrentLevelData(nextLevel)
          setInternalLevel(internalLevel + 1)
          setInternalPath([...internalPath, item])
        }
      }
    }

    // 返回上一级 - 优先使用外部回调
    const handleCascadeBack = () => {
      if (onCascadeBack) {
        onCascadeBack()
      } else if (internalLevel > 0) {
        // 内部处理：返回上一级
        const newPath = [...internalPath]
        newPath.pop()
        if (newPath.length === 0) {
          // 返回根层级
          setCurrentLevelData(treeData)
          setInternalLevel(0)
          setInternalPath([])
        } else {
          // 返回父层级
          const parent = newPath[newPath.length - 1]
          const parentChildren = parent.children || parent.child
          setCurrentLevelData(parentChildren || treeData)
          setInternalLevel(newPath.length)
          setInternalPath(newPath)
        }
      }
    }

    // 获取显示文本
    const getDisplayText = () => {
      if (value) {
        if (multiple && Array.isArray(value)) {
          if (value.length === 0) return placeholder || "请选择"
          // 多选显示选中项数量
          return `已选 ${value.length} 项`
        }
        return String(value)
      }
      if (placeholder) {
        return placeholder
      }
      return "请选择"
    }

    // 根据 selectModel 获取显示数据
    const getDisplayData = (): PickerOption[] => {
      if (selectModel === 'tableData') {
        return currentLevelData
      }
      return options
    }

    return (
      <div ref={ref} className={cn("mobile-picker", className)} {...props}>
        <div
          className={cn(
            "flex items-center justify-between px-3 py-2 border rounded-md bg-white",
            disabled && "opacity-50 cursor-not-allowed",
            !disabled && "cursor-pointer hover:bg-gray-50"
          )}
          onClick={handleOpen}
        >
          <span className="text-sm truncate flex-1">
            {getDisplayText()}
          </span>
          {!disabled && <ChevronsUpDown className="h-4 w-4 text-gray-400 ml-2 shrink-0" />}
        </div>

        <Dialog open={visible} onOpenChange={setVisible}>
          <DialogPortal container={containerDOM || document.querySelector('.dashboard-cell-root') as HTMLElement}>
            <DialogContent
              className="w-full max-w-md p-0 h-[50vh] left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2"
            >
              {selectModel !== 'tableData' ? (
                <PickerList
                  data={getDisplayData()}
                  value={value}
                  onConfirm={handleConfirm}
                  onClose={handleClose}
                  disabled={disabled}
                  placeholder={placeholder}
                  multiple={multiple}
                />
              ) : (
                <CascadePickerList
                  data={getDisplayData()}
                  value={value}
                  onConfirm={handleConfirm}
                  onClose={handleClose}
                  onSelect={handleCascadeSelect}
                  disabled={disabled}
                  level={onCascadeSelect ? cascadeLevel : internalLevel}
                  currentPath={onCascadeSelect ? cascadePath : internalPath.map(p => p.value || p.label || '')}
                  onBack={handleCascadeBack}
                  loading={loading}
                  multiple={multiple}
                />
              )}
            </DialogContent>
          </DialogPortal>
        </Dialog>
      </div>
    )
  }
)

MobilePicker.displayName = "MobilePicker"

export { MobilePicker }
