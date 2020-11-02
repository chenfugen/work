<template>
	<div id="MCU">
		<TableSearch :tableData="tableData" :tableSearch="tableSearch" :exportHead="tableHeader.data"></TableSearch>
		<comTable :tableData="tableData" :tableHeader="tableHeader"></comTable>

		<el-dialog
			:close-on-click-modal="false"
			:title="isAdd?'新增MCU固件版本':'编辑MCU固件版本'"
			:visible.sync="addBox"
			width="550px"
			@close="close"
			v-loading="loading"
			:element-loading-text="uploadNum==100?'文件上传完成，数据加载中':'文件上传中:'+uploadNum+'%'"
			element-loading-spinner="el-icon-loading"
			element-loading-background="rgba(0, 0, 0, 0.8)"
		>
			<div style="padding-right:40px;">
				<el-form
					:model="ruleForm"
					:rules="rules"
					ref="ruleForm"
					label-width="100px"
					class="demo-ruleForm"
				>
					<el-form-item label="版本名称" prop="name">
						<el-input size="small" v-model.trim="ruleForm.name"></el-input>
					</el-form-item>
					<el-form-item label="版本号" prop="version1">
						<el-input-number
							v-model="ruleForm.version1"
							:disabled="!isAdd"
							:precision="2"
							controls-position="right"
							:min="0.01"
							:step="0.01"
							:max="9.99"
						></el-input-number>
					</el-form-item>
					<el-form-item label="强制更新" prop="force">
						<el-radio v-model="ruleForm.force" :label="true">是</el-radio>
						<el-radio v-model="ruleForm.force" :label="false">否</el-radio>
					</el-form-item>
					<el-form-item label="产品类型" prop="deviceType">
						<el-select
							size="small"
							placeholder="请选择产品类型"
							:disabled="!isAdd"
							v-model.trim="ruleForm.deviceType"
						>
							<el-option v-for="(i,x) in $store.state.oldStore.deviceTypes" :key="x" :label="i" :value="i"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="产品型号" prop="deviceModel">
						<el-select
							size="small"
							placeholder="请选择产品型号"
							no-data-text="请先选择产品类型"
							:disabled="!isAdd"
							@change="deviceModelChang"
							v-model.trim="ruleForm.deviceModel"
						>
							<el-option
								v-for="(i,x) in $store.state.oldStore.types[ruleForm.deviceType]"
								:key="x"
								:label="i"
								:value="i"
							></el-option>
						</el-select>
					</el-form-item>
					<!-- <el-form-item label="版本链接" prop="fileName">
                        <el-input size="small" v-model.trim="ruleForm.fileName"></el-input>
					</el-form-item>-->
					<el-form-item label="文件上传" prop="fileName" v-if="ruleForm.deviceModel!=''">
						{{addFile?'':oldName}}
						<button
							v-if="!addFile"
							style="float:right;margin-top: 8px;"
							@click.prevent="reUpload"
						>重新上传</button>
						<input
							v-if="addFile"
							ref="fileInput"
							type="file"
							@change="fileChang"
							accept="ruleForm.deviceModel=='CF5'?'.pkg':'.bin'"
						/>
						<br />
						仅支持.{{ruleForm.deviceModel=='CF5'?'pkg':'bin'}}的二进制文件
					</el-form-item>
					<el-form-item label="更新内容" prop="note">
						<el-input type="textarea" size="small" maxlength="100" :rows="3" v-model="ruleForm.note"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="addBox = false">取 消</el-button>
					<el-button type="danger" @click="submitForm('ruleForm')">保 存</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			isAdd: false,
			addFile: true,
			loading: false,
			uploadNum: 0,
			addBox: false,
			ruleForm: {
				name: "", //版本名称
				version1: "", //版本号
				version: "", //版本号
				deviceType: "", //产品类型
				deviceModel: "", //产品型号
				force: true,
				fileOriginalName: "",
				fileName: "", //url链接
				note: "", //更新内容
				file: "",
			},
			oldName: "_.",
			rules: {
				name: [
					{
						required: true,
						message: "请输入版本名称",
						trigger: "blur",
					},
				],
				version1: [
					{
						required: true,
						message: "请输入版本号",
						trigger: "blur",
					},
				],
				deviceType: [
					{
						required: true,
						message: "请选择产品类型",
						trigger: "change",
					},
				],
				force: [
					{
						required: true,
						message: "请选择强制更新",
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
				fileName: [
					{
						required: true,
						message: "请上传版本文件",
						trigger: "change",
					},
				],
			},
			tableSearch: {
				isExport: false,
				noSearch: true,
				exportName: "",
				btn: [
					{
						name: "新增MCU固件版本",
						clickInfo:
							this.$store.state.oldStore.authThree.indexOf("j11") != -1
								? this.addRow
								: 0,
					},
				],
				funClick: this.getMCU,
				cleanClick: this.cleanClick,
				input: [],
				select: [],
				selectArry: [], //表格选中数据集合
			},
			tableHeader: {
				sortMethod: function () {},
				tableStatus: false,
				filters: this.filters,
				handleSelectionChange: 0, //选中表格数据方法
				isSelection: [false, "55"], //是否显示序列号
				tableHeight: "calc(100% - 86px)",
				comHeight: "calc(100% - 10px)",
				oper: {
					//操作栏
					label: "操作",
					prop: "oper",
					minWidth: "135",
					fixed: "right",
					oper: [
						{
							name: "编辑",
							clickFun:
								this.$store.state.oldStore.authThree.indexOf("j12") != -1
									? this.updateRow
									: 0,
						},
						{
							name: "删除",
							clickFun:
								this.$store.state.oldStore.authThree.indexOf("j10") != -1
									? this.deleteRow
									: 0,
						},
					],
				},
				data: [
					//表格头数据绑定
					{
						label: "版本名称",
						prop: "name",
						minWidth: "120",
						fixed: false,
					},
					{
						label: "版本号",
						prop: "version",
						minWidth: "120",
						fixed: false,
					},
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
						label: "URL",
						prop: "url",
						minWidth: "640",
						fixed: false,
					},
					// edit by Nelson
					{
						label: "MD5",
						prop: "fileMd5",
						minWidth: "300",
						fixed: false,
					},
					{
						label: "更新内容",
						prop: "note",
						minWidth: "120",
						fixed: false,
					},
					{
						label: "强制更新",
						prop: "force",
						minWidth: "86",
						fixed: false,
					},
					{
						label: "发布时间",
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
					{
						label: "发布人",
						prop: "creator",
						minWidth: "120",
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
			MCU: {
				deviceType: "",
				deviceModel: "",
				pageNumber: 1,
				pageSize: 20,
			},
			// edit by Nelson
			choseFiles: false, // 标示固件内容是否被修改
			fileNameBeforeEdit: null, // 编辑前文件名
		};
	},
	mounted() {
		this.getMCU();
	},
	methods: {
		// 获取表格数据
		getMCU() {
			this.$http.MCU(this.MCU).then((res) => {
				if (res.data.success) {
					this.tableData = res.data.rows;
					this.tableHeader.pagination.total = res.data.total;
					if (res.data.total > 0 && res.data.rows.length == 0) {
						this.tableHeader.pagination.currentPage = this.rules.pageNumber = 1;
						this.getMCU();
					}
					this.$nextTick(() => {
						this.tableHeader.tableStatus = true;
					});
				}
			});
		},
		// 提交表单
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					let obj = Object.assign({}, this.ruleForm);
					if (obj.version1.toString().split(".").length == 1) {
						obj.version1 = obj.version1.toString() + ".00";
					}
					if (obj.version1.toString().split(".").length > 1) {
						if (obj.version1.toString().split(".")[1].length < 2) {
							obj.version1 = obj.version1.toString() + "0";
						}
					}
					obj.version = obj.version1;
					var data = new FormData();
					data.append("fileName", obj.fileName);
					data.append("file", obj.file);
					var ajax = this.$http.addMCU;
					if (!this.isAdd) {
						ajax = this.$http.updataMCU;
					}
					if (!this.choseFiles) {
						ajax(obj).then((res) => {
							this.addBox = false;
							if (res.data.success) {
								this.getMCU();
							}
						});
					} else {
						this.loading = true;
						this.$http
							.newBinFileUp(data, this.upload)
							.then((res) => {
								obj.fileName = res.data.fileName;
								this.loading = false;
								if (res.data.success) {
									let para = {
										...obj,
										fileMd5: res.data.fileMd5,
									};
									ajax(para).then((res) => {
										this.addBox = false;
										if (res.data.success) {
											// 成功创建版本
											this.getMCU();
											if (this.fileNameBeforeEdit) {
												this.$http.deleteFile(
													this.fileNameBeforeEdit
												);
											}
										} else {
											// 创建版本失败，删除线上文件
											this.$http
												.deleteFile(obj.fileName)
												.then((res) => {
													this.getMCU();
												});
										}
									});
								}
							});
					}
				} else {
					return false;
				}
			});
		},
		// 上传文件
		upload(e) {
			this.uploadNum = ((e.loaded / e.total) * 100) | 0;
		},
		// 重新上传提醒
		reUpload(index) {
			this.$confirm(
				"原文件将删除",
				"确认重新上传文件吗?",
				this.$filters.confirm()
			).then(() => {
				this.fileNameBeforeEdit = this.ruleForm.fileName;
				this.ruleForm.fileName = "";
				this.addFile = true;
			});
		},
		// 删除数据
		deleteRow(index, row) {
			this.$confirm("确认删除此版本吗?", "提示", this.$filters.confirm())
				.then(() => {
					this.$http.deleteMCU(row.id).then((res) => {
						if (res.data.success) {
							this.getMCU();
						}
					});
				})
				.catch(() => {});
		},
		// 修改数据
		updateRow(index, row) {
			this.isAdd = false;
			this.addFile = false;
			this.addBox = true;
			this.$nextTick(function () {
				this.ruleForm.id = row.id;
				this.ruleForm.fileName = row.fileName;
				this.ruleForm.version1 = row.version;
				this.ruleForm.name = row.name;
				this.ruleForm.deviceType = row.deviceType;
				this.ruleForm.deviceModel = row.deviceModel;
				this.oldName = row.fileOriginalName;
				this.ruleForm.note = row.note;
				this.ruleForm.force = row.force;
				this.ruleForm.fileOriginalName = row.fileOriginalName;
				this.ruleForm.fileMd5 = row.fileMd5;
			});
		},
		// 新增
		addRow() {
			this.isAdd = true;
			this.addFile = true;
			this.addBox = true;
		},
		// 修改产品选择
		fileChang(event) {
			var _this = this;
			var event = event || window.event;
			var file = event.target.files[0];
			var type = this.ruleForm.deviceModel == "CF5" ? ".pkg" : ".bin";
			if (file.name.indexOf(type) == -1) {
				if (this.$refs.fileInput != undefined) {
					this.$refs.fileInput.value = "";
				}
				return false;
			}
			this.choseFiles = true;
			this.ruleForm.file = file;
			this.ruleForm.fileName = file.name;
			this.ruleForm.fileOriginalName = file.name;
		},
		// 修改产品类型
		deviceModelChang() {
			if (this.$refs.fileInput != undefined) {
				this.$refs.fileInput.value = "";
			}
			this.ruleForm.file = "";
			this.ruleForm.fileName = "";
			this.ruleForm.fileOriginalName = "";
		},
		// 关闭表单弹窗
		close() {
			this.oldName = "";
			if (this.$refs.fileInput != undefined) {
				this.$refs.fileInput.value = "";
			}
			this.$refs.ruleForm.resetFields();
			this.ruleForm.id = "";
			this.ruleForm.fileName = "";
			this.ruleForm.version1 = "";
			this.ruleForm.fileMd5 = "";
			this.choseFiles = false; // edit by Nelson
			this.fileNameBeforeEdit = null; // edit by nelson
		},
		// ——————————————表格控件相关——————————————
		// 取消表格选择
		cleanClick() {
			this.MCU.deviceType = "";
			this.MCU.deviceModel = "";
			this.tableHeader.pagination.currentPage = 1;
			this.getMCU();
		},
		// 表格筛选
		filters(filters) {
			var name;
			for (var x in filters) {
				name = x;
			}
			this.MCU[name] =
				filters[name][0] != undefined ? filters[name][0] : "";
			this.getMCU();
		},
		// 选中表格数据
		handleSelectionChange(val) {
			this.tableSearch.selectArry = val;
		},
		// 修改页大小
		handleSizeChange(val) {
			this.MCU.pageSize = val;
			this.tableHeader.pagination.pageSize = this.rules.pageSize = val;
			this.getMCU();
		},
		// 修改页码
		handleCurrentChange(val) {
			this.MCU.pageNumber = val;
			this.tableHeader.pagination.currentPage = this.rules.pageNumber = val;
			this.getMCU();
		},
	},
};
</script>

<style lang="less">
#MCU {
	width: 100%;
	height: 100%;
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
	.el-dialog__body {
		text-align: left;
	}
	.dialog-footer {
		text-align: right;
	}
}
</style>
