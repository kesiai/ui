import React from 'react'
import { useDrag, useDrop } from 'react-dnd'
import _ from 'lodash'

const dndType = 'card'

const FormPanel = (props) => {
  const { children, overPos, schema, dragDirection, disableDragging, hide, index } = props

  const ref = React.useRef(null)
  const [height, setHeight] = React.useState()
  React.useEffect(() => {
    const container = props.name ? document.getElementById(props.name) : document
    setHeight(container.getElementsByClassName('form-drop-target')[index]?.clientHeight - 8)
  }, [])

  const [{ handlerId, isOver, overRowKey, canDrop }, drop] = useDrop({
    accept: dndType,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: monitor.isOver(),
        overRowKey: monitor.getItem()?.hRowKey,
        canDrop: monitor.canDrop(),
      }
    },
    hover(item, monitor) {
      if (typeof props.id !== typeof item.id && item.id) return
      const hoverIndex = props.index
      const dragIndex = item.index
      
      const move = (dIndex, hIndex) => {
        if (dIndex == hIndex) return
  
        const { widthInForm, config, rowKey } = props.schema || {}
  
        const hoverBoundingRect = ref.current.childNodes?.[0]?.getBoundingClientRect() || ref.current.getBoundingClientRect()
        const clientOffset = monitor.getClientOffset()
  
        const dConfig = item.config || item.schema?.config
        const isRow = props.notInRow || ['表格', '富文本'].indexOf(config) > -1 || ['表格', '富文本'].indexOf(dConfig) > -1 || (widthInForm == '6' && rowKey) || props.dragDirection == 'vertical'
        const dragInRow = item.schema?.rowKey && item.schema.rowKey == rowKey // 行内拖动
        const boundaryX = hoverBoundingRect.left + hoverBoundingRect.width / 2
        const boundaryY = isRow ? hoverBoundingRect.bottom - hoverBoundingRect.height / 2 : hoverBoundingRect.top + 10
        let overPos
  
        if (dIndex < hIndex) { // 从上向下拖
          if ((!isRow || dragInRow) && _.inRange(clientOffset.y, hoverBoundingRect.top + 10, hoverBoundingRect.bottom - 10)) {
            if (clientOffset.x < boundaryX) {
              overPos = 'Left'
            } else {
              overPos = 'Right'
            }
          } else if (clientOffset.y < boundaryY) {
            overPos = 'Top'
          } else {
            overPos = 'Bottom'
          }
        } else if (dIndex > hIndex) { // 从下向上拖
          if ((!isRow || dragInRow) && _.inRange(clientOffset.y, hoverBoundingRect.top + 10, hoverBoundingRect.bottom)) {
            if (clientOffset.x > boundaryX) {
              overPos = 'Right'
            } else {
              overPos = 'Left'
            }
          } else if (clientOffset.y < boundaryY) {
            overPos = 'Top'
          } else {
            overPos = 'Bottom'
          }
        }
        if (!_.isNil(overPos) && props && props.overPos !== overPos) props.movePos(overPos)
      }
  
      if (props.id == 'virtualSpace') {
        props && props.overPos != 'Top' && props.movePos('Top')
      } else if (item.id) { // 中间面板拖动元素（修改）
        move(dragIndex, hoverIndex)
      } else if (item.name) { // 左侧面板拖动元素（新增）
        move(dragIndex === undefined ? -1 : dragIndex, hoverIndex)
      }
    },
    drop(item, monitor) {
      if (!item.id && !item.config) return
      const { widthInForm, config, rowKey } = props.schema || {}
      const dConfig = item.config || item.schema?.config
  
      const hoverBoundingRect = ref.current.childNodes?.[0]?.getBoundingClientRect() || ref.current.getBoundingClientRect()
      const clientOffset = monitor.getClientOffset()
  
      const isRow = props.notInRow || ['表格', '富文本'].indexOf(config) > -1 || ['表格', '富文本'].indexOf(dConfig) > -1 || (widthInForm == '6' && rowKey) || props.dragDirection == 'vertical'
      const dragInRow = item.schema?.rowKey && item.schema.rowKey == rowKey // 行内拖动
      const boundaryX = hoverBoundingRect.left + hoverBoundingRect.width / 2
      const boundaryY = isRow ? hoverBoundingRect.bottom - hoverBoundingRect.height / 2 : hoverBoundingRect.top + 10
  
      if (item.id) { // 中间面板拖动元素（修改）
        const hIndex = props.index
        const dIndex = item.index
        if (dIndex == hIndex) return
        
        // 从上向下拖
        if (dIndex > -1 && dIndex < hIndex) {
          if ((!isRow || dragInRow) && props.id != 'virtualSpace' && _.inRange(clientOffset.y, hoverBoundingRect.top + 10, hoverBoundingRect.bottom - 10)) {
            if (clientOffset.x < boundaryX) {
              props.moveCard(dIndex, hIndex, true, 'left')
            } else {
              props.moveCard(dIndex, hIndex, true)
            }
          } else if (clientOffset.y < boundaryY) {
            props.moveCard(dIndex, hIndex - 1)
          } else {
            props.moveCard(dIndex, hIndex)
          }
        }
        // 从下向上拖
        if (dIndex > -1 && dIndex > hIndex) {
          if ((!isRow || dragInRow) && _.inRange(clientOffset.y, hoverBoundingRect.top + 10, hoverBoundingRect.bottom - 10)) {
            if (clientOffset.x > boundaryX) {
              props.moveCard(dIndex, hIndex, true, 'right')
            } else {
              props.moveCard(dIndex, hIndex, true)
            }
          } else if (clientOffset.y < boundaryY) {
            props.moveCard(dIndex, hIndex)
          } else {
            props.moveCard(dIndex, hIndex + 1)
          }
        }
      } else if (item.name) { // 左侧面板拖动元素（新增）
        let dropInRow, isAhead 
        if ((!isRow || dragInRow) && props.id != 'virtualSpace' && _.inRange(clientOffset.y, hoverBoundingRect.top + 10, hoverBoundingRect.bottom - 10)) {
          dropInRow = true
          if (clientOffset.x < boundaryX) {
            isAhead = true
          }
        } else if (clientOffset.y < boundaryY) {
          isAhead = true
        }
        props.addCard(item, props.index, dropInRow, isAhead)
      }
    }
  })

  const [{ isDragging }, drag] = useDrag({
    type: dndType,
    item: () => {
      return {
        id: props.id,
        index: props.index,
        schema: props.schema
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging && !disableDragging ? 0 : 1
  const { widthInForm, rowKey } = schema || {}
  const width = (widthInForm || 24) / 24 * 100
  const isFullRow = (!rowKey && !widthInForm) || (rowKey && widthInForm) // 占满一行
  
  let style
  if (overPos && !(!isFullRow && isOver && overPos == 'Right')) {
    if (isOver && !isDragging) {
      style = { [`border${overPos}`]: '3px solid #4f71ff' }
    } else if (rowKey && rowKey == overRowKey && ['Top', 'Bottom'].indexOf(overPos) > -1) {
      style = { [`border${overPos}`]: '3px solid #4f71ff' }
    }
  }
  if (hide) style = { display: 'none' }

  const borderRight = !isFullRow && isOver && overPos == 'Right' ? '3px solid #4f71ff' : null
  const minHeight = isDragging && dragDirection != 'vertical' ? height : null

  drag(drop(ref))
  return (
    <div ref={ref} className='cmdb-form-card form-drop-target' style={{ ...style, width: rowKey ? `${width}%` : '100%', padding: 0 }}>
      <div
        className={opacity ? '' : 'card-dragging'}
        data-handler-id={handlerId}
        style={{
          borderRight,
          position: 'relative',
          minHeight,
          width: !schema?.rowKey ? `${width}%` : '100%', overflow: 'hidden'
        }}
      >
        {opacity ? children : '·'}
      </div>
    </div>
  )
}

export default FormPanel