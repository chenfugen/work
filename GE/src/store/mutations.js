export default{
	changeDevice(state,payload){ // A组件点击更改餐馆名称为 A餐馆
	   state.deviceMsg=payload // 把方法传递过来的参数，赋值给state中的resturantName
	},
	changeDevicecomercial(state,payload){ //商用机
	   state.device_commercialMsg=payload 
	},
	changeUserInfo(state,payload){
		 state.userInfo=payload; 
	},
	changeNewDevice(state,payload){ //新月雨荷新协议
	   state.newDeviceMsg=payload 
	},
	changeDeviceList(state,payload){ 
		 state.deviceList=payload; 
	},
	changeClient(state,payload){  //mqtt
		 state.client=payload; 
	},
	changeUserClient(state,payload){  //userClient
		 state.userClient=payload; 
	},
	changeTransition(state,payload){  //切换方向
		 state.transitionName=payload; 
	}
}
