"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUpdateWebhookByServiceId = exports.findServiceByName = void 0;
const d2c_client_api_1 = require("./d2c-client-api");
const findServiceByName = (services, serviceName) => {
    return services.find(({ name }) => name === serviceName);
};
exports.findServiceByName = findServiceByName;
const createUpdateWebhookByServiceId = (hookId, actions) => {
    return `${d2c_client_api_1.D2cApiClient.baseUrl}hook/service/${hookId}?actions=${actions}`;
};
exports.createUpdateWebhookByServiceId = createUpdateWebhookByServiceId;
