import React from 'react';
import { useModel, useSetModelState, useModelGetItems } from '@airiot/client';
import { FilterForm } from '@/registry/components/filter-form/filter-form';

interface ViewFilterProps {
  filters?: Array<{
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

  const filterSchema = filters && filters.length > 0 ? filters : model.filterSchema

  const onSubmit = (value: any) => {
    console.log(value)
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
    <FilterForm
      formId={model?.name + 'view-filter'}
      schema={model}
      filterSchema={filterSchema}
      classNames={classNames ? classNames : {
        form: '',
        group: 'grid grid-cols-3 gap-4',
        field: 'flex flex-row items-center gap-2 min-w-0',
        label: '!w-20 flex-shrink-0 text-right',
        input: 'flex-1 min-w-0',
        description: '',
        error: ''
      }}
      onSubmit={onSubmit}>
      {(methods) => (
        <div className="mt-4 flex justify-center gap-3">
          <button
            type="submit"
            className="px-8 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            搜索
          </button>
          <button
            type="button"
            onClick={() => onReset(methods.reset)}
            className="px-8 py-2 text-sm border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            重置
          </button>
        </div>
      )}
    </FilterForm>
  )
}

export { ViewFilter };
