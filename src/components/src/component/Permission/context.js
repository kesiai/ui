import React from "react"

const PermissionContext = React.createContext()

const PermissionProvider = ({ children, ...props }) => {
  return <PermissionContext.Provider value={props}>
    {children}
  </PermissionContext.Provider>
}

export { PermissionContext, PermissionProvider }
