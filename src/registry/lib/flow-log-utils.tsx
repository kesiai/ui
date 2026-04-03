import React from 'react'
import { getConfig } from '@airiot/client'
import isPlainObject from 'lodash/isPlainObject'
import last from 'lodash/last'
import omit from 'lodash/omit'
import isFunction from 'lodash/isFunction'
import values from 'lodash/values'
import keys from 'lodash/keys'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import find from 'lodash/find'
import isNil from 'lodash/isNil'
import mapValues from 'lodash/mapValues'
import compact from 'lodash/compact'
import forEach from 'lodash/forEach'
import some from 'lodash/some'
import isBoolean from 'lodash/isBoolean'
import uniq from 'lodash/uniq'
import get from 'lodash/get'
import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'
import dayjs from 'dayjs'
import { Badge } from '@/components/ui/badge'
import flowNodes from './flow-nodes'

const flowTypeMap: Record<string, string> = {
  'command': '指令事件',
  'modelData': '设备表数据事件',
  'nodeData': '设备数据事件',
  'schedule': '计划事件',
  'worksheet': '表事件',
  'manualTrigger': '手动触发器',
  'driverEvent': '驱动事件',
  'warning': '报警事件',
  'login': '用户登录',
  '媒体文件上传': '媒体库事件',
  'worksheetRecord': '表事件',
  'logEvent': '日志事件',
  'subflowTrigger': '子流程触发'
}

// 类型定义
interface FlowElement {
  type: string
  status?: string
  elementId: string
  job?: string
  timestamp?: number
  leaveTimestamp?: number
  setting?: any
  variables?: any
  [key: string]: any
}

interface FlowTask {
  bpmnProcessId?: any
  variables?: any
  value?: any
  data?: any
  [key: string]: any
}

interface NodeDataResult {
  title: string | React.ReactNode
  user?: string
  operation?: string
  content?: string | React.ReactNode
  logNodeRender?: Element | React.ReactNode
}

interface FlowNode {
  category?: string | string[]
  type?: string
  [key: string]: any
}

const uuid = (len: number, radix?: number) => {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  let uuid = [], i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    // rfc4122, version 4 form
    let r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data. At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return 'Flow_' + uuid.join('')
}

const getIsStartNode = (node: FlowNode): boolean => {
  const category = node?.category ? node.category : flowNodes[node.type || '']?.category
  if (isArray(category) && category.length > 0) {
    return category[0] == '起始节点'
  } else {
    return category == '起始节点'
  }
}

const getNodeType = (type: string) => {
  return flowTypeMap[type]
}

/**
 * 获取节点数据
 * @param el 节点元素
 * @param task 任务对象
 * @returns 流程节点数据
 */
