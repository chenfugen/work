<template>
<div id="main">
	<div id="login">
		<transition>
			<div class="login">
				<div class="logo-info">
					<img class="logo" src="../assets/logoLogin.png" alt="logo">
				</div>
				<Form ref="loginForm" :model="loginForm" :rules="rule" label-position="left" :label-width="0">
					<FormItem prop="userName">
						<Input v-model="loginForm.userName" placeholder='用户名'></Input>
					</FormItem>
					<FormItem prop="password">
						<Input v-model="loginForm.password" type="password" placeholder='密码'></Input>
					</FormItem>
					<FormItem>
						<Button @click='handleLogin()' type='primary' long>登录</Button>
					</FormItem>
				</Form>
			</div>
		</transition>
	</div>
</div>
</template>
<script>
import iView from 'iview'
import config from '@/config'
import menuList from '@/utils/menu'
import ax from '@/config/axios'
export default {
	name: 'Login',
	data: () => ({
		timer: null,
		imgLoading: false,
		loginForm: {
			userName: '',
			password: '',
			code: 'test',
		},
		imgApi: '',
		rule: {
			userName: {
				required: true,
				message: '用户名不能为空',
				trigger: 'blur'
			},
			password: {
				required: true,
				message: '密码不能为空',
				trigger: 'blur'
			},
		}
	}),
	methods: {
		handleLogin() {
			this.$refs['loginForm'].validate((valid) => {
				if (valid) {
					iView.LoadingBar.start();
					this.$Ax.post(this.$api.account_login, this.loginForm).then(res => {
						if (res.data.success) {
							sessionStorage.setItem('token', res.data.data.token)
							sessionStorage.setItem('userName', this.loginForm.userName)
							if (res.data.data.rolePermission == 'root') {
								sessionStorage.setItem('menu', JSON.stringify(menuList))
								this.$store.dispatch('handleMenu', menuList)
							} else {
								sessionStorage.setItem('menu', JSON.stringify(res.data.data.rolePermission))
								this.$store.dispatch('handleMenu', res.data.data.rolePermission)
							}
						}
						iView.LoadingBar.finish();
					}).catch(err => {
						console.log(err);
						iView.LoadingBar.finish();
					})
				}
			})
		},
	}
}
</script>
<style lang="postcss" scoped>
#login {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 360px;
  height: 350px;
  margin: -175px 0 0 -180px;
  padding: 36px;
  box-shadow: 0 0 100px rgba(0, 0, 0, 0.08);
  /* 过渡动画 */
  & .slideleft-enter-active, & .slideright-enter-active {
    transition: all 0.5s;
    transform: translateX(0);
  }
  & .slideleft-enter, & .slideright-enter {
    opacity: 0;
  }
  & .slideleft-leave-active, & .slideright-leave-active {
    transition: all 0.5s;
    opacity: 0;
  }
  & .slideleft-leave, & .slideright-leave {
    transform: translateX(0);
  }
  & .slideleft-enter, & .slideright-leave-active {
    transform: translateX(300px);
  }
  & .slideleft-leave-active, & .slideright-enter {
    transform: translateX(-300px);
  }
  /* end */
  & .settings {
    position: absolute;
    bottom: 16px;
  }
  & .login {
    position: absolute;
    width: 288px;
  }
  & .logo-info {
    /* height: 64px; */
    margin-bottom: 22px;
    text-align: center;
    & .logo {
      height: 64px;
      margin-right: 10px;
    }
    & .name {
      position: relative;
      display: inline-block;
      text-align: left;
      font-size: 18px;
      line-height: 20px;
    }
    & .sub {
      font-size: 12px;
    }
  }
  & .version {
    text-align: center;
    color: #888;
  }
}
.imgCode{
	position:absolute;
	top:4px;
	right:10px;
}
</style>
