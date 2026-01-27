import app from 'xadmin'
import custom from './custom'
import relate from './relate'
import tableSchema from './component/Editor'
import fieldRules from './component/FieldRules'
import interfaceTab from './component/InterfaceTab'
import Permission from './component/Permission'
import Mapping from './component/Mapping'
import Classes from './component/Classes'

export default app
.use(custom)
.use(relate)
.use(tableSchema)
.use(fieldRules)
.use(interfaceTab)
.use(Permission)
.use(Mapping)
.use(Classes)