'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  baseUrl: '"http://localhost:8700/api/v1/admin"' // 注意，这里用了admin自己的地址，而不是后台api的地址，因为在config/index.js中有代理转发到后台api地址的。,
  SECRET: '""',
  TOKEN: '""',
  APP_ID: '""',
  APP_SECRET: '""',
})
