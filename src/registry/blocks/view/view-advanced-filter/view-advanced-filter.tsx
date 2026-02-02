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
  modelId,
  fields = [],
  maxRules = 10,
  collapsible = true,
  defaultCollapsed = false,
  showFieldSelector = true,
  className = '',
  onFilterChange,
}) => {
  const { filters, setFilters, doFilter } = useModelQuery()
  const { getFields } = useModelFields()

  const [rules, setRules] = useState<FilterRule[]>([])
  const [logicOperator, setLogicOperator] = useState<LogicOperator>('AND')
  const [open, setOpen] = useState(!defaultCollapsed)
  const [modelFields, setModelFields] = useState<FilterField[]>(fields)

  React.useEffect(() => {
    if (modelId && fields.length === 0) {
      const loadFields = async () => {
        const schema = await getFields(modelId)
        if (schema) {
          const convertedFields: FilterField[] = schema.map((field: any) => ({
            name: field.name,
            label: field.label || field.name,
            type: field.type || 'text',
            options: field.options,
          }))
          setModelFields(convertedFields)
        }
      }
      loadFields()
    }
  }, [modelId, fields, getFields])

  const addRule = () => {
    if (rules.length >= maxRules) return
    const newRule: FilterRule = {
      id: `rule-${Date.now()}`,
      field: modelFields[0]?.name || '',
      operator: 'eq',
      value: '',
    }
    setRules([...rules, newRule])
  }

  const removeRule = (id: string) => {
    setRules(rules.filter((rule) => rule.id !== id))
  }

  const updateRule = (id: string, updates: Partial<FilterRule>) => {
    setRules(rules.map((rule) => (rule.id === id ? { ...rule, ...updates } : rule)))
  }

  const applyFilter = () => {
    const validRules = rules.filter((rule) => rule.field && rule.operator)
    setFilters({ rules: validRules, logicOperator })
    doFilter()
    onFilterChange?.(validRules, logicOperator)
  }

  const resetFilter = () => {
    setRules([])
    setFilters({})
    doFilter()
  }

  const getFieldType = (fieldName: string): FilterFieldType => {
    const field = modelFields.find((f) => f.name === fieldName)
    return field?.type || 'text'
  }

  const renderValueInput = (rule: FilterRule) => {
    const fieldType = getFieldType(rule.field)
    const field = modelFields.find((f) => f.name === rule.field)

    if (rule.operator === 'empty' || rule.operator === 'notEmpty') {
      return null
    }

    if (rule.operator === 'between' || rule.operator === 'notBetween') {
      return (
        <div className="flex gap-2">
          <Input
            type={fieldType === 'number' ? 'number' : fieldType === 'date' || fieldType === 'date-range' ? 'date' : 'text'}
            value={rule.value || ''}
            onChange={(e) => updateRule(rule.id, { value: e.target.value })}
            placeholder="起始值"
            className="h-8"
          />
          <Input
            type={fieldType === 'number' ? 'number' : fieldType === 'date' || fieldType === 'date-range' ? 'date' : 'text'}
            value={rule.value2 || ''}
            onChange={(e) => updateRule(rule.id, { value2: e.target.value })}
            placeholder="结束值"
            className="h-8"
          />
        </div>
      )
    }

    if (fieldType === 'select' && field?.options) {
      return (
        <Select
          value={rule.value || ''}
          onValueChange={(value) => updateRule(rule.id, { value })}
        >
          <SelectTrigger className="h-8">
            <SelectValue placeholder="选择值" />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    return (
      <Input
        type={fieldType === 'number' ? 'number' : fieldType === 'date' || fieldType === 'date-range' ? 'date' : 'text'}
        value={rule.value || ''}
        onChange={(e) => updateRule(rule.id, { value: e.target.value })}
        placeholder={field?.placeholder || '输入值'}
        className="h-8"
      />
    )
  }

  const content = (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="w-4 h-4" />
            高级筛选
          </CardTitle>
          <div className="flex items-center gap-2">
            {rules.length > 0 && (
              <Badge variant="secondary">{rules.length} 条规则</Badge>
            )}
            <Select value={logicOperator} onValueChange={(v: LogicOperator) => setLogicOperator(v)}>
              <SelectTrigger className="h-8 w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AND">AND</SelectItem>
                <SelectItem value="OR">OR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {rules.length === 0 ? (
          <div className="text-center text-sm text-slate-500 py-4">
            点击下方按钮添加筛选规则
          </div>
        ) : (
          <div className="space-y-3">
            {rules.map((rule) => {
              const fieldType = getFieldType(rule.field)
              const operators = operatorOptions[fieldType] || operatorOptions.text

              return (
                <div key={rule.id} className="flex gap-2 items-start">
                  {showFieldSelector && (
                    <Select
                      value={rule.field}
                      onValueChange={(value) => updateRule(rule.id, { field: value, operator: 'eq', value: '', value2: '' })}
                    >
                      <SelectTrigger className="h-8 w-32">
                        <SelectValue placeholder="选择字段" />
                      </SelectTrigger>
                      <SelectContent>
                        {modelFields.map((field) => (
                          <SelectItem key={field.name} value={field.name}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  <Select
                    value={rule.operator}
                    onValueChange={(value) => updateRule(rule.id, { operator: value, value: '', value2: '' })}
                  >
                    <SelectTrigger className="h-8 w-32">
                      <SelectValue placeholder="操作符" />
                    </SelectTrigger>
                    <SelectContent>
                      {operators.map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex-1">
                    {renderValueInput(rule)}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeRule(rule.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            onClick={addRule}
            disabled={rules.length >= maxRules}
            className="flex-1"
          >
            <Plus className="w-4 h-4 mr-1" />
            添加规则
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={resetFilter}
            disabled={rules.length === 0}
          >
            重置
          </Button>
          <Button
            size="sm"
            onClick={applyFilter}
            disabled={rules.length === 0}
          >
            应用筛选
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  if (collapsible) {
    return (
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full mb-2">
            {open ? (
              <>
                <ChevronUp className="w-4 h-4 mr-2" />
                收起高级筛选
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-2" />
                展开高级筛选
                {rules.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {rules.length}
                  </Badge>
                )}
              </>
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {content}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return content
}

export default ViewAdvancedFilter
