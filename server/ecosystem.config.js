module.exports = {
  apps: [
    {
      name: 'smsServer',
      script: './index.js',
      env: {
        NODE_ENV: 'development'
      },
      env_test: {
        NODE_ENV: 'test'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
