"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateService = void 0;
const create_d2c_api_with_auth_1 = require("./d2c-api/create-d2c-api-with-auth");
const utils_1 = require("./utils");
const updateService = async ({ serviceName, email, commaSeparatedActions, password, d2cBaseApiUrl, }) => {
    (0, utils_1.validateActions)(commaSeparatedActions);
    const d2cApi = await (0, create_d2c_api_with_auth_1.createD2cApiWithAuth)({ email, password, d2cBaseApiUrl });
    await d2cApi.updateServiceByServiceName(serviceName, commaSeparatedActions);
};
exports.updateService = updateService;
