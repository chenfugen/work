<template>
	<el-card id="functionConfig">
		<!-- 操作栏 -->
		<div class="clearfloat">
			<el-button class="left" @click="$router.go(-1)">返回</el-button>
			<el-button class="right" type="primary" @click="handleNext">
				下一步
			</el-button>
		</div>
		<!-- 进度条 -->
		<el-steps class="marginT20" :active="3" align-center>
			<el-step
				v-for="(item, index) in steps"
				:key="index"
				:title="item.name"
				:description="item.label"
			></el-step>
		</el-steps>
		<!-- 主体 -->
		<el-card class="card marginT20">
			<div slot="header" class="clearfix">
				<span>解析配置</span>
			</div>
			<div class="cardBody">
				<el-radio-group v-model="script.type">
					<el-radio class="radio" :label="1">
						使用标准协议
						<div class="tips">
							标准协议适用于严格按照海大制定的《莱克WIFI通用数据传输串口协议》，推荐使用此种方式，产品接入快速，
							无需定制开发脚本.
						</div>
					</el-radio>
					<el-radio class="radio" :label="2">
						使用自定协议
						<el-upload
							v-if="script.type == 2 && !fileName"
							multiple
							:limit="1"
							class="upload"
							action=""
							:show-file-list="false"
							:auto-upload="false"
							:on-change="
								(file, filesList) => handleChoseFile(file)
							"
							accept=".jar"
						>
							<el-button size="small" type="primary">
								点击上传
							</el-button>
						</el-upload>
						<div class="upload">
							<span class="fileName" v-if="fileName">{{
								fileName
							}}</span>
							<el-button
								size="small"
								type="danger"
								v-if="fileName"
								@click="handleDelete"
							>
								删除文件
							</el-button>
						</div>
						<div class="tips">
							自定协议适用于设备未按照《莱克WIFI通用数据传输串口协议》所开发的产品，需要上传的
							根据自定义协议所开发的转换脚本至服务器，产品方可使用
						</div>
					</el-radio>
				</el-radio-group>
			</div>
			<div class="footer clearfloat">
				<el-button
					class="right"
					type="primary"
					:disabled="script.type == 2 && !fileName"
					@click="handleSubmit"
				>
					保存
				</el-button>
			</div>
		</el-card>
	</el-card>
</template>
<script>
export default {
	name: "parse",
	data() {
		return {
			fileName: "",
			file: "",
			script: {
				type: 1,
			},
			steps: [
				{
					name: "型号创建",
					label: "创建产品型号",
				},
				{
					name: "功能配置",
					label: "功能属性配置",
				},
				{
					name: "解析配置",
					label: "适配器解析配置",
				},
				{
					name: "APP模板配置",
					label: "APP模板配置",
				},
			],
		};
	},
	mounted() {
		this.productId = this.$route.query.id;
		this.getScriptInfo();
	},
	methods: {
		// 获取当前脚本详情
		getScriptInfo: function () {
			this.$http
				.productModelScriptInfo({
					productId: this.productId,
				})
				.then((res) => {
					if (res.data.success) {
						this.script = res.data.data;
						this.fileName = this.script.originName;
					}
				});
		},
		// 文件选择时
		handleChoseFile: function (fileData) {
			let file = fileData.raw;
			this.fileName = fileData.name;
			this.file = file;
		},
		// 删除已有文件
		handleDelete: function () {
			this.$confirm("确认删除该文件?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(() => {
					this.fileName = "";
					this.script.file = null;
				})
				.catch(() => {
					console.log("取消");
				});
		},
		// 保存
		handleSubmit: function () {
			this.$confirm("确认保存当前解析配置?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(() => {
					let ajax = this.script.id
							? this.$http.productModelScriptEdit
							: this.$http.productModelScriptAdd,
						form = new FormData();
					if (this.script.id) {
						form.append("id", this.script.id);
						if (this.script.type == 2) {
							if (this.file) {
								form.append("file", this.file);
							} else {
								form.append("filename", this.script.filename);
							}
						}
					} else if (this.file) {
						form.append("file", this.file);
					}
					form.append("type", this.script.type);
					form.append("productId", this.productId);
					ajax(form).then((res) => {
						if (res.data.success) {
							this.file = "";
							this.getScriptInfo();
						}
					});
				})
				.catch((err) => {
					console.log(err, "取消");
				});
		},
		// 下一步
		handleNext: function () {
			this.$router.push({
				path: "/standardProduct/template?id=" + this.productId,
			});
		},
	},
};
</script>
<style scoped>
#functionConfig {
	background: #fff;
}
.cardBody {
	margin: 0 auto;
}
.radio {
	display: block;
	margin-top: 20px;
}
.radio .tips {
	line-height: 30px;
	font-size: 14px;
	text-indent: 28px;
	color: darkgray;
}
.fileName {
	margin-right: 20px;
}
.upload {
	margin-left: 28px;
	margin-top: 10px;
}
.footer {
	margin-top: 20px;
}
.steps {
	margin-bottom: 20px;
}
</style>