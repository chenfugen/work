<template>
	<div class="qrcode">
		<Header title='二维码' to='null'></Header>
		<div id="box">
			<div style="margin:0 auto;display:none;" id="qrcode2" v-html="printHtml"></div>
		</div>
		<div class="confirm_button">
			<van-button size="large" color="#229794" @click="confirm" :disabled="isConfirm" class="confirm">打印</van-button>
			<p class="hint">已生成二维码，请前往确认打印</p>
		</div>
	</div>
</template>

<script>
	import QRCode from 'qrcodejs2' // 引入qrcode
	import Header from "../header/header.vue"
	export default {
		data() {
			return {
				list: JSON.parse(this.$route.params.ids),
				printHtml: "",
				isConfirm: false,
				url: this.$store.state.url,
			};
		},
		mounted() {
			window.printResult = this.printResult;
			this.qrcode();
		},
		components: {
			Header
		},
		methods: {
			printResult(value) {
				if (value == "1") {
					this.$dialog.alert({
						message: '二维码打印成功,返回首页'
					}).then(() => {
						this.$router.push("/admin")
					});
				} else {
					this.$dialog.alert({
						message: '打印失败，重新打印'
					}).then(() => {
						this.isConfirm = false;
					});
				}
			},
			qrcode() {
				let _self = this;
				let printBeforeStr = "<div style='height:500px;overflow-y:scroll'>";
				let printContent = "";
				for (let i = 0; i < _self.list.ids.length; i++) {
					printContent +=
						"<div style='width:170px;margin:5px auto'><div style='text-align:center;line-height:20px;font-size:0.1rem;background:white'>心悦后勤</div><div style='border-left:10px solid #fff;border-right:10px solid #fff' id='XQ" +
						i +
						"'></div><div style='text-align:center;font-size:0.1rem;line-height:20px;background:white'>编码:" + _self.list.assetNums[
							i] + "</div></div>";
				}
				let printAfter = "</div>";
				_self.printHtml = printBeforeStr + printContent + printAfter
				document.getElementById("qrcode2").innerHTML = _self.printHtml;
				let new_str = document.getElementById("qrcode2").innerHTML;
				let head_str = "";
				document.getElementById("box").innerHTML = new_str;
				for (let j = 0; j < _self.list.ids.length; j++) {
					document.getElementById('XQ' + j).innerHTML = '';
					let contentStr = _self.list.ids[j];
					let qrcode = new QRCode(document.getElementById("XQ" + j), {
						width: 150,
						height: 150,
						text: contentStr, // 二维码地址
						colorDark: "#000",
						colorLight: "#fff",
					})
				}
			},
			confirm() {
				this.$dialog.alert({
					message: '打印期间，请勿息屏'
				}).then(() => {
					window.android.printCode(this.$route.params.ids)
					this.isConfirm = true;
				});
			}
		}
	}
</script>
<style lang="scss">
	.qrcode {
		.confirm_button {
			position: fixed;
			bottom: 1rem;
			width: 100%;

			.confirm {
				color: white;
				border-radius: 0.05rem;
				position: absolute;
				width: 95%;
				left: 2.5%;
				top: 0px;
			}

			.hint {
				position: absolute;
				width: 100%;
				top: 0.5rem;
				line-height: 0.3rem;
				font-size: 0.13rem;
				color: #229794;
				text-align: center
			}
		}

	}
</style>
