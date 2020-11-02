<template>
	<el-card id="productModule">
		<!-- 操作栏 -->
		<div>
			<el-button size="small" type="primary" @click="handleAdd">新建产品型号</el-button>
		</div>
		<!-- 表格 -->
		<el-table
			class="table"
			ref="table"
			:data="tableData"
			header-cell-class-name="cheTabHreaClass"
			cell-class-name="cheTabConClass"
			:lazy="true"
		>
			<el-table-column prop="productModel" label="产品型号" align="center" width="100" fixed="left"></el-table-column>
			<el-table-column
				prop="productTypeId"
				label="产品类型"
				align="center"
				fixed="left"
				:formatter="(row, para) => handleDealType(row.productTypeId)"
			></el-table-column>
			<el-table-column prop="enterpriseKey" label="企业编码" align="center" width="180"></el-table-column>
			<el-table-column prop="mark" label="备注" align="center"></el-table-column>
			<el-table-column
				prop="createTime"
				label="添加时间"
				align="center"
				width="170"
				:formatter="(row, para) => handleDealTime(row.createTime)"
			></el-table-column>
			<el-table-column
				prop="updateTime"
				label="更新时间"
				align="center"
				width="170"
				:formatter="(row, para) => handleDealTime(row.updateTime)"
			></el-table-column>
			<el-table-column prop="address" label="操作者" align="center"></el-table-column>
			<el-table-column prop="address" label="操作" width="200" align="center" fixed="right">
				<template slot-scope="scope">
					<el-link
						class="tableBtn"
						:underline="false"
						size="mini"
						type="primary"
						@click.native.prevent="handleInfo(scope.row)"
					>查看</el-link>
					<el-link
						class="tableBtn"
						:underline="false"
						size="mini"
						type="primary"
						@click.native.prevent="handleEdit(scope.row)"
					>编辑</el-link>
					<el-link
						class="tableBtn"
						:underline="false"
						size="mini"
						type="primary"
						@click.native.prevent="handleEditNext(scope.row)"
					>配置</el-link>
					<el-link
						class="tableBtn"
						:underline="false"
						size="mini"
						type="danger"
						@click.native.prevent="handleDelete(scope.row)"
					>删除</el-link>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页 -->
		<el-pagination
			class="pagination"
			background
			align="right"
			@size-change="(pageSize) => getList('pageSize', pageSize)"
			@current-change="(page) => getList('page', page)"
			:current-page.sync="tableFilter.page"
			:page-sizes="tableFilter.pageSizes"
			:page-size.sync="tableFilter.pageSize"
			layout="total, sizes, prev, pager, next, jumper"
			:total="total"
		></el-pagination>
		<!-- 弹窗 -->
		<el-dialog
			width="60%"
			:title="act == 'add' ? '新增' : '编辑'"
			:visible.sync="dialogVisible"
			:before-close="handleClose"
		>
			<!-- 表单 -->
			<el-form ref="form" :rules="rules" :model="form" label-width="120px" inline>
				<!-- 产品类型 -->
				<el-form-item class="formItem" prop="productTypeId" label="产品类型">
					<el-select size="small" @change="getMenuTags" v-model="form.productTypeId">
						<el-option v-for="item in types" :key="item.id" :value="item.id" :label="item.productType"></el-option>
					</el-select>
				</el-form-item>
				<!-- 产品型号 -->
				<el-form-item class="formItem" prop="productModel" label="产品型号">
					<el-input size="small" placeholder="请输入" v-model="form.productModel"></el-input>
				</el-form-item>
				<!-- 企业编码 -->
				<el-form-item class="formItem" prop="enterpriseKey" label="企业编码">
					<el-tag
						:key="tag"
						v-for="tag in enterpriseKeys"
						closable
						class="marginL10"
						:disable-transitions="false"
						@close="handleCloseTag(tag)"
					>{{ tag }}</el-tag>
					<el-input
						class="input-new-tag"
						v-if="tagInput"
						v-model="enterpriseKey"
						ref="saveTagInput"
						size="small"
						@keyup.enter.native="handleAddTag"
						@blur="handleAddTag"
					></el-input>
					<el-button v-else class="marginL10" size="small" @click="tagInput = true">添加</el-button>
				</el-form-item>
				<!-- 产品别名 -->
				<el-form-item class="formItem" prop="productAlias" label="产品别名">
					<el-input size="small" placeholder="请输入" v-model="form.productAlias"></el-input>
					<div class="formTip">显示在APP上的名称</div>
				</el-form-item>
				<!-- 厨电类别 -->
				<el-form-item class="formItem" prop="menuTagId" label="厨电类别">
					<el-select size="small" v-model="form.menuTagId">
						<el-option v-for="item in menuTags" :key="item.id" :value="item.id" :label="item.name"></el-option>
					</el-select>
				</el-form-item>
				<!-- 菜谱分类菜单 -->
				<el-form-item class="formItem" prop="menuTemplateId" label="菜谱分类菜单">
					<el-select size="small" :disabled="menuTypes.length < 1" v-model="form.menuTemplateId">
						<el-option
							v-for="item in menuTypes"
							:key="item.value"
							:value="item.value"
							:label="item.label"
						></el-option>
					</el-select>
				</el-form-item>
				<!-- 品牌归属 -->
				<el-form-item class="formItem" prop="brand" label="品牌归属">
					<el-select size="small" v-model="form.brand">
						<el-option value="SieMatic" label="西曼帝克"></el-option>
						<el-option value="SmartLife" label="掌上智生活"></el-option>
					</el-select>
				</el-form-item>
				<!-- 下发确认 -->
				<el-form-item class="formItem" prop="safeMode" label="下发确认">
					<el-select size="small" v-model="form.safeMode">
						<el-option :value="1" label="是"></el-option>
						<el-option :value="0" label="否"></el-option>
					</el-select>
					<div class="formTip">做菜时是否需要在设备按键确认</div>
				</el-form-item>
				<!-- 语音播报 -->
				<el-form-item class="formItem" prop="voiceBroadcast" label="语音播报">
					<el-select size="small" v-model="form.voiceBroadcast">
						<el-option :value="1" label="是"></el-option>
						<el-option :value="0" label="否"></el-option>
					</el-select>
					<div class="formTip">做菜时是否需要在设备按键确认</div>
				</el-form-item>
				<!-- 配网模式 -->
				<el-form-item class="formItem" prop="networkWay" label="配网模式">
					<el-select size="small" v-model="form.networkWay">
						<el-option :value="1" label="通过SN添加"></el-option>
						<el-option :value="2" label="通过MAC添加"></el-option>
					</el-select>
					<div class="formTip">做菜时是否需要在设备按键确认</div>
				</el-form-item>
				<!-- DTU型号 -->
				<el-form-item class="formItem" prop="dtuType" label="DTU型号">
					<el-tooltip effect="dark" content="做菜时是否需要在设备按键确认；230采用wifi配网，330采用蓝牙配网" placement="top-start">
						<el-select size="small" v-model="form.dtuType">
							<el-option :value="1" label="LPT230"></el-option>
							<el-option :value="2" label="LPC330"></el-option>
						</el-select>
					</el-tooltip>
				</el-form-item>
				<!-- 产品图片 -->
				<el-form-item class="formItem" prop="productImg" label="产品图片">
					<el-upload
						ref="image"
						class="pmImg-uploader"
						:show-file-list="false"
						:auto-upload="false"
						action="#"
						:limit="1"
						:on-change="
							(file, filesList) =>
								handleChoseFile(file, filesList, 'image')
						"
						accept=".png"
					>
						<img v-if="base64" :src="base64" class="pmImg" />
						<i v-else class="el-icon-plus pmImg-uploader-icon"></i>
					</el-upload>
					<div class="formTip">
						<div>
							1:1 .png格式； 像素：
							<span class="red">99*99</span>
						</div>
						<div>用于web端展示； app端配网添加</div>
					</div>
				</el-form-item>
				<!-- 备注 -->
				<el-form-item class="formItem" prop="mark" label="备注">
					<el-input placeholder="请输入" type="textarea" size="small" v-model="form.mark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="clearfloat">
				<el-button @click="handleClose">取 消</el-button>
				<el-button type="primary" @click="submitForm">保 存</el-button>
			</div>
		</el-dialog>
	</el-card>
