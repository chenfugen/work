<template>
<div id="systemRole">
	<TableSearch :tableData="tableData" :tableSearch="tableSearch" :exportHead="tableHeader.data"></TableSearch>
	<comTable :tableData="tableData" :tableHeader="tableHeader"></comTable>
</div>
</template>

<script>
export default {
	data() {
		return {
			ruleForm: {
				operator: '', //操作人
				operateStartTime: '', //操作开始时间
				operateEndTime: '', //操作结束时间
				pageNumber: 1, //分页页数
				pageSize: 10 //分页每页数量
			},
			rules: {
				name: [{
					required: true,
					message: '请输入活动名称',
					trigger: 'blur'
				}, ],
				region: [{
					required: true,
					message: '请选择活动区域',
					trigger: 'change'
				}],
			},
			tableSearch: {
				isExport: false,
				exportName: '',
				funClick: this.getSystemLogs,
				cleanClick: this.cleanClick,
				input: [{
					pla: '操作人',
					width: '128',
					value: ''
				}, ],
				select: [],
				picker: {
					value: '',
					startPlaceholder: '操作开始日期',
					endPlaceholder: '操作结束日期',
				},
				selectArry: [], //表格选中数据集合
			},
			tableHeader: {
				sortMethod: function() {},
				tableStatus: false,
				filters: function() {},
				tableHeight: 'calc(100% - 86px)',
				comHeight: 'calc(100% - 10px)',
				handleSelectionChange: 0, //选中表格数据方法
				isSelection: [false, '55'], //是否显示序列号
				data: [ //表格头数据绑定
					{
						label: '操作人',
						prop: 'operator',
						minWidth: '120',
						fixed: false
					},
					{
						label: '操作内容',
						prop: 'content',
						minWidth: '240',
						fixed: false
					},
					{
						label: '操作时间',
						prop: 'operateTime',
						minWidth: '160',
						fixed: false
					},
				],
				pagination: {
					currentPage: 1, // 当前页码
					total: 0, //总页数
					pageSize: 20, //每页数据条数
					pageSizes: [20, 50, 100, 200], //每页数据条数集合
					handleSizeChange: this.handleSizeChange, //切换每页多少条
					handleCurrentChange: this.handleCurrentChange, //切换当前页码
				}
			},
			tableData: [],
		}
	},
	methods: {
		deleteRow(index, row) {
			console.log(row)
			this.$confirm('确认删除此设备吗?', '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				rows.splice(index, 1);
				this.$message({
					type: 'success',
					message: '删除成功!'
				});
			})
		},
		handleSelectionChange(val) {
			this.tableSearch.selectArry = val;
		},
		handleSizeChange(val) {
			this.ruleForm.pageSize = this.tableHeader.pagination.pageSize = val;
			this.getSystemLogs();
		},
		handleCurrentChange(val) {
			this.ruleForm.pageNumber = this.tableHeader.pagination.currentPage = val;
			this.getSystemLogs();
		},
		cleanClick() {
			this.ruleForm.operator = this.tableSearch.input[0].value = '';
			if (this.tableSearch.picker.value) {
				this.tableSearch.picker.value = ''
			}
			this.tableHeader.pagination.currentPage = 1;
			this.ruleForm.operateStartTime = '';
			this.ruleForm.operateEndTime = '';
			this.getSystemLogs();
		},
		getSystemLogs() {
			this.ruleForm.operator = this.tableSearch.input[0].value;
			if (this.tableSearch.picker.value) {
				this.ruleForm.operateStartTime = this.$filters.dateFilter(this.tableSearch.picker.value[0], '');
				this.ruleForm.operateEndTime = this.$filters.dateFilter(this.tableSearch.picker.value[1], '');
			} else {
				this.ruleForm.operateStartTime = '';
				this.ruleForm.operateEndTime = '';
			}
			this.$http.systemLogs(this.ruleForm).then(res => {
				if (res.data.success) {
					this.tableData = res.data.rows;
					this.tableHeader.pagination.total = res.data.total;
					if (res.data.total > 0 && res.data.rows.length == 0) {
						this.ruleForm.pageNumber = this.tableHeader.pagination.currentPage = 1;
						this.getSystemLogs();
					}
					this.$nextTick(() => {
						this.tableHeader.tableStatus = true;
					})
				}
			})
		},
	},
	mounted() {
		this.getSystemLogs()
	}
}
</script>

<style lang="less">
// .el-select--small{
//     width: 100%;
// }
// .el-dialog__body {
//     text-align: right;
// }
#systemRole {
    width: 100%;
    height: 100%;
    float: left;
    background: #fff;
    padding-top: 24px;
    box-sizing: border-box;
    -webkit-box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
    border-radius: 4px;
}
</style>
