// Schema转换方法：将旧版本格式转换为新版本格式

/**
 * Config 值到 fieldType 的映射规则
 */
const CONFIG_TO_FIELD_TYPE_MAP: Record<string, string> = {
  '文本': 'text',
  '数字': 'number',
  '选择器': 'select',
  '时间': 'date',
  '日期范围': 'date-range',
  '时间2': 'text',
  '富文本': 'rich-text',
  '布尔值': 'boolean',
  '查找引用': 'reference',
  '表格': 'editable-table',
  '附件': 'upload',
  '附件组': 'upload',
  '区域': 'text',
  '星级评价': 'rate',
  '定位': 'map',
  '链接': 'link',
  '公式': 'formula',
  '编号': 'serial-number',
  '用户': 'user-role',
  '字节数组': 'bytes-array',
  '关联字段': 'relate-plus',
};

/**
 * 旧版本Schema属性分类
 * Schema中保留的核心属性（数据模型相关）
 */
const SCHEMA_CORE_FIELDS = [
  // 基础属性
  'type', 'key', 'title', 'name', 'properties', 'items', 'required',

  // 文本字段
  'textContent', 'jsLogic', 'minLength', 'maxLength',

  // 数字字段
  'dbType', 'decimal', 'min', 'max', 'metricStore',

  // 日期/时间字段
  'createForm', 'dateType', 'format', 'dateFormat', 'NullShow', 'timeFormat',

  // 选择器字段（这些属性在formSchema中，不在schema中）

  // 关联字段
  'relate', 'showField', 'relateShowFields', 'insideFilter',

  // 查找引用字段
  'searchRelate', 'searchCondition', 'computeMethod', 'sort',

  // 表格字段
  'tableFields', 'minCount', 'maxCount', 'fieldRules',

  // 附件字段
  'base64', 'autoName', 'addToken',

  // 附件组字段
  'maxUploadNum',

  // 区域字段

  // 星级评价
  'count',

  // 定位字段

  // 链接字段
  'linkType', 'pattern',

  // 编号字段
  'serialRules',

  // 用户字段
  'userType', 'relateTo',
];

/**
 * FormSchema中保留的属性（表单UI相关）
 */
const FORM_SCHEMA_FIELDS = [
  // 基础表单属性
  'key', 'name', 'type', 'fieldType',

  // 表单显示控制
  'createShow', 'editShow', 'detailNotShow', 'createDisabled', 'editDisabled',

  // 表单UI配置
  'defaultVal', 'placeholder', 'description', 'descriptionType',
  'widthInForm', 'size', 'unique',

  // 文本字段表单配置
  'textType', 'numRange', 'delBlank', 'languageType',

  // 数字字段表单配置
  'bitNum', 'unit', 'allScript',

  // 选择器字段表单配置
  'selectType', 'selectFace', 'dataType', 'select', 'numRange', 'allScript',

  // 日期字段表单配置
  'afterNow', 'allScript',

  // 布尔值字段表单配置
  'displayForm', 'manualChange', 'checkedChildren', 'unCheckedChildren', 'allScript',

  // 关联字段表单配置
  'selectType', 'recordSelectType', 'showType', 'allowSelectOld', 'allowAdd',
  'treeMark', 'recordDetail', 'allScript',

  // 表格字段表单配置
  'highTableFields', 'btnText', 'displayForm', 'cardLayout', 'showPagination',
  'uniqueRow', 'uniqueFields', 'createAddBtn', 'editAddBtn', 'createDelBtn', 'editDelBtn', 'allScript',

  // 附件字段表单配置
  'styleType', 'uploadPosition', 'mediaDelete', 'autoZip', 'size', 'width', 'height',
  'folderType', 'folder', 'onlyCamera', 'watermark', 'allScript',

  // 附件组字段表单配置
  'styleType', 'accept', 'uploadPosition', 'sort', 'canDownload', 'allScript',

  // 区域字段表单配置
  'areaType', 'placeholder', 'allScript',

  // 定位字段表单配置
  'showType', 'canEdit', 'allScript',

  // 编号字段表单配置
  'placeholder',

  // 过滤表单相关配置
  'filterFields', 'filterType', 'filterByRes', 'filterMode', 'filterFormat',
];

/**
 * TableSchema中保留的属性（列表UI相关）
 */
const TABLE_SCHEMA_FIELDS = [
  'key',
  'listFields', 'editableFields', 'batchChangeFields', 'canOrder', 'tableFixed',
  'filedFormat', 'numberLimit', 'numberFormat', 'showType', 'previewSize',
  'listShow', 'showNum', 'lngLat', 'positionName',
];

/**
 * 提取核心Schema字段
 */
