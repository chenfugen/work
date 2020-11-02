<template>
	<div id="menuList">
		<!-- tab切换 -->
		<el-tabs v-model.trim="activeName" @tab-click="handleSwitchTab" style="height:calc(100% - 65px)">
			<!-- 联网菜谱 -->
			<el-tab-pane label="联网菜谱" name="0" style="height:100%">
				<TableSearch :tableData="tableData" :tableSearch="tableSearch" :exportHead="tableHeader.data"></TableSearch>
				<comTable ref="child" v-if="tableStutas" :tableData="tableData" :tableHeader="tableHeader"></comTable>
			</el-tab-pane>
			<!-- 单机菜谱-CF5 -->
			<el-tab-pane label="单机菜谱-CF5" name="1" style="height:100%">
				<TableSearch
					:tableData="tableData5"
					:tableSearch="tableSearch5"
					:exportHead="tableHeader5.data"
				></TableSearch>
				<comTable :tableData="tableData5" :tableHeader="tableHeader5"></comTable>
			</el-tab-pane>
			<!-- 单机菜谱-CF5S -->
			<el-tab-pane label="单机菜谱-CF5S" name="2" style="height:100%">
				<TableSearch
					:tableData="tableData5"
					:tableSearch="tableSearch5"
					:exportHead="tableHeader5.data"
				></TableSearch>
				<comTable :tableData="tableData5" :tableHeader="tableHeader5"></comTable>
			</el-tab-pane>
		</el-tabs>
		<a class="target" ref="target" href target="_blank"></a>
		<input
			ref="filElem"
			id="files"
			type="file"
			class="upload-file"
			style="visibility:hidden;"
			@change="getFile"
		/>
	</div>