</template>
<script>
import { Message } from "element-ui";
export default {
	data() {
		return {
			dialogVisible: false,
			tagInput: false,
			total: 0,
			enterpriseKey: "",
			imageUrl: "",
			base64: "",
			act: "",
			form: {
				productTypeId: "", // 产品类型
				productModel: "", // 产品型号
				enterpriseKey: "", // 企业编码
				productAlias: "", // 产品别名
				menuTagId: "", // 厨电类别
				menuTemplateId: "", // 菜谱分类菜单
				brand: "", // 品牌归属
				safeMode: "", // 确认下发
				voiceBroadcast: "", // 语音播报
				networkWay: "", // 配网模式
				dtuType: "", // DTU型号
				productImg: "", // 产品图片
				mark: "", // 备注
			},
			rules: {
				productTypeId: [
					{
						required: true,
						message: "请选择产品类型",
						trigger: "blur",
					},
				],
				voiceBroadcast: [
					{
						required: true,
						message: "请选择是否语音播报",
						trigger: "blur",
					},
				],
				dtuType: [
					{
						required: true,
						message: "请选择DTU型号",
						trigger: "blur",
					},
				],
				networkWay: [
					{
						required: true,
						message: "请选择配网模式",
						trigger: "blur",
					},
				],
				productModel: [
					{
						required: true,
						message: "请填写产品型号",
						trigger: "blur",
					},
					{
						min: 2,
						max: 16,
						message: "长度在 2 到 16 个字符",
						trigger: "blur",
					},
				],
				enterpriseKey: [
					{
						required: true,
						message: "请填写企业编码",
						trigger: "blur",
					},
					{
						min: 1,
						max: 32,
						message: "长度在 1 到 32 个字符",
						trigger: "blur",
					},
				],
				productAlias: [
					{
						required: true,
						message: "请填写产品别名",
						trigger: "blur",
					},
				],
				menuTagId: [
					{
						required: true,
						message: "请选择厨电类别",
						trigger: "blur",
					},
				],
				menuTemplateId: [
					{
						required: true,
						message: "请选择菜谱分类菜单",
						trigger: "blur",
					},
				],
				brand: [
					{
						required: true,
						message: "请选择品牌归属",
						trigger: "blur",
					},
				],
				safeMode: [
					{
						required: true,
						message: "请选择下发确认",
						trigger: "blur",
					},
				],
				productImg: [
					{
						required: true,
						message: "请上传产品图片",
						trigger: "blur",
					},
				],
			},
			tableFilter: {
				page: 1,
				pageSize: 10,
			},
			enterpriseKeys: [], // 企业编码列表
			menuTypes: [
				{
					value: 1,
					label: "测试",
				},
			],
			menuTags: [],
			tableData: [],
			types: [],
		};
	},
	mounted() {
		this.getTypes();
	},
	methods: {
		// 获取厨电类别下拉列表
		getMenuTags: function (value, method) {
			let para = {
				productTypeId: value,
			};
			this.$http.menuTags(para).then((res) => {
				if (res.data.success) {
					this.menuTags = res.data.data;
					if (method) {
						method();
					}
				}
			});
		},
		// 获取产品类型列表
		getTypes() {
			this.$http.productTypesAll().then((res) => {
				if (res.data.success) {
					this.types = res.data.data;
					this.getList();
				}
			});
		},
		// 获取表格数据
		getList(flag, para) {
			if (flag) {
				this.$set(this.tableFilter, flag, para);
			}
			this.$http.productModules(this.tableFilter).then((res) => {
				if (res.data.success) {
					this.tableData = res.data.data.list;
					this.total = res.data.data.total;
				}
			});
		},
		// 查看
		handleInfo: function () {},
		// 新增
		handleAdd: function () {
			this.dialogVisible = true;
			this.menuTags = [];
			this.act = "add";
		},
		// 编辑
		handleEdit: function (row) {
			this.base64 = this.$store.state.oldStore.imgSrc + row.productImg;
			this.act = "edit";
			if (row.enterpriseKey) {
				this.enterpriseKeys = row.enterpriseKey.split(",");
			}
			this.form = row;
			this.getMenuTags(row.productTypeId, () => {
				this.dialogVisible = true;
			});
		},
		// 删除
		handleDelete: function (row) {
			this.$confirm(
				"确认删除此产品（" + row.productModel + "）吗?",
				"提示",
				{
					confirmButtonText: "确认",
					cancelButtonText: "取消",
					type: "warning",
				}
			)
				.then(() => {
					rows.splice(index, 1);
					this.$http.productModuleDelete(row.id).then((res) => {
						if (res.data.success) {
							this.getList();
						}
					});
				})
				.catch(() => {
					this.$message({
						type: "info",
						message: "已取消删除",
					});
				});
		},
		// 图片选择时
		handleChoseFile: function (file) {
			let _this = this,
				reader = new FileReader(),
				image = new Image(),
				base64 = null;
			image.onload = function () {
				if (image.width != 99 || image.height != 99) {
					Message.error("图片尺寸错误");
					_this.$refs.image.clearFiles();
				} else {
					_this.base64 = base64;
					_this.form.productImg = file.raw;
					_this.$refs.image.clearFiles();
				}
			};
			reader.onload = function (e) {
				base64 = e.target.result;
				image.src = base64;
			};
			reader.readAsDataURL(file.raw);
		},
		// 提交表单
		submitForm: function () {
			this.$refs.form.validate((valid) => {
				if (valid) {
					let form = new FormData(),
						ajax =
							this.act == "add"
								? this.$http.productModelAdd
								: this.$http.productModelUpdata;
					// 防止编辑时图片文件名覆盖图片
					for (let i in this.form) {
						if (
							i == "productImg" &&
							typeof this.form[i] == "string"
						) {
							form.append("productImgFilename", this.form[i]);
						} else {
							form.append(i, this.form[i]);
						}
					}
					ajax(form).then((res) => {
						if (res.data.success) {
							this.handleClose();
						}
					});
				}
			});
		},
		// 配置
		handleEditNext: function (row) {
			this.$router.push({
				path: "/standardProduct/functionConfig?id=" + row.id,
			});
		},
		// 处理列表时间
		handleDealTime: function (time) {
			return this.$filters.dateFilter(time, "");
		},
		// 处理产品类型显示
		handleDealType: function (id) {
			for (let i in this.types) {
				if (this.types[i].id == id) {
					return this.types[i].productType;
				}
			}
		},
		// 准备添加企业编码
		handleShowTagInput: function () {},
		// 添加企业编码Tag
		handleAddTag: function () {
			if (!this.enterpriseKey) {
				return false;
			}
			let list = Object.assign([], this.enterpriseKeys),
				str = "";
			for (let i in list) {
				if (list[i] == this.enterpriseKey) {
					this.tagInput = false;
					this.enterpriseKey = "";
					Message.error("企业编码重复");
					return false;
				}
			}
			list.push(this.enterpriseKey);
			this.enterpriseKey = "";
			this.tagInput = false;
			this.$set(this, "enterpriseKeys", list);
			for (let i in list) {
				if (str.length == 0) {
					str = str + list[i];
				} else {
					str = str + "," + list[i];
				}
			}
			this.form.enterpriseKey = str;
		},
		// 删除企业编码Tag
		handleCloseTag: function (tag) {
			console.log(tag);
		},
		// 关闭弹窗
		handleClose: function () {
			this.$refs.form.resetFields();
			this.enterpriseKeys = [];
			this.dialogVisible = false;
		},
	},
};
</script>
<style scoped>
#productModule {
	background: #fff;
}
.table {
	margin-top: 20px;
}
.tableBtn {
	margin-left: 10px;
}
.pagination {
	margin-top: 10px;
}
.pmImg-uploader {
	border: 2px dashed #d9d9d9;
	width: 178px;
	height: 178px;
}
.pmImg-uploader:hover {
	border-color: #409eff;
}
.pmImg-uploader .el-upload {
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}
.pmImg-uploader:hover {
	border-color: #409eff;
}
.pmImg-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	line-height: 178px;
	text-align: center;
}
.pmImg {
	width: 178px;
	height: 178px;
	display: block;
}
.formItem {
	width: 45%;
}
.formTip {
	font-size: 12px;
	color: #ccc;
	line-height: 18px;
}
.red {
	color: red;
}
</style>