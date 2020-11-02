<template>
	<div id="menuChildAdd">
		<el-form
			:model="ruleForm"
			:rules="rules"
			ref="ruleForm"
			label-width="110px"
			class="demo-ruleForm"
			size="small"
		>
			<div class="basic" v-if="$route.name != '编辑菜谱'">
				<p class="menuAdd-title">步骤</p>
				<el-steps
					:active="1"
					finish-status="success"
					style="width: 55%; margin: 10px auto"
				>
					<el-step title="主菜谱"></el-step>
					<el-step title="子菜谱"></el-step>
				</el-steps>
			</div>
			<!-- ——————————————————————基本信息—————————————————————— -->
			<div class="basic">
				<p class="menuAdd-title">基本信息</p>
				<div class="basic-box">
					<div class="basic-left" style="width: 350px; float: left">
						<el-form-item
							label="菜谱ID:"
							prop="menuId"
							ref="menuId"
							>{{ ruleForm.menuId }}</el-form-item
						>
						<el-form-item label="菜谱名称:">{{
							ruleForm.name
						}}</el-form-item>
						<el-form-item label="产品型号:">{{
							ruleForm.deviceModel
						}}</el-form-item>
						<el-form-item
							label="口味:"
							prop="flavorV2"
							ref="flavorV2"
						>
							<el-select
								v-model.trim="ruleForm.flavorV2"
								placeholder="请选择口味"
							>
								<el-option
									v-for="(i, x) in $store.state.oldStore
										.flavors"
									:key="x"
									:label="i.text"
									:value="i.value"
								></el-option>
							</el-select>
						</el-form-item>
						<el-form-item
							label="份量:"
							prop="people"
							ref="people"
							:rules="[
								{
									required: true,
									message: '请输入份量',
									trigger: 'blur',
								},
							]"
						>
							<el-input
								size="small"
								v-model.trim="ruleForm.people"
								:maxlength="20"
							></el-input>
						</el-form-item>
						<el-form-item
							label="烹饪耗时:"
							prop="minute"
							ref="minute"
							:rules="[
								{
									required: true,
									message: '请输入烹饪耗时',
									trigger: 'blur',
								},
							]"
						>
							<el-input-number
								size="mini"
								step-strictly
								v-model.trim="ruleForm.hour"
								controls-position="right"
								:min="0"
								:max="ruleForm.minute ? 98 : 99"
							></el-input-number
							>&nbsp;&nbsp;小时
							<el-input-number
								size="mini"
								step-strictly
								:disabled="ruleForm.hour === 99"
								v-model.trim="ruleForm.minute"
								controls-position="right"
								:min="minMinute"
								:max="59"
							></el-input-number
							>&nbsp;&nbsp;分钟
						</el-form-item>
					</div>
					<div
						class="basic-right"
						style="float: right; position: relative"
						v-if="
							ruleForm.imageName != '' &&
							ruleForm.imageName != $store.state.oldStore.imgSrc
						"
					>
						<!-- 主菜谱图片 -->
						<img
							v-if="
								ruleForm.appImageName &&
								ruleForm.appImageName !=
									$store.state.oldStore.imgSrc
							"
							v-loading="imageLoading"
							alt="app成品图片"
							:src="
								$store.state.oldStore.imgSrc +
								ruleForm.appImageName +
								'&token=' +
								$store.state.oldStore.token
							"
							style="
								width: 393px;
								height: 393px;
								border-radius: 5px;
							"
						/>
						<img
							v-if="
								ruleForm.imageName &&
								ruleForm.imageName !=
									$store.state.oldStore.imgSrc
							"
							v-loading="appImageLoading"
							:src="
								$store.state.oldStore.imgSrc +
								ruleForm.imageName +
								'&token=' +
								$store.state.oldStore.token
							"
							alt="成品图片"
							class="avatar"
							style="
								width: 256px;
								height: 393px;
								border-radius: 5px;
								margin: 55px 0px 0px 30px;
							"
						/>
					</div>
					<div class="basic-footer" style="width: 100%; float: left">
						<el-form-item
							label="步骤简介:"
							prop="stepDescribe"
							ref="stepDescribe"
						>
							<el-input
								type="textarea"
								rows="5"
								v-model="ruleForm.stepDescribe"
								placeholder="步骤简介"
							></el-input>
						</el-form-item>
					</div>
				</div>
			</div>
			<!-- ——————————————————————食材准备—————————————————————— -->
			<div class="food-preparation">
				<p class="menuAdd-title">食材准备</p>
				<div class="food-box">
					<draggable
						class="list-group"
						tag="div"
						v-model="ruleForm.seasonings"
					>
						<transition-group
							type="transition"
							name="transition-list"
							class="transition"
							tag="div"
						>
							<div
								class="food-conter"
								v-for="(item, index) in ruleForm.seasonings"
								:key="index"
							>
								<p>食材{{ index + 1 }}:</p>
								<i
									class="iconfont icondel"
									@click="foodDel(index)"
								></i>
								<div class="foodForm" style="width: 450px">
									<el-form-item
										label="名称:"
										:prop="'seasonings.' + index + '.name'"
										:ref="'seasonings.' + index + '.name'"
										:rules="{
											required: true,
											message: '请输入食材名称',
											trigger: 'blur',
										}"
									>
										<el-input
											v-model.trim="item.name"
										></el-input>
									</el-form-item>
									<el-form-item
										label="用量:"
										:prop="'seasonings.' + index + '.value'"
										:ref="'seasonings.' + index + '.value'"
										:rules="{
											required: true,
											message: '请输入食材用量',
											trigger: 'blur',
										}"
									>
										<el-input
											v-model.trim="item.value"
										></el-input>
									</el-form-item>
									<el-form-item
										label="使用方法:"
										:prop="'seasonings.' + index + '.note'"
										:ref="'seasonings.' + index + '.note'"
									>
										<el-input
											type="textarea"
											rows="2"
											v-model.trim="item.note"
										></el-input>
									</el-form-item>
								</div>
							</div>
						</transition-group>
					</draggable>
					<!-- end -->
					<div class="food-conter add" @click="foodAdd">
						<i class="iconfont iconadd"></i>
						新增食材
					</div>
				</div>
			</div>
			<!-- ——————————————————————步骤列表—————————————————————— -->
			<div class="detailed-steps clearfloat">
				<p class="menuAdd-title">详细步骤</p>
				<div
					class="add"
					@click="stepsAdd('abc')"
					v-if="ruleForm.steps.length == 1"
				>
					<i class="iconfont iconadd"></i>
					新增步骤
				</div>
				<div
					class="steps-box clearfloat"
					v-for="(item, index) in ruleForm.steps"
					:key="index"
				>
					<!-- :style="index==ruleForm.steps.length-2?(item.clickType==1?'height:400px;':''):(item.clickType==1?'height:400px;':'')" -->
					<div class="move" v-if="item.clickType != 2">
						<el-button
							:disabled="index == 0"
							@click.native="move('up', index)"
							>上移</el-button
						>
						<el-button
							:disabled="index == ruleForm.steps.length - 2"
							style="margin: 10px 0 0 0"
							@click.native="move('down', index)"
							>下移</el-button
						>
						<el-button
							@click.native="stepsAdd(index)"
							style="margin: 10px 0 0 0"
							v-if="index != ruleForm.steps.length - 1"
							>新增</el-button
						>
					</div>
					<p>
						{{
							item.clickType == 2 ? "结束" : "步骤" + (index + 1)
						}}:
					</p>
					<i
						class="iconfont icondel"
						:style="
							item.clickType == 2 ? 'visibility: hidden;' : ''
						"
						@click="stepsDel(index)"
					></i>
					<div class="steps-right" v-if="item.clickType != 1">
						<i
							@click="delImg(index)"
							title="删除图片"
							v-if="item.fileName && item.fileName != ''"
							class="iconwrong delImg one"
						></i>
						<el-upload
							:ref="index + 'stepsImg'"
							:http-request="function () {}"
							class="avatar-uploader"
							:on-change="
								(file, filesList) =>
									imgPreview(file, filesList, index)
							"
							action="api/lexy/api/common/file"
							:show-file-list="false"
							accept=".jpg"
							:style="stepsImgSize"
						>
							<img
								v-if="item.fileName && item.fileName != ''"
								:src="item.fileName"
								class="avatar"
								:style="stepsImgSize"
							/>
							<div class="userAdvert-add2" :style="stepsImgSize">
								单击上传
							</div>
						</el-upload>
						<span>
							支持扩展名：.jpg
							<br />
							图片比例：{{
								ruleForm.deviceModel == "CF5" ||
								ruleForm.deviceModel == "CF6" ||
								ruleForm.deviceModel == "CF7" ||
								ruleForm.deviceModel == "CF8"
									? "300:360"
									: "1:1"
							}}
							<br />图片建议小于50KB
						</span>
						<!-- <span class="selectImg" @click="imgBoxTrue(index)">从图片集选择</span> -->
					</div>
					<div class="steps-conter">
						<el-form-item
							v-if="item.clickType != 1"
							label="步骤描述:"
							:prop="'steps.' + index + '.describe'"
							:ref="'steps.' + index + '.describe'"
							:rules="{
								required: true,
								message: '请输入步骤描述',
								trigger: 'blur',
							}"
						>
							<el-input
								type="textarea"
								rows="3"
								v-model.trim="item.describe"
								show-word-limit
								maxlength="400"
							></el-input>
						</el-form-item>
						<div v-if="item.clickType == 1">
							<el-form-item
								label="启动前描述:"
								:prop="'steps.' + index + '.beforeDescribe'"
								:ref="'steps.' + index + '.beforeDescribe'"
								:rules="{
									required: true,
									message: '请输入启动前描述',
									trigger: 'blur',
								}"
							>
								<el-input
									type="textarea"
									rows="2"
									v-model.trim="item.beforeDescribe"
									show-word-limit
									maxlength="400"
								></el-input>
							</el-form-item>
							<el-form-item
								label="运行中描述:"
								:prop="'steps.' + index + '.runningDescribe'"
								:ref="'steps.' + index + '.runningDescribe'"
								:rules="{
									required: true,
									message: '请输入运行中描述',
									trigger: 'blur',
								}"
							>
								<el-input
									type="textarea"
									rows="2"
									v-model.trim="item.runningDescribe"
									show-word-limit
									maxlength="400"
								></el-input>
							</el-form-item>
							<el-form-item
								label="暂停中描述:"
								:prop="'steps.' + index + '.stopDescribe'"
								:ref="'steps.' + index + '.stopDescribe'"
								:rules="{
									required: true,
									message: '请输入暂停中描述',
									trigger: 'blur',
								}"
							>
								<el-input
									type="textarea"
									rows="2"
									v-model.trim="item.stopDescribe"
									show-word-limit
									maxlength="400"
								></el-input>
							</el-form-item>
						</div>
						<div class="steps-c-l">
							<el-form-item
								label="可进行动作:"
								prop="action"
								ref="action"
							>
								<el-select
									v-model.trim="item.clickType"
									:disabled="item.clickType == 2"
									@change="clickTypeChange(index)"
									placeholder="请选择可进行动作"
								>
									<el-option
										label="下一步"
										:value="0"
									></el-option>
									<el-option
										label="启动"
										:value="1"
									></el-option>
									<el-option
										v-if="item.clickType == 2"
										label="结束"
										:value="2"
									></el-option>
								</el-select>
							</el-form-item>
							<el-form-item
								label="称重"
								prop="weight"
								v-if="item.clickType == 0"
								ref="weight"
							>
								<el-radio-group v-model.trim="item.weight">
									<el-radio :label="true">有</el-radio>
									<el-radio :label="false">没有</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item
								label="档位设置:"
								prop="gear"
								v-if="item.clickType == 1"
								ref="gear"
							>
								<el-select
									v-model.trim="item.motorStatus"
									placeholder="请选择档位"
									@change="(val) => cookingC(val, index)"
								>
									<el-option
										v-for="(item, index) in gearList"
										:label="item.label"
										:value="item.value"
										:key="index"
									></el-option>
								</el-select>
							</el-form-item>
							<el-form-item
								label="烹饪时间:"
								prop="cookingTime"
								ref="cookingTime"
								v-if="item.clickType == 1"
								style="width: 500px"
							>
								<el-input-number
									size="small"
									step-strictly
									v-model.trim="item.cookingMinute"
									controls-position="right"
									:min="0"
									:max="
										item.cookingSecond
											? ruleTemp[index] - 1
											: ruleTemp[index]
									"
								></el-input-number
								>&nbsp;&nbsp;
								<el-input-number
									style="margin-left: 15px"
									step-strictly
									size="small"
									v-model.trim="item.cookingSecond"
									:disabled="
										item.cookingMinute === ruleTemp[index]
									"
									controls-position="right"
									:min="item.cookingMinute ? 0 : 1"
									:max="59"
								></el-input-number
								>&nbsp;&nbsp;秒 <br />最大时间:
								<font style="color: #f02b54">{{
									ruleTemp[index]
								}}</font
								>min
							</el-form-item>
						</div>
						<div class="steps-c-r">
							<el-form-item
								label="温度设置:"
								prop="temperature"
								v-if="
									item.clickType == 1 &&
									item.motorStatus != 12
								"
								ref="temperature"
							>
								<el-select
									v-model.trim="item.temp"
									placeholder="请选择温度"
									@change="(val) => cookingC(val, index)"
								>
									<el-option
										label="不设置(加热不启动)"
										:value="0"
										>不设置(加热不启动)</el-option
									>
									<el-option
										v-if="ruleForm.deviceModel == 'CF7'"
										label="37"
										:value="37"
									></el-option>
									<el-option
										v-for="(item, index) in tempList"
										:label="item"
										:value="item"
										:key="index"
									></el-option>
								</el-select>
							</el-form-item>
							<el-form-item
								label="正反转"
								prop="turn"
								ref="turn"
								v-if="
									item.clickType == 1 &&
									item.motorStatus != 12
								"
							>
								<el-radio-group v-model.trim="item.rotation">
									<el-radio :label="0">正转</el-radio>
									<el-radio :label="1">反转</el-radio>
								</el-radio-group>
							</el-form-item>
						</div>
					</div>
				</div>
			</div>
		</el-form>
		<p style="text-align: center">
			<el-button @click="resetForm('ruleForm')">取消</el-button>
			<el-button type="danger" @click="submitForm('ruleForm')"
				>保存</el-button
			>
		</p>
		<!-- ——————————————图片集—————————————— -->
	</div>
