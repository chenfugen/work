<template>
	<div id="menuAdd">
		<el-form
			:model="ruleForm"
			:rules="rules"
			ref="ruleForm"
			label-width="110px"
			class="demo-ruleForm"
			size="small"
		>
			<div class="basic">
				<div class="basic-box">
					<p class="menuAdd-title">
						基本信息
						<el-checkbox style="margin-left: 24px" v-model.trim="ruleForm.recommend">设为推荐菜</el-checkbox>
						<el-checkbox style="margin-left: 24px" v-model.trim="ruleForm.buildIn" v-if="!updata">内置菜</el-checkbox>
					</p>
					<div class="basic-left" style="width: 350px; float: left">
						<el-form-item label="产品型号:" prop="deviceModel" ref="deviceModel">
							<el-select v-model.trim="ruleForm.deviceModel" placeholder="请选择产品型号" disabled></el-select>
						</el-form-item>
						<el-form-item label="菜谱ID:" prop="menuId" ref="menuId">
							<el-input
								type="number"
								@blur="idBlur"
								:onblur="
									ruleForm.menuId == '0000'
										? (ruleForm.menuId = '0001')
										: idQ == 3 && ruleForm.menuId == '000'
										? (ruleForm.menuId = '001')
										: ''
								"
								:onch="
									ruleForm.menuId.length >= idQ
										? (ruleForm.menuId = ruleForm.menuId.slice(
												0,
												idQ
										  ))
										: ''
								"
								οnkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
								v-model.trim="ruleForm.menuId"
								style="width: 120px"
							></el-input>
						</el-form-item>

						<el-form-item label="菜谱名称:" prop="name" ref="name">
							<el-input v-model.trim="ruleForm.name" :maxlength="isChinese ? 8 : 16"></el-input>
						</el-form-item>

						<el-form-item label="智膳宝" prop="cuisine" ref="cuisine">
							<el-select v-model.trim="ruleForm.cuisine" placeholder="不涉及" multiple>
								<el-option
									v-for="(i, x) in $staticData.zhishanbao"
									:key="x"
									:label="i.text"
									:value="i.value"
								></el-option>
							</el-select>
						</el-form-item>

						<el-form-item label="食材分类:" prop="category" ref="category">
							<el-select v-model.trim="ruleForm.category" placeholder="不涉及" multiple>
								<el-option
									v-for="(i, x) in $staticData.zsbcategoryes"
									:key="x"
									:label="i.text"
									:value="i.value"
								></el-option>
							</el-select>
						</el-form-item>

						<!-- <el-form-item label="口味:" prop="flavor" ref="flavor" v-if="ruleForm.deviceModel!='CF5'">
                            <el-select v-model.trim="ruleForm.flavor" placeholder="请选择口味">
                                <el-option v-for="(i,x) in $store.state.oldStore.flavors" :key="x" :label="i.text" :value="i.value"></el-option>
                            </el-select>
						</el-form-item>-->

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
								{
									pattern: /^[\u4E00-\u9FA5A-Za-z0-9_]+$/,
									message: '不能输入特殊字符！',
									trigger: 'blur',
								},
							]"
						>
							<el-input size="small" v-model.trim="ruleForm.people" :maxlength="20"></el-input>
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
								v-model.trim="ruleForm.mHour"
								controls-position="right"
								:min="0"
								:max="ruleForm.mMinute ? 98 : 99"
							></el-input-number>&nbsp;&nbsp;小时
							<el-input-number
								size="mini"
								step-strictly
								:disabled="ruleForm.mHour === 99"
								v-model.trim="ruleForm.mMinute"
								controls-position="right"
								:min="ruleForm.mHour ? 0 : 1"
								:max="59"
							></el-input-number>&nbsp;&nbsp;分钟
						</el-form-item>

						<el-form-item label="关键字:" prop="keyWord" ref="keyWord">
							<el-input
								type="textarea"
								rows="3"
								v-model.trim="ruleForm.keyWord"
								show-word-limit
								maxlength="20"
								placeholder="App搜索时的关键字，关键字之间用逗号分隔"
							></el-input>
						</el-form-item>
					</div>

					<div
						class="basic-right"
						style="
							width: 560px;
							height: 495px;
							float: right;
							margin-right: 40px;
							position: relative;
						"
					>
						<i
							@click="delImg('imageName')"
							title="删除图片"
							v-if="ruleForm.fileName != ''"
							class="iconwrong delImg"
						></i>
						<el-upload
							:http-request="function () {}"
							class="avatar-uploader"
							:on-change="
								(file, filesList) =>
									imgPreview(file, filesList, 'imageName')
							"
							action="api/lexy/api/common/file"
							:show-file-list="false"
							accept=".jpg"
							style="width: 560px; height: 420px"
						>
							<img
								v-if="ruleForm.fileName != ''"
								:src="ruleForm.fileName"
								class="avatar"
								style="width: 560px; height: 420px"
							/>
							<div class="userAdvert-add">单击上传</div>
						</el-upload>
						<span style="font-size: 14px">成品图片</span>
						<span
							style="
								font-size: 14px;
								color: #cccccc;
								float: right;
							"
						>支持扩展名：.jpg,图片比例：4:3,图片大小建议小于50KB</span>
					</div>
					<div class="basic-footer" style="width: 100%; float: left">
						<el-form-item label="菜谱要点:" prop="content" ref="content">
							<el-input type="textarea" rows="3" v-model.trim="ruleForm.content" placeholder="菜谱要点"></el-input>
						</el-form-item>
						<el-form-item label="营养价值:" prop="foodValue" ref="foodValue">
							<el-input type="textarea" rows="3" v-model.trim="ruleForm.foodValue" placeholder="营养价值"></el-input>
						</el-form-item>
						<el-form-item label="步骤简介:" prop="stepDescribe" ref="stepDescribe">
							<el-input type="textarea" rows="5" v-model="ruleForm.stepDescribe" placeholder="步骤简介"></el-input>
						</el-form-item>
					</div>
				</div>
			</div>
			<div class="food-preparation">
				<p class="menuAdd-title">食材准备</p>
				<div class="food-box">
					<draggable class="list-group" tag="div" v-model="ruleForm.seasonings">
						<!-- eslint-disable -->
						<transition-group type="transition" name="transition-list" class="transition" tag="div">
							<div class="food-conter" v-for="(item, index) in ruleForm.seasonings" :key="index">
								<p>食材{{ index + 1 }}:</p>
								<i class="iconfont icondel" @click="foodDel(index)"></i>
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
										<el-input v-model.trim="item.name"></el-input>
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
										<el-input v-model.trim="item.value"></el-input>
									</el-form-item>
									<el-form-item
										label="使用方法:"
										:prop="'seasonings.' + index + '.note'"
										:ref="'seasonings.' + index + '.note'"
									>
										<el-input type="textarea" rows="2" v-model.trim="item.note"></el-input>
									</el-form-item>
								</div>
							</div>
						</transition-group>
						<!-- eslint-ensable -->
					</draggable>
					<!-- end -->
					<div class="food-conter add" @click="foodAdd">
						<i class="iconfont iconadd"></i>
						新增食材
					</div>
				</div>
			</div>
			<div class="detailed-steps">
				<p class="menuAdd-title">详细步骤</p>
				<div class="add" @click="stepsAdd('abc')" v-if="ruleForm.steps.length == 1">
					<i class="iconfont iconadd"></i>
					新增步骤
				</div>
				<div class="steps-box clearfloat" v-for="(item, index) in ruleForm.steps" :key="index">
					<div class="move" v-if="item.clickType != 2">
						<el-button :disabled="index == 0" @click.native="move('up', index)">上移</el-button>
						<el-button
							:disabled="index == ruleForm.steps.length - 2"
							style="margin: 10px 0 0 0"
							@click.native="move('down', index)"
						>下移</el-button>
						<el-button
							@click.native="stepsAdd(index)"
							style="margin: 10px 0 0 0"
							v-if="index != ruleForm.steps.length - 1"
						>新增</el-button>
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
							:http-request="function () {}"
							class="avatar-uploader"
							:on-change="
								(file, filesList) =>
									imgPreview(file, filesList, index)
							"
							action="api/lexy/api/common/file"
							:show-file-list="false"
							accept=".jpg"
							style="height: 240px; width: 180px"
						>
							<img
								v-if="item.fileName && item.fileName != ''"
								:src="item.fileName"
								class="avatar"
								style="
									height: 240px;
									width: 180px;
									background: #d3d3d3;
								"
							/>
							<div class="userAdvert-add2">单击上传</div>
						</el-upload>
						<span>
							支持扩展名：.jpg
							<br />图片比例：3:4
							<br />图片建议小于50KB
						</span>
						<span class="selectImg" @click="imgBoxTrue(index)">从图片集选择</span>
					</div>
					<div class="steps-conter">
						<el-form-item
							v-if="
								!(
									item.clickType == 1 &&
									(ruleForm.deviceModel == 'A4' ||
										ruleForm.deviceModel == 'CF3' ||
										ruleForm.deviceModel == 'CF5')
								)
							"
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
						<div
							v-if="
								item.clickType == 1 &&
								(ruleForm.deviceModel == 'A4' ||
									ruleForm.deviceModel == 'CF3' ||
									ruleForm.deviceModel == 'CF5')
							"
						>
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
							<el-form-item label="可进行动作:" prop="action" ref="action">
								<el-select
									v-model.trim="item.clickType"
									:disabled="item.clickType == 2"
									:change="clickTypeChange(index)"
									@change="clickTypeChange(index)"
									placeholder="请选择可进行动作"
								>
									<el-option label="下一步" :value="0"></el-option>
									<el-option label="启动" :value="1"></el-option>
									<el-option v-if="item.clickType == 2" label="结束" :value="2"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="称重" prop="weight" v-if="item.clickType == 0" ref="weight">
								<el-radio-group v-model.trim="item.weight">
									<el-radio :label="true">有</el-radio>
									<el-radio :label="false">没有</el-radio>
								</el-radio-group>
							</el-form-item>
							<!-- <el-form-item label="重量设置:" prop="sweight">
                                <el-input-number size="small" v-model.trim="item.sweight" controls-position="right" :min="0" :max="500"></el-input-number>&nbsp;&nbsp;g
							</el-form-item>-->
							<el-form-item label="档位设置:" prop="gear" v-if="item.clickType == 1" ref="gear">
								<el-select
									v-model.trim="item.motorStatus"
									placeholder="请选择档位"
									@change="(val) => cookingC(val, index)"
								>
									<el-option label="0档(电机不启动)" :value="0"></el-option>
									<el-option label="L档" :value="1"></el-option>
									<el-option label="1档" :value="2"></el-option>
									<el-option label="2档" :value="3"></el-option>
									<el-option label="3档" :value="4"></el-option>
									<el-option label="4档" :value="5"></el-option>
									<el-option label="5档" :value="6"></el-option>
									<el-option label="6档" :value="7"></el-option>
									<el-option label="7档" :value="8"></el-option>
									<el-option label="8档" :value="9"></el-option>
									<el-option label="9档" :value="10"></el-option>
									<el-option label="10档" :value="11"></el-option>
									<el-option label="和面档" :value="12"></el-option>
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
									v-model.trim="item.sMinute"
									controls-position="right"
									:min="0"
									:max="
										item.sSecond
											? ruleTemp[index] - 1
											: ruleTemp[index]
									"
								></el-input-number>&nbsp;&nbsp;
								<el-input-number
									style="margin-left: 15px"
									step-strictly
									size="small"
									v-model.trim="item.sSecond"
									:disabled="item.sMinute === ruleTemp[index]"
									controls-position="right"
									:min="item.sMinute ? 0 : 1"
									:max="59"
								></el-input-number>&nbsp;&nbsp;秒
								<br />最大时间:
								<font style="color: #f02b54">
									{{
									ruleTemp[index]
									}}
								</font>min
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
									<el-option label="不设置(加热不启动)" :value="0">不设置(加热不启动)</el-option>
									<el-option
										v-if="
											ruleForm.deviceModel != 'A4' &&
											ruleForm.deviceModel == 'CF3' &&
											ruleForm.deviceModel != 'CF5'
										"
										label="37"
										:value="37"
									></el-option>
									<el-option label="40" :value="40"></el-option>
									<el-option label="45" :value="45"></el-option>
									<el-option label="50" :value="50"></el-option>
									<el-option label="55" :value="55"></el-option>
									<el-option label="60" :value="60"></el-option>
									<el-option label="65" :value="65"></el-option>
									<el-option label="70" :value="70"></el-option>
									<el-option label="75" :value="75"></el-option>
									<el-option label="80" :value="80"></el-option>
									<el-option label="85" :value="85"></el-option>
									<el-option label="90" :value="90"></el-option>
									<el-option label="95" :value="95"></el-option>
									<el-option label="98" :value="98"></el-option>
									<el-option label="100" :value="100"></el-option>
									<el-option label="105" :value="105"></el-option>
									<el-option label="110" :value="110"></el-option>
									<el-option label="115" :value="115"></el-option>
									<el-option label="120" :value="120"></el-option>
									<el-option label="125" :value="125"></el-option>
									<el-option label="130" :value="130"></el-option>
									<el-option label="135" :value="135"></el-option>
									<el-option label="140" :value="140"></el-option>
									<el-option label="160" :value="160"></el-option>
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
					<!-- <div class="add" @click="stepsAdd" v-if="index==ruleForm.steps.length-2">
                    <i class="iconfont iconadd"></i>
                    新增步骤
					</div>-->
				</div>
			</div>
		</el-form>
		<p style="text-align: center">
			<el-button @click="resetForm('ruleForm')">取消</el-button>
			<el-button type="danger" @click="submitForm('ruleForm')">保存</el-button>
		</p>

		<el-dialog
			:close-on-click-modal="false"
			title="图片集"
			:visible.sync="imgBox"
			width="856px"
			v-loading="loading"
			:element-loading-text="
				uploadNum == 100
					? '文件上传完成，数据加载中'
					: '文件上传中:' + uploadNum + '%'
			"
			element-loading-spinner="el-icon-loading"
			element-loading-background="rgba(0, 0, 0, 0.8)"
		>
			<div class="imgBox">
				<ul>
					<li
						v-for="(i, x) in imgBoxList"
						:key="x"
						:class="i.isActive ? 'active' : null"
						@click="imgBoxClick(x)"
					>
						<i class="iconfont iconcorrect"></i>
						<img :src="i.img" />
						{{ i.name }}
					</li>
				</ul>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="imgBox = false">取 消</el-button>
				<el-button type="danger" @click="imgBoxYes()">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import draggable from "vuedraggable";
