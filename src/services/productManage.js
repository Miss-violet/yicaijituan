import request from '../utils/request';
import { api } from '../utils/api';

const { productManage } = api;

export async function create(params) {
    return request(productManage.create, {
        method: 'POST',
        body: params,
    });
}
export async function update(params) {
    return request(productManage.update, {
        method: 'POST',
        body: params,
    });
}
// export async function del(id) {
//     return request(`/api/product/delete/${id}`, {
//         method: 'GET',
//         body: {
//             id,
//             method: 'get',
//         },
//     });
// }
export async function del(id) {
    return request(`/api/product/delete/${id}`, {
        method: 'POST',
        body: id,
    });
}
export async function productList(params) {
    return request(productManage.list, {
        method: 'POST',
        body: params,
    });
}