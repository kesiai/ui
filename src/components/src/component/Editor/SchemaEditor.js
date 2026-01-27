import React from 'react'
import { use, api } from 'xadmin';
import { C, Loading } from 'xadmin-ui'
import Icon from './component/Icon'
import { SchemaForm } from 'xadmin-form'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button, Card, Modal, Tabs, Row, Col, Alert, Tooltip, message, Tag } from 'antd'
import { ImportOutlined, ExportOutlined, SettingOutlined } from '@ant-design/icons';
import _, { clone } from 'lodash'
import './style.css'

import { NewPropertiesForm } from './component/PropertiesForm'
import FormList from './component/FormList'
import getWidgets from './wigets'
import { TCProvider } from './context';
import {
  AddPanel, FormLayout, updateSchemaProperties, addDefaultVal, MappingBtn,
  addLanguageField, previewLang
} from './utils'
import { uuid } from './utils3';
import CodeEdit from './component/CodeEdit';
import WidgetChange from './component/WidgetChange'
import { getMutualRules } from '../FieldRules/getMutualRules';
import AIButton from '../../ai/AIButton';

import jckj from './svg/基础控件.svg'
import gjkj from './svg/高级控件.svg'

const categorySvg = {
  '基础控件': jckj,
  '高级控件': gjkj
}

const { TabPane } = Tabs;

