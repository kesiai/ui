import React from 'react'
import _ from 'lodash'
import { ChevronDown } from 'lucide-react';

import { Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent
 } from 'xui'

import { app, use } from 'xadmin'
import { _t } from 'xadmin-i18n'

export default props => {
  const { model } = use('model')
  const { count } = use('model.select')
  const { renderActions } = use('model.batchActions')
  const actions = renderActions({ ...props, model })

  return actions && actions.length > 0 ? ( count > 0 ? 
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button size={"sm"}>
          {_t('{{count}} record selected', { count })} <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent forceMount={true}>
        { React.Children.toArray(actions) }
      </DropdownMenuContent>
    </DropdownMenu>
     : <Button size={"sm"} variant="ghost" disabled>{_t('No data selected')}</Button>
  ) : <div></div>;
}
