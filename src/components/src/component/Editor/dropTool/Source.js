import React from 'react'
import { DragSource, useDrag } from 'react-dnd'
import { Card } from 'antd'
import { uuid } from '../utils3'

const dndType = 'card'

const Source = (props) => {
  const { title, type, icon, name, config, onlyOne } = props

  const [_, drag] = useDrag({
    type: dndType,
    item: () => {
      const key = `${name}-${uuid(4, 16)}`
      const data = {
        name: key,
        key: key,
        type: type,
        title: title,
        icon: icon,
        config: config,
        onlyOne: onlyOne
      }
      return data
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    })
  })

  return <div ref={drag} className='editor-source'>
    {icon}
    <div className='editor-source-title'>{title}</div>
  </div>
}
export default Source