const getNodeData = (el: FlowElement, task: FlowTask, logRender?: Element | React.ReactNode): NodeDataResult => {
  const nodes = flowNodes
  const category = last(nodes[el.type]?.category) || ''
  const title = getNodeType(el.type) ? `${getNodeType(el.type)}触发` : nodes[el.type]?.title || ''
  const startVar = task.variables && task.variables[task.bpmnProcessId?.id || task.bpmnProcessId] || {}
  const config = el.setting || {}
  const variables = el.variables?.[el.elementId] || el.variables || {}
  let user: string | undefined
  let operation = getNodeType(el.type) ? '发起流程' : nodes[el.type]?.title || ''
  let content: string | React.ReactNode | undefined

  if (isFunction(logRender)) {
    return { title, user, operation, content: logRender }
  }
  if (el.type == 'worksheetRecord') {
    user = startVar.flowTriggerUser?.name || startVar.flowTriggerUser || (startVar.extFlowType == '表记录增加' ? startVar.creatorName || '' : startVar.modifyUser?.name) || ''
    content = startVar.extFlowType || ''
  } else if (el.type == 'worksheet') {
    const tableName = startVar['#$table']?.title || ''
    return { title: `${el.type || ''} - 表名(${tableName})` }
  } else if (el.type == 'login') {
    user = startVar.userName || startVar['#$user']?.name || ''
    content = '登录平台'
  } else if (el.type == 'boot') {
    content = '启动系统'
  } else if (el.type == 'schedule') {
    content = config.selectType == 'period' ? `周期触发 - ${startVar.interval || ''}` : '仅执行一次'
  } else if (el.type == 'warning') {
    content = config.warningType == 'timeout' ? '数据点超时报警' : config.warningType == 'dataPoint' ? '数据点报警' : '复杂报警'
  } else if (el.type == 'command') {
    content = `执行指令  指令：${startVar.cmdName || values(startVar)[0]?.cmdName || ''}`
  } else if (el.type == 'modelNode') {
    const target = config.eventRange == 'model' ? `设备表：${startVar.modelName || ''}` : `设备：${startVar.nodeName || ''}`
    content = <>{config.eventType}<br />{target}</>
  } else if (el.type == 'modelData') {
    const tags = config.tags.filter((t: any) => keys(startVar).indexOf(t.id) > -1)
    const model = startVar['#$table']?.id && config.tags.find((t: any) => t.table?.id == startVar['#$table'].id)?.table?.name
    content = <>数据上数<br />设备表：{model || ''}  数据点：{tags && tags.map((t: any) => t.name).join(',')}</>
  } else if (el.type == 'nodeData') {
    const tags = config.tags.filter((t: any) => keys(startVar).indexOf(t.id) > -1)
    const node = startVar['#$tableData']?.id && config.tags.find((t: any) => t.node?.id == startVar['#$tableData'].id)?.table?.name
    content = <>数据上数<br />设备：{node || ''}  数据点：{tags && tags.map((t: any) => t.name).join(',')}</>
  } else if (el.type == 'cmd') {
    const tableDataIds = variables.tableDataIds?.map((v: any) => v)
    content = `指令：${variables.command?.name || ''}  设备：${tableDataIds?.join(',') || ''}`
  } else if (category == '表处理节点') {
    content = `表：${config.table?.title || config.table?.name || ''}`
  } else if (category == '通知') {
    const users = config.users && config.users.map((v: any) => v.name)
    content = `收件人：${users?.join(',') || ''}`
  } else if (category == '人工节点') {
    if (el.status == 'INTERRUPT') {
      operation = el.type == 'flowUserApprove' ? '终止审批' : el.type == 'flowUserFillin' ? '终止填写' : '终止'
    } else {
      const currentUserId = getConfig().user?.userId
      if (el.type == 'flowUserApprove') {
        let approveInfo: React.ReactNode = null
        const { assignSetting = [] } = task.value || {}
        const { approvalReasonList = [] } = task.data || {}
        let temp: string | null = el.status == 'CREATED' ? '等你审批' : null
        const agreeUser = variables.agreeUser?.map((u: any) => u?.['#$user']?.name) || task.value?.agreeUser
        const disagreeUser = variables.disagreeUser?.map((u: any) => u?.['#$user']?.name) || task.value?.disagreeUser
        const revertUser = variables.revertUser?.map((u: any) => u?.['#$user']?.name) || task.value?.revertUser
        if (el.status == 'CREATED') {
          const otherMemberApprove = task.value?.assignees?.indexOf(currentUserId) == -1
          if (config.approveType == 'all' && !isEmpty(agreeUser) && !otherMemberApprove) {
            const approveUser = agreeUser?.map((v: any) => v.name)?.join(',')
            temp = agreeUser?.find((v: any) => v.id == currentUserId) ? '等待其他成员审批' : '等你审批'
            approveInfo = <>{approveUser}<br />于{dayjs(el.leaveTimestamp || el.timestamp).format('YYYY-MM-DD HH:mm:ss')}通过审批<br /></>
          } else if (config.approveType == 'and' && !isEmpty(disagreeUser)) {
            const approveUser = disagreeUser?.map((v: any) => v.name)?.join(',')
            temp = disagreeUser?.find((v: any) => v.id == currentUserId) ? '等待其他成员审批' : '等你审批'
            approveInfo = <>{approveUser}<br />于{dayjs(el.leaveTimestamp || el.timestamp).format('YYYY-MM-DD HH:mm:ss')}拒绝审批<br /></>
          } else if (otherMemberApprove) {
            temp = '等待其他成员审批'
          }
        }

        const assignees = map(variables.assignees?.['#$user'], (v: any) => v)
        const hasFilterUser = assignSetting?.some((s: any) => s.type == 'filter')
        if (!hasFilterUser || (!isEmpty(assignees) && assignees.every((a: any) => a.name))) {
          const assigneesUser = hasFilterUser ? assignees : assignSetting?.map((u: any) => isPlainObject(u.data) ? [u.data] : u.data)
          if (assigneesUser.length) temp = null
          approveInfo = <>{assigneesUser?.map((u: any) => {
            return (<>
              {
                u?.map((item: any, index: number) => {
                  let userAgree = find(agreeUser || [], (o: any) => (o?.id || o) == item?.name)
                  let userDisagree = find(disagreeUser || [], (o: any) => (o?.id || o) == item?.name)
                  let currentData = approvalReasonList?.find((v: any) => v.id == item?.id)
                  const getState = () => {
                    if (config.approveType == 'or') {
                      if (agreeUser?.length && userAgree) {
                        return '通过'
                      }
                      if (disagreeUser?.length && userDisagree) {
                        return '拒绝'
                      }
                      if ((agreeUser?.length || disagreeUser?.length) && !(userAgree && userDisagree)) {
                        return '无需审批'
                      }
                    } else if (config.approveType == 'and') {
                      if (agreeUser?.length && userAgree) {
                        return '通过'
                      }
                      if (disagreeUser?.length && userDisagree) {
                        return '拒绝'
                      }
                      if (agreeUser?.length && !userAgree) {
                        return '无需审批'
                      }
                    } else {
                      if (agreeUser?.length && userAgree) {
                        return '通过'
                      }
                      if (disagreeUser?.length && userDisagree) {
                        return '拒绝'
                      }
                      if (disagreeUser?.length && !userDisagree) {
                        return '无需审批'
                      }
                    }
                    return '待审批'
                  }
                  let style: React.CSSProperties = {
                    color: getState() == '通过' ? '#7BAE73' : getState() == '拒绝' ? '#DD5A4E' : '#757575'
                  }
                  return <div key={index}>
                    <div style={{ fontWeight: 600 }}>{item?.name} <span style={style}>{getState()}</span></div>
                    {currentData?.approvalReason && <div>{currentData?.approvalReason}</div>}
                    {currentData?.approvalReason && <div>{dayjs(currentData?.time).format('YYYY-MM-DD HH:mm:ss')}</div>}
                    {currentData?.approvalReason && <div style={{ borderBottom: '1px solid #E5E5E5', marginTop: 8, marginBottom: 4 }}></div>}
                  </div>
                })
              }
            </>)
          })}{assigneesUser.length ? <br /> : null}</>
        }

        const approvalStatus = variables.approvalStatus
        const approveType = config.approveType == 'or' ? '或签（一名审批人通过或否决即可）' : config.approveType == 'and' ? '会签（一名审批人通过即通过，否决需要全员否决）' : '会签（需要所有审批人通过）'
        const users = approvalStatus == 'agree' ? agreeUser : approvalStatus == 'disagree' ? disagreeUser : approvalStatus == 'revert' ? revertUser : null
        user = users?.map((v: any) => v?.['#$user']?.name || v?.name || v)?.join(',')
        const revertScope = config.revertConfig?.revertScope?.find((r: any) => r.id == variables.revertScope)?.name
        const revertMsg = variables.revertMessage ? `回退说明：${variables.revertMessage}` : ''
        operation = approvalStatus == 'agree' ? '通过审批' : approvalStatus == 'disagree' ? '拒绝审批' : approvalStatus == 'revert' ? `回退到【${revertScope}】` : '审批'
        content = isEmpty(approvalReasonList) && !isNil(config?.approvalReason) ? <>{approveInfo}{approvalStatus == 'revert' ? revertMsg : approveType}<br />{temp}</> : <div>{approvalStatus == 'revert' ? revertMsg : approveType}<br />{approveInfo}{temp}</div>
      } else if (el.type == 'flowUserFillin') {
        user = variables.agreeUser?.map((u: any) => u?.['#$user']?.name) || el.fillinUser?.map((v: any) => v.name || v)?.join(',')
        operation = '提交'
        content = el.status == 'CREATED' ? (task.value?.assignees?.indexOf(currentUserId) == -1 ? '等待填写' : '等你填写') : ''
      } else if (el.type == 'flowUserCC') {
        const ccUser = variables.ccUser?.map((u: any) => u?.['#$user']?.name)
        content = `抄送用户：${ccUser?.join(',') || ''}`
      }
    }
  }
  return { title, user, operation, content }
}

