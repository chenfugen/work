<template>
	<div class="productType">
		<el-button size="small" type="primary" @click="handleAdd">新增</el-button>
		<table-page
			class="table"
			:page="tableFilter.page"
			:limit="tableFilter.pageSize"
			:tableDable="tableData"
			:columns="columns"
		></table-page>
		<pagination
			v-show="total > 0"
			:total="total"
			:page.sync="tableFilter.page"
			:limit.sync="tableFilter.pageSize"
			@pagination="getList"
		/>
		<!-- 表单弹窗 -->
		<el-dialog title="产品类型" :visible.sync="dialogVisible" width="40%" :before-close="resetForm">
			<formComp ref="editForm" :config="formConf" :rules="rules"></formComp>
			<div>
				<el-button type="primary" @click="beforeSubmit('form')">保存</el-button>
				<el-button @click="resetForm('ruleForm')">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import tablePage from "../../components/table.vue";
import formComp from "../../components/form.vue";
import pagination from "../../components/pagination.vue";
export default {
	data() {
		return {
			dialogVisible: false,
			dialogLoad: false,
			act: "",
			total: 0,
			tagList: [],
			formConf: [
				{
					valName: "productType",
					plh: "区分大小写，最大长度24个字",
					label: "产品类型",
					type: "input",
					tips: "该名称将显示在APP端",
				},
				{
					valName: "tagId",
					plh: "请选择",
					label: "产品归属",
					type: "select",
					opts: [],
					tips: "厨电类",
				},
				{
					valName: "mark",
					plh: "请输入",
					label: "备注",
					type: "textarea",
					tips: "none",
				},
			],
			tableFilter: {
				page: 1,
				pageSize: 10,
			},
			ruleForm: {},
			rules: {
				productType: [
					{
						required: true,
						message: "请输入产品型号,长度为5-24个字符",
						trigger: "blur",
						min: 5,
						max: 24,
					},
				],
				tagId: [
					{
						required: true,
						message: "请选择产品归属",
						trigger: "change",
					},
				],
			},
			tableData: [{}],
			columns: [
				{
					prop: "productType",
					label: "产品类型",
					align: "left",
					width: 200,
				},
				{
					prop: "mark",
					label: "备注",
					align: "left",
				},
				{
					prop: "createTime",
					label: "添加时间",
					align: "left",
					sortable: true,
				},
				{
					prop: "updateTime",
					label: "更新时间",
					align: "left",
					sortable: true,
				},
				{
					label: "操作",
					width: 200,
					align: "left",
					fixed: "right",
					operates: [
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
		};
	},
	components: {
		tablePage,
		pagination,
		formComp,
	},
	mounted() {
		this.hanldeGetTagList();
	},
	methods: {
		// 获取归属列表
		hanldeGetTagList: function () {
			this.$http.productTags().then((res) => {
				if (res.data.success) {
					let list = [];
					for (let i in res.data.data) {
						list.push({
							value: res.data.data[i].id,
							label: res.data.data[i].name,
						});
					}
					this.tagList = list;
					this.formConf[1].opts = list;
					this.getList();
				}
			});
		},
		// 获取列表
		getList() {
			this.$http.productTypes(this.tableFilter).then((res) => {
				if (res.data.success) {
					this.total = res.data.data.total;
					this.$set(this, "tableData", res.data.data.list);
				}
			});
		},
		// 新增
		handleAdd() {
			this.dialogVisible = true;
			this.act = "add";
			this.$nextTick(function () {
				this.$refs.editForm.setFormData({
					productType: "",
					tagId: "",
					mark: "",
				});
			});
		},
		// 编辑
		handleEdit: function (raw) {
			let para = Object.assign({}, raw);
			this.dialogVisible = true;
			this.act = "edit";
			this.$nextTick(function () {
				this.$refs.editForm.setFormData(para);
			});
		},
		// 删除
		handleDelete(row) {
			this.$confirm("确认删除该产品类型？", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(() => {
					this.$http.productTypeDelete(row.id).then((res) => {
						this.getList();
					});
				})
				.catch(() => {});
		},
		// 提交表单前
		beforeSubmit() {
			let para = this.$refs.editForm.handleSubmit(),
				ajax =
					this.act == "add"
						? this.$http.productTypeAdd
						: this.$http.productTypeEdit;
			if (para) {
				if (this.act == "edit") {
					const h = this.$createElement;
					this.$msgbox({
						title: "确认编辑产品类型吗？",
						message: h(
							"p",
							{ style: "color: red" },
							"编辑此名称后，APP端的相对应名称也将相应更改"
						),
						showCancelButton: true,
						confirmButtonText: "确定",
						cancelButtonText: "取消",
					})
						.then((action) => {
							this.handleSubmit(ajax, para);
						})
						.catch((err) => {
							this.resetForm = false;
						});
				} else {
					this.handleSubmit(ajax, para);
				}
			}
		},
		// 提交表单
		handleSubmit: function (ajax, para) {
			this.$showLoading();
			ajax(para).then((res) => {
				this.$refs.editForm.handleResetForm();
				this.dialogVisible = false;
				this.$hideLoading();
				this.getList();
			});
		},
		// 重置表单
		resetForm() {
			this.$refs.editForm.handleResetForm();
			this.dialogVisible = false;
		},
	},
};
</script>

<style>
.productType {
	background: white;
	padding: 10px 15px;
}

.table {
	margin-top: 20px;
}

.formTips {
	font-size: 12px;
	color: #ccc;
	display: block;
}
</style>
