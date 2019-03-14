const fs = require('fs');
const options = {
  flags: 'a',        // append模式
  encoding: 'utf8',  // utf8编码
};

const stdout = fs.createWriteStream('./stdout.log', options);
const stderr = fs.createWriteStream('./stderr.log', options);

// 创建logger
const logger = new console.Console(stdout, stderr);

exports.log = function(content...) {
  logger.log(content...)
}
