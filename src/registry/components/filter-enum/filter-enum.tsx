import { useState } from 'react'
import _ from 'lodash'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const FilterEnum = (props: any) => {
  const { value, onChange, ...field } = props
  const placeholder = field && field.placeholder
  const titleMap = field && field.titleMap
  const [open, setOpen] = useState(false)

  // 初始化选中的值
  let selected: string[] = []
  if (value && value != '') {
    if (_.isString(value)) selected = [value]
    if (_.isObject(value)) selected = (value as { $in?: string[] }).$in || []
  }
  const [selectedValues, setSelectedValues] = useState<string[]>(selected)

  const handleToggle = (itemValue: string) => {
    const newValues = selectedValues.includes(itemValue)
      ? selectedValues.filter(v => v !== itemValue)
      : [...selectedValues, itemValue]
    setSelectedValues(newValues)

    // 更新父组件的值
    let v = null
    if (newValues.length > 1) {
      v = { $in: newValues }
    } else if (newValues.length > 0) {
      v = newValues[0]
    }
    onChange(v)
  }

  const handleClear = () => {
    setSelectedValues([])
    onChange(null)
  }

  const getSelectedNames = () => {
    return titleMap
      ?.filter((item: any) => selectedValues.includes(item.value))
      .map((item: any) => item.name) || []
  }

  const selectedNames = getSelectedNames()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            selectedValues.length === 0 && "text-muted-foreground"
          )}
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {selectedNames.length > 0 ? (
              selectedNames.map((name: string, index: number) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {name}
                </Badge>
              ))
            ) : (
              <span>{placeholder || '请选择'}</span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50 ml-2 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-2" align="start">
        <div className="space-y-1">
          {titleMap && titleMap.length > 0 ? (
            titleMap.map((item: any) => {
              const isSelected = selectedValues.includes(item.value)
              return (
                <div
                  key={item.value}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded-sm cursor-pointer hover:bg-accent transition-colors",
                    isSelected && "bg-accent"
                  )}
                  onClick={() => handleToggle(item.value)}
                >
                  <Checkbox
                    checked={isSelected}
                    onChange={() => {}}
                  />
                  <span className="flex-1">{item.name}</span>
                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                </div>
              )
            })
          ) : (
            <div className="text-sm text-muted-foreground py-2">暂无选项</div>
          )}
        </div>
        {selectedValues.length > 0 && (
          <div className="mt-2 pt-2 border-t flex justify-end">
            <button
              type="button"
              onClick={handleClear}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              清空
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

FilterEnum.displayName = "FilterEnum"

export { FilterEnum }
