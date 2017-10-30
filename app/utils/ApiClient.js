// @flow
import _ from 'lodash';
import invariant from 'invariant';
import stores from 'stores';

type Options = {
  baseUrl?: string,
};

class ApiClient {
  baseUrl: string;
  userAgent: string;

  constructor(options: Options = {}) {
    this.baseUrl = options.baseUrl || '/api';
    this.userAgent = 'AtlasFrontend';
  }

  fetch = (
    path: string,
    method: string,
    data: ?Object,
    options: Object = {}
  ) => {
    let body;
    let modifiedPath;

    if (method === 'GET') {
      if (data) {
        modifiedPath = `${path}?${data && this.constructQueryString(data)}`;
      } else {
        modifiedPath = path;
      }
    } else if (method === 'POST' || method === 'PUT') {
      body = JSON.stringify(data);
    }

    // Construct headers
    const headers = new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    if (stores.auth.authenticated) {
      invariant(stores.auth.token, 'JWT token not set properly');
      headers.set('Authorization', `Bearer ${stores.auth.token}`);
    }

    // Construct request
    // $FlowFixMe don't care much about this right now
    const request = fetch(this.baseUrl + (modifiedPath || path), {
      method,
      body,
      headers,
      redirect: 'follow',
      credentials: 'include',
    });

    // Handle request promises and return a new promise
    return new Promise((resolve, reject) => {
      request
        .then(response => {
          // Handle successful responses
          if (response.status >= 200 && response.status < 300) {
            return response;
          }

          // Handle 401, log out user
          if (response.status === 401) {
            stores.auth.logout();
            window.location = '/';
            return;
          }

          // Handle failed responses
          const error = {};
          error.statusCode = response.status;
          error.response = response;
          throw error;
        })
        .then(response => {
          return response && response.json();
        })
        .then(json => {
          resolve(json);
        })
        .catch(error => {
          error.response.json().then(json => {
            error.data = json;
            reject(error);
          });
        });
    });
  };

  get = (path: string, data: ?Object, options?: Object) => {
    return this.fetch(path, 'GET', data, options);
  };

  post = (path: string, data: ?Object, options?: Object) => {
    return this.fetch(path, 'POST', data, options);
  };

  // Helpers
  constructQueryString = (data: Object) => {
    return _.map(data, (v, k) => {
      return `${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
    }).join('&');
  };
}

export default ApiClient;

// In case you don't want to always initiate, just import with `import { client } ...`
export const client = new ApiClient();
