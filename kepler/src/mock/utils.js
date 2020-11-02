export function createObjectData(data) {
  return {
    msg: '请求成功',
    success: true,
    code: 100,
    data
  }
}

export function addPre(api) {
  return new RegExp(`^${api}(\\?\\w+=\\w+(&\\w+=\\w+)?)?`)
}
