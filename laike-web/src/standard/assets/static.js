const tagList = [{
    value: 0,
    label: '厨电类'
}, {
    value: 1,
    label: '空净类'
}, {
    value: 2,
    label: '净水类'
}, {
    value: 3,
    label: '机器人类'
}, {
    value: 4,
    label: '其它类'
}]

const dataTypes = [{
    value: 1,
    label: "int",
}, {
    value: 2,
    label: "float",
}, {
    value: 3,
    label: "string",
}, {
    value: 4,
    label: "struct",
}, {
    value: 5,
    label: "enum",
}, {
    value: 6,
    label: "boolean",
}]

const units = [{
    value: "1",
    label: "无 / None",
}, {
    value: "2",
    label: "克 / g",
}, {
    value: "3",
    label: "千克 / kg",
}, {
    value: "4",
    label: "千米每分钟 / Km/m",
}]

module.exports = {
    tagList: tagList,
    dataTypes: dataTypes,
    units: units
}