//智膳宝
const zhishanbao = [
    // {text:'不涉及',value:'不涉及'},
    { text: '西式浓汤', value: '西式浓汤' },
    { text: '红烧味道', value: '红烧味道' },
    { text: '鲜香炖煮', value: '鲜香炖煮' },
    { text: '米糊豆浆', value: '米糊豆浆' },
    { text: '清蒸滋味', value: '清蒸滋味' },
    { text: '低温慢煮', value: '低温慢煮' },
    { text: '无烟小炒', value: '无烟小炒' },
    { text: '风味粥', value: '风味粥' },
    { text: '美味羹', value: '美味羹' },
    { text: '面点主食', value: '面点主食' },
    { text: '研磨配料', value: '研磨配料' },
    { text: '果蔬汁', value: '果蔬汁' },
]
const zhishanbaos = [
    { text: '西式浓汤', value: '西式浓汤' },
    { text: '红烧味道', value: '红烧味道' },
    { text: '鲜香炖煮', value: '鲜香炖煮' },
    { text: '米糊豆浆', value: '米糊豆浆' },
    { text: '清蒸滋味', value: '清蒸滋味' },
    { text: '低温慢煮', value: '低温慢煮' },
    { text: '无烟小炒', value: '无烟小炒' },
    { text: '风味粥', value: '风味粥' },
    { text: '美味羹', value: '美味羹' },
    { text: '面点主食', value: '面点主食' },
    { text: '研磨配料', value: '研磨配料' },
    { text: '果蔬汁', value: '果蔬汁' },
]
//智膳宝食材分类
const zsbcategorys = [
    // {text:'不涉及',value:'不涉及'},
    { text: '猪牛羊', value: '猪牛羊' },
    { text: '禽类', value: '禽类' },
    { text: '水产海鲜类', value: '水产海鲜类' },
    { text: '蔬菜', value: '蔬菜' },
    { text: '汤类', value: '汤类' },
    { text: '和面', value: '和面' },
    { text: '饮品', value: '饮品' },
    { text: '水果', value: '水果' },
    { text: '米面主食', value: '米面主食' },
    { text: '低温慢煮', value: '低温慢煮' },
    { text: '食材切配', value: '食材切配' },
    { text: '蛋奶豆制品', value: '蛋奶豆制品' },
    { text: '米面杂粮', value: '米面杂粮' },
    { text: '其它', value: '其它' },
]
//智膳宝食材分类
const zsbcategoryes = [
    { text: '猪牛羊', value: '猪牛羊' },
    { text: '禽类', value: '禽类' },
    { text: '水产海鲜类', value: '水产海鲜类' },
    { text: '蔬菜', value: '蔬菜' },
    { text: '汤类', value: '汤类' },
    { text: '和面', value: '和面' },
    { text: '饮品', value: '饮品' },
    { text: '水果', value: '水果' },
    { text: '米面主食', value: '米面主食' },
    { text: '低温慢煮', value: '低温慢煮' },
    { text: '食材切配', value: '食材切配' },
    { text: '蛋奶豆制品', value: '蛋奶豆制品' },
    { text: '米面杂粮', value: '米面杂粮' },
    { text: '其它', value: '其它' },
]

// 子菜谱温度列表
const menuTempList = [
    37,
    40,
    45,
    50,
    55,
    60,
    65,
    70,
    75,
    80,
    85,
    90,
    95,
    98,
    100,
    105,
    110,
    115,
    120,
    125,
    130,
    135,
    140,
    160,
]

const menuTempListCF6 = [
    37,
    40,
    45,
    50,
    55,
    60,
    65,
    70,
    75,
    80,
    85,
    90,
    95,
    98,
    100,
    105,
    110,
    115,
    120,
    125,
    130,
    135,
    140,
    160,
]

const menuTempListCF5 = [
    37,
    40,
    45,
    50,
    55,
    60,
    65,
    70,
    75,
    80,
    85,
    90,
    95,
    98,
    100,
    105,
    110,
    115,
    120,
    125,
    130,
    135,
    140,
    160,
]

// 菜单档位列表
const menuGearList = [{
    label: "0档",
    value: 0,
}, {
    label: "L档",
    value: 1,
}, {
    label: "1档",
    value: 2,
}, {
    label: "2档",
    value: 3,
}, {
    label: "3档",
    value: 4,
}, {
    label: "4档",
    value: 5,
}, {
    label: "5档",
    value: 6,
}, {
    label: "6档",
    value: 7,
}, {
    label: "7档",
    value: 8,
}, {
    label: "8档",
    value: 9,
}, {
    label: "9档",
    value: 10,
}, {
    label: "10档",
    value: 11,
}, {
    label: "和面档",
    value: 12,
}]


const menuTypeColorList = [{
    color: '#FF3B30',
    label: 0,
    font: '文本',
    rgba: 'rgba(255, 59, 48,0.1)'
}, {
    color: '#FF9500',
    label: 1,
    font: '文本',
    rgba: 'rgba(255, 149, 0,0.1)'
}, {
    color: '#FFCC00',
    label: 2,
    font: '文本',
    rgba: 'rgba(255, 204, 0,0.1)'
}, {
    color: '#4CD964',
    label: 3,
    font: '文本',
    rgba: 'rgba(76, 217, 100,0.1)'
}, {
    color: '#5AC8FA',
    label: 4,
    font: '文本',
    rgba: 'rgba(90, 200, 250,0.1)'
}, {
    color: '#007AFF',
    label: 5,
    font: '文本',
    rgba: 'rgba(0, 122, 255,0.1)'
}, {
    color: '#5856D6',
    label: 6,
    font: '文本',
    rgba: 'rgba(88, 86, 214,0.1)'
}, {
    color: '#FF2D55',
    label: 7,
    font: '文本',
    rgba: 'rgba(255, 45, 85,0.1)'
}]
const moreFirmwareTypes = [{
    value: 1,
    label: 'mcu版本',
}, {
    value: 2,
    label: 'dtu版本',
}, {
    value: 3,
    label: '电机版本',
}, {
    value: 4,
    label: '电子称版本',
}, {
    value: 5,
    label: '触摸屏版本',
}, {
    value: 6,
    label: '系统版本',
}]

export default {
    zsbcategoryes: zsbcategoryes,
    zsbcategorys: zsbcategorys,
    zhishanbaos: zhishanbaos,
    zhishanbao: zhishanbao,
    menuTempList: menuTempList,
    menuGearList: menuGearList,
    menuTempListCF6: menuTempListCF6,
    menuTypeColorList: menuTypeColorList,
    moreFirmwareTypes: moreFirmwareTypes,
    menuTempListCF5: menuTempListCF5,
}