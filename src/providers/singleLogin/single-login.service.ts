import { Injectable } from '@nestjs/common';

export interface SingleLoginUserInfo {
  username: string;
  nickname: string;
  email: string;
  mobile: string;
}

let sso;

async function getEmployeeInfo(sessionId) {
  if (!sso) {
    sso = require('@91jkys/sso-client');
  }
  return sso.EmployeeService.getEmployeeInfo(sessionId);
}

async function getCookieName() {
  if (!sso) {
    sso = require('@91jkys/sso-client');
  }
  return sso.ConfigService.getConfig().then(data => {
    return data.cookie_name;
  });
}

@Injectable()
export class SingleLoginService {
  public async getUserInfo(cookies): Promise<SingleLoginUserInfo> {
    try {
      const cookieKey = await getCookieName();
      const cookieValue = cookies[cookieKey];
      const user = await getEmployeeInfo(cookieValue);
      return {
        username: user.username,
        nickname: user.display_name,
        email: user.email,
        mobile: user.mobile,
      };
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error(e);
    }
  }
}
