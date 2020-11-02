<template>
	<div id="appEdition">
		<!-- 表格操作栏 -->
		<TableSearch :tableData="tableData" :tableSearch="tableSearch" :exportHead="tableHeader.data"></TableSearch>
		<!-- 表格 -->
		<comTable :tableData="tableData" :tableHeader="tableHeader"></comTable>
		<!-- 弹窗表单 -->
		<el-dialog
			:close-on-click-modal="false"
			:title="isAdd?'新增APP版本':'编辑APP版本'"
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
					<!-- <el-form-item label="版本链接" prop="fileName">
                        <el-input size="small" v-model.trim="ruleForm.fileName"></el-input>
					</el-form-item>-->
					<el-form-item label="文件上传" prop="fileName">
						{{addFile?'':oldName}}
						<button
							v-if="!addFile"
							style="float:right;margin-top: 8px;"
							@click.prevent="reUpload"
						>重新上传</button>
						<input v-if="addFile" ref="fileInput" type="file" @change="fileChang" accept=".apk" />
						<br />仅支持.apk的二进制文件
					</el-form-item>
					<el-form-item label="更新内容" prop="note">
						<el-input type="textarea" maxlength="100" size="small" :rows="3" v-model="ruleForm.note"></el-input>
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
			addBox: false,
			addFile: true,
			loading: false,
			uploadNum: 0,
			ruleForm: {
				name: "", //版本名称
				version: "", //版本号
				version1: "", //版本号
				force: true, //强制更新
				fileName: "", //url链接
				note: "", //更新内容
				file: "", //url链接
			},
			oldName: "", //旧文件名
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
				force: [
					{
						required: true,
						message: "请选择强制更新",
						trigger: "change",
					},
				],
				fileName: [
					{
						required: true,
						message: "请上传版本文件",
						trigger: "blur",
					},
				],
			},
			tableSearch: {
				isExport: false,
				noSearch: true,
				exportName: "",
				btn: [
					{
						name: "新增APP版本",
						clickInfo:
							this.$store.state.oldStore.authThree.indexOf("j31") != -1
								? this.addRow
								: 0,
					},
				],
				funClick: this.getAPP,
				cleanClick: this.cleanClick,
				input: [],
				select: [],
				selectArry: [], //表格选中数据集合
			},
			tableHeader: {
				sortMethod: function () {},
				tableStatus: false,
				filters: function () {},
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
								this.$store.state.oldStore.authThree.indexOf("j32") != -1
									? this.updateRow
									: 0,
						},
						{
							name: "删除",
							clickFun:
								this.$store.state.oldStore.authThree.indexOf("j30") != -1
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
						label: "URL",
						prop: "url",
						minWidth: "540",
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
			APP: {
				deviceType: "",
				deviceModel: "",
				pageNumber: 1,
				pageSize: 20,
			},
			// edit by nelson
			choseFile: false,
			fileNameBeforeEdit: null, // 编辑前文件名
		};
	},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					if (
						this.ruleForm.version1.toString().split(".").length == 1
					) {
						this.ruleForm.version1 =
							this.ruleForm.version1.toString() + ".00";
					}
					if (
						this.ruleForm.version1.toString().split(".").length > 1
					) {
						if (
							this.ruleForm.version1.toString().split(".")[1]
								.length < 2
						) {
							this.ruleForm.version1 =
								this.ruleForm.version1.toString() + "0";
						}
					}
					this.ruleForm.version = this.ruleForm.version1;
					var data = new FormData();
					data.append("oldFileName", "");
					data.append("file", this.ruleForm.file);
					var ajax = this.$http.addAPP;
					if (!this.isAdd) {
						ajax = this.$http.updataAPP;
					}
					// if (this.oldName == this.ruleForm.fileOriginalName) { // edit by nelson
					if (!this.choseFile) {
						// edit by nelson
						ajax(this.ruleForm).then((res) => {
							this.addBox = false;
							if (res.data.success) {
								this.getAPP();
							}
						});
					} else {
						data.append("oldFileName", this.oldName);
						this.loading = true;
						this.$http.file(data, this.upload).then((res) => {
							this.ruleForm.fileName = res.data.fileName;
							this.loading = false;
							if (res.data.success) {
								ajax(this.ruleForm).then((res) => {
									this.addBox = false;
									if (res.data.success) {
										// 成功 创建/编辑 版本
										this.getAPP();
										if (this.fileNameBeforeEdit) {
											this.$http.deleteFile(
												this.fileNameBeforeEdit
											);
										}
									} else {
										// 创建版本失败，删除线上文件
										this.$http
											.deleteFile(this.ruleForm.fileName)
											.then((res) => {
												this.getAPP();
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
		upload(e) {
			this.uploadNum = ((e.loaded / e.total) * 100) | 0;
		},
		// 重新上传
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
		// 删除版本
		deleteRow(index, row) {
			this.$confirm("确认删除此版本吗?", "提示", this.$filters.confirm())
				.then(() => {
					this.$http.deleteAPP(row.id).then((res) => {
						if (res.data.success) {
							this.getAPP();
						}
					});
				})
				.catch(() => {});
		},
		updateRow(index, row) {
			this.addBox = true;
			this.addFile = false;
			this.isAdd = false;
			this.$nextTick(() => {
				this.ruleForm.id = row.id;
				this.ruleForm.name = row.name;
				this.ruleForm.version1 = row.version;
				this.ruleForm.fileName = row.fileName;
				this.oldName = row.fileOriginalName;
				this.ruleForm.note = row.note;
				this.ruleForm.force = row.force;
				this.ruleForm.fileOriginalName = row.fileOriginalName;
			});
		},
		handleSelectionChange(val) {
			this.tableSearch.selectArry = val;
		},
		handleSizeChange(val) {
			this.APP.pageSize = val;
			this.tableHeader.pagination.pageSize = this.rules.pageSize = val;
			this.getAPP();
		},
		handleCurrentChange(val) {
			this.APP.pageNumber = val;
			this.tableHeader.pagination.currentPage = this.rules.pageNumber = val;
			this.getAPP();
		},
		addRow() {
			this.addFile = true;
			this.isAdd = true;
			this.addBox = true;
		},
		cleanClick() {
			this.APP.deviceType = "";
			this.APP.deviceModel = "";
			this.tableHeader.pagination.currentPage = 1;
			this.getAPP();
		},
		fileChang(event) {
			var _this = this;
			var event = event || window.event;
			var file = event.target.files[0];
			var type = ".apk";
			if (file.name.indexOf(type) == -1) {
				if (this.$refs.fileInput != undefined) {
					this.$refs.fileInput.value = "";
				}
				return false;
			}
			var imgName =
				this.$filters.uuid() + "_" + new Date().valueOf() + type;
			this.choseFile = true; // edit by nelson
			this.ruleForm.file = file;
			this.ruleForm.fileName = imgName;
			this.ruleForm.fileOriginalName = file.name;
		},
		close() {
			this.oldName = "";
			if (this.$refs.fileInput != undefined) {
				this.$refs.fileInput.value = "";
			}
			this.$refs.ruleForm.resetFields();
			this.ruleForm.id = "";
			this.ruleForm.fileName = "";
			this.ruleForm.version1 = "";
			this.fileNameBeforeEdit = null; // edit by nelson
			this.choseFile = false; // edit by nelson
		},
		getAPP() {
			this.$http.APP(this.APP).then((res) => {
				if (res.data.success) {
					this.tableData = res.data.rows;
					this.tableHeader.pagination.total = res.data.total;
					if (res.data.total > 0 && res.data.rows.length == 0) {
						this.tableHeader.pagination.currentPage = this.rules.pageNumber = 1;
						this.getAPP();
					}
					this.$nextTick(() => {
						this.tableHeader.tableStatus = true;
					});
				}
			});
		},
	},
	mounted() {
		this.getAPP();
	},
};
</script>

<style lang="less">
#appEdition {
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
