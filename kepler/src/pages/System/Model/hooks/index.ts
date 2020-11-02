import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector, shallowEqual } from 'react-redux'
import { getRoleByPath } from '../../../../auth'

export function useRole(path?: string) {
  const location = useLocation()
  const menuInfo = useSelector((state: any) => state.menuInfo, shallowEqual)
  const [editRole, setEditRole] = useState(false)
  const [searchRole, setSearchRole] = useState(false)

  useEffect(() => {
    if (menuInfo && menuInfo.length) {
      let role = getRoleByPath(menuInfo, path || location.pathname)
      if (role) {
        role.children.forEach((el: any) => {
          if (
            el.accessType === 'operation' &&
            el.operationCode === 'QUERY' &&
            el.isPermission === 'Y'
          ) {
            setSearchRole(true)
          }
          if (
            el.accessType === 'operation' &&
            el.operationCode === 'UPDATE' &&
            el.isPermission === 'Y'
          ) {
            setEditRole(true)
          }
        })
      }
    }
  }, [menuInfo, location.pathname, path])
  return {
    editRole,
    searchRole
  }
}
