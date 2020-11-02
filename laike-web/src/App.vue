<template>
	<!--  -->
	<div id="app">
		<div style="height: 100%" v-if="$route.meta.keepAlive">
			<headComp :isCollapseChang="isCollapseChang"></headComp>
			<div id="app-conter">
				<!-- header -->
				<!-- body -->
				<sidebar :isCollapse="isCollapse"></sidebar>
				<div id="bread">
					<!-- 路由名称 -->
					<font class="routerTitle" style="font-weight: bold">{{
						this.$route.name.indexOf("详情") != -1
							? ""
							: this.$route.name
					}}</font>
					<div
						style="float: left"
						v-if="$route.name.indexOf('详情') != -1"
					>
						{{ $store.state.oldStore.meta.name }} &nbsp;&nbsp;&nbsp;
						<i
							v-if="
								$route.path.indexOf('/planSurvey/details') != -1
							"
							:class="totalStatus ? 'iconqualified' : 'iconwrong'"
						></i
						>&nbsp;
						<font class="tow-name">{{
							$route.path.indexOf("/planSurvey/details") != -1
								? totalStatus
									? "合格"
									: "不合格"
								: "数据刷新时间 " + $store.state.oldStore.meta.time
						}}</font>
					</div>
					<div id="map-headComp" v-if="$route.name == '地图'">
						<p style="font-weight: normal" @click="showInfoOff">
							清除
						</p>
						<span class="tabSear-search" @click="showInfoOut">
							<i class="iconsearch"></i>
						</span>
						<el-input
							class="map-input"
							v-model="deviceMap.macSn"
							placeholder="MAC地址/SN号"
						></el-input>
						<el-select
							class="map-select"
							v-model.trim="deviceMap.online"
							clearable
							placeholder="在离线"
						>
							<el-option label="在线" :value="true"></el-option>
							<el-option label="离线" :value="false"></el-option>
						</el-select>
						<el-select
							class="map-select"
							v-model.trim="deviceMap.deviceModel"
							no-data-text="请先选择产品类型"
							clearable
							placeholder="产品型号"
						>
							<el-option
								v-for="(i, x) in $store.state.oldStore.types[
									deviceMap.deviceType
								]"
								:key="x"
								:label="i"
								:value="i"
							></el-option>
						</el-select>
						<el-select
							class="map-select"
							v-model.trim="deviceMap.deviceType"
							clearable
							placeholder="产品类型"
						>
							<el-option
								v-for="(i, x) in $store.state.oldStore.deviceTypes"
								:key="x"
								:label="i"
								:value="i"
							></el-option>
						</el-select>
						<el-cascader
							class="block"
							clearable
							v-model.trim="mapValue"
							placeholder="省/市/区"
							:options="ssq"
						></el-cascader>
					</div>
					<!-- 面包屑 -->
					<el-breadcrumb separator="/">
						<el-breadcrumb-item
							v-for="item in $route.meta.breadcrumbData"
							:key="item.name"
							:class="item.isActive ? 'active' : null"
							:to="item.path ? { path: item.path } : null"
							>{{ item.name }}</el-breadcrumb-item
						>
					</el-breadcrumb>
				</div>

				<div
					id="main"
					:style="
						'padding-left:24px;width:calc(100% - ' +
						(Lwidth + 44) +
						'px)'
					"
				>
					<router-view
						v-if="isRouterAlive"
						:ref="$route.name == '地图' ? 'map' : ''"
					></router-view>
				</div>
			</div>
			<div id="app-footer">
				<p :style="'padding-left:' + Lwidth + 'px'">
					©2019-{{ new Date().getFullYear() }} 莱克电气股份有限公司
				</p>
			</div>
		</div>
		<router-view v-if="!$route.meta.keepAlive"></router-view>
	</div>
</template>

