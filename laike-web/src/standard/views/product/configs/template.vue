<template>
	<el-card id="functionConfig">
		<!-- 操作栏 -->
		<div class="clearfloat">
			<el-button class="left" @click="handleBack">返回</el-button>
		</div>
		<!-- 进度条 -->
		<el-steps class="steps marginT20" :active="4" align-center>
			<el-step
				v-for="(item, index) in steps"
				:key="index"
				:title="item.name"
				:description="item.label"
			></el-step>
		</el-steps>
		<!-- 操作栏 -->
		<div class="clearfloat">
			<el-button
				class="left"
				type="primary"
				v-if="templateId"
				@click="handleChangeTemplate"
			>
				修改模板
			</el-button>
		</div>
		<!-- 选择模板 -->
		<el-card v-if="step == 0" class="marginT20">
			<div class="cardBody">
				<div class="phoneBox" v-for="item in templates" :key="item.id">
					<img
						class="phone"
						:src="
							require('../../../assets/img/template_' +
								item.belong +
								'.png')
						"
						alt=""
					/>
					<div>
						<el-radio
							v-model="templateId"
							class="radio"
							:label="item.id"
						>
							单锅模版
						</el-radio>
					</div>
				</div>
			</div>
			<div class="marginT20 clearfloat">
				<el-button
					class="right"
					type="primary"
					:disabled="templateId == ''"
					@click="handleSave()"
				>
					确认
				</el-button>
			</div>
		</el-card>
		<!-- 配置主页（TC501） -->
		<TC501Home
			v-if="step == 1"
			:templateId="templateId"
			:productId="productId"
			class="marginT20"
		></TC501Home>
	</el-card>
</template>
<script>
import TC501Home from "./TC501Template/homePage";
import { Message } from "element-ui";
export default {
	name: "parse",
	data() {
		return {
			productInfo: {},
			step: 0,
			activeName: "",
			productId: "",
			templateId: "",
			templates: [], // 模版列表
			tagList: [],
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
	components: {
		TC501Home,
	},
	mounted() {
		this.productId = this.$route.query.id;
		this.getProductInfo();
	},
	methods: {
		// 获取当前产品类型列表
		getProductInfo: function () {
			this.$http
				.productModelInfo({
					productId: this.productId,
				})
				.then((res) => {
					if (res.data.success) {
						this.productInfo = res.data.data;
						this.getTemplates();
						if (this.productInfo.templateTypeId) {
							this.step = 1;
							this.templateId = this.productInfo.templateTypeId;
						} else {
							this.getTemplates();
						}
					}
				});
		},
		// 切换模板
		getTemplates: function () {
			this.$http.appMainModels(this.productId).then((res) => {
				if (res.data.success) {
					this.templates = res.data.data;
				}
			});
		},
		// 保存
		handleSave: function () {
			let item = {};
			for (let i in this.templates) {
				if (this.templates[i].id == this.templateId) {
					item = this.templates[i];
				}
			}
			this.$http
				.productAddTemplate({
					productId: this.productId,
					templateId: this.templateId,
				})
				.then((res) => {
					if (res.data.success) {
						if (item.belong == "TC501") {
							this.step = Number(this.step) + 1;
						}
					}
				});
		},
		// 返回
		handleBack: function () {
			this.$confirm(
				"确认返回上一步配置么，此操作将清空本页所有未保存内容？",
				"提示",
				{
					confirmButtonText: "确认",
					cancelButtonText: "取消",
					type: "warning",
				}
			).then(() => {
				this.$router.back(-1);
			});
		},
		// 修改模板
		handleChangeTemplate: function () {
			let msg = "重新绑定模板将删除原有模板配置，确认重新绑定吗?";
			this.$confirm(msg, "提示", {
				confirmButtonText: "确认",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(() => {
					this.step = 0;
					this.templateId = "";
					this.getTemplates();
				})
				.catch(() => {});
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
.phoneBox {
	display: inline-block;
	width: 270px;
	margin-left: 40px;
}
.phone {
	width: 270px;
	height: 486px;
	border: 2px solid #ccc;
}
.radio {
	margin-top: 10px;
}
.footer {
	margin-top: 20px;
}
.steps {
	margin-bottom: 20px;
}
</style>