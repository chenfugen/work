import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // 标准化
        module: 'oldMenu',
        // 旧版本
        token: false,//登录令牌
        userInfo: {},//用户信息
        authTree: [],//用户权限树
        authOne: [],//一级权限
        authTwo: [],//二级权限
        authThree: [],//三级权限
        authFour: [],//四级权限
        menuModels: [],//菜谱类型集合
        riving: true,
        types: [],//产品集合
        deviceTypes: [],//产品类型集合
        deviceModels: [],//产品型号集合
        departments: [{ id: 'adasdasd', name: '' }],//部门集合
        roles: [{ id: 'adasdasd', name: '' }],//角色集合
        msgNum: '',//未读故障数量
        deviceTypeFilters: [],//产品类型筛选
        deviceModelFilters: [],//产品型号筛选
        cacheImgSrc: window.location.href.split('/#/')[0] + '/lexy/api/common/getMenuImage?cache=true&fileName=',//img图片地址
        imgSrc: window.location.href.split('/#/')[0] + '/lexy/api/common/file?fileName=',//img图片地址
        href: window.location.href.split('/#/')[0],//图片地址
        menus: false,//菜谱列表筛选条件
        //美食家
        cuisines: [
            // {text:'不涉及',value:''},
            // {text:'西式浓汤',value:'西式浓汤'},
            // {text:'红烧味道',value:'红烧味道'},
            // {text:'鲜香焖炖',value:'鲜香焖炖'},
            // {text:'米糊豆浆',value:'米糊豆浆'},
            // {text:'清蒸滋味',value:'清蒸滋味'},
            // {text:'低温慢煮',value:'低温慢煮'},
            // {text:'无烟小炒',value:'无烟小炒'},
            // {text:'绞肉和面',value:'绞肉和面'},
            // {text:'水煮/羹',value:'水煮/羹'},
            // {text:'面食',value:'面食'},
            // {text:'研磨配料',value:'研磨配料'},
            // {text:'果蔬汁',value:'果蔬汁'},
        ],
        cuisinees: [
            // {text:'西式浓汤',value:'西式浓汤'},
            // {text:'红烧味道',value:'红烧味道'},
            // {text:'鲜香焖炖',value:'鲜香焖炖'},
            // {text:'米糊豆浆',value:'米糊豆浆'},
            // {text:'清蒸滋味',value:'清蒸滋味'},
            // {text:'低温慢煮',value:'低温慢煮'},
            // {text:'无烟小炒',value:'无烟小炒'},
            // {text:'绞肉和面',value:'绞肉和面'},
            // {text:'水煮/羹',value:'水煮/羹'},
            // {text:'面食',value:'面食'},
            // {text:'研磨配料',value:'研磨配料'},
            // {text:'果蔬汁',value:'果蔬汁'},
        ],
        //食材分类
        categorys: [
            // {text:'不涉及',value:''},
            // {text:'猪牛羊',value:'猪牛羊'},
            // {text:'禽类',value:'禽类'},
            // {text:'水产海鲜类',value:'水产海鲜类'},
            // {text:'蔬菜',value:'蔬菜'},
            // {text:'汤类',value:'汤类'},
            // {text:'米面主食',value:'米面主食'},
            // {text:'低温慢煮',value:'低温慢煮'},
            // {text:'食材切配',value:'食材切配'},
            // {text:'和面',value:'和面'},
            // {text:'饮品',value:'饮品'},
        ],
        categoryes: [
            // {text:'猪牛羊',value:'猪牛羊'},
            // {text:'禽类',value:'禽类'},
            // {text:'水产海鲜类',value:'水产海鲜类'},
            // {text:'蔬菜',value:'蔬菜'},
            // {text:'汤类',value:'汤类'},
            // {text:'米面主食',value:'米面主食'},
            // {text:'低温慢煮',value:'低温慢煮'},
            // {text:'食材切配',value:'食材切配'},
            // {text:'和面',value:'和面'},
            // {text:'饮品',value:'饮品'},
        ],
        //口味特色
        flavores: [
            // {text:'香辣',value:'香辣'},
            // {text:'麻辣',value:'麻辣'},
            // {text:'红烧',value:'红烧'},
            // {text:'鱼香',value:'鱼香'},
            // {text:'糖醋',value:'糖醋'},
            // {text:'咸香',value:'咸香'},
            // {text:'咖喱',value:'咖喱'},
            // {text:'甜',value:'甜'},
            // {text:'酸辣',value:'酸辣'},
            // {text:'清淡',value:'清淡'},
        ],
        flavors: [
            // {text:'不涉及',value:''},
            // {text:'香辣',value:'香辣'},
            // {text:'麻辣',value:'麻辣'},
            // {text:'红烧',value:'红烧'},
            // {text:'鱼香',value:'鱼香'},
            // {text:'糖醋',value:'糖醋'},
            // {text:'咸香',value:'咸香'},
            // {text:'咖喱',value:'咖喱'},
            // {text:'甜',value:'甜'},
            // {text:'酸辣',value:'酸辣'},
            // {text:'清淡',value:'清淡'},
        ],
        //特色分类
        style: [],
        styles: [],
        meta: {
            name: '',
            time: ''
        }
    },
    mutations: {
        // 标准化
        UPDATA_MODULE(state, data) {
            state.module = data;
        },
        // 旧版本
        // 储存token和用户信息,生成权限级别
        add_token(state, data) {
            state.authOne = []; state.authTwo = []; state.authThree = []; state.authFour = []; state.authTree = [];
            state.token = data.token; state.userInfo = data; state.authTree = data.authTree;
            if (state.userInfo.auth) {
                for (var x in state.userInfo.auth) {
                    state.authOne.push(state.userInfo.auth[x][0])
                    if (state.userInfo.auth[x].length >= 2) {
                        state.authTwo.push(state.userInfo.auth[x].substring(0, 2))
                    }
                    if (state.userInfo.auth[x].length >= 3) {
                        state.authThree.push(state.userInfo.auth[x].substring(0, 3))
                    }
                    if (state.userInfo.auth[x].length == 4) {
                        state.authFour.push(state.userInfo.auth[x])
                    }
                }
            }
            localStorage.setItem('userInfo', JSON.stringify(data));
            localStorage.setItem('token', data.token);
            // console.log(data.token,localStorage.getItem('token'))
        },
        //修改详情时间
        add_meta(state, data) {
            state.meta = {};
            state.meta.name = data.name;
            state.meta.time = data.time;
        },
        // 清除token
        del_token(state, token) {
            state.token = false;
            sessionStorage.removeItem("store")
            localStorage.removeItem('userInfo');
            localStorage.removeItem('token');
            router.push({ path: '/login' })
        },
        // 储存产品集合
        add_types(state, data) {
            state.types = data;
        },
        // 储存产品类型集合
        add_deviceTypes(state, data) {
            state.deviceTypeFilters = [];
            for (var x in data) {
                state.deviceTypeFilters.push({
                    text: data[x], value: data[x]
                })
            }
            state.deviceTypes = data;
        },
        // 储存产品型号集合
        add_deviceModels(state, data) {
            state.deviceModelFilters = [];
            for (var x in data) {
                state.deviceModelFilters.push({
                    text: data[x], value: data[x]
                })
            }
            state.deviceModels = data;
        },
        // 储存部门集合
        add_departments(state, data) {
            state.departments = [];
            for (var x in data) {
                state.departments.push({
                    text: data[x].name, value: data[x].id
                })
            }
        },
        //储存菜谱型号集合
        add_menuModel(state, data) {
            //1：美食家，2：食材分类，3：特色分类，4：口味，
            state.cuisines = [];
            state.cuisinees = [];
            data[1].forEach((i) => {
                state.cuisines.push({ text: i.name, value: i.id });
                state.cuisinees.push({ text: i.name, value: { id: i.id } });
            })
            state.categorys = [];
            state.categoryes = [];
            data[2].forEach((i) => {
                state.categorys.push({ text: i.name, value: i.id });
                state.categoryes.push({ text: i.name, value: { id: i.id } });
            })
            state.styles = [];
            state.style = [];
            data[3].forEach((i) => {
                state.style.push({ text: i.name, value: { id: i.id } });
                state.styles.push({ text: i.name, value: i.id });
            })
            state.flavores = [];
            state.flavors = [];
            data[4].forEach((i) => {
                state.flavores.push({ text: i.name, value: { id: i.id } });
                state.flavors.push({ text: i.name, value: i.id });
            })
        },
        // 储存角色集合
        add_roles(state, data) {
            state.roles = [];
            for (var x in data) {
                state.roles.push({
                    text: data[x].name, value: data[x].id
                })
            }
        },
        //修改菜谱新增状态
        chg_riving(state, data) {
            state.riving = data;
        },
        add_msgNum(state, data) {
            state.msgNum = data;
        },
        //获取最新href地址
        ls_href(state, data) {
            // state.imgSrc = data+'/lexy/api/common/file?fileName=';
        },
        save_menus(state, data) {
            state.menus = JSON.parse(JSON.stringify(data));;
            state.menus.updateStartTime = '';
            state.menus.updateEndTime = '';
        },
        del_menus(state, data) {
            state.menus = false;
        }
    }
})
