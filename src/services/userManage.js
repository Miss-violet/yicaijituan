import request from '../utils/request';
import { api } from '../utils/api';

const { userManage } = api;

export async function create(params) {
  return request(userManage.create, {
    method: 'POST',
    body: params,
  });
}
export async function update(params) {
  return request(userManage.update, {
    method: 'POST',
    body: params,
  });
}
export async function userList(params) {
  return request(userManage.list, {
    method: 'POST',
    body: params,
  });
}
export async function vaildateLoginName(params) {
  return request(userManage.vaildateLoginName, {
    method: 'POST',
    body: params,
  });
}
