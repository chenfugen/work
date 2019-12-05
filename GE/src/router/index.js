//设备列表
import device from '../components/device'
//旧版新月雨荷
import device_xy from '../components/device/oldDevice/device_xy.vue'
import device_yh from '../components/device/oldDevice/device_yh.vue'
import paraSet from '../components/device/oldDevice/paraSet.vue'

//新版新月雨荷
import newDevice_xy from '../components/device/newDevice/device_xy.vue'
import newDevice_yh from '../components/device/newDevice/device_yh.vue'
import newDeviceSet from '../components/device/newDevice/paraSet.vue'

//商用
import device_commercialOne from '../components/device/commercial/deviceDetailOne.vue'
import device_commercialTwo from '../components/device/commercial/deviceDetailTwo.vue'
import commercialsetTime from '../components/device/commercial/commercialsetTime.vue'
import commercialSet from '../components/device/commercial/commercialSet.vue'
import timing from '../components/device/commercial/timing.vue'

//分质供水
import device_separateOne from '../components/device/separateWater/deviceDetailOne.vue'
import device_separateTwo from '../components/device/separateWater/deviceDetailTwo.vue'
import timingManage from '../components/device/separateWater/timingManage.vue'
import waterFilter from '../components/device/separateWater/filter.vue'
import separateWaterSet from '../components/device/separateWater/set.vue'
import separateWaterTemp from '../components/device/separateWater/temp.vue'

//一体机
import allInOneDeviceOne from '../components/device/allInOne/deviceDetailOne.vue'
import allInOneDeviceTwo from '../components/device/allInOne/deviceDetailTwo.vue'
import allInOneSet from '../components/device/allInOne/set.vue'

//三级Ro
import RODeviceOne from '../components/device/three-levelRO/deviceDetailOne.vue'
import RODeviceTwo from '../components/device/three-levelRO/deviceDetailTwo.vue'
import ROReset from '../components/device/three-levelRO/reset.vue'

//三级超滤
import CUFDeviceOne from '../components/device/CUF/deviceDetailOne.vue'
import CUFDeviceTwo from '../components/device/CUF/deviceDetailTwo.vue'
import CUFset from '../components/device/CUF/CUFset.vue'

//P7
import P7DeviceOne from '../components/device/P7/deviceDetailOne.vue'
import P7DeviceTwo from '../components/device/P7/deviceDetailTwo.vue'
import P7set from '../components/device/P7/reset.vue'

//通用
import deviceInfo from '../components/device/deviceInfo.vue'
import FQ from '../components/device/FQ.vue'
import productState from '../components/device/productState.vue'
import share from '../components/device/share.vue'
import qrcode from '../components/device/qrcode.vue'
import more from '../components/device/more.vue'
import filter from '../components/device/filter.vue'
import waterServe from '../components/device/serve.vue'
import waterTemp from '../components/device/temp.vue'
import faultList from '../components/device/faultList.vue'

//配网
import searchDevice from '../components/device/searchDevice.vue'
import wifiCode from '../components/device/wifiCode.vue'
import networkFlow from '../components/device/networkFlow.vue'
import netWorkSuccess from '../components/device/netWorkSuccess.vue'
import netWorkError from '../components/device/netWorkError.vue'

import map from '../components/map'

import datas from '../components/datas'
import changeCity from '../components/datas/changeCity.vue'

//登录
import login from '../components/login'
import attention from '../components/login/attention.vue'
import addUser from '../components/login/addUser.vue'
import userAgreement from '../components/login/userAgreement.vue'

