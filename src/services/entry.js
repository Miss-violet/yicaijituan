import request from '../utils/request';
import { api } from '../utils/api';

const { entry } = api;

export async function outboundList(params) {
  return request(entry.list, {
    method: 'POST',
    body: params,
  });
}

export async function create(params) {
  return request(entry.create, {
    method: 'POST',
    body: params,
  });
}
export async function update(params) {
  return request(entry.update, {
    method: 'POST',
    body: params,
  });
}
export async function status(params) {
  return request(`/api/warehouse/status/${params.id}/${params.status}`, {
    method: 'POST',
    body: params,
  });
}
export async function info(id) {
  return request(`/api/warehouse/info/${id}`, {
    method: 'POST',
  });
}
