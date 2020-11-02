<template>
	<div id="com-table" :style="handleTableHeight">
		<el-table
			ref="table"
			:data="tableData"
			@selection-change="tableHeader.handleSelectionChange"
			v-if="tableHeader.tableStatus"
			style="width: 100%"
			:height="tableHeader.tableHeight ? tableHeader.tableHeight : 640"
			header-cell-class-name="cheTabHreaClass"
			cell-class-name="cheTabConClass"
			:lazy="true"
			:load="tableHeader.load ? tableHeader.load : null"
			@filter-change="tableHeader.filters"
			@sort-change="tableHeader.sortMethod"
			@expand-change="(a, b) =>handleChangeExpend(a,b)"
		>
			<el-table-column v-if="tableHeader.expand" :fixed="true" type="expand">
				<template slot-scope="props">
					<!-- 子菜谱 -->
					<el-form label-position="left" inline class="demo-table-expand" style="width: 615px">
						<el-table
							:data="props.row.expand"
							border
							style="margin-left: 100px"
							cell-class-name="cheTabConClass"
							header-cell-class-name="cheTabHreaClass"
						>
							<el-table-column prop="flavorV2" label="口味" width="120"></el-table-column>
							<el-table-column prop="people" label="份量" width="120"></el-table-column>
							<el-table-column :min-width="120" label="操作">
								<template slot-scope="scope">
									<el-button
										@click.native.prevent="tableHeader.expand.up(scope.row)"
										type="text"
										size="small"
									>编辑</el-button>
									<el-divider direction="vertical"></el-divider>
									<el-button
										@click.native.prevent="tableHeader.expand.del(scope.row)"
										type="text"
										size="small"
									>删除</el-button>
									<el-divider direction="vertical"></el-divider>
									<el-button
										@click.native.prevent="tableHeader.expand.fileSave(scope.row)"
										type="text"
										size="small"
									>导出</el-button>
									<el-divider direction="vertical"></el-divider>
									<el-button
										@click.native.prevent="tableHeader.expand.fileImport(scope.row)"
										type="text"
										size="small"
									>导入</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-form>
				</template>
			</el-table-column>
			<el-table-column
				v-if="tableHeader.isSelection[0]"
				fixed
				type="selection"
				:width="tableHeader.isSelection[1]"
			></el-table-column>
			<el-table-column type="index" width="50" label="序号" align="center" fixed="left"></el-table-column>
			<!-- 子菜谱列表 -->
			<el-table-column
				v-for="(i, index) in tableHeader.data"
				:key="index"
				:fixed="i.fixed"
				:prop="i.prop"
				:label="i.label"
				:min-width="i.minWidth"
				:show-overflow-tooltip="i.prop != 'name' ? true : false"
				:filter-multiple="false"
				:sortable="i.sortable ? 'custom' : false"
				:align="
					i.prop.indexOf('p_s') != -1 ||
					i.prop.indexOf('popover') != -1
						? 'center'
						: 'left'
				"
				:filters="i.filters ? i.filters : null"
				:filtered-value="i.filterList ? i.filterList : null"
				:column-key="i.prop"
				filter-placemen="bottom"
			>
				<!-- 特殊样式列——在离线——通未通过——推荐菜单-->
				<template slot-scope="scope">
					<span
						v-if="i.prop == 'online' || i.prop == 'imageName'"
						id="disc"
						:style="scope.row[i.prop]? 'background:#60ACFC': 'background: #E1E3E7;'"
					></span>
					<i
						v-if="i.prop == 'ifRead'"
						:class="scope.row[i.prop] ? 'iconread' : 'iconunread'"
						:style="!scope.row[i.prop] ? 'color:#60ACFC' : ''"
					></i>
					<el-tooltip
						v-if="i.prop == 'status'"
						:content="scope.row[i.prop] ? '启用' : '停用'"
						placement="top"
					>
						<el-switch
							v-if="i.prop == 'status'"
							disabled
							v-model.trim="scope.row[i.prop]"
							@click.native.prevent="handleSwitch(scope, i)"
							:active-value="true"
							:inactive-value="false"
						></el-switch>
					</el-tooltip>
					<i v-if="i.prop == 'totalStatus'" :class="scope.row[i.prop] ? 'iconqualified' : 'iconwrong'"></i>
					{{handleOtherData(scope, i)}}
					<!-- 缩略图 -->
					<img v-if="judgeShowImg(scope, i)" src="@/assets/imges/recommend.png" />
					<el-popover
						style="margin-right: 0"
						v-if="i.prop == 'icon' && showImg"
						placement="bottom"
						trigger="hover"
					>
						<img
							slot="reference"
							style="margin-top: 11px; cursor: pointer"
							width="80"
							v-if="i.prop == 'icon'"
							:src="
								$store.state.oldStore.cacheImgSrc +
								scope.row['imageName'] +
								'&token=' +
								$store.state.oldStore.token
							"
						/>
						<img
							style="margin-top: 11px; width: 188px"
							:src="
								$store.state.oldStore.cacheImgSrc +
								scope.row['imageName'] +
								'&token=' +
								$store.state.oldStore.token
							"
						/>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column
				v-if="tableHeader.oper"
				:fixed="tableHeader.oper.fixed"
				:label="tableHeader.oper.label"
				:min-width="tableHeader.oper.minWidth"
			>
				<template slot-scope="scope">
					<el-button
						v-for="(i, index) in tableHeader.oper.oper"
						:key="index"
						:disabled="
							(i.name == '新增子菜谱' ||
								i.name == '导入子菜谱') &&
							scope.row['existChildMenu'] == true
						"
						@click.native.prevent="
							i.clickFun
								? i.clickFun(scope.$index, scope.row)
								: $message.warning('无此操作权限！')
						"
						type="text"
						size="small"
					>
						<el-divider v-if="index != 0" direction="vertical"></el-divider>
						{{
						i.name == "冻结"
						? scope.row["frozen"]
						? "解冻"
						: "冻结"
						: i.name
						}}
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			id="pagination"
			background
			align="right"
			@size-change="tableHeader.pagination.handleSizeChange"
			@current-change="tableHeader.pagination.handleCurrentChange"
			:current-page.sync="tableHeader.pagination.currentPage"
			:page-sizes="tableHeader.pagination.pageSizes"
			:page-size.sync="tableHeader.pagination.pageSize"
			layout="total, sizes, prev, pager, next, jumper"
			:total="tableHeader.pagination.total"
		></el-pagination>
	</div>