//个人中心
import user from '../components/user'
import userInfo from '../components/user/userInfo.vue'
import message from '../components/user/message.vue'
import faultMsg from '../components/user/faultMsg.vue'
import filterMsg from '../components/user/filterMsg.vue'
import changePhone from '../components/user/changePhone.vue'
import customer from '../components/user/customer.vue'
import feedback from '../components/user/feedback.vue'
import about from '../components/user/about.vue'
import set from '../components/user/set.vue'
const routes = [{
		path: "/",
		component: login, //登录页
		meta: {
			title: '绑定手机号'
		}
	},
	{
		path: "/userAgreement",
		component: userAgreement, //开能用户协议
		meta: {
			title: '开能用户协议'
		}
	},
	{
		path: "/attention",
		component: attention, //关注
		meta: {
			title: '关注页'
		}
	},
	{
		path: "/addUser",
		component: addUser, //用户完善
		meta: {
			title: '完善资料'
		}
	},
	{
		path: "/user",
		component: user, //用户页
		meta: {
			title: '我的'
		}
	},
	{
		path: '/userInfo',
		component: userInfo,
		meta: {
			title: '用户详情'
		}
	},
	{
		path: '/message',
		component: message,
		meta: {
			title: '消息'
		}
	},
	{
		path: "/faultMsg",
		component: faultMsg,
		meta: {
			title: '故障详情'
		}
	},
	{
		path: '/filterMsg',
		component: filterMsg,
		meta: {
			title: '滤芯详情'
		}
	},
	{
		path: '/changePhone',
		component: changePhone,
		meta: {
			title: '更换手机号'
		}
	},
	{
		path: '/customer',
		component: customer,
	},
	{
		path: '/feedback',
		component: feedback,
		meta: {
			title: '反馈'
		}
	}, {
		path: '/about',
		component: about,
		meta: {
			title: '关于'
		}
	},
	{
		path: '/set',
		component: set,
		meta: {
			title: '设置'
		}
	},
	{
		path: "/map", //地图
		component: map,
		meta: {
			title: '地图'
		}
	},
	{
		path: "/device",
		component: device, //设备
		meta: {
			title: '设备列表'
		}
	},
	{
		path: "/filter",
		component: filter, //设备
		meta: {
			title: '耗材寿命'
		}
	},
	{
		path: "/searchDevice",
		component: searchDevice, //查询设备
		meta: {
			title: '添加设备'
		}
	},
	{
		path: "/networkFlow",
		component: networkFlow,
		meta: {
			title: '配网'
		}
	},
	{
		path: "/wifiCode",
		component: wifiCode, //设备
		meta: {
			title: '配网'
		}
	},
	{
		path: "/netWorkSuccess",
		component: netWorkSuccess, //设备
		meta: {
			title: '配网成功'
		}
	},
	{
		path: "/netWorkError",
		component: netWorkError, //设备
		meta: {
			title: '配网失败'
		}
	},
	{
		path: "/device_xy/:id/:num/:bindType",
		component: device_xy, //设备新月宁波限价房申请条件
		meta: {
			title: '新月'
		}
	},
	{
		path: "/device_yh/:id/:num/:bindType",
		component: device_yh, //设备雨荷
		meta: {
			title: '雨荷'
		}
	},
	{
		path: "/device_commercialOne/:id/:num/:bindType",
		component: device_commercialOne, //设备商用机
		meta: {
			title: '极尊_GCUN01A02'
		}
	},
	{
		path: "/device_commercialTwo/:id/:num/:bindType",
		component: device_commercialTwo, //设备商用机
		meta: {
			title: '极尊_GCUR01B05'
		}
	},
	{
		path: "/commercialsetTime",
		component: commercialsetTime, //商用机定时管理
		meta: {
			title: '定时管理'
		}
	},
	{
		path: "/timing/:set",
		component: timing, //商用机定时管理
		meta: {
			title: '起始定时设置'
		}
	},
	{
		path: "/commercialSet",
		component: commercialSet, //商用机设置
		meta: {
			title: '其他设置'
		}
	},
	{
		path: "/deviceInfo",
		component: deviceInfo, //设备详情
		meta: {
			title: '设备详情'
		}
	},
	{
		path: "/FQ",
		component: FQ, // FQ
		meta: {
			title: 'F&Q'
		}
	},
	{
		path: "/paraSet",
		component: paraSet, //参数设置
		meta: {
			title: '参数设置'
		}
	},
	{
		path: "/productState",
		component: productState, //产品信息
		meta: {
			title: '产品说明'
		}
	},
	{
		path: "/qrcode",
		component: qrcode, //二维码
		meta: {
			title: '分享设备'
		}
	},
	{
		path: "/more",
		component: more, //更多
		meta: {
			title: '更多'
		}
	},
	{
		path: "/share",
		component: share, //分享
		meta: {
			title: '分享'
		}
	},
	{
		path: "/faultList",
		component: faultList, //故障
		meta: {
			title: '故障列表'
		}
	},
	{
		path: "/datas",
		component: datas, //数据
		meta: {
			title: '数据'
		}
	},
	{
		path: "/changeCity",
		component: changeCity, //城市搜索
		meta: {
			title: '城市选择'
		}
	},
	{
		path: "/device_separateOne/:id/:num/:bindType",
		component: device_separateOne, //分质供水
		meta: {
			title: '极质_GRUD06F01'
		}
	},
	{
		path: "/device_separateTwo/:id/:num/:bindType",
		component: device_separateTwo, //分质供水
		meta: {
			title: '极质_GRUD06F01'
		}
	},
	{
		path: "/waterFilter",
		component: waterFilter, //分质滤芯
		meta: {
			title: '滤芯'
		}
	},
	{
		path: "/waterServe",
		component: waterServe, //水质服务
		meta: {
			title: '水质'
		}
	}, {
		path: "/waterTemp",
		component: waterTemp, //水温
		meta: {
			title: '水温'
		}
	},
	{
		path: "/timingManage",
		component: timingManage, //分质设置
		meta: {
			title: '定时管理'
		}
	},
	{
		path: "/separateWaterSet",
		component: separateWaterSet, //分质设置
		meta: {
			title: '定时管理'
		}
	},
	{
		path: "/separateWaterTemp",
		component: separateWaterTemp, //分质水温
		meta: {
			title: '水温'
		}
	},
	{
		path: "/newDevice_xy/:id/:num/:bindType",
		component: newDevice_xy, //设备新月宁波限价房申请条件
		meta: {
			title: '极润_GREC30A01'
		}
	},
	{
		path: "/newDevice_yh/:id/:num/:bindType",
		component: newDevice_yh, //设备雨荷
		meta: {
			title: '极净_GREF30A01'
		}
	},
	{
		path: "/newDeviceSet",
		component: newDeviceSet, //参数设置
		meta: {
			title: '参数设置'
		}
	},
	{
		path: "/allInOneDeviceOne/:id/:num/:bindType",
		component: allInOneDeviceOne, //一体机
		meta: {
			title: '极颜_GRUS01A01'
		}
	},
	{
		path: "/allInOneDeviceTwo/:id/:num/:bindType",
		component: allInOneDeviceTwo, //一体机
		meta: {
			title: '极颜_GRUS01A01'
		}
	},
	{
		path: "/allInOneSet",
		component: allInOneSet, //一体机
		meta: {
			title: '设置'
		}
	},
	{
		path: "/RODeviceOne/:id/:num/:bindType",
		component: RODeviceOne, //三级RO
		meta: {
			title: '极纯_GRUR06A01'
		}
	},
	{
		path: "/RODeviceTwo/:id/:num/:bindType",
		component: RODeviceTwo, //三级RO
		meta: {
			title: '极纯_GRUR06A01'
		}
	},
	{
		path: "/ROReset",
		component: ROReset, //三级RO
		meta: {
			title: '复位'
		}
	},
	{
		path: "/CUFDeviceOne/:id/:num/:bindType",
		component: CUFDeviceOne, //三级超滤
		meta: {
			title: '极简_GRUU02A01'
		}
	},
	{
		path: "/CUFDeviceTwo/:id/:num/:bindType",
		component: CUFDeviceTwo, //三级超滤
		meta: {
			title: '极简_GRUU02A01'
		}
	},
	{
		path: "/CUFset",
		component: CUFset, //三级超滤
		meta: {
			title: '复位'
		}
	},
	{
		path: "/P7DeviceOne/:id/:num/:bindType",
		component: P7DeviceOne, //P7
		meta: {
			title: '极纯_GRUR06A02'
		}
	},
	{
		path: "/P7DeviceTwo/:id/:num/:bindType",
		component: P7DeviceOne, //P7
		meta: {
			title: '极纯_GRUR06A02'
		}
	},
	{
		path: "/P7set",
		component: P7set, //三级超滤
		meta: {
			title: '复位'
		}
	}
]

export default routes