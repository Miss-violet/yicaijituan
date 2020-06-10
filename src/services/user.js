import request from '../utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/user/info', {
    method: 'POST',
  });
}

export async function queryShippingFlag(params) {
  return request(`/api/tenant/tenant/${params.tenantCode}`, {
    method: 'POST',
    body: params,
  })
}
