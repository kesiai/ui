import React from 'react'
import { createRoot } from 'react-dom/client'
import Overlay from 'ol/Overlay'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

interface OverlayConfig {
    map: any
    coordinate: number[]
    popupConfig: {
        className?: string
        id: string
        overlayConfig?: any
        onClose?: () => void
    }
    APP: React.ComponentType<any>
}

export const createOverLayer = ({ map, coordinate, popupConfig, APP }: OverlayConfig) => {
    const container = map.getTargetElement()
    if (!container) {
        throw new Error('Please use in the context of the map')
    }

    const { className, id, overlayConfig = {}, onClose } = popupConfig || {}

    let element = document.getElementById(id)
    let popup: Overlay | null = null

    if (!element) {
        element = document.createElement('div')
        element.className = className || ''
        element.id = id
        container.appendChild(element)

        popup = new Overlay({
            id,
            element,
            insertFirst: false,
            autoPan: {
                animation: {
                    duration: 250,
                },
            },
            ...overlayConfig
        })

        popup.setProperties({ popupVisible: true })

        const onPopupClose = () => {
            if (onClose) onClose()
            popup?.setProperties({ popupVisible: false })
            map.removeOverlay(popup)
            // 清理 DOM 元素
            if (element && element.parentNode) {
                element.parentNode.removeChild(element)
            }
        }

        createRoot(element).render(<APP popup={popup} onClose={onPopupClose} />)
        map.addOverlay(popup)
    } else {
        popup = map.getOverlayById(id)
    }

    if (coordinate && popup) {
        popup.setPosition(coordinate)
    }

    return popup
}

// 默认弹窗面板组件
interface DefaultPanelProps {
    data: any
    onClose: () => void
    hidenCloseBtn?: boolean
}

