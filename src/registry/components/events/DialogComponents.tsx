'use client'

import { ConfirmDialog } from './ConfirmDialog'

import { SchemaFormDialog } from './SchemaFormDialog'
import {
  useGlobalDialogs,
} from '@/registry/lib/events/dialog-atom'

/**
 * 全局对话框组件
 *
 * 不需要任何 Provider，直接放在根组件即可
 */
export function GlobalDialogs() {
  const {
    confirmDialog,
    schemaFormDialog,
    handleConfirm,
    handleCancel,
    handleSchemaFormConfirm,
    handleSchemaFormCancel
  } = useGlobalDialogs()

  const confirmOpen = !!confirmDialog?.open
  const schemaFormOpen = !!schemaFormDialog?.open

  return (
    <>
      {/* 确认对话框 */}
      {confirmOpen && confirmDialog && (
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={(open) => {
            if (!open) {
              handleCancel()
            }
          }}
          title={confirmDialog.config?.title || '确认操作'}
          description={confirmDialog.config?.message || '确定要执行此操作吗？'}
          confirmText={confirmDialog.config?.confirmText || '确定'}
          cancelText={confirmDialog.config?.cancelText || '取消'}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
      {/* SchemaForm 对话框 */}
      {schemaFormOpen && schemaFormDialog && (
        <SchemaFormDialog
          open={schemaFormOpen}
          onOpenChange={(open) => {
            if (!open) {
              handleSchemaFormCancel()
            }
          }}
          title={schemaFormDialog.config?.title || '填写表单'}
          description={schemaFormDialog.config?.description || '请填写以下信息'}
          schema={schemaFormDialog.config?.schema}
          formSchema={schemaFormDialog.config?.formSchema}
          confirmText={schemaFormDialog.config?.confirmText || '确定'}
          cancelText={schemaFormDialog.config?.cancelText || '取消'}
          initialValues={schemaFormDialog.config?.initialValues}
          onConfirm={handleSchemaFormConfirm}
          onCancel={handleSchemaFormCancel}
        />
      )}
    </>
  )
}
