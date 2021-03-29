import { Injectable } from '@nestjs/common';

export interface SingleLoginUserInfo {
  username: string;
  nickname: string;
  email: string;
  mobile: string;
}

export interface ISsoInfo {
  username: string;
  display_name: string;
  email: string;
  mobile: string;
}

@Injectable()
export class SingleLoginService {
  sso = null;
  async getEmployeeInfo(sessionId): Promise<ISsoInfo> {
    if (!this.sso) {
      this.sso = require('@91jkys/sso-client');
    }
    const user = this.sso.EmployeeService.getEmployeeInfo(sessionId);
    return user;
  }

  public async getCookieName(): Promise<string> {
    if (!this.sso) {
      this.sso = require('@91jkys/sso-client');
    }
    return this.sso.ConfigService.getConfig().then(data => {
      return data.cookie_name;
    });
  }

  public async getUserInfo(cookies): Promise<SingleLoginUserInfo> {
    try {
      const cookieKey = await this.getCookieName();
      const cookieValue = cookies[cookieKey];
      const user = await this.getEmployeeInfo(cookieValue);
      return {
        username: user.username,
        nickname: user.display_name,
        email: user.email,
        mobile: user.mobile
      };
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error(e);
    }
  }
}
