<template>
	<div class="layout">
		<Layout class="layout-main">
			<!-- 侧边导航栏 -->
			<Sider
				v-show="showSider"
				class="layout-sider"
				collapsible
				ref="side"
				hide-trigger
				:collapsed-width="0"
			>
				<img
					class="logoHome"
					src="../../assets/login/logoHome.png"
					alt=""
				/>
				<Menu
					accordion
					v-if="!collapsed"
					:open-names="open_menu"
					:active-name="active_menu"
					theme="dark"
					width="auto"
				>
					<template v-for="(item, num) in menu">
						<Submenu :name="item.name" :key="num">
							<template slot="title">
								<Icon :type="item.icon" />
								<span>{{ item.title }}</span>
							</template>
							<MenuItem
								v-for="(itemChild, index) in item.child"
								:key="index"
								:name="itemChild.name"
								:to="itemChild.path"
								>{{ itemChild.title }}</MenuItem
							>
						</Submenu>
					</template>
				</Menu>
			</Sider>
			<Layout :class="layoutClass">
				<!-- 头部 -->
				<Header
					class="layout-header"
					:class="{ leftToZore: isLeftClass }"
				>
					<Layout>
						<Content class="layout-header-right">
							<!-- 顶部操作栏 -->
							<div class="layout-header-top clearfloat">
								<Icon
									class="headerIcon"
									v-show="menu.length > 0"
									@click.native="collapsedSider"
									:class="rotateIcon"
									:style="collapsedStyle"
									type="md-menu"
									size="30"
								></Icon>
								<Dropdown
									class="myMenu"
									trigger="click"
									style="margin-left: 7px"
									@on-click="handleChangeModel"
								>
									<a
										href="javascript:void(0)"
										class="mySelectMenu"
									>
										{{
											model == "manageSystem"
												? "管理中心"
												: model == "dataSystem"
												? "数据中心"
												: "产测系统"
										}}
									</a>
									<DropdownMenu slot="list">
										<DropdownItem
											v-for="(item, index) in permission"
											:key="index"
											:name="item.name"
											>{{ item.title }}</DropdownItem
										>
									</DropdownMenu>
								</Dropdown>
								<Dropdown
									class="right Dropdown"
									placement="bottom-end"
									trigger="click"
									@on-click="handleDropdown"
								>
									<strong class="user">
										<Avatar
											style="background-color: #55b387"
											icon="md-person"
											size="small"
										></Avatar>
										{{ userName }}
										<Icon type="ios-arrow-down"></Icon>
									</strong>
									<DropdownMenu class="list" slot="list">
										<DropdownItem
											v-for="item in dropdown"
											:key="item.label"
											:name="item.name"
										>
											<span>{{ item.label }}</span>
										</DropdownItem>
									</DropdownMenu>
								</Dropdown>
								<div class="right layout-header-date">
									{{ newDate() }}
								</div>
							</div>
						</Content>
					</Layout>
				</Header>
				<!-- 内容 -->
				<Content class="layout_content">
					<Breadcrumb class="Breadcrumb left">
						<BreadcrumbItem>{{ parentName }}</BreadcrumbItem>
						<BreadcrumbItem>{{ breadcrumb }}</BreadcrumbItem>
					</Breadcrumb>
					<div
						v-if="showSwitch == 1"
						class="right"
						style="margin-top: 5px"
					>
						<span style="margin-right: 3px">自动受理：</span>
						<i-Switch size="large">
							<span slot="open">ON</span>
							<span slot="close">OFF</span>
						</i-Switch>
					</div>
					<div class="clearfloat"></div>
					<router-view></router-view>
					<userCenter ref="userCenter"></userCenter>
				</Content>
				<!-- 尾部 -->
				<div class="layout_footer">
					@2019 hadlinks.com 海大物联研发中心团队提供技术支持
				</div>
			</Layout>
		</Layout>
		<Spin fix class="syslayout_spin" v-if="homeLoading"></Spin>
	</div>
