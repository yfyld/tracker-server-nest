export interface SingleLoginUserInfo {
    username: string;
    nickname: string;
    email: string;
    mobile: string;
}
export declare class SingleLoginService {
    getUserInfo(cookies: any): Promise<SingleLoginUserInfo>;
}
