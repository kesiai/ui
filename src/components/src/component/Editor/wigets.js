import Icon from './component/Icon'
import { app } from 'xadmin'
import React from 'react'

/** 
 * title: 显示的标题以及初始化名称
 * type:  schema类型
 * name:  生成唯一标识前缀
 * config: 每项类型，根据类型找到对应的formSchema
 * category：控件分类
 * icon:  左侧添加面板图标
 * hiddenInTable: 表格控件添加字段是隐藏
 *  */
const getWidgets = (_t1, hideScript) => {
  // 可扩展控件
  const other = app.get('customWidgets')?.map(th => ({
    ...th,
    title: _t1(th.title),
    category: th.category,
  }))
  let widgets = [
    {
      title: _t1('文本'),
      type: 'string',
      name: 'text',
      config: '文本',
      category: _r('基础控件'),
      icon: <Icon className="editor-source-icon" svg={require('./svg/文本.svg')} />
    },
    {
      title: _t1('数字'),
      type: 'number',
      name: 'number',
      config: '数字',
      category: _r('基础控件'),
      icon: <Icon className="editor-source-icon" svg={require('./svg/数字.svg')} />
    },
    {
      title: _t1('选择器'),
      type: 'string',
      name: 'select',
      config: '选择器',
      category: _r('基础控件'),
      icon: <Icon className="editor-source-icon" svg={require('./svg/选择器.svg')} />
    },
    {
      title: _t1('日期'),
      type: 'string',
      name: 'date',
      config: '时间',
      category: _r('基础控件'),
      icon: <Icon className="editor-source-icon" svg={require('./svg/日期.svg')} />
    },
    {
      title: _t1('日期范围'),
      type: 'string',
      name: 'dateRange',
      config: '日期范围',
      category: _r('基础控件'),
      icon: <Icon className="editor-source-icon" svg={require('./svg/日期范围.svg')} />
    },
    {
      title: _t1('时间'),
      type: 'string',
      name: 'time',
      config: '时间2',
      category: _r('基础控件'),
      icon: <Icon className="editor-source-icon" svg={require('./svg/时间.svg')} />
    },
    {
      title: _t1('布尔值'),
      type: 'boolean',
      name: 'boolean',
      config: '布尔值',
      category: _r('基础控件'),
      icon: <Icon className="editor-source-icon" svg={require('./svg/布尔.svg')} />
    },
    {
      title: _t1('关联字段'),
      type: 'object',
      name: 'relate-table',
      config: '关联字段',
      category: _r('高级控件'),
      icon: <Icon className="editor-source-icon" svg={require('./svg/关联字段.svg')} />
    },
    {
      title: _t1('附件'),
      type: 'object',
      name: 'upload-single',
      config: '附件',
      category: _r('基础控件'),
      icon: <Icon className="editor-source-icon" svg={require('./svg/附件.svg')} />
    },
    {
      title: _t1('附件组'),
      type: 'array',
      name: 'upload-multiple',
      config: '附件组',
      category: _r('基础控件'),
      icon: <Icon className="editor-source-icon" svg={require('./svg/附件组.svg')} />
    },
    {
      title: _t1('定位'),
      type: 'object',
      name: 'map',
      config: '定位',
      category: _r('基础控件'),
      icon: <Icon className="editor-source-icon" svg={require('./svg/定位.svg')} />
    },
    {
      title: _t1('表格'),
      type: 'array',
      name: 'table',
      config: '表格',
      category: _r('高级控件'),
      hiddenInTable: true,
      icon: <Icon className="editor-source-icon" svg={require('./svg/表格.svg')} />
    },
    {
      title: _t1('编号'),
      type: 'string',
      name: 'serial-number',
      config: '编号',
      category: _r('高级控件'),
      hiddenInTable: true,
      icon: <Icon className="editor-source-icon" svg={require('./svg/编号.svg')} />
    },
    {
      title: _t1('链接'),
      type: 'string',
      name: 'link',
      config: '链接',
      category: _r('基础控件'),
      icon: <Icon className="editor-source-icon" svg={require('./svg/链接.svg')} />
    },
    {
      title: _t1('区域'),
      type: 'string',
      name: 'area',
      config: '区域',
      category: _r('基础控件'),
      icon: <Icon className="editor-source-icon" svg={require('./svg/区域.svg')} />
    },
    {
      title: _t1('星级评价'),
      type: 'number',
      name: 'rate',
      config: '星级评价',
      category: _r('高级控件'),
      icon: <Icon className="editor-source-icon" svg={require('./svg/星级评价.svg')} />
    },
    {
      title: _t1('富文本'),
      type: 'string',
      name: 'textEditor',
      config: '富文本',
      category: _r('高级控件'),
      icon: <Icon className="editor-source-icon" svg={require('./svg/富文本.svg')} />
    },
    {
      title: _t1('用户'),
      type: 'object',
      name: 'user',
      config: '用户',
      category: _r('基础控件'),
      hiddenInTable: true,
      icon: <Icon className="editor-source-icon" svg={require('./svg/用户.svg')} />
    },
    {
      title: _t1('字节数组'),
      type: 'string',
      name: 'bytesArray',
      config: '字节数组',
      category: _r('高级控件'),
      icon: <Icon className="editor-source-icon" svg={require('./svg/二进制-表定义.svg')} />
    },
    {
      title: _t1('查找引用'),
      type: 'array',
      name: 'reference',
      config: '查找引用',
      category: _r('高级控件'),
      hiddenInTable: true,
      icon: <Icon className="editor-source-icon" svg={require('./svg/查找引用.svg')} />
    },
    {
      title: _t1('表单信息'),
      type: 'string',
      name: 'html',
      config: '表单信息',
      category: _r('高级控件'),
      icon: <Icon className="editor-source-icon" svg={require('./svg/查找引用.svg')} />
    }
  ]
  if (hideScript) {
    widgets = widgets.filter(w => w.config !== '表单信息')
  }
  return [ ...widgets, ...other ]
}

export default getWidgets
