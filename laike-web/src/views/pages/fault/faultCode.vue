<template>
	<div id="faultCode">
		<TableSearch
			:tableData="tableData"
			:tableSearch="tableSearch"
			:exportHead="tableHeader.data"
		></TableSearch>
		<comTable :tableData="tableData" :tableHeader="tableHeader"></comTable>

		<el-dialog
			:close-on-click-modal="false"
			:title="ifAdd ? '新增' : '编辑'"
			:visible.sync="addBox"
			width="450px"
			@close="close"
		>
			<div style="padding-right: 40px">
				<el-form
					:model="ruleForm"
					:rules="rules"
					ref="ruleForm"
					label-width="100px"
					class="demo-ruleForm"
				>
					<el-form-item label="产品类型" prop="deviceType">
						<el-select
							size="small"
							placeholder="请选择产品类型"
							v-model.trim="ruleForm.deviceType"
						>
							<el-option
								v-for="(i, x) in $store.state.oldStore
									.deviceTypes"
								:key="x"
								:label="i"
								:value="i"
							></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="产品型号" prop="deviceModel">
						<el-select
							size="small"
							placeholder="请选择产品型号"
							no-data-text="请先选择产品类型"
							v-model.trim="ruleForm.deviceModel"
						>
							<el-option
								v-for="(i, x) in $store.state.oldStore.types[
									ruleForm.deviceType
								]"
								:key="x"
								:label="i"
								:value="i"
							></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="故障代码" prop="code">
						<el-input
							size="small"
							v-model.trim="ruleForm.code"
						></el-input>
					</el-form-item>
					<el-form-item label="故障含义" prop="content">
						<el-input
							type="textarea"
							size="small"
							:rows="3"
							v-model.trim="ruleForm.content"
						></el-input>
					</el-form-item>
					<el-form-item label="通知内容" prop="showMessage">
						<el-input
							type="textarea"
							size="small"
							:rows="3"
							v-model.trim="ruleForm.showMessage"
						></el-input>
					</el-form-item>
					<el-form-item label="备注" prop="note">
						<el-input
							type="textarea"
							size="small"
							:rows="3"
							v-model.trim="ruleForm.note"
						></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="addBox = false">取 消</el-button>
					<el-button type="danger" @click="submitForm('ruleForm')"
						>保 存</el-button
					>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			addBox: false,
			ifAdd: true,
			ruleForm: {
				deviceType: "", //产品类型
				deviceModel: "", //产品型号
				code: "", //故障代码
				content: "", // 故障含义
				showMessage: "", //通知内容
				note: "", //备注
			},
			rules: {
				deviceType: [
					{
						required: true,
						message: "请选择产品类型",
						trigger: "change",
					},
				],
				deviceModel: [
					{
						required: true,
						message: "请选择产品型号",
						trigger: "change",
					},
				],
				code: [
					{
						required: true,
						message: "请输入故障代码",
						trigger: "blur",
					},
				],
				content: [
					{
						required: true,
						message: "请输入故障含义",
						trigger: "blur",
					},
				],
				showMessage: [
					{
						required: true,
						message: "请输入通知内容",
						trigger: "blur",
					},
				],
			},
			tableSearch: {
				isExport: false,
				exportName: "",
				btn: [
					{
						name: "新增",
						clickInfo:
							this.$store.state.oldStore.authThree.indexOf(
								"d31"
							) != -1
								? this.open
								: 0,
					},
				],
				funClick: this.getFaultCodes,
				cleanClick: this.cleanClick,
				input: [
					{
						pla: "故障代码",
						width: "178",
						value: "",
					},
				],
				selectArry: [], //表格选中数据集合
			},
			tableHeader: {
				sortMethod: function () {},
				tableStatus: false,
				filters: this.filters,
				tableHeight: "calc(100% - 86px)",
				comHeight: "calc(100% - 10px)",
				handleSelectionChange: 0, //选中表格数据方法
				isSelection: [false, "55"], //是否显示序列号
				oper: {
					//操作栏
					label: "操作",
					prop: "oper",
					minWidth: "100",
					fixed: "right",
					oper: [
						{
							name: "编辑",
							clickFun:
								this.$store.state.oldStore.authThree.indexOf(
									"d32"
								) != -1
									? this.edit
									: 0,
						},
						{
							name: "删除",
							clickFun:
								this.$store.state.oldStore.authThree.indexOf(
									"d30"
								) != -1
									? this.deleteRow
									: 0,
						},
					],
				},
				data: [
					//表格头数据绑定
					{
						label: "产品类型",
						prop: "deviceType",
						minWidth: "120",
						fixed: false,
						filters: this.$store.state.oldStore.deviceTypeFilters,
						filterList: [],
					},
					{
						label: "产品型号",
						prop: "deviceModel",
						minWidth: "120",
						fixed: false,
						filters: this.$store.state.oldStore.deviceModelFilters,
						filterList: [],
					},
					{
						label: "故障代码",
						prop: "code",
						minWidth: "120",
						fixed: false,
					},
					{
						label: "故障含义",
						prop: "content",
						minWidth: "220",
						fixed: false,
					},
					{
						label: "通知内容",
						prop: "showMessage",
						minWidth: "220",
						fixed: false,
					},
					{
						label: "备注",
						prop: "note",
						minWidth: "120",
						fixed: false,
					},
					{
						label: "创建时间",
						prop: "createTime",
						minWidth: "156",
						fixed: false,
					},
					{
						label: "更新时间",
						prop: "updateTime",
						minWidth: "156",
						fixed: false,
					},
				],
				pagination: {
					currentPage: 1, // 当前页码
					total: 0, //总页数
					pageSize: 20, //每页数据条数
					pageSizes: [20, 50, 100, 200], //每页数据条数集合
					handleSizeChange: this.handleSizeChange, //切换每页多少条
					handleCurrentChange: this.handleCurrentChange, //切换当前页码
				},
			},
			tableData: [],
			faultCodes: {
				code: "", //故障代码
				deviceType: "", //产品类型
				deviceModel: "", //产品型号
				pageNumber: 1, //分页页数
				pageSize: 20, //分页每页数量
			},
		};
	},
	mounted() {
		this.getFaultCodes();
	},
	methods: {
		submitForm(formName) {
			var ajax = this.$http.addFaultCode;
			if (!this.ifAdd) {
				ajax = this.$http.updataFaultCode;
				this.$confirm(
					"编辑此信息后，系统无法解析原故障代码数据，web及app端无法收到相应推送信息",
					"确认编辑此故障代码?",
					this.$filters.confirm1()
				).then(() => {
					this.$refs[formName].validate((valid) => {
						if (valid) {
							ajax(this.ruleForm).then((res) => {
								if (res.data.success) {
									this.addBox = false;
									this.getFaultCodes();
								}
							});
						} else {
							return false;
						}
					});
				});
			} else {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						ajax(this.ruleForm).then((res) => {
							if (res.data.success) {
								this.addBox = false;
								this.getFaultCodes();
							}
						});
					} else {
						return false;
					}
				});
			}
		},
		deleteRow(index, row) {
			this.$confirm(
				"删除此信息后，系统无法解析相应故障，web及app端无法收到相应推送信息",
				"确认删除此故障代码?",
				this.$filters.confirm()
			).then(() => {
				this.$http.deleteFaultCode(row.id).then((res) => {
					if (res.data.success) {
						this.getFaultCodes();
					}
				});
			});
		},
		edit(index, row) {
			this.ifAdd = false;
			this.addBox = true;
			this.$nextTick(() => {
				this.ruleForm.id = row.id;
				this.ruleForm.deviceType = row.deviceType;
				this.ruleForm.deviceModel = row.deviceModel;
				this.ruleForm.code = row.code;
				this.ruleForm.content = row.content;
				this.ruleForm.showMessage = row.showMessage;
				this.ruleForm.note = row.note;
			});
		},
		getFaultCodes() {
			this.faultCodes.code = this.tableSearch.input[0].value;
			this.tableHeader.tableStatus = false;
			this.$http.faultCodes(this.faultCodes).then((res) => {
				this.tableData = res.data.rows;
				this.tableHeader.tableStatus = true;
				this.tableHeader.pagination.total = res.data.total;
				if (res.data.total > 0 && res.data.rows.length == 0) {
					this.tableHeader.pagination.currentPage = this.faultCodes.pageNumber = 1;
					this.getFaultCodes();
				}
				this.$nextTick(() => {
					this.tableHeader.tableStatus = true;
				});
			});
		},
		open() {
			this.ifAdd = true;
			this.addBox = true;
		},
		handleSizeChange(val) {
			this.tableHeader.pagination.pageSize = this.faultCodes.pageSize = val;
			this.getFaultCodes();
		},
		handleCurrentChange(val) {
			this.tableHeader.pagination.currentPage = this.faultCodes.pageNumber = val;
			this.getFaultCodes();
		},
		cleanClick() {
			this.tableSearch.input[0].value = "";
			this.tableHeader.pagination.currentPage = 1;
			this.faultCodes.code = "";
			this.faultCodes.deviceType = "";
			this.faultCodes.deviceModel = "";
			this.tableHeader.data.forEach((item) => {
				if (item.hasOwnProperty("filterList")) {
					item.filterList = [];
				}
			});
			this.getFaultCodes();
		},
		close() {
			this.$refs.ruleForm.resetFields();
		},
		//筛选列
		filters(filters) {
			var name;
			for (var x in filters) {
				name = x;
			}
			this.faultCodes[name] = filters[name][0];
			this.getFaultCodes();
		},
	},
};
</script>

<style lang="less">
#faultCode {
	width: 100%;
	height: 100%;
	float: left;
	background: #fff;
	padding-top: 24px;
	box-sizing: border-box;
	-webkit-box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
	box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
	border-radius: 4px;
	.el-select--small {
		width: 100%;
	}
	.el-dialog__body {
		text-align: right;
	}
}
</style>
