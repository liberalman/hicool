# vue-antd-admin
**[Ant Design Pro](https://github.com/ant-design/ant-design-pro) 的 Vue 实现**

http://okoala.github.io/vue-antd/#!/docs/download   vue-antd

git clone --depth=1 https://github.com/iczer/vue-antd-admin.git

一个开箱即用的中后台前端/设计解决方案（主要依赖组件库 [ant-design-vue](https://github.com/vueComponent/ant-design-vue) ）

[预览地址](https://iczer.gitee.io/vue-antd-pro)

![](https://github.com/iczer/vue-antd-admin/blob/master/static/img/preview.jpg)


https://vue.ant.design/components/popconfirm-cn/

## 环境
* node -- 运行/编译
* yarn -- 依赖管理
* webpack -- 打包
* eslint -- 代码规约
* vue-cli -- 构建

## 安装
克隆项目到本地:
```
$ git clone https://github.com/iczer/vue-antd-admin.git
```
安装依赖：
```
$ yarn install
```
## 启动
```
$ yarn start
```
注意，以上启动只是启动dev测试版本。如果要在生产环境运行，需要将utils/api.js、config/index.js等文件配置为远程服务器地址，然后编译
```
$ yarn build
```
将编译的dist目录打包上传到远程服务器，和 prod.server.js 放在同一目录，执行启动
```
$ node prod.server.js
```
这样才是在生产环境成功启动。

## 文档
编写中...
## 说明
该项目由仓主在业余由兴趣驱动完成，仍在不断开发完善中。详见：[开发进度](https://github.com/iczer/vue-antd-admin/projects/1)

如有任何疑问或功能需求，欢迎 [Issue](https://github.com/iczer/vue-antd-admin/issues)。

上传代码

package.json

scp -P 2222 -i ~/.ssh/id_rsa -r build _config.yml config src test index.html prod.server.js \
 static .babelrc .eslintrc.js .eslintignore .postcssrc.js .editorconfig .postcssrc.js shouchao.zheng@10.124.72.4:/home/shouchao.zheng/battery-trace-admin
