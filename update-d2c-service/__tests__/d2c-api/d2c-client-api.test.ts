import { createD2cError } from '../../src/d2c-api/d2c-client-api';
import { AxiosError } from 'axios';
// @ts-ignore
import nock from 'nock';
import { createD2cApiWithAuth } from '../../src/d2c-api/create-d2c-api-with-auth';

const d2cBaseApiUrl = 'https://api.rollun.net';
describe('Test d2c-api/d2c-client-api module', () => {
  describe('Test fetchUpdateServiceWebhook function', () => {
    const serviceName = 'test';
    const serviceId = 'testIdService';
    const hookId = 'testIdHook';

    const setupClientTest = async () => {
      nock(d2cBaseApiUrl)
        .post('/login')
        .reply(200, { member: { token: 'test' } });
      nock(d2cBaseApiUrl)
        .get('/v1/acc/entities')
        .reply(200, {
          result: { services: [{ name: serviceName, id: serviceId }] },
        });

      return createD2cApiWithAuth({
        email: 'test',
        password: 'test1',
        d2cBaseApiUrl,
      });
    };

    test('if throws error that service does not exist', async () => {
      const client = await setupClientTest();
      const unexcitingServiceName = 'test1';

      const createError = async () => {
        await client.updateServiceByServiceName(unexcitingServiceName, 'some');
      };

      await expect(createError).rejects.toThrow(
        new Error(
          `Cannot find service - [${unexcitingServiceName}]. This service does not exist.`,
        ),
      );
    });
    test('if throws error that hook does not exist', async () => {
      const client = await setupClientTest();
      nock(d2cBaseApiUrl)
        .get(`/v1/service/${serviceId}/hook`)
        .query({ generate: false })
        .reply(200, { result: null });

      const createError = async () => {
        await client.updateServiceByServiceName(serviceName, 'some');
      };

      await expect(createError).rejects.toThrow(
        new Error(
          `Could not find hook id by service - [${serviceName}] with id - [${serviceId}]`,
        ),
      );
    });
    test('if updateService returns correct status', async () => {
      const client = await setupClientTest();
      nock(d2cBaseApiUrl)
        .get(`/v1/service/${serviceId}/hook`)
        .query({ generate: false })
        .reply(200, { result: hookId });
      nock(d2cBaseApiUrl)
        .get(`/hook/service/${hookId}?actions=some`)
        .reply(200);
      const status = await client.updateServiceByServiceName(
        serviceName,
        'some',
      );

      expect(status).toEqual(200);
    });
    test('if updateService throws error if non 2xx status is returned', async () => {
      const client = await setupClientTest();
      nock(d2cBaseApiUrl).get(`/v1/service/${serviceId}/hook`).reply(500);
      const createError = async () => {
        await client.updateServiceByServiceName(serviceName, 'some');
      };

      expect(createError).rejects.toThrow();
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
