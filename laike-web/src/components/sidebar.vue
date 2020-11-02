
<template>
	<div id="com-sidebar">
		<!-- <i class="iconmenu" @click="isCollapseChang"></i> -->
		<el-menu
			ref="menu"
			id="side-menu"
			:default-active="$route.path"
			router
			unique-opened
			class="el-menu-vertical-demo"
			@open="handleOpen"
			@close="handleClose"
			@select="handleSelect"
			background-color="#393F4B"
			text-color="#fff"
			active-text-color="#fff"
			:collapse="isCollapse"
		>
			<img
				:style="isCollapse ? 'visibility: hidden;' : ''"
				class="side-title"
				src="../assets/imges/logo.png"
			/>
			<el-menu-item index="/">
				<i class="iconhomepage"></i>
				<span slot="title">首页</span>
			</el-menu-item>
			<el-menu-item
				index="/map"
				v-if="$store.state.oldStore.authOne.indexOf('b') != -1"
			>
				<i class="iconmap"></i>
				<span slot="title">地图</span>
			</el-menu-item>
			<el-submenu
				v-for="menu in menuTree"
				:key="menu.name"
				:index="menu.index"
			>
				<template slot="title">
					<i :class="menu.icon"></i>
					<span>{{ menu.name }}</span>
				</template>
				<el-menu-item-group v-if="menu.child">
					<el-menu-item
						v-for="(child, index) in menu.child"
						:key="index"
						:index="child.path"
						>{{ child.name }}</el-menu-item
					>
				</el-menu-item-group>
			</el-submenu>
		</el-menu>
	</div>
</template>

<script>
import menuTree from "../assets/js/menuTree";
export default {
	props: ["isCollapse"],
	inject: ["reload"],
	data() {
		return {};
	},
	computed: {
		module() {
			return this.$store.state.oldStore.module;
		},
		menuTree() {
			return menuTree[this.$store.state.oldStore.module];
		},
	},
	methods: {
		handleOpen(key, keyPath) {
			// console.log(key, keyPath);
		},
		handleClose(key, keyPath) {
			// console.log(key, keyPath);
		},
		handleSelect(index, indexPath) {
			this.reload();
		},
	},
};
</script>
<style lang="less">
.el-menu-vertical-demo:not(.el-menu--collapse) {
	width: 200px;
}
#com-sidebar {
	background-color: rgb(57, 63, 75);
	overflow-y: auto;
	height: 100%;
	position: relative;
	overflow-x: hidden;
	float: left;
	z-index: 1;
	.el-menu-item-group__title {
		padding: 0;
	}
	> i {
		line-height: 64px;
		background: #fff;
		position: absolute;
		right: -44px;
		font-size: 24px;
		cursor: pointer;
		transition: 0.3s all;
		float: left;
		&:hover {
			font-size: 25px;
			color: cornflowerblue;
		}
	}
	#side-menu {
		height: 100%;
		min-height: 820px;
		i {
			margin-right: 7px;
			width: 24px;
			text-align: center;
			font-size: 20px;
			vertical-align: middle;
			text-indent: 0;
		}
		.side-title {
			margin: 21px 0;
		}
	}
	.el-submenu.is-active .el-submenu__title i {
		color: #fff;
	}
}
</style>
