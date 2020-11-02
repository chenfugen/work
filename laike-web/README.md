# lexy1.0

# About

此项目是 莱克定制化平台+莱克标准化平台 后台管理系统部分，用于莱克定制化平台以及标准化平台的产品管理、设备管理、故障管理等。

# 开发人员

duanxl(duanxl@hadlinks.com)
nelson(louf@hadlinks.com)

# 分支管理

- master 主管理分支
- release 发布版本
- develop 开发版本
- develop_... 不同开发人员版本
- hotfix 紧急修复版本
- feature/...  功能开发或codeReview 分支


# 说明
...

# 技术栈

vue-cli3.0框架搭建


# 项目运行

```
git clone 

cd 

npm i

npm run dev

```

# 服务器说明

        测试服： laike-test.yunext.com

        正式服： https://iot.lexy.cn/


# 项目目录
    |-- Laike
    |-- .DS_Store
    |-- .editorconfig
    |-- .gitignore
    |-- README.md
    |-- babel.config.js
    |-- package-lock.json
    |-- package.json
    |-- vue.config.js
    |-- public
    |-- src
    |   |-- App.vue
    |   |-- indexEcharts.js
    |   |-- main.js
    |   |-- router.js
    |   |-- service.js
    |   |-- assets
    |   |   |-- css
    |   |   |-- iconfont
    |   |   |-- imges
    |   |   |-- js
    |   |       |-- Blob.js
    |   |       |-- Export2Excel.js
    |   |       |-- citys.json
    |   |       |-- menuTree.js
    |   |       |-- staticData.js
    |   |-- components
    |   |   |-- headComp.vue
    |   |   |-- sidebar.vue
    |   |   |-- table.vue
    |   |   |-- tableSearch.vue
    |   |-- libs
    |   |   |-- filter.js
    |   |   |-- http.js
    |   |   |-- loading.js
    |   |   |-- utils.js
    |   |-- standard
    |   |   |-- router.js
    |   |   |-- service.js
    |   |   |-- utils.js
    |   |   |-- components
    |   |   |   |-- pagination.vue
    |   |   |   |-- searchList.vue
    |   |   |   |-- table.vue
    |   |   |-- views
    |   |       |-- fault
    |   |       |   |-- code.vue
    |   |       |   |-- record.vue
    |   |       |   |-- statistical.vue
    |   |       |-- product
    |   |           |-- add.vue
    |   |           |-- module.vue
    |   |           |-- type.vue
    |   |-- store
    |   |   |-- index.js
    |   |   |-- store.js
    |   |   |-- modules
    |   |       |-- oldStore.js
    |   |       |-- project.js
    |   |-- views
    |       |-- index.vue
    |       |-- login.vue
    |       |-- pdf.vue
    |       |-- pages
    |           |-- map.vue
    |           |-- device
    |           |   |-- chefMachine.vue
    |           |   |-- details.vue
    |           |-- edition
    |           |   |-- MCU.vue
    |           |   |-- appEdition.vue
    |           |   |-- wifiEdition.vue
    |           |-- fault
    |           |   |-- faultCode.vue
    |           |   |-- faultRecord.vue
    |           |   |-- fualtStatistics.vue
    |           |-- menu
    |           |   |-- menuAdd.vue
    |           |   |-- menuAddCf5.vue
    |           |   |-- menuChildAdd.vue
    |           |   |-- menuChildEdit.vue
    |           |   |-- menuDetails.vue
    |           |   |-- menuEdit.vue
    |           |   |-- menuList.vue
    |           |   |-- menuStatistics.vue
    |           |   |-- menuType.vue
    |           |   |-- style
    |           |       |-- menuAdd.less
    |           |       |-- menuAddCf5.less
    |           |       |-- menuChild.less
    |           |       |-- menuDetail.less
    |           |-- message
    |           |   |-- messageFeedback.vue
    |           |   |-- messageNewPush.vue
    |           |-- plantSurvey
    |           |   |-- details.vue
    |           |   |-- plantSurveyList.vue
    |           |   |-- plantSurveyStatistics.vue
    |           |-- product
    |           |   |-- productTypoe.vue
    |           |-- system
    |           |   |-- instructions.vue
    |           |   |-- systemAccount.vue
    |           |   |-- systemAdvert.vue
    |           |   |-- systemRecord.vue
    |           |   |-- systemRole.vue
    |           |   |-- systemSet.vue
    |           |-- user
    |               |-- user.vue
    |-- staticPage


# 效果演示
        
# 开发规范

- 报错信息：
        调用后台工具类报错，具体报错信息由工具类打印。调用处调用出错功能点。

# 功能列表


# 账号登记

# 其他

# 版本发布记录


2020/09/24 
domain: https://iot.lexy.cn/
vps ip: 47.103.23.113
branch: release
commitId: acd2d7c8949893210c54aa0d81b73f5ee4443459