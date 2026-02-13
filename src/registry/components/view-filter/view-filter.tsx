import React from 'react'
import { useModel, useSetModelState, useModelGetItems } from '@airiot/client'
import FilterSchemaForm from '../filter-form/filter-form'
import _ from 'lodash'

interface ViewFilterProps {
  filters?: Array<{
    key: string
    name: string
  }>
  classNames?: Record<'form' | 'group' | 'field' | 'label' | 'input' | 'description' | 'error', string>
}

const ViewFilter: React.FC<ViewFilterProps> = ({
  filters = [],
  classNames
}) => {
  const { model } = useModel()
  const setWheres = useSetModelState('wheres')
  const { getItems } = useModelGetItems()

  const properties = _.mapValues(model.properties || {}, (prop, key) => ({ ...prop, name: key }))
  
  const formSchema = filters.filter((f: any) => properties[f.name || f])

  const onSubmit = (value: any) => {
    setWheres((w: any) => {
      return { ...w, filter: { ...w.filter, ...value } }
    });
    getItems()
  }

  const onReset = (reset: () => void) => {
    // 重置表单
    reset()
    // 重置查询条件
    setWheres((w: any) => {
      return { ...w, filter: {} }
    });
    getItems()
  }

  return (
    <FilterSchemaForm formId={model.name || ''} schema={{ ...model, properties }} formSchema={formSchema} classNames={classNames} onSubmit={onSubmit} >
      {(methods) => (
        <div className="mt-6 pt-4 border-t border-slate-200 flex gap-2">
          <button
            type="button"
            onClick={() => onReset(methods.reset)}
            className="flex-1 bg-white border border-slate-300 text-slate-700 py-2 px-4 rounded-md hover:bg-slate-50 transition-colors"
          >
            重置
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            搜索
          </button>
        </div>
      )}
    </FilterSchemaForm>
  )
}

export default ViewFilter
