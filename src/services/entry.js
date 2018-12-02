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
// export async function status(params) {
//     return request(`/api/delivery/status/${params.id}/${params.status}`, {
//         method: 'GET',
//         body: {
//             id: params.id,
//             status: params.status,
//             method: 'get',
//         },
//     })
// }
export async function status(params) {
  return request(`/api/delivery/status/${params.id}/${params.status}`, {
    method: 'POST',
    body: params,
  });
}
// export async function info(id) {
//     return request(`/api/delivery/info/${id}`, {
//         method: 'GET',
//     });
// }
export async function info(id) {
  return request(`/api/delivery/info/${id}`, {
    method: 'POST',
  });
}

// export async function cars(params) {
//     return request(entry.cars, {
//         method: 'GET',
//         body: params,
//     })
// }
export async function cars(params) {
  return request(entry.cars, {
    method: 'POST',
    body: params,
  });
}

// export async function scanResult(id) {
//     return request(`/api/qrcode/delivery/${id}`, {
//         method: 'GET',
//         body: {
//             id,
//             method: 'get',
//         },
//     })
// }

export async function scanResult(id) {
  return request(`/api/qrcode/delivery/${id}`, {
    method: 'POST',
    body: id,
  });
}

export async function statistics(params) {
  return request(entry.statistics, {
    method: 'POST',
    body: params,
  });
}
