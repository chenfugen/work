<template>
<div id="systemRole">
	<TableSearch :tableData="tableData" :tableSearch="tableSearch" :exportHead="tableHeader.data"></TableSearch>
	<comTable :tableData="tableData" :tableHeader="tableHeader"></comTable>

	<el-dialog :close-on-click-modal="false" title="新增" :visible.sync="addBox" width="450px" id="addRole" top="0" :modal="false">
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
			<el-form-item label="角色名称" prop="name">
				<el-input size="small"></el-input>
			</el-form-item>
			<el-form-item label="角色描述">
				<el-input type="textarea" size="small" :rows="3"></el-input>
			</el-form-item>
			<el-form-item label="角色权限">
				<el-tree :data="data" show-checkbox node-key="id" :props="defaultProps">
				</el-tree>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="addBox = false">取 消</el-button>
			<el-button type="danger" @click="addBox = false">保 存</el-button>
		</div>
	</el-dialog>
</div>
</template>

<script>
export default {
	data() {
		return {
			addBox: false,
			ruleForm: {
				name: '',
				region: '',
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
				btn: [{
					name: '新建角色',
					clickInfo: this.addRole
				}],
				funClick: this.tabSearBtnClick,
				cleanClick: this.cleanClick,
				input: [{
					pla: '角色名',
					width: '128',
					value: ''
				}, ],
				select: [],
				selectArry: [], //表格选中数据集合
			},
			tableHeader: {
				sortMethod: function() {},
				tableStatus: false,
				filters: function() {},
				handleSelectionChange: this.handleSelectionChange, //选中表格数据方法
				isSelection: [true, '55'], //是否显示序列号
				oper: { //操作栏
					label: '操作',
					prop: 'oper',
					minWidth: '90',
					fixed: 'right',
					oper: [{
							name: '编辑',
							clickFun: this.deleteRow
						},
						{
							name: '删除',
							clickFun: this.deleteRow
						},
					]
				},
				data: [ //表格头数据绑定

					{
						label: '设备编号',
						prop: '2',
						minWidth: '120',
						fixed: true
					},
					{
						label: '产品类型',
						prop: '3',
						minWidth: '120',
						fixed: false
					},
					{
						label: '产品类型',
						prop: '4',
						minWidth: '120',
						fixed: false
					},
					{
						label: '异常代码',
						prop: '5',
						minWidth: '120',
						fixed: false
					},
					{
						label: '通知内容',
						prop: '8',
						minWidth: '220',
						fixed: false
					},
					{
						label: '备注',
						prop: '6',
						minWidth: '120',
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
			tableData: [{
					xh: '1',
					2: '0000213001',
					3: '产品类型',
					4: '产品类型',
					5: '检验状态',
					6: '备注',
					9: '备注',
					8: '温度故障出现问题报错奥术大师大所大撒'
				},
				{
					xh: '1',
					2: '0000002',
					3: '产品类型',
					4: '产品类型',
					5: '检验状态',
					6: '备注',
					9: '备注',
					8: '温度故障出现问题报错奥术大师大所大撒'
				},
				{
					xh: '1',
					2: '0000003',
					3: '产品类型',
					4: '产品类型',
					5: '检验状态',
					6: '备注',
					9: '备注',
					8: '温度故障出现问题报错奥术大师大所大撒'
				},
				{
					xh: '1',
					2: '0000004',
					3: '产品类型',
					4: '产品类型',
					5: '检验状态',
					6: '备注',
					9: '备注',
					8: '温度故障出现问题报错奥术大师大所大撒'
				},
				{
					xh: '1',
					2: '0000005',
					3: '产品类型',
					4: '产品类型',
					5: '检验状态',
					6: '备注',
					9: '备注',
					8: '温度故障出现问题报错奥术大师大所大撒'
				},
				{
					xh: '1',
					2: '0000006',
					3: '产品类型',
					4: '产品类型',
					5: '检验状态',
					6: '备注',
					9: '备注',
					8: '温度故障出现问题报错奥术大师大所大撒'
				},
				{
					xh: '1',
					2: '0000007',
					3: '产品类型',
					4: '产品类型',
					5: '检验状态',
					6: '备注',
					9: '备注',
					8: '温度故障出现问题报错奥术大师大所大撒'
				},
			],
			data: [{
				id: 1,
				label: '首页',
			}, {
				id: 2,
				label: '地图',
			}, {
				id: 3,
				label: '设备管理',
				children: [{
					id: 7,
					label: '智能烹饪机'
				}]
			}, {
				id: 4,
				label: '故障管理',
				children: [{
					id: 8,
					label: '故障统计'
				}, {
					id: 9,
					label: '故障记录'
				}, {
					id: 10,
					label: '故障代码'
				}, ]
			}],
			defaultProps: {
				children: 'children',
				label: 'label'
			}
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
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});
			});
		},
		handleSelectionChange(val) {
			this.tableSearch.selectArry = val;
		},
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
		},
		handleCurrentChange(val) {
			console.log(`当前页: ${val}`);
		},
		tabSearBtnClick() {
			console.log("这里是搜索")
		},
		cleanClick() {
			console.log("这里是清除")
		},
		addRole() {
			this.dialogVisible = true;
			this.addBox = true;
			console.log("这里是新增")
		},
	}
}
</script>

<style lang="less">
#systemRole {
    width: 100%;
    float: left;
    background: #fff;
    padding-top: 24px;
    box-sizing: border-box;
    -webkit-box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    #addRole {
        > .el-dialog {
            height: 100%;
            float: right;
            margin-bottom: 0;
            > .el-dialog__footer {
                position: absolute;
                bottom: 0;
                right: 0;
            }
        }
    }
}
</style>
