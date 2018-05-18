import index from './components/index.vue'
import form from './components/form.vue'
import insuranceInfro from './components/insuranceInfro.vue'
import insuranceAct from './components/insuranceAct.vue'
import order from './components/order.vue'
import lplc from './components/lplc.vue'
import zhg from './components/zhg.vue'
import hp from './components/hp.vue'
import payResult from './components/payResult.vue'

var routes = [{
		path: "/form/:home/:name/:id",
		component: form
	},
	{
		path: "/insuranceInfro/:id",
		component: insuranceInfro
	},
	{
		path: "/insuranceAct",
		component: insuranceAct
	},
	{
		path: "/order/:id",
		component: order
	},
	{
		path: "/lplc",
		component: lplc
	},
	{
		path: "/zhg",
		component: zhg
	},
	{
		path: "/hp",
		component: hp
	},
	{
		path: "/payResult",
		component: payResult
	},
	{
		path: "/:title/:home",
		component: index
	}
]

export default routes