import { useState, useEffect } from 'react'
import request from '../request/request'
import { useLocation } from 'react-router-dom'
import qs from 'qs'
export function useQuerySelect(params: any) {
  const [list, setList] = useState([])
  useEffect(() => {
    request.get(params.api, params.params).then((res) => {
      setList(res.data)
    })
  }, [params])
  return list
}

// 解析url中的query参数
export function useQuery() {
  return qs.parse(useLocation().search, { ignoreQueryPrefix: true })
}
