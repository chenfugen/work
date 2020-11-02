const dataTypes = require("./assets/static").dataTypes;
const units = require("./assets/static").units;

// 转义属性类型
const escapePropertyType = (cellValue) => {
    return cellValue == 1 ? '属性' : '事件';
}

// 转义属性类型
const escapeRW = (cellValue) => {
    return cellValue == 1 ? '可读' : '读写';
}

// 转义数据类型
const escapeDataType = (cellValue) => {
    for (let i in dataTypes) {
        if (dataTypes[i].value == cellValue) {
            return dataTypes[i].label;
        }
    }
}

// 转义数据类型
const escapeUnit = (cellValue) => {
    for (let i in units) {
        if (units[i].value == cellValue) {
            return units[i].label;
        }
    }
}
//时间处理
const formatDate = (res) => {
    if (res == "" || res == undefined || res == null) {
        return "--";
    } else {
        let date = new Date(res);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
        let h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
        let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
        let s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
        return Y + M + D + h + m + s;
    }
}


// 转义时间
const escapeTime = (cellValue) => {
    let time = new Date(cellValue),
        year = time.getFullYear().toString(),
        month = (time.getMonth() + 1).toString(),
        day = time.getDate().toString(),
        hours = time.getHours().toString(),
        min = time.getMinutes().toString(),
        sec = time.getSeconds().toString()
    return year + '-' + month.padStart(2, '0') + '-' + day.padStart(2, '0') + ' ' + hours.padStart(2, '0') + ':' + min.padStart(2, '0') + ':' + sec.padStart(2, '0')
}

// GBK字符集实际长度计算
const getGbkStrLenth = function (str) {
    var realLength = 0;
    var len = str.length;
    var charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) {
            realLength += 1;
        } else {
            // 如果是中文则长度加2
            realLength += 2;
        }
    }
    return realLength;
}
const escapePageName = function (type) {
    let list = {
        "1": '功能列表',
        "2": '单项时间',
        "3": '快捷菜',
        "4": '菜谱清单',
        "5": '我的收藏',
        "6": '我的烹饪记录',
        "10": '烹饪界面',
        "11": '状态详情页面',
        "12": '菜谱详情',
        "13": '收藏',
        "14": '菜谱列表',
        "15": '预约页面'
    }
    return list[type]
}

export default {
    escapePropertyType,
    escapeDataType,
    escapeRW,
    escapeUnit,
    escapeTime,
    getGbkStrLenth,
    formatDate,
    escapePageName
}
