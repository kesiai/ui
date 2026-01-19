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

export interface TableConfig {
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

export interface StatusesProps {
  // 设备表配置
  table?: TableConfig
  // 设备列表
  nodes?: DeviceConfig[]
  // 数据点配置数组
  tags?: DataPointConfig[]
  // 数据点超时状态配置
  tagTimeoutState?: TagTimeoutState
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
        onClick
    } = props

    // 处理设备列表
    const processedNodes = React.useMemo(() => {
        if (!Array.isArray(nodes)) {
            return [nodes].filter(Boolean)
        }
        return nodes
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
            className="statuses-container"
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
                                    statuses={tag.status?.map(status => ({
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

