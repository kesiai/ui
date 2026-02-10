import React, { useState } from 'react'
import { useModelQuery, useModelFields } from '@airiot/client'
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown, ChevronUp, Plus, Trash2, Filter } from 'lucide-react'
import QueryEditor from './queryEditor'
import { useModel, useModelGetItems, useModelState, useSetModelState } from '@airiot/client'
import _ from 'lodash'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export type FilterFieldType = 'text' | 'number' | 'select' | 'date' | 'date-range'

export interface FilterField {
  name: string
  label: string
  type: FilterFieldType
  options?: { value: string; label: string }[]
  placeholder?: string
}

export interface FilterRule {
  id: string
  field: string
  operator: string
  value: any
  operator2?: string
  value2?: any
}

export type LogicOperator = 'AND' | 'OR'

interface ViewAdvancedFilterProps {
  modelId?: string
  fields?: FilterField[]
  maxRules?: number
  collapsible?: boolean
  defaultCollapsed?: boolean
  showFieldSelector?: boolean
  className?: string
  onFilterChange?: (rules: FilterRule[], logicOperator: LogicOperator) => void
}

const operatorOptions: Record<FilterFieldType, { value: string; label: string }[]> = {
  text: [
    { value: 'contains', label: '包含' },
    { value: 'notContains', label: '不包含' },
    { value: 'eq', label: '等于' },
    { value: 'ne', label: '不等于' },
    { value: 'startsWith', label: '开始于' },
    { value: 'endsWith', label: '结束于' },
    { value: 'empty', label: '为空' },
    { value: 'notEmpty', label: '不为空' },
  ],
  number: [
    { value: 'eq', label: '等于' },
    { value: 'ne', label: '不等于' },
    { value: 'gt', label: '大于' },
    { value: 'gte', label: '大于等于' },
    { value: 'lt', label: '小于' },
    { value: 'lte', label: '小于等于' },
    { value: 'between', label: '介于' },
  ],
  select: [
    { value: 'eq', label: '等于' },
    { value: 'ne', label: '不等于' },
    { value: 'in', label: '属于' },
    { value: 'notIn', label: '不属于' },
  ],
  date: [
    { value: 'eq', label: '等于' },
    { value: 'ne', label: '不等于' },
    { value: 'gt', label: '之后' },
    { value: 'gte', label: '不早于' },
    { value: 'lt', label: '之前' },
    { value: 'lte', label: '不晚于' },
    { value: 'between', label: '介于' },
  ],
  'date-range': [
    { value: 'between', label: '介于' },
    { value: 'notBetween', label: '不在范围' },
  ],
}

const ViewAdvancedFilter: React.FC<ViewAdvancedFilterProps> = ({

}) => {

  const { model } = useModel()
  const setWheres = useSetModelState('wheres')
  const { getItems } = useModelGetItems()

  const viewSchema = model
  if (!viewSchema || !viewSchema.properties) return <span style={{ fontSize: 12 }}>无可配置项</span>

  const onSearch = () => {
    setWheres((w: object) => {
      return { ...w, filter: { name: 'admin' } }
    });
    getItems()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">高级筛选</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[50vw]">
        <DialogHeader>
          <DialogTitle>高级筛选</DialogTitle>
        </DialogHeader>
        <QueryEditor
          schema={_.cloneDeep(viewSchema)}
          input={{ value: [], onChange: () => { } }}
          timeRangeQuery={true}
          unbind={true} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <Button onClick={onSearch} type="submit">搜索</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ViewAdvancedFilter
