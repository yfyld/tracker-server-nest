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
    return value.replace(/\s+/g, '');
  }

  static enCodeID(id): string {
    let sourceString = '431EYZDOWGVJ5AQMSFCU2TBIRPN796XH0KL';
    let num = parseInt(id) + 100000000000;

    let code = '';

    while (num > 0) {
      let mod = num % 35;

      num = (num - mod) / 35;

      code = sourceString.substr(mod, 1) + code;
    }

    return code;
  }

  /**
   * 移除首尾空格
   * @param value: 需要移除首尾空格的字符串
   * @return string
   */
  static trim(value: string): string {
    return value.replace(/^\s+|\s+$/gm, '');
  }

  static arrToMap<T = any>(arr: T[], fieldNameArr: string[]) {
    const map = new Map<string, T>();
    arr.forEach(item => {
      const fieldValue = fieldNameArr.reduce((result, fieldName) => result + item[fieldName], '');
      if (fieldValue) {
        map.set(fieldValue, item);
      }
    });
    return map;
  }

  static generatePassword(pasLen: number) {
    const pasArr = [
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '_',
      '-',
      '$',
      '%',
      '&',
      '@',
      '+',
      '!'
    ];

    //pasLen是你想要的密码的长度

    let password = '';
    let pasArrLen = pasArr.length;
    for (let i = 0; i < pasLen; i++) {
      let x = Math.floor(Math.random() * pasArrLen);
      password += pasArr[x];
    }
    return password;
  }
}
