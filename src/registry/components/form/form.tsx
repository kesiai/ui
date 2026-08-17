import { FormProvider, useForm, type UseFormPropsExtended } from '@kesi/client'
import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type FormProps = UseFormPropsExtended & {
  formId: string
  children: ReactNode | ((methods: any) => ReactNode)
  onSubmit: (data: any) => void
  onEffect?: (formData: any, setFormData: (data: any) => void) => void
  className?: string
  classNames?: Partial<Record<'form' | 'field' | 'label' | 'input' | 'description' | 'error', string>>
}

const Form = ({ formId, children, onSubmit, onEffect, classNames, className, ...props } : FormProps ) => {
  const methods = useForm({ ...props, onEffect })
  return (
    <FormProvider {...methods} classNames={classNames}>
      <form id={formId} onSubmit={methods.handleSubmit(onSubmit)} className={cn('space-y-6', classNames?.form, className)}>
        {typeof children === 'function' ? children(methods) : children}
      </form>
    </FormProvider>
  )
}

export { Form }
