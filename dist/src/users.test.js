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
const users = require("./users");
const test_config_1 = require("../test/test_config");
const test_helpers_1 = require("../test/test_helpers");
describe('#getUser', () => {
    it('Gets a user by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const ra = yield test_helpers_1.regularAccount();
        const user = yield users.getUser(test_config_1.forSession(ra.session), ra.id);
        expect(user.data.id).toEqual(ra.id);
    }));
});
describe('#whoamiFull', () => {
    it('Gets a user by API token', () => __awaiter(void 0, void 0, void 0, function* () {
        const ra = yield test_helpers_1.regularAccount();
        const user = yield users.whoamiFull(test_config_1.forSession(ra.session));
        expect(user.data.id).toEqual(ra.id);
    }));
});
describe('#whoami', () => {
    it('Gets an abbreviated user by API token', () => __awaiter(void 0, void 0, void 0, function* () {
        const ra = yield test_helpers_1.regularAccount();
        const user = yield users.whoami(test_config_1.forSession(ra.session));
        expect(user.data.user_id).toEqual(ra.id);
    }));
});
describe('#createUser', () => {
    it('Creates a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        const rando = test_helpers_1.randomUsername();
        const custom_attrs = {
            guid: "ABCDEFGHIJKLMNOP",
            age: 18,
            names: {
                first: "Edgar",
                last: "Poe",
            }
        };
        const userParams = {
            email: `${rando}@libmalan.com`,
            username: `${rando}`,
            password: `testuser@libmalan.com`,
            first_name: `Tester${rando}`,
            last_name: 'Buddy',
            custom_attrs: custom_attrs,
        };
        const newUser = yield users.createUser(test_config_1.base, userParams);
        expect(newUser.data.id).toMatch(test_helpers_1.uuidRegex);
        expect(newUser.data.email).toMatch(/@libmalan.com$/);
        expect(newUser.data.username).toMatch(/^test/);
        expect(newUser.data.last_name).toEqual('Buddy');
        expect(newUser.data.custom_attrs).toEqual(custom_attrs);
    }));
});
describe('#acceptTos', () => {
    it('Rejects and Accepts the Terms of Service', () => __awaiter(void 0, void 0, void 0, function* () {
        const ra = yield test_helpers_1.regularAccount();
        const origUser = yield users.getUser(test_config_1.forSession(ra.session), ra.id);
        expect(origUser.data.tos_accepted).toEqual(true);
        const rejectedUser = yield users.acceptTos(test_config_1.forSession(ra.session), ra.id, false);
        expect(rejectedUser.data.tos_accepted).toEqual(false);
        const acceptedUser = yield users.acceptTos(test_config_1.forSession(ra.session), ra.id, true);
        expect(acceptedUser.data.tos_accepted).toEqual(true);
    }));
});
describe('#acceptPrivacyPolicy', () => {
    it('Rejects and Accepts the Privacy Policy', () => __awaiter(void 0, void 0, void 0, function* () {
        const ra = yield test_helpers_1.regularAccount();
        const origUser = yield users.getUser(test_config_1.forSession(ra.session), ra.id);
        expect(origUser.data.privacy_policy_accepted).toEqual(true);
        const rejectedUser = yield users.acceptPrivacyPolicy(test_config_1.forSession(ra.session), ra.id, false);
        expect(rejectedUser.data.privacy_policy_accepted).toEqual(false);
        const acceptedUser = yield users.acceptPrivacyPolicy(test_config_1.forSession(ra.session), ra.id, true);
        expect(acceptedUser.data.privacy_policy_accepted).toEqual(true);
    }));
});
describe('#updateUser', () => {
    it('Accepts updates to the user', () => __awaiter(void 0, void 0, void 0, function* () {
        const ra = yield test_helpers_1.regularAccount();
        const custom_attrs = {
            guid: "ABCDEFGHIJKLMNOP",
            age: 18,
            names: {
                first: "Edgar",
                last: "Poe",
            }
        };
        const updateParams = {
            email: "fakeemail@example.com",
            nick_name: "new nickname",
            sex: "Female",
            gender: "Transgender Person",
            race: ["Black or African American"],
            ethnicity: "Hispanic or Latinx",
            birthday: "2017-03-24T01:09:08Z",
            weight: 145.8,
            height: 69.5,
            custom_attrs: custom_attrs,
        };
        const updatedUser = (yield users.updateUser(test_config_1.forSession(ra.session), ra.id, updateParams)).data;
        const retrievedUser = (yield users.getUser(test_config_1.forSession(ra.session), ra.id)).data;
        expect(updatedUser.tos_accepted).toEqual(true);
        expect(updatedUser.privacy_policy_accepted).toEqual(true);
        expect(updatedUser.email).toMatch(/regularuser[0-9]+@libmalan.com/);
        expect(updatedUser.nick_name).toEqual("new nickname");
        expect(updatedUser.sex).toEqual("Female");
        expect(updatedUser.gender).toEqual("Transgender Person");
        expect(updatedUser.race).toEqual(["Black or African American"]);
        expect(updatedUser.ethnicity).toEqual("Hispanic or Latinx");
        expect(updatedUser.birthday).toMatch(/^2017-03-24/);
        expect(updatedUser.weight).toEqual("145.8");
        expect(updatedUser.height).toEqual("69.5");
        expect(updatedUser.custom_attrs).toEqual(custom_attrs);
        expect(retrievedUser.tos_accepted).toEqual(true);
        expect(retrievedUser.privacy_policy_accepted).toEqual(true);
        expect(retrievedUser.email).toMatch(/regularuser[0-9]+@libmalan.com/);
        expect(retrievedUser.nick_name).toEqual("new nickname");
        expect(retrievedUser.sex).toEqual("Female");
        expect(retrievedUser.gender).toEqual("Transgender Person");
        expect(retrievedUser.race).toEqual(["Black or African American"]);
        expect(retrievedUser.ethnicity).toEqual("Hispanic or Latinx");
        expect(retrievedUser.birthday).toMatch(/^2017-03-24/);
        expect(retrievedUser.weight).toEqual("145.8");
        expect(retrievedUser.height).toEqual("69.5");
        expect(retrievedUser.custom_attrs).toEqual(custom_attrs);
    }));
});
describe('#adminUpdateUser', () => {
    it('Accepts updates to the user', () => __awaiter(void 0, void 0, void 0, function* () {
        const ra = yield test_helpers_1.regularAccount();
        const custom_attrs = {
            guid: "ABCDEFGHIJKLMNOP",
            age: 18,
            names: {
                first: "Edgar",
                last: "Poe",
            }
        };
        const updateParams = {
            username: "totallynewusername",
            email: "fakeemail@example.com",
            nick_name: "new nickname",
            sex: "Female",
            gender: "Transgender Person",
            race: ["Black or African American"],
            ethnicity: "Hispanic or Latinx",
            birthday: "2017-03-24T01:09:08Z",
            weight: 145.8,
            height: 69.5,
            custom_attrs: custom_attrs,
        };
        const updatedUser = (yield users.updateUser(test_config_1.forSession(ra.session), ra.id, updateParams)).data;
        const retrievedUser = (yield users.getUser(test_config_1.forSession(ra.session), ra.id)).data;
        expect(updatedUser.tos_accepted).toEqual(true);
        expect(updatedUser.privacy_policy_accepted).toEqual(true);
        expect(updatedUser.email).toMatch(/regularuser[0-9]+@libmalan.com/);
        expect(updatedUser.nick_name).toEqual("new nickname");
        expect(updatedUser.sex).toEqual("Female");
        expect(updatedUser.gender).toEqual("Transgender Person");
        expect(updatedUser.race).toEqual(["Black or African American"]);
        expect(updatedUser.ethnicity).toEqual("Hispanic or Latinx");
        expect(updatedUser.birthday).toMatch(/^2017-03-24/);
        expect(updatedUser.weight).toEqual("145.8");
        expect(updatedUser.height).toEqual("69.5");
        expect(updatedUser.custom_attrs).toEqual(custom_attrs);
        expect(retrievedUser.tos_accepted).toEqual(true);
        expect(retrievedUser.privacy_policy_accepted).toEqual(true);
        expect(retrievedUser.email).toMatch(/regularuser[0-9]+@libmalan.com/);
        expect(retrievedUser.nick_name).toEqual("new nickname");
        expect(retrievedUser.sex).toEqual("Female");
        expect(retrievedUser.gender).toEqual("Transgender Person");
        expect(retrievedUser.race).toEqual(["Black or African American"]);
        expect(retrievedUser.ethnicity).toEqual("Hispanic or Latinx");
        expect(retrievedUser.birthday).toMatch(/^2017-03-24/);
        expect(retrievedUser.weight).toEqual("145.8");
        expect(retrievedUser.height).toEqual("69.5");
        expect(retrievedUser.custom_attrs).toEqual(custom_attrs);
    }));
});
