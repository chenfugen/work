<template>
	<div id="com-headComp" class="clearfloat">
		<!-- <i class="iconmenu"></i> -->
		<i :class="isCollapseChang?'el-icon-s-unfold':'el-icon-s-fold'" @click="isCollapseChang"></i>
		<el-radio-group class="switchBtn left" v-model="projectModule" @change="handleChangeModule">
			<el-radio-button class="switchBtnIrem" label="oldMenu">定制化平台</el-radio-button>
			<el-radio-button class="switchBtnIrem" label="standard">标准化平台</el-radio-button>
		</el-radio-group>
		<el-dropdown trigger="click" id="headComp-dropdpwn">
			<span class="el-dropdown-link">
				<i class="iconuser"></i>
				{{user.userName}}
				<i class="iconarrow_down"></i>
			</span>
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item @click.native.prevent="seeRole">个人信息</el-dropdown-item>
				<el-dropdown-item @click.native.prevent="changePsdBox = true">修改密码</el-dropdown-item>
				<el-dropdown-item @click.native.prevent="logout">退出</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
		<div @click="handleGoFaultRecord" style="float: right;height: 100%;">
			<el-badge :value="$store.state.oldStore.msgNum" :max="999" class="item">
				<i class="iconmessage"></i>
			</el-badge>
		</div>
		<!-- 个人信息 -->
		<el-dialog
			:close-on-click-modal="false"
			title="个人信息"
			:visible.sync="headRoleBox"
			width="400px"
			class="headRole"
		>
			<div class="head-role-box">
				<p>
					<font>用户名：</font>
					{{user.userName}}
				</p>
				<p>
					<font>部门：</font>
					{{user.department}}
				</p>
				<p>
					<font>角色：</font>
					{{user.role}}
				</p>
			</div>
		</el-dialog>
		<!-- 修改密码 -->
		<el-dialog
			:close-on-click-modal="false"
			title="修改密码"
			:visible.sync="changePsdBox"
			class="headRole"
			width="500px"
			@close="close"
		>
			<el-form :model="psdForm" ref="psdForm">
				<el-form-item
					label="旧密码"
					label-width="90px"
					prop="oldPassword"
					:rules="[{required: true, message: '请填写旧密码', trigger: 'blur' }]"
				>
					<el-input type="password" v-model.trim="psdForm.oldPassword"></el-input>
				</el-form-item>
				<el-form-item
					label="新密码"
					label-width="90px"
					prop="newPassword"
					:rules="[{required: true, message: '请填写新密码', trigger: 'blur' }]"
				>
					<el-input type="password" show-password v-model.trim="psdForm.newPassword"></el-input>
				</el-form-item>
				<el-form-item
					label="确认新密码"
					label-width="90px"
					prop="agPsd"
					:rules="[{required: true, message: '请确认新密码', trigger: 'blur' },{validator: validatePass, trigger: 'blur' }]"
				>
					<el-input type="password" show-password v-model.trim="psdForm.agPsd"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="changePsdBox = false">取 消</el-button>
				<el-button type="danger" @click="submitForm('psdForm')">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	props: ["isCollapseChang"],
	data() {
		var validatePass = (rule, value, callback) => {
			if (value === "") {
				callback(new Error("请再次输入密码"));
			} else if (value !== this.psdForm.newPassword) {
				callback(new Error("两次输入密码不一致!"));
			} else {
				callback();
			}
		};
		return {
			headRoleBox: false,
			changePsdBox: false,
			projectModule: this.$store.state.oldStore.module,
			msgNum: "",
			psdForm: {
				oldPassword: "",
				newPassword: "",
				agPsd: "",
			},
		};
	},
	computed: {
		user() {
			return this.$store.state.oldStore.userInfo;
		},
	},
	methods: {
		handleChangeModule: function (res) {
			this.$router.push({
				name: "首页",
			});
			this.$store.commit("UPDATA_MODULE", res);
		},
		seeRole() {
			this.headRoleBox = true;
		},
		logout() {
			this.$http.logout().then((res) => {
				if (res.data.success) {
					this.$store.commit("del_token", 1);
				}
			});
		},
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.$http.password(this.psdForm).then((res) => {
						this.changePsdBox = false;
						if (res.data.success) {
							this.$message(this.$filters.succ("修改成功！"));
						}
					});
				} else {
					return false;
				}
			});
		},
		validatePass(rule, value, callback) {
			if (value === "") {
				callback(new Error("请再次输入密码"));
			} else if (value !== this.psdForm.newPassword) {
				callback(new Error("两次输入密码不一致!"));
			} else {
				callback();
			}
		},
		close() {
			this.$refs.psdForm.resetFields();
		},
		handleGoFaultRecord: function () {
			this.$router.push({
				name: "故障记录",
			});
			this.projectModule = "oldMenu";
			this.$store.commit("UPDATA_MODULE", "oldMenu");
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.$http.faultRecordNotReadNumber().then((res) => {
				if (res.data && res.data.success) {
					this.$store.commit("add_msgNum", res.data.data);
				}
			});
		});
	},
};
</script>

<style lang="less" scoped>
#com-headComp {
	width: calc(100% + 24px);
	min-width: 240px;
	height: 64px;
	margin-left: -24px;
	background: #fff;
	text-align: right;
	white-space: nowrap;
	box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
	li {
		list-style-type: none;
	}

	.switchBtn {
		margin-top: 12px;
		margin-left: 20px;
	}
	> i {
		line-height: 64px;
		background: #fff;
		margin-left: 24px;
		font-size: 24px;
		cursor: pointer;
		transition: 0.3s all;
		float: left;
		&:hover {
			font-size: 25px;
			color: cornflowerblue;
		}
	}
	#headComp-dropdpwn {
		float: right;
		line-height: 60px;
		margin-right: 12px;
		.el-dropdown-link {
			cursor: pointer;
			transition: 0.3s all;
			.iconarrow_down {
				font-size: 18px;
				margin-left: 4px;
			}
			.iconuser {
				padding: 8px;
				font-size: 24px;
				color: #f1f6ff;
				margin-right: 5px;
				border-radius: 50%;
				background: #cddef4;
			}
			&:hover {
				color: #409eff;
			}
		}
	}
	.item {
		margin: 20px 60px 20px 0;
		i {
			font-size: 30px;
			cursor: pointer;
			transition: 0.3s all;
			&:hover {
				color: #409eff;
			}
		}
	}
	.headRole {
		text-align: left;
	}
	.head-role-box {
		width: 100%;
		height: 80px;
		p {
			margin: 6px 0;
			float: left;
			clear: left;
			font {
				width: 80px;
				display: block;
				text-align: right;
				float: left;
			}
		}
	}
}
</style>
