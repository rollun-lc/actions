import { D2cApiClient } from '../../src/d2c-api/d2c-client-api';
// @ts-ignore
import nock from 'nock';
import { createD2cApiWithAuth } from '../../src/d2c-api/create-d2c-api-with-auth';

const d2cBaseApiUrl = 'https://api.rollun.net';
describe('Test d2c-api/create-d2c-api-with-auth module', () => {
  const createD2cApi = async () => {
    return createD2cApiWithAuth({
      email: 'hi',
      password: 'hi1',
      d2cBaseApiUrl,
    });
  };

  describe('Test createD2cApiWithAuth function', () => {
    test('if createD2cApiWithAuth throws error when could not fetch token', async () => {
      nock(d2cBaseApiUrl).post('/login').reply(500, 'Unexpected error');

      const createApi = async () => {
        await createD2cApi();
      };

      expect(createApi).rejects.toThrowError();
    });
    test('if creates D2cApiClient', async () => {
      nock(d2cBaseApiUrl)
        .post('/login')
        .reply(200, { member: { token: 'HIII' } });

      const api = await createD2cApi();
      expect(api).toBeInstanceOf(D2cApiClient);
    });
  });
});
