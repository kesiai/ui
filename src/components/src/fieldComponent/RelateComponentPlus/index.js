import { RelateModelSelect, RelateMultiSelect, RelateSelect, DetailShow } from '../../relate'
import UserRoleComponent from '../UserRoleComponent'
import AddRecordBtn from "./AddRecordBtn"
import DataShow from './DataShow'

const DataSelect = (props) => {
  const { relateSchema } = props

  let SelectComp = RelateModelSelect
  if (['User', 'Role'].indexOf(relateSchema.relateTo) > -1 && relateSchema.recordSelectType === 'select') {
    SelectComp = UserRoleComponent
  } else if (relateSchema.recordSelectType === 'select' && relateSchema.selectType === "single") {
    SelectComp = RelateSelect
  } else if (relateSchema.recordSelectType === 'select' && relateSchema.selectType === "multiple") {
    SelectComp = RelateMultiSelect
  }

  let selectP = {}
  if (relateSchema.recordSelectType === 'modal' && ['card', 'table'].indexOf(relateSchema.showType) > -1) {
    selectP.inputType = 'button'
  }
  if (relateSchema.recordSelectType === 'modal') {
    selectP.selectType = relateSchema.selectType
  }
  if (['User', 'Role'].indexOf(relateSchema.relateTo) > -1 && relateSchema.recordSelectType !== 'select') {
    selectP.field = {
      ...props.field,
      displayField: relateSchema.showField
    }
    selectP.schema = {
      ...props.schema,
      name: 'core/' + props.schema.name
    }
  }
  if (_.isBoolean(props.meta?.data?.disabled)) {
    selectP.disabled = props.meta.data.disabled
    selectP.relateSchema = {
      ...relateSchema,
      editDisabled: props.meta.data.disabled,
      createDisabled: props.meta.data.disabled
    }
  }

  return <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
    <SelectComp {...props} {...selectP} />
    <AddRecordBtn {...props} />
  </div>
}

const RelateComponentPlus = (props) => {
  return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', width: '100%' }}>
    <DataSelect {...props} />
    <DataShow {...props} />
  </div>
}

export default RelateComponentPlus
