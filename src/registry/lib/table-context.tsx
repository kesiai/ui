import React from "react";
import { createAPI } from '@kesi/client';

interface TableContextValue {
  list?: any[]
  tableInfo?: any
  editingSchema?: any
}

interface Table2ContextValue {
  editingSchema?: any
}

interface TCProviderProps {
  children: React.ReactNode
  id?: string
  editingSchema?: any
}

const TableContext = React.createContext<TableContextValue | undefined>(undefined)

const TCProvider: React.FC<TCProviderProps> = ({ children, id, editingSchema }) => {
  const [list, setList] = React.useState<any[]>()
  const [tableInfo, setTableInfo] = React.useState<any>()

  React.useEffect(() => {
    if (id) {
      const dataApi = createAPI({ resource: `core/t/${id}/d` })
      const schemaApi = createAPI({ resource: `core/t/schema/${id}` })

      dataApi.query({}).then(({ items }: any) => {
        setList(items)
      }).catch((err: Error) => {
        console.error(err)
      })

      schemaApi.fetch('').then((res: any) => {
        setTableInfo(res?.json)
      }).catch((err: Error) => {
        console.error(err)
      })
    }
  }, [id])

  return <TableContext.Provider value={{ list, tableInfo, editingSchema }}>
    {children}
  </TableContext.Provider>
}

// 表格控件，高级编辑中使用
const Table2Context = React.createContext<Table2ContextValue | undefined>(undefined)

const TC2Provider: React.FC<TCProviderProps> = ({ children, editingSchema }) => {
  return <Table2Context.Provider value={{ editingSchema }}>
    {children}
  </Table2Context.Provider>
}

export { TableContext, TCProvider, Table2Context, TC2Provider }
