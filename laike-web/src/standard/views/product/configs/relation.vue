<template>
	<div id="relation">
		<div>
			<el-button size="small" type="primary" @click="handleAdd">新增属性关系</el-button>
		</div>
		<!-- 表格 -->
		<el-table class="table marginT20" ref="table" :data="tableData" :lazy="true">
			<el-table-column label="序号" type="index"></el-table-column>
			<el-table-column prop="name" label="关系名称" align="center"></el-table-column>
			<el-table-column prop="code" label="标识" align="center"></el-table-column>
			<el-table-column
				prop="radmArgId"
				label="自变量"
				align="center"
				:formatter="
							(row, column, cellValue, index) =>
								escapeProp(cellValue)
						"
			></el-table-column>
			<el-table-column
				prop="depdArgId"
				label="因变量"
				align="center"
				:formatter="
							(row, column, cellValue, index) =>
								escapeProp(cellValue)
						"
			></el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-link
						class="tableBtn"
						:underline="false"
						size="mini"
						type="primary"
						@click.native.prevent="handleEdit(scope.row)"
					>编辑</el-link>
					<el-link
						class="tableBtn marginL10"
						:underline="false"
						size="mini"
						type="danger"
						@click.native.prevent="handleInfo(key, scope.row)"
					>删除</el-link>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页 -->
		<el-pagination
			class="marginT20"
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
			:visible.sync="dialog"
			:title="act == 'add'?'新增':'编辑'"
			width="60%"
			class="dialog"
			@close="handleClose"
		>
			<el-form ref="propForm" :rules="rules" :model="propForm" label-width="120px">
				<!-- 关系名称 -->
				<el-form-item label="关系名称">
					<el-input
						placeholder="区分大小写，最大长度32个字"
						class="formInput"
						size="small"
						v-model="propForm.propertyName"
					></el-input>
				</el-form-item>
				<!-- 标示 -->
				<el-form-item label="标示">
					<el-input placeholder="区分大小写，最大长度64个字" class="formInput" size="small" v-model="propForm.code"></el-input>
				</el-form-item>
				<!-- 属性选择 -->
				<el-form-item label="属性选择">
					<!-- label -->
					<div class="choseLabel">
						<div class="formInputSmall">自变量</div>
						<div class="formInputSmall">因变量</div>
					</div>
					<!-- selection -->
					<div class="choseLabel">
						<div class="formInputSmall">
							<el-select size="small" placeholder="选择属性" v-model="propForm.radmArgId">
								<el-option
									v-for="item in propertes"
									:key="item.id"
									:value="item.id"
									:disabled="item.id == propForm.depdArgId"
									:label="item.propertyName"
								></el-option>
							</el-select>
						</div>
						<div class="formInputSmall">
							<el-select size="small" placeholder="选择属性" v-model="propForm.depdArgId">
								<el-option
									v-for="item in propertes"
									:key="item.id"
									:value="item.id"
									:disabled="item.id == propForm.radmArgId"
									:label="item.propertyName"
								></el-option>
							</el-select>
						</div>
					</div>
					<!-- type -->
					<div class="choseLabel">
						<div class="formInputSmall">{{ escapes.escapeDataType(radmArg.type) }}</div>
						<div class="formInputSmall">{{ escapes.escapeDataType(depdArg.type) }}</div>
					</div>
				</el-form-item>
				<!-- 参数关系 -->
				<el-form-item label="参数关系">
					<editRelation ref="editRelation" :depdArg="depdArg" :radmArg="radmArg"></editRelation>
				</el-form-item>
				<!-- 描述 -->
				<el-form-item label="描述">
					<el-input
						placeholder="请输入"
						type="textarea"
						class="formInput"
						size="small"
						v-model="propForm.description"
					></el-input>
				</el-form-item>
				<el-form-item>
					<el-button @click="handleClose">取消</el-button>
					<el-button type="primary" @click="handleSubmit">保存</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import escapes from "../../../utils";
import editRelation from "./relation/editRelation";

