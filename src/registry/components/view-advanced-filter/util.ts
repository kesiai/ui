import _ from 'lodash'
import METHODS from './Methods'

// 将schema.properties转换成数组形式
const convertProps = (properties: any, form?: any) => {
  let ops: any[] = []
  let list: string[] = []
  // 和表单显示顺序统一
  if (form && !(form.length == 1 && form[0] == '*')) {
    list = form.includes('*')
      ? _.uniq([...(form.filter((item: any) => item !== '*').map((item: any) => item.key ?? item) || []), ..._.keys(properties)])
      : form.map((item: any) => item.key ?? item)
  } else {
    list = _.keys(properties)
  }
  const parseProps = (propertKeys: string[], properties: any, prefix?: any) => propertKeys.map(item => {
    const prev = properties[item] || {}
    if (prev.userType || prev.fieldType == 'user') {
      prev.relateTo = 'User'
    }
    if (prev.relateTo || prev.relate) {
      prev.properties = {}
    }
    const title = prev.title
      ? prefix && prefix.title
        ? prefix.title + '-' + prev.title
        : prev.title
      : null
    // 过滤无名称属性
    title && ops.push({
      ...prev,
      title,
      key: prefix && prefix.key ? prefix.key + '.' + item : item,
    })
  })
  parseProps(list, properties)
  return ops
}

const getMethods = (schema: any, fieldKey: string) => {
  const filters = schema.filters ? _.map(schema.filters, (val: any) => val)?.reduce((a: any, b: any) => a.concat(b)) : []
  const filterSchema = filters.find((v: any) => v.key == fieldKey && v.component)
  const f = fieldKey.replace('.', '.properties.')
  const fieldSchema = _.omit(_.get(schema.properties, f), 'filterByRes') || {}
  const properties = convertProps(schema.properties)
  const ops = properties.filter((item: any) => item.key != 'model' && item.key != 'dashboard')
  const prop = _.find(ops, (v: any) => (v.key || v.id) == fieldKey)
  let methods: Array<Object>
  if (prop) {
    if ((prop.enum || prop.enum1) && prop.type == 'string') { // 区域 和单选选择器
      methods = METHODS['enum']
    } else if (prop.type == 'array' && (fieldSchema.fieldType || fieldSchema.component || fieldSchema.field?.component || fieldSchema.relateTo || fieldSchema.relate)) {
      methods = METHODS['relateArray']
    } else if (prop.selectType == 'multiple' || ['attachments', 'attachment', 'map', 'parentnode'].indexOf(fieldSchema.fieldType) > -1) { // 定位、附件、附件组等特殊类型
      methods = METHODS['other']
    } else if ((prop.type == 'object' && fieldSchema.fieldType) || fieldSchema.relateTo) {
      methods = METHODS['relateTo']
    } else if (prop.type == 'object' && (fieldSchema.fieldType || fieldSchema.component || fieldSchema.relateTo || fieldSchema.relate)) {
      methods = METHODS['relateTo']
    } else if (filterSchema) {
      methods = METHODS['relate']
    } else if (fieldSchema.fieldType === 'area') { // 区域 和单选选择器
      methods = METHODS['area']
    } else if (fieldSchema.fieldType === 'textEditor') { // 富文本
      methods = METHODS['string'].filter((m: any) => ['contains', 'notContains', 'isNull', 'notNull'].indexOf(m.key) > -1)
    } else {
      const format = ['date', 'datetime', 'date-time', 'time']
      if (format.includes(prop.format) || prop.timeFormat || prop.fieldType == 'datePicker' || prop.fieldType == 'timePicker') {
        methods = METHODS['date']
      } else {
        methods = METHODS[prop.type as keyof typeof METHODS] || METHODS['other']
      }
    }
    if (prop.related == 'department') {
      methods = methods?.filter((m: any) => m.key !== 'isNull' && m.key !== 'notNull')
    }
    if (fieldSchema.filterMethodFn) {
      const filterMethods = fieldSchema.filterMethodFn(methods)
      return filterMethods.map((m: any) => !methods.some((m1: any) => m1.key == m.key) && m.component ? { ...m, useCustomCom: true } : m)
    }
    return methods
  } else {
    return []
  }
}


export { convertProps, getMethods }
