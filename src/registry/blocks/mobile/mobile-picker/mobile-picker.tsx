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
}

const PickerList: React.FC<PickerListProps> = ({
  data,
  value,
  onConfirm,
  onClose,
  disabled = false,
  placeholder = "请选择"
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b">
        <Button variant="ghost" size="sm" onClick={onClose}>
          取消
        </Button>
        <div className="text-sm text-gray-500">{placeholder}</div>
        <Button variant="ghost" size="sm" onClick={() => onConfirm(value)}>
          确定
        </Button>
      </div>
      <div className="flex-1 overflow-auto">
        {data.map((item) => (
          <div
            key={String(item.value)}
            className={cn(
              "flex items-center justify-between px-4 py-3 border-b cursor-pointer",
              disabled && "opacity-50 cursor-not-allowed",
              value === item.value && "bg-blue-50"
            )}
            onClick={() => !disabled && onConfirm(item.value)}
          >
            <span className="text-sm">{item.label || item.title}</span>
            {value === item.value && <Check className="h-4 w-4 text-blue-500" />}
          </div>
        ))}
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
  loading = false
}) => {
  const [selectedValue, setSelectedValue] = React.useState<string | undefined>(value)

  const handleItemClick = (item: PickerOption) => {
    setSelectedValue(String(item.value))
    if (item.isLeaf || (!item.children?.length && !item.child?.length)) {
      onConfirm(item.value)
    } else {
      onSelect(item)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-2">
          {level > 0 && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onClose}>
            取消
          </Button>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onConfirm(selectedValue)}>
          确定
        </Button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          {data.map((item) => (
            <div
              key={String(item.value)}
              className={cn(
                "flex items-center justify-between px-4 py-3 border-b cursor-pointer",
                disabled && "opacity-50 cursor-not-allowed",
                selectedValue === String(item.value) && "bg-blue-50"
              )}
              onClick={() => !disabled && handleItemClick(item)}
            >
              <span className="text-sm">{item.label || item.title}</span>
              <div className="flex items-center gap-2">
                {(item.child?.length || item.children?.length) && (
                  <div className="text-gray-400 text-xs">›</div>
                )}
                {selectedValue === String(item.value) && <Check className="h-4 w-4 text-blue-500" />}
              </div>
            </div>
          ))}
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

    // 打开选择器
    const handleOpen = () => {
      if (!disabled && !dashboardMode) {
        setVisible(true)
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

    // 级联选择
    const handleCascadeSelect = (item: PickerOption) => {
      onCascadeSelect?.(item)
    }

    // 获取显示文本
    const getDisplayText = () => {
      if (value) {
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
        return treeData
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
              />
            ) : (
              <CascadePickerList
                data={getDisplayData()}
                value={value}
                onConfirm={handleConfirm}
                onClose={handleClose}
                onSelect={handleCascadeSelect}
                disabled={disabled}
                level={cascadeLevel}
                currentPath={cascadePath}
                onBack={onCascadeBack || (() => {})}
                loading={loading}
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
