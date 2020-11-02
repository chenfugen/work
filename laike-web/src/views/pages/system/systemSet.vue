<template>
<div id="systemSet">
	<el-tabs v-model.trim="activeName">
		<el-tab-pane label="移动端常见问题" name="0">
			<el-form :model="appProblems" :rules="rules" ref="appProblems" label-width="180px" class="demo-ruleForm">
				<div class="common" v-for="(i,x) in appProblems.appProblems" :key="x">
					<p class="title">
						问题{{x+1}}
						<i title="删除" class="iconwrong" @click="appProblems.appProblems.splice(x,1); " v-if="$store.state.oldStore.authThree.indexOf('k42') != -1"></i>
					</p>
					<el-form-item label="标题：" :prop="'appProblems.'+x+'.key'" :rules="{ required: true, message: '请输入常见问题标题', trigger: 'blur' }">
						<el-input :disabled="$store.state.oldStore.authThree.indexOf('k42') == -1" placeholder="常见问题标题" size="small" v-model.trim="i.key"></el-input>
					</el-form-item>
					<el-form-item label="链接：" :prop="'appProblems.'+x+'.value'" :rules="[{ required: true, message: '请输入常见问题网址链接', trigger: 'blur' },{ pattern:/^(http|https):\/\/([\w.]+\/?)\S*/, message: '请输入正确的url地址', trigger: 'blur'  }]">
						<el-input :disabled="$store.state.oldStore.authThree.indexOf('k42') == -1" placeholder="常见问题网址链接" size="small" v-model.trim="i.value"></el-input>
					</el-form-item>
				</div>
			</el-form>
			<div class="dialog-footer" v-if="$store.state.oldStore.authThree.indexOf('k42') != -1">
				<el-button type="danger" @click="appProblems.appProblems.push({key:'',value:''})">新增问题</el-button>
				<el-button type="danger" @click="setSub('appProblems')">保存</el-button>
			</div>
		</el-tab-pane>
		<el-tab-pane label="移动端使用帮助" name="1">
			<el-form :model="appUses" :rules="rules" ref="appUses" label-width="180px" class="demo-ruleForm">
				<div class="common" v-for="(i,x) in appUses.appUses" :key="x">
					<p class="title">
						帮助{{x+1}}
						<i title="删除" v-if="$store.state.oldStore.authThree.indexOf('k42') != -1" class="iconwrong" @click="appUses.appUses.splice(x,1); "></i>
					</p>
					<el-form-item label="标题：" :prop="'appUses.'+x+'.key'" :rules="{ required: true, message: '请输入使用帮助标题', trigger: 'blur' }">
						<el-input :disabled="$store.state.oldStore.authThree.indexOf('k42') == -1" placeholder="使用帮助标题" size="small" v-model.trim="i.key"></el-input>
					</el-form-item>
					<el-form-item label="链接：" :prop="'appUses.'+x+'.value'" :rules="[{ required: true, message: '请输入使用帮助网址链接', trigger: 'blur' },{ pattern:/^(http|https):\/\/([\w.]+\/?)\S*/, message: '请输入正确的url地址', trigger: 'blur'  }]">
						<el-input :disabled="$store.state.oldStore.authThree.indexOf('k42') == -1" placeholder="使用帮助网址链接" size="small" v-model.trim="i.value"></el-input>
					</el-form-item>
				</div>
			</el-form>
			<div class="dialog-footer" v-if="$store.state.oldStore.authThree.indexOf('k42') != -1">
				<el-button type="danger" @click="appUses.appUses.push({key:'',value:''})">新增问题</el-button>
				<el-button type="danger" @click="setSub('appUses')">保存</el-button>
			</div>
		</el-tab-pane>

		<el-tab-pane label="系统链接" name="2">
			<el-form style="padding-right:100px" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="180px" class="demo-ruleForm">
				<el-form-item label="用户协议" prop="userAgreement">
					<el-input :disabled="$store.state.oldStore.authThree.indexOf('k42') == -1" size="small" placeholder="URL" v-model.trim="ruleForm.userAgreement"></el-input>
				</el-form-item>
				<el-form-item label="隐私政策" prop="privacyPolicy">
					<el-input :disabled="$store.state.oldStore.authThree.indexOf('k42') == -1" size="small" placeholder="URL" v-model.trim="ruleForm.privacyPolicy"></el-input>用于APP端/屏端隐私声明
				</el-form-item>
				<el-form-item label="官网链接" prop="officialLink">
					<el-input :disabled="$store.state.oldStore.authThree.indexOf('k42') == -1" size="small" placeholder="URL" v-model.trim="ruleForm.officialLink"></el-input>
				</el-form-item>
				<el-form-item label="APP链接">
				</el-form-item>
			</el-form>
			<img style="display: block;margin: auto;margin-bottom: 30px;" :src="'./appDown1.png'" />
			<div class="dialog-footer" v-if="$store.state.oldStore.authThree.indexOf('k42') != -1">
				<el-button type="danger" @click="setSub('ruleForm')">保存</el-button>
			</div>
		</el-tab-pane>
	</el-tabs>
