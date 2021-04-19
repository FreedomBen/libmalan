"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testSession = exports.testUser = exports.uuidRegex = exports.regularAccount = exports.moderatorAccount = exports.adminAccount = exports.randomUsername = exports.randomStr = void 0;
const users = require("../src/users");
const sessions = require("../src/sessions");
const test_config_1 = require("../test/test_config");
let admin_account;
let moderator_account;
let regular_account;
function adminUserParams() {
    const num = exports.randomStr();
    return {
        email: `adminuser${num}@libmalan.com`,
        username: `adminuser${num}`,
        password: `adminuser@libmalan.com`,
        first_name: `Admin{num}`,
        last_name: 'User',
    };
}
function moderatorUserParams() {
    const num = exports.randomStr();
    return {
        email: `moderatoruser${num}@libmalan.com`,
        username: `moderatoruser${num}`,
        password: `moderatoruser@libmalan.com`,
        first_name: `Moderator{num}`,
        last_name: 'User',
    };
}
function regularUserParams() {
    const num = exports.randomStr();
    return {
        email: `regularuser${num}@libmalan.com`,
        username: `regularuser${num}`,
        password: `regularuser@libmalan.com`,
        first_name: `Regular${num}`,
        last_name: 'User',
    };
}
exports.randomStr = () => Math.random().toString().replace(/\./g, "");
exports.randomUsername = () => `test${exports.randomStr()}`;
function adminAccount() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!admin_account) {
            admin_account = (yield users.createUser(test_config_1.base, adminUserParams())).data;
            return admin_account;
        }
        else {
            return admin_account;
        }
    });
}
exports.adminAccount = adminAccount;
function moderatorAccount() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!moderator_account) {
            moderator_account = (yield users.createUser(test_config_1.base, moderatorUserParams())).data;
            return moderator_account;
        }
        else {
            return moderator_account;
        }
    });
}
exports.moderatorAccount = moderatorAccount;
function regularAccount() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!regular_account) {
            try {
                let ra = yield users.createUser(test_config_1.base, regularUserParams());
                ra = ra.data;
                //ra['session'] = (await sessions.login(base, ra.username, ra.password)).data
                const session = (yield sessions.login(test_config_1.base, ra.username, ra.password)).data;
                ra = (yield users.acceptTos(test_config_1.forSession(session), ra.id, true)).data;
                ra = (yield users.acceptPrivacyPolicy(test_config_1.forSession(session), ra.id, true)).data;
                ra['session'] = session;
                regular_account = ra;
                return regular_account;
            }
            catch (e) {
                console.log('CAUGHT THE ERROR');
                console.dir(e);
                return e.response;
            }
        }
        else {
            //console.log('--- Using cached regular_account ---')
            return regular_account;
        }
    });
}
exports.regularAccount = regularAccount;
exports.uuidRegex = /[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{10}/;
function testUser() {
}
exports.testUser = testUser;
function testSession(user) {
}
exports.testSession = testSession;
