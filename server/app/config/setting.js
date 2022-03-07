const path = require('path');
let env = {};
if (process.env.NODE_ENV === 'production') {
  env = require('./env.prod');
} else if (process.env.NODE_ENV === 'test') {
  env = require('./env.test');
} else {
  env = require('./env.dev');
}

module.exports = {
  port: env.port,
  siteDomain: env.siteDomain,
  countDefault: 10,
  pageDefault: 0,
  apiDir: 'app/api',
  accessExp: 60 * 60, // 1h 单位秒
  // 指定工作目录，默认为 process.cwd() 路径
  baseDir: path.resolve(__dirname, '../../'),
  // debug 模式
  debug: env.debug,
  // refreshExp 设置refresh_token的过期时间，默认一个月
  refreshExp: 60 * 60 * 24 * 30,
  // 暂不启用插件
  pluginPath: {
    // // plugin name
    // poem: {
    //   // determine a plugin work or not
    //   enable: true,
    //   // path of the plugin
    //   path: "app/plugin/poem",
    //   // other config
    //   limit: 2
    // },
  },
  // 是否开启登录验证码
  loginCaptchaEnabled: false
};
