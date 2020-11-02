export default function userInfo(state: any = {}, action: any) {
  switch (action.type) {
    case 'user':
      return { ...state, ...action.payload }
    default:
      return state
  }
}
