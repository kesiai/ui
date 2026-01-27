import { C } from "xadmin-ui"

const defaultProperties = {
  "classesID": {
    "batchChangeFields": false,
    "canOrder": false,
    "config": "文本",
    "createShow": true,
    "descriptionType": "tooltip",
    "editShow": true,
    "fieldType": "input",
    "fixedField": true,
    "invalid": false,
    "key": "classesID",
    "listFields": true,
    "need": true,
    "size": "middle",
    "textContent": "text",
    "textType": "input",
    "title_en": "Shift number",
    "title": _r("班次编号"),
    "type": "string",
    "unique": true,
    "widthInForm": "24"
  },
  "classesName": {
    "batchChangeFields": false,
    "canOrder": false,
    "config": "文本",
    "createShow": true,
    "descriptionType": "tooltip",
    "editShow": true,
    "fieldType": "input",
    "fixedField": true,
    "invalid": false,
    "key": "classesName",
    "listFields": true,
    "need": true,
    "size": "middle",
    "textContent": "text",
    "textType": "input",
    "title_en": "Classes",
    "title": _r("班次"),
    "type": "string",
    "unique": true,
    "widthInForm": "24"
  },
  "endCycle": {
    "canOrder": false,
    "config": "选择器",
    "createShow": true,
    "dataType": "string",
    "descriptionType": "tooltip",
    "editShow": true,
    "enum1": [
      "now",
      "next"
    ],
    "enum_title1": [
      "当前周期",
      "下一周期"
    ],
    "fieldType": "select",
    "fixedField": true,
    "invalid": false,
    "key": "endCycle",
    "listFields": true,
    "metricStore": false,
    "need": true,
    "numRange": null,
    "selectFace": "select",
    "selectType": "single",
    "size": "middle",
    "title_en": "End cycle",
    "title": _r("结束周期"),
    "type": "string",
    "widthInForm": "24"
  },
  "endTime": {
    "allScript": "({\n  validateScript: (value, item, api, app) => {\n    if (item?.endCycle === 'next') return null\n    if (item?.startTime > value) return '结束时间不能早于开始时间'\n    return null\n  }\n})\n",
    "canOrder": false,
    "config": "时间2",
    "createShow": true,
    "descriptionType": "tooltip",
    "editShow": true,
    "fieldType": "timePicker",
    "fixedField": true,
    "invalid": false,
    "key": "endTime",
    "listFields": true,
    "need": true,
    "size": "middle",
    "textContent": "origin",
    "timeFormat": "HH:mm:ss",
    "title_en": "Endtime",
    "title": _r("结束时间"),
    "type": "string",
    "widthInForm": "24"
  },
  "startCycle": {
    "canOrder": false,
    "config": "选择器",
    "createShow": true,
    "dataType": "string",
    "descriptionType": "tooltip",
    "editShow": true,
    "enum1": [
      "before",
      "now",
      "after"
    ],
    "enum_title1": [
      "前一日",
      "当前日",
      "后一日"
    ],
    "fieldType": "select",
    "fixedField": true,
    "invalid": false,
    "key": "startCycle",
    "listFields": true,
    "metricStore": false,
    "need": true,
    "numRange": null,
    "selectFace": "select",
    "selectType": "single",
    "size": "middle",
    "title_en": "Start cycle",
    "title": _r("开始周期"),
    "type": "string",
    "widthInForm": "24"
  },
  "startTime": {
    "canOrder": false,
    "config": "时间2",
    "createShow": true,
    "descriptionType": "tooltip",
    "editShow": true,
    "fieldType": "timePicker",
    "fixedField": true,
    "invalid": false,
    "key": "startTime",
    "listFields": true,
    "need": true,
    "size": "middle",
    "textContent": "origin",
    "timeFormat": "HH:mm:ss",
    "title_en": "StartTime",
    "title": _r("开始时间"),
    "type": "string",
    "widthInForm": "24"
  }
}

export default {
  name: 'airiot.plugin.tableClasses',
  plugins: {
    name: _r('班次表'),
    key: 'tableClasses',
    pluginGroup: _r('表类型相关'),
    // conflict: ['syncSettings', 'dataSource', 'tableArchive', 'tableClear', 'Mapping'],
    // noCancel: (schema) => schema?.tableType === 'view',
    defaultProperties,
    useSetting: (props) => {
      return { element: <>
        <div style={{ marginTop: 60, textAlign: 'center' }}>
          <C is="NoData" description={_t1('班次表功能添加成功')} />
        </div>
      </> }
    },
    description: {
      content: _r(`【班次表】功能应用后，当前表即为班次表，表中内置班次编号、班次、以及班次开始周期、开始时间结束周期、结束时间等字段。通过这些字段，用户可以对每个班次进行详细定义和维护。应用后表的配置TAB会相应的增加一个`),
      remark: [
        _r('班次绑定'),
        _r('为方便数据统计，【班次表】可用于在报表(自由日报、小时报)、计算节点、画面历史数据源等功能模块中进行时间绑定。用户可以通过选择班次时间，灵活切换到对应班次的开始和结束时间，从而实现对某个班次的具体数据统计'),
      ]
    }
  }
}
