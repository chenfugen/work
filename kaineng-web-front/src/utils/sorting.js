const sortingFirst = function(tree) {
	var low = 0;
	var high = tree.length - 1; //设置变量的初始值
	var tmp, j;
	while (low < high) {
		for (j = low; j < high; ++j) { //正向冒泡,找到最大者
			if (tree[j].child && tree[j].child.length > 0) {
				tree[j].child = sortingFirst(tree[j].child)
			}
			if (tree[j].sort > tree[j + 1].sort) {
				tmp = tree[j];
				tree[j] = tree[j + 1];
				tree[j + 1] = tmp;
			}
		}
		--high; //修改high值, 前移一位
		for (j = high; j > low; --j) { //反向冒泡,找到最小者
			if (tree[j].sort < tree[j - 1].sort) {
				tmp = tree[j];
				tree[j] = tree[j - 1];
				tree[j - 1] = tmp;
			}
		}
		++low; //修改low值,后移一位
	}
	return tree;
}

const sortingSecond = function(tree) {
	tree = sortingFirst(tree)
	for (let i in tree) {
		if (tree[i].child && tree[i].child.length > 0) {
			tree[i].child = sortingSecond(tree[i].child)
		}
	}
	return tree
}

const sorting = function(tree) {
	let nTree = sortingSecond(tree)
	return nTree
}

export default sorting