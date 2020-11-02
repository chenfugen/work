<template>
	<el-card id="functionConfig">
		<!-- 操作栏 -->
		<div class="clearfloat">
			<el-button size="small" @click="handleBack">返回</el-button>
			<el-button class="right" size="small" type="primary" @click="handleNext">下一步</el-button>
		</div>
		<!-- 进度条 -->
		<el-steps class="steps" :active="2" align-center>
			<el-step
				v-for="(item, index) in steps"
				:key="index"
				:title="item.name"
				:description="item.label"
			></el-step>
		</el-steps>
		<!-- 切换 -->
		<el-tabs v-model="tableTabs">
			<el-tab-pane label="属性/事件配置" name="property">
				<!-- 操作栏 -->
				<div>
					<el-button size="small" type="primary" @click="handleAdd">新增</el-button>
					<el-button size="small" type="primary" @click="getFuncPresets">从预设中选择</el-button>
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
					<el-table-column label="序号" type="index" fixed="left"></el-table-column>
					<el-table-column prop="propertyName" label="功能名称" align="center" fixed="left"></el-table-column>
					<el-table-column prop="identify" label="标识" align="center" fixed="left" width="120"></el-table-column>
					<el-table-column prop="cmdId" label="属性ID" align="center" fixed="left"></el-table-column>
					<el-table-column
						prop="rw"
						label="读写类型"
						align="center"
						:formatter="
							(row, column, cellValue, index) =>
								escapes.escapeRW(cellValue)
						"
					></el-table-column>
					<el-table-column
						prop="propertyType"
						label="属性类型"
						align="center"
						:formatter="
							(row, column, cellValue, index) =>
								escapes.escapePropertyType(cellValue)
						"
					></el-table-column>
					<el-table-column
						prop="type"
						label="数据类型"
						align="center"
						:formatter="
							(row, column, cellValue, index) =>
								escapes.escapeDataType(cellValue)
						"
					></el-table-column>
					<el-table-column prop="dateInit" label="数据定义" align="center"></el-table-column>
					<el-table-column
						prop="unit"
						label="单位"
						align="center"
						:formatter="
							(row, column, cellValue, index) =>
								escapes.escapeUnit(cellValue)
						"
					></el-table-column>
					<el-table-column prop="address" label="操作" width="180" align="center" fixed="right">
						<template slot-scope="scope">
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
								type="danger"
								@click.native.prevent="
									handleInfo(key, scope.row)
								"
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
			</el-tab-pane>
			<el-tab-pane label="关系配置" name="relation">
				<configRelation :productId="productId"></configRelation>
			</el-tab-pane>
		</el-tabs>
		<!-- 弹窗 -->
		<el-dialog
			width="60%"
			top="10vh"
			:title="dialogTitle"
			:visible.sync="dialogVisible"
			:before-close="handleClose"
		>
			<!-- 预设 -->
			<div v-if="act == 'presets'">
				<el-button
					:disabled="selection.length < 1"
					size="small"
					@click="$refs.presetTable.clearSelection()"
				>取消全选</el-button>
				<el-table
					max-height="550"
					ref="presetTable"
					:data="presets"
					header-cell-class-name="cheTabHreaClass"
					cell-class-name="cheTabConClass"
					@selection-change="handleTableSelect"
					:lazy="true"
				>
					<el-table-column type="selection" width="55" align="center" fixed="left"></el-table-column>
					<el-table-column prop="propertyName" label="属性名称" align="center" fixed="left"></el-table-column>
					<el-table-column prop="cmdId" label="属性ID" align="center" fixed="left"></el-table-column>
					<el-table-column prop="identify" label="标识" align="center" fixed="left"></el-table-column>
					<el-table-column
						prop="type"
						label="数据类型"
						align="center"
						:formatter="
							(row, column, cellValue, index) =>
								escapes.escapeDataType(cellValue)
						"
					></el-table-column>
					<el-table-column prop="byteLen" label="数据长度" align="center"></el-table-column>
					<el-table-column prop="bounds" label="取值范围" align="center" width="200"></el-table-column>
					<el-table-column prop="step" label="步长" align="center"></el-table-column>
					<el-table-column prop="multiple" label="倍数" align="center"></el-table-column>
					<el-table-column prop="unit" label="单位" align="center"></el-table-column>
					<el-table-column
						prop="rw"
						label="读写类型"
						align="center"
						:formatter="
							(row, column, cellValue, index) =>
								escapes.escapeRW(cellValue)
						"
					></el-table-column>
					<el-table-column prop="description" label="描述" align="center" width="250"></el-table-column>
				</el-table>
			</div>

			<!-- 属性 / 事件 表单 -->
			<el-form
				v-if="act == 'add' || act == 'edit'"
				class="marginTop"
				ref="attForm"
				:rules="rules"
				:model="form"
				label-width="120px"
				inline
			>
				<el-form-item class="block" label="属性类型" prop="propertyType">
					<el-radio-group v-model="form.propertyType" size="small">
						<el-radio-button label="1">属性</el-radio-button>
						<el-radio-button label="2">事件</el-radio-button>
					</el-radio-group>
				</el-form-item>
				<el-form-item class="formItem" label="属性名称" prop="propertyName">
					<el-input
						v-model="form.propertyName"
						class="formInput"
						size="small"
						placeholder="区分大小写，最大长度32个字"
					></el-input>
				</el-form-item>
				<el-form-item class="formItem" label="标示" prop="identify">
					<el-input v-model="form.identify" class="formInput" size="small" placeholder="区分大小写，最大长度64个字"></el-input>
				</el-form-item>
				<el-form-item class="formItem" label="属性ID" prop="cmdId">
					<el-tooltip effect="dark" content="数字校验，范围【0070 ，FFFF】" placement="top-start">
						<el-input
							v-model="form.cmdId"
							class="formInput"
							size="small"
							placeholder="十六进制数，大于0070的数值，示例:0070"
						></el-input>
					</el-tooltip>
				</el-form-item>
				<el-form-item class="formItem" label="数据类型" prop="type">
					<el-select class="formInput" size="small" v-model="form.type">
						<el-option
							v-for="item in dataTypes"
							:key="item.value"
							:value="item.value"
							:label="item.label"
						></el-option>
					</el-select>
				</el-form-item>
				<el-divider content-position="left">{{ escapes.escapeDataType(form.type) }}</el-divider>
				<!-- Int Float  -->
				<configInt ref="int" v-if="form.type == 1 || form.type == 2"></configInt>
				<!-- string -->
				<configStr ref="string" v-if="form.type == 3"></configStr>
				<!-- struct  -->
				<configStruct :productId="productId" ref="struct" v-if="form.type == 4"></configStruct>
				<!-- enum  -->
				<configEnum ref="enum" v-if="form.type == 5"></configEnum>
				<!-- bool -->
				<configBool ref="boolean" v-if="form.type == 6"></configBool>
			</el-form>

			<!-- 关系表单 -->
			<configRelation ref="relation" :productId="productId" v-if="act == 'relation'"></configRelation>

			<div slot="footer" class="dialog-footer">
				<el-button @click="handleClose">取 消</el-button>
				<el-button type="primary" @click="handleCompelete">保 存</el-button>
			</div>
		</el-dialog>
	</el-card>
