<template>
	<div class="feedback">
		<van-nav-bar title="反馈" @click-left="onClickLeft" left-arrow class="feedback_header" />
		<div class="feedbackBg">
			<p class="feedfackTitle">请描述您的问题或建议，我们会尽快解决。</p>
			<div class="feedbackText">
				<textarea rows="10" @input="wishContent" v-model="desc" maxlength="100" placeholder="请输入您的意见反馈…"></textarea>
				<span class="wordsNum">{{remnant}}/100</span>
			</div>
			<van-field v-model="phone" label="手机号" input-align="right" placeholder="请输入手机号" class="phone" />
			<div class="save">
				<van-button round @click="save">提交</van-button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				remnant: 0,
				desc: "",
				phone: ""			
			}
		},
		methods: {
			onClickLeft() {
				this.$router.go(-1);
			},
			wishContent() {
				let txtVal = this.desc.length;
				this.remnant = txtVal;
			},
			save() {
				console.log(1)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.feedback {
		overflow: hidden;
		.feedback_header{
			background: none;
			border: none;
			color: white;
		}
		.van-nav-bar .van-icon {
			color: white;
			vertical-align: middle;
		}
		.van-nav-bar__title {
			width:100%;
			color: white;
			font-size: 0.14rem;
		}
		.feedfackTitle {
			font-size: 0.15rem;
			color: #333333;
			letter-spacing: 0;
			line-height: 0.4rem;
			text-align: center;
			font-weight: bold;
			margin-top: 0.2rem;
		}
		.feedbackBg {
			background: white;
			margin: 0.2rem 0.1rem;
			border-radius: 0.1rem;
			overflow: hidden;
		}
		.feedbackText textarea {
			margin: 0 5%;
			width: 90%;
			border: none;
			padding: 0.15rem 0.15rem;
			font-size: 0.15rem;
			word-break: break-all;
			word-wrap: break-word;
			box-sizing: border-box;
			background: #EEF3FA;
			border-radius: 0.05rem;
		}
		.feedbackText {
			position: relative;
			width: 100%;
		}
		.phone {
			margin: -0.1rem 5%;
			width: 90%;
			background: #EEF3FA;
			border-radius: 0.05rem;
		}
		.wordsNum {
			position: absolute;
			font-size: 0.12rem;
			bottom: 0.4rem;
			right: 0.3rem;
			color: #AAAAAA;
		}
		.save {
			padding: 10px 15px;
			text-align: center;
		}
		.save button {
			color: white;
			background: #267CFB;
			width: 100%;
			display: block;
			margin: 0.2rem 0;
		}
	}
</style>