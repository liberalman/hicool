使用了nginx之后，把生成的静态js文件直接放nginx目录下就可以了，所以这个web服务就用不到了
/*let express = require('express');
let config = require('./config/index');
var morgan = require('morgan');
var fs = require('fs');
var path = require('path');
var FileStreamRotator = require('file-stream-rotator');

let app = express();

var logDirectory = path.join(__dirname, 'log');
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
// create a rotating write stream
var accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: path.join(logDirectory, 'hicool-%DATE%.log'),
  frequency: 'daily',
  verbose: false
});
// 自定义format
//morgan.format('joke', '[joke] :method :url :status');
app.use(morgan('combined', {stream: accessLogStream}));
app.use(express.static('./dist/'));

let port = process.env.PORT || config.build.port;
module.exports = app.listen(port, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Listening at: http://localhost:' + port + '\n');
});*/
