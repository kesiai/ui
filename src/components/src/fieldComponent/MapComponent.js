import React from 'react'
import { app, api, use, config } from 'xadmin'
import { SchemaForm } from 'xadmin-form'
import { C } from 'xadmin-ui'
import { Input, Modal, message, Tooltip, Form, Button } from 'antd'
import { EditOutlined } from '@ant-design/icons';
import AMapLoader from '@amap/amap-jsapi-loader';
import fetch from 'isomorphic-fetch'
import _ from 'lodash';
import { uuid } from '../component/Editor/utils3'
import Icon from '../component/Editor/component/Icon';
import { getFormValues } from '../component/Editor/utils'
import { useScriptVal } from '../component/Editor/utils2'
import { dealSchema } from './tool'

const handSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: _r('地址')
    },
    lng: {
      type: 'number',
      title: _r('经度')
    },
    lat: {
      type: 'number',
      title: _r('纬度')
    }
  },
  required: ['lng', 'lat']
}
const handSchema2 = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: _r('地址')
    }
  }
}

const getInit = (v) => {
  return _.isEmpty(v) ? {} : {
    center: [v.lng, v.lat],
    data: [
      {
        coordinates: [v.lng, v.lat],
        type: 'Point'
      }
    ]
  }
}

const outPointDom = (value, handleChange) => {
  return <div style={{ margin: '2px 8px 5px 8px' }} >
    <div style={{ display: 'inline-block' }}>
      <span>{_t1('经度')}：</span>
      <Input placeholder={_t1('请输入经度')} type="number" style={{ width: 250, marginRight: 20, marginBottom: 5 }} 
          value={value?.data?.[0]?.coordinates?.[0] || value?.coordinates?.[0]} onChange={e => handleChange(0, e)} />
    </div>
    <div style={{ display: 'inline-block' }}>
      <span>{_t1('纬度')}：</span>
      <Input placeholder={_t1('请输入纬度')} type="number" style={{ width: 250 }} 
          value={value?.data?.[0]?.coordinates?.[1] || value?.coordinates?.[1]} onChange={e => handleChange(1, e)} />
    </div>
  </div>
}

const getLocation = (callBack) => {
  navigator.geolocation.getCurrentPosition(onSuccess, onError)
  // 获取位置成功的回调函数
  function onSuccess(position) {
    callBack({
      lat: position.coords.latitude,
      lng: position.coords.longitude
    })
  }

  // 获取位置失败的回调函数
  function onError(error) {
    // console.error("error", error);
  }
}

const getPageHeight = () => {
  let height;
  if (typeof window.innerHeight === 'number') {
      // 现代浏览器
      height = window.innerHeight;
  } else if (document.documentElement && document.documentElement.clientHeight) {
      // IE 浏览器
      height = document.documentElement.clientHeight;
  } else if (document.body && document.body.clientHeight) {
      height = document.body.clientHeight;
  }
  return height;
}

