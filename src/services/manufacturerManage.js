import request from '../utils/request';
import { api } from '../utils/api';

const { manufacturerManage } = api;

export async function create(params) {
    return request(manufacturerManage.create, {
        method: 'POST',
        body: params,
    });
}
export async function update(params) {
    return request(manufacturerManage.update, {
        method: 'POST',
        body: params,
    });
}
// export async function del(id) {
//     return request(`/api/mft/delete/${id}`, {
//         method: 'GET',
//         body: {
//             id,
//             method: 'get',
//         },
//     });
// }
export async function del(id) {
    return request(`/api/mft/delete/${id}`, {
        method: 'POST',
        body: id,
    });
}
export async function manufacturerList(params) {
    return request(manufacturerManage.list, {
        method: 'POST',
        body: params,
    });
}