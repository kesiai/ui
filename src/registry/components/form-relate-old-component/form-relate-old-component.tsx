import * as React from 'react'
import { FormRelate, FormRelateProps } from '@/registry/components/form-relate/form-relate'
import { useFormContext } from '@airiot/client'
import { Table2Context } from '@/registry/lib/table-context'
import { dealFilter } from '@/registry/lib/form-relate-utils'

/**
 * FormRelateOld - 关联字段组件（旧版本，非纯组件）
 *
 * 这个组件保持与旧版本相同的行为，使用 useFormContext 和 Table2Context
 * 内部构建 filterObj 并传递给纯组件 FormRelate
 *
 * 用于需要表单上下文和表格上下文的场景
 */
const FormRelateOld: React.FC<FormRelateProps> = (props) => {
  const { value, onChange, field = {}, schema, meta, record, disabled } = props

  const form = useFormContext()
  const outTable = React.useContext(Table2Context)

  const getFormState = () => {
    if (form) {
      return form.getValues()
    }
  }

  // 构建过滤器对象
  const filterObj = React.useMemo(() => {
    const result: Record<string, any> = {}
    dealFilter(result, field, getFormState, outTable)
    return result
  }, [field, form, outTable])

  return <FormRelate value={value} onChange={onChange} schema={schema} meta={meta} record={record} disabled={disabled} filterObj={filterObj} />
}

export { FormRelateOld }
export type { FormRelateProps }
