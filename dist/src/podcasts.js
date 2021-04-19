"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePodcast = exports.updatePodcast = exports.createPodcast = exports.getPodcast = void 0;
const superagent = require('superagent');
const utils_1 = require("./utils");
function createPodcast(c, params) {
    return superagent
        .post(utils_1.fullUrl(c, "/api/podcasts"))
        .set('Authorization', `Bearer ${c.api_token}`)
        .send({ podcast: params })
        .then(resp => (Object.assign(Object.assign({}, resp), { data: Object.assign({}, resp.body.data), ok: true })));
    //.catch(err => ({ ...err, ok: false }))
}
exports.createPodcast = createPodcast;
function getPodcast(c, id) {
    return superagent
        .get(utils_1.fullUrl(c, `/api/podcasts/${id}`))
        .set('Authorization', `Bearer ${c.api_token}`)
        .then(resp => (Object.assign(Object.assign({}, resp), { data: Object.assign({}, resp.body.data), ok: true })));
    //.catch(err => ({ ...err, ok: false }))
}
exports.getPodcast = getPodcast;
function updatePodcast(c, id, params) {
    return superagent
        .put(utils_1.fullUrl(c, `/api/podcasts/${id}`))
        .set('Authorization', `Bearer ${c.api_token}`)
        .send({ podcast: params })
        .then(resp => (Object.assign(Object.assign({}, resp), { data: Object.assign({}, resp.body.data), ok: true })));
    //.catch(err => ({ ...err, ok: false }))
}
exports.updatePodcast = updatePodcast;
function deletePodcast(c, id) {
    return superagent
        .del(utils_1.fullUrl(c, `/api/podcasts/${id}`))
        .set('Authorization', `Bearer ${c.api_token}`)
        .then(resp => (Object.assign(Object.assign({}, resp), { data: Object.assign({}, resp.body.data), ok: true })));
    //.catch(err => ({ ...err, ok: false }))
}
exports.deletePodcast = deletePodcast;
