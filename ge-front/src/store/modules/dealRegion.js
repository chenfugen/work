const dealRegion = function(province, city) {
	for (let x in province) {
		province[x].children = []
		province[x].value = province[x].provinceId
		province[x].label = province[x].name
		for (let y in city) {
			city[y].value = city[y].cityId
			city[y].label = city[y].name
			if (city[y].provinceId == province[x].provinceId) {
				province[x].children.push(city[y])
			}
		}
	}
	return province
}
export default dealRegion