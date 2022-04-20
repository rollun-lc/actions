"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshNodeRedModule = void 0;
const node_red_api_1 = require("./node-red-api");
const refreshNodeRedModule = async ({ name, baseUrl, }) => {
    const nodeRedApi = new node_red_api_1.NodeRedApi({ baseUrl });
    await nodeRedApi.refreshModule(name);
};
exports.refreshNodeRedModule = refreshNodeRedModule;
