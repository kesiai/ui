import Permission from "./Permission"

export default {
  name: 'airiot.plugin.tablePermission',
  plugins: {
    name: _r('记录权限'),
    key: 'tablePermission',
    pluginGroup: _r('通用表功能'),
    useSetting: (props) => {
      return { element: <Permission {...props} /> }
    },
    description: {
      content: _r(`【记录权限】表功能应用后，可实现对当前表记录查看、添加及管理权限的限定，应用后表的配置TAB会相应的增加一个`)
    }
  }
}