function extractCoreSchema(fieldConfig: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key of SCHEMA_CORE_FIELDS) {
    if (fieldConfig[key] !== undefined) {
      result[key] = fieldConfig[key];
    }
  }

  // 特殊处理：size 属性
  // 对于附件字段，size 是文件大小限制，应在 schema 中
  if (fieldConfig.styleType || fieldConfig.maxUploadNum) {
    // 附件或附件组字段
    if (fieldConfig.size !== undefined) {
      result.size = fieldConfig.size;
    }
  }

  // 特殊处理：accept 属性
  // 对于附件字段，accept 是允许的文件格式，应在 schema 中
  // 但对于附件组字段（maxUploadNum 存在），accept 不在 schema 中
  if (fieldConfig.accept && !fieldConfig.maxUploadNum) {
    result.accept = fieldConfig.accept;
  }

  // 特殊处理：sort 属性
  // 对于附件组字段（maxUploadNum 存在），sort 不在 schema 中
  if (fieldConfig.maxUploadNum && fieldConfig.sort !== undefined) {
    delete result.sort;
  }

  // 特殊处理：need 属性
  // 区域字段（areaType）不应该在 schema 中包含 need
  if (fieldConfig.areaType) {
    delete result.need;
  } else if (fieldConfig.need !== undefined) {
    result.need = fieldConfig.need;
  }

  // 特殊处理：保留 properties 和 items（如果是对象或数组类型）
  if (fieldConfig.properties) {
    result.properties = fieldConfig.properties;
  }
  if (fieldConfig.items) {
    result.items = fieldConfig.items;
  }

  return result;
}

/**
 * 根据 config 值获取 fieldType
 */
function getFieldTypeFromConfig(config: string | undefined): string {
  if (!config) {
    return 'text'; // 默认值
  }
  return CONFIG_TO_FIELD_TYPE_MAP[config] || config;
}

/**
 * 提取FormSchema字段
 */
function extractFormSchema(fieldConfig: Record<string, any>, isFirstField: boolean): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key of FORM_SCHEMA_FIELDS) {
    if (fieldConfig[key] !== undefined) {
      result[key] = fieldConfig[key];
    }
  }

  // 确保有 key
  if (!result.key && fieldConfig.key) {
    result.key = fieldConfig.key;
  }

  // 设置 fieldType，基于 config 值
  result.fieldType = getFieldTypeFromConfig(fieldConfig.config);

  // type 可以设置为 fieldType 的值，或者根据需要保持原样
  // 这里我们保持原样，让用户根据需要处理

  // name 属性：只有第一个字段保留 name，其他字段删除
  if (isFirstField) {
    result.name = fieldConfig.name || fieldConfig.key;
    // 第一个字段中，如果 allScript 为 null，则删除
    if (result.allScript === null) {
      delete result.allScript;
    }
  } else {
    delete result.name;
  }

  // 清理 undefined 值，保留 null 值
  for (const key of Object.keys(result)) {
    if (result[key] === undefined) {
      delete result[key];
    }
  }

  return result;
}

/**
 * 提取TableSchema字段
 */
function extractTableSchema(fieldConfig: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key of TABLE_SCHEMA_FIELDS) {
    if (fieldConfig[key] !== undefined) {
      result[key] = fieldConfig[key];
    }
  }

  // 确保有 key
  if (!result.key && fieldConfig.key) {
    result.key = fieldConfig.key;
  }

  // 添加 fieldType 基于配置
  result.fieldType = getFieldTypeFromConfig(fieldConfig.config);

  return result;
}

/**
 * 转换Schema方法
 * @param oldSchema 旧版本的schema对象
 * @returns 新版本的schema对象，包含 schema, formSchema, tableSchema 三个部分
 */
export default function transformSchema(oldSchema: any): {
  schema: any;
  formSchema: any[];
  tableSchema: any[];
} {
  // 从旧schema中提取数据
  const { properties, form, listFields } = oldSchema;

  const result = {
    schema: {
      type: oldSchema.type,
      name: oldSchema.name,
      title: oldSchema.title,
      key: oldSchema.key,
      properties: {},
      required: oldSchema.required || [],
    },
    formSchema: [] as any[],
    tableSchema: [] as any[],
  };

  // 转换每个字段
  for (let i = 0; i < Object.keys(properties || {}).length; i++) {
    const [fieldKey, fieldConfig] = Object.entries(properties || {})[i];
    const config = fieldConfig as Record<string, any>;
    const isFirstField = i === 0;

    // 1. 提取核心Schema字段
    result.schema.properties[fieldKey] = extractCoreSchema(config);

    // 2. 提取FormSchema字段
    const formSchemaItem = extractFormSchema(config, isFirstField);
    if (formSchemaItem.key) {
      result.formSchema.push(formSchemaItem);
    }

    // 3. 提取TableSchema字段
    const tableSchemaItem = extractTableSchema(config);
    if (tableSchemaItem.key) {
      result.tableSchema.push(tableSchemaItem);
    }
  }

  // 按 form 中的顺序排序 formSchema
  if (form && Array.isArray(form)) {
    result.formSchema = sortByKeyOrder(result.formSchema, form);
  }

  // 按 listFields 中的顺序排序 tableSchema
  if (listFields && Array.isArray(listFields)) {
    result.tableSchema = sortByKeyOrder(result.tableSchema, listFields);
  }

  return result;
}

/**
 * 根据key顺序对数组进行排序
 */
function sortByKeyOrder(items: any[], keyOrder: string[]): any[] {
  const orderMap = new Map(keyOrder.map((key, index) => [key, index]));

  return [...items].sort((a, b) => {
    const aOrder = orderMap.get(a.key) ?? 9999;
    const bOrder = orderMap.get(b.key) ?? 9999;
    return aOrder - bOrder;
  });
}
