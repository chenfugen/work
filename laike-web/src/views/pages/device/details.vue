<template>
	<div id="device-details">
		<div id="details-headComp">
			<div>
				<div class="img">
					<img :src="$store.state.oldStore.imgSrc+ruleForm.imageName+'&token='+$store.state.oldStore.token" />
					<ul>
						<li style="display: block;width: 100%">
							<span :class="ruleForm.online?'criac':'criac no'">&nbsp;</span>
							<p>{{this.ruleForm.online?'在':'离'}}线</p>
						</li>
					</ul>
				</div>
				<ul>
					<li>
						<p class="num">{{ruleForm.downloadMenuNumber}}</p>
						<p>已下载菜谱(个)</p>
					</li>
					<li>
						<p class="num">{{ruleForm.collectMenuNumber}}</p>
						<p>收藏菜谱(个)</p>
					</li>
					<li>
						<p class="num">{{ruleForm.cookingMenuNumber}}</p>
						<p>烹饪记录(个)</p>
					</li>
				</ul>
				<div class="survey">
					<p class="title">设备概况</p>
					<p
						v-for="item in pData"
						:key="item.name"
					>{{item.name!='安卓屏app版本'||pData[1].value=='CF7'?item.name+'：'+item.value:'DTU版本号：'+item.value}}</p>
				</div>
			</div>
		</div>
		<div id="details-conter" v-if="$store.state.oldStore.authFour.indexOf('c113') != -1">
			<el-tabs v-model.trim="activeName" @tab-click="handleClick" style="height:calc(100% - 10px)">
				<el-tab-pane label="关联用户" name="0" style="height:100%">
					<!-- <TableSearch :tableData="tableData" :tableSearch="tableSearch" :exportHead="tableHeader.data"></TableSearch> -->
					<el-table
						:data="tableData"
						style="width: 100%"
						height="calc(100% - 86px)"
						header-cell-class-name="cheTabHreaClass"
						cell-class-name="cheTabConClass"
					>
						<el-table-column type="index" width="50" label="序号" align="center" fixed="left"></el-table-column>
						<el-table-column label="用户名" min-width="120" :fixed="true" :show-overflow-tooltip="true">
							<template slot-scope="scope">{{tableData.length>0?scope.row['user'].userName:''}}</template>
						</el-table-column>
						<el-table-column label="用户类别" min-width="120" :fixed="true" :show-overflow-tooltip="true">
							<template slot-scope="scope">{{tableData.length>0?scope.row['share']?'从用户':'主用户':''}}</template>
						</el-table-column>
						<el-table-column label="最后登录时间" min-width="160" :fixed="false" :show-overflow-tooltip="true">
							<template
								slot-scope="scope"
							>{{tableData.length>0?$filters.dateFilter(scope.row['user'].lastLoginTime,''):""}}</template>
						</el-table-column>
						<el-table-column label="最后登录IP" min-width="180" :fixed="false" :show-overflow-tooltip="true">
							<template slot-scope="scope">{{tableData.length>0?scope.row['user'].lastLoginIp:''}}</template>
						</el-table-column>
						<el-table-column label="操作" min-width="180" :fixed="false" :show-overflow-tooltip="true">
							<template slot-scope="scope">
								<el-button
									@click.native.prevent="1?seeRow(scope.$index, scope.row):$message.warning('无此操作权限！')"
									type="text"
									size="small"
								>
									查看
									<el-divider direction="vertical"></el-divider>
								</el-button>
								<el-button
									style="margin-left:0"
									@click.native.prevent="$store.state.oldStore.authFour.indexOf('c119') != -1?deleteRow(scope.$index, scope.row):$message.warning('无此操作权限！')"
									type="text"
									size="small"
								>删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<el-tab-pane label="设备日志" name="1" style="height:100%">
					<TableSearch
						:tableData="tableData1"
						:tableSearch="tableSearch1"
						:exportHead="tableHeader1.data"
					></TableSearch>
					<comTable :tableData="tableData1" :tableHeader="tableHeader1"></comTable>
				</el-tab-pane>
			</el-tabs>
		</div>

		<el-dialog :close-on-click-modal="false" title="用户详情" :visible.sync="seeBox" width="550px">
			<div id="dialogDetails">
				<img
					:src="seeForm.imageName?$store.state.oldStore.imgSrc+seeForm.imageName+'&token='+$store.state.oldStore.token:require('@/assets/imges/user.png')"
				/>
				<p :title="seeForm.userName">用户名:{{seeForm.userName}}</p>
				<p :title="seeForm.nickName">昵称:{{seeForm.nickName}}</p>
				<p>注册时间:{{$filters.dateFilter(seeForm.createTime,'')}}</p>
				<p>APP类型:{{seeForm.appType==1?'Android':(seeForm.appType==2?'IOS':'其他')}}</p>
				<p>APP版本:{{seeForm.appVersion}}</p>
				<p>最后登录时间:{{$filters.dateFilter(seeForm.lastLoginTime,'')}}</p>
				<p>最后登录IP:{{seeForm.lastLoginIp}}</p>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			activeName: "0",
			seeBox: false,
			// tableSearch:{
			//     isExport:false,
			//     exportName:'绑定用户',
			//     funClick:this.tabSearBtnClick,
			//     cleanClick:this.cleanClick,
			//     input:[
			//         { pla:'用户名',width:'128',value:''},
			//     ],
			//     select:[],
			//     picker:{
			//         value:'',
			//         startPlaceholder:'登录开始日期',
			//         endPlaceholder:'登录结束日期',
			//     },
			//     selectArry:[],//表格选中数据集合
			// },
			pagination: {
				currentPage: 1, // 当前页码
				total: 0, //总页数
				pageSize: 20, //每页数据条数
				pageSizes: [20, 50, 100, 200], //每页数据条数集合
				handleSizeChange: this.handleSizeChange, //切换每页多少条
				handleCurrentChange: this.handleCurrentChange, //切换当前页码
			},
			tableHeader: {
				tableStatus: false,
				sortMethod: function () {},
				filters: function () {},
				tableHeight: "calc(100% - 100px)",
				handleSelectionChange: this.handleSelectionChange, //选中表格数据方法
				isSelection: [false, "55"], //是否显示序列号
				oper: {
					//操作栏
					label: "操作",
					prop: "oper",
					minWidth: "120",
					fixed: "right",
					oper: [
						{
							name: "查看",
							clickFun: this.seeRow,
						},
						{
							name: "删除",
							clickFun:
								this.$store.state.oldStore.authFour.indexOf("c119") != -1
									? this.deleteRow
									: 0,
						},
					],
				},
				data: [
					//表格头数据绑定
					{
						label: "用户名",
						prop: "userName",
						minWidth: "120",
						fixed: true,
					},
					{
						label: "用户类别",
						prop: "share",
						minWidth: "120",
						fixed: true,
					},
					{
						label: "最后登录时间",
						prop: "lastLoginTime",
						minWidth: "180",
						fixed: false,
					},
					{
						label: "最后登录IP",
						prop: "lastLoginIp",
						minWidth: "120",
						fixed: false,
					},
				],
			},
			tableData: [],
			tableSearch1: {
				isExport: false,
				exportName: "",
				funClick: this.tabSearBtnClick1,
				cleanClick: this.cleanClick1,
				input: [],
				select: [],
				picker: {
					value: "",
					startPlaceholder: "操作开始时间",
					endPlaceholder: "操作结束时间",
				},
				selectArry: [], //表格选中数据集合
			},
			tableHeader1: {
				tableStatus: false,
				sortMethod: function () {},
				filters: function () {},
				tableHeight: "calc(100% - 86px)",
				comHeight: "calc(100% - 17px)",
				handleSelectionChange: this.handleSelectionChange, //选中表格数据方法
				isSelection: [false, "55"], //是否显示序列号
				oper: {
					//操作栏
					label: "操作",
					prop: "oper",
					minWidth: "120",
					fixed: "right",
					oper: [
						{
							name: "删除",
							clickFun:
								this.$store.state.oldStore.authFour.indexOf("c118") != -1
									? this.deleteRow1
									: 0,
						},
					],
				},
				data: [
					//表格头数据绑定
					{
						label: "操作人",
						prop: "operator",
						minWidth: "120",
						fixed: true,
					},
					{
						label: "操作内容",
						prop: "content",
						minWidth: "180",
						fixed: false,
					},
					{
						label: "操作时间",
						prop: "operateTime",
						minWidth: "160",
						fixed: false,
					},
				],
				pagination: {
					currentPage: 1, // 当前页码
					total: 0, //总页数
					pageSize: 20, //每页数据条数
					pageSizes: [20, 50, 100, 200], //每页数据条数集合
					handleSizeChange: this.handleSizeChange1, //切换每页多少条
					handleCurrentChange: this.handleCurrentChange1, //切换当前页码
				},
			},
			tableData1: [],
			pData: [
				{
					name: "产品类型",
					value: "",
				},
				{
					name: "产品型号",
					value: "",
				},
				{
					name: "MAC地址",
					value: "",
				},
				{
					name: "IP地址",
					value: "",
				},
				{
					name: "MCU固件版本",
					value: "",
				},
				{
					name: "安卓屏app版本",
					value: "",
				},
				{
					name: "信号强度值",
					value: "",
				},
				{
					name: "登记时间",
					value: "",
				},
				{
					name: "激活时间",
					value: "",
				},
				{
					name: "最近在线时间",
					value: "",
				},
			],
			seeForm: {
				appType: "",
				appVersion: "",
				blog: null,
				createTime: "",
				id: "",
				imageName: "",
				lastLoginIp: "",
				lastLoginTime: "",
				loginCount: "",
				nickName: "",
				note: null,
				osVersion: "",
				password: "",
				phoneModel: "",
				qq: null,
				sex: "",
				timestamp: "",
				updateTime: "",
				userName: "",
			},
			ruleForm: "",
			userForm: {
				userName: "", //用户名
				startLoginTime: "", //登录开始时间
				endLOginTime: "", //登录结束时间
				pageNumber: 1, //分页页数
				pageSize: 20, //分页每页数量
			},
			logForm: {
				mac: "",
				operateStartTime: "", //登录开始时间
				operateEndTime: "", //登录结束时间
				pageNumber: 1, //分页页数
				pageSize: 20, //分页每页数量
			},
		};
	},
	mounted() {
		document.getElementById("main").scrollTop = 0;
		if (this.$route.params.id) {
			this.userForm.mac = this.$route.params.id;
			this.logForm.mac = this.$route.params.id;
			this.$http.deviceDetails(this.$route.params.id).then((res) => {
				if (res.data.success) {
					this.userForm.id = res.data.device.id;
					this.logForm.id = res.data.device.id;
					this.$route.meta.time = this.$filters.dateFilter(
						res.data.device.updateTime,
						""
					);
					this.$store.commit("add_meta", {
						time: this.$filters.dateFilter(
							res.data.device.updateTime,
							""
						),
						name: res.data.device.deviceSN,
					});
					this.ruleForm = res.data.device;
					this.ruleForm.collectMenuNumber =
						res.data.collectMenuNumber;
					this.ruleForm.cookingMenuNumber =
						res.data.cookingMenuNumber;
					this.pData[0].value = res.data.device.deviceType
						? res.data.device.deviceType
						: "暂无";
					this.pData[1].value = res.data.device.deviceModel
						? res.data.device.deviceModel
						: "暂无";
					this.pData[2].value = res.data.device.mac
						? res.data.device.mac
						: "暂无";
					this.pData[3].value = res.data.device.ip
						? res.data.device.ip
						: "暂无";
					this.pData[4].value = res.data.device.mcuVersion
						? res.data.device.mcuVersion
						: "暂无";
					this.pData[5].value = res.data.device.dtuVersion
						? res.data.device.dtuVersion
						: "暂无";
					this.pData[6].value = res.data.device.wifiRSSI;
					this.pData[7].value = res.data.device.createTime
						? this.$filters.dateFilter(res.data.device.createTime)
						: "暂无";
					this.pData[8].value = res.data.device.activeTime
						? this.$filters.dateFilter(res.data.device.activeTime)
						: "暂无";
					this.pData[9].value = res.data.device.lastOnlineTime
						? this.$filters.dateFilter(
								res.data.device.lastOnlineTime
						  )
						: "暂无";
				}
				this.getDeviceUsers();
				this.getDeviceLogs();
			});
		} else {
			this.$router.push({
				name: "智能烹饪机",
			});
		}
	},
	methods: {
		handleClick(tab, event) {
			if (this.activeName == "0") {
				this.getDeviceUsers();
			} else {
				this.getDeviceLogs();
			}
		},
		seeRow(index, row) {
			this.seeForm = row.user;
			this.seeBox = true;
		},
		deleteRow(index, row) {
			this.$confirm(
				"确认删除此关联用户吗?",
				"提示",
				this.$filters.confirm()
			).then(() => {
				this.$http.deleteDeviceUser(row.id).then((res) => {
					if (res.data.success) {
						this.getDeviceUsers();
					}
				});
			});
		},
		deleteRow1(index, row) {
			this.$confirm(
				"确认删除此记录吗?",
				"提示",
				this.$filters.confirm()
			).then(() => {
				this.$http.deleteDeviceLog(row.id).then((res) => {
					if (res.data.success) {
						this.getDeviceLogs();
					}
				});
			});
		},
		handleSelectionChange(val) {
			this.tableSearch.selectArry = val;
		},
		handleSizeChange(val) {
			this.userForm.pageSize = this.pagination.pageSize = val;
			this.getDeviceUsers();
		},
		handleCurrentChange(val) {
			this.userForm.pageNumber = this.pagination.currentPage = val;
			this.getDeviceUsers();
		},
		handleSizeChange1(val) {
			this.logForm.pageSize = this.tableHeader1.pagination.pageSize = val;
			this.getDeviceLogs();
		},
		handleCurrentChange1(val) {
			this.logForm.pageNumber = this.tableHeader1.pagination.currentPage = val;
			this.getDeviceLogs();
		},
		tabSearBtnClick1() {
			this.getDeviceLogs();
		},
		cleanClick() {
			this.userForm.userName = this.tableSearch.input[0].value = "";
			this.tableSearch.picker.value = "";
			this.pagination.currentPage = 1;
			this.userForm.startLoginTime = "";
			this.userForm.endLOginTime = "";
			this.getDeviceUsers();
		},
		cleanClick1() {
			this.tableSearch1.picker.value = "";
			this.tableHeader1.pagination.currentPage = 1;
			this.logForm.pageNumber = 1;
			this.logForm.operateStartTime = "";
			this.logForm.operateEndTime = "";
			this.getDeviceLogs();
		},
		getDeviceUsers() {
			this.$http.deviceUsers(this.userForm).then((res) => {
				if (res.data.success) {
					this.tableData = res.data.rows;
					this.$nextTick(() => {
						this.tableHeader.tableStatus = true;
					});
					this.pagination.total = res.data.total;
					if (res.data.total > 0 && res.data.rows.length == 0) {
						this.pagination.currentPage = 1;
						this.userForm.pageNumber = 1;
						this.getDeviceUsers();
					}
				}
			});
		},
		getDeviceLogs() {
			if (this.tableSearch1.picker.value) {
				this.logForm.operateStartTime = this.$filters.dateFilter(
					this.tableSearch1.picker.value[0],
					""
				);
				this.logForm.operateEndTime = this.$filters.dateFilter(
					this.tableSearch1.picker.value[1],
					""
				);
			} else {
				this.logForm.operateStartTime = "";
				this.logForm.operateEndTime = "";
				this.tableSearch1.picker.value = "";
			}
			this.$http.deviceLogs(this.logForm).then((res) => {
				if (res.data.success) {
					this.tableData1 = res.data.rows;
					this.$nextTick(() => {
						this.tableHeader1.tableStatus = true;
					});
					this.tableHeader1.pagination.total = res.data.total;
					if (res.data.total > 0 && res.data.rows.length == 0) {
						this.tableHeader1.pagination.currentPage = 1;
						this.logForm.pageNumber = 1;
						this.getDeviceLogs();
					}
				}
			});
		},
	},
};
</script>

