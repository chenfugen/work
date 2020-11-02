<template>
	<div class="login">
		<div class="loginBox">
			<img class="logo" src="../../assets/image/login_icon_logo.png" alt="logo">
			<div v-if="isVerify" class="box">
				<p class="title">运营中心管理系统</p>
				<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm" @keyup.enter.native="submitForm('ruleForm')">
					<el-form-item prop="username">
						<el-input placeholder="账号" v-model.trim="ruleForm.username" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item prop="password">
						<el-input type="password" placeholder="密码" v-model.trim="ruleForm.password"  autocomplete="off"></el-input>
					</el-form-item>
					<!-- 	<el-form-item prop="code">
						<el-input placeholder="验证码" v-model.trim="ruleForm.code" style="width:150px"></el-input>
						<div class="code" @click="refreshCode">
							<Sidentify :identifyCode="identifyCode" class="codeBox"></Sidentify>
						</div>
					</el-form-item> -->
					<el-form-item>
						<el-button class="loginButton" type="primary" @click="submitForm('ruleForm')" >登录</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div v-else class="box">
				<p>短信验证</p>
				<el-form :model="smsForm" status-icon :rules="rules" ref="smsForm" class="demo-ruleForm" @keyup.enter.native="submitForm('smsForm')"  @submit.native.prevent>
				<el-form-item prop="smsCode">
					<el-input type="text" placeholder="验证码" v-model.trim="smsForm.smsCode"  autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button class="loginButton" type="primary" @click="submitForm('smsForm')" >验证登录</el-button>
				</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
	import Sidentify from "../../components/identify.vue"
	import md5 from 'js-md5';
	export default {
		data() {
			return {
				identifyCode:"4321",
				isVerify:true,
				ruleForm: {
					username: '',
					password: '',
				},
				smsForm: {
					smsCode: '',
				},
				rules: {
					username: [{
							required: true,
							message: '请输入账户名',
							trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}],
					smsCode: [{
						required: true,
						message: '请输入验证码',
						trigger: 'blur'
					}]
				}
			};
		},
		components: {
			Sidentify
		},
		created() {
			this.$store.commit('updateTime');
		},
		methods: {
			refreshCode() {
				this.identifyCode = 1234;
			},
			CalcuMD5(pwd) {
				 pwd = md5(pwd);
				pwd=pwd.toUpperCase();
				return pwd;
			},
			login(params,formName){
				let api = this.$Api.manage_login;
				this.$Ax.post(api,params).then((res) => {
					if (res.success) {
						this.$cookies.set('token', res.data.token);	
						this.$cookies.set('username', res.data.username);		
						if(res.data.permission=="root"){
							localStorage.setItem('permission',res.data.permission);
							localStorage.setItem('isShowActiveButton',true);	
							this.$router.push("/digitalStatistics");
						}else{
							localStorage.setItem('permission',JSON.stringify(res.data.permission));	
							res.data.permission.forEach((item,index)=>{
								if(item.menuPath!=undefined){
									 this.$router.push(item.menuPath);
								}
								if(item.moduleName=="设置激活/未激活"){
									localStorage.setItem('isShowActiveButton',true);	
								}
						 })								
						}								     
					}else {
						this.$message({
							message:res.message,
							type: 'warning'
						});
						if(res.message=="用户名密码错误"){
							this.isVerify=true;
							this.ruleForm={
								username: '',
								password: '',
							};
						}
						this.$refs[formName].resetFields();
					}
				})
			},
			submitForm(formName) {		
				let params = {};
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if(this.ruleForm.username=="root"){
							if(this.isVerify){
								this.isVerify=false;
								this.getCode();
							}else{
								params={
									username:this.ruleForm.username,
									password:this.CalcuMD5(this.ruleForm.password),
									timestamp:this.$store.state.axiosTime,
									smsCode:this.smsForm.smsCode,
								}
								this.login(params,formName)
							}							
						}else{
							params={
								username:this.ruleForm.username,
								password:this.CalcuMD5(this.ruleForm.password),
								timestamp:this.$store.state.axiosTime,
							}	
							this.login(params,formName)
						}						
					} else {
						return false;
					}
				});
			},
			getCode(){			
				this.$Ax.post(this.$Api.manage_superAdminVerify,{
					timestamp:this.$store.state.axiosTime,
					}).then((res) => {
					if (res.success) {
						this.$message({
							message:"验证码已发送",
							type: 'success'
						});			
					} else {
						this.$message({
							message:res.message,
							type: 'warning'
						});				
					}
				})
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			}
		}
	}
</script>

<style lang="scss">
	.login {
		width: 100%;
		height: 100%;
		background: url("../../assets/image/bg.jpg") no-repeat;
		background-size: 100% 100%;

		.loginBox {
			position: absolute;
			width: 460px;
			height: 500px;
			top: 50%;
			left: 50%;
			margin-left: -230px;
			margin-top: -280px;
			text-align: center;

			.logo {
				margin-bottom: 20px;
			}

			.box {
				background: white;
				width: 60%;
				padding: 20px 50px;
				margin: 0 auto;
				border-radius: 5px 5px;
				box-shadow: 0px 0px 2px 2px #eee;

				.title {
					letter-spacing: 2px;
					font-size: 20px;
					font-weight: bold;
					line-height: 40px;
				}

				.code {
					height: 40px;
					float: right;

					.codeBox {
						float: left;
					}
				}

				.loginButton {
					width: 100%;
				}
			}

			.demo-ruleForm {}
		}


	}
</style>
