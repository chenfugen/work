export function getPath(pageName, productKey, deviceId, bindType, pageNum) {
	if(productKey == 'a1C6AilwYUc' || productKey == 'a1EUR5GZocU' || productKey == ' a1383EOcIDK' || productKey == 'a1bA2DszH3T' ) {  //大方
		return pageName == "device_commercialTwo" ? "/device_commercialOne/" + deviceId + "/" + pageNum + "/" + bindType : "/device_commercialTwo/" + deviceId + "/" + pageNum + "/" + bindType
	}
	if(productKey == 'a1ZLeXs5VCX' || productKey == 'a12KzXXwRii') {            //老款
		return pageName == "device_xy" ? "/device_xy/" + deviceId + "/" + pageNum + "/" + bindType : "/device_yh/" + deviceId + "/" + pageNum + "/" + bindType
	}
	if(productKey == 'a1EnF8F09Au' || productKey == 'a1XpqYZQgUK' || productKey == 'a1N7o2G3pMR' ) {     //venus中央软净水机
		return pageName == "newDevice_xy" ? "/newDevice_yh/" + deviceId + "/" + pageNum + "/" + bindType : "/newDevice_xy/" + deviceId + "/" + pageNum + "/" + bindType
	}
	if(productKey == 'a1NRXrQiNne' || productKey == 'a1W00QYyJY1' || productKey == 'a1b4T0fB2F0' ||  productKey == 'a1HUvqDjXGW' ||  productKey == 'a1H9wp1EpvQ') {                 //分质供水
		return pageName == "device_separateOne" ? "/device_separateTwo/" + deviceId + "/" + pageNum + "/" + bindType : "/device_separateOne/" + deviceId + "/" + pageNum + "/" + bindType
	}
	if(productKey == 'a14quLhzzTs') {          //一体机
		return pageName == "allInOneDeviceOne" ? "/allInOneDeviceTwo/" + deviceId + "/" + pageNum + "/" + bindType : "/allInOneDeviceOne/" + deviceId + "/" + pageNum + "/" + bindType
	}
	if(productKey == 'a19PPOycX99' || productKey == 'a1Yg9aEngv9') {        //超级RO
		return pageName == "RODeviceTwo" ? "/RODeviceOne/" + deviceId + "/" + pageNum + "/" + bindType : "/RODeviceTwo/" + deviceId + "/" + pageNum + "/" + bindType
	}
	if(productKey == 'a19wjchgPyv' || productKey == 'a1RDGsLn2gH') {     //三级超滤
		return pageName == "CUFDeviceOne" ? "/CUFDeviceTwo/" + deviceId + "/" + pageNum + "/" + bindType : "/CUFDeviceOne/" + deviceId + "/" + pageNum + "/" + bindType
	}
}

export function getRouterPath(productKey, deviceId, pageNum, bindType) {
	if(productKey == 'a1C6AilwYUc' || productKey == 'a1EUR5GZocU' || productKey == ' a1383EOcIDK' || productKey == 'a1bA2DszH3T' ) {
		return "/device_commercialOne/" + deviceId + "/" + pageNum + "/" + bindType
	}
	if(productKey == 'a1ZLeXs5VCX' || productKey == 'a12KzXXwRii') {
		return "/device_xy/" + deviceId + "/" + pageNum + "/" + bindType
	}
	if(productKey == 'a1EnF8F09Au' || productKey == 'a1XpqYZQgUK' || productKey == 'a1N7o2G3pMR' ) {
		return "/newDevice_yh/" + deviceId + "/" + pageNum + "/" + bindType
	}
	if(productKey == 'a1NRXrQiNne' || productKey == 'a1W00QYyJY1' || productKey == 'a1b4T0fB2F0' ||  productKey == 'a1HUvqDjXGW' ||  productKey == 'a1H9wp1EpvQ') {   
	   return "/device_separateOne/" + deviceId + "/" + pageNum + "/" + bindType
	}
	if(productKey == 'a14quLhzzTs') {
		return "/allInOneDeviceTwo/" + deviceId + "/" + pageNum + "/" + bindType
	}
	if(productKey == 'a19PPOycX99' || productKey == 'a1Yg9aEngv9') {
		return "/RODeviceOne/" + deviceId + "/" + pageNum + "/" + bindType
	}
	if(productKey == 'a19wjchgPyv' || productKey == 'a1RDGsLn2gH') {
		return "/CUFDeviceTwo/" + deviceId + "/" + pageNum + "/" + bindType
	}
}

export function getProductNumber(productKey) {	  //产品开发顺序，以及产品排序顺序
	if(productKey == 'a1ZLeXs5VCX' || productKey == 'a12KzXXwRii' || productKey == 'a1N7o2G3pMR') {
		return 0
	}
	if(productKey == 'a1EnF8F09Au') {
		return 1
	}
	if(productKey == 'a1XpqYZQgUK') {
		return 2
	}
	if(productKey == 'a1C6AilwYUc' || productKey == 'a1EUR5GZocU' || productKey == ' a1383EOcIDK' || productKey == 'a1bA2DszH3T' ||  productKey == 'a1H9wp1EpvQ') {
		return 3
	}
	if(productKey == 'a1NRXrQiNne' || productKey == 'a1W00QYyJY1' || productKey == 'a1b4T0fB2F0' ||  productKey == 'a1HUvqDjXGW') {   
		return 4
	}
	if(productKey == 'a14quLhzzTs') {
		return 5
	}
	if(productKey == 'a19PPOycX99' || productKey == 'a1Yg9aEngv9') {
		return 6
	}
	if(productKey == 'a19wjchgPyv' || productKey == 'a1RDGsLn2gH') {
		return 7
	}
}

export function getTitle(productKey) {
	switch(productKey) {
		case "a1ZLeXs5VCX":
		case "a1XpqYZQgUK":
			return "Venus中央净水机";
			break;
		case "a1N7o2G3pMR":
		case "a12KzXXwRii":
		case "a1EnF8F09Au":
			return "Venus中央软水机";
			break;
		case "a1C6AilwYUc":
			return "大方先生Pro_CSZ_WRL100B_WIFI";
			break;
		case "a1EUR5GZocU":
			return "大方先生Pro_CSZ_WRL100B_2G";
			break;
		case "a1383EOcIDK":
			return "大方先生Pro_CSZ_WNL100B_WIFI";
			break;
		case "a1bA2DszH3T":
			return "大方先生Pro_CSZ_WNL100B_2G";
			break;
		case "a1NRXrQiNne":
			return "子母星II代RO_2G";
			break;
		case "a1W00QYyJY1":
			return "子母星II代RO_WiFi";
			break;
		case "a1b4T0fB2F0":
			return "子母星II代NF_2G";
			break;
		case "a1HUvqDjXGW":
		case "a1H9wp1EpvQ":
			return "子母星II代NF_WiFi";
			break;
		case "a14quLhzzTs":
			return "Venusmix净软一体机";
			break;
		case "a19PPOycX99":
			return "三级RO_WIFI版";
			break;
		case "a1Yg9aEngv9":
			return "GE三级RO_2G版";
			break;
		case "a19wjchgPyv":
			return "三级超滤_WIFI版";
			break;
		case "a1RDGsLn2gH":
			return "三级超滤_2G版";
			break;
		default:
			return "Venus中央净水机";
	}
}