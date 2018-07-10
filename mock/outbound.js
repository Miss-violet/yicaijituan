const Mock = require('mockjs')
const api = require('../utils/api')

const { outbound } = api

let deliveryListData = Mock.mock({
    "currentPage": 0,
    "pageSize": 0,
    "rows": [
        {
            "auditor": "string",
            "batchNo": "string",
            "carNo": "string",
            "checker": "string",
            "createBy": "string",
            "createTime": "2018-06-19T01:33:57.701Z",
            "deliveryNo": "string",
            "deliveryTime": "2018-06-19T01:33:57.701Z",
            "distributorId": 0,
            "distributorName": "string",
            "grossWeight": 0,
            "id": 0,
            "level": "ONE",
            "modifyBy": "string",
            "modifyTime": "2018-06-19T01:33:57.701Z",
            "netWeight": 0,
            "productId": 0,
            "productName": "string",
            "qrcodeUrl": "string",
            "remark": "string",
            "status": "EFFECTIVE",
            "supplierId": 0,
            "supplierName": "string",
            "tareWeight": 0,
            "techno": "SORTING",
        },
    ],
    "total": 0,
    "totalPage": 0,
})

module.exports = {
    [`POST ${outbound.list}`](req, res) {
        return {
            data: deliveryListData.rows,
        }
    },
}