<script>
import ssq from "./assets/js/citys";
import { standard } from "./assets/js/menuTree";
export default {
	name: "app",
	provide() {
		return {
			reload: this.reload,
			deviceMap: this.deviceMap,
		};
	},
	data() {
		return {
			totalStatus: true,
			isCollapse: false,
			metaTime: "",
			breadcrumbData: [],
			ssq: [],
			isRouterAlive: true,
			value: "",
			mapValue: [],
			deviceMap: {
				province: "", //省
				city: "", //市
				district: "", //区县
				deviceType: "", //设备类型
				deviceModel: "", //设备型号
				online: "", //是否在线
				macSn: "", //mac地址或者sn
			},
		};
	},
	computed: {
		Lwidth() {
			if (this.isCollapse) {
				return 65;
			} else {
				return 201;
			}
		},
	},
	created() {
		//在页面加载时读取sessionStorage里的状态信息并清空
		if (sessionStorage.getItem("store")) {
			this.$store.replaceState(
				Object.assign(
					{},
					this.$store.state,
					JSON.parse(sessionStorage.getItem("store"))
				)
			);
			sessionStorage.removeItem("store");
		}
		//在页面刷新时将vuex里的信息保存到sessionStorage里
		window.addEventListener("beforeunload", () => {
			sessionStorage.setItem("store", JSON.stringify(this.$store.state));
		});
		if (window.location.href.indexOf("/device/details") != -1) {
			this.selectDeviceModel(); //获取产品型号集合
			this.selectDeviceType(); //获取产品类型集合
			this.$store.commit("chg_riving", true);
			this.$store.commit(
				"add_token",
				JSON.parse(localStorage.getItem("userInfo"))
			);
		}
	},
	watch: {
		$route(to, from) {
			this.breadcrumbData = [];
			// 旧版本后台路由进行监听 --- 后期更正
			if (to.name.indexOf("标准化") <= 0) {
				if (
					this.$route.name != "菜谱详情" &&
					this.$route.name != "设备详情"
				) {
					if (!this.$store.state.oldStore.token) {
						sessionStorage.removeItem("store");
						this.$store.commit("del_token", 1);
						this.$router.push({ path: "/login" });
					} else {
						this.selectDeviceModel(); //获取产品型号集合
						this.selectDeviceType(); //获取产品类型集合
						this.$store.commit("chg_riving", true);
						this.$store.commit(
							"add_token",
							JSON.parse(localStorage.getItem("userInfo"))
						);
					}
				}
				if (this.$route.name == "厂测详情") {
					this.$http
						.factoryTest({ id: this.$route.params.id })
						.then((res) => {
							if (res.data.success) {
								this.totalStatus = res.data.data.totalStatus;
							}
						});
				}
			}
		},
	},
	mounted() {
		this.$http.selectDepartment().then((res) => {
			if (res.data) {
				this.selectDepartment = res.data.datas;
				this.$store.commit("add_departments", res.data.datas);
			}
		});
		this.$http.selectRole().then((res) => {
			if (res.data) {
				this.selectRole = res.data.datas;
				this.$store.commit("add_roles", res.data.datas);
			}
		});
		this.selectMenuModel();
		//为所有的失败提示按钮添加事件
		var that = this;
		this.ssq = ssq;
		document.addEventListener("click", function (event) {
			var target = event.target; //通过console.log(event)查看有target属性
			if (target.className.indexOf("meg-wrong") != -1) {
				that.$message.closeAll();
			}
			if (target.className.indexOf("map-more") != -1) {
				if (that.$store.state.oldStore.authThree.indexOf("c11") != -1) {
					that.$router.push({
						path:
							"/device/details/" + target.getAttribute("data-id"),
					});
				} else {
					that.$message.warning("无此操作权限！");
				}
			}
		});
		window.addEventListener(
			"hashchange",
			function (e) {
				var currentPath = window.location.hash.slice(1); // 获取输入的路由
				if (that.$route.path !== currentPath) {
					that.$router.push({ path: currentPath }); // 动态跳转
				}
			},
			false
		);
		// this.$store.commit('ls_href',window.location.href.split('#')[0])
	},
	methods: {
		reload() {
			this.isRouterAlive = false;
			this.$nextTick(() => {
				this.isRouterAlive = true;
			});
		},
		isCollapseChang() {
			this.isCollapse = !this.isCollapse;
		},
		showInfoOut() {
			this.deviceMap.province =
				this.mapValue && this.mapValue.length > 0
					? this.mapValue[0]
					: "";
			this.deviceMap.city =
				this.mapValue && this.mapValue.length > 1
					? this.mapValue[1]
					: "";
			this.deviceMap.district =
				this.mapValue && this.mapValue.length > 2
					? this.mapValue[2]
					: "";
			this.$refs.map.getDeviceMap();
		},
		showInfoOff() {
			this.deviceMap.province = this.mapValue = "";
			this.deviceMap.city = "";
			this.deviceMap.district = "";
			this.deviceMap.deviceType = "";
			this.deviceMap.deviceModel = "";
			this.deviceMap.online = "";
			this.deviceMap.macSn = "";
			this.$refs.map.getDeviceMap();
		},
		selectDeviceModel() {
			this.$http.selectDeviceModel().then((res) => {
				if (res.data && res.data.success) {
					this.$store.commit("add_deviceModels", res.data.rows);
				}
			});
		},
		selectDeviceType() {
			this.$http.selectDeviceType().then((res) => {
				if (res.data && res.data.success) {
					this.$store.commit("add_deviceTypes", res.data.rows);
				}
			});
		},
		selectMenuModel() {
			this.$http.selectMenuModel({ classify: 1 }).then((res) => {
				if (res.data && res.data.success) {
					this.$store.commit("add_menuModel", res.data.datas);
				}
			});
		},
	},
};
</script>