</template>
<script>
import draggable from "vuedraggable";
import { Message } from "element-ui";
import loginVue from "../../login.vue";
export default {
	components: {
		draggable,
	},
	computed: {
		stepsImgSize() {
			let flag =
				this.ruleForm.deviceModel == "CF5" ||
				this.ruleForm.deviceModel == "CF6" ||
				this.ruleForm.deviceModel == "CF7" ||
				this.ruleForm.deviceModel == "CF8";
			return flag
				? {
						height: "180px",
						width: "150px",
						"line-height": "180px",
				  }
				: {
						height: "180px",
						width: "180px",
						"line-height": "180px",
				  };
		},
		isShortcut() {
			if (
				(this.ruleForm.menuId == "9001" ||
					this.ruleForm.menuId == "9002" ||
					this.ruleForm.menuId == "9003" ||
					this.ruleForm.menuId == "9004" ||
					this.ruleForm.menuId == "9005" ||
					this.ruleForm.menuId == "9006" ||
					this.ruleForm.menuId == "9007" ||
					this.ruleForm.menuId == "9008" ||
					this.ruleForm.menuId == "9009") &&
				(this.ruleForm.deviceModel == "A4" ||
					this.ruleForm.deviceModel == "CF3")
			) {
				return true;
			} else {
				return false;
			}
		},
		isChinese() {
			var ret = false;
			for (var i = 0; i < this.ruleForm.name.length && !ret; i++) {
				//遍历每一个文本字符
				ret = this.ruleForm.name.charCodeAt(i) >= 10000; //判断文本字符的unicode值
			}
			return ret;
		},
		minMinute() {
			// return 0;
			return this.ruleForm.hour > 0 ? 0 : 1;
		},
		tempList() {
			if (this.ruleForm.deviceModel == "CF6") {
				return this.$staticData.menuTempListCF6;
			} else {
				return this.$staticData.menuTempList;
			}
		},
		gearList() {
			return this.$staticData.menuGearList;
		},
	},
	watch: {
		ruleForm: {
			handler(val, oldVal) {
				//如果提交菜谱停止执行
				if (!this.$store.state.oldStore.riving) {
					return false;
				}
				this.ruleForm.steps.forEach((item, i) => {
					// if(this.ruleTemp[i]>480){
					//     return false;
					// }
					let temp = 480,
						motorStatus = 480;
					if (item.motorStatus != 12) {
						if (item.temp <= 75) {
							temp = 480;
						} else if (item.temp > 75 && item.temp <= 110) {
							temp = 180;
						} else if (item.temp > 110) {
							temp = 30;
						}
						if (item.motorStatus <= 5 && item.motorStatus > 3) {
							motorStatus = 180;
						} else if (
							item.motorStatus > 5 &&
							item.motorStatus < 10
						) {
							motorStatus = 5;
						} else if (
							item.motorStatus >= 10 &&
							item.motorStatus < 12
						) {
							motorStatus = 3;
						} else if (item.motorStatus <= 3) {
							motorStatus = 480;
						}
					} else {
						motorStatus = 5;
					}
					if (temp >= motorStatus) {
						this.ruleTemp[i] = motorStatus;
					} else {
						this.ruleTemp[i] = temp;
					}
					if (!item.cookingMinute) {
						//分钟数不存在或者为0
						this.$nextTick(function () {
							this.$set(item, "cookingMinute", 0);
						});
						if (!this.ruleForm.steps[i].cookingSecond) {
							this.$nextTick(function () {
								this.$set(item, "cookingSecond", 1);
							});
						}
					} else {
						if (!item.cookingSecond) {
							//秒数不存在或者为0
							this.$nextTick(function () {
								this.$set(item, "cookingSecond", 0);
							});
							this.$set(item, "cookingSecond", 0);
						}
					}
				});
			},
			deep: true,
		},
	},
	data() {
		return {
			delayedDragging: false,
			isDragging: false,
			//食材分类鼠标盒子
			loading: false,
			uploadNum: 0,
			foodForm: {
				name: "",
				num: "",
				method: "",
			},
			ruleTemp: [480],
			upRuleForm: {
				imageName: "",
				stepImage: [],
			}, //用作对比图片用的
			ruleForm: {
				flavorV2: "", //口味
				people: "", //份量
				first: true,
				operate: true, //自定义控制
				audio: false, //是否需要语音播报
				model: 0, //0：常规模式，1：大厨模式
				hour: 0, //耗时(小时)f
				minute: 0, //耗时(分钟)f
				// minute: 0,//耗时(分钟)
				stepDescribe: "", //步骤描述
				seasonings: [
					{
						name: "", //食材名称
						value: "", //食材用量
						note: "", //使用方法
						order: 0,
					},
				],
				steps: [
					{
						stepImage: "", //步骤图片
						fileName: "", //图片名称
						stepFile: "", //图片文件
						describe: "", //步骤描述
						clickType: 0, //可进行动作
						weight: false, //称重
						// sweight:0,//重量设置
						beforeDescribe: "", //启动前
						runningDescribe: "", //运行中
						stopDescribe: "", //暂停中
						motorStatus: 0, //档位
						temp: 0, //温度
						rotation: 0, //正反转
						cookingMinute: 0, //烹饪时间(分钟)
						cookingSecond: 0, //烹饪时间(秒)
						cookingTime: 0, //烹饪时间
						stime: 0, //秒数
					},
					{
						stepImage: "", //步骤图片
						fileName: "", //图片名称
						stepFile: "", //图片文件
						describe: "", //步骤描述
						clickType: 2, //可进行动作
						weight: false, //称重
						// sweight:0,//重量设置
						motorStatus: 0, //档位
						temp: 0, //温度
						rotation: 0, //正反转
						cookingMinute: 0, //烹饪时间(分钟)
						cookingSecond: 0, //烹饪时间(秒)
						cookingTime: 0, //烹饪时间
						stime: 0, //秒数
					},
				],
			},
			rules: {
				//   deviceModel: [{ required: true, message: '请选择产品型号', trigger: 'change' }],
				//   menuId    : [{ required: true, message: '请输入菜谱ID', trigger: 'blur' }],
				//   name: [{ required: true, message: '请输入菜谱名称', trigger: 'blur' }],
				//   style: [{ validator: threeOrone, trigger: 'blur' },],
				//   cuisine: [{ validator: threeOrone, trigger: 'blur' },],
				//   category: [{ validator: threeOrone, trigger: 'blur' },],
				flavorV2: [
					{
						required: true,
						message: "请选择口味",
						trigger: "change",
					},
				],
				//   keyWord: [{ required: true, message: '请输入关键字', trigger: 'blur' }],
				stepDescribe: [
					{
						required: true,
						message: "请输入步骤简介",
						trigger: "blur",
					},
				],
				describe: [
					{
						required: true,
						message: "请输入步骤简介",
						trigger: "blur",
					},
				],
				beforeDescribe: [
					{
						required: true,
						message: "请输入启动前描述",
						trigger: "blur",
					},
				],
				runningDescribe: [
					{
						required: true,
						message: "请输入运行中描述",
						trigger: "blur",
					},
				],
				stopDescribe: [
					{
						required: true,
						message: "请输入暂停中描述",
						trigger: "blur",
					},
				],
			},
			imgList: {
				//暂存文件名
				imageName: "",
				stepImage: [],
			},
			upImgList: [], //更新暂存文件名
			addImgList: [], //只存名字的文件库
			batchFile: {
				fileNames: [], //文件名，多个文件名用#号隔开
				oldFileNames: [], //旧的文件名
				files: [],
			},
			updata: false, //是否是编辑菜谱
			updataImg: false, //是否修改了图片
			imgBoxIndex: "无", //图片集下标
			// 图片加载
			imageLoading: true,
			appImageLoading: true,
			// ——————————————图片集——————————————
			// imgBox: false, //图片集弹出框
			// imgBoxList: [
			// 	{
			// 		isActive: true,
			// 		img: "./drawingboard0.png",
			// 		name: "drawingboard0",
			// 	},
			// 	{
			// 		isActive: false,
			// 		img: "./drawingboard1.png",
			// 		name: "drawingboard1",
			// 	},
			// 	{
			// 		isActive: false,
			// 		img: "./drawingboard2.png",
			// 		name: "drawingboard2",
			// 	},
			// 	{
			// 		isActive: false,
			// 		img: "./drawingboard3.png",
			// 		name: "drawingboard3",
			// 	},
			// 	{
			// 		isActive: false,
			// 		img: "./drawingboard4.png",
			// 		name: "drawingboard4",
			// 	},
			// 	{
			// 		isActive: false,
			// 		img: "./drawingboard5.png",
			// 		name: "drawingboard5",
			// 	},
			// 	{
			// 		isActive: false,
			// 		img: "./drawingboard6.png",
			// 		name: "drawingboard6",
			// 	},
			// 	{
			// 		isActive: false,
			// 		img: "./drawingboard7.png",
			// 		name: "drawingboard7",
			// 	},
			// ],
		};
	},
	mounted() {
		history.pushState(null, null, document.URL);
		window.addEventListener("popstate", function () {
			history.pushState(null, null, document.URL);
		});
		this.$http
			.selectMenuModel({
				classify: 1,
			})
			.then((res) => {
				if (res.data.success) {
					this.$store.commit("add_menuModel", res.data.datas);
				}
			});
		this.ruleTemp = [480];
		let routeObj = Object.assign({}, this.$route);
		// 新增子菜单
		if (
			routeObj.name == "新增子菜谱" &&
			!routeObj.params.menuId &&
			!routeObj.params.importData
		) {
			this.$store.commit("chg_riving", false);
			this.$router.replace({
				path: "/menu/list",
			});
		}
		if (routeObj.name == "新增子菜谱" && !routeObj.params.importData) {
			for (name in routeObj.params) {
				this.$set(this.ruleForm, name, routeObj.params[name]);
			}
		}
		// 来自导入数据
		if (this.$route.params.importData) {
			this.$route.params.importData.steps.forEach((i) => {
				let temp = 480,
					motorStatus = 480;
				if (i.temp <= 75) {
					temp = 480;
				} else if (i.temp > 75 && i.temp <= 110) {
					temp = 180;
				} else if (i.temp > 110) {
					temp = 30;
				}
				if (i.motorStatus <= 5 && i.motorStatus > 3) {
					motorStatus = 180;
				} else if (i.motorStatus > 5 && i.motorStatus < 10) {
					motorStatus = 5;
				} else if (i.motorStatus >= 10 && i.motorStatus < 12) {
					motorStatus = 3;
				} else if (i.motorStatus <= 3) {
					motorStatus = 480;
				}
				if (temp >= motorStatus) {
					this.ruleTemp.push[motorStatus];
				} else {
					this.ruleTemp.push[temp];
				}
			});
			for (let x in routeObj.params.importData.parentMenu) {
				if (x != "collectTimes" && x != "cookTimes" && x != "id") {
					this.$set(
						this.ruleForm,
						x,
						this.$route.params.importData.parentMenu[x]
					);
				}
			}
			this.$set(this.ruleForm, "parentMenu", {
				id: routeObj.params.id,
			});
			for (let x in this.ruleForm) {
				if (x in routeObj.params.importData) {
					if (
						x != "parentMenu" &&
						x != "minute" &&
						x != "name" &&
						x != "deviceModel"
					) {
						this.ruleForm[x] = routeObj.params.importData[x];
					}
				}
			}
			this.ruleForm.menuId = routeObj.params.parent.menuId;
			this.ruleForm.name = routeObj.params.parent.name;
			this.ruleForm.deviceModel = routeObj.params.parent.deviceModel;
			this.ruleForm.flavorV2 = this.$store.state.oldStore.flavors.find(
				(i) => i.text == this.ruleForm.flavorV2
			).value;
			this.ruleForm.imageName = routeObj.params.parent.imageName;
			this.ruleForm.appImageName = routeObj.params.parent.appImageName;
			this.ruleForm.steps.forEach((i, x) => {
				i.stepImage = "";
			});
			delete this.ruleForm.id;
			delete this.ruleForm.importData;
			this.$nextTick(() => {
				this.$set(
					this.ruleForm,
					"minute",
					routeObj.params.importData.minute
				);
			});
		}
	},
	methods: {
		goBack() {
			this.$router.replace({
				path: "/menu/",
			});
		},
		// 提交表单
		submitForm(formName) {
			var motorStatusTrue = true;
			let obj = Object.assign({}, this.ruleForm),
				fileNames = "";
			this.$refs[formName].validate((valid, object) => {
				if (
					obj.deviceModel == "A4" ||
					obj.deviceModel == "CF3" ||
					obj.deviceModel == "CF5"
				) {
					obj.steps.forEach((i, x) => {
						if (i.temp == 37) {
							motorStatusTrue = 6;
						}
					});
				}
				if (obj.deviceModel == "CF7" || obj.deviceModel == "CF6") {
					obj.audio = true;
				}
				if (motorStatusTrue == 6) {
					this.$message.warning(
						"A4/CF5/CF3设备不可将温度设置为37度！"
					);
					return false;
				}
				this.$store.commit("chg_riving", false);
				obj.steps.forEach((item, i) => {
					if (item.clickType != 0 && item.weight) {
						item.weight = false;
					}
				});
				if (valid || this.isShortcut) {
					var data = new FormData(),
						ajax = this.$http.addMenu,
						upImgName = false, //更新需要上传的文件名
						delImgName = false, //更新需要删除的文件名
						fileStepList = []; // 有文件上传的步骤列表
					obj.steps.forEach((i, x) => {
						if (
							i.fileName != "" &&
							i.fileName &&
							i.fileName.length > 0
						) {
							if (upImgName) {
								upImgName += "#" + i.stepImage;
							} else {
								upImgName = i.stepImage;
							}
							data.append("files", obj.steps[x].stepFile);
							fileStepList.push(x);
						}
					});
					// 内置菜
					if (obj.buildIn) {
						data.append("buildIn", true);
					} else {
						data.append("buildIn", false);
					}
					if (upImgName) {
						this.$showLoading();
						this.$http.batchFile(data, this.upload).then((res) => {
							this.$hideLoading();
							if (res.data.success) {
								fileNames = res.data.fileNames.split("#");
								for (let i in fileStepList) {
									obj.steps[fileStepList[i]].stepImage =
										fileNames[i];
								}
								for (let i in obj.steps) {
									delete obj.steps[i].stepFile;
									delete obj.steps[i].fileName;
								}
								ajax(obj).then((res) => {
									this.$hideLoading();
									if (res.data.success) {
										this.$router.push({
											path: "/menu/list",
										});
										this.$store.commit("chg_riving", true);
									} else {
										//菜谱提交失败将原来的文件预览重置
										this.$store.commit("chg_riving", true);
										if (this.updata) {
											this.upRule();
										}
									}
								});
							} else {
								this.$router.push({
									path: "/menu/list",
								});
							}
						});
					} else {
						ajax(this.ruleForm).then((res) => {
							this.loading = false;
							if (res.data.success) {
								this.$router.push({
									path: "/menu/list",
								});
								this.$store.commit("chg_riving", true);
							} else {
								//菜谱提交失败将原来的文件预览重置
								this.$store.commit("chg_riving", true);
								if (this.updata) {
									this.upRule();
								}
							}
						});
					}
				} else {
					for (let i in object) {
						let dom = this.$refs[i];
						if (
							Object.prototype.toString.call(dom) !==
							"[object Object]"
						) {
							dom = dom[0];
						}
						dom.$el.scrollIntoView({
							block: "center",
							behavior: "smooth",
						});
						break;
					}
				}
			});
		},
		// 重制表单
		resetForm(formName) {
			// this.$refs[formName].resetFields();
			this.$router.push({
				path: "/menu/list",
			});
		},
		// 修改设备时
		deviceChang() {
			this.ruleForm.cuisine1 = [];
			this.ruleForm.category1 = [];
			this.ruleForm.flavor1 = [];
		},
		// 计算上传数量
		upload(e) {
			this.uploadNum = ((e.loaded / e.total) * 100) | 0;
		},
		// 添加食材
		foodAdd() {
			this.ruleForm.seasonings.push({
				name: "", //食材名称
				value: "", //食材用量
				note: "", //使用方法
				order: this.ruleForm.seasonings.length,
			});
		},
		// 可进行动作修改时
		clickTypeChange(index) {
			if (this.ruleForm.steps[index].clickType == 1) {
				this.delImg(index);
			} else {
				this.ruleForm.steps[index].motorStatus = 0; //档位
				this.ruleForm.steps[index].temp = 0; //温度
				this.ruleForm.steps[index].rotation = 0; //正反转
				this.ruleForm.steps[index].cookingTime = 1; //烹饪时间
				this.ruleForm.steps[index].cookingMinute = 0; //正反转
				this.ruleForm.steps[index].cookingSecond = 1; //烹饪时间
				this.ruleForm.steps[index].stime = 0; //秒数、
				if (this.ruleForm.deviceModel == "CF3") {
					this.ruleForm.steps[index].motorStatus = 2; //档位
				}
			}
			if (this.ruleForm.steps[index].clickType == 1) {
				this.ruleForm.steps[index].describe = ""; //启动前
			} else {
				this.ruleForm.steps[index].beforeDescribe = "请按压旋钮启动"; //启动前
				this.ruleForm.steps[index].runningDescribe =
					"烹饪中，如需暂停，请按压旋钮"; //运行中
				this.ruleForm.steps[index].stopDescribe =
					"暂停中，如需烹饪，请按压旋钮启动"; //暂停中
			}
		},
		// 温度档位修改时
		cookingC(val, index) {
			this.$nextTick(() => {
				if (
					this.ruleForm.steps[index].cookingMinute >
					this.ruleTemp[index]
				) {
					this.ruleForm.steps[index].cookingMinute = this.ruleTemp[
						index
					];
				}
				if (this.ruleForm.steps[index].motorStatus == 12) {
					this.ruleForm.steps[index].temp = 0;
					this.ruleForm.steps[index].rotation = 0;
				}
			});
		},
		// 删除食材
		foodDel(index) {
			this.ruleForm.seasonings.splice(index, 1);
		},
		// 新增步骤
		stepsAdd(index) {
			if (index === "abc") {
				index = this.ruleForm.steps.length - 1;
			} else {
				index = index + 1;
			}
			this.ruleForm.steps.splice(index, 0, {
				stepImage: "", //步骤图片
				fileName: "", //图片名称
				stepFile: "", //图片文件
				describe: "", //步骤描述
				clickType: 0, //可进行动作
				weight: false, //称重
				motorStatus: 0, //档位
				temp: 0, //温度
				rotation: 0, //正反转
				cookingTime: 1, //烹饪时间
				stime: 0, //秒数
				beforeDescribe: "请按压旋钮启动", //启动前
				runningDescribe: "烹饪中，如需暂停，请按压旋钮", //运行中
				stopDescribe: "暂停中，如需烹饪，请按压旋钮启动", //暂停中
				cookingSecond: 0, //暂停中
				cookingMinute: 0, //暂停中
			});
			if (this.ruleForm.deviceModel == "CF3") {
				this.ruleForm.steps[index].motorStatus = 2; //档位
			}
			this.ruleTemp.push(480);
		},
		// 删除步骤
		stepsDel(index) {
			this.ruleForm.steps.splice(index, 1);
		},
		//删除图片
		delImg(src) {
			let steps = Object.assign([], this.ruleForm.steps);
			steps[src].fileName = "";
			steps[src].stepFile = "";
			steps[src].stepImage = "";
			this.$set(this.ruleForm, "steps", steps);
		},
		//生成特殊图片名称
		imgPreview(file, fileList, src) {
			let steps = Object.assign([], this.ruleForm.steps),
				image = new Image(),
				base64 = null;
			var imgName =
				this.$filters.uuid() +
				"_" +
				new Date().valueOf() +
				"." +
				file.name.split(".")[1];
			var _this = this;
			var event = event || window.event;
			var file = event.target.files[0];
			var reader = new FileReader();
			image.onload = function () {
				// 部分设备型号对图片尺寸有要求
				let flag =
					_this.ruleForm.deviceModel == "CF5" ||
					_this.ruleForm.deviceModel == "CF6" ||
					_this.ruleForm.deviceModel == "CF7" ||
					_this.ruleForm.deviceModel == "CF8";
				if (flag) {
					if (image.width != 300 || image.height != 360) {
						Message.error("图片尺寸错误");
						_this.$refs[src + "stepsImg"][0].clearFiles();
					} else {
						steps[src].stepImage = imgName; //保存图片名称
						steps[src].stepFile = file; //保存图片文件
						steps[src].fileName = base64;
						_this.$set(_this.ruleForm, "steps", steps);
					}
				} else {
					steps[src].stepImage = imgName; //保存图片名称
					steps[src].stepFile = file; //保存图片文件
					steps[src].fileName = base64;
					_this.$set(_this.ruleForm, "steps", steps);
				}
			};
			//转base64
			reader.onload = function (e) {
				base64 = e.target.result; //将图片路径赋值给src
				image.src = base64;
			};
			reader.readAsDataURL(file);
		},
		// 移动步骤
		move(move, index) {
			var arr = this.ruleForm.steps;
			if (move == "up") {
				this.ruleForm.steps[index] = arr.splice(
					index - 1,
					1,
					arr[index]
				)[0];
			} else {
				this.ruleForm.steps[index] = arr.splice(
					index + 1,
					1,
					arr[index]
				)[0];
			}
		},
	},
	destroyed() {
		window.removeEventListener("popstate", this.goBack, false);
	},
};
</script>
<style lang="less">
@import "./style/menuChild.less";
</style>