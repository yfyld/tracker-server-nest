import { UserModel, RoleModel } from './user.model';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { SignupDto, TokenDto, UserListReqDto, UpdateUserDto } from './user.dto';
import { PageData, QueryListQuery } from '@/interfaces/request.interface';
export declare class UserService {
    private readonly userModel;
    private readonly roleModel;
    private readonly jwtService;
    constructor(userModel: Repository<UserModel>, roleModel: Repository<RoleModel>, jwtService: JwtService);
    private encodeBase64;
    private encodeMd5;
    private getPermissionsById;
    createToken(user: UserModel): Promise<TokenDto>;
    refreshToken(token: any): Promise<TokenDto>;
    validateAuthData(payload: any): Promise<any>;
    signin({ username, password }: {
        username: any;
        password: any;
    }): Promise<TokenDto>;
    getUserByUsername(username: string): Promise<UserModel>;
    getUsers(query: QueryListQuery<UserListReqDto>): Promise<PageData<UserModel>>;
    getRoles(): Promise<RoleModel[]>;
    addUser(user: SignupDto): Promise<UserModel>;
    deleteUser(userId: number): Promise<void>;
    updateUser(body: UpdateUserDto, userId: number): Promise<void>;
}