export const DefaultPanel: React.FC<DefaultPanelProps> = ({ data, onClose, hidenCloseBtn = false }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 min-w-75 max-w-100 max-h-100 overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-sm text-gray-900">
                    {data?.name || data?.title || '详情'}
                </h3>
                {!hidenCloseBtn && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-6 w-6 p-0 hover:bg-gray-200"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="p-4 overflow-y-auto max-h-85">
                <div className="space-y-2">
                    {data?.id && (
                        <div className="text-xs text-gray-500 mb-2 truncate" title={data.id}>
                            编号: {data.id}
                        </div>
                    )}
                    {typeof data?.online !== 'undefined' && (
                        <div className="mb-2">
                            <Badge variant={data.online ? 'primary' : 'destructive'}>
                                {data.online ? '在线' : '离线'}
                            </Badge>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// 自定义React代码弹窗组件
interface CustomPanelProps {
    data: any
    onClose: () => void
    hidenCloseBtn?: boolean
    customCode: string
}

export const CustomPanel: React.FC<CustomPanelProps> = ({ data, onClose, hidenCloseBtn = false, customCode }) => {
    const [error, setError] = React.useState<string | null>(null)
    const [CustomComponent, setCustomComponent] = React.useState<React.ComponentType<any> | null>(null)

    React.useEffect(() => {
        if (!customCode) {
            setError('未提供自定义代码')
            return
        }

        try {
            // 创建一个函数来执行用户的自定义代码
            // 用户代码应该返回一个React组件
            const createComponent = new Function(
                'React',
                'data',
                'Badge',
                'Button',
                `
                try {
                    ${customCode}
                } catch (error) {
                    console.error('自定义代码执行错误:', error);
                    return null;
                }
                `
            )

            const component = createComponent(React, data, Badge, Button)

            if (component && typeof component === 'function') {
                setCustomComponent(() => component)
                setError(null)
            } else {
                setError('自定义代码必须返回一个React组件')
            }
        } catch (err) {
            console.error('自定义代码解析错误:', err)
            setError(err instanceof Error ? err.message : '代码执行失败')
        }
    }, [customCode, data])

    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 min-w-75 max-w-150 max-h-125 overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-sm text-gray-900">
                    {data?.name || data?.title || '自定义内容'}
                </h3>
                {!hidenCloseBtn && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-6 w-6 p-0 hover:bg-gray-200"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="p-4 overflow-y-auto max-h-110">
                {error ? (
                    <div className="text-red-500 text-sm p-4 bg-red-50 rounded">
                        <p className="font-semibold mb-2">代码执行错误:</p>
                        <p>{error}</p>
                    </div>
                ) : CustomComponent ? (
                    <CustomComponent data={data} />
                ) : (
                    <div className="text-gray-500 text-sm">加载中...</div>
                )}
            </div>
        </div>
    )
}

// 画面弹窗组件 - 用于加载指定的视图/画面，支持React代码渲染
interface ViewPanelProps {
    data: any
    onClose: () => void
    hidenCloseBtn?: boolean
    viewId?: string
    viewConfig?: any
    viewCode?: string
}

export const ViewPanel: React.FC<ViewPanelProps> = ({
    data,
    onClose,
    hidenCloseBtn = false,
    viewId,
    viewConfig,
    viewCode
}) => {
    const [error, setError] = React.useState<string | null>(null)
    const [ViewComponent, setViewComponent] = React.useState<React.ComponentType<any> | null>(null)

    React.useEffect(() => {
        // 如果提供了 viewCode，执行 React 代码来渲染画面
        if (viewCode) {
            try {
                let processedCode = viewCode

                // 检测是否包含 JSX 语法
                const hasJSX = /<[A-Za-z]/.test(viewCode)

                // 简单的 JSX 转译器 (支持嵌套)
                const transpileJSX = (code: string) => {
                    // 占位符映射
                    const placeholders: string[] = [];
                    const generatePlaceholder = (content: string) => {
                        placeholders.push(content);
                        return `%%JSX_PLACEHOLDER_${placeholders.length - 1}%%`;
                    };

                    // 1. 预处理：保护代码块中的字符串和表达式，防止解析干扰
                    // 暂时只做基础处理，假定用户代码格式相对规范

                    // 2. 从内向外替换成 React.createElement
                    // 循环查找不包含其他标签的"最内层"标签
                    let processed = code;
                    const tagRegex = /<([a-zA-Z][\w:-]*)([^>]*)>([^<]*)<\/\1>|<([a-zA-Z][\w:-]*)([^>]*)\/>/g;
                    
                    let match;
                    let maxLoop = 1000; // 防止死循环
                    
                    while ((match = tagRegex.exec(processed)) && maxLoop > 0) {
                        maxLoop--;
                        const fullMatch = match[0];
                        const isSelfClosing = !!match[4];
                        const tagName = isSelfClosing ? match[4] : match[1];
                        const attrs = isSelfClosing ? match[5] : match[2];
                        const childrenContent = isSelfClosing ? '' : match[3];

                        // 解析属性
                        const propsObjParts: string[] = [];
                        const attrRegex = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|\{([^}]+)\})/g;
                        let attrMatch;
                        while ((attrMatch = attrRegex.exec(attrs)) !== null) {
                            const [_, key, doubleQuoteVal, singleQuoteVal, exprVal] = attrMatch;
                            if (exprVal) {
                                propsObjParts.push(`${key}: ${exprVal}`);
                            } else {
                                const val = doubleQuoteVal !== undefined ? doubleQuoteVal : singleQuoteVal;
                                propsObjParts.push(`${key}: "${val}"`);
                            }
                        }
                        const propsObj = propsObjParts.length > 0 ? `{ ${propsObjParts.join(', ')} }` : 'null';

                        // 解析子元素
                        let childrenArgs = '';
                        if (childrenContent) {
                            // 分割文本和占位符/表达式
                            // 简单的处理：如果包含 placeholder，则按 placeholder 分割
                            // 否则视为文本或表达式
                            
                            const parts: string[] = [];
                            let lastIndex = 0;
                            const childRegex = /(%%JSX_PLACEHOLDER_\d+%%)|(\{[^}]+\})/g;
                            let childMatch;
                            
                            while ((childMatch = childRegex.exec(childrenContent)) !== null) {
                                // 添加前面的文本
                                if (childMatch.index > lastIndex) {
                                    const text = childrenContent.substring(lastIndex, childMatch.index);
                                    if (text.trim()) {
                                        const safeText = text.replace(/"/g, '\\"').replace(/\n/g, '\\n');
                                        parts.push(`"${safeText}"`);
                                    }
                                }
                                
                                const part = childMatch[0];
                                if (part.startsWith('%%')) {
                                    // 还原占位符对应的代码
                                    const index = parseInt(part.match(/\d+/)![0]);
                                    parts.push(placeholders[index]);
                                } else {
                                    // 表达式 {xxx} -> xxx
                                    parts.push(part.slice(1, -1));
                                }
                                
                                lastIndex = childMatch.index + part.length;
                            }
                            
                            // 添加剩余文本
                            if (lastIndex < childrenContent.length) {
                                const text = childrenContent.substring(lastIndex);
                                if (text.trim()) {
                                    const safeText = text.replace(/"/g, '\\"').replace(/\n/g, '\\n');
                                    parts.push(`"${safeText}"`);
                                }
                            }
                            
                            if (parts.length > 0) {
                                childrenArgs = ', ' + parts.join(', ');
                            }
                        }

                        const createElementCode = `React.createElement("${tagName}", ${propsObj}${childrenArgs})`;
                        const placeholder = generatePlaceholder(createElementCode);
                        
                        // 替换当前匹配项
                        processed = processed.replace(fullMatch, placeholder);
                        
                        // 重置正则索引，从头重新查找（因为字符串变了）
                        tagRegex.lastIndex = 0;
                    }

                    // 3. 还原剩余的占位符（通常是顶层组件）
                    // 循环直到没有占位符为止
                    const placeholderRegex = /%%JSX_PLACEHOLDER_(\d+)%%/;
                    while (placeholderRegex.test(processed)) {
                        processed = processed.replace(placeholderRegex, (_match, indexStr) => {
                            const index = parseInt(indexStr);
                            return placeholders[index];
                        });
                    }

                    return processed;
                };

                if (hasJSX) {
                     try {
                        processedCode = transpileJSX(viewCode);
                     } catch (e) {
                        console.error("JSX Transpile Error", e);
                     }
                }

                // 自动添加 return 如果用户只是定义了一个函数表达式

                // 自动添加 return 如果用户只是定义了一个函数表达式
                const trimmedCode = processedCode.trim();
                if (
                    !trimmedCode.startsWith('return') && 
                    (trimmedCode.startsWith('(') || trimmedCode.startsWith('function'))
                ) {
                    processedCode = `return ${processedCode}`;
                }

                // 创建一个函数来执行用户的自定义代码
                const createComponent = new Function(
                    'React',
                    'data',
                    'Badge',
                    'Button',
                    `
                    try {
                        ${processedCode}
                    } catch (error) {
                        console.error('画面代码执行错误:', error);
                        return null;
                    }
                    `
                )

                const component = createComponent(React, data, Badge, Button)

                if (component && typeof component === 'function') {
                    setViewComponent(() => component)
                    setError(null)
                } else {
                    setError('画面代码必须返回一个React组件')
                }
            } catch (err) {
                console.error('画面代码解析错误:', err)
                setError(err instanceof Error ? err.message : '代码执行失败')
            }
        } else if (viewId) {
            // 如果只提供了 viewId，显示占位内容
            setError(null)
            setViewComponent(() => {
                return function PlaceholderView({ data }: any) {
                    return (
                        <div className="p-4">
                            <p className="text-sm text-gray-600 mb-2">画面ID: {viewId}</p>
                            <p className="text-sm text-gray-500 mb-4">
                                提示：您可以在配置中添加 <code className="bg-gray-100 px-1 py-0.5 rounded">view.code</code> 字段来编写自定义画面代码。
                            </p>
                            <div className="mt-4 p-3 bg-gray-50 rounded">
                                <p className="text-xs text-gray-700 font-semibold mb-2">当前数据:</p>
                                <pre className="text-xs overflow-auto max-h-40">
                                    {JSON.stringify(data, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )
                }
            })
        } else {
            setError('未提供画面ID或画面代码')
        }
    }, [viewCode, viewId, data, viewConfig])

    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 min-w-100 max-w-200 max-h-150 overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-sm text-gray-900">
                    {data?.name || data?.title || '画面视图'}
                </h3>
                {!hidenCloseBtn && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-6 w-6 p-0 hover:bg-gray-200"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="overflow-y-auto max-h-[540px]">
                {error ? (
                    <div className="text-red-500 text-sm p-4 bg-red-50 rounded m-4">
                        <p className="font-semibold mb-2">画面加载错误:</p>
                        <p>{error}</p>
                    </div>
                ) : ViewComponent ? (
                    <ViewComponent data={data} />
                ) : (
                    <div className="text-gray-500 text-sm p-4">加载中...</div>
                )}
            </div>
        </div>
    )
}

export const getGeometryCenter = (geometry: any) => {
    const type = geometry.getType()

    switch (type) {
        case 'Point':
            return geometry.getCoordinates()

        case 'LineString':
            const lineCoords = geometry.getCoordinates()
            const midIndex = Math.floor(lineCoords.length / 2)
            return lineCoords[midIndex]

        case 'Polygon':
            const interiorPoint = geometry.getInteriorPoint().getCoordinates()
            return interiorPoint.slice(0, 2)

        case 'Circle':
            return geometry.getCenter()

        default:
            return null
    }
}
