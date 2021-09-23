"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forSession = exports.base = void 0;
exports.base = {
    host: "0.0.0.0:4000",
    api_token: "",
};
exports.forSession = (session) => (Object.assign(Object.assign({}, exports.base), { api_token: session.api_token }));
