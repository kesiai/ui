import * as React from "react"
import dayjs from "dayjs"
import isNil from 'lodash/isNil'
import isEmpty from 'lodash/isEmpty'
import isString from 'lodash/isString'
import isNull from 'lodash/isNull'
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { convertValue, type DataPointConfig } from "@/registry/lib/data-point-utils"
import { useUser, useTag, queryLastData, useServerTime } from "@airiot/client"

// ─── 类型 ───

export interface WarningInfo {
  desc?: string
  level?: string
  status?: string
  processed?: string
  time?: string
  table?: { id: string; title?: string }
  tableData?: { id: string; name?: string; title?: string }
  fields?: Array<{ id: string; name: string; value?: any }>
  confirmUser?: { name: string }
  confirmTime?: string
  [key: string]: any
}

export interface WarningState {
  className?: string
  level?: '低' | '中' | '高'
  recoveryTime?: string
  info?: WarningInfo
}

export interface TimeoutState {
  isTimeout?: boolean
  isOffline?: boolean
}

export interface DataPointTag {
  value: any
  time?: string | Date
  warningState?: WarningState
  timeoutState?: TimeoutState
}

export interface DataPointStyle {
  timeout?: string
  offline?: string
  warning?: { '低'?: string; '中'?: string; '高'?: string; '恢复'?: string }
  tagClassName?: string
}

export interface DataPointProps {
  tableId: string
  tableDataId: string
  tableDataName?: string
  tagId: string
  initVisible?: boolean
  format?: (value: any) => any
  config?: DataPointConfig
  style?: DataPointStyle
}

// ─── 常量 ───

const levelColors: Record<string, string> = {
  '低': 'bg-blue-100 text-blue-700 border-blue-200',
  '中': 'bg-orange-100 text-orange-700 border-orange-200',
  '高': 'bg-red-100 text-red-700 border-red-200',
}

const recoveredColor = 'bg-green-100 text-green-700 border-green-200'

// ─── 工具 ───

function formatGap(seconds: number): string {
  let s = seconds < 0 && seconds > -5 ? 0 : seconds
  let text = ''

  if (s >= 86400) { text += `${Math.floor(s / 86400)}天`; s %= 86400 }
  if (text || s >= 3600) { text += ` ${Math.floor(s / 3600)}小时`; s %= 3600 }
  if (text || s >= 60) { text += ` ${Math.floor(s / 60)}分`; s %= 60 }
  text += ` ${s}秒`
  return text
}

function isEmptyValue(val: any): boolean {
  return val === undefined || val === '' || isNull(val)
}

function formatFieldValue(val: any): string {
  if (typeof val === 'boolean') return val ? '1' : '0'
  if (typeof val === 'number') return Number.isInteger(val) ? String(val) : val.toFixed(3)
  return String(val ?? '-')
}

// ─── WarningSection ───

