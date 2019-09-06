# hicool
hicool is a web site that is development by Vue.js

## Build Setup

``` bash
# install dependencies
yarn install

# serve with hot reload at localhost:5001
yarn dev

# build for production with minification
yarn build

# build for production and view the bundle analyzer report
yarn build --report

# after build, serve at localhost:5000
yarn start

# run unit tests
yarn unit

# run all tests
yarn test
```

由于做全站https，申请了2个证书，分别是www.hicool.top用于本站和image.hicool.top用于七牛云的，
这样就达到 访问本站 和 网页内嵌入的图片都是https的，否则只给本站加https，而图片继续用http的话，浏览器会拒绝加载图片的.

