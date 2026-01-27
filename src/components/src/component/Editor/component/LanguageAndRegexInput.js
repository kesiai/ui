import { Button, Input, Popover } from 'antd'
import _ from 'lodash'
import React, { useContext, useState } from 'react'
import { use, app } from 'xadmin'
import { _t } from 'xadmin-i18n'
import { GlobalOutlined } from '@ant-design/icons'
import Icon from './Icon'

const LanguageType = ({ input, field, outStyle }) => {

  const ifTable = field?.schema?.config === '文本' // 是数据表中的文本控件，有自己的国际化配置
  const { settings } = use('settings')
  const [isRegex, setIsRegex] = useState(false)
  const language = ifTable ? field.schema.languageType?.languages
    : settings?.i18n?.lanageManage?.
      filter(l => l?.contentlanguage == true)?.map(l => l.code)

  let form
  try {
    form = use('form')?.form
  } catch (error) { }
  const [showDropdown, setShowDropdown] = useState(false)

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown)
  }

  const key = field?.key
  const values = form?.getState().values
  const index = key.lastIndexOf('.')
  const arrKey = key.substring(0, index)
  const _key = arrKey + '.regex'

  React.useEffect(() => {
    setIsRegex(_.get(values, _key))
  }, [])
  React.useEffect(() => {
    form?.change(_key, isRegex)
  }, [isRegex])
  const onLanageValue = (e, name) => {
    const value = e.target.value
    if (field.languageChange) {
      field.languageChange(value, name)
    } else {
      let code = ''
      if (/\[[0-9]+\]$/.test(key)) { // 数组类型，存成 val: [''], val_en: ['']
        const index = key.lastIndexOf('[')
        const arrKey = key.substring(0, index)
        const arrIndex = key.substring(index)
        code = _.trim(arrKey + '_' + name + arrIndex)
      } else {
        code = _.trim(key + '_' + name)
      }
      form?.change(code, value)
      // 为了解决 form.change 不触发 Schemaform 的 onchange，导致配置项没刷新
      input?.onChange(input?.value + ' ')
      input?.onChange(input?.value)
    }
  }

  const InputNode = field.textarea ? Input.TextArea : Input
  return (
    <div style={outStyle}>
      <div style={{ display: 'flex', borderRadius: '4px' }}>
        <InputNode
          value={input?.value}
          onChange={input?.onChange}
          onBlur={input?.onBlur}
          style={{ borderRadius: language?.length > 0 ? '4px 0px 0px 4px' : null }}
          {...field}
        />
        {
          <Button className='language-btn' onClick={e => setIsRegex(!isRegex)} style={{
            borderRadius: language?.length > 0 ? '0px' : '0px 4px 4px 0px', 'box-shadow': 'none', height: 'inherit', ...(field.btnStyle || {})
          }}>
            {isRegex ? '正则' : '文本'}<Icon svg={require('../svg/切换.svg')} />
          </Button>
        }
        {
          language?.length > 0 && <Button className='language-btn' onClick={handleDropdownToggle} style={{
            borderRadius: '0px 4px 4px 0px', height: 'inherit', ...(field.btnStyle || {})
          }}>
            <GlobalOutlined />
          </Button>
        }
      </div>
      {showDropdown && (
        <div>
          {language?.map((languageObj, index) => {
            let code = ''
            if (/\[[0-9]+\]$/.test(key)) { // 数组类型，存成 val: [''], val_en: ['']
              const index = key.lastIndexOf('[')
              const arrKey = key.substring(0, index)
              const arrIndex = key.substring(index)
              code = _.trim(arrKey + '_' + languageObj + arrIndex)
            } else {
              code = _.trim(key + '_' + languageObj)
            }
            const langValue = field.languageValue ? field.languageValue[languageObj] :
              _.get(values, code) || _.get(values?.i18nProp || {}, code)
            return (
              <div style={{ display: 'flex' }}>
                <Popover content={languageObj}>
                  <InputNode
                    key={index}
                    style={{ marginTop: '5px' }}
                    defaultValue={langValue}
                    onChange={e => onLanageValue(e, languageObj)}
                    placeholder={languageObj}
                    size={field.size}
                  />
                </Popover>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default LanguageType
