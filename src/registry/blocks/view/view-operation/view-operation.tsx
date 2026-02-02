import React, { useState } from 'react'
import { useModelList, useModelDelete, useModelSave } from '@airiot/client'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Loader2, Trash2, Download, Copy, RefreshCw } from 'lucide-react'

interface ViewOperationProps {
  modelId?: string
  operations?: Array<'batch-delete' | 'batch-export' | 'batch-copy' | 'refresh'>
  selectedIds?: string[]
  onSelectionChange?: (selectedIds: string[]) => void
  onOperationComplete?: (operation: string, result: any) => void
  variant?: 'toolbar' | 'dropdown'
  disabled?: boolean
  className?: string
}

const ViewOperation: React.FC<ViewOperationProps> = ({
  modelId,
  operations = ['batch-delete', 'batch-export', 'batch-copy', 'refresh'],
  selectedIds = [],
  onSelectionChange,
  onOperationComplete,
  variant = 'toolbar',
  disabled = false,
  className = ''
}) => {
  const [loading, setLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const { items, refresh } = useModelList()
  const { deleteMany } = useModelDelete()
  const { exportMany } = useModelSave()

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) {
      alert('请先选择要删除的数据')
      return
    }

    setLoading(true)
    try {
      await deleteMany(modelId, selectedIds)
      onOperationComplete?.('batch-delete', { deleted: selectedIds })
      onSelectionChange?.([])
      setDeleteDialogOpen(false)
      refresh?.()
    } finally {
      setLoading(false)
    }
  }

  // 批量导出
  const handleBatchExport = async () => {
    if (selectedIds.length === 0) {
      alert('请先选择要导出的数据')
      return
    }

    setLoading(true)
    try {
      await exportMany(modelId, selectedIds)
      onOperationComplete?.('batch-export', { exported: selectedIds })
    } finally {
      setLoading(false)
    }
  }

  // 批量复制
  const handleBatchCopy = async () => {
    if (selectedIds.length === 0) {
      alert('请先选择要复制的数据')
      return
    }

    setLoading(true)
    try {
      // 模拟批量复制
      onOperationComplete?.('batch-copy', { copied: selectedIds })
    } finally {
      setLoading(false)
    }
  }

  // 刷新数据
  const handleRefresh = () => {
    refresh?.()
  }

  // 操作配置
  const operationConfig: Record<string, {
    label: string
    icon: React.ReactNode
    confirm?: boolean
    confirmMessage?: (count: number) => string
    handler: () => void
  }> = {
    'batch-delete': {
      label: '批量删除',
      icon: <Trash2 className="h-4 w-4" />,
      confirm: true,
      confirmMessage: (count) => `确定要删除选中的 ${count} 条数据吗？此操作不可撤销。`,
      handler: () => setDeleteDialogOpen(true)
    },
    'batch-export': {
      label: '批量导出',
      icon: <Download className="h-4 w-4" />,
      handler: handleBatchExport
    },
    'batch-copy': {
      label: '批量复制',
      icon: <Copy className="h-4 w-4" />,
      handler: handleBatchCopy
    },
    'refresh': {
      label: '刷新',
      icon: <RefreshCw className="h-4 w-4" />,
      handler: handleRefresh
    }
  }

  // 工具栏模式
  if (variant === 'toolbar') {
    return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-2">
        <Checkbox
          checked={selectedIds.length > 0 && selectedIds.length === items}
          onCheckedChange={(checked) => {
            if (checked) {
              // 全选逻辑需要获取所有数据的ID
              onSelectionChange?.([])
            } else {
              onSelectionChange?.([])
            }
          }}
          disabled={disabled}
        />
        <span className="text-sm text-slate-600">
          已选 {selectedIds.length} / {items} 条
        </span>
      </div>

      <div className="flex items-center gap-2">
        {operations.map((op) => {
          const config = operationConfig[op]
          if (!config) return null

          return (
            <Button
              key={op}
              variant="outline"
              size="sm"
              disabled={disabled || loading || selectedIds.length === 0}
              onClick={() => config.handler()}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {config.icon}
              {config.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
  }

  // 下拉菜单模式
  return (
    <>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              {operationConfig['batch-delete']?.confirmMessage?.(selectedIds.length)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleBatchDelete}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-sm text-slate-600">
          已选 {selectedIds.length} 条
        </span>
        {operations.map((op) => {
          const config = operationConfig[op]
          if (!config) return null

          if (config.confirm) {
            return (
              <Button
                key={op}
                variant="outline"
                size="sm"
                disabled={disabled || loading || selectedIds.length === 0}
                onClick={() => config.handler()}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {config.icon}
                {config.label}
              </Button>
            )
          }

          return (
            <Button
              key={op}
              variant="outline"
              size="sm"
              disabled={disabled || loading}
              onClick={() => config.handler()}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {config.icon}
              {config.label}
            </Button>
          )
        })}
      </div>
    </>
  )
}

export default ViewOperation