const getOtherSpotMap = () => [{ value: 'first', label: '列表第一个元素' }, { value: 'last', label: '列表最后一个元素' }, { value: 'index', label: '指定位置' }]

const getFlowNodeData = (item: FlowElement, logRender?: Element | React.ReactNode): string | React.ReactNode => {
  const allVariables = item.variables || {}
  const variables = allVariables[item.elementId || ''] || allVariables || {}
  const config = item.setting || {}
  const node = flowNodes[item?.type]
  const category = last(node?.category)
  if (item.status == 'FAILED' || item.status == 'CREATED') {
    return node?.title || ''
  }
  if (item.status == 'INTERRUPT') {
    return <span>{node?.title || ''} - 终止</span>
  }
  if (isEmpty(config) && isEmpty(variables)) {
    return node?.title || ''
  }
  if (isFunction(logRender)) {
    const Com = logRender
    return <Com {...item} setting={config} variables={omit(variables, ['__mock__'])} />
  }
  if (category == '表处理节点') {
    const tableName = config.table?.title || config.table?.name || config._title || ''
    const tableId = config.table?.id?.startsWith('{{') && config.table?.id?.endsWith('}}') ? get(allVariables, config.table?.id?.match(/({{)(.+?)(}})/g)?.[2]) : config.table?.id
    if (item.type == 'searchExTableRecord') {
      return `【${tableName}】查询出${variables.data?.length || 0}条记录`
    } else if (item.type == 'deleteExTableRecord') {
      return `【${tableName}】删除${variables.count || 0}条记录`
    } else if (item.type == 'updateExTableRecord') {
      return <span>【{tableName}】更新记录 更新${variables.count || 0}条记录</span>
    } else if (item.type == 'addExTableRecord') {
      if (config.addType == 'multiple') {
        return <span>【{tableName}】新增记录 批量新增{variables.data?.length || 0}条记录</span>
      }
      return <span>【{tableName}】新增记录 记录id: {variables.id}</span>
    } else if (item.type == 'addUpdateExTableRecord') {
      return <span>【{tableName}】新增或更新记录 新增或更新${variables.count || 0}条记录</span>
    }
    return <span>【{tableName}】{node?.title} </span>
  } else if (category == '全局变量处理节点') {
    const getVarType = (value: string) => {
      switch (value) {
        case 'number':
          return '数字类型'
        case 'string':
          return '字符串类型'
        case 'boolean':
          return '布尔类型'
        case 'date':
          return '日期类型'
        case 'object':
          return '对象类型'
        case 'array':
          return '数组类型'
        default:
          return ''
      }
    }
    if (item.type == 'createSystemVariable') {
      return `新增${getVarType(config.type)}变量`
    } else if (item.type == 'updateSystemVariable') {
      return `更新变量`
    } else {
      return `删除${config.length}个变量`
    }
  } else if (item.type == 'deleteNodeAttribute') {
    return `删除属性值`
  } else if (item.type == 'updateNodeAttribute') {
    return '更新属性值'
  } else if (category == '数据节点') {
    let content = ''
    if (item.type == 'fx') {
      return `计算值: ${variables.value ?? ''}`
    } else if (item.type == 'StatisticsNode') {
      return `${config.selectType} 统计数${variables.count}个`
    } else if (item.type == 'historyData') {
      return <span>历史数据: {JSON.stringify(variables.values || [], null, 2)}
        <br />
        原始数据: {JSON.stringify(variables.results || [], null, 2)}
      </span>
    } else if (item.type == 'realTimeData') {
      let el: React.ReactNode
      if (config.version == 'v1.0.1') {
        const vs = mapValues(variables, (v: any) => {
          const tableData = { 设备: { 名称: v['#$tableData']?._tableName || '', id: v['#$tableData']?.id || '' } }
          const tag = { 数据点: v.tag }
          return { ...tableData, ...tag, ...omit(v, ['#$tableData', 'tag']) }
        })
        el = <span>数据: {JSON.stringify(vs || {}, null, 2)}</span>
      } else {
        const vs = mapValues(variables, (v: any) => omit(v, '#$tableData'))
        el = <span>数据: {JSON.stringify(vs || {}, null, 2)}</span>
      }
      return <>{node?.title}: {el}</>
    } else if (item.type == 'prevData') {
      const getEachType = (type: string) => {
        switch (type) {
          case 'first':
            return '前一项数据'
          case 'second':
            return '前两项数据'
          case 'third':
            return '前三项数据'
          default:
            return
        }
      }
      const tags = config.tags?.map((t: any) => {
        const val = config.preType?.map((type: string) => {
          const _type = getEachType(type)
          let v: any
          if (config.version == 'v1.0.1') {
            v = t?.tableData?.id && t?.id && variables[t.index]?.tag?.[type]
          } else {
            v = t?.tableData?.id && t?.id && variables[t.tableData.id]?.[t.id]?.[type]
          }
          return _type ? `${_type}: ${v}` : ''
        })
        return `${t.name || ''}(${t.id})  ${val}`
      }) || []
      content = tags.join('、')
    } else if (item.type == 'writePoints') {
      content = compact(variables.fields?.map((v: any) => v?.key ? `${v.key}: ${v.value ?? ''}` : '')).join('')
      return `${node?.title}   ${content}`
    } else {
      return node?.title || ''
    }
    return `${node?.title}: ${content}`
  } else if (category == '通知') {
    const content = item.type == 'email' ? variables.title : item.type == 'sms' ? `短信模板${variables.code ?? ''}` : variables.content
    const users = variables.selectType === '固定手机号' ? variables.phone :
      variables.selectType === '固定邮箱' ? variables.email :
        variables.users?.map((v: any) => v?.['#$user']?.name || v?.name)?.join('、') || ''

    if (item.type == 'wechat') {
      let c = config.contentPreview
      const contentVar = content ? JSON.parse(content) : null
      contentVar && forEach(contentVar, (v: any, k: string) => {
        c = c?.replace(new RegExp(`${k}.DATA`, 'g'), v.value)
      })
      return <span dangerouslySetInnerHTML={{ __html: `发送 ${c ?? ''} 给 ${users}` }} />
    }
    return <span dangerouslySetInnerHTML={{ __html: `发送 ${content ?? ''} 给 ${users}` }} />
  } else if (item.type == 'flowUserFillin') {
    const users = map(variables.agreeUser, (u: any) => u?.['#$user']?.name || u?.name)?.join(',') || ''
    const fillContent = config.tableName ? `${users}对${config.tableName}进行填写` : `${users}进行填写`
    return item.status == "CREATED" ? '填写' : <span>{fillContent}</span>
  } else if (item.type == 'flowUserCC') {
    const users = variables.ccUser?.map((v: any) => v?.['#$user']?.name)?.join('、') || ''
    const table = config.tableName || ''
    return `抄送${table}给${users}`
  } else if (item.type == 'flowUserApprove') {
    const { approvalStatus, disagreeUser, agreeUser, revertUser, approvalReasonList = [] } = variables
    if (approvalStatus == 'revert') {
      const revertUsers = map(revertUser, (u: any) => u?.['#$user']?.name || u?.name)
      return revertUsers.join('、') + '-' + '回退' + '-' + variables.revertMessage
    }
    const agreeUsers = map(agreeUser, (u: any) => u?.['#$user'] || u)
    const disagreeUsers = map(disagreeUser, (u: any) => u?.['#$user'] || u)
    if (approvalReasonList?.length) {
      return approvalReasonList?.map((item: any) => {
        let status = ''
        if (approvalStatus == 'agree') {
          status = agreeUsers?.some((u: any) => u.id == item.id) ? '通过' : '拒绝'
        } else if (approvalStatus == 'disagree') {
          status = disagreeUsers?.some((u: any) => u.id == item.id) ? '拒绝' : '通过'
        }
        return `${item.name}-${status}${item.approvalReason ? '-' + item.approvalReason : ''}；`
      }) || ''
    } else {
      return approvalStatus == 'agree' ? agreeUsers?.map(u => u?.name)?.join('、') + '-通过' : disagreeUsers?.map(u => u?.name)?.join('、') + '-拒绝'
    }
  } else if (item.type == 'alarmNode') {
    const warning_type = config.warning_type == 'device' ? '设备表记录报警' : config.warning_type == 'general' ? '其他数据报警' : ''
    return `${warning_type} 报警描述: ${variables.desc ?? ''}`
  } else if (category == '网关') {
    const host = variables.url || variables.host ? ` ${variables.url || variables.host}` : ''
    return node.title + `${item.type == 'flowDBClient' ? (' ' + (config.host ?? '')) : host}`
  } else if (item.type == 'cmd') {
    const commandType = config.commandType == 'table' ? '设备表指令' : config.commandType == 'tableData' ? '设备指令' : ''
    const commandParams = variables.command?.params || variables.params
    const commandValue = values(commandParams)?.[0]
    let commandVar: string | React.ReactNode = ''
    let schema = variables.command?.formSchema?.schema || variables.command?.formSchema
    const commandForm = variables.command?.form?.[0] || {}
    if (isNil(commandValue) || (isEmpty(commandValue) && isObject(commandValue))) {
      commandVar = ''
    } else if (schema) {
      if (commandForm?.type == 'array' && schema.properties?.arr?.items?.schema) {
        schema = schema.properties?.arr?.items?.schema
      }
      commandVar = ''
    } else if (commandForm.tableValue) {
      commandVar = ''
    } else if (commandForm.type == 'select' && commandForm.select) {
      const index = commandForm.select?.enum?.indexOf(commandValue)
      commandVar = `指令值为: ` + (commandForm.select?.enum_title?.[index] || '')
    } else if (commandForm.type == 'array' && commandForm.select2) {
      const cv = commandValue.map((v: any) => {
        const index = commandForm.select2?.enum?.indexOf(v)
        return commandForm.select2?.enum_title?.[index] || ''
      })?.join(',')
      commandVar = `指令值为: ` + cv
    } else {
      commandVar = `指令值为: ${commandValue}`
    }
    const tableData = variables.tableData ? `设备: ` + (isArray(variables.tableData) ? variables.tableData.map((n: any) => `${n.name}(${n.id})`).join('、') : variables.tableData) : ''
    const node = config.commandType == 'tableData' ? tableData : config.tableDataIds ? `编号: ${config.tableDataIds}` : ''
    return <span>{commandType} {node} 执行${config.command?.name || keys(commandParams)?.[0] || ''} {commandVar}</span>
  } else if (item.type == 'delayed') {
    const time = variables.untilTime ? dayjs(variables.untilTime).format('YYYY-MM-DD HH:mm:ss') : ''
    return time ? `延时到${time}执行` : '延时执行'
  } else if (item.type == 'webhook') {
    const vars = config.url?.match(/\${.*?\}/g)
    const vals = vars?.map((v: string) => get(allVariables, v?.slice(2, -1)))
    let url = config.url
    if (config.url && !isEmpty(vars)) {
      vars.forEach((v: string, i: number) => url = config.url.replace(v, vals?.[i] || ''))
    }
    return `url: ${url || ''} 请求方式: ${config.method}`
  } else if (item.type == 'dataInterface') {
    return `操作标识: ${config.opKeyLabel || ''}`
  } else if (item.type == 'flowExtension') {
    return <span>扩展服务: {config.serverName || ''}<br />返回参数: {JSON.stringify(variables || {}, null, 2)}</span>
  } else if (item.type == 'gateway') {
    const branch = config.branch?.filter((b: any) => isBoolean(b.logic) ? b.logic : false)
    if (branch?.length > 1) return node?.title || ''
    const cond = branch?.[0]?.conditionText
    const text = cond || some(config.branch, (b: any) => b.conditionText) ? <span>  条件：{cond ? cond : '默认'}</span> : ''
    return <span>{branch?.[0]?.isCond ? '' : node?.title}{text}</span>
  } else if (item.type == 'callBigModel') {
    const model = config?.model || {}
    const name = model.modelName || model.modelkey
    const providerMap = {
      volcengine: '火山引擎'
    }
    const provider = providerMap[model.provider] || model.provider
    return <>
      <span className='mr-2'>厂商：{provider}</span>
      模型：{name}<br />{JSON.stringify({ content: variables?.content }, null, 2)}
    </>
  } else if (item.type == 'subflowResponse') {
    return <>子流程响应 参数：{JSON.stringify(variables?.data || {}, null, 2)}</>
  } else if (item.type == 'setGlobalVariable') {
    const typeMap = {
      set: '设置变量',
      del: '删除变量',
      get: '查询变量值',
      listInsert: '列表插入元素',
      listDel: '删除列表元素',
      listUpdate: '更新列表元素',
      listGet: '查询列表元素',
      hashSet: '设置键值对',
      hashDel: '删除键值对',
      hashGet: '查询键值对'
    }
    const type = typeMap[config.type]
    let content
    if (config.type == 'set') {
      content = <>变量值：{JSON.stringify(variables?.variables || {}, null, 2)}</>
    } else if (['get', 'listGet', 'hashGet'].indexOf(config.type) > -1) {
      content = <>查询结果：{JSON.stringify(variables?.value || {}, null, 2)}</>
    } else if (['del', 'listDel', 'hashDel'].indexOf(config.type) > -1) {
      const nameMap = { del: config.getAndDel?.name, listDel: config.list?.name, hashDel: config.hash?.name }
      let name = nameMap[config.type]
      if (config.type == 'listDel') {
        if (config.list?.position == 'index') {
          content = <>删除变量{name}中的第{config.list?.index || 0}个元素</>
        } else {
          const p = getOtherSpotMap().find(m => m.value == config.list?.position)?.label || ''
          content = <>删除变量{name}中的{p}</>
        }
      } else if (config.type == 'hashDel') {
        content = <>删除变量{name}中的{config.hash?.key || ''}</>
      } else {
        content = <>删除变量：{name}</>
      }
    } else if (['listInsert', 'listUpdate', 'hashSet'].indexOf(config.type) > -1) {
      const tMap = { listInsert: '插入元素', listUpdate: '更新元素', hashSet: '更新元素' }
      const nameMap = { listInsert: config.list?.name, listUpdate: config.list?.name, hashSet: config.hash?.name }
      const kMap = { listInsert: 'list.value', listUpdate: 'list.updateValue', hashSet: 'hash.value' }
      content = <>变量{nameMap[setting.type] || ''} {tMap[setting.type]}值：{JSON.stringify(get(config, kMap[config.type]) || {}, null, 2)}</>
    }
    return <>{type} {content}</>
  } else if (item.type == 'datetimeHelper') {
    let result = variables.result || ''
    if (['duration', 'durationDay'].indexOf(config.type) > -1) {
      const years = variables.years ? variables.years + '年' : ''
      const months = variables.months ? variables.months + '年' : ''
      const days = variables.days ? variables.days + '天' : ''
      const hours = variables.hours ? variables.hours + '分钟' : ''
      const minutes = variables.minutes ? variables.minutes + '分钟' : ''
      const seconds = variables.seconds ? variables.seconds + '秒' : ''
      const milliseconds = variables.milliseconds ? variables.milliseconds + '毫秒' : ''
      result = years + months + days + hours + minutes + seconds + milliseconds
    }
    const typeOptions = {
      dateFormat: '日期格式化',
      currentTime: '获取当前时间',
      specifiedTime: '获取指定时间',
      weekday: '获取星期几',
      isWeekend: '是否为周末',
      isDateInRange: '判断是否在指定日期范围内',
      isTimeInRange: '判断是否在指定时间范围内',
      duration: '计算两个日期间隔的时间',
      durationDay: '计算两个日期间隔的天数'
    }
    return <span>{typeOptions[config.type]} 结果：{result}</span>
  } else {
    return node?.title || ''
  }
}