</template>
<script>
import FileSaver from "file-saver";
import md5 from "js-md5";
export default {
	data() {
		return {
			importFlag: "",
			activeName: "0",
			// 内置菜单-CF5
			tableSearch5: {
				isExport: false,
				clearable: 0,
				exportName: "",
				btn: [
					{
						name: "新增",
						clickInfo:
							this.$store.state.oldStore.authThree.indexOf(
								"e21"
							) != -1
								? this.addRow
								: 0,
					},
					{
						name: "批量启用",
						clickInfo:
							this.$store.state.oldStore.authThree.indexOf(
								"e24"
							) != -1
								? this.enable
								: 0,
					},
					{
						name: "批量停用",
						clickInfo:
							this.$store.state.oldStore.authThree.indexOf(
								"e24"
							) != -1
								? this.unenable
								: 0,
					},
					{
						name: "批量删除",
						clickInfo:
							this.$store.state.oldStore.authThree.indexOf(
								"e20"
							) != -1
								? this.delete
								: 0,
					},
				],
				funClick: this.getMenu,
				seChang: this.cleanClick,
				cleanClick: this.cleanClick,
				input: [
					{
						pla: "菜谱名/关键字",
						width: "108",
						value: "",
					},
					{
						pla: "菜谱ID",
						width: "68",
						value: "",
					},
				],
				picker: {
					value: "",
					startPlaceholder: "更新开始日期",
					endPlaceholder: "更新结束日期",
				},
				select: [],
				selectArry: [], //表格选中数据集合
			},
			tableHeader5: {
				tableStatus: false,
				filters: this.filters,
				filtersList: [],
				sortMethod: this.sortMethod,
				handleSelectionChange: this.handleSelectionChange, //选中表格数据方法
				isSelection: [true, "55"], //是否显示序列号
				tableHeight: "calc(100% - 86px)",
				comHeight: "calc(100% - 10px)",
				oper: {
					//操作栏
					label: "操作",
					prop: "oper",
					minWidth: "135",
					fixed: "right",
					oper: [
						{
							name: "查看",
							clickFun: this.seeDetails,
						},
						{
							name: "编辑",
							clickFun:
								this.$store.state.oldStore.authThree.indexOf(
									"e22"
								) != -1
									? this.update
									: 0,
						},
						{
							name: "删除",
							clickFun:
								this.$store.state.oldStore.authThree.indexOf(
									"e20"
								) != -1
									? this.deleteRow
									: 0,
						},
					],
				},
				switch:
					this.$store.state.oldStore.authThree.indexOf("e24") != -1
						? this.switch
						: 0,
				data: [
					//表格头数据绑定
					{
						label: "菜谱ID",
						prop: "menuId",
						minWidth: "120",
						fixed: true,
						sortable: true,
					},
					{
						label: "菜谱名称",
						prop: "name",
						minWidth: "150",
						fixed: false,
					},
					{
						label: "智膳宝",
						prop: "cuisine",
						minWidth: "120",
						fixed: false,
						filters: this.$staticData.zhishanbao,
						filterList: [],
					},
					{
						label: "食材分类",
						prop: "category",
						minWidth: "180",
						fixed: false,
						filters: this.$staticData.zsbcategoryes,
						filterList: [],
					},
					{
						label: "是否启用",
						prop: "status",
						minWidth: "120",
						fixed: false,
					},
					{
						label: "是否内置菜",
						prop: "buildIn",
						minWidth: "120",
						fixed: false,
						filters: [
							{
								text: "推荐菜",
								value: "推荐菜",
							},
							{
								text: "内置菜",
								value: "内置菜",
							},
						],
						filterList: [],
					},
					{
						label: "收藏次数",
						prop: "collectTimes",
						minWidth: "120",
						fixed: false,
						sortable: true,
					},
					{
						label: "烹饪次数",
						prop: "cookTimes",
						minWidth: "120",
						fixed: false,
						sortable: true,
					},
					{
						label: "是否有图",
						prop: "imageName",
						minWidth: "90",
						fixed: false,
						filters: [
							{
								text: "有",
								value: true,
							},
							{
								text: "无",
								value: false,
							},
						],
						filterList: [],
					},
					{
						label: "创建时间",
						prop: "createTime",
						minWidth: "160",
						fixed: false,
						sortable: true,
					},
					{
						label: "更新时间",
						prop: "updateTime",
						minWidth: "160",
						fixed: false,
						sortable: true,
					},
				],
				pagination: {
					currentPage: 1, // 当前页码
					total: 0, //总页数
					pageSize: 20, //每页数据条数
					pageSizes: [20, 50, 100, 200], //每页数据条数集合
					handleSizeChange: this.handleSizeChange, //切换每页多少条
					handleCurrentChange: this.handleCurrentChange, //切换当前页码
				},
			},
			tableData5: [],
			// 非内置菜配置
			tableSearch: {
				isExport: false,
				clearable: 0,
				exportName: "菜谱",
				btn: [
					{
						name: "新增",
						clickInfo:
							this.$store.state.oldStore.authThree.indexOf(
								"e21"
							) != -1
								? this.addRow
								: 0,
					},
				],
				funClick: this.getMenu,
				seChang: this.cleanClick,
				cleanClick: this.cleanClick,
				input: [
					{
						pla: "菜谱名/关键字",
						width: "108",
						value: "",
					},
					{
						pla: "菜谱ID",
						width: "68",
						value: "",
					},
				],
				picker: {
					value: "",
					startPlaceholder: "更新开始日期",
					endPlaceholder: "更新结束日期",
				},
				select: [
					{
						pla: "设备型号",
						width: "68",
						value: "",
						options: this.$store.state.oldStore.deviceModelFilters,
					},
				],
				selectArry: [], //表格选中数据集合
			},
			tableHeader: {
				tableStatus: false,
				filters: this.filters,
				filtersList: [],
				expand: {
					loading: false,
					change: this.expandChange,
					del: this.expandDel, //
					up: this.expandUp, //
					fileSave: this.expandSave,
					fileImport: this.menuChildImport,
				},
				sortMethod: this.sortMethod,
				handleSelectionChange: this.handleSelectionChange, //选中表格数据方法
				isSelection: [false, "55"], //是否显示序列号
				tableHeight: "calc(100% - 86px)",
				comHeight: "calc(100% - 10px)",
				oper: {
					//操作栏
					label: "操作",
					prop: "oper",
					minWidth: "290",
					fixed: "right",
					oper: [
						{
							name: "查看",
							clickFun: this.seeDetails,
						},
						{
							name: "编辑",
							clickFun:
								this.$store.state.oldStore.authThree.indexOf(
									"e22"
								) != -1
									? this.update
									: 0,
						},
						{
							name: "删除",
							clickFun:
								this.$store.state.oldStore.authThree.indexOf(
									"e20"
								) != -1
									? this.deleteParentMenu
									: 0,
						},
						{
							name: "新增子菜谱",
							clickFun: this.addMenu,
						},
						{
							name: "导入子菜谱",
							clickFun: this.importMenu,
						},
					],
				},
				switch:
					this.$store.state.oldStore.authThree.indexOf("e24") != -1
						? this.switch
						: 0,
				data: [
					//表格头数据绑定
					{
						label: "菜谱ID",
						prop: "menuId",
						minWidth: "120",
						fixed: true,
						sortable: true,
					},
					{
						label: "菜谱名称",
						prop: "name",
						minWidth: "150",
						fixed: false,
					},
					// { label:'产品型号', prop:'deviceModel', minWidth:'120',fixed:false,
					// filters:this.$store.state.oldStore.deviceModelFilters},
					{
						label: "美食家",
						prop: "cuisineV2",
						minWidth: "120",
						fixed: false,
						filters: this.$store.state.oldStore.cuisines,
						filterList: [],
					},
					{
						label: "食材分类",
						prop: "categoryV2",
						minWidth: "120",
						fixed: false,
						filters: this.$store.state.oldStore.categorys,
						filterList: [],
					},
					{
						label: "特色分类",
						prop: "style",
						minWidth: "120",
						fixed: false,
						filters: this.$store.state.oldStore.styles,
						filterList: [],
					},
					{
						label: "收藏次数",
						prop: "collectTimes",
						minWidth: "120",
						fixed: false,
						sortable: true,
					},
					{
						label: "烹饪次数",
						prop: "cookTimes",
						minWidth: "120",
						fixed: false,
						sortable: true,
					},
					{
						label: "是否启用",
						prop: "status",
						minWidth: "120",
						fixed: false,
					},
					{
						label: "是否内置菜",
						prop: "buildIn",
						minWidth: "120",
						fixed: false,
						filters: [
							{
								text: "推荐菜",
								value: "推荐菜",
							},
							{
								text: "内置菜",
								value: "内置菜",
							},
						],
						filterList: [],
					},
					{
						label: "是否有图",
						prop: "imageName",
						minWidth: "90",
						fixed: false,
						filters: [
							{
								text: "有",
								value: true,
							},
							{
								text: "无",
								value: false,
							},
						],
						filterList: [],
					},
					{
						label: "创建时间",
						prop: "createTime",
						minWidth: "160",
						fixed: false,
						sortable: true,
					},
					{
						label: "更新时间",
						prop: "updateTime",
						minWidth: "160",
						fixed: false,
						sortable: true,
					},
				],
				pagination: {
					currentPage: 1, // 当前页码
					total: 0, //总页数
					pageSize: 20, //每页数据条数
					pageSizes: [20, 50, 100, 200], //每页数据条数集合
					handleSizeChange: this.handleSizeChange, //切换每页多少条
					handleCurrentChange: this.handleCurrentChange, //切换当前页码
				},
			},
			tableData: [],
			tableStutas: true,
			data: [],
			defaultProps: {
				children: "children",
				label: "label",
			},
			menus: {
				menuId: "",
				nameKeyWord: "", //菜谱名/关键字
				updateStartTime: "", //更新开始时间
				updateEndTime: "", //更新结束时间
				deviceModel: "", //设备型号
				flavor: "", //口味特色
				category: "", //食材类别
				cuisine: "", //美食家
				imageName: "", //是否有图筛选
				recommend: "", //是否推荐菜谱
				buildIn: "", //是否内置菜谱
				sortName: "",
				sortOrder: "",
				pageNumber: 1, //分页页数
				pageSize: 20, //分页每页数量
			},
			parentData: "",
		};
	},
	mounted() {
		this.getMenu();
		this.$http
			.selectMenuModel({
				classify: 1,
			})
			.then((res) => {
				if (res.data.success) {
					this.$store.commit("add_menuModel", res.data.datas);
				}
			});
	},
	methods: {
		// 新增子菜谱
		addMenu(index, row) {
			this.$router.push({
				name: "新增子菜谱",
				params: {
					parentMenu: {
						id: row.id,
					},
					language: row.language,
					name: row.name,
					menuId: row.menuId,
					deviceModel: row.deviceModel,
					appointment: row.appointment,
					appImageName: row.appImageName,
					imageName: row.imageName,
					importData: false,
				},
			});
		},
		//  导入菜谱
		importMenu(index, row) {
			this.importFlag = "add";
			this.parentData = row;
			this.$refs.filElem.dispatchEvent(new MouseEvent("click"));
		},
		menuChildImport: function (row) {
			this.importFlag = "edit";
			this.parentData = row;
			this.$refs.filElem.dispatchEvent(new MouseEvent("click"));
		},
		getFile() {
			const file = document.getElementById("files").files[0];
			if (file.type != "application/json") {
				this.$message({
					type: "warning",
					message: "菜谱格式不正确，无法导入！",
				});
				this.$refs.filElem.value = null;
			} else {
				const fileMd5 = file.name.split("_")[1].split(".")[0];
				const reader = new FileReader();
				reader.readAsText(file);
				const _this = this;
				let data;
				reader.onload = function (e) {
					// this.result为读取到的json字符串，需转成json对象
					if (md5(e.target.result) == fileMd5) {
						data = JSON.parse(e.target.result);
						if (_this.importFlag === "add") {
							// 导入子菜谱，新增
							_this.$router.push({
								name: "新增子菜谱",
								params: {
									up: true,
									parent: _this.parentData,
									importData: data,
									id: _this.parentData.id,
								},
							});
						} else {
							// 导入子菜谱，编辑
							_this.$router.push({
								name: "编辑子菜谱",
								params: {
									importData: data,
									id: _this.parentData.id,
								},
							});
						}
						_this.$refs.filElem.value = null;
					} else {
						_this.$message({
							type: "warning",
							message: "菜谱格式不正确，无法导入！",
						});
						_this.$refs.filElem.value = null;
					}
				};
			}
		},
		// 切换表格
		handleSwitchTab(tab, event) {
			this.$store.commit("del_menus", true);
			this.menus.menuId = "";
			this.menus.nameKeyWord = "";
			this.menus.updateStartTime = "";
			this.menus.updateEndTime = "";
			this.menus.deviceModel = "";
			this.menus.flavor = "";
			this.menus.category = "";
			this.menus.cuisine = "";
			this.menus.imageName = "";
			this.menus.recommend = "";
			this.menus.buildIn = "";
			this.menus.sortName = "";
			this.menus.sortOrder = "";
			this.menus.pageNumber = 1;
			this.menus.pageSize = 20;
			this.getMenu();
		},
		deleteRow(index, row) {
			if (
				(row.menuId == "9001" ||
					row.menuId == "9002" ||
					row.menuId == "9003" ||
					row.menuId == "9004" ||
					row.menuId == "9005" ||
					row.menuId == "9006" ||
					row.menuId == "9007" ||
					row.menuId == "9008" ||
					row.menuId == "9009") &&
				(row.deviceModel == "A4" || row.deviceModel == "CF3")
			) {
				this.$message.warning("快捷菜谱不可删除！");
				return false;
			}
			if (row.buildIn) {
				this.$message.warning("内置菜谱不可删除！");
				return false;
			}
			let ajax = this.$http.deleteMenu;
			if (this.activeName === "1") {
				ajax = this.$http.deleteMenu5;
			}
			this.$confirm(
				"删除此菜谱后，用户APP将无法搜索到该菜谱，已下载到设备本地的菜谱无法删除",
				"确认删除此菜谱吗？",
				{
					confirmButtonText: "删除",
					cancelButtonText: "取消",
					confirmButtonClass: "el-button--danger",
					type: "warning",
				}
			).then(() => {
				var that = this;
				ajax([row.id]).then((res) => {
					if (res.data.success) {
						that.getMenu();
					}
				});
			});
		},
		deleteParentMenu(index, row) {
			if (
				(row.menuId == "9001" ||
					row.menuId == "9002" ||
					row.menuId == "9003" ||
					row.menuId == "9004" ||
					row.menuId == "9005" ||
					row.menuId == "9006" ||
					row.menuId == "9007" ||
					row.menuId == "9008" ||
					row.menuId == "9009") &&
				(row.deviceModel == "A4" || row.deviceModel == "CF3")
			) {
				this.$message.warning("快捷菜谱不可删除！");
				return false;
			}
			if (row.buildIn) {
				this.$message.warning("内置菜谱不可删除！");
				return false;
			}
			this.$confirm(
				"删除此菜谱后，用户APP将无法搜索到该菜谱，已下载到设备本地的菜谱无法删除",
				"确认删除此菜谱吗？",
				{
					confirmButtonText: "删除",
					cancelButtonText: "取消",
					confirmButtonClass: "el-button--danger",
					type: "warning",
				}
			).then(() => {
				var that = this;
				this.$http.deleteParentMenu(row.id).then((res) => {
					if (res.data.success) {
						that.getMenu();
					}
				});
			});
		},
		enable() {
			let ajax = this.$http.enableOrNotMenu,
				list = this.tableSearch.selectArry;
			if (this.activeName === "1") {
				if (this.tableSearch5.selectArry.length <= 0) {
					return false;
				}
				ajax = this.$http.enableOrNotMenu5;
				list = this.tableSearch5.selectArry;
			} else {
				if (this.tableSearch.selectArry.length <= 0) {
					return false;
				}
			}
			this.$confirm(
				"启用后，用户可以搜索到并下载所选菜谱",
				"确认启用所选菜谱吗？",
				{
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					confirmButtonClass: "el-button--danger",
					type: "warning",
				}
			)
				.then(() => {
					var ifk = true,
						arr = [];
					list.forEach((item) => {
						arr.push(item.id);
					});
					if (ifk) {
						ajax(arr, true).then((res) => {
							if (res.data.success) {
								this.$message({
									iconClass: "iconcorrect",
									customClass: "meg-succ",
									message: "启用成功",
								});
								this.getMenu();
							}
						});
					}
				})
				.catch(() => {
					var that = this;
				});
		},
		unenable() {
			let ajax = this.$http.enableOrNotMenu,
				list = this.tableSearch.selectArry;
			if (this.activeName === "1") {
				if (this.tableSearch5.selectArry.length <= 0) {
					return false;
				}
				ajax = this.$http.enableOrNotMenu5;
				list = this.tableSearch5.selectArry;
			} else {
				if (this.tableSearch.selectArry.length <= 0) {
					return false;
				}
			}
			this.$confirm(
				"停用后，用户将无法搜索到所选菜谱，此操作不会影响到已下载到设备本地的菜谱",
				"确认停用所选菜谱吗？",
				{
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					confirmButtonClass: "el-button--danger",
					type: "warning",
				}
			)
				.then(() => {
					var ifk = true,
						arr = [];
					list.forEach((item) => {
						arr.push(item.id);
						if (
							(item.menuId == "9001" ||
								item.menuId == "9002" ||
								item.menuId == "9003" ||
								item.menuId == "9004" ||
								item.menuId == "9005" ||
								item.menuId == "9006" ||
								item.menuId == "9007" ||
								item.menuId == "9008" ||
								item.menuId == "9009") &&
							(item.deviceModel == "A4" ||
								item.deviceModel == "CF3")
						) {
							this.$message.warning("快捷菜谱不可操作！");
							ifk = false;
						}
						// if(item.buildIn){
						//     this.$message.warning('内置菜谱不可操作！')
						//     rifk = false;
						// }
					});
					if (ifk) {
						ajax(arr, false).then((res) => {
							if (res.data.success) {
								this.$message({
									iconClass: "iconcorrect",
									customClass: "meg-succ",
									message: "停用成功",
								});
								this.getMenu();
							}
						});
					}
				})
				.catch(() => {
					var that = this;
				});
		},
		// 删除菜谱
		delete() {
			let ajax = this.$http.deleteMenu,
				list = this.tableSearch.selectArry;
			if (this.activeName === "1") {
				if (this.tableSearch5.selectArry.length <= 0) {
					return false;
				}
				ajax = this.$http.deleteMenu5;
				list = this.tableSearch5.selectArry;
			} else {
				if (this.tableSearch.selectArry.length <= 0) {
					return false;
				}
			}
			this.$confirm(
				"删除菜谱后，用户APP将无法搜索到该菜谱，已下载到设备本地的菜谱无法删除",
				"确认删除此菜谱吗？",
				{
					confirmButtonText: "删除",
					cancelButtonText: "取消",
					confirmButtonClass: "el-button--danger",
					type: "warning",
				}
			).then(() => {
				var arr = [];
				var ifk = true;
				list.forEach((item) => {
					arr.push(item.id);
					if (
						(item.menuId == "9001" ||
							item.menuId == "9002" ||
							item.menuId == "9003" ||
							item.menuId == "9004" ||
							item.menuId == "9005" ||
							item.menuId == "9006" ||
							item.menuId == "9007" ||
							item.menuId == "9008" ||
							item.menuId == "9009") &&
						(item.deviceModel == "A4" || item.deviceModel == "CF3")
					) {
						this.$message.warning("快捷菜谱不可删除！");
						ifk = false;
					}
					if (item.buildIn) {
						this.$message.warning("内置菜谱不可删除！");
						rifk = false;
					}
				});
				if (ifk) {
					ajax(arr).then((res) => {
						if (res.data.success) {
							this.getMenu();
						}
					});
				}
			});
		},
		expandChange(row, expandedRows) {
			if (row.expand == 0) {
				this.$http
					.menus({
						parentMenuId: row.id,
					})
					.then((res) => {
						if (res.data.success) {
							// this.tableData[0].expand = res.data.datas
							this.tableData.forEach((i, x) => {
								if (i.id == row.id) {
									i.expand = res.data.datas;
								}
							});
						}
					});
			}
		},
		expandDel(row) {
			if (
				(row.menuId == "9001" ||
					row.menuId == "9002" ||
					row.menuId == "9003" ||
					row.menuId == "9004" ||
					row.menuId == "9005" ||
					row.menuId == "9006" ||
					row.menuId == "9007" ||
					row.menuId == "9008" ||
					row.menuId == "9009") &&
				(row.deviceModel == "A4" || row.deviceModel == "CF3")
			) {
				this.$message.warning("快捷菜谱不可删除！");
				return false;
			}
			if (row.buildIn) {
				this.$message.warning("内置菜谱不可删除！");
				return false;
			}
			this.$confirm(
				"删除此菜谱后，用户APP将无法搜索到该菜谱，已下载到设备本地的菜谱无法删除",
				"确认删除此菜谱吗？",
				{
					confirmButtonText: "删除",
					cancelButtonText: "取消",
					confirmButtonClass: "el-button--danger",
					type: "warning",
				}
			).then(() => {
				var that = this;
				this.$http.deleteMenu(row.id).then((res) => {
					if (res.data.success) {
						that.getMenu();
					}
				});
			});
		},
		expandUp(row) {
			this.$router.push({
				name: "编辑子菜谱",
				params: {
					id: row.id,
				},
			});
		},
		expandSave(row) {
			//导出为json
			// 将json转换成字符串
			let name = row.parentMenu.name;
			const data = JSON.stringify(row);
			const blob = new Blob([data], {
				type: "",
			});
			FileSaver.saveAs(blob, name + "_" + md5(data) + ".json");
		},
		getMenu() {
			if (this.$store.state.oldStore.menus) {
				this.menus = Object.assign(
					{},
					this.$store.state.oldStore.menus
				);
				this.activeName = this.menus.activeName;
				let filtersName = [
						"flavor",
						"category",
						"cuisine",
						"imageName",
					],
					changeList = [];
				//遍历出不为空的筛选条件
				filtersName.forEach((item) => {
					if (this.menus[item] != "") {
						changeList.push(item);
					}
				});
				//判断是否筛选内置菜或者推荐菜
				let recommend = false,
					buildIn = false;
				if (this.menus.recommend == true) {
					recommend = true;
				}
				if (this.menus.buildIn == true) {
					buildIn = true;
				}
				//根据键名赋值对应的筛选数组
				this.tableHeader.data.forEach((item) => {
					if (buildIn) {
						if (item.prop == "buildIn") {
							item.filterList.push("内置菜");
						}
					}
					if (recommend) {
						if (item.prop == "buildIn") {
							item.filterList.push("推荐菜");
						}
					}
					if (changeList.indexOf(item.prop) != -1) {
						item.filterList.push(this.menus[item.prop]);
					}
				});
			} else {
				if (this.activeName === "1" || this.activeName === "2") {
					if (
						this.tableSearch5.picker.value &&
						this.tableSearch5.picker.value.length > 0
					) {
						this.menus.updateStartTime = this.$filters.dateFilter(
							this.tableSearch5.picker.value[0],
							""
						);
						this.menus.updateEndTime = this.$filters.dateFilter(
							this.tableSearch5.picker.value[1],
							""
						);
					} else {
						this.tableSearch5.picker.value = this.menus.updateStartTime =
							"";
						this.menus.updateEndTime = "";
					}
					this.menus.menuId = this.tableSearch5.input[1].value;
					this.menus.nameKeyWord = this.tableSearch5.input[0].value;
					this.menus.pageNumber = this.tableHeader5.pagination.currentPage;
					this.menus.pageSize = this.tableHeader5.pagination.pageSize;
				} else if (this.activeName === "0") {
					if (
						this.tableSearch.picker.value &&
						this.tableSearch.picker.value.length > 0
					) {
						this.menus.updateStartTime = this.$filters.dateFilter(
							this.tableSearch.picker.value[0],
							""
						);
						this.menus.updateEndTime = this.$filters.dateFilter(
							this.tableSearch.picker.value[1],
							""
						);
					} else {
						this.tableSearch.picker.value = this.menus.updateStartTime =
							"";
						this.menus.updateEndTime = "";
					}
					this.menus.menuId = this.tableSearch.input[1].value;
					this.menus.nameKeyWord = this.tableSearch.input[0].value;
					this.menus.pageNumber = this.tableHeader.pagination.currentPage;
					this.menus.pageSize = this.tableHeader.pagination.pageSize;
				}
			}
			//当从编辑页面返回时
			if (
				this.menus.deviceModel != "" &&
				this.tableSearch.select[0].value == ""
			) {
				this.tableSearch.select[0].value = this.menus.deviceModel;
			}
			//当刷新页面时或第一次进入页面
			if (
				this.menus.deviceModel == "" &&
				this.tableSearch.select[0].value == ""
			) {
				this.tableSearch.select[0].value = this.$store.state.oldStore.deviceModelFilters[1].value;
			}
			//当改变选择框值时
			this.menus.deviceModel = this.tableSearch.select[0].value;
			let ajax = this.$http.parentMenus;
			// 根据当前显示列表修改设备
			this.menus.deviceModel =
				this.activeName === "0"
					? "CF7"
					: this.activeName === "1"
					? "CF5"
					: "CF5S";
			// 根据当前显示列表修改请求接口
			if (this.activeName === "1" || this.activeName === "2") {
				ajax = this.$http.menus5;
			}
			ajax(this.menus).then((res) => {
				//分为联网菜谱和单机菜谱两类
				if (this.activeName === "1" || this.activeName === "2") {
					this.tableData5 = res.data.rows;
					this.tableHeader5.pagination.total = res.data.total;
				} else if (this.activeName === "0") {
					this.tableData = res.data.rows;
					this.tableHeader.pagination.total = res.data.total;
					this.tableData.forEach((i, x) => {
						this.$set(i, "expand", []);
					});
				}
				if (this.$store.state.oldStore.menus) {
					if (this.activeName === "1" || this.activeName === "2") {
						this.tableHeader5.pagination.currentPage = this.menus.pageNumber;
						this.tableHeader5.pagination.pageSize = this.menus.pageSize;
						this.tableSearch5.input[0].value = this.menus.nameKeyWord;
						this.menus.menuId = this.tableSearch5.input[1].value = this.menus.menuId;
					} else if (this.activeName === "0") {
						this.tableHeader.pagination.currentPage = this.menus.pageNumber;
						this.tableHeader.pagination.pageSize = this.menus.pageSize;
						this.tableSearch.input[0].value = this.menus.nameKeyWord;
						this.menus.menuId = this.tableSearch.input[1].value = this.menus.menuId;
					}
					this.$store.commit("del_menus", true);
				}
				if (res.data.total > 0 && res.data.rows.length == 0) {
					if (this.activeName === "1" || this.activeName === "2") {
						this.tableHeader5.pagination.currentPage = 1;
					} else if (this.activeName === "0") {
						this.tableHeader.pagination.currentPage = 1;
					}
					this.getMenu();
				}
				this.$nextTick(() => {
					if (this.activeName === "1" || this.activeName === "2") {
						this.tableHeader5.tableStatus = true;
					} else if (this.activeName === "0") {
						this.tableHeader.tableStatus = true;
					}
				});
			});
		},
		switch(val, row) {
			if (!row.existChildMenu && !val) {
				this.$message({
					type: "warning",
					message: "当前无子菜谱，无法启用！",
				});
				return false;
			}
			var msg = "启用后，用户可以搜索到并下载所选菜谱",
				tishi = "确认启用菜谱吗？";
			if (val) {
				msg =
					"停用后，用户将无法搜索到所选菜谱，此操作不会影响到已下载到设备本地的菜谱";
				tishi = "确认停用菜谱吗？";
			}
			let ajax = this.$http.enableOrNotMenu;
			if (this.activeName === "1") {
				ajax = this.$http.enableOrNotMenu5;
			}
			this.$confirm(msg, tishi, {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				confirmButtonClass: "el-button--danger",
				type: "warning",
			})
				.then(() => {
					var ifk = true;
					if (
						(row.menuId == "9001" ||
							row.menuId == "9002" ||
							row.menuId == "9003" ||
							row.menuId == "9004" ||
							row.menuId == "9005" ||
							row.menuId == "9006" ||
							row.menuId == "9007" ||
							row.menuId == "9008" ||
							row.menuId == "9009") &&
						(row.deviceModel == "A4" || row.deviceModel == "CF3")
					) {
						this.$message.warning("快捷菜谱不可编辑！");
						ifk = false;
						return false;
					}
					// if(row.buildIn){
					//     this.$message.warning('内置菜谱不可编辑！');
					//     ifk = false;
					//     return false;
					// }
					if (ifk || !val) {
						ajax([row.id], !val).then((res) => {
							if (res.data.success) {
								this.$message({
									iconClass: "iconcorrect",
									customClass: "meg-succ",
									message: (val ? "停" : "启") + "用成功",
								});
								this.getMenu();
							}
						});
					}
				})
				.catch(() => {
					var that = this;
				});
		},
		update(index, row) {
			if (
				(row.menuId == "9001" ||
					row.menuId == "9002" ||
					row.menuId == "9003" ||
					row.menuId == "9004" ||
					row.menuId == "9005" ||
					row.menuId == "9006" ||
					row.menuId == "9007" ||
					row.menuId == "9008" ||
					row.menuId == "9009") &&
				(row.deviceModel == "A4" || row.deviceModel == "CF3")
			) {
				this.$message.warning("快捷菜谱不可编辑！");
				return false;
			}
			// if(row.buildIn){
			//     this.$message.warning('内置菜谱不可编辑！');
			//     return false;
			// }
			if (this.activeName === "1") {
				this.$router.push({
					name: "编辑菜谱(CF5)",
					params: {
						id: row.id,
					},
				});
			} else if (this.activeName === "2") {
				this.$router.push({
					name: "新增菜谱(CF5s)",
					params: {
						id: row.id,
					},
				});
			} else {
				this.$router.push({
					name: "编辑菜谱",
					params: {
						id: row.id,
					},
				});
			}
		},
		seeDetails(index, row) {
			if (this.activeName === "1") {
				window.open(
					this.$store.state.oldStore.href +
						"/files/menu5.html?id=" +
						row.id
				);
			} else {
				window.open(
					this.$store.state.oldStore.href +
						"/files/newMenu/newMenu.html?id=" +
						row.id
				);
			}
		},
		handleSelectionChange(val) {
			if (this.activeName === "1") {
				this.tableSearch5.selectArry = val;
			} else {
				this.tableSearch.selectArry = val;
			}
		},
		handleSizeChange(val) {
			if (this.activeName === "1") {
				this.tableHeader5.pagination.pageSize = val;
			} else {
				this.tableHeader.pagination.pageSize = val;
			}
			this.getMenu();
		},
		handleCurrentChange(val) {
			if (this.activeName === "1") {
				this.tableHeader5.pagination.currentPage = val;
			} else {
				this.tableHeader.pagination.currentPage = val;
			}
			this.getMenu();
		},
		cleanClick() {
			if (this.activeName === "1") {
				this.tableData5 = [];
				this.tableHeader5.pagination.currentPage = 1;
				this.tableSearch5.picker.value = "";
				this.tableSearch5.input[0].value = "";
				this.tableSearch5.input[1].value = "";
				this.tableHeader5.data.forEach((item) => {
					if (item.hasOwnProperty("filterList")) {
						item.filterList = [];
					}
				});
			} else {
				this.tableData = [];
				this.tableHeader.pagination.currentPage = 1;
				this.tableSearch.picker.value = "";
				this.tableSearch.input[0].value = "";
				this.tableSearch.input[1].value = "";
				this.tableHeader.data.forEach((item) => {
					if (item.hasOwnProperty("filterList")) {
						item.filterList = [];
					}
				});
			}
			this.menus.flavor = "";
			this.menus.category = "";
			this.menus.cuisine = "";
			this.menus.categoryV2 = "";
			this.menus.cuisineV2 = "";
			this.menus.flavor1 = "";
			this.menus.category1 = "";
			this.menus.cuisine1 = "";
			this.menus.style = "";
			this.tableStutas = false;
			this.$store.commit("del_menus", true); //清空菜谱筛选信息
			this.tableStutas = true;
			this.$refs.child.clear();
			this.getMenu();
		},
		// 新增菜谱
		addRow() {
			if (this.activeName === "0") {
				this.$router.push({
					name: "新增菜谱",
				});
			} else {
				this.$router.push({
					name: "新增菜谱(CF5)",
				});
			}
		},
		sortMethod(param) {
			this.menus.sortName = param.prop;
			if (param.order == "ascending") {
				this.menus.sortOrder = true;
			} else if (param.order == "descending") {
				this.menus.sortOrder = false;
			} else {
				this.menus.sortOrder = "";
				this.menus.sortName = "";
			}
			this.getMenu();
		},
		//筛选列
		filters(filters) {
			var name;
			for (var x in filters) {
				name = x;
			}
			if (name == "buildIn") {
				this.menus["buildIn"] = "";
				this.menus["recommend"] = "";
				if (filters[name][0] == "推荐菜") {
					this.menus["recommend"] = true;
				} else if (filters[name][0] == "内置菜") {
					this.menus["buildIn"] = true;
				}
			} else {
				this.menus[name] =
					filters[name][0] != undefined ? filters[name][0] : "";
			}
			this.getMenu();
		},
	},
	destroyed() {
		this.menus.activeName = this.activeName;
		this.$store.commit("save_menus", this.menus);
	},
};
</script>

<style lang="less">
#menuList {
	width: 100%;
	height: 100%;
	float: left;
	background: #fff;
	box-sizing: border-box;
	-webkit-box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
	box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
	border-radius: 4px;
	#addRole {
		> .el-dialog {
			height: 100%;
			float: right;
			margin-bottom: 0;
			> .el-dialog__footer {
				position: absolute;
				bottom: 0;
				right: 0;
			}
		}
	}
	.target {
		display: none;
	}

	.el-pagination.is-background .el-pager li:not(.disabled).active {
		background-color: #f02b54;
	}
	.el-tabs__nav-wrap {
		padding-left: 12px;
	}
	.el-tabs__active-bar {
		background-color: #f02b54;
	}
	.el-tabs__item.is-active {
		color: #2c3e50;
		font-weight: bold;
		font-size: 15px;
	}
	.el-tabs__content {
		height: 100%;
	}
}
</style>
