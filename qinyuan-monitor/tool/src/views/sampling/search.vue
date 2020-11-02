<template>
	<div class="search">
		<div class="header">
			<span class="back" @click="back">
				<img src="../../assets/image/nav_btn_back.png" alt="退出">
			</span>
			<div class="title">手动输入</div>
		</div>
		<div class="box">
			<van-field v-model="filterCode" name="用户名" placeholder="请输入FEID" />
			<div style="margin:2rem 0px;" @click="onSubmit">
				<van-button round block :disabled="filterCode.length==0 " type="info">
					确认
				</van-button>
			</div>
		</div>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				filterCode: ""
			}
		},
		mounted() {},
		methods: {					
			back() {
				this.$router.push("/sampling");
			},
			onSubmit() {
				if (this.filterCode == "") {
					this.$toast('请输入FEID');
					return false;
				}			
				this.$router.push("/sampling?filterCode="+this.filterCode);
			}
		}
	}
</script>

<style lang="scss">
	.search {
		width: 100%;
		height: 100%;
		padding: 0px;
		margin: 0px;
		background: #F7F9FC;
		overflow: hidden;
		position: relative;

		.header {
			width: 100%;
			color: #333333;

			.back {
				position: absolute;
				left: 0px;
                z-index:100;
				img {
					float: left;
					width: 3rem;
					margin: 1rem 0 1rem 1rem;
				}
			}

			.title {
				position: absolute;
				left: 0px;
				width: 100%;
				z-index:0;
				line-height: 4.5rem;
				font-size: 1.5rem;
				text-align: center;
			}
		}

		.box {
			margin:7rem auto;
			width: 86%;
			.van-cell {
				line-height:70px;
				font-size: 1.5rem;
				background: #FFFFFF;
				border-radius: 6rem;

				.van-cell__value--alone {
					padding-left: 1rem;
				}
			}

		}

		.van-button {
			height: 80px;
			font-size: 25px;
			line-height:80px;
		}
	}
</style>
