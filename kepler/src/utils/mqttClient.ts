import mqtt from 'mqtt'
import store from '../store'

const mqttUrl = process.env.REACT_APP_MQTT_ADDRESS

/**
 * @description 产生下发指令的topic
 * @export
 * @param {string} modelCode 型号编码
 * @param {string} deviceCode 设备编码
 * @returns
 */
export function createSetCommand(modelCode: string, deviceCode: string) {
  return `${topicPrefix}device/${modelCode}/${deviceCode}/jsonCmd`
}

/**
 * @description 监听的topic
 * @export
 * @param {string} modelCode 型号编码
 * @param {string} deviceCode 设备编码
 * @returns
 */
export function subscribeCommand(modelCode: string, deviceCode: string) {
  return `${topicPrefix}device/${modelCode}/${deviceCode}/jsonData`
}

/**
 * @description 设备上线的topic
 * @export
 * @param {string} modelCode 型号编码
 * @param {string} deviceCode 设备编码
 * @returns
 */
export function onlineCommand(modelCode: string, deviceCode: string) {
  return `${topicPrefix}device/${modelCode}/${deviceCode}/online`
}

// mqtt通信的type字段
export const topicPrefix: string = 'kepler/'

// mqtt通信timeout
export const mqttTimeout: number = 20000 // 毫秒

// 创建一个通用的mqtt客户端，需要自定义接受消息函数
export function createMqttClient() {
  let account = store.getState().userInfo.id
  let token = localStorage.getItem('login_token') || ''
  const RandomAPPid = account + '_' + Math.random().toString(16).substr(2, 8)
  let mqttClient = mqtt.connect(mqttUrl, {
    clientId: `WEB:${RandomAPPid}`,
    username: account,
    password: token,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    reconnectPeriod: 20000
  })
  return mqttClient
}
