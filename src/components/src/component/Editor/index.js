import SchemaEditor from "./SchemaEditor"
import { C } from 'xadmin-ui'

export default {
  name: 'airiot.plugin.formschema',
  plugins: {
    name: _r('表定义'),
    key: 'formschema',
    useSetting: (props) => {
      return { element: <C is="AntdI18n"><SchemaEditor {...props} /></C> }
    }
  }
}
