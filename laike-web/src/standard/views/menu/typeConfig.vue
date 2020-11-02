<template>
	<el-card class="typeConfig">
		<!-- 操作栏 -->
		<div class="clearfloat">
			<!-- <el-button
				type="primary"
				size="small"
				class="right"
				@click="handleAdd"
			>
				新增
			</el-button> -->
		</div>
		<!-- 表格 -->
		<el-table class="marginT20" :data="tableData" style="width: 100%">
			<el-table-column type="index" fixed="left"> </el-table-column>
			<el-table-column label="分类名称" prop="name"> </el-table-column>
			<el-table-column
				label="菜谱分类菜单"
				align="center"
				prop="menuTempName"
			>
			</el-table-column>
			<el-table-column
				label="创建时间"
				width="180"
				align="center"
				prop="createTime"
				:formatter="
					(row, column, cellValue, index) =>
						Utils.escapeTime(cellValue)
				"
			>
			</el-table-column>
			<el-table-column
				label="更新时间"
				width="180"
				align="center"
				prop="updateTime"
				:formatter="
					(row, column, cellValue, index) =>
						Utils.escapeTime(cellValue)
				"
			>
			</el-table-column>
			<el-table-column label="操作者" align="center" prop="">
			</el-table-column>
			<el-table-column
				label="操作"
				align="center"
				width="200"
				fixed="right"
			>
				<template slot-scope="scope">
					<el-link
						class="tableBtn"
						:underline="false"
						size="mini"
						type="primary"
						@click.native.prevent="handleGoChild(scope.row)"
					>
						子分类
					</el-link>
					<el-link
						class="tableBtn"
						:underline="false"
						size="mini"
						type="primary"
						@click.native.prevent="handleEdit(scope.row)"
					>
						编辑
					</el-link>
					<!-- <el-link
						class="tableBtn"
						:underline="false"
						size="mini"
						type="danger"
						@click.native.prevent="handleDelete(scope.row)"
					>
						删除
					</el-link> -->
				</template>
			</el-table-column>
		</el-table>
		<!-- 弹窗 -->
		<el-dialog
			:title="dialogTitle"
			:visible.sync="dialogVisible"
			width="50%"
			:before-close="handleClose"
		>
			<!-- 表单 -->
			<el-form
				ref="form"
				:model="form"
				label-width="150px"
				:rules="rules"
			>
				<!-- 菜谱模板名称 -->
				<el-form-item label="菜谱模板名称" prop="menuTemplateId">
					<el-select class="formInput" v-model="form.menuTemplateId">
						<el-option
							v-for="item in menuTemps"
							:key="item.value"
							:value="item.value"
							:label="item.name"
						></el-option>
					</el-select>
				</el-form-item>
				<!-- 分类名称 -->
				<el-form-item label="分类名称" prop="name">
					<el-input class="formInput" v-model="form.name"></el-input>
				</el-form-item>
				<!-- 上传未激活 -->
				<el-form-item prop="unactiveIconFilename">
					<!-- 未激活图片 -->
					<el-upload
						ref="unactive"
						class="avatar-uploader"
						:auto-upload="false"
						action="/lexy/api/common/saveMenuImage"
						:limit="1"
						:show-file-list="false"
						:on-change="
							(file, filesList) =>
								handleChoseFile(file, 'unactive')
						"
						accept=".ico"
						style="width: 148px; height: 148px"
					>
						<!-- 预览 -->
						<img
							v-if="unactiveBase64 || form.unactiveIconFilename"
							:src="
								unactiveBase64
									? unactiveBase64
									: $store.state.standard +
									  form.unactiveIconFilename
							"
							class="avatarAppImage"
						/>
						<div class="userAdvert-add">单击上传</div>
					</el-upload>
					<i
						class="el-icon-circle-close imgDelete"
						v-if="unactiveBase64 || form.unactiveIconFilename"
						@click="deleteImg('unactive')"
					></i>
					<div class="imgTip">未激活状态</div>
					<div class="imgTip">.ico 格式；1:1尺寸</div>
				</el-form-item>
				<!-- 上传激活 -->
				<el-form-item prop="activeIconFilename">
					<!-- 激活图片 -->
					<el-upload
						ref="active"
						class="avatar-uploader"
						:auto-upload="false"
						action="#"
						:show-file-list="false"
						:on-change="
							(file, filesList) => handleChoseFile(file, 'active')
						"
						accept=".ico"
						style="width: 148px; height: 148px"
					>
						<!-- 预览图片 -->
						<img
							v-if="activeBase64 || form.activeIconFilename"
							:src="
								activeBase64
									? activeBase64
									: $store.state.standard +
									  form.activeIconFilename
							"
							class="avatarAppImage"
						/>
						<div class="userAdvert-add">单击上传</div>
					</el-upload>
					<i
						class="el-icon-circle-close imgDelete"
						v-if="activeBase64 || form.activeIconFilename"
						@click="deleteImg('active')"
					></i>
					<div class="imgTip">激活状态</div>
					<div class="imgTip">.ico 格式；1:1尺寸</div>
				</el-form-item>
			</el-form>
			<span slot="footer">
				<el-button @click="handleClose">取 消</el-button>
				<el-button type="primary" @click="handleSubmit">
					确 定
				</el-button>
			</span>
		</el-dialog>
	</el-card>
