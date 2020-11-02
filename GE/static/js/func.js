var commercialList = ['a1i8kpwPW9w', 'a1u3fpsU6yg', 'a1ywWYLDDx4', 'a19K7Tn1KGM', 'a1KJlAd5V8m', 'a1wG79dZYPJ', 'a1edMf8mfSH', 'a1l3RRgwECJ','a1bSi4OHYRs','g106sUgjoP4','a1yoJcSJEXJ','a1ZL2myX6Gd','a1kqLg4yTZK','a1osvT3xArq','a1lR2NRXgTG','a1mq55FcdD1','a1l3RRgwECJ','a1bSi4OHYRs','a1QSvMW8mnD','a1bDSJUFzbd']; //商用机
var newCommercialList = ['a13nBeEFNFi', 'a1O44YzEEiz', 'a1C7oC1vjqw']; //新增商用机
var oldDeviceList = ['a1ZLeXs5VCX', 'a12KzXXwRii']; //旧版新月雨荷
var purifierDeviceList = ['a1TDQhOZAp3', 'a1EGEZQkwUe', 'a1yvf75UDl7']; //中央净
var softenerDeviceList = ['a1TQBPNk4cT', 'a1ZTu3R5BKD', 'a1VmZ7nWwyQ']; //中央软
var allInOneDeviceList = ['a14quLhzzTs', 'a1GYXlFAY1I']; //一体机
var RODeviceList = ['a19PPOycX99', 'a1Yg9aEngv9']; //三级RO
var CUFDeviceList = ['a19wjchgPyv', 'a1RDGsLn2gH']; //超滤
var P7DeviceList = ['a1xjge89hkA', 'a1przX9NmYK', 'a1QGxnnfFnY']; //P7
var P7NewDeviceList = ['a1obsHkefOT']; //新P7
var separateDeviceList = ['a1DCNZ2cTcL', 'a12LTZQEw02', 'a1n3DbOHR11',"g106AyPVNAQ"]; //分质供水
var newSeparateDeviceList = ['a1eL1nwf0LN']; //新分质供水