</template>
<script>
import userCenter from "@/components/userCenter";
export default {
	name: "syslayout",
	data() {
		return {
			timer: null,
			collapsed: false,
			homeLoading: false,
			collapsedStyle: {
				color: "#000",
				marginTop: "10px",
				marginLeft: "20px",
			},

			dropdown: [
				{
					label: "修改密码",
					name: "userCenter",
					path: "/personal",
				},
				{
					label: "退出",
					name: "logout",
					path: "/login",
				},
			],
			layoutClass: "openLayout",
			showSider: true,
			isLeftClass: false,
		};
	},
	components: {
		userCenter,
	},
	created() {
		if (this.$store.state.user.model == "manageSystem") {
			this.showSider = true;
			this.isLeftClass = false;
			this.layoutClass = "openLayout";
		} else {
			this.showSider = false;
			this.isLeftClass = true;
			this.layoutClass = "closeLayout";
		}
	},
	computed: {
		showSwitch() {
			return this.$store.state.user.showSwitch;
		},
		// 菜单列表
		menu() {
			return this.$store.state.user.menu;
		},
		// 展开菜单
		open_menu() {
			let menu = [];
			menu.push(this.$store.state.user.active_menu.active_module);
			return menu;
		},
		// 点击菜单
		active_menu() {
			return this.$store.state.user.active_menu.active_name;
		},
		// 用户名
		userName() {
			return this.$store.state.user.userName;
		},
		// 所处模块
		model() {
			return this.$store.state.user.model;
		},
		permission() {
			return this.$store.state.user.permission;
		},
		// 控制侧边栏缩进按钮
		rotateIcon() {
			return [
				["menu-icon", "left", "left-icon"],
				!this.showSider ? ["rotate-icon", "left", "left-icon"] : "",
			];
		},
		breadcrumb() {
			return this.$route.meta.breadcrumb;
		},
		parentName() {
			return this.$route.meta.parentName;
		},
	},
	methods: {
		// 路由跳转
		handleChangeModel(modelName) {
			this.homeLoading = true;
			for (var i = 0; i < this.permission.length; i++) {
				if (this.permission[i].name === modelName) {
					if (
						this.permission[i].child &&
						this.permission[i].child.length > 0
					) {
						this.layoutClass = "openLayout";
						this.showSider = true;
						this.isLeftClass = false;
						this.$router.push({
							path: this.permission[i].child[0].child[0].path,
						});
					} else {
						this.layoutClass = "closeLayout";
						this.showSider = false;
						this.isLeftClass = true;
						this.$refs.side.toggleCollapse();
						if (modelName == "qcSystem") {
							this.$router.push({
								path: "/qcHome",
							});
						} else {
							this.$router.push({
								path: "/",
							});
						}
					}
				}
			}
			let that = this;
			let timerLoading = setTimeout(function () {
				that.homeLoading = false;
				clearTimeout(timerLoading);
			}, 1000);
		},
		// 处理下拉框
		handleDropdown(name) {
			switch (name) {
				case "userCenter":
					// 修改密码
					this.$refs.userCenter.handleShow(true);
					break;
				default:
					// 退出系统
					this.$Modal.confirm({
						title: "警告",
						content: "确认退出系统?",
						okText: "确认",
						cancelText: "取消",
						onOk: () => {
							this.$store.dispatch("handleLogout"); // 重置菜单
						},
					});
			}
		},
		//返回最新时间
		newDate() {
			let date = new Date(),
				year = date.getFullYear(),
				month =
					Number(date.getMonth() + 1) < 10
						? "0" + Number(date.getMonth() + 1)
						: Number(date.getMonth() + 1),
				day =
					Number(date.getDate()) < 10
						? "0" + Number(date.getDate())
						: Number(date.getDate());
			return year + "-" + month + "-" + day;
		},
		// 控制菜单展开
		collapsedSider() {
			let that = this;
			if (this.collapsed) {
				this.collapsed = setTimeout(function () {
					that.collapsed = !that.collapsed;
					that.layoutClass = "openLayout";
					that.showSider = true;
					that.isLeftClass = false;
				}, 150);
			} else {
				that.collapsed = !that.collapsed;
				that.layoutClass = "closeLayout";
				that.showSider = false;
				that.isLeftClass = true;
			}
			this.$refs.side.toggleCollapse();
		},
	},
};
</script>
<style scoped>
.syslayout_spin {
	z-index: 98;
}

.ivu-layout-sider {
	position: fixed;
	top: 0px;
	left: 0px;
	height: 100%;
	z-index: 99;
	background-color: #192639 !important;
}

.ivu-menu-dark {
	background-color: #192639 !important;
	font-size: 14px;
	font-weight: 700;
}

.openLayout {
	margin-left: 200px;
}

.closeLayout {
	margin-left: 0;
}

.layout {
	background: #f5f7f9;
	position: relative;
	border-radius: 4px;
	overflow: hidden;
	min-height: 100vh;
	min-width: 1200px;
}

.layout-main {
	position: relative;
	min-height: 100vh;
}

.layout-header-left {
	color: #fff;
	font-size: 30px;
	font-weight: 700;
	text-align: center;
}

.layout-header {
	position: fixed;
	top: 0;
	left: 200px;
	right: 0;
	margin: 0;
	padding: 0;
	height: 64px;
	z-index: 1;
}

.layout-header.leftToZore {
	left: 0;
}

.layout-header .ivu-layout {
	height: 100%;
}

.layout-header-right {
	display: inline-block;
	background-color: #ecedf1;
	/* color: #fff; */
}

.layout-header-right.ivu-layout-content {
	overflow-y: hidden;
}

.layout-header-top {
	height: 100%;
}

.layout-header-top .headerIcon {
	margin-top: 17px !important;
}

.myMenu {
	margin-top: 23px;
	height: 18px;
}

.myMenu >>> .ivu-dropdown-rel {
	height: 100%;
	line-height: 1;
}

.mySelectMenu {
	font-family: PingFang-SC-Bold;
	font-size: 18px;
	font-weight: bold;
	color: #3f4656;
}

.menu-icon {
	transition: all 0.3s;
}

.rotate-icon {
	transform: rotate(-90deg);
}

.Breadcrumb {
	line-height: 32px;
}

.Breadcrumb span {
	font-size: 12px;
	color: #999;
}

.layout-header-date {
	margin-right: 20px;
	line-height: 64px;
}

.Dropdown {
	margin-right: 20px;
	line-height: 64px;
}

.logoHome {
	width: 180px;
	height: 90px;
}

.left-icon {
	margin-top: 20px !important;
}

.layout_content {
	margin-top: 64px;
	padding: 20px;
	padding-top: 0;
	min-height: 280px;
	background: #f4f4f7;
	height: 100%;
}

.layout_footer {
	height: 40px;
	line-height: 40px;
	font-size: 12px;
	color: #999;
	text-align: center;
	background-color: #ecedf1;
}
</style>
