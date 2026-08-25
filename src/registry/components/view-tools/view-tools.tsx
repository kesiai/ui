import React, { useState } from 'react'
import { useModelCount, useModelPageSize, useModelFields, useModel, useModelState } from '@kesi/client'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Columns3 } from 'lucide-react'
import { Label } from '@/components/ui/label'

// ==================== CountTool Component ====================

interface CountToolProps {
  className?: string
}

export const CountTool: React.FC<CountToolProps> = ({ className }) => {
  const { count } = useModelCount()

  return (
    <Button variant="ghost" size="sm" className={className}>
      {count} 条记录
    </Button>
  )
}

// ==================== PageSizeTool Component ====================

interface PageSizeToolProps {
  className?: string
}

export const PageSizeTool: React.FC<PageSizeToolProps> = ({ className }) => {
  const { sizes, setPageSize, size } = useModelPageSize()
  const [inputSize, setInputSize] = useState('')
  const [open, setOpen] = useState(false)

  const handleSetPageSize = (newSize: number) => {
    setPageSize(newSize)
    setOpen(false)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newSize = parseInt(inputSize)
      if (!isNaN(newSize) && newSize > 0) {
        handleSetPageSize(newSize)
        setInputSize('')
      }
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={className}>
          每页 {size} 条
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {sizes.map((s) => (
          <DropdownMenuItem
            key={`size-${s}`}
            onClick={() => handleSetPageSize(s)}
          >
            每页 {s} 条
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <div className="p-2">
          <Input
            placeholder="自定义每页条数"
            type="number"
            value={inputSize}
            onChange={(e) => setInputSize(e.target.value)}
            onKeyDown={handleInputKeyDown}
            min={1}
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ==================== ColumnsToolContent Component ====================

const ColumnsToolContent: React.FC = () => {
  const { model } = useModel()
  const { fields } = useModelFields()
  // fields atom 兼容两种形态：字符串（旧 schema）| 对象（新 schema tableSchema 项 {key, width...}）
  const [selectedFields, setFields] = useModelState<any[]>('fields')

  const showFields = Object.keys(fields).filter(
    (name) => fields[name].showInList !== false
  )
  const menuShow = showFields.length <= 10

  const keyOf = (f: any) => (typeof f === 'string' ? f : f?.key)
  const selectedKeys = (selectedFields || []).map(keyOf).filter(Boolean)

  const handleToggle = (fieldName: string, checked: boolean) => {
    const next = [...(selectedFields || [])]
    const index = next.findIndex((f: any) => keyOf(f) === fieldName)
    if (checked && index === -1) {
      // 补回完整 tableSchema 项（保留 width/canOrder 配置），找不到才落字符串
      const item = (model?.tableSchema || []).find((f: any) => keyOf(f) === fieldName) ?? fieldName
      next.push(item)
    } else if (!checked && index !== -1) {
      next.splice(index, 1)
    }
    setFields(next)
  }

  const items = showFields.map((name) => {
    const field = fields[name]
    const title = field.title || field.label || name
    const fieldSelected = selectedKeys.includes(name)

    return (
      <div key={name} className="flex items-center space-x-2">
        <Checkbox
          id={`col-checkbox-${name}`}
          checked={fieldSelected}
          onCheckedChange={(checked) => handleToggle(name, checked as boolean)}
        />
        <Label
          htmlFor={`col-checkbox-${name}`}
          className="cursor-pointer text-sm font-normal"
        >
          {title}
        </Label>
      </div>
    )
  })

  return (
    <div className={menuShow ? 'flex flex-col gap-y-2' : 'grid grid-cols-4 gap-2'}>
      {items}
    </div>
  )
}

// ==================== ColumnsTool Component ====================

interface ColumnsToolProps {
  className?: string
}

export const ColumnsTool: React.FC<ColumnsToolProps> = ({ className }) => {
  const [open, setOpen] = useState(false)
  const { fields } = useModelFields()

  const showFields = Object.keys(fields).filter(
    (name) => fields[name].showInList !== false
  )
  const menuShow = showFields.length <= 10

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className={className}>
          <Columns3 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={menuShow ? 'w-auto p-4' : 'w-150 p-4'}
        align="end"
      >
        <ColumnsToolContent />
      </PopoverContent>
    </Popover>
  )
}

// ==================== Tools Container Component ====================

export type ToolType = 'count' | 'pageSize' | 'columns'

interface ToolsProps {
  tools?: ToolType[]
  className?: string
  children?: React.ReactNode
}

export const Tools: React.FC<ToolsProps> = ({
  tools = ['count', 'pageSize', 'columns'],
  className,
  children
}) => {
  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      {tools.includes('count') && <CountTool />}
      {tools.includes('pageSize') && <PageSizeTool />}
      {tools.includes('columns') && <ColumnsTool />}
      {children}
    </div>
  )
}
