//登录页
import login from '../components/login'
//个人主页面
import person from '../components/home/person'
//测试页
import test from '../components/test/test'
//管理者主页面
import admin from '../components/home/admin'

//工作人员操作页面
import search from '../components/staff/search'
import assets from '../components/staff/assets'
import appliance from '../components/staff/appliance'
import assetCatalogue from '../components/staff/assetList'
import thing from '../components/staff/thing'
import applydeviceDetail from '../components/staff/deviceDetail'
import apply from '../components/staff/apply'
import units from '../components/staff/units'
import department  from '../components/staff/department'
import applyLog  from '../components/staff/applyLog'

//管理员操作页面
import deviceCode from '../components/admin/code'
import register from '../components/admin/register'
import approval from '../components/admin/approval'
import approvalDetail from '../components/admin/approvalDetail'
import createAsset from '../components/admin/createAsset'
import createCatalogue from '../components/admin/createCatalogue'
import advanced from '../components/admin/advanced'
import assetClass from '../components/admin/assetClass'
import print from '../components/admin/print'
import deviceList from '../components/admin/deviceList'
import assetList from '../components/admin/assetList'
import asset from '../components/admin/asset'
import catalogue from '../components/admin/catalogue'
import device from '../components/admin/device'
import newDevice from '../components/admin/newDevice'
import deviceDetail from '../components/admin/deviceDetail'
import deviceSelect from '../components/admin/deviceSelect'
import qrcode from '../components/admin/qrcode'
import scanCode from '../components/admin/scanCode'
import bind from '../components/admin/bind'
//个人页
import my from '../components/user/my'
import userinfo from '../components/user/userinfo'
import changePass  from '../components/user/changePass'

const routes = [{
		path: "/",
		component: login, //登录页
		meta: {
			title: '注册',
			level:1
		}
	},
	{
		path: "/person",
		component: person,
		meta: {
			title: '首页',
			level:2
		}
	},
	{
		path: "/admin",
		component: admin,
		meta: {
			title: '首页',
			level:2
		}
	},
	{
		path: "/search",
		component: search,
		meta: {
			title: '搜索',
			level:3
		}
	},
	{
		path: "/assets",
		component: assets,
		meta: {
			title: '资产分类',
			level:3
		}
	},
	{
		path: "/appliance/:id/:name",
		component: appliance,
		meta: {
			title: '资产',
			level:4
		}
	},
	{
		path: "/assetList/:id/:name",
		component: assetList,
		meta: {
			title: '资产',
			level:4
		}
	},
	{
		path: "/assetCatalogue/:id/:name",
		component:assetCatalogue,
		meta: {
			title: '资产',
			level:5
		}
	},
	{
		path: "/thing/:id/:model",
		component: thing,
		meta: {
			title: '资产',
			level:3
		}
	},
	{
		path: "/applydeviceDetail/:id",
		component: applydeviceDetail,
		meta: {
			title: '详情页',
			level:7
		}
	},
	{
		path: "/deviceDetail/:id",
		component: deviceDetail,
		meta: {
			title: '详情页',
			level:8
		}
	},
	{
		path: "/apply/:id/:name/:model",
		component: apply,
		meta: {
			title: '申请',
			level:6
		}
	},
	{
		path: "/applyLog",
		component: applyLog,
		meta: {
			title: '申请',
			level:4
		}
	},
	{
		path: "/units/:id",
		component: units,
		meta: {
			title: '单位',
			level:6
		}
	},
	{
		path: "/department/:id/:company",
		component: department,
		meta: {
			title: '部门',
			level:7
		}
	},
	{
		path: "/my",
		component: my,
		meta: {
			title: '我的',
			level:3
		}
	},
	{
		path: "/userinfo",
		component: userinfo,
		meta: {
			title: '个人资料',
			level:4
		}
	},
	{
		path: "/changePass",
		component: changePass,
		meta: {
			title: '修改密码',
			level:5
		}
	},
	{
		path: "/deviceCode",
		component: deviceCode,
		meta: {
			title: '手动输入',
			level:3
		}
	},
	{
		path: "/register",
		component: register,
		meta: {
			title: '登记',
			level:3
		}
	},
	{
		path: "/assetClass",
		component: assetClass,
		meta: {
			title: '资产分类',
			level:4
		}
	},
	{
		path: "/print",
		component: print,
		meta: {
			title: '确认登记',
			level:3
		}
	},
	{
		path: "/deviceList/:model",
		component: deviceList,
		meta: {
			title: '设备列表',
			level:2
		}
	},
	{
		path: "/approval",
		component: approval,
		meta: {
			title: '审批',
			level:3
		}
	},
	{
		path: "/approvalDetail/:id",
		component: approvalDetail,
		meta: {
			title: '审批详情'
		}
	},
	{
		path: "/advanced",
		component: advanced,
		meta: {
			title: '高级',
			level:3
		}
	},
	{
		path: "/createAsset/:id",
		component: createAsset,
		meta: {
			title: '新建资产分类',
			level:5
		}
	},
	{
		path: "/asset/:id/:name",
		component: asset,
		meta: {
			title: '资产分类列表',
			level:4
		}
	},
	{
		path: "/catalogue/:id/:name/:assetName",
		component: catalogue,
		meta: {
			title: '资产名录列表',
			level:5
		}
	},
	{
		path: "/device/:id/:model/:name/:assetName",
		component: device,
		meta: {
			title: '物品情况',
			level:6
		}
	},
	{
		path: "/createCatalogue/:id/:name/:assetName",
		component: createCatalogue,
		meta: {
			title: '新建资产名录',
			level:6
		}
	},
	{
		path: "/newDevice/:id/:name/:assetName",
		component: newDevice,
		meta: {
			title: '新建资产名录',
			level:7
		}
	},{
		path: "/deviceSelect/:id/:name",
		component: deviceSelect,
		meta: {
			title: '资产选择',
			level:5
		}
	},{
		path: "/scanCode",
		component: scanCode,
		meta: {
			title: '二维码扫描',
			level:5
		}
	},
	{
		path: "/qrcode/:ids",
		component: qrcode,
		meta: {
			title: '打印',
			level:7
		}
	},
  {
  	path: "/bind/:id/:name/:model",
  	component: bind,
  	meta: {
  		title: '绑定',
  		level:9
  	}
  },
]

export default routes
