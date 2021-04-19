"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEpisode = exports.updateEpisode = exports.createEpisode = exports.getEpisode = void 0;
const superagent = require('superagent');
const utils_1 = require("./utils");
function createEpisode(c, podcast_id, params) {
    return superagent
        .post(utils_1.fullUrl(c, `/api/podcasts/${podcast_id}/episodes`))
        .send({ episode: params })
        .set('Authorization', `Bearer ${c.api_token}`)
        .then(resp => (Object.assign(Object.assign({}, resp), { data: Object.assign({}, resp.body.data), ok: true })));
    //.catch(err => ({ ...err, ok: false }))
}
exports.createEpisode = createEpisode;
function getEpisode(c, podcast_id, id) {
    return superagent
        .get(utils_1.fullUrl(c, `/api/podcasts/${podcast_id}/episodes/${id}`))
        .set('Authorization', `Bearer ${c.api_token}`)
        .then(resp => (Object.assign(Object.assign({}, resp), { data: Object.assign({}, resp.body.data), ok: true })));
    //.catch(err => ({ ...err, ok: false }))
}
exports.getEpisode = getEpisode;
function updateEpisode(c, podcast_id, id, params) {
    return superagent
        .put(utils_1.fullUrl(c, `/api/podcasts/${podcast_id}/episodes/${id}`))
        .send({ episode: params })
        .set('Authorization', `Bearer ${c.api_token}`)
        .then(resp => (Object.assign(Object.assign({}, resp), { data: Object.assign({}, resp.body.data), ok: true })));
    //.catch(err => ({ ...err, ok: false }))
}
exports.updateEpisode = updateEpisode;
function deleteEpisode(c, podcast_id, id) {
    return superagent
        .del(utils_1.fullUrl(c, `/api/podcasts/${podcast_id}/episodes/${id}`))
        .set('Authorization', `Bearer ${c.api_token}`)
        .then(resp => (Object.assign(Object.assign({}, resp), { data: Object.assign({}, resp.body.data), ok: true })));
    //.catch(err => ({ ...err, ok: false }))
}
exports.deleteEpisode = deleteEpisode;
