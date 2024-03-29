'use strict';
module.exports = {
  port: 5001,
  siteDomain: 'http://localhost:5000',
  debug: true,
  db: {
    database: 'sms-manage',
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    username: 'root',
    password: '123456789',
    logging: false,
    // timezone: '+08:00',
    dialectOptions: {
      dateStrings: true,
      typeCast: true
    },
    define: {
      charset: 'utf8mb4'
    }
  },
  secret: '\x88W\xf09\x91\x07\x98\x89\x87\x96\xa0A\xc68\xf9\xecJJU\x17\xc5V\xbe\x8b\xef\xd7\xd8\xd3\xe6\x95*4' // 发布生产环境前，请务必修改此默认秘钥
};
