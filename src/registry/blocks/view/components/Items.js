import React from 'react'
import _ from 'lodash'
import { utils } from 'xadmin-model'
import { app, Block, use } from 'xadmin'
import { _t } from 'xadmin-i18n'
import { SchemaForm } from 'xadmin-form'
import { C, Loading } from 'xadmin-ui'

const { getFieldProp } = utils

import { 
  ChevronUp, 
  ChevronDown, 
  CircleX,
  Edit,
  Inbox,
  Trash
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  PopoverRoot, PopoverTrigger, PopoverContent,
  Spin, Label, Popconfirm, 
  Tooltip,
  Button
} from 'xui'

import Table from './DataTable'

const ItemEditFormLayout = (props) => {
  const { children, pristine, invalid, handleSubmit, submitting } = props
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-2">
      {children}
      <Button htmlType="submit" disabled={submitting || pristine || invalid} size="sm" className="w-full">{submitting && <Spin />}{_t('Change')}</Button>
    </form>
  )
}

const ItemEditForm = props => {
  const { item, field, value, schema, onClose } = props
  const { model } = use('model')
  const { saveItem } = use('model.save', props)

  const getSchema = () => {
    const formField = _.find(model.form || [], obj => obj && obj.key == field ) || { key: field }
    const required = (model.required || []).indexOf(field) >= 0 ? { required: [ 'value' ] } : {}
    return {
      type: 'object',
      properties: {
        value: schema
      },
      form: [ { ...formField, key: 'value' } ],
      ...required
    }
  }

  const [ formSchema, setFormSchema ] = React.useState(getSchema)

  React.useEffect(() => {
    setFormSchema(getSchema())
  }, [ model, field, schema ])
  
  return (
    <SchemaForm
      initialValues={{ id: item['id'], value }}
      schema={formSchema}
      option={{ group : C('Form.InlineGroup') }}
      onSubmit={(values) => saveItem({
        id: values.id,
        [field]: values.value
      }, true)}
      onSubmitSuccess={() => onClose()}
      component={ItemEditFormLayout}/>
  )
}

const Item = props => {
  const { item, field, wrap, ...itemProps } = props
  const { value, schema, componentClass, editable } = use('model.list.item', props)
  
  const RawWrapComponent = wrap || 'span'
  const WrapComponent = editable ? RawWrapComponent : ({ children, ...props }) => {
    const [ edit, setEdit ] = React.useState(false)
    return (
      <RawWrapComponent {...props}>
        <div class="group flex justify-between">
          {children} 
          <PopoverRoot
            open={edit}
            onOpenChange={setEdit}
          >
            <PopoverTrigger asChild><Edit className='w-4 h-4 text-gray-400 group-hover:block cursor-pointer' /></PopoverTrigger>
            <PopoverContent className="w-auto" side="right" align="start">
              <C is="Model.ItemEditForm" item={item} field={field} value={value} schema={schema} onClose={()=>setEdit(false)} />
            </PopoverContent>
          </PopoverRoot>
        </div>
      </RawWrapComponent>
    )
  }

  if(item == undefined || item == null) {
    return <WrapComponent><span className="text-muted">{_t('Null')}</span></WrapComponent>
  }

  if(componentClass) {
    const ItemComponent = componentClass
    return <ItemComponent item={item} value={value} field={field} schema={schema} wrap={WrapComponent} {...itemProps} />
  } else {
    return <WrapComponent>{value == undefined || value == null?<span className="text-muted">{_t('Null')}</span>:value}</WrapComponent>
  }
  
}

const Header = props => {
  const { showText, field } = props
  const { title } = use('model.list.header', { field })
  const { order, canOrder, changeOrder } = use('model.list.order', { field })

  const renderOrder = () => {
    let orderItems = []

    if(canOrder) {
      orderItems = [
        <DropdownMenuItem onClick={e=>{ changeOrder('ASC') }} key="ASC"><ChevronUp /> {_t('Sort ASC')}</DropdownMenuItem>,
        <DropdownMenuItem onClick={e=>{ changeOrder('DESC') }} key="DESC"><ChevronDown/> {_t('Sort DESC')}</DropdownMenuItem>
      ]
      if(order != '') {
        orderItems.push(<DropdownMenuItem onClick={e=>{ changeOrder('') }}><CircleX /> {_t('Clear order')}</DropdownMenuItem>)
      }
    }
    return orderItems
  }
  const icon = {
    'ASC' : <ChevronUp className='inline w-4 h-4' />,
    'DESC' : <ChevronDown className='inline w-4 h-4' />
  }[order] || ''
  const items = [ ...renderOrder(), ...(Block('model.list.header.menu') || []) ]
  
  return (items.filter(item=>!_.isNil(item)).length>0) ? (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <a className='cursor-pointer'>{title} {icon}</a>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {items}
      </DropdownMenuContent>
    </DropdownMenu>
  ) : ( showText === false ? null : <span>{title} {icon}</span>)

}

const useActions = props => {
  const { renderActions } = use('model.actions')
  return <div className="flex justify-center">{renderActions(props)}</div>
}

