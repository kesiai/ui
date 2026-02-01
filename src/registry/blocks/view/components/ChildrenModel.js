import React from 'react'
import _ from 'lodash'
import app, { use } from 'xadmin'
import { _t } from 'xadmin-i18n'
import { Button, 
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
 } from 'xui'
import { SchemaForm } from 'xadmin-form'
import { Model } from 'xadmin-model'
import { C } from 'xadmin-ui'

const ChildrenModel = props => {
  const [ show, setShow ] = React.useState(false)
  const { parent, model, refFilter, refData, refField, modelProps, children, header, value, onClose, refreshTimeout, ...extProps } = props
  
  const handleCancel = () => {
    setShow(false)
    onClose && onClose()
  }

  const cmodel = _.isString(model) ? app.get('models')[model] : model
  const schema = {
    ...cmodel,
    parent,
    itemActions: [
      ...(cmodel.itemActions || []),
      item => <EditChildrenModelBtn id={item.id} refData={refData} refreshTimeout={refreshTimeout}>{_t('Edit')}</EditChildrenModelBtn>
    ],
    permission: {
      ...cmodel.permission,
      edit: false,
      childEdit: cmodel.permission && cmodel.permission.edit
    },
    ...modelProps
  }
  const initialValues = {
    wheres: { filters: refFilter || { [refField]: parent.id } }
  }

  const action = children && !_.isString(children) && React.isValidElement(children) ?
    React.cloneElement(children, { onClick: () => setShow(true) }) : 
    <Button size="xs" variant="ghost" key="child-model-action" {...extProps} onClick={() => setShow(true)} >{children || cmodel.title || cmodel.name}</Button>

  const ItemsComponent = (cmodel.components && cmodel.components.DataList) || C('Model.DataTable')

  return [
    action,
    show ? (
      <Model schema={schema} 
        modelKey={`${_.isString(model) ? model : model.name}_${parent.id}`} 
        initialValues={initialValues} >
        <Dialog key={1} open={show} onOpenChange={open => !open && handleCancel()}>
          <DialogContent className="sm:max-w-6xl w-5/6 max-h-full overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{header || cmodel.title || cmodel.name}</DialogTitle>
            </DialogHeader>
            <div key="model-list-subnav" className='flex flex-row justify-between mt-4 mb-4'>
              <C is="Model.Pagination" />
              <C is="Model.ListSubMenu"><AddChildrenModelBtn {...props} /></C>
            </div>
            <ItemsComponent key="model-list-grid" />
            <div key="model-list-downnav" className='flex flex-row justify-between mt-4'>
              <C is="Model.ActionBar" />
              <C is="Model.Pagination" />
            </div>
          </DialogContent>
        </Dialog>
      </Model>
    ) : null
  ]
}

const AddChildrenModelBtn = props => {
  const [ show, setShow ] = React.useState(false)
  const { model } = use('model')
  const { getItems } = use('model.getItems')
  const { canAdd } = use('model.permission')
  const { refData, refreshTimeout } = props

  const onSuccess = () => {
    if(refreshTimeout) {
      setTimeout(getItems, refreshTimeout)
    } else {
      getItems()
    }
  }

  return canAdd ? [
    <Button size="sm" className="mr-2" onClick={() => setShow(true)}>{_t('Add {{object}}', { object: model.title })}</Button>,
    <ChildrenFormModel key={1} title={_t('Add {{object}}', { object: model.title })} onSuccess={onSuccess} refData={refData} show={show} onClose={() => setShow(false)} />
  ] : null
}

const EditChildrenModelBtn = props => {
  const [ show, setShow ] = React.useState(false)
  const { model } = use('model')
  const { getItems } = use('model.getItems')
  const { id, refData, refreshTimeout } = props
  const canChildEdit = !!model.permission && !!model.permission.childEdit

  const onSuccess = () => {
    if(refreshTimeout) {
      setTimeout(getItems, refreshTimeout)
    } else {
      getItems()
    }
  }

  return canChildEdit && [
    <Button key={0} size="xs" onClick={() => setShow(true)}>{_t('Edit')}</Button>,
    show ? <ChildrenFormModel key={1} onSuccess={onSuccess} id={id} refData={refData} show={show} onClose={() => {
      setShow(false)
    }} /> : null
  ]
}

const ChildrenFormModel = props => {
  const { show, title, onClose, modalProps, onSuccess, refData } = props
  const { model } = use('model')
  const { data, loading, saveItem } = use('model.item', props)

  const onSubmitSuccess = (item) => {
    onClose()
    onSuccess(item)
  }

  const onSaveItem = (values) => {
    saveItem({ ...values, ...refData })
  }

  const FormLayout = (props) => {
    const { children, invalid, handleSubmit, submitting } = props
    return (
      <Dialog open={show} onOpenChange={open => !open && onClose ? onClose() : null}>
        <DialogContent className="sm:max-w-4xl w-5/6 max-h-full overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title || (_t('Edit {{title}}', 
                { title: model.title + ' ' + (data && data[model.displayField || 'name'] || '') }) )}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-y-4 pt-4 pb-4">
              {children}
            </div>
            <DialogFooter>
              <Button onClick={() => onClose ? onClose() : history.back()} variant="secondary">{_t('Cancel')}</Button>
              <Button type="submit" disabled={invalid || submitting}>{submitting && <Spin /> }{_t('Save')}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  return show && !loading ? (
    <SchemaForm
      formKey={`model.modalform.${model.key}`}
      schema={model}
      initialValues={{ ...data, ...refData }}
      onSubmit={onSaveItem}
      onClose={onClose}
      component={FormLayout}
      onSubmitSuccess={onSubmitSuccess}
    />
  ) : null

}

export default ChildrenModel
