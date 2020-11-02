<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view v-if="routerAlive" class="child-view"></router-view>
    </transition>
  </div>
</template>

<script>
  import Vue from 'vue'
  import mqtt from 'mqtt'
  import CryptoJS from "../static/js/HmacSHA1.js";
  import * as func from '../static/js/func'
  export default {
    name: "app",
    provide() {
      return {
        reload: this.reload
      }
    },
    data() {
      return {
        transitionName: "slide-left",
        routerAlive: true,
        userName: "",
        productKey: this.$store.state.userProductKey,
        DeviceName: "",
        DeviceSecret: "",
        timestamp: new Date().getTime(),
        client: "",
      };
    },
    watch: {
      '$route'(to, from) {
        if (to.meta.level > from.meta.level) {
          this.transitionName = 'slide-left';
        } else if (to.meta.level == from.meta.level) {
          if (to.params.num > from.params.num) {
            this.transitionName = 'slide-left';
          } else {
            this.transitionName = 'slide-right';
          }
        } else {
          this.transitionName = 'slide-right'
        }
      }
    },
    mounted() {
      this.$cookies.remove('updataStatus');
      if (this.$cookies.get("productMsg") != null) {
        this.judgeBind();
      }
      if (this.$cookies.get('Authorization') != null) {
        this.getuser(this.productKey);
      }
    },
    methods: {
      judgeBind() {
        let that = this;
        that.$Ax.get("wechat/device/register/getDeviceBindStatus?productKey=" + that.$cookies.get('productMsg').productKey +
          "&deviceName=" + that.$cookies.get('productMsg').DeviceName + "&accessKey=" + that.$store.state.accessKey).then(
          (res) => {
            if (res.data.success) {
              if (res.data.data.bindStatus) {
                let useId = res.data.data.userId;
                if (res.data.data.userId == that.$cookies.get('userId')) {
                  that.$router.push({
                    path: func.getRouterPath(that.$cookies.get('productMsg').productKey, res.data.data.deviceId,
                      0, 1)
                  });
                  that.$cookies.remove('productMsg');
                  return false;
                }
                if (that.$cookies.get('Authorization') != null) {
                  that.$Axios.get("wechat/device/getDeviceShareStatus?productKey=" + that.$cookies.get('productMsg').productKey +
                    "&deviceName=" + that.$cookies.get('productMsg').DeviceName).then((res) => {
                    if (res.data.data.shareStatus) {
                      that.$router.push({
                        path: func.getRouterPath(that.$cookies.get('productMsg').productKey, res.data.data.deviceId,
                          0, 2)
                      });
                      that.$cookies.remove('productMsg');
                    } else {
                      that.$dialog.confirm({
                        title: '设备绑定',
                        message: '该设备已被绑定,是否请求分享添加',
                        confirmButtonText: "请求分享"
                      }).then(() => {
                        var data = {
                          "cmd": "share",
                          "data": {
                            "shareUserId": useId, //主用户
                            "userId": that.$cookies.get('userId'), //分享用户
                            "productKey": that.$cookies.get('productMsg').productKey,
                            "deviceName": that.$cookies.get('productMsg').DeviceName,
                            "headUrl": decodeURI(that.$cookies.get('headUrl'))
                          }
                        }
                        that.client.publish('/' + that.productKey + '/' + that.DeviceName +
                          '/user/message/update', JSON.stringify(data), {
                            qos: 1
                          });
                        that.$cookies.remove('productMsg');
                      }).catch(() => {
                        that.$cookies.remove('productMsg');
                      });
                    }
                  })
                } else {
                  that.$toast("请先绑定手机号码");
                  that.$cookies.set('isShare', false);
                }
              } else {
                if (that.$cookies.get('Authorization') != null) {
                  if (that.$cookies.get('productNet') == "wifi") {
                    that.$dialog.confirm({
                      title: '提示',
                      message: '该设备为WIFI设备请先配网',
                      confirmButtonText: "前往"
                    }).then(() => {
                      that.$router.push({
                        path: "/networkFlow"
                      });
                    }).catch(() => {
                      that.$cookies.remove('productMsg');
                    });
                  } else {
                    that.$dialog.confirm({
                      title: '提示',
                      message: '该设备为2G设备，是否直接绑定',
                      confirmButtonText: "绑定"
                    }).then(() => {
                      that.$Axios.post("wechat/device/bindDevice", {
                        productKey: that.$cookies.get('productMsg').productKey,
                        deviceName: that.$cookies.get('productMsg').DeviceName,
                        sncode: that.$cookies.get('productMsg').sncode,
                      }).then((res) => {
                        that.$cookies.remove('productMsg');
                        if (res.data.success) {
                          that.reload();
                        } else {
                          that.$toast(res.data.message);
                        }
                      })
                    }).catch(() => {
                      that.$cookies.remove('productMsg');
                    });
                  }
                } else {
                  that.$toast("请先绑定手机号码");
                  that.$cookies.set('isShare', false);
                }
              }
            }
          }).catch((res) => {
          that.$cookies.remove('productMsg');
          console.log(res);
        })
      },
      getuser(e) {
        this.$Axios.post("wechat/device/createUserClient", {
          productKey: e,
        }).then((res) => {
          if (res.data.success) {
            this.productKey = res.data.data.productKey;
            this.DeviceName = res.data.data.deviceName;
            this.DeviceSecret = res.data.data.deviceSecret;
            const userClient = {
              productKey: res.data.data.productKey,
              deviceName: res.data.data.deviceName,
              deviceSecret: res.data.data.deviceSecret,
            }
            this.$store.commit("changeUserClient", userClient);
            if (!this.$store.state.client) {
              this.mqtt();
            }
          } else {
            this.$toast("数据加载失败");
          }
        }).catch((res) => {
          console.log(res);
        })
      },
      mqtt() {
        let that = this;
        var clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8);
        var options = {
          keepalive: 1200,
          protocolId: 'MQTT',
          protocolVersion: 4,
          clean: false,
          reconnectPeriod: 3000,
          connectTimeout: 30 * 1000,
          clientId: clientId + "|securemode=2,signmethod=hmacsha1,timestamp=" + that.timestamp + "|",
          username: that.DeviceName + "&" + that.productKey,
          password: CryptoJS.HmacSHA1("clientId" + clientId + "deviceName" + that.DeviceName + "productKey" + that.productKey +
            "timestamp" + that.timestamp, that.DeviceSecret).toString(),
          rejectUnauthorized: false
        }
        that.client = mqtt.connect("wss://" + that.productKey + ".iot-as-mqtt.cn-shanghai.aliyuncs.com:443/Mosca",
          options);
        that.$store.commit("changeClient", that.client);
        that.client.on('error', function(err) {
          that.client.end();
        })
        that.client.on('connect', function(msg) {
          console.log(msg)
          if (msg.cmd == 'connack') {
            that.client.subscribe('/' + that.productKey + '/' + that.DeviceName + '/user/message/get', {
              qos: 1
            });
          }
        })
        that.client.on('reconnect', (error) => {
          console.log('正在重连')
        })
        that.client.on('message', function(topic, message, packet) {
          console.log(message.toString())
          let information = JSON.parse(message.toString());
          if (information.cmd == "share") {
            that.$dialog.confirm({
              title: '设备分享请求',
              message: '<img src=' + information.data.headUrl + ' class="headImg" />用户请求分享' + information.data.deviceName +
                '设备',
              confirmButtonText: "同意",
              cancelButtonText: "拒绝",
            }).then(() => {
              that.$Axios.post("wechat/device/bindShareDevice ", {
                "userId": information.data.userId, //分享用户
                "productKey": information.data.productKey,
                "deviceName": information.data.deviceName,
              }).then((res) => {
                if (res.data.success) {
                  var data = {
                    "cmd": "shareSuccess",
                    "data": {
                      "userId": information.data.userId,
                    }
                  }
                  that.client.publish('/' + that.productKey + '/' + that.DeviceName +
                    '/user/message/update', JSON.stringify(data), {
                      qos: 1
                    });
                } else {
                  that.$toast("数据加载失败");
                }
              })
            }).catch((res) => {
              var data = {
                "cmd": "cancelShare",
                "data": {
                  "userId": information.data.userId,
                }
              }
              that.client.publish('/' + that.productKey + '/' + that.DeviceName + '/user/message/update', JSON.stringify(
                data), {
                qos: 1
              });
            })
            return false;
          }
          if (information.cmd == "shareSuccess") {
            that.$dialog.alert({
              title: '分享请求',
              message: '你的分享请求，对方已同意'
            }).then(() => {
              that.reload();
              that.$router.push({
                path: "/device"
              });
            });
            return false;
          }
          if (information.cmd == "cancelShare") {
            that.$dialog.alert({
              title: '分享请求',
              message: '你的分享请求，对方已拒绝',
            }).then(() => {

            });
            return false;
          }
          if (information.productKey == "a1ZLeXs5VCX" || information.productKey == "a12KzXXwRii") {
            that.$store.commit("changeDevice", information.items);
          }
          that.$forceUpdate();
        })
        that.client.on('close', function() {
          console.log('disconnected');
        })
      },
      reload() {
        this.routerAlive = false;
        this.$nextTick(() => {
          this.routerAlive = true;
        });
      }
    }
  };
</script>

<style>
  #app {
    font-family: 微软雅黑;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    padding: 0;
  }

  body::-webkit-scrollbar {
    display: none;
    opacity: 0;
  }

  body {
    margin: 0;
    padding: 0;
  }

  .child-view {
    position: absolute;
    min-height: 100%;
    height: auto;
    width: 100%;
    transition: all 0.25s cubic-bezier(0.55, 0, 0.1, 1);
  }

  .slide-left-enter,
  .slide-right-leave-active {
    opacity: 0;
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
  }

  .slide-left-leave-active,
  .slide-right-enter {
    opacity: 0;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }

  .headImg {
    display: block;
    width: 0.8rem;
    height: 0.8rem;
    margin: 0 auto;
    background: white;
    border-radius: 50%;
    margin-top: 0.2rem;
  }
</style>
