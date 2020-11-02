export function getRoleByPath(menus: any, path: string): any {
  let route
  let queue = [...menus]
  bfs(path)
  return route
  function bfs(path: string) {
    while (queue.length) {
      let length = queue.length
      for (let i = 0; i < length; i++) {
        let node = queue.shift()
        if (node.url.toLowerCase() === path.toLowerCase()) {
          route = node
          return
        }
        for (let j = 0; j < node.children.length; j++) {
          queue.push(node.children[j])
        }
      }
    }
  }
}