export default {
	components: {
		draggable,
	},
	computed: {
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
		idQ() {
			if (this.ruleForm.deviceModel.indexOf("CF7") != -1) {
				return 4;
			} else {
				return 3;
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
	},
	watch: {
		idQ() {
			if (this.ruleForm.menuId.length < this.idQ) {
				for (var i = this.ruleForm.menuId.length; i < this.idQ; i++) {
					this.ruleForm.menuId = "0" + this.ruleForm.menuId;
				}
			}
		},
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
					if (!item.sMinute) {
						//分钟数不存在或者为0
						this.$nextTick(function () {
							this.$set(item, "sMinute", 0);
						});
						if (!this.ruleForm.steps[i].sSecond) {
							this.$nextTick(function () {
								this.$set(item, "sSecond", 1);
							});
						}
					} else {
						if (!item.sSecond) {
							//秒数不存在或者为0
							this.$nextTick(function () {
								this.$set(item, "sSecond", 0);
							});
							this.$set(item, "sSecond", 0);
						}
					}
				});
			},
			deep: true,
		},
	},
	data() {
		var threeOrone = (rule, value, callback) => {
			if (
				this.ruleForm.cuisine.length > 0 ||
				this.ruleForm.category.length > 0
			) {
				callback();
			} else {
				callback(new Error("智膳宝,食材分类中至少选择一项!"));
			}
		};
		return {
			delayedDragging: false,
			isDragging: false,
			//食材分类鼠标盒子
			foodAbBox: {
				show: false,
				top: 0,
				left: 0,
				index: 0,
				name: "",
				value: "",
				note: "",
			},
			abcList: [
				{ name: "1" },
				{ name: "2" },
				{ name: "3" },
				{ name: "4" },
				{ name: "5" },
			],
			loading: false,
			uploadNum: 0,
			minutes: 60,
			imgBox: false, //图片集弹出框
			imgBoxList: [
				{
					isActive: true,
					img: "./drawingboard0.png",
					name: "drawingboard0",
				},
				{
					isActive: false,
					img: "./drawingboard1.png",
					name: "drawingboard1",
				},
				{
					isActive: false,
					img: "./drawingboard2.png",
					name: "drawingboard2",
				},
				{
					isActive: false,
					img: "./drawingboard3.png",
					name: "drawingboard3",
				},
				{
					isActive: false,
					img: "./drawingboard4.png",
					name: "drawingboard4",
				},
				{
					isActive: false,
					img: "./drawingboard5.png",
					name: "drawingboard5",
				},
				{
					isActive: false,
					img: "./drawingboard6.png",
					name: "drawingboard6",
				},
				{
					isActive: false,
					img: "./drawingboard7.png",
					name: "drawingboard7",
				},
			],
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
				recommend: false, //是否设为推荐菜
				buildIn: false, //是否是内置菜
				deviceModel: "CF5", //产品类型
				deviceType: "智能烹饪机", //产品类型
				menuId: "000", //菜谱ID
				name: "", //菜谱名称
				cuisine: [], //智膳宝
				category: [], //食材分类
				flavor: "", //口味
				people: "", //份量
				mHour: 0, //耗时(小时)f
				mMinute: 0, //耗时(分钟)f
				minute: 0, //耗时(分钟)
				keyWord: "", //关键字
				imageName: "", //成品图片
				fileName: "", //图片名称
				imageFile: "", //图片文件
				content: "", //菜谱要点
				foodValue: "", //营养价值
				stepDescribe: "", //步骤简介
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
						sMinute: 0, //烹饪时间(分钟)
						sSecond: 0, //烹饪时间(秒)
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
						sMinute: 0, //烹饪时间(分钟)
						sSecond: 0, //烹饪时间(秒)
						cookingTime: 0, //烹饪时间
						stime: 0, //秒数
					},
				],
			},
			rules: {
				deviceModel: [
					{
						required: true,
						message: "请选择产品型号",
						trigger: "change",
					},
				],
				menuId: [
					{
						required: true,
						message: "请输入菜谱ID",
						trigger: "blur",
					},
				],
				name: [
					{
						required: true,
						message: "请输入菜谱名称",
						trigger: "blur",
					},
				],
				cuisine: [{ validator: threeOrone, trigger: "blur" }],
				category: [{ validator: threeOrone, trigger: "blur" }],
				flavor: [{ validator: threeOrone, trigger: "blur" }],
				keyWord: [
					{
						required: true,
						message: "请输入关键字",
						trigger: "blur",
					},
				],
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
				oldFileName: [], //旧的文件名
				file: [],
			},
			updata: false, //是否是编辑菜谱
			updataImg: false, //是否修改了图片
			imgBoxIndex: "无", //图片集下标
		};
	},
	mounted() {
		history.pushState(null, null, document.URL);
		window.addEventListener("popstate", function () {
			history.pushState(null, null, document.URL);
		});
		this.ruleTemp = [480];
		if (this.$route.name == "编辑菜谱(CF5)" && !this.$route.params.id) {
			this.$router.push({ path: "/menu/list" });
		}
		if (this.$route.name == "编辑菜谱(CF5)") {
			this.$http.menu5({ id: this.$route.params.id }).then((res) => {
				if (res.data.success) {
					res.data.data.steps.forEach((i) => {
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
					this.ruleForm = res.data.data;
					console.log(this.ruleForm);
					this.upRule();
				}
			});
		}
	},
	methods: {
		goBack() {
			this.$router.replace({ path: "/menu/addCf5" });
			//replace替换原路由，作用是避免回退死循环
		},
		//编辑菜谱
		upRule() {
			this.updata = true;
			this.ruleForm.steps.forEach((i, x) => {
				if (
					i.stepImage &&
					i.stepImage.indexOf(
						window.location.href.split("#")[0] +
							"lexy/api/common/file?fileName="
					) == -1
				) {
					this.$set(
						i,
						"fileName",
						this.$store.state.oldStore.imgSrc + i.stepImage
					);
					this.upRuleForm.stepImage.push(i.stepImage);
				} else {
					this.$set(i, "fileName", "");
				}
			});
			if (
				this.ruleForm.imageName &&
				this.ruleForm.imageName.length > 0 &&
				this.ruleForm.imageName.indexOf(
					window.location.href.split("#")[0] +
						"lexy/api/common/file?fileName="
				) == -1
			) {
				this.$set(
					this.ruleForm,
					"fileName",
					this.$store.state.oldStore.imgSrc + this.ruleForm.imageName
				);
				this.upRuleForm.imageName = this.ruleForm.imageName;
			} else {
				this.$set(this.ruleForm, "fileName", "");
			}
		},
		submitForm(formName) {
			var motorStatusTrue = true;
			this.$refs[formName].validate((valid, object) => {
				if (
					this.ruleForm.deviceModel == "A4" ||
					this.ruleForm.deviceModel == "CF3" ||
					this.ruleForm.deviceModel == "CF5"
				) {
					this.ruleForm.steps.forEach((i, x) => {
						// if(i.motorStatus == 12){
						//     motorStatusTrue = 5;
						// }
						if (i.temp == 37) {
							motorStatusTrue = 6;
						}
					});
				}
				// if(motorStatusTrue==5){
				//     this.$message.warning('A4/CF5设备不可选择和面档！');
				//     return false;
				// }else
				if (motorStatusTrue == 6) {
					this.$message.warning("A4/CF5设备不可将温度设置为37度！");
					return false;
				}
				this.$store.commit("chg_riving", false);
				this.ruleForm.steps.forEach((item, i) => {
					if (item.clickType != 0 && item.weight) {
						item.weight = false;
					}
				});
				// if(this.ruleForm.menuId<=100&&this.ruleForm.deviceModel=='CF7'){
				//     this.ruleForm.buildIn = true;
				// }
				if (valid || this.isShortcut) {
					var data = new FormData(),
						ajax = this.$http.addMenu5,
						minutes = this.minutes,
						upImgName = false, //更新需要上传的文件名
						delImgName = false; //更新需要删除的文件名
					//更新菜谱
					if (this.updata) {
						ajax = this.$http.updataMenu5;
						if (
							this.upRuleForm.imageName != this.ruleForm.imageName
						) {
							//当图片有变更
							if (
								this.upRuleForm.imageName &&
								this.upRuleForm.imageName.length > 0
							) {
								data.append(
									"oldFileName",
									this.upRuleForm.imageName
								);
							}
							upImgName = this.ruleForm.imageName;
							data.append("file", this.ruleForm.imageFile);
						}
						this.ruleForm.steps.forEach((i, x) => {
							if (
								this.upRuleForm.stepImage.indexOf(
									i.stepImage
								) == -1
							) {
								if (i.stepImage && i.stepImage.length > 0) {
									if (upImgName) {
										upImgName +=
											"#" +
											this.ruleForm.steps[x].stepImage;
									} else {
										upImgName = this.ruleForm.steps[x]
											.stepImage;
									}
									data.append(
										"file",
										this.ruleForm.steps[x].stepFile
									);
								}
							} else {
								this.upRuleForm.stepImage.splice(
									this.upRuleForm.stepImage.indexOf(
										i.stepImage
									),
									1
								);
							}
						});
						this.upRuleForm.stepImage.forEach((i, x) => {
							data.append("oldFileName", i);
						});
					} else {
						//新增菜谱
						if (
							this.ruleForm.fileName.length &&
							this.ruleForm.fileName.length > 0
						) {
							// ruleForm.imageFile = ruleForm.fileName;//将64码赋值给文件字段
							upImgName = this.ruleForm.imageName;
							data.append("file", this.ruleForm.imageFile);
						}
						this.ruleForm.steps.forEach((i, x) => {
							if (
								i.fileName != "" &&
								i.fileName &&
								i.fileName.length > 0
							) {
								// i.stepFile = i.fileName;
								if (upImgName) {
									upImgName += "#" + i.stepImage;
								} else {
									upImgName = i.stepImage;
								}
								// upImgName += '#'+i.stepImage;
								data.append(
									"file",
									this.ruleForm.steps[x].stepFile
								);
							}
						});
					}
					// 内置菜图片名称拼接
					if (this.ruleForm.buildIn) {
						if (upImgName && upImgName.length > 0) {
							var buildinNames = upImgName.split("#");
							upImgName = false;
							buildinNames.forEach((item) => {
								if (upImgName) {
									if (item.indexOf("-inner.") == -1) {
										upImgName =
											upImgName +
											"#" +
											item.split(".")[0] +
											"-inner." +
											item.split(".")[1];
									} else {
										upImgName = upImgName + "#" + item;
									}
								} else {
									if (item.indexOf("-inner.") == -1) {
										upImgName =
											item.split(".")[0] +
											"-inner." +
											item.split(".")[1];
									} else {
										upImgName = item;
									}
								}
							});
							if (
								this.ruleForm.imageName &&
								this.ruleForm.imageName.length > 0
							) {
								if (
									this.ruleForm.imageName.indexOf(
										"-inner."
									) == -1
								) {
									this.ruleForm.imageName =
										this.ruleForm.imageName.split(".")[0] +
										"-inner." +
										this.ruleForm.imageName.split(".")[1];
								}
							}
							this.ruleForm.steps.forEach((i, x) => {
								if (i.stepImage && i.stepImage.length > 0) {
									if (i.stepImage.indexOf("-inner.") == -1) {
										i.stepImage =
											i.stepImage.split(".")[0] +
											"-inner." +
											i.stepImage.split(".")[1];
									}
								}
							});
						}
					}
					if (upImgName) {
						this.loading = true;
						this.$http.file(data, this.upload).then((res) => {
							this.loading = false;
							if (res.data.success) {
								this.loading = true;
								this.ruleForm.imageName = res.data.fileName;
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
							} else {
								this.$router.push({ path: "/menu/list" });
							}
						});
					} else {
						ajax(this.ruleForm).then((res) => {
							this.loading = false;
							if (res.data.success) {
								this.$router.push({ path: "/menu/list" });
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
							//这里是针对遍历的情况（多个输入框），取值为数组
							dom = dom[0];
						} //第一种方法（包含动画效果）
						dom.$el.scrollIntoView({
							//滚动到指定节点
							block: "center", //值有start,center,end，nearest，当前显示在视图区域中间
							behavior: "smooth", //值有auto、instant,smooth，缓动动画（当前是慢速的）
						}); //第二种方法
						//window.scrollTo(0,diff- 276) //同上
						break; //因为我们只需要检测一项,所以就可以跳出循环了
					}
				}
			});
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
			this.$router.push({ path: "/menu/list" });
		},
		deviceChang() {
			this.ruleForm.cuisine = [];
			this.ruleForm.category = [];
		},
		upload(e) {
			this.uploadNum = ((e.loaded / e.total) * 100) | 0;
		},
		foodAdd() {
			this.ruleForm.seasonings.push({
				name: "", //食材名称
				value: "", //食材用量
				note: "", //使用方法
				order: this.ruleForm.seasonings.length,
			});
		},
		clickTypeChange(index) {
			if (this.ruleForm.steps[index].clickType == 1) {
				this.delImg(index);
			} else {
				this.ruleForm.steps[index].motorStatus = 0; //档位
				this.ruleForm.steps[index].temp = 0; //温度
				this.ruleForm.steps[index].rotation = 0; //正反转
				this.ruleForm.steps[index].cookingTime = 1; //烹饪时间
				this.ruleForm.steps[index].sMinute = 0; //正反转
				this.ruleForm.steps[index].sSecond = 1; //烹饪时间
				this.ruleForm.steps[index].stime = 0; //秒数
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
		idBlur() {
			if (this.ruleForm.menuId.length < this.idQ) {
				for (var i = this.ruleForm.menuId.length; i < this.idQ; i++) {
					this.ruleForm.menuId = "0" + this.ruleForm.menuId;
				}
			}
		},
		cookingC(val, index) {
			this.$nextTick(() => {
				if (this.ruleForm.steps[index].sMinute > this.ruleTemp[index]) {
					this.ruleForm.steps[index].sMinute = this.ruleTemp[index];
				}
				if (this.ruleForm.steps[index].motorStatus == 12) {
					this.ruleForm.steps[index].temp = 0;
					this.ruleForm.steps[index].rotation = 0;
				}
			});
		},
		foodDel(index) {
			this.ruleForm.seasonings.splice(index, 1);
		},
		stepsAdd(index) {
			// if(this.ruleForm)
			if (index === "abc") {
				// if(this.ruleForm.steps.length==1){
				// }
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
				sSecond: 0, //暂停中
				sMinute: 0, //暂停中
			});
			this.ruleTemp.push(480);
		},
		stepsDel(index) {
			this.ruleForm.steps.splice(index, 1);
		},
		//图片集功能
		imgBoxClick(x) {
			this.imgBoxList.forEach((i) => {
				i.isActive = false;
			});
			this.imgBoxList[x].isActive = !this.imgBoxList[x].isActive;
		},
		imgBoxYes() {
			this.imgBoxList.forEach((i, x) => {
				if (i.isActive) {
					if (this.imgBoxIndex != "无") {
						var image = new Image();
						var dataURL,
							file,
							imgBoxIndex = this.imgBoxIndex;
						image.src = i.img; //图片路径
						var imgName =
							this.$filters.uuid() +
							"_" +
							new Date().valueOf() +
							".png";
						var _this = this;
						image.onload = function () {
							var canvas = document.createElement("canvas");
							canvas.width = image.width;
							canvas.height = image.height;
							var ctx = canvas.getContext("2d");
							ctx.drawImage(
								image,
								0,
								0,
								image.width,
								image.height
							);
							var ext = image.src
								.substring(image.src.lastIndexOf(".") + 1)
								.toLowerCase();
							dataURL = canvas.toDataURL("image/" + ext); //将图片转码为base64
							var arr = dataURL.split(","),
								mime = arr[0].match(/:(.*?);/)[1],
								bstr = atob(arr[1]),
								n = bstr.length,
								u8arr = new Uint8Array(n);
							while (n--) {
								u8arr[n] = bstr.charCodeAt(n);
							}
							file = new File([u8arr], imgName, { type: mime });
							_this.ruleForm.steps[
								imgBoxIndex
							].stepImage = imgName; //保存图片名称
							_this.ruleForm.steps[imgBoxIndex].fileName = i.img; //将图片路径赋值给src
							_this.ruleForm.steps[imgBoxIndex].stepFile = file; //保存图片文件
						};
					}
				}
			});
			this.imgBoxIndex = "无";
			this.imgBox = false;
		},
		imgBoxTrue(index) {
			this.imgBoxIndex = index;
			this.imgBox = true;
		},
		delImg(src) {
			//删除图片
			var _this = this;
			if (src == "imageName") {
				_this.ruleForm.imageName = "";
				_this.ruleForm.fileName = "";
				_this.ruleForm.imageFile = "";
			} else {
				_this.ruleForm.steps[src].fileName = "";
				_this.ruleForm.steps[src].stepFile = "";
				_this.ruleForm.steps[src].stepImage = "";
			}
		},
		imgPreview(file, fileList, src) {
			//生成特殊图片名称
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
			//转base64
			reader.onload = function (e) {
				//是否是主图
				if (src == "imageName") {
					_this.ruleForm.fileName = e.target.result; //将图片路径赋值给src
				} else {
					_this.ruleForm.steps[src].fileName = e.target.result; //将图片路径赋值给src
				}
			};
			if (src == "imageName") {
				_this.ruleForm.imageName = imgName; //保存图片名称
				_this.ruleForm.imageFile = file; //保存图片文件
			} else {
				_this.ruleForm.steps[src].stepImage = imgName; //保存图片名称
				_this.ruleForm.steps[src].stepFile = file; //保存图片文件
			}
			reader.readAsDataURL(file);
		},
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
@import "./style/menuAddCf5.less";
</style>
