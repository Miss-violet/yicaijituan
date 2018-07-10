import request from '../utils/request';
import { api } from '../utils/api';

const { companyManage } = api;

export async function create(params) {
    return request(companyManage.create, {
        method: 'POST',
        body: params,
    });
}
export async function update(params) {
    return request(companyManage.update, {
        method: 'POST',
        body: params,
    });
}
// export async function del(id) {
//     return request(`/api/company/delete/${id}`, {
//         method: 'GET',
//         body: {
//             id,
//             method: 'get',
//         },
//     });
// }
export async function del(id) {
    return request(`/api/company/delete/${id}`, {
        method: 'POST',
        body: id,
    });
}
export async function companyList(params) {
    return request(companyManage.list, {
        method: 'POST',
        body: params,
    });
}

export async function vaildateCompanyName(params) {
    return request(companyManage.vaildateCompanyName, {
        method: 'POST',
        body: params,
    });
}