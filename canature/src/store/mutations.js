export default{
	changeDevice(state,payload){ //老协议
	   state.deviceMsg=payload 
	},
	changeDevicecomercial(state,payload){ //新协议
	   state.device_commercialMsg=payload 
	},
	changeNewDevice(state,payload){ //新月雨荷新协议
	   state.newDeviceMsg=payload 
	},
	changeUserInfo(state,payload){
		 state.userInfo=payload; 
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
