import * as React from 'react'
import { AlertTriangle, Check, Loader2, Pencil, X } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import type { BaseFormFieldProps } from '@/registry/lib/base-form-props'
import { cn } from '@/lib/utils'

export interface IdChangeFieldProps extends Omit<BaseFormFieldProps, 'value'> {
  value?: string
  disabled?: boolean
  placeholder?: string
  /** 解锁后的红字提示（默认为记录级文案；表级用 createIdChangeField 定制） */
  hintText?: string
  /** 二次确认弹窗的警示描述（默认为记录级文案） */
  confirmDescription?: string
  /**
   * 点 ✓ 单独保存新标识（直接调 change 接口，不走对话框底部的通用保存）：由调用方执行。
   * 后端实测 change 只读 body.id、不碰其他字段，因此标识修改可独立成一次保存。
   * 未提供时 ✓ 退化为还原锁定（正常接线不会出现）。
   */
  onApplyId?: (newId: string) => Promise<void>
  [key: string]: any
}

/** 记录级默认警示文案 */
const DEFAULT_HINT = '标识修改模式：输入新标识后点 ✓ 单独保存（等同删除重建，其它数据对它的引用不迁移，不可恢复）；不点则不保存标识'
const DEFAULT_CONFIRM = '修改标识是等同删除重建的特殊操作：确认后解锁输入，输入新标识后点 ✓ 将单独调用标识修改接口立即生效（本条数据保留，但其它数据对它的引用——关联字段、时序数据、设备配置等——不会自动迁移），且操作不可恢复。'

/**
 * 标识（id）字段控件：默认只读 + 尾部编辑（✎）按钮。
 *
 * 交互流：✎ → 二次确认（危险提示）→ 解锁输入、按钮变保存（✓）→ 输入新标识 →
 * 点 ✓ 单独调 change 接口立即生效（不点不存；后端实测 change 只读 body.id、
 * 其余字段忽略）→ 成功后以新标识为基线重新锁定；✕ 取消并恢复原标识。
 * 对话框底部的通用保存与 id 无关：调用方通过 onApplyId 执行 change 并更新当前生效 id，
 * 通用保存始终以该 id 提交（id 改过之后用新 id，确保落在改名后的记录上）。
 *
 * 仅用于编辑态（新建流程 id 本就可填，不接此控件）。
 * 表（schema）级场景用 createIdChangeField 定制更强的警示文案（表下记录将失联）。
 * 通常经 SchemaForm 的 schameConvert 拦截 id 字段接入（'*' 通配展开项同样会经过）。
 */
export const IdChangeField = React.forwardRef<HTMLInputElement, IdChangeFieldProps>(
  ({ value, onChange, onBlur, name, id, disabled, placeholder, hintText, confirmDescription, onApplyId }, ref) => {
    const [unlocked, setUnlocked] = React.useState(false)
    const [confirmOpen, setConfirmOpen] = React.useState(false)
    const [applying, setApplying] = React.useState(false)
    // 当前生效标识的基线（挂载首帧的原标识；应用成功后更新为新标识），供还原/变更判断
    const initialValueRef = React.useRef(value)

    // 取消并锁定：恢复基线标识值（RHF 的 onChange 兼容事件对象形态）
    const handleRelock = () => {
      onChange?.({ target: { value: initialValueRef.current } } as any)
      setUnlocked(false)
    }

    // ✓ 保存：单独保存新标识（值未变/为空时仅切回锁定，不调接口）
    const handleApply = async () => {
      const newId = String(value ?? '').trim()
      if (!newId || newId === initialValueRef.current || !onApplyId) {
        handleRelock()
        return
      }
      setApplying(true)
      try {
        await onApplyId(newId)
        initialValueRef.current = newId
        setUnlocked(false)
      } catch (error: any) {
        toast.error('标识修改失败', {
          description: error?.json?.message || error?.json?._error || error?.message,
        })
      } finally {
        setApplying(false)
      }
    }

    return (
      <>
        <div className="flex items-center gap-2">
          <Input
            ref={ref}
            id={id}
            name={name}
            value={value ?? ''}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            placeholder={placeholder}
            readOnly={!unlocked}
            aria-readonly={!unlocked}
            className={cn('h-10 px-3 py-2 font-mono flex-1 min-w-0',
              !unlocked && 'text-muted-foreground bg-muted/50 cursor-default',
              unlocked && 'border-destructive text-destructive focus-visible:ring-destructive')}
          />
          {unlocked ? (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-destructive hover:text-destructive"
                      disabled={disabled || applying}
                      onClick={handleApply}
                    >
                      {applying
                        ? <Loader2 className="h-5 w-5 animate-spin" />
                        : <Check className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>单独保存新标识（调修改接口，不影响底部保存）</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      disabled={disabled || applying}
                      onClick={handleRelock}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>取消修改并恢复原标识</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    disabled={disabled}
                    onClick={() => setConfirmOpen(true)}
                  >
                    <Pencil className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>修改标识</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        {unlocked && (
          <p className="text-xs text-destructive mt-1">
            {hintText ?? DEFAULT_HINT}
          </p>
        )}
        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                确定要修改标识吗？
              </AlertDialogTitle>
              <AlertDialogDescription>
                {confirmDescription ?? DEFAULT_CONFIRM}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={applying}>取消</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setUnlocked(true)
                }}
              >
                解锁修改
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  },
)
IdChangeField.displayName = 'IdChangeField'

/**
 * 按上下文定制警示文案 / 单独保存回调的 IdChangeField 工厂（schameConvert 只能返回
 * 组件、无法逐字段传 props，表级警示与 onApplyId 用工厂固化）。在调用方 useMemo 中
 * 调用一次以保证组件引用稳定；onApplyId 建议转发到 ref 持有的最新闭包，避免工厂
 * 重建导致表单控件重挂载。
 */
export const createIdChangeField = (options: {
  hintText?: string
  confirmDescription?: string
  onApplyId?: (newId: string) => Promise<void>
}) => {
  const Comp = React.forwardRef<HTMLInputElement, IdChangeFieldProps>((props, ref) => (
    <IdChangeField ref={ref} {...options} {...props} />
  ))
  Comp.displayName = 'IdChangeField'
  return Comp
}
