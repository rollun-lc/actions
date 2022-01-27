"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUpdateWebhookByServiceId = exports.findServiceByName = void 0;
const findServiceByName = (services, serviceName) => {
    return services.find(({ name }) => name === serviceName);
};
exports.findServiceByName = findServiceByName;
const createUpdateWebhookByServiceId = (hookId, actions) => {
    return `/hook/service/${hookId}?actions=${actions}`;
};
exports.createUpdateWebhookByServiceId = createUpdateWebhookByServiceId;
