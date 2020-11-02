
<template>
	<div id="wifiEdition">
		<TableSearch :tableData="tableData" :tableSearch="tableSearch" :exportHead="tableHeader.data"></TableSearch>
		<comTable :tableData="tableData" :tableHeader="tableHeader"></comTable>
		<!-- 表单弹窗 -->
		<el-dialog
			:close-on-click-modal="false"
			:title="isAdd?'新增DTU固件版本':'编辑DTU固件版本'"
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
							:step="0.01"
							:max="9.99"
							:min="0.01"
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
					<!-- 文件上传 -->
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
							:accept="ruleForm.deviceModel=='CF7'?'.apk':'.bin'"
						/>
						<br />
						仅支持.{{ruleForm.deviceModel=='CF7'?'apk':'bin'}}的二进制文件
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
				version1: "", //版本号
				version: "", //版本号
				force: true, //是否强制更新
				deviceType: "", //产品类型
				deviceModel: "", //产品型号
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
				fileName: [
					{
						required: true,
						message: "请上传版本文件",
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
			},
			tableSearch: {
				isExport: false,
				noSearch: true,
				exportName: "",
				btn: [
					{
						name: "新增DTU固件版本",
						clickInfo:
							this.$store.state.oldStore.authThree.indexOf("j21") != -1
								? this.addRow
								: 0,
					},
				],
				funClick: this.getDTU,
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
								this.$store.state.oldStore.authThree.indexOf("j22") != -1
									? this.updateRow
									: 0,
						},
						{
							name: "删除",
							clickFun:
								this.$store.state.oldStore.authThree.indexOf("j20") != -1
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
			DTU: {
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
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				let obj = Object.assign({}, this.ruleForm);
				if (valid) {
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
					var ajax = this.$http.addDTU;
					if (!this.isAdd) {
						ajax = this.$http.updataDTU;
					}
					if (!this.choseFiles) {
						ajax(obj).then((res) => {
							this.addBox = false;
							if (res.data.success) {
								this.getDTU();
							}
						});
					} else {
						this.loading = true;
						this.$http
							.newBinFileUp(data, this.upload)
							.then((res) => {
								// edit by nelson
								this.loading = false;
								if (res.data.success) {
									obj.fileName = res.data.fileName;
									let para = {
										...obj,
										fileMd5: res.data.fileMd5,
									};
									ajax(para).then((res) => {
										this.addBox = false;
										if (res.data.success) {
											// 成功创建版本
											this.getDTU();
											if (this.fileNameBeforeEdit) {
												this.$http.deleteFile(
													this.fileNameBeforeEdit
												);
											}
										}
										// edit By Nelson
										else {
											// 创建版本失败，删除线上文件
											this.$http
												.deleteFile(obj.fileName)
												.then((res) => {
													this.getDTU();
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
		deleteRow(index, row) {
			this.$confirm("确认删除此版本吗?", "提示", this.$filters.confirm())
				.then(() => {
					this.$http.deleteDTU(row.id).then((res) => {
						if (res.data.success) {
							this.getDTU();
						}
					});
				})
				.catch(() => {});
		},
		updateRow(index, row) {
			this.addFile = false;
			this.isAdd = false;
			this.addBox = true;
			this.$nextTick(() => {
				this.ruleForm.id = row.id;
				this.ruleForm.name = row.name;
				this.ruleForm.version1 = row.version;
				this.ruleForm.deviceType = row.deviceType;
				this.ruleForm.deviceModel = row.deviceModel;
				this.ruleForm.fileName = row.fileName;
				this.oldName = row.fileOriginalName;
				this.ruleForm.force = row.force;
				this.ruleForm.note = row.note;
				this.ruleForm.fileOriginalName = row.fileOriginalName;
				this.ruleForm.fileMd5 = row.fileMd5;
			});
		},
		handleSelectionChange(val) {
			this.tableSearch.selectArry = val;
		},
		handleSizeChange(val) {
			this.DTU.pageSize = val;
			this.tableHeader.pagination.pageSize = this.rules.pageSize = val;
			this.getDTU();
		},
		handleCurrentChange(val) {
			this.DTU.pageNumber = val;
			this.tableHeader.pagination.currentPage = this.rules.pageNumber = val;
			this.getDTU();
		},
		addRow() {
			this.isAdd = true;
			this.addFile = true;
			this.addBox = true;
		},
		cleanClick() {
			this.DTU.deviceType = "";
			this.DTU.deviceModel = "";
			this.tableHeader.pagination.currentPage = 1;
			this.getDTU();
		},
		close() {
			this.oldName = "";
			if (this.$refs.fileInput != undefined) {
				this.$refs.fileInput.value = "";
			}
			this.$refs.ruleForm.resetFields();
			this.choseFiles = false; // edit by Nelson
			this.ruleForm.id = "";
			this.ruleForm.fileName = "";
			this.ruleForm.version1 = "";
			this.ruleForm.fileMd5 = "";
			this.fileNameBeforeEdit = null; // edit by nelson
		},
		fileChang(event) {
			var _this = this;
			var event = event || window.event;
			var file = event.target.files[0];
			var type = this.ruleForm.deviceModel == "CF7" ? ".apk" : ".bin";
			if (file.name.indexOf(type) == -1) {
				if (this.$refs.fileInput != undefined) {
					this.$refs.fileInput.value = "";
				}
				return false;
			}
			this.choseFiles = true; // edit by Nelson
			this.ruleForm.file = file;
			this.ruleForm.fileName = file.name;
			this.ruleForm.fileOriginalName = file.name;
		},
		deviceModelChang() {
			if (this.$refs.fileInput != undefined) {
				this.$refs.fileInput.value = "";
			}
			this.ruleForm.file = "";
			this.ruleForm.fileName = "";
			this.ruleForm.fileOriginalName = "";
		},
		//筛选列
		filters(filters) {
			var name;
			for (var x in filters) {
				name = x;
			}
			this.DTU[name] =
				filters[name][0] != undefined ? filters[name][0] : "";
			this.getDTU();
		},
		getDTU() {
			this.$http.DTU(this.DTU).then((res) => {
				if (res.data.success) {
					this.tableData = res.data.rows;
					this.tableHeader.pagination.total = res.data.total;
					if (res.data.total > 0 && res.data.rows.length == 0) {
						this.tableHeader.pagination.currentPage = this.rules.pageNumber = 1;
						this.getDTU();
					}
					this.$nextTick(() => {
						this.tableHeader.tableStatus = true;
					});
				}
			});
		},
	},
	mounted() {
		this.getDTU();
	},
};
</script>


<style lang="less">
#wifiEdition {
	width: 100%;
	height: 100%;
	float: left;
	background: #fff;
	padding-top: 24px;
	box-sizing: border-box;
	-webkit-box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
	box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
	border-radius: 4px;
	position: relative;
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
