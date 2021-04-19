import * as users from '../src/users';
import * as sessions from '../src/sessions';
export declare const randomStr: () => string;
export declare const randomUsername: () => string;
export declare function adminAccount(): Promise<any>;
export declare function moderatorAccount(): Promise<any>;
export declare function regularAccount(): Promise<users.UserResponse & {
    session: sessions.SessionResponse;
}>;
export declare const uuidRegex: RegExp;
export declare function testUser(): void;
export declare function testSession(user: any): void;