</template>
<script>
import configInt from "./property/int";
import configEnum from "./property/enum";
import configStr from "./property/string";
import configBool from "./property/bool";
import configStruct from "./property/struct";
import configRelation from "./relation";
import escapes from "../../../utils";
const dataTypes = require("../../../assets/static").dataTypes;

export default {
	name: "functionConfig",
	components: {
		configInt,
		configEnum,
		configStr,
		configBool,
		configStruct,
		configRelation,
	},
	data() {
		var checkCmdId = (rule, value, callback) => {
			let num = parseInt("0x" + value, 16);
			if (value.length != 4) {
				callback(new Error("数据格式错误"));
			} else if (num < 119 || num > 65535) {
				callback(new Error("数据范围错误"));
			} else {
				callback();
			}
		};
		return {
			escapes,
			dialogVisible: false,
			total: 0,
			productId: "",
			tableTabs: "property", // 表格切换 property relation
			imageUrl: "",
			base64: "",
			act: "",
			dialogTitle: "",
			form: {
				propertyName: "",
				propertyType: 1,
				identify: "",
				type: 1,
				cmdId: "",
			},
			rules: {
				propertyType: [
					{
						required: true,
						message: "请选择属性类型",
						trigger: "change",
					},
				],
				propertyName: [
					{
						required: true,
						message: "请填写属性名称",
						trigger: "change",
					},
				],
				identify: [
					{
						required: true,
						message: "请填写标示ID",
						trigger: "change",
					},
				],
				type: [
					{
						required: true,
						message: "请选择数据类型",
						trigger: "change",
					},
				],
				cmdId: [
					{
						required: true,
						message: "请填写属性ID",
						trigger: "change",
					},
					{
						validator: checkCmdId,
						trigger: "blur",
					},
				],
			},
			tableFilter: {
				page: 1,
				pageSize: 10,
				rw: "", // 读写类型
				type: "", // 数据类型
			},
			steps: [
				{
					name: "型号创建",
					label: "创建产品型号",
				},
				{
					name: "功能配置",
					label: "功能属性配置",
				},
				{
					name: "解析配置",
					label: "适配器解析配置",
				},
				{
					name: "APP模板配置",
					label: "APP模板配置",
				},
			],
			presets: [], // 预设列表
			selection: [], // 预设列表勾选项
			dataTypes: dataTypes,
			menuTags: [],
			tableData: [],
			types: [],
		};
	},
	mounted() {
		this.productId = this.$route.query.id;
		this.getAttributeList();
	},
	methods: {
		// 获取属性列表
		getAttributeList: function () {
			let para = Object.assign(
				{ productId: this.productId },
				this.tableFilter
			);
			this.$http.productModelFuncList(para).then((res) => {
				if (res.data.success) {
					this.tableData = res.data.data.list;
				}
			});
		},
		// 获取预设属性列表
		getFuncPresets: function (value) {
			this.$http.productModelFuncPresets().then((res) => {
				if (res.data.success) {
					this.act = "presets";
					this.dialogTitle = "从预设中选择";
					this.presets = res.data.data;
					this.dialogVisible = true;
				}
			});
		},
		// 当表格被选择时
		handleTableSelect: function (selection) {
			this.selection = selection;
		},
		// 查看
		handleInfo: function () {},
		// 新增
		handleAdd: function () {
			this.dialogTitle = "新增";
			this.dialogVisible = true;
			this.act = "add";
		},
		// 编辑
		handleEdit: function (row) {
			this.form = row;
			this.act = "edit";
			let refName = escapes.escapeDataType(row.type);
			this.dialogTitle = "编辑";
			this.dialogVisible = true;
			this.$nextTick(() => {
				this.$refs[refName].assignForm(row);
			});
		},
		// 图片选择时
		handleChoseFile: function (file) {
			let _this = this,
				reader = new FileReader(),
				base64 = null;
			reader.onload = function (e) {
				_this.base64 = e.target.result;
				_this.form.productImg = file.raw;
				_this.$refs.image.clearFiles();
			};
			reader.readAsDataURL(file.raw);
		},
		// 完成弹窗操作
		handleCompelete: function () {
			let para = {},
				ajax = "";
			// 从预设导入
			if (this.act == "presets") {
				let ids = "";
				ajax = this.$http.productModelAddPresets;
				this.selection.forEach((item) => {
					if (ids.length < 1) {
						ids = item.id;
					} else {
						ids = ids + "," + item.id;
					}
				});
				para.ids = ids;
				para.productId = this.productId;
				this.submitForm(ajax, para);
			}
			// 新增/编辑 属性
			else if (this.act == "add" || this.act == "edit") {
				ajax =
					this.act == "add"
						? this.$http.productModelAddProp
						: this.$http.productModelEditProp;
				this.$refs.attForm.validate((valid) => {
					if (valid) {
						let refName = escapes.escapeDataType(this.form.type),
							compForm = this.$refs[refName].handleSubmit();
						console.log(compForm);
						if (compForm) {
							para = Object.assign(this.form, compForm, {
								productId: this.productId,
							});
							this.submitForm(ajax, para);
						}
					}
				});
			}
		},
		// 提交表单
		submitForm: function (ajax, para) {
			ajax(para).then((res) => {
				if (res.data.success) {
					this.getAttributeList();
					this.handleClose();
				}
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
		// 关闭弹窗
		handleClose: function () {
			if (this.act == "relation") {
				this.$refs.relation.resetFields();
			} else if (this.act != "presets") {
				this.$refs.attForm.resetFields();
			}
			this.dialogVisible = false;
		},
		// 返回
		handleBack: function () {
			this.$router.back(-1);
		},
		// 下一步
		handleNext: function () {
			this.$router.push({
				path: "/standardProduct/parse?id=" + this.productId,
			});
		},
	},
};
</script>
<style scoped>
#functionConfig {
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
.avatar-uploader .el-upload {
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}
.avatar-uploader .el-upload:hover {
	border-color: #409eff;
}
.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	line-height: 178px;
	text-align: center;
}
.avatar {
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
.formInput {
	width: 200px;
}
.steps {
	margin-bottom: 20px;
}
.block {
	display: block;
}
.marginTop {
	margin-top: 20px;
}
</style>