/**
 * 获取触发流程数据
 * @param item 日志数据
 * @param items 所有日志数据
 * @returns 触发流程数据
 */
const getFlowTriggerData = (item: FlowElement, items: FlowElement[] = [], logRender?: Element | React.ReactNode): string | React.ReactNode => {
  const variables = item.variables?.[item.elementId || ''] || item.variables || {}
  const setting = item.setting || {}
  const node = flowNodes[flowTypeMap[item?.type] || item?.type]

  if (isEmpty(setting) && isEmpty(variables) && node) {
    return node.title || ''
  }
  if (isFunction(logRender) && getIsStartNode(node)) {
    const Com = logRender
    return <Com {...item} __mock__={item.variables?.__mock__} variables={variables} />
  }
  if (item.type == 'nodeData' || item.type == 'modelData') {
    const modelId = variables['#$table']?.id
    const nodeId = variables['#$tableData']?.id
    const dataPoint = omit(variables[nodeId || ''] || variables, ['#$department', '#$table', '#$tableData', 'time']) || {}
    const pointId = keys(dataPoint) || []
    let modelName = ''
    let nodeName = ''
    let pointName: string[] = []
    setting.tags && setting.tags.forEach((tag: any) => {
      if (modelId && tag.table?.id == modelId) modelName = tag.table.name
      if (nodeId && tag.tableData?.id == nodeId) nodeName = tag.tableData.name
      const pointKey = pointId.find((p: string) => tag?.id == p)
      if (pointId.indexOf(tag.id) > -1) pointName = [...pointName, `${tag.name || ''}(${tag.id}):${variables[pointKey] ?? ''}`]
    })
    const pName = !isEmpty(pointName) ? uniq(pointName)?.join('，') : ''
    return item.type == 'nodeData' ? nodeId && `${nodeName}(${nodeId}) - ${pName}` : nodeId && `${modelName}(${nodeId}) - ${pName}`
  } else if (item.type == 'boot') {
    return `${variables.serviceName}启动`
  } else if (item.type == 'login') {
    return `${variables.userName || variables['#$user']?.name || ''}登录`
  } else if (item.type == 'warning') {
    const warning = variables['#$tableData'] ? variables : values(variables).filter((v: any) => isPlainObject(v))?.[0] || {}
    const tableData = warning['#$tableData'] || {}
    const tableName = setting.table?.find((t: any) => t.id == warning['#$table']?.id)?.title || warning['#$tableData']?._tableName || ''
    const tableDataName = setting.dataPoint?.[0]?.tableData?.name || ''
    if (setting.majorType == 'commonTable') {
      return `普通表报警: ${setting.table?.map((v: any) => v?.title)?.join('、') || ''} ${warning.desc || ''}`
    }
    return `${tableName ? tableName + ' - ' : ''} ${tableDataName} (${tableData.id || ''}) ${warning.desc || ''}`
  } else if (item.type == 'command') {
    const cmdName = variables.cmdName || values(variables)[0]?.cmdName || ''
    const cmdStatus = setting.cmdStatus || ''
    const status = cmdStatus == 'send' ? '已发送' : cmdStatus == 'success' ? '成功' : cmdStatus == 'fail' ? '失败' : ''
    return `${setting.table?.title || ''} - ${variables['#$tableData']?.name || ''}(${variables['#$tableData']?.id || ''}) ${cmdStatus == 'send' ? '' : '执行'}${cmdName + status}`
  } else if (item.type == 'worksheetRecord') {
    const tableName = setting.table?.title || setting.table?.name || ''
    return <span>{variables.extFlowType || ''} - 表名({tableName}) 记录id: {variables.id}</span>
  } else if (item.type == 'worksheet') {
    const tableName = variables['#$table']?.title || ''
    return <span>{variables.type || ''} - 表名({tableName})</span>
  } else if (item.type == 'schedule') {
    const selectType = setting.selectType
    return selectType == 'period' ? `周期触发 - ${variables.interval || ''}` : '仅执行一次'
  } else if (item.type == 'driverEvent') {
    const table = setting.table?.title || ''
    const tableData = setting.tableData?.name || ''
    return `${table ? table + ' - ' : ''}${tableData ? tableData + '(' + setting.tableData?.id + ')' : ''} 事件: ${setting.event?.name || ''}`
  } else if (item.type == 'logEvents') {
    const { diff, userName, time, type } = variables || {}
    if (diff) return <span dangerouslySetInnerHTML={{ __html: diff }} />
    return <>{userName}于{dayjs(time).format('YYYY-MM-DD HH:mm:ss')}进行了{type}</>
  } else if (item.type == 'manualTrigger') {
    return <>手动触发 参数：{JSON.stringify(omit(variables, ['__triggerType__', '__user__']), null, 2)}</>
  } else if (item.type == 'mediaEvent') {
    const { flowTriggerUserMap, name } = variables || {}
    return <>{flowTriggerUserMap?.['#$user']?.name || ''}上传了媒体文件{name}</>
  } else if (item.type == 'subflowTrigger') {
    const name = item.variables?.__mock__ ? '' : <>--主流程：{variables?.mainFlowName || ''}</>
    return <>子流程触发{name}</>
  } else {
    const revertScope = items?.reduce((p: string[], c: FlowElement) => {
      if (c.type == 'flowUserApprove' && c.variables?.revertScope) {
        return [...p, c.variables.revertScope]
      }
      return p
    }, []) || []
    const isRevert = items?.some((d: FlowElement) => d.elementId == item.elementId && revertScope.indexOf(d.elementId || '') > -1 && d.id != item.id)
    const text = getFlowNodeData(item, logRender)
    return isRevert ? <span>{text} （回退后处理）</span> : text
  }
}

const getFlowData = (item: FlowElement, items?: FlowElement[], logRender?: Element | React.ReactNode): React.ReactNode => {
  return (
    <>
      {getFlowTriggerData(item, items, logRender)}
      {item.variables?.__mock__ && <Badge variant="secondary" size="sm" style={{ marginLeft: 5 }} className="trigger-title">调试</Badge>}
    </>
  )
}

export { getNodeData, getFlowData, getFlowNodeData, flowTypeMap, uuid, getIsStartNode }
