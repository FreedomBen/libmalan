"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSession = exports.isValid = exports.logout = exports.login = void 0;
const superagent = require('superagent');
const utils_1 = require("./utils");
function login(c, username, password) {
    return superagent
        .post(utils_1.fullUrl(c, "/api/sessions"))
        .send({ session: { username, password } })
        .then(resp => (Object.assign(Object.assign(Object.assign({}, resp), { data: resp.body.data }), resp.body.data)));
}
exports.login = login;
function logout(c, user_id, session_id) {
    return superagent
        .del(utils_1.fullUrl(c, `/api/users/${user_id}/sessions/${session_id}`))
        .set('Authorization', `Bearer ${c.api_token}`)
        .then(resp => (Object.assign(Object.assign(Object.assign({}, resp), { data: resp.body.data }), resp.body.data)));
}
exports.logout = logout;
function getSession(c, user_id, session_id) {
    return superagent
        .get(utils_1.fullUrl(c, `/api/users/${user_id}/sessions/${session_id}`))
        .set('Authorization', `Bearer ${c.api_token}`)
        .then(resp => (Object.assign(Object.assign(Object.assign({}, resp), { data: resp.body.data }), resp.body.data)));
}
exports.getSession = getSession;
function isValid(c, user_id, session_id) {
    return getSession(c, user_id, session_id)
        .then(resp => resp.data.is_valid);
}
exports.isValid = isValid;
