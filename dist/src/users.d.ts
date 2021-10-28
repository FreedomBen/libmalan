import { BaseResp } from './utils';
import MalanConfig from './config';
declare type BaseUserResp = {
    id: string;
    birthday: string;
    email: string;
    email_verified: boolean;
    ethnicity: string;
    first_name: string;
    gender: string;
    height: number;
    race: Array<String>;
    last_name: string;
    nick_name: string;
    password: string;
    preferences: {
        theme: string;
    };
    privacy_policy_accept_events: Array<string>;
    roles: Array<string>;
    sex: string;
    tos_accept_events: Array<string>;
    username: string;
    weight: number;
    latest_tos_accept_ver: number;
    latest_pp_accept_ver: number;
    tos_accepted: boolean;
    privacy_policy_accepted: boolean;
    custom_attrs: object;
};
declare type UserResponse = BaseResp & BaseUserResp;
declare type WhoamiResponse = BaseResp & {
    user_id: string;
    user_roles: Array<string>;
    expires_at: string;
    terms_of_service: string;
    privacy_policy: string;
};
interface CreateUserParams {
    email: string;
    username: string;
    password: string;
    first_name: string;
    last_name: string;
}
interface UpdateUserParams {
    email?: string;
    username?: string;
    password?: string;
    first_name?: string;
    last_name?: string;
    nick_name?: string;
    sex?: string;
    gender?: string;
    race?: Array<string>;
    ethnicity?: string;
    birthday?: string;
    weight?: number;
    height?: number;
    roles?: Array<string>;
    custom_attrs?: object;
}
declare function createUser(c: MalanConfig, params: CreateUserParams): Promise<UserResponse>;
declare function getUser(c: MalanConfig, id: string): Promise<UserResponse>;
declare function whoamiFull(c: MalanConfig): Promise<UserResponse>;
declare function whoami(c: MalanConfig): Promise<WhoamiResponse>;
declare function updateUser(c: MalanConfig, id: string, params: UpdateUserParams): Promise<UserResponse>;
declare function acceptTos(c: MalanConfig, id: string, accept: boolean): Promise<UserResponse>;
declare function acceptPrivacyPolicy(c: MalanConfig, id: string, accept: boolean): Promise<UserResponse>;
export { UserResponse, WhoamiResponse, CreateUserParams, UpdateUserParams, getUser, whoami, whoamiFull, createUser, updateUser, acceptTos, acceptPrivacyPolicy, };
