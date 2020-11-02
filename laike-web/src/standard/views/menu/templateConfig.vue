<template>
	<el-card class="cookbookConfig">
		<!-- 操作栏 -->
		<el-button type="primary" size="small" class="right" @click="handleAdd">新增</el-button>

		<!-- 表格 -->
		<table-page
			class="table"
			:page="tableFilter.page"
			:limit="tableFilter.pageSize"
			:tableDable="tableData"
			:columns="columns"
		></table-page>
		<!-- 分页 -->
		<pagination
			v-show="total > 0"
			:total="total"
			:page.sync="tableFilter.page"
			:limit.sync="tableFilter.pageSize"
			@pagination="getList"
		/>
		<!-- <el-table class="marginT20" :data="tableData" style="width: 100%">
      <el-table-column type="index" fixed="left"> </el-table-column>
      <el-table-column label="分类菜单名称" prop="name"></el-table-column>
      <el-table-column label="厨电类别" align="center" prop="menuTagName"></el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" :formatter="(row, column, cellValue, index) =>escapes.escapeTime(cellValue)"></el-table-column>
      <el-table-column label="操作者" align="center" prop="creator"></el-table-column>
      <el-table-column label="操作" align="center" width="200" fixed="right">
        <template slot-scope="scope">
          <el-link class="tableBtn" :underline="false" size="mini" type="primary" @click.native.prevent="handleInfo(key, scope.row)">
            详情
          </el-link>
          <el-link class="tableBtn" :underline="false" size="mini" type="primary" @click.native.prevent="handleEdit(scope.row)">
            编辑
          </el-link>
          <el-link class="tableBtn" :underline="false" size="mini" type="danger" @click.native.prevent="handleDelete(scope.row)">
            删除
          </el-link>
        </template>
      </el-table-column>
		</el-table>-->
		<!-- 弹窗 -->
		<el-dialog
			:title="dialogTitle"
			:visible.sync="dialogVisible"
			width="50%"
			:before-close="handleClose"
		>
			<el-form ref="form" :model="form" label-width="150px" :rules="rules">
				<el-form-item label="产品归属">厨电类</el-form-item>
				<el-form-item label="厨电类别" prop="menuTagId">
					<el-select class="formInput" v-model="form.menuTagId">
						<el-option v-for="item in menuTags" :key="item.value" :value="item.value" :label="item.name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="菜谱分类菜单名称" prop="name">
					<el-input class="formInput" maxlength="64" v-model="form.name"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="handleSubmit">确 定</el-button>
			</span>
		</el-dialog>
	</el-card>
</template>

<script>
import tablePage from "../../components/table.vue";
import pagination from "../../components/pagination.vue";
import Utils from "../../utils";
export default {
	name: "cookbookConfig",
	data() {
		return {
			tableData: [],
			columns: [
				{
					prop: "name",
					label: "分类菜单名称",
					align: "left",
				},
				{
					prop: "menuTagName",
					label: "厨电类别",
					align: "left",
				},
				{
					prop: "updateTime",
					label: "更新时间",
					align: "left",
					width: 150,
					sortable: true,
					render: (h, params) => {
						return h(
							"span",
							Utils.formatDate(params.row.createTime)
						);
					},
				},
				{
					prop: "creator",
					label: "更新者",
					align: "left",
				},
				{
					label: "操作",
					width: 150,
					align: "left",
					fixed: "right",
					operates: [
						{
							label: "查看",
							type: "primary",
							disabled: false,
							method: (index, row) => {
								// this.handleEdit(row);
							},
						},
						{
							label: "编辑",
							type: "primary",
							disabled: false,
							method: (index, row) => {
								this.handleEdit(row);
							},
						},
						{
							label: "删除",
							type: "primary",
							disabled: false,
							method: (index, row) => {
								this.handleDelete(row);
							},
						},
					],
				},
			],
			dialogVisible: false,
			total: 0,
			dialogTitle: "",
			menuTags: [
				{
					value: 1,
					name: "其他类标准模板",
				},
				{
					value: 2,
					name: "单锅模板",
				},
				{
					value: 3,
					name: "双锅类模板",
				},
			],
			form: {
				menuTagId: "",
				name: "",
			},
			tableFilter: {
				page: 1,
				pageSize: 10,
			},
			tableData: [],
			rules: {
				menuTagId: [
					{
						required: true,
						message: "请选择厨电类别",
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
			},
		};
	},
	components: {
		tablePage,
		pagination,
	},
	mounted() {
		this.getList();
	},
	methods: {
		getList: function () {
			let ajax = this.$http.menuTemplates();
			ajax.then((res) => {
				if (res.data.success) {
					let list = Object.assign([], res.data.data);
					list.forEach((item) => {
						item.menuTagName = item.menuTag.name;
					});
					this.tableData = list;
					this.total = res.data.total;
				}
			});
		},
		handleAdd: function () {
			this.dialogTitle = "新增菜谱模板";
			this.dialogVisible = true;
		},
		handleEdit: function (row) {
			this.form.id = row.id;
			this.form.name = row.name;
			this.form.menuTagId = row.menuTag.tagId;
			this.dialogTitle = "编辑菜谱模板";
			this.dialogVisible = true;
		},
		handleDelete: function (row) {
			let msg = "确认此分类菜单（" + row.name + "）吗?";
			this.$confirm(msg, "提示", {
				confirmButtonText: "确认",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(() => {
					this.$http.menuTemplateDelete(row.id).then((res) => {
						if (res.data.success) {
							this.getList();
						}
					});
				})
				.catch(() => {});
		},
		handleSubmit: function () {
			let ajax =
				this.act == "add"
					? this.$http.menuTemplateAdd
					: this.$http.menuTemplateEdit;
			ajax(this.form).then((res) => {
				if (res.data.success) {
					this.getList();
					this.handleClose();
				}
			});
		},
		handleClose: function () {
			this.dialogVisible = false;
			this.$refs.form.resetFields();
		},
	},
};
</script>

<style>
.cookbookConfig {
	background: white;
	padding: 10px 15px;
	border-radius: 5px;
}

.cookbookConfig .table {
	margin-top: 20px;
}

.cookbookConfig .formTips {
	font-size: 12px;
	color: #ccc;
	display: block;
}

.cookbookConfig .tableBtn {
	margin-right: 10px;
}

.cookbookConfig .el-dropdown-link {
	color: #409eff;
	font-weight: 500;
	font-size: 14px;
}

.cookbookConfig .formInput {
	width: 200px;
}
</style>
