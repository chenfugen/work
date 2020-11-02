<template>
	  <div class="scan">
		    <div id="bcid">
			      <div style="height:40%"></div>
			      <p style="font-size:0.12rem;">...载入中...</p>
			 </div>
		    <footer>
			      <button style="font-size:0.12rem;" @click="startRecognize">1.创建控件</button>
			      <button style="font-size:0.12rem;" @click="startScan">2.开始扫描</button>
			      <button style="font-size:0.12rem;" @click="cancelScan">3.结束扫描</button>
			      <button style="font-size:0.12rem;" @click="closeScan">4.关闭控件</button>
			      <button style="font-size:0.12rem;" @click="setFlash">5.开启闪光灯</button>
			      <button style="font-size:0.12rem;" @click="scanPicture">6.从相册中选择二维码图片</button>
		</footer>
		  </div>
</template>

<script type='text/ecmascript-6'>
	let scan = null
	export default {
		data() {
			return {
				codeUrl: '',
			}
		},
		mounted() {

			
			console.log(plus)
				},
				methods: {
					// 创建扫描控件
					startRecognize() {
						let that = this
						if (!window.plus) return
						var filter;
						//自定义的扫描控件样式 
						var styles = {
							frameColor: "#29E52C",
							scanbarColor: "#29E52C",
							background: ""
						}
						scan = new plus.barcode.Barcode('bcid', filter, styles)
						scan.onmarked = onmarked
						scan.onerror = onerror; //扫描错误
						function onmarked(type, result, file) {
							switch (type) {
								case plus.barcode.QR:
									type = 'QR'
									break
								case plus.barcode.EAN13:
									type = 'EAN13'
									break
								case plus.barcode.EAN8:
									type = 'EAN8'
									break
								default:
									type = '其它' + type
									break
							}
							result = result.replace(/\n/g, '')
							that.codeUrl = result
							alert(result)
							that.closeScan()
						}

						function onerror(e) { //错误弹框
							alert(e);
						}
					},

					// 开始扫描
					startScan() {
						if (!window.plus) return
						scan.start()
					},
					// 关闭扫描
					cancelScan() {
						if (!window.plus) return
						scan.cancel()
					},

					// 关闭条码识别控件
					closeScan() {
						if (!window.plus) return
						scan.close()
					},

					// 开启闪光灯
					setFlash() {
						if (!window.plus) return
						scan.setFlash();
					},

					scanPicture() { //可以直接识别二维码图片
						plus.gallery.pick(function(path) {
							plus.barcode.scan(path, onmarked, function(error) {
								plus.nativeUI.alert("无法识别此图片");
							});

						}, function(err) {
							plus.nativeUI.alert("Failed: " + err.message);
						});
					}
				}
			}
</script>

<style lang="scss">
	.scan {
		height: 100%;

		#bcid {
			width: 100%;
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0.3rem;
			text-align: center;
			color: #fff;
			background: #ccc;

			.tip {
				fint-size: 0.12rem;
			}
		}

		footer {
			position: absolute;
			left: 0;
			bottom: 0.1rem;
			height: 0.2rem;
			line-height: 0.2rem;
			z-index: 2;

			.button {
				fint-size: 0.12rem;
			}
		}
	}
</style>
