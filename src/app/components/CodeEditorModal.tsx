import React, { useState } from 'react'

interface CodeEditorModalProps {
  isOpen: boolean
  onClose: () => void
  code: string
  onSave: (code: string) => void
  title?: string
}

export const CodeEditorModal: React.FC<CodeEditorModalProps> = ({
  isOpen,
  onClose,
  code,
  onSave,
  title = '代码编辑'
}) => {
  const [localCode, setLocalCode] = useState(code || '')

  const handleSave = () => {
    onSave(localCode)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 遮罩层 */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* 弹窗内容 */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col mx-4">
        {/* 弹窗头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 代码编辑区 */}
        <div className="flex-1 overflow-hidden p-6">
          <textarea
            value={localCode}
            onChange={(e) => setLocalCode(e.target.value)}
            placeholder="// 在这里输入 JavaScript 代码，可以访问 myChart, dataset, props 变量
// 例如：
// option.title.text = '自定义标题'
// option.series[0].itemStyle = { color: '#ff6b6b' }
// return { option, codeOption }"
            className="w-full h-full min-h-[300px] p-4 bg-slate-900 text-slate-100 font-mono text-sm rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            spellCheck={false}
          />
        </div>

        {/* 弹窗底部 */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
}
