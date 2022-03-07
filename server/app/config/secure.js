'use strict';

console.log('NODE_ENV', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./env.prod');
} else if (process.env.NODE_ENV === 'test') {
  module.exports = require('./env.test');
} else {
  module.exports = require('./env.dev');
}

// 配置 说明
// https://doc.cms.talelin.com/server/koa/config.html
