import { createD2cError, D2cApiClient } from '../../src/d2c-api/d2c-client-api';
import { AxiosError } from 'axios';
// @ts-ignore
import nock from 'nock';
import { createD2cApiWithAuth } from '../../src/d2c-api/create-d2c-api-with-auth';

describe('Test d2c-api/d2c-client-api module', () => {
  describe('Test fetchUpdateServiceWebhook function', () => {
    const serviceName = 'test';
    const serviceId = 'testIdService';
    const hookId = 'testIdHook';

    const setupClientTest = () => {
      nock(D2cApiClient.baseUrl)
        .post('/login')
        .reply(200, { member: { token: 'test' } });
      nock(D2cApiClient.baseUrl)
        .get('/v1/acc/entities')
        .reply(200, {
          result: { services: [{ name: serviceName, id: serviceId }] },
        });
    };

    test('if throws error that service does not exist', async () => {
      setupClientTest();
      const client = await createD2cApiWithAuth('test', 'test1');
      const unexcitingServiceName = 'test1';

      const createError = async () => {
        await client.fetchUpdateServiceWebhook(unexcitingServiceName, 'some');
      };

      await expect(createError).rejects.toThrow(
        new Error(
          `Cannot find service - [${unexcitingServiceName}]. This service does not exist.`,
        ),
      );
    });
    test('if throws error that hook does not exist', async () => {
      setupClientTest();
      nock(D2cApiClient.baseUrl)
        .get(`/v1/service/${serviceId}/hook`)
        .query({ generate: false })
        .reply(200, { result: null });
      const client = await createD2cApiWithAuth('test', 'test1');

      const createError = async () => {
        await client.fetchUpdateServiceWebhook(serviceName, 'some');
      };

      await expect(createError).rejects.toThrow(
        new Error(
          `Could not find hook id by service - [${serviceName}] with id - [${serviceId}]`,
        ),
      );
    });

    test('if returns correct webhook url', async () => {
      setupClientTest();
      nock(D2cApiClient.baseUrl)
        .get(`/v1/service/${serviceId}/hook`)
        .query({ generate: false })
        .reply(200, { result: hookId });
      const client = await createD2cApiWithAuth('test', 'test1');
      const webhook = await client.fetchUpdateServiceWebhook(
        serviceName,
        'some',
      );

      expect(webhook).toEqual(
        `${D2cApiClient.baseUrl}hook/service/${hookId}?actions=some`,
      );
    });
  });
  describe('Test createD2cError function', () => {
    test('throws error with correct format', () => {
      const error = {
        request: {
          path: '/test',
        },
        response: {
          status: '400',
          data: 'Bad request',
        },
      };
      const createError = () => {
        createD2cError(error as unknown as AxiosError);
      };

      expect(createError).toThrowError(
        new Error(
          `Request [${error.request?.path}] failed with status [${error.response?.status}].\n Response - [${error.response?.data}]`,
        ),
      );
    });
  });
});
