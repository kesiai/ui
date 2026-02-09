import * as React from "react"
import { Status } from '../status/status'

// 类型定义
export interface StatusItemConfig {
  name?: string
  activeType?: 'activeKey' | 'range'
  activeKey?: string | number | boolean
  minKey?: number
  maxKey?: number
  text?: string
  bgColor?: string
  color?: string
  image?: string
  audioSrc?: string
}

export interface DataPointConfig {
  tags: {
    id: string
    name: string
  }
  status?: StatusItemConfig[]
}

export interface DeviceConfig {
  id: string
  name?: string
}

export interface FlexConfig {
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around'
  alignContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'stretch'
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'
}

export interface TagTimeoutState {
  open?: boolean
  text?: string
  bgColor?: string
  color?: string
  image?: string
}

export interface DataPointStatusCondition {
  // 条件类型（与 StatusItemConfig 的 activeType 对应）
  activeType?: 'activeKey' | 'range'
  // 固定值条件
  activeKey?: string | number | boolean
  // 范围条件
  minKey?: number
  maxKey?: number
  // 显示配置
  name?: string
  text?: string
  bgColor?: string
  color?: string
  image?: string
  audioSrc?: string
}

export interface StatusesProps {
  // 设备列表（从外部传入，可由 ViewModel 提供）
  nodes?: DeviceConfig[]
  // 数据点配置数组
  tags?: DataPointConfig[]
  // 数据点状态配置（全局状态，可覆盖 tags 中的状态）
  dataPointStatus?: DataPointStatusCondition[]
  // 模拟数据
  mock?: string
  // 状态切换闪烁
  blinkOnStateChange?: boolean
  // 布局配置
  flex?: FlexConfig
  width?: number
  height?: number
  // 业务逻辑相关的props（在纯UI组件中，这些应该通过外部传入）
  deviceValues?: Record<string, Record<string, any>>
  // 点击事件回调
  onClick?: (node: DeviceConfig, dataPoints: any[]) => void
}

const Statuses: React.FC<StatusesProps> = (props) => {
    const {
        nodes = [],
        tags = [],
        flex,
        width,
        height,
        blinkOnStateChange,
        deviceValues = {},
        dataPointStatus = [],
        onClick
    } = props

    // 处理设备列表 - 兼容字符串 ID 数组和 DeviceConfig 对象数组
    const processedNodes = React.useMemo(() => {
        if (!nodes) return []

        // 如果是空数组，直接返回
        if (nodes.length === 0) return nodes

        // 检查第一个元素的类型来判断数据格式
        const firstNode = nodes[0]
        if (typeof firstNode === 'string' || typeof firstNode === 'number') {
            // 如果是字符串或数字数组，需要转换为 DeviceConfig 格式
            return (nodes as any[]).map((id: string | number) => ({
                id: String(id),
                name: String(id) // 暂时使用 ID 作为名称
            }))
        }

        // 否则假设已经是 DeviceConfig[] 格式
        if (!Array.isArray(nodes)) {
            return [nodes].filter(Boolean)
        }
        return nodes as DeviceConfig[]
    }, [nodes])

    // 处理点击事件
    const handleNodeClick = React.useCallback((node: DeviceConfig) => {
        if (onClick) {
            // 构建数据点信息
            const dataPoints = tags.map(tag => ({
                name: "数据点:" + [node.id, tag?.tags?.name].join('.'),
                origin: { ...tag?.tags, node },
                subscribeNode: node.id,
                subscribeTag: tag?.tags?.id,
                tagDefine: { label: false, value: false },
                value: {},
                _type: "dataPoint"
            }))
            onClick(node, dataPoints)
        }
    }, [onClick, tags])

    // 如果没有设备，显示占位符
    if (!processedNodes.length) {
        return (
            <div className="statuses-placeholder" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: '#999',
                fontSize: '14px'
            }}>
                状态组件组用于定义多个数据点的多个状态，不同状态显示不同的图片、文字或背景色
            </div>
        )
    }

    return (
        <div
            className="statuses-container w-full"
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                ...flex,
                height: '100%'
            }}
        >
            {processedNodes.map(node => (
                <div
                    key={node.id}
                    className='dashboard-status-group'
                    onClick={() => handleNodeClick(node)}
                    style={{
                        width: width || 50,
                        height: height || 30,
                        cursor: onClick ? 'pointer' : 'default',
                        position: 'relative'
                    }}
                >
                    {tags.map((tag, tagIndex) => {
                        if (!tag || !tag.tags) return null

                        // 合并数据点状态配置
                        let mergedStatuses = tag.status || []

                        // 如果有全局 dataPointStatus，则合并
                        if (dataPointStatus && dataPointStatus.length > 0) {
                            mergedStatuses = [
                                ...mergedStatuses,
                                ...dataPointStatus
                            ]
                        }

                        return (
                            <div
                                key={`${node.id}-${tag.tags.id}-${tagIndex}`}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%'
                                }}
                            >
                                <Status
                                    value={deviceValues[node.id]?.[tag.tags.id]?.value}
                                    statuses={mergedStatuses.map(status => ({
                                        name: status.name || '未命名状态',
                                        activeType: status.activeType === 'activeKey' ? 'value' : status.activeType,
                                        activeValue: status.activeKey,
                                        minValue: status.minKey,
                                        maxValue: status.maxKey,
                                        text: status.text,
                                        bgColor: status.bgColor,
                                        textColor: status.color,
                                        backgroundImage: status.image,
                                        audioSrc: status.audioSrc
                                    }))}
                                    blinkOnStateChange={blinkOnStateChange}
                                    width={width}
                                    height={height}
                                />
                            </div>
                        )
                    })}
                </div>
            ))}
        </div>
    )
}

Statuses.displayName = "Statuses"

export { Statuses }

