import ViewField from '@/registry/components/view-field/view-field'

/**
 * ViewField 使用示例
 * 展示各种字段类型的渲染效果
 */
export default function ViewFieldExample() {
  // 示例数据
  const exampleData = {
    // 基础字段
    text: '这是一段文本',
    textarea: '这是多行文本\n支持换行显示',
    number: 1234.5678,
    password: 'secret123',
    boolean: true,

    // 选择器
    selectSingle: 'active',
    selectMultiple: ['active', 'pending', 'inactive'],

    // 日期时间
    date: '2024-01-15',
    datetime: '2024-01-15T14:30:00+08:00',
    dateRange: '2024-01-01 - 2024-12-31',
    dateRangeForever: '2024-01-01 - ',
    time: '14:30:00',

    // 评分
    rate: 4,
    rateHigh: 8,

    // 富文本
    richText: '<p>这是<strong>富文本</strong>内容</p>',

    // 地图
    map: { lng: 116.404, lat: 39.915, name: '北京天安门' },

    // 链接
    link: 'https://example.com',

    // 附件
    upload: [
      {
        uid: '1',
        name: 'document.pdf',
        url: '/rest/media/document.pdf',
        status: 'done',
      },
      {
        uid: '2',
        name: 'image.png',
        url: '/rest/media/image.png',
        status: 'done',
      },
    ],

    // 可编辑表格
    editableTable: [
      { name: '张三', age: 25, score: 85 },
      { name: '李四', age: 30, score: 92 },
      { name: '王五', age: 28, score: 78 },
    ],

    // 公式
    formula: '计算结果：100',
    formulaObject: { a: 1, b: 2, c: 3 },
    formulaArray: ['item1', 'item2', 'item3'],

    // 查找引用
    reference: [
      { id: 1, productName: '产品A', quantity: 10 },
      { id: 2, productName: '产品B', quantity: 20 },
      { id: 3, productName: '产品C', quantity: 15 },
    ],
  }

  // Schema 定义
  const schemas = {
    // 基础字段
    text: { fieldType: 'text' },
    textarea: { fieldType: 'textarea' },
    number: {
      fieldType: 'number',
      decimal: 2,
      bitNum: 'compact',
    },
    password: { fieldType: 'password' },
    boolean: { fieldType: 'boolean' },

    // 选择器（带颜色标签）
    selectSingle: {
      fieldType: 'select',
      enum1: ['active', 'pending', 'inactive'],
      enum_title1: ['激活', '待处理', '未激活'],
      enum_color1: ['#10b981', '#f59e0b', '#6b7280'],
    },
    selectMultiple: {
      fieldType: 'select',
      enum1: ['active', 'pending', 'inactive'],
      enum_title1: ['激活', '待处理', '未激活'],
      enum_color1: ['#10b981', '#f59e0b', '#6b7280'],
    },

    // 日期时间
    date: {
      fieldType: 'date',
      filedFormat: 'YYYY-MM-DD',
    },
    datetime: {
      fieldType: 'date',
      filedFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    dateRange: {
      fieldType: 'dateRange',
      filedFormat: 'YYYY-MM-DD',
    },
    dateRangeForever: {
      fieldType: 'dateRange',
      filedFormat: 'YYYY-MM-DD',
      NullShow: 'forever',
    },
    time: {
      fieldType: 'time',
      filedFormat: 'HH:mm:ss',
    },

    // 评分
    rate: {
      fieldType: 'rate',
      count: 5,
    },
    rateHigh: {
      fieldType: 'rate',
      count: 10,
    },

    // 富文本
    richText: {
      fieldType: 'textEditor',
    },

    // 地图
    map: {
      fieldType: 'map',
    },

    // 链接
    link: {
      fieldType: 'link',
      linkType: 'out',
    },

    // 附件
    upload: {
      fieldType: 'attachment',
      styleType: 'text',
    },

    // 可编辑表格
    editableTable: {
      fieldType: 'editableTable',
      columns: [
        { key: 'name', title: '姓名' },
        { key: 'age', title: '年龄' },
        { key: 'score', title: '分数' },
      ],
    },

    // 公式
    formula: {
      textContent: 'logic',
      config: '公式',
    },
    formulaObject: {
      textContent: 'logic',
      config: '公式',
    },
    formulaArray: {
      textContent: 'logic',
      config: '公式',
    },

    // 查找引用
    reference: {
      config: '查找引用',
      searchRelate: {
        field: {
          key: 'productName',
          fieldSchema: {
            type: 'text',
          },
        },
      },
      sort: 'asc',
      numberLimit: 10,
    },
  }

  return (
    <div className="p-8 space-y-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">ViewField 组件示例</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">基础字段</h2>

        <ViewField
          name="text"
          label="文本"
          value={exampleData.text}
          schema={schemas.text}
        />

        <ViewField
          name="textarea"
          label="多行文本"
          value={exampleData.textarea}
          schema={schemas.textarea}
        />

        <ViewField
          name="number"
          label="数字"
          value={exampleData.number}
          schema={schemas.number}
        />

        <ViewField
          name="password"
          label="密码"
          value={exampleData.password}
          schema={schemas.password}
        />

        <ViewField
          name="boolean"
          label="布尔值"
          value={exampleData.boolean}
          schema={schemas.boolean}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">选择器</h2>

        <ViewField
          name="selectSingle"
          label="单选"
          value={exampleData.selectSingle}
          schema={schemas.selectSingle}
        />

        <ViewField
          name="selectMultiple"
          label="多选"
          value={exampleData.selectMultiple}
          schema={schemas.selectMultiple}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">日期时间</h2>

        <ViewField
          name="date"
          label="日期"
          value={exampleData.date}
          schema={schemas.date}
        />

        <ViewField
          name="datetime"
          label="日期时间"
          value={exampleData.datetime}
          schema={schemas.datetime}
        />

        <ViewField
          name="dateRange"
          label="日期范围"
          value={exampleData.dateRange}
          schema={schemas.dateRange}
        />

        <ViewField
          name="dateRangeForever"
          label="日期范围（长期）"
          value={exampleData.dateRangeForever}
          schema={schemas.dateRangeForever}
        />

        <ViewField
          name="time"
          label="时间"
          value={exampleData.time}
          schema={schemas.time}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">评分</h2>

        <ViewField
          name="rate"
          label="星级评价（5星）"
          value={exampleData.rate}
          schema={schemas.rate}
        />

        <ViewField
          name="rateHigh"
          label="星级评价（10级）"
          value={exampleData.rateHigh}
          schema={schemas.rateHigh}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">复杂字段</h2>

        <ViewField
          name="richText"
          label="富文本"
          value={exampleData.richText}
          schema={schemas.richText}
        />

        <ViewField
          name="map"
          label="地图定位"
          value={exampleData.map}
          schema={schemas.map}
        />

        <ViewField
          name="link"
          label="链接"
          value={exampleData.link}
          schema={schemas.link}
        />

        <ViewField
          name="upload"
          label="附件"
          value={exampleData.upload}
          schema={schemas.upload}
        />

        <ViewField
          name="editableTable"
          label="可编辑表格"
          value={exampleData.editableTable}
          schema={schemas.editableTable}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">公式字段</h2>

        <ViewField
          name="formula"
          label="公式字符串"
          value={exampleData.formula}
          schema={schemas.formula}
        />

        <ViewField
          name="formulaObject"
          label="公式对象"
          value={exampleData.formulaObject}
          schema={schemas.formulaObject}
        />

        <ViewField
          name="formulaArray"
          label="公式数组"
          value={exampleData.formulaArray}
          schema={schemas.formulaArray}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">查找引用</h2>

        <ViewField
          name="reference"
          label="关联产品"
          value={exampleData.reference}
          schema={schemas.reference}
          description="显示关联的产品名称，最多显示10条"
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">空值处理</h2>

        <ViewField
          name="emptyText"
          label="空文本"
          value={null}
          schema={schemas.text}
        />

        <ViewField
          name="emptyNumber"
          label="空数字"
          value={undefined}
          schema={schemas.number}
        />

        <ViewField
          name="emptySelect"
          label="空选择"
          value={null}
          schema={schemas.selectSingle}
        />
      </section>
    </div>
  )
}
