export declare class SigninDto {
    username: string;
    password: string;
}
export declare class TokenDto {
    accessToken: string;
    expiresIn: number;
}
export declare class SignupDto {
    username: string;
    nickname: string;
    password: string;
}
export declare class UpdateUserDto {
    nickname: string;
    email: string;
    mobile: string;
}
export declare class UserListReqDto {
    name: string;
}
