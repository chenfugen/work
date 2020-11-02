import Vue from 'vue'
import router from '../router'
import store from '../store/index'
//时间过滤器
export function dateFilter(value, pattern) {
    // 将字符串转换为Date类型
    var mt = new Date(value)
    // 获取年份
    var y = mt.getFullYear()
    // 获取月份 从0开始
    var m = (mt.getMonth() + 1).toString().padStart(2, "0")
    // 获取天数
    var d = (mt.getDate()).toString().padStart(2, "0")
    if (pattern === '天') {
        return y + "-" + m + "-" + d
    }
    // 获取小时
    var h = mt.getHours().toString().padStart(2, "0")
    // 获取分钟
    var mi = mt.getMinutes().toString().padStart(2, "0")
    // 获取秒
    var s = mt.getSeconds().toString().padStart(2, "0")
    // 拼接为我们需要的各式
    if (y == '1970') {
        return value;
    } else {
        return y + "-" + m + "-" + d + " " + h + ":" + mi + ":" + s
    }
}
export function succ(msg) {
    return {
        iconClass: 'iconcorrect',
        customClass: 'meg-succ',
        closeOnClickModal: false,
        message: msg
    };
}
export function confirm() {
    return {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        confirmButtonClass: 'el-button--danger',
        type: 'warning',
    }
}
export function confirm1() {
    return {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        confirmButtonClass: 'el-button--danger',
        type: 'warning',
    }
}
export function wrong(tit, code, msg) {
    var cen = '服务器错误！';
    if (code == 888) {
        cen = 'accessKey不正确！';
    } else if (code == 666) {
        cen = '文件上传失败！';
    } else if (code == 100) {
        cen = '用户名或密码不正确！';
    } else if (code == 101) {
        store.commit('del_token', 1)
        router.push({
            path: '/login'
        });
        cen = '登录用户已超时请重新登录！';
    } else if (code == 102) {
        cen = '原密码不正确！';
    } else if (code == 103) {
        cen = '部门名称已经存在！';
    } else if (code == 104) {
        cen = '请先删除部门下的员工！';
    } else if (code == 105) {
        cen = '角色名称已经存在！';
    } else if (code == 106) {
        cen = '请先删除角色下的员工！';
    } else if (code == 107) {
        cen = '员工用户名已经存在！';
    } else if (code == 108) {
        cen = 'MAC地址已经存在！';
    } else if (code == 109) {
        cen = 'SN码已经存在！';
    } else if (code == 110) {
        cen = '故障代码已经存在！';
    } else if (code == 111) {
        cen = '菜谱ID已经存在！';
    } else if (code == 112) {
        cen = 'MCU固件版本号已经存在！';
    } else if (code == 113) {
        cen = 'DTU固件版本号已经存在！';
    } else if (code == 114) {
        cen = 'APP版本号已经存在！';
    } else if (code == 115) {
        cen = '消息推送用户不存在！';
    } else if (code == 116) {
        cen = '文件删除失败！';
    } else if (code == 117) {
        cen = '设备不存在！';
    } else if (code == 118) {
        cen = '菜谱名称已经存在！';
    } else if (code == 119) {
        cen = 'APP用户不存在！';
    } else if (code == 120) {
        cen = '设备类型、型号不存在！';
    } else if (code == 121) {
        cen = '员工不存在！';
    } else if (code == 122) {
        cen = '请先删除员工的下级账户，部门，角色！';
    } else if (code == 123) {
        cen = '账户已经被冻结！';
    } else if (code == 124) {
        cen = '分类名称已经存在！';
    } else if (code == 125) {
        cen = '分类不存在！';
    } else if (code == 126) {
        cen = '当前分类下已有菜谱相关联，无法删除,请解除关联后再进行此操作！';
    } else if (code == 127) {
        cen = '菜谱不存在！';
    } else if (code == 128) {
        cen = '父菜谱不存在！';
    } else if (code == 129) {
        cen = '请先删除父菜谱下的子菜谱！';
    } else if (code == 130) {
        cen = '默认菜谱已经存在！';
    } else if (code == 131) {
        cen = '菜谱已经存在！';
    } else if (code == 132) {
        cen = '当前无子菜谱，无法启用！';
    } else if (code == 88888) {
        cen = '导入数据中包含空值，请检查是否填写完整！';
    } else if (code == 88889) {
        cen = tit;
        tit = '操作失败';
    } else {
        cen = msg;
        tit = tit;
    }
    return {
        iconClass: 'iconwrong',
        customClass: 'meg-wrong',
        duration: 0,
        dangerouslyUseHTMLString: true,
        message: '<div class="megWrong"><font class="title">' + tit + '</font><br/><font class="center">' + cen + '</font>' +
            '<br/><el-button style="float:right" plain class="meg-wrong el-button el-button--default is-plain">知道了</el-button></div>',
    };
}
export function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}