//获取主页路径
export function getPath(pageName, productKey, deviceId, bindType, pageNum) {
  if (commercialList.indexOf(productKey) > -1) {
    return pageName == "device_commercialTwo" ? "/device_commercialOne/" + deviceId + "/" + pageNum + "/" + bindType :
      "/device_commercialTwo/" + deviceId + "/" + pageNum + "/" + bindType
  }

  if (newCommercialList.indexOf(productKey) > -1) {
    return pageName == "device_newCommercialOne" ? "/device_newCommercialTwo/" + deviceId + "/" + pageNum + "/" +
      bindType :
      "/device_newCommercialOne/" + deviceId + "/" + pageNum + "/" + bindType
  }

  if (oldDeviceList.indexOf(productKey) > -1) {
    return pageName == "device_xy" ? "/device_xy/" + deviceId + "/" + pageNum + "/" + bindType : "/device_yh/" +
      deviceId + "/" + pageNum + "/" + bindType
  }

  if (purifierDeviceList.indexOf(productKey) > -1) {
    return pageName == "newDevice_xy" ? "/newDevice_xy/" + deviceId + "/" + pageNum + "/" + bindType : "/newDevice_yh/" +
      deviceId + "/" + pageNum + "/" + bindType
  }

  if (softenerDeviceList.indexOf(productKey) > -1) {
    return pageName == "newDevice_yh" ? "/newDevice_yh/" + deviceId + "/" + pageNum + "/" + bindType : "/newDevice_xy/" +
      deviceId + "/" + pageNum + "/" + bindType
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

  if (P7DeviceList.indexOf(productKey) > -1) {
    return pageName == "P7DeviceOne" ? "/P7DeviceTwo/" + deviceId + "/" + pageNum + "/" + bindType : "/P7DeviceOne/" +
      deviceId + "/" + pageNum + "/" + bindType
  }

  if (P7NewDeviceList.indexOf(productKey) > -1) {
    return pageName == "P7newDeviceOne" ? "/P7newDeviceTwo/" + deviceId + "/" + pageNum + "/" + bindType :
      "/P7newDeviceOne/" +
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
}

//获取路由
export function getRouterPath(productKey, deviceId, pageNum, bindType) {
  if (commercialList.indexOf(productKey) > -1) {
    return "/device_commercialOne/" + deviceId + "/" + pageNum + "/" + bindType
  }
  if (newCommercialList.indexOf(productKey) > -1) {
    return "/device_newCommercialOne/" + deviceId + "/" + pageNum + "/" + bindType
  }

  if (purifierDeviceList.indexOf(productKey) > -1) {
    return "/newDevice_xy/" + deviceId + "/" + pageNum + "/" + bindType
  }

  if (softenerDeviceList.indexOf(productKey) > -1) {
    return "/newDevice_yh/" + deviceId + "/" + pageNum + "/" + bindType
  }
  if (allInOneDeviceList.indexOf(productKey) > -1) {
    return "/allInOneDeviceTwo/" + deviceId + "/" + pageNum + "/" + bindType
  }

  if (separateDeviceList.indexOf(productKey) > -1) {
    return "/device_separateOne/" + deviceId + "/" + pageNum + "/" + bindType
  }

  if (newSeparateDeviceList.indexOf(productKey) > -1) {
    return "/device_newSeparateOne/" + deviceId + "/" + pageNum + "/" + bindType
  }

  if (RODeviceList.indexOf(productKey) > -1) {
    return "/RODeviceOne/" + deviceId + "/" + pageNum + "/" + bindType
  }

  if (CUFDeviceList.indexOf(productKey) > -1) {
    return "/CUFDeviceTwo/" + deviceId + "/" + pageNum + "/" + bindType
  }

  if (P7DeviceList.indexOf(productKey) > -1) {
    return "/P7DeviceOne/" + deviceId + "/" + pageNum + "/" + bindType
  }

  if (P7NewDeviceList.indexOf(productKey) > -1) {
    return "/P7newDeviceOne/" + deviceId + "/" + pageNum + "/" + bindType
  }
}
//产品开发顺序，以及产品排序顺序
export function getProductNumber(productKey) {
  if (purifierDeviceList.indexOf(productKey) > -1) {
    return 1
  }

  if (softenerDeviceList.indexOf(productKey) > -1) {
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

  if (RODeviceList.indexOf(productKey) > -1) {
    return 6
  }

  if (CUFDeviceList.indexOf(productKey) > -1) {
    return 7
  }

  if (P7DeviceList.indexOf(productKey) > -1 || P7NewDeviceList.indexOf(productKey) > -1) {
    return 8
  }

}

export function getTitle(productKey) {
  switch (productKey) {
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
    case "g106sUgjoP4":
      return "极尊_GCUR01B05";
      break;
    case "a1ywWYLDDx4":
      return "极尊_GCUR01B05-B";
      break;
    case "a1O44YzEEiz":
      return "极尊_GCUN01A02-B";
      break;
    case "a13nBeEFNFi":
      return "极尊_ 带制冷NF";
      break;
    case "a19K7Tn1KGM":
      return "极尊_ 带制冷RO";
      break;
    case "a1wG79dZYPJ":
      return "极雅_GCUR_150B01";
      break;
    case "a1edMf8mfSH":
      return "极雅_GCUR_150B02";
      break;
    case "a1l3RRgwECJ":
      return "极雅_GCUR_150B02_C";
      break;
    case "a1bSi4OHYRs":
      return "极雅_GCUR_150B01_C";
      break;
    case "a1KJlAd5V8m":
      return "极畅GCUR-04A01";
      break;
    case "a1C7oC1vjqw":
      return "极畅GCUN-04A01";
      break;
    case "a14quLhzzTs":
      return "Venusmix净软一体机";
      break;
    case "a1GYXlFAY1I":
      return "极颜_GRUS01A01";
      break;
    case "a1n3DbOHR11":
      return "极质_GRUD-06A02(B)";
      break;
    case "a1DCNZ2cTcL":
      return "极双_GRUD06D01";
      break;
    case "a12LTZQEw02":
      return "极双_GRUD06A02";
      break;
    case "a1eL1nwf0LN":
      return "极质_GRUD-06D01(B)";
      break;
    case "a19PPOycX99":
      return "极纯_GRUR06A01";
      break;
    case "a1Yg9aEngv9":
      return "极纯_GRUR06A01";
      break;
    case "a1QGxnnfFnY":
      return "极纯_GEUR-400-600B01";
      break;
    case "a1xjge89hkA":
      return "极纯_GRUR06A02";
      break;
    case "a1obsHkefOT":
      return "极光_GEUR-400/600B01";
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
    case "g106AyPVNAQ":
        return "分质供水测试";
        break;
    case "a1yoJcSJEXJ":
        return "极畅_GCUN-400B01_L";
        break;
    case "a1ZL2myX6Gd":
        return "极畅_GCUR-400B01";
        break;
    case "a1kqLg4yTZK":
        return "极聚_GCUR-1000B01";
        break;
    case "a1osvT3xArq":
        return "极雅_GCUR_02A03";
        break;
    case "a1lR2NRXgTG":
        return "极聚_GCUR_600B01";
        break;
    case "a1mq55FcdD1":
        return "极雅_H04G";
        break;
    case "a1l3RRgwECJ":
        return "分质供水测试";
        break;
    case "g106AyPVNAQ":
        return "极雅_GCUR_150B02_C";
        break;
    case "a1bSi4OHYRs":
        return "极雅_GCUR_150B01_C";
        break;
    case "a1QSvMW8mnD":
        return "极畅_GCUR_400B01_L";
        break;
    case "a1bDSJUFzbd":
        return "极畅_GCUN_400B01";
        break;
    default:
      return "极净_GREF10A01";
  }
}
