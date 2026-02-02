import React from 'react'
import _ from 'lodash'
import { Loading } from 'xadmin-ui'
import { schemaConvert } from 'xadmin-form'
import { 
  FormControl,
  FormItem,
  FormLabel,
 } from 'xui'
import { Item } from './Items'
import { use } from 'xadmin'

const FieldGroup = ({ label, field, children }) => {
  const attrs = field.attrs || {}
  const extra = field.description || field.help
  const size = (field.option && field.option.groupSize) || attrs.groupSize || { 
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 }
    }
  }

  const groupProps = { extra, ...size, required: field.required }
  return (
    <FormItem className='flex space-x-4 space-y-0'>
      <FormLabel className='w-1/6 h-9 flex items-center justify-end'>{label}</FormLabel>
      <div className='flex-2 pt-1.5'>
        {children}
      </div>
    </FormItem>
  )
}

const ModelInfo = ({ data, title, schema, model, loading, saveItem, ...formProps }) => {

  const renderFields = () => {
    return schemaConvert(model).fields.map(field => {
      field.option = { ...field.option, ...formProps }
      return (
        <FieldGroup key={field.key} label={field.label} field={field}>
          <Item item={data} field={field.key} value={data[field.key]} inList={false} selected={false} wrap={
            ({ children })=> children
          }/>
        </FieldGroup>)
    })
  }

  return loading ? <Loading/> : 
    (<div className="rounded-md border p-4 space-y-2">{renderFields()}</div>)
}

export default (props) => <ModelInfo {...props} {...use('model.get', props)} />
