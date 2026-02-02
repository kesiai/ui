import React from 'react'
import _ from 'lodash'
import { Button, Input } from 'xui'
import app, { use } from 'xadmin'
import { CircleX } from 'lucide-react'

const Search = ({ placeholder, value, onChange, onSearch, onPressEnter, style, allowClear = true, loading = false }) => {
  const [inputValue, setInputValue] = React.useState(value || '')

  React.useEffect(() => {
    setInputValue(value || '')
  }, [value])

  const handleChange = (e) => {
    const newValue = e.target.value
    setInputValue(newValue)
    if (onChange) onChange(newValue)
  }

  const handleClear = () => {
    setInputValue('')
    if (onChange) onChange('')
    if (onSearch) onSearch('')
  }

  const handleSearch = () => {
    if (onSearch) onSearch(inputValue)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (onPressEnter) onPressEnter(e)
      if (onSearch) onSearch(inputValue)
    }
  }

  return (
    <Input
      placeholder={placeholder}
      value={inputValue}
      onChange={handleChange}
      onKeyPress={handleKeyPress}
      style={style}
      addonAfter={
        <span onClick={handleSearch} style={{ cursor: 'pointer' }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </span>
      }
      suffix={
        allowClear && inputValue ? (
          <CircleX
            className='cursor-pointer'
            onClick={handleClear}
          />
        ) : null
      }
    />
  )
}
const SearchBar = () => {
  const { _t } = app.context
  const { onSearch, searchTitles, searchValue } = use('model.searchbar')
  if(searchTitles && searchTitles.length > 0) {
    const placeholder = _t('Search') + ' ' + searchTitles.join(', ')
    return (
      <Search
        placeholder={placeholder}
        defaultValue={searchValue || undefined}
        onSearch={onSearch}
        style={{ width: 200 }}
      />
    )
  }
  return null
  
} 
export default SearchBar
