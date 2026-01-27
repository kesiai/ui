export default {
  name: 'airiot.plugin.tableMapping',
  plugins: {
    name: _r('映射表'),
    key: 'tableMapping',
    pluginGroup: _r('表类型相关'),
    conflict: ['syncSettings', 'dataSource', 'tableArchive', 'tableClear'],
    noCancel: (schema) => schema?.tableType === 'view',
    useSetting: (props) => {
      return { element: <>
        <div style={{ marginTop: 60, textAlign: 'center' }}>{_t1('映射表添加成功，请到表定义页面进行字段同步')}</div>
      </> }
    },
    description: {
      content: _r(`【映射表】功能应用后，可实现数据库中表字段和表记录与平台的同步展示。用户进入表定义并点击配置同步按钮，以完成同步操作。同步类型涵盖数据库表同步和数据库视图表同步，不同的表类型具有不同的同步逻辑。`),
      remark: [
        _r('数据库表记录映射至平台后，用户可编辑、删除和新增表记录；而数据库视图表记录映射后，用户则无法进行编辑、删除和新增操作。'),
        _r('同步过来的字段无法进行删除，且其属性中的标识亦不可修改。'),
        _r('一旦使用映射表功能，已安装的【数据同步】、【数据接口】、【归档】、【清除】功能将自动取消应用。'),
        _r('当表标识与数据库视图表一致时，映射的字段无法进行删除，亦不可更改为【设备表】、【组织表】、【数据分析表】。即使更改为普通表，用户也无法进行字段的新增或删除操作。'),
        _r('若表标识与数据库表标识一致，字段同样不可删除。即使修改为其他表类型，用户仍可进行字段的新增操作，但无法进行字段的删除。'),
      ]
    }
  }
}
