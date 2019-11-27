import { UserService } from './../modules/user/user.service';
import { ExecutionContext } from '@nestjs/common';
declare const JwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    private readonly userService;
    constructor(userService: UserService);
    canActivate(context: ExecutionContext): Promise<any>;
    handleRequest(error: any, authInfo: any, errInfo: any): any;
}
export {};
