export const DB_CONNECTION_TOKEN = 'DB_CONNECTION_TOKEN';
export const MALICIOUS_OPS_MESSAGE = { message: '请勿恶意操作' };
export const ROLE_CODE_GLOBAL_ADMIN = 'GLOBAL_ADMIN'; // 平台超管权限角色标识CODE
export const REDIS_EX_SHORT_TIME = 600; // 十分钟的秒数
export const REDIS_EX_LONG_TIME = 86400; // 一天的秒数
export const REDIS_PREFIX_KEY = 'telescope_';
export const REDIS_KEY_ROLE_GLOBAL_ADMIN_ID = REDIS_PREFIX_KEY + 'role_global_admin_id';
export const REDIS_KEY_ALL_PERMISSIONS = REDIS_PREFIX_KEY + 'all_permissions';
export const REDIS_KEY_ALL_ROLES = REDIS_PREFIX_KEY + 'all_roles';
export const GLOBAL_ADMIN_USERNAME = 'admin';
export const CUSTOM_TOKEN_KEY = 'TELESCOPE_TOKEN';
export const IS_LOGIN = 'TELESCOPE_LOGIN';
export const PageTypes = [
  {
    label: '首页',
    value: 'home_page'
  },
  {
    label: '搜索页',
    value: 'search_page'
  },
  {
    label: '活动页',
    value: 'activity_page'
  },
  {
    label: '列表页',
    value: 'list_page'
  },
  {
    label: '商品详情页',
    value: 'goods_detail_page'
  },
  {
    label: '内容详情页',
    value: 'content_detail_page'
  },
  {
    label: '医生详情页',
    value: 'doctor_detail_page'
  },
  {
    label: '订单页',
    value: 'order_page'
  },
  {
    label: '支付页',
    value: 'pay_page'
  },
  {
    label: '问诊页',
    value: 'diagnosis_page'
  },
  {
    label: '处方页',
    value: 'prescription_page'
  },
  {
    label: '购物车页',
    value: 'shop_cart'
  },
  {
    label: '其他',
    value: 'other'
  }
];
