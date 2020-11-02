<template>
	<el-card class="secondary">
		<el-steps class="steps" :active="2">
			<el-step title="详情页面" name="1"></el-step>
			<el-step title="次级页面" name="2"> </el-step>
			<el-step title="更多" name="3"></el-step>
		</el-steps>
		<div class="marginT20">
			<el-card
				class="cardBtn"
				shadow="hover"
				@click.native="handleAddBtn"
			>
				<i class="el-icon-plus btnPlus"></i>
			</el-card>
			<el-card
				v-for="(item, index) in btnList"
				:key="index"
				:class="activeBtn == index ? cardBtnActive : cardBtnNormal"
			>
				<i class="el-icon-plus btnPlus"></i>
			</el-card>
		</div>
		<!-- 弹窗 -->

		<el-dialog
			width="60%"
			:title="act == 'add' ? '新增' : '编辑'"
			:visible.sync="dialogVisible"
			:before-close="handleClose"
		>
			<div slot="footer" class="clearfloat">
				<el-button @click="handleClose">取 消</el-button>
				<el-button type="primary" @click="submitForm">
					保 存
				</el-button>
			</div>
		</el-dialog>
	</el-card>
</template>

<script>
export default {
	name: "secondary",
	data() {
		return {
			activeBtn: 1,
			btnList: [],
		};
	},
	methods: {
		handleAddBtn: function () {},
	},
};
</script>

<style scoped>
#secondary {
	background-color: #fff;
}
.cardBtn {
	width: 200px;
	height: 100px;
	text-align: center;
	cursor: pointer;
}
.btnPlus {
	line-height: 60px;
	font-size: 35px;
	color: #ccc;
}
</style>