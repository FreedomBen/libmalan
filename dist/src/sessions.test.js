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
const sessions = require("./sessions");
const test_config_1 = require("../test/test_config");
describe('#login', () => {
    it('Returns a new API token', () => __awaiter(void 0, void 0, void 0, function* () {
        const newSession = yield sessions.login(test_config_1.base, "ben", "password10");
        expect(newSession.api_token).toMatch(/[a-zA-Z0-9]{60}/);
    }));
});
describe('#logout', () => {
    it('Returns session as invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const newSession = yield sessions.login(test_config_1.base, "ben", "password10");
        expect(newSession.api_token).toMatch(/[a-zA-Z0-9]{60}/);
        const updated = yield sessions.logout(test_config_1.forSession(newSession), newSession.user_id, newSession.id);
        expect(updated.is_valid).toEqual(false);
    }));
});
describe('#getSession', () => {
    it('Returns session', () => __awaiter(void 0, void 0, void 0, function* () {
        const newSession = yield sessions.login(test_config_1.base, "ben", "password10");
        expect(newSession.api_token).toMatch(/[a-zA-Z0-9]{60}/);
        const updated = yield sessions.getSession(test_config_1.forSession(newSession), newSession.user_id, newSession.id);
        expect(updated.id).toEqual(newSession.id);
        expect(updated.is_valid).toEqual(true);
    }));
});
describe('#isValid', () => {
    it('Returns session', () => __awaiter(void 0, void 0, void 0, function* () {
        const newSession = yield sessions.login(test_config_1.base, "ben", "password10");
        expect(newSession.api_token).toMatch(/[a-zA-Z0-9]{60}/);
        expect(yield sessions.isValid(test_config_1.forSession(newSession), newSession.user_id, newSession.id)).toEqual(true);
        const updated = yield sessions.logout(test_config_1.forSession(newSession), newSession.user_id, newSession.id);
        const secondSession = yield sessions.login(test_config_1.base, "ben", "password10");
        expect(yield sessions.isValid(test_config_1.forSession(secondSession), newSession.user_id, newSession.id)).toEqual(false);
    }));
});