const SchemaEditor = (props) => {
  const { data, data: { showField, pluginsData, id, title }, TableContext } = props
  const [item, setItem] = React.useState({})
  const [loading, setLoading] = React.useState(true)
  const { schema, draft } = item
  const [draftLoading, setDraftLoading] = React.useState(false)
  const [saveLoading, setSaveLoading] = React.useState(false)

  React.useEffect(() => {
    setLoading(true)
    api({ name: 'core/t/schema' }).get(id, { noLanguage: true }).then(res => {
      setItem(res)
      setLoading(false)
    })
  }, [JSON.stringify(pluginsData?.map(p => p.key))])

  const setBtnLoading = (mes, loading) => {
    if (mes == '发布') {
      setSaveLoading(loading)
    } else {
      setDraftLoading(loading)
    }
  }

  const saveItem = (obj, mes) => {
    setBtnLoading(mes, true)
    api({ name: 'core/t/schema' }).fetch(`/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(obj)
    }).then(({ status }) => {
      if (status == 200) {
        message.success(_t1(mes + '成功'))
      } else {
        message.error(_t1(mes + '失败'))
      }
      _r('发布失败')
      setBtnLoading(mes, false)
    }).catch((err) => { message.error(_t1(mes + '失败'), err?.detail || err?.json?.detail); setBtnLoading(mes, false) })
  }

  return <DndProvider backend={HTML5Backend}>
    {
      loading ? <Loading /> : <Editor
        hasDraft
        id={id}
        title={title}
        draft={draft}
        TableContext={TableContext}
        schema={schema}
        showField={showField}
        saveLoading={saveLoading}
        draftLoading={draftLoading}
        functions={item?.function}
        isDevice={item?.isDevice}
        onChange={(schema, mes) => saveItem({ id: data.id, schema, draft: schema }, (mes || '发布'))}
        changeDraft={schema => saveItem({ id: data.id, draft: schema }, '保存')}
      />
    }
  </DndProvider>
}

const SchemaEditor2 = (props) => {
  return <DndProvider backend={HTML5Backend}>
    <Editor {...props} {...(props.input || {})} />
  </DndProvider>
}
SchemaEditor2.useGroup = false

const Editor = (props) => {
  const { onChange, showField, editorType, draft, changeDraft, hasDraft, notInRow, ignoreConfig, id, ContextProvider,
    saveLoading, draftLoading, functions, TableContext, widgetList, customFieldConvrt, hideSave, isDevice } = props
  const pSchema = _.cloneDeep(props.schema)
  const [visible, setVisible] = React.useState(false) // 预览modal
  const [itemSelected, setItemSelected] = React.useState()
  const { user } = use('auth.user')
  const { settings } = use('get.settings')
  const { hideScript } = use('i18n.permission')
  const [schema, setSchema] = React.useState({
    'type': 'object',
    'name': 'modelProperties',
    'title': _t1('模型属性'),
    'key': 'modelProperties',
    ...(hasDraft ? (draft || pSchema) : pSchema)
  })
  const [formInvalid, setFormInvalid] = React.useState({})
  const [ifDraft, setIfDraft] = React.useState(!pSchema || !_.isEqual(draft, pSchema)) // 是否草稿内容未发布
  const tableMapping = functions?.find(f => f === 'tableMapping') // 映射表
  let setContextSchema
  try {
    setContextSchema = React.useContext(TableContext).setSchema
  } catch (error) { }

  React.useEffect(() => {
    if (!hasDraft && !props.noRefresh && pSchema && JSON.stringify(schema) !== JSON.stringify(pSchema)) {
      setSchema({
        'type': 'object',
        'name': 'modelProperties',
        'title': _t1('模型属性'),
        'key': 'modelProperties',
        ...(pSchema || {})
      })
    }
  }, [JSON.stringify(pSchema)])

  // 添加一条表单项
  const addCard = (card, index) => {
    if (tableMapping) { // 映射表不能新增字段
      message.warning(_t1('前映射表为数据库视图表，不可以进行字段的新增'))
      return
    }
    if (!card || !_.isObject(card)) return
    if (card.onlyOne) { // 该控件只能有一个
      if (Object.values(schema.properties || {}).find(f => f.config === card.config)) {
        message.warning(_t1('只能存在一个') + card.config)
        return
      }
    }

    let nowForm = [..._.compact(schema && schema.form)]
    nowForm.splice(index, 0, card.name)
    let nowSchema = {
      ...schema,
      properties: {
        ...(schema && schema.properties),
        [card.name]: addDefaultVal(card, _t1)
      },
      form: nowForm
    }
    nowSchema.listFields = nowForm.filter(key => nowSchema.properties[key].listFields)

    setSchema(nowSchema)
    setItemSelected(card.name)
  }

  // 复制一条表单项
  const copyCard = (card, oldCardIndex, e) => {
    e.stopPropagation()
    if (!card || !_.isObject(card)) return

    const newCardKey = (card.key.substring(0, card.key.length - 4) || 'C') + uuid(4, 16)
    let nowForm = [..._.compact(schema && schema.form)]
    nowForm.splice(oldCardIndex + 1, 0, newCardKey)
    let nowSchema = {
      ...schema,
      properties: {
        ...(schema && schema.properties),
        [newCardKey]: { ...card, key: newCardKey }
      },
      form: nowForm
    }
    nowSchema.listFields = nowForm.filter(key => nowSchema.properties[key].listFields)

    setSchema(nowSchema)
    setItemSelected(newCardKey)
  }

  // 删除一条表单项
  const deleteCard = (key) => {
    if (key === showField) {
      message.warning('显示字段不可删除')
      return
    }
    let nowSchema = {}
    if (key) {
      nowSchema = {
        ...schema,
        properties: {
          ..._.omit(schema.properties, [key])
        },
        listFields: _.difference(schema.form, [key]),
        form: _.difference(schema.form, [key]),
        required: _.difference(schema.required, [key])
      }
    }

    setSchema(nowSchema)
    setItemSelected(null)
  }

  // 修改一条表单项属性
  const editSchemaProperties = (key, state) => {
    const { values } = state
    const editKey = values && values.key

    setSchema(before => {
      const nowSchema = updateSchemaProperties(key, values, before)
      if (!nowSchema) return before
      return _.cloneDeep(nowSchema)
    })
    setItemSelected(editKey)
  }

  // 修改表单是否通过校验
  const setInvalid = (key, v) => {
    setFormInvalid({ ...formInvalid, [key]: v })
  }

  // 拖动表单项
  const moveCard = (form) => {
    setSchema({
      ...schema,
      form,
      listFields: form,
    })
  }

  // 保存
  const onChangeSchema = () => {
    setIfDraft(false)
    onChange && onChange(addLanguageField(schema, settings))
  }

  // 保存草稿
  const onChangeDraft = () => {
    setIfDraft(true)
    changeDraft && changeDraft(addLanguageField(schema, settings))
  }

  const addLog = (type) => {
    // 增加操作日志
    const title = props.title
    if (title) { // 工作表表定义
      const time = moment().format('YYYY-MM-DD HH:mm:ss')
      api({ name: `core/log` }).fetch('', {
        method: 'POST',
        body: JSON.stringify({
          type: '表配置' + type,
          time,
          logObj: { name: title },
          data: { name: title },
          status: '成功',
          diff: `${user?.username}于${time}对<span style=\"color: blue\">${title}</span>的表定义配置进行${type}`
        })
      }).catch(console.error)
    }
  }

  // 导入
  const importJson = (e) => {
    const file = e.target.files[0];
    const fr = new FileReader();
    fr.readAsText(file);
    let fileContent = null;
    fr.onload = () => {
      fileContent = fr.result;
      try {
        let fileObj = JSON.parse(fileContent)
        if (!fileObj.form || !fileObj.listFields || !fileObj.properties) {
          // || !fileObj.title || !fileObj.type || !fileObj.key || !fileObj.name) {
          message.error(_t1('文件格式错误'))
          return
        }
        setSchema(fileObj)
        message.success(_t1('导入成功'))
        addLog('导入')
      } catch (e) {
        message.error(e, e?.detail || e?.json?.detail)
        message.error(_t1('文件格式错误'))
      }
    };
  }
  // 导出
  const exportJson = () => {
    const content = JSON.stringify(schema);
    const blob = new Blob([content]);
    const fileName = `${props.title + '-' + _t1('表定义配置')}.json`;
    const selfURL = window[window.webkitURL ? 'webkitURL' : 'URL'];
    let elink = document.createElement('a');
    if ('download' in elink) {
      elink.download = fileName;
      elink.style.display = 'none';
      elink.href = selfURL['createObjectURL'](blob);
      document.body.appendChild(elink);

      // 触发链接
      elink.click();
      selfURL.revokeObjectURL(elink.href);
      document.body.removeChild(elink)
      addLog('导出')
    } else {
      navigator.msSaveBlob(blob, fileName);
    }
  }


  const category = _.unionBy(getWidgets(_t1, hideScript), 'category')
  const invalid = formInvalid && Object.keys(schema?.properties ?? {}).some(key => {
    return formInvalid[key]
  })

  const Provider = ContextProvider || TCProvider
  return (
    <>
      <Row>
        <Col xxl={4} xl={3}>
          <div className='table-category'>
            {
              category && category.map(item => {
                return <Card
                  bodyStyle={{ padding: 0 }}
                  headStyle={{
                    textIndent: 10, borderRadius: 20, height: 40, lineHeight: '20px',
                    minHeight: 40, margin: "8px 5px 5px 5px", padding: 0
                  }}
                  key={item.category}
                  title={<>
                    <Icon className="category-icon" svg={categorySvg[item.category]} />
                    <span style={{ fontSize: 14 }}>{_t1(item.category)}</span>
                  </>}
                  extra={[]}>
                  <AddPanel category={item.category} widgetList={widgetList} />
                </Card>
              })
            }
          </div>
        </Col>
        <Col xxl={15} xl={13}>
          <div>
            {!hideSave && <div id="table-center" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ padding: 10 }}>
                {
                  hasDraft ?
                    <Tag color={ifDraft ? 'orange' : 'green'}>
                      {ifDraft ? _t1('草稿') : _t1('发布')}
                    </Tag> : null
                }
                {
                  (functions?.find(f => f === 'tableMapping') && schema?.tableType === 'table') ?
                    <Tag color="blue">{_t1('数据库表')}</Tag> :
                    (functions?.find(f => f === 'tableMapping') && schema?.tableType === 'view') ?
                      <Tag color="blue">{_t1('数据库视图表')}</Tag> : null
                }
              </div>
              <div className="custom-editor-container-toolbox">
                <div style={{ marginRight: 10 }}>
                  <AIButton setSchema={setSchema} />
                </div>
                {
                  editorType !== 'device' && <>
                    <C is="PermissionControl" permission="script" ><CodeEdit schema={schema} setSchema={setSchema} /></C>
                    <Button onClick={() => document.getElementById('jsonImport').click()}>
                      <Tooltip title={_t1("导入")}><ImportOutlined /></Tooltip>
                    </Button>
                    <input id='jsonImport' style={{ display: 'none' }} type="file" accept=".json" onChange={importJson} />
                    <Button onClick={exportJson} ><Tooltip title={_t1("导出")}><ExportOutlined /></Tooltip></Button>
                  </>
                }
                {
                  hasDraft ? <>
                    <MappingBtn functions={functions} tableId={id} oldSchema={schema}
                      set={(s) => {
                        setSchema(s)
                        setItemSelected(null)
                        setIfDraft(false)
                        onChange && onChange(s, '同步')
                        setContextSchema && setContextSchema(s)
                      }}
                    />
                    <Button style={{ marginLeft: 10 }} type='primary' loading={draftLoading} onClick={onChangeDraft} disabled={!schema?.properties || invalid || saveLoading} >{_t1("保存草稿")}</Button>
                    <Button style={{ margin: '0 10px' }} type='primary' loading={saveLoading} onClick={onChangeSchema} disabled={!schema?.properties || invalid || draftLoading} >{draft ? _t1('更新发布') : _t1('发布')}</Button>
                  </> :
                    <Button style={{ margin: '0 10px' }} type='primary' loading={saveLoading} onClick={onChangeSchema} disabled={!schema?.properties || invalid || draftLoading} >{_t1("保存")}</Button>
                }
                <Button onClick={() => setVisible(true)} disabled={!schema?.properties || invalid} >{_t1("预览")}</Button>
              </div>
            </div>}
            <div
              className="custom-editor-container-list"
              style={{ height: 'calc(100vh - 143px)', overflowY: 'scroll' }}
            >
              <FormList
                schema={schema}
                itemSelected={itemSelected}
                setItemSelected={setItemSelected}
                onSelect={setItemSelected}
                addCard={addCard}
                deleteCard={deleteCard}
                moveCard={moveCard}
                copyItem={copyCard}
                formInvalid={formInvalid}
                showField={showField}
                notInRow={notInRow}
              />
            </div>
          </div>
        </Col>
        <Col xxl={5} xl={8}>
          <Tabs
            className="add-source-panel old-tab attrities"
            style={{
              height: 'calc(100vh - 95px)', width: 'auto', overflowY: 'scroll',
            }}
            defaultActiveKey="1"
          >
            <TabPane tab={<>
              <SettingOutlined style={{ color: "#4760CF", marginRight: 8 }} />
              <span style={{ lineHeight: '25px' }} >{_t1("属性配置")}</span>
              <WidgetChange
                schema={schema}
                selected={itemSelected}
                setSchema={setSchema}
              />
            </>} key="1">
              <Provider id={id} editingSchema={schema}>
                <NewPropertiesForm
                  schema={schema}
                  isDevice={isDevice} // 单设备表
                  onConfirm={editSchemaProperties}
                  setInvalid={setInvalid}
                  customFieldConvrt={customFieldConvrt}
                  formKey={itemSelected}
                  editorType={editorType}
                  showField={showField}
                  notInRow={notInRow}
                  ignoreConfig={ignoreConfig}
                />
              </Provider>
            </TabPane>
          </Tabs>
        </Col>
      </Row >
      <Modal
        title={_t1("表单视图预览")}
        width={'80%'}
        // style={{ maxWidth: 800 }}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={[]}
        destroyOnClose
      >
        <Tabs style={{ height: '100%', width: '100%' }} defaultActiveKey="1" >
          <TabPane tab={_t1("创建表单")} key="1">
            <SchemaForm
              formKey={'preview-create'}
              schema={{
                ...previewLang(schema),
                formEffect: getMutualRules({ schema })
              }}
              component={FormLayout}
              group={C('Custom.FieldGroup')}
            />
          </TabPane>
          <TabPane tab={_t1("编辑表单")} key="2">
            <SchemaForm
              formKey={'preview-edit'}
              schema={{
                ...previewLang(schema),
                formEffect: getMutualRules({ schema })
              }}
              initialValues={{ id: ' ' }}
              component={FormLayout}
              group={C('Custom.FieldGroup')}
            />
          </TabPane>
        </Tabs>
      </Modal>
    </>
  )
}

export default SchemaEditor
export { Editor, SchemaEditor2 }
