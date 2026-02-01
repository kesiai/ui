import React, { useState } from 'react'
import { useModelList, useModelDelete, useModelSave, useModelGet } from '@airiot/client'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Layers, Trash2, Download, Copy, AlertCircle, CheckCircle2 } from 'lucide-react'

export type BatchOperationType = 'batch-delete' | 'batch-export' | 'batch-copy' | 'batch-move' | 'batch-update'

export interface BatchOperation {
  id: BatchOperationType
  label: string
  icon: React.ReactNode
  description: string
  confirmRequired: boolean
  confirmMessage?: string
  danger?: boolean
  params?: BatchOperationParam[]
}

export interface BatchOperationParam {
  name: string
  label: string
  type: 'text' | 'select' | 'checkbox'
  required?: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
  defaultValue?: any
}

export interface BatchOperationResult {
  operation: BatchOperationType
  success: boolean
  totalCount: number
  successCount: number
  failedCount: number
  failedIds?: string[]
  message: string
}

interface ViewBatchOperationProps {
  modelId: string
  operations?: BatchOperationType[]
  selectedIds?: string[]
  totalCount?: number
  variant?: 'toolbar' | 'dropdown'
  disabled?: boolean
  showProgress?: boolean
  className?: string
  onOperationStart?: (operation: BatchOperationType) => void
  onOperationComplete?: (result: BatchOperationResult) => void
  onOperationError?: (error: Error, operation: BatchOperationType) => void
}

const operationDefinitions: Record<BatchOperationType, BatchOperation> = {
  'batch-delete': {
    id: 'batch-delete',
    label: '批量删除',
    icon: <Trash2 className="w-4 h-4" />,
    description: '删除选中的数据',
    confirmRequired: true,
    confirmMessage: '确定要删除选中的数据吗？此操作不可撤销。',
    danger: true,
  },
  'batch-export': {
    id: 'batch-export',
    label: '批量导出',
    icon: <Download className="w-4 h-4" />,
    description: '导出选中的数据',
    confirmRequired: false,
    params: [
      {
        name: 'format',
        label: '导出格式',
        type: 'select',
        required: true,
        options: [
          { value: 'xlsx', label: 'Excel (.xlsx)' },
          { value: 'csv', label: 'CSV (.csv)' },
          { value: 'json', label: 'JSON (.json)' }
        ],
        defaultValue: 'xlsx'
      },
      {
        name: 'includeHeader',
        label: '包含表头',
        type: 'checkbox',
        defaultValue: true
      }
    ]
  },
  'batch-copy': {
    id: 'batch-copy',
    label: '批量复制',
    icon: <Copy className="w-4 h-4" />,
    description: '复制选中的数据',
    confirmRequired: true,
    confirmMessage: '确定要复制选中的数据吗？',
    params: [
      {
        name: 'suffix',
        label: '名称后缀',
        type: 'text',
        placeholder: '副本',
        defaultValue: '副本'
      }
    ]
  },
  'batch-move': {
    id: 'batch-move',
    label: '批量移动',
    icon: <Layers className="w-4 h-4" />,
    description: '移动选中的数据',
    confirmRequired: true,
    confirmMessage: '确定要移动选中的数据吗？',
    params: [
      {
        name: 'targetFolder',
        label: '目标位置',
        type: 'select',
        required: true,
        options: [
          { value: 'folder1', label: '文件夹1' },
          { value: 'folder2', label: '文件夹2' }
        ]
      }
    ]
  },
  'batch-update': {
    id: 'batch-update',
    label: '批量更新',
    icon: <Layers className="w-4 h-4" />,
    description: '批量更新字段值',
    confirmRequired: true,
    confirmMessage: '确定要更新选中的数据吗？',
    params: [
      {
        name: 'field',
        label: '更新字段',
        type: 'select',
        required: true,
        options: [
          { value: 'status', label: '状态' },
          { value: 'category', label: '分类' }
        ]
      },
      {
        name: 'value',
        label: '新值',
        type: 'text',
        required: true,
        placeholder: '请输入新值'
      }
    ]
  }
}

