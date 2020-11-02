<template>
	<div id="menu-details">
		<el-image
			v-if="ruleForm.imageName!=''&&ruleForm.imageName!=null"
			class="img1"
			fit="fill"
			:src="$store.state.oldStore.imgSrc+ruleForm.imageName+'&token='+$store.state.oldStore.token"
		>
			<div slot="placeholder" class="image-slot">图片加载中...</div>
		</el-image>
		<!-- <img class="img1" οnerrοr="../../../assets/imges/login.jpg" :src="$store.state.oldStore.imgSrc+ruleForm.imageName" /> -->
		<!-- <img class="img1" :src="$store.state.oldStore.imgSrc+ruleForm.imageName"/> -->
		<p class="title1">{{ruleForm.name}}</p>
		<p class="cen1">{{ruleForm.flavor}}</p>
		<p class="cen2">{{ruleForm.minute+'分钟 | '+ruleForm.people+'人份'}}</p>
		<p class="cen3">
			<img class="left" src="@/assets/imges/comma_left.png" />
			{{ruleForm.foodValue}}
			<img class="right" src="@/assets/imges/comma_right.png" />
		</p>
		<p class="title2">食材</p>
		<p class="cen4" v-for="(t1,i1) in ruleForm.seasonings" :key="i1">
			<font>{{t1.name}}</font>
			<font style="max-width:260px;">{{t1.note}}</font>
			<font>{{t1.value+(t1.note.length>0?'；':'')}}</font>
		</p>
		<p class="title2" style="margin-top:46px;">步骤简介</p>
		<p class="cen4 cen40" v-html="ruleForm.stepDescribe"></p>
		<p class="title2" style="margin-top:46px;">详细步骤</p>
		<div style="float:left;width:100%" v-for="(t3,i3) in ruleForm.steps" :key="t3">
			<p class="cen4">{{i3+1+'､'+t3.describe}}</p>
			<el-image
				class="img2"
				v-if="t3.stepImage != ''&&t3.stepImage != null"
				:src="$store.state.oldStore.imgSrc+t3.stepImage+'&token='+$store.state.oldStore.token"
			>
				<div slot="placeholder" class="image-slot">图片加载中...</div>
			</el-image>
			<!-- <img οnerrοr="../../../assets/imges/login.jpg"   class="img2" v-if="t3.stepImage != ''&&t3.stepImage != null" :src="$store.state.oldStore.imgSrc+t3.stepImage"/> -->
		</div>
	</div>
</template>

<script>
export default {
	mounted() {
		if (this.$route.params.id) {
			this.$http.menuApp({ id: this.$route.params.id }).then((res) => {
				this.ruleForm = res.data.data;
				this.ruleForm.stepDescribe = this.ruleForm.stepDescribe.replace(
					/\n/g,
					"<br/>"
				);
			});
		} else {
			this.$router.push({ name: "智能烹饪机" });
		}
	},
	data() {
		return {
			ruleForm: {},
		};
	},
};
</script>

<style lang="less">
@import "./style/menuDetail.less";
</style>
