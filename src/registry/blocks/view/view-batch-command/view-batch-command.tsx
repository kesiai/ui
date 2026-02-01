import React, { useState } from 'react'
import { useModelList, useModelSave } from '@airiot/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Terminal, Play, AlertCircle } from 'lucide-react'

export interface Command {
  id: string
  name: string
  label: string
  type: 'script' | 'api' | 'custom'
  description?: string
  confirmRequired?: boolean
  confirmMessage?: string
  params?: CommandParam[]
}

export interface CommandParam {
  name: string
  label: string
  type: 'text' | 'number' | 'select' | 'textarea'
  required?: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
  defaultValue?: any
}

export interface CommandResult {
  commandId: string
  success: boolean
  affectedCount: number
  message: string
  data?: any
}

interface ViewBatchCommandProps {
  modelId: string
  commands: Command[]
  selectedIds?: string[]
  triggerVariant?: 'button' | 'dropdown'
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>
  disabled?: boolean
  className?: string
  onCommandStart?: (command: Command) => void
  onCommandComplete?: (result: CommandResult) => void
  onCommandError?: (error: Error, command: Command) => void
}

const ViewBatchCommand: React.FC<ViewBatchCommandProps> = ({
  modelId,
  commands,
  selectedIds = [],
  triggerVariant = 'button',
  buttonProps = {},
  disabled = false,
  className = '',
  onCommandStart,
  onCommandComplete,
  onCommandError,
}) => {
  const { items } = useModelList()
  const { saveItem } = useModelSave()

  const [open, setOpen] = useState(false)
  const [selectedCommand, setSelectedCommand] = useState<Command | null>(null)
  const [paramValues, setParamValues] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [result, setResult] = useState<CommandResult | null>(null)

  const handleCommandSelect = (commandId: string) => {
    const command = commands.find((c) => c.id === commandId)
    if (command) {
      setSelectedCommand(command)
      const initialValues: Record<string, any> = {}
      command.params?.forEach((param) => {
        if (param.defaultValue !== undefined) {
          initialValues[param.name] = param.defaultValue
        }
      })
      setParamValues(initialValues)
      setOpen(true)
    }
  }

  const handleParamChange = (paramName: string, value: any) => {
    setParamValues((prev) => ({
      ...prev,
      [paramName]: value,
    }))
  }

  const handleExecute = async () => {
    if (!selectedCommand || selectedIds.length === 0) return

    if (selectedCommand.confirmRequired && !showConfirm) {
      setShowConfirm(true)
      return
    }

    setLoading(true)
    setResult(null)

    try {
      onCommandStart?.(selectedCommand)

      const commandData = {
        command: selectedCommand.name,
        modelId,
        targetIds: selectedIds,
        params: paramValues,
      }

      await saveItem(modelId, commandData)

      const commandResult: CommandResult = {
        commandId: selectedCommand.id,
        success: true,
        affectedCount: selectedIds.length,
        message: `命令 ${selectedCommand.label} 执行成功`,
      }

      setResult(commandResult)
      onCommandComplete?.(commandResult)

      if (selectedCommand.confirmRequired) {
        setShowConfirm(false)
      }

      setTimeout(() => {
        setOpen(false)
        setSelectedCommand(null)
        setParamValues({})
        setResult(null)
      }, 1500)
    } catch (error) {
      const err = error as Error
      onCommandError?.(err, selectedCommand)
      setResult({
        commandId: selectedCommand.id,
        success: false,
        affectedCount: 0,
        message: err.message || '命令执行失败',
      })
    } finally {
      setLoading(false)
    }
  }

  const renderParamInput = (param: CommandParam) => {
    const value = paramValues[param.name] || ''

    switch (param.type) {
      case 'textarea':
        return (
          <div key={param.name} className="space-y-2">
            <Label htmlFor={param.name}>
              {param.label}
              {param.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={param.name}
              value={value}
              onChange={(e) => handleParamChange(param.name, e.target.value)}
              placeholder={param.placeholder}
              rows={3}
            />
          </div>
        )

      case 'select':
        return (
          <div key={param.name} className="space-y-2">
            <Label htmlFor={param.name}>
              {param.label}
              {param.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={value}
              onValueChange={(v) => handleParamChange(param.name, v)}
            >
              <SelectTrigger id={param.name}>
                <SelectValue placeholder={param.placeholder || '请选择'} />
              </SelectTrigger>
              <SelectContent>
                {param.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      case 'number':
        return (
          <div key={param.name} className="space-y-2">
            <Label htmlFor={param.name}>
              {param.label}
              {param.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={param.name}
              type="number"
              value={value}
              onChange={(e) => handleParamChange(param.name, parseFloat(e.target.value) || 0)}
              placeholder={param.placeholder}
            />
          </div>
        )

      default:
        return (
          <div key={param.name} className="space-y-2">
            <Label htmlFor={param.name}>
              {param.label}
              {param.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={param.name}
              type="text"
              value={value}
              onChange={(e) => handleParamChange(param.name, e.target.value)}
              placeholder={param.placeholder}
            />
          </div>
        )
    }
  }

  const trigger = (
    <DialogTrigger asChild>
      <Button
        variant={triggerVariant === 'button' ? 'default' : 'outline'}
        disabled={disabled || selectedIds.length === 0}
        className={className}
        {...buttonProps}
      >
        <Terminal className="w-4 h-4 mr-2" />
        批量命令
        {selectedIds.length > 0 && (
          <Badge variant="secondary" className="ml-2">
            {selectedIds.length}
          </Badge>
        )}
      </Button>
    </DialogTrigger>
  )

  return (
    <>
      <Dialog open={open && !showConfirm} onOpenChange={setOpen}>
        {trigger}
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              批量执行命令
            </DialogTitle>
            <DialogDescription>
              已选择 <Badge variant="secondary">{selectedIds.length}</Badge> 项数据
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {!selectedCommand ? (
              <div className="space-y-2">
                <Label>选择命令</Label>
                <div className="grid gap-2">
                  {commands.map((command) => (
                    <Button
                      key={command.id}
                      variant="outline"
                      className="justify-start h-auto p-3"
                      onClick={() => handleCommandSelect(command.id)}
                    >
                      <div className="text-left">
                        <div className="font-medium">{command.label}</div>
                        {command.description && (
                          <div className="text-xs text-slate-500 mt-1">
                            {command.description}
                          </div>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{selectedCommand.label}</h4>
                    {selectedCommand.description && (
                      <p className="text-xs text-slate-500 mt-1">
                        {selectedCommand.description}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCommand(null)
                      setParamValues({})
                      setResult(null)
                    }}
                  >
                    返回
                  </Button>
                </div>

                {selectedCommand.params && selectedCommand.params.length > 0 ? (
                  <div className="space-y-3">
                    <Label>命令参数</Label>
                    {selectedCommand.params.map((param) => renderParamInput(param))}
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded">
                    此命令无需参数配置
                  </div>
                )}

                {result && (
                  <div
                    className={`p-3 rounded-lg ${
                      result.success
                        ? 'bg-green-50 border border-green-200 text-green-800'
                        : 'bg-red-50 border border-red-200 text-red-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-medium">
                      {result.success ? '✓' : '✗'} {result.message}
                    </div>
                    <div className="text-xs mt-1">
                      影响数据: {result.affectedCount} 条
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            {selectedCommand && (
              <>
                <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                  取消
                </Button>
                <Button onClick={handleExecute} disabled={loading || selectedIds.length === 0}>
                  {loading ? (
                    <>执行中...</>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      执行命令
                    </>
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedCommand && selectedCommand.confirmRequired && (
        <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                确认执行命令
              </AlertDialogTitle>
              <AlertDialogDescription>
                {selectedCommand.confirmMessage ||
                  `确定要对 ${selectedIds.length} 项数据执行命令 "${selectedCommand.label}" 吗？此操作可能不可撤销。`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={loading}>取消</AlertDialogCancel>
              <AlertDialogAction onClick={handleExecute} disabled={loading}>
                确认执行
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}

export default ViewBatchCommand
