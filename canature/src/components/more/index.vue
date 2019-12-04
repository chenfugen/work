<template>
		<div :class="className" id="moveDiv" ref="moveDiv" @mousedown="down" @touchstart="down" @mousemove="move" @touchmove="move" @mouseup="end" @touchend="end" >
			<i class="iconfont iconliebiao"></i>
			<span class="text">  功能</span>
		</div>
</template>

<script>
	export default {
		data() {
			return {
				isShow: false,
				flags: false,
				position: {
					x: 0,
					y: 0
				},
				pageInfo: {
					totalPage: 11
				},
				nx: '',
				ny: '',
				dx: '',
				dy: '',
				xPum: '',
				yPum: '',
			}
		},
		props: {
			className: String,
		},
		methods: {
			// 实现移动端拖拽
			down() {
				this.flags = true;
				var touch;
				if(event.touches) {
					touch = event.touches[0];
				} else {
					touch = event;
				}
				this.position.x = touch.clientX;
				this.position.y = touch.clientY;
				this.dx = moveDiv.offsetLeft;
				this.dy = moveDiv.offsetTop;
			},
			move() {
				if(this.flags) {
					var touch;
					if(event.touches) {
						touch = event.touches[0];
					} else {
						touch = event;
					}
					this.nx = touch.clientX - this.position.x;
					this.ny = touch.clientY - this.position.y;
					this.xPum = this.dx + this.nx;
					this.yPum = this.dy + this.ny;
					if(this.yPum > 0 && this.xPum > 0 && this.yPum <document.documentElement.clientHeight-this.$refs.moveDiv.offsetHeight&& this.xPum<document.documentElement.clientWidth-this.$refs.moveDiv.offsetWidth) {
						moveDiv.style.left = this.xPum + "px";
						moveDiv.style.top = this.yPum + "px";
					}
//					//阻止页面的滑动默认事件；如果碰到滑动问题，1.2 请注意是否获取到 touchmove
					document.addEventListener("touchmove", function() {
						event.preventDefault();
					}, false);
				}
			},
			//鼠标释放时候的函数
			end() {
				this.flags = false;
			},
		}
	}
</script>
<style lang="scss" scoped>
    .moreTools{
    	position: fixed;
		bottom:0.4rem;
		right: 0.1rem;
		width: 1rem;
		height: 0.4rem;
		/* 如果碰到滑动问题，1.3 请检查 z-index。z-index需比web大一级*/
		z-index: 9999;
		border-radius: 0.8rem;
		background-color: #fff;
        color: #333333;
        box-shadow: 0 5px 20px 0 rgba(0,0,0,0.20);
		.iconfont {
			float: left;
			line-height: 0.4rem;
			margin-left: 0.2rem;
			font-size: 0.24rem;
		}
		.text {
			float: left;
			font-size: 0.16rem;
			line-height: 0.5rem;
		}
    }
	.moreTool {
		position: fixed;
		bottom:0.1rem;
		right: 0.1rem;
		width: 1rem;
		height: 0.4rem;
		/* 如果碰到滑动问题，1.3 请检查 z-index。z-index需比web大一级*/
		z-index: 9999;
		border-radius: 0.8rem;
		background-color: #fff;
        color: #333333;
        box-shadow: 0 5px 20px 0 rgba(0,0,0,0.20);
		.iconfont {
			float: left;
			line-height: 0.4rem;
			margin-left: 0.2rem;
			font-size: 0.24rem;
		}
		.text {
			float: left;
			font-size: 0.16rem;
			line-height: 0.4rem;
		}
	}
</style>