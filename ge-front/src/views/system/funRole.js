// 处理编辑树形————————————————————
// 获取树形节点名称
const getTreeName = function(tree) {
	let treeNode = []
	for (let i in tree) {
		treeNode.push(tree[i].name)
		if (tree[i].child && tree[i].child.length > 0) {
			treeNode = treeNode.concat(getTreeName(tree[i].child))
		}
	}
	return treeNode
}
// 根据原有部分树形获取全树形
const getAllTree = function(array, tree) {
	let newTree = tree
	for (let i in newTree) {
		for (let y in array) {
			if (newTree[i].name === array[y]) {
				newTree[i].indeterminate = true
			}
			if (newTree[i].child && newTree[i].child.length > 0) {
				newTree[i].child = getAllTree(array, newTree[i].child)
			}
		}
	}
	return newTree
}
//处理添加树形
// 截取已选————————————————————
const dealTree = function(tree) {
	let list = tree
	let newTree = []
	for (let i in list) {
		if (list[i].checked) {
			newTree.push(list[i])
		} else if (list[i].indeterminate) {
			newTree.push(list[i])
			if (list[i].child && list[i].child.length > 0) {
				list[i].child = dealTree(list[i].child)
			}
		}
	}
	return newTree
}


// 通用处理
const clearTree = function(tree) {
	let newTree = []
	let arrayItem = {}
	for (let i in tree) {
		arrayItem = {}
		if (tree[i].child && tree[i].child.length > 0) {
			arrayItem.child = clearTree(tree[i].child)
		}
		arrayItem.name = tree[i].name
		if (tree[i].flag) {
			arrayItem.flag = tree[i].flag
		}
		if (tree[i].sort) {
			arrayItem.sort = tree[i].sort
		}
		if (tree[i].title) {
			arrayItem.title = tree[i].title
		}
		if (tree[i].path) {
			arrayItem.path = tree[i].path
		}
		if (tree[i].url) {
			arrayItem.url = tree[i].url
		}
		newTree.push(arrayItem)
	}
	return newTree
}

const getUrlsList = function(tree) {
	let array = []
	for (let i in tree) {
		if (tree[i].child && tree[i].child.length > 0) {
			array = array.concat(getUrlsList(tree[i].child))
		}
		if (tree[i].url) {
			array.push(tree[i].url)
		}
	}
	return array
}

export default {
	// 编辑
	getTreeName,
	getAllTree,
	// 添加
	dealTree,
	// 通用
	clearTree,
	getUrlsList
}