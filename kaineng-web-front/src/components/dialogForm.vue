<template>
<div class="dialogForm">
	<Modal v-model="dialog" :footer-hide='footerHide' :loading='dialogLoading' :title="title" @on-ok="handleSubmit" @on-cancel="dialog = false" width='60'>
		<Form ref='comForm' :model="form" label-position="right" :label-width="100" :rules='compRule' :inline='inline'>
			<FormItem v-for='item in dialogFormConf' :key='item.valName' :prop='item.valName' :label="item.label">
				<!-- span -->
				<span v-if='item.type=="span"' :placeholder='item.plh' class="formSpan">{{form[item.valName]}}</span>
				<!-- input -->
				<!-- eslint-disable-next-line -->
				<Input v-if='item.type=="input"' v-model='form[item.valName]' :type='item.inputType?item.inputType:"text"' :placeholder='item.plh' class="formInput"></Input>
				<!-- select -->
				<Select v-if='item.type=="select"' v-model="form[item.valName]" :placeholder='item.plh' class="formInput">
					<Option v-for="(optinItem,index) in item.selectList" :value="optinItem[item.selValName]" :key="index">{{ optinItem[item.selLabName] }}</Option>
				</Select>
				<!-- upload上传控件 支持显示已上传缩略图（仅支持先上传文件后提交表单） -->
				<Upload v-if='item.type=="upload"' :accept='accept' :on-success='upLoadOnSuccess' :on-error='upLoadOnError' :show-upload-list='false' :data='upLoadData' multiple :action="item.upLoadUrl">
					<img v-if='showImg&&upImg' :src="defaultImg[item.valName].url+'?commonKey='+apiConfig.commonKey" class="upload_img">
					<Button icon="ios-cloud-upload-outline" :class="upImg?['marginTop']:[]">{{fileName?fileName:'选择文件'}}</Button>
				</Upload>
				<!-- 图片hover形式查看 -->
				<Poptip trigger="hover" v-if='item.type=="img"'>
					<a>查看</a>
					<div slot="content" v-if='dialog'>
						<img :src="form[item.valName]+'?commonKey='+apiConfig.commonKey" alt="" class="dialogForm_img">
					</div>
				</Poptip>
			</FormItem>
		</Form>
	</Modal>
</div>
</template>
<script>
import apiConfig from '@/apiConfig'
export default {
	name: 'dialogForm',
	data() {
		// 再次输入密码表单验证
		const validateRepwd = (rule, value, callback) => {
			if (value != this.form.password) {
				callback(new Error('两次密码输入不同，请检查输入'));
			} else {
				callback();
			}
		};
		return {
			apiConfig, // 引入api配置数据
			showImg: false, // 是否显示已上传缩略图
			fileName: null, // 显示已上传文件名
			upLoadData: { // 引入通用接口验证码
				commonKey: apiConfig.commonKey
			},
			defaultImg: {}, // 默认已上传文件
			dialog: false, // 控制弹窗显示
			dialogLoading: true, // 表单loading
			form: {}, // 表单数据显示
			rePassword: [{ // 再次输入密码表单验证
					required: true,
					message: '请再次输入密码',
					trigger: 'blur'
				},
				{
					validator: validateRepwd,
					trigger: 'blur'
				}
			],
		}
	},
	props: {
		accept: String,
		upImg: Boolean,
		compRule: Object,
		successTxt: String,
		autoSubmit: Boolean,
		footerHide: Boolean,
		inline: Boolean,
		title: String,
		dialogFormConf: Array,
		submitUrl: String,
		refName: String,
	},
	created() {
		for (let i in this.dialogFormConf) {
			this.form[this.dialogFormConf[i].valName] = null
			if (this.dialogFormConf[i].type == 'upload') {
				this.defaultImg[this.dialogFormConf[i].valName] = {
					url: ''
				}
			}
		}
		for (let i in this.compRule) {
			if (i == 'rePassword') {
				this.compRule.rePassword = this.rePassword
			}
		}
	},
	methods: {
		// 修改弹窗显示
		handleShow(flag) {
			this.fileName = null
			this.$refs.comForm.resetFields()
			this.dialog = flag
		},
		handlePushFormData(form) {
			this.form = form
			for (let i in this.dialogFormConf) {
				if (this.dialogFormConf[i].type == 'upload') {
					let uri = this.form[this.dialogFormConf[i].valName]
					if (uri != null && uri != undefined && uri != '') {
						this.defaultImg[this.dialogFormConf[i].valName] = {
							url: uri
						}
						this.showImg = true
					}
				}
			}
			this.handleShow(true)
		},
		handleSubmit() {
			this.$refs['comForm'].validate((valid) => {
				if (valid) {
					if (this.autoSubmit) {
						let api = this.submitUrl,
							para = this.form
						this.$Ax.post(api, para).then(res => {
							if (res.success) {
								this.$Message.success(this.successTxt ? this.successTxt : '成功！')
								this.$emit('submitCallBack')
							}
							this.handleShow(false)
						}).catch(err => {
							// eslint-disable-next-line
							console.log(err);
						})
						setTimeout(() => {
							this.changeLoading();
						}, 1000);
					} else {
						if (this.fileName != null) {
							this.form.fileName = this.fileName
						}
						this.$emit('submitCompForm', {
							form: this.form,
							conf: this.dialogFormConf,
							ref: this.refName
						})
					}
				} else {
					return this.changeLoading();
				}
			})
		},
		upLoadOnSuccess(response, file) {
			if (!response.success) {
				this.$Message.error(response.message)
			} else {
				this.showImg = false
				this.$Message.success('上传成功！')
				this.fileName = file.name
				for (let i in this.dialogFormConf) {
					if (this.dialogFormConf[i].type == 'upload') {
						if (this.upImg) {
							this.defaultImg[this.dialogFormConf[i].valName].url = this.apiConfig.baseURL + this.$api.common_getFile + response.data
							this.showImg = true
						}
						this.form[this.dialogFormConf[i].valName] = this.apiConfig.baseURL + this.$api.common_getFile + response.data
					}
				}
			}
		},
		upLoadOnError(error) {
			/* eslint-disable */
			console.log(error);
			/* eslint-enable */
		},
		changeLoading() { // 修改表单loading状态
			this.dialogLoading = false;
			this.$nextTick(() => {
				this.dialogLoading = true;
			});
		},
	}
}
</script>
<style lang="css" scoped>
.formInput{
	width: 300px;
}
.formSpan{
	display: inline-block;
	width: 150px;
}
.dialogForm_img{
	width: 200px;
	height: 200px;
}
.upload_img{
	display: block;
	width: 200px;
	height: 200px;
}
</style>
