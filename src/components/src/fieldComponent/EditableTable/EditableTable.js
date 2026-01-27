import React, { useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Table, Form } from 'antd';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { app, api, use } from 'xadmin'
import { C } from 'xadmin-ui'
import _ from 'lodash';
import { TC2Provider } from '../../component/Editor/context';

// 校验规则
const getRules = ({ field, tableProps, record, getOneError, initValidate }) => {
  let result = []

  if (field.need) {
    result = [...result, { required: true, message: `${field.title}${_t1('不能为空')}` }]
  }
  // 重复行校验, 页面初始化时不校验重复项
  const uniqueFields = tableProps.schema?.uniqueFields
  if (!initValidate && tableProps.schema?.uniqueRow && uniqueFields && uniqueFields.includes(field.key)) {
    const values = tableProps.input?.value || tableProps.schema?.defaultVal || []
    result.push(({ getFieldValue }) => ({
      validator(p, value) {
        const temp = values && _.filter(values, val => val?.[p.field] && value && val.key != record.key && (JSON.stringify(value) == JSON.stringify(val[p.field]) || (value?.id && value?.id == val[p.field]?.id)))
        if (!_.isEmpty(temp)) {
          return Promise.reject(new Error(_t1('该字段不允许重复')));
        } else {
          return Promise.resolve();
        }
      }
    }))
  }
  const errorNotice = tableProps.schema?.fieldRules?.fieldRules?.errorNotice // fieldRules多了一层
  if (!_.isEmpty(errorNotice)) {
    result.push(({ getFieldValue }) => ({
      validator(_, value) {
        let errors = {}
        let redTextNotice = errorNotice.filter(item => !item.noticeType || item.noticeType === 'redText')
        redTextNotice.forEach(item => {
          errors = getOneError(item, getFieldValue(), errors)
        })
        if (errors[_.field]) {
          return Promise.reject(new Error(errors[_.field]));
        } else {
          return Promise.resolve();
        }
      }
    }))
  }
  if (field.config === '文本') {
    if (field.vali) {
      result = [...result, { pattern: field.vali, message: field.title + field.valiMsg }]
    }
    if (field.numRange && field.numRange.split('-').length === 2) { // 字数限制
      if (!_.isNil(field.minLength)) {
        result = [...result, { type: 'string', min: field.minLength, message: `${field.title}${_t1('至少输入')}${field.minLength}${_t1('个字符')}` }]
      }
      if (!_.isNil(field.maxLength)) {
        result = [...result, { type: 'string', max: field.maxLength, message: `${field.title}${_t1('最多输入')}${field.maxLength}${_t1('个字符')}` }]
      }
    }
  } else if (field.config === '数字') {
    if (field.max) { // 最大值
      result = [...result, { type: 'number', max: field.max, message: `${field.title}${_t1('最大不能超过')}${field.max}` }]
    }
    if (field.min) { // 最小值
      result = [...result, { type: 'number', min: field.min, message: `${field.title}${_t1('最小不能小于')}${field.min}` }]
    }
  } else if (field.config === '选择器') {
    if (field.numRange && field.numRange.split('-').length === 2) { // 可选项数
      result.push(({ getFieldValue }) => ({
        validator(_, value) {
          const val = getFieldValue() ? getFieldValue()[_.field] : null
          const len = val?.length || 0
          if (len >= field.minItems && len <= field.maxItems) {
            return Promise.resolve();
          } else {
            return Promise.reject(new Error(field.title + _t1('选项超出可选数范围')));
          }
        }
      }))
    }
  }
  return result
}

/**
 * 拖拽行
*/
const DraggableBodyRow = ({ index, moveRow, className, style, ...restProps }) => {
  const type = 'DraggableBodyRow' + restProps.name
  const ref = useRef();
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: monitor => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: item => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: { index, type },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));

  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move', ...style }}
      {...restProps}
    />
  );
};

const EditableContext = React.createContext(null);

const EditableRow = (props) => {
  const { name, index, record, canDrag, setErrors } = props
  const [form] = Form.useForm();

  const handleFieldsChange = (_, allFields) => {
    const fs = allFields.filter(f => f?.errors?.length && f?.name?.length)
    const errors = fs.reduce((p, c) => {
      if (!p[c.name[0]]) {
        return { ...p, [c.name[0]]: c.errors }
      } else {
        return { ...p, [c.name[0]]: [...c.name[0], ...c.errors] }
      }
    }, {})
    setErrors({ errors, path: `${name}.${index}` })
  };

  return (
    <Form form={form} initialValues={record || {}} component={false} onFieldsChange={handleFieldsChange} >
      <EditableContext.Provider value={form}>
        {canDrag ? <DraggableBodyRow {...props}></DraggableBodyRow> : <tr {...props} />}
      </EditableContext.Provider>
    </Form>
  );
};

/**
 * 生成单元格组件
 */
const convert = (schema, options) => {
  const opts = options || {}
  if (opts.path === undefined) {
    opts.path = []
  }
  if (opts.lookup === undefined) {
    opts.lookup = {}
  }
  return app.get('schema_converter').reduce((prve, converter) => {
    return converter(prve, schema, opts)
  }, opts.global && opts.global.formDefaults ? _.cloneDeep(opts.global.formDefaults) : {})
}

