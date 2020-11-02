<template>
	<el-card class="menuStep">
		<div slot="header" class="header clearfloat">
			<p class="title">步骤{{ idx + 1 }}</p>
			<div class="right">
				<el-link
					class="marginR20"
					icon="el-icon-top"
					type="primary"
					@click="handleMove('up')"
					:disabled="idx == 0"
				>
					上移
				</el-link>
				<el-link
					class="marginR20"
					icon="el-icon-bottom"
					type="primary"
					@click="handleMove('down')"
					:disabled="last"
				>
					下移
				</el-link>
				<el-link
					icon="el-icon-delete"
					type="danger"
					@click="handleDeleteStep"
					>删除</el-link
				>
			</div>
		</div>
		<div class="stepMain clearfloat">
			<!-- 步骤图片 -->
			<div class="imgBox left clearfloat">
				<el-upload
					ref="active"
					class="avatar-uploader"
					:auto-upload="false"
					action="/lexy/api/common/saveMenuImage"
					:limit="1"
					:show-file-list="false"
					:on-change="
						(file, filesList) => handleChoseFile(file, 'active')
					"
					accept=".jpg"
					style="width: 300px; height: 360px"
				>
					<img v-if="base64" :src="base64" class="avatarAppImage" />
					<div class="userAdvert-add">单击上传</div>
				</el-upload>
				<div class="imgTip">支持拓展名: .jpg</div>
			</div>
			<!-- 步骤/属性 表单 -->
			<div class="formBox right clearfloat">
				<!-- 步骤 -->
				<el-form label-width="120px">
					<el-form-item label="步骤描述">
						<el-input
							class="textarea"
							type="textarea"
							rows="3"
						></el-input>
					</el-form-item>
					<el-form-item label="启动中步骤描述" v-if="stepType == 2">
						<el-input
							class="textarea"
							type="textarea"
							rows="3"
						></el-input>
					</el-form-item>
					<el-form-item label="暂停中步骤描述" v-if="stepType == 2">
						<el-input
							class="textarea"
							type="textarea"
							rows="3"
						></el-input>
					</el-form-item>
					<el-form-item label="步骤类型">
						<el-select v-model="stepType">
							<el-option
								v-for="item in types"
								:key="item.value"
								:value="item.value"
								:label="item.label"
							></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="步骤模型">
						<el-select :value="stepModule"></el-select>
					</el-form-item>
				</el-form>
				<!-- 属性 -->
				<el-form label-width="120px" v-if="stepType == 2">
					<el-form-item label="属性ID">
						<div class="propName">属性名称</div>
						<div class="propSet">参数设置</div>
					</el-form-item>
					<el-form-item label="0075">
						<div class="propName">档位</div>
						<div class="propSet">
							<el-input></el-input>
						</div>
					</el-form-item>
					<el-form-item label="0075">
						<div class="propName">档位</div>
						<div class="propSet">
							<el-input></el-input>
						</div>
					</el-form-item>
					<el-form-item label="0075">
						<div class="propName">档位</div>
						<div class="propSet">
							<el-input></el-input>
						</div>
					</el-form-item>
					<el-form-item label="0075">
						<div class="propName">档位</div>
						<div class="propSet">
							<el-input></el-input>
						</div>
					</el-form-item>
					<el-form-item label="0075">
						<div class="propName">档位</div>
						<div class="propSet">
							<el-input></el-input>
						</div>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</el-card>
</template>

<script>
export default {
	name: "menuStep",
	props: {
		idx: {
			type: Number,
			default: () => {
				return 1;
			},
		},
		num: {
			type: Number,
			default: () => {
				return 2;
			},
		},
		last: {
			type: Boolean,
			default: () => {
				return false;
			},
		},
	},
	data() {
		return {
			types: [
				{
					label: "放料",
					value: 1,
				},
				{
					label: "执行",
					value: 2,
				},
				{
					label: "结束",
					value: 3,
				},
			],
			base64: "",
			stepType: "",
			stepModule: "",
		};
	},
	mounted() {},
	methods: {
		handleChoseFile: function (file) {
			console.log(file);
		},
		handleDeleteStep: function () {
			// 没办法...嵌套太多层了
			this.$parent.$parent.$parent.handleDeleteStep(this.idx);
		},
		handleMove: function (fun) {
			this.$parent.$parent.$parent.handleMoveStep(fun, this.idx);
		},
	},
};
</script>

<style>
.menuStep .title {
	display: inline-block;
}
.menuStep .header {
	height: 30px;
	line-height: 30px;
}
.menuStep .avatar-uploader {
	display: block;
	margin-bottom: 6px;
}
.menuStep .avatarImage {
	width: 300px;
	height: 360px;
}
.menuStep .avatarAppImage {
	width: 300px;
	height: 360px;
}
.menuStep .avatar-uploader .el-upload {
	float: left;
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	height: 100%;
	width: 100%;
}
.menuStep .avatar-uploader .el-upload:hover {
	border-color: #409eff;
}
.menuStep .userAdvert-add {
	color: #8c939d;
	font-size: 22px;
	width: 300px;
	height: 360px;
	line-height: 360px;
	text-align: center;
}
.menuStep .imgTip {
	font-size: 14px;
	color: #bbb;
	text-align: center;
}
.menuStep .textarea {
	width: 400px;
}
.menuStep .propName {
	width: 120px;
	text-align: center;
	display: inline-block;
}
.menuStep .propSet {
	display: inline-block;
	width: 200px;
}
</style>