export default {
	name: "relation",
	components: {
		editRelation,
	},
	data() {
		return {
			escapes,
			act: "",
			dialog: false,
			productId: "",
			total: 0,
			rules: {},
			propForm: {
				code: "",
				propertyName: "", //关系名称
				depdArgId: "", // 因变量
				radmArgId: "", // 自变量
				func: "",
			},
			depdArg: {}, // 因变量
			radmArg: {}, // 自变量
			tableFilter: {
				page: 1,
				pageSize: 10,
			},
			tableData: [],
			propertes: [],
		};
	},
	watch: {
		propForm: {
			deep: true,
			handler: function (val) {
				// 获取自变量/因变量的详细信息
				for (let x in this.propForm) {
					if (this.propForm[x]) {
						for (let i in this.propertes) {
							if (this.propertes[i].id == this.propForm[x]) {
								if (x == "depdArgId") {
									this.depdArg = this.propertes[i];
								} else {
									this.radmArg = this.propertes[i];
								}
							}
						}
					}
				}
			},
		},
	},
	mounted() {
		this.productId = this.$route.query.id;
		this.getList();
		this.getAttributeList();
	},
	methods: {
		getList: function (type, val) {
			if (type) {
				this.tableData[type] = val;
			}
			this.$http
				.productRelations({
					productId: this.productId,
					...this.tableFilter,
				})
				.then((res) => {
					if (res.data.success) {
						this.tableData = res.data.data.list;
						this.tableFilter.page = res.data.data.pageNum;
						this.tableFilter.pageSize = res.data.data.pageSize;
						this.total = res.data.data.total;
					}
				});
		},
		// 新增关系
		handleAdd: function () {
			this.act = "add";
			this.dialog = true;
		},
		// 获取属性列表
		getAttributeList: function () {
			this.$http
				.productModelFuncListALL({ productId: this.productId })
				.then((res) => {
					if (res.data.success) {
						let list = Object.assign([], res.data.data);
						// 删除属性列表中的结构体
						for (let i in list) {
							if (list[i].type == 4 || list[i].type == 3) {
								list.splice(i, 1);
							}
						}
						this.propertes = list;
					}
				});
		},
		// 提交表单
		handleSubmit: function () {
			let ajax =
				this.act == "add"
					? this.$http.productRelationAdd
					: this.$http.productRelationEdit;
			let form = Object.assign({}, this.propForm);
			form.func = JSON.stringify(this.$refs.editRelation.submitForm());
			ajax(form).then((res) => {
				if (res.data.success) {
					this.getList();
					this.resetFields();
				}
			});
		},
		// 关闭弹窗
		handleClose: function () {
			this.dialog = false;
			this.resetFields();
		},
		// 重置表单
		resetFields: function () {
			this.dialog = false;
			this.$refs.editRelation.resetFields();
			this.depdArg = {};
			this.radmArg = {};
			this.propForm = {
				propertyName: "", //关系名称
				depdArgId: "", // 因变量
				radmArgId: "", // 自变量
				func: "",
			};
		},
		// 编辑
		handleEdit: function (row) {
			let obj = Object.assign({}, row);
			this.propForm = {
				id: obj.id,
				propertyName: obj.name, //关系名称
				code: obj.code,
				depdArgId: obj.depdArgId, // 因变量
				radmArgId: obj.radmArgId, // 自变量
				func: obj.func,
			};
			for (let i in this.propertes) {
				if (this.propForm.depdArgId == this.propertes[i].id) {
					this.depdArg = this.propertes[i];
				}
				if (this.propForm.radmArgId == this.propertes[i].id) {
					this.radmArg = this.propertes[i];
				}
			}
			this.act = "edit";
			this.dialog = true;
			this.$nextTick(function () {
				this.$refs.editRelation.assignFunc(obj.func);
			});
		},
		// 转化属性
		escapeProp: function (value) {
			for (let i in this.propertes) {
				if (this.propertes[i].id == value) {
					return this.propertes[i].propertyName;
				}
			}
		},
	},
};
</script>

<style scoped>
.formInput {
	width: 250px;
}
.formInputSmall {
	display: inline-block;
	width: 50%;
	text-align: center;
}
.formInputSpan {
	display: inline-block;
	text-align: center;
	width: 40px;
}
.choseLabel {
	width: calc(95%);
}
.dialog .el-dialog {
	width: 500px !important;
}
</style>