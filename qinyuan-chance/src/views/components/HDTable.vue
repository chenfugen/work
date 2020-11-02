<template>
<div id="HDTable">
	<Table ref='table' :loading='tableLoading' :columns="columns" @on-selection-change='handleChange' :data="listData" border></Table>
	<Page :current='pageNum' :total="total" :page-size='pageSize' @on-change='filp' @on-page-size-change='handleChangePageSize' size="small" :page-size-opts='[10,20,30,40]' class="right marginTop" show-total show-elevator show-sizer />
</div>
</template>
<script>
export default {
	name: "HDTable",
	data() {
		return {
			tableLoading: false,
			para: {},
			dataApi: '',
			pageNum: 1,
			pageSize: 10,
			total: 0,
			listData: [],
		}
	},
	props: {
		columns: Array,
	},
	methods: {
		getListData(dataApi, para) {
			this.dataApi = dataApi
			let that = this
			this.tableLoading = true
			this.para = para
			let object = {
				pageNum: that.pageNum,
				pageSize: that.pageSize,
				...para
			}
			this.$Ax.get(dataApi, {
				params: object
			}).then(res => {
				this.listData = res.data.data
				this.total = res.data.total
				this.tableLoading = false
			}).catch(err => {
				console.log(err);
			})
		},
		filp(pageNum) {
			this.pageNum = pageNum
			this.getListData(this.dataApi, this.para)
		},
		handleChangePageSize(pageSize) {
			this.pageSize = pageSize
			this.getListData(this.dataApi, this.para)
		},
		handleChange(selection) {
			this.$emit('changeSel', selection)
		},
	}
}
</script>
<style scoped>
</style>