const ViewBatchOperation: React.FC<ViewBatchOperationProps> = ({
  modelId,
  operations = ['batch-delete', 'batch-export', 'batch-copy', 'batch-move', 'batch-update'],
  selectedIds = [],
  totalCount = 0,
  variant = 'toolbar',
  disabled = false,
  showProgress = true,
  className = '',
  onOperationStart,
  onOperationComplete,
  onOperationError,
}) => {
  const { items, refresh } = useModelList()
  const { deleteMany } = useModelDelete()
  const { exportMany } = useModelSave()
  const { copyMany } = useModelGet()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedOperation, setSelectedOperation] = useState<BatchOperation | null>(null)
  const [paramValues, setParamValues] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [result, setResult] = useState<BatchOperationResult | null>(null)
  const [progress, setProgress] = useState(0)

  const enabledOperations = operations
    .map((op) => operationDefinitions[op])
    .filter(Boolean)

  const handleOperationClick = (operation: BatchOperation) => {
    setSelectedOperation(operation)
    const initialValues: Record<string, any> = {}
    operation.params?.forEach((param) => {
      if (param.defaultValue !== undefined) {
        initialValues[param.name] = param.defaultValue
      }
    })
    setParamValues(initialValues)
    setResult(null)

    if (operation.params && operation.params.length > 0) {
      setDialogOpen(true)
    } else if (operation.confirmRequired) {
      setShowConfirm(true)
    } else {
      executeOperation(operation)
    }
  }

  const executeOperation = async (operation: BatchOperation) => {
    if (selectedIds.length === 0) {
      alert('请先选择要操作的数据')
      return
    }

    setLoading(true)
    setProgress(0)
    setResult(null)

    const progressInterval = showProgress ? setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200) : null

    try {
      onOperationStart?.(operation.id)

      let operationResult: BatchOperationResult

      switch (operation.id) {
        case 'batch-delete':
          await deleteMany(modelId, selectedIds)
          operationResult = {
            operation: operation.id,
            success: true,
            totalCount: selectedIds.length,
            successCount: selectedIds.length,
            failedCount: 0,
            message: `成功删除 ${selectedIds.length} 条数据`
          }
          break

        case 'batch-export':
          await exportMany(modelId, selectedIds, paramValues)
          operationResult = {
            operation: operation.id,
            success: true,
            totalCount: selectedIds.length,
            successCount: selectedIds.length,
            failedCount: 0,
            message: `成功导出 ${selectedIds.length} 条数据为 ${paramValues.format || 'xlsx'}`
          }
          break

        case 'batch-copy':
          await copyMany(modelId, selectedIds, paramValues)
          operationResult = {
            operation: operation.id,
            success: true,
            totalCount: selectedIds.length,
            successCount: selectedIds.length,
            failedCount: 0,
            message: `成功复制 ${selectedIds.length} 条数据`
          }
          break

        case 'batch-move':
        case 'batch-update':
          await saveItem(modelId, {
            ids: selectedIds,
            operation: operation.id,
            params: paramValues
          })
          operationResult = {
            operation: operation.id,
            success: true,
            totalCount: selectedIds.length,
            successCount: selectedIds.length,
            failedCount: 0,
            message: `成功${operation.label} ${selectedIds.length} 条数据`
          }
          break

        default:
          throw new Error('未知操作类型')
      }

      setResult(operationResult)
      onOperationComplete?.(operationResult)
      refresh()

      clearInterval(progressInterval!)
      setProgress(100)

      setTimeout(() => {
        handleClose()
      }, 1500)
    } catch (error) {
      clearInterval(progressInterval!)
      const err = error as Error
      onOperationError?.(err, operation.id)
      setResult({
        operation: operation.id,
        success: false,
        totalCount: selectedIds.length,
        successCount: 0,
        failedCount: selectedIds.length,
        failedIds: selectedIds,
        message: err.message || `${operation.label}失败`
      })
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = () => {
    if (selectedOperation) {
      executeOperation(selectedOperation)
      setShowConfirm(false)
    }
  }

  const handleExecute = () => {
    if (selectedOperation) {
      if (selectedOperation.confirmRequired) {
        setShowConfirm(true)
        setDialogOpen(false)
      } else {
        executeOperation(selectedOperation)
      }
    }
  }

  const handleClose = () => {
    setDialogOpen(false)
    setShowConfirm(false)
    setSelectedOperation(null)
    setParamValues({})
    setResult(null)
    setProgress(0)
  }

  const renderParamInput = (param: BatchOperationParam) => {
    const value = paramValues[param.name] || param.defaultValue || ''

    switch (param.type) {
      case 'checkbox':
        return (
          <div key={param.name} className="flex items-center space-x-2">
            <Checkbox
              id={param.name}
              checked={value}
              onCheckedChange={(checked) => setParamValues(prev => ({ ...prev, [param.name]: checked }))}
            />
            <Label htmlFor={param.name} className="cursor-pointer">
              {param.label}
            </Label>
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
              onValueChange={(v) => setParamValues(prev => ({ ...prev, [param.name]: v }))}
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

      default:
        return (
          <div key={param.name} className="space-y-2">
            <Label htmlFor={param.name}>
              {param.label}
              {param.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={param.name}
              value={value}
              onChange={(e) => setParamValues(prev => ({ ...prev, [param.name]: e.target.value }))}
              placeholder={param.placeholder}
            />
          </div>
        )
    }
  }

  if (variant === 'dropdown') {
    return (
      <>
        <Select onValueChange={(value) => handleOperationClick(operationDefinitions[value as BatchOperationType])}>
          <SelectTrigger className={`w-[200px] ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={disabled}>
            <SelectValue placeholder="批量操作" />
          </SelectTrigger>
          <SelectContent>
            {enabledOperations.map((op) => (
              <SelectItem key={op.id} value={op.id}>
                <div className="flex items-center gap-2">
                  {op.icon}
                  {op.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedOperation?.icon}
                {selectedOperation?.label}
              </DialogTitle>
              <DialogDescription>
                已选择 <Badge variant="secondary">{selectedIds.length}</Badge> 项数据
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {selectedOperation?.params && selectedOperation.params.map((param) => renderParamInput(param))}

              {showProgress && loading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>处理进度</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}

              {result && (
                <div className={`p-3 rounded-lg ${
                  result.success
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  <div className="flex items-center gap-2 font-medium">
                    {result.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {result.message}
                  </div>
                  {result.totalCount > 0 && (
                    <div className="text-xs mt-1">
                      成功: {result.successCount} | 失败: {result.failedCount}
                    </div>
                  )}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose} disabled={loading}>
                取消
              </Button>
              <Button onClick={handleExecute} disabled={loading}>
                {loading ? '处理中...' : '确定'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {selectedOperation && selectedOperation.confirmRequired && (
          <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  确认{selectedOperation.label}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {selectedOperation.confirmMessage || `确定要对 ${selectedIds.length} 项数据执行此操作吗？`}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={loading}>取消</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirm} disabled={loading}>
                  确认
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </>
    )
  }

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        {selectedIds.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            已选 {selectedIds.length} 项
          </Badge>
        )}
        <div className="flex gap-2">
          {enabledOperations.map((op) => (
            <Button
              key={op.id}
              variant={op.danger ? 'destructive' : 'outline'}
              size="sm"
              disabled={disabled || selectedIds.length === 0}
              onClick={() => handleOperationClick(op)}
            >
              {op.icon}
              {op.label}
            </Button>
          ))}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedOperation?.icon}
              {selectedOperation?.label}
            </DialogTitle>
            <DialogDescription>
              已选择 <Badge variant="secondary">{selectedIds.length}</Badge> 项数据
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedOperation?.params && selectedOperation.params.map((param) => renderParamInput(param))}

            {showProgress && loading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>处理进度</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            {result && (
              <div className={`p-3 rounded-lg ${
                result.success
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <div className="flex items-center gap-2 font-medium">
                  {result.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {result.message}
                </div>
                {result.totalCount > 0 && (
                  <div className="text-xs mt-1">
                    成功: {result.successCount} | 失败: {result.failedCount}
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              取消
            </Button>
            <Button onClick={handleExecute} disabled={loading}>
              {loading ? '处理中...' : '确定'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedOperation && selectedOperation.confirmRequired && (
        <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                确认{selectedOperation.label}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {selectedOperation.confirmMessage || `确定要对 ${selectedIds.length} 项数据执行此操作吗？`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={loading}>取消</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm} disabled={loading}>
                确认
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}

export default ViewBatchOperation
