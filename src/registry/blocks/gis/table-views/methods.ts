
import { createAPI } from '@airiot/client'
import _ from 'lodash'

export const getGISTable = (ids?: string[]) => {
    const api = createAPI({ resource: 'core/t/schema' })

    // 构建查询条件，与 gisv2 保持一致
    const where: any = {
        function: { '$regex': 'gis' }
    }

    // 如果传入 ids，则筛选指定表
    if (ids && ids.length > 0) {
        where.id = { '$in': ids }
    }

    const query = { where }

    return api.query(
        { fields: ['title', 'name', 'gis', 'function', 'schema', 'icon', 'device'] },
        query
    ).then(({ items }: any) => {
        const result = items?.map((item: any) => {
            let newItem = { ...item, deviceTags: item?.device?.tags }
            if (newItem?.device) delete newItem.device
            return newItem
        })

        return result
    })
}

// 查询一个表的所有表记录gis属性数据
export const getTableRecord = (table: any, filter: any = {}) => {
    const query: any = {
        skip: 0,
        limit: 10000,
        project: { name: 1, online: 1, off: 1, '_settings.gis': 1, '_settings.device': 1, '_department': 1 },
        filter
    }

    if (table?.schema?.listFields?.length) {
        table.schema.listFields.forEach((val: string) => {
            query.project = { ...query.project, [val]: 1 }
        })
    }

    const querystr = encodeURIComponent(JSON.stringify(query))
    const api = createAPI({ resource: `core/t/${table.id}/d` })

    return api.fetch('?query=' + querystr)
        .then(({ json }: any) => ({ gis: table.gis, tableId: table.id, record: json }))
}

// 获取数据点最新历史数据
export const getTableRecordDataPoint = (where: any[]) => {
    const api = createAPI({ resource: 'core/data' })
    return api.fetch('/latest', {
        method: 'POST',
        body: JSON.stringify(where)
    })
        .then(({ json, status }: any) => {
            if (json && !_.isEmpty(json) && status == 200) {
                const payload: any = {}
                json.forEach((item: any) => {
                    const id = item.tableDataId || item.id
                    const tagId = item.tagId
                    _.set(payload, `${id}.tableId`, item.tableId)
                    _.set(payload, `${id}.id`, id)
                    _.set(payload, `${id}.${tagId}`, item.value)
                })
                return Object.keys(payload).map(key => payload[key])
            }
            return []
        })
}

/** 设备层部门特殊处理*/
const handlerDatas = (arr: any[]) => {
    const obj: any = {};
    arr.forEach((item) => {
        const { table: { id } } = item; //解构赋值
        if (!obj[id]) {
            obj[id] = {
                id,
                children: []
            }
        }
        obj[id].children.push(item);
    });
    const data = Object.values(obj); // 最终输出
    return data
}

// 获取指定的表和部门的映射关系
export const getTableDepartmentFilter = async (ids: string[], department: any[]) => {

    const filterobj: any = {}

    const api = createAPI({ resource: 'core/t/schema/batch/deptmapping' })
    const departmentMappings = await api.fetch('', { method: 'POST', body: JSON.stringify(ids) })
        .then(({ json }: any) => json)

    if (departmentMappings?.length > 0) {
        // 处理部门数据
        const processedDepartments = handlerDatas(department) || [];
        // 为每个表格设置过滤条件
        processedDepartments.forEach((department: any) => {
            departmentMappings.forEach((mapping: any) => {
                const tableIndex = ids.findIndex(id => id === mapping.table);
                if (tableIndex === -1) return;
                if (mapping.data?.[department.id]) {
                    const filterConditions = department.children.map((child: any) => ({
                        [`${mapping.data[department.id]}`]: { "$regex": child.id }
                    }));
                    filterobj[mapping.table] = { '$or': filterConditions };
                } else {
                    filterobj[mapping.table] = { NoDepart: true };
                }
            });
        });
    }
    return filterobj
}

export const getReord = (tableid: string, id: string) => {
    const api = createAPI({ resource: `core/t/${tableid}/d` })
    return api.get(id)
        .then((res: any) => res)
}
