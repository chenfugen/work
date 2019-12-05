沁园项目开发文档
-------
### 项目简介
本项目为沁园设备管理后台系统,主要是对他们的设备信息、运行状态、售后数据进行统计、查询、管理。以及对他们的设备进行远程操作、升级等.

### 项目技术文档
   - 项目框架
     - Js框架:angular.js  --版本号：1.5.8

     - UI框架  layui  --版本号：2.4.5

     - ztree插件  --版本号：3.5.19

     - sass预编辑  --版本号：3.x.x

  - 沁园项目地址
     - 项目正式服地址：https://iot2.qinyuan.cn
     - 项目测试服地址：https://qinyuan-slb.yunext.com:441
     - 公司测试服地址：https://qinyuan-test.yunext.com

  - 沁园项目接口地址
    - 项目正式服接口地址：https://iot2.qinyuan.cn/web/api
    - 项目测试服接口地址：https://qinyuan-slb.yunext.com:441/web/api

  - 沁园管理后台api文档
      - 测试服：http://qinyuan-test.yunext.com/swagger-ui.html#/

  - 公司管理托管平台地址
      - [gitlab]：https://gitlab.yunext.com

  - 高德地图API文档
     - 获取高德文档地址：https://webapi.amap.com/maps?v=1.3&key=eb0a2b2199fbc67ac5b3c84faf91d519&plugin=AMap.MarkerClusterer

### 运行环境
   本地运行的话需要进行ngnix本地服务代理

### 使用说明
   当你对项目进行更改编辑的时候，需要对代码进行混淆、压缩。本项目运用了gulp自动化构建工具进行打包、压缩、代码混淆。
   会将混淆压缩过的项目代码放入dist文件夹中、后台获取的也是dist文件内容作文项目线上内容。   
   ###### sass操作流程
    sass中文网：https://www.sass.hk/install/

   ###### gulp操作流程
    1、下载gulp依赖
       npm install （npm下载，或是npm淘宝镜像 cnpm install）
       
    2、运行项目
       index.html入口

    3、通过项目文件gulpfile.js进行打包
       gulp build     

### 分支管理
master              主分支-用于项目移交
release             发布分支-用于项目发布
develop/xxxxxx      开发分支-用于项目合作开发
2g-wifi             废弃分支


### 项目结构

#### 项目文档结构
│  .project
├─config     //gulp配置文档包    
├─dist       //项目最终生成版本(压缩混合)    
├─qinyuan2G       //项目编辑包    
├─.gitignore       //项目git上传可忽略内容      
├─gulpfile.js      //gulp操作详情      
├─package-lock.json       //项目npm package的具体来源和版本号      
├─package.json       //项目(配置)所需要的各种模块、插件等      