const useList = render => props => {
  const state = { ...props, ...use('model.list'), ...use('model') }
  const { loading, items, model } = state
  const list = render(state)

  if(loading) {
    return <Loading>{items.length > 0 ? list : null}</Loading>
  } else {
    if(items.length > 0) {
      return list
    } else {
      const EmptyComponent = model.components && model.components.DataEmpty
      if(EmptyComponent) {
        return <EmptyComponent />
      } else {
        return <div className="rounded-md border p-8 flex flex-col gap-y-4 items-center"><Inbox className='w-12 h-12 text-gray-400' /><Label>{_t('No Data')}</Label></div>
      }
    }
  }
}

const DataTableActionRender = props => {
  return <div className='w-full'>{useActions({ ...props, ...use('model.list.row', { id: props.id }) })}</div>
}

const DataTable = useList(({ model, items, fields, size, onRow }) => {
  const { selected, onSelect, onSelectAll } = use('model.select')
  const { actions } = use('model.actions')
  const { actions: batchActions } = use('model.batchActions')

  const lockedFields = model.lockedFields || []
  const columns = []

  fields.forEach((fieldName)=> {
    const field = getFieldProp(model, fieldName)
    if(!field) return
    
    const column = {
      field,
      width: field.width || undefined,
      fixed: lockedFields.indexOf(fieldName) >= 0,
      title: <Header key={`model-list-header-${fieldName}`} field={fieldName} />,
      key: fieldName,
      dataIndex: fieldName,
      render: (value, item) => {
        return <C is="Model.DataItem" item={item} field={fieldName} inList={true} />
      },
      ...field.column
    }
    if(field.level2) {
      if(columns.length > 0 &&
        columns[columns.length - 1].children !== undefined &&
        columns[columns.length - 1].title == field.level2 ) {
        columns[columns.length - 1].children.push(column)
      } else {
        columns.push({
          title: field.level2,
          children: [ column ]
        })
      }
    } else {
      columns.push(column)
    }
  })

  if(actions && actions.length > 0)
    columns.push({
      title: '',
      key: '__action__',
      fixed: 'right',
      render: (val, item) => <DataTableActionRender key={item.id} fields={fields} id={item.id} />
    })

  const rowSelection = batchActions && batchActions.length > 0 ? {
    selectedRowKeys: selected.map(r => r.id),
    onSelect, onSelectAll
  } : undefined

  const tableProps = model.dataTableProps ? (
    typeof model.dataTableProps == 'function' ? 
      model.dataTableProps(columns, items) : model.dataTableProps
  ) : {}

  return (
    <Table
      columns={columns}
      dataSource={items}
      bordered
      size={size}
      rowSelection={rowSelection}
      pagination={false}
      onRow={onRow}
      rowKey="id"
      //scroll={{ x: 700 }}
      {...tableProps}
    />
  )
})

const DataListRender = props => {
  const { id, fields } = props
  const { item, selected } = use('model.list.row', { id })
  const Item = C('Model.DataItem')
  
  return (
    <div className="flex flex-col p-4 border-b last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col">
          <div className="font-medium">
            <Item item={item} field={fields[0]} value={item[fields[0]]} selected={selected} />
          </div>
          <div className="text-gray-500 text-sm">
            <Item item={item} field={fields[1]} value={item[fields[1]]} selected={selected} />
          </div>
        </div>
        <div className="flex space-x-2">
          {useActions(props)}
        </div>
      </div>
      <div className="mt-2 space-y-2">
        {React.Children.toArray(fields.slice(2).map(field => (
          <Item 
            item={item} 
            field={field} 
            value={item[field]} 
            selected={selected} 
            inList={true} 
            wrap={({ children, ...props }) => (
              <div key={`item-${item.id}-${field}`} className="flex justify-between" {...props}>
                {children}
              </div>
            )} 
          />
        )))}
      </div>
    </div>
  )
}

const DataList = useList(({ model, items, fields, size }) => {
  const RenderItem = (model.components && model.components.DataListRender) || C('Model.DataListRender') || DataListRender
  return (
    <div className="rounded-md border p-4 shadow-sm">
      <div className="flex flex-col divide-y">
        {items.map(item => (
          <RenderItem key={item.id} fields={fields} id={item.id} />
        ))}
      </div>
    </div>
  )
})

const DataCard = DataTable

const ActionEdit = props => {
  const { canEdit } = use('model.permission')
  const { onEdit } = use('model.event')

  if(canEdit) {
    return (
      <Tooltip key="action-edit" title={_t('Edit')}>
        <Button size="xs" variant="ghost" onClick={() => onEdit(props.id)}>
          <Edit />
        </Button>
      </Tooltip>
    )
  }

  return null
}

const ActionDelete = props => {
  const { canDelete } = use('model.permission')
  const { deleteItem } = use('model.delete', props)

  if(canDelete) {
    return (
      <Popconfirm title={_t('Comfirm Delete') + '?'} onConfirm={()=>deleteItem()} okText={_t('Delete')} cancelText={_t('Cancel')}>
        <Tooltip key="action-delete" title={_t('Delete')}>
          <Button size="xs" variant="ghost" className="text-red">
            <Trash />
          </Button>
        </Tooltip>
      </Popconfirm>
    )
  }

  return null
}

export default DataTable
export {
  Item, Header, DataTable, DataList, DataCard, ActionEdit, ActionDelete, ItemEditForm
}
