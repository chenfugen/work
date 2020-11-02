<template>
	<el-card class="faultCode">
		<!-- 搜索框 -->
		<el-form ref="tableFilter" inline :model="tableFilter">
			<el-form-item label="故障代码" prop="code">
				<el-input size="mini" v-model="tableFilter.code"></el-input>
			</el-form-item>
			<el-form-item label="产品类型" class="marginL10" prop="productType">
				<el-select size="mini" v-model="tableFilter.productType" clearable></el-select>
			</el-form-item>
			<el-form-item label="产品型号" class="marginL10" prop="productModel">
				<el-select size="mini" v-model="tableFilter.productModel" clearable></el-select>
			</el-form-item>
			<el-form-item>
				<el-button size="mini" @click="handleResetFilter">重置</el-button>
				<el-button type="primary" size="mini" @click="getList">搜索</el-button>
			</el-form-item>
		</el-form>
		<!-- 表格 -->
		<el-table :data="tableData" style="width: 100%">
			<el-table-column label="序号" prop="key" fixed="left"></el-table-column>
			<el-table-column label="产品类型" prop="category" fixed="left"></el-table-column>
			<el-table-column label="产品型号" prop="category" fixed="left"></el-table-column>
			<el-table-column label="故障代码" prop="category" fixed="left"></el-table-column>
			<el-table-column label="通知内容" prop="category"></el-table-column>
			<el-table-column label="备注" prop="category"></el-table-column>
			<el-table-column label="创建时间" prop="category"></el-table-column>
			<el-table-column label="更新时间" prop="category"></el-table-column>
			<el-table-column label="操作" prop="category" fixed="left"></el-table-column>
		</el-table>
		<!-- 分页 -->
		<el-pagination
			class="pagination marginT20"
			align="right"
			background
			@size-change="(pageSize) => getList('pageSize', pageSize)"
			@current-change="(page) => getList('page', page)"
			:current-page.sync="tableFilter.pageNumber"
			:page-sizes="[10, 20, 30, 40]"
			:page-size.sync="tableFilter.pageSize"
			layout="total, sizes, prev, pager, next, jumper"
			:total="total"
		></el-pagination>
	</el-card>
</template>

<script>
export default {
	name: "faultCode",
	data() {
		return {
			total: 0,
			tableFilter: {
				code: "",
				productType: "",
				productModel: "",
				pageNumber: 1,
				pageSize: 10,
			},
			tableData: [],
		};
	},
	methods: {
		getList: function (type, val) {},
		// 获取产品类型列表
		getProductTypes: function () {},
		// 获取产品型号列表
		getProductModels: function () {},
		handleResetFilter: function () {
			this.$refs.tableFilter.resetFields();
		},
	},
};
</script>

<style scoped>
</style>