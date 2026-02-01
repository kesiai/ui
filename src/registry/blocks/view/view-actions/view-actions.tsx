import React from 'react'
import { useModelPermission, useModelSave, useModelDelete } from '@airiot/client'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
  Copy,
  ExternalLink
} from 'lucide-react'

interface ViewActionsProps {
  modelId?: string
  itemId?: string
  actions?: Array<'edit' | 'delete' | 'view' | 'export' | 'copy'>
  customActions?: Array<{
    key: string
    label: string
    icon?: React.ReactNode
    onClick?: (itemId: string) => void
    variant?: 'default' | 'destructive'
  }>
  onAction?: (action: string, itemId: string) => void
  triggerVariant?: 'button' | 'dropdown'
  buttonProps?: {
    size?: 'default' | 'sm' | 'lg' | 'icon'
    variant?: 'default' | 'ghost' | 'outline'
  }
  disabled?: boolean
}

const ViewActions: React.FC<ViewActionsProps> = ({
  modelId,
  itemId,
  actions = ['view', 'edit', 'delete'],
  customActions = [],
  onAction,
  triggerVariant = 'dropdown',
  buttonProps = {},
  disabled = false
}) => {
  const { canEdit, canDelete, canView } = useModelPermission()
  const { deleteItem } = useModelDelete()
  const { saveItem } = useModelSave()

  const handleAction = async (actionKey: string) => {
    if (disabled) return

    if (actionKey === 'delete') {
      if (confirm('确定要删除这条数据吗？')) {
        await deleteItem(modelId, itemId)
        onAction?.('delete', itemId)
      }
    } else {
      onAction?.(actionKey, itemId)
    }
  }

  // 默认操作配置
  const defaultActions: Record<string, {
    label: string
    icon: React.ReactNode
    variant?: 'default' | 'destructive'
    visible?: () => boolean
  }> = {
    view: {
      label: '查看',
      icon: <Eye className="h-4 w-4" />
    },
    edit: {
      label: '编辑',
      icon: <Edit className="h-4 w-4" />,
      visible: canEdit
    },
    delete: {
      label: '删除',
      icon: <Trash2 className="h-4 w-4" />,
      variant: 'destructive',
      visible: canDelete
    },
    export: {
      label: '导出',
      icon: <Download className="h-4 w-4" />
    },
    copy: {
      label: '复制',
      icon: <Copy className="h-4 w-4" />
    }
  }

  // 合并所有操作
  const allActions = [...actions, ...customActions.map(a => a.key)]

  // 渲染按钮模式
  if (triggerVariant === 'button') {
    return (
      <div className="flex items-center gap-2">
        {allActions.map((actionKey) => {
          const action = actionKey in defaultActions
            ? defaultActions[actionKey as keyof typeof defaultActions]
            : customActions.find(a => a.key === actionKey)

          if (!action) return null
          if ('visible' in action && !action.visible) return null
          if (disabled) return null

          const variant = action.variant || 'default'

          return (
            <Button
              key={actionKey}
              size={buttonProps.size || 'sm'}
              variant={variant === 'destructive' ? 'destructive' : 'outline'}
              onClick={() => handleAction(actionKey)}
              disabled={disabled}
              {...buttonProps}
            >
              {action.icon}
              {action.label}
            </Button>
          )
        })}
      </div>
    )
  }

  // 渲染下拉菜单模式
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={buttonProps.size || 'icon'}
          className="h-8 w-8 p-0"
          disabled={disabled}
        >
          <span className="sr-only">打开菜单</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {allActions.map((actionKey, index) => {
          const action = actionKey in defaultActions
            ? defaultActions[actionKey as keyof typeof defaultActions]
            : customActions.find(a => a.key === actionKey)

          if (!action) return null
          if ('visible' in action && !action.visible) return null

          return (
            <React.Fragment key={actionKey}>
              <DropdownMenuItem
                onClick={() => handleAction(actionKey)}
                disabled={disabled}
              >
                {action.icon}
                {action.label}
              </DropdownMenuItem>
              {index < allActions.length - 1 && <DropdownMenuSeparator />}
            </React.Fragment>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ViewActions
