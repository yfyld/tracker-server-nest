export const EVENT_ATTRS = [
  {
    name: '日志类型',
    value: 'actionType',
    type: 'string',
    eventType: 0,
    recommend: [
      {
        text: '页面访问',
        value: 'PAGE'
      },
      {
        text: '事件',
        value: 'EVENT'
      },
      {
        text: '页面停留',
        value: 'DURATION'
      },
      {
        text: '视区',
        value: 'VIEW'
      }
    ]
  },
  {
    name: '端类型',
    value: 'ua',
    type: 'string',
    eventType: 0,
    recommend: [
      {
        text: '智云健康',
        value: 'zhiyun_patient'
      },
      {
        text: '微信',
        value: 'micromessenger'
      }
    ]
  },
  {
    name: '页面Id',
    value: 'pageId',
    type: 'string',
    eventType: 1,
    recommend: [],
    autoRecommend: true
  },
  {
    name: 'trackId',
    value: 'trackId',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: false
  },
  {
    name: '事件名称',
    value: 'eventName',
    type: 'string',
    eventType: 1,
    recommend: [
      {
        text: '点击',
        value: 'CLICK'
      }
    ],
    autoRecommend: true
  },

  {
    name: '网络类型',
    value: 'netType',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },

  {
    name: '用户uid',
    value: 'uid',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },

  {
    name: '是否登录',
    value: 'isLogin',
    type: 'string',
    eventType: 0,
    recommend: [
      {
        text: '是',
        value: 'true'
      },
      {
        text: '否',
        value: 'false'
      }
    ],
    autoRecommend: false
  },

  {
    name: '用户标识utoken',
    value: 'utoken',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: false
  },

  {
    name: '设备Id',
    value: 'deviceId',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: false
  },

  {
    name: '页面标题',
    value: 'title',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },
  {
    name: '页面URL',
    value: 'url',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },
  {
    name: '页面PATH',
    value: 'path',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },
  {
    name: '页面HASH',
    value: 'hash',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },
  {
    name: '页面HOST',
    value: 'host',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },
  {
    name: 'referrerURL',
    value: 'referrerUrl',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },
  {
    name: 'referrerId',
    value: 'referrerId',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },
  {
    name: '元素Id',
    value: 'domId',
    type: 'string',
    eventType: 1,
    recommend: [],
    autoRecommend: true
  },
  {
    name: '元素Class',
    value: 'domClass',
    type: 'string',
    eventType: 1,
    recommend: [],
    autoRecommend: true
  },
  {
    name: '元素内容',
    value: 'domContent',
    type: 'string',
    eventType: 1,
    recommend: [],
    autoRecommend: true
  },
  {
    name: '元素标签名',
    value: 'domTag',
    type: 'string',
    eventType: 1,
    recommend: [],
    autoRecommend: true
  },
  {
    name: '元素链接',
    value: 'domLink',
    type: 'string',
    eventType: 1,
    recommend: [],
    autoRecommend: true
  },
  {
    name: '浏览器',
    value: 'browser',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },
  {
    name: '浏览器版本',
    value: 'browserVersion',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },
  {
    name: '操作系统',
    value: 'os',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },
  {
    name: '操作系统版本',
    value: 'osVersion',
    type: 'string',
    eventType: 0,
    recommend: []
  },
  {
    name: '内核',
    value: 'engine',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },
  {
    name: '内核版本',
    value: 'engineVersion',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },
  {
    name: '设备型号',
    value: 'deviceModel',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },
  {
    name: '平台类型',
    value: 'deviceType',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },

  {
    name: '国家',
    value: 'country',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },
  {
    name: '省份',
    value: 'province',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },
  {
    name: '城市',
    value: 'city',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },
  {
    name: 'IP',
    value: 'ip',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },
  {
    name: '版本',
    value: 'version',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },
  {
    name: '屏幕高',
    value: 'clientHeight',
    type: 'number',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },
  {
    name: '屏幕宽',
    value: 'clientWidth',
    type: 'number',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },
  {
    name: '像素比',
    value: 'radio',
    type: 'number',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },

  {
    name: 'SDK类型',
    value: 'libType',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },
  {
    name: 'SDK版本',
    value: 'libVersion',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },
  {
    name: '渠道',
    value: 'channel',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },
  {
    name: 'AppId',
    value: 'appId',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },
  {
    name: '手机产品',
    value: 'product',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },
  {
    name: '系统定制商',
    value: 'deviceBrand',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },
  {
    name: '支持操作系统',
    value: 'supportedAbi',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },
  {
    name: '系统版本号',
    value: 'androidSdkInt',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },
  {
    name: '是否真机',
    value: 'isPhysicalDevice',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },
  {
    name: '自定义参数',
    value: 'custom',
    type: 'string',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  },
  {
    name: '自定义数值',
    value: 'score',
    type: 'number',
    eventType: 0,
    recommend: [],
    autoRecommend: true
  }
];
