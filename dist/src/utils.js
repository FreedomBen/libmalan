"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fullUrl = void 0;
function fullUrl(config, path) {
    return config.host.toLowerCase().match(/^https?:\/\//)
        ? `${config.host}${path}`
        : `http://${config.host}${path}`;
}
exports.fullUrl = fullUrl;
