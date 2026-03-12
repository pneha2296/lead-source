import axios from 'axios';
import { LEADSOURCE_BASE_URL } from './url_helpers/leadsource';

// Create a separate axios instance for LeadSource API
const leadsourceAxios = axios.create({
  baseURL: LEADSOURCE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'env':'dev',
    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
  },
});

// Response interceptor — unwrap response.data
leadsourceAxios.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    let message;
    switch (error?.response?.status) {
      case 401:
        message = 'Unauthorized';
        break;
      case 500:
        message = 'Internal Server Error';
        break;
      case 404:
        message = 'Not Found';
        break;
      default:
        message = error;
    }
    return Promise.reject(message);
  },
);

/**
 * Set auth headers for LeadSource API
 */
export const setLeadSourceAuth = (sessionToken, userId) => {
  leadsourceAxios.defaults.headers.common['session-token'] = sessionToken;
  leadsourceAxios.defaults.headers.common['user-id'] = userId;
};

class LeadSourceAPIClient {
  get = (url, params) => {
    let paramKeys = [];

    if (params) {
      Object.keys(params).map((key) => {
        paramKeys.push(key + '=' + params[key]);
        return paramKeys;
      });

      const queryString = paramKeys.length ? paramKeys.join('&') : '';
      return leadsourceAxios.get(`${url}?${queryString}`);
    }

    return leadsourceAxios.get(url);
  };

  create = (url, data) => {
    return leadsourceAxios.post(url, data);
  };

  update = (url, data) => {
    return leadsourceAxios.put(url, data);
  };

  delete = (url, config) => {
    return leadsourceAxios.delete(url, { ...config });
  };
}

export { LeadSourceAPIClient };
