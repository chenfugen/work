<template>
	<div class="table">
		<el-table id="iTable" v-loading="loading" :empty-text="emptyText" :header-cell-style="{background:'#F2F6FA'}" :data="tableDable" ref="mutipleTable"
		 @selection-change="handleSelectionChange"  @sort-change="changeTableSort">
			<el-table-column align="center" label="序号" fixed="left" width="80">
				<template slot-scope="scope">
					<span>{{page>1?(page - 1) * limit + scope.$index + 1:scope.$index>8?scope.$index + 1:"0"+(scope.$index + 1 )}}</span>
				</template>
			</el-table-column>
			<template v-for="(column,index) in columns">
				<el-table-column :prop="column.prop" :key='index' :label="column.label" :sortable="column.sortable"   :fixed="column.fixed" :align="column.align"
				 :width="column.width">
					<template slot-scope="scope">
						<template v-if="!column.render">
							<template v-if="column.formatter">
								<span v-html="column.formatter(scope.row, column)"></span>
							</template>
							<template v-if="column.operates">
								<span v-for="(btn, key) in column.operates" :key="key">
									<el-dropdown trigger="click" v-if="btn.dropdowns">
										<span class="el-dropdown-link">{{btn.label}}<i class="el-icon-arrow-down el-icon--right"></i></span>
										<el-dropdown-menu slot="dropdown">
											<el-dropdown-item v-for="(dropdown, id) in btn.dropdowns" :key="id" @click.native.prevent="dropdown.method(key,scope.row)">
												<span v-if="!dropdown.render">{{dropdown.name}}</span>
												<expand-dom v-else :column="column" :row="scope.row" :render="dropdown.render" :index="id"></expand-dom>
											</el-dropdown-item>
										</el-dropdown-menu>
									</el-dropdown>
									<span v-else>
										<el-link  v-if="!btn.render" :underline="false" size="mini" :type="btn.type" :icon="btn.icon" :disabled="btn.disabled"
										 @click.native.prevent="btn.method(key,scope.row)">{{btn.label}}<span class="line" v-if="key<column.operates.length-1"></span></el-link>
										<expand-dom v-else :column="column" :row="scope.row" :render="btn.render" :index="key"></expand-dom>									
									</span>									
								</span>
							</template>
							<template v-else>
								<span>{{scope.row[column.prop]=="null"?"--":scope.row[column.prop]?scope.row[column.prop]:"--"}}</span>
							</template>
						</template>
						<template v-else>
							<expand-dom :column="column" :row="scope.row" :render="column.render" :index="index"></expand-dom>
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
			tableDable: {
				type: Array,
				default: () => {
					return []
				}
			},
			columns: { // 数据列表
				type: Array,
				default: () => {
					return []
				}
			},
			loading: { // 加载更新
				type: Boolean,
				default: false
			},
			page: {
				type: Number,
				default: 1
			},
			limit: {
				type: Number,
				default: 10
			},
			emptyText:{
				type: String,
				default:"暂无数据"
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
						default: null
					}
				},
				render: (h, ctx) => {
					const params = {
						row: ctx.props.row,
						index: ctx.props.index
					}
					if (ctx.props.column) params.column = ctx.props.column
					return ctx.props.render(h, params)
				}
			}
		},
		// 数据
		data() {
			return {
				pageIndex: 1,
				multipleSelection: [] // 多行选中
			}
		},
		mounted() {},
		computed: {},
		methods: {
			// 多行选中
			handleSelectionChange(val) {
				this.multipleSelection = val
				this.$emit('handleSelectionChange', val)
			},
			changeTableSort(column) {
				this.$emit('changeTableSort', column.order)
			},
		}
	}
</script>
<style lang="scss">
	.table {
		.line {
			display: inline-block;
			width: 1px;
			height: 10px;
			margin: 0px 5px;
			background: #E8E8E8;
		}

		.el-dropdown {
			color: #1F9AD6;
			cursor: pointer;
		}
	}
</style>
