import { D2cApiClient } from '../../src/d2c-api/d2c-client-api';
// @ts-ignore
import nock from 'nock';
import { createD2cApiWithAuth } from '../../src/d2c-api/create-d2c-api-with-auth';

describe('Test d2c-api/create-d2c-api-with-auth module', () => {
  describe('Test createD2cApiWithAuth function', () => {
    test('if createD2cApiWithAuth throws error when could not fetch token', async () => {
      nock(D2cApiClient.baseUrl).post('/login').reply(500, 'Unexpected error');

      const createApi = async () => {
        await createD2cApiWithAuth('hi', 'hi1');
      };

      expect(createApi).rejects.toThrowError();
    });
    test('if creates D2cApiClient', async () => {
      nock(D2cApiClient.baseUrl)
        .post('/login')
        .reply(200, { member: { token: 'HIII' } });

      const api = await createD2cApiWithAuth('hi', 'hi1');
      expect(api).toBeInstanceOf(D2cApiClient);
    });
  });
});
