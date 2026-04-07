import type { LucideIcon } from 'lucide-react'
import {
  LogIn,
  Table,
  AlertTriangle,
  Terminal,
  Calendar,
  Cpu,
  Database,
  HardDrive,
  Hand,
  FileText,
  Upload,
  GitBranch,
  Calculator,
  BarChart3,
  History,
  Activity,
  ArrowLeft,
  Pen,
  Search,
  Plus,
  FileEdit,
  Edit,
  Trash2,
  UserCheck,
  Users,
  Code,
  FileCode,
  Repeat,
  Clock,
  Variable,
  Globe,
  MessageSquare,
  Brain,
  Puzzle,
  MinusCircle,
  GitCommit,
  GitMerge,
  Bot,
  Sparkles,
  Layers,
  Mail,
  Send,
  MessageCircle,
  MessageSquarePlus,
  AtSign,
  User,
  Globe2,
  Loader,
  MonitorPlay,
  SquareFunction,
  DatabaseIcon
} from 'lucide-react'

// 图标映射
const iconMap: Record<string, LucideIcon> = {
  "用户登录": LogIn,
  "表事件": Table,
  "报警事件": AlertTriangle,
  "指令事件": Terminal,
  "计划事件": Calendar,
  "设备数据事件": Cpu,
  "设备表数据事件": DatabaseIcon,
  "驱动事件": HardDrive,
  "手动触发器": Hand,
  "日志事件": FileText,
  "媒体文件上传": Upload,
  "子流程触发": GitBranch,
  "fx": Calculator,
  "StatisticsNode": BarChart3,
  "historyData": History,
  "realTimeData": Activity,
  "prevData": ArrowLeft,
  "writePoints": Pen,
  "searchSysLog": Search,
  "addExTableRecord": Plus,
  "addUpdateExTableRecord": FileEdit,
  "updateExTableRecord": Edit,
  "deleteExTableRecord": Trash2,
  "searchExTableRecord": Search,
  "flowUserApprove": UserCheck,
  "flowUserCC": Users,
  "flowUserFillin": FileEdit,
  "script": Code,
  "pythonScript": FileCode,
  "flowIterator": Repeat,
  "delayed": Clock,
  "setGlobalVariable": Variable,
  "webhook": Globe,
  "dataInterface": Database,
  "flowKafkaClient": MessageSquare,
  "algorithm": Brain,
  "flowExtension": Puzzle,
  "cmd": Terminal,
  "flowIteratorEnd": MinusCircle,
  "subflowResponse": GitBranch,
  "subflowCaller": GitCommit,
  "callBigModel": Bot,
  "redisSet": Database,
  "redisDelete": Database,
  "redisQuery": Database,
  "dbClientQuery": Database,
  "flowWhile": Repeat,
  "flowWhileEnd": MinusCircle,
  "alarmNode": AlertTriangle,
  "datetimeHelper": Clock,
  "email": Mail,
  "wechat": MessageCircle,
  "wechatee": Send,
  "sms": MessageSquarePlus,
  "message": MessageSquare,
  "dingtalk": AtSign,
  "createSystemVariable": Plus,
  "updateSystemVariable": FileEdit,
  "deleteSystemVariable": Trash2,
  "addMedia": Upload,
  "queryMedia": Search,
  "searchRecordByCache": Database,
  "flowMqttClient": Globe2,
  "flowDBClient": Database,
  "gatewayOpcua": GitMerge,
  "gatewayOpcda": Layers,
  "flowRabbitMQClient": MessageSquare,
  "gateway": GitBranch,
  "gatewayEnd": MinusCircle,
  "flowEnd": SquareFunction,
  "datasetView": MonitorPlay,
}

// 流程节点配置
interface FlowNode {
  category?: string[]
  title: string
  style?: {
    background: string
  }
}

interface FlowNodes {
  [key: string]: FlowNode
}

