// import { stringify } from 'qs';
import request from '../utils/request';

export async function fakeAccountLogin(params) {
  return request('/api/loginSubmit', {
    method: 'POST',
    body: params,
  });
}

export async function fakeAccountLogout() {
  return request('/api/logout', {
    method: 'GET',
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}
