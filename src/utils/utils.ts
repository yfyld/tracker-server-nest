import { Base64 } from 'js-base64';
import { createHash } from 'crypto';

/**
 * 工具类
 * @author Gavin<wenzhang@91jkys.com>
 * @date 2020-03-09
 */
export default class Utils {
  /**
   * base64编码
   * @param value: 需要编码的字符串
   * @return string
   */
  static encodeBase64(value: string): string {
    return value ? Base64.encode(value) : value;
  }

  /**
   * MD5加密
   * @param value: 需要加密的字符串
   * @return string
   */
  static encodeMd5(value: string): string {
    return createHash('md5')
      .update(value)
      .digest('hex');
  }

  /**
   * 移除所有空格
   * @param value: 需要移除所有空格的字符串
   * @return string
   */
  static trimAll(value: string): string {
    return value.replace(/\s+/g,'');
  }

  /**
   * 移除首尾空格
   * @param value: 需要移除首尾空格的字符串
   * @return string
   */
  static trim(value: string): string {
    return value.replace(/^\s+|\s+$/gm,'');
  }
}