#### 项目结构详情    
│  .project    
│  home.html      //首页    
│  imgView.html   //浏览图片    
│  index.html     //登录页         
├─css
│  │  common.css   //通用样式    
│  │  iconfont.css  //图标样式    
│  │  zTreeStyle.css  //树形结构样式    
│  ├─.sass-cache    //sass文件                   
│  ├─img  //树形结构图库    
│  │      
│  └─style      
│      │  config.rb    
│      ├─.sass-cache  //sass文件(自动生成)            
│      ├─sass    
│      │      style.scss  //css编译文件      
│      └─stylesheets    
│              style.css    //编译生成的css,项目中引用             
├─font   //图标字体文件包    
├─images  //图片包       
├─js
│  ├─business             //公用js包    
│  │      api.js           //接口文件    
│  │      common.js       //公用函数包    
│  │      config.js       //angualr配置文件    
│  │      controllers.js  //整个项目的控制文件    
│  │      cookie.js      //cookie封装文件    
│  │      lib.js        //公用函数包           
│  ├─controllers       //各模块控制js代码    
│  │      advert.js     //广告    
│  │      device.js     //设备    
│  │      fault.js      //故障    
│  │      FMS.js        //FMS    
│  │      log.js        //日志    
│  │      messages.js   //消息    
│  │      module.js     //模块    
│  │      netWork.js    //通信    
│  │      product.js   //产品    
│  │      system.js    //系统    
│  │      update.js    //升级    
│  │      user.js      //个人中心    
│  │      
│  └─dependency    //框架js包    
│      │  angular-1.5.8.min.js    
│      │  angular-resource-1.5.8.min.js    
│      │  angular-route-1.5.8.min.js    
│      │  angular.min.js    
│      │  jquery.min.js    
│      │  jquery.uploadView.js    
│      │  layui.all.js    
│      │  layui.js    
│      │  table-excel.js    
│      │  ztree.core.min.js    
│      │  ztree.excheck.min.js    
│      │  ztree.exhide.min.js    
│      │  
│      ├─css     //layui框架css包    
│      │  │  layui.css    
│      │  │  layui.mobile.css    
│      │  └─modules   //layui框架模块包      
│      ├─font   //layui字体图标包
│      │      iconfont.eot    
│      │      iconfont.svg    
│      │      iconfont.ttf    
│      │      iconfont.woff       
│      └─wangEditor   //富文本编辑器文件包    
│          │  wangEditor.css    
│          │  wangEditor.js        
│          │  wangEditor.min.css    
│          │  wangEditor.min.js    
│          │  wangEditor.min.js.map    
│          └─fonts    
│                  w-e-icon.woff                  
├─lay         //lay包    
│  └─modules     
└─pages    
    ├─advert                  //广告管理    
    │      advertManage.html   
    │      
    ├─common                  //组建页    
    │      city.html           //城市三元组  
    │      
    ├─device                  //设备管理  
    │      deviceDetails.html   //设备详情  
    │      deviceList.html      //设备列表  
    │      deviceMap.html        //设备地图  
    │      deviceTdsDetail.html   //水质地图二级页面  
    │      deviceTdsMap.html     //水质地图  
    │      deviceTrend.html     //设备趋势  
    │      
    ├─fault                    //故障管理  
    │      faultDetails.html    //故障详情  
    │      faultList.html       //故障列表  
    │      faultMaintain.html   //已去除  
    │      faultRepair.html     //设备报修  
    │      faultScheme.html     //设备预处理设置  
    │      faultSetUp.html      //设备设置  
    │      faultTrend.html      //设备趋势  
    │      
    ├─FMSManage                //FMS管理  
    │      proDimension.html   //产品维度  
    │      regionAmend.html    //地区维度   
    │      unitAmend.html      //个人系数   
    │       
    ├─log                      //日志管理   
    │      administratorsLog.html    //管理日志   
    │      faultLog.html            //故障日志  
    │      faultLogDetails.html     //故障日志详情  
    │      userLog.html             //用户日志  
    │      waterIntakeLog.html      //取水日志  
    │      
    ├─message                 //详细管理  
    │      messageFeedback.html   //详细  
    │      messageList.html      //意见反馈  
    │      pushMessage.html      //消息推送  
    │      pushObject.html       //消息类型  
    │      pushRule.html         //推送规则  
    │      setUp.html            //消息设置  
    │       
    ├─module                   //模块管理  
    │      stockList.html       //库存列表    
    │      usedList.html        //使用列表  
    │      
    ├─netWordManage            //流量卡管理  
    │      cardDetails.html    //物联卡管理详情  
    │      cardManage.html     //物联卡管理  
    │      statistics.html     //流量统计  
    │      
    ├─person                  //个人中心  
    │      password.html       //已去除  
    │      personal.html       //个人信息  
    │       
    ├─product                 //产品管理  
    │      addAttribute.html   //自定义属性  
    │      docSets.html       //文档设置  
    │      productAdd.html     //已去除  
    │      productDetail.html  //产品详情  
    │      productEdit.html    //产品设置  
    │      productList.html    //产品列表  
    │       
    ├─systemSetup            //系统设置  
    │      managerDetails.html   //管理详情  
    │      managerList.html       //系统用户  
    │      roleManage.html       //角色管理  
    │      
    └─user                     //用户管理  
           userDetails.html     //用户详情  
           userList.html        //用户列表  
           userTrend.html       //用户趋势  


    ### 项目版本  
    1、ilop1.0初版  
    2、ilop2.0  
    3、2G项目  

   ### 其他联系信息  

   - 公司名称：海大物联科技有限公司  
   - 项目开发者：陈福根、娄烽（前端）,周强、陈金佩（后台）  
