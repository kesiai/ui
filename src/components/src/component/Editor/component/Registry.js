// 【注册中心】
// 解决关联字段循环调用问题
// 用于存储所有组件的 schema，提供注册和获取方法（类似 “中间层”）

const widgetSchemaMap = new Map(); // 存储 schema 的映射表

const registerWidgetSchema = (type, schema) => {
  widgetSchemaMap.set(type, schema);
};

const getWSchema = (type) => {
  return widgetSchemaMap.get(type);
};

export {
  registerWidgetSchema,
  getWSchema
}