<style lang="less">
.imgReoo {
	.el-form-item__error {
		top: 10px;
	}
}
.el-tooltip__popper {
	max-width: 500px;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
	-webkit-appearance: none;
}

input[type="number"] {
	-moz-appearance: textfield;
}
.el-table-filter__list-item {
	white-space: nowrap;
}
.el-input__inner {
	font-size: 12px !important;
	color: #59626c !important;
	font-family: PingFangSC-Regular !important;
}
.el-table-filter__list {
	max-height: 216px;
	overflow: auto;
}
.el-header,
.el-footer {
	background-color: #b3c0d1;
	color: #333;
	text-align: center;
	line-height: 60px;
}
.cheTabHreaClass {
	background: #fafcff;
	font-size: 14px;
	color: #59626c;
	font-weight: 600;
}
.cheTabConClass {
	font-size: 14px;
	color: #59626c;
}
.el-aside {
	background-color: #d3dce6;
	color: #333;
	text-align: center;
	line-height: 200px;
}
.el-textarea .el-input__count {
	bottom: -5px;
}
.el-textarea__inner {
	max-height: fit-content;
}
.el-switch.is-disabled .el-switch__core,
.el-switch.is-disabled .el-switch__label {
	cursor: pointer !important;
}
body,
html,
#app,
#app-sidebar {
	margin: 0;
	padding: 0;
	height: 100%;
	background: #f2f4f9;
	font-family: PingFangSC-Medium;
	.el-dropdown-menu.el-popper {
		margin-top: -5px;
	}
	p {
		margin: 0;
		padding: 0;
	}
}
#app {
	font-family: "Avenir", Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	min-width: 1353px;
	color: #2c3e50;
	.el-dialog__header {
		border-bottom: 1px solid #cccccc;
	}
	.el-menu-item,
	.el-submenu__title {
		text-align: left;
		text-indent: 12px;
		height: 50px !important;
		line-height: 50px !important;
	}
	.el-menu-item,
	.el-submenu {
		// opacity: 0.5;
		color: #999999 !important;
		span {
			color: #999999 !important;
		}
	}
	.el-menu-item,
	.el-submenu {
		&.is-active {
			background-color: #4e5363 !important;
			// opacity: 1 !important;
			color: #fff !important;
			span {
				color: #fff !important;
			}
		}
	}
	#app-conter {
		transition: 0.3s all;
		height: calc(100% - 64px);
		#main {
			float: left;
			// width: calc(100% - 24px);
			height: calc(100% - 80px);
			overflow-x: auto;
		}
		#bread {
			height: 36px;
			line-height: 36px;
			text-align: left;
			font-size: 18px;
			color: #29313e;
			.tow-name {
				font-size: 14px;
				color: #59626c;
				font-weight: normal;
			}
			#map-headComp {
				height: 32px;
				width: 879px;
				line-height: 32px;
				float: right;
				margin: 15px 25px 0 0;
				p {
					font-size: 12px;
					color: #999999;
					line-height: 32px;
					margin-left: 12px;
					float: right;
					cursor: pointer;
					transition: 0.3s all;
					&:hover {
						color: #409eff;
					}
				}
				.el-cascader {
					height: 32px;
					line-height: 32px;
				}
				.block {
					height: 32px;
					width: 240px;
					float: right;
					.el-input__inner {
						height: 32px;
						line-height: 32px;
					}
					i {
						line-height: 32px;
					}
				}
				.map-btn {
					margin-left: 12px;
					float: right;
				}
				.map-select,
				.map-input {
					width: 108px;
					margin-left: 12px;
					float: right;
					.el-input__inner {
						height: 32px;
						line-height: 32px;
					}
					i {
						line-height: 32px;
					}
				}
				.map-input {
					width: 160px;
				}
			}
			.el-breadcrumb {
				float: right;
				margin: 11px 24px 0 0;
				.el-breadcrumb__inner {
					color: #999999;
					transition: 0.3s all;
					font-weight: normal;
				}
				.el-breadcrumb__inner.is-link {
					color: #999999;
					font-weight: normal;
					&:hover {
						color: #409eff;
					}
				}
				.el-breadcrumb__inner {
					color: #999999;
				}
				.active .el-breadcrumb__inner {
					color: #59626c;
					cursor: pointer;
					&:hover {
						color: #409eff;
					}
				}
			}
		}

		.routerTitle {
			margin-left: 24px;
		}
	}
	#app-footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		// width: 100%;
		background: #fff;
		text-align: center;
		box-shadow: 0 -3px 5px 0 rgba(0, 0, 0, 0.05);
		p {
			font-size: 12px;
			color: #999;
			letter-spacing: 0;
			line-height: 20px;
			padding: 6px 12px;
			transition: 0.3s all;
		}
	}
}
#nav {
	padding: 30px;
	a {
		font-weight: bold;
		color: #2c3e50;
		&.router-link-exact-active {
			color: #42b983;
		}
	}
}
.amap-logo {
	display: none !important;
}
.amap-copyright {
	opacity: 0;
}
.meg-succ {
	background-color: #fff !important;
	min-width: 152px !important;
	box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.15);
	border-radius: 4px;
	i {
		color: #5bc49f;
		font-size: 25px;
		margin-right: 12px;
	}
}
.megWrong {
	width: 350px;
	float: left;
	> .title {
		display: inline-block;
		padding-top: 7px;
		font-weight: bold;
		font-size: 16px;
		color: #59626c;
	}
	> .center {
		margin: 8px 0;
		display: inline-block;
	}
}
.meg-wrong {
	background-color: #fff !important;
	box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.15);
	border-radius: 4px;
	align-items: unset !important;
	i {
		color: #ff7c7c;
		font-size: 25px;
		margin-right: 12px;
	}
}
.iconwrong {
	color: #ff7c7c;
	font-weight: normal;
}
.iconqualified {
	color: #5bc49f;
	font-weight: normal;
}
.iconaddress {
	&.map {
		color: #60acfc;
		font-size: 20px;
	}
}
</style>
