import * as crypto from 'crypto';

export function aesEncrypt(data: string, password: string) {
  const key = crypto.scryptSync(password, 'salt', 16);
  const iv = Buffer.alloc(16, 0);
  let sign = '';
  const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
  sign += cipher.update(data, 'utf8', 'hex');
  sign += cipher.final('hex');
  return sign;
}

export function aesDecrypt(encrypted: string, password: string) {
  const key = crypto.scryptSync(password, 'salt', 16);
  const iv = Buffer.alloc(16, 0);
  let src = '';
  const cipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
  src += cipher.update(encrypted, 'hex', 'utf8');
  src += cipher.final('utf8');
  return src;
}
