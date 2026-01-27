import React from "react"
import { api, app } from "xadmin"
import { Model } from "xadmin-model"
import { C, Loading } from "xadmin-ui"
import { Card, Row, Col, Tag } from "antd"
import TableFieldRender from "../../TableFieldRender"

function parseJsonStrings(data) {
  if (!data) return data
  const clonedData = JSON.parse(JSON.stringify(data));

  const processValue = (value) => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (typeof parsed === 'object' && parsed !== null) {
          return processValue(parsed);
        }
        return value;
      } catch (e) {
        return value;
      }
    }

    if (Array.isArray(value)) {
      return value.map(item => processValue(item));
    }

    if (typeof value === 'object' && value !== null) {
      Object.keys(value).forEach(key => {
        value[key] = processValue(value[key]);
      });
      return value;
    }

    return value;
  };

  return processValue(clonedData);
}

const ItemShow = (props) => {
  const { relateSchema, val, field, detailPage } = props

  if (detailPage) { // 详情页
    return <Card style={{ backgroundColor: "#f0f1f3", borderRadius: 5, width: 500, margin: "5px 5px 0 0", display: 'inline-block' }}>
      <Row>
        <Col span={5}>{_t1('记录编号')}：</Col>
        <Col span={19}>{val.id}</Col>
      </Row>
      {
        relateSchema.relateShowFields.map(f => <Row>
          <Col span={5}>{f.title}：</Col>
          <Col span={19}>
            <TableFieldRender value={val[f.key]} schema={f.fieldSchema} item={val} wrap="span" />
          </Col>
        </Row>)
      }
    </Card>
  } else if (relateSchema.relateShowFields?.length > 0) { // 多字段
    return <Card style={{ backgroundColor: "#f0f1f3", borderRadius: 5, width: 'calc(50% - 5px)', margin: "5px 5px 0 0", display: 'inline-block' }}>
      <Row style={{ marginBottom: 5 }}><Col>{val[field?.displayField || 'name']}</Col></Row>
      {
        relateSchema.relateShowFields.map(f => <Row style={{ color: 'gray', fontSize: 12 }}>
          <Col span={4}>{f.title}：</Col>
          <Col span={18}>
            <TableFieldRender value={val[f.key]} schema={f.fieldSchema} item={val} wrap="span" />
          </Col>
        </Row>)
      }
    </Card>
  } else { // 无多字段
    return <Tag color="#f0f1f3">{val[field?.displayField || 'name']}</Tag>
  }
}

const TableShow = (props) => {
  const { relateSchema, input, field, schema, val } = props
  const tableID = relateSchema?.relate?.id

  const [loading, setLoading] = React.useState(true)
  const [state, setState] = React.useState(null)

  React.useEffect(() => {
    if (tableID) {
      api({ name: 'core/t/schema' }).get(tableID).then(({ schema }) => {
        setLoading(false)
        setState(schema)
      })
    } else {
      setLoading(false)
    }
  }, [tableID])

  React.useEffect(() => {
    if (relateSchema?.relateTo) {
      setState(app.get('models')[relateSchema.relateTo])
    }
  }, [relateSchema?.relateTo])
  
  const modelSchema = {
    ...state,
    name: schema.name,
    batchActions: null,
    itemActions: null,
    listFields: [field?.displayField, relateSchema?.showField, ...(field?.relateShowFields || []).map(item => item.key)].filter(k => !!k)
  }
  const modelKey = tableID + modelSchema.listFields.join(',')  // 用于 Model 刷新

  if (loading) return <Loading />
  if (!state) return null
  if (!state?.listFields?.length > 0) return <div>{_t1('请从右侧属性配置中选择显示字段')}</div>

  return <div style={{ width: '100%', marginTop: 5 }}>
    <Model
      modelKey={modelKey}
      key={modelKey}
      schema={modelSchema}
    >
      <C is="Model.DataTable" items={val || [{ id: ' ' }]} />
    </Model>
  </div>
}

const DataShow = (props) => {
  const { relateSchema, input } = props
  const [expand, setExpand] = React.useState(false)

  if (relateSchema.showType === 'select') {
    return null
  } else if (relateSchema.showType === 'card') {
    if (_.isArray(input.value)) {
      const list = input.value.length > 6 && !expand ? input.value.slice(0, 6) : input.value

      return <div style={{ margin: '5px 0' }}>
        {list?.map(v => <ItemShow key={v.id} {...props} val={parseJsonStrings(v)} />)}
        {
          input.value?.length > 6 && !expand && <div
            onClick={() => setExpand(true)}
            style={{ color: 'rgb(65 85 185)', cursor: 'pointer' }}
          >{_t1('展开更多（共{{num}}条）', { num: input.value?.length })}</div>
        }
        {
          input.value?.length > 6 && expand && <div
            onClick={() => setExpand(false)}
            style={{ color: 'rgb(65 85 185)', cursor: 'pointer' }}
          >{_t1('收起（共{{num}}条）', { num: input.value?.length })}</div>
        }
      </div>
    } else if (input.value) {
      return <div style={{ margin: '5px 0' }}>
        <ItemShow {...props} val={parseJsonStrings(input.value)} />
      </div>
    } else {
      return null
    }
  } else if (relateSchema.showType === 'table') {
    return <TableShow {...props} val={parseJsonStrings(input.value)} />
  }
  return null
}

export default DataShow
