'use client'

import * as React from 'react'
import {
  ConfirmDialog,
} from './ConfirmDialog'
import {
  FormDialog,
} from './FormDialog'
import {
  useGlobalDialogs,
} from '@/registry/lib/events/dialog-atom'

/**
 * 全局对话框组件
 *
 * 不需要任何 Provider，直接放在根组件即可
 */
export function GlobalDialogs() {
  const { confirmDialog, formDialog, handleConfirm, handleCancel, handleFormConfirm, handleFormCancel } = useGlobalDialogs()

  const confirmOpen = !!confirmDialog?.open
  const formOpen = !!formDialog?.open
  console.log('GlobalDialogs render, confirmOpen:', confirmOpen, 'formOpen:', formOpen)

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

      {/* 表单对话框 */}
      {formOpen && formDialog && (
        <FormDialog
          open={formOpen}
          onOpenChange={(open) => {
            if (!open) {
              handleFormCancel()
            }
          }}
          title={formDialog.config?.title || '填写信息'}
          description={formDialog.config?.description || '请填写以下信息'}
          fields={formDialog.config?.fields || []}
          confirmText={formDialog.config?.confirmText || '确定'}
          cancelText={formDialog.config?.cancelText || '取消'}
          initialValues={formDialog.config?.initialValues}
          onConfirm={handleFormConfirm}
          onCancel={handleFormCancel}
        />
      )}
    </>
  )
}
