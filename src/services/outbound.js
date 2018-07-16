import request from '../utils/request';
import { api } from '../utils/api';

const { outbound } = api;

export async function outboundList(params) {
  return request(outbound.list, {
    method: 'POST',
    body: params,
  });
}

export async function create(params) {
  return request(outbound.create, {
    method: 'POST',
    body: params,
  });
}
export async function update(params) {
  return request(outbound.update, {
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
//     return request(outbound.cars, {
//         method: 'GET',
//         body: params,
//     })
// }
export async function cars(params) {
  return request(outbound.cars, {
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
  return request(outbound.statistics, {
    method: 'POST',
    body: params,
  });
}
