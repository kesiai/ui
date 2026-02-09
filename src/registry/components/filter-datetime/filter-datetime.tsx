import _ from 'lodash'
import { format } from 'date-fns'
import { FormDate } from '@/registry/components/form-date/form-date'

const FilterDateRange = (props: any) => {

  const datetimeFormat = props.datetimeFormat || 'YYYY-MM-DD HH:mm:ss'
  // 将 moment 格式转换为 date-fns 格式
  const dateFormat = datetimeFormat.replace('YYYY', 'yyyy').replace('DD', 'dd')

  const onChange = (fieldKey: 'gte' | 'lte', newValue: Date | null) => {
    const { onChange, value } = props
    onChange({
      ...value,
      [fieldKey]: newValue ? format(newValue, dateFormat) : null,
      rule: 'range'
    })
  }

  const handleStartChange = (value: string) => {
    const date = value ? new Date(value) : null
    onChange('gte', date)
  }

  const handleEndChange = (value: string) => {
    const date = value ? new Date(value) : null
    onChange('lte', date)
  }

  const inputValue = props.value
  const startValueStr = inputValue?.gte
  const endValueStr = inputValue?.lte

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <FormDate
          allowClear
          picker="dateTime"
          value={startValueStr || undefined}
          onChange={handleStartChange}
          placeholder="起始"
        />
      </div>
      <span className="text-muted-foreground">到</span>
      <div className="flex-1">
        <FormDate
          allowClear
          picker="dateTime"
          value={endValueStr || undefined}
          onChange={handleEndChange}
          placeholder="结束"
        />
      </div>
    </div>
  )
}

FilterDateRange.displayName = "FilterDateRange"

export { FilterDateRange }