<style lang="less">
#device-details {
	width: 100%;
	.el-tabs__content {
		height: calc(100% - 50px);
	}
	#dialogDetails {
		width: 100%;
		height: 300px;
		> img {
			width: 165px;
			height: 150px;
			// border-radius: 50%;
			float: right;
			margin-right: 50px;
		}
		> p {
			float: right;
			height: 55px;
			line-height: 55px;
			width: 250px;
			text-indent: 20px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			&:nth-child(2),
			&:nth-child(3),
			&:nth-child(4) {
				margin-right: 35px;
			}
		}
	}
	#details-headComp {
		position: relative;
		padding-bottom: 390px;
		> div {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			.img {
				width: 370px;
				height: 100%;
				float: left;
				overflow: hidden;
				background: #fff;
				border-radius: 4px;
				box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
				img {
					width: 100%;
					height: 320px;
				}
				ul {
					list-style-type: none;
					padding: 0;
					margin: 0;
					height: 100px;
					display: -webkit-box;
					display: flex;
					width: 100%;
					li {
						-webkit-box-flex: 1;
						box-flex: 1;
						display: block;
						text-align: center;
						position: relative;
						span {
							height: 40px;
							display: inline-block;
							font-size: 18px;
							font-weight: 700;
							line-height: 40px;
							margin: 0;
							padding: 0;
							&.criac {
								height: 20px;
								width: 20px;
								margin: 10px auto;
								background: #60acfc;
								border-radius: 50%;
								&.no {
									background: rgb(225, 227, 231);
								}
							}
						}
						p {
							color: #cccccc;
						}
					}
				}
			}
			> ul {
				list-style-type: none;
				padding: 0;
				margin: 0;
				width: calc(100% - 394px);
				float: right;
				height: 100px;
				margin-bottom: 24px;
				li {
					width: calc((100% - 48px) / 3);
					height: 100%;
					background: #fff;
					border-radius: 4px;
					float: left;
					box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
					margin-left: 24px;
					background-image: url("../../../assets/imges/heart.png");
					background-repeat: no-repeat;
					background-position-x: 100%;
					background-position-y: 50%;
					overflow: hidden;
					&:first-child {
						margin: 0;
						background-image: url("../../../assets/imges/download.png");
					}
					&:last-child {
						background-image: url("../../../assets/imges/record.png");
					}
					p {
						color: #cccccc;
						text-align: left;
						margin-top: 12px;
						text-indent: 16px;
						&.num {
							margin-top: 22px;
							font-size: 18px;
							font-weight: 700;
							color: #2c3e50;
						}
					}
				}
			}
			.survey {
				width: calc(100% - 394px);
				height: calc(74% - 24px);
				float: right;
				background: #fff;
				border-radius: 4px;
				box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
				p {
					margin: 0;
					padding: 0;
					text-align: left;
					text-indent: 34px;
					width: 50%;
					height: 40px;
					float: left;
					overflow: hidden; //超出的文本隐藏
					text-overflow: ellipsis; //溢出用省略号显示
					white-space: nowrap; //溢出不换行
					&.title {
						font-weight: bold;
						margin-top: 16px;
						width: 100%;
						text-indent: 34px;
					}
				}
			}
		}
	}
	#details-conter {
		width: 100%;
		height: 496px;
		margin-top: 24px;
		background: #fff;
		border-radius: 4px;
		box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
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
	.seeBox {
		.see-center {
			width: 100%;
			height: auto;
		}
		p {
			display: inline-block;
			margin: 10px 0;
			width: 100%;
			font {
				width: calc(100% - 100px);
				display: block;
				float: left;
				&.title {
					width: 100px;
					text-align: right;
				}
			}
		}
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
