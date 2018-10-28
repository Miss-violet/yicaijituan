
import request from '../utils/request';
import { api } from '../utils/api';

const { libraryManage } = api;

export async function create(params) {
    return request(libraryManage.create, {
        method: 'POST',
        body: params,
    });
}
export async function update(params) {
    return request(libraryManage.update, {
        method: 'POST',
        body: params,
    });
}
// export async function del(id) {
//     return request(`/api/entrepot/delete/${id}`, {
//         method: 'GET',
//         body: {
//             id,
//             method: 'get',
//         },
//     });
// }
export async function del(id) {
    return request(`/api/entrepot/delete/${id}`, {
        method: 'POST',
        body: id,
    });
}
export async function manufacturerList(params) {
    return request(libraryManage.list, {
        method: 'POST',
        body: params,
    });
}
export async function manufacturerListAll(params) {
    return request(libraryManage.listAll, {
        method: 'POST',
        body: params,
    });
}