const MapComponent = props => {
  const { input, field: { schema }, meta, antdForm, preview } = props
  const disabled = meta?.data?.disabled || false

  const f = Form.useForm()
  let values = getFormValues(schema, antdForm || f)

  const { placeholder, lngLat, positionName, canEdit, canHand, defaultVal, showType } = dealSchema(schema, values)
  const [id, setId] = React.useState(uuid(4, 16))
  
  const isMobile = config('isMobile')
  let mapId = ''
  try {
    mapId = `container-${props.schema.key}-${use('form').getFormState().values.id || id}`
  } catch {
    mapId = `container-${props.schema.key}-${id}`
  }

  const [visible, setVisible] = React.useState(false)
  const [value, setValue] = React.useState(input.value ?
    (input.value.name || '') + ' (' + input.value.lng + ',' + input.value.lat + ')' : null)
  const [inputValue, setInputValue] = React.useState(getInit(input.value))
  const [point, setPoint] = React.useState(input.value ? input.value : null)
  // 手动输入
  const [handVisible, setHandVisible] = React.useState(false)

  // 默认值生效
  React.useEffect(() => {
    setTimeout(() => { // 必须用setTimeout，否则会被拦截
      if (!value && defaultVal && input.onChange) {
        input.onChange(defaultVal)
        setValue((defaultVal.name || '') + ' (' + defaultVal.lng + ',' + defaultVal.lat + ')')
        setInputValue(getInit(defaultVal))
      } else if (!value && input.onChange) { // 没有默认值，获取当前定位
        getLocation((val) => {
          setInputValue(getInit(val))
        })
      }
    })
  }, [])

  const AMapLoad = AMapLoader.load({
    "key": "a98df42a1cbecc0bfc64090fe338b37b",
    "version": "1.4.15",
    "AMapUI": {
      "version": '1.1',
      "plugins": [],
    }
  })
  
  const initAMap = (domId) => {
    AMapLoad.then((AMap)=>{
      // 搜索框提示组件
      AMap.service(["AMap.PlaceSearch", "AMap.Autocomplete"], function() {
        let auto = new AMap.Autocomplete({
          input: domId
        });
        
        AMap.event.addListener(auto, "select", function(data){
          if (data.poi.location != undefined) {
            const datapoi = { name: data.poi.district + data.poi.address + data.poi.name, lng: data.poi.location.lng, lat: data.poi.location.lat }
            // setInputValue(data.poi.name)
            setInputValue(getInit(datapoi))
            setPoint(datapoi)
          }
        })
      })
    }).catch(err => {
        console.error(err);
    })
  }

  const replaceInput = (domID, name) => {
    const container = document.getElementById(domID).parentNode
    const oldInput = document.getElementById(domID)
    const newInput = oldInput.cloneNode(true)

    newInput.id = domID
    newInput.value = name

    container.replaceChild(newInput, oldInput)
  };

  // 地图选中的地址，同步到搜索框中
  // 高德组件本身不可控，没提供setInput方法，只能复制一个新的input，把value值改成XXX，再用高德组件重新初始化
  React.useEffect(() => {
    const domID = showType === 'map' ? "tipinput2" : "tipinput"
    const inputDom = document.getElementById(domID)
    if (inputDom && point?.name) {
      replaceInput(domID, point.name)
      setTimeout(() => { 
        initAMap(domID)
      }, 100)
    }
  }, [point?.name])

  React.useEffect(() => {
    if (showType === 'map' && !preview) {
      initAMap("tipinput2")
    }
  }, [showType])

  // 字段脚本部分
  React.useEffect(() => {
    if (values) {
      useScriptVal({ schema, value, values, record: props.record, onChange: v => {
        input.onChange(v)
        setValue(v ? (v.name || '') + '(' + v.lng + ',' + v.lat + ')' : null)
      } })
    }
  }, [JSON.stringify(values)])

  const getShowName = (v) => {
    let result = ''
    if (v) {
      result = (positionName !== false ? (v.name || '') : '') + (lngLat ? '(' + v.lng + ',' + v.lat + ')' : '')
    }
    return result
  }

  const handleOk = () => {
    setValue(getShowName(point))
    input.onChange(point)
    setVisible(false)
  }

  const handSubmit = (val) => {
    setValue(getShowName(val))
    input.onChange(val)
    setHandVisible(false)
  }

  const inputChange = (val, cb) => {
    if (JSON.stringify(val || {}) === JSON.stringify(inputValue || {})) return
    setInputValue(val)
    const [lng, lat] = val?.data?.[0]?.coordinates || []
    if (lng && lat) {
      fetch(`https://restapi.amap.com/v3/geocode/regeo?key=f1430b13cf18a4cf75ca41a7bb742874&&location=${lng},${lat}`)
      .then(response => {
        if (response.status === 200) {
          return response.json()
        }
      }).then(data => {
        const p = {
          name: data.regeocode.formatted_address,
          lng,
          lat
        }
        setPoint(p)
        cb && cb(p)
      }).catch(err => {
        setPoint({ lng, lat })
        console.error(err)
      })
    }
  }

  const openModal = () => {
    if (!canEdit) return
    setVisible(true)

    if (showType === 'map') return
    initAMap("tipinput")
  }

  if (showType === 'map') { // 直接展示地图，不用弹窗
    return <>
      <div style={{ width: '100%', marginLeft: 8 }}>
        <span style={{ display: 'inline-block', marginBottom: 8 }}>{_t1("位置：")}</span>
        {
          React.useMemo(() => {
            return <Input disabled={disabled} style={{ width: 250, marginRight: 20 }} id={preview ? null : 'tipinput2'} placeholder={_t1("输入位置进行搜索")}></Input>
          }, [preview ? null : 'tipinput2'])
        }
        {/* { point?.name && <span style={{ fontSize: 12 }}>{point.name}</span> } */}
      </div>
      <div style={{ width: '100%' }}>
        <C
          is="Gis.RecordLocation"
          noElement
          key={JSON.stringify(inputValue || {})}
          measureKey="Point"
          outPointDom={outPointDom}
          input={{
            value: inputValue,
            onChange: val => {
              inputChange(val, (point) => {
                setValue(getShowName(point))
                input.onChange(point)
              })
            }
          }}
        />
      </div>
    </>
  }

  const handleChange = (e) => {
    const value = e.target.value
    if (!value) { // 清空
      input.onChange(null)
      setValue(null)
    }
  }

  return (<>
    <div style={{ display: 'flex' }}>
      <Input {...input} allowClear onChange={handleChange} 
        value={value} placeholder={placeholder} ></Input>
      {
        canEdit && <>
          <Tooltip title={_t1("地图选点")} >
            <Icon disabled={disabled} type="Environment" onClick={openModal} style={{ margin: 'auto', padding: 6, fontSize: 18 }}></Icon>
          </Tooltip>
          {
            canHand && <Tooltip title={_t1("手动输入")} >
              <EditOutlined disabled={disabled} onClick={() => setHandVisible(true)} style={{ margin: 'auto', padding: 6, fontSize: 18 }} />
            </Tooltip>
          }
        </>
      }
    </div>
    <Modal title={_t1("地图选点")} width={'80%'} visible={visible} onOk={handleOk}
      onCancel={() => setVisible(false)} zIndex={1030} >
      <div>
        <div style={{ width: '100%', marginLeft: 8 }}>
          <span style={{ display: 'inline-block', marginBottom: 8 }}>{_t1("位置：")}</span>
          {
            React.useMemo(() => {
              return <Input style={{ width: 250, marginRight: isMobile ? 0 : 20 }} id={'tipinput'} placeholder={_t1("输入位置进行搜索")}></Input>
            }, [])
          }
          {/* { point?.name && <span style={{ display: 'inline-block', fontSize: 12 }}>{point.name}</span> } */}
        </div>
        <C
          is="Gis.RecordLocation"
          noElement
          key={JSON.stringify(inputValue?.center || {})}
          measureKey="Point"
          outPointDom={outPointDom}
          mapHeight={isMobile ? getPageHeight() - 280 : 800}
          input={{
            value: inputValue,
            onChange: inputChange
          }}
        />
      </div>
    </Modal>
    <Modal title={_t1("手动输入")} width={'60%'} visible={handVisible}
      onCancel={() => setHandVisible(false)} zIndex={1030} footer={null}>
        <SchemaForm
          onSubmit={values => handSubmit(values)}
          formKey={'table-map-' + mapId}
          initialValues={input.value?? {}}
          schema={lngLat ? handSchema : handSchema2}
          component={(props) => {
            const { children, pristine, invalid, handleSubmit, submitting } = props
            return (
              <Form onSubmit={handleSubmit}>
                {children}
                <Button style={{ marginLeft: '21%' }} type="primary" loading={submitting} disabled={pristine || invalid} onClick={handleSubmit}>{_t1('保存')}</Button>
              </Form>
            )
          }}
        />
    </Modal>
  </>)
}

export default MapComponent