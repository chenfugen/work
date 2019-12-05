export function getPath(pageName, productKey, deviceId, bindType, pageNum) {
	if(productKey == 'a1i8kpwPW9w' || productKey == 'a1u3fpsU6yg') { //商用机
		return pageName == "device_commercialTwo" ? "/device_commercialOne/" + deviceId + "/" + pageNum + "/" + bindType : "/device_commercialTwo/" + deviceId + "/" + pageNum + "/" + bindType
	}
	if(productKey == 'a1ZLeXs5VCX' || productKey == 'a12KzXXwRii') { //旧版新月雨荷
		return pageName == "device_xy" ? "/device_xy/" + deviceId + "/" + pageNum + "/" + bindType : "/device_yh/" + deviceId + "/" + pageNum + "/" + bindType
	}
	if(productKey == 'a1TDQhOZAp3' || productKey == 'a1EGEZQkwUe' || productKey == 'a1yvf75UDl7') { //中央净
		return pageName == "newDevice_xy" ? "/newDevice_xy/" + deviceId + "/" + pageNum + "/" + bindType : "/newDevice_yh/" + deviceId + "/" + pageNum + "/" + bindType
	}
	if(productKey == 'a1TQBPNk4cT' || productKey == 'a1ZTu3R5BKD' || productKey == 'a1VmZ7nWwyQ') { //中央软
		return pageName == "newDevice_yh" ? "/newDevice_yh/" + deviceId + "/" + pageNum + "/" + bindType : "/newDevice_xy/" + deviceId + "/" + pageNum + "/" + bindType
	}
	if(productKey == 'a14quLhzzTs' || productKey == 'a1GYXlFAY1I') { //一体机  
		return pageName == "allInOneDeviceOne" ? "/allInOneDeviceTwo/" + deviceId + "/" + pageNum + "/" + bindType : "/allInOneDeviceOne/" + deviceId + "/" + pageNum + "/" + bindType
	}
	if(productKey == 'a19PPOycX99' || productKey == 'a1Yg9aEngv9') { //三级RO
		return pageName == "RODeviceTwo" ? "/RODeviceOne/" + deviceId + "/" + pageNum + "/" + bindType : "/RODeviceTwo/" + deviceId + "/" + pageNum + "/" + bindType
	}
	if(productKey == 'a19wjchgPyv' || productKey == 'a1RDGsLn2gH') { //超滤
		return pageName == "CUFDeviceOne" ? "/CUFDeviceTwo/" + deviceId + "/" + pageNum + "/" + bindType : "/CUFDeviceOne/" + deviceId + "/" + pageNum + "/" + bindType
	}
	if(productKey == 'a1xjge89hkA' || productKey == 'a1przX9NmYK') { //P7
		return pageName == "P7DeviceOne" ? "/P7DeviceTwo/" + deviceId + "/" + pageNum + "/" + bindType : "/P7DeviceOne/" + deviceId + "/" + pageNum + "/" + bindType
	}
	if(productKey == 'a1DCNZ2cTcL' || productKey == 'a12LTZQEw02' ) { //分质供水
		return pageName == "device_separateOne" ? "/device_separateTwo/" + deviceId + "/" + pageNum + "/" + bindType : "/device_separateOne/" + deviceId + "/" + pageNum + "/" + bindType
	}
}

