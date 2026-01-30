import { FormProvider, useForm, type UseFormPropsExtended } from '@airiot/client'
import type { ReactNode } from 'react'

type FormProps = UseFormPropsExtended & {
  formId: string
  children: ReactNode
  onSubmit: (data: any) => void
}

const Form = ({ formId, children, onSubmit, onEffect, ...props } : FormProps ) => {
  const methods = useForm({ ...props, onEffect })
  return (
    <FormProvider {...methods}>
      <form id={formId} onSubmit={methods.handleSubmit(onSubmit)}>
        {children}
      </form>
    </FormProvider>
  )
}

export default Form