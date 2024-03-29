import Axios from 'axios';
import { stringify } from 'qs';
import * as core from '@actions/core';
import axiosRetry from 'axios-retry';

type NodeRedApiOpts = {
  baseUrl: string;
};

export class NodeRedApi {
  private readonly api;

  constructor({ baseUrl }: NodeRedApiOpts) {
    this.api = Axios.create({
      baseURL: baseUrl,
    });
    axiosRetry(this.api, {
      retries: 3,
      retryDelay: (retryCount) => {
        core.warning(`Retrying ${retryCount} update npm module in node-red`);
        return axiosRetry.exponentialDelay(retryCount);
      },
    });
  }

  public async refreshModule(name: string) {
    const { token, cookie } = await this.getCSRFToken();

    const body = stringify({
      module: name,
      _csrf: token,
    });

    try {
      await this.api.post('/add/node', body, {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          cookie: [`${cookie}`],
        },
      });
    } catch (err: any) {
      const status = err.response.status;
      const statusCodeToErrorMessage = {
        400: 'Node already at latest version',
        403: 'Access denied',
      };

      if (status in statusCodeToErrorMessage) {
        throw new Error(statusCodeToErrorMessage[status]);
      }

      throw new Error(err);
    }
  }

  private async getCSRFToken() {
    const { data, headers } = await this.api.get('/add/node');
    const [, token] = data.match(/_csrf.+"(.+)"/);

    return { token, cookie: headers['set-cookie'] };
  }
}
