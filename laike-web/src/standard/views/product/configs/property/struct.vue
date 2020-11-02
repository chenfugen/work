<template>
	<div id="configStruct">
		<el-form ref="form" :rules="rules" :model="form" label-width="80px">
			<!-- 结构对象 -->
			<el-form-item label="结构对象" prop="subPropIds">
				<el-table max-height="300px" :data="propertes">
					<el-table-column
						prop="cmdId"
						label="属性ID"
						width="120"
						align="center"
					>
					</el-table-column>
					<el-table-column
						prop="propertyName"
						label="属性名称"
						width="120"
						align="center"
					>
					</el-table-column>
					<el-table-column prop="address" width="120" align="center">
						<template slot-scope="scope">
							<el-link
								:underline="false"
								size="mini"
								type="primary"
								@click="handleDelete(scope.$index, scope.row)"
							>
								<el-icon class="el-icon-delete"></el-icon>
							</el-link>
						</template>
					</el-table-column>
				</el-table>
				<el-button
					size="mini"
					type="primary"
					icon="el-icon-plus"
					@click="dialogVisible = true"
				>
				</el-button>
				<!-- 新增属性 -->
				<el-dialog
					:visible.sync="dialogVisible"
					title="添加属性"
					:modal="false"
					width="40"
				>
					<!-- 新增表单 -->
					<el-form label-width="80px">
						<el-form-item label="属性选择">
							<el-select v-model="propId" @change="handleSelProp">
								<el-option
									v-for="item in propertesHas"
									:key="item.id"
									:value="item.id"
									:label="item.propertyName"
								></el-option>
							</el-select>
						</el-form-item>
						<div v-if="propInfo.id">
							<el-form-item class="formItem" label="标示">
								{{ propInfo.cmdId }}
							</el-form-item>
							<el-form-item class="formItem" label="属性ID">
								{{ propInfo.identify }}
							</el-form-item>
							<el-form-item class="formItem" label="数据类型">
								{{ escapes.escapeDataType(propInfo.type) }}
							</el-form-item>
							<el-form-item class="formItem" label="数据长度">
								{{ propInfo.byteLen }}
							</el-form-item>
						</div>
						<div v-if="propInfo.id">
							<el-button size="mini">取消</el-button>
							<el-button
								size="mini"
								type="primary"
								@click="handleAddProp"
							>
								确认
							</el-button>
						</div>
					</el-form>
				</el-dialog>
			</el-form-item>
			<!-- 描述 -->
			<el-form-item class="marginTop" label="描述" prop="description">
				<el-input
					v-model="form.description"
					placeholder="请输入"
					type="textarea"
					size="small"
				></el-input>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import escapes from "../../../../utils";
export default {
	name: "configStruct",
	props: {
		productId: {
			type: String,
			default: () => {
				return "";
			},
		},
	},
	data() {
		return {
			escapes,
			dialogVisible: false,
			propertes: [],
			propertesHas: [],
			rules: {
				subPropIds: [
					{
						required: true,
						message: "请输入至少添加一个属性",
						trigger: "blur",
					},
				],
			},
			form: {
				subPropIds: "",
				description: "",
			},
			propId: "",
			propInfo: {},
		};
	},
	created() {
		this.getAttributeList();
	},
	methods: {
		// 获取属性列表
		getAttributeList: function () {
			this.$http
				.productModelFuncListALL({ productId: this.productId })
				.then((res) => {
					if (res.data.success) {
						this.propertesHas = res.data.data;
					}
				});
		},
		handleSelProp: function () {
			this.$http
				.productModelFuncInfo({ propertyId: this.propId })
				.then((res) => {
					if (res.data.success) {
						this.propInfo = res.data.data.productProperty;
					}
				});
		},
		handleAddProp: function () {
			let prop = Object.assign({}, this.propInfo);
			this.propertes.push(prop);
			this.getIds();
			this.dialogVisible = false;
			this.propId = "";
			this.propInfo = {};
		},
		handleDelete: function (index, row) {
			this.propertes.splice(index, 1);
			this.getIds();
		},
		getIds: function () {
			let ids = "";
			this.propertes.forEach((item) => {
				if (ids) {
					ids = ids + "," + item.id;
				} else {
					ids = item.id;
				}
			});
			this.form.subPropIds = ids;
		},
		handleSubmit: function () {
			let result;
			this.$refs.form.validate((valid) => {
				if (valid) {
					result = this.form;
				} else {
					result = false;
				}
			});
			return result;
		},
	},
};
</script>

<style scoped>
#configStruct {
	width: 100%;
}
.formItem {
	display: block;
}
.marginTop {
	margin-top: 20px;
}
</style>