const flowNodes: FlowNodes = {
  "用户登录": {
    "category": ["起始节点", "系统操作节点"],
    "title": "用户登录",
    "style": { "background": "#7682F2" }
  },
  "表事件": {
    "category": ["起始节点", "起始高级节点"],
    "title": "表事件",
    "style": { "background": "#8590F7" }
  },
  "报警事件": {
    "category": ["起始节点", "业务数据节点"],
    "title": "报警事件",
    "style": { "background": "#E26E6E" }
  },
  "指令事件": {
    "category": ["起始节点", "业务数据节点"],
    "title": "指令事件",
    "style": { "background": "#E26E6E" }
  },
  "计划事件": {
    "category": ["起始节点", "起始高级节点"],
    "title": "计划事件",
    "style": { "background": "#7682F2" }
  },
  "设备数据事件": {
    "category": ["起始节点", "起始高级节点"],
    "title": "设备数据事件",
    "style": { "background": "#7682F2" }
  },
  "设备表数据事件": {
    "category": ["起始节点", "起始高级节点"],
    "title": "设备表数据事件",
    "style": { "background": "#7682F2" }
  },
  "驱动事件": {
    "category": ["起始节点", "业务数据节点"],
    "title": "驱动事件",
    "style": { "background": "#E26E6E" }
  },
  "手动触发器": {
    "category": ["起始节点", "起始高级节点"],
    "title": "手动触发",
    "style": { "background": "#7682F2" }
  },
  "日志事件": {
    "category": ["起始节点", "业务数据节点"],
    "title": "日志事件",
    "style": { "background": "#E26E6E" }
  },
  "媒体文件上传": {
    "category": ["起始节点", "业务数据节点"],
    "title": "媒体库事件",
    "style": { "background": "#E26E6E" }
  },
  "子流程触发": {
    "category": ["起始节点", "起始高级节点"],
    "title": "子流程触发",
    "style": { "background": "#7682F2" }
  },
  "fx": {
    "category": ["处理节点", "数据节点"],
    "title": "数据计算",
    "style": { "background": "#78B937" }
  },
  "StatisticsNode": {
    "category": ["处理节点", "数据节点"],
    "title": "数据统计",
    "style": { "background": "#78B937" }
  },
  "historyData": {
    "category": ["处理节点", "数据节点"],
    "title": "历史数据",
    "style": { "background": "#78B937" }
  },
  "realTimeData": {
    "category": ["处理节点", "数据节点"],
    "title": "实时数据",
    "style": { "background": "#78B937" }
  },
  "prevData": {
    "category": ["处理节点", "数据节点"],
    "title": "前项数据",
    "style": { "background": "#78B937" }
  },
  "writePoints": {
    "category": ["处理节点", "数据节点"],
    "title": "写入数据点值",
    "style": { "background": "#78B937" }
  },
  "searchSysLog": {
    "category": ["处理节点", "日志"],
    "title": "查询系统日志",
    "style": { "background": "#5B8FF9" }
  },
  "addExTableRecord": {
    "category": ["处理节点", "表处理节点"],
    "title": "新增记录",
    "style": { "background": "#EF874C" }
  },
  "addUpdateExTableRecord": {
    "category": ["处理节点", "表处理节点"],
    "title": "新增或更新记录",
    "style": { "background": "#EF874C" }
  },
  "updateExTableRecord": {
    "category": ["处理节点", "表处理节点"],
    "title": "更新记录",
    "style": { "background": "#EF874C" }
  },
  "deleteExTableRecord": {
    "category": ["处理节点", "表处理节点"],
    "title": "删除记录",
    "style": { "background": "#EF874C" }
  },
  "searchExTableRecord": {
    "category": ["处理节点", "表处理节点"],
    "title": "表查询",
    "style": { "background": "#EF874C" }
  },
  "flowUserApprove": {
    "category": ["人工节点"],
    "title": "审批",
    "style": { "background": "#ECBE0A" }
  },
  "flowUserCC": {
    "category": ["人工节点"],
    "title": "抄送",
    "style": { "background": "#ECBE0A" }
  },
  "flowUserFillin": {
    "category": ["人工节点"],
    "title": "填写",
    "style": { "background": "#ECBE0A" }
  },
  "script": {
    "category": ["高级节点", "脚本"],
    "title": "执行Node脚本",
    "style": { "background": "#54ABCB" }
  },
  "pythonScript": {
    "category": ["高级节点", "脚本"],
    "title": "执行Python脚本",
    "style": { "background": "#54ABCB" }
  },
  "flowIterator": {
    "category": ["高级节点", "逻辑及变量处理"],
    "title": "迭代",
    "style": { "background": "#54ABCB" }
  },
  "delayed": {
    "category": ["高级节点", "逻辑及变量处理"],
    "title": "延时",
    "style": { "background": "#54ABCB" }
  },
  "setGlobalVariable": {
    "category": ["高级节点", "逻辑及变量处理"],
    "title": "设置变量",
    "style": { "background": "#54ABCB" }
  },
  "webhook": {
    "category": ["高级节点", "数据处理"],
    "title": "webhook",
    "style": { "background": "#54ABCB" }
  },
  "dataInterface": {
    "category": ["高级节点", "数据处理"],
    "title": "数据接口",
    "style": { "background": "#54ABCB" }
  },
  "flowKafkaClient": {
    "category": ["高级节点", "数据处理"],
    "title": "kafka",
    "style": { "background": "#54ABCB" }
  },
  "algorithm": {
    "category": ["高级节点", "模块调用"],
    "title": "算法",
    "style": { "background": "#54ABCB" }
  },
  "flowExtension": {
    "category": ["高级节点", "模块调用"],
    "title": "扩展",
    "style": { "background": "#54ABCB" }
  },
  "cmd": {
    "category": ["高级节点", "模块调用"],
    "title": "执行指令",
    "style": { "background": "#54ABCB" }
  },
  "flowIteratorEnd": {
    "title": "迭代结束"
  },
  "subflowResponse": {
    "category": ["高级节点", "逻辑及变量处理"],
    "title": "子流程响应",
    "style": { "background": "#54ABCB" }
  },
  "subflowCaller": {
    "category": ["高级节点", "逻辑及变量处理"],
    "title": "调用子流程",
    "style": { "background": "#54ABCB" }
  },
  "callBigModel": {
    "category": ["高级节点", "模块调用"],
    "title": "AI模型",
    "style": { "background": "#54ABCB" }
  },
  "redisSet": {
    "category": ["高级节点", "内存处理"],
    "title": "写入缓存",
    "style": { "background": "#54ABCB" }
  },
  "redisDelete": {
    "category": ["高级节点", "内存处理"],
    "title": "删除缓存",
    "style": { "background": "#54ABCB" }
  },
  "redisQuery": {
    "category": ["高级节点", "内存处理"],
    "title": "读取缓存",
    "style": { "background": "#54ABCB" }
  },
  "dbClientQuery": {
    "category": ["高级节点", "数据处理"],
    "title": "数据库查询",
    "style": { "background": "#54ABCB" }
  },
  "flowWhile": {
    "category": ["高级节点", "逻辑及变量处理"],
    "title": "While循环",
    "style": { "background": "#54ABCB" }
  },
  "flowWhileEnd": {
    "title": "While循环结束"
  },
  "alarmNode": {
    "category": ["处理节点", "其他节点"],
    "title": "生成报警",
    "style": { "background": "#923BBB" }
  },
  "datetimeHelper": {
    "category": ["处理节点", "其他节点"],
    "title": "时间和日期",
    "style": { "background": "#923BBB" }
  },
  "email": {
    "category": ["通知"],
    "title": "发送邮件",
    "style": { "background": "#41B08F" }
  },
  "wechat": {
    "category": ["通知"],
    "title": "发送微信",
    "style": { "background": "#41B08F" }
  },
  "wechatee": {
    "category": ["通知"],
    "title": "发送企业微信",
    "style": { "background": "#41B08F" }
  },
  "sms": {
    "category": ["通知"],
    "title": "发送短信",
    "style": { "background": "#41B08F" }
  },
  "message": {
    "category": ["通知"],
    "title": "发送站内信",
    "style": { "background": "#41B08F" }
  },
  "dingtalk": {
    "category": ["通知"],
    "title": "发送钉钉",
    "style": { "background": "#41B08F" }
  },
  "createSystemVariable": {
    "category": ["处理节点", "全局变量处理节点"],
    "title": "新增变量",
    "style": { "background": "#61BECE" }
  },
  "updateSystemVariable": {
    "category": ["处理节点", "全局变量处理节点"],
    "title": "更新变量",
    "style": { "background": "#61BECE" }
  },
  "deleteSystemVariable": {
    "category": ["处理节点", "全局变量处理节点"],
    "title": "删除变量",
    "style": { "background": "#61BECE" }
  },
  "addMedia": {
    "category": ["处理节点", "媒体库处理节点"],
    "title": "文件上传",
    "style": { "background": "#EA8A41" }
  },
  "queryMedia": {
    "category": ["处理节点", "媒体库处理节点"],
    "title": "文件查询",
    "style": { "background": "#EA8A41" }
  },
  "searchRecordByCache": {
    "category": ["处理节点", "读取缓存数据"],
    "title": "读取缓存数据",
    "style": { "background": "#E9883E" }
  },
  "flowMqttClient": {
    "category": ["处理节点", "网关"],
    "title": "mqtt网关",
    "style": { "background": "#E96DA1" }
  },
  "flowDBClient": {
    "category": ["处理节点", "网关"],
    "title": "db网关",
    "style": { "background": "#E96DA1" }
  },
  "gatewayOpcua": {
    "category": ["处理节点", "网关"],
    "title": "opcua网关",
    "style": { "background": "#E96DA1" }
  },
  "gatewayOpcda": {
    "category": ["处理节点", "网关"],
    "title": "opcda网关",
    "style": { "background": "#E96DA1" }
  },
  "flowRabbitMQClient": {
    "category": ["处理节点", "网关"],
    "title": "RabbitMQ网关",
    "style": { "background": "#E96DA1" }
  },
  "gateway": {
    "category": ["高级节点", "逻辑及变量处理"],
    "title": "分支节点",
    "style": { "background": "lightslategrey" }
  },
  "gatewayEnd": {
    "title": "分支结束"
  },
  "flowEnd": {
    "title": "结束"
  },
  "datasetView": {
    "category": ["高级节点", "模块调用"],
    "title": "数据视图",
    "style": { "background": "#54ABCB" }
  }
}

export default flowNodes
export { iconMap }