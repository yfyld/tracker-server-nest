import { UserModel, RoleModel } from './user.model';
import { UserService } from './user.service';
import { SignupDto, SigninDto, TokenDto, UserListReqDto, UpdateUserDto } from './user.dto';
import { QueryListQuery, PageData } from '@/interfaces/request.interface';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getRoles(): Promise<RoleModel[]>;
    checkToken(): string;
    signin(body: SigninDto): Promise<TokenDto>;
    signup(user: SignupDto): Promise<TokenDto>;
    updateUser(body: UpdateUserDto, user: UserModel): Promise<void>;
    getUserInfo(user: UserModel): Promise<UserModel>;
    getUsers(query: QueryListQuery<UserListReqDto>): Promise<PageData<UserModel>>;
}
