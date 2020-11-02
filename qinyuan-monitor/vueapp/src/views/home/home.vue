<template>
	<div class="home">
		<el-container>
			<el-aside :width="width">
				<el-row>
					<el-col>
						<img v-if="!isCollapse" src="../../assets/image/menu_icon_logo.png" alt="logo">
						<img class="logo" v-else src="../../assets/image/menu_icon_logo_icon.png" alt="logo">
						<el-menu router :default-active="routePath" class="el-menu-vertical-demo" :collapse="isCollapse">
							<el-submenu v-for="(menu,index) in navList" v-if="menu.child.length>0" :key="index" :index="index.toString()">
								<template slot="title">
									<i class="iconfont" :class="menu.icon"></i>
									<span> {{menu.moduleName}}</span>
								</template>
								<el-menu-item v-for="(item,key) in menu.child" :key="key" :index="item.menuPath">
									<div class="empty">{{item.moduleName}}</div>
								</el-menu-item>
							</el-submenu>
						</el-menu>
					</el-col>
				</el-row>
			</el-aside>
			<el-container>
				<el-header>
					<ul class="header">
						<li class="collapse">
							<img v-if="isCollapse" src="../../assets/image/top_btn_menu.png" style="transform:rotate(180deg)" alt="收起"
							 @click="collapse(false)">
							<img v-else src="../../assets/image/top_btn_menu.png" alt="展开" @click="collapse(true)">
						</li>
						<li class="title">沁园滤芯产测工具</li>
						<li class="user">
							<img class="avatar" src="../../assets/image/top_icon_head.png" alt="avatar">
							<el-dropdown trigger="click">
								<span class="el-dropdown-link">
									{{username}}<i class="el-icon-arrow-down el-icon--right"></i>
								</span>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item @click.native="changePassword">修改密码</el-dropdown-item>
									<el-dropdown-item @click.native="exit">退出</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</li>
					</ul>
				</el-header>
				<el-main>
					<router-view></router-view>
				</el-main>
			</el-container>
		</el-container>
		<el-dialog title="修改密码" width="30%" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
			<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm">
				<el-form-item prop="pass">
					<el-input type="password" placeholder="新密码" v-model.trim="ruleForm.pass" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item prop="checkPass">
					<el-input type="password" placeholder="确认密码" v-model.trim="ruleForm.checkPass" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
					<el-button @click="resetForm('ruleForm')">重置</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<el-dialog title="用户信息" width="30%" :visible.sync="dialogUserVisible">
			<ul class="userInfo">
				<li>用户名：{{userInfo.userName}}</li>
				<li>角色名：{{userInfo.roleName}}</li>
				<li>联系方式：{{userInfo.phone}}</li>
				<li>创建时间：{{userInfo.createTime}}</li>
			</ul>
		</el-dialog>
	</div>
</template>

