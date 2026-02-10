import React, { useState, useEffect } from 'react'
import { PropConfig } from '../config/types'
import { CodeEditorModal } from './CodeEditorModal'
import { modelRegistry, api } from '@airiot/client'
interface FormControlProps {
  config: PropConfig
  value: any
  onChange: (name: string, value: any) => void
  allValues?: Record<string, any> // 新增：所有配置项的值，用于处理依赖关系
}

export const FormControl: React.FC<FormControlProps> = ({ config, value, onChange, allValues = {} }) => {
  const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false)
  const [tableOptions, setTableOptions] = useState<Array<{ value: string; label: string }>>([])
  const [loadingTables, setLoadingTables] = useState(false)
  const [tableDataOptions, setTableDataOptions] = useState<Array<{ value: string; label: string }>>([])
  const [loadingTableData, setLoadingTableData] = useState(false)
  const [tableTagsOptions, setTableTagsOptions] = useState<Array<{ value: string; label: string }>>([])
  const [loadingTableTags, setLoadingTableTags] = useState(false)

  // 获取设备表列表
  useEffect(() => {
    if (config.type === 'table-id') {
      const fetchDeviceTables = async () => {
        try {
          setLoadingTables(true)
          // 查询所有设备表
          const response = await api({ name: 'core/t/schema' }).query(
            { fields: ['id', 'title', 'name', 'isDevice'] },
            { where: { isDevice: true } } // 只获取设备表
          )

          // .query() 方法返回的数据在 items 或直接在 response 中
          const items = response?.items || response || []

          if (!Array.isArray(items)) {
            console.error('设备表数据格式错误:', response)
            setTableOptions([])
            return
          }

          const options = items.map((item: any) => ({
            value: item.id,
            label: item.title || item.name || item.id
 }))

          setTableOptions(options)
        } catch (error) {
          console.error('获取设备表列表失败:', error)
          setTableOptions([])
        } finally {
          setLoadingTables(false)
        }
      }

      fetchDeviceTables()
    }
  }, [config.type])

  // 获取表数据（用于 table-data 类型）
  useEffect(() => {
    if (config.type === 'table-data') {
      // 从依赖的配置项获取 tableId
      const sourceTableId = config.dependsOn ? allValues[config.dependsOn] : config.tableId

      if (!sourceTableId) {
        setTableDataOptions([])
        return
      }

      const fetchTableData = async () => {
        try {
          setLoadingTableData(true)
          // 查询表数据
          const response = await api({ name: `core/t/${sourceTableId}/d` }).fetch('?query={"limit":100}')

          // .fetch() 方法返回的数据在 json 字段中
          const items = response?.json || []

          if (!Array.isArray(items)) {
            console.error('表数据格式错误:', response)
            setTableDataOptions([])
            return
          }

          const options = items.map((item: any) => ({
            value: item.id || item._id,
            label: item.name || item.title || item.id || item._id || '未命名'
          }))

          setTableDataOptions(options)
        } catch (error) {
          console.error('获取表数据失败:', error)
          setTableDataOptions([])
        } finally {
          setLoadingTableData(false)
        }
      }

      fetchTableData()
    }
  }, [config.type, config.dependsOn, config.tableId, allValues])

  // 获取表的数据点（用于 table-tags 类型）
  useEffect(() => {
    if (config.type === 'table-tags') {
      // 从依赖的配置项获取 tableId
      const sourceTableId = config.dependsOn ? allValues[config.dependsOn] : config.tableId

      if (!sourceTableId) {
        setTableTagsOptions([])
        return
      }

      const fetchTableTags = async () => {
        try {
          setLoadingTableTags(true)
          // 查询表的Schema结构 - 使用解构赋值
          const { json } = await api({ name: `core/t/schema/${sourceTableId}` }).fetch('')

          // 从返回的 tags 数组中提取数据点
          const tags = json?.device?.tags || []
          const tagOptions = tags.map((tag: any) => ({
            value: tag.id || tag.name,
            label: tag.title || tag.name || tag.id || '未命名'
          }))

          setTableTagsOptions(tagOptions)
        } catch (error) {
          console.error('获取表数据点失败:', error)
          setTableTagsOptions([])
        } finally {
          setLoadingTableTags(false)
        }
      }

      fetchTableTags()
    }
  }, [config.type, config.dependsOn, config.tableId, allValues])

  const handleChange = (newValue: any) => {
    onChange(config.name, newValue)
  }

  const handleOpenCodeEditor = () => {
    setIsCodeEditorOpen(true)
  }

  const handleCloseCodeEditor = () => {
    setIsCodeEditorOpen(false)
  }

  const handleSaveCode = (code: string) => {
    console.log('Saving code:', config.name, code)
    onChange(config.name, code)
  }

  switch (config.type) {
    case 'number':
      return (
        <input
          type="number"
          value={value as number}
          onChange={(e) => handleChange(Number(e.target.value))}
          min={config.min}
          max={config.max}
          step={config.step}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      )

    case 'text':
      return (
        <input
          type="text"
          value={value as string}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={config.placeholder}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      )

    case 'color':
      return (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={value as string || '#000000'}
            onChange={(e) => handleChange(e.target.value)}
            className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
          />
          <input
            type="text"
            value={value as string}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="#000000"
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
      )

    case 'select':
      return (
        <select
          value={value as string}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
        >
          {config.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )

    case 'boolean':
      return (
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={value as boolean}
            onChange={(e) => handleChange(e.target.checked)}
            className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm text-slate-600">{value ? '是' : '否'}</span>
        </label>
      )

    case 'range':
      return (
        <div className="space-y-2">
          <input
            type="range"
            value={value as number}
            onChange={(e) => handleChange(Number(e.target.value))}
            min={config.min}
            max={config.max}
            step={config.step || 1}
            className="w-full"
          />
          <div className="text-sm text-slate-600 text-center">{value}</div>
        </div>
      )

    case 'code':
      return (
        <div>
          <button
            onClick={handleOpenCodeEditor}
            className="w-full px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            {value ? '编辑图表代码' : '添加图表代码'}
          </button>
          {value && (
            <p className="mt-2 text-xs text-slate-500">
              已配置自定义图表代码
            </p>
          )}
          <CodeEditorModal
            isOpen={isCodeEditorOpen}
            onClose={handleCloseCodeEditor}
            code={value as string}
            onSave={handleSaveCode}
            title={config.label}
          />
        </div>
      )
    case 'json':
      return (
        <div>
          <button
            onClick={handleOpenCodeEditor}
            className="w-full px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            {value ? '编辑 JSON' : '添加 JSON'}
          </button>
          {value && (
            <p className="mt-2 text-xs text-slate-500">
              {typeof value === 'string' ? value : JSON.stringify(value, null, 2).substring(0, 100) + '...'}
            </p>
          )}
          <CodeEditorModal
            isOpen={isCodeEditorOpen}
            onClose={handleCloseCodeEditor}
            code={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
            onSave={(code) => {
              try {
                const parsed = JSON.parse(code)
                handleSaveCode(JSON.stringify(parsed, null, 2))
              } catch (error) {
                // 如果不是有效 JSON，直接保存字符串
                handleSaveCode(code)
              }
            }}
            title={config.label || 'JSON 配置'}
          />
        </div>
      )
    case 'array':
      return (
        <div className="space-y-2">
          <textarea
            value={value ? JSON.stringify(value, null, 2) : ''}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value)
                handleChange(parsed)
              } catch (error) {
              }
            }}
            placeholder='请输入JSON数组'
            rows={6}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono text-sm"
          />
          <div className="text-xs text-slate-500">
            {/* {config.description || '支持JSON数组格式'} */}
          </div>
        </div>
      )
    case 'object':
      return (
        <div className="space-y-2">
          <textarea
            value={value ? JSON.stringify(value, null, 2) : ''}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value)
                handleChange(parsed)
              } catch (error) {
              }
            }}
            placeholder='请输入JSON对象'
            rows={8}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono text-sm"
          />
          <div className="text-xs text-slate-500">
            {config.description || '支持JSON对象格式'}
          </div>
        </div>
      )
    case 'input':
      return (
        <input
          type="text"
          value={value as string || ''}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={config.placeholder}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      )
    case 'model-name':
      const optons = Object.keys(modelRegistry.models).map(key => ({ value: key, label: modelRegistry.models[key].title?.toString() || key }))
      return (
        <select
          value={value as string}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
        >
          <option key={""} value={""}>
            无
          </option>
          {optons.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )
    case 'table-id':
      if (loadingTables) {
        return (
          <div className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 text-sm">
            加载设备表...
          </div>
        )
      }
      return (
        <select
          value={value as string || ''}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
        >
          <option value="">
            请选择设备表
          </option>
          {tableOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )
    case 'table-data':
      if (loadingTableData) {
        return (
          <div className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 text-sm">
            加载数据...
          </div>
        )
      }
      if (config.multiple) {
        // 多选实现 - 保存完整的设备对象 { id, name }
        return (
          <div className="space-y-2 max-h-60 overflow-y-auto border border-slate-300 rounded-lg p-2">
            {tableDataOptions.length === 0 ? (
              <div className="text-slate-500 text-sm text-center py-2">
                {config.dependsOn && !allValues[config.dependsOn] ? '请先选择设备表' : '暂无数据'}
              </div>
            ) : (
              tableDataOptions.map((opt) => {
                const isSelected = Array.isArray(value) && value.some((v: any) => v.id === opt.value || v === opt.value)
                return (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        const currentValue = Array.isArray(value) ? value : []
                        if (e.target.checked) {
                          // 添加选项 - 保存完整的设备对象 { id, name }
                          handleChange([...currentValue, { id: opt.value, name: opt.label }])
                        } else {
                          // 移除选项 - 根据 id 或 value 移除
                          handleChange(currentValue.filter((v: any) => v.id !== opt.value && v !== opt.value))
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">{opt.label}</span>
                  </label>
                )
              })
            )}
            {Array.isArray(value) && value.length > 0 && (
              <div className="text-xs text-slate-500 pt-2 border-t border-slate-200">
                已选择 {value.length} 项
              </div>
            )}
          </div>
        )
      }
      // 单选实现 - 保存完整的设备对象 { id, name }
      return (
        <select
          value={value?.id || value || ''}
          onChange={(e) => {
            // 找到选中的选项并保存完整的设备对象
            const selectedOpt = tableDataOptions.find(opt => opt.value === e.target.value)
            if (selectedOpt) {
              handleChange({ id: selectedOpt.value, name: selectedOpt.label })
            } else {
              handleChange('')
            }
          }}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
        >
          <option value="">
            请选择
          </option>
          {tableDataOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )
    case 'table-tags':
      if (loadingTableTags) {
        return (
          <div className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 text-sm">
            加载数据点...
          </div>
        )
      }
      if (config.multiple) {
        // 多选实现 - 保存数据点对象数组
        return (
          <div className="space-y-2 max-h-60 overflow-y-auto border border-slate-300 rounded-lg p-2">
            {tableTagsOptions.length === 0 ? (
              <div className="text-slate-500 text-sm text-center py-2">
                {config.dependsOn && !allValues[config.dependsOn] ? '请先选择设备表' : '暂无数据点'}
              </div>
            ) : (
              tableTagsOptions.map((opt) => {
                const isSelected = Array.isArray(value) && value.some((v: any) => v.id === opt.value || v === opt.value)
                return (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        const currentValue = Array.isArray(value) ? value : []
                        if (e.target.checked) {
                          // 添加选项 - 保存完整的数据点对象 { id, name }
                          handleChange([...currentValue, { id: opt.value, name: opt.label }])
                        } else {
                          // 移除选项 - 根据 id 或 value 移除
                          handleChange(currentValue.filter((v: any) => v.id !== opt.value && v !== opt.value))
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">{opt.label}</span>
                  </label>
                )
              })
            )}
            {Array.isArray(value) && value.length > 0 && (
              <div className="text-xs text-slate-500 pt-2 border-t border-slate-200">
                已选择 {value.length} 个数据点
              </div>
            )}
          </div>
        )
      }
      // 单选实现 - 保存数据点对象
      return (
        <select
          value={value?.id || value || ''}
          onChange={(e) => {
            // 找到选中的选项并保存完整的数据点对象
            const selectedOpt = tableTagsOptions.find(opt => opt.value === e.target.value)
            if (selectedOpt) {
              handleChange({ id: selectedOpt.value, name: selectedOpt.label })
            } else {
              handleChange('')
            }
          }}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
        >
          <option value="">
            请选择
          </option>
          {tableTagsOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )
    default:
      return null
  }
}
