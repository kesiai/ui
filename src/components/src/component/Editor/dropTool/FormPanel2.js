import { Col, Row, Tooltip } from 'antd'
import React from 'react'
import { useDrag, useDrop } from 'react-dnd'
import Icon from '../component/Icon'

const dndType = 'serialNum'

const FormPanelSerial = (props) => {
    const { colNum = 3, iconStyle = {} } = props

    const ref = React.useRef(null)
    const [height, setHeight] = React.useState()
    const [width, setWidth] = React.useState()
    
    const container = props.name ? document.getElementById(props.name) : document
    React.useEffect(() => {
      setHeight(container?.getElementsByClassName('drag-children')[props.index]?.clientHeight - 8)
      setWidth(container?.getElementsByClassName('drag-children')[props.index]?.clientWidth + 20)
    }, [container?.getElementsByClassName('drag-children')?.[props.index]?.clientHeight])

    const [{ handlerId }, drop] = useDrop({
      accept: dndType,
      collect(monitor) {
        return {
          handlerId: monitor.getHandlerId()
        }
      },
      hover(item, monitor) {
        if (typeof props.id !== typeof item.id && item.id) return
    
        const hoverIndex = props.index
        const dragIndex = item.index
    
        const move = (dIndex, hIndex) => {
          if (dIndex == hIndex) return
    
          const hoverBoundingRect = ref.current.getBoundingClientRect()
      
          const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      
          const clientOffset = monitor.getClientOffset()
      
          const hoverClientY = clientOffset.y - hoverBoundingRect.top
      
          if (dIndex > -1 && dIndex < hIndex && hoverClientY < hoverMiddleY) {
            return
          }
          if (dIndex > -1 && dIndex > hIndex && hoverClientY > hoverMiddleY) {
            return
          }
    
          props.moveCard(dIndex, hIndex)
          item.index = hIndex
        }
    
        if (item.id) { // 中间面板拖动元素（修改）
          move(dragIndex, hoverIndex)
        } else if (item.name) { // 左侧面板拖动元素（新增）
          move(dragIndex === undefined ? -1 : dragIndex, hoverIndex)
        }
      },
      drop(item, monitor) {
        if (typeof props.id !== typeof item.id && item.id) return
        
        if (item.id) { // 中间面板拖动元素（修改
        } else if (item.name) { // 左侧面板拖动元素（新增）
          const index = _.isNil(item.index) ? props.index : item.index
          props.addCard(item, index)
        }
      }
    })
  
    const [{ isDragging }, drag] = useDrag({
      type: dndType,
      item: () => {
        return {
          id: props.id,
          index: props.index
        }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    })

    const opacity = isDragging ? 0 : 1
    drag(drop(ref))
    return <Row style={{ width: '100%' }}>
      <Col
        ref={ref}
        className='cmdb-form-card serial-drop-target'
        span={colNum}
        data-handler-id={handlerId}
      >
        <div
          className={opacity ? '' : 'card-dragging'}
          style={ { height, lineHeight: height + 'px', width: isDragging ? width : null, ...iconStyle } }
        >
          { !isDragging && <Icon style={{ marginRight: 5 }} type="drag" /> }
        </div>
      </Col>
      <Col className='drag-children' span={24 - colNum}>
        {opacity ? props.children : null}
      </Col>
    </Row>
}

export default FormPanelSerial