export function getRouterPath(productKey, deviceId, pageNum, bindType) {
	if(productKey == 'a1i8kpwPW9w' || productKey == 'a1u3fpsU6yg') {
		return "/device_commercialOne/" + deviceId + "/" + pageNum + "/" + bindType
	}
	if(productKey == 'a1TDQhOZAp3' || productKey == 'a1EGEZQkwUe' || productKey == 'a1yvf75UDl7') { //中央净
		return "/newDevice_xy/" + deviceId + "/" + pageNum + "/" + bindType
	}
	if(productKey == 'a1TQBPNk4cT' || productKey == 'a1ZTu3R5BKD' || productKey == 'a1VmZ7nWwyQ') { //中央软
		return "/newDevice_yh/" + deviceId + "/" + pageNum + "/" + bindType
	}
	if(productKey == 'a14quLhzzTs' || productKey == 'a1GYXlFAY1I') {
		return "/allInOneDeviceTwo/" + deviceId + "/" + pageNum + "/" + bindType
	}
	if(productKey == 'a1DCNZ2cTcL' || productKey == 'a12LTZQEw02') { //分质供水
		return "/device_separateOne/" + deviceId + "/" + pageNum + "/" + bindType
	}
	if(productKey == 'a19PPOycX99' || productKey == 'a1Yg9aEngv9') {
		return "/RODeviceOne/" + deviceId + "/" + pageNum + "/" + bindType 
	}
	if(productKey == 'a19wjchgPyv' || productKey == 'a1RDGsLn2gH') {
		return "/CUFDeviceTwo/" + deviceId + "/" + pageNum + "/" + bindType
	}
	if(productKey == 'a1xjge89hkA' || productKey == 'a1przX9NmYK'){
		return "/P7DeviceOne/" + deviceId + "/" + pageNum + "/" + bindType
	}
}
export function getProductNumber(productKey) {   //产品开发顺序，以及产品排序顺序
	if(productKey == 'a1TDQhOZAp3' || productKey == 'a1EGEZQkwUe' || productKey == 'a1yvf75UDl7') { //中央净
		return 1
	}
	if(productKey == 'a1TQBPNk4cT' || productKey == 'a1ZTu3R5BKD' || productKey == 'a1VmZ7nWwyQ') { //中央软
		return 2
	}
	if(productKey == 'a1i8kpwPW9w' || productKey == 'a1u3fpsU6yg') {
		return 3
	}
	if(productKey == 'a1DCNZ2cTcL' || productKey == 'a12LTZQEw02') { //分质供水
		return 4
	}
	if(productKey == 'a14quLhzzTs' || productKey == 'a1GYXlFAY1I') {     //一体机
		return 5
	}
	if(productKey == 'a19PPOycX99' || productKey == 'a1Yg9aEngv9') {   //三级RO
		return 6
	}
	if(productKey == 'a19wjchgPyv' || productKey == 'a1RDGsLn2gH') {   //超滤
		return 7
	}
	if(productKey == 'a1przX9NmYK' || productKey == 'a1xjge89hkA'){    //P7
		return 8
	}
}

export function getTitle(productKey) {
	switch(productKey) {
		case "a1EGEZQkwUe":
			return "极净_GREF10A01";
			break;
		case "a1yvf75UDl7":
			return "极净_GREF20A01";
			break;
		case "a1TDQhOZAp3":
			return "极净_GREF30A01";
			break;
		case "a1TQBPNk4cT":
			return "极润_GREC30A01";
			break;
		case "a1ZTu3R5BKD":
			return "极润_GREC20A01";
			break;
		case "a1VmZ7nWwyQ":
			return "极润_GREC10A01";
			break;
		case "a1u3fpsU6yg":
			return "极尊_GCUN01A02";
			break;
		case "a1i8kpwPW9w":
			return "极尊_GCUR01B05";
			break;
		case "a14quLhzzTs":
			return "Venusmix净软一体机";
			break;
		case "a1GYXlFAY1I":
			return "极颜_GRUS01A01";
			break;
		case "a1DCNZ2cTcL":
			return "极质_GRUD06F01";
			break;
		case "a12LTZQEw02":
			return "极质_GRUD06A01";
			break;
		case "a19PPOycX99":
			return "极纯_GRUR06A01";
			break;
		case "a1Yg9aEngv9":
			return "极纯_GRUR06A01";
			break;
		case "a1xjge89hkA":
			return "极纯_GRUR06A02";
			break;
		case "a19wjchgPyv":
			return "极简_GRUU02A01";
			break;
		case "a1RDGsLn2gH":
			return "极简_GRUU02A01";
			break;
		case "a1przX9NmYK":
			return "极泉_GRUN05A01";
			break;
		default:
			return "极净_GREF10A01";
	}
}