const InputNode = ({ schema, record, onChange, form, onBlur, field = {}, antdForm }) => {
  const formValues = form.getFieldsValue() || {}
  const convertSchema = convert(schema)
  const type = schema.config == '关联字段' && !schema.relate && !schema.relateTo ? 'text' : convertSchema.type
  const formFields = app.get('form_fields')
  const Node = formFields[type]?.component
  const props = { meta: {}, ...convertSchema }
  const value = form.isFieldsTouched() ? formValues[schema.key] : record[schema.key]
  return <Node {...props} group={C('Form.FieldGroup')} record={record} input={{ value, onChange, onBlur }} field={{ ...convertSchema, ...field }} antdForm={antdForm} ></Node>
}

const EditableCell = ({
  title,
  schema,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  tableProps,
  validate,
  getOneError,
  showError,
  index,
  antdForm,
  ...restProps
}) => {
  const form = useContext(EditableContext);

  // 初始化校验 
  const initvalidator = async () => {
    try {
      await form.validateFields({ touch: false })
    } catch (errInfo) {
      handleSave(record)
    }
  }

  useEffect(() => {
    if (validate && record) {
      initvalidator()
    }
  }, [])
  
  const save = (val) => {
    form.setFieldsValue({
      [dataIndex]: val,
    });
    record[dataIndex] = val
    setTimeout(() => {
      handleSave(record)
      form.setFields([{ name: dataIndex, touched: false }]);
    })
  };

  const onBlur = () => {
    handleSave(record);
    form.setFields([{ name: dataIndex, touched: true }]);
  }
  let childNode = children;
  if (editable) {
    // 内容国际化【文本】
    const initLang = {}
    Object.keys(record).forEach(key => {
      if (key.indexOf(schema?.key + '_') > -1) {
        initLang[key.split(schema?.key + '_')?.[1]] = record[key]
      }
    })
    const field = schema?.config === '文本' ? {
      languageValue: initLang,
      languageChange: (val, name) => {
        const n = schema?.key + '_' + name
        handleSave({ ...record, [n]: val })
      }
    } : null
    // 内容国际化【文本】

    childNode = <TC2Provider editingSchema={record}>
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        help={form.isFieldTouched(dataIndex) || showError ? undefined : ''}
        validateStatus={form.isFieldTouched(dataIndex) || showError ? undefined : ''}
        rules={validate ? getRules({ field: schema, tableProps, record, getOneError }) : null}
      >
        <InputNode schema={schema} record={record} form={form} onChange={save} onBlur={onBlur} field={field} antdForm={antdForm}></InputNode>
      </Form.Item>
    </TC2Provider>
  }

  return <td {...restProps}>{childNode}</td>;
};

const parseDate = (value) => {
  if (!value) {
    return null;
  }

  // 如果是Date对象直接返回
  if (value instanceof Date) {
    return !isNaN(value.getTime()) ? value : null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  // 尝试直接解析
  const directDate = new Date(value);
  if (!isNaN(directDate.getTime())) {
    return directDate;
  }

  // 尝试常见的时间格式
  const dateFormats = [
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d{3})?Z$/, // ISO 8601格式
    /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/, // yyyy-mm-dd hh:mm:ss
    /^(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2}):(\d{2})$/, // yyyy/mm/dd hh:mm:ss
    /^(\d{4})-(\d{2})-(\d{2})$/, // yyyy-mm-dd
    /^(\d{2})-(\d{2})-(\d{4})$/, // dd-mm-yyyy
    /^(\d{4})\/(\d{2})\/(\d{2})$/, // yyyy/mm/dd
    /^(\d{2})\/(\d{2})\/(\d{4})$/, // dd/mm/yyyy
  ];

  for (const format of dateFormats) {
    const match = value.match(format);
    if (match) {
      if (match.length === 8) {
        // ISO 8601格式
        return new Date(value);
      } else if (match.length === 7) {
        // 包含时间的格式
        return new Date(
          parseInt(match[1], 10),
          parseInt(match[2], 10) - 1,
          parseInt(match[3], 10),
          parseInt(match[4], 10),
          parseInt(match[5], 10),
          parseInt(match[6], 10)
        );
      } else if (match.length === 4) {
        // 仅日期的格式
        // 处理日-月-年格式
        if (format.source.includes('(\\d{2})-(\\d{2})-(\\d{4})') ||
          format.source.includes('(\\d{2})/(\\d{2})/(\\d{4})')) {
          return new Date(
            parseInt(match[3], 10),
            parseInt(match[2], 10) - 1,
            parseInt(match[1], 10)
          );
        }
        // 处理年-月-日格式
        return new Date(
          parseInt(match[1], 10),
          parseInt(match[2], 10) - 1,
          parseInt(match[3], 10)
        );
      }
    }
  }

  return null;
}

