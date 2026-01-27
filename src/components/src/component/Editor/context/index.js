import React from "react";
import { api } from 'xadmin'

const TableContext = React.createContext()

const TCProvider = ({ children, id, editingSchema }) => {
  const [list, setList] = React.useState()
  const [tableInfo, setTableInfo] = React.useState()

  React.useEffect(() => {
    if (id) {
      api({ name: `core/t/${id}/d` }).query({}, {}).then(({ items }) => {
        setList(items)
      })
      api({ name: `core/t/schema/${id}` }).fetch('', {}).then(res => {
        setTableInfo(res?.json)
      }).catch(err => {
        console.error(err)
      })
    }
  }, [])

  return <TableContext.Provider value={{ list, tableInfo, editingSchema }}>
    {children}
  </TableContext.Provider>
}

// 表格控件，高级编辑中使用
const Table2Context = React.createContext()

const TC2Provider = ({ children, id, editingSchema }) => {
  return <Table2Context.Provider value={{ editingSchema }}>
    {children}
  </Table2Context.Provider>
}

export { TableContext, TCProvider, Table2Context, TC2Provider }