const WarningSection: React.FC<{ warningState: WarningState }> = ({ warningState }) => {
  const { level, recoveryTime, info } = warningState
  const isRecovered = !!recoveryTime

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <span className="text-muted-foreground">报警:</span>
        {level && (
          <Badge variant="outline" className={cn('text-xs px-1.5 py-0', levelColors[level])}>
            {level}
          </Badge>
        )}
        {isRecovered && (
          <Badge variant="outline" className={cn('text-xs px-1.5 py-0', recoveredColor)}>
            已恢复
          </Badge>
        )}
      </div>

      {info && (
        <Collapsible>
          <CollapsibleTrigger className="text-xs text-blue-600 hover:text-blue-800 underline cursor-pointer">
            报警详情
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-1.5 pl-2 border-l-2 border-muted text-xs space-y-1">
              {info.time && (
                <p><span className="text-muted-foreground">报警时间:</span> {dayjs(info.time).format('YYYY-MM-DD HH:mm:ss')}</p>
              )}
              {(info.tableData?.name || info.tableData?.title || info.tableData?.id) && (
                <p><span className="text-muted-foreground">报警设备:</span> {info.tableData.name || info.tableData.title || info.tableData.id}</p>
              )}
              {info.desc && (
                <p><span className="text-muted-foreground">报警描述:</span> {info.desc}</p>
              )}
              {info.status && (
                <p><span className="text-muted-foreground">报警状态:</span> {info.status}</p>
              )}
              {info.fields && info.fields.length > 0 && (
                <p>
                  <span className="text-muted-foreground">报警数据:</span>{' '}
                  {info.fields.map((f, i) => (
                    <React.Fragment key={f.id || i}>
                      {i > 0 && ', '}{f.name}: {formatFieldValue(f.value)}
                    </React.Fragment>
                  ))}
                </p>
              )}
              {info.confirmUser?.name && (
                <p><span className="text-muted-foreground">处理人:</span> {info.confirmUser.name}</p>
              )}
              {info.confirmTime && (
                <p><span className="text-muted-foreground">处理时间:</span> {dayjs(info.confirmTime).format('YYYY-MM-DD HH:mm:ss')}</p>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  )
}

// ─── LatestValue ───

const LatestValue: React.FC<{
  tableId: string
  tableDataId: string
  tagId: string
  value: any
  format?: (value: any) => any
  config: DataPointConfig
}> = ({ tableId, tableDataId, tagId, value, format, config }) => {
  const [queried, setQueried] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    queryLastData([{ tableId, dataId: tableDataId, tagId }], (res: any) => {
      const path = `${tableId}|${tableDataId}|${tagId}.value`
      const v = res?.[path]
      if (v !== undefined) setQueried(v)
      setLoading(false)
    })
  }, [tableId, tableDataId, tagId])

  const val = convertValue(!isNil(value) ? value : queried, format, config)

  return (
    <p>
      <span className="text-muted-foreground">最新有效值: </span>
      <span className="font-medium">
        {loading ? '加载中...' : !isNil(val) ? String(val) : '-'}
      </span>
    </p>
  )
}

// ─── PopoverDetail ───

const PopoverDetail: React.FC<{
  tableId: string
  tableDataId: string
  tagId: string
  value: any
  time?: string | Date
  warningState?: WarningState
  config: DataPointConfig
  format?: (value: any) => any
  onClose: () => void
}> = ({ tableId, tableDataId, tagId, value, time, warningState, config, format, onClose }) => {
  const serverTime = useServerTime()

  const gap = time ? serverTime?.unix() - dayjs(time).unix() : 0
  const timeValid = time ? dayjs(time).isValid() : false

  return (
    <div className="space-y-1.5 text-sm">
      <LatestValue
        tableId={tableId} tableDataId={tableDataId} tagId={tagId}
        value={value} format={format} config={config}
      />
      <p>
        <span className="text-muted-foreground">最新时间: </span>
        {timeValid ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : '-'}
      </p>
      <p>
        <span className="text-muted-foreground">距现时间: </span>
        <span title={`${gap}秒`}>{timeValid ? formatGap(gap) : '-'}</span>
      </p>
      {config.interval ? (
        <p>
          <span className="text-muted-foreground">采集周期: </span>
          {config.interval}秒
        </p>
      ) : null}
      {warningState && !isEmpty(warningState) ? (
        <WarningSection warningState={warningState} />
      ) : null}
      {!isString(value) && (
        <p className="text-center pt-1">
          <button onClick={onClose} className="text-blue-600 hover:text-blue-800 underline">
            查看历史数据
          </button>
        </p>
      )}
    </div>
  )
}

// ─── TagRender ───

const TagRender: React.FC<{
  tag: DataPointTag
  config: DataPointConfig
  format?: (value: any) => any
  style?: DataPointStyle
}> = ({ tag, config, format, style }) => {
  const { errview } = config || {}
  const { value, warningState = {}, timeoutState = {} } = tag || {}
  const val = convertValue(value, format, config)

  const { className: warningClassName, level, recoveryTime } = warningState
  const { isTimeout, isOffline } = timeoutState

  const bg = isOffline ? style?.offline : isTimeout ? style?.timeout : undefined
  const color = level
    ? style?.warning?.[level]
    : recoveryTime ? style?.warning?.['恢复'] : undefined

  const showDash = (isTimeout && (errview === '不显示当前值' || !errview)) || isEmptyValue(val)

  return (
    <span
      className={cn(warningClassName || 'normal', style?.tagClassName, 'inline-flex items-center')}
      style={{ cursor: 'pointer', ...(bg && { backgroundColor: bg }), ...(color && { color }), userSelect: 'none' }}
    >
      {showDash ? (
        <span className="text-muted-foreground">-</span>
      ) : val === 0 ? (
        <>{val}</>
      ) : (
        <>{val}</>
      )}
    </span>
  )
}

// ─── DataPoint ───

const DataPoint = React.forwardRef<HTMLSpanElement, DataPointProps>(
  ({ tableId, tableDataId, tableDataName, tagId, initVisible, format, config = {} as DataPointConfig, style }, ref) => {
    const [visible, setVisible] = React.useState(initVisible || false)
    const { user } = useUser()

    const tagValue = useTag({ tableId, dataId: tableDataId, tagId })

    const tag = React.useMemo<DataPointTag>(() => ({
      value: tagValue?.value,
      time: tagValue?.time,
      warningState: tagValue?.warningState || {},
      timeoutState: tagValue?.timeoutState || {},
    }), [tagValue])

    if (!(user?.token || user?.username || user?.id)) {
      return <span className="text-slate-400">请先登录以查看数据点</span>
    }

    return (
      <Popover open={visible} onOpenChange={setVisible}>
        <PopoverTrigger asChild>
          <span ref={ref} className="inline-block cursor-pointer">
            <TagRender tag={tag} config={config} format={format} style={style} />
          </span>
        </PopoverTrigger>
        <PopoverContent className="z-999 w-60 p-3" side="bottom" align="start">
          {tableDataName && (
            <div className="text-sm font-medium mb-2 pb-2 border-b">{tableDataName}</div>
          )}
          <PopoverDetail
            tableId={tableId} tableDataId={tableDataId} tagId={tagId}
            value={tag.value} time={tag.time} warningState={tag.warningState}
            config={config} format={format} onClose={() => setVisible(false)}
          />
        </PopoverContent>
      </Popover>
    )
  }
)

DataPoint.displayName = "DataPoint"

export { DataPoint, convertValue }
export type { DataPointConfig } from "../../lib/data-point-utils"