</template>

<script>
export default {
	props: ["tableHeader", "tableData"],
	data() {
		return {
			tableHeight: "",
			showImg: true,
			filters: function () {},
		};
	},
	computed: {},
	mounted() {},
	methods: {
		dateFilter(value, pattern = "") {
			// 将字符串转换为Date类型
			var mt = new Date(value);
			// 获取年份
			var y = mt.getFullYear();
			// 获取月份 从0开始
			var m = (mt.getMonth() + 1).toString().padStart(2, "0");
			// 获取天数
			var d = mt.getDate().toString().padStart(2, "0");
			if (pattern === "天") {
				return y + "-" + m + "-" + d;
			}
			// 获取小时
			var h = mt.getHours().toString().padStart(2, "0");
			// 获取分钟
			var mi = mt.getMinutes().toString().padStart(2, "0");
			// 获取秒
			var s = mt.getSeconds().toString().padStart(2, "0");
			// 拼接为我们需要的各式
			if (y == "1970") {
				return value;
			} else {
				return y + "-" + m + "-" + d + " " + h + ":" + mi + ":" + s;
			}
		},
		clear() {
			this.$refs.table.clearFilter();
		},
		handleShowImg: function (flag) {
			this.showImg = flag;
		},
		judgeShowImg: function (scope, i) {
			return (
				scope.row.hasOwnProperty("recommend") &&
				scope.row["recommend"] &&
				i.prop == "name"
			);
		},
		handleTableHeight: function () {
			return tableHeader.comHeight
				? "height:" + tableHeader.comHeight
				: "height:100%";
		},
		handleChangeExpend: function (a, b) {
			return tableHeader.expand ? tableHeader.expand.change(a, b) : "";
		},
		handleSwitch: function (scope, i) {
			tableHeader.switch
				? tableHeader.switch(scope.row[i.prop], scope.row)
				: $message.warning("无此操作权限！");
		},
		handleOtherData: function (scope, i) {
			// 更多版本 == 固件类别
			if (i.prop == "type" && i.label == "固件类别") {
				for (let i in this.$staticData.moreFirmwareTypes) {
					if (
						this.$staticData.moreFirmwareTypes[i].value ==
						scope.row.type
					) {
						return this.$staticData.moreFirmwareTypes[i].label;
					}
				}
			}
			// {{i.prop == 'status'?(scope.row[i.prop]?'启用':'停用'):''}}
			if (i.prop == "online") {
				return scope.row[i.prop] ? "在线" : "离线";
			}
			if (i.prop == "init") {
				return scope.row[i.prop] ? "已激活" : "未激活";
			}
			if (i.prop == "classify") {
				return scope.row[i.prop] == 1 ? "智能烹饪机" : "——";
			}
			if (i.prop == "totalStatus") {
				return scope.row[i.prop] ? "合格" : "不合格";
			}
			if (i.prop == "ifRead") {
				return scope.row[i.prop] ? "已读" : "未读";
			}
			if (i.prop == "imageName") {
				scope.row[i.prop] ? "有" : "无";
			}
			if (i.prop == "buildIn" || i.prop == "force") {
				return scope.row[i.prop] ? "是" : "否";
			}
			if (Array.isArray(scope.row[i.prop])) {
				return scope.row[i.prop].join(",");
			}
			if (i.prop == "type" && i.label == "归属") {
				return scope.row[i.prop] == 1
					? "美食家"
					: scope.row[i.prop] == 2
					? "食材分类"
					: scope.row[i.prop] == 3
					? "特色分类"
					: "口味";
			}
			if (i.prop == "clickType" && i.name && i.name == "消息推送") {
				return scope.row[i.prop] == 1
					? "打开APP消息中心"
					: "打开APP菜谱上新";
			}
			if (i.prop == "type" && i.label == "反馈类型") {
				return scope.row[i.prop] == 1
					? "设备"
					: scope.row[i.prop] == 2
					? "APP"
					: "其他";
			}
			if (
				i.prop == "appType" ||
				(i.prop == "type" && i.label == "用户范围")
			) {
				return scope.row[i.prop] == 1
					? "Android"
					: scope.row[i.prop] == 2
					? "IOS"
					: "所有用户";
			}
			if (i.prop == "clickType" && i.name && i.name == "点击动作") {
				return scope.row[i.prop] == 1
					? "淘宝APP"
					: scope.row[i.prop] == 2
					? "京东APP"
					: "浏览器";
			}
			// 其他
			if (
				!Array.isArray(scope.row[i.prop]) &&
				i.label != "强制更新" &&
				i.prop != "icon" &&
				i.prop != "classify" &&
				i.label != "归属" &&
				i.label != "是否内置菜" &&
				i.label != "是否有图" &&
				i.label != "点击动作" &&
				i.label != "反馈类型" &&
				i.label != "用户范围" &&
				i.prop != "appType" &&
				i.prop != "status" &&
				i.prop != "online" &&
				i.prop != "totalStatus" &&
				i.prop != "init" &&
				i.prop != "clickType" &&
				i.prop != "ifRead"
			) {
				return i.prop.indexOf("Time") != -1
					? this.dateFilter(scope.row[i.prop], "")
					: scope.row[i.prop] != null &&
					  typeof scope.row[i.prop] == "object"
					? scope.row[i.prop].name
					: i.prop == "userName" && scope.row[i.prop] == null
					? "未绑定手机号"
					: scope.row[i.prop] === "" || scope.row[i.prop] == null
					? "-"
					: scope.row[i.prop];
			}
		},
	},
};
</script>

<style lang="less">
.el-table__fixed,
.el-table__fixed-right {
	// height: calc(100% - 17px) !important;
	// &::before{
	//     background-color:#fff !important;
	// }
}
.el-table--scrollable-y .el-table__body-wrapper {
	// margin-bottom: calc(100% - 100vw) !important;
}
.detailsPopper {
	> span {
		float: left;
		display: block;
		font-size: 12px;
		line-height: 22px;
		color: #59626c;
		&.title {
			font-size: 14px;
			font-weight: bold;
			width: 100%;
			margin: 5px 0;
		}
	}
	> i {
		float: left;
		margin-right: 6px;
	}
}
#com-table {
	width: 100%;
	height: 100%;
	#disc {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		display: block;
		margin: 6px 6px 0 0;
		float: left;
	}
	.el-button + .el-button {
		margin-left: 0;
	}
	#pagination {
		float: right;
		padding: 12px 12px 12px 0;
	}
	.el-pagination.is-background .el-pager li:not(.disabled).active {
		background-color: #f02b54;
	}
}
</style>