</div>
</template>

<script>
export default {
	data() {
		return {
			activeName: '0',
			ruleForm: {
				userAgreement: '', //隐私协议
				privacyPolicy: '', //隐私协议
				appProblem: '', //APP常见问题
				officialLink: '', //官网链接
			},
			appProblems: {
				appProblems: [{
					key: '',
					value: '',
				}]
			},
			appUses: {
				appUses: [{
					key: '',
					value: '',
				}]
			},
			rules: {
				userAgreement: [{
						required: true,
						message: '请输入用户协议',
						trigger: 'blur'
					},
					{
						pattern: /^(http|https):\/\/([\w.]+\/?)\S*/,
						message: '请输入正确的url地址',
						trigger: 'blur'
					},
				],
				privacyPolicy: [{
						required: true,
						message: '请输入隐私政策',
						trigger: 'blur'
					},
					{
						pattern: /^(http|https):\/\/([\w.]+\/?)\S*/,
						message: '请输入正确的url地址',
						trigger: 'blur'
					},
				],
				regiappProblemon: [{
						required: true,
						message: '请输入APP常见问题',
						trigger: 'blur'
					},
					{
						pattern: /^(http|https):\/\/([\w.]+\/?)\S*/,
						message: '请输入正确的url地址',
						trigger: 'blur'
					},
				],
				appUse: [{
						required: true,
						message: '请输入APP使用教程',
						trigger: 'blur'
					},
					{
						pattern: /^(http|https):\/\/([\w.]+\/?)\S*/,
						message: '请输入正确的url地址',
						trigger: 'blur'
					},
				],
				officialLink: [{
						required: true,
						message: '请输入官网链接',
						trigger: 'blur'
					},
					{
						pattern: /^(http|https):\/\/([\w.]+\/?)\S*/,
						message: '请输入正确的url地址',
						trigger: 'blur'
					},
				],
				value: [{
						required: true,
						message: '请输入链接',
						trigger: 'blur'
					},
					{
						pattern: /^(http|https):\/\/([\w.]+\/?)\S*/,
						message: '请输入正确的url地址',
						trigger: 'blur'
					},
				],
				key: [{
					required: true,
					message: '请输入标题',
					trigger: 'blur'
				}, ]
			},
		}
	},
	methods: {
		setSub(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					var ajax = this.$http.updataSystemLink,
						data = this.ruleForm;
					if (formName == 'appProblems') {
						ajax = this.$http.appProblem;
						data = this.appProblems;
					} else if (formName == 'appUses') {
						ajax = this.$http.appUse;
						data = this.appUses;
					}
					ajax(data).then(res => {
						if (res.data.success) {
							this.getSet();
						}
					})
				} else {
					return false;
				}
			});
		},
		getSet() {
			this.$http.systemLink().then(res => {
				if (res.data.success) {
					this.ruleForm.privacyPolicy = res.data.data.privacyPolicy;
					this.ruleForm.userAgreement = res.data.data.userAgreement;
					res.data.data.appProblems ? this.appProblems.appProblems = res.data.data.appProblems : this.appProblems.appProblems = [];
					res.data.data.appUses ? this.appUses.appUses = res.data.data.appUses : this.appUses.appUses = [];
					this.ruleForm.officialLink = res.data.data.officialLink;
				}
			})
		}
	},
	mounted() {
		this.getSet();
	}
}
</script>

<style lang="less">
#systemSet {
    width: 100%;
    margin-bottom: 24px;
    float: left;
    background: #fff;
    box-sizing: border-box;
    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    .common {
        width: 100%;
        margin-bottom: 12px;
        padding: 15px 100px 15px 70px;
        box-sizing: border-box;
        border-bottom: 1px solid #d6d6d6;
        > .title {
            font-size: 16px;
            padding: 8px;
            text-indent: 40px;
            i {
                float: right;
                margin-right: -60px;
                font-size: 18px;
                cursor: pointer;
            }
        }
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #F02B54;
    }
    .el-tabs__nav-wrap {
        padding-left: 12px;
    }
    .el-tabs__active-bar {
        background-color: #F02B54;
    }
    .el-tabs__item.is-active {
        color: #2c3e50;
        font-weight: bold;
        font-size: 15px;
    }
    .dialog-footer {
        text-align: center;
        margin-bottom: 20px;
    }
}
</style>
