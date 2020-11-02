沁园滤芯抽检工具项目文档
-------
#### 项目简介
本项目为沁园滤芯抽检工具

#### 项目技术文档

   - 项目框架
     - node:版本号：10.15.0
	 
     - Js框架:vue.js  --版本号：2.6.11
     
     - UI框架  vant  --版本号：2.4.7
     
     - sass预编辑  --版本号：4.12.0
     
     - vuex数据管理库    --版本号：3.1.3  
      
 

#### 运行环境
  vue-cli4.0环境
   
#### 使用说明 
  
    1、下载项目依赖
       cnpm install
       
    2、运行项目
       cnpm run serve
    		
    3、打包正式服版本
       cnpm run build 
	   
    4、打包测试服版本
       cnpm run release 

#### 项目文档结构
├─ dist            //正式服   
├─ test            //测试服                                         
├─ node_modules    //依赖  
├─ public          //项目入口      
├─ src             //项目代码文件  
│  ├─ assets       //vue自带文件包 
│  │   ├─ css         //样式  
│  │   ├─ font        //图标       
│  │   ├─ image       //图片      
│  │   └─ js          //js文件             
│  ├─ axios        //数据请求封装文件  
│  ├─ components   //各个封装组件   
│  ├─ router       //路由配置                 
│  ├─ store        //数据中心  
│  ├─ view         //页面文件      
│  ├─ app.vue      //入口vue文件       
│  └─ main.js      //项目配置引入        
├─ .env            //配置文件       
├─ .gitignore          //项目git上传可忽略内容   
├─ package-lock.json   //项目npm package的具体来源和版本号   
├─ package.json        //项目(配置)所需要的各种模块、插件等            
├─ vue.config.js          //项目配置文件

#### 项目版本
   1.0.0
    
#### 其他联系信息
   
   - 公司名称：海大物联科技有限公司
   - 项目开发者：陈福根、陈金佩、（后台）

