export default function menuInfo(state: any = [], action: any) {
  switch (action.type) {
    case 'menu':
      return [...action.payload]
    default:
      return state
  }
}