</template>

<script>
import formComp from "../../components/form.vue";
import Utils from "../../utils";
import { Message } from "element-ui";
export default {
	name: "typeConfig",
	data() {
		return {
			Utils,
			dialogVisible: false,
			total: 0,
			act: "",
			dialogTitle: "",
			activeBase64: "",
			unactiveBase64: "",
			form: {
				menuTemplateId: "",
				name: "",
				activeIconFilename: "",
				unactiveIconFilename: "",
			},
			tableFilter: {
				pageNumber: 1,
				pageSize: 10,
			},
			menuTemps: [
				{
					value: "9",
					name: "测试",
				},
			],
			tableData: [],
			rules: {
				menuTemplateId: [
					{
						required: true,
						message: "请选择菜谱模板",
						trigger: "change",
					},
				],
				name: [
					{
						required: true,
						message: "请输入菜谱分类菜单名称",
						trigger: "change",
					},
				],
				activeIconFilename: [
					{
						required: true,
						message: "请上传激活状态图片",
						trigger: "change",
					},
				],
				unactiveIconFilename: [
					{
						required: true,
						message: "请上传未激活状态图片",
						trigger: "change",
					},
				],
			},
		};
	},
	components: {
		formComp,
	},
	mounted() {
		this.getMenuTempList();
		this.getList();
	},
	methods: {
		getMenuTempList: function () {
			this.$http.menuTemplatesAll().then((res) => {
				if (res.data.success) {
					// this.menuTemps = res.data.data;
				}
			});
		},
		getList: function (type, val) {
			if (type) {
				this.tableFilter[type] = val;
			}
			this.$http.menuTypes(this.tableFilter).then((res) => {
				if (res.data.success) {
					this.tableData = res.data.data;
					for (let i in this.tableData) {
						this.tableData[i].menuTempName = this.tableData[
							i
						].menuTemplate.name;
					}
				}
			});
		},
		handleAdd: function () {
			this.act = "add";
			this.dialogTitle = "新增菜谱类别";
			this.dialogVisible = true;
		},
		handleEdit: function (row) {
			this.dialogVisible = true;
			let form = {};
			form.id = row.id;
			form.menuTemplateId = row.menuTemplate.id;
			form.name = row.name;
			form.activeIconFilename = row.activeIconFilename;
			form.unactiveIconFilename = row.unactiveIconFilename;
			this.$set(this, "form", form);
			this.act = "edit";
			this.dialogTitle = "编辑";
		},
		handleDelete: function (row) {
			let msg = "确认此分类菜单（" + row.name + "）吗?";
			this.$confirm(msg, "提示", {
				confirmButtonText: "确认",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(() => {
					this.$http.menuTypeDelete(row.id).then((res) => {
						if (res.data.success) {
							this.getList();
						}
					});
				})
				.catch(() => {});
		},
		handleSubmit: function () {
			this.$refs.form.validate((valid) => {
				if (valid) {
					// 获取文件集合表单
					let formData = new FormData(),
						fileRecord = [];
					if (this.activeBase64) {
						formData.append("files", this.form.activeIconFilename);
						fileRecord.push("active");
					}
					if (this.unactiveBase64) {
						formData.append(
							"files",
							this.form.unactiveIconFilename
						);
						fileRecord.push("unactive");
					}
					this.$http.uploadFiles(formData).then((res) => {
						if (res.data.success) {
							for (let i in fileRecord) {
								this.form[fileRecord[i] + "IconFilename"] =
									res.data.data[i];
							}
							this.submitForm();
						}
					});
				} else {
					console.log("error submit!!");
					return false;
				}
			});
		},
		submitForm: function () {
			let ajax =
				this.act == "add"
					? this.$http.menuTypeAdd
					: this.$http.menuTypeEdit;
			ajax(this.form).then((res) => {
				if (res.data.success) {
					console.log(res.data);
				}
			});
		},
		handleChoseFile: function (file, name) {
			let _this = this,
				reader = new FileReader(),
				image = new Image(),
				base64 = null;
			image.onload = function () {
				if (image.width != image.height) {
					Message.error("图片尺寸比例错误");
					_this.$refs[name].clearFiles();
				} else {
					_this[name + "Base64"] = base64;
					_this.form[name + "IconFilename"] = file.raw;
					_this.$refs[name].clearFiles();
				}
			};
			reader.onload = function (e) {
				base64 = e.target.result;
				image.src = base64;
			};
			reader.readAsDataURL(file.raw);
		},
		handleGoChild: function (row) {
			let info = JSON.stringify(row);
			this.$router.push({
				path: "/menuStandard/childTypeConfig?info=" + info,
			});
		},
		handleClose: function () {
			this.activeBase64 = "";
			this.unactiveBase64 = "";
			this.$refs.form.resetFields();
			this.dialogVisible = false;
		},
		deleteImg: function (name) {
			this[name + "Base64"] = "";
			this[name + "File"] = "";
			this.form[name + "IconFilename"] = "";
		},
	},
};
</script>

<style>
.typeConfig {
	background: white;
	padding: 10px 15px;
	border-radius: 5px;
}

.typeConfig .table {
	margin-top: 20px;
}

.typeConfig .formTips {
	font-size: 12px;
	color: #ccc;
	display: block;
}

.typeConfig .tableBtn {
	margin-right: 10px;
}

.typeConfig .el-dropdown-link {
	color: #409eff;
	font-weight: 500;
	font-size: 14px;
}
.typeConfig .formInput {
	width: 200px;
}
.typeConfig .avatar-uploader {
	float: left;
	margin-bottom: 6px;
	position: relative;
}
.typeConfig .avatarImage {
	width: 148px;
	height: 148px;
}
.typeConfig .avatarAppImage {
	width: 148px;
	height: 148px;
}
.typeConfig .avatar-uploader .el-upload {
	float: left;
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	height: 100%;
	width: 100%;
}
.typeConfig .avatar-uploader .el-upload:hover {
	border-color: #409eff;
}
.typeConfig .userAdvert-add {
	color: #8c939d;
	font-size: 22px;
	width: 148px;
	height: 148px;
	line-height: 148px;
	text-align: center;
}
.typeConfig .imgTip {
	margin-left: 180px;
	font-size: 14px;
	color: #ccc;
}
.typeConfig .imgDelete {
	position: absolute;
	z-index: 999;
	color: red;
	font-size: 30px;
	left: 133px;
	top: -15px;
	cursor: pointer;
	background-color: #fff;
	border-radius: 15px;
}
</style>
