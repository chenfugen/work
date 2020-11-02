<template>
<div id="sys-header">
	<Row>
		<Col :xs="0" :sm="0" :md="6">
		<div class="logo-info">
			<img class="logo" src="../../../assets/logo.png" alt="logo">
		</div>
		<!-- .logo-info -->
		</Col>
		<Col :xs="6" :sm="12" :md="0">
		<Poptip class="navigation" placement="right-start" v-model="visible">
			<Icon type="md-menu" size="32"></Icon>
			<Navigation slot="content" nav @on-click="handleClose"></Navigation>
		</Poptip>
		<!-- .navigation -->
		</Col>
		<Col :xs="18" :sm="12" :md="18">
		<div class="login-info">
			<Dropdown placement="bottom-end" trigger="click" @on-click="handleDropdown">
				<strong class="user">
					<Avatar style="background-color: #55b387" icon="md-person" size="small"></Avatar>
					{{ userName }}
				</strong>
				<DropdownMenu class="list" slot="list">
					<DropdownItem v-for="item in dropdown" :key="item.name" :name="item.name">
						<Icon :type="item.icon" size="16" style="margin-top: -2px;"></Icon> {{ item.label }}
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</div>
		<!-- .login-info -->
		</Col>
	</Row>
	<EditPassword ref="editPassword"></EditPassword>
	<!-- EditPassword -->
</div>
</template>
<script>
import {
	// mapActions,
	mapGetters
} from 'vuex'
import EditPassword from '@/views/common/pages/EditPassword'
import Navigation from '@/views/common/partials/Sidebar'
export default {
	name: 'SysHeader',
	components: {
		EditPassword,
		Navigation
	},
	data: () => ({
		// 导航可视状态
		visible: false,
		userName: '',
		// 下拉菜单元素数组
		dropdown: [{
			label: '修改密码',
			name: 'editPassword',
			icon: 'md-lock'
		}, {
			label: '登出',
			name: 'signout',
			icon: 'md-log-out'
		}]
	}),
	created() {
		this.userName = sessionStorage.getItem('userName')
	},
	methods: {
		// 关闭导航
		handleClose(state) {
			this.visible = state
		},
		// 下拉菜单项
		handleDropdown(name) {
			switch (name) {
				case 'editPassword':
					// 修改密码
					this.$refs[name].showModal()
					break
				default:
					// 退出系统
					this.$Modal.confirm({
						title: '警告',
						content: '确认退出系统?',
						okText: '确认',
						cancelText: '取消',
						onOk: () => {
							this.$store.commit('MENU_RESET') // 重置菜单
						}
					})
			}
		}
	},
}
</script>
<style lang="postcss">
#sys-header {
  color: #fff;
  background-color: #52626a;
  & .ivu-poptip-body {
    padding: 8px 0;
  }
  & .ivu-menu-vertical .ivu-menu-submenu-title {
    padding-right: 12px;
  }
  & .logo {
    float: left;
    width: 200px;
    height: 40px;
    margin: 10px 0px 0px 0px;
  }
  & .name {
    padding: 12px 0 6px;
    font-size: 18px;
    line-height: 20px;
  }
  & .sub {
    font-size: 12px;
  }
  & .navigation {
    margin-top: 12px;
    margin-left: 16px;
  }
  & .login-info {
    margin: 18px 16px;
    text-align: right;
    & .list {
      text-align: left;
    }
    & .user {
      display: block;
      cursor: pointer;
      color: #fff;
    }
  }
}
</style>