<script>
	import menuList from "../../assets/js/menu.js"
	import md5 from 'js-md5';
	export default {
		data() {
			var validatePass = (rule, value, callback) => {
				if (value ==='') {			
					callback(new Error('请输入密码'));
				} else {
					if (this.ruleForm.checkPass !== '') {
						this.$refs.ruleForm.validateField('checkPass');
					}
					callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if (value ==='') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.ruleForm.pass) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				ruleForm: {
					pass: '',
					checkPass: '',
					age: ''
				},
				routePath: this.$route.path,
				userInfo: {
					userName: "测试",
					roleName: "管理员",
					phone: "15868411714",
					createTime: "2020-04-17 13:13:45"
				},
				username: this.$cookies.get('username'),
				rules: {
					pass: [{
						validator: validatePass,
						trigger: 'blur'
					}],
					checkPass: [{
						validator: validatePass2,
						trigger: 'blur'
					}]
				},
				dialogUserVisible: false,
				dialogFormVisible: false,
				isCollapse: false,
				width: "240px",
				permission: [],
				navList: [],
			}
		},
		created() {
			this.$store.commit('updateTime');
			if (localStorage.getItem("permission") == "root") {
				this.getuserTree();
			} else {
				const data = localStorage.getItem("permission");
				this.getNavList(data);
			}
		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let api = this.$Api.manage_updatePassword;
						this.$Axios.post(api, {
							password:this.CalcuMD5(this.ruleForm.pass),
						}).then((res) => {
							if (res.success) {
								this.$confirm('修改成功，退出登录？')
									.then(_ => {
										this.$router.push("/");
										this.$cookies.remove("token");
										localStorage.clear("permission");
									})
									.catch(_ => {});
							} else {
								this.$message({
									message: res.message,
									type: 'warning'
								});
							}
							this.getOrderDetail();
							this.getcheckTotal();
							this.getCheckRecordPageList();
						}).catch((res) => {});
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			CalcuMD5(pwd) {
				 pwd = md5(pwd);
				pwd=pwd.toUpperCase();
				return pwd;
			},
			collapse(val) {
				this.width = val ? "64px" : "240px";
				this.isCollapse = val;
			},
			searchUser() {
				this.dialogUserVisible = true;
			},
			changePassword() {
				this.dialogFormVisible = true;
				this.$nextTick(() => {
					this.$refs["ruleForm"].resetFields();
				})		
			},
			getuserTree() {
				let api = this.$Api.manage_tree;
				this.$Ax.get(api, {
					params: {
						timestamp: this.$store.state.axiosTime,
					}
				}).then((res) => {
					if (res.success) {
						this.navList = res.data;
						for (let j = 0; j < this.navList.length; j++) {
							this.navList[j].child.sort((a, b) => {
								return a.menuSort - b.menuSort
							})
						}
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				}).catch((res) => {});
			},
			getNavList(treeDate) {
				let permissions = menuList;
				for (let i = 0; i < permissions.length; i++) {
					permissions[i].child = [];
				}
				JSON.parse(treeDate).forEach((item, index) => {
					if (item.moduleId == "taskOrder" || item.moduleId == "produceRecord") {
						permissions[0].child.push(item)
					}
					if (item.moduleId == "startCheck") {
						permissions[1].child.push(item)
					} 
					if (item.moduleId == "factoryManage" || item.moduleId == "accountManage" || item.moduleId == "productManage" || item.moduleId ==
						"roleManage" || item.moduleId == "logRecord" || item.moduleId == "machineConfig") {
						permissions[2].child.push(item)
					}
									
				})
					this.navList = permissions;
			},
			exit() {
				this.$confirm('确定要退出该系统吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$router.push("/");
					this.$cookies.remove("token");
					localStorage.clear("permission");
				}).catch(() => {})
			}
		}
	}
</script>

<style lang="scss">
	.home {
		width: 100%;
		height: 100%;

		.el-header,
		.el-footer {
			background-color: #fff;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

			.header {
				width: 100%;
				height: 100%;
				padding: 0px;

				li {
					list-style: none;
					float: left;

					img {
						cursor: pointer;
					}
				}

				.title {
					font-size: 16px;
					color: #333333;
					letter-spacing: 0;
					padding: 0px 20px;
					font-weight: bold;
				}

				.user {
					float: right;
					cursor: pointer;
					line-height: 35px;

					.avatar {
						float: left;
						padding-right: 10px;
					}
				}
			}
		}

		.el-aside {
			background-color: #fff;
			color: #333;
			text-align: left;
			box-shadow: 2px 0 12px 0 rgba(0, 0, 0, 0.05);

			.logo {
				display: block;
				padding: 15px;
			}

			.empty {
				display: block;
				width: 100%;
				height: 100%;
				text-decoration: none;
				padding-left: 20px;
				font-size: 12px;
				letter-spacing: 0;
			}

			.is-active.el-menu-item {
				background-color: #F7F9FC;
			}

			.is-active {

				.el-submenu__title,
				.iconfont {
					color: #1F9AD6;
				}
			}



		}

		.el-menu {
			border: none;

			.el-menu-item {
				a {
					color: #333;
					text-decoration: none;
				}

				.router-link-active {
					color: #1F9AD6;
					text-decoration: none;
				}
			}
		}

		.el-main {
			background-color: #F7F9FC;
			color: #333;
		}

		.el-container {
			height: 100%;
		}

		.el-container:nth-child(5) .el-aside,
		.el-container:nth-child(6) .el-aside {
			line-height: 260px;
		}

		.el-container:nth-child(7) .el-aside {
			line-height: 320px;
		}

		.userInfo {
			li {
				list-style: none;
				line-height: 40px;
			}
		}
	}
</style>
