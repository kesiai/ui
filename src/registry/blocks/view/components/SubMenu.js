import _ from 'lodash'
import React, { useState } from 'react'
import { Button, Input, Checkbox,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  PopoverRoot, PopoverTrigger, PopoverContent, PopoverAnchor
 } from 'xui'

import { Columns3 as ColumnsSettings } from 'lucide-react'
import { app, use } from 'xadmin'
import { _t } from 'xadmin-i18n'
import { ModelBlock } from 'xadmin-model'

const CountButton = () => {
  const { count } = use('model.count')
  return <Button size={"sm"} variant="ghost">{_t('{{count}} records', { count })}</Button>
}

const PageSizeButton = () => {
  const { size, sizes, setPageSize } = use('model.pagesize')
  const [ inputSize, setInputSize ] = React.useState('')
  const [open, setOpen] = React.useState(false);

  const onSetPageSize = (size) => {
    setPageSize(size)
    setOpen(false)
  }

  const onInputSize = (e) => {
    if (e.key == 'Enter') {
      const size = parseInt(inputSize)
      onSetPageSize(size)
      setInputSize('')
      setOpen(false)
    }
    e.persist()
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="h-8">
        <Button size={"sm"}>
          {_t('{{size}} per page', { size })}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {sizes.map(size => <DropdownMenuItem key={`size-${size}`} onClick={()=>setPageSize(size)}>{_t('Set {{size}} per page', { size })}</DropdownMenuItem>)}
        <DropdownMenuSeparator />
          <Input placeholder={_t('Customize page size')} value={inputSize} onChange={e => setInputSize(e.target.value)} precision={0} onKeyPress={onInputSize}/>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const ColsDropdown = () => {
  const { selected, fields, changeFieldDisplay } = use('model.fields')
  const [isOpen, setIsOpen] = useState(false)

  let items = []
  const showFields = Object.keys(fields).filter(name => fields[name].showInList !== false)
  const menuShow = showFields.length <= 10

  for (let name of showFields) {
    let field = fields[name]
      , fieldName = name
      , title = field.title || name
      , fieldSelected = _.indexOf(selected, name) !== -1
      , onClick = (e) => {
        changeFieldDisplay([ fieldName, e.target.checked ])
      }, onClickBtn = () => {
        changeFieldDisplay([ fieldName, !fieldSelected ])
      }
    if(menuShow) {
      items.push(
        <div className="flex items-center space-x-2">
          <Checkbox id={`col-checkbox-${name}`} onChange={onClick} checked={fieldSelected} />
          <label htmlFor={`col-checkbox-${name}`}>
            {title}
          </label>
        </div>
      )
    } else {
      items.push(<Button variant={fieldSelected?'default':'secondary'} size="sm" onClick={onClickBtn}>{title}</Button>)
    }
  }

  return (
    <PopoverRoot
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <PopoverTrigger className="h-8">
        <Button size={"sm"}><ColumnsSettings /></Button>
      </PopoverTrigger>
      <PopoverContent className={menuShow ? "flex flex-col gap-y-2":"w-[800px]"}>
        {(
          menuShow ? items :
            <div class="grid grid-cols-8 gap-1 gap-y-2">{items}</div>
        )}
      </PopoverContent>
    </PopoverRoot>
  )
}

export default ({ children }) => (
  <div className="flex gap-x-1">
    <CountButton />
    <PageSizeButton />
    <ModelBlock name="model.list.submenu.btngroup" />
    <ColsDropdown />
    {children}
  </div>
)