const sortFn = (col, a, b) => {
  const field = col.key
  const valueA = a[field];
  const valueB = b[field];

  // 处理空值情况 - MongoDB中空值排在所有非空值之前
  const isNullA = valueA === null || valueA === undefined;
  const isNullB = valueB === null || valueB === undefined;

  if (isNullA && isNullB) return 0; // 两个都是空值，视为相等
  if (isNullA) return -1; // A是空值，排在B前面
  if (isNullB) return 1; // B是空值，排在A前面

  // 处理空字符串 - 视为非空值，但排在其他字符串之前
  const isEmptyStringA = typeof valueA === 'string' && valueA.trim() === '';
  const isEmptyStringB = typeof valueB === 'string' && valueB.trim() === '';

  if (isEmptyStringA && isEmptyStringB) return 0;
  if (isEmptyStringA) return -1;
  if (isEmptyStringB) return 1;

  // 数字类型排序 - 按数值大小
  if (typeof valueA === 'number' && typeof valueB === 'number') {
    return valueA - valueB;
  }

  // 检查是否为数字字符串（MongoDB会将数字字符串作为字符串排序）
  const isNumberA = !isNaN(Number(valueA)) && typeof valueA !== 'boolean';
  const isNumberB = !isNaN(Number(valueB)) && typeof valueB !== 'boolean';
  // 只有当两者都是纯数字时才按数字排序，否则按字符串排序
  if (isNumberA && isNumberB && typeof valueA !== 'string' && typeof valueB !== 'string') {
    return Number(valueA) - Number(valueB);
  }

  // 日期类型排序 - 按时间戳
  const dateA = parseDate(valueA);
  const dateB = parseDate(valueB);
  if (dateA && dateB) {
    return dateA.getTime() - dateB.getTime();
  }

  // 字符串类型排序 - MongoDB按Unicode代码点排序，区分大小写
  // 大写字母排在小写字母之前
  const strA = String(valueA);
  const strB = String(valueB);

  // 使用 localeCompare 并禁用大小写折叠，模拟MongoDB行为
  return strA.localeCompare(strB, undefined, { sensitivity: 'case' });
}

const useDndProvider = () => {
  const [dndArea, setDndArea] = useState();
  const handleRef = useCallback((node) => setDndArea(node), []);
  const html5Options = useMemo(() => ({ rootElement: dndArea }), [dndArea]);
  return { dndArea, handleRef, html5Options };
}
const EditableTable = props => {

  const { input: { value = [], onChange, name }, schema: { disabled, minCount, showPagination }, batchOption, meta, columns, setSelectedRows, selectedRows, setErrors, setDataSource, antdForm } = props
  const { getOneError } = app.get('fieldRules')
  const { submitFailed } = meta || {}

  const [showError, setShowError] = useState()

  const showTotal = (total) => _t1('共{{total}}条', { total })
  const pagination = showPagination ? { total: value?.length, showTotal, showSizeChanger: true, showQuickJumper: true } : false

  useEffect(() => {
    if (submitFailed) setShowError(true)
  }, [submitFailed])

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const handleSave = (row) => {
    onChange && onChange(value?.map(d => d?.key == row?.key ? row : d))
  };

  const columnsVal = columns.map((col) => {
    if (batchOption && col.canOrder) {
      col.sorter = (a, b) => sortFn(col, a, b)
    }
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record, index) => {
        return {
          record,
          editable: col.editable,
          dataIndex: col.dataIndex || '',
          title: col.title,
          handleSave,
          schema: col.schema,
          tableProps: props,
          validate: !_.isEmpty(meta) && batchOption,
          getOneError,
          showError,
          index,
          antdForm
        }
      }
    };
  });

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = value[dragIndex];
      const newData = update(value, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRow],
        ],
      })
      onChange && onChange(newData)
      setDataSource(newData)
    },
    [value],
  );

  const { dndArea, handleRef, html5Options } = useDndProvider();

  let val = value
  try {
    if (_.isString(value)) val = JSON.parse(value)
  } catch (e) {
    console.error('表格内容格式错误：', e)
  }
  return (
    <div ref={handleRef}>
      {dndArea && <DndProvider backend={HTML5Backend} options={html5Options}>
        {_.isEmpty(columns) ? <C is="NoData" description={_t1("表格没有配置任何字段，请先配置字段")} /> :
          <Table
            rowSelection={batchOption && !disabled ? {
              type: 'checkbox',
              onChange: (selectedKeys, selectedRows) => setSelectedRows(selectedRows),
              getCheckboxProps: (record) => ({
                disabled: minCount && (value.length - selectedRows?.length) <= minCount,
                name: record.name,
              })
            } : null}
            components={disabled ? null : components}
            onRow={(record, index) => ({
              index,
              moveRow,
              canDrag: batchOption && !disabled,
              record,
              setErrors,
              name
            })}
            bordered
            dataSource={val}
            columns={columnsVal}
            className='editable-table'
            rowClassName='editable-table-row'
            scroll={{ y: 248 }}
            pagination={pagination}
            size="small"
            key={name}
            locale={{ emptyText: <C is="NoData" /> }}
          />}
      </DndProvider>}
    </div>
  )
}

export default EditableTable
export { getRules, sortFn }