var commercialList = ['a1C6AilwYUc', 'a1EUR5GZocU', 'a1383EOcIDK', 'a1bA2DszH3T', 'a1wxRSEG0lI', 'a1bcXaJWejM','a14OIdWW184']; //大方先生
var newCommercialList = ['a1eQs13V9Io']; //大方新增
var oldDeviceList = ['a1ZLeXs5VCX', 'a12KzXXwRii']; //旧版新月雨荷
var newDeviceList = ['a1EnF8F09Au', 'a1XpqYZQgUK', 'a1N7o2G3pMR', 'a1i1JW1eizb']; //venus中央软净水机
var separateDeviceList = ['a1NRXrQiNne', 'a1W00QYyJY1', 'a1b4T0fB2F0', 'a1HUvqDjXGW', 'a1H9wp1EpvQ', 'a1lPXdxh7vV','a1jpjYxJfRS']; //分质供水
var newSeparateDeviceList = ['a1GogUUtYSR','a131lEShgsO','a1LPpt2Qhxc']; //新分质供水
var allInOneDeviceList = ['a14quLhzzTs']; //一体机
var RODeviceList = ['a19PPOycX99', 'a1Yg9aEngv9']; //三级RO
var CUFDeviceList = ['a19wjchgPyv', 'a1RDGsLn2gH']; //超滤



export function getPath(pageName, productKey, deviceId, bindType, pageNum) {
  if (commercialList.indexOf(productKey) > -1) {
    return pageName == "device_commercialTwo" ? "/device_commercialOne/" + deviceId + "/" + pageNum + "/" + bindType :
      "/device_commercialTwo/" + deviceId + "/" + pageNum + "/" + bindType
  }

  if (newCommercialList.indexOf(productKey) > -1) {
    return pageName == "new_commercialTwo" ? "/new_commercialOne/" + deviceId + "/" + pageNum + "/" + bindType :
      "/new_commercialTwo/" + deviceId + "/" + pageNum + "/" + bindType
  }

  if (oldDeviceList.indexOf(productKey) > -1) {
    return pageName == "device_xy" ? "/device_xy/" + deviceId + "/" + pageNum + "/" + bindType : "/device_yh/" +
      deviceId + "/" + pageNum + "/" + bindType
  }

  if (newDeviceList.indexOf(productKey) > -1) {
    return pageName == "newDevice_xy" ? "/newDevice_yh/" + deviceId + "/" + pageNum + "/" + bindType : "/newDevice_xy/" +
      deviceId + "/" + pageNum + "/" + bindType
  }

  if (separateDeviceList.indexOf(productKey) > -1) {
    return pageName == "device_separateOne" ? "/device_separateTwo/" + deviceId + "/" + pageNum + "/" + bindType :
      "/device_separateOne/" + deviceId + "/" + pageNum + "/" + bindType
  }

  if (newSeparateDeviceList.indexOf(productKey) > -1) {
    return pageName == "device_newSeparateOne" ? "/device_newSeparateTwo/" + deviceId + "/" + pageNum + "/" + bindType :
      "/device_newSeparateOne/" + deviceId + "/" + pageNum + "/" + bindType
  }

  if (allInOneDeviceList.indexOf(productKey) > -1) {
    return pageName == "allInOneDeviceOne" ? "/allInOneDeviceTwo/" + deviceId + "/" + pageNum + "/" + bindType :
      "/allInOneDeviceOne/" + deviceId + "/" + pageNum + "/" + bindType
  }

    if (RODeviceList.indexOf(productKey) > -1) {
    return pageName == "RODeviceTwo" ? "/RODeviceOne/" + deviceId + "/" + pageNum + "/" + bindType : "/RODeviceTwo/" +
      deviceId + "/" + pageNum + "/" + bindType
  }

  if (CUFDeviceList.indexOf(productKey) > -1) {
    return pageName == "CUFDeviceOne" ? "/CUFDeviceTwo/" + deviceId + "/" + pageNum + "/" + bindType : "/CUFDeviceOne/" +
      deviceId + "/" + pageNum + "/" + bindType
  }
}

