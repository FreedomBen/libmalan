"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptPrivacyPolicy = exports.acceptTos = exports.updateUser = exports.createUser = exports.whoamiFull = exports.whoami = exports.getUserByUsername = exports.getUser = void 0;
const superagent = require('superagent');
const utils_1 = require("./utils");
function createUser(c, params) {
    return superagent
        .post(utils_1.fullUrl(c, "/api/users"))
        .send({ user: params })
        .then(resp => (Object.assign(Object.assign({}, resp), { data: Object.assign({}, resp.body.data), ok: true })));
    //.catch(err => ({ ...err, ok: false }))
}
exports.createUser = createUser;
function getUserByUsername(c, username) {
    return superagent
        .get(utils_1.fullUrl(c, `/api/users/${username}`))
        .set('Authorization', `Bearer ${c.api_token}`)
        .then(resp => (Object.assign(Object.assign({}, resp), { data: Object.assign({}, resp.body.data), ok: true })));
    //.catch(err => ({ ...err, ok: false }))
}
exports.getUserByUsername = getUserByUsername;
function getUser(c, id) {
    return superagent
        .get(utils_1.fullUrl(c, `/api/users/${id}`))
        .set('Authorization', `Bearer ${c.api_token}`)
        .then(resp => (Object.assign(Object.assign({}, resp), { data: Object.assign({}, resp.body.data), ok: true })));
    //.catch(err => ({ ...err, ok: false }))
}
exports.getUser = getUser;
function whoamiFull(c) {
    return superagent
        .get(utils_1.fullUrl(c, `/api/users/me`))
        .set('Authorization', `Bearer ${c.api_token}`)
        .then(resp => (Object.assign(Object.assign({}, resp), { data: Object.assign({}, resp.body.data), ok: true })));
    //.catch(err => ({ ...err, ok: false }))
}
exports.whoamiFull = whoamiFull;
function whoami(c) {
    return superagent
        .get(utils_1.fullUrl(c, `/api/users/whoami`))
        .set('Authorization', `Bearer ${c.api_token}`)
        .then(resp => (Object.assign(Object.assign({}, resp), { data: Object.assign({}, resp.body.data), ok: true })));
    //.catch(err => ({ ...err, ok: false }))
}
exports.whoami = whoami;
function updateUser(c, id, params) {
    return superagent
        .put(utils_1.fullUrl(c, `/api/users/${id}`))
        .send({ user: params })
        .set('Authorization', `Bearer ${c.api_token}`)
        .then(resp => (Object.assign(Object.assign({}, resp), { data: Object.assign({}, resp.body.data), ok: true })));
    //.catch(err => ({ ...err, ok: false }))
}
exports.updateUser = updateUser;
function adminUpdateUser(c, id, params) {
    return superagent
        .put(utils_1.fullUrl(c, `/api/admin/users/${id}`))
        .send({ user: params })
        .set('Authorization', `Bearer ${c.api_token}`)
        .then(resp => (Object.assign(Object.assign({}, resp), { data: Object.assign({}, resp.body.data), ok: true })));
    //.catch(err => ({ ...err, ok: false }))
}
function acceptTos(c, id, accept) {
    return superagent
        .put(utils_1.fullUrl(c, `/api/users/${id}`))
        .send({ user: { accept_tos: accept } })
        .set('Authorization', `Bearer ${c.api_token}`)
        .then(resp => (Object.assign(Object.assign({}, resp), { data: Object.assign({}, resp.body.data), ok: true })));
    //.catch(err => ({ ...err, ok: false }))
}
exports.acceptTos = acceptTos;
function acceptPrivacyPolicy(c, id, accept) {
    return superagent
        .put(utils_1.fullUrl(c, `/api/users/${id}`))
        .send({ user: { accept_privacy_policy: accept } })
        .set('Authorization', `Bearer ${c.api_token}`)
        .then(resp => (Object.assign(Object.assign({}, resp), { data: Object.assign({}, resp.body.data), ok: true })));
    //.catch(err => ({ ...err, ok: false }))
}
exports.acceptPrivacyPolicy = acceptPrivacyPolicy;
