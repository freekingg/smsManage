const demoRouter = {
  route: null,
  name: null,
  title: '短信管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-naozhongxiaoxitixing',
  filePath: 'view/task/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '信息列表',
      type: 'view',
      name: 'smsData',
      route: '/sms/data',
      filePath: 'view/sms/sms-data.vue',
      inNav: true,
      icon: 'iconfont icon-rizhiguanli',
    },
  ],
}

export default demoRouter
