import request from '../utils/request';
import { api } from '../utils/api';

const { tenantManage } = api;

export async function create(params) {
  return request(tenantManage.create, {
    method: 'POST',
    body: params,
  });
}
export async function update(params) {
  return request(tenantManage.update, {
    method: 'POST',
    body: params,
  });
}
export async function del(id) {
  return request(`/api/mft/delete/${id}`, {
    method: 'POST',
    body: id,
  });
}
export async function tenantList(params) {
  return request(tenantManage.list, {
    method: 'POST',
    body: params,
  });
}
export async function validateTenantCode(params) {
  return request(tenantManage.validateTenantCode, {
    method: 'POST',
    body: params,
  });
}
