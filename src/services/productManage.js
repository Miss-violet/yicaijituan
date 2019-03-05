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
export async function info(params) {
    return request(`/api/product/info/${params.productId}`, {
        method: 'POST',
        body: params.productId,
    });
}
export async function productList(params) {
    return request(productManage.list, {
        method: 'POST',
        body: params,
    });
}
export async function standardTitleCreate(params) {
    return request(productManage.standardTitleCreate, {
        method: 'POST',
        body: params,
    });
}
export async function standardTitleDelete(id) {
    return request(`/api/standardTitle/delete/${id}`, {
        method: 'POST',
        body: {
            id,
        },
    });
}
export async function standardTitleEdit(params) {
    return request(`/api/standardTitle/update`, {
        method: 'POST',
        body: params,
    });
}
export async function queryStandardTitleList(params) {
    return request(`/api/standardTitle/list/${params.productId}/${params.type}`, {
        method: 'POST',
        body: params,
    });
}
export async function standardParamsCreate(params) {
    return request(`/api/standardParams/create`, {
        method: 'POST',
        body: params,
    })
}
export async function standardParamsQuery(params) {
    return request(`/api/standardParams/list/${params.productId}`, {
        method: 'POST',
        body: params,
    })
}
