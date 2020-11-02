<template>
	<div class="table">
		<el-table
			id="iTable"
			v-loading="loading"
			:data="tableDable"
			ref="mutipleTable"
			@selection-change="handleSelectionChange"
			@sort-change="changeTableSort"
		>
			<!-- 表格展开 -->
			<el-table-column
				v-if="tableHeader.expand"
				:fixed="true"
				type="expand"
			>
				<template slot-scope="props">
					<el-form
						label-position="left"
						inline
						class="demo-table-expand"
						style="width: 615px"
					>
						<el-table
							:data="props.row.expand"
							border
							v-loading="tableHeader.expand.loading"
							style="margin-left: 100px"
							cell-class-name="cheTabConClass"
							header-cell-class-name="cheTabHreaClass"
						>
							<el-table-column
								prop="flavorV2"
								label="口味"
								width="120"
							></el-table-column>
							<el-table-column
								prop="people"
								label="份量"
								width="120"
							></el-table-column>
							<el-table-column :min-width="120" label="操作">
								<template slot-scope="scope">
									<el-button
										@click.native.prevent="
											tableHeader.expand.up(scope.row)
										"
										type="text"
										size="small"
										>编辑</el-button
									>
									<el-divider
										direction="vertical"
									></el-divider>
									<el-button
										@click.native.prevent="
											tableHeader.expand.del(scope.row)
										"
										type="text"
										size="small"
										>删除</el-button
									>
									<el-divider
										direction="vertical"
									></el-divider>
									<el-button
										@click.native.prevent="
											tableHeader.expand.fileSave(
												scope.row
											)
										"
										type="text"
										size="small"
										>导出</el-button
									>
									<el-divider
										direction="vertical"
									></el-divider>
									<el-button
										@click.native.prevent="
											tableHeader.expand.fileImport(
												scope.row
											)
										"
										type="text"
										size="small"
										>导入</el-button
									>
								</template>
							</el-table-column>
						</el-table>
					</el-form>
				</template>
			</el-table-column>
			<!-- 普通数据 -->
			<el-table-column
				align="center"
				label="序号"
				fixed="left"
				width="80"
			>
				<template slot-scope="scope">
					<span>{{
						page > 1
							? (page - 1) * limit + scope.$index + 1
							: scope.$index > 8
							? scope.$index + 1
							: "0" + (scope.$index + 1)
					}}</span>
				</template>
			</el-table-column>
			<template v-for="(column, index) in columns">
				<el-table-column
					:prop="column.prop"
					:key="index"
					:label="column.label"
					:sortable="column.sortable"
					:fixed="column.fixed"
					:align="column.align"
					:width="column.width"
          :show-overflow-tooltip="column.showOverflow"
				>
					<template slot-scope="scope">
						<template v-if="!column.render">
							<template v-if="column.formatter">
								<span
									v-html="column.formatter(scope.row, column)"
								></span>
							</template>
							<template v-if="column.operates">
								<span
									v-for="(btn, key) in column.operates"
									:key="key"
								>
									<!-- 展开框类按钮 -->
									<el-dropdown
										trigger="click"
										v-if="btn.dropdowns"
									>
										<span class="el-dropdown-link">
											{{ btn.label }}
											<i
												class="el-icon-arrow-down el-icon--right"
											></i>
										</span>
										<el-dropdown-menu slot="dropdown">
											<el-dropdown-item
												v-for="(dropdown,
												id) in btn.dropdowns"
												:key="id"
												@click.native.prevent="
													dropdown.method(
														key,
														scope.row
													)
												"
											>
												<span v-if="!dropdown.render">{{
													dropdown.name
												}}</span>
												<expand-dom
													v-else
													:column="column"
													:row="scope.row"
													:render="dropdown.render"
													:index="id"
												></expand-dom>
											</el-dropdown-item>
										</el-dropdown-menu>
									</el-dropdown>
									<!-- 普通按钮 -->
									<span v-else>
										<el-link
											v-if="!btn.render"
											:underline="false"
											size="mini"
											:type="btn.type"
											:icon="btn.icon"
											:disabled="btn.disabled"
											@click.native.prevent="
												btn.method(key, scope.row)
											"
										>
											{{ btn.label }}
											<span
												class="line"
												v-if="
													key <
													column.operates.length - 1
												"
											></span>
										</el-link>
										<expand-dom
											v-else
											:column="column"
											:row="scope.row"
											:render="btn.render"
											:index="key"
										></expand-dom>
									</span>
								</span>
							</template>
							<template v-else>
								<span>{{
									scope.row[column.prop] == "null"
										? "--"
										: scope.row[column.prop]
										? scope.row[column.prop]
										: "--"
								}}</span>
							</template>
						</template>
						<template v-else>
							<expand-dom
								:column="column"
								:row="scope.row"
								:render="column.render"
								:index="index"
							></expand-dom>
						</template>
					</template>
				</el-table-column>
			</template>
		</el-table>
	</div>
</template>
<!--endregion-->
<script>
export default {
	props: {
		tableHeader: {
			type: Object,
			default: () => {
				return {};
			},
		},
		tableDable: {
			type: Array,
			default: () => {
				return [];
			},
		},
		columns: {
			// 数据列表
			type: Array,
			default: () => {
				return [];
			},
		},
		loading: {
			// 加载更新
			type: Boolean,
			default: false,
		},
		page: {
			type: Number,
			default: 1,
		},
		limit: {
			type: Number,
			default: 10,
		},
		// options: {
		// 	type: Object,
		// 	default: {
		// 		stripe: false, // 是否为斑马纹 table
		// 		highlightCurrentRow: false // 是否要高亮当前行
		// 	},
		// } // table 表格的控制参数
	},
	//组件
	components: {
		expandDom: {
			functional: true,
			props: {
				row: Object,
				render: Function,
				index: Number,
				column: {
					type: Object,
					default: null,
				},
			},
			render: (h, ctx) => {
				const params = {
					row: ctx.props.row,
					index: ctx.props.index,
				};
				if (ctx.props.column) params.column = ctx.props.column;
				return ctx.props.render(h, params);
			},
		},
	},
	// 数据
	data() {
		return {
			pageIndex: 1,
			multipleSelection: [], // 多行选中
		};
	},
	mounted() {},
	computed: {},
	methods: {
		// 多行选中
		handleSelectionChange(val) {
			this.multipleSelection = val;
			this.$emit("handleSelectionChange", val);
		},
		changeTableSort(column) {
			this.$emit("changeTableSort", column.order);
		},
	},
};
</script>
<style>
.table .line {
	display: inline-block;
	width: 1px;
	margin: 0px 5px;
	background: #e8e8e8;
}
.table .el-dropdown {
	color: #1f9ad6;
	cursor: pointer;
}
</style>