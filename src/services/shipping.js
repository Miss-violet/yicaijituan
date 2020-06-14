import request from '../utils/request';
import { api } from '../utils/api';

const { shipping } = api;

export async function shippingList(params) {
  return request(shipping.list, {
    method: 'POST',
    body: params,
  });
}

export async function create(params) {
  return request(shipping.create, {
    method: 'POST',
    body: params,
  });
}
export async function update(params) {
  return request(shipping.update, {
    method: 'POST',
    body: params,
  });
}

export async function info(id) {
  return request(`${shipping.info}/${id}`, {
    method: 'POST',
  });
}

// 删除
export async function del(params) {
  return request(`${shipping.del}/${params.id}`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