export function getRouterPath(productKey, deviceId, pageNum, bindType) {
  if (commercialList.indexOf(productKey) > -1) {
    return "/device_commercialOne/" + deviceId + "/" + pageNum + "/" + bindType
  }

   if (newCommercialList.indexOf(productKey) > -1) {
    return "/new_commercialOne/" + deviceId + "/" + pageNum + "/" + bindType
  }

  if (oldDeviceList.indexOf(productKey) > -1) {
    return "/device_xy/" + deviceId + "/" + pageNum + "/" + bindType
  }

  if (newDeviceList.indexOf(productKey) > -1) {
    return "/newDevice_yh/" + deviceId + "/" + pageNum + "/" + bindType
  }

   if (separateDeviceList.indexOf(productKey) > -1) {
    return "/device_separateOne/" + deviceId + "/" + pageNum + "/" + bindType
  }

  if (newSeparateDeviceList.indexOf(productKey) > -1) {
    return "/device_newSeparateOne/" + deviceId + "/" + pageNum + "/" + bindType
  }

  if (allInOneDeviceList.indexOf(productKey) > -1) {
    return "/allInOneDeviceTwo/" + deviceId + "/" + pageNum + "/" + bindType
  }

  if (RODeviceList.indexOf(productKey) > -1) {
    return "/RODeviceOne/" + deviceId + "/" + pageNum + "/" + bindType
  }

  if (CUFDeviceList.indexOf(productKey) > -1) {
    return "/CUFDeviceTwo/" + deviceId + "/" + pageNum + "/" + bindType
  }
}

export function getProductNumber(productKey) { //产品开发顺序，以及产品排序顺序
  if (oldDeviceList.indexOf(productKey) > -1) {
    return 1
  }

  if (newDeviceList.indexOf(productKey) > -1) {
    return 2
  }

  if (commercialList.indexOf(productKey) > -1 || newCommercialList.indexOf(productKey) > -1) {
    return 3
  }

  if (separateDeviceList.indexOf(productKey) > -1 || newSeparateDeviceList.indexOf(productKey) > -1) {
    return 4
  }

  if (allInOneDeviceList.indexOf(productKey) > -1) {
    return 5
  }

  if (CUFDeviceList.indexOf(productKey) > -1) {
    return 6
  }

  if (CUFDeviceList.indexOf(productKey) > -1) {
    return 7
  }
}

export function getTitle(productKey) {
  switch (productKey) {
    case "a1ZLeXs5VCX":
    case "a1XpqYZQgUK":
      return "Venus中央净水机";
      break;
    case "a1N7o2G3pMR":
    case "a12KzXXwRii":
    case "a1EnF8F09Au":
      return "Venus中央软水机";
      break;
    case "a1i1JW1eizb":
      return "松下FP-RS25D1C型中央软水机test";
      break;
    case "a1C6AilwYUc":
      return "大方先生Pro_CSZ_WRL100B_WIFI";
      break;
    case "a1wxRSEG0lI":
      return "大方先生Pro_CSZ_WRL100B(L)";
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
    case "a1eQs13V9Io":
      return "大方先生Pro_CSZ_WNL100B(L)";
      break;
    case "a1bcXaJWejM":
      return "大流量商务机F520";
      break;
    case "a14OIdWW184":
      return "大流量商务机F150";
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
    case "a1GogUUtYSR":
      return "子母星II代CN-600UXF1(B)";
      break;
    case "a1jpjYxJfRS":
      return "子母星II代CR- 600UXF1(B)";
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
    case "a1lPXdxh7vV":
      return "中移动CN_RO75_NB";
      break;
    case "a131lEShgsO":
      return "海鸥500G";
      break;
    case "a1LPpt2Qhxc":
      return "海鸥500G";
      break;
    default:
      return "Venus中央净水机";
  }
}
