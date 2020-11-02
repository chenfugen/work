display: this.permisson. ? 'inlin-block' : 'none',

	handleDealPermission() {
		let menu = JSON.parse(sessionStorage.getItem('menu'))
		for (let i in menu) {
			if (menu[i].name == '') {
				let menuC = menu[i].children[0].children
				for (let y in menuC) {
					if (menuC[y].name == '') {
						this.permisson. = menuC[y].checked
					}
				}
			}
		}
	}

this.handleDealPermission()

dealNull(data) {
	if (data === null || data === undefined) {
		return '--'
	} else {
		return data
	}
},